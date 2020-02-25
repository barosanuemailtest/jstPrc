import { SessionTokenDBAccess } from './SessionTokenDBAccess';
import { AccessRights } from './Model';


export class Authorizer {
    private sessionTokenDBAccess: SessionTokenDBAccess;

    public constructor(sessionTokenDBAccess = new SessionTokenDBAccess) {
        this.sessionTokenDBAccess = sessionTokenDBAccess;
    }

    public async getTokenRights(tokenId: string): Promise<AccessRights[]> {
        const token = await this.sessionTokenDBAccess.getToken(tokenId);
        return token.accessRights;
    }

    public authorizeOperation(accessRight: AccessRights, tokenId: string) {

    }

    public async generateSessionToken(user: string) { 
        
    };
}