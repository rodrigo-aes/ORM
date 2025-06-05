import { createPool, type Pool } from 'mysql2/promise'

// Syncronizer
import Syncronizer from '../Syncronizer'

// Handlers
import { MetadataHandler } from '../Metadata'

// Types
import type { MySQLConnectionConfig } from './types'
import type { EntityTarget } from '../../types/General'

export default class MySQLConnection {
    private pool!: Pool
    public entities: EntityTarget[] = []

    private config: MySQLConnectionConfig

    constructor(config: MySQLConnectionConfig) {
        const { entities, ...rest } = config
        this.config = rest

        if (entities) this.entities = entities

        this.pool = createPool({
            ...this.config,
            waitForConnections: true,
            connectionLimit: this.config.connectionLimit ?? 10,
            queueLimit: 0,
            multipleStatements: true
        })

        this.onInstantiate()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
        const [rows] = await this.pool.execute(sql, params)
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
    private onInstantiate() {
        MetadataHandler.normalizeMetadata()
        MetadataHandler.registerEntitiesConnection(this, ...this.entities)
    }
}