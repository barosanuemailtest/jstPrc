import { UsersDBAccess } from "./UsersDBAccess";
import { User } from "./Model";


export class UserController {

    private userDBAccess: UsersDBAccess;

    public constructor(userDBAccess: UsersDBAccess = new UsersDBAccess()) {
        this.userDBAccess = userDBAccess;
    }

    public async addUser(user: User) {
        user.id = this.generateRandomUserId();
        await this.userDBAccess.putUser(user);
    }

    public async getUserById(userId: string): Promise<User | null> {
        return await this.userDBAccess.getUserById(userId);
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.userDBAccess.getAllUsers();
    }

    public async updateUser(user: User) {
        await this.userDBAccess.updateUser(user);
        this.reloadDataBase();
    }

    public async deleteUser(userId: string) {
        await this.userDBAccess.deleteUser(userId);
        this.reloadDataBase();
    }

    private generateRandomUserId(): string {
        return Math.random().toString(36).slice(2)
    }

    private reloadDataBase() {
        this.userDBAccess = new UsersDBAccess();
    }


}