import type { TableSchema, ActionType } from "../DatabaseSchema"

export type MigrationRunMethod = 'run' | 'back'

export type MigrationSyncAction = [
    ActionType,
    [TableSchema, TableSchema | undefined]
]