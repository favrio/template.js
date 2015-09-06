((win) => {
	// 匹配插值表达式
	const reg = /<%([^%>]+)?%>/g;
	// 匹配条件语句
	const logicReg = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;

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
		 * 主函数，渲染用
		 * @param  {String} tpl  模板ID或者直接是模板字符串
		 * @param  {Object} data 套用的变量对象
		 * @return {String}      渲染完成的字符串
		 */
		render: function(tpl, data) {
			/**
			 * 逐条处理
			 * @param  {String}  line    待处理的字符串
			 * @param  {Boolean} isLogic 是否是逻辑命令
			 * @return {[type]}          [description]
			 */
			let disposeLine = function(line, isLogic) {
				if (isLogic) {
					// codeStr += line + "\n";
					codeStr += line.match(logicReg) ? line + "\n" : "rs.push('" + line + "');";
				} else {
					codeStr += "rs.push(" + line + ");";
				}

			};
			let codeStr = "var rs = [];\n";
			let position = 0;
			let matcher;
			let val;

			while (matcher = reg.exec(tpl)) {
				val = util.trim(matcher[1]);
				console.log(val);
				disposeLine(tpl.slice(position, matcher.index), true);
				disposeLine(val);
				position = matcher.index + matcher[0].length;
			}
			disposeLine(tpl.slice(position), true);
			codeStr += "return rs;";
			codeStr = codeStr.replace(/[\r\t\n]/g, "");
			console.log(codeStr);
			return (new Function(codeStr).apply(data).join(""));
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
	win.template = (tpl, data) => {
		tpl = util.getTplStr(tpl);
		return util.render(tpl, data);
	};


})(window)