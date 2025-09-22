
import { AsyncLocalStorage } from "async_hooks"

// Utils
import Log from "../../../utils/Log"
import { MigrationTemplate } from "../../../ModuleTemplates"

// Config
import Config from "../../../Config"

// Types
import type Migrator from "../.."
import type DatabaseSchema from "../../../DatabaseSchema"
import type { TableSchema, ActionType } from "../../../DatabaseSchema"
import type MigrationsTableHandler from "../../MigrationsTableHandler"
import type MigrationFileHandler from "../../MigrationFileHandler"
import type { MigrationRunMethod } from "../../types"

import type {
    // Method names 
    MainProcessMethod,
    ChildProccessMethod,
    SQLTableOperationMethod,
    CreateMigrationFileMethod,

    // This args
    SQLTableOperationThisArg,

    // Args
    ChildProccessArgs,
    CreateMigrationFileArgs,

    // Descriptos
    DefaultVoidDescriptor,
    ChildProccessDescriptor,
    CreateMigrationDescriptor,
    DeleteMigrationDescriptor,
    MoveMigrationDescriptor,
    InsertMigrationDescriptor,
    EraseMigrationDescriptor,
    CreateMigrationFileDescriptor,
    DeleteMigrationFileDescriptor,
    IncludedDescriptor,
    UnknownMigrationFilesDescriptor
} from "./types"

export default class Logs {
    private static _storage?: AsyncLocalStorage<{ parentProccess: string }>

    // Static Getters =========================================================
    // Privates ---------------------------------------------------------------
    private static get storage(): (
        AsyncLocalStorage<{ parentProccess: string }>
    ) {
        if (this._storage) return this._storage
        return this._storage = new AsyncLocalStorage
    }

    // ------------------------------------------------------------------------

    private static get hasParent(): boolean {
        return !!this._storage?.getStore()?.parentProccess
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static InitProccess(
        _: Migrator,
        __: 'init',
        descriptor: DefaultVoidDescriptor
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: Migrator
        ) {
            const initAt = Date.now()

            Logs.initProcessInitLog((this as any).connection.name)
            await proccess.apply(this)
            Logs.initProcessDoneLog(
                (this as any).connection.name,
                initAt
            )
        }
    }

    // ------------------------------------------------------------------------

    public static RunMainProcess(
        _: Migrator,
        method: MainProcessMethod,
        descriptor: DefaultVoidDescriptor
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (this: Migrator) {
            const initAt = Date.now()
            Logs.mainProcessInitLog(
                method,
                (this as any).connection.name
            )

            await proccess.apply(this)

            Logs.mainProcessDoneLog(
                method,
                (this as any).connection.name,
                initAt
            )
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static RunChildProcess<Method extends ChildProccessMethod>(
        _: Migrator,
        method: Method,
        descriptor: ChildProccessDescriptor<Method>
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: Migrator,
            ...args: ChildProccessArgs<Method>
        ) {
            const [_, Migration] = args
            const initAt = Date.now()

            Logs.childProcessInitLog(
                Logs.migrationMethod(method),
                Migration.name
            )

            await proccess.apply(this, args)
            Logs.childProcessDoneLog(initAt)
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static SyncProccess(
        _: Migrator,
        __: 'sync',
        descriptor: DefaultVoidDescriptor
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (this: Migrator) {
            const initAt = Date.now()

            Logs.syncProcessInitLog((this as any).connection.name)
            await proccess.apply(this)
            Logs.syncProcessDoneLog(
                (this as any).connection.name,
                initAt
            )
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static SQLTableOperation<
        Method extends SQLTableOperationMethod
    >(
        _: SQLTableOperationThisArg<Method>,
        method: Method,
        descriptor: DefaultVoidDescriptor,
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: SQLTableOperationThisArg<Method>,
            ...args: any[]
        ) {
            const initAt = Date.now()
            const asParent = ['createAll', 'dropAll'].includes(method)
            const name = asParent
                ? (this as DatabaseSchema).connection.name
                : (this as TableSchema).name

            Logs.SQLTableOperationInitLog(method, name, asParent)

            if (asParent) await Logs.storage.run(
                {
                    parentProccess: method
                },
                async () => await proccess.apply(this, args)
            )

            else await proccess.apply(this, args)

            Logs.SQLTableOperationDoneLog(method, initAt, asParent)
        }

        return descriptor
    }

    // ------------------------------------------------------------------------ 

    public static CreateMigrationProcess(
        _: Migrator,
        __: 'create',
        descriptor: CreateMigrationDescriptor
    ) {
        const orignalMethod = descriptor.value!

        descriptor.value = async function (
            this: Migrator,
            action: ActionType,
            tableName: string,
            className?: string,
            at?: number
        ) {
            const initAt = Date.now()
            const name = className ?? MigrationTemplate.buildClassName(
                action,
                tableName
            )

            Logs.createMigrationProccessInitLog(
                name,
                (this as any).connection.name
            )

            await orignalMethod.apply(this, [action, tableName, className, at])

            Logs.createMigrationProcessDoneLog(
                name,
                (this as any).connection.name,
                initAt
            )
        }

        return descriptor
    }

    // ------------------------------------------------------------------------ 

    public static DeleteMigrationProcess(
        _: Migrator,
        __: 'delete',
        descriptor: DeleteMigrationDescriptor
    ) {
        const orignalMethod = descriptor.value!

        descriptor.value = async function (
            this: Migrator,
            id: string | number
        ) {
            const initAt = Date.now()

            Logs.deleteMigrationProccessInitLog(
                id,
                (this as any).connection.name
            )

            await orignalMethod.apply(this, [id])

            Logs.deleteMigrationProcessDoneLog(
                id,
                (this as any).connection.name,
                initAt
            )
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static MoveMigrationProccess(
        _: Migrator,
        __: 'move',
        descriptor: MoveMigrationDescriptor
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: Migrator,
            from: number,
            to: number
        ) {
            const initAt = Date.now()

            Logs.moveMigrationProccessInitLog(
                from, to, (this as any).connection.name
            )

            await proccess.apply(this, [from, to])
            Logs.moveMigrationProcessDoneLog(initAt)
        }
    }

    // ------------------------------------------------------------------------

    public static RegisterMigrationsProccess(
        _: Migrator,
        __: 'register',
        descriptor: DefaultVoidDescriptor
    ) {
        const orignalMethod = descriptor.value!

        descriptor.value = async function (this: Migrator) {
            const initAt = Date.now()

            Logs.registerMigrationsProccessInitLog(
                (this as any).connection.name
            )

            await orignalMethod.apply(this)

            Logs.registerMigrationsProccessDoneLog(
                (this as any).connection.name,
                initAt
            )
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static RegisterMigration(
        _: MigrationsTableHandler,
        __: 'insert',
        descriptor: InsertMigrationDescriptor,
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: MigrationsTableHandler,
            name: string,
            ...args: any[]
        ) {
            const initAt = Date.now()

            Logs.registerMigrationInitLog(name)
            const result = await proccess.apply(this, [name, ...args])
            Logs.registerMigrationDoneLog(initAt)

            return result
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static EraseMigration(
        _: MigrationsTableHandler,
        __: 'delete',
        descriptor: EraseMigrationDescriptor,
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: MigrationsTableHandler,
            id: string | number
        ) {
            const initAt = Date.now()

            Logs.eraseMigrationInitLog(id)
            const result = await proccess.apply(this, [id])
            Logs.eraseMigrationDoneLog(initAt)

            return result
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static CreateMigrationFile<
        Method extends CreateMigrationFileMethod
    >(
        _: MigrationFileHandler,
        __: Method,
        descriptor: CreateMigrationFileDescriptor<Method>,
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: MigrationFileHandler,
            dir: string,
            action: ActionType,
            props: CreateMigrationFileArgs<Method>
        ) {
            const initAt = Date.now()

            Logs.createMigrationFileInitLog(
                dir,
                props.fileName + Config.migrationsExt
            )

            proccess.apply(this, [dir, action, props])
            Logs.createMigrationFileDoneLog(initAt)
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static DeleteMigrationFile(
        _: MigrationFileHandler,
        __: 'delete',
        descriptor: DeleteMigrationFileDescriptor,
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: MigrationFileHandler,
            deleted: number
        ) {
            const initAt = Date.now()

            Logs.deleteMigrationFileInitLog(
                deleted,
                this.dir
            )

            proccess.apply(this, [deleted])
            Logs.deleteMigrationFileDoneLog(initAt)
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static NothingToRun(
        _: Migrator,
        __: 'included',
        descriptor: IncludedDescriptor
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: Migrator,
            method: MigrationRunMethod
        ) {
            const included = await proccess.apply(this, [method])
            if (included.length === 0) Logs.nothingToRunLog(method)

            return included
        }

        return descriptor
    }

    // ------------------------------------------------------------------------

    public static NothingToRegister(
        _: Migrator,
        __: 'unknownMigrationFiles',
        descriptor: UnknownMigrationFilesDescriptor
    ) {
        const proccess = descriptor.value!

        descriptor.value = async function (
            this: Migrator,
            silent: boolean = true
        ) {
            const unknown = await proccess.apply(this, [silent])
            if (!silent && unknown.length === 0) (
                Logs.nothingToRegisterLog()
            )

            return unknown
        }

        return descriptor
    }

    // Privates ---------------------------------------------------------------
    // MAIN PROCCESS LOGS -----------------------------------------------------
    private static initProcessInitLog(connection: string) {
        Log.composedLine(
            `\n#[default]Initializing migrations service dependencies for connection #[warning]${connection}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static initProcessDoneLog(connection: string, initAt: number) {
        Log.composedLine(
            `#[success]INITIALIZED #[default]migrations service for connection #[warning]${connection}#[default]`,
            {
                color: 'success',
                content: (
                    `IN: ${((Date.now() - initAt) / 1000).toFixed(1)}s\n`
                )
            }
        )
    }

    // MAIN PROCCESS LOGS -----------------------------------------------------
    private static mainProcessInitLog(
        method: MainProcessMethod,
        connection: string
    ) {
        Log.composedLine(
            `\n#[default]Initializing migrations #[warning]${method.toUpperCase()} #[default]proccess for connection #[warning]${connection}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
        Log.out('')
    }

    // ------------------------------------------------------------------------

    private static mainProcessDoneLog(
        method: MainProcessMethod,
        connection: string,
        initAt: number
    ) {
        Log.composedLine(
            `#[default]Migration #[warning]${method.toUpperCase()} #[default]proccess for connection #[warning]${connection} #[success]DONE:#[default]`,
            {
                color: 'success',
                content: (
                    `IN: ${((Date.now() - initAt) / 1000).toFixed(1)}s\n`
                )
            }
        )
    }

    // CHILD PROCCESS LOGS ----------------------------------------------------
    private static childProcessInitLog(
        method: 'UP' | 'DOWN',
        migration: string
    ) {
        Log.composedLine(
            `Running #[warning]${method} #[default]migration: #[info]${migration}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static childProcessDoneLog(initAt: number) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(`#[success]DONE:#[default]`, {
            color: 'success',
            content: `IN: ${doneIn < 10 ? '0' + doneIn : doneIn}ms\n`
        })
    }

    // SYNC PROCCESS LOGS -----------------------------------------------------
    private static syncProcessInitLog(connection: string) {
        Log.composedLine(
            `\n#[default]Initializing migrations #[warning]SYNC #[default]by #[info]Metadata #[default]proccess for connection #[warning]${connection}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static syncProcessDoneLog(connection: string, initAt: number) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[default]Migrations #[warning]SYNC #[default]proccess for connection #[warning]${connection} #[success]DONE:#[default]`,
            {
                color: 'success',
                content: `IN: ${doneIn < 10 ? '0' + doneIn : doneIn}ms\n`
            }
        )
    }

    // SQL TABLE OPERATION LOGS -----------------------------------------------
    private static SQLTableOperationInitLog(
        method: SQLTableOperationMethod,
        name: string,
        asParent: boolean = false
    ) {
        Log.composedLine(
            `#[default]${Logs.SQLOperationInitProcess(method, name)} #[warning]${name}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )

        if (asParent) Log.out('')
    }

    // ------------------------------------------------------------------------

    private static SQLTableOperationDoneLog(
        method: SQLTableOperationMethod,
        initAt: number,
        asParent: boolean = false
    ) {
        let doneIn: string | number = (Date.now() - initAt)

        doneIn = asParent
            ? (doneIn / 1000).toFixed(1)
            : doneIn < 10 ? '0' + doneIn : doneIn

        doneIn += asParent ? 's' : 'ms'
        doneIn += this.hasParent ? '\n' : ''

        Log.composedLine(
            `#[success]${Logs.SQLOperationDoneProcess(method)}#[default]`,
            {
                color: 'success',
                content: `IN: ${doneIn}`
            }
        )
    }

    // CREATE MIGRATION PROCCESS LOGS -----------------------------------------
    private static createMigrationProccessInitLog(name: string, connection: string) {
        Log.composedLine(
            `\n#[default]Creating migration #[info]${name} #[default]for connection #[warning]${connection}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static createMigrationProcessDoneLog(
        name: string,
        connection: string,
        initAt: number
    ) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[success]CREATED #[default]migration #[info]${name} #[default]for connection #[warning]${connection}#[default]`,
            {
                color: 'success',
                content: `IN: ${(doneIn / 1000).toFixed(1)}s\n`
            }
        )
    }

    // DELETE MIGRATION PROCCESS LOGS -----------------------------------------
    private static deleteMigrationProccessInitLog(
        id: string | number,
        connection: string
    ) {
        Log.composedLine(
            `\n#[default]Deleting ${this.migrationIdentifier(id)} #[default]for connection #[warning]${connection}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static deleteMigrationProcessDoneLog(
        id: string | number,
        connection: string,
        initAt: number
    ) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[success]DELETED #[default]${this.migrationIdentifier(id)} #[default]for connection #[warning]${connection}#[default]`,
            {
                color: 'success',
                content: `IN: ${(doneIn / 1000).toFixed(1)}s\n`
            }
        )
    }

    // MOVE MIGRATION PROCCESS LOGS -------------------------------------------
    private static moveMigrationProccessInitLog(
        from: number,
        to: number,
        connection: string
    ) {
        Log.composedLine(
            `\n#[default]MOVING migration at position #[info]${from} #[default]to #[info]${to} #[default]fo connection #[warning]${connection}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static moveMigrationProcessDoneLog(initAt: number) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[success]MOVED#[default]`,
            {
                color: 'success',
                content: `IN: ${(doneIn / 1000).toFixed(1)}s\n`
            }
        )
    }

    // REGISTER MIGRATIONS PROCCESS LOGS --------------------------------------
    private static registerMigrationsProccessInitLog(connection: string) {
        Log.composedLine(
            `\n#[default]Initializing #[warning]REGISTER UNKNOWN #[default]migrations proccess for connection #[warning]${connection}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static registerMigrationsProccessDoneLog(
        connection: string,
        initAt: number
    ) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[warning]REGISTER UNKNOWN #[default]migrations proccess for connection #[warning]${connection}#[success] DONE:#[default]`,
            {
                color: 'success',
                content: `IN: ${(doneIn / 1000).toFixed(1)}s\n`
            }
        )
    }

    // REGISTER MIGRATION LOGS ------------------------------------------------
    private static registerMigrationInitLog(name: string) {
        Log.composedLine(
            `\n#[default]REGISTERING migration #[info]${name} #[default]on database#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static registerMigrationDoneLog(initAt: number) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[success]REGISTERED#[default]`,
            {
                color: 'success',
                content: `IN: ${doneIn < 10 ? '0' + doneIn : doneIn}ms`
            }
        )
    }

    // ERASE MIGRATION LOGS ---------------------------------------------------
    private static eraseMigrationInitLog(id: string | number) {
        Log.composedLine(
            `\n#[default]DELETING ${this.migrationIdentifier(id)} #[default]register on database#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static eraseMigrationDoneLog(initAt: number) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[success]DELETED#[default]`,
            {
                color: 'success',
                content: `IN: ${doneIn < 10 ? '0' + doneIn : doneIn}ms`
            }
        )
    }

    // CREATE MIGRATION FILE LOGS ---------------------------------------------
    private static createMigrationFileInitLog(
        dir: string,
        fileName: string
    ) {
        Log.composedLine(
            `#[default]CREATING migration file #[info]${fileName} #[default]on connection dir #[warning]${dir}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static createMigrationFileDoneLog(initAt: number) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[success]CREATED#[default]`,
            {
                color: 'success',
                content: `IN: ${doneIn < 10 ? '0' + doneIn : doneIn}ms\n`
            }
        )
    }

    // DELETE MIGRATION FILE LOGS ---------------------------------------------
    private static deleteMigrationFileInitLog(
        deleted: number,
        dir: string
    ) {
        Log.composedLine(
            `#[default]DELETING migration file at position #[info]${deleted} #[default]on connection dir #[warning]${dir}#[default]`,
            {
                color: 'warning',
                asset: 'time'
            }
        )
    }

    // ------------------------------------------------------------------------

    private static deleteMigrationFileDoneLog(initAt: number) {
        const doneIn = (Date.now() - initAt)

        Log.composedLine(
            `#[success]DELETED#[default]`,
            {
                color: 'success',
                content: `IN: ${doneIn < 10 ? '0' + doneIn : doneIn}ms\n`
            }
        )
    }

    // NOTHING TO RUN LOG -----------------------------------------------------
    private static nothingToRunLog(method: MigrationRunMethod) {
        Log.composedLine(
            `#[default]Nothing to run #[warning]${Logs.migrationMethod(method)}!#[default]`,
            {
                color: 'success',
                content: (
                    `STATUS: All already migrated: #[warning]${method.toUpperCase()}\n`
                )
            }
        )
    }

    // NOTHING TO REGISTER LOG ------------------------------------------------
    private static nothingToRegisterLog() {
        Log.composedLine(
            `\n#[default]NOTHING TO REGISTER: #[info]0 unknown migrations #[default]found#[default]`,
            {
                color: 'success',
                content: (
                    `STATUS: All migrations as already registered\n`
                )
            }
        )
    }

    // AUXILIAR PARTIALS ------------------------------------------------------
    private static migrationMethod(
        method: 'run' | 'back' | 'runMigration' | 'backMigration'
    ): 'UP' | 'DOWN' {
        switch (method) {
            case 'run':
            case "runMigration": return 'UP'

            case 'back':
            case "backMigration": return 'DOWN'
        }
    }

    // ------------------------------------------------------------------------

    private static SQLOperationInitProcess(
        method: SQLTableOperationMethod,
        name: string
    ) {
        switch (method) {
            case "create": return 'CREATING TABLE'
            case "alter": return 'ALTERING TABLE'
            case "drop": return 'DROPPING TABLE'
            case "createAll": return `CREATING ALL TABLES for connection`
            case "dropAll": return `DROPPING ALL TABLES for connection`
        }
    }

    // ------------------------------------------------------------------------

    private static SQLOperationDoneProcess(method: SQLTableOperationMethod) {
        switch (method) {
            case "create": return 'CREATED'
            case "alter": return 'ALTERED'
            case "drop": return 'DROPPED'
            case "createAll": return 'CREATED ALL TABLES'
            case "dropAll": return 'DROPPED ALL TABLES'
        }
    }

    // ------------------------------------------------------------------------

    private static migrationIdentifier(id: string | number) {
        switch (typeof id) {
            case "string": return `migration #[info]${id}`
            case "number": return `migration on #[info]position: ${id}`
        }
    }
}