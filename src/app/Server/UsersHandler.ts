import { BaseRequestHandler } from "./BaseRequestHandler";
import { UserController } from "../User/UsersController";
import { Utils } from "./Utils";
import { HTTP_CODES } from "./Model";

export class UsersHandler extends BaseRequestHandler {

    private usersController: UserController = new UserController();


    public async handleRequest(): Promise<void> {
        const secondPath = Utils.getSecondPath(this.request.url!);
        switch (secondPath) {
            case 'get':
                const id = Utils.parseUrl(this.request.url!).query.id as string;
                console.log(id);
                const user = await this.usersController.getUserById(id);
                if (user) {
                    this.response.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
                    this.response.write(JSON.stringify(user))
                } else {
                    this.response.statusCode = HTTP_CODES.NOT_fOUND
                    this.response.write(`User with id ${id} not found`);
                }
                break;

            default:
                break;
        }
    }

}