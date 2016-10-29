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
     */
    constructor(self) {
        self = super(self);
        self._previousRoute = null;
        self.basePath = null;
        self._routes = {};
        self._options = {};
        self._initialised = false;
        //Used to determine if we are half way through a render / transition
        self._renderLock = false;
        //if (this.options.inherit === true) {
            //If this is a nested router then we need to go and get the parent path

        //}
        // document.dispatchEvent(new CustomEvent("rebel-get-base", {
        //     "detail": {
        //         "callback": (base) => {
        //             console.log("SET BASE TO:", base);
        //             self.basePath = base;
        //         }
        //     },
        //     "bubbles": true
        // }));
        // //self.dispatchEvent(new CustomEvent("rebel-get-base", {detail: }, bubbles: true}) );
        // document.addEventListener("rebel-get-base", (event) => {
        //     console.log("GET BASE!");
        //     event.stopImmediatePropagation();
        //     const detail = event.detail;
        //     var $current = self._current();
        //     if ($current !== null && $current.path !== "*") {
        //         detail.callback($current.path);
        //     }
        // });

        // var observer = new MutationObserver(function(mutations) {
        //     mutations.forEach(function(mutation) {
        //         mutation.addedNodes.forEach((node) => {
        //             if (["REBEL-ROUTE", "REBEL-DEFAULT"].indexOf(node.nodeName) > -1 && node.initialised === false) {
        //                 console.log("FALSE");
        //                 //render = false;
        //             } else {
        //                 console.log("TRUE", self.children.length);
        //             }
        //         });
        //     });
        // });
        // observer.observe(self, {childList: true});
        const addRoute = (event) => {
            //Prevent the route event from bubbling up any further
            event.stopImmediatePropagation();
            // if (self.getAttribute("id")=="sub") {
            //     console.log("SUB ROUTES:", self._routes);
            // }
            const route = event.detail;
            //const base = self._getBasePath();
            //console.log("BASE:", base);
            //const path = (base !== null && route.path !== "*") ? base + route.path : route.path;

            self._routes[route.path] = route.$element;
            self.removeChild(route.$element);
            if (self.getAttribute("id")=="sub") {
                //console.log("CHILDREN:", self.children);
            }
            // let render = true;
            // console.log(self.childNodes);
            // self.childNodes.forEach(($child) => {
            //     console.log($child.initialised);
            //     // if (["REBEL-ROUTE", "REBEL-DEFAULT"].indexOf($child.nodeName) > -1) {
            //     //
            //     // }
            //     // if ($child.initialised === true) {
            //     //     render = true;
            //     // }
            // });
            // console.log("RENDER?", render);
            // for (let i = 0; i < self.children.length; i++) {
            //     const $child = self.children[i];
            //     if (["REBEL-ROUTE", "REBEL-DEFAULT"].indexOf($child.nodeName) > -1 && $child.initialised === false) {
            //         render = false;
            //     }
            // }
            // if (render === true) {
                //self.removeEventListener("rebel-add-route", addRoute);
           // if (render === true) {
                self._render();
           // }


            // }
        };

        self.addEventListener("rebel-add-route", addRoute);
        self.addEventListener("rebel-render", () => {
            self._render();
        });

        return self;
    }

    _getBasePath() {
        let $element = this;
        while ($element.parentNode) {
            $element = $element.parentNode;
            if ($element.nodeName.toLowerCase() == "rebel-router") {
                const $current = $element._current();
                return $current.path;
            }
        }
        return null;
    }

    get routes() {
        return this._routes;
    }

    get options() {
        return this._options;
    }

    connectedCallback() {
        //if (this._initialised === true) return;
        //this._initialised = true;
        //this.appendChild(document.createElement("p"));
        // console.log("CONNECTED:", this.getAttribute("id"));
        // console.log("CHILD NODES:", this.childNodes.length);
        let num = 0;
        this.childNodes.forEach(($child) => {
            if (["REBEL-ROUTE", "REBEL-DEFAULT"].indexOf($child.nodeName) > -1) {
                num++;
            }
            // if ($child.initialised === true) {
            //     render = true;
            // }
        });
        console.log(num);

        //Get options
        this._options = {
            "animation": (this.getAttribute("animation") == "true"),
            "shadowRoot": (this.getAttribute("shadow") == "true"),
            "inherit": (this.getAttribute("inherit") != "false")
        };


        RebelRouter.pathChange((isBack) => {
            if (this.options.animation === true) {
                if (isBack === true) {
                    this.classList.add("rbl-back");
                } else {
                    this.classList.remove("rbl-back");
                }
            }
            this._render();
        });
    }

    /**
     * Method used to get the current route object
     * @returns {*}
     */
    _current() {
        let path = RebelRouter.getPathFromUrl();
        const base = this._getBasePath();
        if (base !== null) {
            path = path.replace(base, "");
        }
        for (const routeString in this._routes) {
            if (routeString !== "*") {
                const $route = this._routes[routeString];
                if ($route.regex.test(path)) {
                    return $route;
                }
            }
        }
        return (this._routes["*"] !== undefined) ? this._routes["*"] : null;
    }

    /**
     * Method called to render the current view
     */
    _render() {
        if (this._renderLock === true) return;
        const $current = this._current();
        // console.log("CURRENT:", this.getAttribute("id"), $current);
        if ($current !== null) {
            this._renderLock = true;
            if ($current !== this._previousRoute) {
                console.log("PR:", this._previousRoute);
                $current.load().then(() => {
                    this.appendChild($current);
                    let promises = [];
                    if (this._options.animation === true && this._previousRoute !== null) {
                        promises.push($current.in());
                    }
                    if (this._previousRoute !== null) {
                        promises.push(this._previousRoute.out());
                    }
                    Promise.all(promises).then(() => {
                        if (this._previousRoute !== null) {
                            this.removeChild(this._previousRoute);
                        }
                        this._renderLock = false;
                        this._previousRoute = $current;
                    }).catch((error) => {
                        this._renderLock = false;
                        throw new Error(error);
                    });
                });
            } else {
                console.log("LOAD");
                $current.load().then(() => {
                    this._renderLock = false;
                });
            }
        }
    }

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
    static getParamsFromUrl(regex, route) {
        const path = RebelRouter.getPathFromUrl();
        let result = RebelRouter.parseQueryString(path);
        const re = /{(\w+)}/g;
        let results = [];
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
            if ('import' in document.createElement('link')) {
                //Browser supports HTML Imports so let's use'em!
                var $link = document.createElement("link");
                $link.setAttribute("rel", "import");
                $link.setAttribute("href", url);
                $link.setAttribute("async", "true");
                $link.addEventListener("load", () => {
                    const $template = $link.import.querySelector("template");
                    if ($template !== null) {
                        const $div = document.createElement("div");
                        $div.appendChild($template.content.cloneNode(true));
                        resolve($div.innerHTML);
                    } else {
                        reject("No template element found in '" + url + "'.");
                    }
                });
                $link.addEventListener("error", () => {
                    reject("An error occurred while trying to load '" + url + "'.");
                });
                document.head.appendChild($link);
            } else {
                // Going to have to do it the good'ol fashioned way.
                var xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.responseText)
                };
                xhr.open("GET", url);
                xhr.send();
            }
        });
    }

    static interpolateString(string, data) {
        if (string.indexOf("${") > -1) {
            string = string.replace(/\${([^{}]*)}/g,
                function (a, b) {
                    var r = data[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        }
        return string.replace(/\${(.*)}/, "");
    }

}

window.customElements.define("rebel-router", RebelRouter);

/**
 * Class which represents the rebel-route custom element
 */
class RebelRoute extends HTMLElement {
    constructor() {
        super();
        this._initialised = false;
        this._path = null;
        this._regex = null;
    }
    get initialised() {
        return this._initialised;
    }
    get path() {
        return this._path;
    }
    get regex() {
        return this._regex;
    }
    load() {
        return new Promise((resolve) => {
            const newHTML = RebelRouter.interpolateString(this.$template, RebelRouter.getParamsFromUrl(this._regex, this._path));
            //Only update the DOM if something has changed - this seems to easy, right?
            if (newHTML != this.innerHTML) {
                this.innerHTML = newHTML;
            }
            resolve();
        });
    }
    _setTransitionFallback(reject) {
        return setTimeout(() => {
            //If this happens then the transition never completed
            reject("Transition for route '" + this.path + "' never ended.");
        }, 5000);
    }
    in() {
        return new Promise((resolve, reject) => {
           var fb = this._setTransitionFallback(reject);
            const onTransitionEnd = () => {
                clearTimeout(fb);
                this.removeEventListener('transitionend', onTransitionEnd);
                this.classList.remove('enter');
                this.classList.remove('complete');
                resolve();
            };
            this.classList.add('rebel-animate');
            this.classList.add('enter');
            setTimeout(() => {
                this.classList.add('complete');
            }, 100);

            this.addEventListener('transitionend', onTransitionEnd);
        });
    }
    out() {
        return new Promise((resolve, reject) => {
            var fb = this._setTransitionFallback(reject);
            const onTransitionEnd = () => {
                clearTimeout(fb);
                this.removeEventListener('transitionend', onTransitionEnd);
                this.classList.remove('exit');
                this.classList.remove('complete');
                resolve();
            };
            this.classList.add('rebel-animate');
            this.classList.add('exit');
            setTimeout(() => {
                this.classList.add('complete');
            }, 100);
            this.addEventListener('transitionend', onTransitionEnd);
        });
    }
    _initialise() {
        return new Promise((resolve, reject) => {
            const _tplResource = this.getAttribute("template");
            const _tplInline = this.querySelector("template");
            if (_tplResource !== null) {
                RebelRouter.importTemplate(_tplResource).then((tplString) => {
                    this.$template = tplString;
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
            } else if (_tplInline !== null) {
                const $div = document.createElement("div");
                $div.appendChild(_tplInline.content.cloneNode(true));
                this.$template = $div.innerHTML;
                resolve();
            } else {
                this.$template = this.innerHTML;
                resolve();
            }
        });
    }
    connectedCallback(defaults) {
        if (this._initialised === false) {
            this._initialise().then(() => {
                this.innerHTML = "";
                this._initialised = true;
                const path = this.getAttribute("path");
                let regex = null;
                if (path !== null) {
                    let regexString = "^" + path.replace(/{\w+}\/?/g, "(\\w+)\/?");
                    regexString += (regexString.indexOf("\\/?") > -1) ? "" : "\\/?" + "([?=&-\/\\w+]+)?$";
                    regex = new RegExp(regexString);
                }
                const detail = Object.assign({
                    "path": path,
                    "regex": regex,
                    "$element": this
                }, defaults);
                if (detail.path === null) {
                    throw Error("rebel-route requires a path attribute to be specified.")
                }
                this._path = detail.path;
                this._regex = detail.regex;
                this.dispatchEvent(new CustomEvent("rebel-add-route", {
                    "detail": detail,
                    "bubbles": true
                }));
            }).catch((error) => {
                console.error(error);
            });
        }
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