import { SessionTokenDBAccess } from '../src/app/Authorization/SessionTokenDBAccess'
import { SessionTokenDBAccessSqllite } from '../gunoi/SessionTokenDBAccessSqllite';
import { UserCredentialsDBAccess } from '../src/app/Authorization/UserCredentialsDBAccess';
import { Authorizer } from '../src/app/Authorization/Authorizer';
import { UsersDBAccess } from '../src/app/User/UsersDBAccess';
import { User } from '../src/app/User/Model';
import { UserController } from '../src/app/User/UsersController';

describe.skip('main spec suite', () => {


    test('SessionTokenDBAccess storeToken', async () => {
        const sessionTokenDBAccess = new SessionTokenDBAccess();
        await sessionTokenDBAccess.storeToken({
            accessRights: [],
            expirationTime: new Date(),
            tokenId: 'abc',
            userName: 'sefu barosanu',
            valid: true
        });
    })

    test('SessionTokenDBAccess', async () => {
        const sessionTokenDBAccess = new SessionTokenDBAccess();
        const token = await sessionTokenDBAccess.getToken('abc');
        console.log(token);
    })

    test('UserCredentialDBAccess', async () => {
        const userCredentialsDBAccess = new UserCredentialsDBAccess();
        const putResult = await userCredentialsDBAccess.putUserCredential(
            {
                userName: 'sefu',
                password: '1234',
                accessRights: [1, 2]
            }
        );
        console.log(putResult);
    })

    test('UserCredentialDBAccess', async () => {
        const userCredentialsDBAccess = new UserCredentialsDBAccess();
        const getResult = await userCredentialsDBAccess.getUserCredential(
            'sefu',
            '1234'
        );
        console.log(getResult);
    })

    test('authorizer.loginUser', async () => {
        const authorizer = new Authorizer();
        const loginResult = await authorizer.loginUser('supersefu', '1234');
        console.log(loginResult);
    })

    test('authorizer.tokenState', async () => {
        const authorizer = new Authorizer();
        const tokenRights = await authorizer.getTokenRights('qmrjltup1fma109nvxvf');
        console.log(tokenRights);
    })

    test('put user', async () => {
        const userDatabase = new UsersDBAccess();
        await userDatabase.putUser({
            age: 23,
            email: 'some@email.com',
            id: '1233sdf',
            name: 'sefu2',
            workingPosition: 2
        });
    });

    test('update user', async () => {
        const userDatabase = new UsersDBAccess();
        const newUser: User = {
            age: 23,
            email: 'some@email.com-UPDATED',
            id: '1233sdf',
            name: 'sefu',
            workingPosition: 2
        }
        await userDatabase.updateUser(newUser);
    });

    test('get user', async () => {
        const userDatabase = new UsersDBAccess();
        const user = await userDatabase.getUserById('1233sdf');
        console.log(user);
    });

    test('get all users', async () => {
        const userDatabase = new UsersDBAccess();
        const users = await userDatabase.getAllUsers();
    });

    test('delete user', async () => {
        const userController = new UserController();
        await userController.deleteUser('1233sdf');
    });
    test.only('get users by name', async () => {
        const userDatabase = new UsersDBAccess();
        const users = await userDatabase.getUsersByName('sefu');

        const a = 5;
    });



});
