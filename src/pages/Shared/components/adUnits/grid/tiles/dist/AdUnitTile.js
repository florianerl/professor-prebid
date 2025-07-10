"use strict";
exports.__esModule = true;
var react_1 = require("react");
var AdUnitChipComponent_1 = require("../../chips/AdUnitChipComponent");
var Grid_1 = require("@mui/material/Grid");
var Paper_1 = require("@mui/material/Paper");
var Stack_1 = require("@mui/material/Stack");
var Typography_1 = require("@mui/material/Typography");
var Box_1 = require("@mui/material/Box");
var JSONViewerComponent_1 = require("../../../JSONViewerComponent");
var appStateContext_1 = require("../../../../contexts/appStateContext");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var ExpandLess_1 = require("@mui/icons-material/ExpandLess");
var InterstitialChipComponent_1 = require("../../chips/InterstitialChipComponent");
var ortb2impExtChipComponent_1 = require("../../chips/ortb2impExtChipComponent");
var AdUnitTile = function (_a) {
    var adUnit = _a.adUnit;
    var isPanel = react_1.useContext(appStateContext_1["default"]).isPanel;
    var _b = react_1["default"].useState(false), expanded = _b[0], setExpanded = _b[1];
    var handleExpandClick = function () {
        setExpanded(!expanded);
    };
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
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "AdUnit Code:"),
                        react_1["default"].createElement(Stack_1["default"], { direction: "row", flexWrap: 'wrap', gap: 1 },
                            react_1["default"].createElement(AdUnitChipComponent_1["default"], { adUnit: adUnit })),
                        adUnit.ortb2Imp && JSON.stringify(adUnit.ortb2Imp) !== '{}' && (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Ortb2Imp:"),
                            react_1["default"].createElement(Stack_1["default"], { direction: "column", alignItems: "flex-start", flexWrap: 'wrap', gap: 1 },
                                adUnit.ortb2Imp.instl === 1 && react_1["default"].createElement(InterstitialChipComponent_1["default"], { adUnit: adUnit }),
                                adUnit.ortb2Imp.ext && !isPanel && react_1["default"].createElement(ortb2impExtChipComponent_1["default"], { label: "ext", input: adUnit.ortb2Imp.ext })))))),
                    expanded && (react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "AdUnit JSON:"),
                        react_1["default"].createElement(JSONViewerComponent_1["default"], { style: { padding: 0 }, src: adUnit, collapsed: 2 }))))))));
};
exports["default"] = AdUnitTile;
