import { SQLStringHelper } from "../../Helpers"

export const triggersSchemaQuery = (database: string) => SQLStringHelper
    .normalizeSQL(`
        SELECT 
            TRIGGER_NAME as name,
            EVENT_MANIPULATION as event,
            EVENT_OBJECT_TABLE as tableName,
            ACTION_STATEMENT as action,
            ACTION_TIMING as timing,
            ACTION_ORIENTATION AS orientation
        FROM information_schema.TRIGGERS
        WHERE TRIGGER_SCHEMA = '${database}'    
    `)