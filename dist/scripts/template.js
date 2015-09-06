"use strict";

(function (win) {
	var reg = /<%([^%>]+)?%>/g;
	var util = {
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
		render: function render(tpl, data) {
			var disposeLine = function disposeLine(line, isLogic) {
				// line = line.replace(/"/g, "\"");
				if (isLogic) {
					codeStr += line;
				} else {
					codeStr += "rs.push('" + line + "');";
				}
			};
			var codeStr = "var rs = [];\n";
			var position = 0;
			var matcher = undefined;

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
			return new Function(codeStr).call(data).join("");
		}
	};
	win.template = function (tpl, data) {
		tpl = util.getTplStr(tpl);

		return util.render(tpl, data);
	};
})(window);