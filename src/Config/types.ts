export type PolyORMConfig = {
    createConnections: () => Promise<void>

    paths: {
        migrationsDir: string
    }
}