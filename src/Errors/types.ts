import type PolyORMMySQLException from "./MySQL"
import type { MySQLErrorCode } from "./MySQL/Static"

export interface PolyORMException extends Error {
    connection: string
    code: string
    errno: number
}

export type AcknowledgedErrorOrigin = 'MySQL'


export type PolyORMErrorCode = (
    MySQLErrorCode
)

export type AcknowledgedErrorTuple = (
    ['MySQL', PolyORMMySQLException]
)

export type MySQLErrorArgOrNever<Source extends MySQLErrorCode | Error> = (
    Source extends string ? string : never
)