export enum MySQLErrorCodes {
    TABLE_ALREADY_EXISTS = 'ER_TABLE_EXISTS_ERROR',
    UNKNOWN_TABLE = 'ER_BAD_TABLE_ERROR'
}

export type MySQLErrorCode = `${MySQLErrorCodes}`