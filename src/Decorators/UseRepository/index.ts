import { MetadataHandler } from "../../Metadata"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../types"
import RepositoryType from "../../Repository"
import PolymorphicRepository from "../../PolymorphicRepository"

export default function UseRepository<
    Repository extends typeof RepositoryType | typeof PolymorphicRepository
>(
    repository: Repository
) {
    return function (
        target: Repository extends typeof RepositoryType
            ? EntityTarget
            : Repository extends typeof PolymorphicRepository
            ? PolymorphicEntityTarget
            : never
    ) {
        MetadataHandler.targetMetadata(target).defineRepository(
            repository as any
        )
    }
}