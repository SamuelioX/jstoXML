function getLocation() {
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(showPosition, function() {
        alert(o.message)
    }, {
        enableHighAccuracy: !0,
        timeout: 5e3
    }) : alert("Sorry, location is not supported by this browser.")
}

function showPosition(n) {
    $.ajax({
        type: "POST",
        url: "/services/GetZipCode",
        data: {
            latitude: n.coords.latitude,
            longitude: n.coords.longitude
        },
        success: function(n) {
            n.length > 0 ? ($('input[name="l"]').val(n), $("form").submit()) : alert("Location not found.  ")
        }
    })
}

function clearLocation() {
    $('input[name="lat"]').val("");
    $('input[name="long"]').val("");
    $('input[name="l"]').val("");
    $("form").submit()
}

function clearFilters() {
    return $('input[name="lat"]').val(""), $('input[name="long"]').val(""), $('input[name="l"]').val(""), $("form").submit(), $('input[name="a"]').val(""), $('select[name="f"]').val(""), $("form").submit(), !1
}

function refreshJobs(n) {
    $(".curr-openings-wrapper").html("");
    $(n.JobResults).each(function(n, t) {
        displayJob(t.Item)
    })
}

function writeJobResults(n) {
    null == globalJobData ? (globalJobData = n, refreshJobs(n)) : ($(n.JobResults).each(function(n, t) {
        globalJobData.JobResults.push(t)
    }), appendJobs(n));
    setCurrOpeningsBackColor()
}

function appendJobs(n) {
    $(n.JobResults).each(function(n, t) {
        displayJob(t.Item)
    });
    globalJobData.JobResults.length >= n.TotalItemCount ? $(".load-more-div").hide() : $(".load-more-div").show()
}

function updateSearch(n) {
    $(n.JobResults).each(function(n, t) {
        displayJob(t.Item)
    })
}

function displayJob(n) {
    var t = $(".curr-openings-wrapper .opening").first().clone(),
        i;
    t.find(".job-url").attr("href", n.Url);
    t.find(".job-title").text(n.title);
    i = "";
    null != n.otherLocationsAvailable && n.otherLocationsAvailable.length > 0 ? (i = "Various Locations", t.find(".job-location-image").attr("src", "/images/location-pin-multiple.png")) : (i = n.city + ", " + n.stateAbbr, t.find(".job-location-image").attr("src", "/images/location-pin.png"));
    t.find(".job-location").text(i);
    t.find(".job-functionalGroup").html(n.department);
    t.find(".job-schedule").html(n.schedule);
    $(".curr-openings-wrapper").append(t)
}

function getJobs() {
    var l = 0,
        n, c;
    null != globalJobData && (l = globalJobData.JobResults.length);
    var o = $('input[name="a"]').val(),
        s = $('input[name="l"]').val(),
        h = $("#stateName").val(),
        i = $('select[name="f"]').val(),
        r = $('select[name="e"]').val(),
        e = $('select[name="b"]').val(),
        u = $('select[name="t"]').val(),
        f = $('select[name="y"]').val(),
        t = "/job-search?";
    if (null != o && (t += "a=" + o + "&"), null != s && (t += "l=" + s + "&"), null != i && i.length > 0)
        for (n = 0; n < i.length; n++) t += "f=" + i[n] + "&";
    if (null != e && e.length > 0)
        for (n = 0; n < e.length; n++) t += "b=" + e[n] + "&";
    if (null != r && r.length > 0)
        for (n = 0; n < r.length; n++) t += "e=" + r[n] + "&";
    if (null != f && f.length > 0)
        for (n = 0; n < f.length; n++) t += "y=" + f[n] + "&";
    if (null != u && u.length > 0)
        for (n = 0; n < u.length; n++) t += "t=" + u[n] + "&";
    null != globalJobDataPageNumber && (t += "p=" + globalJobDataPageNumber + "&");
    null != h && (t += "stateName=" + h + "&");
    t = t.replace(/ /g, "+");
    c = {
        keyword: o,
        location: s,
        teamTag: null != i ? i.toString() : "",
        experienceTag: null != r ? r.toString() : "",
        datePostedTag: null != f ? f.toString() : "",
        typeTag: null != u ? u.toString() : "",
        pageNumber: globalJobDataPageNumber,
        isMetroPCS: globalIsMetroPcs,
        loadAll: !1
    };
    $.ajax({
        type: "POST",
        url: "/services/getjobs",
        data: c,
        success: function(n) {
            writeJobResults(n);
            window.history.pushState(n, "job search", t)
        }
    })
}

function loadMoreJobs() {
    globalJobDataPageNumber++;
    getJobs()
}

function removeQueryString() {
    var n = window.location.href.split("?");
    window.location.href = n[0]
}

function removeAllFilters() {
    for (var r = window.location.href.split("?"), t = r[1].split("&"), i = "?", n = 0; n < t.length; n++)(t[n].indexOf("a=") > -1 || t[n].indexOf("l=") > -1) && (i += t[n] + "&");
    window.location.href = i.slice(0, -1)
}

function removeURLParameterByValue(n, t) {
    var u = n.split("?"),
        i, r, e;
    if (u.length >= 2) {
        for (i = u[1].split(/[&;]/g), r = i.length; r-- > 0;) {
            var f = i[r].split("="),
                o = f[0] + "=",
                s = encodeURIComponent(t).replace(/\%2B/g, "+");
            f.length > 1 && (e = f[1].replace(/\%2B/g, "+"), e == s && i[r].lastIndexOf(o, 0) !== -1 && i.splice(r, 1))
        }
        return u[0] + (i.length > 0 ? "?" + i.join("&") : "")
    }
    return n
}

function updateURLParameter(n, t, i) {
    var u = n.split("?");
    if (u.length >= 2) {
        for (var o = encodeURIComponent(t) + "=", r = u[1].split(/[&;]/g), e = "", f = r.length; f-- > 0;) r[f].lastIndexOf(o, 0) !== -1 && (e = r[f].split("="), e[1] = i);
        return u[0] + (r.length > 0 ? "?" + r.join("&") : "")
    }
    return n
}

function removeURLParameter(n, t) {
    var r = n.split("?");
    if (r.length >= 2) {
        for (var f = encodeURIComponent(t) + "=", i = r[1].split(/[&;]/g), u = i.length; u-- > 0;) i[u].lastIndexOf(f, 0) !== -1 && i.splice(u, 1);
        return r[0] + (i.length > 0 ? "?" + i.join("&") : "")
    }
    return n
}

function OpenSelectedDropdown() {
    var n = $("input[name='dd']").val();
    null != n && "" !== n && ($(".filters ." + n).next().addClass("open").find("button").prop("aria-expanded", !0), $(".filters ." + n).addClass("open").find("button").prop("aria-expanded", !0), $("#mobile-filters").addClass("in"), $(".filters-mob ." + n).addClass("in"))
}

function initializeLocationAutocomplete() {
    function n() {
        var n = document.getElementById("locationSearch"),
            t = new google.maps.places.Autocomplete(n, {
                types: ["(regions)"],
                componentRestrictions: {
                    country: ["us", "pr"]
                }
            });
        $(n).on("change", function() {
            $("#stateName").val("")
        });
        t.addListener("place_changed", function() {
            var n = t.getPlace(),
                i, r;
            (console.log(n), "undefined" != typeof n.geometry && "undefined" != typeof n.geometry.location) && (i = (n.geometry.location.lat(), n.geometry.location.lng(), n.types[0]), (console.log(i), "administrative_area_level_1" == i) ? (r = n.address_components[0].long_name, console.log(r), $("#stateName").val(r)) : $("#stateName").val(""), $("form").submit())
        })
    }
    google.maps.event.addDomListener(window, "load", n)
}

function monkeyPatchAutoComplete() {
    $.ui.autocomplete.prototype._renderItem = function(n, t) {
        return t.label = t.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<span class='bold'>$1<\/span>"), $("<li><\/li>").data("item.autocomplete", t).append("<a>" + t.label + "<\/a>").appendTo(n)
    }
}(function(n) {
    typeof define == "function" && define.amd ? define(["jquery"], n) : n(jQuery)
})(function(n) {
    var r, u;
    n.ui = n.ui || {};
    var f = n.ui.version = "1.12.1",
        i = 0,
        t = Array.prototype.slice;
    n.cleanData = function(t) {
        return function(i) {
            for (var r, u, f = 0;
                (u = i[f]) != null; f++) try {
                r = n._data(u, "events");
                r && r.remove && n(u).triggerHandler("remove")
            } catch (e) {}
            t(i)
        }
    }(n.cleanData);
    n.widget = function(t, i, r) {
        var f, u, o, h = {},
            e = t.split(".")[0],
            s;
        return t = t.split(".")[1], s = e + "-" + t, r || (r = i, i = n.Widget), n.isArray(r) && (r = n.extend.apply(null, [{}].concat(r))), n.expr[":"][s.toLowerCase()] = function(t) {
            return !!n.data(t, s)
        }, n[e] = n[e] || {}, f = n[e][t], u = n[e][t] = function(n, t) {
            if (!this._createWidget) return new u(n, t);
            arguments.length && this._createWidget(n, t)
        }, n.extend(u, f, {
            version: r.version,
            _proto: n.extend({}, r),
            _childConstructors: []
        }), o = new i, o.options = n.widget.extend({}, o.options), n.each(r, function(t, r) {
            if (!n.isFunction(r)) {
                h[t] = r;
                return
            }
            h[t] = function() {
                function n() {
                    return i.prototype[t].apply(this, arguments)
                }

                function u(n) {
                    return i.prototype[t].apply(this, n)
                }
                return function() {
                    var i = this._super,
                        f = this._superApply,
                        t;
                    return this._super = n, this._superApply = u, t = r.apply(this, arguments), this._super = i, this._superApply = f, t
                }
            }()
        }), u.prototype = n.widget.extend(o, {
            widgetEventPrefix: f ? o.widgetEventPrefix || t : t
        }, h, {
            constructor: u,
            namespace: e,
            widgetName: t,
            widgetFullName: s
        }), f ? (n.each(f._childConstructors, function(t, i) {
            var r = i.prototype;
            n.widget(r.namespace + "." + r.widgetName, u, i._proto)
        }), delete f._childConstructors) : i._childConstructors.push(u), n.widget.bridge(t, u), u
    };
    n.widget.extend = function(i) {
        for (var e = t.call(arguments, 1), f = 0, o = e.length, r, u; f < o; f++)
            for (r in e[f]) u = e[f][r], e[f].hasOwnProperty(r) && u !== undefined && (i[r] = n.isPlainObject(u) ? n.isPlainObject(i[r]) ? n.widget.extend({}, i[r], u) : n.widget.extend({}, u) : u);
        return i
    };
    n.widget.bridge = function(i, r) {
        var u = r.prototype.widgetFullName || i;
        n.fn[i] = function(f) {
            var s = typeof f == "string",
                o = t.call(arguments, 1),
                e = this;
            return s ? this.length || f !== "instance" ? this.each(function() {
                var t, r = n.data(this, u);
                return f === "instance" ? (e = r, !1) : r ? !n.isFunction(r[f]) || f.charAt(0) === "_" ? n.error("no such method '" + f + "' for " + i + " widget instance") : (t = r[f].apply(r, o), t !== r && t !== undefined ? (e = t && t.jquery ? e.pushStack(t.get()) : t, !1) : void 0) : n.error("cannot call methods on " + i + " prior to initialization; attempted to call method '" + f + "'")
            }) : e = undefined : (o.length && (f = n.widget.extend.apply(null, [f].concat(o))), this.each(function() {
                var t = n.data(this, u);
                t ? (t.option(f || {}), t._init && t._init()) : n.data(this, u, new r(f, this))
            })), e
        }
    };
    n.Widget = function() {};
    n.Widget._childConstructors = [];
    n.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            classes: {},
            disabled: !1,
            create: null
        },
        _createWidget: function(t, r) {
            r = n(r || this.defaultElement || this)[0];
            this.element = n(r);
            this.uuid = i++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.bindings = n();
            this.hoverable = n();
            this.focusable = n();
            this.classesElementLookup = {};
            r !== this && (n.data(r, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(n) {
                    n.target === r && this.destroy()
                }
            }), this.document = n(r.style ? r.ownerDocument : r.document || r), this.window = n(this.document[0].defaultView || this.document[0].parentWindow));
            this.options = n.widget.extend({}, this.options, this._getCreateOptions(), t);
            this._create();
            this.options.disabled && this._setOptionDisabled(this.options.disabled);
            this._trigger("create", null, this._getCreateEventData());
            this._init()
        },
        _getCreateOptions: function() {
            return {}
        },
        _getCreateEventData: n.noop,
        _create: n.noop,
        _init: n.noop,
        destroy: function() {
            var t = this;
            this._destroy();
            n.each(this.classesElementLookup, function(n, i) {
                t._removeClass(i, n)
            });
            this.element.off(this.eventNamespace).removeData(this.widgetFullName);
            this.widget().off(this.eventNamespace).removeAttr("aria-disabled");
            this.bindings.off(this.eventNamespace)
        },
        _destroy: n.noop,
        widget: function() {
            return this.element
        },
        option: function(t, i) {
            var e = t,
                r, u, f;
            if (arguments.length === 0) return n.widget.extend({}, this.options);
            if (typeof t == "string")
                if (e = {}, r = t.split("."), t = r.shift(), r.length) {
                    for (u = e[t] = n.widget.extend({}, this.options[t]), f = 0; f < r.length - 1; f++) u[r[f]] = u[r[f]] || {}, u = u[r[f]];
                    if (t = r.pop(), arguments.length === 1) return u[t] === undefined ? null : u[t];
                    u[t] = i
                } else {
                    if (arguments.length === 1) return this.options[t] === undefined ? null : this.options[t];
                    e[t] = i
                }
            return this._setOptions(e), this
        },
        _setOptions: function(n) {
            var t;
            for (t in n) this._setOption(t, n[t]);
            return this
        },
        _setOption: function(n, t) {
            return n === "classes" && this._setOptionClasses(t), this.options[n] = t, n === "disabled" && this._setOptionDisabled(t), this
        },
        _setOptionClasses: function(t) {
            var i, u, r;
            for (i in t)(r = this.classesElementLookup[i], t[i] !== this.options.classes[i] && r && r.length) && (u = n(r.get()), this._removeClass(r, i), u.addClass(this._classes({
                element: u,
                keys: i,
                classes: t,
                add: !0
            })))
        },
        _setOptionDisabled: function(n) {
            this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!n);
            n && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            })
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            })
        },
        _classes: function(t) {
            function u(u, f) {
                for (var o, e = 0; e < u.length; e++) o = r.classesElementLookup[u[e]] || n(), o = t.add ? n(n.unique(o.get().concat(t.element.get()))) : n(o.not(t.element).get()), r.classesElementLookup[u[e]] = o, i.push(u[e]), f && t.classes[u[e]] && i.push(t.classes[u[e]])
            }
            var i = [],
                r = this;
            return t = n.extend({
                element: this.element,
                classes: this.options.classes || {}
            }, t), this._on(t.element, {
                remove: "_untrackClassesElement"
            }), t.keys && u(t.keys.match(/\S+/g) || [], !0), t.extra && u(t.extra.match(/\S+/g) || []), i.join(" ")
        },
        _untrackClassesElement: function(t) {
            var i = this;
            n.each(i.classesElementLookup, function(r, u) {
                n.inArray(t.target, u) !== -1 && (i.classesElementLookup[r] = n(u.not(t.target).get()))
            })
        },
        _removeClass: function(n, t, i) {
            return this._toggleClass(n, t, i, !1)
        },
        _addClass: function(n, t, i) {
            return this._toggleClass(n, t, i, !0)
        },
        _toggleClass: function(n, t, i, r) {
            r = typeof r == "boolean" ? r : i;
            var u = typeof n == "string" || n === null,
                f = {
                    extra: u ? t : i,
                    keys: u ? n : t,
                    element: u ? this.element : n,
                    add: r
                };
            return f.element.toggleClass(this._classes(f), r), this
        },
        _on: function(t, i, r) {
            var f, u = this;
            typeof t != "boolean" && (r = i, i = t, t = !1);
            r ? (i = f = n(i), this.bindings = this.bindings.add(i)) : (r = i, i = this.element, f = this.widget());
            n.each(r, function(r, e) {
                function o() {
                    if (t || u.options.disabled !== !0 && !n(this).hasClass("ui-state-disabled")) return (typeof e == "string" ? u[e] : e).apply(u, arguments)
                }
                typeof e != "string" && (o.guid = e.guid = e.guid || o.guid || n.guid++);
                var s = r.match(/^([\w:-]*)\s*(.*)$/),
                    h = s[1] + u.eventNamespace,
                    c = s[2];
                if (c) f.on(h, c, o);
                else i.on(h, o)
            })
        },
        _off: function(t, i) {
            i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            t.off(i).off(i);
            this.bindings = n(this.bindings.not(t).get());
            this.focusable = n(this.focusable.not(t).get());
            this.hoverable = n(this.hoverable.not(t).get())
        },
        _delay: function(n, t) {
            function r() {
                return (typeof n == "string" ? i[n] : n).apply(i, arguments)
            }
            var i = this;
            return setTimeout(r, t || 0)
        },
        _hoverable: function(t) {
            this.hoverable = this.hoverable.add(t);
            this._on(t, {
                mouseenter: function(t) {
                    this._addClass(n(t.currentTarget), null, "ui-state-hover")
                },
                mouseleave: function(t) {
                    this._removeClass(n(t.currentTarget), null, "ui-state-hover")
                }
            })
        },
        _focusable: function(t) {
            this.focusable = this.focusable.add(t);
            this._on(t, {
                focusin: function(t) {
                    this._addClass(n(t.currentTarget), null, "ui-state-focus")
                },
                focusout: function(t) {
                    this._removeClass(n(t.currentTarget), null, "ui-state-focus")
                }
            })
        },
        _trigger: function(t, i, r) {
            var u, f, e = this.options[t];
            if (r = r || {}, i = n.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], f = i.originalEvent, f)
                for (u in f) u in i || (i[u] = f[u]);
            return this.element.trigger(i, r), !(n.isFunction(e) && e.apply(this.element[0], [i].concat(r)) === !1 || i.isDefaultPrevented())
        }
    };
    n.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(t, i) {
        n.Widget.prototype["_" + t] = function(r, u, f) {
            typeof u == "string" && (u = {
                effect: u
            });
            var o, e = u ? u === !0 || typeof u == "number" ? i : u.effect || i : t;
            u = u || {};
            typeof u == "number" && (u = {
                duration: u
            });
            o = !n.isEmptyObject(u);
            u.complete = f;
            u.delay && r.delay(u.delay);
            o && n.effects && n.effects.effect[e] ? r[t](u) : e !== t && r[e] ? r[e](u.duration, u.easing, f) : r.queue(function(i) {
                n(this)[t]();
                f && f.call(r[0]);
                i()
            })
        }
    });
    r = n.widget,
        function() {
            function c(n, t, i) {
                return [parseFloat(n[0]) * (h.test(n[0]) ? t / 100 : 1), parseFloat(n[1]) * (h.test(n[1]) ? i / 100 : 1)]
            }

            function r(t, i) {
                return parseInt(n.css(t, i), 10) || 0
            }

            function a(t) {
                var i = t[0];
                return i.nodeType === 9 ? {
                    width: t.width(),
                    height: t.height(),
                    offset: {
                        top: 0,
                        left: 0
                    }
                } : n.isWindow(i) ? {
                    width: t.width(),
                    height: t.height(),
                    offset: {
                        top: t.scrollTop(),
                        left: t.scrollLeft()
                    }
                } : i.preventDefault ? {
                    width: 0,
                    height: 0,
                    offset: {
                        top: i.pageY,
                        left: i.pageX
                    }
                } : {
                    width: t.outerWidth(),
                    height: t.outerHeight(),
                    offset: t.offset()
                }
            }
            var u, i = Math.max,
                t = Math.abs,
                f = /left|center|right/,
                e = /top|center|bottom/,
                o = /[\+\-]\d+(\.[\d]+)?%?/,
                s = /^\w+/,
                h = /%$/,
                l = n.fn.position;
            n.position = {
                scrollbarWidth: function() {
                    if (u !== undefined) return u;
                    var r, i, t = n("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'><\/div><\/div>"),
                        f = t.children()[0];
                    return n("body").append(t), r = f.offsetWidth, t.css("overflow", "scroll"), i = f.offsetWidth, r === i && (i = t[0].clientWidth), t.remove(), u = r - i
                },
                getScrollInfo: function(t) {
                    var i = t.isWindow || t.isDocument ? "" : t.element.css("overflow-x"),
                        r = t.isWindow || t.isDocument ? "" : t.element.css("overflow-y"),
                        u = i === "scroll" || i === "auto" && t.width < t.element[0].scrollWidth,
                        f = r === "scroll" || r === "auto" && t.height < t.element[0].scrollHeight;
                    return {
                        width: f ? n.position.scrollbarWidth() : 0,
                        height: u ? n.position.scrollbarWidth() : 0
                    }
                },
                getWithinInfo: function(t) {
                    var i = n(t || window),
                        r = n.isWindow(i[0]),
                        u = !!i[0] && i[0].nodeType === 9,
                        f = !r && !u;
                    return {
                        element: i,
                        isWindow: r,
                        isDocument: u,
                        offset: f ? n(t).offset() : {
                            left: 0,
                            top: 0
                        },
                        scrollLeft: i.scrollLeft(),
                        scrollTop: i.scrollTop(),
                        width: i.outerWidth(),
                        height: i.outerHeight()
                    }
                }
            };
            n.fn.position = function(u) {
                if (!u || !u.of) return l.apply(this, arguments);
                u = n.extend({}, u);
                var w, h, v, p, y, k, d = n(u.of),
                    nt = n.position.getWithinInfo(u.within),
                    tt = n.position.getScrollInfo(nt),
                    b = (u.collision || "flip").split(" "),
                    g = {};
                return k = a(d), d[0].preventDefault && (u.at = "left top"), h = k.width, v = k.height, p = k.offset, y = n.extend({}, p), n.each(["my", "at"], function() {
                    var n = (u[this] || "").split(" "),
                        t, i;
                    n.length === 1 && (n = f.test(n[0]) ? n.concat(["center"]) : e.test(n[0]) ? ["center"].concat(n) : ["center", "center"]);
                    n[0] = f.test(n[0]) ? n[0] : "center";
                    n[1] = e.test(n[1]) ? n[1] : "center";
                    t = o.exec(n[0]);
                    i = o.exec(n[1]);
                    g[this] = [t ? t[0] : 0, i ? i[0] : 0];
                    u[this] = [s.exec(n[0])[0], s.exec(n[1])[0]]
                }), b.length === 1 && (b[1] = b[0]), u.at[0] === "right" ? y.left += h : u.at[0] === "center" && (y.left += h / 2), u.at[1] === "bottom" ? y.top += v : u.at[1] === "center" && (y.top += v / 2), w = c(g.at, h, v), y.left += w[0], y.top += w[1], this.each(function() {
                    var a, k, e = n(this),
                        o = e.outerWidth(),
                        s = e.outerHeight(),
                        it = r(this, "marginLeft"),
                        rt = r(this, "marginTop"),
                        ut = o + it + r(this, "marginRight") + tt.width,
                        ft = s + rt + r(this, "marginBottom") + tt.height,
                        f = n.extend({}, y),
                        l = c(g.my, e.outerWidth(), e.outerHeight());
                    u.my[0] === "right" ? f.left -= o : u.my[0] === "center" && (f.left -= o / 2);
                    u.my[1] === "bottom" ? f.top -= s : u.my[1] === "center" && (f.top -= s / 2);
                    f.left += l[0];
                    f.top += l[1];
                    a = {
                        marginLeft: it,
                        marginTop: rt
                    };
                    n.each(["left", "top"], function(t, i) {
                        n.ui.position[b[t]] && n.ui.position[b[t]][i](f, {
                            targetWidth: h,
                            targetHeight: v,
                            elemWidth: o,
                            elemHeight: s,
                            collisionPosition: a,
                            collisionWidth: ut,
                            collisionHeight: ft,
                            offset: [w[0] + l[0], w[1] + l[1]],
                            my: u.my,
                            at: u.at,
                            within: nt,
                            elem: e
                        })
                    });
                    u.using && (k = function(n) {
                        var r = p.left - f.left,
                            a = r + h - o,
                            c = p.top - f.top,
                            y = c + v - s,
                            l = {
                                target: {
                                    element: d,
                                    left: p.left,
                                    top: p.top,
                                    width: h,
                                    height: v
                                },
                                element: {
                                    element: e,
                                    left: f.left,
                                    top: f.top,
                                    width: o,
                                    height: s
                                },
                                horizontal: a < 0 ? "left" : r > 0 ? "right" : "center",
                                vertical: y < 0 ? "top" : c > 0 ? "bottom" : "middle"
                            };
                        h < o && t(r + a) < h && (l.horizontal = "center");
                        v < s && t(c + y) < v && (l.vertical = "middle");
                        l.important = i(t(r), t(a)) > i(t(c), t(y)) ? "horizontal" : "vertical";
                        u.using.call(this, n, l)
                    });
                    e.offset(n.extend(f, {
                        using: k
                    }))
                })
            };
            n.ui.position = {
                fit: {
                    left: function(n, t) {
                        var e = t.within,
                            u = e.isWindow ? e.scrollLeft : e.offset.left,
                            o = e.width,
                            s = n.left - t.collisionPosition.marginLeft,
                            r = u - s,
                            f = s + t.collisionWidth - o - u,
                            h;
                        t.collisionWidth > o ? r > 0 && f <= 0 ? (h = n.left + r + t.collisionWidth - o - u, n.left += r - h) : n.left = f > 0 && r <= 0 ? u : r > f ? u + o - t.collisionWidth : u : r > 0 ? n.left += r : f > 0 ? n.left -= f : n.left = i(n.left - s, n.left)
                    },
                    top: function(n, t) {
                        var o = t.within,
                            u = o.isWindow ? o.scrollTop : o.offset.top,
                            e = t.within.height,
                            s = n.top - t.collisionPosition.marginTop,
                            r = u - s,
                            f = s + t.collisionHeight - e - u,
                            h;
                        t.collisionHeight > e ? r > 0 && f <= 0 ? (h = n.top + r + t.collisionHeight - e - u, n.top += r - h) : n.top = f > 0 && r <= 0 ? u : r > f ? u + e - t.collisionHeight : u : r > 0 ? n.top += r : f > 0 ? n.top -= f : n.top = i(n.top - s, n.top)
                    }
                },
                flip: {
                    left: function(n, i) {
                        var r = i.within,
                            y = r.offset.left + r.scrollLeft,
                            c = r.width,
                            o = r.isWindow ? r.scrollLeft : r.offset.left,
                            l = n.left - i.collisionPosition.marginLeft,
                            a = l - o,
                            v = l + i.collisionWidth - c - o,
                            u = i.my[0] === "left" ? -i.elemWidth : i.my[0] === "right" ? i.elemWidth : 0,
                            f = i.at[0] === "left" ? i.targetWidth : i.at[0] === "right" ? -i.targetWidth : 0,
                            e = -2 * i.offset[0],
                            s, h;
                        a < 0 ? (s = n.left + u + f + e + i.collisionWidth - c - y, (s < 0 || s < t(a)) && (n.left += u + f + e)) : v > 0 && (h = n.left - i.collisionPosition.marginLeft + u + f + e - o, (h > 0 || t(h) < v) && (n.left += u + f + e))
                    },
                    top: function(n, i) {
                        var r = i.within,
                            y = r.offset.top + r.scrollTop,
                            c = r.height,
                            o = r.isWindow ? r.scrollTop : r.offset.top,
                            l = n.top - i.collisionPosition.marginTop,
                            a = l - o,
                            v = l + i.collisionHeight - c - o,
                            p = i.my[1] === "top",
                            u = p ? -i.elemHeight : i.my[1] === "bottom" ? i.elemHeight : 0,
                            f = i.at[1] === "top" ? i.targetHeight : i.at[1] === "bottom" ? -i.targetHeight : 0,
                            e = -2 * i.offset[1],
                            s, h;
                        a < 0 ? (h = n.top + u + f + e + i.collisionHeight - c - y, (h < 0 || h < t(a)) && (n.top += u + f + e)) : v > 0 && (s = n.top - i.collisionPosition.marginTop + u + f + e - o, (s > 0 || t(s) < v) && (n.top += u + f + e))
                    }
                },
                flipfit: {
                    left: function() {
                        n.ui.position.flip.left.apply(this, arguments);
                        n.ui.position.fit.left.apply(this, arguments)
                    },
                    top: function() {
                        n.ui.position.flip.top.apply(this, arguments);
                        n.ui.position.fit.top.apply(this, arguments)
                    }
                }
            }
        }();
    var e = n.ui.position,
        o = n.extend(n.expr[":"], {
            data: n.expr.createPseudo ? n.expr.createPseudo(function(t) {
                return function(i) {
                    return !!n.data(i, t)
                }
            }) : function(t, i, r) {
                return !!n.data(t, r[3])
            }
        }),
        s = n.ui.keyCode = {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        },
        h = n.fn.extend({
            uniqueId: function() {
                var n = 0;
                return function() {
                    return this.each(function() {
                        this.id || (this.id = "ui-id-" + ++n)
                    })
                }
            }(),
            removeUniqueId: function() {
                return this.each(function() {
                    /^ui-id-\d+$/.test(this.id) && n(this).removeAttr("id")
                })
            }
        }),
        c = n.ui.safeActiveElement = function(n) {
            var t;
            try {
                t = n.activeElement
            } catch (i) {
                t = n.body
            }
            return t || (t = n.body), t.nodeName || (t = n.body), t
        },
        l = n.widget("ui.menu", {
            version: "1.12.1",
            defaultElement: "<ul>",
            delay: 300,
            options: {
                icons: {
                    submenu: "ui-icon-caret-1-e"
                },
                items: "> *",
                menus: "ul",
                position: {
                    my: "left top",
                    at: "right top"
                },
                role: "menu",
                blur: null,
                focus: null,
                select: null
            },
            _create: function() {
                this.activeMenu = this.element;
                this.mouseHandled = !1;
                this.element.uniqueId().attr({
                    role: this.options.role,
                    tabIndex: 0
                });
                this._addClass("ui-menu", "ui-widget ui-widget-content");
                this._on({
                    "mousedown .ui-menu-item": function(n) {
                        n.preventDefault()
                    },
                    "click .ui-menu-item": function(t) {
                        var i = n(t.target),
                            r = n(n.ui.safeActiveElement(this.document[0]));
                        !this.mouseHandled && i.not(".ui-state-disabled").length && (this.select(t), t.isPropagationStopped() || (this.mouseHandled = !0), i.has(".ui-menu").length ? this.expand(t) : !this.element.is(":focus") && r.closest(".ui-menu").length && (this.element.trigger("focus", [!0]), this.active && this.active.parents(".ui-menu").length === 1 && clearTimeout(this.timer)))
                    },
                    "mouseenter .ui-menu-item": function(t) {
                        if (!this.previousFilter) {
                            var r = n(t.target).closest(".ui-menu-item"),
                                i = n(t.currentTarget);
                            r[0] === i[0] && (this._removeClass(i.siblings().children(".ui-state-active"), null, "ui-state-active"), this.focus(t, i))
                        }
                    },
                    mouseleave: "collapseAll",
                    "mouseleave .ui-menu": "collapseAll",
                    focus: function(n, t) {
                        var i = this.active || this.element.find(this.options.items).eq(0);
                        t || this.focus(n, i)
                    },
                    blur: function(t) {
                        this._delay(function() {
                            var i = !n.contains(this.element[0], n.ui.safeActiveElement(this.document[0]));
                            i && this.collapseAll(t)
                        })
                    },
                    keydown: "_keydown"
                });
                this.refresh();
                this._on(this.document, {
                    click: function(n) {
                        this._closeOnDocumentClick(n) && this.collapseAll(n);
                        this.mouseHandled = !1
                    }
                })
            },
            _destroy: function() {
                var t = this.element.find(".ui-menu-item").removeAttr("role aria-disabled"),
                    i = t.children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");
                this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex").removeUniqueId().show();
                i.children().each(function() {
                    var t = n(this);
                    t.data("ui-menu-submenu-caret") && t.remove()
                })
            },
            _keydown: function(t) {
                var i, u, r, f, e = !0;
                switch (t.keyCode) {
                    case n.ui.keyCode.PAGE_UP:
                        this.previousPage(t);
                        break;
                    case n.ui.keyCode.PAGE_DOWN:
                        this.nextPage(t);
                        break;
                    case n.ui.keyCode.HOME:
                        this._move("first", "first", t);
                        break;
                    case n.ui.keyCode.END:
                        this._move("last", "last", t);
                        break;
                    case n.ui.keyCode.UP:
                        this.previous(t);
                        break;
                    case n.ui.keyCode.DOWN:
                        this.next(t);
                        break;
                    case n.ui.keyCode.LEFT:
                        this.collapse(t);
                        break;
                    case n.ui.keyCode.RIGHT:
                        this.active && !this.active.is(".ui-state-disabled") && this.expand(t);
                        break;
                    case n.ui.keyCode.ENTER:
                    case n.ui.keyCode.SPACE:
                        this._activate(t);
                        break;
                    case n.ui.keyCode.ESCAPE:
                        this.collapse(t);
                        break;
                    default:
                        e = !1;
                        u = this.previousFilter || "";
                        f = !1;
                        r = t.keyCode >= 96 && t.keyCode <= 105 ? (t.keyCode - 96).toString() : String.fromCharCode(t.keyCode);
                        clearTimeout(this.filterTimer);
                        r === u ? f = !0 : r = u + r;
                        i = this._filterMenuItems(r);
                        i = f && i.index(this.active.next()) !== -1 ? this.active.nextAll(".ui-menu-item") : i;
                        i.length || (r = String.fromCharCode(t.keyCode), i = this._filterMenuItems(r));
                        i.length ? (this.focus(t, i), this.previousFilter = r, this.filterTimer = this._delay(function() {
                            delete this.previousFilter
                        }, 1e3)) : delete this.previousFilter
                }
                e && t.preventDefault()
            },
            _activate: function(n) {
                this.active && !this.active.is(".ui-state-disabled") && (this.active.children("[aria-haspopup='true']").length ? this.expand(n) : this.select(n))
            },
            refresh: function() {
                var u, t, f, i, e, r = this,
                    s = this.options.icons.submenu,
                    o = this.element.find(this.options.menus);
                this._toggleClass("ui-menu-icons", null, !!this.element.find(".ui-icon").length);
                f = o.filter(":not(.ui-menu)").hide().attr({
                    role: this.options.role,
                    "aria-hidden": "true",
                    "aria-expanded": "false"
                }).each(function() {
                    var t = n(this),
                        i = t.prev(),
                        u = n("<span>").data("ui-menu-submenu-caret", !0);
                    r._addClass(u, "ui-menu-icon", "ui-icon " + s);
                    i.attr("aria-haspopup", "true").prepend(u);
                    t.attr("aria-labelledby", i.attr("id"))
                });
                this._addClass(f, "ui-menu", "ui-widget ui-widget-content ui-front");
                u = o.add(this.element);
                t = u.find(this.options.items);
                t.not(".ui-menu-item").each(function() {
                    var t = n(this);
                    r._isDivider(t) && r._addClass(t, "ui-menu-divider", "ui-widget-content")
                });
                i = t.not(".ui-menu-item, .ui-menu-divider");
                e = i.children().not(".ui-menu").uniqueId().attr({
                    tabIndex: -1,
                    role: this._itemRole()
                });
                this._addClass(i, "ui-menu-item")._addClass(e, "ui-menu-item-wrapper");
                t.filter(".ui-state-disabled").attr("aria-disabled", "true");
                this.active && !n.contains(this.element[0], this.active[0]) && this.blur()
            },
            _itemRole: function() {
                return {
                    menu: "menuitem",
                    listbox: "option"
                }[this.options.role]
            },
            _setOption: function(n, t) {
                if (n === "icons") {
                    var i = this.element.find(".ui-menu-icon");
                    this._removeClass(i, null, this.options.icons.submenu)._addClass(i, null, t.submenu)
                }
                this._super(n, t)
            },
            _setOptionDisabled: function(n) {
                this._super(n);
                this.element.attr("aria-disabled", String(n));
                this._toggleClass(null, "ui-state-disabled", !!n)
            },
            focus: function(n, t) {
                var i, r, u;
                this.blur(n, n && n.type === "focus");
                this._scrollIntoView(t);
                this.active = t.first();
                r = this.active.children(".ui-menu-item-wrapper");
                this._addClass(r, null, "ui-state-active");
                this.options.role && this.element.attr("aria-activedescendant", r.attr("id"));
                u = this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper");
                this._addClass(u, null, "ui-state-active");
                n && n.type === "keydown" ? this._close() : this.timer = this._delay(function() {
                    this._close()
                }, this.delay);
                i = t.children(".ui-menu");
                i.length && n && /^mouse/.test(n.type) && this._startOpening(i);
                this.activeMenu = t.parent();
                this._trigger("focus", n, {
                    item: t
                })
            },
            _scrollIntoView: function(t) {
                var e, o, i, r, u, f;
                this._hasScroll() && (e = parseFloat(n.css(this.activeMenu[0], "borderTopWidth")) || 0, o = parseFloat(n.css(this.activeMenu[0], "paddingTop")) || 0, i = t.offset().top - this.activeMenu.offset().top - e - o, r = this.activeMenu.scrollTop(), u = this.activeMenu.height(), f = t.outerHeight(), i < 0 ? this.activeMenu.scrollTop(r + i) : i + f > u && this.activeMenu.scrollTop(r + i - u + f))
            },
            blur: function(n, t) {
                (t || clearTimeout(this.timer), this.active) && (this._removeClass(this.active.children(".ui-menu-item-wrapper"), null, "ui-state-active"), this._trigger("blur", n, {
                    item: this.active
                }), this.active = null)
            },
            _startOpening: function(n) {
                (clearTimeout(this.timer), n.attr("aria-hidden") === "true") && (this.timer = this._delay(function() {
                    this._close();
                    this._open(n)
                }, this.delay))
            },
            _open: function(t) {
                var i = n.extend({ of: this.active
                }, this.options.position);
                clearTimeout(this.timer);
                this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden", "true");
                t.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i)
            },
            collapseAll: function(t, i) {
                clearTimeout(this.timer);
                this.timer = this._delay(function() {
                    var r = i ? this.element : n(t && t.target).closest(this.element.find(".ui-menu"));
                    r.length || (r = this.element);
                    this._close(r);
                    this.blur(t);
                    this._removeClass(r.find(".ui-state-active"), null, "ui-state-active");
                    this.activeMenu = r
                }, this.delay)
            },
            _close: function(n) {
                n || (n = this.active ? this.active.parent() : this.element);
                n.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false")
            },
            _closeOnDocumentClick: function(t) {
                return !n(t.target).closest(".ui-menu").length
            },
            _isDivider: function(n) {
                return !/[^\-\u2014\u2013\s]/.test(n.text())
            },
            collapse: function(n) {
                var t = this.active && this.active.parent().closest(".ui-menu-item", this.element);
                t && t.length && (this._close(), this.focus(n, t))
            },
            expand: function(n) {
                var t = this.active && this.active.children(".ui-menu ").find(this.options.items).first();
                t && t.length && (this._open(t.parent()), this._delay(function() {
                    this.focus(n, t)
                }))
            },
            next: function(n) {
                this._move("next", "first", n)
            },
            previous: function(n) {
                this._move("prev", "last", n)
            },
            isFirstItem: function() {
                return this.active && !this.active.prevAll(".ui-menu-item").length
            },
            isLastItem: function() {
                return this.active && !this.active.nextAll(".ui-menu-item").length
            },
            _move: function(n, t, i) {
                var r;
                this.active && (r = n === "first" || n === "last" ? this.active[n === "first" ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[n + "All"](".ui-menu-item").eq(0));
                r && r.length && this.active || (r = this.activeMenu.find(this.options.items)[t]());
                this.focus(i, r)
            },
            nextPage: function(t) {
                var i, r, u;
                if (!this.active) {
                    this.next(t);
                    return
                }
                this.isLastItem() || (this._hasScroll() ? (r = this.active.offset().top, u = this.element.height(), this.active.nextAll(".ui-menu-item").each(function() {
                    return i = n(this), i.offset().top - r - u < 0
                }), this.focus(t, i)) : this.focus(t, this.activeMenu.find(this.options.items)[this.active ? "last" : "first"]()))
            },
            previousPage: function(t) {
                var i, r, u;
                if (!this.active) {
                    this.next(t);
                    return
                }
                this.isFirstItem() || (this._hasScroll() ? (r = this.active.offset().top, u = this.element.height(), this.active.prevAll(".ui-menu-item").each(function() {
                    return i = n(this), i.offset().top - r + u > 0
                }), this.focus(t, i)) : this.focus(t, this.activeMenu.find(this.options.items).first()))
            },
            _hasScroll: function() {
                return this.element.outerHeight() < this.element.prop("scrollHeight")
            },
            select: function(t) {
                this.active = this.active || n(t.target).closest(".ui-menu-item");
                var i = {
                    item: this.active
                };
                this.active.has(".ui-menu").length || this.collapseAll(t, !0);
                this._trigger("select", t, i)
            },
            _filterMenuItems: function(t) {
                var i = t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"),
                    r = new RegExp("^" + i, "i");
                return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function() {
                    return r.test(n.trim(n(this).children(".ui-menu-item-wrapper").text()))
                })
            }
        });
    n.widget("ui.autocomplete", {
        version: "1.12.1",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        requestIndex: 0,
        pending: 0,
        _create: function() {
            var t, i, r, u = this.element[0].nodeName.toLowerCase(),
                f = u === "textarea",
                e = u === "input";
            this.isMultiLine = f || !e && this._isContentEditable(this.element);
            this.valueMethod = this.element[f || e ? "val" : "text"];
            this.isNewMenu = !0;
            this._addClass("ui-autocomplete-input");
            this.element.attr("autocomplete", "off");
            this._on(this.element, {
                keydown: function(u) {
                    if (this.element.prop("readOnly")) {
                        t = !0;
                        r = !0;
                        i = !0;
                        return
                    }
                    t = !1;
                    r = !1;
                    i = !1;
                    var f = n.ui.keyCode;
                    switch (u.keyCode) {
                        case f.PAGE_UP:
                            t = !0;
                            this._move("previousPage", u);
                            break;
                        case f.PAGE_DOWN:
                            t = !0;
                            this._move("nextPage", u);
                            break;
                        case f.UP:
                            t = !0;
                            this._keyEvent("previous", u);
                            break;
                        case f.DOWN:
                            t = !0;
                            this._keyEvent("next", u);
                            break;
                        case f.ENTER:
                            this.menu.active && (t = !0, u.preventDefault(), this.menu.select(u));
                            break;
                        case f.TAB:
                            this.menu.active && this.menu.select(u);
                            break;
                        case f.ESCAPE:
                            this.menu.element.is(":visible") && (this.isMultiLine || this._value(this.term), this.close(u), u.preventDefault());
                            break;
                        default:
                            i = !0;
                            this._searchTimeout(u)
                    }
                },
                keypress: function(r) {
                    if (t) {
                        t = !1;
                        (!this.isMultiLine || this.menu.element.is(":visible")) && r.preventDefault();
                        return
                    }
                    if (!i) {
                        var u = n.ui.keyCode;
                        switch (r.keyCode) {
                            case u.PAGE_UP:
                                this._move("previousPage", r);
                                break;
                            case u.PAGE_DOWN:
                                this._move("nextPage", r);
                                break;
                            case u.UP:
                                this._keyEvent("previous", r);
                                break;
                            case u.DOWN:
                                this._keyEvent("next", r)
                        }
                    }
                },
                input: function(n) {
                    if (r) {
                        r = !1;
                        n.preventDefault();
                        return
                    }
                    this._searchTimeout(n)
                },
                focus: function() {
                    this.selectedItem = null;
                    this.previous = this._value()
                },
                blur: function(n) {
                    if (this.cancelBlur) {
                        delete this.cancelBlur;
                        return
                    }
                    clearTimeout(this.searching);
                    this.close(n);
                    this._change(n)
                }
            });
            this._initSource();
            this.menu = n("<ul>").appendTo(this._appendTo()).menu({
                role: null
            }).hide().menu("instance");
            this._addClass(this.menu.element, "ui-autocomplete", "ui-front");
            this._on(this.menu.element, {
                mousedown: function(t) {
                    t.preventDefault();
                    this.cancelBlur = !0;
                    this._delay(function() {
                        delete this.cancelBlur;
                        this.element[0] !== n.ui.safeActiveElement(this.document[0]) && this.element.trigger("focus")
                    })
                },
                menufocus: function(t, i) {
                    var r, u;
                    if (this.isNewMenu && (this.isNewMenu = !1, t.originalEvent && /^mouse/.test(t.originalEvent.type))) {
                        this.menu.blur();
                        this.document.one("mousemove", function() {
                            n(t.target).trigger(t.originalEvent)
                        });
                        return
                    }
                    u = i.item.data("ui-autocomplete-item");
                    !1 !== this._trigger("focus", t, {
                        item: u
                    }) && t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(u.value);
                    r = i.item.attr("aria-label") || u.value;
                    r && n.trim(r).length && (this.liveRegion.children().hide(), n("<div>").text(r).appendTo(this.liveRegion))
                },
                menuselect: function(t, i) {
                    var r = i.item.data("ui-autocomplete-item"),
                        u = this.previous;
                    this.element[0] !== n.ui.safeActiveElement(this.document[0]) && (this.element.trigger("focus"), this.previous = u, this._delay(function() {
                        this.previous = u;
                        this.selectedItem = r
                    }));
                    !1 !== this._trigger("select", t, {
                        item: r
                    }) && this._value(r.value);
                    this.term = this._value();
                    this.close(t);
                    this.selectedItem = r
                }
            });
            this.liveRegion = n("<div>", {
                role: "status",
                "aria-live": "assertive",
                "aria-relevant": "additions"
            }).appendTo(this.document[0].body);
            this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible");
            this._on(this.window, {
                beforeunload: function() {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _destroy: function() {
            clearTimeout(this.searching);
            this.element.removeAttr("autocomplete");
            this.menu.element.remove();
            this.liveRegion.remove()
        },
        _setOption: function(n, t) {
            this._super(n, t);
            n === "source" && this._initSource();
            n === "appendTo" && this.menu.element.appendTo(this._appendTo());
            n === "disabled" && t && this.xhr && this.xhr.abort()
        },
        _isEventTargetInWidget: function(t) {
            var i = this.menu.element[0];
            return t.target === this.element[0] || t.target === i || n.contains(i, t.target)
        },
        _closeOnClickOutside: function(n) {
            this._isEventTargetInWidget(n) || this.close()
        },
        _appendTo: function() {
            var t = this.options.appendTo;
            return t && (t = t.jquery || t.nodeType ? n(t) : this.document.find(t).eq(0)), t && t[0] || (t = this.element.closest(".ui-front, dialog")), t.length || (t = this.document[0].body), t
        },
        _initSource: function() {
            var i, r, t = this;
            n.isArray(this.options.source) ? (i = this.options.source, this.source = function(t, r) {
                r(n.ui.autocomplete.filter(i, t.term))
            }) : typeof this.options.source == "string" ? (r = this.options.source, this.source = function(i, u) {
                t.xhr && t.xhr.abort();
                t.xhr = n.ajax({
                    url: r,
                    data: i,
                    dataType: "json",
                    success: function(n) {
                        u(n)
                    },
                    error: function() {
                        u([])
                    }
                })
            }) : this.source = this.options.source
        },
        _searchTimeout: function(n) {
            clearTimeout(this.searching);
            this.searching = this._delay(function() {
                var t = this.term === this._value(),
                    i = this.menu.element.is(":visible"),
                    r = n.altKey || n.ctrlKey || n.metaKey || n.shiftKey;
                t && (!t || i || r) || (this.selectedItem = null, this.search(null, n))
            }, this.options.delay)
        },
        search: function(n, t) {
            return (n = n != null ? n : this._value(), this.term = this._value(), n.length < this.options.minLength) ? this.close(t) : this._trigger("search", t) === !1 ? void 0 : this._search(n)
        },
        _search: function(n) {
            this.pending++;
            this._addClass("ui-autocomplete-loading");
            this.cancelSearch = !1;
            this.source({
                term: n
            }, this._response())
        },
        _response: function() {
            var t = ++this.requestIndex;
            return n.proxy(function(n) {
                t === this.requestIndex && this.__response(n);
                this.pending--;
                this.pending || this._removeClass("ui-autocomplete-loading")
            }, this)
        },
        __response: function(n) {
            n && (n = this._normalize(n));
            this._trigger("response", null, {
                content: n
            });
            !this.options.disabled && n && n.length && !this.cancelSearch ? (this._suggest(n), this._trigger("open")) : this._close()
        },
        close: function(n) {
            this.cancelSearch = !0;
            this._close(n)
        },
        _close: function(n) {
            this._off(this.document, "mousedown");
            this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", n))
        },
        _change: function(n) {
            this.previous !== this._value() && this._trigger("change", n, {
                item: this.selectedItem
            })
        },
        _normalize: function(t) {
            return t.length && t[0].label && t[0].value ? t : n.map(t, function(t) {
                return typeof t == "string" ? {
                    label: t,
                    value: t
                } : n.extend({}, t, {
                    label: t.label || t.value,
                    value: t.value || t.label
                })
            })
        },
        _suggest: function(t) {
            var i = this.menu.element.empty();
            this._renderMenu(i, t);
            this.isNewMenu = !0;
            this.menu.refresh();
            i.show();
            this._resizeMenu();
            i.position(n.extend({ of: this.element
            }, this.options.position));
            this.options.autoFocus && this.menu.next();
            this._on(this.document, {
                mousedown: "_closeOnClickOutside"
            })
        },
        _resizeMenu: function() {
            var n = this.menu.element;
            n.outerWidth(Math.max(n.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function(t, i) {
            var r = this;
            n.each(i, function(n, i) {
                r._renderItemData(t, i)
            })
        },
        _renderItemData: function(n, t) {
            return this._renderItem(n, t).data("ui-autocomplete-item", t)
        },
        _renderItem: function(t, i) {
            return n("<li>").append(n("<div>").text(i.label)).appendTo(t)
        },
        _move: function(n, t) {
            if (!this.menu.element.is(":visible")) {
                this.search(null, t);
                return
            }
            if (this.menu.isFirstItem() && /^previous/.test(n) || this.menu.isLastItem() && /^next/.test(n)) {
                this.isMultiLine || this._value(this.term);
                this.menu.blur();
                return
            }
            this.menu[n](t)
        },
        widget: function() {
            return this.menu.element
        },
        _value: function() {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function(n, t) {
            (!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(n, t), t.preventDefault())
        },
        _isContentEditable: function(n) {
            if (!n.length) return !1;
            var t = n.prop("contentEditable");
            return t === "inherit" ? this._isContentEditable(n.parent()) : t === "true"
        }
    });
    n.extend(n.ui.autocomplete, {
        escapeRegex: function(n) {
            return n.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        },
        filter: function(t, i) {
            var r = new RegExp(n.ui.autocomplete.escapeRegex(i), "i");
            return n.grep(t, function(n) {
                return r.test(n.label || n.value || n)
            })
        }
    });
    n.widget("ui.autocomplete", n.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function(n) {
                    return n + (n > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        },
        __response: function(t) {
            var i;
            (this._superApply(arguments), this.options.disabled || this.cancelSearch) || (i = t && t.length ? this.options.messages.results(t.length) : this.options.messages.noResults, this.liveRegion.children().hide(), n("<div>").text(i).appendTo(this.liveRegion))
        }
    });
    u = n.ui.autocomplete
});
$(function() {
        $(".keyword-field input").autocomplete({
            source: function(n, t) {
                $.getJSON("/services/GetFilteredKeyword?term=" + n.term, function(n) {
                    var i = $.map(n, function(n) {
                        return {
                            label: n.label,
                            value: '"' + n.value + '"',
                            jobCount: n.JobCount
                        }
                    });
                    i.sort(function(n, t) {
                        return n.jobCount == t.jobCount ? 0 : n.jobCount < t.jobCount ? 1 : -1
                    });
                    t(i.slice(0, 10))
                })
            },
            select: function(n, t) {
                $(n.target).val(t.item.value);
                $("#submitFormImg").click()
            }
        });
        monkeyPatchAutoComplete();
        $(".slct").multiselect({
            nSelectedText: "selected",
            nonSelectedText: "selected",
            buttonText: function(n, t) {
                return $(t).data("name")
            }
        });
        $(".drpdwn").selectpicker({
            style: "btn-default",
            selectedTextFormat: "static"
        });
        OpenSelectedDropdown();
        $(".filters select").change(function() {
            for (var r = $(this).closest("form").find("input[name='dd']"), t = this.className.split(" "), i = "", n = 0; n < t.length; n++) t[n].indexOf("slct-") === -1 && t[n].indexOf("drpdwn-") === -1 || (i = t[n]);
            $(r[0]).val(i);
            $(this).closest("form").submit()
        });
        $(".filters-mob .checkbox input").change(function() {
            for (var r, u, f = $(this).closest("form").find("input[name='dd']"), e = $(this).closest(".panel-collapse"), t = e[0].className.split(" "), i = "", n = 0; n < t.length; n++) t[n].indexOf("slct-") === -1 && t[n].indexOf("drpdwn-") === -1 || (i = t[n]);
            ($(f[0]).val(i), $(this).closest("label").hasClass("active")) ? (r = $(this).val().replace(/\s+/g, "+"), u = removeURLParameterByValue(window.location.href, r), window.location.href = u) : $(this).closest("form").submit()
        });
        $(".filters-mob .radio input").change(function() {
            for (var n, u = $(this).closest("form").find("input[name='dd']"), f = $(this).closest(".panel-collapse"), i = f[0].className.split(" "), r = "", t = 0; t < i.length; t++) i[t].indexOf("drpdwn-") !== -1 && (r = i[t]);
            ($(u[0]).val(r), $(".drpdwn-y").find(".radio").hasClass("active")) ? (n = removeURLParameter(window.location.href, "y"), n = removeURLParameter(n, "dd") + "&dd=" + r, n += "&y=" + $(this).val().replace(/\s+/g, "+"), window.location.href = n) : $(this).closest("form").submit()
        });
        $(".filter-tags").click(function() {
            if ($(this).hasClass("clear-all")) removeAllFilters();
            else {
                var t = $(this).data("tag"),
                    i = $("input[name='dd']").val(),
                    n = removeURLParameterByValue(window.location.href, t);
                n = removeURLParameterByValue(n, i);
                window.location.href = n
            }
        });
        $(".load-more-jobs").click(function() {
            return loadMoreJobs(), !1
        });
        $("#submitFormImg").click(function(n) {
            return n.preventDefault(), $("input[name='dd']").val(""), $("form").submit(), !1
        });
        $("form input").keydown(function(n) {
            $("input[name='dd']").val("");
            13 == n.keyCode && ($(this).is("#locationSearch") ? n.preventDefault() : $("form").submit())
        });
        var n = $(".slct option:selected").val();
        "MetroPCS" == n ? ($("body").addClass("metropcs-body"), $(".blu").addClass("metropcs-blue-bgrnd"), $(".loc").removeClass("magenta"), $(".loc").addClass("wht"), $(".submit-btn").removeClass("tmo-submit-btn"), $(".submit-btn").addClass("metro-submit-btn"), $(".btn-magenta").addClass("btn-metropcs"), $(".reset").removeClass("magenta"), $(".reset").addClass("wht"), $(".cta").removeClass("magenta"), $(".cta").addClass("metro-pcs-orange"), $(".load-more-jobs").removeClass("magenta"), $(".load-more-jobs").addClass("metropcs")) : ($("body").removeClass("metropcs-body"), $(".blu").removeClass("metropcs-blue-bgrnd"), $(".loc").removeClass("wht"), $(".loc").addClass("magenta"), $(".submit-btn").removeClass("metro-submit-btn"), $(".submit-btn").addClass("tmo-submit-btn"), $(".apply-btn").removeClass("btn-metropcs"), $(".reset").removeClass("wht"), $(".reset").addClass("magenta"), $(".cta").removeClass("metro-pcs-orange"), $(".cta").addClass("magenta"), $(".load-more-jobs").removeClass("metropcs"), $(".load-more-jobs").addClass("magenta"));
        $(".no-fouc").removeClass("no-fouc")
    }),
    function(n) {
        "use strict";

        function f(t) {
            return n.each([{
                re: /[\xC0-\xC6]/g,
                ch: "A"
            }, {
                re: /[\xE0-\xE6]/g,
                ch: "a"
            }, {
                re: /[\xC8-\xCB]/g,
                ch: "E"
            }, {
                re: /[\xE8-\xEB]/g,
                ch: "e"
            }, {
                re: /[\xCC-\xCF]/g,
                ch: "I"
            }, {
                re: /[\xEC-\xEF]/g,
                ch: "i"
            }, {
                re: /[\xD2-\xD6]/g,
                ch: "O"
            }, {
                re: /[\xF2-\xF6]/g,
                ch: "o"
            }, {
                re: /[\xD9-\xDC]/g,
                ch: "U"
            }, {
                re: /[\xF9-\xFC]/g,
                ch: "u"
            }, {
                re: /[\xC7-\xE7]/g,
                ch: "c"
            }, {
                re: /[\xD1]/g,
                ch: "N"
            }, {
                re: /[\xF1]/g,
                ch: "n"
            }], function() {
                t = t ? t.replace(this.re, this.ch) : ""
            }), t
        }

        function o(i) {
            var f = arguments,
                r = i,
                u, e;
            return [].shift.apply(f), e = this.each(function() {
                var o = n(this),
                    i, e, h, s;
                if (o.is("select")) {
                    if (i = o.data("selectpicker"), e = typeof r == "object" && r, i) {
                        if (e)
                            for (s in e) e.hasOwnProperty(s) && (i.options[s] = e[s])
                    } else h = n.extend({}, t.DEFAULTS, n.fn.selectpicker.defaults || {}, o.data(), e), h.template = n.extend({}, t.DEFAULTS.template, n.fn.selectpicker.defaults ? n.fn.selectpicker.defaults.template : {}, o.data().template, e.template), o.data("selectpicker", i = new t(this, h));
                    typeof r == "string" && (u = i[r] instanceof Function ? i[r].apply(i, f) : i.options[r])
                }
            }), typeof u != "undefined" ? u : e
        }
        var i, r, s;
        String.prototype.includes || function() {
            var i = {}.toString,
                n = function() {
                    try {
                        var n = {},
                            t = Object.defineProperty,
                            i = t(n, n, n) && t
                    } catch (r) {}
                    return i
                }(),
                r = "".indexOf,
                t = function(n) {
                    var u, s;
                    if (this == null) throw new TypeError;
                    if (u = String(this), n && i.call(n) == "[object RegExp]") throw new TypeError;
                    var f = u.length,
                        e = String(n),
                        h = e.length,
                        o = arguments.length > 1 ? arguments[1] : undefined,
                        t = o ? Number(o) : 0;
                    return (t != t && (t = 0), s = Math.min(Math.max(t, 0), f), h + s > f) ? !1 : r.call(u, e, t) != -1
                };
            n ? n(String.prototype, "includes", {
                value: t,
                configurable: !0,
                writable: !0
            }) : String.prototype.includes = t
        }();
        String.prototype.startsWith || function() {
            var n = function() {
                    try {
                        var n = {},
                            t = Object.defineProperty,
                            i = t(n, n, n) && t
                    } catch (r) {}
                    return i
                }(),
                i = {}.toString,
                t = function(n) {
                    var u, f, r;
                    if (this == null) throw new TypeError;
                    if (u = String(this), n && i.call(n) == "[object RegExp]") throw new TypeError;
                    var e = u.length,
                        o = String(n),
                        s = o.length,
                        h = arguments.length > 1 ? arguments[1] : undefined,
                        t = h ? Number(h) : 0;
                    if (t != t && (t = 0), f = Math.min(Math.max(t, 0), e), s + f > e) return !1;
                    for (r = -1; ++r < s;)
                        if (u.charCodeAt(f + r) != o.charCodeAt(r)) return !1;
                    return !0
                };
            n ? n(String.prototype, "startsWith", {
                value: t,
                configurable: !0,
                writable: !0
            }) : String.prototype.startsWith = t
        }();
        Object.keys || (Object.keys = function(n, t, i) {
            i = [];
            for (t in n) i.hasOwnProperty.call(n, t) && i.push(t);
            return i
        });
        i = {
            useDefault: !1,
            _set: n.valHooks.select.set
        };
        n.valHooks.select.set = function(t, r) {
            return r && !i.useDefault && n(t).data("selected", !0), i._set.apply(this, arguments)
        };
        r = null;
        n.fn.triggerNative = function(n) {
            var i = this[0],
                t;
            i.dispatchEvent ? (typeof Event == "function" ? t = new Event(n, {
                bubbles: !0
            }) : (t = document.createEvent("Event"), t.initEvent(n, !0, !1)), i.dispatchEvent(t)) : i.fireEvent ? (t = document.createEventObject(), t.eventType = n, i.fireEvent("on" + n, t)) : this.trigger(n)
        };
        n.expr.pseudos.icontains = function(t, i, r) {
            var u = n(t),
                f = (u.data("tokens") || u.text()).toString().toUpperCase();
            return f.includes(r[3].toUpperCase())
        };
        n.expr.pseudos.ibegins = function(t, i, r) {
            var u = n(t),
                f = (u.data("tokens") || u.text()).toString().toUpperCase();
            return f.startsWith(r[3].toUpperCase())
        };
        n.expr.pseudos.aicontains = function(t, i, r) {
            var u = n(t),
                f = (u.data("tokens") || u.data("normalizedText") || u.text()).toString().toUpperCase();
            return f.includes(r[3].toUpperCase())
        };
        n.expr.pseudos.aibegins = function(t, i, r) {
            var u = n(t),
                f = (u.data("tokens") || u.data("normalizedText") || u.text()).toString().toUpperCase();
            return f.startsWith(r[3].toUpperCase())
        };
        var e = function(n) {
                var i = function(t) {
                        return n[t]
                    },
                    t = "(?:" + Object.keys(n).join("|") + ")",
                    r = RegExp(t),
                    u = RegExp(t, "g");
                return function(n) {
                    return n = n == null ? "" : "" + n, r.test(n) ? n.replace(u, i) : n
                }
            },
            u = e({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            }),
            h = e({
                "&amp;": "&",
                "&lt;": "<",
                "&gt;": ">",
                "&quot;": '"',
                "&#x27;": "'",
                "&#x60;": "`"
            }),
            t = function(r, u) {
                i.useDefault || (n.valHooks.select.set = i._set, i.useDefault = !0);
                this.$element = n(r);
                this.$newElement = null;
                this.$button = null;
                this.$menu = null;
                this.$lis = null;
                this.options = u;
                this.options.title === null && (this.options.title = this.$element.attr("title"));
                var f = this.options.windowPadding;
                typeof f == "number" && (this.options.windowPadding = [f, f, f, f]);
                this.val = t.prototype.val;
                this.render = t.prototype.render;
                this.refresh = t.prototype.refresh;
                this.setStyle = t.prototype.setStyle;
                this.selectAll = t.prototype.selectAll;
                this.deselectAll = t.prototype.deselectAll;
                this.destroy = t.prototype.destroy;
                this.remove = t.prototype.remove;
                this.show = t.prototype.show;
                this.hide = t.prototype.hide;
                this.init()
            };
        t.VERSION = "1.12.2";
        t.DEFAULTS = {
            noneSelectedText: "Nothing selected",
            noneResultsText: "No results matched {0}",
            countSelectedText: function(n) {
                return n == 1 ? "{0} item selected" : "{0} items selected"
            },
            maxOptionsText: function(n, t) {
                return [n == 1 ? "Limit reached ({n} item max)" : "Limit reached ({n} items max)", t == 1 ? "Group limit reached ({n} item max)" : "Group limit reached ({n} items max)"]
            },
            selectAllText: "Select All",
            deselectAllText: "Deselect All",
            doneButton: !1,
            doneButtonText: "Close",
            multipleSeparator: ", ",
            styleBase: "btn",
            style: "btn-default",
            size: "auto",
            title: null,
            selectedTextFormat: "values",
            width: !1,
            container: !1,
            hideDisabled: !1,
            showSubtext: !1,
            showIcon: !0,
            showContent: !0,
            dropupAuto: !0,
            header: !1,
            liveSearch: !1,
            liveSearchPlaceholder: null,
            liveSearchNormalize: !1,
            liveSearchStyle: "contains",
            actionsBox: !1,
            iconBase: "glyphicon",
            tickIcon: "glyphicon-ok",
            showTick: !1,
            template: {
                caret: '<span class="caret"><\/span>'
            },
            maxOptions: !1,
            mobile: !1,
            selectOnTab: !1,
            dropdownAlignRight: !1,
            windowPadding: 0
        };
        t.prototype = {
            constructor: t,
            init: function() {
                var t = this,
                    i = this.$element.attr("id");
                this.$element.addClass("bs-select-hidden");
                this.liObj = {};
                this.multiple = this.$element.prop("multiple");
                this.autofocus = this.$element.prop("autofocus");
                this.$newElement = this.createView();
                this.$element.after(this.$newElement).appendTo(this.$newElement);
                this.$button = this.$newElement.children("button");
                this.$menu = this.$newElement.children(".dropdown-menu");
                this.$menuInner = this.$menu.children(".inner");
                this.$searchbox = this.$menu.find("input");
                this.$element.removeClass("bs-select-hidden");
                this.options.dropdownAlignRight === !0 && this.$menu.addClass("dropdown-menu-right");
                typeof i != "undefined" && (this.$button.attr("data-id", i), n('label[for="' + i + '"]').click(function(n) {
                    n.preventDefault();
                    t.$button.focus()
                }));
                this.checkDisabled();
                this.clickListener();
                this.options.liveSearch && this.liveSearchListener();
                this.render();
                this.setStyle();
                this.setWidth();
                this.options.container && this.selectPosition();
                this.$menu.data("this", this);
                this.$newElement.data("this", this);
                this.options.mobile && this.mobile();
                this.$newElement.on({
                    "hide.bs.dropdown": function(n) {
                        t.$menuInner.attr("aria-expanded", !1);
                        t.$element.trigger("hide.bs.select", n)
                    },
                    "hidden.bs.dropdown": function(n) {
                        t.$element.trigger("hidden.bs.select", n)
                    },
                    "show.bs.dropdown": function(n) {
                        t.$menuInner.attr("aria-expanded", !0);
                        t.$element.trigger("show.bs.select", n)
                    },
                    "shown.bs.dropdown": function(n) {
                        t.$element.trigger("shown.bs.select", n)
                    }
                });
                if (t.$element[0].hasAttribute("required")) this.$element.on("invalid", function() {
                    t.$button.addClass("bs-invalid").focus();
                    t.$element.on({
                        "focus.bs.select": function() {
                            t.$button.focus();
                            t.$element.off("focus.bs.select")
                        },
                        "shown.bs.select": function() {
                            t.$element.val(t.$element.val()).off("shown.bs.select")
                        },
                        "rendered.bs.select": function() {
                            this.validity.valid && t.$button.removeClass("bs-invalid");
                            t.$element.off("rendered.bs.select")
                        }
                    })
                });
                setTimeout(function() {
                    t.$element.trigger("loaded.bs.select")
                })
            },
            createDropdown: function() {
                var t = this.multiple || this.options.showTick ? " show-tick" : "",
                    i = this.$element.parent().hasClass("input-group") ? " input-group-btn" : "",
                    r = this.autofocus ? " autofocus" : "",
                    f = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;<\/button>' + this.options.header + "<\/div>" : "",
                    e = this.options.liveSearch ? '<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"' + (null === this.options.liveSearchPlaceholder ? "" : ' placeholder="' + u(this.options.liveSearchPlaceholder) + '"') + ' role="textbox" aria-label="Search"><\/div>' : "",
                    o = this.multiple && this.options.actionsBox ? '<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn btn-default">' + this.options.selectAllText + '<\/button><button type="button" class="actions-btn bs-deselect-all btn btn-default">' + this.options.deselectAllText + "<\/button><\/div><\/div>" : "",
                    s = this.multiple && this.options.doneButton ? '<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm btn-default">' + this.options.doneButtonText + "<\/button><\/div><\/div>" : "",
                    h = '<div class="btn-group bootstrap-select' + t + i + '"><button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + r + ' role="button"><span class="filter-option"><\/span>&nbsp;<span class="bs-caret">' + this.options.template.caret + '<\/span><\/button><div class="dropdown-menu open" role="combobox">' + f + e + o + '<ul class="dropdown-menu inner" role="listbox" aria-expanded="false"><\/ul>' + s + "<\/div><\/div>";
                return n(h)
            },
            createView: function() {
                var n = this.createDropdown(),
                    t = this.createLi();
                return n.find("ul")[0].innerHTML = t, n
            },
            reloadLi: function() {
                var n = this.createLi();
                this.$menuInner[0].innerHTML = n
            },
            createLi: function() {
                var t = this,
                    i = [],
                    o = 0,
                    s = document.createElement("option"),
                    r = -1,
                    e = function(n, t, i, r) {
                        return "<li" + (typeof i != "undefined" & "" !== i ? ' class="' + i + '"' : "") + (typeof t != "undefined" & null !== t ? ' data-original-index="' + t + '"' : "") + (typeof r != "undefined" & null !== r ? 'data-optgroup="' + r + '"' : "") + ">" + n + "<\/li>"
                    },
                    c = function(i, r, e, o) {
                        return '<a tabindex="0"' + (typeof r != "undefined" ? ' class="' + r + '"' : "") + (e ? ' style="' + e + '"' : "") + (t.options.liveSearchNormalize ? ' data-normalized-text="' + f(u(n(i).html())) + '"' : "") + (typeof o != "undefined" || o !== null ? ' data-tokens="' + o + '"' : "") + ' role="option">' + i + '<span class="' + t.options.iconBase + " " + t.options.tickIcon + ' check-mark"><\/span><\/a>'
                    },
                    h, l;
                return this.options.title && !this.multiple && (r--, this.$element.find(".bs-title-option").length || (h = this.$element[0], s.className = "bs-title-option", s.innerHTML = this.options.title, s.value = "", h.insertBefore(s, h.firstChild), l = n(h.options[h.selectedIndex]), l.attr("selected") === undefined && this.$element.data("selected") === undefined && (s.selected = !0))), this.$element.find("option").each(function(f) {
                    var s = n(this),
                        tt, it, p, w, l, ut, b, ft;
                    if (r++, !s.hasClass("bs-title-option")) {
                        var k = this.className || "",
                            d = this.style.cssText,
                            a = s.data("content") ? s.data("content") : s.html(),
                            g = s.data("tokens") ? s.data("tokens") : null,
                            ot = typeof s.data("subtext") != "undefined" ? '<small class="text-muted">' + s.data("subtext") + "<\/small>" : "",
                            v = typeof s.data("icon") != "undefined" ? '<span class="' + t.options.iconBase + " " + s.data("icon") + '"><\/span> ' : "",
                            h = s.parent(),
                            nt = h[0].tagName === "OPTGROUP",
                            et = nt && h[0].disabled,
                            y = this.disabled || et;
                        if (v !== "" && y && (v = "<span>" + v + "<\/span>"), t.options.hideDisabled && (y && !nt || et)) {
                            r--;
                            return
                        }
                        if (s.data("content") || (a = v + '<span class="text">' + a + ot + "<\/span>"), nt && s.data("divider") !== !0) {
                            if (t.options.hideDisabled && y && (h.data("allOptionsDisabled") === undefined && (tt = h.children(), h.data("allOptionsDisabled", tt.filter(":disabled").length === tt.length)), h.data("allOptionsDisabled"))) {
                                r--;
                                return
                            }
                            if (it = " " + h[0].className || "", s.index() === 0) {
                                o += 1;
                                var rt = h[0].label,
                                    st = typeof h.data("subtext") != "undefined" ? '<small class="text-muted">' + h.data("subtext") + "<\/small>" : "",
                                    ht = h.data("icon") ? '<span class="' + t.options.iconBase + " " + h.data("icon") + '"><\/span> ' : "";
                                rt = ht + '<span class="text">' + u(rt) + st + "<\/span>";
                                f !== 0 && i.length > 0 && (r++, i.push(e("", null, "divider", o + "div")));
                                r++;
                                i.push(e(rt, null, "dropdown-header" + it, o))
                            }
                            if (t.options.hideDisabled && y) {
                                r--;
                                return
                            }
                            i.push(e(c(a, "opt " + k + it, d, g), f, "", o))
                        } else if (s.data("divider") === !0) i.push(e("", f, "divider"));
                        else if (s.data("hidden") === !0) i.push(e(c(a, k, d, g), f, "hidden is-hidden"));
                        else {
                            if (p = this.previousElementSibling && this.previousElementSibling.tagName === "OPTGROUP", !p && t.options.hideDisabled)
                                for (w = n(this).prevAll(), l = 0; l < w.length; l++)
                                    if (w[l].tagName === "OPTGROUP") {
                                        for (ut = 0, b = 0; b < l; b++) ft = w[b], (ft.disabled || n(ft).data("hidden") === !0) && ut++;
                                        ut === l && (p = !0);
                                        break
                                    }
                            p && (r++, i.push(e("", null, "divider", o + "div")));
                            i.push(e(c(a, k, d, g), f))
                        }
                        t.liObj[f] = r
                    }
                }), this.multiple || this.$element.find("option:selected").length !== 0 || this.options.title || this.$element.find("option").eq(0).prop("selected", !0).attr("selected", "selected"), i.join("")
            },
            findLis: function() {
                return this.$lis == null && (this.$lis = this.$menu.find("li")), this.$lis
            },
            render: function(t) {
                var i = this,
                    o, r, u, f, e, s;
                t !== !1 && this.$element.find("option").each(function(n) {
                    var t = i.findLis().eq(i.liObj[n]);
                    i.setDisabled(n, this.disabled || this.parentNode.tagName === "OPTGROUP" && this.parentNode.disabled, t);
                    i.setSelected(n, this.selected, t)
                });
                this.togglePlaceholder();
                this.tabIndex();
                r = this.$element.find("option").map(function() {
                    if (this.selected) {
                        if (i.options.hideDisabled && (this.disabled || this.parentNode.tagName === "OPTGROUP" && this.parentNode.disabled)) return;
                        var t = n(this),
                            u = t.data("icon") && i.options.showIcon ? '<i class="' + i.options.iconBase + " " + t.data("icon") + '"><\/i> ' : "",
                            r;
                        return r = i.options.showSubtext && t.data("subtext") && !i.multiple ? ' <small class="text-muted">' + t.data("subtext") + "<\/small>" : "", typeof t.attr("title") != "undefined" ? t.attr("title") : t.data("content") && i.options.showContent ? t.data("content").toString() : u + t.html() + r
                    }
                }).toArray();
                u = this.multiple ? r.join(this.options.multipleSeparator) : r[0];
                this.multiple && this.options.selectedTextFormat.indexOf("count") > -1 && (f = this.options.selectedTextFormat.split(">"), (f.length > 1 && r.length > f[1] || f.length == 1 && r.length >= 2) && (o = this.options.hideDisabled ? ", [disabled]" : "", e = this.$element.find("option").not('[data-divider="true"], [data-hidden="true"]' + o).length, s = typeof this.options.countSelectedText == "function" ? this.options.countSelectedText(r.length, e) : this.options.countSelectedText, u = s.replace("{0}", r.length.toString()).replace("{1}", e.toString())));
                this.options.title == undefined && (this.options.title = this.$element.attr("title"));
                this.options.selectedTextFormat == "static" && (u = this.options.title);
                u || (u = typeof this.options.title != "undefined" ? this.options.title : this.options.noneSelectedText);
                this.$button.attr("title", h(n.trim(u.replace(/<[^>]*>?/g, ""))));
                this.$button.children(".filter-option").html(u);
                this.$element.trigger("rendered.bs.select")
            },
            setStyle: function(n, t) {
                this.$element.attr("class") && this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ""));
                var i = n ? n : this.options.style;
                t == "add" ? this.$button.addClass(i) : t == "remove" ? this.$button.removeClass(i) : (this.$button.removeClass(this.options.style), this.$button.addClass(i))
            },
            liHeight: function(t) {
                var y;
                if (t || this.options.size !== !1 && !this.sizeInfo) {
                    var e = document.createElement("div"),
                        u = document.createElement("div"),
                        o = document.createElement("ul"),
                        l = document.createElement("li"),
                        w = document.createElement("li"),
                        a = document.createElement("a"),
                        v = document.createElement("span"),
                        s = this.options.header && this.$menu.find(".popover-title").length > 0 ? this.$menu.find(".popover-title")[0].cloneNode(!0) : null,
                        f = this.options.liveSearch ? document.createElement("div") : null,
                        h = this.options.actionsBox && this.multiple && this.$menu.find(".bs-actionsbox").length > 0 ? this.$menu.find(".bs-actionsbox")[0].cloneNode(!0) : null,
                        c = this.options.doneButton && this.multiple && this.$menu.find(".bs-donebutton").length > 0 ? this.$menu.find(".bs-donebutton")[0].cloneNode(!0) : null;
                    v.className = "text";
                    e.className = this.$menu[0].parentNode.className + " open";
                    u.className = "dropdown-menu open";
                    o.className = "dropdown-menu inner";
                    l.className = "divider";
                    v.appendChild(document.createTextNode("Inner text"));
                    a.appendChild(v);
                    w.appendChild(a);
                    o.appendChild(w);
                    o.appendChild(l);
                    s && u.appendChild(s);
                    f && (y = document.createElement("input"), f.className = "bs-searchbox", y.className = "form-control", f.appendChild(y), u.appendChild(f));
                    h && u.appendChild(h);
                    u.appendChild(o);
                    c && u.appendChild(c);
                    e.appendChild(u);
                    document.body.appendChild(e);
                    var b = a.offsetHeight,
                        k = s ? s.offsetHeight : 0,
                        d = f ? f.offsetHeight : 0,
                        g = h ? h.offsetHeight : 0,
                        nt = c ? c.offsetHeight : 0,
                        tt = n(l).outerHeight(!0),
                        i = typeof getComputedStyle == "function" ? getComputedStyle(u) : !1,
                        r = i ? null : n(u),
                        p = {
                            vert: parseInt(i ? i.paddingTop : r.css("paddingTop")) + parseInt(i ? i.paddingBottom : r.css("paddingBottom")) + parseInt(i ? i.borderTopWidth : r.css("borderTopWidth")) + parseInt(i ? i.borderBottomWidth : r.css("borderBottomWidth")),
                            horiz: parseInt(i ? i.paddingLeft : r.css("paddingLeft")) + parseInt(i ? i.paddingRight : r.css("paddingRight")) + parseInt(i ? i.borderLeftWidth : r.css("borderLeftWidth")) + parseInt(i ? i.borderRightWidth : r.css("borderRightWidth"))
                        },
                        it = {
                            vert: p.vert + parseInt(i ? i.marginTop : r.css("marginTop")) + parseInt(i ? i.marginBottom : r.css("marginBottom")) + 2,
                            horiz: p.horiz + parseInt(i ? i.marginLeft : r.css("marginLeft")) + parseInt(i ? i.marginRight : r.css("marginRight")) + 2
                        };
                    document.body.removeChild(e);
                    this.sizeInfo = {
                        liHeight: b,
                        headerHeight: k,
                        searchHeight: d,
                        actionsHeight: g,
                        doneButtonHeight: nt,
                        dividerHeight: tt,
                        menuPadding: p,
                        menuExtras: it
                    }
                }
            },
            setSize: function() {
                var l, rt, ut;
                if (this.findLis(), this.liHeight(), this.options.header && this.$menu.css("padding-top", 0), this.options.size !== !1) {
                    var i = this,
                        t = this.$menu,
                        k = this.$menuInner,
                        o = n(window),
                        ft = this.$newElement[0].offsetHeight,
                        d = this.$newElement[0].offsetWidth,
                        g = this.sizeInfo.liHeight,
                        a = this.sizeInfo.headerHeight,
                        v = this.sizeInfo.searchHeight,
                        y = this.sizeInfo.actionsHeight,
                        p = this.sizeInfo.doneButtonHeight,
                        et = this.sizeInfo.dividerHeight,
                        s = this.sizeInfo.menuPadding,
                        u = this.sizeInfo.menuExtras,
                        nt = this.options.hideDisabled ? ".disabled" : "",
                        r, tt, f, w, e, h, c, b, it = function() {
                            var f = i.$newElement.offset(),
                                u = n(i.options.container),
                                t, r;
                            i.options.container && !u.is("body") ? (t = u.offset(), t.top += parseInt(u.css("borderTopWidth")), t.left += parseInt(u.css("borderLeftWidth"))) : t = {
                                top: 0,
                                left: 0
                            };
                            r = i.options.windowPadding;
                            e = f.top - t.top - o.scrollTop();
                            h = o.height() - e - ft - t.top - r[2];
                            c = f.left - t.left - o.scrollLeft();
                            b = o.width() - c - d - t.left - r[1];
                            e -= r[0];
                            c -= r[3]
                        };
                    if (it(), this.options.size === "auto") {
                        l = function() {
                            var o, nt = function(t, i) {
                                    return function(r) {
                                        return i ? r.classList ? r.classList.contains(t) : n(r).hasClass(t) : !(r.classList ? r.classList.contains(t) : n(r).hasClass(t))
                                    }
                                },
                                rt = i.$menuInner[0].getElementsByTagName("li"),
                                l = Array.prototype.filter ? Array.prototype.filter.call(rt, nt("hidden", !1)) : i.$lis.not(".hidden"),
                                ut = Array.prototype.filter ? Array.prototype.filter.call(l, nt("dropdown-header", !0)) : l.filter(".dropdown-header");
                            it();
                            r = h - u.vert;
                            tt = b - u.horiz;
                            i.options.container ? (t.data("height") || t.data("height", t.height()), f = t.data("height"), t.data("width") || t.data("width", t.width()), w = t.data("width")) : (f = t.height(), w = t.width());
                            i.options.dropupAuto && i.$newElement.toggleClass("dropup", e > h && r - u.vert < f);
                            i.$newElement.hasClass("dropup") && (r = e - u.vert);
                            i.options.dropdownAlignRight === "auto" && t.toggleClass("dropdown-menu-right", c > b && tt - u.horiz < w - d);
                            o = l.length + ut.length > 3 ? g * 3 + u.vert - 2 : 0;
                            t.css({
                                "max-height": r + "px",
                                overflow: "hidden",
                                "min-height": o + a + v + y + p + "px"
                            });
                            k.css({
                                "max-height": r - a - v - y - p - s.vert + "px",
                                "overflow-y": "auto",
                                "min-height": Math.max(o - s.vert, 0) + "px"
                            })
                        };
                        l();
                        this.$searchbox.off("input.getSize propertychange.getSize").on("input.getSize propertychange.getSize", l);
                        o.off("resize.getSize scroll.getSize").on("resize.getSize scroll.getSize", l)
                    } else this.options.size && this.options.size != "auto" && this.$lis.not(nt).length > this.options.size && (rt = this.$lis.not(".divider").not(nt).children().slice(0, this.options.size).last().parent().index(), ut = this.$lis.slice(0, rt + 1).filter(".divider").length, r = g * this.options.size + ut * et + s.vert, i.options.container ? (t.data("height") || t.data("height", t.height()), f = t.data("height")) : f = t.height(), i.options.dropupAuto && this.$newElement.toggleClass("dropup", e > h && r - u.vert < f), t.css({
                        "max-height": r + a + v + y + p + "px",
                        overflow: "hidden",
                        "min-height": ""
                    }), k.css({
                        "max-height": r - s.vert + "px",
                        "overflow-y": "auto",
                        "min-height": ""
                    }))
                }
            },
            setWidth: function() {
                if (this.options.width === "auto") {
                    this.$menu.css("min-width", "0");
                    var n = this.$menu.parent().clone().appendTo("body"),
                        t = this.options.container ? this.$newElement.clone().appendTo("body") : n,
                        i = n.children(".dropdown-menu").outerWidth(),
                        r = t.css("width", "auto").children("button").outerWidth();
                    n.remove();
                    t.remove();
                    this.$newElement.css("width", Math.max(i, r) + "px")
                } else this.options.width === "fit" ? (this.$menu.css("min-width", ""), this.$newElement.css("width", "").addClass("fit-width")) : this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", this.options.width)) : (this.$menu.css("min-width", ""), this.$newElement.css("width", ""));
                this.$newElement.hasClass("fit-width") && this.options.width !== "fit" && this.$newElement.removeClass("fit-width")
            },
            selectPosition: function() {
                this.$bsContainer = n('<div class="bs-container" />');
                var t = this,
                    i = n(this.options.container),
                    u, r, f, e = function(n) {
                        t.$bsContainer.addClass(n.attr("class").replace(/form-control|fit-width/gi, "")).toggleClass("dropup", n.hasClass("dropup"));
                        u = n.offset();
                        i.is("body") ? r = {
                            top: 0,
                            left: 0
                        } : (r = i.offset(), r.top += parseInt(i.css("borderTopWidth")) - i.scrollTop(), r.left += parseInt(i.css("borderLeftWidth")) - i.scrollLeft());
                        f = n.hasClass("dropup") ? 0 : n[0].offsetHeight;
                        t.$bsContainer.css({
                            top: u.top - r.top + f,
                            left: u.left - r.left,
                            width: n[0].offsetWidth
                        })
                    };
                this.$button.on("click", function() {
                    var i = n(this);
                    t.isDisabled() || (e(t.$newElement), t.$bsContainer.appendTo(t.options.container).toggleClass("open", !i.hasClass("open")).append(t.$menu))
                });
                n(window).on("resize scroll", function() {
                    e(t.$newElement)
                });
                this.$element.on("hide.bs.select", function() {
                    t.$menu.data("height", t.$menu.height());
                    t.$bsContainer.detach()
                })
            },
            setSelected: function(n, t, i) {
                i || (this.togglePlaceholder(), i = this.findLis().eq(this.liObj[n]));
                i.toggleClass("selected", t).find("a").attr("aria-selected", t)
            },
            setDisabled: function(n, t, i) {
                i || (i = this.findLis().eq(this.liObj[n]));
                t ? i.addClass("disabled").children("a").attr("href", "#").attr("tabindex", -1).attr("aria-disabled", !0) : i.removeClass("disabled").children("a").removeAttr("href").attr("tabindex", 0).attr("aria-disabled", !1)
            },
            isDisabled: function() {
                return this.$element[0].disabled
            },
            checkDisabled: function() {
                var n = this;
                this.isDisabled() ? (this.$newElement.addClass("disabled"), this.$button.addClass("disabled").attr("tabindex", -1).attr("aria-disabled", !0)) : (this.$button.hasClass("disabled") && (this.$newElement.removeClass("disabled"), this.$button.removeClass("disabled").attr("aria-disabled", !1)), this.$button.attr("tabindex") != -1 || this.$element.data("tabindex") || this.$button.removeAttr("tabindex"));
                this.$button.click(function() {
                    return !n.isDisabled()
                })
            },
            togglePlaceholder: function() {
                var n = this.$element.val();
                this.$button.toggleClass("bs-placeholder", n === null || n === "" || n.constructor === Array && n.length === 0)
            },
            tabIndex: function() {
                this.$element.data("tabindex") !== this.$element.attr("tabindex") && this.$element.attr("tabindex") !== -98 && this.$element.attr("tabindex") !== "-98" && (this.$element.data("tabindex", this.$element.attr("tabindex")), this.$button.attr("tabindex", this.$element.data("tabindex")));
                this.$element.attr("tabindex", -98)
            },
            clickListener: function() {
                var t = this,
                    i = n(document);
                i.data("spaceSelect", !1);
                this.$button.on("keyup", function(n) {
                    /(32)/.test(n.keyCode.toString(10)) && i.data("spaceSelect") && (n.preventDefault(), i.data("spaceSelect", !1))
                });
                this.$button.on("click", function() {
                    t.setSize()
                });
                this.$element.on("shown.bs.select", function() {
                    var i, n;
                    if (t.options.liveSearch || t.multiple) {
                        if (!t.multiple) {
                            if (i = t.liObj[t.$element[0].selectedIndex], typeof i != "number" || t.options.size === !1) return;
                            n = t.$lis.eq(i)[0].offsetTop - t.$menuInner[0].offsetTop;
                            n = n - t.$menuInner[0].offsetHeight / 2 + t.sizeInfo.liHeight / 2;
                            t.$menuInner[0].scrollTop = n
                        }
                    } else t.$menuInner.find(".selected a").focus()
                });
                this.$menuInner.on("click", "li a", function(i) {
                    var h = n(this),
                        o = h.parent().data("originalIndex"),
                        nt = t.$element.val(),
                        tt = t.$element.prop("selectedIndex"),
                        a = !0,
                        p, w, g;
                    if (t.multiple && t.options.maxOptions !== 1 && i.stopPropagation(), i.preventDefault(), !t.isDisabled() && !h.parent().hasClass("disabled")) {
                        var c = t.$element.find("option"),
                            e = c.eq(o),
                            v = e.prop("selected"),
                            y = e.parent("optgroup"),
                            u = t.options.maxOptions,
                            f = y.data("maxOptions") || !1;
                        if (t.multiple) {
                            if (e.prop("selected", !v), t.setSelected(o, !v), h.blur(), (u !== !1 || f !== !1) && (p = u < c.filter(":selected").length, w = f < y.find("option:selected").length, u && p || f && w))
                                if (u && u == 1) c.prop("selected", !1), e.prop("selected", !0), t.$menuInner.find(".selected").removeClass("selected"), t.setSelected(o, !0);
                                else if (f && f == 1) y.find("option:selected").prop("selected", !1), e.prop("selected", !0), g = h.parent().data("optgroup"), t.$menuInner.find('[data-optgroup="' + g + '"]').removeClass("selected"), t.setSelected(o, !0);
                            else {
                                var b = typeof t.options.maxOptionsText == "string" ? [t.options.maxOptionsText, t.options.maxOptionsText] : t.options.maxOptionsText,
                                    s = typeof b == "function" ? b(u, f) : b,
                                    k = s[0].replace("{n}", u),
                                    d = s[1].replace("{n}", f),
                                    l = n('<div class="notify"><\/div>');
                                s[2] && (k = k.replace("{var}", s[2][u > 1 ? 0 : 1]), d = d.replace("{var}", s[2][f > 1 ? 0 : 1]));
                                e.prop("selected", !1);
                                t.$menu.append(l);
                                u && p && (l.append(n("<div>" + k + "<\/div>")), a = !1, t.$element.trigger("maxReached.bs.select"));
                                f && w && (l.append(n("<div>" + d + "<\/div>")), a = !1, t.$element.trigger("maxReachedGrp.bs.select"));
                                setTimeout(function() {
                                    t.setSelected(o, !1)
                                }, 10);
                                l.delay(750).fadeOut(300, function() {
                                    n(this).remove()
                                })
                            }
                        } else c.prop("selected", !1), e.prop("selected", !0), t.$menuInner.find(".selected").removeClass("selected").find("a").attr("aria-selected", !1), t.setSelected(o, !0);
                        !t.multiple || t.multiple && t.options.maxOptions === 1 ? t.$button.focus() : t.options.liveSearch && t.$searchbox.focus();
                        a && (nt != t.$element.val() && t.multiple || tt != t.$element.prop("selectedIndex") && !t.multiple) && (r = [o, e.prop("selected"), v], t.$element.triggerNative("change"))
                    }
                });
                this.$menu.on("click", "li.disabled a, .popover-title, .popover-title :not(.close)", function(i) {
                    i.currentTarget == this && (i.preventDefault(), i.stopPropagation(), t.options.liveSearch && !n(i.target).hasClass("close") ? t.$searchbox.focus() : t.$button.focus())
                });
                this.$menuInner.on("click", ".divider, .dropdown-header", function(n) {
                    n.preventDefault();
                    n.stopPropagation();
                    t.options.liveSearch ? t.$searchbox.focus() : t.$button.focus()
                });
                this.$menu.on("click", ".popover-title .close", function() {
                    t.$button.click()
                });
                this.$searchbox.on("click", function(n) {
                    n.stopPropagation()
                });
                this.$menu.on("click", ".actions-btn", function(i) {
                    t.options.liveSearch ? t.$searchbox.focus() : t.$button.focus();
                    i.preventDefault();
                    i.stopPropagation();
                    n(this).hasClass("bs-select-all") ? t.selectAll() : t.deselectAll()
                });
                this.$element.change(function() {
                    t.render(!1);
                    t.$element.trigger("changed.bs.select", r);
                    r = null
                })
            },
            liveSearchListener: function() {
                var t = this,
                    i = n('<li class="no-results"><\/li>');
                this.$button.on("click.dropdown.data-api", function() {
                    t.$menuInner.find(".active").removeClass("active");
                    !t.$searchbox.val() || (t.$searchbox.val(""), t.$lis.not(".is-hidden").removeClass("hidden"), !i.parent().length || i.remove());
                    t.multiple || t.$menuInner.find(".selected").addClass("active");
                    setTimeout(function() {
                        t.$searchbox.focus()
                    }, 10)
                });
                this.$searchbox.on("click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api", function(n) {
                    n.stopPropagation()
                });
                this.$searchbox.on("input propertychange", function() {
                    var e, o, s, r;
                    t.$lis.not(".is-hidden").removeClass("hidden");
                    t.$lis.filter(".active").removeClass("active");
                    i.remove();
                    t.$searchbox.val() && (e = t.$lis.not(".is-hidden, .divider, .dropdown-header"), o = t.options.liveSearchNormalize ? e.find("a").not(":a" + t._searchStyle() + '("' + f(t.$searchbox.val()) + '")') : e.find("a").not(":" + t._searchStyle() + '("' + t.$searchbox.val() + '")'), o.length === e.length ? (i.html(t.options.noneResultsText.replace("{0}", '"' + u(t.$searchbox.val()) + '"')), t.$menuInner.append(i), t.$lis.addClass("hidden")) : (o.parent().addClass("hidden"), s = t.$lis.not(".hidden"), s.each(function(t) {
                        var i = n(this);
                        i.hasClass("divider") ? r === undefined ? i.addClass("hidden") : (r && r.addClass("hidden"), r = i) : i.hasClass("dropdown-header") && s.eq(t + 1).data("optgroup") !== i.data("optgroup") ? i.addClass("hidden") : r = null
                    }), r && r.addClass("hidden"), e.not(".hidden").first().addClass("active")))
                })
            },
            _searchStyle: function() {
                return {
                    begins: "ibegins",
                    startsWith: "ibegins"
                }[this.options.liveSearchStyle] || "icontains"
            },
            val: function(n) {
                return typeof n != "undefined" ? (this.$element.val(n), this.render(), this.$element) : this.$element.val()
            },
            changeAll: function(t) {
                var r, f;
                if (this.multiple) {
                    typeof t == "undefined" && (t = !0);
                    this.findLis();
                    var e = this.$element.find("option"),
                        i = this.$lis.not(".divider, .dropdown-header, .disabled, .hidden"),
                        o = i.length,
                        u = [];
                    if (t) {
                        if (i.filter(".selected").length === i.length) return
                    } else if (i.filter(".selected").length === 0) return;
                    for (i.toggleClass("selected", t), r = 0; r < o; r++) f = i[r].getAttribute("data-original-index"), u[u.length] = e.eq(f)[0];
                    n(u).prop("selected", t);
                    this.render(!1);
                    this.togglePlaceholder();
                    this.$element.triggerNative("change")
                }
            },
            selectAll: function() {
                return this.changeAll(!0)
            },
            deselectAll: function() {
                return this.changeAll(!1)
            },
            toggle: function(n) {
                n = n || window.event;
                n && n.stopPropagation();
                this.$button.trigger("click")
            },
            keydown: function(t) {
                var e = n(this),
                    l = e.is("input") ? e.parent().parent() : e.parent(),
                    r, i = l.data("this"),
                    u, h, a, v, p, w, k, s, c = ":not(.disabled, .hidden, .dropdown-header, .divider)",
                    b = {
                        32: " ",
                        48: "0",
                        49: "1",
                        50: "2",
                        51: "3",
                        52: "4",
                        53: "5",
                        54: "6",
                        55: "7",
                        56: "8",
                        57: "9",
                        59: ";",
                        65: "a",
                        66: "b",
                        67: "c",
                        68: "d",
                        69: "e",
                        70: "f",
                        71: "g",
                        72: "h",
                        73: "i",
                        74: "j",
                        75: "k",
                        76: "l",
                        77: "m",
                        78: "n",
                        79: "o",
                        80: "p",
                        81: "q",
                        82: "r",
                        83: "s",
                        84: "t",
                        85: "u",
                        86: "v",
                        87: "w",
                        88: "x",
                        89: "y",
                        90: "z",
                        96: "0",
                        97: "1",
                        98: "2",
                        99: "3",
                        100: "4",
                        101: "5",
                        102: "6",
                        103: "7",
                        104: "8",
                        105: "9"
                    },
                    y, o, g, d;
                if (i.options.liveSearch && (l = e.parent().parent()), i.options.container && (l = i.$menu), r = n('[role="listbox"] li', l), s = i.$newElement.hasClass("open"), !s && (t.keyCode >= 48 && t.keyCode <= 57 || t.keyCode >= 96 && t.keyCode <= 105 || t.keyCode >= 65 && t.keyCode <= 90)) {
                    i.options.container ? i.$button.trigger("click") : (i.setSize(), i.$menu.parent().addClass("open"), s = !0);
                    i.$searchbox.focus();
                    return
                }(i.options.liveSearch && (/(^9$|27)/.test(t.keyCode.toString(10)) && s && (t.preventDefault(), t.stopPropagation(), i.$menuInner.click(), i.$button.focus()), r = n('[role="listbox"] li' + c, l), e.val() || /(38|40)/.test(t.keyCode.toString(10)) || r.filter(".active").length === 0 && (r = i.$menuInner.find("li"), r = i.options.liveSearchNormalize ? r.filter(":a" + i._searchStyle() + "(" + f(b[t.keyCode]) + ")") : r.filter(":" + i._searchStyle() + "(" + b[t.keyCode] + ")"))), r.length) && (/(38|40)/.test(t.keyCode.toString(10)) ? (u = r.index(r.find("a").filter(":focus").parent()), a = r.filter(c).first().index(), v = r.filter(c).last().index(), h = r.eq(u).nextAll(c).eq(0).index(), p = r.eq(u).prevAll(c).eq(0).index(), w = r.eq(h).prevAll(c).eq(0).index(), i.options.liveSearch && (r.each(function(t) {
                    n(this).hasClass("disabled") || n(this).data("index", t)
                }), u = r.index(r.filter(".active")), a = r.first().data("index"), v = r.last().data("index"), h = r.eq(u).nextAll().eq(0).data("index"), p = r.eq(u).prevAll().eq(0).data("index"), w = r.eq(h).prevAll().eq(0).data("index")), k = e.data("prevIndex"), t.keyCode == 38 ? (i.options.liveSearch && u--, u != w && u > p && (u = p), u < a && (u = a), u == k && (u = v)) : t.keyCode == 40 && (i.options.liveSearch && u++, u == -1 && (u = 0), u != w && u < h && (u = h), u > v && (u = v), u == k && (u = a)), e.data("prevIndex", u), i.options.liveSearch ? (t.preventDefault(), e.hasClass("dropdown-toggle") || (r.removeClass("active").eq(u).addClass("active").children("a").focus(), e.focus())) : r.eq(u).children("a").focus()) : e.is("input") || (y = [], r.each(function() {
                    n(this).hasClass("disabled") || n.trim(n(this).children("a").text().toLowerCase()).substring(0, 1) == b[t.keyCode] && y.push(n(this).index())
                }), o = n(document).data("keycount"), o++, n(document).data("keycount", o), g = n.trim(n(":focus").text().toLowerCase()).substring(0, 1), g != b[t.keyCode] ? (o = 1, n(document).data("keycount", o)) : o >= y.length && (n(document).data("keycount", 0), o > y.length && (o = 1)), r.eq(y[o - 1]).children("a").focus()), (/(13|32)/.test(t.keyCode.toString(10)) || /(^9$)/.test(t.keyCode.toString(10)) && i.options.selectOnTab) && s && (/(32)/.test(t.keyCode.toString(10)) || t.preventDefault(), i.options.liveSearch ? /(32)/.test(t.keyCode.toString(10)) || (i.$menuInner.find(".active a").click(), e.focus()) : (d = n(":focus"), d.click(), d.focus(), t.preventDefault(), n(document).data("spaceSelect", !0)), n(document).data("keycount", 0)), (/(^9$|27)/.test(t.keyCode.toString(10)) && s && (i.multiple || i.options.liveSearch) || /(27)/.test(t.keyCode.toString(10)) && !s) && (i.$menu.parent().removeClass("open"), i.options.container && i.$newElement.removeClass("open"), i.$button.focus()))
            },
            mobile: function() {
                this.$element.addClass("mobile-device")
            },
            refresh: function() {
                this.$lis = null;
                this.liObj = {};
                this.reloadLi();
                this.render();
                this.checkDisabled();
                this.liHeight(!0);
                this.setStyle();
                this.setWidth();
                this.$lis && this.$searchbox.trigger("propertychange");
                this.$element.trigger("refreshed.bs.select")
            },
            hide: function() {
                this.$newElement.hide()
            },
            show: function() {
                this.$newElement.show()
            },
            remove: function() {
                this.$newElement.remove();
                this.$element.remove()
            },
            destroy: function() {
                this.$newElement.before(this.$element).remove();
                this.$bsContainer ? this.$bsContainer.remove() : this.$menu.remove();
                this.$element.off(".bs.select").removeData("selectpicker").removeClass("bs-select-hidden selectpicker")
            }
        };
        s = n.fn.selectpicker;
        n.fn.selectpicker = o;
        n.fn.selectpicker.Constructor = t;
        n.fn.selectpicker.noConflict = function() {
            return n.fn.selectpicker = s, this
        };
        n(document).data("keycount", 0).on("keydown.bs.select", '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', t.prototype.keydown).on("focusin.modal", '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', function(n) {
            n.stopPropagation()
        });
        n(window).on("load.bs.select.data-api", function() {
            n(".selectpicker").each(function() {
                var t = n(this);
                o.call(t, t.data())
            })
        })
    }(jQuery);
! function(n) {
    "use strict";

    function i(n, t) {
        for (var i = 0; i < n.length; ++i) t(n[i], i)
    }

    function t(t, i) {
        this.$select = n(t);
        this.options = this.mergeOptions(n.extend({}, i, this.$select.data()));
        this.$select.attr("data-placeholder") && (this.options.nonSelectedText = this.$select.data("placeholder"));
        this.originalOptions = this.$select.clone()[0].options;
        this.query = "";
        this.searchTimeout = null;
        this.lastToggledInput = null;
        this.options.multiple = this.$select.attr("multiple") === "multiple";
        this.options.onChange = n.proxy(this.options.onChange, this);
        this.options.onSelectAll = n.proxy(this.options.onSelectAll, this);
        this.options.onDeselectAll = n.proxy(this.options.onDeselectAll, this);
        this.options.onDropdownShow = n.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = n.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = n.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = n.proxy(this.options.onDropdownHidden, this);
        this.options.onInitialized = n.proxy(this.options.onInitialized, this);
        this.options.onFiltering = n.proxy(this.options.onFiltering, this);
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();
        this.updateButtonText();
        this.updateSelectAll(!0);
        this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups();
        this.options.wasDisabled = this.$select.prop("disabled");
        this.options.disableIfEmpty && n("option", this.$select).length <= 0 && this.disable();
        this.$select.wrap('<span class="multiselect-native-select" /><span>|<\/span>').after(this.$container);
        this.options.onInitialized(this.$select, this.$container)
    }
    typeof ko != "undefined" && ko.bindingHandlers && !ko.bindingHandlers.multiselect && (ko.bindingHandlers.multiselect = {
        after: ["options", "value", "selectedOptions", "enable", "disable"],
        init: function(t, i, r) {
            var u = n(t),
                l = ko.toJS(i()),
                s, h, c, f, e, o;
            u.multiselect(l);
            r.has("options") && (s = r.get("options"), ko.isObservable(s) && ko.computed({
                read: function() {
                    s();
                    setTimeout(function() {
                        var n = u.data("multiselect");
                        n && n.updateOriginalOptions();
                        u.multiselect("rebuild")
                    }, 1)
                },
                disposeWhenNodeIsRemoved: t
            }));
            r.has("value") && (h = r.get("value"), ko.isObservable(h) && ko.computed({
                read: function() {
                    h();
                    setTimeout(function() {
                        u.multiselect("refresh")
                    }, 1)
                },
                disposeWhenNodeIsRemoved: t
            }).extend({
                rateLimit: 100,
                notifyWhenChangesStop: !0
            }));
            r.has("selectedOptions") && (c = r.get("selectedOptions"), ko.isObservable(c) && ko.computed({
                read: function() {
                    c();
                    setTimeout(function() {
                        u.multiselect("refresh")
                    }, 1)
                },
                disposeWhenNodeIsRemoved: t
            }).extend({
                rateLimit: 100,
                notifyWhenChangesStop: !0
            }));
            f = function(n) {
                setTimeout(function() {
                    n ? u.multiselect("enable") : u.multiselect("disable")
                })
            };
            r.has("enable") && (e = r.get("enable"), ko.isObservable(e) ? ko.computed({
                read: function() {
                    f(e())
                },
                disposeWhenNodeIsRemoved: t
            }).extend({
                rateLimit: 100,
                notifyWhenChangesStop: !0
            }) : f(e));
            r.has("disable") && (o = r.get("disable"), ko.isObservable(o) ? ko.computed({
                read: function() {
                    f(!o())
                },
                disposeWhenNodeIsRemoved: t
            }).extend({
                rateLimit: 100,
                notifyWhenChangesStop: !0
            }) : f(!o));
            ko.utils.domNodeDisposal.addDisposeCallback(t, function() {
                u.multiselect("destroy")
            })
        },
        update: function(t, i) {
            var r = n(t),
                u = ko.toJS(i());
            r.multiselect("setOptions", u);
            r.multiselect("rebuild")
        }
    });
    t.prototype = {
        defaults: {
            buttonText: function(t, i) {
                if (this.disabledText.length > 0 && (i.prop("disabled") || t.length == 0 && this.disableIfEmpty)) return this.disabledText;
                if (t.length === 0) return this.nonSelectedText;
                if (this.allSelectedText && t.length === n("option", n(i)).length && n("option", n(i)).length !== 1 && this.multiple) return this.selectAllNumber ? this.allSelectedText + " (" + t.length + ")" : this.allSelectedText;
                if (t.length > this.numberDisplayed) return t.length + " " + this.nSelectedText;
                var r = "",
                    u = this.delimiterText;
                return t.each(function() {
                    var t = n(this).attr("label") !== undefined ? n(this).attr("label") : n(this).text();
                    r += t + u
                }), r.substr(0, r.length - this.delimiterText.length)
            },
            buttonTitle: function(t) {
                if (t.length === 0) return this.nonSelectedText;
                var i = "",
                    r = this.delimiterText;
                return t.each(function() {
                    var t = n(this).attr("label") !== undefined ? n(this).attr("label") : n(this).text();
                    i += t + r
                }), i.substr(0, i.length - this.delimiterText.length)
            },
            checkboxName: function() {
                return !1
            },
            optionLabel: function(t) {
                return n(t).attr("label") || n(t).text()
            },
            optionClass: function(t) {
                return n(t).attr("class") || ""
            },
            onChange: function() {},
            onDropdownShow: function() {},
            onDropdownHide: function() {},
            onDropdownShown: function() {},
            onDropdownHidden: function() {},
            onSelectAll: function() {},
            onDeselectAll: function() {},
            onInitialized: function() {},
            onFiltering: function() {},
            enableHTML: !1,
            buttonClass: "btn btn-default",
            inheritClass: !1,
            buttonWidth: "auto",
            buttonContainer: '<div class="btn-group" />',
            dropRight: !1,
            dropUp: !1,
            selectedClass: "active",
            maxHeight: !1,
            includeSelectAllOption: !1,
            includeSelectAllIfMoreThan: 0,
            selectAllText: " Select all",
            selectAllValue: "multiselect-all",
            selectAllName: !1,
            selectAllNumber: !0,
            selectAllJustVisible: !0,
            enableFiltering: !1,
            enableCaseInsensitiveFiltering: !1,
            enableFullValueFiltering: !1,
            enableClickableOptGroups: !1,
            enableCollapsibleOptGroups: !1,
            filterPlaceholder: "Search",
            filterBehavior: "text",
            includeFilterClearBtn: !0,
            preventInputChangeEvent: !1,
            nonSelectedText: "None selected",
            nSelectedText: "selected",
            allSelectedText: "All selected",
            numberDisplayed: 3,
            disableIfEmpty: !1,
            disabledText: "",
            delimiterText: ", ",
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"><\/span> <b class="caret"><\/b><span class="separator">|<\/span><\/button>',
                ul: '<ul class="multiselect-container dropdown-menu"><\/ul>',
                filter: '<li class="multiselect-item multiselect-filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"><\/i><\/span><input class="form-control multiselect-search" type="text"><\/div><\/li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"><\/i><\/button><\/span>',
                li: '<li><a tabindex="0"><label><\/label><\/a><\/li>',
                divider: '<li class="multiselect-item divider"><\/li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label><\/label><\/li>'
            }
        },
        constructor: t,
        buildContainer: function() {
            this.$container = n(this.options.buttonContainer);
            this.$container.on("show.bs.dropdown", this.options.onDropdownShow);
            this.$container.on("hide.bs.dropdown", this.options.onDropdownHide);
            this.$container.on("shown.bs.dropdown", this.options.onDropdownShown);
            this.$container.on("hidden.bs.dropdown", this.options.onDropdownHidden)
        },
        buildButton: function() {
            this.$button = n(this.options.templates.button).addClass(this.options.buttonClass);
            this.$select.attr("class") && this.options.inheritClass && this.$button.addClass(this.$select.attr("class"));
            this.$select.prop("disabled") ? this.disable() : this.enable();
            this.options.buttonWidth && this.options.buttonWidth !== "auto" && (this.$button.css({
                width: "100%",
                overflow: "hidden",
                "text-overflow": "ellipsis"
            }), this.$container.css({
                width: this.options.buttonWidth
            }));
            var t = this.$select.attr("tabindex");
            t && this.$button.attr("tabindex", t);
            this.$container.prepend(this.$button)
        },
        buildDropdown: function() {
            if (this.$ul = n(this.options.templates.ul), this.options.dropRight && this.$ul.addClass("pull-right"), this.options.maxHeight && this.$ul.css({
                    "max-height": this.options.maxHeight + "px",
                    "overflow-y": "auto",
                    "overflow-x": "hidden"
                }), this.options.dropUp) {
                var t = Math.min(this.options.maxHeight, n('option[data-role!="divider"]', this.$select).length * 26 + n('option[data-role="divider"]', this.$select).length * 19 + (this.options.includeSelectAllOption ? 26 : 0) + (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering ? 44 : 0)),
                    i = t + 34;
                this.$ul.css({
                    "max-height": t + "px",
                    "overflow-y": "auto",
                    "overflow-x": "hidden",
                    "margin-top": "-" + i + "px"
                })
            }
            this.$container.append(this.$ul)
        },
        buildDropdownOptions: function() {
            this.$select.children().each(n.proxy(function(t, i) {
                var r = n(i),
                    u = r.prop("tagName").toLowerCase();
                r.prop("value") !== this.options.selectAllValue && (u === "optgroup" ? this.createOptgroup(i) : u === "option" && (r.data("role") === "divider" ? this.createDivider() : this.createOptionValue(i)))
            }, this));
            n("li:not(.multiselect-group) input", this.$ul).on("change", n.proxy(function(t) {
                var i = n(t.target),
                    u = i.prop("checked") || !1,
                    o = i.val() === this.options.selectAllValue;
                this.options.selectedClass && (u ? i.closest("li").addClass(this.options.selectedClass) : i.closest("li").removeClass(this.options.selectedClass));
                var s = i.val(),
                    r = this.getOptionByValue(s),
                    f = n("option", this.$select).not(r),
                    e = n("input", this.$container).not(i);
                if (o) u ? this.selectAll(this.options.selectAllJustVisible, !0) : this.deselectAll(this.options.selectAllJustVisible, !0);
                else {
                    u ? (r.prop("selected", !0), this.options.multiple ? r.prop("selected", !0) : (this.options.selectedClass && n(e).closest("li").removeClass(this.options.selectedClass), n(e).prop("checked", !1), f.prop("selected", !1), this.$button.click()), this.options.selectedClass === "active" && f.closest("a").css("outline", "")) : r.prop("selected", !1);
                    this.options.onChange(r, u);
                    this.updateSelectAll();
                    this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
                }
                return this.$select.change(), this.updateButtonText(), this.options.preventInputChangeEvent ? !1 : void 0
            }, this));
            n("li a", this.$ul).on("mousedown", function(n) {
                if (n.shiftKey) return !1
            });
            n("li a", this.$ul).on("touchstart click", n.proxy(function(t) {
                var i, e, u, r, s, f, o, h, c, l;
                if (t.stopPropagation(), i = n(t.target), t.shiftKey && this.options.multiple) {
                    if (i.is("label") && (t.preventDefault(), i = i.find("input"), i.prop("checked", !i.prop("checked"))), e = i.prop("checked") || !1, this.lastToggledInput !== null && this.lastToggledInput !== i)
                        for (u = i.closest("li").index(), r = this.lastToggledInput.closest("li").index(), u > r && (s = r, r = u, u = s), ++r, f = this.$ul.find("li").slice(u, r).find("input"), f.prop("checked", e), this.options.selectedClass && f.closest("li").toggleClass(this.options.selectedClass, e), o = 0, h = f.length; o < h; o++) c = n(f[o]), l = this.getOptionByValue(c.val()), l.prop("selected", e);
                    i.trigger("change")
                }
                i.is("input") && !i.closest("li").is(".multiselect-item") && (this.lastToggledInput = i);
                i.blur()
            }, this));
            this.$container.off("keydown.multiselect").on("keydown.multiselect", n.proxy(function(t) {
                var r, i, f, u;
                if (!n('input[type="text"]', this.$container).is(":focus"))
                    if (t.keyCode === 9 && this.$container.hasClass("open")) this.$button.click();
                    else {
                        if (r = n(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible"), !r.length) return;
                        i = r.index(r.filter(":focus"));
                        t.keyCode === 38 && i > 0 ? i-- : t.keyCode === 40 && i < r.length - 1 ? i++ : ~i || (i = 0);
                        f = r.eq(i);
                        f.focus();
                        (t.keyCode === 32 || t.keyCode === 13) && (u = f.find("input"), u.prop("checked", !u.prop("checked")), u.change());
                        t.stopPropagation();
                        t.preventDefault()
                    }
            }, this));
            if (this.options.enableClickableOptGroups && this.options.multiple) n("li.multiselect-group input", this.$ul).on("change", n.proxy(function(t) {
                t.stopPropagation();
                var f = n(t.target),
                    i = f.prop("checked") || !1,
                    r = n(t.target).closest("li"),
                    e = r.nextUntil("li.multiselect-group").not(".multiselect-filter-hidden").not(".disabled"),
                    o = e.find("input"),
                    u = [];
                this.options.selectedClass && (i ? r.addClass(this.options.selectedClass) : r.removeClass(this.options.selectedClass));
                n.each(o, n.proxy(function(t, r) {
                    var f = n(r).val(),
                        e = this.getOptionByValue(f);
                    i ? (n(r).prop("checked", !0), n(r).closest("li").addClass(this.options.selectedClass), e.prop("selected", !0)) : (n(r).prop("checked", !1), n(r).closest("li").removeClass(this.options.selectedClass), e.prop("selected", !1));
                    u.push(this.getOptionByValue(f))
                }, this));
                this.options.onChange(u, i);
                this.updateButtonText();
                this.updateSelectAll()
            }, this));
            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                n("li.multiselect-group .caret-container", this.$ul).on("click", n.proxy(function(t) {
                    var u = n(t.target).closest("li"),
                        i = u.nextUntil("li.multiselect-group").not(".multiselect-filter-hidden"),
                        r = !0;
                    i.each(function() {
                        r = r && n(this).is(":visible")
                    });
                    r ? i.hide().addClass("multiselect-collapsible-hidden") : i.show().removeClass("multiselect-collapsible-hidden")
                }, this));
                n("li.multiselect-all", this.$ul).css("background", "#f3f3f3").css("border-bottom", "1px solid #eaeaea");
                n("li.multiselect-all > a > label.checkbox", this.$ul).css("padding", "3px 20px 3px 35px");
                n("li.multiselect-group > a > input", this.$ul).css("margin", "4px 0px 5px -20px")
            }
        },
        createOptionValue: function(t) {
            var r = n(t),
                i, e, o;
            r.is(":selected") && r.prop("selected", !0);
            var s = this.options.optionLabel(t),
                l = this.options.optionClass(t),
                h = r.val(),
                c = this.options.multiple ? "checkbox" : "radio",
                f = n(this.options.templates.li),
                u = n("label", f);
            u.addClass(c);
            f.addClass(l);
            this.options.enableHTML ? u.html(" " + s) : u.text(" " + s);
            i = n("<input/>").attr("type", c);
            e = this.options.checkboxName(r);
            e && i.attr("name", e);
            u.prepend(i);
            o = r.prop("selected") || !1;
            i.val(h);
            h === this.options.selectAllValue && (f.addClass("multiselect-item multiselect-all"), i.parent().parent().addClass("multiselect-all"));
            u.attr("title", r.attr("title"));
            this.$ul.append(f);
            r.is(":disabled") && i.attr("disabled", "disabled").prop("disabled", !0).closest("a").attr("tabindex", "-1").closest("li").addClass("disabled");
            i.prop("checked", o);
            o && this.options.selectedClass && i.closest("li").addClass(this.options.selectedClass)
        },
        createDivider: function() {
            var t = n(this.options.templates.divider);
            this.$ul.append(t)
        },
        createOptgroup: function(t) {
            var r = n(t).attr("label"),
                u = n(t).attr("value"),
                i = n('<li class="multiselect-item multiselect-group"><a href="javascript:void(0);"><label><b><\/b><\/label><\/a><\/li>'),
                f = this.options.optionClass(t);
            i.addClass(f);
            this.options.enableHTML ? n("label b", i).html(" " + r) : n("label b", i).text(" " + r);
            this.options.enableCollapsibleOptGroups && this.options.multiple && n("a", i).append('<span class="caret-container"><b class="caret"><\/b><\/span>');
            this.options.enableClickableOptGroups && this.options.multiple && n("a label", i).prepend('<input type="checkbox" value="asdf' + u + '"/><label class="tmo_check"><\/label>');
            n(t).is(":disabled") && i.addClass("disabled");
            this.$ul.append(i);
            n("option", t).each(n.proxy(function(n, t) {
                this.createOptionValue(t)
            }, this))
        },
        buildSelectAll: function() {
            var r, t, i;
            typeof this.options.selectAllValue == "number" && (this.options.selectAllValue = this.options.selectAllValue.toString());
            r = this.hasSelectAll();
            !r && this.options.includeSelectAllOption && this.options.multiple && n("option", this.$select).length > this.options.includeSelectAllIfMoreThan && (this.options.includeSelectAllDivider && this.$ul.prepend(n(this.options.templates.divider)), t = n(this.options.templates.li), n("label", t).addClass("checkbox"), this.options.enableHTML ? n("label", t).html(" " + this.options.selectAllText) : n("label", t).text(" " + this.options.selectAllText), this.options.selectAllName ? n("label", t).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" /><label class="tmo_check" for="' + this.options.selectAllName + '"><\/label>') : n("label", t).prepend('<input type="checkbox" /><label class="tmo_check><\/label>"'), i = n("input", t), i.val(this.options.selectAllValue), t.addClass("multiselect-item multiselect-all"), i.parent().parent().addClass("multiselect-all"), this.$ul.prepend(t), i.prop("checked", !1))
        },
        buildFilter: function() {
            var i, t;
            if ((this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) && (i = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering), this.$select.find("option").length >= i)) {
                if (this.$filter = n(this.options.templates.filter), n("input", this.$filter).attr("placeholder", this.options.filterPlaceholder), this.options.includeFilterClearBtn) {
                    t = n(this.options.templates.filterClearBtn);
                    t.on("click", n.proxy(function() {
                        clearTimeout(this.searchTimeout);
                        this.$filter.find(".multiselect-search").val("");
                        n("li", this.$ul).show().removeClass("multiselect-filter-hidden");
                        this.updateSelectAll();
                        this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
                    }, this));
                    this.$filter.find(".input-group").append(t)
                }
                this.$ul.prepend(this.$filter);
                this.$filter.val(this.query).on("click", function(n) {
                    n.stopPropagation()
                }).on("input keydown", n.proxy(function(t) {
                    t.which === 13 && t.preventDefault();
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = this.asyncFunction(n.proxy(function() {
                        if (this.query !== t.target.value) {
                            this.query = t.target.value;
                            var i, r;
                            n.each(n("li", this.$ul), n.proxy(function(t, u) {
                                var o = n("input", u).length > 0 ? n("input", u).val() : "",
                                    s = n("label", u).text(),
                                    e = "",
                                    f, h;
                                this.options.filterBehavior === "text" ? e = s : this.options.filterBehavior === "value" ? e = o : this.options.filterBehavior === "both" && (e = s + "\n" + o);
                                o !== this.options.selectAllValue && s && (f = !1, this.options.enableCaseInsensitiveFiltering && (e = e.toLowerCase(), this.query = this.query.toLowerCase()), this.options.enableFullValueFiltering && this.options.filterBehavior !== "both" ? (h = e.trim().substring(0, this.query.length), this.query.indexOf(h) > -1 && (f = !0)) : e.indexOf(this.query) > -1 && (f = !0), n(u).toggle(f).toggleClass("multiselect-filter-hidden", !f), n(u).hasClass("multiselect-group") ? (i = u, r = f) : (f && n(i).show().removeClass("multiselect-filter-hidden"), !f && r && n(u).show().removeClass("multiselect-filter-hidden")))
                            }, this))
                        }
                        this.updateSelectAll();
                        this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups();
                        this.options.onFiltering(t.target)
                    }, this), 300, this)
                }, this))
            }
        },
        destroy: function() {
            this.$container.remove();
            this.$select.show();
            this.$select.prop("disabled", this.options.wasDisabled);
            this.$select.data("multiselect", null)
        },
        refresh: function() {
            var t = n.map(n("li input", this.$ul), n);
            n("option", this.$select).each(n.proxy(function(i, r) {
                for (var f = n(r), o = f.val(), u, e = t.length; 0 < e--;)
                    if (o === (u = t[e]).val()) {
                        f.is(":selected") ? (u.prop("checked", !0), this.options.selectedClass && u.closest("li").addClass(this.options.selectedClass)) : (u.prop("checked", !1), this.options.selectedClass && u.closest("li").removeClass(this.options.selectedClass));
                        f.is(":disabled") ? u.attr("disabled", "disabled").prop("disabled", !0).closest("li").addClass("disabled") : u.prop("disabled", !1).closest("li").removeClass("disabled");
                        break
                    }
            }, this));
            this.updateButtonText();
            this.updateSelectAll();
            this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
        },
        select: function(t, i) {
            var u, r, f, e;
            for (n.isArray(t) || (t = [t]), u = 0; u < t.length; u++)
                if ((r = t[u], r !== null && r !== undefined) && (f = this.getOptionByValue(r), e = this.getInputByValue(r), f !== undefined && e !== undefined) && (this.options.multiple || this.deselectAll(!1), this.options.selectedClass && e.closest("li").addClass(this.options.selectedClass), e.prop("checked", !0), f.prop("selected", !0), i)) this.options.onChange(f, !0);
            this.updateButtonText();
            this.updateSelectAll();
            this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
        },
        clearSelection: function() {
            this.deselectAll(!1);
            this.updateButtonText();
            this.updateSelectAll();
            this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
        },
        deselect: function(t, i) {
            var u, r, f, e;
            for (n.isArray(t) || (t = [t]), u = 0; u < t.length; u++)
                if ((r = t[u], r !== null && r !== undefined) && (f = this.getOptionByValue(r), e = this.getInputByValue(r), f !== undefined && e !== undefined) && (this.options.selectedClass && e.closest("li").removeClass(this.options.selectedClass), e.prop("checked", !1), f.prop("selected", !1), i)) this.options.onChange(f, !1);
            this.updateButtonText();
            this.updateSelectAll();
            this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
        },
        selectAll: function(t, i) {
            var t = typeof t == "undefined" ? !0 : t,
                r = n("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul),
                u = n("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(":visible");
            t ? (n("input:enabled", u).prop("checked", !0), u.addClass(this.options.selectedClass), n("input:enabled", u).each(n.proxy(function(t, i) {
                var r = n(i).val(),
                    u = this.getOptionByValue(r);
                n(u).prop("selected", !0)
            }, this))) : (n("input:enabled", r).prop("checked", !0), r.addClass(this.options.selectedClass), n("input:enabled", r).each(n.proxy(function(t, i) {
                var r = n(i).val(),
                    u = this.getOptionByValue(r);
                n(u).prop("selected", !0)
            }, this)));
            n('li input[value="' + this.options.selectAllValue + '"]', this.$ul).prop("checked", !0);
            this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups();
            i && this.options.onSelectAll()
        },
        deselectAll: function(t, i) {
            var t = typeof t == "undefined" ? !0 : t,
                r = n("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul),
                u = n("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(":visible");
            t ? (n('input[type="checkbox"]:enabled', u).prop("checked", !1), u.removeClass(this.options.selectedClass), n('input[type="checkbox"]:enabled', u).each(n.proxy(function(t, i) {
                var r = n(i).val(),
                    u = this.getOptionByValue(r);
                n(u).prop("selected", !1)
            }, this))) : (n('input[type="checkbox"]:enabled', r).prop("checked", !1), r.removeClass(this.options.selectedClass), n('input[type="checkbox"]:enabled', r).each(n.proxy(function(t, i) {
                var r = n(i).val(),
                    u = this.getOptionByValue(r);
                n(u).prop("selected", !1)
            }, this)));
            n('li input[value="' + this.options.selectAllValue + '"]', this.$ul).prop("checked", !1);
            this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups();
            i && this.options.onDeselectAll()
        },
        rebuild: function() {
            this.$ul.html("");
            this.options.multiple = this.$select.attr("multiple") === "multiple";
            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();
            this.updateButtonText();
            this.updateSelectAll(!0);
            this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups();
            this.options.disableIfEmpty && n("option", this.$select).length <= 0 ? this.disable() : this.enable();
            this.options.dropRight && this.$ul.addClass("pull-right")
        },
        dataprovider: function(t) {
            var r = 0,
                u = this.$select.empty();
            n.each(t, function(t, f) {
                var e, o, s;
                if (n.isArray(f.children)) r++, e = n("<optgroup/>").attr({
                    label: f.label || "Group " + r,
                    disabled: !!f.disabled
                }), i(f.children, function(t) {
                    var r = {
                            value: t.value,
                            label: t.label || t.value,
                            title: t.title,
                            selected: !!t.selected,
                            disabled: !!t.disabled
                        },
                        i;
                    for (i in t.attributes) r["data-" + i] = t.attributes[i];
                    e.append(n("<option/>").attr(r))
                });
                else {
                    o = {
                        value: f.value,
                        label: f.label || f.value,
                        title: f.title,
                        "class": f.class,
                        selected: !!f.selected,
                        disabled: !!f.disabled
                    };
                    for (s in f.attributes) o["data-" + s] = f.attributes[s];
                    e = n("<option/>").attr(o);
                    e.text(f.label || f.value)
                }
                u.append(e)
            });
            this.rebuild()
        },
        enable: function() {
            this.$select.prop("disabled", !1);
            this.$button.prop("disabled", !1).removeClass("disabled")
        },
        disable: function() {
            this.$select.prop("disabled", !0);
            this.$button.prop("disabled", !0).addClass("disabled")
        },
        setOptions: function(n) {
            this.options = this.mergeOptions(n)
        },
        mergeOptions: function(t) {
            return n.extend(!0, {}, this.defaults, this.options, t)
        },
        hasSelectAll: function() {
            return n("li.multiselect-all", this.$ul).length > 0
        },
        updateOptGroups: function() {
            var i = n("li.multiselect-group", this.$ul),
                t = this.options.selectedClass;
            i.each(function() {
                var r = n(this).nextUntil("li.multiselect-group").not(".multiselect-filter-hidden").not(".disabled"),
                    i = !0;
                r.each(function() {
                    var t = n("input", this);
                    t.prop("checked") || (i = !1)
                });
                t && (i ? n(this).addClass(t) : n(this).removeClass(t));
                n("input", this).prop("checked", i)
            })
        },
        updateSelectAll: function() {
            if (this.hasSelectAll()) {
                var i = n("li:not(.multiselect-item):not(.multiselect-filter-hidden):not(.multiselect-group):not(.disabled) input:enabled", this.$ul),
                    f = i.length,
                    r = i.filter(":checked").length,
                    t = n("li.multiselect-all", this.$ul),
                    u = t.find("input");
                r > 0 && r === f ? (u.prop("checked", !0), t.addClass(this.options.selectedClass)) : (u.prop("checked", !1), t.removeClass(this.options.selectedClass))
            }
        },
        updateButtonText: function() {
            var t = this.getSelected();
            this.options.enableHTML ? n(".multiselect .multiselect-selected-text", this.$container).html(this.options.buttonText(t, this.$select)) : n(".multiselect .multiselect-selected-text", this.$container).text(this.options.buttonText(t, this.$select));
            n(".multiselect", this.$container).attr("title", this.options.buttonTitle(t, this.$select))
        },
        getSelected: function() {
            return n("option", this.$select).filter(":selected")
        },
        getOptionByValue: function(t) {
            for (var u = n("option", this.$select), f = t.toString(), r, i = 0; i < u.length; i = i + 1)
                if (r = u[i], r.value === f) return n(r)
        },
        getInputByValue: function(t) {
            for (var u = n("li input:not(.multiselect-search)", this.$ul), f = t.toString(), r, i = 0; i < u.length; i = i + 1)
                if (r = u[i], r.value === f) return n(r)
        },
        updateOriginalOptions: function() {
            this.originalOptions = this.$select.clone()[0].options
        },
        asyncFunction: function(n, t, i) {
            var r = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function() {
                n.apply(i || window, r)
            }, t)
        },
        setAllSelectedText: function(n) {
            this.options.allSelectedText = n;
            this.updateButtonText()
        }
    };
    n.fn.multiselect = function(i, r, u) {
        return this.each(function() {
            var f = n(this).data("multiselect"),
                e = typeof i == "object" && i;
            f || (f = new t(this, e), n(this).data("multiselect", f));
            typeof i == "string" && (f[i](r, u), i === "destroy" && n(this).data("multiselect", !1))
        })
    };
    n.fn.multiselect.Constructor = t;
    n(function() {
        n("select[data-role=multiselect]").multiselect()
    })
}(window.jQuery)