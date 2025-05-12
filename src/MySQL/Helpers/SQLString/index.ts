export default class SQLStringHelper {
    public static normalizeSQL(sql: string): string {
        return sql
            .replace(/\s+/g, ' ')
            .replace(/\s*([(),=<>!])\s*/g, ' $1 ')
            .trim()
    }
}