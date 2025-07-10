"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var Card_1 = require("@mui/material/Card");
var CardHeader_1 = require("@mui/material/CardHeader");
var Grid_1 = require("@mui/material/Grid");
var ConfigComponent_1 = require("../ConfigComponent");
var BorderBottom_1 = require("@mui/icons-material/BorderBottom");
var CardContent_1 = require("@mui/material/CardContent");
var appStateContext_1 = require("../../../contexts/appStateContext");
var RenderKeyValueComponent_1 = require("../../RenderKeyValueComponent");
var FloorsModuleComponent = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var floors = prebid.config.floors;
    var _j = react_1["default"].useState(false), expanded = _j[0], setExpanded = _j[1];
    var _k = react_1["default"].useState(4), maxWidth = _k[0], setMaxWidth = _k[1];
    var ref = react_1["default"].useRef(null);
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 8);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    if (!floors)
        return null;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: maxWidth }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight, maxHeight: expanded ? 'unset' : ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(BorderBottom_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Floors Module"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" }, "Dynamic Floors"), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 2 },
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Auction Delay:", value: floors.auctionDelay, columns: [4, 12], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Currency:", value: (_a = floors.data) === null || _a === void 0 ? void 0 : _a.currency, columns: [4, 12], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Schema Version:", value: (_b = floors.data) === null || _b === void 0 ? void 0 : _b.floorsSchemaVersion, columns: [4, 12], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Model Groups:", value: (_d = (_c = floors.data) === null || _c === void 0 ? void 0 : _c.modelGroups) === null || _d === void 0 ? void 0 : _d.length, columns: [4, 12], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Floor Provider:", value: floors.floorProvider, columns: [4, 12], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Model Timestamp:", value: (_e = floors.data) === null || _e === void 0 ? void 0 : _e.modelTimestamp, columns: [4, 12], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Model WeightSum:", value: (_f = floors.data) === null || _f === void 0 ? void 0 : _f.modelWeightSum, columns: [6, 6], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Endpoint Url:", value: (_g = floors.endpoint) === null || _g === void 0 ? void 0 : _g.url, columns: [6, 12], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Enforcement Floor Deals:", value: (_h = floors.enforcement) === null || _h === void 0 ? void 0 : _h.floorDeals, columns: [4, 12], expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "Floors:", value: floors, columns: [12, 12], expanded: expanded }))))));
};
exports["default"] = FloorsModuleComponent;
