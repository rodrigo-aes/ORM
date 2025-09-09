import { TriggerSQLBuilder } from "../../../SQLBuilders"

// Types
import type BaseEntity from "../../../BaseEntity"
import type { Constructor } from "../../../../types/General"
import type {
    Trigger,
    TriggerTiming,
    TriggerEvent,
    TriggerOrientation,
    TriggerAction
} from "../../../Triggers"

import type { TriggerSchemaInitMap } from "./types"

export default class TriggerSchema<
    T extends BaseEntity = BaseEntity
> extends TriggerSQLBuilder<T> {
    public tableName!: string
    public name!: string
    public event?: TriggerEvent
    public timing?: TriggerTiming
    public orientation?: TriggerOrientation

    private _action!: string | (() => string | TriggerAction<T>[])

    constructor(initMap: TriggerSchemaInitMap) {
        super()
        Object.assign(this, initMap)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public before(event: TriggerEvent): this {
        this.timing = 'BEFORE'
        this.event = event

        return this
    }

    // ------------------------------------------------------------------------

    public after(event: TriggerEvent): this {
        this.timing = 'AFTER'
        this.event = event

        return this
    }

    // ------------------------------------------------------------------------

    public insteadOf(event: TriggerEvent): this {
        this.timing = 'INSTEAD OF'
        this.event = event

        return this
    }

    // ------------------------------------------------------------------------

    public forEach(orientation: TriggerOrientation): this {
        this.orientation = orientation
        return this
    }

    // ------------------------------------------------------------------------

    public execute(action: string | (() => string | TriggerAction<T>[])): (
        void
    ) {
        this._action = action
    }

    // ------------------------------------------------------------------------

    protected action(): string | TriggerAction<T>[] {
        return typeof this._action === 'string' ? this._action : this._action()
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromTrigger<T extends Constructor<TriggerSchema>>(
        this: T,
        trigger: Trigger
    ): InstanceType<T> {
        return new this({
            tableName: trigger.tableName,
            name: trigger.name,
            event: trigger.event,
            timing: trigger.timing,
            orientation: trigger.orientation,
            action: trigger.actionSQL()
        }) as InstanceType<T>
    }
}

export {
    type TriggerSchemaInitMap
}