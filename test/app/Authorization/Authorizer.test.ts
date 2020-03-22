import { Authorizer } from '../../../src/app/Authorization/Authorizer';
import { TokenState } from '../../../src/app/Authorization/Model';



describe('Authorizer test suite', () => {
    let authorizer: Authorizer;

    let sessionTokenDBAccessMock = {
        storeToken: jest.fn(),
        getToken: jest.fn()
    };;
    let userCredentialsDBAccessMock = {
        putUserCredential: jest.fn(),
        getUserCredential: jest.fn()
    };
    beforeEach(() => {
        authorizer = new Authorizer(sessionTokenDBAccessMock as any, userCredentialsDBAccessMock as any);
    })
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('get token rights returns invalid for null token', async () => {
        sessionTokenDBAccessMock.getToken.mockReturnValue(null);
        const sessionToken = await authorizer.getTokenRights('123');
        expect(sessionTokenDBAccessMock.getToken).toBeCalledTimes(1);
        expect(sessionTokenDBAccessMock.getToken).toBeCalledWith('123');
        expect(sessionToken).toStrictEqual({
            accessRights: [],
            state: TokenState.INVALID
        });
    });
    test('get token rights returns invalid for invalid token', async () => {
        sessionTokenDBAccessMock.getToken.mockReturnValue({ valid: false });
        const sessionToken = await authorizer.getTokenRights('123');
        expect(sessionTokenDBAccessMock.getToken).toBeCalledTimes(1);
        expect(sessionTokenDBAccessMock.getToken).toBeCalledWith('123');
        expect(sessionToken).toStrictEqual({
            accessRights: [],
            state: TokenState.INVALID
        });
    });

    test('get token rights returns expired for expired tokens', async () => {
        const dateInPast = new Date(Date.now() - 1);
        sessionTokenDBAccessMock.getToken.mockReturnValue({ valid: true, expirationTime: dateInPast });
        const sessionToken = await authorizer.getTokenRights('123');
        expect(sessionTokenDBAccessMock.getToken).toBeCalledTimes(1);
        expect(sessionTokenDBAccessMock.getToken).toBeCalledWith('123');
        expect(sessionToken).toStrictEqual({
            accessRights: [],
            state: TokenState.EXPIRED
        });
    });
    test('get token rights returns Valid for not expired adn valid tokens', async () => {
        const dateInFuture = new Date(Date.now() + 10);
        sessionTokenDBAccessMock.getToken.mockReturnValue({ valid: true, expirationTime: dateInFuture });
        const sessionToken = await authorizer.getTokenRights('123');
        expect(sessionTokenDBAccessMock.getToken).toBeCalledTimes(1);
        expect(sessionTokenDBAccessMock.getToken).toBeCalledWith('123');
        expect(sessionToken).toStrictEqual({
            accessRights: [],
            state: TokenState.EXPIRED
        });
    });
});