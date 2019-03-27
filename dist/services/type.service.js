"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
let TypeService = class TypeService {
    constructor() {
        this._registeredTypesMap = new Map();
        this._registeredTypes = [];
    }
    get types() {
        return this._registeredTypes;
    }
    getType(type) {
        return this._registeredTypesMap.get(type.name);
    }
    addType(type) {
        this._registeredTypesMap.set(type.name, type);
        this._registeredTypes.push(type);
    }
    addTypes(types = []) {
        types.forEach(type => this.addType(type));
        return this._registeredTypes;
    }
};
TypeService = __decorate([
    core_1.Injectable()
], TypeService);
exports.TypeService = TypeService;
