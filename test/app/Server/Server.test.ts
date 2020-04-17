import { Server } from '../../../src/app/Server/Server';
import * as http from 'http';
const createServerSpy = jest.spyOn(http, 'createServer');

describe('Server test suite', () => {

    let server: Server;

    const authorizerMock = {
        loginUser: jest.fn()
    }

    beforeEach(() => {
        server = new Server(authorizerMock as any);
        // jest.mock('http', () => {
        //     return jest.fn().mockImplementation(() => {
        //         return {
        //             createServer: (cb: any) => {
        //                 cb({ url: '/login' }, 'def')
        //             }
        //         }
        //     }).mockImplementation(() => {
        //         return {
        //             listen: () => {
        //                 console.log('retched listen!!!')
        //             }
        //         }
        //     });
        // });


    })
    afterEach(() => {
        jest.resetAllMocks();
    })
    test('create server', async () => {
        server.createServer();
    });


});
