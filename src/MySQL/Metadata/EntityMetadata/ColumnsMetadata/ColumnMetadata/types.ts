import type ColumnMetadata from "."
import type { ForeignKeyReferencesInitMap } from "./ForeignKeyReferences"


export type ColumnPattern = (
    'id' |
    'foreign-id' |
    'created-timestamp' |
    'updated-timestamp'
);

export type SQLColumnType = (
    | 'int'
    | 'tinyint'
    | 'smallint'
    | 'mediumint'
    | 'bigint'
    | 'decimal'
    | 'float'
    | 'double'
    | 'bit'
    | 'char'
    | 'varchar'
    | 'text'
    | 'tinytext'
    | 'mediumtext'
    | 'longtext'
    | 'blob'
    | 'tinyblob'
    | 'mediumblob'
    | 'longblob'
    | 'enum'
    | 'set'
    | 'json'
    | 'date'
    | 'datetime'
    | 'timestamp'
    | 'time'
    | 'year'
    | 'boolean'
    | 'binary'
    | 'varbinary'
)

export type ColumnConfig = {
    length?: number
    nullable?: boolean
    defaultValue?: any
    unique?: boolean
    primary?: boolean
    autoIncrement?: boolean
    unsigned?: boolean
    isForeignKey?: boolean
}

export type ColumnBeforeUpdateListener = (metadata: ColumnMetadata) => any

export type ForeignIdConfig = Omit<ForeignKeyReferencesInitMap, (
    'constrained' |
    'scope'
)>