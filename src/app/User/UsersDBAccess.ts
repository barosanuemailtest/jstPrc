import * as Nedb from 'nedb';
import { User } from './Model';

export class UsersDBAccess {
    private nedb: Nedb;

    constructor(nedb = new Nedb('databases/users.db')) {
        this.nedb = nedb;
        this.nedb.loadDatabase();
    }

    public async putUser(user: User): Promise<void> {

    }

    public async getUserById(userId: string): Promise<void> {

    }


}