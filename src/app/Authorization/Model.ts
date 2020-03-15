export interface SessionToken {
    tokenId: string,
    userName: string,
    valid: boolean,
    expirationTime: Date,
    accessRights: AccessRights[]
}

export interface TokenRights {
    accessRights: AccessRights[],
    state: TokenState
}

export enum TokenState {
    VALID,
    INVALID,
    EXPIRED
}

export enum AccessRights {
    READ_BASIC_INFO,
    READ_EXTENDED_INFO,
    CHANGE_BASIC_DATA,
    CHANGE_EXTENDED_DATA
}

export interface UserCredentials {
    userName: string;
    password: string;
    accessRights: AccessRights[]
}
