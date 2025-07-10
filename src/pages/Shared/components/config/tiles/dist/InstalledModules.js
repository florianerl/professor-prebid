"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var Card_1 = require("@mui/material/Card");
var CardContent_1 = require("@mui/material/CardContent");
var CardHeader_1 = require("@mui/material/CardHeader");
var Grid_1 = require("@mui/material/Grid");
var ConfigComponent_1 = require("../ConfigComponent");
var BorderBottom_1 = require("@mui/icons-material/BorderBottom");
var appStateContext_1 = require("../../../contexts/appStateContext");
var RenderKeyValueComponent_1 = require("../../RenderKeyValueComponent");
var InstalledModulesComponent = function () {
    var _a = react_1["default"].useState(false), expanded = _a[0], setExpanded = _a[1];
    var _b = react_1["default"].useState(4), maxWidth = _b[0], setMaxWidth = _b[1];
    var ref = react_1["default"].useRef(null);
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var installedModules = prebid.installedModules;
    if (!installedModules || !Array.isArray(installedModules))
        return null;
    var bidAdapters = installedModules.filter(function (module) { return module.includes('BidAdapter'); }).sort();
    var analyticsAdapters = installedModules.filter(function (module) { return module.includes('AnalyticsAdapter'); }).sort();
    var idSystems = installedModules.filter(function (module) { return module.includes('IdSystem') || module.includes('UserID'); }).sort();
    var miscellaneous = installedModules.filter(function (module) { return !module.includes('BidAdapter') && !module.includes('AnalyticsAdapter') && !module.includes('IdSystem'); }).sort();
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 4);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: maxWidth }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight, maxHeight: expanded ? 'unset' : ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(BorderBottom_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Installed Modules"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" }), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 2 },
                    !expanded && react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Bid Adapters", value: bidAdapters.length > 4 ? __spreadArrays(bidAdapters.slice(0, 4), ['...']) : bidAdapters, columns: [12, 12], expanded: expanded }),
                    expanded && (react_1["default"].createElement(react_1["default"].Fragment, null,
                        bidAdapters && react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Bid Adapters", value: bidAdapters, columns: [12, 12], expanded: expanded }),
                        analyticsAdapters && react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Analytics Adapters", value: analyticsAdapters, columns: [12, 12], expanded: expanded }),
                        idSystems && react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Id Systems", value: idSystems, columns: [12, 12], expanded: expanded }),
                        miscellaneous && react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Miscellaneous", value: miscellaneous, columns: [12, 12], expanded: expanded }))))))));
};
exports["default"] = InstalledModulesComponent;
