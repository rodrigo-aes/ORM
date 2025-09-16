import type { HookMetadataJSON } from "./HookMetadata"

export type HooksMetadataJSON = {
    beforeSync: HookMetadataJSON
    afterSync: HookMetadataJSON
    beforeFind: HookMetadataJSON
    afterFind: HookMetadataJSON
    beforeBulkFind: HookMetadataJSON
    afterBulkFind: HookMetadataJSON
    beforeCreate: HookMetadataJSON
    afterCreate: HookMetadataJSON
    beforeBulkCreate: HookMetadataJSON
    afterBulkCreate: HookMetadataJSON
    beforeUpdate: HookMetadataJSON
    afterUpdate: HookMetadataJSON
    beforeBulkUpdate: HookMetadataJSON
    afterBulkUpdate: HookMetadataJSON
    beforeDelete: HookMetadataJSON
    afterDelete: HookMetadataJSON
    beforeBulkDelete: HookMetadataJSON
    afterBulkDelete: HookMetadataJSON
}