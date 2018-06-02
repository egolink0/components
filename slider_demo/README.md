## circle.js简介
该组件主要用于图片轮播，主要包含下列可配置参数  
* box_dom : 轮播区最外层id,string  
* circle_img_list : 轮播的图片序列，数组，图片地址path  
* circle_a_list : （可选）图片所对应的url  
* circle_time : 图片轮播时间间隔(ms单位)  
* has_order : 是否有数字序号（true或false)   

## 调用方式
```
;(function () {
       var Circle = window.dinosaur.circle,
           circle_demo = new Circle({
               box_dom : 'demo',
               circle_img_list : ['../img/circle_1.jpg','../img/circle_2.jpg'],
               circle_a_list : ['URL1','URL2'],//没有此项，则没有a
               circle_time : 3000,
               has_order : false /*是否含数字*/
       });
        circle_demo.init();//初始化下
    })()
```
## 后续可做优化
可以添加多种模式供选择，增加属性module_type,左右滑动，渐现渐消，三张大小图切换
