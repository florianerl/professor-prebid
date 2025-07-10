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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var Button_1 = require("@mui/material/Button");
var Grid_1 = require("@mui/material/Grid");
var Paper_1 = require("@mui/material/Paper");
var Google_1 = require("@mui/icons-material/Google");
var Typography_1 = require("@mui/material/Typography");
var BugReport_1 = require("@mui/icons-material/BugReport");
var DeleteOutline_1 = require("@mui/icons-material/DeleteOutline");
var semver_1 = require("semver");
var OverlayControlComponent_1 = require("./OverlayControlComponent");
var appStateContext_1 = require("../../contexts/appStateContext");
var utils_1 = require("../../../Shared/utils");
var DebuggingModuleComponent_1 = require("./debugging/DebuggingModuleComponent");
var ModifyBidResponsesComponent_1 = require("./legacyDebugging/ModifyBidResponsesComponent");
var FileDownload_1 = require("@mui/icons-material/FileDownload");
var isNewDebugVersion = function (input) {
    try {
        return semver_1.gte(input, '7.3.0');
    }
    catch (error) {
        console.warn('invalid version string! enable legacy debug module');
        return false;
    }
};
var dfp_open_console = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tabId, fileUrl, func;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, utils_1.getTabId()];
            case 1:
                tabId = _a.sent();
                fileUrl = chrome.runtime.getURL('openDfpConsole.bundle.js');
                func = function (fileUrl) {
                    var script = document.createElement('script');
                    script.src = fileUrl;
                    (document.head || document.documentElement).appendChild(script);
                    script.onload = function () {
                        script.remove();
                    };
                };
                chrome.scripting.executeScript({ target: { tabId: tabId }, func: func, args: [fileUrl] });
                return [2 /*return*/];
        }
    });
}); };
var openDebugTab = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, chrome.runtime.getURL('app.html')];
            case 1:
                url = _a.sent();
                chrome.tabs.create({ url: url });
                return [2 /*return*/];
        }
    });
}); };
var GridItemButton = function (_a) {
    var clickHandler = _a.clickHandler, label = _a.label, icon = _a.icon;
    return (react_1["default"].createElement(Grid_1["default"], { sx: { height: 36 } },
        react_1["default"].createElement(Paper_1["default"], { elevation: 1, sx: { alignItems: 'center' } },
            react_1["default"].createElement(Button_1["default"], { size: "small", variant: "outlined", onClick: clickHandler, startIcon: icon },
                react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, label)))));
};
var download = function (input, fileName) {
    delete input.eventsUrl;
    var dataStr = JSON.stringify(input, null, 2);
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
};
var ToolsComponent = function () {
    var _a = react_1.useContext(appStateContext_1["default"]), prebid = _a.prebid, prebids = _a.prebids;
    return (react_1["default"].createElement(Grid_1["default"], { container: true, direction: "row", rowSpacing: 0.25, columnSpacing: 0.5, justifyContent: "stretch", alignItems: "center", sx: { p: 0.5 } },
        react_1["default"].createElement(GridItemButton, { label: "open google AdManager console", clickHandler: dfp_open_console, icon: react_1["default"].createElement(Google_1["default"], null) }),
        react_1["default"].createElement(GridItemButton, { label: "open debug tab", clickHandler: openDebugTab, icon: react_1["default"].createElement(BugReport_1["default"], null) }),
        react_1["default"].createElement(GridItemButton, { label: "download", clickHandler: function () { return download(prebids, prebid.eventsUrl.split('//')[1].split('/')[0] + ".json"); }, icon: react_1["default"].createElement(FileDownload_1["default"], null) }),
        react_1["default"].createElement(GridItemButton, { label: "delete tabInfos", clickHandler: function () { var _a; return (_a = chrome.storage) === null || _a === void 0 ? void 0 : _a.local.set({ tabInfos: null }); }, icon: react_1["default"].createElement(DeleteOutline_1["default"], null) }),
        react_1["default"].createElement(OverlayControlComponent_1["default"], null),
        isNewDebugVersion(prebid.version) ? react_1["default"].createElement(DebuggingModuleComponent_1["default"], null) : react_1["default"].createElement(ModifyBidResponsesComponent_1["default"], null)));
};
exports["default"] = ToolsComponent;
