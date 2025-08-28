// Handlers
import MetadataHandler from "../../MetadataHandler"

// Types
import type { EntityTarget, Constructor } from "../../../../types/General"
import type { Trigger } from "../../../Triggers"

export default class TriggersMetadata extends Array<Constructor<Trigger>> {
    constructor(
        public target: EntityTarget,
        ...triggers: Constructor<Trigger>[]
    ) {
        super(...triggers)

        this.mergeParentsTriggers()
        this.register()
    }

    static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public addTrigger(trigger: Constructor<Trigger>): void {
        this.push(trigger)
    }

    // ------------------------------------------------------------------------

    public addTriggers(...triggers: Constructor<Trigger>[]): void {
        this.push(...triggers)
    }

    // Privates ---------------------------------------------------------------
    private register(): void {
        Reflect.defineMetadata('triggers-metadata', this, this.target)
    }

    // ------------------------------------------------------------------------

    private mergeParentsTriggers(): void {
        const parents = MetadataHandler.getTargetParents(this.target)

        for (const parent of parents) this.push(
            ...((TriggersMetadata.find(parent) ?? []))
        )
    }

    // Static Methods =========================================================
    // Publics ================================================================
    public static find(target: EntityTarget): (
        TriggersMetadata | undefined
    ) {
        return Reflect.getOwnMetadata('triggers-metadata', target)
    }

    // ------------------------------------------------------------------------

    public static build(target: EntityTarget) {
        return new TriggersMetadata(target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(target: EntityTarget) {
        return this.find(target)
            ?? this.build(target)
    }
}