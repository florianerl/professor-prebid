"use strict";
exports.__esModule = true;
exports.RenderKeyValueComponent = void 0;
var react_1 = require("react");
var Grid_1 = require("@mui/material/Grid");
var Typography_1 = require("@mui/material/Typography");
var JSONViewerComponent_1 = require("./JSONViewerComponent");
exports.RenderKeyValueComponent = function (_a) {
    var label = _a.label, value = _a.value, expanded = _a.expanded, _b = _a.columns, expandedCols = _b[0], collapsedCols = _b[1];
    if (!value)
        return null;
    if (typeof value === 'object' && Object.keys(value).length === 0)
        return null;
    if (typeof value === 'boolean') {
        value = value.toString();
    }
    if (react_1["default"].isValidElement(value) === true) {
        return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? expandedCols : collapsedCols } },
            react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("strong", null,
                        label,
                        ": "),
                    value))));
    }
    if (react_1["default"].isValidElement(value) === false && typeof value === 'object' && Object.keys(value).length > 0)
        return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? expandedCols : collapsedCols } },
            react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(Typography_1["default"], { component: 'span', variant: "body1" },
                    react_1["default"].createElement("strong", null,
                        label,
                        ": ")),
                react_1["default"].createElement(JSONViewerComponent_1["default"], { src: value, name: false, collapsed: false, displayObjectSize: false, displayDataTypes: false, sortKeys: false, quotesOnKeys: false, indentWidth: 2, collapseStringsAfterLength: 100, style: { fontSize: '12px', fontFamily: 'roboto', padding: '5px' } }))));
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? expandedCols : collapsedCols } },
        react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
            react_1["default"].createElement("strong", null,
                label,
                ": "),
            " ",
            typeof value === 'object' ? JSON.stringify(value) : value)));
};
exports["default"] = exports.RenderKeyValueComponent;
