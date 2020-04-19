import { IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { AccessRights, TokenState } from '../Authorization/Model';
import { OperationState, HTTP_CODES } from './Model';

export abstract class BaseRequestHandler {

    protected request: IncomingMessage;
    protected response: ServerResponse;
    protected authorizer: Authorizer;

    public constructor(request: IncomingMessage, response: ServerResponse, authorizer: Authorizer) {
        this.request = request;
        this.response = response;
        this.authorizer = authorizer;
    }

    abstract async handleRequest(): Promise<void>;

    protected async operationAuthorized(operation: AccessRights): Promise<OperationState> {
        const token = this.getToken();
        if (token) {
            const tokenRights = await this.authorizer.getTokenRights(token);
            if (tokenRights.accessRights.includes(operation)) {
                return { authorized: true, tokenState: tokenRights.state };
            } else {
                return { authorized: false, tokenState: tokenRights.state };
            }
        } else {
            return { authorized: false, tokenState: TokenState.INVALID };
        }
    }

    private getToken(): string | undefined {
        return this.request.headers.authorization;
    }

    protected respondObject(object: any, statusCode: HTTP_CODES) {
        this.response.writeHead(statusCode, { 'Content-Type': 'application/json' });
        this.response.write(JSON.stringify(object))
    }

    protected respondText(text: string, statusCode: HTTP_CODES) {
        this.response.writeHead(statusCode)
        this.response.write(text);
    }

    protected async getRequestBody(): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            this.request.on('data', (data: string) => {
                body += data;
            });
            this.request.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (jsonError) {
                    reject(jsonError)
                }
            });
            this.request.on('error', (error: any) => {
                reject(error)
            })
        });
    }

}