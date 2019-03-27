import { ModuleWithServices } from "@rxdi/core";
import { NEO4J_MODULE_CONFIG } from "./injection.tokens";
export declare class Neo4JModule {
    static forRoot(config?: NEO4J_MODULE_CONFIG): ModuleWithServices;
}
