import { LoginHandler } from '../../../src/app/Server/LoginHandler';
import { HTTP_CODES } from '../../../src/app/Server/Model';
import { SessionToken } from '../../../src/app/Authorization/Model';

describe('LoginHandler test suite', () => {

    let loginHandler: LoginHandler;

    const authorizerMock = {
        loginUser: jest.fn()
    }
    const requestMock = {
        method: 'POST',
        on: jest.fn()
    }

    const responseMock = {
        statusCode: HTTP_CODES.CREATED,
        writeHead: jest.fn(),
        write: jest.fn()
    }

    const rawRequestBody = `{
        "username": "someUserName",
        "password": "somePassword"
    }`
    const someToken: SessionToken = {
        accessRights: [],
        expirationTime: new Date(),
        tokenId: '123',
        userName: 'John',
        valid: true
    }

    beforeEach(() => {
        loginHandler = new LoginHandler(
            requestMock as any,
            responseMock as any,
            authorizerMock as any
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    })

    test('request method not POST', async () => {
        requestMock.method = 'GET';
        await loginHandler.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
        expect(authorizerMock.loginUser).toHaveBeenCalledTimes(0);
    });

    test('request method POST with requestBody and valid response', async () => {
        requestMock.method = 'POST';
        requestMock.on.mockImplementation(
            (event: string, cb: any) => {
                switch (event) {
                    case 'data':
                        cb(rawRequestBody)
                        break;
                    case 'end':
                        cb()
                        break;
                }
            }
        )
        authorizerMock.loginUser.mockReturnValue(someToken);
        await loginHandler.handleRequest();
        expect(authorizerMock.loginUser).toHaveBeenCalledTimes(1);
        expect(authorizerMock.loginUser).toHaveBeenCalledWith('someUserName', 'somePassword')
        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toBeCalledTimes(1);
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toBeCalledTimes(1);
        expect(responseMock.write).toBeCalledWith(JSON.stringify(someToken));
    });

    test('request method POST with requestBody and no response', async () => {
        requestMock.method = 'POST';
        requestMock.on.mockImplementation(
            (event: string, cb: any) => {
                console.log(event);
                switch (event) {
                    case 'data':
                        cb(rawRequestBody)
                        break;
                    case 'end':
                        cb()
                        break;
                }
            }
        )
        authorizerMock.loginUser.mockReturnValue(null);
        await loginHandler.handleRequest();
        expect(authorizerMock.loginUser).toHaveBeenCalledTimes(1);
        expect(authorizerMock.loginUser).toHaveBeenCalledWith('someUserName', 'somePassword')
        expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
        expect(responseMock.write).toBeCalledTimes(1);
        expect(responseMock.write).toBeCalledWith('wrong username or password');
    });

    test('request method POST with error', async () => {
        requestMock.method = 'POST';
        requestMock.on.mockImplementation(
            (event: string, cb: any) => {
                console.log(event);
                switch (event) {
                    case 'data':
                        cb(rawRequestBody)
                        break;
                    case 'error':
                        cb(new Error('cannot read request body!'))
                        break;
                }
            }
        )
        authorizerMock.loginUser.mockReturnValue(null);
        await loginHandler.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
        expect(responseMock.write).toBeCalledTimes(1);
        expect(responseMock.write).toBeCalledWith('Internal error: cannot read request body!');
    });

});