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
        info: chalk.cyan,
        success: chalk.green,
        warning: chalk.yellow,
        danger: chalk.red,
        default: chalk.white,
    }

    private static colorPattern = /#\[(\w+)\](.+?)(?=#\[|$)/g
    private static stripAnsiPattern = /\x1b\[[0-9;]*m/g

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
        const charLen = process.stdout.columns - (
            messageLen + assetsLen + 2
        )

        console.log(
            this.parseMessage(`${message} ${'-'.repeat(charLen)} ${assets}`)
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
        if (Array.isArray(config)) return config.map(
            conf => this.handleComposition(conf)
        ).join(' ')

        else return this.handleComposition(config)
    }

    // ------------------------------------------------------------------------

    private static handleComposition(config: ComposedLineConfig) {
        switch (typeof config) {
            case "string": return this.composetAsset(config)
            case "object": return this.customAsset(config)
        }
    }

    // ------------------------------------------------------------------------

    private static composetAsset(asset: ComposedLineAsset) {
        switch (asset) {
            case "date": return new Date().toLocaleDateString()
            case "time": return new Date().toLocaleTimeString()
            case "datetime": return new Date().toLocaleString()
        }
    }

    // ------------------------------------------------------------------------

    private static customAsset({ asset, color, content }: ComposedLineCustom) {
        color = color ? `#[${color}]` : ''
        const apllyAsset = asset ? this.composetAsset(asset) : ''
        return `${color} ${apllyAsset ?? content}`
    }

    // ------------------------------------------------------------------------

    private static stripAnsiCodes(message: string) {
        return message.replace(this.stripAnsiPattern, '')
    }

    // ------------------------------------------------------------------------

    private static visibleLength(message: string) {
        return this.stripAnsiCodes(message).length
    }
}

export default Log