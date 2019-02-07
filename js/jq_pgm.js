var TEXTPOS = -1,
    OPENED = 0,
    WID = 0,
    TID = 0,
    WBLINK1 = "",
    WBLINK2 = "",
    WBLINK3 = "",
    SOLUTION = "",
    ADDFILTER = "",
    RTL = 0,
    ANN_ARRAY = {},
    DELIMITER = "",
    JQ_TOOLTIP = 0;

function setTransRoman(a, b) {
    1 == $('textarea[name="WoTranslation"]').length && $('textarea[name="WoTranslation"]').val(a);
    1 == $('input[name="WoRomanization"]').length && $('input[name="WoRomanization"]').val(b);
    makeDirty()
}

function getUTF8Length(a) {
    for (var b = 0, c = 0; c < a.length; c++) {
        var d = a.charCodeAt(c);
        128 > d ? b++ : b = 127 < d && 2048 > d ? b + 2 : b + 3
    }
    return b
}

function scrollToAnchor(a) {
    document.location.href = "#" + a
}

function changeImprAnnText() {
    var a = $("#editimprtextdata").attr("data_id");
    $(this).prev("input:radio").attr("checked", "checked");
    var b = $(this).attr("name"),
        c = JSON.stringify($("form").serializeObject());
    $.post("ajax_save_impr_text.php", {
        id: a,
        elem: b,
        data: c
    }, function(a) {
        "OK" != a && alert("Saving your changes failed, please reload page and try again!")
    })
}

function changeImprAnnRadio() {
    var a = $("#editimprtextdata").attr("data_id"),
        b = $(this).attr("name"),
        c = JSON.stringify($("form").serializeObject());
    $.post("ajax_save_impr_text.php", {
        id: a,
        elem: b,
        data: c
    }, function(a) {
        "OK" != a && alert("Saving your changes failed, please reload page and try again!")
    })
}

function addTermTranslation(a, b, c, d) {
    b = $(b).val().trim();
    var e = $(document).scrollTop();
    "" == b || "*" == b ? alert("Text Field is empty or = '*'!") : $.post("ajax_add_term_transl.php", {
        id: a,
        data: b,
        text: c,
        lang: d
    }, function(a) {
        "" == a ? alert("Adding translation to term OR term creation failed, please reload page and try again!") : do_ajax_edit_impr_text(e, a)
    })
}

function changeTableTestStatus(a, b) {
    $.post("ajax_chg_term_status.php", {
        id: a,
        data: b ? 1 : 0
    }, function(b) {
        "" != b && $("#STAT" + a).html(b)
    })
}

function check() {
    var a = 0;
    $(".notempty").each(function(b) {
        "" == $(this).val().trim() && a++
    });
    if (0 < a) return alert("ERROR\n\n" + a + " field(s) - marked with * - must not be empty!"), !1;
    a = 0;
    $("input.checkurl").each(function(b) {
        0 < $(this).val().trim().length && 0 != $(this).val().trim().indexOf("http://") && 0 != $(this).val().trim().indexOf("https://") && 0 != $(this).val().trim().indexOf("#") && (alert('ERROR\n\nField "' + $(this).attr("data_info") + '" must start with "http://" or "https://" if not empty.'), a++)
    });
    $("input.checkregexp").each(function(b) {
        b =
            $(this).val().trim();
        0 < b.length && $.ajax({
            type: "POST",
            url: "ajax_check_regexp.php",
            data: {
                regex: b
            },
            async: !1
        }).always(function(b) {
            "" != b && (alert(b), a++)
        })
    });
    $('input[class*="max_int_"]').each(function(b) {
        b = parseInt($(this).attr("class").replace(/.*maxint_([0-9]+).*/, "$1"));
        0 < $(this).val().trim().length && $(this).val() > b && (alert('ERROR\n\n Max Value of Field "' + $(this).attr("data_info") + '" is ' + b), a++)
    });
    $("input.checkdicturl").each(function(b) {
        0 < $(this).val().trim().length && 0 != $(this).val().trim().indexOf("http://") &&
            0 != $(this).val().trim().indexOf("https://") && 0 != $(this).val().trim().indexOf("*http://") && 0 != $(this).val().trim().indexOf("*https://") && 0 != $(this).val().trim().indexOf("glosbe_api.php") && 0 != $(this).val().trim().indexOf("ggl.php") && (alert('ERROR\n\nField "' + $(this).attr("data_info") + '" must start with "http://" or "https://" or "*http://" or "*https://" or "glosbe_api.php" or "ggl.php" if not empty.'), a++)
    });
    $("input.posintnumber").each(function(b) {
        0 < $(this).val().trim().length && !(isInt($(this).val().trim()) &&
            0 < $(this).val().trim() + 0) && (alert('ERROR\n\nField "' + $(this).attr("data_info") + '" must be an integer number > 0.'), a++)
    });
    $("input.zeroposintnumber").each(function(b) {
        0 < $(this).val().trim().length && !(isInt($(this).val().trim()) && 0 <= $(this).val().trim() + 0) && (alert('ERROR\n\nField "' + $(this).attr("data_info") + '" must be an integer number >= 0.'), a++)
    });
    $("textarea.checklength").each(function(b) {
        $(this).val().trim().length > 0 + $(this).attr("data_maxlength") && (alert('ERROR\n\nText is too long in field "' +
            $(this).attr("data_info") + '", please make it shorter! (Maximum length: ' + $(this).attr("data_maxlength") + " char.)"), a++)
    });
    $("textarea.checkbytes").each(function(b) {
        getUTF8Length($(this).val().trim()) > 0 + $(this).attr("data_maxlength") && (alert('ERROR\n\nText is too long in field "' + $(this).attr("data_info") + '", please make it shorter! (Maximum length: ' + $(this).attr("data_maxlength") + " bytes.)"), a++)
    });
    $("input.noblanksnocomma").each(function(b) {
        if (0 < $(this).val().indexOf(" ") || 0 < $(this).val().indexOf(",")) alert('ERROR\n\nNo spaces or commas allowed in field "' +
            $(this).attr("data_info") + '", please remove!'), a++
    });
    return 0 == a
}

function isInt(a) {
    for (var b = 0; b < a.length; b++)
        if ("0" > a.charAt(b) || "9" < a.charAt(b)) return !1;
    return !0
}

function markClick() {
    0 < $("input.markcheck:checked").length ? $("#markaction").removeAttr("disabled") : $("#markaction").attr("disabled", "disabled")
}

function showallwordsClick() {
    var a = $("#showallwords:checked").length,
        b = $("#thetextid").text();
    window.parent.frames.ro.location.href = "set_text_mode.php?mode=" + a + "&text=" + b
}

function textareaKeydown(a) {
    return a.keyCode && "13" == a.keyCode && a.ctrlKey ? (check() && $("input:submit").last().click(), !1) : !0
}

function noShowAfter3Secs() {
    $("#hide3").slideUp()
}

function setTheFocus() {
    $(".setfocus").focus().select()
}

function word_click_event_do_test_test() {
    run_overlib_test(WBLINK1, WBLINK2, WBLINK3, $(this).attr("data_wid"), $(this).attr("data_text"), $(this).attr("data_trans"), $(this).attr("data_rom"), $(this).attr("data_status"), $(this).attr("data_sent"), $(this).attr("data_todo"));
    $(".todo").text(SOLUTION);
    return !1
}

function keydown_event_do_test_test(a) {
    //if (32 == a.which && 0 == OPENED) return $(".word").click(), cClick(), window.parent.frames.ro.location.href = "show_word.php?wid=" + $(".word").attr("data_wid") + "&ann=", OPENED = 1, !1;
    if (0 == OPENED) return !0;
    if (38 == a.which) return window.parent.frames.ro.location.href = "set_test_status.php?wid=" + WID + "&stchange=1", !1;
    if (40 == a.which) return window.parent.frames.ro.location.href = "set_test_status.php?wid=" + WID + "&stchange=-1", !1;
    if (27 == a.which) return window.parent.frames.ro.location.href =
        "set_test_status.php?wid=" + WID + "&status=" + $(".word").attr("data_status"), !1;
    for (var b = 1; 5 >= b; b++)
        if (a.which == 48 + b || a.which == 96 + b) return window.parent.frames.ro.location.href = "set_test_status.php?wid=" + WID + "&status=" + b, !1;
    return 73 == a.which ? (window.parent.frames.ro.location.href = "set_test_status.php?wid=" + WID + "&status=98", !1) : 87 == a.which ? (window.parent.frames.ro.location.href = "set_test_status.php?wid=" + WID + "&status=99", !1) : 69 == a.which ? (window.parent.frames.ro.location.href = "edit_tword.php?wid=" + WID,
        !1) : !0
}

function word_each_do_text_text(a) {
    a = $(this).attr("data_wid");
    if ("" != a) {
        var b = $(this).attr("data_order");
        b in ANN_ARRAY && a == ANN_ARRAY[b][1] && (a = ANN_ARRAY[b][2], (new RegExp("([" + DELIMITER + "][ ]{0,1}|^)(" + a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ")($|[ ]{0,1}[" + DELIMITER + "])", "")).test($(this).attr("data_trans").replace(/ \[.*$/, "")) || (b = a + " / " + $(this).attr("data_trans"), $(this).attr("data_trans", b.replace(" / *", ""))), $(this).attr("data_ann", a))
    }
    JQ_TOOLTIP || (this.title = make_tooltip($(this).text(), $(this).attr("data_trans"),
        $(this).attr("data_rom"), $(this).attr("data_status")))
}

function mword_each_do_text_text(a) {
    if ("" != $(this).attr("data_status")) {
        a = $(this).attr("data_wid");
        if ("" != a)
            for (var b = parseInt($(this).attr("data_order")), c = 2; 16 >= c; c += 2) {
                var d = (b + c).toString();
                if (d in ANN_ARRAY && a == ANN_ARRAY[d][1]) {
                    a = ANN_ARRAY[d][2];
                    (new RegExp("([" + DELIMITER + "][ ]{0,1}|^)(" + a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ")($|[ ]{0,1}[" + DELIMITER + "])", "")).test($(this).attr("data_trans").replace(/ \[.*$/, "")) || (b = a + " / " + $(this).attr("data_trans"), $(this).attr("data_trans", b.replace(" / *",
                        "")));
                    $(this).attr("data_ann", a);
                    break
                }
            }
        JQ_TOOLTIP || (this.title = make_tooltip($(this).attr("data_text"), $(this).attr("data_trans"), $(this).attr("data_rom"), $(this).attr("data_status")))
    }
}

function word_dblclick_event_do_text_text() {
    var a = parseInt($("#totalcharcount").text(), 10);
    0 != a && (a = 100 * ($(this).attr("data_pos") - 5) / a, 0 > a && (a = 0), "function" == typeof window.parent.frames.h.new_pos && window.parent.frames.h.new_pos(a))
}

function word_click_event_do_text_text() {
    var a = $(this).attr("data_status"),
        b = "";
    "undefined" != typeof $(this).attr("data_ann") && (b = $(this).attr("data_ann"));
    if (1 > a) {
        (run_overlib_status_unknown(WBLINK1, WBLINK2, WBLINK3, JQ_TOOLTIP ? make_tooltip($(this).text(), $(this).attr("data_trans"), $(this).attr("data_rom"), a) : $(this).attr("title"), TID, $(this).attr("data_order"), $(this).text(), RTL), top.frames.ro.location.href = "edit_word.php?tid=" + TID + "&ord=" + $(this).attr("data_order") + "&wid=")

    } else if (99 == a) {
        run_overlib_status_99(WBLINK1,
            WBLINK2, WBLINK3, JQ_TOOLTIP ? make_tooltip($(this).text(), $(this).attr("data_trans"), $(this).attr("data_rom"), a) : $(this).attr("title"), TID, $(this).attr("data_order"), $(this).text(), $(this).attr("data_wid"), RTL, b)
    } else if (98 == a) {
        run_overlib_status_98(WBLINK1, WBLINK2, WBLINK3, JQ_TOOLTIP ? make_tooltip($(this).text(), $(this).attr("data_trans"), $(this).attr("data_rom"), a) : $(this).attr("title"), TID, $(this).attr("data_order"), $(this).text(), $(this).attr("data_wid"), RTL, b)
    } else {
    var tooltip =   JQ_TOOLTIP ? make_tooltip($(this).text(), $(this).attr("data_trans"), $(this).attr("data_rom"), a) : $(this).attr("title");
        run_overlib_status_1_to_5(WBLINK1, WBLINK2, WBLINK3,
          tooltip, TID, $(this).attr("data_order"), $(this).text(), $(this).attr("data_wid"), a, RTL, b);
    }
    return !1
    
}

function mword_click_event_do_text_text() {
    var a = $(this).attr("data_status");
    if ("" != a) {
        var b = "";
        "undefined" != typeof $(this).attr("data_ann") && (b = $(this).attr("data_ann"));
        run_overlib_multiword(WBLINK1, WBLINK2, WBLINK3, JQ_TOOLTIP ? make_tooltip($(this).text(), $(this).attr("data_trans"), $(this).attr("data_rom"), a) : $(this).attr("title"), TID, $(this).attr("data_order"), $(this).attr("data_text"), $(this).attr("data_wid"), a, $(this).attr("data_code"), b)
    }
    return !1
}

function mword_drag_n_drop_select(a) {
    JQ_TOOLTIP && $(".ui-tooltip").remove();
    var b = $(this).parent();
    b.one("mouseup mouseout", $(this), function() {
        clearTimeout(to);
        $(".nword").removeClass("nword");
        $(".tword").removeClass("tword");
        $(".lword").removeClass("lword");
        $(".wsty", b).css("background-color", "").css("border-bottom-color", "");
        $("#pe").remove()
    });
    to = setTimeout(function() {
        var c;
        b.off("mouseout");
        $(".wsty", b).css("background-color", "inherit").css("border-bottom-color", "rgba(0,0,0,0)").not(".hide,.word").each(function() {
            f =
                2 * parseInt($(this).attr("data_code")) + parseInt($(this).attr("data_order")) - 1;
            h = "";
            $(this).nextUntil($('[id^="ID-' + f + '-"]', b), '[id$="-1"]').each(function() {
                l = $(this).attr("data_order");
                h = "undefined" != typeof l ? h + ('<span class="tword" data_order="' + l + '">' + $(this).text() + "</span>") : h + ('<span class="nword" data_order="' + $(this).attr("id").split("-")[1] + '">' + $(this).text() + "</span>")
            });
            $(this).html(h)
        });
        $("#pe").remove();
        $("body").append('<style id="pe">#' + b.attr("id") + " .wsty:after,#" + b.attr("id") + " .wsty:before{opacity:0}</style>");
        $('[id$="-1"]', b).not(".hide,.wsty").addClass("nword").each(function() {
            $(this).attr("data_order", $(this).attr("id").split("-")[1])
        });
        $(".word", b).not(".hide").each(function() {
            $(this).html('<span class="tword" data_order="' + $(this).attr("data_order") + '">' + $(this).text() + "</span>")
        });
        1 == a.data.annotation && $(".wsty", b).not(".hide").each(function() {
            $(this).children(".tword").last().attr("data_ann", $(this).attr("data_ann")).attr("data_trans", $(this).attr("data_trans")).addClass("content" + $(this).removeClass("status1 status2 status3 status4 status5 status98 status99").attr("data_status"))
        });
        3 == a.data.annotation && $(".wsty", b).not(".hide").each(function() {
            $(this).children(".tword").first().attr("data_ann", $(this).attr("data_ann")).attr("data_trans", $(this).attr("data_trans")).addClass("content" + $(this).removeClass("status1 status2 status3 status4 status5 status98 status99").attr("data_status"))
        });
        $(b).one("mouseover", ".tword", function() {
            $("html").one("mouseup", function() {
                $(".wsty", b).each(function() {
                    $(this).addClass("status" + $(this).attr("data_status"))
                });
                $(this).hasClass("tword") || ($("span",
                    b).removeClass("nword tword lword"), $(".wsty", b).css("background-color", "").css("border-bottom-color", ""), $("#pe").remove())
            });
            c = parseInt($(this).attr("data_order"));
            $(".lword", b).removeClass("lword");
            $(this).addClass("lword");
            $(b).on("mouseleave", function() {
                $(".lword", b).removeClass("lword")
            });
            $(b).one("mouseup", ".nword,.tword", function(a) {
                if (!0 !== a.handled) {
                    var c = $(".lword.tword", b).length;
                    if (0 < c)
                        if (g = $(".lword", b).first().attr("data_order"), 1 < c) {
                            var k = $(".lword", b).map(function() {
                                return $(this).text()
                            }).get().join("");
                            250 < k.length ? alert("selected text is too long!!!") : top.frames.ro.location.href = "edit_mword.php?tid=" + TID + "&len=" + c + "&ord=" + g + "&txt=" + k
                        } else top.frames.ro.location.href = "edit_word.php?tid=" + TID + "&ord=" + g + "&txt=" + $("#ID-" + g + "-1").text();
                    $("span", b).removeClass("tword nword");
                    a.handled = !0
                }
            })
        });
        $(b).hoverIntent({
            over: function() {
                $(".lword", b).removeClass("lword");
                var a = parseInt($(this).attr("data_order"));
                $(this).addClass("lword");
                if (a > c)
                    for (var e = c; e < a; e++) $('.tword[data_order="' + e + '"],.nword[data_order="' +
                        e + '"]', b).addClass("lword");
                else
                    for (e = c; e > a; e--) $('.tword[data_order="' + e + '"],.nword[data_order="' + e + '"]', b).addClass("lword")
            },
            out: function() {},
            sensitivity: 18,
            selector: ".tword"
        })
    }, 300)
}

function word_hover_over() {
    if (!$(".tword")[0]) {
        var a = $(this).attr("class").replace(/.*(TERM[^ ]*)( .*)*/, "$1");
        $("." + a).addClass("hword");
        JQ_TOOLTIP && $(this).trigger("mouseover")
    }
}

function word_hover_out() {
    $(".hword").removeClass("hword");
    JQ_TOOLTIP && $(".ui-helper-hidden-accessible>div[style]").remove()
}
jQuery.fn.extend({
    tooltip_wsty_content: function() {
        var a = new RegExp("([" + DELIMITER + "])(?! )", "g"),
            b = $(this).hasClass("mwsty") ? "<p><b style='font-size:120%'>" + $(this).attr("data_text") + "</b></p>" : "<p><b style='font-size:120%'>" + $(this).text() + "</b></p>",
            c = $(this).attr("data_rom"),
            d = $(this).attr("data_trans").replace(a, "$1 "),
            e = "",
            k = parseInt($(this).attr("data_status"));
        0 == k ? e = "Unknown [?]" : 5 > k && (e = "Learning [" + k + "]");
        5 == k && (e = "Learned [5]");
        98 == k && (e = "Ignored [Ign]");
        99 == k && (e = "Well Known [WKn]");
        "" !=
        c && (b += "<p><b>Roman.</b>: " + c + "</p>");
        "" != d && "*" != d && ($(this).attr("data_ann") && (a = $(this).attr("data_ann"), "" != a && "*" != a && (a = new RegExp("(.*[" + DELIMITER + "][ ]{0,1}|^)(" + a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ")($|[ ]{0,1}[" + DELIMITER + "].*$| \\[.*$)", ""), d = d.replace(a, '$1<span style="color:red">$2</span>$3'))), b += "<p><b>Transl.</b>: " + d + "</p>");
        return b + ('<p><b>Status</b>: <span class="status' + k + '">' + e + "</span></p>")
    }
});
jQuery.fn.extend({
    tooltip_wsty_init: function() {
        $(this).tooltip({
            position: {
                my: "left top+10",
                at: "left bottom",
                collision: "flipfit"
            },
            items: ".hword",
            show: {
                easing: "easeOutCirc"
            },
            content: function() {
                return $(this).tooltip_wsty_content()
            }
        })
    }
});

function keydown_event_do_text_text(a) {
    if (27 == a.which) return TEXTPOS = -1, $("span.uwordmarked").removeClass("uwordmarked"), $("span.kwordmarked").removeClass("kwordmarked"), cClick(), !1;
    if (13 == a.which) {
        $("span.uwordmarked").removeClass("uwordmarked");
        a = $("span.status0.word:not(.hide):first");
        if (0 == a.size()) return !1;
        $(window).scrollTo(a, {
            axis: "y",
            offset: -150
        });
        a.addClass("uwordmarked").click();
        cClick();
        return !1
    }
    var b = $("span.word:not(.hide):not(.status0)" + ADDFILTER + ",span.mword:not(.hide)" + ADDFILTER),
        c = b.size();
    if (0 == c && 40 > a.which) return !0;
    if (36 == a.which) return $("span.kwordmarked").removeClass("kwordmarked"), TEXTPOS = 0, curr = b.eq(TEXTPOS), curr.addClass("kwordmarked"), $(window).scrollTo(curr, {
        axis: "y",
        offset: -150
    }), a = "", "undefined" != typeof curr.attr("data_ann") && (a = curr.attr("data_ann")), window.parent.frames.ro.location.href = "show_word.php?wid=" + curr.attr("data_wid") + "&ann=" + encodeURIComponent(a), !1;
    if (35 == a.which) return $("span.kwordmarked").removeClass("kwordmarked"), TEXTPOS = c - 1, curr = b.eq(TEXTPOS),
        curr.addClass("kwordmarked"), $(window).scrollTo(curr, {
            axis: "y",
            offset: -150
        }), a = "", "undefined" != typeof curr.attr("data_ann") && (a = curr.attr("data_ann")), window.parent.frames.ro.location.href = "show_word.php?wid=" + curr.attr("data_wid") + "&ann=" + encodeURIComponent(a), !1;
    if (37 == a.which) return $("span.kwordmarked").removeClass("kwordmarked"), TEXTPOS--, 0 > TEXTPOS && (TEXTPOS = c - 1), curr = b.eq(TEXTPOS), curr.addClass("kwordmarked"), $(window).scrollTo(curr, {
            axis: "y",
            offset: -150
        }), a = "", "undefined" != typeof curr.attr("data_ann") &&
        (a = curr.attr("data_ann")), window.parent.frames.ro.location.href = "show_word.php?wid=" + curr.attr("data_wid") + "&ann=" + encodeURIComponent(a), !1;
    if (39 == a.which) return $("span.kwordmarked").removeClass("kwordmarked"), TEXTPOS++, TEXTPOS >= c && (TEXTPOS = 0), curr = b.eq(TEXTPOS), curr.addClass("kwordmarked"), $(window).scrollTo(curr, {
            axis: "y",
            offset: -150
        }), a = "", "undefined" != typeof curr.attr("data_ann") && (a = curr.attr("data_ann")), window.parent.frames.ro.location.href = "show_word.php?wid=" + curr.attr("data_wid") +
        "&ann=" + encodeURIComponent(a), !1;
    if (!$(".kwordmarked, .uwordmarked")[0] && $(".hword:hover")[0]) curr = $(".hword:hover");
    else {
        if (0 > TEXTPOS || TEXTPOS >= c) return !0;
        curr = b.eq(TEXTPOS)
    }
    for (var b = curr.attr("data_wid"), c = curr.attr("data_order"), d = curr.attr("data_status"), e = curr.hasClass("mwsty") ? curr.attr("data_text") : curr.text(), k = "", m = 1; 5 >= m; m++)
        if (a.which == 48 + m || a.which == 96 + m)
            if ("0" == d) {
                if (1 == m) {
                    var n = WBLINK3.replace(/.*[?&]sl=([a-zA-Z\-]*)(&.*)*$/, "$1"),
                        p = WBLINK3.replace(/.*[?&]tl=([a-zA-Z\-]*)(&.*)*$/, "$1");
                    n != WBLINK3 && p != WBLINK3 && (m = m + "&sl=" + n + "&tl=" + p)
                }
                window.parent.frames.ro.location.href = "set_word_on_hover.php?text=" + e + "&tid=" + TID + "&status=" + m
            } else return window.parent.frames.ro.location.href = "set_word_status.php?wid=" + b + "&tid=" + TID + "&ord=" + c + "&status=" + m, !1;
    if (73 == a.which)
        if ("0" == d) window.parent.frames.ro.location.href = "set_word_on_hover.php?text=" + e + "&tid=" + TID + "&status=98";
        else return window.parent.frames.ro.location.href = "set_word_status.php?wid=" + b + "&tid=" + TID + "&ord=" + c + "&status=98", !1;
    if (87 ==
        a.which) return window.parent.frames.ro.location.href = "0" == d ? "set_word_on_hover.php?text=" + e + "&tid=" + TID + "&status=99" : "set_word_status.php?wid=" + b + "&tid=" + TID + "&ord=" + c + "&status=99", !1;
    if (80 == a.which) return a = WBLINK3.replace(/.*[?&]sl=([a-zA-Z\-]*)(&.*)*$/, "$1"), b = new Audio, b.src = "tts.php?tl=" + a + "&q=" + e, b.play(), !1;
    if (84 == a.which) {
        if ("*http://" == WBLINK3.substr(0, 8) || "*https://" == WBLINK3.substr(0, 9)) owin("trans.php?x=1&i=" + c + "&t=" + TID);
        else if ("http://" == WBLINK3.substr(0, 7) || "https://" == WBLINK3.substr(0,
                8) || "ggl.php" == WBLINK3.substr(0, 7)) window.parent.frames.ru.location.href = "trans.php?x=1&i=" + c + "&t=" + TID;
        return !1
    }
    if (65 == a.which) {
        a = curr.attr("data_pos");
        b = parseInt($("#totalcharcount").text(), 10);
        if (0 == b) return !0;
        a = 100 * (a - 5) / b;
        0 > a && (a = 0);
        if ("function" == typeof window.parent.frames.h.new_pos) window.parent.frames.h.new_pos(a);
        else return !0;
        return !1
    }
    71 == a.which && (k = "&nodict", setTimeout(function() {
        "*http://" == WBLINK3.substr(0, 8) || "*https://" == WBLINK3.substr(0, 9) ? owin(createTheDictUrl(WBLINK3.replace("*",
            ""), e)) : window.parent.frames.ru.location.href = createTheDictUrl(WBLINK3, e)
    }, 10));
    return 69 == a.which || 71 == a.which ? (curr.hasClass("mword") ? window.parent.frames.ro.location.href = "edit_mword.php?wid=" + b + "&len=" + curr.attr("data_code") + "&tid=" + TID + "&ord=" + c + k : window.parent.frames.ro.location.href = "0" == d ? "edit_word.php?wid=&tid=" + TID + "&ord=" + c + k : "edit_word.php?wid=" + b + "&tid=" + TID + "&ord=" + c + k, !1) : !0
}

function do_ajax_save_setting(a, b) {
    $.post("ajax_save_setting.php", {
        k: a,
        v: b
    })
}

function do_ajax_update_media_select() {
    $("#mediaselect").html('&nbsp; <img src="icn/waiting2.gif" />');
    $.post("ajax_update_media_select.php", function(a) {
        $("#mediaselect").html(a)
    })
}

function do_ajax_show_sentences(a, b, c, d) {
    $("#exsent").html('<img src="icn/waiting2.gif" />');
    $.post("ajax_show_sentences.php", {
        lang: a,
        word: b,
        ctl: c,
        woid: d
    }, function(a) {
        $("#exsent").html(a)
    })
}

function do_ajax_show_similar_terms() {
    $("#simwords").html('<img src="icn/waiting2.gif" />');
    $.post("ajax_show_similar_terms.php", {
        lang: $("#langfield").val(),
        word: $("#wordfield").val()
    }, function(a) {
        $("#simwords").html(a)
    })
}

function do_ajax_word_counts() {
    var a = $(".markcheck").map(function() {
        return $(this).val()
    }).get().join(",");
    $.post("ajax_word_counts.php", {
        id: a
    }, function(a) {
        WORDCOUNTS = a;
        word_count_click();
        $(".barchart").removeClass("hide")
    }, "json")
}

function set_word_counts() {
    $.each(WORDCOUNTS.totalu, function(a, b) {
        var c = known = todo = stat0 = 0,
            d = WORDCOUNTS.expru[a] ? parseInt(SUW & 2 ? WORDCOUNTS.expru[a] : WORDCOUNTS.expr[a]) : 0;
        WORDCOUNTS.stat[a] || (WORDCOUNTS.statu[a] = WORDCOUNTS.stat[a] = []);
        $("#total_" + a).html(SUW & 1 ? b : WORDCOUNTS.total[a]);
        $.each(WORDCOUNTS.statu[a], function(b, d) {
            SUW & 8 && $("#stat_" + b + "_" + a).html(d);
            c += parseInt(d)
        });
        $.each(WORDCOUNTS.stat[a], function(b, c) {
            SUW & 8 || $("#stat_" + b + "_" + a).html(c);
            known += parseInt(c)
        });
        $("#saved_" + a).html(known ? (SUW &
            2 ? c : known) - d + "+" + d : 0);
        todo = SUW & 4 ? parseInt(b) + parseInt(WORDCOUNTS.expru[a] || 0) - parseInt(c) : parseInt(WORDCOUNTS.total[a]) + parseInt(WORDCOUNTS.expr[a] || 0) - parseInt(known);
        $("#todo_" + a).html(todo);
        stat0 = SUW & 8 ? parseInt(b) + parseInt(WORDCOUNTS.expru[a] || 0) - parseInt(c) : parseInt(WORDCOUNTS.total[a]) + parseInt(WORDCOUNTS.expr[a] || 0) - parseInt(known);
        $("#stat_0_" + a).html(stat0)
    });
    $(".barchart").each(function() {
        var a = $(this).find("span").first().attr("id").split("_")[2],
            b = SUW & 8 ? parseInt(WORDCOUNTS.expru[a] || 0) +
            parseInt(WORDCOUNTS.totalu[a]) : parseInt(WORDCOUNTS.expr[a] || 0) + parseInt(WORDCOUNTS.total[a]);
        $(this).children("li").each(function() {
            var a = 25 * (b - $(this).children("span").text()) / b;
            $(this).css("border-top-width", a + "px")
        })
    })
}

function word_count_click() {
    $(".wc_cont").children().each(function() {
        1 == parseInt($(this).attr("data_wo_cnt")) ? $(this).html("u") : $(this).html("t");
        SUW = (parseInt($("#chart").attr("data_wo_cnt")) << 3) + (parseInt($("#unknown").attr("data_wo_cnt")) << 2) + (parseInt($("#saved").attr("data_wo_cnt")) << 1) + parseInt($("#total").attr("data_wo_cnt"));
        set_word_counts()
    })
}

function do_ajax_edit_impr_text(a, b) {
    "" == b && $("#editimprtextdata").html('<img src="icn/waiting2.gif" />');
    var c = $("#editimprtextdata").attr("data_id");
    $.post("ajax_edit_impr_text.php", {
        id: c,
        word: b
    }, function(b) {
        eval(b);
        $.scrollTo(a);
        $("input.impr-ann-text").change(changeImprAnnText);
        $("input.impr-ann-radio").change(changeImprAnnRadio)
    })
}
$.fn.serializeObject = function() {
    var a = {},
        b = this.serializeArray();
    $.each(b, function() {
        void 0 !== a[this.name] ? (a[this.name].push || (a[this.name] = [a[this.name]]), a[this.name].push(this.value || "")) : a[this.name] = this.value || ""
    });
    return a
};
$(window).load(function() {
    $(":input,.wrap_checkbox span,.wrap_radio span,a:not([name^=rec]),select,#mediaselect span.click,#forwbutt,#backbutt").each(function(a) {
        $(this).attr("tabindex", a + 1)
    });
    $(".wrap_radio span").bind("keydown", function(a) {
        if (32 == a.keyCode) return $(this).parent().parent().find("input[type=radio]").trigger("click"), !1
    })
});
$(document).ready(function() {
    $(".edit_area").editable("inline_edit.php", {
        type: "textarea",
        indicator: '<img src="icn/indicator.gif">',
        tooltip: "Click to edit...",
        submit: "Save",
        cancel: "Cancel",
        rows: 3,
        cols: 35
    });
    $("select").wrap("<label class='wrap_select'></label>");
    $("form").attr("autocomplete", "off");
    $('input[type="file"]').each(function() {
        if (!$(this).is(":visible")) $(this).before('<button class="button-file">Choose File</button>').after('<span style="position:relative" class="fakefile"></span>').on("change",
            function() {
                var a = this.value.replace("C:\\fakepath\\", "");
                85 < a.length && (a = a.replace(/.*(.{80})$/, " ... $1"));
                $(this).next().text(a)
            }).on("onmouseout", function() {
            var a = this.value.replace("C:\\fakepath\\", "");
            85 < a.length && (a = a.replace(/.*(.{80})$/, " ... $1"));
            $(this).next().text(a)
        })
    });
    $('input[type="checkbox"]').each(function(a) {
        "undefined" == typeof a && (a = 1);
        "undefined" == typeof $(this).attr("id") && $(this).attr("id", "cb_" + a++);
        $(this).after('<label class="wrap_checkbox" for="' + $(this).attr("id") + '"><span></span></label>')
    });
    $('span[class*="tts_"]').click(function() {
        var a = $(this).attr("class").replace(/.*tts_([a-zA-Z-]+).*/, "$1"),
            b = $(this).text(),
            c = new Audio;
        c.src = "tts.php?tl=" + a + "&q=" + b;
        c.play()
    });
    $(document).mouseup(function() {
        $("button,input[type=button],.wrap_radio span,.wrap_checkbox span").blur()
    });
    $(".wrap_checkbox span").bind("keydown", function(a) {
        if (32 == a.keyCode) return $(this).parent().parent().find("input[type=checkbox]").trigger("click"), !1
    });
    $('input[type="radio"]').each(function(a) {
        "undefined" == typeof a &&
            (a = 1);
        "undefined" == typeof $(this).attr("id") && $(this).attr("id", "rb_" + a++);
        $(this).after('<label class="wrap_radio" for="' + $(this).attr("id") + '"><span></span></label>')
    });
    $(".button-file").click(function() {
        $(this).next('input[type="file"]').click();
        return !1
    });
    $("input.impr-ann-text").change(changeImprAnnText);
    $("input.impr-ann-radio").change(changeImprAnnRadio);
    $("form.validate").submit(check);
    $("input.markcheck").click(markClick);
    $("#showallwords").click(showallwordsClick);
    $("textarea.textarea-noreturn").keydown(textareaKeydown);
    $("#termtags").tagit({
        availableTags: TAGS,
        fieldName: "TermTags[TagList][]"
    });
    $("#texttags").tagit({
        availableTags: TEXTTAGS,
        fieldName: "TextTags[TagList][]"
    });
    markClick();
    setTheFocus();
    0 < $("#simwords").length && 0 < $("#langfield").length && 0 < $("#wordfield").length && ($("#wordfield").blur(do_ajax_show_similar_terms), do_ajax_show_similar_terms());
    window.setTimeout(noShowAfter3Secs, 3E3)
});