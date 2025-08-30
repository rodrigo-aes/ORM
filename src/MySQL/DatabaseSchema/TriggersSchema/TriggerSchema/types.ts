import type {
    TriggerEvent,
    TriggerTiming,
    TriggerOrientation
} from "../../../Triggers"

export type TriggerSchemaInitMap = {
    tableName: string
    name: string
    event?: TriggerEvent
    timing?: TriggerTiming
    orientation?: TriggerOrientation
    action?: string
}

