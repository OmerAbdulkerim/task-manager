"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentDto = exports.CreateCommentDto = void 0;
const class_validator_1 = require("class-validator");
/**
 * DTO for creating a new comment
 */
class CreateCommentDto {
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Content is required' }),
    (0, class_validator_1.IsString)({ message: 'Content must be a string' }),
    (0, class_validator_1.Length)(1, 1000, {
        message: 'Content must be between 1 and 1000 characters',
    }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Task ID is required' }),
    (0, class_validator_1.IsUUID)('4', { message: 'Task ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "taskId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Created by ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "createdById", void 0);
/**
 * DTO for updating an existing comment
 */
class UpdateCommentDto {
}
exports.UpdateCommentDto = UpdateCommentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Content is required' }),
    (0, class_validator_1.IsString)({ message: 'Content must be a string' }),
    (0, class_validator_1.Length)(1, 1000, {
        message: 'Content must be between 1 and 1000 characters',
    }),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "content", void 0);
