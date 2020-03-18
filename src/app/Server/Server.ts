import * as http from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { HTTP_CODES } from './Model';

export class Server {

    private authorizer: Authorizer;

    public constructor(authorizer: Authorizer = new Authorizer()) {
        this.authorizer = authorizer;
    }
    public createServer() {
        http.createServer(async (req, res) => {
            console.log('got request from ' + req.url)
            switch (req.url) {
                case '/login':
                    await this.handleLogin(req, res);
                    break;

                default:
                    break;
            }
            res.end();
        }).listen(8080);
        console.log('started server')
    }

    private async handleLogin(request: http.IncomingMessage, response: http.ServerResponse) {
        if (request.method !== 'POST') {
            response.statusCode = HTTP_CODES.NOT_fOUND;
            return;
        }
        const requestBody = await this.getRequestBody(request);

        const token = await this.authorizer.loginUser(requestBody.username, requestBody.password);
        if (token) {
            response.statusCode = HTTP_CODES.CREATED;
            response.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(token));
        }
        else {
            response.statusCode = HTTP_CODES.NOT_fOUND;
            response.write('wrong username or password');
        }
    }

    private async getRequestBody(request: http.IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            request.on('data', data => {
                body += data;
            });
            request.on('end', () => {
                resolve(JSON.parse(body));
            });
            request.on('error', error => {
                reject(error)
            })
        });
    }

}
