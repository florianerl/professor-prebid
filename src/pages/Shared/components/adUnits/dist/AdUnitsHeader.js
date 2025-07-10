"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Paper_1 = require("@mui/material/Paper");
var Grid_1 = require("@mui/material/Grid");
var Tooltip_1 = require("@mui/material/Tooltip");
var appStateContext_1 = require("../../contexts/appStateContext");
var PbjsVersionInfoPopOver_1 = require("../pbjsVersionInfo/PbjsVersionInfoPopOver");
var EventsPopOver_1 = require("../auctionDebugEvents/EventsPopOver");
var utils_1 = require("../../utils");
var HeaderGridItem = function (_a) {
    var children = _a.children, onClick = _a.onClick;
    return (react_1["default"].createElement(Grid_1["default"], { onClick: onClick },
        react_1["default"].createElement(Paper_1["default"], { sx: { p: 1 }, elevation: 1 },
            react_1["default"].createElement(Typography_1["default"], { variant: "h2" }, children))));
};
var AdUnitsHeaderComponent = function () {
    var _a;
    var _b = react_1.useState(false), eventsPopUpOpen = _b[0], setEventsPopUpOpen = _b[1];
    var _c = react_1.useState(false), pbjsVersionPopUpOpen = _c[0], setPbjsVersionPopUpOpen = _c[1];
    var _d = react_1.useContext(appStateContext_1["default"]), allBidResponseEvents = _d.allBidResponseEvents, prebid = _d.prebid, allNoBidEvents = _d.allNoBidEvents, allBidderEvents = _d.allBidderEvents, allAdUnitCodes = _d.allAdUnitCodes, events = _d.events;
    if (!prebid)
        return null;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(HeaderGridItem, { onClick: function () { return setPbjsVersionPopUpOpen(true); } },
            react_1["default"].createElement(Tooltip_1["default"], { title: "Click for more info", arrow: true },
                react_1["default"].createElement("div", { style: { cursor: 'pointer' } }, "Version: " + prebid.version))),
        react_1["default"].createElement(PbjsVersionInfoPopOver_1["default"], { pbjsVersionPopUpOpen: pbjsVersionPopUpOpen, setPbjsVersionPopUpOpen: setPbjsVersionPopUpOpen }),
        react_1["default"].createElement(HeaderGridItem, null, "Timeout: " + ((_a = prebid.config) === null || _a === void 0 ? void 0 : _a.bidderTimeout)),
        react_1["default"].createElement(HeaderGridItem, null, "AdUnit" + utils_1.conditionalPluralization(allAdUnitCodes) + ": " + allAdUnitCodes.length),
        react_1["default"].createElement(HeaderGridItem, null, "Bidder" + utils_1.conditionalPluralization(allBidderEvents) + ": " + allBidderEvents.length),
        react_1["default"].createElement(HeaderGridItem, null, "Bid" + utils_1.conditionalPluralization(allBidResponseEvents) + ": " + allBidResponseEvents.length),
        react_1["default"].createElement(HeaderGridItem, null, "NoBid" + utils_1.conditionalPluralization(allNoBidEvents) + ": " + allNoBidEvents.length),
        react_1["default"].createElement(HeaderGridItem, { onClick: function () { return setEventsPopUpOpen(true); } },
            react_1["default"].createElement(Tooltip_1["default"], { title: "Click for more info", arrow: true },
                react_1["default"].createElement("div", { style: { cursor: 'pointer' } }, "Event" + utils_1.conditionalPluralization(events) + ": " + (events === null || events === void 0 ? void 0 : events.length)))),
        react_1["default"].createElement(EventsPopOver_1["default"], { eventsPopUpOpen: eventsPopUpOpen, setEventsPopUpOpen: setEventsPopUpOpen })));
};
exports["default"] = AdUnitsHeaderComponent;
