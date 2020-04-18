import { BaseRequestHandler } from "./BaseRequestHandler";
import { UserController } from "../User/UsersController";
import { Utils } from "./Utils";
import { HTTP_CODES } from "./Model";
import { AccessRights } from "../Authorization/Model";

export class UsersHandler extends BaseRequestHandler {

    private usersController: UserController = new UserController();


    public async handleRequest(): Promise<void> {
        const secondPath = Utils.getSecondPath(this.request.url!);
        switch (secondPath) {
            case 'get':
                const operationState = await this.operationAuthorized(AccessRights.READ);
                if (operationState.authorized) {
                    await this.handleGetUser();
                } else {
                    this.response.statusCode = HTTP_CODES.UNAUTHORIZED;
                    this.response.write(JSON.stringify(operationState))
                }

                break;

            default:
                break;
        }
    }

    private async handleGetUser() {
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
    }

}