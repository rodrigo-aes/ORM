import { PaginationsMetadata } from "../../../Metadata"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"
import type { Pagination } from "../../../BaseEntity"

export default function DefaultPagination(pagination: typeof Pagination) {
    return function (target: EntityTarget | PolymorphicEntityTarget) {
        PaginationsMetadata.findOrBuild(target).setDefault(pagination)
    }
}