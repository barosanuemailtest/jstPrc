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
    CREATE,
    READ,
    UPDATE,
    DELETE
}

export interface UserCredentials {
    userName: string;
    password: string;
    accessRights: AccessRights[]
}
