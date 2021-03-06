/**
 * Created by Administrator on 2017/2/8.
 */
/*
 * EDrag v 0.1.2 Bate
 * (c) biyao.com
 * created by zpc on 2017-02-09
 * */

(function (global) {
    window.qs = function (selector) {
        return document.querySelector(selector);
    };
    window.tplId = new Date().getTime().toString().substr(8);
    function BaseDrag(opt) {
        this.opt = opt;
        this.init(opt);
        this.isDown = false;
    };
    BaseDrag.prototype = {
        init: function (opt) {
            this.el = opt.el;
            this.$el = $(opt.el);
            if (!opt.moveOnly) {
                this.drag(this.$el);
            } else {
                this.dragMoveOnly();
            }
            this.$el.css("cursor", "move");
        },
        //执行函数
        drag: function ($el) {
            var _this = this;
            this.mapDOM($el);
            /* console.log(this._el[0])
             for(var i=0;i<this._el[0].children.length;i++){
             this.childrenList.add(this._el[0].children[i].className)
             }*/
            //事件委托
            $el.on("mousedown", function (event) {
                _this.selectDOM(event);
            });
            $el.on('mouseup', function (event) {
                _this.freeDOM(event);
            });
            if (!!_this.opt.callback) {
                _this.opt.callback();
            }
        },
        dragMoveOnly: function () {
            var _this = this;
            this.$el.on("mouseenter", function (event) {
                var $this = _this.$el;
                _this.isDown = true;
                var nowPs = {
                    x: this.offsetLeft,
                    y: this.offsetTop
                };
                var offsetX = event.clientX - nowPs.x;
                var offsetY = event.clientY - nowPs.y;
                _this.watchMousePs(function (mousePs) {
                    var elPs = {
                        x: mousePs.x - offsetX,
                        y: mousePs.y - offsetY
                    };
                    $this.css({
                        'position': "absolute",
                        'top': elPs.y,
                        'left': elPs.x
                    });
                    $this.addClass('draging');
                    if (_this.opt.callback) {
                        _this.opt.callback(elPs);
                    }
                });

            });
            this.$el.on('mouseup', function () {
                _this.isDown = false;
                $(".dr-tpl").remove();
                $(this).removeClass('draging');
            });

        },

        //遍历子元素
        mapDOM: function ($el) {
            for (var i = 0; i < $el.length; i++) {
                var father = $el[i];
                for (var j = 0; j < father.children.length; j++) {
                    var child = father.children[j];
                    child.setAttribute("dragfree", true);
                }
            }
        },
        // 判断当前选中目标元素是否可以被拖动,并重新确定拖动目标
        confirmTarget: function (target) {
            var $target = $(target);
            if($target.attr('dragfree') !== undefined){
                return target;
            }else if($target.find('[dragfree="true"]').length === 1){
                return $target.find('[dragfree="true"]')[0];
            }else if($target.parent('[dragfree="true"]').length === 1){
                return $target.parent('[dragfree="true"]')[0];
            }else {
                return false;
            }
        },
        //动作分解：选中
        selectDOM: function (event, _this) {
            return (function () {
                //  if((event.target.className !== this.$el[0].className) && (event.target.parentNode.className === this.$el[0].className)) {
                this.target = this.confirmTarget(event.target);
                if(this.target){
                    $(this.target).addClass('draging');
                }else {
                    return;
                }
                this.isDown = true;
                var nowPs = {
                    x: $('.draging')[0].offsetLeft,
                    y: $('.draging')[0].offsetTop
                };
                var offsetX = event.clientX - nowPs.x;
                var offsetY = event.clientY - nowPs.y;
                this.watchMousePs(function (mousePs) {
                    var elPs = {
                        x: mousePs.x - offsetX,
                        y: mousePs.y - offsetY
                    };
                    $('.draging').css({
                        'position': "absolute",
                        'top': elPs.y,
                        'left': elPs.x
                    });

                });
            }).call(_this || this);

        },
        //动作分解：鼠标移动，拖动
        watchMousePs: function (callback) {
            var _this = this;
            document.addEventListener('mousemove', function (event) {
                var mousePs = {
                    x: event.clientX,
                    y: event.clientY
                };
                if (callback && _this.isDown) {
                    callback(mousePs);
                }
            });
        },
        //动作分解：鼠标松开，释放
        freeDOM: function (event, _this) {
            return (function () {
                this.isDown = false;
                $(".dr-tpl").remove();
                $(this.target).removeClass('draging');
            }).call(_this || this);
        }
    };
    if (typeof define === "function" && (define.amd || define.cmd)) {
        define("DragFree", ['jQuery'], function () {
            return BaseDrag;
        });
    } else {
        window.DragFree = BaseDrag;
    }
})(this);
