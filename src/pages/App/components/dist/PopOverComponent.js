"use strict";
exports.__esModule = true;
var react_1 = require("react");
var AdOverlayPortal_1 = require("./AdOverlayPortal");
var react_2 = require("@emotion/react");
var react_3 = require("react");
var Grid_1 = require("@mui/material/Grid");
var Popover_1 = require("@mui/material/Popover");
var Typography_1 = require("@mui/material/Typography");
var cache_1 = require("@emotion/cache");
var Card_1 = require("@mui/material/Card");
var Close_1 = require("@mui/icons-material/Close");
var IconButton_1 = require("@mui/material/IconButton");
var Divider_1 = require("@mui/material/Divider");
var JSONViewerComponent_1 = require("../../Shared/components/JSONViewerComponent");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var Gavel_1 = require("@mui/icons-material/Gavel");
var AttachMoney_1 = require("@mui/icons-material/AttachMoney");
var Preview_1 = require("@mui/icons-material/Preview");
var Help_1 = require("@mui/icons-material/Help");
var CrisisAlert_1 = require("@mui/icons-material/CrisisAlert");
var SettingsOutlined_1 = require("@mui/icons-material/SettingsOutlined");
var material_1 = require("@mui/material");
var ExpandableItem = function (_a) {
    var avatar = _a.avatar, children = _a.children, title = _a.title, json = _a.json;
    var _b = react_1["default"].useState(false), expanded = _b[0], setExpanded = _b[1];
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: 8, md: expanded ? 12 : 6 }, sx: { minHeight: 250, height: expanded ? 'unset' : 250, overflow: 'hidden' } },
        react_1["default"].createElement(Card_1["default"], { sx: { height: 1 } },
            react_1["default"].createElement(Card_1["default"], { elevation: 0, sx: { display: 'flex', justifyContent: 'space-between', p: 1 }, onClick: function () { return setExpanded(!expanded); } },
                react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } }, avatar),
                react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, title),
                react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)'
                    } })),
            children && children,
            json && react_1["default"].createElement(JSONViewerComponent_1["default"], { src: json, name: false, displayObjectSize: true, displayDataTypes: false, sortKeys: false, quotesOnKeys: false, indentWidth: 2, collapsed: false, collapseStringsAfterLength: expanded ? undefined : 30 }))));
};
var Item = function (_a) {
    var children = _a.children;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 2, sm: 4, md: 6 } },
        react_1["default"].createElement(Card_1["default"], { children: children, sx: { p: 1 } })));
};
var PopOverComponent = function (_a) {
    var _b;
    var elementId = _a.elementId, winningCPM = _a.winningCPM, winningBidder = _a.winningBidder, currency = _a.currency, timeToRespond = _a.timeToRespond, anchorEl = _a.anchorEl, setAnchorEl = _a.setAnchorEl, pbjsNameSpace = _a.pbjsNameSpace;
    var cacheTopPage = cache_1["default"]({ key: 'css', container: (_b = window.top.document) === null || _b === void 0 ? void 0 : _b.head, prepend: true });
    var pbjs = window[pbjsNameSpace];
    var open = Boolean(anchorEl);
    var _c = react_3.useState(null), adUnit = _c[0], setAdunit = _c[1];
    var _d = react_3.useState(null), bidsSorted = _d[0], setBidsSorted = _d[1];
    var _e = react_3.useState(null), winningBid = _e[0], setWinningBid = _e[1];
    react_3.useEffect(function () {
        var bids = pbjs.getBidResponsesForAdUnitCode(elementId).bids;
        var bidsSorted = bids.sort(function (a, b) { return b.cpm - a.cpm; });
        var winningBid = pbjs.getAllWinningBids().filter(function (_a) {
            var adUnitCode = _a.adUnitCode;
            return adUnitCode === elementId;
        })[0];
        setAdunit(pbjs.adUnits.find(function (el) { return el.code === elementId; }));
        setBidsSorted(bidsSorted);
        setWinningBid(winningBid);
    }, [elementId, pbjs]);
    // gam stuff
    var _f = react_3.useState(null), networktId = _f[0], setNetworkId = _f[1];
    var _g = react_3.useState(null), slotElementId = _g[0], setSlotElementId = _g[1];
    var _h = react_3.useState(null), creativeId = _h[0], setCreativeId = _h[1];
    var _j = react_3.useState(null), queryId = _j[0], setQueryId = _j[1];
    var _k = react_3.useState(null), lineItemId = _k[0], setLineItemId = _k[1];
    var _l = react_3.useState(null), slotAdUnitPath = _l[0], setSlotAdUnitPath = _l[1];
    var _m = react_3.useState(null), slotTargeting = _m[0], setSlotTargeting = _m[1];
    var _o = react_3.useState(null), slotResponseInfo = _o[0], setSlotResponseInfo = _o[1];
    react_3.useEffect(function () {
        var _a, _b, _c, _d;
        if (window.parent.googletag && typeof ((_a = window.parent.googletag) === null || _a === void 0 ? void 0 : _a.pubads) === 'function') {
            var pubads_1 = googletag.pubads();
            var slots = pubads_1.getSlots();
            var slot_1 = slots.find(function (slot) { return slot.getSlotElementId() === elementId; }) || slots.find(function (slot) { return slot.getAdUnitPath() === elementId; });
            setSlotElementId(slot_1 === null || slot_1 === void 0 ? void 0 : slot_1.getSlotElementId());
            setSlotAdUnitPath(slot_1 === null || slot_1 === void 0 ? void 0 : slot_1.getAdUnitPath());
            setNetworkId((_c = (_b = slot_1 === null || slot_1 === void 0 ? void 0 : slot_1.getAdUnitPath()) === null || _b === void 0 ? void 0 : _b.split('/')[1]) === null || _c === void 0 ? void 0 : _c.split(','));
            setSlotTargeting(slot_1 === null || slot_1 === void 0 ? void 0 : slot_1.getTargetingKeys().map(function (key, id) { return ({ key: key, value: slot_1.getTargeting(key), id: id }); }));
            setSlotResponseInfo(slot_1 === null || slot_1 === void 0 ? void 0 : slot_1.getResponseInformation());
            setQueryId(((_d = document.getElementById(slot_1 === null || slot_1 === void 0 ? void 0 : slot_1.getSlotElementId())) === null || _d === void 0 ? void 0 : _d.getAttribute('data-google-query-id')) || null);
            if (slotResponseInfo) {
                var _e = slotResponseInfo, creativeId_1 = _e.creativeId, lineItemId_1 = _e.lineItemId, sourceAgnosticCreativeId = _e.sourceAgnosticCreativeId, sourceAgnosticLineItemId = _e.sourceAgnosticLineItemId;
                setCreativeId(creativeId_1 || sourceAgnosticCreativeId);
                setLineItemId(lineItemId_1 || sourceAgnosticLineItemId);
            }
            var eventHandler_1 = function (event) {
                if ((slot_1 === null || slot_1 === void 0 ? void 0 : slot_1.getSlotElementId()) === event.slot.getSlotElementId()) {
                    setSlotResponseInfo(slot_1.getResponseInformation());
                }
            };
            pubads_1.addEventListener('slotResponseReceived', eventHandler_1);
            pubads_1.addEventListener('slotRenderEnded', eventHandler_1);
            return function () {
                pubads_1.removeEventListener('slotResponseReceived', eventHandler_1);
                pubads_1.removeEventListener('slotRenderEnded', eventHandler_1);
            };
        }
    }, [elementId, slotResponseInfo]);
    return (react_1["default"].createElement(Popover_1["default"], { anchorEl: anchorEl, anchorOrigin: { vertical: 'top', horizontal: 'left' }, open: open, onClose: function () { return setAnchorEl(null); }, sx: { zIndex: AdOverlayPortal_1.getMaxZIndex() + 1, maxWidth: 0.5 }, transformOrigin: { vertical: 'center', horizontal: 'center' }, children: react_1["default"].createElement(react_2.CacheProvider, { value: cacheTopPage, children: react_1["default"].createElement(Grid_1["default"], { container: true, rowSpacing: 0.5, columnSpacing: 0.5, columns: { xs: 4, sm: 8, md: 12 }, sx: {
                    backgroundColor: 'primary.light',
                    color: 'text.primary',
                    padding: 0.5
                } },
                react_1["default"].createElement(Grid_1["default"], { size: 12, sx: { display: 'flex', flexDirection: 'row-reverse' } },
                    react_1["default"].createElement(IconButton_1["default"], { sx: { p: 0 }, onClick: function () { return setAnchorEl(null); } },
                        react_1["default"].createElement(Close_1["default"], null))),
                winningCPM && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], null,
                        react_1["default"].createElement("strong", null, "Winning CPM: "),
                        " ",
                        winningCPM,
                        " ",
                        currency) })),
                winningBidder && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], null,
                        react_1["default"].createElement("strong", null, "Winning Bidder: "),
                        " ",
                        winningBidder) })),
                timeToRespond && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], null,
                        react_1["default"].createElement("strong", null, "Time To Respond: "),
                        " ",
                        timeToRespond,
                        "ms") })),
                timeToRespond && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], null,
                        react_1["default"].createElement("strong", null, "Time To Respond: "),
                        " ",
                        timeToRespond,
                        "ms") })),
                pbjs && pbjs.version && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], null,
                        react_1["default"].createElement("strong", null, "Prebid Version: "),
                        pbjs.version) })),
                (lineItemId || creativeId || queryId || slotAdUnitPath || slotElementId) && react_1["default"].createElement(Grid_1["default"], { size: { xs: 4, sm: 8, md: 12 }, children: react_1["default"].createElement(Divider_1["default"], null) }),
                lineItemId && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], { sx: { '& a': { color: 'secondary.main' } } },
                        react_1["default"].createElement("strong", null, "LineItem-ID: "),
                        react_1["default"].createElement("a", { href: "https://admanager.google.com/" + networktId[0] + "#delivery/LineItemDetail/lineItemId=" + lineItemId, rel: "noreferrer", target: "_blank" }, lineItemId),
                        networktId[1] &&
                            networktId.map(function (nwId, index) { return (react_1["default"].createElement(Typography_1["default"], { key: index, component: 'span', variant: "body1", sx: { color: 'secondary.main', '& a': { color: 'secondary.main' } } },
                                index === 0 && ' (',
                                index > 0 && (react_1["default"].createElement("a", { href: "https://admanager.google.com/" + nwId + "#delivery/CreativeDetail/creativeId=" + creativeId, rel: "noreferrer", target: "_blank" }, "" + index)),
                                index === networktId.length - 1 ? ')' : index === 0 ? '' : ', ')); })) })),
                creativeId && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], { sx: { '& a': { color: 'secondary.main' } } },
                        react_1["default"].createElement("strong", null, "Creative-ID: "),
                        react_1["default"].createElement("a", { href: "https://admanager.google.com/" + networktId[0] + "#delivery/CreativeDetail/creativeId=" + creativeId, rel: "noreferrer", target: "_blank" }, creativeId),
                        networktId[1] &&
                            networktId.map(function (nwId, index) { return (react_1["default"].createElement(Typography_1["default"], { key: index, component: 'span', variant: "body1", sx: { color: 'secondary.main', '& a': { color: 'secondary.main' } } },
                                index === 0 && ' (',
                                index > 0 && (react_1["default"].createElement("a", { href: "https://admanager.google.com/" + nwId + "#delivery/CreativeDetail/creativeId=" + creativeId, rel: "noreferrer", target: "_blank" }, "" + index)),
                                index === networktId.length - 1 ? ')' : index === 0 ? '' : ', ')); })) })),
                queryId && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(Typography_1["default"], { variant: "h4", component: 'span' },
                            "Query-ID:",
                            ' '),
                        react_1["default"].createElement(Typography_1["default"], { component: 'span', variant: "body1", sx: { '& a': { color: 'secondary.main' } } },
                            react_1["default"].createElement("a", { href: "https://admanager.google.com/" + networktId[0] + "#troubleshooting/screenshot/query_id=" + queryId, rel: "noreferrer", target: "_blank" }, false ? queryId.substring(0, 4) + "..." + queryId.substring(queryId.length - 4) : queryId),
                            networktId[1] &&
                                networktId.map(function (nwId, index) { return (react_1["default"].createElement(Typography_1["default"], { key: index, component: 'span', variant: "body1", sx: { color: 'secondary.main', '& a': { color: 'secondary.main' } } },
                                    index === 0 && ' (',
                                    index > 0 && (react_1["default"].createElement("a", { href: "https://admanager.google.com/" + nwId + "#troubleshooting/screenshot/query_id=" + queryId, rel: "noreferrer", target: "_blank" }, "" + index)),
                                    index === networktId.length - 1 ? ')' : index === 0 ? '' : ', ')); }))) })),
                slotAdUnitPath && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], null,
                        react_1["default"].createElement("strong", null, "AdUnit Path: "),
                        " ",
                        slotAdUnitPath,
                        ' ') })),
                slotElementId && (react_1["default"].createElement(Item, { children: react_1["default"].createElement(Typography_1["default"], null,
                        react_1["default"].createElement("strong", null, "Element-ID: "),
                        slotElementId) })),
                (winningBid || bidsSorted || winningBid || slotResponseInfo || slotTargeting) && react_1["default"].createElement(Grid_1["default"], { size: { xs: 4, sm: 8, md: 12 }, children: react_1["default"].createElement(Divider_1["default"], null) }),
                adUnit && react_1["default"].createElement(ExpandableItem, { title: "AdUnit Info", avatar: react_1["default"].createElement(SettingsOutlined_1["default"], null), json: adUnit }),
                winningBid && react_1["default"].createElement(ExpandableItem, { title: "Winning Bid", avatar: react_1["default"].createElement(Gavel_1["default"], null), json: winningBid }),
                bidsSorted && bidsSorted[0] && react_1["default"].createElement(ExpandableItem, { title: "All Bids for AdUnit", avatar: react_1["default"].createElement(AttachMoney_1["default"], null), json: bidsSorted }),
                winningBid && (react_1["default"].createElement(ExpandableItem, { title: "Creative Preview", avatar: react_1["default"].createElement(Preview_1["default"], null), json: winningBid && winningBid.native, children: winningBid && winningBid.ad && react_1["default"].createElement(Card_1["default"], { elevation: 0, sx: { display: 'flex', justifyContent: 'center' }, component: "div", dangerouslySetInnerHTML: { __html: (winningBid === null || winningBid === void 0 ? void 0 : winningBid.ad) || JSON.stringify(winningBid.native) } }) })),
                slotResponseInfo && react_1["default"].createElement(ExpandableItem, { title: "Response Info", avatar: react_1["default"].createElement(Help_1["default"], null), json: slotResponseInfo }),
                slotTargeting && (react_1["default"].createElement(ExpandableItem, { title: "Adserver Targeting", avatar: react_1["default"].createElement(CrisisAlert_1["default"], null), children: react_1["default"].createElement(Card_1["default"], { elevation: 0, sx: { display: 'flex', flexGrow: 1, backgroundColor: 'primary.light' } },
                        react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 0.25 },
                            react_1["default"].createElement(Grid_1["default"], { size: 6 },
                                react_1["default"].createElement(material_1.Paper, { sx: { p: 0.5 } },
                                    react_1["default"].createElement(Typography_1["default"], { variant: 'h3', sx: { textAlign: 'left' } }, "Key"))),
                            react_1["default"].createElement(Grid_1["default"], { size: 6 },
                                react_1["default"].createElement(material_1.Paper, { sx: { p: 0.5 } },
                                    react_1["default"].createElement(Typography_1["default"], { variant: 'h3', sx: { textAlign: 'left' } }, "Value"))),
                            slotTargeting.map(function (st, i) { return (react_1["default"].createElement(react_1["default"].Fragment, { key: i },
                                react_1["default"].createElement(Grid_1["default"], { size: 6, sx: {} },
                                    react_1["default"].createElement(material_1.Paper, { sx: { p: 0.5, h: 1, minHeight: 1 } },
                                        react_1["default"].createElement(Typography_1["default"], { variant: 'body1', sx: { textAlign: 'left' } }, st.key))),
                                react_1["default"].createElement(Grid_1["default"], { size: 6, sx: {} },
                                    react_1["default"].createElement(material_1.Paper, { sx: { p: 0.5, h: 1, minHeight: 1 } },
                                        react_1["default"].createElement(Typography_1["default"], { variant: 'body1', sx: { textAlign: 'left' } }, st.value))))); }))) }))) }) }));
};
exports["default"] = PopOverComponent;
