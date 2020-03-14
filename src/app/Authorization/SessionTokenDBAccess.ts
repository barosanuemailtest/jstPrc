import { SessionToken } from './Model';
import * as Nedb from 'nedb';

export class SessionTokenDBAccess {

    private nedb: Nedb;

    constructor(nedb = new Nedb('databases/sessionToken.db')) {
        this.nedb = nedb;
        this.nedb.loadDatabase();
    }

    public async storeToken(token: SessionToken): Promise<any> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(token, (err: Error) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            })
        });
    }

    public async getToken(tokenId: string): Promise<SessionToken | null> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ tokenId: tokenId }, (err: Error, docs: any) => {
                if (err) {
                    return reject(err);
                } else {
                    if (docs.length == 0) {
                        return resolve(null);
                    } else {
                        return resolve(docs[0]);
                    }
                }
            });
        });
    }

    public async invalidateToken(tokenId: string) {

    }
}
