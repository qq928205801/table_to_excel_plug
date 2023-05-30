// 获取页面表格数据转成json并导出为excel
var thList = [];
var trList = [];
var first = false;
var last = false;
var colW = 1; //字符串的宽度（字母）
var minW = 10; //最小宽度
var rowH = 20; //高度
var name = null;
// 获取当前页面表格数据
function getTbaleDate(inputValue) {
	thList = [];
	trList = [];
	first = false;
	last = false;
	name = document.title.replace(/[:\|]/g, "");
	let tableLists = document.querySelector(inputValue || "body")?.querySelectorAll("table") || [];
	// 过滤
	let tableList = [];
	tableLists.forEach((item) => {
		if (!item.parentNode.className.includes("debug")) tableList.push(item);
	});
	console.log(tableList);
	if (!tableList.length) return;
	// 获取表格头部
	let th = tableList[0].querySelectorAll("thead th") || [];
	for (let i of th) {
		thList.push(i.innerText);
	}
	// 过滤表头首尾
	if (["", "序号"].includes(thList[0])) {
		first = true;
		thList.splice(0, 1);
	}
	if (["", "操作"].includes(thList[thList.length - 1])) {
		last = true;
		thList.splice(thList.length - 1, 1);
	}
	console.log(thList);
	// 获取表格内容
	let tr =
		tableList[tableList.length > 1 ? 1 : 0].querySelectorAll("tbody tr") || [];
	tr.forEach((ite, ind) => {
		let td = [];
		ite.querySelectorAll("td").forEach((item, index) => {
			// 去掉表头对应的内容
			if (!(last && index == ite.querySelectorAll("td").length - 1) && !(first && index == 0)) {
				td.push(item.innerText);
			}
		});
		trList.push(td);
	});
	console.log(trList);
}

// 生成excel
function createExcel(th, tr) {
	if (!th.length) return false;
	let wopts = {
		bookType: "xlsx",
		bookSST: true,
		type: "binary",
	};
	let workBook = {
		SheetNames: ["Sheet1"],
		Sheets: {},
		Props: {},
	};
	let table = [];
	let rows = [{
		hpx: rowH,
	}, ]; //转换后多一个表头
	let cols = [];
	// 表格有数据正常渲染
	if (tr.length) {
		tr.forEach((item, index) => {
			let params = {};
			item.forEach((ite, ind) => {
				params[th[ind]] = ite;
				// 设置单元格宽度
				let width = setWidth(ite);
				if (cols[ind]) {
					cols[ind].wch = width > cols[ind].wch ? width : cols[ind].wch;
				} else {
					cols.push({
						wch: width > minW ? width : minW,
					});
				}
			});
			table.push(params);
			// 设置单元格高度
			rows.push({
				hpx: rowH,
			});
		});
	} else {
		// 表格没数据只显示表头
		let params = {};
		th.forEach((item, index) => {
			params[item] = "";
			let width = setWidth(item);
			cols.push({
				wch: width > minW ? width : minW,
			});
		});
		table.push(params);
	}
	console.log(table);
	workBook.Sheets.Sheet1 = XLSX.utils.json_to_sheet(table);
	workBook.Sheets.Sheet1["!rows"] = rows;
	workBook.Sheets.Sheet1["!cols"] = cols;
	return XLSX.write(workBook, wopts);
}
// 计算内容长度
function setWidth(value) {
	value = value || "";
	const reg = /[\u4e00-\u9fa5]/g;
	let zhCn = value.match(reg) || [];
	// 一个中文是占两个字符，中文+字符串+间隔
	let width = zhCn.length * colW * 2 + (value.length - zhCn.length) * colW + 2;
	return width > minW ? width : minW;
}
if (chrome.runtime) {
	getTbaleDate();
	// 发送消息下载excel
	chrome.runtime.sendMessage({
		data: createExcel(thList, trList),
		name: name + ".xlsx",
	});
}

// console.log(chrome, window);
// export {
// 	getTbaleDate,
// 	createExcel,
// 	setWidth
// }
// 生成excel
// var workbook = XLSX.utils.book_new();
// var worksheet = XLSX.utils.json_to_sheet(table);
// XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
// var excelData = XLSX.write(workbook, {
// 	bookType: 'xlsx',
// 	type: 'binary'
// });
// var name = document.title.replaceAll(' ', '').replaceAll(':', '')
// chrome.runtime.sendMessage({
// 	data: excelData,
// 	name: name + '.xlsx'
// });
// console.log(excelData)
