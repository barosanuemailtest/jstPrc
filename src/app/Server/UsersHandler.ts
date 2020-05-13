import { BaseRequestHandler } from "./BaseRequestHandler";
import { UserController } from "../User/UsersController";
import { Utils } from "./Utils";
import { HTTP_CODES } from "./Model";
import { AccessRights } from "../Authorization/Model";
import { User } from "../User/Model";
import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../Authorization/Authorizer";

export class UsersHandler extends BaseRequestHandler {

    private usersController: UserController;

    constructor(request: IncomingMessage, response: ServerResponse, authorizer: Authorizer,
        usersController: UserController = new UserController()) {
        super(request, response, authorizer);
        this.usersController = usersController;
    }


    public async handleRequest(): Promise<void> {
        try {
            if (this.request.method == 'OPTIONS') {
                this.response.writeHead(HTTP_CODES.OK);
                return;
            }
            const secondPath = Utils.getSecondPath(this.request.url!);
            switch (secondPath) {
                case 'get':
                    await this.handleGetUser();
                    break;
                case 'getall':
                    await this.handleGetAllUsers();
                    break;
                case 'create':
                    await this.handleCreateUser();
                    break;
                case 'update':
                    await this.handleUpdateUser();
                    break;
                case 'delete':
                    await this.handleDeleteUser();
                    break;
                default:
                    break;
            }
        } catch (error) {
            this.respondText(error.message, HTTP_CODES.BAD_REQUEST);
        }
    }


    private async handleDeleteUser(): Promise<void> {
        const operationState = await this.operationAuthorized(AccessRights.DELETE);
        if (operationState.authorized) {
            const id = Utils.parseUrl(this.request.url!).query.id as string;
            await this.usersController.deleteUser(id);
            this.respondText(`user ${id} deleted`, HTTP_CODES.OK);
        } else {
            this.respondObject(operationState, HTTP_CODES.UNAUTHORIZED);
        }
    }


    private async handleUpdateUser(): Promise<void> {
        const operationState = await this.operationAuthorized(AccessRights.UPDATE);
        if (operationState.authorized) {
            const user: User = await this.getRequestBody();
            await this.usersController.updateUser(user);
            this.respondText(`user ${user.name} with id ${user.id} updated`, HTTP_CODES.CREATED);
        } else {
            this.respondObject(operationState, HTTP_CODES.UNAUTHORIZED);
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

    private async handleGetAllUsers(): Promise<void> {

        const operationState = await this.operationAuthorized(AccessRights.READ);
        if (operationState.authorized) {
            const users = await this.usersController.getAllUsers()
            if (users) {
                console.log('Responding query: ' + users.length)
                this.respondObject(users, HTTP_CODES.OK);
            } else {
                this.respondText(`No users found`, HTTP_CODES.NOT_fOUND);
            }
        } else {
            this.respondObject(operationState, HTTP_CODES.UNAUTHORIZED);
        }
    }
}


