;(function(scope) {
    function Anykey(options) {
        "use strict";

        options = options || {};
        options.tabSize = options.tabSize || 4;
        options.syntax = options.syntax || 'nohighlight';

        if (typeof options.spellcheck === "undefined") {
            options.spellcheck = false;
        }

        options.tab = options.usingSpaces ? new Array(options.tabSize + 1).join(' ') : "\t";

        options.mount.innerHTML = (
            '<div class="anykey' + (options.theme === "dark" ? ' anykey--theme-dark' : '') + '">' +
                '<div class="anykey__lines"></div>' +
                '<div class="anykey__lines-overlay"></div>' +
                '<div class="anykey__wrap">' +
                    '<textarea class="anykey__textarea"></textarea>' +
                    '<pre class="anykey__pre">' +
                        '<code class="anykey__code hljs"></code>' +
                    '</pre>' +
                '</div>' +
                '<div class="anykey__code-status">' +
                    '<div class="anykey__size"></div>' +
                    '<div class="anykey__position"></div>' +
                    '<div class="anykey__syntax">' + options.syntax + '</div>' +
                '</div>' +
            '</div>'
        );

        var api = {
            scroll: function() {
                codeView.scrollTop = this.scrollTop;
                codeView.scrollLeft = this.scrollLeft;
                codeLines.scrollTop = this.scrollTop;
            },
            keyup: function (e) {
                codeView.innerText = this.value + '\n';
                hljs.highlightBlock(codeView);
                api.buildLines();
                api.highlightLine();
                api.calcSize();

                var keyCode = e.keyCode || e.which;
                if (keyCode == 13) {
                    api.scroll.call(this);
                }
            },
            keydown: function (e) {
                var keyCode = e.keyCode || e.which;

                if (keyCode === 9) {
                    e.preventDefault();

                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    this.value = (
                        this.value.substring(0, start)
                        + options.tab
                        + this.value.substring(end)
                    );

                    this.selectionStart = this.selectionEnd = start + options.tab.length;
                }
            },
            buildLines: function () {
                var lines = codeEditor.value.split(end).length;

                var num = '';
                for (var i = 1; i <= lines; i++) {
                    num += '<div class="anykey__lines-item" data-code-line="' + i + '">' + i +'</div>';
                }

                codeLines.innerHTML = num;
            },
            getCurrentPos: function () {
                var pos = 0;

                if (codeEditor.selectionStart) {
                    pos = codeEditor.selectionStart;
                } else if (document.selection) {
                    codeEditor.focus();

                    var r = document.selection.createRange();
                    if (r === null) {
                        pos = 0;
                    }

                    var re = codeEditor.createTextRange(),
                        rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);

                    pos = rc.text.length;
                }

                var range = codeEditor.value.substr(0,pos);
                var line = range.split(end).length;
                var column = pos - range.lastIndexOf(end);

                return {
                    line: line,
                    column: column
                };
            },
            highlightLine: function(position){
                var pos = position || this.getCurrentPos();

                codePosition.innerText = 'Line ' + pos.line + ' Column ' + pos.column;

                var cursor = codeLines.querySelector('.anykey__cursor');
                if (cursor) {
                    cursor.classList.remove('anykey__cursor');
                }

                cursor = codeLines.querySelector('.anykey__lines-item[data-code-line="' + pos.line + '"]');
                if (cursor) {
                    cursor.classList.add('anykey__cursor');
                } else {
                    this.highlightLine({line: 1, column: 1});
                }
            },
            refresh: function () {
                api.keyup.call(codeEditor, {keyCode: -1});
            },
            calcSize: function () {
                codeSize.innerText = 'Len ' + codeEditor.value.length;
            }
        };

        var end = "\n";

        var codeEditor = options.mount.querySelector('.anykey__textarea');
        var codeView = options.mount.querySelector('.anykey__code');
        var codeLines = options.mount.querySelector('.anykey__lines');
        var codeSize = options.mount.querySelector('.anykey__size');
        var codePosition = options.mount.querySelector('.anykey__position');

        codeEditor.spellcheck = options.spellcheck;

        codeEditor.style.tabSize = options.tabSize;
        codeView.style.tabSize = options.tabSize;
        codeEditor.style['-moz-tab-size'] = options.tabSize;
        codeView.style['-moz-tab-size'] = options.tabSize;

        if (options.syntax) {
            codeView.classList.add(options.syntax);
        }

        codeEditor.addEventListener('keydown', api.keydown);
        codeEditor.addEventListener('keyup', api.keyup);
        codeEditor.addEventListener('paste', api.keydown);
        codeEditor.addEventListener('scroll', api.scroll);
        codeEditor.addEventListener('click', function(){
            api.highlightLine();
        });

        api.keyup.call(codeEditor, {keyCode: -1});
        api.refresh();

        Anykey.prototype.gotoLine = function (line) {
            api.highlightLine({line: line, column: 1});
            codeEditor.scrollTop = (line * parseInt(window.getComputedStyle(codeEditor).lineHeight)) - (codeEditor.offsetHeight / 2);
        };

        Anykey.prototype.highlightErrorLine = function (line) {
            var error = codeLines.querySelector('.anykey__error-line');

            if (error) {
                error.classList.remove('anykey__error-line');
            }

            if (!line) {
                return;
            }

            this.gotoLine(line);

            error = codeLines.querySelector('.anykey__lines-item[data-code-line="' + line + '"]');

            if (error) {
                error.classList.add('anykey__error-line');
            }
        };

        Anykey.prototype.clearErrorLine = function () {
            this.highlightErrorLine(0);
        };

        Anykey.prototype.setValue = function (value) {
            codeEditor.value = value;
            api.refresh();
        };

        Anykey.prototype.getValue = function () {
            return codeEditor.value;
        };

        Anykey.prototype.readonly = function (flag) {
            if (flag) {
                codeEditor.setAttribute("readonly", flag);
            } else {
                codeEditor.removeAttribute("readonly");
            }
        };

        Anykey.prototype.getEditor = function () {
            return codeEditor;
        };
    }

    if (typeof module != "undefined" && typeof module.exports != "undefined") {
        module.exports = Anykey;
    } else if (typeof define != "undefined" && typeof define.amd != "undefined") {
        define([], function() {
            return Anykey;
        });
    } else {
        scope.Anykey = Anykey;
    }
}(this));