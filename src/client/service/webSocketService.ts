/*
------------------------------------------------------------
webSocketService.ts
Singleton gérant la connexion socket.io du client, l’identifiant utilisateur persistant et la diffusion des événements/commandes.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { io, Socket } from "socket.io-client"
import { getItem, setItem } from 'expo-secure-store'
import {randomUUID} from 'expo-crypto'
import { Command, RegisterData, SOCKET_EVENT } from "@/common/types";

export type CallbackFunc = (data: any) => void

export default class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socket: Socket | null = null;
  public userID: string | null = null
  private callbacks: Map<string, Set<CallbackFunc>> = new Map();


  private constructor () {
    let storedId : string = getItem('UserID')
    if (!storedId) {
      storedId = randomUUID()
      setItem('UserID', storedId)
    }
    this.userID = storedId;
  }

  public getSocket(): Socket {
    return this.socket
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): this {
    if (this.socket) {
      return this
    }

    // this.socket = io("http://192.168.2.12:3000", {// Fred's home
    // this.socket = io("http://10.0.2.2:3000", { // Pour émulateur localhost
    this.socket = io("wss://frederic-desrosiers.com", { // Pour production
      path: "/socket/",
      auth: {userId: this.userID},
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000, 
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });
    
    this.socket.on("connect", () => {
      console.log("Connecté au serveur avec le id : ", this.userID);
    });

    this.socket.on("disconnect", () => {
      console.log("Déconnecté du serveur");
      // this.executeCallback("disconnect", null);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Erreur de connexion :", err.message);
      // this.executeCallback("error", err);
    });

    // écoute générique pour tous les events
    this.socket.onAny((event, data) => {
      this.executeCallback(event, data);
    });

    return this;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket?.disconnect();
    }
  }

  public sendMessage(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public sendCommand(data: Command): void {
    if (this.socket) {
      this.socket.emit(SOCKET_EVENT.COMMAND, data)
    }
  }
  public register(data: RegisterData): void {
      if (this.socket) {
      this.socket.emit(SOCKET_EVENT.REGISTER, data)
    }
  }

  public addCallback(event: string, callback: CallbackFunc): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set())
    }
    this.callbacks.get(event).add(callback)
  }
  
  public removeCallback(event: string, callback: CallbackFunc): void {
    if (this.callbacks.has(event)) {
      const callbacks = this.callbacks.get(event)
      callbacks.delete(callback)
      if (callbacks.size == 0) {
        this.callbacks.delete(event)
      }
    }
  }
  
  private executeCallback(event: string, data: any): void {
    const cbs = this.callbacks.get(event)
    if (cbs) {
      cbs.forEach((cb) => {
        cb(data)
      })
    }
  }
}

export const serverConnexion = WebSocketService.getInstance()
