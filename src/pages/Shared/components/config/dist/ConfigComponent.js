"use strict";
exports.__esModule = true;
exports.tileHeight = void 0;
var react_1 = require("react");
var PriceGranularityComponent_1 = require("./tiles/PriceGranularityComponent");
var UserIdModule_1 = require("./tiles/UserIdModule");
var PrebidServerComponent_1 = require("./tiles/PrebidServerComponent");
var PrivacyComponent_1 = require("./tiles/PrivacyComponent");
var BidderSettingsComponent_1 = require("./tiles/BidderSettingsComponent");
var PrebidConfigComponent_1 = require("../../../Popup/components/config/PrebidConfigComponent");
var FloorsModuleComponent_1 = require("./tiles/FloorsModuleComponent");
var GptPreAuctionComponent_1 = require("./tiles/GptPreAuctionComponent");
var Grid_1 = require("@mui/material/Grid");
var react_error_boundary_1 = require("react-error-boundary");
var InstalledModules_1 = require("./tiles/InstalledModules");
var UserSyncComponent_1 = require("./tiles/UserSyncComponent");
exports.tileHeight = 255;
var ConfigComponent = function () {
    return (react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 0.25, padding: 0.5 },
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(InstalledModules_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(PriceGranularityComponent_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(PrebidConfigComponent_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(BidderSettingsComponent_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(PrebidServerComponent_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(PrivacyComponent_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(UserIdModule_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(FloorsModuleComponent_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(GptPreAuctionComponent_1["default"], null)),
        react_1["default"].createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorFallback },
            react_1["default"].createElement(UserSyncComponent_1["default"], null))));
};
exports["default"] = ConfigComponent;
var ErrorFallback = function (_a) {
    var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
    // Use state to track whether the delay has elapsed
    var _b = react_1.useState(false), delayElapsed = _b[0], setDelayElapsed = _b[1];
    // Reset the error boundary after the delay
    setTimeout(function () {
        resetErrorBoundary();
        setDelayElapsed(true);
    }, 1000);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("p", null,
            "An error occurred: ",
            error.message),
        delayElapsed && react_1["default"].createElement("p", null, "Resetting...")));
};
