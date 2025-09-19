import type { PolyORMConfig } from "../types"

const defaultConfig: PolyORMConfig = {
    createConnections: async () => { },
    paths: {
        migrationsDir: './Migrations'
    }
}

export default defaultConfig