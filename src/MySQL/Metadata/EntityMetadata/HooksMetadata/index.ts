import HookMetadata, {
    BeforeSyncMetadata,
    AfterSyncMetadata,
    BeforeFindMetadata,
    AfterFindMetadata,
    BeforeBulkFindMetadata,
    AfterBulkFindMetadata,
    BeforeCreateMetadata,
    AfterCreateMetadata,
    BeforeBulkCreateMetadata,
    AfterBulkCreateMetadata
} from "./HookMetadata"

// Types
import type {
    EntityTarget,
    UnionEntityTarget
} from "../../../../types/General"
import type { HookType } from "./HookMetadata/types"
import type BaseEntity from "../../../BaseEntity"
import type BaseEntityUnion from "../../../BaseEntityUnion"
import type { FindQueryOptions } from "../../../QueryBuilder"
import type {
    RawData,
    MySQL2RawData
} from "../../../Handlers/MySQL2RawDataHandler"

import type { CreationAttributes } from "../../../QueryBuilder"

export default class HooksMetadata {
    private toCall!: Set<HookType>

    public beforeSync: BeforeSyncMetadata[] = []
    public afterSync: AfterSyncMetadata[] = []
    public beforeFind: BeforeFindMetadata[] = []
    public afterFind: AfterFindMetadata[] = []
    public beforeBulkFind: BeforeBulkFindMetadata[] = []
    public afterBulkFind: AfterBulkFindMetadata[] = []
    public beforeCreate: BeforeCreateMetadata[] = []
    public afterCreate: AfterCreateMetadata[] = []
    public beforeBulkCreate: BeforeBulkCreateMetadata[] = []
    public afterBulkCreate: AfterBulkCreateMetadata[] = []

    constructor(public target: EntityTarget | UnionEntityTarget) {
        this.register()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async callBeforeSync() {
        if (this.toCall.has('before-sync'))
            for (const hook of this.beforeSync) await hook.call()
    }

    // ------------------------------------------------------------------------

    public async callAfterSync() {
        if (this.toCall.has('after-sync'))
            for (const hook of this.afterSync) await hook.call()
    }

    // ------------------------------------------------------------------------

    public async callBeforeFind<Entity extends object>(
        options: FindQueryOptions<Entity>
    ) {
        if (this.toCall.has('before-find'))
            for (const hook of this.beforeFind) await hook.call(options)
    }

    // ------------------------------------------------------------------------

    public async callAfterFind<T extends (
        (BaseEntity | BaseEntityUnion<any>) |
        RawData<any> |
        MySQL2RawData
    )>(entity: T) {
        if (this.toCall.has('after-find'))
            for (const hook of this.afterFind) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkFind<Entity extends object>(
        options: FindQueryOptions<Entity>
    ) {
        if (this.toCall.has('before-bulk-find'))
            for (const hook of this.beforeBulkFind) await hook.call(options)
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkFind<
        T extends (
            (BaseEntity | BaseEntityUnion<any>) |
            RawData<any> |
            MySQL2RawData
        )
    >(
        entities: T[]
    ) {
        if (this.toCall.has('after-find'))
            for (const hook of this.afterBulkFind) await hook.call(entities)
    }

    // ------------------------------------------------------------------------

    public async callBeforeCreate<Entity extends object>(
        attributes: CreationAttributes<Entity>
    ) {
        if (this.toCall.has('before-create'))
            for (const hook of this.beforeCreate) await hook.call(attributes)
    }

    // ------------------------------------------------------------------------

    public async callAfterCreate<T extends (
        (BaseEntity | BaseEntityUnion<any>) |
        RawData<any> |
        MySQL2RawData
    )>(entity: T) {
        if (this.toCall.has('after-create'))
            for (const hook of this.afterCreate) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkCreate<Entity extends object>(
        attributes: CreationAttributes<Entity>[]
    ) {
        if (this.toCall.has('before-bulk-create'))
            for (const hook of this.beforeBulkCreate) (
                await hook.call(attributes)
            )
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkCreate<T extends (
        (BaseEntity | BaseEntityUnion<any>) |
        RawData<any> |
        MySQL2RawData
    )>(result: T[]) {
        if (this.toCall.has('after-bulk-create'))
            for (const hook of this.afterBulkCreate) await hook.call(result)
    }

    // ------------------------------------------------------------------------

    public addBeforeSync(propertyName: string) {
        this.beforeSync.push(
            new HookMetadata.BeforeSync(this.target, propertyName)
        )

        this.toCall.add('before-sync')
    }

    // ------------------------------------------------------------------------

    public addAfterSync(propertyName: string) {
        this.afterSync.push(
            new HookMetadata.AfterSync(this.target, propertyName)
        )

        this.toCall.add('after-sync')
    }

    // ------------------------------------------------------------------------

    public addBeforeFind(propertyName: string) {
        this.beforeFind.push(
            new HookMetadata.BeforeFind(this.target, propertyName)
        )

        this.toCall.add('before-find')
    }

    // ------------------------------------------------------------------------

    public addAfterFind(propertyName: string) {
        this.afterFind.push(
            new HookMetadata.AfterFind(this.target, propertyName)
        )

        this.toCall.add('after-find')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkFind(propertyName: string) {
        this.beforeBulkFind.push(
            new HookMetadata.BeforeBulkFind(this.target, propertyName)
        )

        this.toCall.add('before-bulk-find')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkFind(propertyName: string) {
        this.afterBulkFind.push(
            new HookMetadata.AfterBulkFind(this.target, propertyName)
        )

        this.toCall.add('after-bulk-find')
    }

    // ------------------------------------------------------------------------

    public addBeforeCreate(propertyName: string) {
        this.beforeCreate.push(
            new HookMetadata.BeforeCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('before-create')
    }

    // ------------------------------------------------------------------------

    public addAfterCreate(propertyName: string) {
        this.afterCreate.push(
            new HookMetadata.AfterCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('after-create')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkCreate(propertyName: string) {
        this.beforeBulkCreate.push(
            new HookMetadata.BeforeBulkCreateMetadata(
                this.target, propertyName
            )
        )

        this.toCall.add('before-bulk-create')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkCreate(propertyName: string) {
        this.afterBulkCreate.push(
            new HookMetadata.AfterBulkCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('after-bulk-create')
    }

    // Privates ---------------------------------------------------------------
    private register() {
        Reflect.defineMetadata('hooks', this, this.target)
    }

    // Static Methods =========================================================
    // Publics ================================================================
    public static find(target: EntityTarget | UnionEntityTarget): (
        HooksMetadata | undefined
    ) {
        return Reflect.getOwnMetadata('hooks', target)
    }

    // ------------------------------------------------------------------------

    public static build(target: EntityTarget) {
        return new HooksMetadata(target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(target: EntityTarget) {
        return this.find(target)
            ?? this.build(target)
    }
}