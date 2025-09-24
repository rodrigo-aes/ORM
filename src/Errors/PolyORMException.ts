// Types
import type { Constructor } from "../types/General"
import type { PolyORMException as PolyORMExceptionInterface } from "./types"

export default
    abstract class PolyORMException<
        ErrorCode extends string = string,
        ErrorNoCodes extends Record<ErrorCode, number> = (
            Record<ErrorCode, number>
        ),
        ErrorStates extends Record<ErrorCode, string> = (
            Record<ErrorCode, string>
        ),
        ErrorMessages extends Record<ErrorCode, string> = (
            Record<ErrorCode, string>
        )
    >
    extends Error
    implements PolyORMExceptionInterface {
    protected abstract readonly errnos: ErrorNoCodes
    protected abstract readonly states: ErrorStates
    protected abstract readonly messages: ErrorMessages

    public errno!: ErrorNoCodes[ErrorCode]
    public state!: ErrorStates[ErrorCode]

    constructor(public code: ErrorCode, ...args: any[]) {
        super()

        this.name = this.constructor.name
        this.message = this.buildMessage(...args)

        this.fill()

        if (Error.captureStackTrace) Error.captureStackTrace(
            this,
            this.constructor
        )
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    private buildMessage(...args: any[]): string {
        let i = 0
        return this.messages[this.code].replace(
            /%[sdufl]/g,
            () => {
                const value = args[i++]
                return String(Array.isArray(value)
                    ? value.join(', ')
                    : value
                )
            }
        )
    }

    // Privates ---------------------------------------------------------------
    private fill(): void {
        this.errno = this.errnos[this.code]
        this.state = this.states[this.code]
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build<T extends PolyORMException>(
        this: new (...args: any[]) => T,
        code: T['code'],
    ): Constructor<PolyORMException> {
        return new Function(
            'PolyORMException',
            `return class ${(
                (this as typeof PolyORMException & (new (...args: any[]) => T))
                    .buildChildName(code)
            )} extends PolyORMException {}`
        )(this)
    }

    // ------------------------------------------------------------------------

    public static instantiate<T extends PolyORMException>(
        this: new (...args: any[]) => T,
        code: T['code'],
        ...args: any[]
    ): PolyORMException {
        return new (
            (this as typeof PolyORMException & (new (...args: any[]) => T))
                .build(code)
        )(code, ...args)
    }

    // ------------------------------------------------------------------------

    public static throw<T extends PolyORMException>(
        this: new (...args: any[]) => T,
        code: T['code'],
        ...args: any[]
    ): void {
        throw (this as typeof PolyORMException & (new (...args: any[]) => T))
            .instantiate(code, ...args)
    }

    // Privates ---------------------------------------------------------------
    private static buildChildName(code: string): string {
        return code
            .split('_')
            .map(part => part[0] + part.slice(1).toLocaleLowerCase())
            .join('') + 'Exception'
    }
}