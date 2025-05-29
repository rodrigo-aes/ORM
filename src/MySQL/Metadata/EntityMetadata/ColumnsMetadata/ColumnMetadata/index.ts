// Utils
import EntityMetadata from "../../"
import DataType from "../../DataType"

// Objects
import ForeignKeyReferences, {
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
    type ForeignKeyReferencesInitMap,
} from "./ForeignKeyReferences"

import type { EntityTarget } from "../../../../../types/General"
import type {
    SQLColumnType,
    ColumnPattern,
    ColumnConfig,
    ForeignIdConfig,
    ColumnMetadataJSON
} from "./types"

export default class ColumnMetadata {
    public length?: number
    public nullable?: boolean
    public defaultValue?: any
    public unique?: boolean
    public primary?: boolean
    public autoIncrement?: boolean
    public unsigned?: boolean
    public isForeignKey?: boolean
    public references?: ForeignKeyReferences

    // public beforeUpdate: ColumnBeforeUpdateListener[] = []

    constructor(
        public target: EntityTarget,
        public name: string,
        public dataType: DataType
    ) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public defineForeignKey(initMap: ForeignKeyReferencesInitMap) {
        this.isForeignKey = true
        this.references = new ForeignKeyReferences(
            this.target,
            this.name,
            initMap
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): ColumnMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                dataType: this.dataType.toJSON(),
                references: this.references?.toJSON()
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'length',
                    'nullable',
                    'defaultValue',
                    'unique',
                    'primary',
                    'autoIncrement',
                    'unsigned',
                    'isForeignKey',
                ]
                    .includes(key)
            )
        ]) as ColumnMetadataJSON
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildPattern(
        target: EntityTarget,
        name: string,
        pattern: ColumnPattern,
        ...rest: any[]
    ) {
        switch (pattern) {
            case 'id': return this.buildIdColumn(target, name)

            case 'foreign-id': return this.buildForeignIdcolumn(
                target, name, ...(rest as [ForeignIdConfig])
            )

            case "created-timestamp": return this.buildCreateDateColumn(
                target, name
            )

            case "updated-timestamp": return this.buildUpdateDateColumn(
                target, name
            )
        }
    }

    // ------------------------------------------------------------------------

    public static buildIdColumn(target: EntityTarget, name: string) {
        const column = new ColumnMetadata(target, name, DataType.INT('BIG'))

        Object.assign(column, {
            primary: true,
            unsigned: true,
            autoIncrement: true,
            nullable: false,
        })

        return column
    }

    // ------------------------------------------------------------------------

    public static buildForeignIdcolumn(
        target: EntityTarget,
        name: string,
        config: ForeignIdConfig
    ) {
        const column = new ColumnMetadata(target, name, DataType.INT('BIG'))

        Object.assign(column, {
            isForeignKey: true,
            unsigned: true,
            nullable: false,
        })

        column.defineForeignKey({
            constrained: true,
            ...config
        })

        return column
    }

    // ------------------------------------------------------------------------

    public static buildCreateDateColumn(target: EntityTarget, name: string) {
        const column = new ColumnMetadata(target, name, DataType.TIMESTAMP())

        Object.assign(column, {
            nullable: false,
            defaultValue: () => 'CURRENT_TIMESTAMP',
        })

        return column
    }

    // ------------------------------------------------------------------------

    public static buildUpdateDateColumn(target: EntityTarget, name: string) {
        const column = new ColumnMetadata(target, name, DataType.TIMESTAMP())

        Object.assign(column, {
            nullable: false,
            defaultValue: () => 'CURRENT_TIMESTAMP',
            beforeUpdate: [
                () => Date.now()
            ]
        })

        return column
    }
}

export type {
    SQLColumnType,
    ColumnPattern,
    ColumnConfig,
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignIdConfig,
    ColumnMetadataJSON
}