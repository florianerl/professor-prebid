"use strict";
exports.__esModule = true;
var react_1 = require("react");
var EventsMessages_1 = require("./EventsMessages");
var Grid_1 = require("@mui/material/Grid");
var EventsHeader_1 = require("./EventsHeader");
var appStateContext_1 = require("../../contexts/appStateContext");
var material_1 = require("@mui/material");
var EventsComponent = function (_a) {
    var close = _a.close;
    var pbjsNamespace = react_1.useContext(appStateContext_1["default"]).pbjsNamespace;
    var _b = react_1["default"].useState(''), search = _b[0], setSearch = _b[1];
    var _c = react_1["default"].useState({ error: true, warning: true }), state = _c[0], setState = _c[1];
    return (react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 1, sx: { p: 0.5 } },
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
            react_1["default"].createElement(material_1.Paper, null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 1, sx: { p: 0.5 } },
                    react_1["default"].createElement(EventsHeader_1["default"], { search: search, setSearch: setSearch, state: state, setState: setState, close: close }),
                    react_1["default"].createElement(EventsMessages_1["default"], { pbjsNamespace: pbjsNamespace, state: state, search: search }))))));
};
exports["default"] = EventsComponent;
