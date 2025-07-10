"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Paper_1 = require("@mui/material/Paper");
var Grid_1 = require("@mui/material/Grid");
var AdUnitsComponentState_1 = require("../AdUnitsComponentState");
var AdUnitsGridRow_1 = require("./AdUnitsGridRow");
var appStateContext_1 = require("../../../contexts/appStateContext");
var SyncAlt_1 = require("@mui/icons-material/SyncAlt");
var SyncProblem_1 = require("@mui/icons-material/SyncProblem");
var RotateRight_1 = require("@mui/icons-material/RotateRight");
var material_1 = require("@mui/material");
var AdUnitsGridComponent = function () {
    var _a, _b;
    var adUnits = AdUnitsComponentState_1["default"]().adUnits;
    var _c = react_1.useContext(appStateContext_1["default"]), isPanel = _c.isPanel, googleAdManager = _c.googleAdManager;
    var showAdServerComlumn = isPanel && ((_a = googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.slots) === null || _a === void 0 ? void 0 : _a.length) > 0;
    var showOrtb2ImpColumn = isPanel && adUnits.find(function (_a) {
        var ortb2Imp = _a.ortb2Imp;
        return ortb2Imp;
    });
    var columns = 12;
    if (showAdServerComlumn)
        columns += 4;
    if (showOrtb2ImpColumn)
        columns += 4;
    return (react_1["default"].createElement(Grid_1["default"], { spacing: 0.25, container: true, direction: "row", columns: columns },
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 4, md: 4 } },
            react_1["default"].createElement(Paper_1["default"], null,
                react_1["default"].createElement(Typography_1["default"], { variant: "h3", sx: { p: 0.5 } }, "Code"))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 4, md: 4 } },
            react_1["default"].createElement(Paper_1["default"], null,
                react_1["default"].createElement(Typography_1["default"], { variant: "h3", sx: { p: 0.5 } }, "Media Types"))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 4, md: 4 } },
            react_1["default"].createElement(Paper_1["default"], null,
                react_1["default"].createElement(Typography_1["default"], { variant: "h3", sx: { p: 0.5 } }, "Bidders"))),
        isPanel && ((_b = googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.slots) === null || _b === void 0 ? void 0 : _b.length) > 0 && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 4, md: 4 } },
            react_1["default"].createElement(Paper_1["default"], { sx: { display: 'flex', flexDirection: 'row', alignItems: 'center' } },
                react_1["default"].createElement(Typography_1["default"], { variant: "h3", sx: { p: 0.5 } }, "Ad Server"),
                (googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.async) === false && (react_1["default"].createElement(material_1.Tooltip, { title: "Ad Server is not async" },
                    react_1["default"].createElement(SyncProblem_1["default"], { fontSize: "small", color: "error" }))),
                (googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.fetchBeforeKeyvalue) === true && (react_1["default"].createElement(material_1.Tooltip, { title: "Ad Server fetch before key/value was set" },
                    react_1["default"].createElement(SyncAlt_1["default"], { fontSize: "small", color: "error" }))),
                (googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.fetchBeforeRefresh) === true && (react_1["default"].createElement(material_1.Tooltip, { title: "Ad Server fetch before refresh" },
                    react_1["default"].createElement(RotateRight_1["default"], { fontSize: "small", color: "error" })))))),
        isPanel && !!adUnits.find(function (_a) {
            var ortb2Imp = _a.ortb2Imp;
            return ortb2Imp;
        }) && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 4, md: 4 } },
            react_1["default"].createElement(Paper_1["default"], { sx: { display: 'flex', flexDirection: 'row', alignItems: 'center' } },
                react_1["default"].createElement(Typography_1["default"], { variant: "h3", sx: { p: 0.5 } }, "OpenRtb2 Imp")))), adUnits === null || adUnits === void 0 ? void 0 :
        adUnits.map(function (adUnit, index) { return (react_1["default"].createElement(AdUnitsGridRow_1["default"], { adUnit: adUnit, key: index })); })));
};
exports["default"] = AdUnitsGridComponent;
