import MetadataArray from "../../MetadataArray"
import JoinTableMetadata, {
    JoinColumnMetadata,
    JoinColumnsMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
    type JoinTableMetadataJSON
} from "./JoinTableMetadata"

// Types
import type { EntityTarget } from "../../../types"
import type { JoinTablesMetadataJSON } from "./types"

export default class JoinTablesMetadata extends MetadataArray<
    JoinTableMetadata
> {
    protected static override readonly KEY: string = 'join-tables-metadata'

    protected readonly KEY: string = JoinTablesMetadata.KEY
    protected readonly SEARCH_KEYS: (keyof JoinTableMetadata)[] = ['tableName']
    protected readonly SHOULD_MERGE: boolean = false

    declare public target: EntityTarget

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected override register(): void {
        super.register()
        JoinTablesMetadata.all(...this)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static all(...tables: JoinTableMetadata[]): JoinTablesMetadata {
        return JoinTablesMetadata.findOrBuild(undefined, ...tables)
    }

    // ------------------------------------------------------------------------

    public static findByTarget(target: EntityTarget): JoinTableMetadata[] {
        return this.all().filter(({ targets }) => targets.includes(target))
    }

    // ------------------------------------------------------------------------

    public static makeAllUnique(): void {
        const uniques = new JoinTablesMetadata()

        for (const table of this.all()) {
            const existent = uniques.find(
                ({ tableName }) => tableName === table.tableName
            )

            if (existent) existent.mergeRelateds(table.relateds)
            else uniques.push(table)
        }

        Reflect.defineMetadata(this.KEY, uniques, this)
    }
}

export {
    JoinTableMetadata,
    JoinColumnMetadata,
    JoinColumnsMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
    type JoinTablesMetadataJSON,
    type JoinTableMetadataJSON
}