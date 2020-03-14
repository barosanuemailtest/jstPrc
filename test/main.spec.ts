import { SessionTokenDBAccess } from '../src/app/Authorization/SessionTokenDBAccess'
import { SessionTokenDBAccessSqllite } from '../gunoi/SessionTokenDBAccessSqllite';
import { UserCredentialsDBAccess } from '../src/app/Authorization/UserCredentialsDBAccess';
import { Authorizer } from '../src/app/Authorization/Authorizer';

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

test.only('UserCredentialDBAccess', async () => {
    const authorizer = new Authorizer();
    const loginResult = await authorizer.loginUser('sefu', '1234');
    console.log(loginResult);
})



