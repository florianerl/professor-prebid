"use strict";
exports.__esModule = true;
var react_1 = require("react");
var appStateContext_1 = require("../../../../contexts/appStateContext");
var Typography_1 = require("@mui/material/Typography");
var Box_1 = require("@mui/material/Box");
var JSONViewerComponent_1 = require("../../../JSONViewerComponent");
var Grid_1 = require("@mui/material/Grid");
var Paper_1 = require("@mui/material/Paper");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var ExpandLess_1 = require("@mui/icons-material/ExpandLess");
var Ortb2ImpTile = function (_a) {
    var _b;
    var adUnit = _a.adUnit;
    var isPanel = react_1.useContext(appStateContext_1["default"]).isPanel;
    var _c = react_1["default"].useState(false), expanded = _c[0], setExpanded = _c[1];
    var handleExpandClick = function () {
        setExpanded(!expanded);
    };
    if (!(adUnit === null || adUnit === void 0 ? void 0 : adUnit.ortb2Imp))
        return null;
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
                    react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "ext:"),
                        react_1["default"].createElement(JSONViewerComponent_1["default"], { style: { padding: 0 }, src: (_b = adUnit.ortb2Imp) === null || _b === void 0 ? void 0 : _b.ext })))))));
};
exports["default"] = Ortb2ImpTile;
