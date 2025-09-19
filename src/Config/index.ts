// Utils
import { resolve } from "path"
import { pathToFileURL } from "url"

// Static
import { defaultConfig } from "./Static"

// Types
import type { PolyORMConfig } from "./types"

class Config {
    private config: PolyORMConfig = defaultConfig
    public loaded: boolean = false

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get createConnections(): PolyORMConfig['createConnections'] {
        return this.config.createConnections
    }

    // ------------------------------------------------------------------------

    public get migrationsDir(): string {
        return resolve(this.config.paths.migrationsDir)
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

            this.loaded = true

        } catch (error) { }

        return this
    }
}

export default new Config