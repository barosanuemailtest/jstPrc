import * as Nedb from 'nedb';
import { UserCredentials } from './Model';

export class UserCredentialsDBAccess {

    private nedb: Nedb;

    constructor(nedb = new Nedb('databases/UsersCredentials.db')) {
        this.nedb = nedb;
        this.nedb.loadDatabase();
    }

    public async putUserCredential(usersCredentials: UserCredentials): Promise<any> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(usersCredentials, (err: Error, docs: any) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public async getUserCredential(username: string, password: string): Promise<UserCredentials> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ userName: username, password: password }, (err: Error, docs: any) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }



}