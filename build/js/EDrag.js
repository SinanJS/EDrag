"use strict";!function(t){function n(t){this.opt=t,this.init(t),this.isDown=!1}window.qs=function(t){return document.querySelector(t)},window.tplId=(new Date).getTime().toString().substr(8),n.prototype={init:function(t){this.el=t.el,this.$el=$(t.el),t.moveOnly?this.dragMoveOnly():this.drag(),this.$el.css("cursor","move")},drag:function(){var t=this;this.$el.on("mousedown",function(n){var e=t.$el;t.isDown=!0;var i={x:this.offsetLeft,y:this.offsetTop},o=n.clientX-i.x,s=n.clientY-i.y;t.watchMousePs(function(t){var n={x:t.x-o,y:t.y-s};e.css({position:"absolute",top:n.y,left:n.x}),e.addClass("no-select")})}),this.$el.on("mouseup",function(){t.isDown=!1,$(".dr-tpl").remove(),$(this).removeClass("no-select")}),t.opt.callback&&t.opt.callback()},dragMoveOnly:function(){var t=this;this.$el.on("mouseenter",function(n){var e=t.$el;t.isDown=!0;var i={x:this.offsetLeft,y:this.offsetTop},o=n.clientX-i.x,s=n.clientY-i.y;t.watchMousePs(function(n){var i={x:n.x-o,y:n.y-s};e.css({position:"absolute",top:i.y,left:i.x}),e.addClass("no-select"),t.opt.callback&&t.opt.callback(i)})}),this.$el.on("mouseup",function(){t.isDown=!1,$(".dr-tpl").remove(),$(this).removeClass("no-select")})},$error:function(t){console.log(t)},watchMousePs:function(t){var n=this;document.addEventListener("mousemove",function(e){var i={x:e.clientX,y:e.clientY};t&&n.isDown&&t(i)})}};var e=function(t){this.opt=t,this.draging=!1,this.dragObj=[],this.isInner=[],this.bind=[],this.isNewObj=!1,this.tplId=(new Date).getTime().toString().substr(8),this.init(t)};e.prototype={init:function(t){var e=this;this.bind=t.bind;for(var i in this.bind)e.bind[i].template?e.dragTemplate(e.bind[i],i):e.dragObj.push(new n(e.bind[i]));t.showMousePs&&this.mousePs(),"container"in t&&(t.container&&"string"==typeof t.container||this.$error("container必须是string类型"))},mousePs:function(){var t={x:0,y:0},e={x:0,y:0},i='<div class="mouse-position"><div class="deng"></div><p>鼠标位置</p><p>x: <span class="m-x"></span></p><p>y: <span class="m-y"></span></p></div>';$("body").append(i),document.addEventListener("mousemove",function(n){qs(".m-x").innerHTML=n.clientX,qs(".m-y").innerHTML=n.clientY,t.x=n.clientX,t.y=n.clientY,qs(".deng").style.background="#0db893"}),setInterval(function(){e.x===t.x&&e.y===t.y?qs(".deng").style.background="#EB5449":e=t},500);new n({el:".mouse-position"})},dragTemplate:function(t,e){var i=this,o=$(t.el),s=t.template,r=this.opt;this.isInner[e]={inner:!1,get $inner(){try{return $inner}catch(t){return!1}},set $inner(t){t!==i.isInner[e].$inner&&($inner=t,$inner?(console.log("项目"+e+"入境"),i.inLayout(r.container,i.bind[e])):(console.log("项目"+e+"出境"),i.outLayout(r.container,i.bind[e])))}},o.on("mousedown",function(t){i.draging=!0,i.isNewObj=!0;var o='<div class="dr-tpl" style="position: absolute">'+s+"</div>";$("body").append(o),$(".dr-tpl").css({top:t.clientY-50,left:t.clientX-50});new n({el:".dr-tpl",moveOnly:!0,callback:function(t){if(i.opt.container){var n=qs(i.opt.container),o=n.offsetLeft,s=n.offsetLeft+n.offsetWidth,r=n.offsetTop,c=n.offsetHeight+n.offsetTop;t.x<s&&t.x>o&&t.y<c&&t.y>r?i.isInner[e].$inner=!0:i.isInner[e].$inner=!1}}})})},inLayout:function(t,n){var e=$(t),i=this,o=this.tplId,s='<div class="dr-row dr-placeholder dr-'+o+'"></div><div class="dr-row dr-bd dr-'+o+'" id="'+o+'" style="display: none">'+n.template+'</div><div class="dr-gap dr-'+o+'"></div>';e.append(s),$(document).on("mouseup",function(){console.log("鼠标放开"),$(".dr-placeholder").remove(),$(".dr-"+o).show(),i.tplId=(new Date).getTime().toString().substr(8)})},outLayout:function(t,n){var e=($(t),".dr-"+this.tplId);$(e).remove()},changePosition:function(){qs(this.opt.container).addEventListener("mousedown",function(t){})},$error:function(t){console.log(t)}},"function"==typeof define&&(define.amd||define.cmd)?define("EDrag",["jQuery"],function(){return e}):t.EDrag=e}(this);