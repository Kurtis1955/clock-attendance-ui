// services/socket.ts
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type MessageCallback = (data: any) => void;

class SocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private pendingSubscriptions: Map<string, MessageCallback> = new Map();


  connect(token: string, onConnected?: () => void) {
    if (this.client?.active) {
      console.log("Socket already connected.");
      return;
    }

    if (!token) {
      console.error("No access token provided.");
      return;
    }

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(
          `http://192.168.251.152:8031/api/v1/device-attendance-service/ws?token=${encodeURIComponent(
            token,
          )}`,
        ),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
      onConnect: () => {
        console.log("✅ STOMP Connected");
        this.pendingSubscriptions.forEach((callback, destination) => {
          this._doSubscribe(destination, callback);
        });
        this.pendingSubscriptions.clear();
        onConnected?.();
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP Error:", frame.headers["message"], frame.body);
      },
      onWebSocketClose: (event) => console.log("❌ Socket Closed", event),
      onWebSocketError: (error) => console.error("🚨 WebSocket Error:", error),
    });

    this.client.activate();
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.pendingSubscriptions.clear();
    this.client?.deactivate();
    this.client = null;
  }

  private _doSubscribe(destination: string, callback: MessageCallback) {
    if (this.subscriptions.has(destination)) return;

    const sub = this.client!.subscribe(destination, (message: IMessage) => {
      try {
        callback(JSON.parse(message.body));
      } catch {
        callback(message.body);
      }
    });

    this.subscriptions.set(destination, sub);
  }

  subscribe(destination: string, callback: MessageCallback) {
    if (!this.client?.active) {
      console.warn(
        `Client not connected yet — queuing subscription to ${destination}`,
      );
      this.pendingSubscriptions.set(destination, callback);
      return;
    }

    this._doSubscribe(destination, callback);
  }

  unsubscribe(destination: string) {
    this.subscriptions.get(destination)?.unsubscribe();
    this.subscriptions.delete(destination);
    this.pendingSubscriptions.delete(destination);
  }

  send(destination: string, body: unknown) {
    if (!this.client?.active) {
      console.warn("Cannot send — client not connected.");
      return;
    }
    this.client.publish({ destination, body: JSON.stringify(body) });
  }
}

export default new SocketService();
