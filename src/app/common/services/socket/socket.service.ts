import { Injectable } from '@angular/core';
import { filter, map, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SocketMessages } from './socket-messages.enum';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private messages = new Subject<{ type: SocketMessages; body: unknown }>();

  constructor() {
    this.socket = io('http://localhost:3000');
    this.listenToMessages();
  }

  listen<T>(type: SocketMessages) {
    return this.messages.asObservable().pipe(
      filter((message) => message.type === type),
      map((message) => message.body as T),
    );
  }

  // Method to send message to the server
  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  // Observable to receive messages from the server
  private listenToMessages(): void {
    this.socket.on(SocketMessages.WORK_ORDER_CREATED, (message) => {
      this.messages.next({ type: SocketMessages.WORK_ORDER_CREATED, body: message });
    });

    this.socket.on(SocketMessages.WORK_ORDER_UPDATED, (message) => {
      this.messages.next({ type: SocketMessages.WORK_ORDER_UPDATED, body: message });
    });

    this.socket.on(SocketMessages.WORK_ORDER_DELETED, (message) => {
      this.messages.next({ type: SocketMessages.WORK_ORDER_DELETED, body: message });
    });
  }
}
