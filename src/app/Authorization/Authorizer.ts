import { SessionTokenDBAccess } from './SessionTokenDBAccess';
import { AccessRights, SessionToken } from './Model';
import { UserCredentialsDBAccess } from './UserCredentialsDBAccess';


export class Authorizer {

    private sessionTokenDBAccess: SessionTokenDBAccess;
    private userCredentialsDBAccess: UserCredentialsDBAccess;

    public constructor(sessionTokenDBAccess = new SessionTokenDBAccess,
        userCredentialsDBAccess = new UserCredentialsDBAccess
    ) {
        this.sessionTokenDBAccess = sessionTokenDBAccess;
        this.userCredentialsDBAccess = userCredentialsDBAccess;
    }

    public async loginUser(userName: string, password: string): Promise<SessionToken | null> {
        const user = await this.userCredentialsDBAccess.getUserCredential(userName, password);
        if (user == null) {
            return null;
        } else {
            return {} as any;
        }
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