((win) => {
	/* jshint esnext: true, unused: true, evil: true */
	// 匹配插值表达式
	const reg = /<%([^%>]+)?%>/g;
	// 匹配条件语句
	const logicReg = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;

	/**
	 * 工具对象
	 * @type {Object}
	 */
	const util = {
		/**
		 * 获取模板字符串
		 * @param  {String} tpl 模板ID或者直接是模板字符串
		 * @return {String}     模板字符串
		 */
		getTplStr: function(tpl) {
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
		trim: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
	};


	/**
	 * 主函数，渲染用
	 * @param  {String} tpl  模板ID或者直接是模板字符串
	 * @param  {Object} data 套用的变量对象
	 * @return {String}      渲染完成的字符串
	 */
	const render = (tpl, data) => {
		/**
		 * 逐条处理
		 * @param  {String}  line    待处理的字符串
		 * @param  {Boolean} isLogic 是否是逻辑命令
		 * @return {Function}        返回方法自身，链式调用
		 */
		let disposeLine = function(line, isLogic) {
			if (isLogic) {
				console.log("GO here");
				codeStr += line.match(logicReg) ? line + ";\n" : "rs.push(" + util.trim(line) + ");";
			} else {
				codeStr += "rs.push('" + util.trim(line) + "');";
			}

			return disposeLine;

		};
		let codeStr = "var rs = [];\n";
		let position = 0;
		let matcher;

		while (matcher = reg.exec(tpl)) {
			disposeLine(tpl.slice(position, matcher.index))(matcher[1], true);
			position = matcher.index + matcher[0].length;
		}

		disposeLine(tpl.slice(position));
		codeStr += "return rs;";
		codeStr = codeStr.replace(/[\r\t\n]/g, "");
		console.log(codeStr);
		return (new Function(codeStr).apply(data).join(""));
	};

	// 挂载到window下，对外暴露接口
	win.template = (tpl, data) => {
		tpl = util.getTplStr(tpl);
		return render(tpl, data);
	};


})(window);