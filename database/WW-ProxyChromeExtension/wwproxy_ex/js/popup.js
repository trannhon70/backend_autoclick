var timeout=0;
var vip = 0;
var next_change=0;
var interval_obj;
var proxy="";
var error="";
var requestOK=false;
var selected_index=0;
var interval_obj2;
var setWaitting = false;
var disconnect = false;
var count = 0;
interval_obj = setInterval(function(){
	next_change = next_change-1;
	count = count + 1;
    if(count > 10){
            sendSaveData();
            count=0;
    }

    if(next_change>0){
		document.querySelector("#connectButton").value="CONNECT("+next_change+")";
		document.querySelector("#connectButton").disabled = true;
	}else{
		next_change=0;
		document.querySelector("#connectButton").disabled = false;
		document.querySelector("#connectButton").value="CONNECT";
	}
    if(vip != 1){
        timeout = timeout-1;
        if(document.querySelector("#status2").innerHTML.includes("timeout: ")){
        	            if(timeout>0){
                			var timeoutString= timeout.toString();
                			document.querySelector("#status2").innerHTML ="timeout: "+timeoutString+"s";
                		}
                		else{
                			document.querySelector("#status1").innerHTML ="<a style='color:red'>Proxy die!</a>";
                			document.querySelector("#status2").innerHTML ="timeout: 0s";
                		}


        	}
    } else {
    	document.getElementById("#status2").hidden = true;
    }

	
}, 1000);
function saveOptions(e) {
	disconnect = false;
	clearTimeout(interval_obj2);
	document.querySelector("#connectButton").disabled = true;
	localStorage.setItem('api_key', document.querySelector("#api_key").value);
	localStorage.setItem('method', document.querySelector('input[name="method"]:checked').value);
	localStorage.setItem('reconnect', document.querySelector("#reconnect").checked);
	if(e!=null){
	    e.preventDefault();
	}

	//data tu sv
	requestOK = false;
    //timeout=0;
	next_change=0;
	//proxy=proxy;
	localStorage.setItem('proxy', proxy);
    error="";
    //vip=vip;
    localStorage.setItem('vip',vip.toString());

	apiRequest(document.querySelector("#api_key").value,selected_index);
	
}

function sendSaveData(e){
        chrome.storage.sync.set({'proxy': proxy});
        chrome.storage.sync.set({'vip': vip});
        chrome.storage.sync.set({'timeout': timeout});
        chrome.storage.sync.set({'reconnect': document.querySelector("#reconnect").checked});
        chrome.runtime.sendMessage({
            type: 'add-data',
            data: {timeout, proxy, vip}
        });
}

function updateLocations(newLoad){
	selected_index = localStorage.getItem('selected_index');
	if(selected_index==null){selected_index = 0;}
	if(selected_index==""){selected_index = 0;}
	var x = document.getElementById("mySelect");
 if(newLoad){
	 
	 var theUrl= "https://wwproxy.com/api/client/province";
		req2.open( "GET", theUrl ); // false for synchronous request
		req2.send( null );
 }else{
	 var location_data = localStorage.getItem('location_data');
	 if(location_data===null){
		 location_data='{"success":true,"data":[{"location":0,"name":"Random"}]}';
	 }
	 var json = JSON.parse(location_data);
		
		
		if(json.status == "OK"){
			var data= json.data;
			var i, L = x.options.length - 1;
		    for(i = L; i >= 0; i--) {
			  x.remove(i);
		    }
			for(var i=0; i<data.length;i++){
				var jsonItem = data[i];
				var location_id = jsonItem.id;
				var location_name = jsonItem.name;
				var location_item = location_id+"."+location_name;
				
				var option = document.createElement("option");
				option.text = location_item;
				option.value = location_id;
				x.add(option);
			}
		}else{
			
			var option = document.createElement("option");
				option.text = "0.Random";
				option.value =0;
				x.add(option);
			
		}
	 
	}
	x.value = selected_index;
	
}
function restoreOptions() {
       console.log("restoreOptions");
	 chrome.storage.sync.get(['proxy','vip','timeout','reconnect'], function(data) {
        //Update popupElement1 and popupElement2 with loaded data
        proxy = data.proxy;
        console.log("proxy " + proxy);
        vip = parseInt(data.vip);
        console.log(vip);
        timeout = parseInt(data.timeout);
      });


	document.querySelector("#api_key").value = localStorage.getItem('api_key');
//	proxy = localStorage.getItem('proxy');
//    vip = parseInt(localStorage.getItem('vip'));
//    timeout = parseInt(localStorage.getItem('timeout'));
	updateLocations(false);
	
	var methodValue = localStorage.getItem('method');
	if(methodValue===null){methodValue="1";}
	
	if(methodValue=="2"){
		document.querySelector("#old").checked=true;
	}else{
		document.querySelector("#new").checked=true;
	}
	var reconnectData =localStorage.getItem('reconnect');
	if(reconnectData===null){reconnectData=true;}
	document.querySelector("#reconnect").checked = reconnectData;

	var sending = chrome.runtime.sendMessage({
		popupMessage: "getOld"
	  },handleResponse);

}
function handleResponse(message) {
	var outRS = message.response;
	if(outRS=="settingok"){
		
	}else{
		var rsArr = outRS.split("|");
		document.querySelector("#status1").innerHTML=rsArr[0];
		document.querySelector("#status2").innerHTML=rsArr[1];
		next_change= message.next_change;
		timeout  = message.timeout;
		reloadGUI();
	}
  //console.log(`Message from the background script:  ${message.next_change}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}
function apiRequest(api_key, _location){
	var theUrl= "https://wwproxy.com/api/client/proxy/available?key="+api_key+"&provinceId="+_location;
	if(document.querySelector('input[name="method"]:checked').value=="2"){
		theUrl= "https://wwproxy.com/api/client/proxy/current?key="+api_key;
	}
	req.open( "GET", theUrl ); // false for synchronous request
    req.send( null );
}
document.querySelector("#reload").addEventListener("click", function(){
   updateLocations(true);
});
document.querySelector("#mySelect").addEventListener("change", function(){
	selected_index = document.querySelector("#mySelect").value;
	localStorage.setItem('selected_index',selected_index);
});
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#connectButton").addEventListener("click", saveOptions);
document.querySelector("#disconnect").addEventListener("click", function(){
	disconnect = true;
	proxy= "127.0.0.1:1080";
	next_change = next_change;
	timeout = 0;
	
	document.querySelector("#status1").innerHTML ="<a style='color:red'>Disconnected!</a>";
	document.querySelector("#status2").innerHTML ="Ready to connect!";
	var sending = chrome.runtime.sendMessage({
		popupMessage: "setNew",
		popupData: document.querySelector("#status1").innerHTML+"|"+document.querySelector("#status2").innerHTML,
		popupTimeout:timeout,
		popupNextchange:next_change,
		proxy:proxy,
		reconnect:false,
		disconnect:true,
		api_key:document.querySelector("#api_key").value,
		_location:selected_index,
		method:document.querySelector('input[name="method"]:checked').value,
		vip:vip
	  },handleResponse);
	
	clearTimeout(interval_obj2);
});

var req = new XMLHttpRequest();
req.onreadystatechange = function() {
    if (req.readyState === 4) {
        var response = req.responseText;
        var json = JSON.parse(response);
		
		if(json.status == "OK"){
        	var jdata = json.data;
			proxy= jdata.proxy;
            vip = jdata.vip;
			next_change = 15;
			var expDate = Date.parse(jdata.expiredTime);
			var now = new Date();
			timeout =  parseInt(Math.abs(expDate - now)/1000);
			requestOK = true;
			document.querySelector("#status1").innerHTML ="<a style='color:black'>Connected! "+proxy+"</a>";
			document.querySelector("#status2").innerHTML ="timeout: "+timeout+"s";
			reloadGUI();
			if(vip == 1){
			    saveOptions();
			}
			sendSaveData();

		}
		else{
			error= json.description.toString();
			next_change=15;
			document.querySelector("#status1").innerHTML ="<a style='color:red'>Connect fail!</a>";
			document.querySelector("#status2").innerHTML =error;
		}
		var sending = chrome.runtime.sendMessage({
			popupMessage: "setNew",
			popupData: document.querySelector("#status1").innerHTML+"|"+document.querySelector("#status2").innerHTML,
			popupTimeout:timeout,
			popupNextchange:next_change,
			proxy:proxy,
			reconnect:document.querySelector("#reconnect").checked,
			api_key:document.querySelector("#api_key").value,
			_location:selected_index,
			method:document.querySelector('input[name="method"]:checked').value,
			vip:vip
		  },handleResponse);
		
        console.log(json);
	}

	
};
function reloadGUI(){
	
	if(document.querySelector("#reconnect").checked && timeout >0 && !setWaitting && !disconnect ){
		setWaitting = true;
		
		  interval_obj2 = setTimeout(function(){
			 setWaitting = false;
			 restoreOptions();
			 console.log("reload option");
			  
		  }, (timeout-20)*1000);
			  
	}
	
}



var req2 = new XMLHttpRequest();
req2.onreadystatechange = function() {
    if (req2.readyState === 4) {
        var response = req2.responseText;
        var json = JSON.parse(response);
		var x = document.getElementById("mySelect");
		
		if(json.status == "OK"){
			var data= json.data;
			console.log(x.length);
			
			var i, L = x.options.length - 1;
		    for(i = L; i >= 0; i--) {
			  x.remove(i);
		    }
		    var option = document.createElement("option");
            				option.text = "0.Random";
            				option.value =0;
            				x.add(option);
			
			for(var i=0; i<data.length;i++){
				var jsonItem = data[i];
				var location_id = jsonItem.id;
				var location_name = jsonItem.name;
				var location_item = location_id+"."+location_name;
				
				var option = document.createElement("option");
				option.text = location_item;
				option.value = location_id;
				x.add(option);
				
			}
			localStorage.setItem('location_data',response);
			
			
		}else{
			
			var option = document.createElement("option");
				option.text = "0.Random";
				option.value = 0;
				x.add(option);
		}
		
        console.log(json);
		
			
	}

	
};

