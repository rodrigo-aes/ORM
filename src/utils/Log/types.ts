export type LogColor = (
    'info' |
    'success' |
    'warning' |
    'danger' |
    'default'
)

export type ComposedLineAsset = 'date' | 'time' | 'datetime'
export type ComposedLineCustom = {
    color?: string,
    asset?: ComposedLineAsset,
    content?: string
}

export type ComposedLineConfig = ComposedLineAsset | ComposedLineCustom