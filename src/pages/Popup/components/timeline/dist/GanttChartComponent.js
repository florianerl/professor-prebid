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
var utils_1 = require("../../../Shared/utils");
var List_1 = require("@mui/material/List");
var ListItem_1 = require("@mui/material/ListItem");
var Typography_1 = require("@mui/material/Typography");
var Box_1 = require("@mui/material/Box");
var Paper_1 = require("@mui/material/Paper");
var Grid_1 = require("@mui/material/Grid");
var BidderBarComponent_1 = require("./BidderBarComponent");
var appStateContext_1 = require("../../../Shared/contexts/appStateContext");
var getNearestGridBarElement = function (input, gridRef) {
    var _a;
    var allGridBarsCollection = (((_a = gridRef === null || gridRef === void 0 ? void 0 : gridRef.current) === null || _a === void 0 ? void 0 : _a.children) || []);
    var allGridBarsArray = Array.from(allGridBarsCollection);
    var nearestGridBar = allGridBarsArray.sort(function (a, b) { return Math.abs(Number(a.dataset.timestamp) - input) - Math.abs(Number(b.dataset.timestamp) - input); })[0];
    return nearestGridBar;
};
var findEvent = function (bidderRequest, eventType) { return function (event) {
    var _a;
    return event.eventType === eventType && ((_a = event.args) === null || _a === void 0 ? void 0 : _a.auctionId) === (bidderRequest === null || bidderRequest === void 0 ? void 0 : bidderRequest.auctionId) && (event.args.bidderCode === bidderRequest.bidderCode || event.args.bidder === bidderRequest.bidderCode);
}; };
var listStyle = {
    height: 1,
    width: 1,
    maxWidth: 1,
    listStyleType: 'none',
    paddingLeft: 'unset',
    paddingTop: 'unset',
    position: 'absolute',
    display: 'flex',
    alignItems: 'stretch'
};
var floatingListStyle = { listStyleType: 'none', paddingLeft: 'unset', height: 1, width: 1, maxWidth: 1 };
var getListItemStyle = function (isZero, isAuctionEnd) { return ({
    display: 'flex',
    borderLeft: '1px dotted lightgrey',
    borderColor: isZero || isAuctionEnd ? 'warning.main' : 'text.secondary',
    p: 0,
    alignItems: 'flex-end'
}); };
var GanttChart = function (_a) {
    var auctionEndEvent = _a.auctionEndEvent;
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var _b = auctionEndEvent === null || auctionEndEvent === void 0 ? void 0 : auctionEndEvent.args, auctionEnd = _b.auctionEnd, bidderRequests = _b.bidderRequests, timestamp = _b.timestamp;
    var events = prebid.events;
    var gridStep = (auctionEnd - timestamp) / (window.innerWidth / 10);
    var gridRef = react_1.useRef(null);
    var _c = react_1["default"].useState([]), bidderArray = _c[0], setBidderArray = _c[1];
    var _d = react_1["default"].useState([]), rangeArray = _d[0], setRangeArray = _d[1];
    var _e = react_1["default"].useState(0), auctionEndLeft = _e[0], setAuctionEndLeft = _e[1];
    react_1.useEffect(function () {
        var _a;
        setAuctionEndLeft((_a = getNearestGridBarElement(auctionEnd, gridRef)) === null || _a === void 0 ? void 0 : _a.offsetLeft);
        setRangeArray(utils_1.createRangeArray(timestamp, auctionEnd, gridStep, 50));
        setBidderArray(bidderRequests
            .sort(function (a, b) { return a.start - b.start; })
            .map(function (bidderRequest) {
            var _a, _b;
            var bidderCode = bidderRequest.bidderCode, start = bidderRequest.start;
            var bidRequestEvent = events.find(findEvent(bidderRequest, 'bidRequested'));
            var bidResponseEvent = events.find(findEvent(bidderRequest, 'bidResponse'));
            var noBidEvent = events.find(findEvent(bidderRequest, 'noBid'));
            var end = bidResponseEvent ? (_a = bidResponseEvent === null || bidResponseEvent === void 0 ? void 0 : bidResponseEvent.args) === null || _a === void 0 ? void 0 : _a.responseTimestamp : start + (noBidEvent === null || noBidEvent === void 0 ? void 0 : noBidEvent.elapsedTime) - (bidRequestEvent === null || bidRequestEvent === void 0 ? void 0 : bidRequestEvent.elapsedTime);
            return { bidderCode: bidderCode, start: start, end: end, bidderRequestId: (_b = bidRequestEvent === null || bidRequestEvent === void 0 ? void 0 : bidRequestEvent.args) === null || _b === void 0 ? void 0 : _b.bidderRequestId };
        }));
    }, [auctionEnd, bidderRequests, gridStep, events, timestamp]);
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
        react_1["default"].createElement(Paper_1["default"], { sx: { p: 1, pb: 3 }, elevation: 1 },
            react_1["default"].createElement(Box_1["default"], { sx: { position: 'relative', width: 1, maxWidth: 1 } },
                react_1["default"].createElement(List_1["default"], { ref: gridRef, sx: listStyle }, rangeArray.map(function (val, index) {
                    var isZero = Math.floor(val - auctionEndEvent.args.timestamp) === 0;
                    var isAuctionEnd = Math.floor(val - auctionEndEvent.args.auctionEnd) === 0;
                    var isLabeled = index % 10 === 0 || isAuctionEnd;
                    return (react_1["default"].createElement(ListItem_1["default"], __assign({}, { 'data-timestamp': Math.round(val) }, { key: index, sx: getListItemStyle(isZero, isAuctionEnd) }), (isLabeled || isZero) && (react_1["default"].createElement(Typography_1["default"], { component: "span", variant: "body2", sx: {
                            color: isZero || isAuctionEnd ? 'warning.main' : 'text.secondary',
                            transform: 'rotate(45deg) translate(10px, 15px)',
                            position: 'absolute'
                        } }, Math.floor(val - auctionEndEvent.args.timestamp)))));
                })),
                react_1["default"].createElement(List_1["default"], { sx: floatingListStyle }, bidderArray.map(function (item, index) { return (react_1["default"].createElement(BidderBarComponent_1["default"], { item: item, auctionEndLeft: auctionEndLeft, auctionEndEvent: auctionEndEvent, key: index, gridRef: gridRef })); }))))));
};
exports["default"] = GanttChart;
