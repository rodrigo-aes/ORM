// Handlers
import MetadataHandler from "../../../MetadataHandler"
import TempMetadata from "../../../TempMetadata"

// Types
import type {
    EntityTarget,
    EntityUnionTarget
} from "../../../../../types/General"

import type {
    FindQueryOptions,
    FindOneQueryOptions,
    ConditionalQueryOptions,
    RelationsOptions
} from "../../../../QueryBuilder"

export default class ScopeMetadataHandler {
    public static applyScope<
        T extends EntityTarget | EntityUnionTarget,
        Type extends 'find' | 'findOne' | 'conditional' | 'relations',
        Options extends (
            Type extends 'find'
            ? FindQueryOptions<InstanceType<T>>
            : Type extends 'findOne'
            ? FindOneQueryOptions<InstanceType<T>>
            : Type extends 'conditional'
            ? ConditionalQueryOptions<InstanceType<T>>
            : Type extends 'relations'
            ? RelationsOptions<InstanceType<T>>
            : never
        )
    >(
        target: T,
        type: Type,
        options: Options
    ): Options {
        const current: FindQueryOptions<InstanceType<T>> | undefined = (
            TempMetadata.getScope(target)
            ?? MetadataHandler.loadMetadata(target).scopes?.default
        )

        if (current) switch (type) {
            case 'find': return {
                ...current,
                ...options
            }

            case 'findOne':
                const { order, limit, offset, ...rest } = current
                return {
                    ...rest,
                    ...options
                }

            case 'conditional': return {
                ...current.where,
                ...options
            }

            case 'relations': return {
                ...current.relations,
                ...options
            }
        }

        return options
    }
}