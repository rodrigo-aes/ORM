import { ScopesMetadata } from "../../../Metadata"

// Types
import type {
    EntityTarget,
    EntityUnionTarget
} from "../../../../types/General"

import type { FindQueryOptions } from "../../../QueryBuilder"

export default function DefaultScope<
    T extends EntityTarget | EntityUnionTarget
>(defaultScope: FindQueryOptions<InstanceType<T>>) {
    return function (target: T) {
        ScopesMetadata.findOrBuild(target).setDefault(defaultScope)
    }
}