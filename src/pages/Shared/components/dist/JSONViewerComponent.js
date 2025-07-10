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
exports.__esModule = true;
var react_1 = require("react");
var react_json_view_1 = require("@uiw/react-json-view");
var JSONViewerComponent = function (_a) {
    var _b = _a.src, src = _b === void 0 ? null : _b, _c = _a.name, name = _c === void 0 ? false : _c, _d = _a.collapsed, collapsed = _d === void 0 ? 3 : _d, _e = _a.displayObjectSize, displayObjectSize = _e === void 0 ? false : _e, _f = _a.displayDataTypes, displayDataTypes = _f === void 0 ? false : _f, _g = _a.sortKeys, sortKeys = _g === void 0 ? false : _g, _h = _a.quotesOnKeys, quotesOnKeys = _h === void 0 ? false : _h, _j = _a.indentWidth, indentWidth = _j === void 0 ? 2 : _j, _k = _a.collapseStringsAfterLength, collapseStringsAfterLength = _k === void 0 ? 100 : _k, style = _a.style;
    return (react_1["default"].createElement(react_json_view_1["default"], { value: src, keyName: String(name), collapsed: collapsed, enableClipboard: true, displayObjectSize: displayObjectSize, displayDataTypes: displayDataTypes, objectSortKeys: sortKeys, 
        // quotesOnKeys={quotesOnKeys}
        indentWidth: indentWidth, stringEllipsis: collapseStringsAfterLength, style: __assign({ fontSize: '12px', fontFamily: 'roboto', padding: '15px' }, style) }));
};
exports["default"] = JSONViewerComponent;
