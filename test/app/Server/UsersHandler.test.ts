import { UsersHandler } from '../../../src/app/Server/UsersHandler';
import { TokenRights, TokenState } from '../../../src/app/Authorization/Model';
import { HTTP_CODES } from '../../../src/app/Server/Model';

describe('UsersHandler test suite', () => {
    let usersHandler: UsersHandler;

    const authorizerMock = {
        getTokenRights: jest.fn()
    }

    const requestMock = {
        url: '',
        headers: {
            authorization: 'authorization'
        }
    }

    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn()
    }

    const usersControllerMock = {
        deleteUser: jest.fn()
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

    test('deleteUser', async () => {
        requestMock.url = '/users/delete?id=someId';
        authorizerMock.getTokenRights.mockReturnValueOnce(allRightsToken);
        await usersHandler.handleRequest();
        expect(usersControllerMock.deleteUser).toBeCalledWith('someId');
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
        expect(responseMock.write).toBeCalledWith('user someId deleted');
    })

});