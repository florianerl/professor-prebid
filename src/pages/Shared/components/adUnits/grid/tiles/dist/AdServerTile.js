"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Stack_1 = require("@mui/material/Stack");
var Chip_1 = require("@mui/material/Chip");
var Typography_1 = require("@mui/material/Typography");
var Box_1 = require("@mui/material/Box");
var JSONViewerComponent_1 = require("../../../JSONViewerComponent");
var Grid_1 = require("@mui/material/Grid");
var appStateContext_1 = require("../../../../contexts/appStateContext");
var Paper_1 = require("@mui/material/Paper");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var ExpandLess_1 = require("@mui/icons-material/ExpandLess");
var AdServerTile = function (_a) {
    var _b;
    var adUnit = _a.adUnit;
    var _c = react_1.useContext(appStateContext_1["default"]), isPanel = _c.isPanel, googleAdManager = _c.googleAdManager;
    var _d = react_1.useState(undefined), slot = _d[0], setSlot = _d[1];
    var _e = react_1["default"].useState(false), expanded = _e[0], setExpanded = _e[1];
    var _f = (slot || {}), targeting = _f.targeting, sizes = _f.sizes, elementId = _f.elementId, name = _f.name;
    var handleExpandClick = function () {
        setExpanded(!expanded);
    };
    react_1.useEffect(function () {
        var _a, _b;
        var slot = (_a = googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.slots) === null || _a === void 0 ? void 0 : _a.find(function (_a) {
            var name = _a.name, elementId = _a.elementId;
            return name === adUnit.code || elementId === adUnit.code || name.toLowerCase() === adUnit.code.toLowerCase() || elementId.toLowerCase() === adUnit.code.toLowerCase();
        });
        var fallbackSlot = ((_b = googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.slots) === null || _b === void 0 ? void 0 : _b.length) === 1 ? googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.slots[0] : undefined;
        setSlot(slot || fallbackSlot);
    }, [adUnit.code, googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.slots]);
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
            !slot && (react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Unable to match Prebid AdUnit with ad-server slot. "),
                ((_b = googleAdManager === null || googleAdManager === void 0 ? void 0 : googleAdManager.slots) === null || _b === void 0 ? void 0 : _b.length) > 0 && react_1["default"].createElement(JSONViewerComponent_1["default"], { style: { padding: 0 }, name: "All detected ad-server slots:", src: googleAdManager.slots, collapsed: 2 }))),
            slot && (react_1["default"].createElement(Box_1["default"], { onClick: function (e) { return e.stopPropagation(); }, sx: { maxHeight: isPanel ? (!expanded ? 200 : 'unset') : 'unset' } },
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    elementId && (react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "ElementId:"),
                        react_1["default"].createElement(Stack_1["default"], { direction: "row", sx: { flexWrap: 'wrap', gap: 1 } },
                            react_1["default"].createElement(Chip_1["default"], { size: "small", variant: "outlined", color: "primary", label: elementId })))),
                    name && (react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Name:"),
                        react_1["default"].createElement(Stack_1["default"], { direction: "row", sx: { flexWrap: 'wrap', gap: 1 } },
                            react_1["default"].createElement(Chip_1["default"], { size: "small", variant: "outlined", color: "primary", label: name })))),
                    (sizes === null || sizes === void 0 ? void 0 : sizes.length) > 0 && (react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Sizes:"),
                        react_1["default"].createElement(Stack_1["default"], { direction: "row", sx: { flexWrap: 'wrap', gap: 1 } }, sizes.map(function (sizeStr, index) { return (react_1["default"].createElement(Chip_1["default"], { size: "small", variant: "outlined", color: "primary", label: sizeStr, key: index })); })))),
                    (targeting === null || targeting === void 0 ? void 0 : targeting.length) > 0 && (react_1["default"].createElement(Box_1["default"], { sx: { p: 0.5 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Targeting:"),
                        react_1["default"].createElement(Stack_1["default"], { direction: "row", sx: { flexWrap: 'wrap', gap: 1 } },
                            targeting
                                .filter(function (_a) {
                                var value = _a.value;
                                return value;
                            })
                                .sort(function (a, b) { return (a.key > b.key ? 1 : -1); })
                                .map(function (_a, index) {
                                var key = _a.key, value = _a.value;
                                return (react_1["default"].createElement(Chip_1["default"], { size: "small", variant: "outlined", color: "primary", label: key + ": " + value, key: index }));
                            }),
                            targeting
                                .filter(function (_a) {
                                var value = _a.value;
                                return !value;
                            })
                                .sort(function (a, b) { return (a.key > b.key ? 1 : -1); })
                                .map(function (_a, index) {
                                var key = _a.key, value = _a.value;
                                return (react_1["default"].createElement(Chip_1["default"], { size: "small", variant: "outlined", color: "primary", label: key + ": " + value, key: index }));
                            }))))))))));
};
exports["default"] = AdServerTile;
