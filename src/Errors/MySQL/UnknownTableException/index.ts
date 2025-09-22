import PolyORMMySQLExeception from "../PolyORMMySQLExecption"
import { MySQLErrorCodes } from "../Static"

// Types
import type MySQLConnection from "../../../Connection"

export default class UnknownTableException extends PolyORMMySQLExeception {
    constructor(
        connection: string,
        sql: string,
        sqlState: string,
        sqlMessage: string
    ) {
        super(
            connection,
            MySQLErrorCodes.UNKNOWN_TABLE,
            1051,
            sql,
            sqlState,
            sqlMessage
        )
    }
}