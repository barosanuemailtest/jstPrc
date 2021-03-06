import { SessionTokenDBAccess } from './SessionTokenDBAccess';
import { AccessRights, SessionToken, TokenRights, TokenState } from './Model';
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
        const userCredentials = await this.userCredentialsDBAccess.getUserCredential(userName, password);
        if (userCredentials == null) {
            return null;
        } else {
            const sessionToken: SessionToken = {
                accessRights: userCredentials.accessRights,
                userName: userCredentials.userName,
                tokenId: this.generateRandomTokenId(),
                valid: true,
                expirationTime: this.generateExpirationTime()
            }
            await this.sessionTokenDBAccess.storeToken(sessionToken);
            return sessionToken;
        }
    }

    public async getTokenRights(tokenId: string): Promise<TokenRights> {
        const token = await this.sessionTokenDBAccess.getToken(tokenId);
        if (!token || !token.valid) {
            return {
                accessRights: [],
                state: TokenState.INVALID
            };
        } else if (token.expirationTime < new Date()) {
            return {
                accessRights: [],
                state: TokenState.EXPIRED
            };
        } else return {
            accessRights: token.accessRights,
            state: TokenState.VALID
        }
    }

    private generateRandomTokenId(): string {
        return this.generateRandomString() + this.generateRandomString();
    }

    private generateExpirationTime() {
        return new Date(Date.now() + 1000 * 60 * 60);
    }
    private generateRandomString() {
        return Math.random().toString(36).slice(2)
    }
}