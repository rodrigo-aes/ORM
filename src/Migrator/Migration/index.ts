import DatabaseSchema from "../../DatabaseSchema"

export default abstract class Migration {
    constructor(protected database: DatabaseSchema) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract up(): void

    // ------------------------------------------------------------------------

    public abstract down(): void
}