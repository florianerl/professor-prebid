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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var Box_1 = require("@mui/material/Box");
var Switch_1 = require("@mui/material/Switch");
var FormControlLabel_1 = require("@mui/material/FormControlLabel");
var Button_1 = require("@mui/material/Button");
var Grid_1 = require("@mui/material/Grid");
var Typography_1 = require("@mui/material/Typography");
var FormGroup_1 = require("@mui/material/FormGroup");
var Add_1 = require("@mui/icons-material/Add");
var utils_1 = require("../../../../Shared/utils");
var constants_1 = require("../../../constants");
var RuleComponent_1 = require("./RuleComponent");
var appStateContext_1 = require("../../../contexts/appStateContext");
var utils_2 = require("../../../../Shared/utils");
var get = function (obj, path) {
    if (path === void 0) { path = []; }
    return path.reduce(function (acc, key) { return (acc && acc[key] !== undefined ? acc[key] : undefined); }, obj);
};
var set = function (obj, path, value) {
    var temp = obj;
    path.slice(0, -1).forEach(function (key) {
        if (typeof temp[key] !== 'object' || temp[key] === null) {
            temp[key] = {};
        }
        temp = temp[key];
    });
    temp[path[path.length - 1]] = value;
    return obj;
};
var DebuggingModuleComponent = function () {
    var _a;
    var _b = react_1.useContext(appStateContext_1["default"]), prebid = _b.prebid, pbjsNamespace = _b.pbjsNamespace;
    var _c = react_1.useState({ enabled: false, intercept: [] }), debuggingModuleConfig = _c[0], setDebuggingModuleConfig = _c[1];
    var _d = react_1.useState(false), storeRules = _d[0], setStoreRules = _d[1];
    react_1.useEffect(function () {
        chrome.storage.local.get(constants_1.STORE_RULES_TOGGLE, function (result) {
            var checked = result ? result[constants_1.STORE_RULES_TOGGLE] : false;
            setStoreRules(checked);
        });
    }, [storeRules]);
    var writeConfigToStorage = function (input) { return __awaiter(void 0, void 0, void 0, function () {
        var tabId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setDebuggingModuleConfig(input);
                    return [4 /*yield*/, utils_1.getTabId()];
                case 1:
                    tabId = _a.sent();
                    return [4 /*yield*/, chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            func: function (namespace, input) {
                                sessionStorage.setItem("__" + namespace + "_debugging__", "" + JSON.stringify(input));
                            },
                            args: [pbjsNamespace, input]
                        })];
                case 2:
                    _a.sent();
                    if (!storeRules)
                        return [2 /*return*/];
                    return [4 /*yield*/, chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            func: function (namespace, input) {
                                localStorage.setItem("__" + namespace + "_debugging__", "" + JSON.stringify(input));
                            },
                            args: [pbjsNamespace, input]
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleRulesFormChange = function (_action, value, path, deletePath) { return __awaiter(void 0, void 0, void 0, function () {
        var newFormValues, last, last_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newFormValues = __assign({}, debuggingModuleConfig);
                    set(newFormValues, path, value);
                    if (deletePath) {
                        last = deletePath.pop();
                        delete get(newFormValues, deletePath)[last];
                        if (Object.keys(get(newFormValues, deletePath)).length === 0) {
                            last_1 = deletePath.pop();
                            // don't leave empty native object
                            if (last_1 === 'native') {
                                delete get(newFormValues, deletePath)[last_1];
                            }
                        }
                    }
                    setDebuggingModuleConfig(newFormValues);
                    return [4 /*yield*/, writeConfigToStorage(newFormValues)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleStoreRulesChange = function (event) {
        var _a;
        setStoreRules(event.target.checked);
        var checked = event.target.checked;
        chrome.storage.local.set((_a = {}, _a[constants_1.STORE_RULES_TOGGLE] = checked, _a), function () {
            utils_2.sendChromeTabsMessage(constants_1.STORE_RULES_TOGGLE, { consoleState: checked });
            // chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            //   const tab = tabs[0];
            //   chrome.tabs.sendMessage(tab.id as number, { type: STORE_RULES_TOGGLE, consoleState: checked });
            // });
        });
    };
    // read config from session storage & set states on mount
    react_1.useEffect(function () {
        var getInitialState = function () { return __awaiter(void 0, void 0, void 0, function () {
            var tabId, first, savedConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getTabId()];
                    case 1:
                        tabId = _a.sent();
                        return [4 /*yield*/, chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                func: function (namespace) { return sessionStorage.getItem("__" + namespace + "_debugging__"); },
                                args: [pbjsNamespace]
                            })];
                    case 2:
                        first = (_a.sent())[0];
                        if (!(!first || !first.result)) return [3 /*break*/, 4];
                        return [4 /*yield*/, chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                func: function (namespace) { return localStorage.getItem("__" + namespace + "_debugging__"); },
                                args: [pbjsNamespace]
                            })];
                    case 3:
                        first = (_a.sent())[0];
                        _a.label = 4;
                    case 4:
                        if (!first || !first.result)
                            return [2 /*return*/];
                        savedConfig = JSON.parse(first.result);
                        setDebuggingModuleConfig(savedConfig);
                        writeConfigToStorage(savedConfig);
                        return [2 /*return*/];
                }
            });
        }); };
        getInitialState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pbjsNamespace]);
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
        react_1["default"].createElement(Box_1["default"], { sx: { backgroundColor: 'background.paper', borderRadius: 1, p: 1 } },
            react_1["default"].createElement(Grid_1["default"], { container: true, rowSpacing: 1, columnSpacing: 0.5 },
                react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
                    react_1["default"].createElement(FormGroup_1["default"], { sx: { flexDirection: 'row' } },
                        react_1["default"].createElement(FormControlLabel_1["default"], { sx: { width: 0.33 }, control: react_1["default"].createElement(Switch_1["default"], { checked: !!(debuggingModuleConfig === null || debuggingModuleConfig === void 0 ? void 0 : debuggingModuleConfig.enabled), onChange: function () {
                                    handleRulesFormChange('update', !debuggingModuleConfig.enabled, ['enabled']);
                                } }), label: react_1["default"].createElement(Typography_1["default"], { variant: "h4", sx: { width: 1, p: 1, color: (debuggingModuleConfig === null || debuggingModuleConfig === void 0 ? void 0 : debuggingModuleConfig.enabled) ? 'primary.main' : 'text.disabled' } }, "Enable Debugging Module") }),
                        react_1["default"].createElement(FormControlLabel_1["default"], { sx: { width: 0.33 }, control: react_1["default"].createElement(Switch_1["default"], { checked: storeRules, onChange: handleStoreRulesChange }), label: react_1["default"].createElement(Typography_1["default"], { variant: "h4", sx: { width: 1, p: 1, color: (debuggingModuleConfig === null || debuggingModuleConfig === void 0 ? void 0 : debuggingModuleConfig.enabled) ? 'primary.main' : 'text.disabled' } }, "Store Rules in Local Storage") }),
                        react_1["default"].createElement(Button_1["default"], { startIcon: react_1["default"].createElement(Add_1["default"], null), onClick: function () {
                                handleRulesFormChange('update', __spreadArrays(debuggingModuleConfig.intercept, [{ when: { adUnitCode: '' }, then: { cpm: 20 } }]), ['intercept']);
                            }, sx: { width: 0.3 } },
                            react_1["default"].createElement(Typography_1["default"], { variant: "h4" }, "Add Rule")))),
                react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
                    react_1["default"].createElement(Box_1["default"], { component: "form", noValidate: true, autoComplete: "off" },
                        react_1["default"].createElement(Grid_1["default"], { container: true, rowSpacing: 1, columnSpacing: 0.5 }, prebid && ((_a = debuggingModuleConfig === null || debuggingModuleConfig === void 0 ? void 0 : debuggingModuleConfig.intercept) === null || _a === void 0 ? void 0 : _a.map(function (rule, index) { return (react_1["default"].createElement(RuleComponent_1["default"], { key: index, rule: rule, ruleIndex: index, handleRulesFormChange: handleRulesFormChange, prebid: prebid, removeRule: function () {
                                debuggingModuleConfig.intercept.splice(index, 1);
                                handleRulesFormChange('update', debuggingModuleConfig.intercept, ['intercept']);
                            } })); })))))))));
};
exports["default"] = DebuggingModuleComponent;
