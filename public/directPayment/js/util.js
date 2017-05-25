var util = {};
(function(nameSpace) {
    nameSpace.isPlainObject = function(value) {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    };

    nameSpace.isArray = function(value) {
        return value instanceof Array;
    };

    nameSpace.isNumber = function(value) {
        return !!value && Object.prototype.toString.call(value) === '[object Number]';
    };

    nameSpace.isString = function(value) {
        return !!value && Object.prototype.toString.call(value) === '[object String]';
    };

    nameSpace.toArray = function(value) {
        return Array.prototype.slice.call(value);
    };

    nameSpace.getStyles = function(el, key) {
        var styles = document.defaultView.getComputedStyle(el, null);
        return parseInt(styles.getPropertyValue(key) || styles[key], 10);
    };

    nameSpace.getURLQuery = function() {
        var string = (location.search.length > 0 ? location.search.substring(1) : "");
        var args = {};
        var items = string.length > 0 ? string.split("&") : [];
        var item, key, value;
        for (var i = 0; i < items.length; i++) {
            item = items[i].split("=");
            key = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if (key.length > 0) {
                args[key] = value;
            }
        }
        return args;
    };

    nameSpace.changeViewPort = function(content) {
        var metaEl = document.head.getElementsByTagName("meta");
        var newMetaEl = document.createElement("meta");
        newMetaEl.setAttribute("name", "viewport");
        newMetaEl.setAttribute("content", content);
        if (metaEl.hasOwnProperty("viewport")) {
            document.head.removeChild(metaEl.viewport);
            document.head.appendChild(newMetaEl);
        }
    };

    nameSpace.observer = function() {
        return {
            subscriber: [],
            subscribe: function(type, fn) {
                if (typeof this.subscriber[type] === "undefined") {
                    this.subscriber[type] = [];
                }
                this.subscriber[type].push(fn);
            },
            delSubscribe: function(type, fn) {
                this.subscriber[type] = this.subscriber[type].filter(function(val) {
                    if (val !== fn) {
                        return val;
                    }
                });
            },
            update: function(type, arg, thisObj) {
                var scope = thisObj || window;
                this.subscriber[type].forEach(function(val) {
                    val.call(scope, arg);
                });
            }
        };
    };

    nameSpace.ajax = function(args) {
        var xhr = function() {
            if (typeof XMLHttpRequest != "undefined") {
                xhr = function() {
                    return new XMLHttpRequest();
                };
            } else if (typeof ActiveXObject != "undefined") {
                xhr = function() {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                };
            } else {
                xhr = function() {
                    throw new Error("NOT SUPPORT");
                };
            }
            return xhr();
        };
        if (typeof args == "object") {
            var init = xhr();
            var successBack = args.success;
            var errorBack = args.error;
            timeout = args.timeout || 30000;
            time = false;
            var setHeaders = function(){
                if(args.hasOwnProperty('headers')){
                    for (var i in args.headers) {
                        init.setRequestHeader(i,args.headers[i]);
                    }
                }
            };
            var timer = setTimeout(function(){
                time = true;
                init.abort();//请求中止
            }, timeout);
            init.onreadystatechange = function() {
                if(init.readyState !==4) return;
                if(time) return errorBack(init.status);
                clearTimeout(timer);
                if (init.readyState == 4) {
                    if ((init.status >= 200 && init.status < 300) || init.status == 304) {
                        return successBack(init.responseText);
                    } else {
                        return errorBack(init.status);
                    }
                }
            };
            init.open(args.type, args.url, args.async);
            if (args.type == "POST") {
                setHeaders();
                init.send(args.data);
            } else {
                init.send(null);
            }

        }
    };
})(util);
