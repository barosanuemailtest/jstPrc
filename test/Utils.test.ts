import { Utils } from '../src/app/Server/Utils';

describe.only('ServerUtils test', () => {

    test('parse simple url', () => {
        const parsedUrl = Utils.parseUrl('http://localhost:8080/login');
        expect(parsedUrl.host).toBe('localhost:8080');
        expect(parsedUrl.hostname).toBe('localhost');
        expect(parsedUrl.href).toBe('http://localhost:8080/login');
        expect(parsedUrl.path).toBe('/login');
        expect(parsedUrl.port).toBe('8080');
        expect(parsedUrl.protocol).toBe('http:');
        expect(parsedUrl.query).toEqual({});
    })
    test('parse url with query', () => {
        const parsedUrl = Utils.parseUrl('http://localhost:8080/empldetails?function=admin&wage=10');
        expect(parsedUrl.query).toEqual({
            function: 'admin',
            wage: '10'
        });
    });

});