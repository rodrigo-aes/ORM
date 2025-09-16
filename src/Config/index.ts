// Utils
import { resolve } from "path"
import { pathToFileURL } from "url"

// Static
import { defaultConfig } from "./Static"

// Types
import type { PolyORMConfig } from "./types"

class Config {
    private config: PolyORMConfig = defaultConfig

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get createConnections(): PolyORMConfig['createConnections'] {
        return this.config.createConnections
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async load(): Promise<this> {
        try {
            this.config = {
                ...defaultConfig,
                ...(await import(
                    pathToFileURL(resolve('poly-orm.config.ts')).href
                ))
                    .default
            }

        } catch (error) { }

        return this
    }
}

export default new Config