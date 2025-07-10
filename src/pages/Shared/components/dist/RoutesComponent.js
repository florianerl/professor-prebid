"use strict";
exports.__esModule = true;
/* eslint-disable @typescript-eslint/no-unused-vars */
var react_1 = require("react");
var AdUnitsComponent_1 = require("./adUnits/AdUnitsComponent");
var UserIdsComponent_1 = require("./userIds/UserIdsComponent");
var ConfigComponent_1 = require("./config/ConfigComponent");
var TimeLineComponent_1 = require("./timeline/TimeLineComponent");
var BidsComponent_1 = require("./bids/BidsComponent");
var ToolsComponent_1 = require("./tools/ToolsComponent");
var EventsComponent_1 = require("./auctionDebugEvents/EventsComponent");
var react_router_dom_1 = require("react-router-dom");
var InitiatorComponent_1 = require("./initiator/InitiatorComponent");
var PbjsVersionInfoComponent_1 = require("./pbjsVersionInfo/PbjsVersionInfoComponent");
var RoutesComponent = function () {
    return (react_1["default"].createElement(react_router_dom_1.Routes, null,
        react_1["default"].createElement(react_router_dom_1.Route, { path: "/", element: react_1["default"].createElement(AdUnitsComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "/panel.html", element: react_1["default"].createElement(AdUnitsComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "/popup.html", element: react_1["default"].createElement(AdUnitsComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "bids", element: react_1["default"].createElement(BidsComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "timeline", element: react_1["default"].createElement(TimeLineComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "config", element: react_1["default"].createElement(ConfigComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "userId", element: react_1["default"].createElement(UserIdsComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "tools", element: react_1["default"].createElement(ToolsComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "events", element: react_1["default"].createElement(EventsComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "events", element: react_1["default"].createElement(EventsComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "initiator", element: react_1["default"].createElement(InitiatorComponent_1["default"], null) }),
        react_1["default"].createElement(react_router_dom_1.Route, { path: "version", element: react_1["default"].createElement(PbjsVersionInfoComponent_1["default"], null) })));
};
exports["default"] = RoutesComponent;
