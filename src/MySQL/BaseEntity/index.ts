export default abstract class BaseEntity {
    protected hidden: string[] = []

    constructor(properties: any) {
        Object.assign(this, properties)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): any {
        return Object.entries(this)
            .filter(([key]) => typeof key === 'string')
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    }
}