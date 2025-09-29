import type PolyORMMySQLException from "./MySQL"
import type { MySQLErrorCode } from "./MySQL/Static"

export interface PolyORMException extends Error {
    code: string
    errno: number
}

export type PolyORMErrorCode = (
    MySQLErrorCode
)