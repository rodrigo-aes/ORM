// Handlers
import MetadataHandler from "../../../MetadataHandler"

// Types
import type {
    EntityTarget,
    UnionEntityTarget
} from "../../../../../types/General"

import type {
    FindQueryOptions,
    FindOneQueryOptions,
    ConditionalQueryOptions,
    RelationsOptions
} from "../../../../QueryBuilder"

export default class ScopeMetadataHandler {
    public static applyScope<
        T extends EntityTarget | UnionEntityTarget,
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
            Reflect.getOwnMetadata('current-scope', target)
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