"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var IconButton_1 = require("@mui/material/IconButton");
var KeyboardArrowDown_1 = require("@mui/icons-material/KeyboardArrowDown");
var KeyboardArrowUp_1 = require("@mui/icons-material/KeyboardArrowUp");
var Paper_1 = require("@mui/material/Paper");
var Grid_1 = require("@mui/material/Grid");
var ExpandedRowComponent_1 = require("./ExpandedRowComponent");
var NoBidRowComponent = function (_a) {
    var _b;
    var bid = _a.bid, globalOpen = _a.globalOpen;
    var _c = react_1["default"].useState(false), open = _c[0], setOpen = _c[1];
    react_1.useEffect(function () {
        setOpen(globalOpen);
    }, [globalOpen]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 0.62 } },
            react_1["default"].createElement(Paper_1["default"], { sx: { height: 1 } },
                react_1["default"].createElement(IconButton_1["default"], { size: "small", onClick: function () { return setOpen(!open); } }, open ? react_1["default"].createElement(KeyboardArrowUp_1["default"], null) : react_1["default"].createElement(KeyboardArrowDown_1["default"], null)))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 2.38 } },
            react_1["default"].createElement(Paper_1["default"], { sx: { height: 1 } },
                react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
                    bid.bidder,
                    " "))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 9 } },
            react_1["default"].createElement(Paper_1["default"], { sx: { height: 1 } },
                react_1["default"].createElement(Typography_1["default"], { variant: "body1" }, ((_b = bid.adUnitCode) === null || _b === void 0 ? void 0 : _b.length) > 15 ? bid.adUnitCode.substring(0, 15) + '...' : bid.adUnitCode))),
        open && react_1["default"].createElement(ExpandedRowComponent_1["default"], { bid: bid })));
};
exports["default"] = NoBidRowComponent;
