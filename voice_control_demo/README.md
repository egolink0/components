## sliderbar.js说明
最初原型，是作为音量控制大小的条，可以拖拽进行音量控制，也可以点击改变音量大小

## 版本解释
#### 1.0版本
使用的是变量进行控制，变量开关，根据变量判断是否处于按下状态触发的移动

#### 2.0版本
1. 鼠标按下事件触发同时：委托鼠标移动和松开事件到document上面 
2. 鼠标松开事件触发同时：将委托到document上的两个事件进行移除 

#### 3.0版本,剥离js，成组件
调用方式:
```
var sliderbar = window.dinosaur.sliderbar;
    sliderbar({
        bar : 'bar', 
        btn : 'btn',
        num : 'num'
    })
```
参数说明：  
* bar: 父元素的dom id,string
* btn：拖拽的子元素的dom id,string
* num: 显示长度的数字位置dom,id

#### 升级待续...
