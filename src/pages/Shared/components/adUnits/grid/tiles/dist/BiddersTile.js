"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Stack_1 = require("@mui/material/Stack");
var BidChipComponent_1 = require("../../chips/BidChipComponent");
var appStateContext_1 = require("../../../../contexts/appStateContext");
var Typography_1 = require("@mui/material/Typography");
var Box_1 = require("@mui/material/Box");
var JSONViewerComponent_1 = require("../../../JSONViewerComponent");
var Grid_1 = require("@mui/material/Grid");
var Paper_1 = require("@mui/material/Paper");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var ExpandLess_1 = require("@mui/icons-material/ExpandLess");
var matchesSizes = function (bidEvent, adUnit) {
    var _a, _b, _c, _d, _e, _f, _g;
    var adUnitSizes = ((_a = adUnit.sizes) === null || _a === void 0 ? void 0 : _a.map(function (_a) {
        var width = _a[0], height = _a[1];
        return width + "x" + height;
    })) || ((_d = (_c = (_b = adUnit.mediaTypes) === null || _b === void 0 ? void 0 : _b.banner) === null || _c === void 0 ? void 0 : _c.sizes) === null || _d === void 0 ? void 0 : _d.map(function (_a) {
        var width = _a[0], height = _a[1];
        return width + "x" + height;
    }));
    var isSizeMatch = adUnitSizes === null || adUnitSizes === void 0 ? void 0 : adUnitSizes.includes((_e = bidEvent === null || bidEvent === void 0 ? void 0 : bidEvent.args) === null || _e === void 0 ? void 0 : _e.size);
    var isNativeMatch = ((_f = Object.keys(adUnit.mediaTypes)) === null || _f === void 0 ? void 0 : _f.includes('native')) && bidEvent.args.mediaType === 'native';
    var isVideoMatch = ((_g = Object.keys(adUnit.mediaTypes)) === null || _g === void 0 ? void 0 : _g.includes('video')) && bidEvent.args.mediaType === 'video';
    return isSizeMatch || isNativeMatch || isVideoMatch;
};
var BiddersTile = function (_a) {
    var _b;
    var adUnit = _a.adUnit, adUnitCode = _a.adUnit.code;
    var _c = react_1.useContext(appStateContext_1["default"]), allWinningBids = _c.allWinningBids, allBidResponseEvents = _c.allBidResponseEvents, allBidRequestedEvents = _c.allBidRequestedEvents, adsRendered = _c.adsRendered, isPanel = _c.isPanel;
    var _d = react_1["default"].useState(false), expanded = _d[0], setExpanded = _d[1];
    var handleExpandClick = function () {
        setExpanded(!expanded);
    };
    // if (adUnit?.bids?.length === 0) return null;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 4, md: 4 }, sx: {
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
                pointerEvents: 'none'
            }
        }, onClick: function () { return setExpanded(!expanded); } },
        react_1["default"].createElement(Paper_1["default"], { sx: { height: '100%', position: 'relative' } },
            react_1["default"].createElement(Box_1["default"], { onClick: handleExpandClick, "aria-expanded": expanded, "aria-label": "show more", sx: {
                    zIndex: 100,
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    display: isPanel ? 'block' : 'none'
                } }, !expanded ? react_1["default"].createElement(ExpandMore_1["default"], null) : react_1["default"].createElement(ExpandLess_1["default"], null)),
            react_1["default"].createElement(Box_1["default"], { onClick: function (e) { return e.stopPropagation(); } },
                react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                    !expanded && (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Bids:"),
                        react_1["default"].createElement(Stack_1["default"], { direction: "row", flexWrap: 'wrap', gap: 0.5 }, (_b = adUnit === null || adUnit === void 0 ? void 0 : adUnit.bids) === null || _b === void 0 ? void 0 : _b.map(function (_a, index, arr) {
                            var bidder = _a.bidder;
                            var bidReceived = allBidResponseEvents.find(function (bidReceived) { var _a; return ((_a = bidReceived.args) === null || _a === void 0 ? void 0 : _a.adUnitCode) === adUnitCode && bidReceived.args.bidder === bidder && matchesSizes(bidReceived, adUnit); });
                            var bidRequested = allBidRequestedEvents.find(function (bidReq) { return bidReq.args.bidderCode === bidder && bidReq.args.bids.find(function (bid) { return bid.adUnitCode === adUnitCode; }); });
                            var isWinner = allWinningBids.some(function (winningBid) { return winningBid.args.adUnitCode === adUnitCode && winningBid.args.bidder === bidder && matchesSizes(winningBid, adUnit); });
                            var isRendered = adsRendered.some(function (renderedAd) { return renderedAd.args.bid.adUnitCode === adUnitCode && renderedAd.args.bid.bidder === bidder; });
                            var label = (bidReceived === null || bidReceived === void 0 ? void 0 : bidReceived.args.cpm) ? bidder + " (" + Number(bidReceived === null || bidReceived === void 0 ? void 0 : bidReceived.args.cpm).toFixed(2) + " " + (bidReceived === null || bidReceived === void 0 ? void 0 : bidReceived.args.currency) + ")" : "" + bidder;
                            return react_1["default"].createElement(BidChipComponent_1["default"], { input: arr[index], label: label, key: index, isWinner: isWinner, bidRequested: bidRequested, bidReceived: bidReceived, isRendered: isRendered });
                        })))),
                    expanded && (react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Bids JSON:"),
                        react_1["default"].createElement(JSONViewerComponent_1["default"], { style: { padding: 0 }, src: adUnit.bids }))))))));
};
exports["default"] = BiddersTile;
