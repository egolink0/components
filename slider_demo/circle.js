;(function (_win) {

    /*使用构造函数模式，构建*/
    var _doc = document;
    if(!_win.dinosaur){
        _win.dinosaur = {};
    }

    function Circle(obj) {
        /*强制使用new关键字，避免函数调用(Circle(obj)),使的this绑定到window上面*/
        if(!(this instanceof Circle)){
            return new Circle(obj);
        };

        this.box_dom = this.get_id_dom(obj.box_dom) || obj.box_dom;
        this.circle_img_list = obj.circle_img_list;
        this.circle_a_list = obj.circle_a_list || undefined;
        this.circle_len = this.circle_img_list.length;
        this.circle_time = obj.circle_time,
        this.has_order = obj.has_order || undefined;
        this.cur_num = 0;  /*初始化 current img num 0*/
        this.img_list_dom = [];  /*图片序列*/
        this.icons_dom = [];  /*脚标序列*/
        this.timer = null;
    }

    Circle.prototype.get_id_dom = function (id) {
        return _doc.getElementById(id);
    }

    Circle.prototype.create_ele = function(ele){
        return _doc.createElement(ele);
    }

    Circle.prototype.reset_cur_num = function (cur_num) {
        var res;
        if(cur_num < 0){
            res =  this.circle_len - 1;
        }else if(cur_num > this.circle_len - 1){
            res = 0;
        }else{
            res = cur_num;
        }
        return res;
    };

    Circle.prototype.reset_icon = function (index) {
        var that = this;
        for(var i =0;i<this.circle_len;i++){
            ;(function (i) {
                if(i == index){
                    that.icons_dom[i].className = 'active';
                }else{
                    that.icons_dom[i].className = '';
                }
            })(i)
        }
    }

    Circle.prototype.reset_class = function (cur_num) {
        var cur_left = this.reset_cur_num(cur_num - 1),
            cur = this.reset_cur_num(cur_num),
            cur_right = this.reset_cur_num(cur_num + 1);
        for(var i=0;i<this.circle_len;i++){
            this.img_list_dom[i].className = 'img_box';
        }
        // console.log('cur_left:' + cur_left +' cur:'+ cur +' cur_right:'+ cur_right)
        this.img_list_dom[cur_left].className += ' cur_left';
        this.img_list_dom[cur_left].style.zIndex  = '1';
        this.img_list_dom[cur].className += ' current';
        this.img_list_dom[cur].style.zIndex  = '10';
        this.img_list_dom[cur_right].className += ' cur_right';
        this.img_list_dom[cur_right].style.zIndex  = '0';
    }

    Circle.prototype.create_icons = function () {
        var circle_icons = _doc.createElement('div'),
            span,
            i,
            that = this,
            len = that.circle_len,
            has_order = that.has_order;
        circle_icons.className = 'circle_icons';
        for(i=0;i<len;i++){
            (function (i) {
                span = _doc.createElement('span');
                span.index = i;
                has_order && (span.innerHTML = i + 1);
                span.onclick = function () {
                    that.cur_num = this.index;
                    that.reset_class(this.index);
                    that.reset_icon(this.index);
                };
                circle_icons.appendChild(span);
                that.icons_dom.push(span);
            })(i)
        }
        that.box_dom.appendChild(circle_icons);
    }


    Circle.prototype.create_tab_btn = function (){
        var circle_tabs = this.create_ele('div'),
            tab_div_left,
            tab_div_right,
            that = this;
        circle_tabs.className = 'circle_tabs';

        /*left tab init*/
        tab_div_left = this.create_ele('div');
        tab_div_left.className = 'tab_left';
        tab_div_left.onclick = function () {
            that.cur_num = that.reset_cur_num(that.cur_num - 1);
            that.reset_class(that.cur_num);
            that.reset_icon(that.cur_num);
        };
        /*right tab init*/
        tab_div_right = this.create_ele('div');
        tab_div_right.className = 'tab_right';
        tab_div_right.onclick = function () {
            that.cur_num = that.reset_cur_num(that.cur_num + 1);
            that.reset_class(that.cur_num);
            that.reset_icon(that.cur_num);
        };
        circle_tabs.appendChild(tab_div_left);
        circle_tabs.appendChild(tab_div_right);
        this.box_dom.appendChild(circle_tabs);
    }

    Circle.prototype.create_circle_imgs = function () {
        var that = this,
            len = that.circle_img_list.length,
            i,
            img_wrap = that.create_ele('div'),
            circle_img_list = that.circle_img_list,
            circle_a_list = that.circle_a_list;
        img_wrap.className = 'img_wrap';
        for(i=0;i<len;i++){
            ;(function (i) {
                var img_div = that.create_ele('div'),
                    img_a,
                    img = that.create_ele('img');
                img.src = circle_img_list[i];
                if(circle_a_list){
                    /*if there is a link ,create a*/
                    img_a = that.create_ele('a');
                    img_a.href = circle_a_list[i];
                    img_a.appendChild(img);
                    img_div.appendChild(img_a);
                }
                img_div.appendChild(img);
                that.img_list_dom.push(img_div);
                img_wrap.appendChild(img_div);
            })(i)
        };
        that.box_dom.appendChild(img_wrap);
    }

    Circle.prototype.auto_loop = function () {
        var that = this;
        that.timer = setInterval(function () {
            that.cur_num = that.reset_cur_num(that.cur_num + 1);
            console.log(that.cur_num);
            that.reset_class(that.cur_num);
            that.reset_icon(that.cur_num);
        },that.circle_time)
    };

    Circle.prototype.init = function () {
        var that = this;
        this.create_circle_imgs();
        this.create_icons();
        this.create_tab_btn();
        this.reset_class(that.cur_num);
        this.reset_icon(that.cur_num);
        this.auto_loop();
        this.box_dom.onmouseover = function (e) {
            clearInterval(that.timer);
        };
        this.box_dom.onmouseout = function (e) {
            that.auto_loop();
        }
    }
    _win.dinosaur.circle = Circle;
    return _win.dinosaur.Circle;
})(window)