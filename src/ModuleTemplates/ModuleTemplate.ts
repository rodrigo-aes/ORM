import { resolve } from "path"
import { writeFileSync, mkdirSync, existsSync } from "fs"

// Helpers
import { ModuleStringHelper } from "./Helpers"

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
        return ModuleStringHelper.indent(str, spaces)
    }

    // ------------------------------------------------------------------------

    protected indentMany(parts: (string | [string, number | undefined])[]): (
        string
    ) {
        return ModuleStringHelper.indentMany(parts)
    }

    // Privates ---------------------------------------------------------------
    private throwIfExists(): void {
        if (existsSync(this.filePath)) {
            const [Error, args] = this.AlreadyExistsError
            throw new Error(...args)
        }
    }
}