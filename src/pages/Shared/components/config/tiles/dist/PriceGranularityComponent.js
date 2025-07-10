"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Paper_1 = require("@mui/material/Paper");
var Card_1 = require("@mui/material/Card");
var CardHeader_1 = require("@mui/material/CardHeader");
var CardContent_1 = require("@mui/material/CardContent");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var Typography_1 = require("@mui/material/Typography");
var Grid_1 = require("@mui/material/Grid");
var ConfigComponent_1 = require("../ConfigComponent");
var Straighten_1 = require("@mui/icons-material/Straighten");
var Box_1 = require("@mui/system/Box");
var appStateContext_1 = require("../../../contexts/appStateContext");
var defaultBuckets = {
    low: [{ precision: 2, min: 0, max: 5, increment: 0.5 }],
    medium: [{ precision: 2, min: 0, max: 20, increment: 0.1 }],
    high: [{ precision: 2, min: 0, max: 20, increment: 0.01 }],
    auto: [
        { precision: 2, min: 0, max: 5, increment: 0.05 },
        { precision: 2, min: 5, max: 10, increment: 0.1 },
        { precision: 2, min: 10, max: 20, increment: 0.5 },
    ],
    dense: [
        { precision: 2, min: 0, max: 3, increment: 0.01 },
        { precision: 2, min: 3, max: 8, increment: 0.05 },
        { precision: 2, min: 8, max: 20, increment: 0.5 },
    ]
};
var PriceGranularityComponent = function () {
    var _a;
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var _b = prebid.config, priceGranularity = _b.priceGranularity, customPriceBucket = _b.customPriceBucket;
    var _c = react_1["default"].useState(false), expanded = _c[0], setExpanded = _c[1];
    var _d = react_1["default"].useState(4), maxWidth = _d[0], setMaxWidth = _d[1];
    var ref = react_1["default"].useRef(null);
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 8);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: maxWidth }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(Straighten_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Price Granularity"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" },
                    priceGranularity,
                    " (",
                    ((_a = Object.keys(defaultBuckets)) === null || _a === void 0 ? void 0 : _a.includes(priceGranularity)) ? 'default' : 'custom',
                    ")"), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 2 },
                    !expanded &&
                        (function () {
                            var _a, _b;
                            if (['auto', 'dense', 'custom', 'medium', 'high'].includes(priceGranularity)) {
                                return (react_1["default"].createElement(react_1["default"].Fragment, null,
                                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? 3 : 6 } },
                                        react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
                                            react_1["default"].createElement("strong", null, "Min: "),
                                            " ",
                                            (defaultBuckets[priceGranularity] || (customPriceBucket === null || customPriceBucket === void 0 ? void 0 : customPriceBucket.buckets))[0].min)),
                                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? 3 : 6 } },
                                        react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
                                            react_1["default"].createElement("strong", null, "Max: "),
                                            " ",
                                            (defaultBuckets[priceGranularity] || (customPriceBucket === null || customPriceBucket === void 0 ? void 0 : customPriceBucket.buckets))[0].max)),
                                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? 3 : 6 } },
                                        react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
                                            react_1["default"].createElement("strong", null, "Precision: "),
                                            (defaultBuckets[priceGranularity] || (customPriceBucket === null || customPriceBucket === void 0 ? void 0 : customPriceBucket.buckets))[0].precision || 2)),
                                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? 3 : 6 } },
                                        react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
                                            react_1["default"].createElement("strong", null, "Increment: "),
                                            " ",
                                            (defaultBuckets[priceGranularity] || (customPriceBucket === null || customPriceBucket === void 0 ? void 0 : customPriceBucket.buckets))[0].increment)),
                                    ((_a = (defaultBuckets[priceGranularity] || (customPriceBucket === null || customPriceBucket === void 0 ? void 0 : customPriceBucket.buckets))) === null || _a === void 0 ? void 0 : _a.length) > 1 && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? 4 : 12 } },
                                        react_1["default"].createElement(Typography_1["default"], { variant: "body2" },
                                            "+ ",
                                            ((_b = (defaultBuckets[priceGranularity] || (customPriceBucket === null || customPriceBucket === void 0 ? void 0 : customPriceBucket.buckets))) === null || _b === void 0 ? void 0 : _b.length) - 1,
                                            " more price buckets...")))));
                            }
                        })(),
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } }, expanded && react_1["default"].createElement(PriceGranularityTable, { priceGranularity: priceGranularity, customPriceBucket: customPriceBucket })))))));
};
var PriceGranularityTable = function (_a) {
    var priceGranularity = _a.priceGranularity, customPriceBucket = _a.customPriceBucket;
    var _b = react_1["default"].useState(), type = _b[0], setType = _b[1];
    var _c = react_1["default"].useState([]), rows = _c[0], setRows = _c[1];
    react_1.useEffect(function () {
        var type = priceGranularity;
        setType(type);
        var rows = defaultBuckets[type] || (customPriceBucket === null || customPriceBucket === void 0 ? void 0 : customPriceBucket.buckets) || [];
        setRows(rows);
    }, [priceGranularity, customPriceBucket === null || customPriceBucket === void 0 ? void 0 : customPriceBucket.buckets]);
    return (react_1["default"].createElement(Box_1["default"], { sx: { backgroundColor: 'text.disabled', p: 0.25, borderRadius: 1 } },
        react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 0.2 },
            react_1["default"].createElement(Grid_1["default"], { size: { xs: 3 } },
                react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Bucket"))),
            react_1["default"].createElement(Grid_1["default"], { size: { xs: 3 } },
                react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Precision"))),
            react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
                react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Min"))),
            react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
                react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Max"))),
            react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
                react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "Increment"))),
            rows.map(function (row, index) {
                return (react_1["default"].createElement(react_1["default"].Fragment, { key: index },
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 3 } },
                        react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                            react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
                                type,
                                " #",
                                index + 1))),
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 3 } },
                        react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                            react_1["default"].createElement(Typography_1["default"], { variant: "body1" }, row.precision || 2))),
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
                        react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                            react_1["default"].createElement(Typography_1["default"], { variant: "body1" }, row.min))),
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
                        react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                            react_1["default"].createElement(Typography_1["default"], { variant: "body1" }, row.max))),
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 2 } },
                        react_1["default"].createElement(Paper_1["default"], { sx: { height: 1, borderRadius: 1, display: 'flex', justifyContent: 'center' } },
                            react_1["default"].createElement(Typography_1["default"], { variant: "body1" }, row.increment)))));
            }))));
};
exports["default"] = PriceGranularityComponent;
