"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Box_1 = require("@mui/material/Box");
var Switch_1 = require("@mui/material/Switch");
var FormControlLabel_1 = require("@mui/material/FormControlLabel");
var Grid_1 = require("@mui/material/Grid");
var Typography_1 = require("@mui/material/Typography");
var FormControl_1 = require("@mui/material/FormControl");
var utils_1 = require("../../../../Shared/utils");
var BidderFilter_1 = require("./BidderFilter");
var BidOverWriteComponent_1 = require("./BidOverWriteComponent");
var appStateContext_1 = require("../../../contexts/appStateContext");
var ModifyBidResponsesComponent = function () {
    var _a = react_1.useContext(appStateContext_1["default"]), isSmallScreen = _a.isSmallScreen, pbjsNamespace = _a.pbjsNamespace;
    var _b = react_1.useState(null), debugConfgigState = _b[0], setDebugConfigState = _b[1];
    var handleChange = function (input) { return __awaiter(void 0, void 0, void 0, function () {
        var tabId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = __assign(__assign({}, debugConfgigState), input);
                    setDebugConfigState(input);
                    return [4 /*yield*/, utils_1.getTabId()];
                case 1:
                    tabId = _a.sent();
                    return [4 /*yield*/, chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            func: function (namespace, input) {
                                sessionStorage.setItem(namespace + ":debugging", "" + JSON.stringify(input));
                            },
                            args: [pbjsNamespace, input]
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleEnabledChange = function (event) {
        handleChange({ enabled: event.target.checked });
    };
    // read config from session storage & set states on mount
    react_1.useEffect(function () {
        var getInitialState = function () { return __awaiter(void 0, void 0, void 0, function () {
            var tabId, result, savedConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getTabId()];
                    case 1:
                        tabId = _a.sent();
                        return [4 /*yield*/, chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                func: function (namespace) {
                                    return sessionStorage.getItem(namespace + ":debugging");
                                },
                                args: [pbjsNamespace]
                            })];
                    case 2:
                        result = _a.sent();
                        savedConfig = JSON.parse(result[0].result);
                        setDebugConfigState(savedConfig);
                        return [2 /*return*/];
                }
            });
        }); };
        getInitialState();
    }, [pbjsNamespace]);
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
        react_1["default"].createElement(Box_1["default"], { sx: { backgroundColor: 'background.paper', borderRadius: 1, p: 1 } },
            react_1["default"].createElement(Grid_1["default"], { container: true, rowSpacing: 1, columnSpacing: 0.5 },
                react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
                    react_1["default"].createElement(Grid_1["default"], { container: true, rowSpacing: 1, columnSpacing: 0.5 },
                        react_1["default"].createElement(Grid_1["default"], { size: { xs: 1, md: 1 } },
                            react_1["default"].createElement(Box_1["default"], { sx: { alignContent: 'center', transform: isSmallScreen ? 'rotate(90deg)' : 'unset' } },
                                react_1["default"].createElement(FormControl_1["default"], null,
                                    react_1["default"].createElement(FormControlLabel_1["default"], { control: react_1["default"].createElement(Switch_1["default"], { checked: !!(debugConfgigState === null || debugConfgigState === void 0 ? void 0 : debugConfgigState.enabled), onChange: handleEnabledChange }), label: "" })))),
                        react_1["default"].createElement(Grid_1["default"], { size: { xs: 11, md: 11 } },
                            react_1["default"].createElement(Box_1["default"], { sx: { border: 1, borderColor: (debugConfgigState === null || debugConfgigState === void 0 ? void 0 : debugConfgigState.enabled) ? 'primary.main' : 'text.disabled', borderRadius: 1 } },
                                react_1["default"].createElement(Typography_1["default"], { variant: "h4", sx: { width: 1, p: 1, color: (debugConfgigState === null || debugConfgigState === void 0 ? void 0 : debugConfgigState.enabled) ? 'primary.main' : 'text.disabled' } }, "Enable Debugging"))),
                        react_1["default"].createElement(BidderFilter_1["default"], { debugConfigState: debugConfgigState, setDebugConfigState: handleChange }),
                        react_1["default"].createElement(BidOverWriteComponent_1["default"], { debugConfigState: debugConfgigState, setDebugConfigState: handleChange })))))));
};
exports["default"] = ModifyBidResponsesComponent;
