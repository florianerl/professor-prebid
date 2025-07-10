"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var core_1 = require("@iabtcf/core");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var Business_1 = require("@mui/icons-material/Business");
var Card_1 = require("@mui/material/Card");
var CardHeader_1 = require("@mui/material/CardHeader");
var Grid_1 = require("@mui/material/Grid");
var ConfigComponent_1 = require("../ConfigComponent");
var ListItem_1 = require("@mui/material/ListItem");
var CardContent_1 = require("@mui/material/CardContent");
var RenderKeyValueComponent_1 = require("../../RenderKeyValueComponent");
var appStateContext_1 = require("../../../contexts/appStateContext");
var PrivacyComponent = function () {
    var _a, _b;
    var _c = react_1["default"].useState(false), expanded = _c[0], setExpanded = _c[1];
    var _d = react_1["default"].useState(4), maxWidth = _d[0], setMaxWidth = _d[1];
    var ref = react_1["default"].useRef(null);
    var _e = react_1.useContext(appStateContext_1["default"]), prebid = _e.prebid, tcf = _e.tcf;
    var consentManagement = prebid.config.consentManagement;
    var _f = consentManagement || {}, allowAuctionWithoutConsent = _f.allowAuctionWithoutConsent, cmpApi = _f.cmpApi, defaultGdprScope = _f.defaultGdprScope, gdpr = _f.gdpr, timeout = _f.timeout, usp = _f.usp;
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 12);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    if (!consentManagement)
        return null;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: maxWidth }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight, maxHeight: expanded ? 'unset' : ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(Business_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Consent Management"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" }, "TCF, CPA, USP, ..."), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 2 },
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Allow Auction Without Consent", value: allowAuctionWithoutConsent || (gdpr === null || gdpr === void 0 ? void 0 : gdpr.allowAuctionWithoutConsent), expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "CMP API", value: cmpApi, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Timeout", value: timeout, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Default GDPR Scope", value: defaultGdprScope, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "CMP API", value: gdpr === null || gdpr === void 0 ? void 0 : gdpr.cmpApi, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Timeout", value: gdpr === null || gdpr === void 0 ? void 0 : gdpr.timeout, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Default GDPR Scope", value: gdpr === null || gdpr === void 0 ? void 0 : gdpr.defaultGdprScope, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "GDPR Enforcement", value: (_a = gdpr === null || gdpr === void 0 ? void 0 : gdpr.rules) === null || _a === void 0 ? void 0 : _a.length, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "USP API", value: usp === null || usp === void 0 ? void 0 : usp.cmpApi, expanded: expanded }),
                    react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Timeout", value: usp === null || usp === void 0 ? void 0 : usp.timeout, expanded: expanded }),
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } }), (_b = gdpr === null || gdpr === void 0 ? void 0 : gdpr.rules) === null || _b === void 0 ? void 0 :
                    _b.map(function (rule, index) { return (react_1["default"].createElement(RenderKeyValueComponent_1["default"], { key: index, columns: [4, 4], label: "Rule #" + (index + 1), value: react_1["default"].createElement(react_1["default"].Fragment, null, Object.keys(rule).map(function (key, index) { return (react_1["default"].createElement(ListItem_1["default"], { key: index },
                            key,
                            ": ",
                            String(rule[key]))); })), expanded: expanded })); }),
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } }),
                    tcf && Object.keys(tcf).map(function (key, index) { return react_1["default"].createElement(TcfComponent, { key: index, tcf: tcf, tcfKey: key, expanded: expanded }); }))))));
};
var TcfComponent = function (_a) {
    var _b, _c;
    var tcf = _a.tcf, tcfKey = _a.tcfKey, expanded = _a.expanded;
    var _d = react_1["default"].useState({}), decodedTcfString = _d[0], setDecodedTcfString = _d[1];
    react_1.useEffect(function () {
        var _a;
        var string = ((_a = tcf[tcfKey]) === null || _a === void 0 ? void 0 : _a.consentData) || '';
        var decodedTcfString = {};
        try {
            decodedTcfString = core_1.TCString.decode(string, null);
        }
        catch (e) { }
        setDecodedTcfString(decodedTcfString);
    }, [tcf, tcfKey]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "TCF Version", value: tcfKey, expanded: expanded }),
        react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "CMP Loaded", value: (_b = tcf[tcfKey]) === null || _b === void 0 ? void 0 : _b.cmpLoaded, expanded: expanded }),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } }),
        react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Consent Data", value: ((_c = tcf[tcfKey]) === null || _c === void 0 ? void 0 : _c.consentData) ? tcf[tcfKey].consentData : 'no consent string found', expanded: expanded }),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } }),
        react_1["default"].createElement(RenderKeyValueComponent_1["default"], { columns: [4, 12], label: "Decoded Consent String", value: decodedTcfString, expanded: expanded })));
};
exports["default"] = PrivacyComponent;
