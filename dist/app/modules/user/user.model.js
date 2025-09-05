"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" },
    password: { type: String, required: true },
    nidNumber: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: Object.values(user_interface_1.ROLE),
        default: user_interface_1.ROLE.USER
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IS_ACTIVE),
        default: user_interface_1.IS_ACTIVE.ACTIVE
    },
    adminCommission: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet",
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.User = (0, mongoose_1.model)("User", userSchema);
