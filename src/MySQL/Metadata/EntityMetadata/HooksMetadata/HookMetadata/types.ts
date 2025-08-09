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
    'after-bulk-create'
)

export type HookFunction = (...args: any[]) => void