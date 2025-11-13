"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
var Inputs;
(function (Inputs) {
    Inputs["CoolifyUrl"] = "coolify-url";
    Inputs["CoolifyAppId"] = "coolify-app-id";
    Inputs["CoolifyToken"] = "coolify-token";
})(Inputs || (Inputs = {}));
async function deploy() {
    try {
        const url = core.getInput(Inputs.CoolifyUrl, { required: false });
        const applicationId = core.getInput(Inputs.CoolifyAppId, { required: false });
        const token = core.getInput(Inputs.CoolifyToken, { required: false });
        const branch = process.env.GITHUB_REF_NAME;
        core.debug(`Deploy application ${applicationId} of branch ${branch}`);
        const { data } = await (0, axios_1.default)({
            method: 'post',
            url: `${url}/api/v1/deploy?uuid=${applicationId}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        core.setOutput('build-id', data.buildId);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            return core.setFailed(`Error: ${axiosError.response?.status}, message ${JSON.stringify(axiosError.response?.data?.message)}`);
        }
        return core.setFailed('Unknown error occured');
    }
}
void deploy();
