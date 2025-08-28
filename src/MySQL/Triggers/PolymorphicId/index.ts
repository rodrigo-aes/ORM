import Trigger from "../Trigger"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    TriggerEvent,
    TriggerOrientation,
    TriggerTiming
} from "../types"

export default class PolymorphicId<
    T extends EntityTarget
> extends Trigger {
    public timing: TriggerTiming = 'BEFORE'
    public event: TriggerEvent = 'INSERT'
    public orientation: TriggerOrientation = 'ROW'

    constructor(
        public target: T,
    ) {
        super(target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public override get name(): string {
        return `${this.tableName}_polymorphic_pk`
    }

    // Protecteds -------------------------------------------------------------
    protected get primary(): string {
        return this.metadata.columns.primary.name
    }

    // ------------------------------------------------------------------------

    protected get prefix(): string {
        return this.target.name
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public action(): string {
        return `
            DECLARE existent INT DEFAULT 1;
            
            IF NEW.${this.primary} = NULL THEN    
                SET NEW.${this.primary} = CONCAT('${this.prefix}_', UUID());
                
                WHILE existent > 0 DO
                    SELECT COUNT(*) INTO existent
                    FROM ${this.tableName}
                    WHERE ${this.primary} = NEW.${this.primary};

                    IF existent > 0 THEN
                        SET NEW.${this.primary} = CONCAT(
                            '${this.prefix}_', UUID()
                        );
                    END IF;
                END WHILE;
            END IF;
        `
    }
}