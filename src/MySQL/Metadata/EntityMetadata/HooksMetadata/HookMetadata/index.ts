import AbstractHookMetadata from "./HookMetadata"

import BeforeSyncMetadata from "./BeforeSyncMetadata"
import AfterSyncMetadata from "./AfterSyncMetadata"
import BeforeFindMetadata from "./BeforeFindMetadata"
import AfterFindMetadata from "./AfterFindMetadata"
import BeforeBulkFindMetadata from "./BeforeBulkFindMetadata"
import AfterBulkFindMetadata from "./AfterBulkFindMetadata"
import BeforeCreateMetadata from "./BeforeCreateMetadata"
import AfterCreateMetadata from "./AfterCreateMetadata"
import BeforeBulkCreateMetadata from "./BeforeBulkCreateMetadata"
import AfterBulkCreateMetadata from "./AfterBulkCreateMetadata"

export default abstract class HookMetadata extends AbstractHookMetadata {
    public static BeforeSync = BeforeSyncMetadata
    public static AfterSync = AfterSyncMetadata
    public static BeforeFind = BeforeFindMetadata
    public static AfterFind = AfterFindMetadata
    public static BeforeBulkFind = BeforeBulkFindMetadata
    public static AfterBulkFind = AfterBulkFindMetadata
    public static BeforeCreateMetadata = BeforeCreateMetadata
    public static AfterCreateMetadata = AfterCreateMetadata
    public static BeforeBulkCreateMetadata = BeforeBulkCreateMetadata
    public static AfterBulkCreateMetadata = AfterBulkCreateMetadata
}

export {
    BeforeSyncMetadata,
    AfterSyncMetadata,
    BeforeFindMetadata,
    AfterFindMetadata,
    BeforeBulkFindMetadata,
    AfterBulkFindMetadata,
    BeforeCreateMetadata,
    AfterCreateMetadata,
    BeforeBulkCreateMetadata,
    AfterBulkCreateMetadata
}