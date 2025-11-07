import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: InstanceType<typeof Server>; // ✅ KHẮC PHỤC LỖI 2709

  afterInit(server: InstanceType<typeof Server>) {
    console.log('✅ WebSocket server initialized');
  }

  handleConnection(client: any) {
    console.log('🟢 Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('🔴 Client disconnected:', client.id);
  }

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: any) {
    console.log('📩 Received message:', data);
    this.server.emit('receive_message', data);
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
