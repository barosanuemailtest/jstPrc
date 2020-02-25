export interface SessionToken {
    tokenId: string,
    userName: string,
    valid: boolean,
    expirationTime: Date,
    accessRights: AccessRights[]
}

export enum AccessRights {
    READ_BASIC_INFO,
    READ_EXTENDED_INFO,
    CHANGE_BASIC_DATA,
    CHANGE_EXTENDED_DATA
}