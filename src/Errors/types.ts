import type { MySQLErrorCode } from "./MySQL/Static"

export interface PolyORMException extends Error {
    connection: string
    code: string
    errno: number
}

export interface PolyORMSQLException extends PolyORMException {
    sql: string
    sqlState: string
    sqlMessage: string
}

export type AcknowledgedErrorOrigin = 'MySQL'


export type PolyORMErrorCode = (
    MySQLErrorCode
)

export interface PolyORMMySQLExeception extends PolyORMSQLException {
    code: MySQLErrorCode
}

export type AcknowledgedErrorTuple = (
    ['MySQL', PolyORMMySQLExeception]
)

export type MySQLErrorArgOrNever<Source extends MySQLErrorCode | Error> = (
    Source extends string ? string : never
)