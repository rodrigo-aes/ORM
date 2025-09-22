// Exceptions
// - MySQL
import PolyORMMySQLExeception, {
    MySQLErrorCodes,
    type MySQLErrorCode
} from "./MySQL"

// Handlers
import { AcknowledgedExceptionHandler } from "./Handlers"

// Types
import type MySQLConnection from "../Connection"
import type { AcknowledgedErrorTuple, MySQLErrorArgOrNever } from "./types"


export default class PolyORMException {
    private constructor() {
        throw new Error('Not instantiable Error class')
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get MySQL(): typeof PolyORMMySQLExeception {
        return PolyORMMySQLExeception
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static throwAcknowledged(
        acknowledged: AcknowledgedErrorTuple,
        connection: string
    ): void {
        const [origin, exception] = acknowledged

        switch (origin) {
            case 'MySQL': return this.MySQL.throwByError(
                exception,
                connection
            )
        }
    }

    // ------------------------------------------------------------------------

    public static throwMySQLException<Source extends MySQLErrorCode | Error>(
        source: Source,
        connection: string,
        message: MySQLErrorArgOrNever<Source>,
        sql?: MySQLErrorArgOrNever<Source>,
        sqlState?: MySQLErrorArgOrNever<Source>,
    ): void {
        switch (typeof source) {
            case "string": return this.MySQL.throwByCode(
                source,
                connection,
                message,
                sql,
                sqlState,
            )

            case "object": return this.MySQL.throwByError(source, connection)
        }
    }
}

export {
    PolyORMMySQLExeception,
    AcknowledgedExceptionHandler,
    MySQLErrorCodes,

    type AcknowledgedErrorTuple,
    type MySQLErrorCode
}