"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = validateDto;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function validateDto(dtoClass) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const dtoObject = (0, class_transformer_1.plainToClass)(dtoClass, req.body);
        const errors = yield (0, class_validator_1.validate)(dtoObject);
        if (errors.length > 0) {
            const errorMessages = errors.map((error) => {
                return {
                    property: error.property,
                    constraints: error.constraints
                        ? Object.values(error.constraints)
                        : ['Invalid value'],
                };
            });
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errorMessages,
            });
            return;
        }
        // Add validated object to request
        req.body = dtoObject;
        next();
    });
}
