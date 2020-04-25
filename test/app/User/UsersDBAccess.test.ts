import { UsersDBAccess } from '../../../src/app/User/UsersDBAccess';
import * as Nedb from 'nedb';
import { User, WorkingPosition } from '../../../src/app/User/Model';
jest.mock('nedb');

describe('UsersDBAccess test suite', () => {

    let usersDBAccess: UsersDBAccess;

    const nedbMock = {
        loadDatabase: jest.fn(),
        insert: jest.fn(),
        find: jest.fn(),
        update: jest.fn()
    };

    beforeEach(() => {
        usersDBAccess = new UsersDBAccess(nedbMock as any);
        expect(nedbMock.loadDatabase).toBeCalledTimes(1);
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    const someUser: User = {
        age: 25,
        email: 'some@email.com',
        id: 'someId',
        name: 'someName',
        workingPosition: WorkingPosition.ENGINEER
    }

    test('putUser with no error', async () => {
        const bar = (someUser: any, cb: any) => {
            cb()
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await usersDBAccess.putUser(someUser);
        expect(nedbMock.insert).toBeCalledWith(someUser, expect.any(Function));
    });

    test('putUser with error', async () => {
        const bar = (someUser: any, cb: any) => {
            cb(new Error('something went wrong'))
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await expect(usersDBAccess.putUser(someUser)).rejects.toThrow('something went wrong');
        expect(nedbMock.insert).toBeCalledWith(someUser, expect.any(Function));
    });

    test('updateUser with no error', async () => {
        const bar = (id: number, someUser: any, someOptions: any, cb: any) => {
            cb(null, 1)
        }
        nedbMock.update.mockImplementationOnce(bar);
        await usersDBAccess.updateUser(someUser);
        expect(nedbMock.update).toBeCalledWith({ id: someUser.id }, someUser, {}, expect.any(Function));
    });

    test('updateUser - no users updated', async () => {
        const bar = (id: number, someUser: any, someOptions: any, cb: any) => {
            cb(null, 0)
        }
        nedbMock.update.mockImplementationOnce(bar);
        await expect(usersDBAccess.updateUser(someUser)).rejects.toThrow('No users updated!');
        expect(nedbMock.update).toBeCalledWith({ id: someUser.id }, someUser, {}, expect.any(Function));
    });

    test('updateUser - db error', async () => {
        const bar = (id: number, someUser: any, someOptions: any, cb: any) => {
            cb(new Error('something went wrong'), 0)
        }
        nedbMock.update.mockImplementationOnce(bar);
        await expect(usersDBAccess.updateUser(someUser)).rejects.toThrow('something went wrong');
        expect(nedbMock.update).toBeCalledWith({ id: someUser.id }, someUser, {}, expect.any(Function));
    });

    test('getUser with no error', async () => {
        const bar = (someUserId: string, cb: any) => {
            cb()
        }
        nedbMock.find.mockImplementationOnce(bar);
        await usersDBAccess.getUserById(someUser.id);
        expect(nedbMock.insert).toBeCalledWith(someUser, expect.any(Function));
    });

    test('getUser with error', async () => {
        const bar = (someUser: any, cb: any) => {
            cb(new Error('something went wrong'))
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await expect(usersDBAccess.putUser(someUser)).rejects.toThrow('something went wrong');
        expect(nedbMock.insert).toBeCalledWith(someUser, expect.any(Function));
    });
});


