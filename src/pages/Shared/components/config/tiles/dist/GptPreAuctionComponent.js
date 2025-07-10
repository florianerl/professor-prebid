"use strict";
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
var GptPreAuctionComponent = function () {
    var _a = react_1["default"].useState(false), expanded = _a[0], setExpanded = _a[1];
    var _b = react_1["default"].useState(4), maxWidth = _b[0], setMaxWidth = _b[1];
    var ref = react_1["default"].useRef(null);
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var gptPreAuction = prebid.config.gptPreAuction;
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 4);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    if (!gptPreAuction)
        return null;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: maxWidth }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(BorderBottom_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Gpt Pre-Auction Module"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" }, "..."), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 2 },
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "MCM Enabled", value: gptPreAuction === null || gptPreAuction === void 0 ? void 0 : gptPreAuction.mcmEnabled, columns: [4, 12], expanded: expanded })),
                react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "GPT Pre-Auction", value: gptPreAuction, columns: [12, 12], expanded: expanded })))));
};
exports["default"] = GptPreAuctionComponent;
