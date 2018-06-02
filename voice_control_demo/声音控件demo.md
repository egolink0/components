整体效果，可以输出音量大小的开关
![](https://images2018.cnblogs.com/blog/1073007/201805/1073007-20180529141834214-462635353.gif)


## 三个事件，一个拖动周期
1.鼠标按下（mousedown,touchstart），标记开始，然后记录起始位置xy  
2.鼠标移动（mousemove,touchmove），如果标记是开始状态，则根据移动状态位置，更新按钮新的定位  
3.松开鼠标（mouseup,touchend），标记结束。

## 注意点：
>  is_mousedown = 0;  变量开关

1.标记开始与结束作态就像是做了一个开关，打开的时候，此时的移动才是有效数据，开关关闭此时的移动是无效的，这样就不会看到鼠标松开后按钮还会跟着鼠标移动的情况  
2.关于事件绑定，鼠标按下是委托到按钮上面，剩余两个则是委托到document上面，这样，当鼠标移动的时候，不在按钮父元素上面的时候，按钮依然可以左右随着鼠标移动。
如下图所示：
![](https://images2018.cnblogs.com/blog/1073007/201805/1073007-20180529141845405-1922802146.gif)


## 更好的处理方式
###### html布局
```
<div class="bar" id="bar">
    <span class="btn" id="btn"></span>
</div>
```
> 可以避免事件重复被绑定

###### 1. 鼠标按下的时候：委托鼠标移动和松开事件到document上面
```
//按下事件的回调
function down(e) {
    start_x = e.clientX;
    btn_start_left = btn.offsetLeft;
    /*按下时候委托，move 和 up 为各自的回调方法*/
    addListener(document,'mousemove',move); //注意是委托到document上面
    addListener(document,'mouseup',up);
}
addListener(btn,'mousedown',down);//按下事件绑定到btn上面
```
###### 2. 鼠标松开的时候：将委托到document上的两个事件进行移除
```
function up(e) {
    /*松开解绑，move 和 up 事件*/
    removeListener(document,'mousemove',move);//解除document上面的委托
    removeListener(document,'mouseup',up); 
}
```
## 附加效果，优化
###### 增加点击效果，绑定到bar上面
```
function click_move(e) {
    var target = e.target || e.srcElement.target,
        layer_x = e.layerX || e.offsetX ;
    if(target === bar){/*排除掉点击了btn的情况，只在点击了bar的情况下有效*/
        layer_x = e.layerX;
        btn.style.left = (layer_x - btn_w/2) +'px';
    }
}
```
如下图：
![](https://images2018.cnblogs.com/blog/1073007/201805/1073007-20180529141857516-841526514.gif)


###### 附加的添加事件方法，解绑相反
```
function addListener(btn,event,handler){
    if (btn.addEventListener){//DOM 2  三个参数，分别为："事件名称", "事件回调", "捕获/冒泡"。true代表捕获事件，false代表冒泡事件
        btn.addEventListener(event, handler,false);
    }else if(btn.attachEvent){//DOM 2  IE8及其以下版本浏览器
        btn.attachEvent(event, handler);
    }else{//DOM 0
        btn['on'+event] = handler;
    }
}
```
