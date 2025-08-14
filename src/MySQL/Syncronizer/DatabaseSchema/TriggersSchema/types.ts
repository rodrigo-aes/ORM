import type {
    TriggerEvent,
    TriggerTiming,
} from "../../../Triggers"

export type TriggerSchema = {
    TRIGGER_NAME: string
    EVENT_MANIPULATION: TriggerEvent
    EVENT_OBJECT_TABLE: string
    ACTION_STATEMENT: string
    ACTION_TIMING: TriggerTiming
}

export type AlterTriggerAction = 'ADD' | 'MODIFY' | 'DROP' | 'NONE'