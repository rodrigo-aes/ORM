import EntityMetadata, {
    ColumnMetadata,
    ColumnsMetadata,
    DataType
} from "../EntityMetadata"
import EntityUnionColumnMetadata from "./EntityUnionColumnMetadata"

import UnionEntity from "../../UnionEntity"

// Types
import type { EntityTarget } from "../../../types/General"
import type { EntityUnionTarget } from "./types"

export default class EntityUnionMetadata extends EntityMetadata {
    public entities: EntityMetadata[]

    public override columns: ColumnsMetadata<EntityUnionColumnMetadata>

    constructor(
        tableName: string,
        target: EntityUnionTarget = UnionEntity,
        public targets: EntityTarget[]
    ) {
        super(target, { tableName })

        this.entities = this.loadEntities()
        this.columns = this.registerColumns()
        this.register()
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    public get originalPrimaries(): ColumnMetadata[] {
        return this.entities.map(({ columns: { primary } }) => primary)
    }

    // ------------------------------------------------------------------------

    public get originalPrimary(): ColumnMetadata {
        return this.originalPrimaries.find(() => true)!
    }

    // ------------------------------------------------------------------------

    public get originalColumns(): ColumnMetadata[] {
        return this.entities.flatMap(({ columns }) => columns)
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected override register() {
        if (this.targets) Reflect.defineMetadata(
            'entity-union',
            this,
            this.targets
        )

        Reflect.defineMetadata(
            this.tableName,
            this,
            this.target
        )
    }

    // Privates ---------------------------------------------------------------
    private loadEntities(): EntityMetadata[] {
        return this.targets.map(target => EntityMetadata.findOrBuild(target))
    }

    // ------------------------------------------------------------------------

    private registerColumns(): ColumnsMetadata<EntityUnionColumnMetadata> {
        return new ColumnsMetadata(
            this.target,
            ...this.mergeColumns()
        )
    }

    // ------------------------------------------------------------------------

    private mergeColumns(): EntityUnionColumnMetadata[] {
        return [
            this.buildPrimaryColumn(),
            this.buildEntityTypeColumn(),
            ...this.allRestColumns()
        ]
    }

    // ------------------------------------------------------------------------

    private buildPrimaryColumn(): EntityUnionColumnMetadata {
        if (!this.primaryKeysCompatible()) throw new Error

        const [{ dataType }] = this.originalPrimaries

        const column = new EntityUnionColumnMetadata(
            this.target,
            'primaryKey',
            dataType,
            ...this.targets
        )

        Object.assign(
            column,
            this.getEntityPrimaryKeyProperties(this.originalPrimary)
        )

        return column
    }

    // ------------------------------------------------------------------------

    private buildEntityTypeColumn(): EntityUnionColumnMetadata {
        const entityTypes = this.targets.map(target => target.name)

        return new EntityUnionColumnMetadata(
            this.target,
            'entityType',
            DataType.ENUM(...entityTypes),
            ...this.targets
        )
    }

    // ------------------------------------------------------------------------

    private allRestColumns(): EntityUnionColumnMetadata[] {
        const included = new Set<string>()
        const columns: EntityUnionColumnMetadata[] = []

        for (const column of this.originalColumns) if (
            !column.primary &&
            !included.has(column.name)
        ) {
            const { name, dataType } = column
            const newColumn = new EntityUnionColumnMetadata(
                this.target,
                name,
                dataType,
                ...this.targets
            )

            Object.assign(newColumn, column)
            columns.push(newColumn)

            included.add(column.name)
        }

        return columns
    }

    // ------------------------------------------------------------------------

    private primaryKeysCompatible(): boolean {
        const [primary, ...primaries] = this.originalPrimaries

        return primaries.every(({
            dataType,
            unsigned
        }) => (
            dataType.type === primary.dataType.type &&
            unsigned === primary.unsigned
        ))
    }

    // ------------------------------------------------------------------------

    private getEntityPrimaryKeyProperties(primaryKey: ColumnMetadata) {
        const { target, name, dataType, ...properties } = primaryKey
        return properties
    }
}

export {
    type EntityUnionColumnMetadata
}