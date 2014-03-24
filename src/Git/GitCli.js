/*
    This module is used to communicate with Git through Cli
    Output string from Git should always be parsed here
    to provide more sensible outputs than just plain strings.
    Format of the output should be specified in Git.js
*/
define(function (require, exports) {

    // Brackets modules
    var _ = brackets.getModule("thirdparty/lodash");

    // Local modules
    var Cli         = require("src/Cli"),
        Preferences = require("src/Preferences");

    // Module variables
    var _gitPath = null;

    // Implementation
    function getGitPath() {
        return _gitPath || (Preferences.get("gitIsInSystemPath") ? "git" : Preferences.get("gitPath"));
    }

    function git(args) {
        return Cli.spawnCommand(getGitPath(), args);
    }

    function getRemotes() {
        var args = ["remote", "-v"];
        return git(args)
            .then(function (stdout) {
                return !stdout ? [] : _.uniq(stdout.replace(/\((push|fetch)\)/g, "").split("\n")).map(function (l) {
                    var s = l.trim().split("\t");
                    return {
                        name: s[0],
                        url: s[1]
                    };
                });
            });
    }

    // Public API
    exports.getRemotes = getRemotes;

});
