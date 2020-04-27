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
        update: jest.fn(),
        remove: jest.fn()
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

    const someOtherUser: User = {
        age: 26,
        email: 'someOther@email.com',
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

    test('getUser with no error - user found', async () => {
        const bar = (someUserId: string, cb: any) => {
            cb(null, [someUser])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const resultUser = await usersDBAccess.getUserById(someUser.id);
        expect(resultUser).toBe(someUser);
        expect(nedbMock.find).toBeCalledWith({ id: someUser.id }, expect.any(Function));
    });

    test('getUser with no error - no user found', async () => {
        const bar = (someUserId: string, cb: any) => {
            cb(null, [])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const resultUser = await usersDBAccess.getUserById(someUser.id);
        expect(resultUser).toBe(null);
        expect(nedbMock.find).toBeCalledWith({ id: someUser.id }, expect.any(Function));
    });

    test('getUser with error', async () => {
        const bar = (someUserId: string, cb: any) => {
            cb(new Error('something went wrong'), [])
        }
        nedbMock.find.mockImplementationOnce(bar);
        await expect(usersDBAccess.getUserById(someUser.id)).rejects.toThrow('something went wrong');
        expect(nedbMock.find).toBeCalledWith({ id: someUser.id }, expect.any(Function));
    });

    test('getAllUsers with no error', async () => {
        const bar = (someObject: Object, cb: any) => {
            cb(null, [someUser, someOtherUser])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const resultUsers = await usersDBAccess.getAllUsers();
        expect(resultUsers).toEqual<User[]>([someUser, someOtherUser]);
        expect(nedbMock.find).toBeCalledWith({}, expect.any(Function));
    });

    test('getAllUsers with error', async () => {
        const bar = (someObject: Object, cb: any) => {
            cb(new Error('something went wrong'))
        }
        nedbMock.find.mockImplementationOnce(bar);
        await expect(usersDBAccess.getAllUsers()).rejects.toThrow('something went wrong');
        expect(nedbMock.find).toBeCalledWith({}, expect.any(Function));
    });

    test('delete user with no error', async () => {
        const bar = (someUserId: string, someObject: Object, cb: any) => {
            cb(null, 1)
        }
        nedbMock.remove.mockImplementationOnce(bar);
        await usersDBAccess.deleteUser(someOtherUser.id);
        expect(nedbMock.remove).toBeCalledWith({ id: someOtherUser.id }, {}, expect.any(Function));
    })

    test('delete user - no users updated', async () => {
        const bar = (someUserId: string, someObject: Object, cb: any) => {
            cb(null, 0)
        }
        nedbMock.remove.mockImplementationOnce(bar);
        await expect(usersDBAccess.deleteUser(someOtherUser.id)).rejects.toThrow('User not deleted!');
        expect(nedbMock.remove).toBeCalledWith({ id: someOtherUser.id }, {}, expect.any(Function));
    })

    test('delete user - db error', async () => {
        const bar = (someUserId: string, someObject: Object, cb: any) => {
            cb(new Error('something went wrong'), 0)
        }
        nedbMock.remove.mockImplementationOnce(bar);
        await expect(usersDBAccess.deleteUser(someOtherUser.id)).rejects.toThrow('something went wrong');
        expect(nedbMock.remove).toBeCalledWith({ id: someOtherUser.id }, {}, expect.any(Function));
    })
});


