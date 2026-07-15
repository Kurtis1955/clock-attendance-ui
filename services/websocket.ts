// services/websocket.ts

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {
  private client: Client;
  private connected = false;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://192.168.251.152:8031/ws"),

      reconnectDelay: 5000,

      debug: (message) => {
        console.log("[STOMP]", message);
      },
    });

    this.client.onConnect = () => {
      this.connected = true;
      console.log("✅ Connected");
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      console.log("Disconnected");
    };

    this.client.onStompError = (frame) => {
      console.error(frame);
    };
  }

  connect(onConnected?: () => void) {
    this.client.onConnect = () => {
      console.log("✅ Connected");

      onConnected?.();
    };

    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }

  subscribe(destination: string, callback: (data: any) => void) {
    return this.client.subscribe(destination, (message) => {
      callback(JSON.parse(message.body));
    });
  }

  publish(destination: string, body: any) {
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }
}

export default new WebSocketService();
