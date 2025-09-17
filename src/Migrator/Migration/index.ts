import DatabaseSchema from "../../DatabaseSchema"

export default abstract class Migration {
    constructor(protected database: DatabaseSchema) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define process to roll up migration
     */
    public abstract up(): void

    // ------------------------------------------------------------------------

    /**
     * Define process to roll down migration
     */
    public abstract down(): void
}