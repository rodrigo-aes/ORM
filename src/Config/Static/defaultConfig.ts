// Utils
import Log from "../../utils/Log"

// Types
import type { PolyORMConfig } from "../types"

const defaultConfig: PolyORMConfig = {
    createConnections: async () => Log.out(
        '#[warning]"createConnections" #[default]config empty.'
    ),

    default: {
        ext: '.ts'
    },

    migrations: {
        baseDir: './Migrations',
        ext: '.ts'
    }
}

export default defaultConfig