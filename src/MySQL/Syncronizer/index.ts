import { EntityMetadata, JoinTableMetadata } from "../Metadata"
import { EntityTableBuilder, JoinTableBuilder } from "./TableBuilder"

import DatabaseSchema, {
    type TableSchema,
    type TableColumnAction
} from "./DatabaseSchema"

// Utils
import Log from "../../utils/Log"

// Static
import { defaultConfig } from "./static"

// Types
import type MySQLConnection from "../Connection"
import type { SyncronizerConfig, SyncronizerTables } from "./types"

export default class Syncronizer {
    private tables: SyncronizerTables
    private config: SyncronizerConfig

    constructor(
        private connection: MySQLConnection,
        config: SyncronizerConfig = {}
    ) {
        this.tables = this.orderedTables()
        this.config = { ...defaultConfig, ...config }
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async reset() {
        await this.dropTables()
        await this.createTables()
    }

    // ------------------------------------------------------------------------

    public async alter() {
        const actions = (
            (await new DatabaseSchema(this.connection).loadDatabaseSchema())
                .toSyncTablesActions(this.tables)
        )

        for (const [action, table, columns] of actions) switch (action) {
            case "CREATE":
                await (table as (EntityTableBuilder)).create(this.connection)
                break

            // ----------------------------------------------------------------

            case "ALTER":
                await (table as (EntityTableBuilder)).alter(
                    this.connection,
                    columns as TableColumnAction[]
                )
                break

            // ----------------------------------------------------------------

            case "DROP":
                await (table as TableSchema).drop(this.connection)
                break
        }
    }

    // Privates ---------------------------------------------------------------
    private orderedTables() {
        return this.loadTables().sort(
            (a, b) => {
                if (a instanceof JoinTableBuilder) return 1
                if (b instanceof JoinTableBuilder) return -1

                return a.dependencies.includes(b.target) ? 1 : -1
            }
        )
    }

    // ------------------------------------------------------------------------

    private loadTables(): SyncronizerTables {
        return [
            ...this.loadEntityTables(),
            ...this.loadJoinTables()
        ]
    }

    // ------------------------------------------------------------------------

    private loadEntityTables() {
        return this.connection.entities.map(
            target => new EntityTableBuilder(EntityMetadata.findOrBuild(
                target
            ))
        )
    }

    // ------------------------------------------------------------------------

    private loadJoinTables(): SyncronizerTables {
        return this.uniqueJoinTablesMetadata()
            .map(metadata => new JoinTableBuilder(metadata))
    }

    // ------------------------------------------------------------------------

    private uniqueJoinTablesMetadata() {
        return [
            ...new Set<JoinTableMetadata>(
                this.connection.entities.flatMap(
                    target => JoinTableMetadata.findByTarget(target)
                )
            )
        ]
    }

    // ------------------------------------------------------------------------

    private async createTables() {
        this.createTablesLog()

        for (const entity of this.tables) await entity.create(
            this.connection
        )

        this.createdTablesLog()
    }

    // ------------------------------------------------------------------------

    private async dropTables() {
        this.dropAllTablesLog()
        await this.foreignKeysCheck(false)

        for (const { tableName } of this.tables) await this.dropTable(
            tableName
        )

        await this.foreignKeysCheck(true)
        this.droppedAllTablesLog()
    }

    // ------------------------------------------------------------------------

    private async dropTable(tableName: string) {
        this.droppingTableLog(tableName)
        await this.connection.query(`DROP TABLE IF EXISTS \`${tableName}\``)
        this.droppedTableLog(tableName)
    }

    // ------------------------------------------------------------------------

    private foreignKeysCheck(active: boolean) {
        return this.connection.query(
            `SET FOREIGN_KEY_CHECKS = ${active ? 1 : 0}`
        )
    }

    // ------------------------------------------------------------------------

    private createTablesLog() {
        if (this.config.logging) {
            Log.composedLine('#[warning]Syncronizing all tables', 'datetime')
            Log.out('')
        }
    }

    // ------------------------------------------------------------------------

    private createdTablesLog() {
        if (this.config.logging) {
            Log.composedLine('#[success]Tables syncronized SUCCESS', 'time')
        }
    }

    // ------------------------------------------------------------------------

    private dropAllTablesLog() {
        if (this.config.logging) {
            Log.composedLine('#[warning]Dropping all tables', 'datetime')
            Log.out('')
        }
    }

    // ------------------------------------------------------------------------

    private droppedAllTablesLog() {
        if (this.config.logging) {
            Log.composedLine('#[success]All tables dropped SUCCESS', 'time')
            Log.out('')
        }
    }

    // ------------------------------------------------------------------------

    private droppingTableLog(tableName: string) {
        if (this.config.logging) Log.composedLine(
            `Dropping table #[info]${tableName}`, 'time'
        )
    }

    // ------------------------------------------------------------------------

    private droppedTableLog(tableName: string) {
        if (this.config.logging) {
            Log.composedLine(
                `Table #[info]${tableName} #[default]dropped #[success]SUCCESS`,
                'time'
            )
            Log.out('')
        }
    }
}