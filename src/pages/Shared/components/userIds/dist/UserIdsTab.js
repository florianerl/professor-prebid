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
var UserIdsTab = function () {
    var _a;
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 4 } },
            react_1["default"].createElement(TabPanel_1["default"], { value: 0, index: 0 }, "Source")),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 4 } },
            react_1["default"].createElement(TabPanel_1["default"], { value: 0, index: 0 }, "User ID")),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 4 } },
            react_1["default"].createElement(TabPanel_1["default"], { value: 0, index: 0 }, "Atype")), (_a = prebid.eids) === null || _a === void 0 ? void 0 :
        _a.map(function (eid, i) {
            return eid.uids.map(function (uid, index) {
                return (react_1["default"].createElement(react_1["default"].Fragment, { key: i + ":" + index },
                    react_1["default"].createElement(GridPaperItem, { cols: 4, value: eid.source }),
                    react_1["default"].createElement(GridPaperItem, { cols: 4, value: uid.id }),
                    react_1["default"].createElement(GridPaperItem, { cols: 4, value: uid.atype })));
            });
        })));
};
exports["default"] = UserIdsTab;
