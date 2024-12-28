declare module 'json-server' {
    import { Application } from 'express';
    
    interface JsonServerOptions {
      static?: string;
      bodyParser?: boolean;
      noCors?: boolean;
      logger?: boolean;
    }
  
    function jsonServer(): Application;
    namespace jsonServer {
      function create(): Application;
      function defaults(options?: JsonServerOptions): Application;
      function router(source: string | object): Application;
    }
  
    export = jsonServer;
  }
  