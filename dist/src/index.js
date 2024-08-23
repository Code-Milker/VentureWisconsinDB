"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indexSetup_1 = __importDefault(require("./indexSetup"));
const PORT = process.env.PORT || 80;
indexSetup_1.default.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
