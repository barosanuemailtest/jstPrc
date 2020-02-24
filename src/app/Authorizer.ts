import * as https from 'https';
import { RequestOptions } from 'https';
import { URL } from 'url';

export class Authorizer {
    private authorizerUrl = process.env.AUTHORIZER_URL;
}