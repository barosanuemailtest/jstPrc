import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { LoginHandler } from './LoginHandler';

/* istanbul ignore file */
export class Server {

    private authorizer: Authorizer;

    public constructor(authorizer: Authorizer = new Authorizer()) {
        this.authorizer = authorizer;
    }
    public createServer() {
        createServer(async (req, res) => {
            console.log('got request from ' + req.url)
            switch (req.url) {
                case '/login':
                    await new LoginHandler(req, res, this.authorizer).handleRequest();
                    break;

                default:
                    break;
            }
            res.end();
        }).listen(8080);
        console.log('started server')
    }



}
