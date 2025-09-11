import { resolve } from "path"
import { writeFileSync, mkdirSync, existsSync } from "fs"

export default abstract class ModuleTemplate {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected abstract get name(): string

    // ------------------------------------------------------------------------

    protected abstract get path(): string

    // ------------------------------------------------------------------------

    protected get AlreadyExistsError(): [typeof Error, any[]] {
        return [Error, []]
    }

    // Privates ---------------------------------------------------------------
    private get filePath(): string {
        return `${resolve(this.path, this.name)}.ts`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(): void {
        this.throwIfExists()
        if (!existsSync(this.path)) mkdirSync(this.path, { recursive: true })
        writeFileSync(this.filePath, this.content())
    }

    // Protecteds -------------------------------------------------------------
    protected abstract content(): string

    // ------------------------------------------------------------------------

    protected indent(str: string, spaces: number = 4): string {
        const pad = ' '.repeat(spaces);
        return str
            .split('\n')
            .map(line => (line.trim() ? pad + line : line))
            .join('\n');
    }

    // ------------------------------------------------------------------------

    protected indentMany(parts: (string | [string, number | undefined])[]): (
        string
    ) {
        return parts.map(
            (part) => {
                if (typeof part === 'string') return part

                const [str, indent] = part
                return indent ? this.indent(str, indent) : str
            }
        )
            .map(line => line !== '\n'
                ? line + '\n'
                : line
            )
            .join('')
    }

    // Privates ---------------------------------------------------------------
    private throwIfExists(): void {
        if (existsSync(this.filePath)) {
            const [Error, args] = this.AlreadyExistsError
            throw new Error(...args)
        }
    }
}