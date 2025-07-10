"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var IconButton_1 = require("@mui/material/IconButton");
var Apps_1 = require("@mui/icons-material/Apps");
var Tabs_1 = require("@mui/material/Tabs");
var Tab_1 = require("@mui/material/Tab");
var Paper_1 = require("@mui/material/Paper");
var Grid_1 = require("@mui/material/Grid");
var BidReceivedRowComponent_1 = require("./BidReceivedRowComponent");
var NoBidRowComponent_1 = require("./NoBidRowComponent");
var appStateContext_1 = require("../../contexts/appStateContext");
var gridStyle = {
    p: 0.5,
    '& .MuiGrid-item > .MuiPaper-root': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};
var tabsStyle = { minHeight: 0, '& > div > div > button': { minHeight: 0 }, '& > div  > span': { display: 'none' } };
var tabStyle = { p: 0, justifyContent: 'flex-start' };
var RenderGridPaperItem = function (_a) {
    var children = _a.children, cols = _a.cols;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: cols } },
        react_1["default"].createElement(Paper_1["default"], { sx: { height: '100%' } }, children)));
};
var BidsComponent = function () {
    var _a = react_1["default"].useState(0), tab = _a[0], setTab = _a[1];
    var _b = react_1["default"].useState(false), globalOpen = _b[0], setGlobalOpen = _b[1];
    var _c = react_1["default"].useState([]), bidsReceived = _c[0], setBidsReceived = _c[1];
    var _d = react_1["default"].useState([]), noBids = _d[0], setNoBids = _d[1];
    var auctionEndEvents = react_1.useContext(appStateContext_1["default"]).auctionEndEvents;
    react_1.useEffect(function () {
        var bidsReceived = auctionEndEvents.map(function (event) { return event.args.bidsReceived; }).flat();
        var noBids = auctionEndEvents.map(function (event) { return event.args.noBids; }).flat();
        setBidsReceived(bidsReceived);
        setNoBids(noBids);
    }, [auctionEndEvents]);
    return (react_1["default"].createElement(Grid_1["default"], { container: true, direction: "row", justifyContent: "start", spacing: 0.25, sx: gridStyle },
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 }, sx: { paddingBottom: 0.5 } },
            react_1["default"].createElement(Tabs_1["default"], { value: tab, onChange: function (_event, newValue) {
                    setTab(newValue);
                }, sx: tabsStyle },
                react_1["default"].createElement(Tab_1["default"], { sx: tabStyle, label: react_1["default"].createElement(Typography_1["default"], { variant: "h2", component: Paper_1["default"], sx: { p: 1, border: 1, borderColor: tab === 0 ? 'primary.main' : 'transparent' } }, "Received Bids") }),
                react_1["default"].createElement(Tab_1["default"], { sx: tabStyle, label: react_1["default"].createElement(Typography_1["default"], { variant: "h2", component: Paper_1["default"], sx: { p: 1, border: 1, borderColor: tab === 1 ? 'primary.main' : 'transparent' } }, "No Bids") }))),
        tab === 0 && (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(RenderGridPaperItem, { cols: 0.62 },
                react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return setGlobalOpen(!globalOpen); }, size: "small", sx: { p: 0.5 }, children: react_1["default"].createElement(Apps_1["default"], null) })),
            react_1["default"].createElement(RenderGridPaperItem, { cols: 2.38 }, "Bidder Code"),
            react_1["default"].createElement(RenderGridPaperItem, { cols: 1 }, "Cpm"),
            react_1["default"].createElement(RenderGridPaperItem, { cols: 2 }, "Currency"),
            react_1["default"].createElement(RenderGridPaperItem, { cols: 3 }, "AdUnit Code"),
            react_1["default"].createElement(RenderGridPaperItem, { cols: 1 }, "Size"),
            react_1["default"].createElement(RenderGridPaperItem, { cols: 2 }, "Media Type"),
            bidsReceived.map(function (bid, index) { return (react_1["default"].createElement(BidReceivedRowComponent_1["default"], { key: index, bid: bid, globalOpen: globalOpen })); }))),
        tab === 1 && (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(RenderGridPaperItem, { cols: 0.62 },
                react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return setGlobalOpen(!globalOpen); }, size: "small", sx: { p: 0.5 }, children: react_1["default"].createElement(Apps_1["default"], null) })),
            react_1["default"].createElement(RenderGridPaperItem, { cols: 2.38 }, "Bidder Code"),
            react_1["default"].createElement(RenderGridPaperItem, { cols: 9 }, "AdUnit Code"),
            noBids.map(function (bid, index) { return (react_1["default"].createElement(NoBidRowComponent_1["default"], { key: index, bid: bid, globalOpen: globalOpen })); })))));
};
exports["default"] = BidsComponent;
