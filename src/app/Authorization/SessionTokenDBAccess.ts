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

    public async getToken(tokenId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ tokenId: tokenId }, (err: Error, docs: any) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public async invalidateToken(tokenId: string) {

    }
}
