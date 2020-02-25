import { SessionToken } from './Model';
import * as Sqlite3 from 'sqlite3';

export class SessionTokenDBAccessSqllite {

    private sqlite3: Sqlite3.Database;

    constructor() {
        this.sqlite3 = new Sqlite3.Database('./sessionToken.db',
            Sqlite3.OPEN_READWRITE | Sqlite3.OPEN_CREATE)
    }

    public async storeToken(token: SessionToken) {
    }

    public async getToken(tokenId: string): Promise<SessionToken> {
        return {} as any;
    }

    public async invalidateToken(tokenId: string) {

    }
}
