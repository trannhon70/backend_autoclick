
var status1="Hide your connection";
var status2 ="Ready to connect";
var connectTimeout=0;
var nextchange=0;
var lastRequest=0;
var reconnect = false;
var api_key="";
var _location ="";
var interval_obj;
var method = "1";
var myTimeOutvalue=0;
var interval_obj3;
var timeout = 0;
var vip = 0;
var proxy = "";
var count = 0;
var reconnectData = true;
interval_obj3 = setInterval(function(){

    if(vip != 1){
        if(timeout > 0){
            timeout = timeout-1;
        }
    }
    count = count + 1;
    if(count > 10){
        chrome.storage.sync.set({'proxy': proxy});
        chrome.storage.sync.set({'vip': vip});
        chrome.storage.sync.set({'timeout': timeout});
        count=0;
    }
    if(timeout < 30){
        if(reconnectData){
            changeIP();
        }
    }

}, 1000);

function saveDatas(data){
    console.log("saveDatas")
     chrome.storage.sync.get(['proxy','vip','timeout','reconnect'], function(data) {
            //Update popupElement1 and popupElement2 with loaded data
            proxy = data.proxy;
             console.log("proxy " + proxy)
            vip = parseInt(data.vip);
             console.log("vip " + vip)
            timeout = parseInt(data.timeout);
             console.log("timeout " + timeout);
            reconnectData = data.reconnect;
          });

}

function handleMessage(request, sender, sendResponse) {
  var popupMessage = request.popupMessage;
  if(request.type=='add-data'){
        saveDatas(data);
  }
  if(popupMessage=="getOld"){
	  var now= Math.round(new Date().getTime()/1000);
	  sendResponse({response: status1+"|"+status2,timeout:(lastRequest - now + connectTimeout), next_change:(lastRequest - now +nextchange)});
  }
  else if(popupMessage=="setNew"){
	  clearTimeout(interval_obj);
	  var disconnect  = request.disconnect;
	  
	  var data= request.popupData;
	  var dataArr= data.split("|");
	  status1 = dataArr[0];
	  status2 = dataArr[1];
	  connectTimeout = request.popupTimeout;
	 
	  
	  nextchange = request.popupNextchange;
	  reconnect = request.reconnect;
	  api_key = request.api_key;
	  _location= request._location;
	  method = request.method;
	  myTimeOutvalue = (connectTimeout-30)*1000;
	  if(method=="2"){
		  myTimeOutvalue = (connectTimeout-25)*1000;
		  
	  }
	  var proxyType2 = "fixed_servers";
	  if(disconnect){
			proxyType2 ="system";	
	  }
	  
	  if(request.proxy!=""){
		  var proxyArr= request.proxy.split(":");
		 
		  
		    var config = {
				mode: proxyType2,
				rules: {
					singleProxy: {
						scheme: "http",
						host: proxyArr[0],
						port: parseInt(proxyArr[1])
					},
					bypassList: ["wwproxy.com"]
				}
			};

			chrome.proxy.settings.set(
				{value: config, scope: 'regular'}, function() {});
		  if(reconnect){
			  interval_obj = setTimeout(function(){
				  changeIP();
				  
			  }, myTimeOutvalue);
			  
		  }
	  }
	  
	  lastRequest= Math.round(new Date().getTime()/1000);
	  sendResponse({response: "settingok"});
  }
  
}
function changeIP(){
	
	var theUrl= "https://wwproxy.com/api/client/proxy/available?key="+api_key+"&provinceId="+_location;
	if(method=="2"){theUrl= "https://wwproxy.com/api/client/proxy/current?key="+api_key;}
	getData(theUrl).then(data => {
		console.log(data);
		var json = data;
		if(json.status == "OK"){
		    var jdata = json.data;
			proxy= jdata.proxy;
		    vip = jdata.vip;
            next_change = 15;
           	var expDate = Date.parse(jdata.expiredTime);
           	var now = new Date();
           	timeout =  parseInt(Math.abs(expDate - now)/1000);
			requestOK = true;
			
		    status1="<a style='color:black'>Connected! "+proxy+"</a>";
		    status2 ="timeout: "+timeout+"s";
		    connectTimeout=timeout;
			nextchange=next_change;
			myTimeOutvalue = (connectTimeout-30)*1000;
			if(method=="2"){
			  myTimeOutvalue = (connectTimeout-25)*1000;
			  
			}
			
			lastRequest=Math.round(new Date().getTime()/1000);
			var proxyArr= proxy.split(":");
		 
		  
		    var config = {
				mode: "fixed_servers",
				rules: {
					singleProxy: {
						scheme: "http",
						host: proxyArr[0],
						port: parseInt(proxyArr[1])
					},
					bypassList: ["wwproxy.com"]
				}
			};

			chrome.proxy.settings.set(
				{value: config, scope: 'regular'}, function() {});
			if(reconnect){
			  interval_obj = setTimeout(function(){
				  changeIP();
				  
			  }, myTimeOutvalue);
			  
			}
			
		}
//		else{
//
//			error= json.description;
//			nextchange=15;
//			status1="<a style='color:red'>Connect fail!</a>";
//		    status2 =error;
//
//		}
	
	});
}

async function getData(url) {
    try {
        const response = await fetch(url);
        const resJson = await response.json();

        return resJson;
    } catch (error) {
        console.warn('getData error', error);
    }

    return null;
}



chrome.runtime.onMessage.addListener(handleMessage);

