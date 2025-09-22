// Config
import Config from '../Config'

// Commands
import MigrationCommander from './MigrationCommander'

// Types
import type { CommandMap } from "./types"

export default class CLI {
    constructor(private commands: CommandMap) {
        this.execute()
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private async execute(): Promise<void> {
        let [command, method] = process.argv[2].split(':')
        if (!Object.keys(this.commands).includes(command)) throw new Error

        const proccess = new this.commands[command](method)

        proccess.parseCommand()
        await proccess.execute()
    }
}

export {
    MigrationCommander
}