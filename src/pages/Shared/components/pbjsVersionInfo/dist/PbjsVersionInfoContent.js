"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var Grid_1 = require("@mui/material/Grid");
var IconButton_1 = require("@mui/material/IconButton");
var Close_1 = require("@mui/icons-material/Close");
var appStateContext_1 = require("../../contexts/appStateContext");
var showdown_1 = require("showdown");
var moment_1 = require("moment");
var WarningAmberOutlined_1 = require("@mui/icons-material/WarningAmberOutlined");
var CheckCircleOutline_1 = require("@mui/icons-material/CheckCircleOutline");
var html_react_parser_1 = require("html-react-parser");
var react_loader_spinner_1 = require("react-loader-spinner");
require("./PbjsVersionInfoContent.css");
var converter = new showdown_1["default"].Converter();
var PbjsVersionInfoContent = function (_a) {
    var close = _a.close;
    var _b = react_1.useContext(appStateContext_1["default"]), prebid = _b.prebid, prebidReleaseInfo = _b.prebidReleaseInfo, setPrebidReleaseInfo = _b.setPrebidReleaseInfo;
    var _c = react_1.useState(false), showChangeLog = _c[0], setShowChangeLog = _c[1];
    var msToTime = function (ms) {
        var minutes = (ms / (1000 * 60)).toFixed(1);
        var hours = (ms / (1000 * 60 * 60)).toFixed(1);
        var days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
        var months = (ms / (1000 * 60 * 60 * 24 * 30)).toFixed(1);
        var years = (ms / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
        var text = '';
        if (Number(years) >= 1) {
            text = years + " year" + (Number(years) > 1 ? 's' : '') + ", " + months + " month" + (Number(months) > 1 ? 's' : '') + " and " + days + " day" + (Number(days) > 1 ? 's' : '');
        }
        else if (Number(months) >= 1) {
            text = months + " month" + (Number(months) > 1 ? 's' : '') + " and " + days + " day" + (Number(days) > 1 ? 's' : '');
        }
        else {
            text = days + " day" + (Number(days) > 1 ? 's' : '');
        }
        return { years: years, months: months, days: days, hours: hours, minutes: minutes, text: text };
    };
    var isCachedReleaseDataExpired = function (cachedData) {
        var result = false;
        if (Object.keys(cachedData).length > 0) {
            var data = JSON.parse(cachedData);
            var cachedTime = data[0].cached_at;
            var currentTime = Date.now();
            var differenceInMilliseconds = Math.round(currentTime - cachedTime);
            var timeElapsed = msToTime(differenceInMilliseconds);
            if (Number(timeElapsed.days) >= 1) {
                result = true;
                // console.log('cached data is expired, refreshing data from github');
            }
            // console.log(timeElapsed);
        }
        return result;
    };
    var toggleChangeLog = function () {
        setShowChangeLog(!showChangeLog);
    };
    var formatDate = function (date) {
        var dateObj = new Date(date);
        var month = dateObj.toLocaleString('default', { month: 'long' });
        var day = dateObj.toLocaleString('default', { day: 'numeric' });
        var year = dateObj.toLocaleString('default', { year: 'numeric' });
        return month + " " + day + ", " + year;
    };
    var processReleaseData = function (releaseData, trackingData, page) {
        var dataForCurrentUsedRelease = releaseData.find(function (release) {
            var _a, _b, _c;
            try {
                var text = release.body;
                var html = converter.makeHtml(text);
                var doc = new DOMParser().parseFromString(html, 'text/html');
                release.doc = doc;
                trackingData.releasesSinceInstalledVersion.push(release);
                var newFeaturesEl = doc.getElementById('newfeatures');
                var maintenanceEl = doc.getElementById('maintenance');
                var bugfixesEl = doc.getElementById('bugfixes');
                var newFeaturesCount = (_a = newFeaturesEl === null || newFeaturesEl === void 0 ? void 0 : newFeaturesEl.nextElementSibling) === null || _a === void 0 ? void 0 : _a.children.length;
                var maintenanceCount = (_b = maintenanceEl === null || maintenanceEl === void 0 ? void 0 : maintenanceEl.nextElementSibling) === null || _b === void 0 ? void 0 : _b.children.length;
                var bugfixesCount = (_c = bugfixesEl === null || bugfixesEl === void 0 ? void 0 : bugfixesEl.nextElementSibling) === null || _c === void 0 ? void 0 : _c.children.length;
                if (newFeaturesCount) {
                    trackingData.totalNewFeaturesCount = trackingData.totalNewFeaturesCount + newFeaturesCount;
                }
                if (maintenanceCount) {
                    trackingData.totalMaintenanceCount = trackingData.totalMaintenanceCount + maintenanceCount;
                }
                if (bugfixesCount) {
                    trackingData.totalBugfixesCount = trackingData.totalBugfixesCount + bugfixesCount;
                }
                return "v" + release.tag_name === prebid.version;
            }
            catch (e) {
                return "v" + release.tag_name === e.message;
            }
        });
        if (dataForCurrentUsedRelease) {
            var oldVersionPublishedAtDate = dataForCurrentUsedRelease.published_at;
            var currentDate = new Date();
            var differenceInMilliseconds = Math.round(currentDate.valueOf() - Date.parse(oldVersionPublishedAtDate));
            trackingData.timeElapsed = msToTime(differenceInMilliseconds);
            var processedReleaseInfoObj = {
                latestVersion: trackingData.releasesSinceInstalledVersion[0].tag_name,
                latestVersionPublishedAt: trackingData.releasesSinceInstalledVersion[0].published_at,
                installedVersion: prebid.version,
                installedVersionPublishedAt: oldVersionPublishedAtDate,
                timeElapsedSinceLatestVersion: trackingData.timeElapsed,
                featureCountSinceInstalledVersion: trackingData.totalNewFeaturesCount,
                maintenanceCountSinceInstalledVersion: trackingData.totalMaintenanceCount,
                bugfixCountSinceInstalledVersion: trackingData.totalBugfixesCount,
                releasesSinceInstalledVersion: trackingData.releasesSinceInstalledVersion
            };
            setPrebidReleaseInfo(processedReleaseInfoObj);
            if (page) {
                // console.log('setting pbjsReleasesData in storage: ', trackingData.releasesSinceInstalledVersion);
                trackingData.releasesSinceInstalledVersion[0].cached_at = Date.now();
                chrome.storage.local.set({ pbjsReleasesData: JSON.stringify(trackingData.releasesSinceInstalledVersion) });
            }
        }
        else {
            if (page && releaseData.length === 100) {
                fetchReleaseInfo(page + 1, trackingData);
            }
            else {
                if (!page) {
                    fetchReleaseInfo(1, {
                        totalNewFeaturesCount: 0,
                        totalMaintenanceCount: 0,
                        totalBugfixesCount: 0,
                        timeElapsed: { text: '', years: '', months: '', days: '', hours: '', minutes: '' },
                        releasesSinceInstalledVersion: []
                    });
                }
                else {
                    // console.log('Oops, something went wrong. No release data for the currently installed PBJS version was able to be found.');
                }
            }
        }
    };
    var fetchReleaseInfo = function (page, trackingData) { return __awaiter(void 0, void 0, void 0, function () {
        var response, message, releaseData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://api.github.com/repos/prebid/Prebid.js/releases?per_page=100&page=" + page + "&owner=prebid&repo=Prebid.js")];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        message = "An error has occured: " + response.status;
                        throw new Error(message);
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    releaseData = _a.sent();
                    processReleaseData(releaseData, trackingData, page);
                    return [2 /*return*/];
            }
        });
    }); };
    if (prebid && prebid.version && Object.keys(prebidReleaseInfo).length === 0) {
        try {
            var dataToTrackOverIterations_1 = {
                totalNewFeaturesCount: 0,
                totalMaintenanceCount: 0,
                totalBugfixesCount: 0,
                timeElapsed: { text: '', years: '', months: '', days: '', hours: '', minutes: '' },
                releasesSinceInstalledVersion: []
            };
            chrome.storage.local.get('pbjsReleasesData', function (result) {
                if (result.pbjsReleasesData && !isCachedReleaseDataExpired(result.pbjsReleasesData)) {
                    // console.log('using pbjsReleasesData from storage: ', result);
                    processReleaseData(JSON.parse(result.pbjsReleasesData), dataToTrackOverIterations_1, 0);
                }
                else {
                    // console.log('calling the github api for pbjsReleasesData ');
                    fetchReleaseInfo(1, dataToTrackOverIterations_1);
                }
            });
        }
        catch (error) {
            console.error('Failed to fetch data for PBJS releases: ', error);
        }
    }
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        close && (react_1["default"].createElement(Grid_1["default"], { size: { xs: 12 }, sx: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                color: 'text.secondary'
            } },
            react_1["default"].createElement(IconButton_1["default"], { sx: { p: 0 }, onClick: function () { return close(); } },
                react_1["default"].createElement(Close_1["default"], { sx: { fontSize: 14 } })))),
        react_1["default"].createElement(Grid_1["default"], { size: { xs: 7 }, className: "version-info__body" }, Object.keys(prebidReleaseInfo).length > 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { className: "title__wrapper" },
                react_1["default"].createElement("div", { className: "sub-title-main__wrapper" }, "v" + prebidReleaseInfo.latestVersion === prebidReleaseInfo.installedVersion ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(CheckCircleOutline_1["default"], { color: "primary" }),
                    react_1["default"].createElement("h4", null, "You are using the latest version of Prebid.js!"))) : (react_1["default"].createElement(WarningAmberOutlined_1["default"], { color: "secondary" }))),
                react_1["default"].createElement("div", { className: "sub-title__wrapper" },
                    react_1["default"].createElement("p", null,
                        react_1["default"].createElement("strong", null, "Latest PBJS Version:"),
                        " v",
                        prebidReleaseInfo.latestVersion,
                        " - ",
                        react_1["default"].createElement("em", null,
                            "(",
                            formatDate(prebidReleaseInfo.latestVersionPublishedAt),
                            ")")),
                    react_1["default"].createElement("p", null,
                        react_1["default"].createElement("strong", null, "Installed PBJS Version:"),
                        " ",
                        prebidReleaseInfo.installedVersion,
                        " - ",
                        react_1["default"].createElement("em", null,
                            "(",
                            formatDate(prebidReleaseInfo.installedVersionPublishedAt),
                            ")")))),
            react_1["default"].createElement("div", { className: "content__wrapper" }, "v" + prebidReleaseInfo.latestVersion === prebidReleaseInfo.installedVersion ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("p", null,
                    react_1["default"].createElement("strong", null, "Details:"),
                    " For more information about Prebid.js releases, please visit the following link:",
                    ' ',
                    react_1["default"].createElement("a", { style: { color: '#ff6f00' }, href: "https://github.com/prebid/Prebid.js/releases", target: "_blank", rel: "noreferrer" }, "https://github.com/prebid/Prebid.js/releases")))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("p", null,
                    react_1["default"].createElement("strong", null, "Details:"),
                    " ",
                    prebidReleaseInfo.installedVersion,
                    " was released ",
                    moment_1["default"](prebidReleaseInfo.installedVersionPublishedAt).fromNow(),
                    ". Approximately, the following number of updates have been pushed since it's release:"),
                react_1["default"].createElement("ul", { className: "updates__wrapper" },
                    react_1["default"].createElement("li", null,
                        react_1["default"].createElement("strong", null, "New Features:"),
                        " ",
                        prebidReleaseInfo.featureCountSinceInstalledVersion),
                    react_1["default"].createElement("li", null,
                        react_1["default"].createElement("strong", null, "Maintenance Updates:"),
                        " ",
                        prebidReleaseInfo.maintenanceCountSinceInstalledVersion),
                    react_1["default"].createElement("li", null,
                        react_1["default"].createElement("strong", null, "Bug Fixes:"),
                        " ",
                        prebidReleaseInfo.bugfixCountSinceInstalledVersion)),
                react_1["default"].createElement("p", { className: "changelog__link", onClick: toggleChangeLog },
                    "View Full Release Changelog Since ",
                    prebidReleaseInfo.installedVersion)))),
            showChangeLog &&
                prebidReleaseInfo.releasesSinceInstalledVersion.map(function (version) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("hr", null),
                    react_1["default"].createElement("p", null,
                        react_1["default"].createElement("strong", null, "Name:"),
                        " ",
                        version.name),
                    react_1["default"].createElement("p", null,
                        react_1["default"].createElement("strong", null, "Published:"),
                        " ",
                        formatDate(version.published_at)),
                    react_1["default"].createElement("p", null,
                        react_1["default"].createElement("strong", null, "URL:"),
                        ' ',
                        react_1["default"].createElement("a", { style: { color: '#ff6f00' }, href: version.html_url, target: "_blank", rel: "noreferrer" }, version.html_url)),
                    react_1["default"].createElement("p", null,
                        react_1["default"].createElement("strong", null, "Description:"),
                        " ",
                        html_react_parser_1["default"](version.doc.body.innerHTML)))); }))) : (react_1["default"].createElement("div", { className: "pbjs-version-info__loader-wrapper" },
            react_1["default"].createElement("p", null, "Attempting to fetch data about PBJS releases.."),
            react_1["default"].createElement("div", { className: "loader" },
                react_1["default"].createElement(react_loader_spinner_1.Bars, { height: "80", width: "50", color: "#ff6f00", ariaLabel: "bars-loading", wrapperStyle: {}, wrapperClass: "", visible: true })))))));
};
exports["default"] = PbjsVersionInfoContent;
