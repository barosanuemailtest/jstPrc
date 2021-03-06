import { BaseRequestHandler } from './BaseRequestHandler';
import { HTTP_CODES } from './Model';

export class LoginHandler extends BaseRequestHandler {

    public async handleRequest(): Promise<void> {
        try {
            if (this.request.method == 'OPTIONS') {
                this.response.writeHead(HTTP_CODES.OK);
                return;
            }
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
        } catch (error) {
            this.response.statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
            this.response.write('Internal error: ' + error.message);
        }
    }



}