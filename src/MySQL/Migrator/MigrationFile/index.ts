// Template
import { MigrationTemplate } from "../../ModuleTemplates";

// Types
import type { EntityMetadata } from "../../Metadata"
import type { TableSchema } from "../../DatabaseSchema";
import type { MigrationProps } from "../MigrationsTable"
import type { ActionType } from "../../DatabaseSchema"

export default class MigrationFile {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(
        dir: string,
        action: ActionType,
        tableName: string,
        properties: MigrationProps
    ): void {
        const [_, className, fileName] = properties

        return new MigrationTemplate(
            dir,
            className,
            fileName,
            action,
            tableName
        )
            .create()
    }

    // ------------------------------------------------------------------------

    public sync(
        dir: string,
        metadata: EntityMetadata,
        [currentSchema, previousSchema]: [
            TableSchema,
            TableSchema | undefined
        ],
        action: ActionType,
        tableName: string,
        properties: MigrationProps,
    ): void {
        const [_, className, fileName] = properties

        return new MigrationTemplate(
            dir,
            className,
            fileName,
            action,
            tableName
        )
            .sync(metadata, currentSchema, previousSchema)
            .create()
    }
}