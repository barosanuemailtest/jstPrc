import { BaseRequestHandler } from "./BaseRequestHandler";
import { UserController } from "../User/UsersController";
import { Utils } from "./Utils";
import { HTTP_CODES } from "./Model";
import { AccessRights } from "../Authorization/Model";
import { User } from "../User/Model";

export class UsersHandler extends BaseRequestHandler {

    private usersController: UserController = new UserController();


    public async handleRequest(): Promise<void> {
        try {
            const secondPath = Utils.getSecondPath(this.request.url!);
            switch (secondPath) {
                case 'get':
                    await this.handleGetUser();
                    break;
                case 'create':
                    await this.handleCreateUser();
                    break;

                default:
                    break;
            }
        } catch (error) {
            this.respondText(error.message, HTTP_CODES.BAD_REQUEST);
        }
    }

    private async handleCreateUser(): Promise<void> {
        const operationState = await this.operationAuthorized(AccessRights.CREATE);
        if (operationState.authorized) {
            const user: User = await this.getRequestBody();
            await this.usersController.addUser(user);
            this.respondText(`user ${user.name} created`, HTTP_CODES.CREATED);
        } else {
            this.respondObject(operationState, HTTP_CODES.UNAUTHORIZED);
        }
    }

    private async handleGetUser() {
        const operationState = await this.operationAuthorized(AccessRights.READ);
        if (operationState.authorized) {
            const id = Utils.parseUrl(this.request.url!).query.id as string;
            const user = await this.usersController.getUserById(id);
            if (user) {
                this.respondObject(user, HTTP_CODES.OK);
            } else {
                this.respondText(`User with id ${id} not found`, HTTP_CODES.NOT_fOUND);
            }
        } else {
            this.respondObject(operationState, HTTP_CODES.UNAUTHORIZED);
        }
    }


}