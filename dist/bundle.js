/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _rebelRouter = __webpack_require__(1);

	var _home = __webpack_require__(2);

	var _resourceList = __webpack_require__(3);

	var _people = __webpack_require__(4);

	var _starships = __webpack_require__(6);

	var _vehicles = __webpack_require__(7);

	var _species = __webpack_require__(8);

	var _planets = __webpack_require__(9);

	var _info = __webpack_require__(10);

	var _rebelRepeater = __webpack_require__(11);

	var _rebelLoading = __webpack_require__(12);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Created by Leon Revill on 15/12/2015.
	 * Blog: blog.revillweb.com
	 * GitHub: https://github.com/RevillWeb
	 * Twitter: @RevillWeb
	 */

	/**
	 * The main router class and entry point to the router.
	 */
	var RebelRouter = exports.RebelRouter = function (_HTMLElement) {
	    _inherits(RebelRouter, _HTMLElement);

	    function RebelRouter() {
	        _classCallCheck(this, RebelRouter);

	        return _possibleConstructorReturn(this, (RebelRouter.__proto__ || Object.getPrototypeOf(RebelRouter)).apply(this, arguments));
	    }

	    _createClass(RebelRouter, [{
	        key: "connectedCallback",


	        /**
	         * Main initialisation point of rebel-router
	         * @param prefix - If extending rebel-router you can specify a prefix when calling createdCallback in case your elements need to be named differently
	         */
	        value: function connectedCallback() {
	            var _this2 = this;

	            var _prefix = "rebel";

	            this.previousPath = null;
	            this.basePath = null;

	            //Get options
	            this.options = {
	                "animation": this.getAttribute("animation") == "true",
	                "shadowRoot": this.getAttribute("shadow") == "true",
	                "inherit": this.getAttribute("inherit") != "false"
	            };

	            //Get routes
	            if (this.options.inherit === true) {
	                //If this is a nested router then we need to go and get the parent path
	                var $element = this;
	                while ($element.parentNode) {
	                    $element = $element.parentNode;
	                    if ($element.nodeName.toLowerCase() == _prefix + "-router") {
	                        var current = $element.current();
	                        this.basePath = current.route;
	                        break;
	                    }
	                }
	            }
	            this.routes = {};
	            var $children = this.children;
	            for (var i = 0; i < $children.length; i++) {
	                var $child = $children[i];
	                var path = $child.getAttribute("path");
	                switch ($child.nodeName.toLowerCase()) {
	                    case _prefix + "-default":
	                        path = "*";
	                        break;
	                    case _prefix + "-route":
	                        path = this.basePath !== null ? this.basePath + path : path;
	                        break;
	                }
	                if (path !== null) {
	                    var $template = null;
	                    if ($child.innerHTML) {
	                        $template = "<" + _prefix + "-route>" + $child.innerHTML + "</" + _prefix + "-route>";
	                    }
	                    this.routes[path] = {
	                        "component": $child.getAttribute("component"),
	                        "template": $template
	                    };
	                }
	            }

	            //After we have collected all configuration clear innerHTML
	            this.innerHTML = "";

	            if (this.options.shadowRoot === true) {
	                this.createShadowRoot();
	                this.root = this.shadowRoot;
	            } else {
	                this.root = this;
	            }
	            if (this.options.animation === true) {
	                this.initAnimation();
	            }
	            this.render();
	            RebelRouter.pathChange(function (isBack) {
	                if (_this2.options.animation === true) {
	                    if (isBack === true) {
	                        _this2.classList.add("rbl-back");
	                    } else {
	                        _this2.classList.remove("rbl-back");
	                    }
	                }
	                _this2.render();
	            });
	        }

	        /**
	         * Function used to initialise the animation mechanics if animation is turned on
	         */

	    }, {
	        key: "initAnimation",
	        value: function initAnimation() {
	            var _this3 = this;

	            var observer = new MutationObserver(function (mutations) {
	                var node = mutations[0].addedNodes[0];
	                if (node !== undefined) {
	                    (function () {
	                        var otherChildren = _this3.getOtherChildren(node);
	                        node.classList.add("rebel-animate");
	                        node.classList.add("enter");
	                        setTimeout(function () {
	                            if (otherChildren.length > 0) {
	                                otherChildren.forEach(function (child) {
	                                    child.classList.add("exit");
	                                    setTimeout(function () {
	                                        child.classList.add("complete");
	                                    }, 10);
	                                });
	                            }
	                            setTimeout(function () {
	                                node.classList.add("complete");
	                            }, 10);
	                        }, 10);
	                        var animationEnd = function animationEnd(event) {
	                            if (event.target.className.indexOf("exit") > -1) {
	                                _this3.root.removeChild(event.target);
	                            }
	                        };
	                        node.addEventListener("transitionend", animationEnd);
	                        node.addEventListener("animationend", animationEnd);
	                    })();
	                }
	            });
	            observer.observe(this, { childList: true });
	        }

	        /**
	         * Method used to get the current route object
	         * @returns {*}
	         */

	    }, {
	        key: "current",
	        value: function current() {
	            var path = RebelRouter.getPathFromUrl();
	            for (var route in this.routes) {
	                if (route !== "*") {
	                    var regexString = "^" + route.replace(/{\w+}\/?/g, "(\\w+)\/?");
	                    regexString += regexString.indexOf("\\/?") > -1 ? "" : "\\/?" + "([?=&-\/\\w+]+)?$";
	                    var regex = new RegExp(regexString);
	                    if (regex.test(path)) {
	                        return _routeResult(this.routes[route], route, regex, path);
	                    }
	                }
	            }
	            return this.routes["*"] !== undefined ? _routeResult(this.routes["*"], "*", null, path) : null;
	        }

	        /**
	         * Method called to render the current view
	         */

	    }, {
	        key: "render",
	        value: function render() {
	            var result = this.current();
	            if (result !== null) {
	                if (result.path !== this.previousPath || this.options.animation === true) {
	                    if (this.options.animation !== true) {
	                        this.root.innerHTML = "";
	                    }
	                    if (result.component !== null) {
	                        var $component = document.createElement(result.component);
	                        for (var key in result.params) {
	                            var value = result.params[key];
	                            if (typeof value == "Object") {
	                                try {
	                                    value = JSON.parse(value);
	                                } catch (e) {
	                                    console.error("Couldn't parse param value:", e);
	                                }
	                            }
	                            $component.setAttribute(key, value);
	                        }
	                        this.root.appendChild($component);
	                    } else {
	                        var $template = result.template;
	                        //TODO: Find a faster alternative
	                        if ($template.indexOf("${") > -1) {
	                            $template = $template.replace(/\${([^{}]*)}/g, function (a, b) {
	                                var r = result.params[b];
	                                return typeof r === 'string' || typeof r === 'number' ? r : a;
	                            });
	                        }
	                        this.root.innerHTML = $template;
	                    }
	                    this.previousPath = result.path;
	                }
	            }
	        }

	        /**
	         *
	         * @param node - Used with the animation mechanics to get all other view children except itself
	         * @returns {Array}
	         */

	    }, {
	        key: "getOtherChildren",
	        value: function getOtherChildren(node) {
	            var children = this.root.children;
	            var results = [];
	            for (var i = 0; i < children.length; i++) {
	                var child = children[i];
	                if (child != node) {
	                    results.push(child);
	                }
	            }
	            return results;
	        }
	    }], [{
	        key: "parseQueryString",


	        /**
	         * Static helper method to parse the query string from a url into an object.
	         * @param url
	         * @returns {{}}
	         */
	        value: function parseQueryString(url) {
	            var result = {};
	            if (url !== undefined) {
	                var queryString = url.indexOf("?") > -1 ? url.substr(url.indexOf("?") + 1, url.length) : null;
	                if (queryString !== null) {
	                    queryString.split("&").forEach(function (part) {
	                        if (!part) return;
	                        part = part.replace("+", " ");
	                        var eq = part.indexOf("=");
	                        var key = eq > -1 ? part.substr(0, eq) : part;
	                        var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
	                        var from = key.indexOf("[");
	                        if (from == -1) result[decodeURIComponent(key)] = val;else {
	                            var to = key.indexOf("]");
	                            var index = decodeURIComponent(key.substring(from + 1, to));
	                            key = decodeURIComponent(key.substring(0, from));
	                            if (!result[key]) result[key] = [];
	                            if (!index) result[key].push(val);else result[key][index] = val;
	                        }
	                    });
	                }
	            }
	            return result;
	        }

	        /**
	         * Static helper method to convert a class name to a valid element name.
	         * @param Class
	         * @returns {string}
	         */

	    }, {
	        key: "classToTag",
	        value: function classToTag(Class) {
	            /**
	             * Class.name would be better but this isn't supported in IE 11.
	             */
	            try {
	                var name = Class.toString().match(/^function\s*([^\s(]+)/)[1].replace(/\W+/g, '-').replace(/([a-z\d])([A-Z0-9])/g, '$1-$2').toLowerCase();
	            } catch (e) {
	                throw new Error("Couldn't parse class name:", e);
	            }
	            if (RebelRouter.validElementTag(name) === false) {
	                throw new Error("Class name couldn't be translated to tag.");
	            }
	            return name;
	        }

	        /**
	         * Static helper method used to determine if an element with the specified name has already been registered.
	         * @param name
	         * @returns {boolean}
	         */

	    }, {
	        key: "isRegisteredElement",
	        value: function isRegisteredElement(name) {
	            return window.customElements.get(name) !== undefined;
	        }

	        /**
	         * Static helper method to take a web component class, create an element name and register the new element on the document.
	         * @param Class
	         * @returns {string}
	         */

	    }, {
	        key: "createElement",
	        value: function createElement(Class) {
	            var name = RebelRouter.classToTag(Class);
	            if (RebelRouter.isRegisteredElement(name) === false) {
	                Class.prototype.name = name;
	                window.customElements.define(name, Class);
	            }
	            return name;
	        }

	        /**
	         * Simple static helper method containing a regular expression to validate an element name
	         * @param tag
	         * @returns {boolean}
	         */

	    }, {
	        key: "validElementTag",
	        value: function validElementTag(tag) {
	            return (/^[a-z0-9\-]+$/.test(tag)
	            );
	        }

	        /**
	         * Method used to register a callback to be called when the URL path changes.
	         * @param callback
	         */

	    }, {
	        key: "pathChange",
	        value: function pathChange(callback) {
	            if (RebelRouter.changeCallbacks === undefined) {
	                RebelRouter.changeCallbacks = [];
	            }
	            RebelRouter.changeCallbacks.push(callback);
	            var changeHandler = function changeHandler() {
	                /**
	                 *  event.oldURL and event.newURL would be better here but this doesn't work in IE :(
	                 */
	                if (window.location.href != RebelRouter.oldURL) {
	                    RebelRouter.changeCallbacks.forEach(function (callback) {
	                        callback(RebelRouter.isBack);
	                    });
	                    RebelRouter.isBack = false;
	                }
	                RebelRouter.oldURL = window.location.href;
	            };
	            if (window.onhashchange === null) {
	                window.addEventListener("rblback", function () {
	                    RebelRouter.isBack = true;
	                });
	            }
	            window.onhashchange = changeHandler;
	        }

	        /**
	         * Static helper method used to get the parameters from the provided route.
	         * @param regex
	         * @param route
	         * @param path
	         * @returns {{}}
	         */

	    }, {
	        key: "getParamsFromUrl",
	        value: function getParamsFromUrl(regex, route, path) {
	            var result = RebelRouter.parseQueryString(path);
	            var re = /{(\w+)}/g;
	            var results = [];
	            var match = void 0;
	            while (match = re.exec(route)) {
	                results.push(match[1]);
	            }
	            if (regex !== null) {
	                var results2 = regex.exec(path);
	                results.forEach(function (item, idx) {
	                    result[item] = results2[idx + 1];
	                });
	            }
	            return result;
	        }

	        /**
	         * Static helper method used to get the path from the current URL.
	         * @returns {*}
	         */

	    }, {
	        key: "getPathFromUrl",
	        value: function getPathFromUrl() {
	            var result = window.location.href.match(/#(.*)$/);
	            if (result !== null) {
	                return result[1];
	            }
	        }
	    }]);

	    return RebelRouter;
	}(HTMLElement);

	window.customElements.define("rebel-router", RebelRouter);

	/**
	 * Class which represents the rebel-route custom element
	 */

	var RebelRoute = exports.RebelRoute = function (_HTMLElement2) {
	    _inherits(RebelRoute, _HTMLElement2);

	    function RebelRoute() {
	        _classCallCheck(this, RebelRoute);

	        return _possibleConstructorReturn(this, (RebelRoute.__proto__ || Object.getPrototypeOf(RebelRoute)).apply(this, arguments));
	    }

	    return RebelRoute;
	}(HTMLElement);

	window.customElements.define("rebel-route", RebelRoute);

	/**
	 * Class which represents the rebel-default custom element
	 */

	var RebelDefault = function (_HTMLElement3) {
	    _inherits(RebelDefault, _HTMLElement3);

	    function RebelDefault() {
	        _classCallCheck(this, RebelDefault);

	        return _possibleConstructorReturn(this, (RebelDefault.__proto__ || Object.getPrototypeOf(RebelDefault)).apply(this, arguments));
	    }

	    return RebelDefault;
	}(HTMLElement);

	window.customElements.define("rebel-default", RebelDefault);

	/**
	 * Represents the prototype for an anchor element which added functionality to perform a back transition.
	 */

	var RebelBackA = function (_HTMLAnchorElement) {
	    _inherits(RebelBackA, _HTMLAnchorElement);

	    function RebelBackA() {
	        _classCallCheck(this, RebelBackA);

	        return _possibleConstructorReturn(this, (RebelBackA.__proto__ || Object.getPrototypeOf(RebelBackA)).apply(this, arguments));
	    }

	    _createClass(RebelBackA, [{
	        key: "connectedCallback",
	        value: function connectedCallback() {
	            var _this7 = this;

	            this.addEventListener("click", function (event) {
	                var path = _this7.getAttribute("href");
	                event.preventDefault();
	                if (path !== undefined) {
	                    window.dispatchEvent(new CustomEvent('rblback'));
	                }
	                window.location.hash = path;
	            });
	        }
	    }]);

	    return RebelBackA;
	}(HTMLAnchorElement);
	/**
	 * Register the back button custom element
	 */


	window.customElements.define("rebel-back-a", RebelBackA, {
	    extends: "a"
	});

	/**
	 * Constructs a route object
	 * @param obj - the component name or the HTML template
	 * @param route
	 * @param regex
	 * @param path
	 * @returns {{}}
	 * @private
	 */
	function _routeResult(obj, route, regex, path) {
	    var result = {};
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            result[key] = obj[key];
	        }
	    }
	    result.route = route;
	    result.path = path;
	    result.params = RebelRouter.getParamsFromUrl(regex, route, path);
	    return result;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Created by Leon Revill on 07/03/16.
	 * Blog: http://www.revilweb.com
	 * GitHub: https://github.com/RevillWeb
	 * Twitter: @RevillWeb
	 */
	var HomePage = exports.HomePage = function (_HTMLElement) {
	    _inherits(HomePage, _HTMLElement);

	    function HomePage() {
	        _classCallCheck(this, HomePage);

	        return _possibleConstructorReturn(this, (HomePage.__proto__ || Object.getPrototypeOf(HomePage)).apply(this, arguments));
	    }

	    _createClass(HomePage, [{
	        key: "createdCallback",
	        value: function createdCallback() {
	            this.template = "<div class=\"home-container\">\n            <h2>REBEL ROUTER</h2>\n            <p>This simple demo application provides an example of Rebel Router in action, a router designed to make building ultra-modern web applications easy without the need for monolithic frameworks.</p>\n            <p>Simply make use of JavaScript modules and web components to easily write modular organised code that won't tie you in to a specific set of technologies.</p>\n            <h3>DEMO</h3>\n            <p>This demo makes use of the superb <a href=\"https://swapi.co/\" target=\"_blank\">Star Wars API</a> to provide a simple but real world use for the router. Navigate through the pages in the menu above and discover all kinds of things about the Star Wars universe you didn't know.</p>\n            <div class=\"controls\">\n                <a href=\"\" class=\"btn\"><span class=\"icon icon-github\"></span> Demo Source</a>\n                <a href=\"https://github.com/RevillWeb/rebel-router\" target=\"_blank\" class=\"btn\"><span class=\"icon icon-github\"></span> Rebel Router</a>\n            </div>\n        </div>";
	        }
	    }, {
	        key: "attachedCallback",
	        value: function attachedCallback() {
	            this.render();
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            this.innerHTML = this.template;
	        }
	    }]);

	    return HomePage;
	}(HTMLElement);

	window.customElements.define("home-page", HomePage);

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Created by Leon Revill on 07/03/16.
	 * Blog: http://www.revilweb.com
	 * GitHub: https://github.com/RevillWeb
	 * Twitter: @RevillWeb
	 */
	var ResourcesList = exports.ResourcesList = function (_HTMLElement) {
	    _inherits(ResourcesList, _HTMLElement);

	    function ResourcesList() {
	        _classCallCheck(this, ResourcesList);

	        return _possibleConstructorReturn(this, (ResourcesList.__proto__ || Object.getPrototypeOf(ResourcesList)).apply(this, arguments));
	    }

	    _createClass(ResourcesList, [{
	        key: 'createdCallback',
	        value: function createdCallback() {
	            var _this2 = this;

	            this.baseUrl = "http://swapi.co/api/";
	            this.type = null;
	            this.page = 1;
	            this.response = null;
	            this.innerHTML = '\n            <rebel-loading id="loading" color="#ff6" background-color="#000"></rebel-loading>\n            <h1 id="title"></h1>\n            <ul class="resource-list">\n                <rebel-repeater id="list-row"></rebel-repeater>\n            </ul>\n            <div class="list-controls">\n                <button class="btn" id="previous"><span class="icon icon-arrow-left2"></span> Preview</button>\n                <div class="num" id="page-num">1</div>\n                <button class="btn" id="next">Next <span class="icon icon-arrow-right2"></span></button>\n            </div>\n        ';
	            this.$loader = this.querySelector('#loading');
	            this.$next = this.querySelector('#next');
	            this.$next.addEventListener("click", function () {
	                if (_this2.response.next !== null) {
	                    _this2.getData(ResourcesList.getPageNumber(_this2.response.next));
	                }
	            });
	            this.$previous = this.querySelector('#previous');
	            this.$previous.addEventListener("click", function () {
	                if (_this2.response.previous !== null) {
	                    _this2.getData(ResourcesList.getPageNumber(_this2.response.previous));
	                }
	            });
	            this.$pageNum = this.querySelector('#page-num');
	        }
	    }, {
	        key: 'attachedCallback',
	        value: function attachedCallback() {
	            var _this3 = this;

	            this.querySelector(".resource-list").addEventListener("click", function (event) {
	                var url = event.target.dataset.url;
	                if (url.substr(-1) === '/') {
	                    url = url.substr(0, url.length - 1);
	                }
	                var parts = url.split("/");
	                var id = parts[parts.length - 1];
	                window.location.hash = "/resource/" + _this3.type + "/" + id;
	            });
	            this.getData();
	        }
	    }, {
	        key: 'attributeChangedCallback',
	        value: function attributeChangedCallback(name) {
	            switch (name) {
	                case "resource":
	                    this.type = this.getAttribute("resource");
	                    this.getData();
	                    break;
	            }
	        }
	    }, {
	        key: 'getTypeIcon',
	        value: function getTypeIcon() {
	            switch (this.type) {
	                case "people":
	                    return "icon-user5";
	                    break;
	                case "starships":
	                    return "icon-rocket";
	                    break;
	                case "vehicles":
	                    return "icon-truck";
	                    break;
	                case "species":
	                    return "icon-eye";
	                    break;
	                case "planets":
	                    return "icon-planet2";
	                    break;
	                default:
	                    return "";
	            }
	        }
	    }, {
	        key: 'getData',
	        value: function getData(page) {
	            var _this4 = this;

	            if (this.type !== null) {
	                var $title = this.querySelector("#title");
	                $title.innerHTML = "<span class='icon " + this.getTypeIcon() + "'></span>" + this.type.charAt(0).toUpperCase() + this.type.slice(1);
	                var xhr = new XMLHttpRequest();
	                this.$loader.show();
	                xhr.onreadystatechange = function () {
	                    if (xhr.readyState == 4 && xhr.status == 200) {
	                        try {
	                            _this4.response = JSON.parse(xhr.response);
	                            _this4.render();
	                        } catch (e) {
	                            console.error("Couldn't parse API response:", e);
	                        }
	                    }
	                };
	                if (page !== undefined) {
	                    this.page = page;
	                }
	                xhr.open("GET", this.baseUrl + this.type + "?page=" + this.page);
	                xhr.send();
	            }
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var $list = this.querySelector("#list-row");
	            if ($list !== null) {
	                $list.setTemplate('<li><a href="javascript:void(0)" class="resource-click" data-url="${url}">${name}</a></li>');
	                this.$next.className = this.$next.className.replace(" disabled", "");
	                if (this.response.next === null) {
	                    this.$next.className += " disabled";
	                }
	                this.$previous.className = this.$previous.className.replace(" disabled", "");
	                if (this.response.previous === null) {
	                    this.$previous.className += " disabled";
	                }
	                $list.setContent(this.response.results);
	                this.$pageNum.innerHTML = this.page;
	                this.$loader.hide();
	            }
	        }
	    }], [{
	        key: 'getPageNumber',
	        value: function getPageNumber(url) {
	            return url.split("?")[1].split("=")[1];
	        }
	    }]);

	    return ResourcesList;
	}(HTMLElement);

	window.customElements.define("resources-list", ResourcesList);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PeopleResource = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _resourceItem = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Leon Revill on 07/03/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Blog: http://www.revilweb.com
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * GitHub: https://github.com/RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Twitter: @RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var PeopleResource = exports.PeopleResource = function (_ResourceItem) {
	    _inherits(PeopleResource, _ResourceItem);

	    function PeopleResource() {
	        _classCallCheck(this, PeopleResource);

	        return _possibleConstructorReturn(this, (PeopleResource.__proto__ || Object.getPrototypeOf(PeopleResource)).apply(this, arguments));
	    }

	    _createClass(PeopleResource, [{
	        key: "createdCallback",
	        value: function createdCallback() {
	            this.init("people");
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var genderIcon = "transgender-alt";
	            if (this.data.gender == "male") {
	                genderIcon = "male";
	            } else if (this.data.gender == "female") {
	                genderIcon = "female";
	            }
	            this.$stats.innerHTML = "\n            <div class=\"stats-section\">\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-" + genderIcon + "\"></span></label> <span>" + this.data.gender + "</span></p>\n                </div>\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-calendar5\"></span></label> " + this.data.birth_year + "</p>\n                </div>\n            </div>\n            <div class=\"stats-section\">\n                <div class=\"section build\">\n                    <p><label>Height:</label> " + this.data.height + "</p>\n                    <span class=\"icon icon-man\"></span>\n                    <p><label>Mass:</label> " + this.data.mass + "</p>\n                </div>\n                <div class=\"section\">\n                    <p><label>Eye Colour:</label> " + this.data.eye_color + "</p>\n                    <p><label>Hair Colour:</label> " + this.data.hair_color + "</p>\n                    <p><label>Skin Colour:</label> " + this.data.skin_color + "</p>\n                </div>\n            </div>";
	        }
	    }]);

	    return PeopleResource;
	}(_resourceItem.ResourceItem);

	window.customElements.define("people-resource", PeopleResource);

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Created by Leon Revill on 07/03/16.
	 * Blog: http://www.revilweb.com
	 * GitHub: https://github.com/RevillWeb
	 * Twitter: @RevillWeb
	 */
	var ResourceItem = exports.ResourceItem = function (_HTMLElement) {
	    _inherits(ResourceItem, _HTMLElement);

	    function ResourceItem() {
	        _classCallCheck(this, ResourceItem);

	        return _possibleConstructorReturn(this, (ResourceItem.__proto__ || Object.getPrototypeOf(ResourceItem)).apply(this, arguments));
	    }

	    _createClass(ResourceItem, [{
	        key: 'init',
	        value: function init(type) {
	            this.baseUrl = "http://swapi.co/api/";
	            this.id = null;
	            this.type = type;
	            this.data = {};
	            this.innerHTML = '\n            <rebel-loading id="loading" color="#ff6" background-color="#000"></rebel-loading>\n            <a href="#" id="back-btn" is="rebel-back-a"><span class="icon icon-arrow-left2"></span> Back</a>\n            <h1 id="title"></h1>\n            <div id="stats"></div>\n        ';
	            this.$loader = this.querySelector('#loading');
	            this.$stats = this.querySelector('#stats');
	            this.initialised = true;
	        }
	    }, {
	        key: 'attributeChangedCallback',
	        value: function attributeChangedCallback(name) {
	            //This fires too early in IE11 - so just check to make sure we have initialised.
	            if (this.initialised === true) {
	                var value = this.getAttribute(name);
	                if (value != "null") {
	                    switch (name) {
	                        case "id":
	                            this.id = value;
	                            this.getData();
	                            break;
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'getData',
	        value: function getData() {
	            var _this2 = this;

	            if (this.id !== null && this.type !== null) {
	                var xhr;

	                (function () {
	                    _this2.$loader.show();
	                    var $title = _this2.querySelector("#title");
	                    var $back = _this2.querySelector("#back-btn");
	                    $back.setAttribute("href", "#/resources/" + _this2.type);
	                    xhr = new XMLHttpRequest();

	                    xhr.onreadystatechange = function () {
	                        if (xhr.readyState == 4 && xhr.status == 200) {
	                            try {
	                                var json = JSON.parse(xhr.response);
	                                $title.innerHTML = json.name;
	                                _this2.data = json;
	                                _this2.render();
	                                _this2.$loader.hide();
	                                $back.className = "back-btn show";
	                            } catch (e) {
	                                console.error("Couldn't parse API response:", e);
	                            }
	                        }
	                    };
	                    xhr.open("GET", _this2.baseUrl + _this2.type + "/" + _this2.id);
	                    xhr.send();
	                })();
	            }
	        }
	    }]);

	    return ResourceItem;
	}(HTMLElement);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.StarshipsResource = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _resourceItem = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Leon Revill on 07/03/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Blog: http://www.revilweb.com
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * GitHub: https://github.com/RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Twitter: @RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var StarshipsResource = exports.StarshipsResource = function (_ResourceItem) {
	    _inherits(StarshipsResource, _ResourceItem);

	    function StarshipsResource() {
	        _classCallCheck(this, StarshipsResource);

	        return _possibleConstructorReturn(this, (StarshipsResource.__proto__ || Object.getPrototypeOf(StarshipsResource)).apply(this, arguments));
	    }

	    _createClass(StarshipsResource, [{
	        key: "createdCallback",
	        value: function createdCallback() {
	            this.init("starships");
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            this.$stats.innerHTML = "\n            <div class=\"stats-section\">\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-coins\"></span></label> <span>" + this.data.cost_in_credits + "</span></p>\n                </div>\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-shield4\"></span></label> " + this.data.starship_class + "</p>\n                </div>\n            </div>\n            <div class=\"stats-section\">\n                <div class=\"section build\">\n                    <p><label>Length:</label> " + this.data.length + "</p>\n                    <span class=\"icon icon-rocket\"></span>\n                    <p><label>Cargo Capacity:</label> " + this.data.cargo_capacity + "</p>\n                    <p><label>Passengers:</label> " + this.data.passengers + "</p>\n                </div>\n                <div class=\"section\">\n                    <p><label>Model:</label> " + this.data.model + "</p>\n                    <p><label>Crew:</label> " + this.data.crew + "</p>\n                    <p><label>Hyperdrive Rating:</label> " + this.data.hyperdrive_rating + "</p>\n                    <p><label>Manufacturer:</label> <br />" + this.data.manufacturer + "</p>\n                </div>\n            </div>";
	        }
	    }]);

	    return StarshipsResource;
	}(_resourceItem.ResourceItem);

	window.customElements.define("starships-resource", StarshipsResource);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.VehiclesResource = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _resourceItem = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Leon Revill on 07/03/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Blog: http://www.revilweb.com
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * GitHub: https://github.com/RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Twitter: @RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var VehiclesResource = exports.VehiclesResource = function (_ResourceItem) {
	    _inherits(VehiclesResource, _ResourceItem);

	    function VehiclesResource() {
	        _classCallCheck(this, VehiclesResource);

	        return _possibleConstructorReturn(this, (VehiclesResource.__proto__ || Object.getPrototypeOf(VehiclesResource)).apply(this, arguments));
	    }

	    _createClass(VehiclesResource, [{
	        key: "createdCallback",
	        value: function createdCallback() {
	            this.init("vehicles");
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            this.$stats.innerHTML = "\n            <div class=\"stats-section\">\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-coins\"></span></label> <span>" + this.data.cost_in_credits + "</span></p>\n                </div>\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-shield4\"></span></label> " + this.data.vehicle_class + "</p>\n                </div>\n            </div>\n            <div class=\"stats-section\">\n                <div class=\"section build\">\n                    <p><label>Length:</label> " + this.data.length + "</p>\n                    <span class=\"icon icon-truck\"></span>\n                    <p><label>Cargo Capacity:</label> " + this.data.cargo_capacity + "</p>\n                    <p><label>Passengers:</label> " + this.data.passengers + "</p>\n                </div>\n                <div class=\"section\">\n                    <p><label>Model:</label> " + this.data.model + "</p>\n                    <p><label>Crew:</label> " + this.data.crew + "</p>\n                    <p><label>Manufacturer:</label> <br />" + this.data.manufacturer + "</p>\n                </div>\n            </div>";
	        }
	    }]);

	    return VehiclesResource;
	}(_resourceItem.ResourceItem);

	window.customElements.define("vehicles-resource", VehiclesResource);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SpeciesResource = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _resourceItem = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Leon Revill on 07/03/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Blog: http://www.revilweb.com
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * GitHub: https://github.com/RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Twitter: @RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var SpeciesResource = exports.SpeciesResource = function (_ResourceItem) {
	    _inherits(SpeciesResource, _ResourceItem);

	    function SpeciesResource() {
	        _classCallCheck(this, SpeciesResource);

	        return _possibleConstructorReturn(this, (SpeciesResource.__proto__ || Object.getPrototypeOf(SpeciesResource)).apply(this, arguments));
	    }

	    _createClass(SpeciesResource, [{
	        key: "createdCallback",
	        value: function createdCallback() {
	            this.init("species");
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            this.$stats.innerHTML = "\n            <div class=\"stats-section\">\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-lips\"></span></label> <span>" + this.data.language + "</span></p>\n                </div>\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-calendar5\"></span></label> " + this.data.average_lifespan + "</p>\n                </div>\n            </div>\n            <div class=\"stats-section\">\n                <div class=\"section build\">\n                    <p><label>Av. Height:</label> " + this.data.average_height + "</p>\n                    <span class=\"icon icon-man\"></span>\n                    <p><label>Classification:</label> " + this.data.classification + "</p>\n                </div>\n                <div class=\"section\">\n                    <p><label>Eye Colours:</label> " + this.data.eye_colors + "</p>\n                    <p><label>Hair Colours:</label> " + this.data.hair_colors + "</p>\n                    <p><label>Skin Colours:</label> " + this.data.skin_colors + "</p>\n                </div>\n            </div>";
	        }
	    }]);

	    return SpeciesResource;
	}(_resourceItem.ResourceItem);

	window.customElements.define("species-resource", SpeciesResource);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PlanetsResource = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _resourceItem = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Leon Revill on 07/03/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Blog: http://www.revilweb.com
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * GitHub: https://github.com/RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Twitter: @RevillWeb
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var PlanetsResource = exports.PlanetsResource = function (_ResourceItem) {
	    _inherits(PlanetsResource, _ResourceItem);

	    function PlanetsResource() {
	        _classCallCheck(this, PlanetsResource);

	        return _possibleConstructorReturn(this, (PlanetsResource.__proto__ || Object.getPrototypeOf(PlanetsResource)).apply(this, arguments));
	    }

	    _createClass(PlanetsResource, [{
	        key: "createdCallback",
	        value: function createdCallback() {
	            this.init("planets");
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            this.$stats.innerHTML = "\n            <div class=\"stats-section\">\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-arrow-down16\"></span></label> <span>" + this.data.gravity + "</span></p>\n                </div>\n                <div class=\"section\">\n                    <p><label><span class=\"icon icon-tree\"></span></label> " + this.data.terrain + "</p>\n                </div>\n            </div>\n            <div class=\"stats-section\">\n                <div class=\"section build\">\n                    <p><label>Diameter:</label> " + this.data.diameter + "</p>\n                    <span class=\"icon icon-planet2\"></span>\n                    <p><label>Climate:</label> " + this.data.climate + "</p>\n\n                </div>\n                <div class=\"section\">\n                <p><label>Population:</label> " + this.data.population + "</p>\n                    <p><label>Surface Water:</label> " + this.data.surface_water + "</p>\n                    <p><label>Orbital Period:</label> " + this.data.orbital_period + "</p>\n                    <p><label>Rotation Period:</label> " + this.data.rotation_period + "</p>\n                </div>\n            </div>";
	        }
	    }]);

	    return PlanetsResource;
	}(_resourceItem.ResourceItem);

	window.customElements.define("planets-resource", PlanetsResource);

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Created by Leon Revill on 07/03/16.
	 * Blog: http://www.revilweb.com
	 * GitHub: https://github.com/RevillWeb
	 * Twitter: @RevillWeb
	 */
	var InfoPage = exports.InfoPage = function (_HTMLElement) {
	    _inherits(InfoPage, _HTMLElement);

	    function InfoPage() {
	        _classCallCheck(this, InfoPage);

	        return _possibleConstructorReturn(this, (InfoPage.__proto__ || Object.getPrototypeOf(InfoPage)).apply(this, arguments));
	    }

	    _createClass(InfoPage, [{
	        key: "createdCallback",
	        value: function createdCallback() {
	            this.template = "<p>This is the contact page. <a href=\"#/\">Home</a></p>";
	        }
	    }, {
	        key: "attachedCallback",
	        value: function attachedCallback() {
	            this.render();
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            this.innerHTML = this.template;
	        }
	    }]);

	    return InfoPage;
	}(HTMLElement);

	window.customElements.define("info-page", InfoPage);

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Created by Leon Revill on 10/01/2016.
	 * Blog: http://www.revilweb.com
	 * GitHub: https://github.com/RevillWeb
	 * Twitter: @RevillWeb
	 */

	var RebelRepeater = exports.RebelRepeater = function (_HTMLElement) {
	    _inherits(RebelRepeater, _HTMLElement);

	    function RebelRepeater() {
	        _classCallCheck(this, RebelRepeater);

	        return _possibleConstructorReturn(this, (RebelRepeater.__proto__ || Object.getPrototypeOf(RebelRepeater)).apply(this, arguments));
	    }

	    _createClass(RebelRepeater, [{
	        key: 'createdCallback',
	        value: function createdCallback() {
	            this.content = [];
	            this.template = this.innerHTML;
	            if (this.getAttribute('shadow') == "true") {
	                this.createShadowRoot();
	            }
	        }
	    }, {
	        key: 'attachedCallback',
	        value: function attachedCallback() {
	            this.render();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var element = this.getAttribute('element');
	            var html = element !== null ? "<" + element.toLowerCase() + ">" : "";
	            if (Array.isArray(this.content)) {
	                this.content.forEach(function (item) {
	                    html += RebelRepeater.interpolate(_this2.template, item);
	                });
	            } else {
	                throw new Error("Content should be an Array of objects.");
	            }
	            html += element !== null ? "</" + element.toLowerCase() + ">" : "";
	            if (this.getAttribute('shadow') == "true") {
	                this.shadowRoot.innerHTML = html;
	                this.innerHTML = "";
	            } else {
	                this.innerHTML = html;
	            }
	        }
	    }, {
	        key: 'setContent',
	        value: function setContent(content) {
	            this.content = content;
	            this.render();
	        }
	    }, {
	        key: 'setTemplate',
	        value: function setTemplate(template) {
	            this.template = template;
	            this.render();
	        }
	    }, {
	        key: 'attributeChangedCallback',
	        value: function attributeChangedCallback(name) {
	            switch (name) {
	                case "content":
	                    this.content = RebelRepeater.fromJson(this.getAttribute('content'));
	                    this.render();
	                    break;
	            }
	        }
	    }], [{
	        key: 'interpolate',
	        value: function interpolate(template, obj) {
	            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == "object") {
	                for (var key in obj) {
	                    var find = "${" + key + "}";
	                    if (template.indexOf(find) > -1) {
	                        template = template.replace(find, obj[key]);
	                        delete obj[key];
	                    }
	                }
	            }
	            return template;
	        }
	    }, {
	        key: 'fromJson',
	        value: function fromJson(str) {
	            var obj = null;
	            if (typeof str == "string") {
	                try {
	                    obj = JSON.parse(str);
	                } catch (e) {
	                    throw new Error("Invalid JSON string provided. ");
	                }
	            }
	            return obj;
	        }
	    }]);

	    return RebelRepeater;
	}(HTMLElement);

	document.registerElement("rebel-repeater", RebelRepeater);

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Created by Leon Revill on 07/03/16.
	 * Blog: http://www.revilweb.com
	 * GitHub: https://github.com/RevillWeb
	 * Twitter: @RevillWeb
	 */
	var RebelLoading = exports.RebelLoading = function (_HTMLElement) {
	    _inherits(RebelLoading, _HTMLElement);

	    function RebelLoading() {
	        _classCallCheck(this, RebelLoading);

	        return _possibleConstructorReturn(this, (RebelLoading.__proto__ || Object.getPrototypeOf(RebelLoading)).apply(this, arguments));
	    }

	    _createClass(RebelLoading, [{
	        key: "createdCallback",
	        value: function createdCallback() {
	            this.createShadowRoot();
	            this.backgroundColor = this.getAttribute("background-color") || "#FFF";
	            this.color = this.getAttribute("color") || "#000";
	            this.shadowRoot.innerHTML = "\n        <style>\n        .loader {\n                position: absolute;\n                background-color: " + this.backgroundColor + ";\n                top: 0;\n                bottom: 0;\n                width: 100%;\n                color: " + this.color + ";\n                display: flex;\n                flex-direction: column;\n                justify-content: center;\n                align-items: center;\n                font-size: 32px;\n        }\n        .loader.hidden {\n                display: none;\n        }\n        .spinner {\n                width: 40px;\n                height: 40px;\n                margin: 100px auto;\n                background-color: " + this.color + ";\n                border-radius: 100%;\n                -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;\n                animation: sk-scaleout 1.0s infinite ease-in-out;\n        }\n        @-webkit-keyframes sk-scaleout {\n            0% {\n                -webkit-transform: scale(0);\n            }\n            100% {\n                -webkit-transform: scale(1.0);\n                opacity: 0;\n            }\n        }\n        @keyframes sk-scaleout {\n            0% {\n                -webkit-transform: scale(0);\n                transform: scale(0);\n            }\n            100% {\n                -webkit-transform: scale(1.0);\n                transform: scale(1.0);\n                opacity: 0;\n            }\n        }\n        </style>\n        <div class=\"loader hidden\">\n            <div class=\"spinner\"></div>\n        </div>\n    ";
	        }
	    }, {
	        key: "show",
	        value: function show() {
	            this.shadowRoot.querySelector(".loader").className = "loader";
	        }
	    }, {
	        key: "hide",
	        value: function hide() {
	            this.shadowRoot.querySelector('.loader').className = "loader hidden";
	        }
	    }]);

	    return RebelLoading;
	}(HTMLElement);

	document.registerElement('rebel-loading', RebelLoading);

/***/ }
/******/ ]);