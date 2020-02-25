import { SessionTokenDBAccess } from '../src/app/Authorization/SessionTokenDBAccess'

test('SessionTokenDBAccess', async () => {
    const sessionTokenDBAccess = new SessionTokenDBAccess();
    await sessionTokenDBAccess.storeToken({
        accessRights: [],
        expirationTime: new Date(),
        tokenId: 'sdfsdfsdfsd',
        userName: 'sefu barosanu',
        valid: true
    });
})
