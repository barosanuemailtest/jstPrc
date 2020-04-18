import * as Nedb from 'nedb';
import { User } from './Model';

export class UsersDBAccess {
    private nedb: Nedb;

    constructor(nedb = new Nedb('databases/users.db')) {
        this.nedb = nedb;
        this.nedb.loadDatabase();
    }

    public async putUser(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(user, (err: Error) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            })
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ id: userId }, (err: Error, docs: any) => {
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


}