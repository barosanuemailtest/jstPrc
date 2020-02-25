import { SessionToken } from './Model';

export class SessionTokenDBAccess {

    public async storeToken(token: SessionToken) { }

    public async getToken(tokenId: string): Promise<SessionToken> {
        return {} as any;
    }

    public async invalidateToken(tokenId: string) {

    }
}
