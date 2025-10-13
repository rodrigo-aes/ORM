import MetadataMap from "../MetadataMap"

// Types
import type { PolyORMConnection, MySQLConnection } from "./contracts"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from "../../Errors"

class ConnectionsMetadata extends MetadataMap<string, PolyORMConnection> {
    protected static override readonly KEY: string = 'connections-metadata'
    protected readonly KEY: string = ConnectionsMetadata.KEY
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_CONNECTION'
    )

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override get(name: string): PolyORMConnection {
        return super.get(name)! ?? PolyORMException.Metadata.throw(
            'UNKNOWN_CONNECTION', name
        )
    }
}

export default new ConnectionsMetadata
export type {
    PolyORMConnection,
    MySQLConnection
} 