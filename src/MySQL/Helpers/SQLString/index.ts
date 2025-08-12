export default class SQLStringHelper {
    public static normalizeSQL(sql: string): string {
        return sql
            .replace(/\s*\n\s*/g, ' ')
            .trim();
    }
}