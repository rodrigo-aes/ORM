import type { EntityTarget } from "../../types/General"

export type MySQLConnectionConfig = {
    host: string
    port: number
    user: string
    password: string
    database: string
    connectionLimit?: number
    entities?: EntityTarget[]
    lazyConnection?: boolean
}