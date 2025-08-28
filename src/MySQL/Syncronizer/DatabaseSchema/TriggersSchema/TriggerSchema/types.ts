import type {
    TriggerEvent,
    TriggerTiming,
    TriggerOrientation
} from "../../../../Triggers"

export type TriggerSchemaInitMap = {
    tableName: string
    name: string
    event?: TriggerEvent
    timing?: TriggerTiming
    orientation?: TriggerOrientation
    action?: string
}

export type TriggerSchemaAction = 'ADD' | 'ALTER' | 'DROP' | 'NONE'