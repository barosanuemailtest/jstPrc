import { UsersHandler } from '../../../src/app/Server/UsersHandler';
import { TokenRights, TokenState } from '../../../src/app/Authorization/Model';
import { HTTP_CODES, OperationState } from '../../../src/app/Server/Model';
import { User } from '../../../src/app/User/Model';

describe('UsersHandler test suite', () => {
    let usersHandler: UsersHandler;

    const authorizerMock = {
        getTokenRights: jest.fn()
    }

    const requestMock = {
        url: '',
        headers: {
            authorization: 'authorization'
        },
        on: jest.fn()
    }

    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn()
    }

    const usersControllerMock = {
        deleteUser: jest.fn(),
        updateUser: jest.fn()
    }

    beforeEach(() => {
        usersHandler = new UsersHandler(requestMock as any,
            responseMock as any,
            authorizerMock as any,
            usersControllerMock as any);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    const allRightsToken: TokenRights = {
        accessRights: [0, 1, 2, 3],
        state: TokenState.VALID
    }

    const noRightsToken: TokenRights = {
        accessRights: [],
        state: TokenState.INVALID
    }

    const noRightsOperation: OperationState = {
        authorized: false,
        tokenState: noRightsToken.state
    }

    const someUser: User = {
        age: 23,
        email: 'some@user.com',
        id: '1233sdf',
        name: 'sefu',
        workingPosition: 2
    }

    test('deleteUser - no valid token', async () => {
        requestMock.url = '/users/delete?id=someId';
        authorizerMock.getTokenRights.mockReturnValueOnce(noRightsToken);
        await usersHandler.handleRequest();
        expect(usersControllerMock.deleteUser).toBeCalledTimes(0);
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.UNAUTHORIZED, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toBeCalledWith(JSON.stringify(noRightsOperation));
    })

    test('deleteUser - valid token', async () => {
        requestMock.url = '/users/delete?id=someId';
        authorizerMock.getTokenRights.mockReturnValueOnce(allRightsToken);
        await usersHandler.handleRequest();
        expect(usersControllerMock.deleteUser).toBeCalledWith('someId');
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
        expect(responseMock.write).toBeCalledWith('user someId deleted');
    })

    test('updateUser - no valid token', async () => {
        requestMock.url = '/users/update';
        authorizerMock.getTokenRights.mockReturnValueOnce(noRightsToken);
        await usersHandler.handleRequest();
        expect(usersControllerMock.updateUser).toBeCalledTimes(0);
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.UNAUTHORIZED, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toBeCalledWith(JSON.stringify(noRightsOperation));
    })

    test('updateUser - valid token', async () => {
        requestMock.url = '/users/update';
        authorizerMock.getTokenRights.mockReturnValueOnce(allRightsToken);
        requestMock.on.mockImplementation(
            (event: string, cb: any) => {
                switch (event) {
                    case 'data':
                        cb(JSON.stringify(someUser))
                        break;
                    case 'end':
                        cb()
                        break;
                }
            }
        )
        await usersHandler.handleRequest();
        expect(usersControllerMock.updateUser).toBeCalledWith(someUser);
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED);
        expect(responseMock.write).toBeCalledWith(`user ${someUser.name} with id ${someUser.id} updated`);
    })



});