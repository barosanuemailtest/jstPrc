import { parse, UrlWithParsedQuery } from 'url';

export class Utils {

    public static parseUrl(url: string): UrlWithParsedQuery {
        const parsedUrl = parse(url, true);
        return parsedUrl;
    }

    public static getBasePath(url: string): string {
        const parsedUrl = parse(url, true);
        return parsedUrl.pathname!.split('/')[1];
    }

    public static getSecondPath(url: string): string {
        const parsedUrl = parse(url, true);
        return parsedUrl.pathname!.split('/')[2];
    }

}