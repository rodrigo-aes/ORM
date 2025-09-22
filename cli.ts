import 'reflect-metadata'
import './src/Errors'
import Config from './src/Config'

import CLI, {
    MigrationCommander
} from './src/CLI'

(async () => {
    await Config.load()
    new CLI({
        migrations: MigrationCommander
    })
})()