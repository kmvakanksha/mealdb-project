import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/ws`
  : 'http://localhost:8080/ws';

/**
 * Connect to the Spring Boot STOMP WebSocket.
 * @param {(message: string) => void} onMessage  called on each broadcast
 * @returns STOMP client (call client.deactivate() to disconnect)
 */
export function connectWebSocket(onMessage) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe('/topic/favourites', (frame) => {
        onMessage(frame.body);
      });
    },
    onStompError: (frame) => {
      console.warn('STOMP error', frame);
    },
  });

  client.activate();
  return client;
}
