"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var Box_1 = require("@mui/material/Box");
var Switch_1 = require("@mui/material/Switch");
var FormControlLabel_1 = require("@mui/material/FormControlLabel");
var OutlinedInput_1 = require("@mui/material/OutlinedInput");
var InputLabel_1 = require("@mui/material/InputLabel");
var MenuItem_1 = require("@mui/material/MenuItem");
var FormControl_1 = require("@mui/material/FormControl");
var Select_1 = require("@mui/material/Select");
var Chip_1 = require("@mui/material/Chip");
var Grid_1 = require("@mui/material/Grid");
var material_1 = require("@mui/material");
var appStateContext_1 = require("../../../contexts/appStateContext");
var BidderFilter = function (_a) {
    var _b;
    var debugConfigState = _a.debugConfigState, setDebugConfigState = _a.setDebugConfigState;
    var events = react_1.useContext(appStateContext_1["default"]).events;
    var theme = material_1.useTheme();
    var _c = react_1.useState([]), detectedBidderNames = _c[0], setDetectedBidderNames = _c[1];
    var _d = react_1.useState(false), bidderFilterEnabled = _d[0], setBidderFilterEnabled = _d[1];
    var _e = react_1["default"].useState([]), selectedBidders = _e[0], setSelectedBidders = _e[1];
    var handleSelectionChange = function (event) {
        updateSelectedBidders(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value);
    };
    var handleDelete = function (bidderToDelete) { return function () {
        updateSelectedBidders(selectedBidders.filter(function (bidder) { return bidder !== bidderToDelete; }));
    }; };
    var updateSelectedBidders = function (biddersArray) {
        setSelectedBidders(function () { return __spreadArrays(biddersArray); });
        setBidderFilterEnabled(true);
        if (biddersArray.length === 0 && debugConfigState) {
            delete debugConfigState.bidders;
        }
        else {
            debugConfigState = debugConfigState || {};
            debugConfigState.bidders = biddersArray;
        }
        setDebugConfigState(__assign({}, debugConfigState));
    };
    var handleBidderFilterEnabledChange = function (event) {
        debugConfigState = debugConfigState || {};
        debugConfigState.bidders = event.target.checked ? selectedBidders : undefined;
        setBidderFilterEnabled(event.target.checked);
        setDebugConfigState(__assign({}, debugConfigState));
    };
    react_1.useEffect(function () {
        setBidderFilterEnabled(!!Array.isArray(debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bidders));
        setSelectedBidders((debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bidders) || []);
    }, [debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bidders]);
    react_1.useEffect(function () {
        var auctionInitEndEvents = events.filter(function (event) { return ['auctionInit', 'auctionEnd'].includes(event.eventType); }) || [];
        var bidderNamesSet = auctionInitEndEvents.reduce(function (previousValue, currentValue) {
            var adUnitsArray = currentValue.args.adUnits || [];
            adUnitsArray.forEach(function (adUnit) { return adUnit.bids.forEach(function (bid) { return previousValue.add(bid.bidder); }); });
            return previousValue;
        }, new Set());
        setDetectedBidderNames(Array.from(bidderNamesSet));
    }, [events]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 1, md: 1 } },
            react_1["default"].createElement(Box_1["default"], { sx: (_b = {}, _b[theme.breakpoints.down('sm')] = { transform: 'rotate(90deg)' }, _b) },
                react_1["default"].createElement(FormControl_1["default"], null,
                    react_1["default"].createElement(FormControlLabel_1["default"], { label: " ", control: react_1["default"].createElement(Switch_1["default"], { checked: bidderFilterEnabled, onChange: handleBidderFilterEnabledChange }) })))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 11, md: 11 } },
            react_1["default"].createElement(FormControl_1["default"], { sx: { display: 'flex' } },
                react_1["default"].createElement(InputLabel_1["default"], null, "Filter Bidder(s)"),
                react_1["default"].createElement(Select_1["default"], { multiple: true, value: selectedBidders, onChange: handleSelectionChange, input: react_1["default"].createElement(OutlinedInput_1["default"], { label: "Detected Bidders" }), renderValue: function (selected) { return (react_1["default"].createElement(Box_1["default"], { sx: { display: 'flex', flexWrap: 'wrap', gap: 1 } }, selected.map(function (value) { return (react_1["default"].createElement(Chip_1["default"], { size: "small", color: "primary", variant: "outlined", key: value, label: value, onDelete: handleDelete(value), onMouseDown: function (event) {
                            event.stopPropagation();
                        } })); }))); }, disabled: !bidderFilterEnabled }, detectedBidderNames.map(function (name) { return (react_1["default"].createElement(MenuItem_1["default"], { key: name, value: name, sx: { fontWeight: (selectedBidders === null || selectedBidders === void 0 ? void 0 : selectedBidders.indexOf(name)) === -1 ? 'typography.fontWeightRegular' : 'typography.fontWeightMedium' } }, name)); }))))));
};
exports["default"] = BidderFilter;
