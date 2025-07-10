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
exports.__esModule = true;
var react_1 = require("react");
var styles_1 = require("@mui/material/styles");
var TextField_1 = require("@mui/material/TextField");
var Switch_1 = require("@mui/material/Switch");
var FormControlLabel_1 = require("@mui/material/FormControlLabel");
var OutlinedInput_1 = require("@mui/material/OutlinedInput");
var InputLabel_1 = require("@mui/material/InputLabel");
var MenuItem_1 = require("@mui/material/MenuItem");
var FormControl_1 = require("@mui/material/FormControl");
var Select_1 = require("@mui/material/Select");
var Chip_1 = require("@mui/material/Chip");
var Box_1 = require("@mui/material/Box");
var Grid_1 = require("@mui/material/Grid");
var appStateContext_1 = require("../../../contexts/appStateContext");
var ITEM_HEIGHT = 48;
var ITEM_PADDING_TOP = 8;
var MenuProps = { PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 1 } } };
var getStyles = function (name, selectedBidders, theme) { return ({
    fontWeight: (selectedBidders === null || selectedBidders === void 0 ? void 0 : selectedBidders.indexOf(name)) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
}); };
var BidOverWriteComponent = function (_a) {
    var _b;
    var _c;
    var debugConfigState = _a.debugConfigState, setDebugConfigState = _a.setDebugConfigState;
    var events = react_1.useContext(appStateContext_1["default"]).events;
    var theme = styles_1.useTheme();
    var _d = react_1.useState([]), detectedBidderNames = _d[0], setDetectedBidderNames = _d[1];
    var _e = react_1.useState([]), detectedAdUnitCodes = _e[0], setDetectedAdUnitCodes = _e[1];
    var _f = react_1.useState(false), bidsOverwriteEnabled = _f[0], setBidOverwriteEnabled = _f[1];
    var _g = react_1.useState(20.0), cpm = _g[0], setCpm = _g[1];
    var _h = react_1.useState('USD'), currency = _h[0], setCurrency = _h[1];
    var _j = react_1["default"].useState((debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bidders) || []), selectedBidders = _j[0], setSelectedBidders = _j[1];
    var _k = react_1["default"].useState(((_c = debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids) === null || _c === void 0 ? void 0 : _c.map(function (bid) { return bid.adUnitCode; })) || []), selectedAdUnitCodes = _k[0], setSelectedAdUnitCodes = _k[1];
    var handleAdunitSelectionChange = function (event) {
        var selectedAdUnitCodesArray = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
        updateDebugConfig(selectedAdUnitCodesArray, selectedBidders, cpm, currency);
    };
    var handleBidderSelectionChange = function (event) {
        var selectedBiddersArray = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
        updateDebugConfig(selectedAdUnitCodes, selectedBiddersArray, cpm, currency);
    };
    var handleBidderDelete = function (bidderToDelete) { return function () {
        var newBidderArray = selectedBidders.filter(function (bidder) { return bidder !== bidderToDelete; });
        setSelectedBidders(newBidderArray);
        updateDebugConfig(selectedAdUnitCodes, newBidderArray, cpm, currency);
    }; };
    var handleAdUnitDelete = function (adUnitCodeToDelete) { return function () {
        var newAdUnitCodeArray = selectedAdUnitCodes.filter(function (adUnitCode) { return adUnitCode !== adUnitCodeToDelete; });
        setSelectedAdUnitCodes(newAdUnitCodeArray);
        updateDebugConfig(newAdUnitCodeArray, selectedBidders, cpm, currency);
    }; };
    var handleBidOverWriteEnabledChange = function (event) {
        setBidOverwriteEnabled(event.target.checked);
        if (!event.target.checked) {
            setDebugConfigState(__assign(__assign({}, debugConfigState), { bids: undefined }));
        }
    };
    var handleCpmChange = function (event) {
        setCpm(Number(event.target.value));
        updateDebugConfig(selectedAdUnitCodes, selectedBidders, Number(event.target.value), currency);
    };
    var handleCurrencyChange = function (event) {
        setCurrency(event.target.value);
        updateDebugConfig(selectedAdUnitCodes, selectedBidders, cpm, event.target.value);
    };
    var updateDebugConfig = function (selectedAdUnitCodes, selectedBidders, cpm, currency) {
        var bids = [];
        if (selectedAdUnitCodes.length === 0) {
            selectedBidders.forEach(function (bidder) {
                bids.push({ bidder: bidder, cpm: cpm, currency: currency });
            });
        }
        else {
            selectedAdUnitCodes.forEach(function (adUnitCode) {
                selectedBidders.forEach(function (bidder) {
                    bids.push({ adUnitCode: adUnitCode, bidder: bidder, cpm: cpm, currency: currency });
                });
            });
        }
        if (bids.length > 0) {
            setDebugConfigState(__assign(__assign({}, debugConfigState), { bids: bids }));
        }
        else {
            setDebugConfigState(__assign(__assign({}, debugConfigState), { bids: undefined }));
        }
    };
    react_1.useEffect(function () {
        var _a, _b, _c, _d;
        if (!bidsOverwriteEnabled) {
            setBidOverwriteEnabled(!!Array.isArray(debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids));
        }
        setCpm(((_a = debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids) === null || _a === void 0 ? void 0 : _a.length) > 0 ? Number(debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids[0].cpm) : 20.0);
        setCurrency(((_b = debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids) === null || _b === void 0 ? void 0 : _b.length) > 0 ? debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids[0].currency : 'USD');
        setSelectedBidders(((_c = debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids) === null || _c === void 0 ? void 0 : _c.map(function (item) { return item.bidder; }).filter(function (v, i, a) { return a.indexOf(v) === i; })) || []);
        setSelectedAdUnitCodes(((_d = debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids) === null || _d === void 0 ? void 0 : _d.map(function (item) { return item.adUnitCode; }).filter(function (v, i, a) { return v && a.indexOf(v) === i; })) || []);
    }, [bidsOverwriteEnabled, debugConfigState === null || debugConfigState === void 0 ? void 0 : debugConfigState.bids]);
    react_1.useEffect(function () {
        var auctionInitEndEvent = events.filter(function (event) { return ['auctionInit', 'auctionEnd'].includes(event.eventType); }) || [];
        var bidderNamesSet = auctionInitEndEvent.reduce(function (previousValue, currentValue) {
            var adUnitsArray = currentValue.args.adUnits || [];
            adUnitsArray.forEach(function (adUnit) { return adUnit.bids.forEach(function (bid) { return previousValue.add(bid.bidder); }); });
            return previousValue;
        }, new Set());
        setDetectedBidderNames(Array.from(bidderNamesSet));
        var adUnitCodesSet = auctionInitEndEvent.reduce(function (previousValue, currentValue) {
            var adUnitsCodesArray = currentValue.args.adUnitCodes || [];
            adUnitsCodesArray.forEach(function (adUnitCode) { return previousValue.add(adUnitCode); });
            return previousValue;
        }, new Set());
        setDetectedAdUnitCodes(Array.from(adUnitCodesSet));
    }, [events]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 1, md: 1 } },
            react_1["default"].createElement(Box_1["default"], { sx: (_b = { alignContent: 'center' }, _b[theme.breakpoints.down('sm')] = { transform: 'rotate(90deg)' }, _b) },
                react_1["default"].createElement(FormControl_1["default"], null,
                    react_1["default"].createElement(FormControlLabel_1["default"], { label: "", control: react_1["default"].createElement(Switch_1["default"], { checked: bidsOverwriteEnabled, onChange: handleBidOverWriteEnabledChange }) })))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 1, md: 1 } },
            react_1["default"].createElement(FormControl_1["default"], { sx: { height: 1 } },
                react_1["default"].createElement(Box_1["default"], { component: "form", noValidate: true, autoComplete: "off", sx: { height: 1 } },
                    react_1["default"].createElement(TextField_1["default"], { sx: { height: 1, '& div': { height: 1 } }, type: "number", label: "cpm", value: cpm, onChange: handleCpmChange, variant: "outlined", disabled: !bidsOverwriteEnabled })))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 1, md: 1 } },
            react_1["default"].createElement(FormControl_1["default"], { sx: { height: 1 } },
                react_1["default"].createElement(Box_1["default"], { component: "form", noValidate: true, autoComplete: "off", sx: { height: 1 } },
                    react_1["default"].createElement(TextField_1["default"], { sx: { height: 1, '& div': { height: 1 } }, type: "string", label: "currency", value: currency, onChange: handleCurrencyChange, variant: "outlined", disabled: !bidsOverwriteEnabled })))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 4.5, md: 4.5 } },
            react_1["default"].createElement(FormControl_1["default"], { sx: { height: 1, width: 1, '& .MuiOutlinedInput-root': { height: 1, alignItems: 'baseline' } } },
                react_1["default"].createElement(InputLabel_1["default"], null, "Select Bidder(s)"),
                react_1["default"].createElement(Select_1["default"], { multiple: true, name: "bidders", value: selectedBidders, onChange: handleBidderSelectionChange, input: react_1["default"].createElement(OutlinedInput_1["default"], { label: "Detected Bidders" }), renderValue: function (selected) { return (react_1["default"].createElement(Box_1["default"], { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }, selected.map(function (value, index) { return (react_1["default"].createElement(Chip_1["default"], { size: "small", key: index, label: value, onDelete: handleBidderDelete(value), onMouseDown: function (event) {
                            event.stopPropagation();
                        } })); }))); }, MenuProps: MenuProps, disabled: !bidsOverwriteEnabled }, detectedBidderNames.map(function (name, index) { return (react_1["default"].createElement(MenuItem_1["default"], { key: index, value: name, style: getStyles(name, selectedBidders, theme) }, name)); })))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 4.5, md: 4.5 } },
            react_1["default"].createElement(FormControl_1["default"], { sx: { height: 1, width: 1, '& .MuiOutlinedInput-root': { height: 1, alignItems: 'baseline' } } },
                react_1["default"].createElement(InputLabel_1["default"], null, "Select AdUnitCode(s)"),
                react_1["default"].createElement(Select_1["default"], { multiple: true, name: "adUnitCodes", value: selectedAdUnitCodes, onChange: handleAdunitSelectionChange, input: react_1["default"].createElement(OutlinedInput_1["default"], { label: "Detected AdUnit(s)" }), renderValue: function (selected) { return (react_1["default"].createElement(Box_1["default"], { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }, selected.map(function (value, index) { return (react_1["default"].createElement(Chip_1["default"], { size: "small", key: index, label: value.length > 26 ? "..." + value.substring(value.length - 26) : value, onDelete: handleAdUnitDelete(value), onMouseDown: function (event) {
                            event.stopPropagation();
                        } })); }))); }, MenuProps: MenuProps, disabled: !bidsOverwriteEnabled || selectedBidders.length === 0 }, detectedAdUnitCodes.map(function (name, index) { return (react_1["default"].createElement(MenuItem_1["default"], { key: index, value: name, style: getStyles(name, selectedAdUnitCodes, theme) }, name.length > 40 ? "..." + name.substring(name.length - 40) : name)); }))))));
};
exports["default"] = BidOverWriteComponent;
