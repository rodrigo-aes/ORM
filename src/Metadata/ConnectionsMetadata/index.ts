import MetadataMap from "../MetadataMap"

// Types
import type { PolyORMConnection, MySQLConnection } from "./contracts"

// Exceptions
import { type MetadataErrorCode } from "../../Errors"

class ConnectionsMetadata extends MetadataMap<string, PolyORMConnection> {
    protected static override readonly KEY: string = 'connections-metadata'
    protected readonly KEY: string = ConnectionsMetadata.KEY
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_CONNECTION'
    )
}

export default new ConnectionsMetadata
export type {
    PolyORMConnection,
    MySQLConnection
} 