import { UserCredentialsDBAccess } from '../../../src/app/Authorization/UserCredentialsDBAccess';
import { UserCredentials } from '../../../src/app/Authorization/Model';
import * as Nedb from 'nedb';
jest.mock('nedb');

describe('UserCredentialsDBAccess test suite', () => {

    let userCredentialsDBAccess: UserCredentialsDBAccess

    const nedbMock = {
        loadDatabase: jest.fn(),
        insert: jest.fn(),
        find: jest.fn()
    }
    beforeEach(() => {
        userCredentialsDBAccess = new UserCredentialsDBAccess(nedbMock as any);
        expect(nedbMock.loadDatabase).toBeCalledTimes(1);
    });
    afterEach(() => {
        jest.clearAllMocks()
    });
    const someUserCredentials: UserCredentials = {
        userName: 'someUserName',
        password: 'somePassword',
        accessRights: [0, 1, 2]
    }
    test('put user credentials with no error', async () => {
        const bar = (usersCredentials: any, cb: any) => {
            cb()
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await userCredentialsDBAccess.putUserCredential(someUserCredentials);
        expect(nedbMock.insert).toBeCalledWith(someUserCredentials, expect.any(Function));
    });

    test('put user credentials with error', async () => {
        const bar = (usersCredentials: any, cb: any) => {
            cb(new Error("something went wrong"))
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await expect(userCredentialsDBAccess.putUserCredential(someUserCredentials)).rejects.toThrow("something went wrong");
        expect(nedbMock.insert).toBeCalledWith(someUserCredentials, expect.any(Function));
    });

    test('getUserCredentials with no error', async () => {
        const bar = (usersCredentials: any, cb: any) => {
            cb(null, [someUserCredentials])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const getUserCredentialsResult = await userCredentialsDBAccess.getUserCredential('someUserName', 'somePassword');
        expect(getUserCredentialsResult).toBe(someUserCredentials);
        expect(nedbMock.find).toBeCalledWith({ userName: 'someUserName', password: 'somePassword' }, expect.any(Function));
    });

    test('getUserCredentials with no result and no error', async () => {
        const bar = (usersCredentials: any, cb: any) => {
            cb(null, [])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const getUserCredentialsResult = await userCredentialsDBAccess.getUserCredential('someUserName', 'somePassword');
        expect(getUserCredentialsResult).toBeNull;
        expect(nedbMock.find).toBeCalledWith({ userName: 'someUserName', password: 'somePassword' }, expect.any(Function));
    });

    test('getUserCredentials with error', async () => {
        const bar = (usersCredentials: any, cb: any) => {
            cb(new Error('something went wrong'), [])
        }
        nedbMock.find.mockImplementationOnce(bar);
        await expect(userCredentialsDBAccess.getUserCredential('someUserName', 'somePassword')).rejects.toThrow('something went wrong');
        expect(nedbMock.find).toBeCalledWith({ userName: 'someUserName', password: 'somePassword' }, expect.any(Function));
    });
    test('constructor argument', () => {
        new UserCredentialsDBAccess();
        expect(Nedb).toBeCalledTimes(1);
        expect(Nedb).toBeCalledWith('databases/UsersCredentials.db')
    });



});
