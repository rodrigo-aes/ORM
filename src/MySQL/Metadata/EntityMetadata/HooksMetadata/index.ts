import HookMetadata, {
    BeforeSyncMetadata,
    AfterSyncMetadata,
} from "./HookMetadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { HookType } from "./HookMetadata/types"

export default class HooksMetadata extends Array<HookMetadata> {
    private toCall!: Set<HookType>

    private _beforeSync?: BeforeSyncMetadata[]
    private _afterSync?: AfterSyncMetadata[]

    constructor(public target: EntityTarget, ...hooks: HookMetadata[]) {
        super(...hooks)

        this.handleToCall()
        this.register()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get beforeSync(): BeforeSyncMetadata[] {
        return this._beforeSync ?? this.loadBeforeSync()
    }

    // ------------------------------------------------------------------------

    public get afterSync(): AfterSyncMetadata[] {
        return this._afterSync ?? this.loadAfterSync()
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

    public addBeforeSync(propertyName: string) {
        this.push(new HookMetadata.BeforeSync(this.target, propertyName))
        this.toCall.add('before-sync')
    }

    // ------------------------------------------------------------------------

    public addAfterSync(propertyName: string) {
        this.push(new HookMetadata.AfterSync(this.target, propertyName))
        this.toCall.add('after-sync')
    }

    // ------------------------------------------------------------------------

    public addHooks(...hooks: HookMetadata[]) {
        this.push(...hooks)
        return this
    }

    // Privates ---------------------------------------------------------------
    private register() {
        Reflect.defineMetadata('hooks', this, this.target)
    }

    // ------------------------------------------------------------------------

    private handleToCall() {
        this.toCall = new Set
        for (const hook of this) this.toCall.add(hook.type)
    }

    // ------------------------------------------------------------------------

    private loadBeforeSync() {
        this._beforeSync = this.filter(
            hook => hook instanceof BeforeSyncMetadata
        )

        return this._beforeSync
    }

    // ------------------------------------------------------------------------

    private loadAfterSync() {
        this._afterSync = this.filter(
            hook => hook instanceof AfterSyncMetadata
        )

        return this._afterSync
    }

    // Static Methods =========================================================
    // Publics ================================================================
    public static find(target: EntityTarget): HooksMetadata | undefined {
        return Reflect.getOwnMetadata('hooks', target)
    }

    // ------------------------------------------------------------------------

    public static build(target: EntityTarget, ...hooks: HookMetadata[]) {
        return new HooksMetadata(target, ...hooks)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(target: EntityTarget, ...hooks: HookMetadata[]) {
        return this.find(target)?.addHooks(...hooks)
            ?? this.build(target, ...hooks)
    }
}