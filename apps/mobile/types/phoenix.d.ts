declare module 'phoenix' {
  export class Socket {
    constructor(endPoint: string, opts?: any);
    connect(): void;
    disconnect(): void;
    channel(topic: string, chanParams?: any): Channel;
    onOpen(callback: () => void): void;
    onClose(callback: () => void): void;
    onError(callback: (error: any) => void): void;
  }

  export class Channel {
    join(): any;
    leave(): any;
    on(event: string, callback: (payload: any) => void): void;
    push(event: string, payload: any): any;
    receive(status: string, callback: (response: any) => void): any;
  }

  export class Presence {
    constructor(channel: Channel);
    onSync(callback: () => void): void;
    list(): any;
  }
}
