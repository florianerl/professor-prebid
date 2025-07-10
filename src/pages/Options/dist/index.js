"use strict";
exports.__esModule = true;
var react_1 = require("react");
var client_1 = require("react-dom/client");
var Options_1 = require("./Options");
var container = window.document.querySelector('#app-container');
if (container) {
    client_1.createRoot(container).render(react_1["default"].createElement(Options_1["default"], { title: 'Settings' }));
}
if (module.hot)
    module.hot.accept();
