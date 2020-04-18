import { IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { AccessRights, TokenState } from '../Authorization/Model';
import { OperationState } from './Model';

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

    public async operationAuthorized(operation: AccessRights): Promise<OperationState> {
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
}