// Exceptions
import TableAlredyExistsException from "./TableAlredyExistsException"
import UnknownTableException from "./UnknownTableException"

// Static
import { MySQLErrorCodes, type MySQLErrorCode } from "./Static"

// Types
import type { Constructor } from "../../types/General"
import type MySQLConnection from "../../Connection"

export default class PolyORMMySQLExeception {
    private constructor() {
        throw new Error
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get UnknownTableException(): typeof UnknownTableException {
        return UnknownTableException
    }

    // ------------------------------------------------------------------------

    public static get TableAlredyExistsException(): (
        typeof TableAlredyExistsException
    ) {
        return TableAlredyExistsException
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static throwByCode(
        code: MySQLErrorCode,
        connection: string,
        message: string,
        sql?: string,
        sqlState?: string,
    ): void {
        throw new (this.getExceptionByCode(code))(
            connection,
            message,
            sql,
            sqlState,
        )
    }

    // ------------------------------------------------------------------------

    public static throwByError(
        error: any,
        connection: string
    ): void {
        return this.throwByCode(
            error.code,
            connection,
            error.sql,
            error.sqlState,
            error.sqlMessage
        )
    }

    // ------------------------------------------------------------------------

    public static getExceptionByCode(code: MySQLErrorCode): (
        Constructor<PolyORMMySQLExeception>
    ) {
        switch (code) {
            case MySQLErrorCodes.TABLE_ALREADY_EXISTS: return (
                this.TableAlredyExistsException
            )

            case MySQLErrorCodes.UNKNOWN_TABLE: return (
                this.UnknownTableException
            )

            default: throw new Error
        }
    }
}

export {
    MySQLErrorCodes,
    type MySQLErrorCode
}