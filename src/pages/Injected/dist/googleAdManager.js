"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.googleAdManager = void 0;
var utils_1 = require("../Shared/utils");
var constants_1 = require("../Shared/constants");
var GoogleAdManager = /** @class */ (function () {
    function GoogleAdManager() {
        this.slotEvents = {};
        this.postAuctionStartTimestamp = null;
        this.postAuctionEndTimestamp = null;
    }
    GoogleAdManager.prototype.init = function () {
        var _this = this;
        this.googletag = window.googletag || {};
        if (!Array.isArray(this.googletag.cmd)) {
            this.googletag.cmd = [];
        }
        this.googletag.cmd.push(function () { return _this.addEventListeners(); });
    };
    GoogleAdManager.prototype.updatePostAuctionTimestamps = function (input) {
        if (input < this.postAuctionStartTimestamp || this.postAuctionStartTimestamp === null) {
            this.postAuctionStartTimestamp = input;
        }
        if (input > this.postAuctionEndTimestamp || this.postAuctionEndTimestamp === null) {
            this.postAuctionEndTimestamp = input;
        }
    };
    GoogleAdManager.prototype.addEventListeners = function () {
        // 1. Adding an event listener for the PubAdsService
        var _this = this;
        this.googletag.pubads().addEventListener('slotRequested', function (event) {
            var slotElementId = event.slot.getSlotElementId();
            var timestamp = Date.now();
            _this.updatePostAuctionTimestamps(timestamp);
            _this.slotEvents[slotElementId] = __spreadArrays((_this.slotEvents[slotElementId] || []), [{ type: 'slotRequested', timestamp: timestamp }]);
            // this.sendDetailsToContentScript()
        });
        this.googletag.pubads().addEventListener('slotResponseReceived', function (event) {
            var slotElementId = event.slot.getSlotElementId();
            var timestamp = Date.now();
            _this.updatePostAuctionTimestamps(timestamp);
            _this.slotEvents[slotElementId] = __spreadArrays((_this.slotEvents[slotElementId] || []), [{ type: 'slotResponseReceived', timestamp: timestamp }]);
            _this.sendDetailsToContentScript();
        });
        this.googletag.pubads().addEventListener('slotRenderEnded', function (event) {
            var slotElementId = event.slot.getSlotElementId();
            var timestamp = Date.now();
            _this.slotEvents[slotElementId] = __spreadArrays((_this.slotEvents[slotElementId] || []), [{ type: 'slotRenderEnded', timestamp: timestamp }]);
            // this.sendDetailsToContentScript()
        });
        this.googletag.pubads().addEventListener('slotOnload', function (event) {
            var slotElementId = event.slot.getSlotElementId();
            var timestamp = Date.now();
            _this.slotEvents[slotElementId] = __spreadArrays((_this.slotEvents[slotElementId] || []), [{ type: 'slotOnload', timestamp: timestamp }]);
            // this.sendDetailsToContentScript()
        });
        this.googletag.pubads().addEventListener('slotVisibilityChanged', function (event) {
            var slotElementId = event.slot.getSlotElementId();
            var timestamp = Date.now();
            _this.slotEvents[slotElementId] = __spreadArrays((_this.slotEvents[slotElementId] || []), [{ type: 'slotVisibilityChanged', timestamp: timestamp }]);
            // this.sendDetailsToContentScript()
        });
        this.googletag.pubads().addEventListener('impressionViewable', function (event) {
            var slotElementId = event.slot.getSlotElementId();
            var timestamp = Date.now();
            _this.slotEvents[slotElementId] = __spreadArrays((_this.slotEvents[slotElementId] || []), [{ type: 'impressionViewable', timestamp: timestamp }]);
            _this.sendDetailsToContentScript();
        });
    };
    GoogleAdManager.prototype.getFetchBeforeRefresh = function () {
        var _a;
        var gpt = this.googletag;
        var events = ((_a = gpt === null || gpt === void 0 ? void 0 : gpt.getEventLog()) === null || _a === void 0 ? void 0 : _a.getAllEvents()) || [];
        var isFetchBeforeRefresh = false;
        var refreshIndex = null;
        var fetchslotIndex = null;
        for (var e in events) {
            var event = events[e];
            var message = typeof (event === null || event === void 0 ? void 0 : event.getMessage) === 'function' ? event === null || event === void 0 ? void 0 : event.getMessage() : null;
            var messageId = typeof (message === null || message === void 0 ? void 0 : message.getMessageId) === 'function' ? message === null || message === void 0 ? void 0 : message.getMessageId() : null;
            if (messageId == 70) {
                // refreshing ads
                if (refreshIndex == null)
                    refreshIndex = e;
            }
            else if (messageId == 3) {
                // fetching ad slot
                if (fetchslotIndex == null)
                    fetchslotIndex = e;
            }
        }
        if (refreshIndex != null && fetchslotIndex != null && parseInt(fetchslotIndex) < parseInt(refreshIndex)) {
            isFetchBeforeRefresh = true;
        }
        return isFetchBeforeRefresh;
    };
    GoogleAdManager.prototype.getFetchBeforeKeyValue = function () {
        var _a;
        var gpt = this.googletag;
        var events = ((_a = gpt === null || gpt === void 0 ? void 0 : gpt.getEventLog()) === null || _a === void 0 ? void 0 : _a.getAllEvents()) || [];
        var isFetchBeforeKeyvalue = false;
        var refreshIndex = null;
        var fetchslotIndex = null;
        var keyvalueIndex = null;
        for (var e in events) {
            var event = events[e];
            var message = typeof (event === null || event === void 0 ? void 0 : event.getMessage) === 'function' ? event === null || event === void 0 ? void 0 : event.getMessage() : null;
            var messageId = typeof (message === null || message === void 0 ? void 0 : message.getMessageId) === 'function' ? message === null || message === void 0 ? void 0 : message.getMessageId() : null;
            if (messageId == 70) {
                // refreshing ads
                if (refreshIndex == null) {
                    refreshIndex = e;
                }
            }
            else if (messageId == 3) {
                // fetching ad slot
                if (fetchslotIndex == null) {
                    fetchslotIndex = e;
                }
            }
            else if (messageId == 17) {
                // Setting targeting attribute for ad slot
                if (keyvalueIndex == null) {
                    keyvalueIndex = e;
                }
            }
        }
        if (keyvalueIndex != null && fetchslotIndex != null && parseInt(fetchslotIndex) < parseInt(keyvalueIndex)) {
            isFetchBeforeKeyvalue = true;
        }
        return isFetchBeforeKeyvalue;
    };
    GoogleAdManager.prototype.getRenderMode = function () {
        var _a;
        var gpt = this.googletag;
        var events = ((_a = gpt === null || gpt === void 0 ? void 0 : gpt.getEventLog()) === null || _a === void 0 ? void 0 : _a.getAllEvents()) || [];
        var asyncRendermode = true;
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event = events_1[_i];
            var message = (event === null || event === void 0 ? void 0 : event.getMessage) ? event.getMessage() : null;
            var messageId = message ? message.getMessageId() : null;
            var messageArgs = message ? message.getMessageArgs() : null;
            if (messageId == 63 && messageArgs[0] == 'synchronous rendering') {
                asyncRendermode = false;
            }
        }
        return asyncRendermode;
    };
    GoogleAdManager.prototype.creativeRenderTime = function (slotElementId) {
        var _a, _b;
        var slotOnLoadEvent = (_a = this.slotEvents[slotElementId]) === null || _a === void 0 ? void 0 : _a.find(function (event) { return event.type === 'slotOnload'; });
        var slotRenderEndedEvent = (_b = this.slotEvents[slotElementId]) === null || _b === void 0 ? void 0 : _b.find(function (event) { return event.type === 'slotRenderEnded'; });
        if (slotOnLoadEvent && slotRenderEndedEvent) {
            return slotOnLoadEvent.timestamp - slotRenderEndedEvent.timestamp;
        }
    };
    GoogleAdManager.prototype.getRequestMode = function () {
        var _a;
        var gpt = this.googletag;
        return ((_a = gpt === null || gpt === void 0 ? void 0 : gpt.pubads()) === null || _a === void 0 ? void 0 : _a.isSRA()) || false;
    };
    GoogleAdManager.prototype.getSlots = function () {
        var _a, _b, _c, _d, _e, _f;
        var gpt = this.googletag;
        var googletagSlots = [];
        var slots = ((_a = gpt === null || gpt === void 0 ? void 0 : gpt.pubads()) === null || _a === void 0 ? void 0 : _a.getSlots()) || [];
        var viewportWidth = (window === null || window === void 0 ? void 0 : window.innerWidth) || ((_b = document === null || document === void 0 ? void 0 : document.documentElement) === null || _b === void 0 ? void 0 : _b.clientWidth) || ((_c = document === null || document === void 0 ? void 0 : document.body) === null || _c === void 0 ? void 0 : _c.clientWidth);
        var viewportHeight = (window === null || window === void 0 ? void 0 : window.innerHeight) || ((_d = document === null || document === void 0 ? void 0 : document.documentElement) === null || _d === void 0 ? void 0 : _d.clientHeight) || ((_e = document === null || document === void 0 ? void 0 : document.body) === null || _e === void 0 ? void 0 : _e.clientHeight);
        for (var _i = 0, slots_1 = slots; _i < slots_1.length; _i++) {
            var slot = slots_1[_i];
            var targetingMap = slot.getTargetingMap();
            var slotTargeting = [];
            for (var targeting in targetingMap) {
                if (targetingMap.hasOwnProperty(targeting)) {
                    slotTargeting.push({
                        key: targeting,
                        value: ((_f = targetingMap[targeting]) === null || _f === void 0 ? void 0 : _f.join(',')) || ''
                    });
                }
            }
            var sizes = slot.getSizes(viewportWidth, viewportHeight);
            if (!sizes) {
                sizes = slot.getSizes();
            }
            googletagSlots.push({
                elementId: slot.getSlotElementId(),
                name: slot.getAdUnitPath(),
                sizes: sizes ? sizes.map(function (size) { return (typeof size == 'string' ? size : size.getWidth() + 'x' + size.getHeight()); }) : [],
                targeting: slotTargeting,
                creativeRenderTime: this.creativeRenderTime(slot.getSlotElementId())
            });
        }
        return googletagSlots;
    };
    GoogleAdManager.prototype.sendDetailsToContentScript = function () {
        var detail = {
            slots: this.getSlots(),
            sra: this.getRequestMode(),
            async: this.getRenderMode(),
            fetchBeforeRefresh: this.getFetchBeforeRefresh(),
            fetchBeforeKeyvalue: this.getFetchBeforeKeyValue(),
            slotEvents: this.slotEvents,
            postAuctionStartTimestamp: this.postAuctionStartTimestamp,
            postAuctionEndTimestamp: this.postAuctionEndTimestamp
        };
        if (this.lastMessage !== JSON.stringify(detail)) {
            utils_1.sendWindowPostMessage(constants_1.EVENTS.SEND_GAM_DETAILS_TO_BACKGROUND, detail);
            this.lastMessage = JSON.stringify(detail);
        }
    };
    return GoogleAdManager;
}());
exports.googleAdManager = new GoogleAdManager();
