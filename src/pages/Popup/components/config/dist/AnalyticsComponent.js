"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var Analytics_1 = require("@mui/icons-material/Analytics");
var Card_1 = require("@mui/material/Card");
var CardContent_1 = require("@mui/material/CardContent");
var CardHeader_1 = require("@mui/material/CardHeader");
var Grid_1 = require("@mui/material/Grid");
var ConfigComponent_1 = require("../../../Shared/components/config/ConfigComponent");
var AnalyticsComponent = function (_a) {
    var prebid = _a.prebid;
    var _b = react_1["default"].useState(false), expanded = _b[0], setExpanded = _b[1];
    var _c = react_1["default"].useState(4), maxWidth = _c[0], setMaxWidth = _c[1];
    var ref = react_1["default"].useRef(null);
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 8);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    return (react_1["default"].createElement(Grid_1["default"], { size: { sm: maxWidth, xs: 12 }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(Analytics_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Analytics"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" }, "subtitle"), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Typography_1["default"], { variant: "body1", color: "text.secondary" }, "Todo")))));
};
exports["default"] = AnalyticsComponent;
