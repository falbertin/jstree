(function ($) {
	$.jstree.plugin("themeroller", {
            __construct : function () {
                var container = this.get_container();
                var settings = this.get_settings(true).themeroller;

                $(container).bind('before.jstree', function(){
                    container.addClass("ui-widget");
                    $("#" + container.attr("id") + " li a").live("mouseover", function () { $(this).addClass("ui-state-hover"); });
                    $("#" + container.attr("id") + " li a").live("mouseout",  function () { $(this).removeClass("ui-state-hover"); });
                });

                $(container).bind("__construct.jstree", $.proxy(function () {
                    var s = this.get_settings(true).themeroller;

                    this.data.themeroller.dots = s.dots; 
                    this.data.themeroller.icons = s.icons; 

                    s.theme = this.data.core.rtl ? 'default-rtl' : 'default'; 
                    this.set_theme(s.theme, s.url);

                    this[ this.data.themeroller.icons ?  "show_icons" : "hide_icons" ]();
                }, this));

                var styleNodes = function() {
                    // Deselect nodes
                    $(container).find('a').removeClass('ui-state-active');
                    
                    // Ensure dots are applied
                    $(container).children("ul").addClass(settings.dots ? "ui-widget-jstree-dots" : "ui-widget-jstree-no-dots");
                        
                    $(container).find("a").not(".ui-state-default").addClass("ui-state-default");
                    
                    $(container).find('a').each(function(){
                        var data = $(this).find('[data-options]').data('options');
                        if (data.classes) {
                            $(this).addClass(data.classes);
                        }
                    });
                    
                    $(container).find('ins.jstree-icon.jstree-ocl').addClass('ui-icon ui-widget-jstree-node-icon');
                    
                    $(container).find('ins').each(function(){
                        
                        if ($(this).parent().hasClass('jstree-leaf')) $(this).addClass('ui-icon-jstree-leaf');
                        else $(this).removeClass('ui-icon-jstree-leaf');
                        
                        if ($(this).parent().hasClass('jstree-last')) $(this).addClass('ui-icon-jstree-last');
                        else $(this).removeClass('ui-icon-jstree-last');
                        
                        if ($(this).parent().hasClass('jstree-closed')) $(this).addClass('ui-icon-carat-1-e');
                        else $(this).removeClass('ui-icon-carat-1-e');

                        if ($(this).parent().hasClass('jstree-open')) $(this).addClass('ui-icon-carat-1-se');
                        else $(this).removeClass('ui-icon-carat-1-se');
                        
                    });
                    return true;
                }

                $(container).bind('open_node.jstree close_node.jstree load_node.jstree', styleNodes);

                $(container).bind('select_node.jstree', function(event, data){
                    $(container).find('a').removeClass('ui-state-active');
                    $(data.rslt.obj).each(function(){
                        $(this).children('a').each(function(){
                            if($(this).hasClass('ui-state-active')) {
                                $(this).removeClass('ui-state-active');
                            } else {
                                $(this).addClass('ui-state-active');
                            }
                        });
                    });

                    return true;
                });
                
                $(container).bind('move_node.jstree', function(event, data){
                    $(data.rslt.obj).children('a').removeClass('ui-state-active');
                    return styleNodes();
                });

            },
            defaults : { 
                dots: true,
                icons: true
            },
            _fn : {
                set_theme : function () {
                    this.get_container().addClass('ui-widget-jstree');
                    this.__callback();
                },
                hide_dots: function () { 
                    this.data.themeroller.dots = false; 
                    this.get_container().children("ul").addClass("ui-widget-jstree-no-dots"); 
                },
                toggle_dots: function () { 
                    if(this.data.themeroller.dots) this.hide_dots(); 
                    else this.show_dots(); 
                },
                show_icons: function () { 
                    this.data.themeroller.icons = true; 
                    this.get_container().children("ul").removeClass("ui-widget-jstree-no-icons"); 
                },
                hide_icons: function () { 
                    this.data.themeroller.icons = false; 
                    this.get_container().children("ul").addClass("ui-widget-jstree-no-icons"); 
                },
                toggle_icons: function () { 
                    if(this.data.themeroller.icons) this.hide_icons();  
                    else this.show_icons(); 
                },
                set_icon : function (obj, icon) { 
                    obj = this.get_node(obj);
                    if(!obj || obj === -1 || !obj.length) { 
                        return false; 
                    }
                    obj = obj.find("> a > .jstree-themeicon");
                    if(icon === false) { 
                        this.hide_icon(obj);
                    } else if(icon.indexOf("/") === -1) { 
                        obj.addClass(icon).attr("rel",icon);
                    } else { 
                        obj.css("background", "url('" + icon + "') center center no-repeat").attr("rel",icon);
                    }
                    return true;
                },
                get_icon : function (obj) {
                    obj = this.get_node(obj);
                    if(!obj || obj === -1 || !obj.length) { return null; }
                    obj = obj.find("> a > .jstree-themeicon");
                    if(obj.hasClass('jstree-themeicon-hidden')) { return false; }
                    obj = obj.attr("rel");
                    return (obj && obj.length) ? obj : null;
                },
                hide_icon : function (obj) {
                    obj = this.get_node(obj);
                    if(!obj || obj === -1 || !obj.length) { return false; }
                    obj.find('> a > .jstree-themeicon').addClass('jstree-themeicon-hidden');
                    return true;
                },
                show_icon : function (obj) {
                    obj = this.get_node(obj);
                    if(!obj || obj === -1 || !obj.length) { return false; }
                    obj.find('> a > .jstree-themeicon').removeClass('jstree-themeicon-hidden');
                    return true;
                },

                clean_node : function(obj) {
                    obj = this.__call_old();
                    var t = this;
                    return obj.each(function () {
                        var o = $(this), d = o.data("jstree");

                        if(!o.find("> a > ins.jstree-themeicon").length) { 
                            o.children("a").prepend("<ins class='jstree-icon jstree-themeicon'>&#160;</ins>");
                        }
                        if(d && typeof d.icon !== 'undefined') {
                            t.set_icon(o, d.icon);
                            delete d.icon;
                        }
                    });
                },
                get_state : function () {
                    var state = this.__call_old();
                    state.themes = { 'theme' : this.get_theme(), 'icons' : this.data.themes.icons, 'dots' : this.data.themes.dots };
                    return state;
                },
                set_state : function (state, callback) {
                    if(this.__call_old()) {
                        if(state.themes) {
                            if(state.themes.theme) {
                                this.set_theme(state.themes.theme);
                            }
                            if(typeof state.themes.dots !== 'undefined') {
                                this[ state.themes.dots ? "show_dots" : "hide_dots" ]();
                            }
                            if(typeof state.themes.icons !== 'undefined') {
                                this[ state.themes.icons ? "show_icons" : "hide_icons" ]();
                            }
                            delete state.themes;
                            this.set_state(state, callback);
                            return false;
                        }
                        return true;
                    }
                    return false;
                },
                get_json : function (obj, is_callback) {
                    var r = this.__call_old(), i;
                    if(is_callback) {
                        i = this.get_icon(obj);
                        if(typeof i !== 'undefined' && i !== null) { 
                            r.data.jstree.icon = i; 
                        }
                    }
                    return r;
                }
            }
	});
	$(function () {
            // autodetect themes path
            var css_string = '' + 
                            '.jstree a { height: 20px; line-height: 20px; } ' +
                            '.jstree a { text-decoration:none; } ' + 
                            '.jstree a > .jstree-themeicon { height:16px; width:16px; margin-right:3px; } ' + 
                            '.jstree-rtl a > .jstree-themeicon { margin-left:3px; margin-right:0; } ' + 
                            '.jstree .jstree-no-icons .jstree-themeicon, .jstree .jstree-themeicon-hidden { display:none; } ';
            // Correct IE 6 (does not support the > CSS selector)
            if($.jstree.IS_IE6) { 
                css_string += '' + 
                    '.jstree li a .jstree-themeicon { height:16px; width:16px; margin-right:3px; } ' + 
                    '.jstree-rtl li a .jstree-themeicon { margin-right:0px; margin-left:3px; } ';
            }
            // the default stylesheet
            $.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});
	// include the themes plugin by default
            $.jstree.defaults.plugins.push("themes");
})(jQuery);
