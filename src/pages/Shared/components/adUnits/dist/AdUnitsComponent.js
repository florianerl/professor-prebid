"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Grid_1 = require("@mui/material/Grid");
var appStateContext_1 = require("../../contexts/appStateContext");
var AdUnitsHeader_1 = require("./AdUnitsHeader");
var AdUnitsGridComponent_1 = require("./grid/AdUnitsGridComponent");
var AdUnitCardsComponent_1 = require("./cards/AdUnitCardsComponent");
var AdUnitsComponent = function () {
    var isSmallScreen = react_1.useContext(appStateContext_1["default"]).isSmallScreen;
    return (react_1["default"].createElement(Grid_1["default"], { container: true, direction: "row", justifyContent: "space-between", spacing: 1, sx: { p: 0.5 } },
        react_1["default"].createElement(AdUnitsHeader_1["default"], null),
        !isSmallScreen && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
            react_1["default"].createElement(AdUnitsGridComponent_1["default"], null))),
        isSmallScreen && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
            react_1["default"].createElement(AdUnitCardsComponent_1["default"], null)))));
};
exports["default"] = AdUnitsComponent;
