import type { Connection } from "./types";

export class ConnectionsMetadata extends Map<string, Connection> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public all(): Connection[] {
        return Array.from(this.values())
    }
}

export default new ConnectionsMetadata