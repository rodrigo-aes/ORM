import { createPool, type Pool } from 'mysql2/promise'

// Metadata
import { ConnectionsMetadata, MetadataHandler } from '../Metadata'

// Syncronizer
import Syncronizer from '../Syncronizer'

// Handlers
import { RegisterProcedures } from '../SQLBuilders'

// Utils
import Log from '../../utils/Log'

// Types
import type {
    MySQLConnectionConfig,
    QueryOptions,
    LogginOptions,
    LogginConfig
} from './types'
import type { EntityTarget } from '../../types/General'

export default class MySQLConnection {
    private pool!: Pool
    public entities: EntityTarget[] = []

    public config: MySQLConnectionConfig
    private static defaultConfig: Partial<MySQLConnectionConfig> = {
        logging: true,
        autoSync: false
    }

    private logging?: LogginOptions
    private autoSync?: boolean

    private constructor(
        public name: string,
        config: MySQLConnectionConfig
    ) {
        const {
            entities,
            logging,
            autoSync,
            ...rest
        } = {
            ...config,
            ...MySQLConnection.defaultConfig
        }

        this.config = rest
        this.logging = logging
        this.autoSync = autoSync

        if (entities) this.entities = entities

        ConnectionsMetadata.set(name, this)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async query<T = any>(
        sql: string,
        params?: any[],
        options?: QueryOptions
    ): Promise<T[]> {
        this.sqlLogging(sql, options?.logging)

        const [rows] = await this.pool.query(sql, params)
        return rows as T[];
    }

    // ------------------------------------------------------------------------

    public getConnection() {
        return this.pool.getConnection()
    }

    // ------------------------------------------------------------------------

    public async close() {
        await this.pool.end()
    }

    // ------------------------------------------------------------------------

    public async sync(mode: 'alter' | 'reset') {
        const syncronizer = new Syncronizer(this, {
            logging: true
        })

        switch (mode) {
            case 'reset': return syncronizer.reset()
            case 'alter': return syncronizer.alter()
        }
    }

    // Privates ---------------------------------------------------------------
    private async init() {
        this.instantiatePool()
        await this.afterConnect()

        return this
    }

    // ------------------------------------------------------------------------

    private instantiatePool() {
        this.pool = createPool({
            ...this.config,
            waitForConnections: true,
            connectionLimit: this.config.connectionLimit ?? 10,
            queueLimit: 0,
            multipleStatements: true
        })
    }

    // ------------------------------------------------------------------------

    private async afterConnect() {
        MetadataHandler.normalizeMetadata()
        MetadataHandler.registerEntitiesConnection(this, ...this.entities)
        await RegisterProcedures.register(this)

        if (this.autoSync) await this.sync('alter')
    }

    // ------------------------------------------------------------------------

    private sqlLogging(
        sql: string,
        logging: LogginOptions | undefined = this.logging,
    ) {
        if (!logging) return

        switch (typeof logging) {
            case 'boolean': if (logging) Log.out(
                `#[warning]SQL: #[success]${sql}`
            )
                break

            case 'object': if ((logging as LogginConfig).sql) Log.out(
                `#[warning]SQL: #[success]${sql}`
            )
                break
        }

        Log.out('\n')
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static createConnection(name: string, config: MySQLConnectionConfig): (
        Promise<MySQLConnection>
    ) {
        return new MySQLConnection(name, config).init()
    }
}