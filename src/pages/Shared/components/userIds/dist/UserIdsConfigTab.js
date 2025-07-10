"use strict";
exports.__esModule = true;
var react_1 = require("react");
var TabPanel_1 = require("./TabPanel");
var JSONViewerComponent_1 = require("../JSONViewerComponent");
var Typography_1 = require("@mui/material/Typography");
var Grid_1 = require("@mui/material/Grid");
var Paper_1 = require("@mui/material/Paper");
var appStateContext_1 = require("../../contexts/appStateContext");
var GridPaperItem = function (_a) {
    var cols = _a.cols, value = _a.value;
    if (typeof value === 'object' && Object.keys(value).length > 0) {
        return (react_1["default"].createElement(Grid_1["default"], { size: { xs: cols } },
            react_1["default"].createElement(Paper_1["default"], { sx: { height: 1 } },
                react_1["default"].createElement(JSONViewerComponent_1["default"], { src: value, name: false, collapsed: 2, displayObjectSize: false, displayDataTypes: false, sortKeys: false, quotesOnKeys: false, indentWidth: 2, collapseStringsAfterLength: 100, style: { fontSize: '12px', fontFamily: 'roboto', padding: '5px' } }))));
    }
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: cols } },
        react_1["default"].createElement(Paper_1["default"], { sx: { height: 1 } },
            react_1["default"].createElement(Typography_1["default"], { variant: "body1", sx: { whiteSpace: 'normal', wordBreak: 'break-word', p: 0.5 } },
                react_1["default"].createElement("strong", null, typeof value === 'object' ? JSON.stringify(value) : value)))));
};
var ConfigTab = function () {
    var _a, _b, _c, _d, _e, _f, _g;
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    return (((_b = (_a = prebid.config) === null || _a === void 0 ? void 0 : _a.userSync) === null || _b === void 0 ? void 0 : _b.userIds) && ((_d = (_c = prebid.config) === null || _c === void 0 ? void 0 : _c.userSync) === null || _d === void 0 ? void 0 : _d.userIds[0]) && (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 3 } },
            react_1["default"].createElement(TabPanel_1["default"], { value: 1, index: 1 }, "Name")),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
            react_1["default"].createElement(TabPanel_1["default"], { value: 1, index: 1 }, "Storage Type")),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
            react_1["default"].createElement(TabPanel_1["default"], { value: 1, index: 1 }, "Storage Expires")),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
            react_1["default"].createElement(TabPanel_1["default"], { value: 1, index: 1 }, "Storage Name")),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 3 } },
            react_1["default"].createElement(TabPanel_1["default"], { value: 1, index: 1 }, "Params")), (_g = (_f = (_e = prebid.config) === null || _e === void 0 ? void 0 : _e.userSync) === null || _f === void 0 ? void 0 : _f.userIds) === null || _g === void 0 ? void 0 :
        _g.map(function (userId, index) {
            var _a, _b, _c;
            return (react_1["default"].createElement(react_1["default"].Fragment, { key: index },
                react_1["default"].createElement(GridPaperItem, { cols: 3, value: userId.name }),
                react_1["default"].createElement(GridPaperItem, { cols: 2, value: (_a = userId.storage) === null || _a === void 0 ? void 0 : _a.type }),
                react_1["default"].createElement(GridPaperItem, { cols: 2, value: (_b = userId.storage) === null || _b === void 0 ? void 0 : _b.expires }),
                react_1["default"].createElement(GridPaperItem, { cols: 2, value: (_c = userId.storage) === null || _c === void 0 ? void 0 : _c.name }),
                react_1["default"].createElement(GridPaperItem, { cols: 3, value: userId.params })));
        }))));
};
exports["default"] = ConfigTab;
