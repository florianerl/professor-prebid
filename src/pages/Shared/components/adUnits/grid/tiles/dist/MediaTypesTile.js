"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Stack_1 = require("@mui/material/Stack");
var Chip_1 = require("@mui/material/Chip");
var Typography_1 = require("@mui/material/Typography");
var appStateContext_1 = require("../../../../contexts/appStateContext");
var JSONViewerComponent_1 = require("../../../JSONViewerComponent");
var MediaTypeChipComponent_1 = require("../../chips/MediaTypeChipComponent");
var Box_1 = require("@mui/material/Box");
var Grid_1 = require("@mui/material/Grid");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var ExpandLess_1 = require("@mui/icons-material/ExpandLess");
var Paper_1 = require("@mui/material/Paper");
var MediaTypesTile = function (_a) {
    var _b = _a.adUnit, mediaTypes = _b.mediaTypes, adUnitCode = _b.code;
    var _c = react_1.useContext(appStateContext_1["default"]), allWinningBids = _c.allWinningBids, isPanel = _c.isPanel;
    var _d = react_1["default"].useState(false), expanded = _d[0], setExpanded = _d[1];
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
                    (JSON.stringify(mediaTypes) === '{}' || mediaTypes === undefined || !mediaTypes) && (react_1["default"].createElement(Box_1["default"], null,
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" },
                            "Media Types Object: ",
                            JSON.stringify(mediaTypes)))),
                    Object.keys(mediaTypes).map(function (mediaType, index) {
                        var _a, _b;
                        return (react_1["default"].createElement(react_1["default"].Fragment, { key: index },
                            mediaType === 'banner' && mediaTypes['banner'].sizes && (react_1["default"].createElement(Box_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Banner Sizes:"),
                                react_1["default"].createElement(Stack_1["default"], { direction: "row", sx: { flexWrap: 'wrap', gap: 1 } }, (_a = mediaTypes['banner'].sizes) === null || _a === void 0 ? void 0 : _a.map(function (_a, index) {
                                    var _b, _c;
                                    var width = _a[0], height = _a[1];
                                    return (react_1["default"].createElement(MediaTypeChipComponent_1["default"], { input: mediaTypes['banner'], label: width + "x" + height, key: index, isWinner: ((_c = (_b = allWinningBids.find(function (_a) {
                                            var args = _a.args;
                                            return args.adUnitCode === adUnitCode;
                                        })) === null || _b === void 0 ? void 0 : _b.args) === null || _c === void 0 ? void 0 : _c.size) === width + "x" + height }));
                                })))),
                            mediaType === 'banner' && ((_b = mediaTypes['banner'].sizeConfig) === null || _b === void 0 ? void 0 : _b.map(function (_a, index) {
                                var minViewPort = _a.minViewPort, sizes = _a.sizes;
                                return (react_1["default"].createElement(Box_1["default"], { key: index },
                                    react_1["default"].createElement(Typography_1["default"], { variant: "caption" },
                                        "minViewPort ",
                                        minViewPort[0],
                                        "x",
                                        minViewPort[1],
                                        ":"),
                                    react_1["default"].createElement(Stack_1["default"], { direction: "row", sx: { flexWrap: 'wrap', gap: 1 } }, sizes.map(function (_a, index) {
                                        var width = _a[0], height = _a[1];
                                        return (react_1["default"].createElement(Chip_1["default"], { size: "small", variant: "outlined", color: "primary", label: width + "x" + height, key: index }));
                                    }))));
                            })),
                            mediaType === 'video' && (react_1["default"].createElement(Box_1["default"], { key: index },
                                react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Video:"),
                                react_1["default"].createElement(Stack_1["default"], { direction: "row", sx: { flexWrap: 'wrap', gap: 1 } }, Object.keys(mediaTypes['video']).map(function (key, index) { return (react_1["default"].createElement(MediaTypeChipComponent_1["default"], { input: mediaTypes['video'], label: key + ": " + JSON.stringify(mediaTypes['video'][key]), key: index })); })))),
                            mediaType === 'native' && (react_1["default"].createElement(Box_1["default"], { key: index },
                                react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "Native:"),
                                react_1["default"].createElement(Stack_1["default"], { direction: "row", sx: { flexWrap: 'wrap', gap: 1 } }, Object.keys(mediaTypes['native']).map(function (key, index) { return (react_1["default"].createElement(MediaTypeChipComponent_1["default"], { input: mediaTypes['native'], label: key + ": " + JSON.stringify(mediaTypes['native'][key]), key: index })); }))))));
                    }),
                    expanded && (react_1["default"].createElement(Box_1["default"], { sx: { padding: 0.5 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "caption" }, "MediaType JSON:"),
                        react_1["default"].createElement(JSONViewerComponent_1["default"], { style: { padding: 0 }, src: mediaTypes, collapsed: 4 }))))))));
};
exports["default"] = MediaTypesTile;
