import 'reflect-metadata'

import ColumnMetadata, {
    type ColumnConfig,
    type ColumnPattern,
    type ForeignIdConfig,
    type ForeignKeyReferencesInitMap,
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
} from "./ColumnMetadata"
import type DataType from "../DataType"
import type { EntityTarget } from "../../../../types/General"

export default class ColumnsMetadata<
    T extends ColumnMetadata = ColumnMetadata
> extends Array<T> {
    constructor(
        public target: EntityTarget,
        ...columns: T[]
    ) {
        super(...columns)

        this.mergeParentsColumns()
        this.register()
    }

    // Getters ================================================================
    public get primary(): ColumnMetadata {
        return this.find(({ primary }) => primary)!
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): ColumnMetadata[] {
        return this.filter(({ isForeignKey }) => isForeignKey)
    }

    // ------------------------------------------------------------------------

    public get constrainedForeignKeys(): ColumnMetadata[] {
        return this.foreignKeys.filter(
            ({ references }) => references?.constrained
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public registerColumn(name: string, dataType: DataType) {
        const column = new ColumnMetadata(this.target, name, dataType)
        this.push(column as T)

        return column
    }

    // ------------------------------------------------------------------------

    public registerColumnPattern(
        name: string,
        pattern: ColumnPattern,
        ...rest: any[]
    ) {
        this.push(ColumnMetadata.buildPattern(
            this.target, name, pattern, ...rest
        ) as T)
    }

    // ------------------------------------------------------------------------

    public getColumn(name: string, error?: typeof Error): ColumnMetadata {
        const column = this.find((col) => col.name === name)
        if (!column) throw new (error ?? Error)

        return column
    }

    // ------------------------------------------------------------------------

    public setColumn(name: string, config: ColumnConfig) {
        const column = this.getColumn(name)
        Object.assign(column, config)
    }

    // ------------------------------------------------------------------------

    public defineForeignKey(
        name: string,
        initMap: ForeignKeyReferencesInitMap
    ) {
        const column = this.getColumn(name)
        column.defineForeignKey(initMap)
    }

    // ------------------------------------------------------------------------

    public findColumn(name: string): ColumnMetadata | undefined {
        return this.find((col) => col.name === name)
    }

    // Protecteds -------------------------------------------------------------
    protected register() {
        Reflect.defineMetadata('columns', this, this.target)
    }

    // ------------------------------------------------------------------------
    protected mergeParentsColumns() {
        const parents: EntityTarget[] = this.getTargetAbstracts()

        for (const parent of parents) this.push(
            ...((ColumnsMetadata.find(parent) ?? []) as T[])
        )
    }

    // Privates ---------------------------------------------------------------
    private getTargetAbstracts(): EntityTarget[] {
        const parents: EntityTarget[] = []
        let parent = Object.getPrototypeOf(this.target)

        while (parent && parent !== Function.prototype) {
            parents.push(parent)
            parent = Object.getPrototypeOf(parent)
        }

        return parents
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build(target: EntityTarget, ...columns: ColumnMetadata[]) {
        return new ColumnsMetadata(target, ...columns)
    }

    // ------------------------------------------------------------------------

    public static find(target: EntityTarget): ColumnsMetadata | undefined {
        const meta = Reflect.getOwnMetadata('columns', target)
        return meta
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(
        target: EntityTarget,
        ...columns: ColumnMetadata[]
    ) {
        return this.find(target) || this.build(target, ...columns)
    }
}

export {
    ColumnMetadata,

    type ColumnConfig,
    type ColumnPattern,
    type ForeignIdConfig,
    type ForeignKeyReferencesInitMap,
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
}