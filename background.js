var showPlug = 'none';
// 创建菜单
// chrome.contextMenus.create({
// 	id: "export",
// 	title: "将当前页面表格导出为excel",
// 	onclick: function() {
// 		chrome.tabs.executeScript({
// 			file: "js/xlsx.js",
// 		});
// 		chrome.tabs.executeScript({
// 			file: "js/export.js",
// 		});
// 	},
// });
chrome.contextMenus.create({
	id: "showPlug",
	title: `隐藏插件`,
	onclick: function() {
		sendMessageToContentScript({
			showPlug: showPlug
		})
		chrome.contextMenus.update("showPlug", {
			title: `${showPlug=='block'?'隐藏':'显示'}插件`,
		})
		showPlug = showPlug == 'block' ? 'none' : 'block'
	},
});
// 获取标签id
function getCurrentTabId(callback) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}
// 给指定标签发送消息
function sendMessageToContentScript(message, callback) {
	getCurrentTabId((tabId) => {
		chrome.tabs.sendMessage(tabId, message, function(response) {
			if (callback) callback(response);
		});
	});
}
// 监听事件消息，下载文件
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("background", request, sender);
	if (request.data) {
		chrome.downloads.download({
				url: "data:application/octet-stream;base64," + btoa(request.data),
				filename: request.name || "table.xlsx",
			},
			(id) => {
				// id为真说明下载成功
				console.log(id);
				notifications(request.name, id ? request.data : false);
			}
		);
	} else {
		notifications(request.name, false);
	}
});

function notifications(msg, type) {
	chrome.notifications.create(null, notifyInfo(msg, type));
}

function notifyInfo(msg, type) {
	return {
		type: "basic",
		title: "提示！",
		iconUrl: `img/${type ? "success.png" : "error.png"}`,
		message: `${msg || ""}${type ? "导出成功" : "导出失败"}！`,
	};
}
// 监听浏览器请求
// var Request = null
// var time = true

// function getURL(details) {
// 	// console.log('getURL', details)
// 	if ((details.url.includes('all.htm') || details.url.includes('frontDeptAccountList')) && time) {
// 		Request = details
// 		console.log('getURL', details)
// 		axios()
// 		time = false
// 		setTimeout(() => {
// 			time = true
// 		}, 1000)
// 	}
// }
// const axios = () => {
// 	// 发送XMLHttpRequest获取数据
// 	var xhr = new XMLHttpRequest();
// 	xhr.open(Request.method, Request.url, true);
// 	// xhr.open('POST', Request.url, true);
// 	console.log(xhr)
// 	xhr.onreadystatechange = function() {
// 		if (xhr.readyState === 4 && xhr.status === 200) {
// 			// 将数据转换为Excel格式
// 			var data = JSON.parse(xhr.responseText);
// 			console.log(data)
// 			//     var workbook = XLSX.utils.book_new();
// 			//     var worksheet = XLSX.utils.json_to_sheet(data);
// 			//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
// 			//     var excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

// 			//     // 保存Excel文件到本地
// 			//     chrome.downloads.download({
// 			//       url: 'data:application/octet-stream;base64,' + btoa(excelData),
// 			//       filename: 'data.xlsx'
// 			//     });
// 		}
// 	};
// 	xhr.send();
// }

// chrome.webRequest.onCompleted.addListener(
// 	getURL, {
// 		urls: ["<all_urls>"]
// 	},
// 	['responseHeaders']
// );
