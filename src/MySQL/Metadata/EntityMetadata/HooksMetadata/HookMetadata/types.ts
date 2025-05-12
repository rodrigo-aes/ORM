export type HookType = (
    'before-sync' |
    'after-sync'
)

export type HookFunction = (...args: any[]) => void