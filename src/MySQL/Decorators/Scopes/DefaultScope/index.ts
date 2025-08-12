import { ScopesMetadata } from "../../../Metadata"

// Types
import type {
    EntityTarget,
    UnionEntityTarget
} from "../../../../types/General"

import type { FindQueryOptions } from "../../../QueryBuilder"

export default function DefaultScope<
    T extends EntityTarget | UnionEntityTarget
>(defaultScope: FindQueryOptions<InstanceType<T>>) {
    return function (target: T) {
        ScopesMetadata.findOrBuild(target).setDefault(defaultScope)
    }
}