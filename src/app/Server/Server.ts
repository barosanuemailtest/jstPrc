import { createServer, ServerResponse, IncomingMessage } from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { LoginHandler } from './LoginHandler';
import { UsersHandler } from './UsersHandler';
import { Utils } from './Utils';

/* istanbul ignore file */
export class Server {

    private authorizer: Authorizer;

    public constructor(authorizer: Authorizer = new Authorizer()) {
        this.authorizer = authorizer;
    }
    public createServer() {
        createServer(async (req, res) => {
            console.log('got request from ' + req.url)
            this.setCors(res);
            const basePath = Utils.getBasePath(req.url!);

            switch (basePath) {
                case 'login':
                    await new LoginHandler(req, res, this.authorizer).handleRequest();
                    break;
                case 'users':
                    await new UsersHandler(req, res, this.authorizer).handleRequest();
                default:
                    break;
            }
            res.end();
        }).listen(8080);
        console.log('started server')
    }

    private setCors(res: ServerResponse) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
    }
}
