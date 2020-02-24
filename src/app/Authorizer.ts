import { get } from 'request-promise';

export enum AccessRights {
    READ_BASIC_INFO = 'READ_BASIC_INFO',
    READ_EXTENDED_INFO = 'READ_EXTENDED_INFO',
    CHANGE_BASIC_DATA = 'CHANGE_BASIC_DATA',
    CHANGE_EXTENDED_DATA = 'CHANGE_EXTENDED_DATA'
}

export class Authorizer {
    private authorizerUrl = process.env.AUTHORIZER_URL!;

    public async getTokenRights(token: string): Promise<AccessRights[]> {
        const accessRights: AccessRights[] = [];

        const result = await get(this.authorizerUrl, { body: { token: token } });

        return accessRights;
    }
}