import { Server } from './app/Server/Server';

/* istanbul ignore file */
export class Launcher {

    private server: Server;

    public constructor(server: Server = new Server()) {
        this.server = server;
    }

    public launchApp() {
        this.server.createServer();
    }

}

new Launcher().launchApp();