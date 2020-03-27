import { SessionTokenDBAccess } from '../../../src/app/Authorization/SessionTokenDBAccess';
import { SessionToken } from '../../../src/app/Authorization/Model';

describe('SessionTokenDBAccess test suite', () => {

    let sessionTokenDBAccess: SessionTokenDBAccess;

    let nedbMock = {
        loadDatabase: jest.fn(),
        insert: jest.fn(),
        find: jest.fn()
    };
    beforeEach(() => {
        sessionTokenDBAccess = new SessionTokenDBAccess(nedbMock as any);
        expect(nedbMock.loadDatabase).toBeCalledTimes(1);
    });
    afterEach(() => {
        jest.clearAllMocks()
    });
    const someToken: SessionToken = {
        accessRights: [],
        expirationTime: new Date(),
        tokenId: '123',
        userName: 'John',
        valid: true
    }

    test('store token with no error', async () => {
        const bar = (someToken: any, cb: any) => {
            cb()
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await sessionTokenDBAccess.storeToken(someToken);
        expect(nedbMock.insert).toBeCalledWith(bar);

    });
});