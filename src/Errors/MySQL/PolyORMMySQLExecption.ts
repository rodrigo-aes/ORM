// Types
import type {
    PolyORMMySQLExeception as PolyORMMySQLExeceptionInterface,
} from "../types"

import type { MySQLErrorCode } from "./Static"

import type MySQLConnection from "../../Connection"


export default abstract class PolyORMMySQLExeception
    extends Error
    implements PolyORMMySQLExeceptionInterface {

    constructor(
        public connection: string,
        public code: MySQLErrorCode,
        public errno: number,
        public sqlMessage: string,
        public sql: string = '',
        public sqlState: string = '',
    ) {
        super(sqlMessage)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = this.constructor.name

        if (Error.captureStackTrace) Error.captureStackTrace(
            this,
            this.constructor
        )
    }
}