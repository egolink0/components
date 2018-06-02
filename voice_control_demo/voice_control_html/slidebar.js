(function(){
    var dinosaur = window.dinosaur || {},
        bar = document.getElementById('bar'),
        btn = document.getElementById('btn'),
        num = document.getElementById('num'),
        btn_w = btn.clientWidth,
        start_x,/* 按下开始x轴位置 */
        move_x,/* 移动位置 */
        end_x,
        btn_start_left,/* 相对父元素子元素的起始位置 */
        min_w = -btn.clientWidth/2,
        max_w = bar.clientWidth-btn.clientWidth/2,/* 容器最大位移宽度 */
        sum_w = bar.clientWidth,
        per;/*百分比值，输出*/
    function init_num(per) {
        num.innerText = per;
    }
    function down(e) {
        start_x = e.clientX;
        btn_start_left = btn.offsetLeft;
        /*按下时候绑定，move 和 up 事件*/
        addListener(document,'mousemove',move); //帮到document上面为了防止鼠标按下保持，// 离开有效区域释放后依然有move状态，委托到document
        addListener(document,'mouseup',up);
    }
    function up(e) {
        /*松开解绑，move 和 up 事件*/
        removeListener(document,'mousemove',move);
        removeListener(document,'mouseup',up); //帮到document上面为了防止鼠标按下保持，// 离开有效区域释放后依然有move状态，委托到document
    }
    function move(e) {
        move_x = e.clientX;
        end_x = move_x - start_x + btn_start_left;
        /*限定移动范围*/
        if (max_w < end_x){
            end_x = max_w;
        }
        if(end_x < min_w){
            end_x = min_w;
        }
        btn.style.left = end_x +'px';
        /*音量的百分比表示*/
        per = Math.round(((end_x + btn.clientWidth/2) / sum_w)*100);
        init_num(per);
    }
    function click_move(e) {
        var target = e.target || e.srcElement.target,
            layer_x = e.layerX || e.offsetX ;
        if(target === bar){/*排除掉点击了btn的情况，只在点击了bar的情况下有效*/
            layer_x = e.layerX;
            console.log(layer_x)
            if(layer_x < 0){
                layer_x = 0;
            }
            btn.style.left = (layer_x - btn_w/2) +'px';
            per = Math.round((layer_x/ sum_w)*100);
            init_num(per);
        }
    }

    function addListener(btn,event,handler){
        if (btn.addEventListener){//DOM 2  三个参数，分别为："事件名称", "事件回调", "捕获/冒泡"。true代表捕获事件，false代表冒泡事件
            btn.addEventListener(event, handler,false);
        }else if(btn.attachEvent){//DOM 2  IE8及其以下版本浏览器
            btn.attachEvent(event, handler);
        }else{//DOM 0
            btn['on'+event] = handler;
        }
    }
    function removeListener(btn,event,handler) {
        if (btn.removeEventListener){
            btn.removeEventListener(event, handler,false);
        }else if(btn.detachEvent){
            btn.detachEvent(event, handler);
        }else{
            btn['on'+event] = null;
        }
    }
    function get_dom_by_id(id) {
        return document.getElementById(id);
    }
    window.dinosaur = dinosaur;
    dinosaur.sliderbar = function (obj) {
        bar = get_dom_by_id(obj.bar);
        btn = get_dom_by_id(obj.btn);
        num = get_dom_by_id(obj.num);
        btn_w = btn.clientWidth;
        min_w = -btn.clientWidth/2;
        max_w = bar.clientWidth-btn.clientWidth/2;/* 容器最大位移宽度 */
        sum_w = bar.clientWidth;
        addListener(btn,'mousedown',down);
        addListener(bar,'click',click_move);
    }
})();