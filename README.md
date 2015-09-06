# template.js
用于前端模板渲染的玩具

使用我的[es6工作流](https://github.com/hr1992/my-work-flow)进行构建。只是自己无聊时候的尝试，顺便用点点es6，参考的是小胡子哥的文章。

##使用说明
###1、模板的申明
可以直接在html里面直接写入模板，把模板放到script或者textarea都是个不错的选择。

```html
<script type="template" id="btn-tpl">
	<% for(var i = 0;i<this.user.limit;i++) { %>
		<div class="user-info"><% this.user.name %></div>
		<% if(this.user.name) { %>
		有名字才会显示此段
		<% } %>
		<button>立即<% this.user.do %></button>
	<% } %>
</script>
```

也可以把模板放置到任何非html的地方，只要是以字符串形式传入template函数的模板，都能够被解析。
*注意：目前插值表达式需要使用this.来开头，因为是使用的call来设置的作用域。*

`window.template(tpl, data)`接受2个参数，第一个为模板，可以是元素的ID也可以是字符串形式的模板，如为ID，模板引擎回去自动取其内容为模板字符串。第二个参数为套用的数据对象。

