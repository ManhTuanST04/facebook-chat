import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client: Client;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() {
    // Initialize the STOMP client
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/social-network-api/websocket'),
      debug: (str) => console.log(str), // Optional: Debug logs
      reconnectDelay: 5000, // Reconnect after 5 seconds if connection is lost
    });

    // Define the behavior on successful connection
    this.client.onConnect = () => {
      console.log('Connected to WebSocket');

      // Subscribe to a topic
      this.client.subscribe('/topic/messages', (message: Message) => {
        console.log('Received message: ', message.body);
        this.messageSubject.next(message.body); // Push received messages into Subject
      });
    };

    // Define the behavior on connection error
    this.client.onStompError = (frame) => {
      console.error('Broker error: ', frame.headers['message']);
    };
  }

  // Connect to WebSocket server
  connect(): void {
    this.client.activate();
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    this.client.deactivate();
  }

  // Get an observable for incoming messages
  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  // Send a message to a specific destination
  sendMessage(destination: string, body: any): void {
    if (this.client.active) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    }
  }
}
