import { UserController } from '../../../src/app/User/UsersController';
import { User, WorkingPosition } from '../../../src/app/User/Model';

import { UsersDBAccess } from '../../../src/app/User/UsersDBAccess';
jest.mock('../../../src/app/User/UsersDBAccess');

describe('Authorizer test suite', () => {
    let usersController: UserController;

    const userDBAccessMock = {
        getUserById: jest.fn(),
        getAllUsers: jest.fn(),
        putUser: jest.fn(),
        deleteUser: jest.fn(),
        updateUser: jest.fn()
    }

    beforeEach(() => {
        usersController = new UserController(userDBAccessMock as any);
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
        age: 25,
        email: 'some@email.com',
        id: 'someId',
        name: 'someName',
        workingPosition: WorkingPosition.ENGINEER
    }

    test('get add user', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.123);
        await usersController.addUser(someUser);
        expect(userDBAccessMock.putUser).toBeCalledTimes(1);
        expect(userDBAccessMock.putUser).toBeCalledWith({
            age: 25,
            email: 'some@email.com',
            id: '4feornbt361',
            name: 'someName',
            workingPosition: WorkingPosition.ENGINEER
        })
    });

    test('get user by id', async () => {
        userDBAccessMock.getUserById.mockReturnValueOnce(someUser);
        const resultUser = await usersController.getUserById('someId');
        expect(resultUser).toBe(someUser);
        expect(userDBAccessMock.getUserById).toBeCalledTimes(1);
        expect(userDBAccessMock.getUserById).toBeCalledWith('someId');
    });

    test('get all users', async () => {
        userDBAccessMock.getAllUsers.mockReturnValueOnce([someUser, someOtherUser]);
        const resultUsers = await usersController.getAllUsers();
        expect(resultUsers).toStrictEqual<User[]>([someUser, someOtherUser]);
        expect(userDBAccessMock.getAllUsers).toBeCalledTimes(1);
    });

    test('update user', async () => {
        await usersController.updateUser(someUser);
        expect(userDBAccessMock.updateUser).toBeCalledTimes(1);
        expect(userDBAccessMock.updateUser).toBeCalledWith(someUser);
        expect(UsersDBAccess).toBeCalledTimes(1);
    });

    test('delete user', async () => {
        await usersController.deleteUser('someId');
        expect(userDBAccessMock.deleteUser).toBeCalledTimes(1);
        expect(userDBAccessMock.deleteUser).toBeCalledWith('someId');
        expect(UsersDBAccess).toBeCalledTimes(1);
    });


});
