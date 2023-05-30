function mount() {
	// 可以访问DOM，注入到页面
	var s = document.createElement("script");
	s.src = chrome.runtime.getURL("/js/injected.js");
	s.onload = function() {
		this.remove();
	};
	var xlsx = document.createElement("script");
	xlsx.src = chrome.runtime.getURL("/js/xlsx.js");
	xlsx.onload = function() {
		this.remove();
	};
	var ex = document.createElement("script");
	ex.src = chrome.runtime.getURL("/js/export.js");
	ex.onload = function() {
		this.remove();
	};
	(document.body || document.head || document.documentElement).appendChild(xlsx).appendChild(ex).appendChild(s);
}
mount()
window.addEventListener("message", function(e) {
	let data = e.data;
	if (data.name) {
		chrome.runtime.sendMessage({
			data: data.data,
			name: data.name,
		});
	}
}, false);
// 监听转发消息，显示隐藏插件
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log("content", request, sender);
	if(request) {
		window.postMessage({
			showPlug: request.showPlug,
			type: 'plug'
		});
	}
});
