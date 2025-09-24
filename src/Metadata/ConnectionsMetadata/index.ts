import type { PolyORMConnection, MySQLConnection } from "./contracts"

// Exceptions
import PolyORMException from "../../Errors"

class ConnectionsMetadata extends Map<string, PolyORMConnection> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public all(): PolyORMConnection[] {
        return Array.from(this.values())
    }

    // ------------------------------------------------------------------------

    public findOrThrow(name: string): PolyORMConnection {
        return this.get(name)! ?? PolyORMException.Metadata.throw(
            'INEXISTENT_CONNECTION', name
        )
    }
}

export default new ConnectionsMetadata
export type {
    PolyORMConnection,
    MySQLConnection
} 