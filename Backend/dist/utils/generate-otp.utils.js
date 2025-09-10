"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const otp_intervel_constant_1 = require("../constants/otp-intervel.constant");
const generateOTP = () => {
    return crypto_1.default.randomInt(Number(otp_intervel_constant_1.START_INTERVAL), Number(otp_intervel_constant_1.END_INTERVAL)).toString();
};
exports.generateOTP = generateOTP;
//# sourceMappingURL=generate-otp.utils.js.map