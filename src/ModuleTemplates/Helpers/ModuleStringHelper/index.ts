export default class ModuleStringHelper {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static indent(line: string, spaces: number = 4): string {
        return line
            .split('\n')
            .map(line => ' '.repeat(spaces) + line)
            .join('\n');
    }

    // ------------------------------------------------------------------------

    public static indentMany(
        parts: (string | [string, number | undefined])[]
    ): string {
        return parts
            .filter(part => typeof part === 'string'
                ? !!part.trim()
                : !!part[0].trim()
            )
            .map(part => {
                if (typeof part === 'string') return this.handleLine(part)

                const [line, spaces] = part
                return spaces
                    ? this.indent(this.handleLine(line), spaces)
                    : this.handleLine(line)
            })
            .join('\n')
    }

    // Privates ---------------------------------------------------------------
    private static handleLine(line: string): string {
        switch (line) {
            case '#[break]': return ''
            default: return line
        }
    }
}