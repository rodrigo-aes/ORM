import 'reflect-metadata'
import { createPool, type Pool } from 'mysql2/promise'

// Config
import Config from '../Config'

// Metadata
import { ConnectionsMetadata, MetadataHandler } from '../Metadata'

// Syncronizer
import Syncronizer from '../Syncronizer'

// Handlers
import { ProceduresHandler } from '../SQLBuilders'

// Utils
import Log from '../utils/Log'

// Types
import type {
    MySQLConnectionConfig,
    MySQLConnectionInstance,
    MySQLConnection as MySQLConnectionInterface
} from './types'

import type { EntityTarget } from '../types/General'

export default class MySQLConnection implements MySQLConnectionInstance {
    public readonly type = 'MySQL'
    public static readonly type = 'MySQL'

    /** @internal */
    private static readonly DEFAULT_CONF: Partial<MySQLConnectionConfig> = {
        connectionLimit: 10,
        logging: true,
        sync: false
    }

    /** @internal */
    private pool!: Pool

    /** @internal */
    private config: MySQLConnectionConfig

    private constructor(
        public name: string,
        config: MySQLConnectionConfig
    ) {
        this.config = { ...MySQLConnection.DEFAULT_CONF, ...config }
        ConnectionsMetadata.set(
            name,
            this as unknown as MySQLConnectionInterface
        )

        return new Proxy(this, {
            get: (target, prop) => prop in target
                ? (target as this)[prop as keyof this]
                : config[prop as keyof MySQLConnectionConfig]
        });
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entities(): EntityTarget[] {
        return this.config.entities ?? []
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Execute a SQL query in database
     * @param sql - SLQ
     * @param params - Bind params
     * @returns - Query result
     */
    public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
        this.sqlLogging(sql)

        const [rows] = await this.pool.query(sql, params)
        return rows as T[];
    }

    // ------------------------------------------------------------------------

    /**
     * Close connection
     */
    public async close(): Promise<void> {
        return this.pool.end()
    }

    // ------------------------------------------------------------------------

    /**
     * Sync database tables
     * @param mode - Case `alter` syncronize only database changes case `reset`
     * drop all tables and syncronize all
     */
    public async sync(mode: 'alter' | 'reset'): Promise<void> {
        const syncronizer = new Syncronizer(this, {
            logging: true
        })

        switch (mode) {
            case 'reset': return syncronizer.reset()
            case 'alter': return syncronizer.alter()
        }
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private async init(): Promise<this> {
        await Config.load()
        this.instantiatePool()
        await this.afterConnect()

        return this
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private instantiatePool() {
        this.pool = createPool({
            ...this.config,
            waitForConnections: true,
            multipleStatements: true,
            queueLimit: 0,
        })
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private async afterConnect() {
        MetadataHandler.normalizeMetadata()
        MetadataHandler.registerConnectionEntities(this, ...this.entities)
        await ProceduresHandler.register(this)

        if (this.config.sync) await this.sync('alter')
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private sqlLogging(
        sql: string,
    ) {
        if (!this.config.logging) return

        switch (typeof this.config.logging) {
            case 'boolean': if (this.config.logging) Log.out(
                `#[warning]SQL: #[success]${sql}`
            )
                break

            case 'object': if (this.config.logging.sql) Log.out(
                `#[warning]SQL: #[success]${sql}`
            )
                break
        }

        Log.out('\n')
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /** Instantiate a connection and returns */
    public static createConnection(
        name: string,
        config: MySQLConnectionConfig
    ): Promise<MySQLConnectionInterface> {
        return new (MySQLConnection as any)(name, config).init() as (
            Promise<MySQLConnectionInterface>
        )
    }
}

export type {
    MySQLConnectionInterface as MySQLConnection
}