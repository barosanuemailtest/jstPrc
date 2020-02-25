import { SessionToken } from './Model';
import * as Nedb from 'nedb';

export class SessionTokenDBAccess {

    private nedb: Nedb;

    constructor(nedb = new Nedb('databases/sessionToken.db')) {
        this.nedb = nedb;
        this.nedb.loadDatabase();
    }

    public async storeToken(token: SessionToken) {
        this.nedb.insert(token);
    }

    public async getToken(tokenId: string): Promise<SessionToken> {
        return {} as any;
    }

    public async invalidateToken(tokenId: string) {

    }
}
