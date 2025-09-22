import chalk from "chalk"

export const registerUnknownQuestion = (connection: string) => (
    chalk.white.bgYellow('WARNING:') +
    chalk.whiteBright(' You have ') +
    chalk.yellowBright('UNREGISTERED MIGRATIONS') +
    chalk.whiteBright(' for connection ') +
    chalk.yellowBright(connection) +
    chalk.whiteBright(', would you like to ') +
    chalk.yellowBright('RESGISTER') +
    chalk.whiteBright('? [Y]es | [N]o\n')
)

export const setAlreadyRunnedQuestion = (
    name: string,
    code: string,
    message: string,
    migration: string,
    method: 'UP' | 'DOWN'
) => (
    chalk.white.bgRed('\nMIGRATION EXCEPTION:\n\n') +
    chalk.whiteBright('NAME: ') +
    chalk.greenBright(`"${name}"\n`) +
    chalk.whiteBright('ERROR CODE: ') +
    chalk.greenBright(`"${code}"\n`) +
    chalk.whiteBright('SQL MESSAGE: ') +
    chalk.greenBright(`"${message}"\n\n`) +
    chalk.whiteBright('Would you like to declare migration ') +
    chalk.cyanBright(migration) +
    chalk.whiteBright(' as already runned ') +
    chalk.yellowBright(method) +
    chalk.whiteBright('? [Y]es | [N]o\n')
)