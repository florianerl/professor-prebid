"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var appStateContext_1 = require("../../contexts/appStateContext");
var merge = function (target, source) {
    for (var key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
            }
            merge(target[key], source[key]);
        }
        else {
            target[key] = source[key];
        }
    }
    return target;
};
var AdUnitsComponentState = function () {
    var auctionInitEvents = react_1.useContext(appStateContext_1["default"]).auctionInitEvents;
    var _a = react_1.useState([]), adUnits = _a[0], setAdUnits = _a[1];
    react_1.useEffect(function () {
        var _a;
        var adUnits = (_a = auctionInitEvents === null || auctionInitEvents === void 0 ? void 0 : auctionInitEvents.reduce(function (previousValue, currentValue) {
            return __spreadArrays(previousValue, currentValue.args.adUnits);
        }, [])) === null || _a === void 0 ? void 0 : _a.reduce(function (previousValue, currentValue) {
            var toUpdate = previousValue.find(function (adUnit) {
                var adUnitBids = adUnit.bids.map(function (_a) {
                    var bidder = _a.bidder, params = _a.params;
                    return ({ bidder: bidder, params: params });
                }) || [];
                var currentValueBids = currentValue.bids.map(function (_a) {
                    var bidder = _a.bidder, params = _a.params;
                    return ({ bidder: bidder, params: params });
                }) || [];
                return (adUnit.code === currentValue.code &&
                    JSON.stringify(adUnit.mediaTypes) === JSON.stringify(currentValue.mediaTypes) &&
                    JSON.stringify(adUnit.sizes) === JSON.stringify(currentValue.sizes) &&
                    JSON.stringify(adUnitBids) === JSON.stringify(currentValueBids));
            });
            if (toUpdate) {
                toUpdate = merge(toUpdate, currentValue);
                return previousValue;
            }
            else {
                return __spreadArrays(previousValue, [currentValue]);
            }
        }, []);
        // "fix" https://github.com/prebid/professor-prebid/issues/104 ?
        // .sort((a, b) => a.code.localeCompare(b.code));
        setAdUnits(adUnits);
    }, [auctionInitEvents]);
    return {
        adUnits: adUnits,
        setAdUnits: setAdUnits
    };
};
exports["default"] = AdUnitsComponentState;
