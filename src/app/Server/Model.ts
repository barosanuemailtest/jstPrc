import { TokenState } from "../Authorization/Model";

export enum HTTP_CODES {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_fOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export interface OperationState {
    authorized: boolean,
    tokenState: TokenState
}