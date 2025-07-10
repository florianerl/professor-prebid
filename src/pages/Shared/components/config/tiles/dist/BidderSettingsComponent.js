"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var SettingsApplications_1 = require("@mui/icons-material/SettingsApplications");
var Card_1 = require("@mui/material/Card");
var CardContent_1 = require("@mui/material/CardContent");
var CardHeader_1 = require("@mui/material/CardHeader");
var Grid_1 = require("@mui/material/Grid");
var ConfigComponent_1 = require("../ConfigComponent");
var RenderKeyValueComponent_1 = require("../../RenderKeyValueComponent");
var appStateContext_1 = require("../../../contexts/appStateContext");
var BidderSettingsComponent = function () {
    var _a = react_1["default"].useState(false), expanded = _a[0], setExpanded = _a[1];
    var _b = react_1["default"].useState(4), maxWidth = _b[0], setMaxWidth = _b[1];
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var bidderSettings = prebid.bidderSettings;
    var ref = react_1["default"].useRef(null);
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 8);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    if (!bidderSettings)
        return null;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: maxWidth }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight, maxHeight: expanded ? 'unset' : ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(SettingsApplications_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Bidder Settings"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" }, "LocalStorageAccess"), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 2 },
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { label: "StorageAccess: ", value: react_1["default"].createElement(react_1["default"].Fragment, null, Object.keys(bidderSettings)
                            .filter(function (bidder) { return bidderSettings[bidder].storageAllowed !== undefined; })
                            .slice(0, !expanded ? 7 : Object.keys(bidderSettings).length)
                            .map(function (bidder) { return (react_1["default"].createElement(Typography_1["default"], { key: bidder, variant: "body1" },
                            bidder,
                            ": ",
                            String(bidderSettings[bidder].storageAllowed))); })), expanded: expanded, columns: [6, 12] }))))));
};
exports["default"] = BidderSettingsComponent;
