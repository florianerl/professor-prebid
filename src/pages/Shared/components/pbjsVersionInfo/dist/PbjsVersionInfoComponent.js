"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Grid_1 = require("@mui/material/Grid");
var PbjsVersionInfoContent_1 = require("./PbjsVersionInfoContent");
var material_1 = require("@mui/material");
var PbjsVersionInfoComponent = function (_a) {
    var close = _a.close;
    return (react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 1, sx: { p: 0.5 } },
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
            react_1["default"].createElement(material_1.Paper, null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 1, sx: { p: 0.5 } },
                    react_1["default"].createElement(PbjsVersionInfoContent_1["default"], { close: close }))))));
};
exports["default"] = PbjsVersionInfoComponent;
