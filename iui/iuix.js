(function() {
    var _1 = 20;
    var _2 = 0;
    var _3 = null;
    var _4 = null;
    var _5 = 0;
    var _6 = location.hash;
    var _7 = "#_";
    var _8 = [];
    var _9 = 0;
    var _a;
    var _b = false;
    var _c = "portrait";
    var _d = "landscape";
    window.iui = {
        showPage: function(_e, _f) {
            if (_e) {
                if (_4) {
                    _4.removeAttribute("selected");
                    _4 = null;
                }
                if (hasClass(_e, "dialog")) {
                    showDialog(_e);
                } else {
                    var _10 = _3;
                    _3 = _e;
                    if (_10) {
                        setTimeout(slidePages, 0, _10, _e, _f);
                    } else {
                        updatePage(_e, _10);
                    }
                }
            }
        },
        showPageById: function(_11) {
            var _12 = $(_11);
            if (_12) {
                var _13 = _8.indexOf(_11);
                var _14 = _13 != -1;
                if (_14) {
                    _8.splice(_13, _8.length);
                }
                iui.showPage(_12, _14);
            }
        },
        showPageByHref: function(_15, _16, _17, _18, cb) {
            var req = new XMLHttpRequest();
            req.onerror = function() {
                if (cb) {
                    cb(false);
                }
            };
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if (_18) {
                        replaceElementWithSource(_18, req.responseText);
                    } else {
                        var _1b = document.createElement("div");
                        _1b.innerHTML = req.responseText;
                        iui.insertPages(_1b.childNodes);
                    }
                    if (cb) {
                        setTimeout(cb, 1000, true);
                    }
                }
            };
            if (_16) {
                req.open(_17 || "GET", _15, true);
                req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                req.setRequestHeader("Content-Length", _16.length);
                req.send(_16.join("&"));
            } else {
                req.open(_17 || "GET", _15, true);
                req.send(null);
            }
        },
        insertPages: function(_1c) {
            var _1d;
            for (var i = 0; i < _1c.length; ++i) {
                var _1f = _1c[i];
                if (_1f.nodeType == 1) {
                    if (!_1f.id) {
                        _1f.id = "__" + (++_9) + "__";
                    }
                    var _20 = $(_1f.id);
                    if (_20) {
                        _20.parentNode.replaceChild(_1f, _20);
                    } else {
                        document.body.appendChild(_1f);
                    }
                    if (_1f.getAttribute("selected") == "true" || !_1d) {
                        _1d = _1f;
                    }--i;
                }
            }
            if (_1d) {
                iui.showPage(_1d);
            }
        },
        getSelectedPage: function() {
            for (var _21 = document.body.firstChild; _21; _21 = _21.nextSibling) {
                if (_21.nodeType == 1 && _21.getAttribute("selected") == "true") {
                    return _21;
                }
            }
        },
        isNativeUrl: function(_22) {
            for (var i = 0; i < iui.nativeUrlPatterns.length; i++) {
                if (_22.match(iui.nativeUrlPatterns[i])) {
                    return true;
                }
            }
            return false;
        },
        nativeUrlPatterns: [new RegExp("^http://maps.google.com/maps?"), new RegExp("^mailto:"), new RegExp("^tel:"), new RegExp("^http://www.youtube.com/watch\\?v="), new RegExp("^http://www.youtube.com/v/")]
    };
    addEventListener("load", function(_24) {
        var _25 = iui.getSelectedPage();
        if (_25) {
            iui.showPage(_25);
        }
        setTimeout(preloadImages, 0);
        setTimeout(checkOrientAndLocation, 0);
        _a = setInterval(checkOrientAndLocation, 300);
    }, false);
    addEventListener("unload", function(_26) {
        return;
    }, false);
    addEventListener("click", function(_27) {
        var _28 = findParent(_27.target, "a");
        if (_28) {
            function unselect() {
                _28.removeAttribute("selected");
            }
            if (_28.href && _28.hash && _28.hash != "#") {
                _28.setAttribute("selected", "true");
                iui.showPage($(_28.hash.substr(1)));
                setTimeout(unselect, 500);
            } else {
                if (_28 == $("backButton")) {
                    history.back();
                } else {
                    if (_28.getAttribute("type") == "submit") {
                        submitForm(findParent(_28, "form"));
                    } else {
                        if (_28.getAttribute("type") == "cancel") {
                            cancelDialog(findParent(_28, "form"));
                        } else {
                            if (_28.target == "_replace") {
                                _28.setAttribute("selected", "progress");
                                iui.showPageByHref(_28.href, null, null, _28, unselect);
                            } else {
                                if (iui.isNativeUrl(_28.href)) {
                                    return;
                                } else {
                                    if (!_28.target) {
                                        _28.setAttribute("selected", "progress");
                                        iui.showPageByHref(_28.href, null, null, null, unselect);
                                    } else {
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            _27.preventDefault();
        }
    }, true);
    addEventListener("click", function(_29) {
        var div = findParent(_29.target, "div");
        if (div && hasClass(div, "toggle")) {
            div.setAttribute("toggled", div.getAttribute("toggled") != "true");
            _29.preventDefault();
        }
    }, true);

    function orientChangeHandler() {
        var _2b = window.orientation;
        switch (_2b) {
            case 0:
                setOrientation(_c);
                break;
            case 90:
            case -90:
                setOrientation(_d);
                break;
        }
    }
    if (typeof window.onorientationchange == "object") {
        window.onorientationchange = orientChangeHandler;
        _b = true;
        setTimeout(orientChangeHandler, 0);
    }

    function checkOrientAndLocation() {
        if (!_b) {
            if (window.innerWidth != _5) {
                _5 = window.innerWidth;
                var _2c = _5 == 320 ? _c : _d;
                setOrientation(_2c);
            }
        }
        if (location.hash != _6) {
            var _2d = location.hash.substr(_7.length);
            iui.showPageById(_2d);
        }
    }

    function setOrientation(_2e) {
        document.body.setAttribute("orient", _2e);
        setTimeout(scrollTo, 100, 0, 1);
    }

    function showDialog(_2f) {
        _4 = _2f;
        _2f.setAttribute("selected", "true");
        if (hasClass(_2f, "dialog") && !_2f.target) {
            showForm(_2f);
        }
    }

    function showForm(_30) {
        _30.onsubmit = function(_31) {
            _31.preventDefault();
            submitForm(_30);
        };
        _30.onclick = function(_32) {
            if (_32.target == _30 && hasClass(_30, "dialog")) {
                cancelDialog(_30);
            }
        };
    }

    function cancelDialog(_33) {
        _33.removeAttribute("selected");
    }

    function updatePage(_34, _35) {
        if (!_34.id) {
            _34.id = "__" + (++_9) + "__";
        }
        //location.href = _6 = _7 + _34.id;
        _8.push(_34.id);
        var _36 = $("pageTitle");
        if (_34.title) {
            _36.innerHTML = _34.title;
        }
        if (_34.localName.toLowerCase() == "form" && !_34.target) {
            showForm(_34);
        }
        var _37 = $("backButton");
        if (_37) {
            var _38 = $(_8[_8.length - 2]);
            if (_38 && !_34.getAttribute("hideBackButton")) {
                _37.style.display = "inline";
                _37.innerHTML = _38.title ? _38.title : "Back";
            } else {
                _37.style.display = "none";
            }
        }
    }

    function slidePages(_39, _3a, _3b) {
        var _3c = (_3b ? _39 : _3a).getAttribute("axis");
        if (_3c == "y") {
            (_3b ? _39 : _3a).style.top = "100%";
        } else {
            _3a.style.left = "100%";
        }
        _3a.setAttribute("selected", "true");
        scrollTo(0, 1);
        clearInterval(_a);
        var _3d = 100;
        slide();
        var _3e = setInterval(slide, _2);

        function slide() {
            _3d -= _1;
            if (_3d <= 0) {
                _3d = 0;
                if (!hasClass(_3a, "dialog")) {
                    _39.removeAttribute("selected");
                }
                clearInterval(_3e);
                _a = setInterval(checkOrientAndLocation, 300);
                setTimeout(updatePage, 0, _3a, _39);
            }
            if (_3c == "y") {
                _3b ? _39.style.top = (100 - _3d) + "%" : _3a.style.top = _3d + "%";
            } else {
                _39.style.left = (_3b ? (100 - _3d) : (_3d - 100)) + "%";
                _3a.style.left = (_3b ? -_3d : _3d) + "%";
            }
        }
    }

    function preloadImages() {
        var _3f = document.createElement("div");
        _3f.id = "preloader";
        document.body.appendChild(_3f);
    }

    function submitForm(_40) {
        iui.showPageByHref(_40.action || "POST", encodeForm(_40), _40.method);
    }

    function encodeForm(_41) {
        function encode(_42) {
            for (var i = 0; i < _42.length; ++i) {
                if (_42[i].name) {
                    args.push(_42[i].name + "=" + escape(_42[i].value));
                }
            }
        }
        var _44 = [];
        encode(_41.getElementsByTagName("input"));
        encode(_41.getElementsByTagName("textarea"));
        encode(_41.getElementsByTagName("select"));
        return _44;
    }

    function findParent(_45, _46) {
        while (_45 && (_45.nodeType != 1 || _45.localName.toLowerCase() != _46)) {
            _45 = _45.parentNode;
        }
        return _45;
    }

    function hasClass(_47, _48) {
        var re = new RegExp("(^|\\s)" + _48 + "($|\\s)");
        return re.exec(_47.getAttribute("class")) != null;
    }

    function replaceElementWithSource(_4a, _4b) {
        var _4c = _4a.parentNode;
        var _4d = _4a;
        while (_4c.parentNode != document.body) {
            _4c = _4c.parentNode;
            _4d = _4d.parentNode;
        }
        var _4e = document.createElement(_4d.localName);
        _4e.innerHTML = _4b;
        _4c.removeChild(_4d);
        while (_4e.firstChild) {
            _4c.appendChild(_4e.firstChild);
        }
    }

    function $(id) {
        return document.getElementById(id);
    }

    function ddd() {
        console.log.apply(console, arguments);
    }
})();