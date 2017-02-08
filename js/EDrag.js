/*
* EDrag v 0.1.1 Bate
* (c) biyao.com
* created by zpc on 2016-08-01
* */

(function(global){
    window.qs = function(selector){
        return document.querySelector(selector);
    };
    window.tplId = new Date().getTime().toString().substr(8);
    function BaseDrag(opt){
        this.opt = opt;
        this.init(opt);
        this.isDown = false;
    };
    BaseDrag.prototype = {
        init: function(opt){
            this.el = opt.el;
            this.$el = $(opt.el);
            if(!opt.moveOnly){
                this.drag();
            }else {
                this.dragMoveOnly();
            }
            this.$el.css("cursor","move");
        },
        drag: function(){
            var _this = this;
            this.$el.on("mousedown",function(event){
                var $this = _this.$el;
                _this.isDown = true;
                var nowPs ={
                    x: this.offsetLeft,
                    y: this.offsetTop
                };
                var offsetX = event.clientX - nowPs.x;
                var offsetY = event.clientY - nowPs.y;
                _this.watchMousePs(function(mousePs){
                    var elPs = {
                        x: mousePs.x-offsetX,
                        y: mousePs.y-offsetY
                    };
                    $this.css({
                        'position':"absolute",
                        'top':elPs.y,
                        'left':elPs.x
                    });
                    $this.addClass('no-select');
                });
            });
            this.$el.on('mouseup',function(){
                _this.isDown  = false;
                $(".dr-tpl").remove();
                $(this).removeClass('no-select');
            });
            if(!!_this.opt.callback){
                _this.opt.callback();
            }
        },
        dragMoveOnly: function(){
            var _this = this;
            this.$el.on("mouseenter",function(event){
                var $this = _this.$el;
                _this.isDown = true;
                var nowPs ={
                    x: this.offsetLeft,
                    y: this.offsetTop
                };
                var offsetX = event.clientX - nowPs.x;
                var offsetY = event.clientY - nowPs.y;
                _this.watchMousePs(function(mousePs){
                    var elPs = {
                        x: mousePs.x-offsetX,
                        y: mousePs.y-offsetY
                    };
                    $this.css({
                        'position':"absolute",
                        'top':elPs.y,
                        'left':elPs.x
                    });
                    $this.addClass('no-select');
                    if(_this.opt.callback){
                        _this.opt.callback(elPs);
                    }
                });

            });
            this.$el.on('mouseup',function(){
                _this.isDown  = false;
                $(".dr-tpl").remove();
                $(this).removeClass('no-select');
            });

        },
        $error: function(msg){
            console.log(msg);
        },
        //鼠标位置
        watchMousePs: function(callback){
            var _this = this;
            document.addEventListener('mousemove',function(event){
                var mousePs= {
                    x: event.clientX,
                    y: event.clientY
                };
                if(callback && _this.isDown){
                    callback(mousePs);
                }
            });
        },
    };

    var EDrag = function(opt){
        this.opt = opt;
        this.draging = false;
        this.dragObj = []; //普通拖拽元素的所组成的对象数组
        this.isInner = [];
        this.bind = [];//表示要绑定的元素数组
        this.isNewObj = false;
        this.tplId = new Date().getTime().toString().substr(8); //初始化模板标识号码，唯一且随机
        this.init(opt);
    };
    EDrag.prototype = {
        init: function(opt){
            var _this = this;
            this.bind = opt.bind;
            for(var index in this.bind){
                if(!_this.bind[index].template){
                    _this.dragObj.push(new BaseDrag(_this.bind[index]));
                }else {
                    _this.dragTemplate(_this.bind[index],index);

                }
            }
            if(!!opt.showMousePs){
                this.mousePs();
            }
            if("container" in opt){
                if(!opt.container || typeof opt.container !== "string"){
                    this.$error("container必须是string类型");
                }else {

                }
            }

        },
        //显示鼠标当前位置
        mousePs: function(){
            var now = {
                x:0,
                y:0
            };
            var pre = {
                x:0,
                y:0
            };
            var html = '<div class="mouse-position">'+
                '<div class="deng"></div><p>鼠标位置</p>'+
                '<p>x: <span class="m-x"></span></p>'+
                '<p>y: <span class="m-y"></span></p>'+
                '</div>';
            $('body').append(html);
            document.addEventListener('mousemove',function(event){
                qs(".m-x").innerHTML = event.clientX;
                qs(".m-y").innerHTML = event.clientY;
                now.x = event.clientX;
                now.y = event.clientY;
                qs('.deng').style.background = "#0db893"; //鼠标运动，绿色
            });
            setInterval(function(){
                if(pre.x === now.x && pre.y === now.y){
                    qs('.deng').style.background = "#EB5449"; //鼠标静止,红色
                }else{
                    pre = now;
                }
            },500);
            var m = new BaseDrag({
                el:".mouse-position",
            });
        },
        dragTemplate: function(item,index){
            var _this = this;
            var $el = $(item.el);
            var tpl = item.template;
            var opt = this.opt;
            this.isInner[index] = {
                inner:false,
                get $inner(){
                    try{
                        return $inner;
                    }catch (e){
                        return false;
                    }
                },
                set $inner(value){
                    if(value!==_this.isInner[index].$inner) {
                        $inner = value;
                        if($inner){
                            console.log("项目"+index+"入境");
                            _this.inLayout(opt.container,_this.bind[index]);
                        }else{
                            console.log("项目"+index+"出境");
                            _this.outLayout(opt.container,_this.bind[index]);
                        }
                    }
                }
            };
            $el.on('mousedown',function(e){
                _this.draging = true;
                _this.isNewObj = true;
                var html = '<div class="dr-tpl" style="position: absolute">'+tpl+'</div>';
                $('body').append(html);
                $('.dr-tpl').css({
                    "top": e.clientY - 50,
                    'left': e.clientX - 50
                });

                var drObj = new BaseDrag({
                    el:".dr-tpl",
                    moveOnly: true,
                    callback: function(elPs){
                        if(_this.opt.container){
                            //限定目标区域的范围，判断炸弹是否入境
                            var container = qs(_this.opt.container);
                            var minX = container.offsetLeft;
                            var maxX = container.offsetLeft + container.offsetWidth;
                            var minY = container.offsetTop;
                            var maxY = container.offsetHeight + container.offsetTop;
                            if(elPs.x < maxX && elPs.x > minX && elPs.y < maxY && elPs.y >minY){
                                _this.isInner[index].$inner = true;
                            }else {
                                _this.isInner[index].$inner = false;
                            }
                        }
                    }
                });

            });

        },
        //拖入布局
        inLayout: function(container,item){
            var $ctn = $(container);
            var _this = this;
            var tplId = this.tplId;
            var html = '<div class="dr-row dr-placeholder dr-'+tplId+'"></div>' +
                '<div class="dr-row dr-bd dr-'+tplId+'" id="'+tplId+'" style="display: none">'+item.template+'</div>' +
                '<div class="dr-gap dr-'+tplId+'"></div>';
            $ctn.append(html);
            $(document).on('mouseup',function(){
                console.log("鼠标放开");
                $('.dr-placeholder').remove();
                $('.dr-'+tplId).show();
                _this.tplId = new Date().getTime().toString().substr(8); //鼠标放开时生成新的key
            });
        },
        //离开布局
        outLayout:function(container,item){
            var $ctn = $(container);
            var className = ".dr-"+this.tplId;
            $(className).remove();
        },
        //物体放下了，然后再捡起来改变位置的时候调用此方法
        //包含：给境内物体绑定拖动事件；重新计算位置；鼠标放开，回到新的位置；
        //【不确定】完成操作后是否需要释放绑定？
        changePosition:function(){
            var _this = this;
            qs(this.opt.container).addEventListener("mousedown",function(event){

            });
        },
        $error: function(msg){
            console.log(msg);
        },
    };

    /*模块化，支持amd和cmd调用*/
    if (typeof define === "function" && (define.amd || define.cmd)) {
        define("EDrag", ['jQuery'], function () { return EDrag; });
    }else {
        window.EDrag = EDrag;
    }

    if (typeof define === "function" && (define.amd || define.cmd)) {
        define("BaseDrag", ['jQuery'], function () { return BaseDrag; });
    }else {
        window.BaseDrag = BaseDrag;
    }
})(this);
