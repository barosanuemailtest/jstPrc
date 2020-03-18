import { Utils } from '../src/app/Server/Utils';
import { UrlWithParsedQuery } from 'url';

describe.only('ServerUtils test', () => {

    let parsedUrl: UrlWithParsedQuery;

    test('parse simple url', () => {
        const parsedUrl = Utils.parseUrl('http://localhost:8080/login');
        expect(parsedUrl.host).toBe('localhost:8080');
        expect(parsedUrl.hostname).toBe('localhost');
        expect(parsedUrl.href).toBe('http://localhost:8080/login');
        expect(parsedUrl.path).toBe('/login');
        expect(parsedUrl.port).toBe('8080');
        expect(parsedUrl.protocol).toBe('http:');
        expect(parsedUrl.query).toBeNull();

    })

});