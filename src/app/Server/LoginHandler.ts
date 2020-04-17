import { BaseRequestHandler } from './BaseRequestHandler';
import { HTTP_CODES } from './Model';

export class LoginHandler extends BaseRequestHandler {

    public async handleRequest(): Promise<void> {
        if (this.request.method !== 'POST') {
            this.response.statusCode = HTTP_CODES.NOT_fOUND;
            return;
        }
        const requestBody = await this.getRequestBody();

        const token = await this.authorizer.loginUser(requestBody.username, requestBody.password);
        if (token) {
            this.response.statusCode = HTTP_CODES.CREATED;
            this.response.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
            this.response.write(JSON.stringify(token));
        }
        else {
            this.response.statusCode = HTTP_CODES.NOT_fOUND;
            this.response.write('wrong username or password');
        }
    }

    private async getRequestBody(): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            this.request.on('data', (data: string) => {
                body += data;
            });
            this.request.on('end', () => {
                resolve(JSON.parse(body));
            });
            this.request.on('error', (error: any) => {
                reject(error)
            })
        });
    }

}