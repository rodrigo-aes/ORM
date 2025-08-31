// Syncronizers
import DatabaseSyncronizer from "./DatabaseSyncronizer"

// Utils
import Log from "../../utils/Log"

// Static
import { defaultConfig } from "./static"

// Types
import type MySQLConnection from "../Connection"
import type { SyncronizerConfig } from "./types"

export default class Syncronizer {
    private config: SyncronizerConfig
    private database: DatabaseSyncronizer

    constructor(
        private connection: MySQLConnection,
        config: SyncronizerConfig = {}
    ) {
        this.config = { ...defaultConfig, ...config }

        this.database = DatabaseSyncronizer.buildFromConnectionMetadata(
            this.connection
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async alter(): Promise<void> {
        await this.database.alter()
        console.log('finished')
    }

    // ------------------------------------------------------------------------

    public async reset(): Promise<void> {
        await this.database.reset()
        console.log('finished')
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