import { Exists } from './Symbol'
import type { ConditionalQueryOptions } from '../types'

export type ExistsQueryOptions<Entity extends Object> = {
    [Exists]: ConditionalQueryOptions<Entity>
}