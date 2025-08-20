import type { CountQueryOption } from "./CountSQL"

export type CountQueryOptions<Entity extends object> = {
    [k: string]: CountQueryOption<Entity>
}