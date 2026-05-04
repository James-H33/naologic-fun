import { Injectable } from '@angular/core';
import { filter, map, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SocketMessages } from './socket-messages.enum';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private messages = new Subject<{ type: SocketMessages; body: unknown }>();
  private isConnected = false;

  init(credentials: { workspaceId: string; authToken: string }): void {
    if (this.isConnected) {
      return;
    }

    this.isConnected = true;

    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        'workspace-id': credentials.workspaceId,
        Authorization: `Bearer ${credentials.authToken}`,
      },
    });

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

  private listenToMessages(): void {
    this.socket.onAny((event, ...args) => {
      const body = args?.[0];

      switch (event) {
        case SocketMessages.WORK_ORDER_CREATED:
          this.messages.next({ type: SocketMessages.WORK_ORDER_CREATED, body });
          break;
        case SocketMessages.WORK_ORDER_UPDATED:
          this.messages.next({ type: SocketMessages.WORK_ORDER_UPDATED, body });
          break;
        case SocketMessages.WORK_ORDER_DELETED:
          this.messages.next({ type: SocketMessages.WORK_ORDER_DELETED, body });
          break;
      }
    });
  }
}
