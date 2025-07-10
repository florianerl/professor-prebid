"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Divider_1 = require("@mui/material/Divider");
var Grid_1 = require("@mui/material/Grid");
var ErrorOutline_1 = require("@mui/icons-material/ErrorOutline");
var WarningAmberOutlined_1 = require("@mui/icons-material/WarningAmberOutlined");
var Typography_1 = require("@mui/material/Typography");
var appStateContext_1 = require("../../contexts/appStateContext");
var args2string = function (input) {
    if (!input)
        return "undefined";
    return "" + Object.values(input).join(' ') + (['.', '?', '!', ';', ':'].includes(Object.values(input).join(' ').slice(-1)) ? '' : '.');
};
var Args2Typo = function (_a) {
    var input = _a.input;
    return (react_1["default"].createElement(react_1["default"].Fragment, null, Object.values(input).map(function (value, index, arr) {
        return (react_1["default"].createElement(react_1["default"].Fragment, { key: index },
            react_1["default"].createElement(Typography_1["default"], { component: "span" }, String(typeof value === 'object' ? JSON.stringify(value) : value)),
            index + 1 < arr.length && react_1["default"].createElement(Typography_1["default"], { component: 'span' }, " "),
            index + 1 === arr.length && react_1["default"].createElement(Typography_1["default"], { component: 'span' }, ['.', '?', '!', ';', ':'].includes(Object.values(input).join(' ').trim().slice(-1)) ? '' : '.')));
    })));
};
var filterEventsBySearch = function (events, search) {
    return events.filter(function (event) { var _a; return (_a = args2string(event.args.arguments).toLowerCase()) === null || _a === void 0 ? void 0 : _a.includes(search.toLowerCase()); });
};
var filterEventsByState = function (events, state) {
    var selectedKeys = Object.keys(state).filter(function (key) { return state[key]; });
    return events.filter(function (event) { return selectedKeys === null || selectedKeys === void 0 ? void 0 : selectedKeys.includes(event.args.type.toLowerCase()); });
};
var sortEventsByElapsedTime = function (events) {
    return events.sort(function (e1, e2) { return e1.elapsedTime - e2.elapsedTime; });
};
var reduceEventsByArguments = function (events) {
    return events.reduce(function (previousValue, currentValue) {
        var _a;
        var previousArgs = args2string((_a = previousValue.at(-1)) === null || _a === void 0 ? void 0 : _a.arguments);
        var currentArgs = args2string(currentValue.args.arguments);
        if (previousArgs === currentArgs) {
            previousValue.at(-1).count += 1;
        }
        else {
            previousValue.push({
                type: currentValue.args.type,
                arguments: currentValue.args.arguments,
                elapsedTime: currentValue.elapsedTime,
                count: 1
            });
        }
        return previousValue;
    }, []);
};
var getEventIcon = function (type) {
    if (type === 'ERROR') {
        return react_1["default"].createElement(ErrorOutline_1["default"], { color: "error", sx: { fontSize: 14, pl: 2 } });
    }
    else if (type === 'WARNING') {
        return react_1["default"].createElement(WarningAmberOutlined_1["default"], { color: "warning", sx: { fontSize: 14, pl: 2 } });
    }
    return null;
};
var EventsMessages = function (_a) {
    var state = _a.state, search = _a.search;
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var events = prebid.events;
    var _b = react_1["default"].useState([]), messages = _b[0], setMessages = _b[1];
    react_1.useEffect(function () {
        var filteredEvents = (events || []).filter(function (_a) {
            var eventType = _a.eventType;
            return eventType === 'auctionDebug';
        }).map(function (_a) {
            var args = _a.args, elapsedTime = _a.elapsedTime;
            return ({ args: args, elapsedTime: elapsedTime });
        });
        var searchedEvents = filterEventsBySearch(filteredEvents, search);
        var stateFilteredEvents = filterEventsByState(searchedEvents, state);
        var sortedEvents = sortEventsByElapsedTime(stateFilteredEvents);
        var reducedEvents = reduceEventsByArguments(sortedEvents);
        setMessages(reducedEvents);
    }, [events, search, state]);
    return (react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 1 },
        messages.length > 0 &&
            messages.map(function (event, index, arr) { return (react_1["default"].createElement(react_1["default"].Fragment, { key: index },
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 1, alignItems: "center" },
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 0.5 } }, getEventIcon(event.type)),
                    react_1["default"].createElement(Grid_1["default"], null,
                        react_1["default"].createElement(Typography_1["default"], null,
                            Math.round(event.elapsedTime),
                            " ms:")),
                    react_1["default"].createElement(Grid_1["default"], { size: { xs: 10 } },
                        react_1["default"].createElement(Args2Typo, { input: event.arguments }),
                        event.count > 1 && (react_1["default"].createElement(Typography_1["default"], { component: "span", sx: { ml: 1 } },
                            "(x",
                            event.count,
                            ")")))),
                index + 1 < arr.length && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
                    react_1["default"].createElement(Divider_1["default"], null))))); }),
        messages.length === 0 && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
            react_1["default"].createElement(Typography_1["default"], { sx: { p: 0.5 } }, "no messages found")))));
};
exports["default"] = EventsMessages;
