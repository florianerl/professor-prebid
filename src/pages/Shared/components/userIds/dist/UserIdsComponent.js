"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Grid_1 = require("@mui/material/Grid");
var Paper_1 = require("@mui/material/Paper");
var Tabs_1 = require("@mui/material/Tabs");
var Tab_1 = require("@mui/material/Tab");
var appStateContext_1 = require("../../contexts/appStateContext");
var UserIdsTab_1 = require("./UserIdsTab");
var UserIdsConfigTab_1 = require("./UserIdsConfigTab");
var UserIdsComponent = function () {
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var _a = react_1["default"].useState(0), tab = _a[0], setTab = _a[1];
    var handleTabChange = function (_event, newValue) {
        setTab(newValue);
    };
    if (prebid.eids && prebid.eids[0]) {
        return (react_1["default"].createElement(Grid_1["default"], { container: true, direction: "row", justifyContent: "space-between", spacing: 0.25, sx: { p: 1 } },
            react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
                react_1["default"].createElement(Tabs_1["default"], { value: tab, onChange: handleTabChange, sx: {
                        minHeight: 0,
                        '& > div > div > button': { minHeight: 0 },
                        '& > div  > span': { display: 'none' }
                    } },
                    react_1["default"].createElement(Tab_1["default"], { sx: { p: 0, justifyContent: 'flex-start' }, label: react_1["default"].createElement(Typography_1["default"], { variant: "h2", component: Paper_1["default"], sx: { p: 1, border: 1, borderColor: tab === 0 ? 'primary.main' : 'transparent' } }, "User Ids") }),
                    react_1["default"].createElement(Tab_1["default"], { sx: { p: 0, justifyContent: 'flex-start' }, label: react_1["default"].createElement(Typography_1["default"], { variant: "h2", component: Paper_1["default"], sx: { p: 1, border: 1, borderColor: tab === 1 ? 'primary.main' : 'transparent' } }, "Config") }))),
            tab === 0 && react_1["default"].createElement(UserIdsTab_1["default"], null),
            tab === 1 && react_1["default"].createElement(UserIdsConfigTab_1["default"], null)));
    }
    else {
        return (react_1["default"].createElement(Grid_1["default"], { container: true, direction: "row", justifyContent: "space-evenly" },
            react_1["default"].createElement(Grid_1["default"], { sx: { p: 1 } },
                react_1["default"].createElement(Paper_1["default"], { elevation: 1 },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h1", sx: { p: 1 } }, "No User IDs detected")))));
    }
};
exports["default"] = UserIdsComponent;
