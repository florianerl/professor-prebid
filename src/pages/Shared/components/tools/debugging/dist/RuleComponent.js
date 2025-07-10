"use strict";
exports.__esModule = true;
var react_1 = require("react");
var IconButton_1 = require("@mui/material/IconButton");
var Grid_1 = require("@mui/material/Grid");
var Typography_1 = require("@mui/material/Typography");
var DeleteForever_1 = require("@mui/icons-material/DeleteForever");
var MatchRule_1 = require("./MatchRule");
var ReplaceRule_1 = require("./ReplaceRule");
var Card_1 = require("@mui/material/Card");
var CardHeader_1 = require("@mui/material/CardHeader");
var CardContent_1 = require("@mui/material/CardContent");
var Box_1 = require("@mui/material/Box");
var RuleComponent = function (_a) {
    var rule = _a.rule, ruleIndex = _a.ruleIndex, handleRulesFormChange = _a.handleRulesFormChange, prebid = _a.prebid, removeRule = _a.removeRule;
    return (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 }, sx: { display: 'flex', alignItems: 'center' } },
        react_1["default"].createElement(Card_1["default"], { sx: { width: 1 }, elevation: 2 },
            react_1["default"].createElement(CardHeader_1["default"], { action: react_1["default"].createElement(IconButton_1["default"], { color: "primary", onClick: function () { return removeRule(); }, children: react_1["default"].createElement(DeleteForever_1["default"], null) }), title: react_1["default"].createElement(Typography_1["default"], { variant: "h3" },
                    "Rule #",
                    ruleIndex + 1,
                    ":"), sx: { pb: 0 } }),
            react_1["default"].createElement(CardContent_1["default"], { sx: { display: 'flex', flexDirection: 'row', pt: 0.1 } },
                react_1["default"].createElement(Box_1["default"], { sx: { width: 0.5 } },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h4", sx: { p: 0.5 } }, "When"),
                    Object.keys(rule.when).map(function (key, matchRuleTargetsIndex) { return (react_1["default"].createElement(MatchRule_1["default"], { groupIndex: matchRuleTargetsIndex, key: matchRuleTargetsIndex, rule: rule, ruleKey: key, handleRulesFormChange: handleRulesFormChange, prebid: prebid, path: ['intercept', "" + ruleIndex, 'when', key] })); })),
                react_1["default"].createElement(Box_1["default"], { sx: { width: 0.5 } },
                    react_1["default"].createElement(Typography_1["default"], { variant: "h4", sx: { p: 0.5 } }, "Then"),
                    Object.keys(rule.then).map(function (key, index) {
                        if (key === 'native') {
                            return Object.keys(rule.then[key]).map(function (k, i) {
                                return react_1["default"].createElement(ReplaceRule_1["default"], { key: i, rule: rule, ruleKey: k, groupIndex: index, handleRulesFormChange: handleRulesFormChange, path: ['intercept', "" + ruleIndex, 'then', 'native', k] });
                            });
                        }
                        else {
                            return react_1["default"].createElement(ReplaceRule_1["default"], { key: index, rule: rule, ruleKey: key, groupIndex: index, handleRulesFormChange: handleRulesFormChange, path: ['intercept', "" + ruleIndex, 'then', key] });
                        }
                    }))))));
};
exports["default"] = RuleComponent;
