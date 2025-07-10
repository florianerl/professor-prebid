"use strict";
exports.__esModule = true;
var react_1 = require("react");
var GanttChartComponent_1 = require("../../../Popup/components/timeline/GanttChartComponent");
var appStateContext_1 = require("../../contexts/appStateContext");
var Grid_1 = require("@mui/material/Grid");
var Paper_1 = require("@mui/material/Paper");
var Typography_1 = require("@mui/material/Typography");
var TimeLineComponent = function () {
    var _a = react_1.useContext(appStateContext_1["default"]), prebid = _a.prebid, auctionEndEvents = _a.auctionEndEvents;
    var events = prebid.events;
    if ((events === null || events === void 0 ? void 0 : events.length) === 0)
        return react_1["default"].createElement("div", null, "no events");
    if ((auctionEndEvents === null || auctionEndEvents === void 0 ? void 0 : auctionEndEvents.length) === 0)
        return react_1["default"].createElement("div", null, "no auctionEndEvents");
    return (react_1["default"].createElement(Grid_1["default"], { container: true, direction: "row", justifyContent: "space-between", spacing: 1, sx: { p: 0.5 } }, auctionEndEvents.map(function (auctionEndEvent, index) {
        var _a;
        return (react_1["default"].createElement(react_1["default"].Fragment, { key: index },
            react_1["default"].createElement(Grid_1["default"], null,
                react_1["default"].createElement(Paper_1["default"], { sx: { p: 1 }, elevation: 1 },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h2", component: "span" },
                        "Auction ID: ", (_a = auctionEndEvent.args) === null || _a === void 0 ? void 0 :
                        _a.auctionId))),
            react_1["default"].createElement(Grid_1["default"], null,
                react_1["default"].createElement(Paper_1["default"], { sx: { p: 1 }, elevation: 1 },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h2", component: "span" },
                        "Auction Start: ",
                        new Date(auctionEndEvent.args.timestamp).toLocaleTimeString()))),
            react_1["default"].createElement(Grid_1["default"], null,
                react_1["default"].createElement(Paper_1["default"], { sx: { p: 1 }, elevation: 1 },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h2", component: "span" },
                        "Auction Time: ",
                        auctionEndEvent.args.auctionEnd - auctionEndEvent.args.timestamp,
                        " ms"))),
            react_1["default"].createElement(GanttChartComponent_1["default"], { auctionEndEvent: auctionEndEvent }),
            ";"));
    })));
};
exports["default"] = TimeLineComponent;
