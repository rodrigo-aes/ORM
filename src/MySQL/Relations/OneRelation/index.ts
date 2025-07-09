import Repository from "../../Repository"
import UnionRepository from "../../UnionRepository"

import BaseEntity from "../../BaseEntity"
import BaseEntityUnion from "../../BaseEntityUnion"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type {
    OneRelationMetadataType,
    EntityMetadata,
    EntityUnionMetadata
} from "../../Metadata"

import type {
    DeleteResult,
    ConditionalQueryOptions
} from "../../Repository"

import type { UpdateAttributes } from "../../Repository"
import type { TypedRepository } from "../types"
import type { ResultSetHeader } from "mysql2"

export default abstract class OneRelation<
    T extends EntityTarget | UnionEntityTarget
> {
    protected abstract metadata: OneRelationMetadataType
    protected abstract parent: BaseEntity

    // Getters ================================================================
    // protecteds -------------------------------------------------------------
    protected get parentMetadata(): EntityMetadata | EntityUnionMetadata {
        return this.parent.getMetadata()
    }

    // ------------------------------------------------------------------------

    protected abstract get whereOptions(): (
        ConditionalQueryOptions<InstanceType<T>>
    )

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public load(): Promise<InstanceType<T>> {
        return this.getRepository().findOne({
            where: this.whereOptions
        }) as (
                Promise<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    public update(attributes: UpdateAttributes<InstanceType<T>>): (
        Promise<ResultSetHeader>
    ) {
        return (this.getRepository().update as any)(
            attributes,
            this.whereOptions
        )
    }

    // ------------------------------------------------------------------------

    public delete(): Promise<DeleteResult> {
        return this.getRepository().delete(this.whereOptions)
    }

    // Protecteds -------------------------------------------------------------
    protected getRepository(): TypedRepository<T> {
        switch (true) {
            case (
                this.metadata.relatedTarget.prototype
                instanceof BaseEntity
            ):
                return new Repository(this.metadata.relatedTarget as (
                    EntityTarget
                )) as (
                        TypedRepository<T>
                    )

            // ----------------------------------------------------------------

            case (
                this.metadata.relatedTarget.prototype
                instanceof BaseEntityUnion
            ):
                return new UnionRepository(this.metadata.relatedTarget as (
                    UnionEntityTarget
                )) as (
                        TypedRepository<T>
                    )
        }

        throw new Error
    }
}