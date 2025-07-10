"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
exports.__esModule = true;
var react_1 = require("react");
var Typography_1 = require("@mui/material/Typography");
var Grid_1 = require("@mui/material/Grid");
var TextField_1 = require("@mui/material/TextField");
var Autocomplete_1 = require("@mui/material/Autocomplete");
var useMediaQuery_1 = require("@mui/material/useMediaQuery");
var ListSubheader_1 = require("@mui/material/ListSubheader");
var Popper_1 = require("@mui/material/Popper");
var styles_1 = require("@mui/material/styles");
// import { VariableSizeList, ListChildComponentProps } from 'react-window';
var material_1 = require("@mui/material");
var LISTBOX_PADDING = 8; // px
var SearchBarComponent = function (_a) {
    var config = _a.config;
    var options = new Set();
    var loop = function (obj) {
        for (var k in obj) {
            if (typeof obj[k] == 'object' && obj[k] !== null) {
                loop(obj[k]);
            }
            else {
                if (!k.startsWith('_') && typeof k === 'string') {
                    options.add(k);
                }
                if (!k.startsWith('_') && typeof obj[k] === 'string') {
                    options.add(obj[k]);
                }
            }
        }
    };
    loop(config);
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 } },
        react_1["default"].createElement(Autocomplete_1["default"], { sx: { w: 1 }, disableListWrap: true, PopperComponent: StyledPopper, ListboxComponent: ListboxComponent, options: Array.from(options).sort(), groupBy: function (option) { return option[0].toUpperCase(); }, renderInput: function (params) { return react_1["default"].createElement(TextField_1["default"], __assign({}, params, { label: "search", sx: { backgroundColor: 'background.paper', borderRadius: 1 } })); }, renderOption: function (props, option) { return [props, option]; }, renderGroup: function (params) { return params; } })));
};
exports["default"] = SearchBarComponent;
var renderRow = function (props) {
    var data = props.data, index = props.index, style = props.style;
    var dataSet = data[index];
    var inlineStyle = __assign(__assign({}, style), { top: style.top + LISTBOX_PADDING });
    if (dataSet.hasOwnProperty('group')) {
        return (react_1["default"].createElement(ListSubheader_1["default"], { key: dataSet.key, component: "div", style: inlineStyle }, dataSet.group));
    }
    return (react_1["default"].createElement(Typography_1["default"], __assign({ component: "li" }, dataSet[0], { noWrap: true, style: inlineStyle }), dataSet[1]));
};
var OuterElementContext = react_1["default"].createContext({});
var OuterElementType = react_1["default"].forwardRef(function (props, ref) {
    var outerProps = react_1["default"].useContext(OuterElementContext);
    return react_1["default"].createElement("div", __assign({ ref: ref }, props, outerProps));
});
function useResetCache(data) {
    var ref = react_1["default"].useRef(null);
    react_1["default"].useEffect(function () {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
// Adapter for react-window
var ListboxComponent = react_1["default"].forwardRef(function ListboxComponent(props, ref) {
    var theme = material_1.useTheme();
    var children = props.children, other = __rest(props, ["children"]);
    var itemData = [];
    children.forEach(function (item) {
        itemData.push(item);
        itemData.push.apply(itemData, (item.children || []));
    });
    var smUp = useMediaQuery_1["default"](theme.breakpoints.up('sm'), {
        noSsr: true
    });
    var itemCount = itemData === null || itemData === void 0 ? void 0 : itemData.length;
    var itemSize = smUp ? 36 : 48;
    var getChildSize = function (child) {
        if (child.hasOwnProperty('group')) {
            return 48;
        }
        return itemSize;
    };
    var getHeight = function () {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce(function (a, b) { return a + b; }, 0);
    };
    var gridRef = useResetCache(itemCount);
    return (react_1["default"].createElement("div", { ref: ref },
        react_1["default"].createElement(OuterElementContext.Provider, { value: other },
            react_1["default"].createElement(VariableSizeList, { itemData: itemData, height: getHeight() + 2 * LISTBOX_PADDING, width: "100%", ref: gridRef, outerElementType: OuterElementType, innerElementType: "ul", itemSize: function (index) { return getChildSize(itemData[index]); }, overscanCount: 5, itemCount: itemCount }, renderRow))));
});
var StyledPopper = styles_1.styled(Popper_1["default"])((_a = {},
    _a["& ." + Autocomplete_1.autocompleteClasses.listbox] = {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0
        }
    },
    _a));
