type JSONColumnData = {
    json: string
    path: string
}

type VirtualJSONColumn = JSONColumnData & {
    type: 'VIRTUAL'
}

type StoredJSONColumn = JSONColumnData & {
    type: 'STORED',
}

export type JSONColumnConfig = VirtualJSONColumn | StoredJSONColumn
