/**
 * Created by Leon Revill on 15/12/2015.
 * Blog: blog.revillweb.com
 * GitHub: https://github.com/RevillWeb
 * Twitter: @RevillWeb
 */

/**
 * The main router class and entry point to the router.
 */
class RebelRouter extends HTMLElement {

    /**
     * Main initialisation point of rebel-router
     * @param prefix - If extending rebel-router you can specify a prefix when calling createdCallback in case your elements need to be named differently
     */
    constructor(self) {
        self = super(self);
        self._prefix = "rebel";
        self.previousPath = null;
        self.basePath = null;
        self._routes = [];
        self._options = {};
        self._$view = null;
        self.addEventListener("rebel-add-route", (event) => {
            event.detail.then((route) => {
                const path = (this.basePath !== null) ? self.basePath + route.path : route.path;
                self.routes[path] = {
                    "ctrlElement": route["ctrlElement"],
                    "template": route.template
                };
                //route.$element.remove();
                self.render();
            }).catch((error) => {
                throw new Error(error);
            });
        });

        return self;
    }

    get routes() {
        return this._routes;
    }

    get options() {
        return this._options;
    }

    get bootstrapped() {
        return this._bootstrapped;
    }

    connectedCallback() {

        this._$view = document.createElement("rebel-view");
        this.appendChild(this._$view);
        this.appendChild(document.createComment("<[ROUTER CONFIG]>"));

        //Get options
        this._options = {
            "animation": (this.getAttribute("animation") == "true"),
            "shadowRoot": (this.getAttribute("shadow") == "true"),
            "inherit": (this.getAttribute("inherit") != "false")
        };
        //Get routes
        if (this.options.inherit === true) {
            //If this is a nested router then we need to go and get the parent path
            let $element = this;
            while ($element.parentNode) {
                $element = $element.parentNode;
                if ($element.nodeName.toLowerCase() == this._prefix + "-router") {
                    const current = $element.current();
                    this.basePath = current.route;
                    break;
                }
            }
        }
        if (this.options.animation === true) {
            this.initAnimation();
        }
        RebelRouter.pathChange((isBack) => {
            if (this.options.animation === true) {
                if (isBack === true) {
                    this.classList.add("rbl-back");
                } else {
                    this.classList.remove("rbl-back");
                }
            }
            this.render();
        });
    }

    /**
     * Function used to initialise the animation mechanics if animation is turned on
     */
    initAnimation() {
        const observer = new MutationObserver((mutations) => {
            let node = mutations[0].addedNodes[0];
            //console.log("NODE:", node.tagName);
            if (node !== undefined && ["rebel-route", "rebel-default"].indexOf(node.tagName) === -1) {
                const otherChildren = this.getOtherChildren(node);
                node.classList.add("rebel-animate");
                node.classList.add("enter");
                setTimeout(() => {
                    if (otherChildren.length > 0) {
                        otherChildren.forEach((child) => {
                            child.classList.add("exit");
                            setTimeout(() => {
                                child.classList.add("complete");
                            }, 10);
                        });
                    }
                    setTimeout(() => {
                        node.classList.add("complete");
                    }, 10);
                }, 10);
                const animationEnd = (event) => {
                    if (event.target.classList.contains("exit")) {
                        this._$view.removeChild(event.target);
                    }
                };
                node.addEventListener("transitionend", animationEnd);
                node.addEventListener("animationend", animationEnd);
            }
        });
        observer.observe(this._$view, {childList: true});
    }

    /**
     * Method used to get the current route object
     * @returns {*}
     */
    current() {
        const path = RebelRouter.getPathFromUrl();
        for (const route in this.routes) {
            if (route !== "*") {
                let regexString = "^" + route.replace(/{\w+}\/?/g, "(\\w+)\/?");
                regexString += (regexString.indexOf("\\/?") > -1) ? "" : "\\/?" + "([?=&-\/\\w+]+)?$";
                const regex = new RegExp(regexString);
                if (regex.test(path)) {
                    return _routeResult(this.routes[route], route, regex, path);
                }
            }
        }
        return (this.routes["*"] !== undefined) ? _routeResult(this.routes["*"], "*", null, path) : null;
    }

    /**
     * Method called to render the current view
     */
    render() {
        this._bootstrapped = true;
        const result = this.current();
        if (result !== null) {
            console.log("RENDER:", result.path, this.previousPath);
            if (result.path === this.previousPath) return;
            this.previousPath = result.path;
            if (this.options.animation !== true) {
                this._$view.innerHTML = "";
            }
            if (result.ctrlElement !== null) {
                let $ctrlElement = document.createElement(result.ctrlElement);
                for (let key in result.params) {
                    let value = result.params[key];
                    if (typeof value == "Object") {
                        try {
                            value = JSON.parse(value);
                        } catch (e) {
                            console.error("Couldn't parse param value:", e);
                        }
                    }
                    $ctrlElement.setAttribute(key, value);
                }
                this._$view.appendChild($ctrlElement);
            } else {
                let $template = result.template;
                //TODO: Find a faster alternative
                if ($template.indexOf("${") > -1) {
                    $template = $template.replace(/\${([^{}]*)}/g,
                        function (a, b) {
                            var r = result.params[b];
                            return typeof r === 'string' || typeof r === 'number' ? r : a;
                        }
                    );
                }
                this._$view.innerHTML = $template.replace(/\${(.*)}/, "");
            }
        }
    }


    /**
     *
     * @param node - Used with the animation mechanics to get all other view children except itself
     * @returns {Array}
     */
    getOtherChildren(node) {
        const children = this._$view.children;
        let results = [];
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child != node) {
                results.push(child);
            }
        }
        return results;
    };


    /**
     * Static helper method to parse the query string from a url into an object.
     * @param url
     * @returns {{}}
     */
    static parseQueryString(url) {
        var result = {};
        if (url !== undefined) {
            var queryString = (url.indexOf("?") > -1) ? url.substr(url.indexOf("?") + 1, url.length) : null;
            if (queryString !== null) {
                queryString.split("&").forEach(function (part) {
                    if (!part) return;
                    part = part.replace("+", " ");
                    var eq = part.indexOf("=");
                    var key = eq > -1 ? part.substr(0, eq) : part;
                    var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
                    var from = key.indexOf("[");
                    if (from == -1) result[decodeURIComponent(key)] = val;
                    else {
                        var to = key.indexOf("]");
                        var index = decodeURIComponent(key.substring(from + 1, to));
                        key = decodeURIComponent(key.substring(0, from));
                        if (!result[key]) result[key] = [];
                        if (!index) result[key].push(val);
                        else result[key][index] = val;
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
    static classToTag(Class) {
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
    static isRegisteredElement(name) {
        return (window.customElements.get(name) !== undefined);
    }

    /**
     * Static helper method to take a web component class, create an element name and register the new element on the document.
     * @param Class
     * @returns {string}
     */
    static createElement(Class) {
        const name = RebelRouter.classToTag(Class);
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
    static validElementTag(tag) {
        return /^[a-z0-9\-]+$/.test(tag);
    }

    /**
     * Method used to register a callback to be called when the URL path changes.
     * @param callback
     */
    static pathChange(callback) {
        if (RebelRouter.changeCallbacks === undefined) {
            RebelRouter.changeCallbacks = [];
        }
        RebelRouter.changeCallbacks.push(callback);
        const changeHandler = () => {
            /**
             *  event.oldURL and event.newURL would be better here but this doesn't work in IE :(
             */
            if (window.location.href != RebelRouter.oldURL) {
                RebelRouter.changeCallbacks.forEach(function(callback){
                    callback(RebelRouter.isBack);
                });
                RebelRouter.isBack = false;
            }
            RebelRouter.oldURL = window.location.href;
        };
        if (window.onhashchange === null) {
            window.addEventListener("rblback", function(){
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
    static getParamsFromUrl(regex, route, path) {
        var result = RebelRouter.parseQueryString(path);
        var re = /{(\w+)}/g;
        var results = [];
        let match;
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
    static getPathFromUrl() {
        var result = window.location.href.match(/#(.*)$/);
        if (result !== null) {
            return result[1];
        }
    }

    static importTemplate(url) {
        return new Promise((resolve, reject) => {
            var $link = document.createElement("link");
            $link.setAttribute("rel", "import");
            $link.setAttribute("href", url);
            $link.setAttribute("async", true);
            $link.addEventListener("load", () => {
                resolve($link.import.body.innerHTML);
            });
            $link.addEventListener("error", () => {
                reject("An error occurred while trying to load '" + url + "'.");
            });
            document.head.appendChild($link);
        });
    }

    static debounce(func, wait, immediate) {
        var timeout = null;
        var later = function() {
            timeout = null;
            if (!immediate) func();
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func();
    }
}

window.customElements.define("rebel-router", RebelRouter);

/**
 * Class which represents the rebel-route custom element
 */
class RebelRoute extends HTMLElement {
    constructor() {
        super();
        // this._setRoute = this._setRoute.bind(this);
    }
    _createDetail(tplString) {
        const detail = Object.assign({
            "path": this.getAttribute("path"),
            "ctrlElement": this.getAttribute("ctrl-element"),
            "template": "<rebel-template>" + tplString + "</rebel-template>",
            "$element": this
        }, this._defaults);
        if (detail.path === null) {
            throw Error("rebel-route requires a path attribute to be specified.")
        }
        return detail;
    }
    _getTemplate() {
        return new Promise((resolve, reject) => {
            const _tplResource = this.getAttribute("template");
            const _$tpl = this.querySelector("template");
            if (_tplResource !== null) {
                RebelRouter.importTemplate(_tplResource).then((tplString) => {
                    resolve(this._createDetail(tplString));
                }).catch((error) => {
                    reject(error);
                });
            } else if (_$tpl !== null) {
                const $div = document.createElement("div");
                $div.appendChild(_$tpl.content.cloneNode(true));
                resolve(this._createDetail($div.innerHTML));
            } else {
                resolve(this._createDetail(null));
            }
        });
    }
    // _setRoute(tplString) {
    //     const detail = Object.assign({
    //         "path": this.getAttribute("path"),
    //         "ctrlElement": this.getAttribute("ctrl-element"),
    //         "template": tplString,
    //         "$element": this
    //     }, this._defaults);
    //
    //
    // }
    connectedCallback(defaults) {
        this.style.display = "none";
        this._defaults = defaults;
        this.dispatchEvent(new CustomEvent("rebel-add-route", {
            "detail": this._getTemplate(),
            "bubbles": true
        }));
    }
}
window.customElements.define("rebel-route", RebelRoute);

/**
 * Class which represents the rebel-default custom element
 */
class RebelDefault extends RebelRoute {
    connectedCallback() {
        super.connectedCallback({"path": "*"});
    }
}
window.customElements.define("rebel-default", RebelDefault);


/**
 * Represents the prototype for an anchor element which added functionality to perform a back transition.
 */
class RebelBackA extends HTMLAnchorElement {
    connectedCallback() {
        this.addEventListener("click", (event) => {
            const path = this.getAttribute("href");
            event.preventDefault();
            if (path !== undefined) {
                window.dispatchEvent(new CustomEvent('rblback'));
            }
            window.location.hash = path;
        });
    }
}
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
    let result = {};
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