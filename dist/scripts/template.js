"use strict";

(function (win) {
	/* jshint esnext: true, unused: true, evil: true */
	// 匹配插值表达式
	var reg = /<%([^%>]+)?%>/g;
	// 匹配条件语句
	var logicReg = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;

	/**
  * 工具对象
  * @type {Object}
  */
	var util = {
		/**
   * 获取模板字符串
   * @param  {String} tpl 模板ID或者直接是模板字符串
   * @return {String}     模板字符串
   */
		getTplStr: function getTplStr(tpl) {
			var element = document.getElementById(tpl);
			// 如果找不到该节点，则为字符串形式的模板，直接返回
			if (!element) {
				return tpl;
			}

			// 处理节点模板
			var html = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;
			return html;
		},
		/**
   * 清除空格
   * @param  {String} str 待处理的字符串
   * @return {String}     清除左右空格后的字符串
   */
		trim: function trim(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
	};

	/**
  * 主函数，渲染用
  * @param  {String} tpl  模板ID或者直接是模板字符串
  * @param  {Object} data 套用的变量对象
  * @return {String}      渲染完成的字符串
  */
	var render = function render(tpl, data) {
		/**
   * 逐条处理
   * @param  {String}  line    待处理的字符串
   * @param  {Boolean} isLogic 是否是逻辑命令
   * @return {Function}        返回方法自身，链式调用
   */
		var disposeLine = function disposeLine(line, isLogic) {
			if (isLogic) {
				codeStr += line.match(logicReg) ? line + ";\n" : "rs.push(" + util.trim(line) + ");";
			} else {
				codeStr += "rs.push('" + util.trim(line) + "');";
			}

			return disposeLine;
		};
		var codeStr = "var rs = [];\n";
		var position = 0;
		var matcher = undefined;

		while (matcher = reg.exec(tpl)) {
			disposeLine(tpl.slice(position, matcher.index))(matcher[1], true);
			position = matcher.index + matcher[0].length;
		}

		disposeLine(tpl.slice(position));
		codeStr += "return rs;";
		codeStr = codeStr.replace(/[\r\t\n]/g, "");
		return new Function(codeStr).apply(data).join("");
	};

	// 挂载到window下，对外暴露接口
	win.template = function (tpl, data) {
		tpl = util.getTplStr(tpl);
		return render(tpl, data);
	};
})(window);