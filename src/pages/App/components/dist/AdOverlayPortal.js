"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getMaxZIndex = void 0;
var react_1 = require("react");
var AdOverlayComponent_1 = require("./AdOverlayComponent");
var react_dom_1 = require("react-dom");
exports.getMaxZIndex = function () { return Math.max.apply(Math, __spreadArrays(Array.from(document.querySelectorAll('*'), function (el) { return parseFloat(window.getComputedStyle(el).zIndex); }).filter(function (zIndex) { return !Number.isNaN(zIndex); }), [0])); };
var AdOverlayPortal = function (_a) {
    var _b, _c;
    var container = _a.container, mask = _a.mask, consoleState = _a.consoleState, pbjsNameSpace = _a.pbjsNameSpace;
    var _d = react_1.useState(null), contentRef = _d[0], setContentRef = _d[1];
    var iFrameBody = (_c = (_b = contentRef === null || contentRef === void 0 ? void 0 : contentRef.contentWindow) === null || _b === void 0 ? void 0 : _b.document) === null || _c === void 0 ? void 0 : _c.body;
    if (iFrameBody)
        iFrameBody.style.margin = '0';
    var elementId = mask.elementId, winningCPM = mask.winningCPM, winningBidder = mask.winningBidder, currency = mask.currency, timeToRespond = mask.timeToRespond;
    var element = react_1.useRef(document.createElement('div'));
    var closePortal = function () {
        document.getElementById("prpb-mask--container-" + mask.elementId).style.display = 'none';
    };
    react_1.useEffect(function () {
        var slotMaskElement = document.getElementById("prpb-mask--container-" + mask.elementId);
        if (consoleState) {
            if (!slotMaskElement) {
                element.current.style.zIndex = "" + (exports.getMaxZIndex() + 1);
                element.current.style.position = 'absolute';
                element.current.style.wordBreak = 'break-all';
                element.current.id = "prpb-mask--container-" + mask.elementId;
                element.current.style.top = '0';
                element.current.style.left = '0';
                if (container.style.position === '') {
                    container.style.position = 'relative';
                }
                container === null || container === void 0 ? void 0 : container.append(element.current);
            }
            else {
                slotMaskElement.style.width = ((container === null || container === void 0 ? void 0 : container.offsetWidth) || (container === null || container === void 0 ? void 0 : container.clientWidth)) + "px";
                slotMaskElement.style.height = ((container === null || container === void 0 ? void 0 : container.offsetHeight) || (container === null || container === void 0 ? void 0 : container.clientHeight)) + "px";
            }
        }
        else {
            slotMaskElement === null || slotMaskElement === void 0 ? void 0 : slotMaskElement.parentNode.removeChild(slotMaskElement);
        }
    }, [mask, consoleState, container]);
    return react_dom_1.createPortal(react_1["default"].createElement("iframe", { title: element.current.id, ref: setContentRef, width: ((container === null || container === void 0 ? void 0 : container.offsetWidth) || (container === null || container === void 0 ? void 0 : container.clientWidth)) + "px", height: ((container === null || container === void 0 ? void 0 : container.offsetHeight) || (container === null || container === void 0 ? void 0 : container.clientHeight)) + "px", scrolling: "no", frameBorder: "0" }, iFrameBody &&
        react_dom_1.createPortal(react_1["default"].createElement(AdOverlayComponent_1["default"], { key: "AdMask-" + elementId, elementId: elementId, winningCPM: winningCPM, winningBidder: winningBidder, currency: currency, timeToRespond: timeToRespond, closePortal: closePortal, contentRef: contentRef, pbjsNameSpace: pbjsNameSpace }), iFrameBody)), element.current);
};
exports["default"] = AdOverlayPortal;
