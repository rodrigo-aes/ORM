import Repository from "../../Repository"
import BaseEntity from "../../BaseEntity"

import type { EntityTarget } from "../../../types/General"
import type { ManyRelationMetadatatype, EntityMetadata } from "../../Metadata"
import type {
    FindOneQueryOptions,
    FindQueryOptions,
    ConditionalQueryOptions,
    CreationAttributes,
    UpdateAttributes,
    UpdateOrCreateAttibutes,
    DeleteResult
} from "../../Repository"

import type { UpdateQueryResult } from "../../Repository/types"

export default abstract class ManyRelation<
    T extends EntityTarget
> extends Array<InstanceType<T>> {
    protected abstract metadata: ManyRelationMetadatatype
    protected abstract parent: BaseEntity

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get parentMetadata(): EntityMetadata {
        return this.parent.getMetadata()
    }

    // ------------------------------------------------------------------------

    protected abstract get primaryKeyName(): keyof InstanceType<T>

    // ------------------------------------------------------------------------

    protected abstract get whereOptions(): (
        ConditionalQueryOptions<InstanceType<T>>
    )

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async findAll(
        options: Omit<FindQueryOptions<InstanceType<T>>, (
            'group' |
            'limit' |
            'offset'
        )>
    ): Promise<InstanceType<T>[]> {
        const result = await this.getRepository()
            .find(this.mergeFindOptions(options)) as (
                InstanceType<T>[]
            )

        this.mergeResult(result)

        return result
    }

    // ------------------------------------------------------------------------

    public findOne(
        options: Omit<FindOneQueryOptions<InstanceType<T>>, (
            'group'
        )>
    ): Promise<InstanceType<T> | null> {
        return this.getRepository()
            .findOne(this.mergeFindOptions(options)) as (
                Promise<InstanceType<T> | null>
            )
    }

    // ------------------------------------------------------------------------

    public update<
        Data extends UpdateAttributes<InstanceType<T>>
    >(
        attributes: Data,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): Promise<UpdateQueryResult<T, Data>> {
        return this.getRepository().update(attributes, {
            ...where,
            ...this.whereOptions
        })
    }

    // ------------------------------------------------------------------------

    public delete(where: ConditionalQueryOptions<InstanceType<T>>): (
        Promise<DeleteResult>
    ) {
        return this.getRepository().delete({
            ...where,
            ...this.whereOptions
        })
    }

    // Protecteds -------------------------------------------------------------
    protected getRepository(): Repository<T> {
        return new Repository(this.metadata.relatedTarget as T)
    }

    // ------------------------------------------------------------------------

    protected mergeResult(result: InstanceType<T>[]): void {
        const newResults = this.extractNewResults(result)
        const existent = this.extractExistentResults(result)

        this.push(...newResults)

        for (const entity of existent) this.splice(
            this.findIndex(old =>
                old[this.primaryKeyName] === entity[this.primaryKeyName]
            ),
            1,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected mergeFindOptions(
        options: (
            FindQueryOptions<InstanceType<T>> |
            FindOneQueryOptions<InstanceType<T>>
        )
    ) {
        return {
            ...options,
            where: {
                ...options.where,
                ...this.whereOptions
            }
        }
    }

    // Privates ---------------------------------------------------------------
    private extractNewResults(result: InstanceType<T>[]): InstanceType<T>[] {
        return result.filter(entity => !this.find(existent => (
            existent[this.primaryKeyName] === entity[this.primaryKeyName]
        )))
    }

    // ------------------------------------------------------------------------

    private extractExistentResults(result: InstanceType<T>[]): (
        InstanceType<T>[]
    ) {
        return result.filter(entity => this.find(existent => (
            existent[this.primaryKeyName] === entity[this.primaryKeyName]
        )))
    }
}