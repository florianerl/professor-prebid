"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Card_1 = require("@mui/material/Card");
var CardContent_1 = require("@mui/material/CardContent");
var CardHeader_1 = require("@mui/material/CardHeader");
var Table_1 = require("@mui/material/Table");
var TableBody_1 = require("@mui/material/TableBody");
var TableCell_1 = require("@mui/material/TableCell");
var TableContainer_1 = require("@mui/material/TableContainer");
var TableHead_1 = require("@mui/material/TableHead");
var TableRow_1 = require("@mui/material/TableRow");
var JSONViewerComponent_1 = require("../../JSONViewerComponent");
var Avatar_1 = require("@mui/material/Avatar");
var ExpandMore_1 = require("@mui/icons-material/ExpandMore");
var ContactPageOutlined_1 = require("@mui/icons-material/ContactPageOutlined");
var Grid_1 = require("@mui/material/Grid");
var Typography_1 = require("@mui/material/Typography");
var ConfigComponent_1 = require("../ConfigComponent");
var appStateContext_1 = require("../../../contexts/appStateContext");
var UserIdModuleComponent = function () {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = react_1["default"].useState(false), expanded = _h[0], setExpanded = _h[1];
    var _j = react_1["default"].useState(4), maxWidth = _j[0], setMaxWidth = _j[1];
    var ref = react_1["default"].useRef(null);
    var prebid = react_1.useContext(appStateContext_1["default"]).prebid;
    var userSync = prebid.config.userSync;
    var handleExpandClick = function () {
        setExpanded(!expanded);
        setMaxWidth(expanded ? 4 : 12);
        setTimeout(function () { return ref.current.scrollIntoView({ behavior: 'smooth' }); }, 150);
    };
    if (!userSync)
        return null;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: maxWidth }, ref: ref },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1, minHeight: ConfigComponent_1.tileHeight } },
            react_1["default"].createElement(CardHeader_1["default"], { avatar: react_1["default"].createElement(Avatar_1["default"], { sx: { bgcolor: 'primary.main' } },
                    react_1["default"].createElement(ContactPageOutlined_1["default"], null)), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" }, "UserIds"), subheader: react_1["default"].createElement(Typography_1["default"], { variant: "subtitle1" }, ((_a = userSync.userIds) === null || _a === void 0 ? void 0 : _a.length) > 0 ? ((_b = userSync.userIds) === null || _b === void 0 ? void 0 : _b.length) + " UserId" + (((_c = userSync.userIds) === null || _c === void 0 ? void 0 : _c.length) > 1 ? 's' : '') + " detected:" : 'No UserIds detected!'), action: react_1["default"].createElement(ExpandMore_1["default"], { sx: {
                        transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        marginLeft: 'auto'
                    } }), onClick: handleExpandClick }),
            react_1["default"].createElement(CardContent_1["default"], null,
                react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 2 },
                    !expanded &&
                        ((_d = userSync.userIds) === null || _d === void 0 ? void 0 : _d.length) > 0 &&
                        userSync.userIds.slice(0, 6).map(function (userId, index) { return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12, sm: expanded ? 3 : 6 }, key: index },
                            react_1["default"].createElement(Typography_1["default"], { variant: "body1" },
                                react_1["default"].createElement("strong", null,
                                    "#",
                                    index,
                                    ": "),
                                " ",
                                userId.name))); }),
                    !expanded && ((_e = userSync.userIds) === null || _e === void 0 ? void 0 : _e.length) > 5 && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
                        react_1["default"].createElement(Typography_1["default"], { variant: "body2" },
                            "+ ",
                            ((_f = userSync.userIds) === null || _f === void 0 ? void 0 : _f.length) - 5,
                            " more user ids..."))),
                    expanded && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
                        react_1["default"].createElement(TableContainer_1["default"], null,
                            react_1["default"].createElement(Table_1["default"], null,
                                react_1["default"].createElement(TableHead_1["default"], null,
                                    react_1["default"].createElement(TableRow_1["default"], null,
                                        react_1["default"].createElement(TableCell_1["default"], null, "Name"),
                                        react_1["default"].createElement(TableCell_1["default"], null, "Storage Type"),
                                        react_1["default"].createElement(TableCell_1["default"], null, "Storage Expires"),
                                        react_1["default"].createElement(TableCell_1["default"], null, "Storage Name"),
                                        react_1["default"].createElement(TableCell_1["default"], null, "Params"))),
                                react_1["default"].createElement(TableBody_1["default"], null, (_g = userSync === null || userSync === void 0 ? void 0 : userSync.userIds) === null || _g === void 0 ? void 0 : _g.map(function (userId, index) {
                                    var _a, _b, _c;
                                    return (react_1["default"].createElement(TableRow_1["default"], { key: index },
                                        react_1["default"].createElement(TableCell_1["default"], null,
                                            react_1["default"].createElement("strong", null, userId.name)),
                                        react_1["default"].createElement(TableCell_1["default"], null, (_a = userId.storage) === null || _a === void 0 ? void 0 : _a.type),
                                        react_1["default"].createElement(TableCell_1["default"], null, (_b = userId.storage) === null || _b === void 0 ? void 0 : _b.expires),
                                        react_1["default"].createElement(TableCell_1["default"], null, (_c = userId.storage) === null || _c === void 0 ? void 0 : _c.name),
                                        react_1["default"].createElement(TableCell_1["default"], null, userId.params && JSON.stringify(userId.params) !== '{}' && react_1["default"].createElement(JSONViewerComponent_1["default"], { src: userId.params, name: false, collapsed: 1, displayObjectSize: false, displayDataTypes: false, sortKeys: false, quotesOnKeys: false }))));
                                })))))))))));
};
exports["default"] = UserIdModuleComponent;
