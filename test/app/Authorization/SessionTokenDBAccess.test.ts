import { SessionTokenDBAccess } from '../../../src/app/Authorization/SessionTokenDBAccess';
import { SessionToken } from '../../../src/app/Authorization/Model';
import * as Nedb from 'nedb';
jest.mock('nedb');

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
    const someTokenId = '123';

    test('store token with no error', async () => {
        const bar = (someToken: any, cb: any) => {
            cb()
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await sessionTokenDBAccess.storeToken(someToken);
        expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
    });

    test('store token with error', async () => {
        const bar = (someToken: any, cb: any) => {
            cb(new Error("something went wrong"))
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await expect(sessionTokenDBAccess.storeToken(someToken)).rejects.toThrow("something went wrong");
        expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
    });

    test('get token with result and no error', async () => {
        const bar = (someTokenId: string, cb: any) => {
            cb(null, [someToken])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const getTokenResult = await sessionTokenDBAccess.getToken(someTokenId);
        expect(getTokenResult).toBe(someToken);
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });

    test('get token with no result and no error', async () => {
        const bar = (someTokenId: string, cb: any) => {
            cb(null, [])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const getTokenResult = await sessionTokenDBAccess.getToken(someTokenId);
        expect(getTokenResult).toBeNull;
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });

    test('get token with error', async () => {
        const bar = (someTokenId: string, cb: any) => {
            cb(new Error("something went wrong"), [])
        }
        nedbMock.find.mockImplementationOnce(bar);
        await expect(sessionTokenDBAccess.getToken(someTokenId)).rejects.toThrow("something went wrong");
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });

    test('constructor argument', async () => {
        new SessionTokenDBAccess();
        expect(Nedb).toBeCalledTimes(1);
        expect(Nedb).toBeCalledWith('databases/sessionToken.db')
    });
});