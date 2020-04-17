import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../Authorization/Authorizer';

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
}