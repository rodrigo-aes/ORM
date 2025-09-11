import { PaginationsMetadata } from "../../Metadata"

import DefaultPagination from "./DefaultPagination"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"
import type { Pagination } from "../../BaseEntity"

export default function Paginations(...paginations: (typeof Pagination)[]) {
    return function (target: EntityTarget | PolymorphicEntityTarget) {
        PaginationsMetadata.findOrBuild(target).add(...paginations)
    }
}

export {
    DefaultPagination
}