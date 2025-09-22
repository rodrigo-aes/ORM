import chalk, { ChalkInstance } from "chalk"

// Types
import type {
    LogColor,
    ComposedLineAsset,
    ComposedLineCustom,
    ComposedLineConfig
} from "./types"

/**
 * Log class to print out logs
 */
class Log {
    public static colors: Record<LogColor, ChalkInstance> = {
        info: chalk.cyanBright,
        success: chalk.green,
        warning: chalk.yellow,
        danger: chalk.red,
        default: chalk.white,
    }

    private static colorPattern = /#\[(\w+)\](.+?)(?=#\[|$)/gs
    private static stripAnsiPattern = /\x1b\[[0-9;]*m/gs

    /**
     * 
     * @param {string} message - The log message with color styles
     * 
     * @example
     * Log.out('#[info]text info - #[success]text success') 
     */
    public static out(message: string): void {
        console.log(this.parseMessage(message));
    }

    // ------------------------------------------------------------------------

    public static composedLine(
        message: string,
        config: ComposedLineConfig | ComposedLineConfig[]
    ) {
        const assets = this.handleComposedConfig(config)

        const messageLen = this.visibleLength(this.parseMessage(message))
        const assetsLen = this.visibleLength(this.parseMessage(assets))
        const lineLen = process.stdout.columns - (
            messageLen + assetsLen + 2
        )

        console.log(
            this.parseMessage(`${message} ${'-'.repeat(lineLen)} ${assets}`)
        )
    }

    // ------------------------------------------------------------------------

    private static parseMessage(message: string) {
        return message.replace(
            this.colorPattern,
            (_, color, text) => this.applyColor(color, text)
        )
    }

    // ------------------------------------------------------------------------

    private static applyColor(color: LogColor, text: string) {
        return Log.colors[color.toLowerCase() as LogColor](text) ?? text
    }

    // ------------------------------------------------------------------------

    private static handleComposedConfig(
        config: ComposedLineConfig | ComposedLineConfig[]
    ) {
        if (Array.isArray(config)) return config.map(conf =>
            this.handleComposition(conf)
        )
            .join(' ')

        else return this.handleComposition(config)
    }

    // ------------------------------------------------------------------------

    private static handleComposition(config: ComposedLineConfig) {
        switch (typeof config) {
            case "string": return this.composedAsset(config)
            case "object": return this.customAsset(config)
        }
    }

    // ------------------------------------------------------------------------

    private static composedAsset(asset: ComposedLineAsset) {
        switch (asset) {
            case "date": return new Date().toLocaleDateString()
            case "time": return new Date().toLocaleTimeString()
            case "datetime": return new Date().toLocaleString()
        }
    }

    // ------------------------------------------------------------------------

    private static customAsset({ asset, color, content }: ComposedLineCustom) {
        color = color ? `#[${color}]` : ''
        const apllyAsset = asset ? this.composedAsset(asset) : undefined
        return `${color}${apllyAsset ?? content}`
    }

    // ------------------------------------------------------------------------

    private static stripAnsiCodes(message: string) {
        return message.replace(this.stripAnsiPattern, '')
    }

    // ------------------------------------------------------------------------

    private static visibleLength(message: string) {
        return this.stripAnsiCodes(message).replace(/\r?\n/g, "").length
    }
}

export default Log