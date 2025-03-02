'use strict';
var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                      ? (desc = Object.getOwnPropertyDescriptor(target, key))
                      : desc,
            d;
        if (
            typeof Reflect === 'object' &&
            typeof Reflect.decorate === 'function'
        )
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r =
                        (c < 3
                            ? d(r)
                            : c > 3
                              ? d(target, key, r)
                              : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var __metadata =
    (this && this.__metadata) ||
    function (k, v) {
        if (
            typeof Reflect === 'object' &&
            typeof Reflect.metadata === 'function'
        )
            return Reflect.metadata(k, v);
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.LoginDto = exports.RegisterDto = void 0;
const class_validator_1 = require('class-validator');
class RegisterDto {
    constructor() {
        this.email = '';
        this.password = '';
        this.roleId = '';
    }
}
exports.RegisterDto = RegisterDto;
__decorate(
    [
        (0, class_validator_1.IsEmail)(
            {},
            { message: 'Please provide a valid email' },
        ),
        (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
        __metadata('design:type', String),
    ],
    RegisterDto.prototype,
    'email',
    void 0,
);
__decorate(
    [
        (0, class_validator_1.IsString)({
            message: 'Password must be a string',
        }),
        (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
        (0, class_validator_1.MinLength)(6, {
            message: 'Password must be at least 6 characters long',
        }),
        __metadata('design:type', String),
    ],
    RegisterDto.prototype,
    'password',
    void 0,
);
__decorate(
    [
        (0, class_validator_1.IsString)({
            message: 'Role ID must be a string',
        }),
        (0, class_validator_1.IsNotEmpty)({ message: 'Role ID is required' }),
        __metadata('design:type', String),
    ],
    RegisterDto.prototype,
    'roleId',
    void 0,
);
class LoginDto {
    constructor() {
        this.email = '';
        this.password = '';
    }
}
exports.LoginDto = LoginDto;
__decorate(
    [
        (0, class_validator_1.IsEmail)(
            {},
            { message: 'Please provide a valid email' },
        ),
        (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
        __metadata('design:type', String),
    ],
    LoginDto.prototype,
    'email',
    void 0,
);
__decorate(
    [
        (0, class_validator_1.IsString)({
            message: 'Password must be a string',
        }),
        (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
        __metadata('design:type', String),
    ],
    LoginDto.prototype,
    'password',
    void 0,
);
