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

    public async updateUser(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.update({ id: user.id }, user, {}, (err: Error, numReplaced: number) => {
                if (err) {
                    return reject(err);
                } else if (numReplaced == 0) {
                    return reject(new Error('No users updated!'));
                } else {
                    resolve();
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

    public async getUsersByName(name: string): Promise<User[]> {
        const regex = new RegExp(name)
        return new Promise((resolve, reject) => {
            this.nedb.find({ name: regex }, (err: Error, docs: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public async getAllUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            this.nedb.find({}, (err: Error, docs: any) => {
                if (err) {
                    return reject(err);
                } else {
                    if (docs.length == 0) {
                        return resolve([]);
                    } else {
                        return resolve(docs);
                    }
                }
            });
        });
    }

    public async deleteUser(userId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.remove({ id: userId }, {}, (err: Error, numRemoved: number) => {
                if (err) {
                    return reject(err);
                } else if (numRemoved == 0) {
                    return reject(new Error('User not deleted!'));
                } else {
                    resolve();
                }
            })
        });
    }

}