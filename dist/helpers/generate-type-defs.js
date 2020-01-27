"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function findRelations(schema) {
    const relations = {};
    Object.values(schema.getQueryType()).forEach(field => {
        if (!field) {
            return;
        }
        if (typeof field === 'string') {
            return;
        }
        Object.keys(field).reduce((prev, currentType) => {
            const type = schema.getType(`${currentType}`);
            if (type) {
                Object.entries(type.getFields()).map(([key, value]) => {
                    relations[currentType] =
                        relations[currentType] || {};
                    const relation = value['relation'];
                    if (typeof relation === 'object') {
                        relations[currentType].searchIndex = `${key}: ${value.type}`;
                        const cyper = relation.cyper ||
                            `@relation(name: "${relation.name}", direction: "${relation.direction}")`;
                        relations[currentType].replaceWith = `${relations[currentType].searchIndex} ${cyper}`;
                    }
                });
            }
            return prev;
        }, {});
    });
    return relations;
}
exports.findRelations = findRelations;
function generateTypeDefs(schema) {
    return Object.values(findRelations(schema)).reduce((curr, prev) => curr.replace(prev.searchIndex, prev.replaceWith), graphql_1.printSchema(schema));
}
exports.generateTypeDefs = generateTypeDefs;
