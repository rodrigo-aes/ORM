// Types
import type { Constructor } from "../../../../types/General"
import type {
    Trigger,
    TriggerTiming,
    TriggerEvent,
    TriggerOrientation
} from "../../../Triggers"

import type { TriggerSchemaInitMap } from "./types"

export default class TriggerSchema {
    public tableName!: string
    public name!: string
    public event?: TriggerEvent
    public timing?: TriggerTiming
    public orientation?: TriggerOrientation
    public action?: string

    constructor(initMap: TriggerSchemaInitMap) {
        Object.assign(this, initMap)
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
            action: trigger.actionBody()
        }) as InstanceType<T>
    }
}

export {
    type TriggerSchemaInitMap
}