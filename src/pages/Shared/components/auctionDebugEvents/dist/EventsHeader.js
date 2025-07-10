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
var Grid_1 = require("@mui/material/Grid");
var ErrorOutline_1 = require("@mui/icons-material/ErrorOutline");
var WarningAmberOutlined_1 = require("@mui/icons-material/WarningAmberOutlined");
var TextField_1 = require("@mui/material/TextField");
var InputAdornment_1 = require("@mui/material/InputAdornment");
var FilterListOutlined_1 = require("@mui/icons-material/FilterListOutlined");
var IconButton_1 = require("@mui/material/IconButton");
var Close_1 = require("@mui/icons-material/Close");
var FormControl_1 = require("@mui/material/FormControl");
var FormGroup_1 = require("@mui/material/FormGroup");
var FormControlLabel_1 = require("@mui/material/FormControlLabel");
var Switch_1 = require("@mui/material/Switch");
var handleSearchChange = function (event, setSearch) {
    setSearch(event.target.value.trim());
};
var handleSwitchChange = function (event, state, setState) {
    var _a;
    setState(__assign(__assign({}, state), (_a = {}, _a[event.target.name] = event.target.checked, _a)));
};
var EventsHeader = function (_a) {
    var close = _a.close, search = _a.search, setSearch = _a.setSearch, state = _a.state, setState = _a.setState;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        close && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 }, sx: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                color: 'text.secondary'
            } },
            react_1["default"].createElement(IconButton_1["default"], { sx: { p: 0 }, onClick: function () { return close(); } },
                react_1["default"].createElement(Close_1["default"], { sx: { fontSize: 14 } })))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 9.5 } },
            react_1["default"].createElement(TextField_1["default"], { color: "primary", focused: true, fullWidth: true, margin: "dense", size: "small", value: search, onChange: function (event) { return handleSearchChange(event, setSearch); }, InputProps: {
                    startAdornment: (react_1["default"].createElement(InputAdornment_1["default"], { position: "start" },
                        react_1["default"].createElement(FilterListOutlined_1["default"], { color: "secondary" })))
                } })),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 2.5 }, sx: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                color: 'text.secondary'
            } },
            react_1["default"].createElement(FormControl_1["default"], { component: "fieldset" },
                react_1["default"].createElement(FormGroup_1["default"], { sx: { flexDirection: 'row' } },
                    react_1["default"].createElement(FormControlLabel_1["default"], { labelPlacement: "start", control: react_1["default"].createElement(Switch_1["default"], { checked: state.warning, onChange: function (event) { return handleSwitchChange(event, state, setState); }, name: "warning", size: "small" }), label: react_1["default"].createElement(WarningAmberOutlined_1["default"], { color: state.warning ? 'primary' : 'secondary', fontSize: "small" }) }),
                    react_1["default"].createElement(FormControlLabel_1["default"], { labelPlacement: "start", control: react_1["default"].createElement(Switch_1["default"], { checked: state.error, onChange: function (event) { return handleSwitchChange(event, state, setState); }, name: "error", size: "small" }), label: react_1["default"].createElement(ErrorOutline_1["default"], { color: state.error ? 'primary' : 'secondary', fontSize: "small" }) }))))));
};
exports["default"] = EventsHeader;
