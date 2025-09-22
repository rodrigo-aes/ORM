import PolyORMMySQLExeception from "../PolyORMMySQLExecption"

// Static
import { MySQLErrorCodes } from "../Static"

// Types
import type MySQLConnection from "../../../Connection"

export default class TableAlredyExistsException extends PolyORMMySQLExeception {
    constructor(
        connection: string,
        sql: string,
        sqlState: string,
        sqlMessage: string
    ) {
        super(
            connection,
            MySQLErrorCodes.TABLE_ALREADY_EXISTS,
            1051,
            sql,
            sqlState,
            sqlMessage
        )
    }
}