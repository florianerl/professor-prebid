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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var FormControl_1 = require("@mui/material/FormControl");
var FormControlLabel_1 = require("@mui/material/FormControlLabel");
var Switch_1 = require("@mui/material/Switch");
var constants_1 = require("../../constants");
var Button_1 = require("@mui/material/Button");
var TextField_1 = require("@mui/material/TextField");
var Typography_1 = require("@mui/material/Typography");
var Box_1 = require("@mui/material/Box");
var JSONViewerComponent_1 = require("../JSONViewerComponent");
var appStateContext_1 = require("../../contexts/appStateContext");
var inspectedPageContext_1 = require("../../contexts/inspectedPageContext");
var Grid_1 = require("@mui/material/Grid");
var Refresh_1 = require("@mui/icons-material/Refresh");
var Snackbar_1 = require("@mui/material/Snackbar");
var IconButton_1 = require("@mui/material/IconButton");
var Close_1 = require("@mui/icons-material/Close");
var WarningAmberOutlined_1 = require("@mui/icons-material/WarningAmberOutlined");
require("./InitiatorComponent.css");
var react_loader_spinner_1 = require("react-loader-spinner");
var gridStyle = {
    p: 0.5,
    '& .MuiGrid-item > .MuiPaper-root': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};
var InitiatorComponent = function () {
    var _a;
    var _b = react_1.useContext(appStateContext_1["default"]), isRefresh = _b.isRefresh, initDataLoaded = _b.initDataLoaded, setInitiatorOutput = _b.setInitiatorOutput, setInitDataLoaded = _b.setInitDataLoaded, setIsRefresh = _b.setIsRefresh;
    var initReqChainResult = react_1.useContext(inspectedPageContext_1["default"]).initReqChainResult;
    var _c = react_1.useState(null), initChainFeatureStatus = _c[0], setInitChainFeatureStatus = _c[1];
    var _d = react_1.useState(''), rootUrl = _d[0], setRootUrl = _d[1];
    var _e = react_1.useState(false), showReqChain = _e[0], setShowReqChain = _e[1];
    var _f = react_1.useState(true), urlButtonDisabled = _f[0], setUrlButtonDisabled = _f[1];
    var _g = react_1["default"].useState([]), toastMessage = _g[0], setToastMessage = _g[1];
    var _h = react_1["default"].useState(false), showToastMessage = _h[0], setShowToastMessage = _h[1];
    var _j = react_1["default"].useState(undefined), messageInfo = _j[0], setMessageInfo = _j[1];
    (_a = chrome.tabs) === null || _a === void 0 ? void 0 : _a.onUpdated.addListener(function (tabId, info) {
        if (info.status === 'complete') {
            setShowReqChain(true);
            setInitDataLoaded(true);
        }
    });
    react_1.useEffect(function () {
        if (toastMessage.length && !messageInfo) {
            // Set a new toast message when we don't have an active one
            setMessageInfo(__assign({}, toastMessage[0]));
            setToastMessage(function (prev) { return prev.slice(1); });
            setShowToastMessage(true);
        }
        else if (toastMessage.length && messageInfo && showToastMessage) {
            // Close an active toast message when a new one is added
            setShowToastMessage(false);
        }
    }, [toastMessage, messageInfo, showToastMessage]);
    react_1.useEffect(function () {
        chrome.storage.local.get(constants_1.INITIATOR_TOGGLE, function (result) {
            var value = result ? result[constants_1.INITIATOR_TOGGLE] : false;
            setInitChainFeatureStatus(value);
        });
    }, [initChainFeatureStatus]);
    react_1.useEffect(function () {
        chrome.storage.local.get(constants_1.INITIATOR_ROOT_URL, function (result) {
            var value = result ? result[constants_1.INITIATOR_ROOT_URL] : rootUrl;
            setRootUrl(value);
        });
    }, []);
    var handleRefreshClickToShowToastMessage = function (message) {
        setToastMessage(function (prev) { return __spreadArrays(prev, [{ message: message, key: new Date().getTime() }]); });
    };
    var handleCloseToastMessageClick = function (event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setShowToastMessage(false);
    };
    var handleToastMessageExited = function () {
        setMessageInfo(undefined);
    };
    var handleInitChainFeatureStatusChange = function (event) {
        var _a;
        setInitChainFeatureStatus(event.target.checked);
        var checked = event.target.checked;
        chrome.storage.local.set((_a = {}, _a[constants_1.INITIATOR_TOGGLE] = checked, _a), function () {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, { type: constants_1.INITIATOR_TOGGLE, consoleState: checked });
            });
        });
    };
    var handleSettingRootUrl = function () {
        var _a;
        if (rootUrl === '') {
            return;
        }
        chrome.storage.local.set((_a = {}, _a[constants_1.INITIATOR_ROOT_URL] = rootUrl, _a), function () {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, { type: constants_1.INITIATOR_ROOT_URL, rootUrl: rootUrl });
            });
            setUrlButtonDisabled(true);
        });
    };
    var handleChangeOfRootUrlField = function (e) {
        setRootUrl(e.target.value);
        setUrlButtonDisabled(false);
    };
    var renderToasterContent = function (message) {
        return (react_1["default"].createElement("div", { className: "toaster-content-wrapper" },
            react_1["default"].createElement(WarningAmberOutlined_1["default"], { className: "toaster-warning-icon", color: "secondary" }),
            react_1["default"].createElement("p", null, message)));
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Grid_1["default"], { container: true, direction: "row", justifyContent: "start", spacing: 0.25, sx: gridStyle },
            react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
                react_1["default"].createElement(Box_1["default"], { sx: { backgroundColor: 'background.paper', borderRadius: 1, p: 1 }, className: "box-wrapper" },
                    react_1["default"].createElement(Typography_1["default"], { paragraph: true },
                        react_1["default"].createElement("b", null, "Use Case:")),
                    react_1["default"].createElement(Typography_1["default"], { paragraph: true },
                        "This tool was designed to be used to test SSP User Sync URL's in order to create transparancy and determine if privacy parameters were correctly getting passing down the request chain generated by a User Sync URL. Under the hood this tool uses the Chrome Devtools Network API",
                        ' ',
                        react_1["default"].createElement("strong", { className: "initiator__strong" }, "which requires that a new instance of the Chrome devtools be opened each time a modification is made to this Network Inspector tool (Ex. modifying the root URL, toggling the feature on/off, etc.)"),
                        ". For more details see the instructions below."),
                    react_1["default"].createElement(Typography_1["default"], { paragraph: true },
                        react_1["default"].createElement("b", null, "Instructions on How to Use:")),
                    react_1["default"].createElement(Typography_1["default"], { paragraph: true }, "Note: It is advised when testing User Sync URL's that you clear cookies relative to the domain you are testing. This will ensure that results are in-line with an initial visit to the current page. Additionally, the first resource matching the root URL will be used to generate the initiator request chain."),
                    react_1["default"].createElement(Typography_1["default"], { paragraph: true },
                        "View instructions on the Prebid documentation site",
                        ' ',
                        react_1["default"].createElement("a", { href: "https://docs.prebid.org/tools/professor-prebid.html", target: "_blank", rel: "noreferrer" }, "here"),
                        "."),
                    react_1["default"].createElement("br", null),
                    react_1["default"].createElement("br", null),
                    react_1["default"].createElement("div", { className: "initiator-form" },
                        react_1["default"].createElement(FormControl_1["default"], null,
                            react_1["default"].createElement(FormControlLabel_1["default"], { control: react_1["default"].createElement(Switch_1["default"], { checked: initChainFeatureStatus || false, onChange: handleInitChainFeatureStatusChange }), label: initChainFeatureStatus ? 'On' : 'Off' })),
                        react_1["default"].createElement(TextField_1["default"], { id: "outlined-basic", label: "Enter Root URL", variant: "outlined", size: "small", className: "child margin-right", value: rootUrl, onChange: handleChangeOfRootUrlField }),
                        react_1["default"].createElement(Button_1["default"], { variant: "outlined", className: "submit-button margin-right", onClick: handleSettingRootUrl, disabled: urlButtonDisabled }, "Set URL")),
                    react_1["default"].createElement("div", { className: "initiator__output " + ((showReqChain || initDataLoaded) && initReqChainResult && Object.keys(initReqChainResult).length > 0 ? 'initiator__output-left-align' : '') }, (showReqChain || initDataLoaded) && initReqChainResult && Object.keys(initReqChainResult).length > 0 ? (react_1["default"].createElement(JSONViewerComponent_1["default"], { src: initReqChainResult, name: false, collapsed: 2, displayObjectSize: true, displayDataTypes: false, sortKeys: false, quotesOnKeys: false, indentWidth: 2, collapseStringsAfterLength: 100, style: { fontSize: '12px', fontFamily: 'roboto', padding: '5px' } })) : isRefresh ? (react_1["default"].createElement("div", { className: "initiator__loader-wrapper" },
                        react_1["default"].createElement("p", null, "Generating initiator request chain..."),
                        react_1["default"].createElement("div", { className: "loader" },
                            react_1["default"].createElement(react_loader_spinner_1.Bars, { height: "80", width: "50", color: "#ff6f00", ariaLabel: "bars-loading", wrapperStyle: {}, wrapperClass: "", visible: true })))) : (react_1["default"].createElement("p", { className: "initiator__short-instructions" },
                        "The initiator request chain will go here.",
                        react_1["default"].createElement("br", null),
                        "Follow the instructions above, then ",
                        react_1["default"].createElement("strong", { className: "initiator__strong" }, "close"),
                        " and ",
                        react_1["default"].createElement("strong", { className: "initiator__strong" }, "re-open"),
                        " the Chrome Devtools.",
                        react_1["default"].createElement("br", null),
                        "Afterwards navigate back to the \"Network Inspector\" tool and click the refresh icon here:\u00A0\u00A0",
                        react_1["default"].createElement(Refresh_1["default"], { className: "initiator__refresh-icon", onClick: function () {
                                if (!initChainFeatureStatus || !rootUrl) {
                                    handleRefreshClickToShowToastMessage("Make sure that the Network Inspector tool is enabled and that a root URL has been set.");
                                    return;
                                }
                                setInitiatorOutput({});
                                setInitDataLoaded(false);
                                setIsRefresh(true);
                                chrome.storage.local.set({ initReqChain: JSON.stringify(null) });
                                chrome.devtools.inspectedWindow.reload({ ignoreCache: true });
                            } })))),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement(Snackbar_1["default"], { key: messageInfo ? messageInfo.key : undefined, open: showToastMessage, autoHideDuration: 6000, onClose: handleCloseToastMessageClick, TransitionProps: { onExited: handleToastMessageExited }, message: messageInfo ? renderToasterContent(messageInfo.message) : undefined, className: "toaster-modal", action: react_1["default"].createElement(react_1["default"].Fragment, null,
                                react_1["default"].createElement(IconButton_1["default"], { "aria-label": "close", color: "inherit", sx: { p: 0.5 }, onClick: handleCloseToastMessageClick },
                                    react_1["default"].createElement(Close_1["default"], { className: "toaster-close-icon" }))) })))))));
};
exports["default"] = InitiatorComponent;
