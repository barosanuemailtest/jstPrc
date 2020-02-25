import { SessionTokenDBAccess } from '../src/app/Authorization/SessionTokenDBAccess'
import { SessionTokenDBAccessSqllite } from '../src/app/Authorization/SessionTokenDBAccessSqllite';

test('SessionTokenDBAccess', async () => {
    const sessionTokenDBAccess = new SessionTokenDBAccess();
    await sessionTokenDBAccess.storeToken({
        accessRights: [],
        expirationTime: new Date(),
        tokenId: 'abc',
        userName: 'sefu barosanu',
        valid: true
    });
})

test.skip('SessionTokenDBAccess - SQLlite', async () => {
    try {
        const sessionTokenDBAccess = new SessionTokenDBAccessSqllite();
    } catch (error) {
        console.log(error.message)
    }

    // await sessionTokenDBAccess.storeToken({
    //     accessRights: [],
    //     expirationTime: new Date(),
    //     tokenId: 'abc',
    //     userName: 'sefu barosanu',
    //     valid: true
    // });
})

