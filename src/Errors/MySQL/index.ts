// Types
import type { Constructor } from "../../types"
import type { PolyORMException } from "../types"
import {
    MySQLErrorCodes,
    MySQLErrorNoCodes,
    MySQLErrorStates,
    MySQLErrorMessages,

    type MySQLErrorCode,
    type PolyORMMySQLErrorCode
} from "./Static"
import type {
    PolyORMMySQLExceptionsArgs
} from "./types"


export default
    abstract class PolyORMMySQLException
    extends Error
    implements PolyORMException {

    public readonly origin = 'MySQL'
    public abstract readonly polyORMCode: PolyORMMySQLErrorCode

    public code!: MySQLErrorCode
    public errno!: number

    public sqlState!: string
    public sqlMessage: string = '(NO SQL MESSAGE)'

    constructor(
        public connection?: string,
        public sql: string = '(NO SQL OPERATION)',
        ...args: PolyORMMySQLExceptionsArgs
    ) {
        super()

        Object.setPrototypeOf(this, new.target.prototype)

        this.fill(args)

        if (Error.captureStackTrace) Error.captureStackTrace(
            this,
            this.constructor
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public throw(): void {
        throw this
    }

    // Privates ---------------------------------------------------------------
    private fill(args: PolyORMMySQLExceptionsArgs): void {
        const [first] = args

        if (first instanceof Error) this.assignByError(first)
        else {
            this.name = this.constructor.name

            this.sqlMessage = this.buildMessage(...args)
            this.message = this.sqlMessage

            this.code = MySQLErrorCodes[this.polyORMCode]
            this.errno = MySQLErrorNoCodes[this.polyORMCode]
            this.sqlState = MySQLErrorStates[this.polyORMCode]
        }
    }

    // ------------------------------------------------------------------------

    private assignByError(error: Error): void {
        Object.assign(this, Object.entries(error).filter(
            ([key]) => ['code', 'errno', 'sql', 'sqlState', 'sqlMessage']
                .includes(key)
        ))
    }

    // ------------------------------------------------------------------------

    private buildMessage(...args: (string | number)[]): (
        string
    ) {
        let i = 0
        return MySQLErrorMessages[this.polyORMCode].replace(
            /%[sdufl]/g,
            () => String(args[i++])
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build(code: PolyORMMySQLErrorCode): (
        Constructor<PolyORMMySQLException>
    ) {
        return new Function(
            'PolyORMMySQLException',
            'code',
            `return class ${this.buildChildName(code)} 
                extends PolyORMMySQLException {
                public readonly polyORMCode = '${code}'
            }`
        )(this, code)
    }

    // ------------------------------------------------------------------------

    public static instantiate(
        code: PolyORMMySQLErrorCode,
        connection?: string,
        sql: string = '',
        ...args: PolyORMMySQLExceptionsArgs
    ): PolyORMMySQLException {
        return new (this.build(code))(code, connection, sql, ...args)
    }

    // ------------------------------------------------------------------------

    public static throwByCode(
        code: PolyORMMySQLErrorCode,
        connection?: string,
        sql?: string,
        ...args: PolyORMMySQLExceptionsArgs
    ) {
        throw this.instantiate(code, connection, sql, ...args)
    }

    // ------------------------------------------------------------------------

    public static throwByError(
        error: any,
        connection?: string,
    ) {
        throw new (new Function(
            'PolyORMMySQLException',
            `return class ${this.buildChildName(error.code, false)} 
                extends PolyORMMySQLException {
                public readonly polyORMCode = '${(
                this.convertCode(error.code) ?? error.code
            )}'
            }`
        )(this))(connection, error.sql, error)
    }

    // ------------------------------------------------------------------------

    public static throwOutOfOperation(
        code: PolyORMMySQLErrorCode,
        ...args: PolyORMMySQLExceptionsArgs
    ) {
        throw this.instantiate(code, undefined, undefined, ...args)
    }

    // ------------------------------------------------------------------------

    public static convertCode(code: MySQLErrorCode): (
        PolyORMMySQLErrorCode | undefined
    ) {
        const polyCode = Object.entries(MySQLErrorCodes).find(
            ([_, mySQLCode]) => mySQLCode === code
        )

        if (polyCode) return polyCode[0] as PolyORMMySQLErrorCode

        // throw this.invalidCode(code)
    }

    // ------------------------------------------------------------------------

    public static isMySQLError(code: string): boolean {
        return (Object.values(MySQLErrorCodes) as string[]).includes(code)
    }

    // Privates ---------------------------------------------------------------
    private static buildChildName(
        code: PolyORMMySQLErrorCode,
        sufix: boolean = true
    ): string {
        return code
            .split('_')
            .map(part => part[0] + part.slice(1).toLocaleLowerCase())
            .join('') + (
                sufix ? 'Exception' : ''
            )
    }
}

export type {
    PolyORMMySQLErrorCode,
    PolyORMMySQLExceptionsArgs
}