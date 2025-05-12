import { JoinTableMetadata } from "../EntityMetadata";

export default class MetadataHandler {
    public static normalizeMetadata() {
        JoinTableMetadata.makeUniqueJoinTables()
    }
}