import { EntityMetadata } from "../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"
import type RepositoryType from "../../Repository"

export default function Repository(repository: typeof RepositoryType) {
    return function (target: EntityTarget) {
        EntityMetadata.defineRepository(target, repository)
    }
}