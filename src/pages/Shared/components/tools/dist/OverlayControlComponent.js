"use strict";
exports.__esModule = true;
var Box_1 = require("@mui/material/Box");
var Switch_1 = require("@mui/material/Switch");
var react_1 = require("react");
var FormControlLabel_1 = require("@mui/material/FormControlLabel");
var material_1 = require("@mui/material");
var constants_1 = require("../../constants");
var material_2 = require("@mui/material");
var Grid_1 = require("@mui/material/Grid");
var FormControl_1 = require("@mui/material/FormControl");
var utils_1 = require("../../utils");
var OverlayControlComponent = function () {
    var _a;
    var theme = material_2.useTheme();
    var _b = react_1.useState(null), showOverlay = _b[0], setShowOverlay = _b[1];
    react_1.useEffect(function () {
        chrome.storage.local.get(constants_1.CONSOLE_TOGGLE, function (result) {
            var checked = result ? result[constants_1.CONSOLE_TOGGLE] : false;
            setShowOverlay(checked);
        });
    }, [showOverlay]);
    var handleShowOverlayChange = function (event) {
        var _a;
        setShowOverlay(event.target.checked);
        var checked = event.target.checked;
        chrome.storage.local.set((_a = {}, _a[constants_1.CONSOLE_TOGGLE] = checked, _a), function () {
            utils_1.sendChromeTabsMessage(constants_1.CONSOLE_TOGGLE, { consoleState: checked });
            // chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            //   const tab = tabs[0];
            //   chrome.tabs.sendMessage(tab.id as number, { type: CONSOLE_TOGGLE, consoleState: checked });
            // });
        });
    };
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
        react_1["default"].createElement(Box_1["default"], { sx: { backgroundColor: 'background.paper', borderRadius: 1, p: 1 } },
            react_1["default"].createElement(Grid_1["default"], { container: true, rowSpacing: 1, columnSpacing: 0.5 },
                react_1["default"].createElement(Grid_1["default"], { size: { xs: 1, sm: 1 } },
                    react_1["default"].createElement(Box_1["default"], { sx: (_a = { alignContent: 'center' }, _a[theme.breakpoints.down('sm')] = { transform: 'rotate(90deg)' }, _a) },
                        react_1["default"].createElement(FormControl_1["default"], null,
                            react_1["default"].createElement(FormControlLabel_1["default"], { control: react_1["default"].createElement(Switch_1["default"], { checked: showOverlay || false, onChange: handleShowOverlayChange }), label: "" })))),
                react_1["default"].createElement(Grid_1["default"], { size: { xs: 11, sm: 11 } },
                    react_1["default"].createElement(Box_1["default"], { sx: { border: 1, borderColor: showOverlay ? 'primary.main' : 'text.disabled', borderRadius: 1 } },
                        react_1["default"].createElement(material_1.Typography, { variant: "h4", sx: {
                                width: 1,
                                p: 1,
                                color: showOverlay ? 'primary.main' : 'text.disabled'
                            } }, "Show AdUnit Info Overlay")))))));
};
exports["default"] = OverlayControlComponent;
