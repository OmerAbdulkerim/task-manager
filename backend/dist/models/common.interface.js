'use strict';
/**
 * Common interfaces used across models
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.TaskStatus = void 0;
/**
 * Task status enum values
 */
var TaskStatus;
(function (TaskStatus) {
    TaskStatus['PENDING'] = 'PENDING';
    TaskStatus['IN_PROGRESS'] = 'IN_PROGRESS';
    TaskStatus['COMPLETED'] = 'COMPLETED';
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
