export type HookType = (
    'before-sync' |
    'after-sync' |
    'before-find' |
    'after-find' |
    'before-bulk-find' |
    'after-bulk-find' |
    'before-create' |
    'after-create' |
    'before-bulk-create' |
    'after-bulk-create' |
    'before-update' |
    'after-update' |
    'before-bulk-update' |
    'after-bulk-update' |
    'before-delete' |
    'after-delete' |
    'before-bulk-delete' |
    'after-bulk-delete'
)

export type HookFunction = (...args: any[]) => void | Promise<void>