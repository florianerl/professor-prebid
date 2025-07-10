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
exports.InspectedPageContextProvider = void 0;
var react_1 = require("react");
var utils_1 = require("../utils");
var useDebounce_1 = require("../hooks/useDebounce");
var fetchEvents_1 = require("./fetchEvents");
var InspectedPageContext = react_1.createContext(undefined);
exports.InspectedPageContextProvider = function (_a) {
    var children = _a.children;
    var _b = react_1.useState({}), frames = _b[0], setFrames = _b[1];
    var _c = react_1.useState('false'), downloading = _c[0], setDownloading = _c[1];
    var _d = react_1.useState(''), syncInfo = _d[0], setSyncInfo = _d[1];
    var _e = react_1.useState({}), initReqChainData = _e[0], setInitReqChainData = _e[1];
    var initReqChainResult = useDebounce_1.useDebounce(initReqChainData, 2000);
    var _f = react_1.useState([]), downloadingUrls = _f[0], setDownloadingUrls = _f[1];
    react_1.useEffect(function () {
        // Read initial value from chrome.storage.local
        chrome.storage.local.get(['tabInfos'], function (_a) {
            var tabInfos = _a.tabInfos, url = _a.url;
            return __awaiter(void 0, void 0, void 0, function () {
                var tabInfoWithEvents;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(tabInfos && url)) return [3 /*break*/, 2];
                            return [4 /*yield*/, fetchEvents_1.fetchEvents(tabInfos, setDownloading, setSyncInfo, [])];
                        case 1:
                            tabInfoWithEvents = _b.sent();
                            setFrames(tabInfoWithEvents);
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        });
    }, []);
    react_1.useEffect(function () {
        // Subscribe to changes in local storage
        var handler = function (changes, areaName) {
            if (areaName === 'local' && (changes === null || changes === void 0 ? void 0 : changes.tabInfos)) {
                utils_1.getTabId().then(function (tabId) {
                    var _a;
                    if (JSON.stringify(changes.tabInfos.newValue[tabId]) !== JSON.stringify(changes.tabInfos.oldValue[tabId])) {
                        fetchEvents_1.fetchEvents(__assign(__assign({}, changes.tabInfos.newValue), (_a = {}, _a[tabId] = changes.tabInfos.newValue[tabId], _a)), setDownloading, setSyncInfo, downloadingUrls).then(setFrames);
                    }
                });
            }
        };
        chrome.storage.onChanged.addListener(handler);
        // keep only the last 100 urls
        if (downloadingUrls.length > 100) {
            setDownloadingUrls(downloadingUrls.slice(1));
        }
        // Unsubscribe when component unmounts
        return function () {
            chrome.storage.onChanged.removeListener(handler);
        };
    }, [downloadingUrls]);
    react_1.useEffect(function () {
        // Subscribe to changes in local storage
        var handler = function (changes, areaName) {
            if (areaName === 'local' && changes.initReqChain && changes.initReqChain.newValue) {
                setInitReqChainData(JSON.parse(changes.initReqChain.newValue));
            }
        };
        chrome.storage.onChanged.addListener(handler);
        // Unsubscribe when component unmounts
        return function () {
            chrome.storage.onChanged.removeListener(handler);
        };
    }, []);
    var contextValue = {
        frames: frames,
        downloading: downloading,
        syncState: syncInfo,
        initReqChainResult: initReqChainResult
    };
    return react_1["default"].createElement(InspectedPageContext.Provider, { value: contextValue }, children);
};
exports["default"] = InspectedPageContext;
