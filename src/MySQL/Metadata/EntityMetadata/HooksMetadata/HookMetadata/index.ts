import AbstractHookMetadata from "./HookMetadata"

import BeforeSyncMetadata from "./BeforeSyncMetadata"
import AfterSyncMetadata from "./AfterSyncMetadata"

export default abstract class HookMetadata extends AbstractHookMetadata {
    public static BeforeSync = BeforeSyncMetadata
    public static AfterSync = AfterSyncMetadata
}

export {
    BeforeSyncMetadata,
    AfterSyncMetadata,
}