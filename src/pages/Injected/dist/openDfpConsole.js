// @ts-ignore
// eslint-disable-next-line no-native-reassign
googletag = googletag || {};
if (!Array.isArray(this.googletag.cmd)) {
    this.googletag.cmd = [];
}
googletag.cmd.push(function () { return googletag.openConsole(); });
