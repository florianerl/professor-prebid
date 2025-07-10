"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Card_1 = require("@mui/material/Card");
var CardHeader_1 = require("@mui/material/CardHeader");
var CardContent_1 = require("@mui/material/CardContent");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var Dns_1 = require("@mui/icons-material/Dns");
var Grid_1 = require("@mui/material/Grid");
var ConfigComponent_1 = require("../ConfigComponent");
var RenderKeyValueComponent_1 = require("../../RenderKeyValueComponent");
var appStateContext_1 = require("../../../contexts/appStateContext");
var RenderPrebidServerComponent = function (_a) {
    var _b = _a.s2sConfig, accountId = _b.accountId, adapter = _b.adapter, bidders = _b.bidders, defaultTtl = _b.defaultTtl, enabled = _b.enabled, maxBids = _b.maxBids, timeout = _b.timeout, app = _b.app, adapterOptions = _b.adapterOptions, endpoint = _b.endpoint, syncEndpoint = _b.syncEndpoint, syncUrlModifier = _b.syncUrlModifier;
    var _c = react_1["default"].useState(false), expanded = _c[0], setExpanded = _c[1];
    var _d = react_1["default"].useState(4), maxWidth = _d[0], setMaxWidth = _d[1];
    var ref = react_1["default"].useRef(null);
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 8);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: maxWidth }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight, maxHeight: expanded ? 'unset' : ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(Dns_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Prebid Server"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" }, "Prebid Server Config, ..."), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 2 },
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [12, 12], label: "Account Id", value: accountId, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 6], label: "Adapter", value: adapter, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [12, 12], label: "Bidders", value: bidders, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 6], label: "Default TTL", value: defaultTtl, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 6], label: "Enabled", value: enabled, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 6], label: "Max Bids", value: maxBids, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Timeout", value: timeout, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "App", value: app, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Adapter Options", value: adapterOptions, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [12, 12], label: "Endpoint", value: endpoint, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Sync Endpoint", value: syncEndpoint, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Sync Url Modifier", value: syncUrlModifier, expanded: expanded }))))));
};
var PrebidServerComponent = function () {
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var s2sConfig = prebid.config.s2sConfig;
    if (s2sConfig && Array.isArray(s2sConfig)) {
        return (react_1["default"].createElement(react_1["default"].Fragment, null, s2sConfig.map(function (s2sConfig, index) { return (react_1["default"].createElement(RenderPrebidServerComponent, { s2sConfig: s2sConfig, key: index })); })));
    }
    else if (s2sConfig) {
        return react_1["default"].createElement(RenderPrebidServerComponent, { s2sConfig: s2sConfig });
    }
    else {
        return null;
    }
};
exports["default"] = PrebidServerComponent;
