import { UsersDBAccess } from "./UsersDBAccess";
import { User } from "./Model";


export class UserController {

    private userDBAccess: UsersDBAccess;

    public constructor(userDBAccess: UsersDBAccess = new UsersDBAccess()) {
        this.userDBAccess = userDBAccess;
    }

    public async addUser(user: User) {
        await this.userDBAccess.putUser(user);
    }

    public async getUserById(userId: string) {
        await this.userDBAccess.getUserById(userId);
    }


}