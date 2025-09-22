// Exceptions
// - MySQL
import PolyORMMySQLException, {
    type PolyORMMySQLErrorCode,
    type PolyORMMySQLExceptionsArgs
} from './MySQL'

// Handlers
import { AcknowledgedExceptionHandler } from "./Handlers"

// Types
import MySQLConnection from '../Connection'
import type { AcknowledgedErrorTuple } from "./types"


export default class PolyORMException {
    private constructor() {
        throw new Error('Not instantiable class')
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get MySQL(): typeof PolyORMMySQLException {
        return PolyORMMySQLException
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static throwByCode(
        connection: MySQLConnection,
        code: PolyORMMySQLErrorCode,
        ...args: PolyORMMySQLExceptionsArgs
    ) {
        switch (true) {
            case connection instanceof MySQLConnection: return (
                this.MySQL.throwByCode(code, connection.name, ...args)
            )
        }
    }

    // ------------------------------------------------------------------------

    public static throwByError(
        connection: MySQLConnection,
        error: any
    ) {
        switch (true) {
            case connection instanceof MySQLConnection: return (
                this.MySQL.throwByError(error, connection.name)
            )
        }
    }
}

export {
    PolyORMMySQLException,
    AcknowledgedExceptionHandler,
    PolyORMMySQLErrorCode,

    type AcknowledgedErrorTuple,
}