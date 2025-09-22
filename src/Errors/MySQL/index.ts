// Types
import type { Constructor } from "../../types/General"
import {
    MySQLErrorCodes,
    MySQLErrorNoCodes,
    MySQLErrorStates,
    MySQLErrorMessages,

    type MySQLErrorCode,
    type PolyORMMySQLErrorCode
} from "./Static"
import type {
    PolyORMMySQLExceptionsArgs,
    PolyORMMySQLExceptionBuildTuple
} from "./types"


export default abstract class PolyORMMySQLException extends Error {
    protected abstract readonly polyORMCode: PolyORMMySQLErrorCode

    public code!: MySQLErrorCode
    public errno!: number
    public sqlState!: string

    public sql: string = ''
    public sqlMessage: string = ''

    constructor(
        public connection?: string,
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
        else this.assignByTuple(...args as PolyORMMySQLExceptionBuildTuple)

        this.name = this.constructor.name
        this.message = this.sqlMessage

        this.code = MySQLErrorCodes[this.polyORMCode]
        this.errno = MySQLErrorNoCodes[this.polyORMCode]
        this.sqlState = MySQLErrorStates[this.polyORMCode]
    }

    // ------------------------------------------------------------------------

    private assignByError(error: Error): void {
        Object.assign(this, Object.entries(error).filter(
            ([key]) => ['sql', 'sqlState', 'sqlMessage'].includes(key)
        ))
    }

    // ------------------------------------------------------------------------

    private assignByTuple(...args: PolyORMMySQLExceptionBuildTuple) {
        const [sql, messageArgs] = args

        Object.assign(this, {
            sql: sql ?? '',
            sqlMessage: this.buildMessage(...messageArgs)
        })
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
            `return class ${this.buildChildName(code)} extends PolyORMMySQLException {
                protected readonly polyORMCode = '${code}'
            }`
        )(this, code)
    }

    // ------------------------------------------------------------------------

    public static instantiate(
        code: PolyORMMySQLErrorCode,
        connection?: string,
        ...args: PolyORMMySQLExceptionsArgs
    ): PolyORMMySQLException {
        return new (this.build(code))(code, connection, ...args)
    }

    // ------------------------------------------------------------------------

    public static throwByCode(
        code: PolyORMMySQLErrorCode,
        connection?: string,
        ...args: PolyORMMySQLExceptionsArgs
    ) {
        throw this.instantiate(code, connection, ...args)
    }

    // ------------------------------------------------------------------------

    public static throwByError(
        error: any,
        connection?: string,
    ) {
        throw this.instantiate(
            this.convertCode(error.code as MySQLErrorCode),
            connection,
            error
        )
    }

    // ------------------------------------------------------------------------

    public static convertCode(code: MySQLErrorCode): PolyORMMySQLErrorCode {
        const polyCode = Object.entries(MySQLErrorCodes).find(
            ([_, mySQLCode]) => mySQLCode === code
        )

        if (polyCode) return polyCode[0] as PolyORMMySQLErrorCode

        throw new Error
    }

    // ------------------------------------------------------------------------

    public static isMySQLError(code: string): boolean {
        return (Object.values(MySQLErrorCodes) as string[]).includes(code)
    }

    // Privates ---------------------------------------------------------------
    private static buildChildName(code: PolyORMMySQLErrorCode): string {
        return code
            .split('_')
            .map(part => part[0] + part.slice(1).toLocaleLowerCase())
            .join('') + 'Exception'
    }
}

export type {
    PolyORMMySQLErrorCode,
    PolyORMMySQLExceptionsArgs
}