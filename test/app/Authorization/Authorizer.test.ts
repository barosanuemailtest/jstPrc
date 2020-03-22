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
        jest.clearAllMocks()

    });

    describe('loginUser tests', () => {
        test('should return null if invalid credentials', async () => {
            userCredentialsDBAccessMock.getUserCredential.mockReturnValue(null);
            const loginResult = await authorizer.loginUser('someUserName', 'somePassword');
            expect(loginResult).toBeNull;
            expect(userCredentialsDBAccessMock.getUserCredential).toBeCalledTimes(1);
            expect(userCredentialsDBAccessMock.getUserCredential).toBeCalledWith('someUserName', 'somePassword');
            expect(sessionTokenDBAccessMock.storeToken).not.toHaveBeenCalled();
        })
        test('should sessionToken if valid credentials', async () => {
            jest.spyOn(global.Math, 'random').mockReturnValue(0.123);
            jest.spyOn(global.Date, 'now').mockReturnValue(0);
            const expectedSessionToken = {
                accessRights: [1, 2, 3],
                userName: 'someUserName',
                tokenId: '4feornbt3614feornbt361',
                valid: true,
                expirationTime: new Date(1000 * 60 * 60)
            }

            userCredentialsDBAccessMock.getUserCredential.mockReturnValue({
                accessRights: [1, 2, 3],
                userName: 'someUserName'
            });
            const sessionToken = await authorizer.loginUser('someUserName', 'somePassword');
            expect(sessionToken).toStrictEqual(expectedSessionToken);
            expect(userCredentialsDBAccessMock.getUserCredential).toBeCalledTimes(1);
            expect(userCredentialsDBAccessMock.getUserCredential).toBeCalledWith('someUserName', 'somePassword');
            expect(sessionTokenDBAccessMock.storeToken).toHaveBeenCalledWith(sessionToken);

        })
    });

    describe('getTokenRights tests', () => {
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
        test('get token rights returns valid for not expired and valid tokens', async () => {
            const dateInFuture = new Date(Date.now() + 100000);
            sessionTokenDBAccessMock.getToken.mockReturnValue({ valid: true, expirationTime: dateInFuture, accessRights: [1] });
            const sessionToken = await authorizer.getTokenRights('123');
            expect(sessionTokenDBAccessMock.getToken).toBeCalledTimes(1);
            expect(sessionTokenDBAccessMock.getToken).toBeCalledWith('123');
            expect(sessionToken).toStrictEqual({
                accessRights: [1],
                state: TokenState.VALID
            });
        });
    })
});