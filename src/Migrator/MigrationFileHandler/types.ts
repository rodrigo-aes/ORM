import type { EntityMetadata } from "../../Metadata"
import type { TableSchema } from "../../DatabaseSchema"
import type { MigrationData } from "../MigrationsTableHandler"

export type CreateMigrationFileProps = MigrationData & {
    tableName: string
}

export type SyncMigrationFileProps = CreateMigrationFileProps & {
    metadata: EntityMetadata
    schemas: [TableSchema, TableSchema | undefined]
}