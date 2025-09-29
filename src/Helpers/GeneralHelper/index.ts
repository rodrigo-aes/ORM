export default class GeneralHelper {
    public static toPascalCase(...parts: string[]): string {
        return parts
            .flatMap(part => part.match(/[A-Z]?[a-z_]+|[0-9_]+/g) ?? [])
            .map(part =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join('')
    }
}