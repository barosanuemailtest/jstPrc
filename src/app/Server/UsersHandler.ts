import { BaseRequestHandler } from "./BaseRequestHandler";
import { UserController } from "../User/UsersController";
import { Utils } from "./Utils";

export class UsersHandler extends BaseRequestHandler {

    private usersController: UserController = new UserController();


    public async handleRequest(): Promise<void> {
        const secondPath = Utils.getSecondPath(this.request.url!);
        switch (secondPath) {
            case 'get':
                const id = Utils.parseUrl(this.request.url!).query.id as string;
                console.log(id);
                const user = this.usersController.getUserById(id);
                break;

            default:
                break;
        }
    }

}