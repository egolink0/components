(function () {
    'use strict';
    var _win = window,
        jj = _win.jjmatch = _win.jjmatch || {},
        event = jj.event;

    if (!(typeof module === "object" && module && typeof module.exports === "object") && jj.swiper) {
        return;
    }

    var dom_class = {
        add: function(dom, class_name) {
            var h5_class = dom.classList;
            if (h5_class) {
                return h5_class.add(class_name);
            }
            var class_str = '';
            if (!dom_class.contains(dom, class_name)) {
                class_str = ' ' + class_name;
            }
            dom.className += class_str;
        },
        remove: function(dom, class_name) {
            var h5_class = dom.classList;
            if (h5_class) {
                return h5_class.remove(class_name);
            }
            var reg = new RegExp('(^|\\s)' + class_name + '(\\s|$)', 'g'),
                className = dom.className.replace(reg, ' ');

            dom.className = className;
        },
        contains: function(dom, class_name) {
            var h5_class = dom.classList;
            if (h5_class) {
                return h5_class.contains(class_name);
            }
            var reg = new RegExp('(^|\\s)' + class_name + '(\\s|$)'),
                dom_class = dom.className;
            return reg.test(dom_class)
        }
    }


    function _getdom_by_class(classname, parent) {
        if(!parent) {
            parent = document
        }
        if(parent.getElementsByClassName) {
            return parent.getElementsByClassName(classname)
        }
        var eleArr = parent.getElementsByTagName('*');
        var classArr = [];
        for(var i = 0; i < eleArr.length; i ++) {
            if(dom_class.contains(eleArr[i], 'classname')) {
                classArr.push(eleArr[i]);
            }
        }
        return classArr;
    }

    var slider = (function () {

        function Slider(dom) {
            this.dom = dom;
            this.control_bar = null//dom.control_bars;
            this.control_bar_arr = null//$('span', this.control_bar);
            this.img_item = null//dom.img_item_arr;
            this.num = 0;
        }

        Slider.prototype.change_active = function (index, type) {
            var that = this;
            function item(opacity, zIndex) {
                that.img_item[index].style.opacity = opacity;
                that.img_item[index].style.zIndex = zIndex;
            }
            if (type === 'show') {
                item('1', '5');
                dom_class.add(that.control_bar_arr[index], 'active');
                return
            }
            item('0', '1');
            dom_class.remove(that.control_bar_arr[index], 'active');
        }

        Slider.prototype.all_change = function (index) {
            var j = 0,
                lengthj = this.img_item.length;
            for (; j < lengthj; j++) {
                if (j === index) {
                    this.change_active(j, 'show');
                } else {
                    this.change_active(j, 'hide');
                }
            }
        }

        function _slider_style() {
            var style = '.u_slider_box{position: absolute; top:213px; left:0; width:526px}' +
                '.u_slider_box .img_item {position: relative;height: 260px}' +
                '.u_slider_box .img_item a{position: absolute; opacity: 0;  transition: all 0.3s linear;z-index: 1;}' +
                '.u_slider_box .control_item {margin-top: 10px; text-align: center;}' +
                '.u_slider_box .control_item span {display: inline-block; width:15px; height: 15px;  border-radius: 15px; cursor: pointer;margin: 0 5px; background: url(//img1.cache.jj.cn/www/ldzlm/pc/circul_icon.png) no-repeat; background-position: 0 -65px;}' +
                '.u_slider_box .control_item span.active{background-position: 0 0;}';
            var dom_style = document.createElement('style');
            dom_style.innerHTML = style;
            var head = document.getElementsByTagName('head')[0],
                first_link = document.getElementsByTagName('link')[0];
            head.insertBefore(dom_style, first_link);
        }

        Slider.prototype.init = function () {
            var that = this,
                img_arr = this.dom.img_arr,
                href_arr = this.dom.href_arr || [],
                i = 0,
                length = img_arr.length,
                u_slider_box = document.createElement('div'),
                html_img = '<div class="img_item">',
                html_span = '<div class="control_item">';

            u_slider_box.className = 'u_slider_box';
            _slider_style();
            for(; i < length; i++) {
                html_img += ' <a href="'+ ( href_arr[i] ? href_arr[i].url : "javascript:;") +'" '+ ( href_arr[i] ?  (href_arr[i].target ? "target='_blank'" : "")  : "") +' ><img src="'+ img_arr[i] +'" alt="" ></a>'
                html_span += '<span></span>'
            }
            html_img += '</div>';
            html_span += '</div>';
            u_slider_box.innerHTML = html_img + html_span;

            this.dom.box.appendChild(u_slider_box);

            this.control_bar = _getdom_by_class('control_item', u_slider_box)[0];
            this.control_bar_arr = this.control_bar.getElementsByTagName('span');
            this.img_item = _getdom_by_class('img_item', u_slider_box)[0].getElementsByTagName('a');

            this.change_active(0, 'show');
            event.delegate(that.control_bar, 'click', 'span', function (e) {
                var target = e.target || e.srcElement,
                    index,
                    i = 0,
                    length = that.control_bar_arr.length;
                for (; i < length; i++) {
                    if (that.control_bar_arr[i] === target) {
                        index = i;
                        break;
                    }
                }
                that.num = index;
                that.all_change(index);
            })
        };

        Slider.prototype.auto = function (time) {
            var that = this;
            this.num = 0;
            function reset_num(num) {
                var length = that.img_item.length;
                if (num >= length) {
                    return 0
                } else if (num < 0) {
                    return length - 1
                } else {
                    return num
                }
            }
            setInterval(function () {
                that.num = reset_num(++that.num);
                that.all_change(that.num);
            }, time)
        }

        return Slider

    })();


    var Swiper = (function () {
        function change_item_active(top, next, last, index, href_arr) {
            dom_class.add(top, 'top');

            next && dom_class.add(next, 'next');

            if(last && last !== top && last !== next) {
                dom_class.add(last, 'last');
            }
            var t_a , n_a, l_a;
            if(href_arr.length > 0) {
                t_a = top.getElementsByTagName('a')[0];
                t_a.setAttribute('href', href_arr[index].url);
                next && (n_a = next.getElementsByTagName('a')[0]);
                next && (n_a.setAttribute('href', 'javascript:;'));
                last && (l_a = last.getElementsByTagName('a')[0]);
                last && l_a.setAttribute('href', 'javascript:;');
            }
        }
        function remove_item_active(top, next, last) {
            dom_class.remove(top, 'top');
            next && dom_class.remove(next, 'next');
            last && dom_class.remove(last, 'last');
        }

        function reset_num(num, length) {
            if (num >= length) {
                return 0
            } else if (num < 0) {
                return length - 1
            } else {
                return num
            }
        };

        function swiper_event_control(swiper_arr, control, length, type, href_arr) {
            if (control.change_lock) {
                return
            }
            control.change_lock = true;
            setTimeout(function () {
                control.change_lock = false;

            }, 300)
            var top_index = control.top_index;
            remove_item_active(swiper_arr[top_index], swiper_arr[reset_num(top_index + 1, length)], swiper_arr[reset_num(top_index - 1, length)]);
            if (type === 'add') {
                control.top_index = reset_num(++control.top_index, length);
            } else {
                control.top_index = reset_num(--control.top_index, length);
            }
            top_index = control.top_index;
            change_item_active(swiper_arr[top_index], swiper_arr[reset_num(top_index + 1, length)], swiper_arr[reset_num(top_index - 1, length)], top_index, href_arr);
        }

        function Swiper(dom) {
            this.box = dom.box;
            this.img_arr = dom.img_arr;
            this.href_arr = dom.href_arr || [];
            this.swiper_arr = null;
            this.length = null;
            this.swiper_button_prev = null;
            this.swiper_button_next = null;
            this.control = {
                top_index: null,
                change_lock: false
            };
            this.touch_obj = {
                start_event: null,
                end_event: null,
                x: null,
                y: null
            };
        }


        function _swiper_style() {
            var style = '.u_swiper_box {width: 1010px; margin:0 auto ; padding-top: 250px; box-sizing: border-box;}' +
                '.swiper_container {position: relative;width: 1010px; height:440px;}' +
                '.swiper_wrapper{position: absolute; width: 1010px; height:440px; }' +
                '.swiper_wrapper .img{opacity: 0; width: 649px; height:334px; z-index:1; position: absolute; left: 50%; margin-left:-320px;top:50%; margin-top: -160px;/* transform: scale(.8);  */-o-transition: all .3s linear; -moz-transition: all .3s linear; -webkit-transition: all .3s linear; transition: all .3s linear; text-align: center; -webkit-user-select: none;-webkit-touch-callout: none;-moz-user-select: none;-ms-user-select: none; user-select: none;}' +
                '.swiper_wrapper .top{ z-index:2;margin-top:-200px;width: 820px; height: 420px;opacity: 1;margin-left:-410px; box-sizing: border-box}' +
                '.swiper_wrapper .next, .swiper_wrapper .last{opacity: .8; }' +
                '.swiper_wrapper .next{margin-left:-120px;}' +
                '.swiper_wrapper .last{margin-left:-520px;}' +
                '.swiper_wrapper img{width: 100%; border-radius: 5px;cursor:default}' +
                '.swiper_wrapper .top img{width: 99%; border: 2px solid #000;box-shadow: 0px 0 20px red;}' +
                '.swiper_button_prev, .swiper_button_next{width:77px; height:41px;background: url(//img1.cache.jj.cn/www/ldzlm/pc/swiper_button.png); position: absolute; top: 50%; margin-top: -10px;z-index: 5;cursor: pointer;}' +
                '.swiper_button_prev{left: 10px;background-position: 0 -45px;}' +
                '.swiper_button_next {right: 10px;background-position: -78px -45px;}' ;
            var dom_style = document.createElement('style');
            dom_style.innerHTML = style;
            var head = document.getElementsByTagName('head')[0],
                first_link = document.getElementsByTagName('link')[0];
            head.insertBefore(dom_style, first_link);
        }

        Swiper.prototype.init = function () {
            var that = this,
                i = 0,
                img_arr = this.img_arr,
                length = img_arr.length,
                html = '<div class="swiper_wrapper">';
            _swiper_style();
            for(; i < length; i++) {
                html += '<div class="img"> <a href="javascript:;" '+ ( that.href_arr[i] ?  (that.href_arr[i].target ? "target='_blank'" : "")  : "") +' ><img src="'+ img_arr[i] +'" alt="" ></a></div>'
            }

            if(length > 1) {
                html += '</div><div class="swiper_button_prev"></div><div class="swiper_button_next"></div>';
            }

            this.box.innerHTML = html;
            this.swiper_arr =  _getdom_by_class('img', that.box);
            this.length = this.swiper_arr.length;
            this.swiper_button_prev =  _getdom_by_class('swiper_button_prev', that.box)[0];
            this.swiper_button_next = _getdom_by_class('swiper_button_next', that.box)[0];

            change_item_active(this.swiper_arr[0], this.swiper_arr[1], this.swiper_arr[this.length - 1], 0, that.href_arr);
            this.control.top_index = 0;

            if(length <= 1) {
                return
            }

            event.bind(this.swiper_button_next, 'click', function (e) {
                swiper_event_control(that.swiper_arr, that.control, that.length, 'add', that.href_arr);
            });
            event.bind(this.swiper_button_prev, 'click', function (e) {
                swiper_event_control(that.swiper_arr, that.control, that.length, '-', that.href_arr);
            });
        }

        Swiper.prototype.touch = function (item) {
            var x,
                y,
                that = this;

            event.delegate(this.swiper_arr[0].parentNode, 'touchstart', item, function(e) {
                x = e.changedTouches[0].clientX;
                y = e.changedTouches[0].clientY;
            })

            event.delegate(this.swiper_arr[0].parentNode, 'touchend', item, function(e) {
                var end_x = e.changedTouches[0].clientX,
                    end_y = e.changedTouches[0].clientY;
                if (Math.abs(end_y - y) > Math.abs(end_x - x)) {
                    return
                }
                if (end_x - x < -30) {
                    swiper_event_control(that.swiper_arr, that.control, that.length, 'add', that.href_arr);
                }
                if (end_x - x > 30) {
                    swiper_event_control(that.swiper_arr, that.control, that.length, '-', that.href_arr);
                }
            })
        }

        return Swiper
    })();

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = {
            Swiper: Swiper,
            Slider: slider
        };
    } else {
        jj.swiper = {
            Swiper: Swiper,
            Slider: slider
        }
    }
})();