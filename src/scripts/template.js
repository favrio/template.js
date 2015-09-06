((win) => {
	const reg = /<%([^%>]+)?%>/g;
	const util = {
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
		render: function(tpl, data) {
			let disposeLine = function(line, isLogic) {
				// line = line.replace(/"/g, "\"");
				if (isLogic) {
					codeStr += line;
				} else {
					codeStr += "rs.push('" + line + "');";
				}

			};
			let codeStr = "var rs = [];\n";
			let position = 0;
			let matcher;

			while (matcher = reg.exec(tpl)) {
				disposeLine(tpl.slice(position, matcher.index));
				disposeLine(data[matcher[1]]);
				console.log(tpl.slice(position, matcher.index));
				console.log(data[matcher[1]]);
				position = matcher.index + matcher[0].length;
				// codeStr += tpl.slice(position, matcher.index);
				// codeStr += data(matcher[1]);
			}
			// codeStr += disposeLine()
			disposeLine(tpl.slice(position));
			codeStr += "return rs;";
			codeStr = codeStr.replace(/[\r\t\n]/g, "");
			console.log(codeStr);

			console.log(new Function(codeStr).call(data).join(""));
			return (new Function(codeStr).call(data).join(""));
		}
	};
	win.template = (tpl, data) => {
		tpl = util.getTplStr(tpl);

		return util.render(tpl, data);
	};


})(window)