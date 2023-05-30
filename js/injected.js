// 获取页面表格数据转成json并导出为excel
var isFocus = false;
var inputValue = "";

function load() {
	// ajax()
	window.addEventListener("load", () => {
		createCtrlArea();
		let showPlug = sessionStorage.showPlug
		if(showPlug) {
			let box = document.querySelector('#Listeners_ctrl_area')
			box.style.display = showPlug
		}
		$("#Listeners_btn_start").onclick = () => {
			// console.log(eval("(" + inputValue + ")"))//将字符串转化为json
			getTbaleDate(inputValue);
			window.postMessage({
				data: createExcel(thList, trList),
				name: name + ".xlsx",
			});
		};
		$("#inputTargetValue").onfocus = () => {
			isFocus = true;
		};
		$("#inputTargetValue").onblur = () => {
			isFocus = false;
		};
		$("#inputTargetValue").onchange = (e) => {
			const val = e.target.value;
			inputValue = val;
		};
	});
	// 监听消息，显示隐藏插件
	window.addEventListener("message", function(e) {
		let data = e.data;
		if (data.type) {
			let box = document.querySelector('#Listeners_ctrl_area')
			box.style.display = data.showPlug
			sessionStorage.showPlug = data.showPlug
		}
	}, false);
}
load();

function $(selector) {
	return document.querySelector(selector);
}
// 添加移动
function arrowMove(event, el) {
	if (isFocus) return;
	var e = event || window.event;
	let oDiv = e.currentTarget;
	var disX = e.clientX - oDiv.offsetLeft;
	var disY = e.clientY - oDiv.offsetTop;
	var clientHeight = window.innerHeight;
	var clientWidth = window.innerWidth;
	const domWidth = el.offsetWidth; // dom宽度
	const domHeight = el.offsetHeight; // dom高度
	document.onmousemove = function(event) {
		//3、移动时，鼠标距离当前窗口x轴坐标 - 鼠标在拖拽元素的坐标 = 剩下距离body的x轴坐标
		//将这个数值设置为拖拽元素的left、top
		var boxLeft = event.clientX - disX;
		var boxTop = event.clientY - disY;
		//4、限制拖拽宽高
		if (boxLeft < 0) {
			boxLeft = 0;
			//如果拖拽元素定位的数值高于, 页面可视宽 - 拖拽元素自身宽 (可视页面最大宽)
		} else if (boxLeft >= clientWidth - domWidth) {
			//满足这个条件，就限制宽为，clientWidth-oDiv.offsetWidth(可视页面最大宽)
			boxLeft = clientWidth - domWidth;
		}

		if (boxTop < 0) {
			boxTop = 0;
			//如果拖拽元素定位的数值高于, 页面可视高 - 拖拽元素自身高 (可视页面最大高)
		} else if (boxTop >= clientHeight - domHeight) {
			//满足这个条件，就限制高为，clientHeight-oDiv.offsetHeight(可视页面最大高)
			boxTop = clientHeight - domHeight;
		}

		//↑将数值设置成拖拽元素的定位left、top
		oDiv.style.left = boxLeft + "px";
		oDiv.style.top = boxTop + "px";
	};
	document.onmouseup = function() {
		oDiv.style.pointerEvents = null;
		document.onmousemove = null;
		document.onmouseup = null;
	};
}
// 添加插件面板
function createCtrlArea() {
	let cDiv = document.createElement("div");
	cDiv.id = "Listeners_ctrl_area";
	cDiv.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 50px;
    background: transparent;
    z-index: 999999;
    width:240px;
    height: fit-content;
    `;
	cDiv.onmousedown = (e) => {
		arrowMove(e, cDiv);
	};
	$("body").appendChild(cDiv);
	createTargetValue();
	createTaskTips();
	createButton();
}
// 按钮
function createButton() {
	let cDiv = document.createElement("div");
	cDiv.id = "Listeners_btn";
	cDiv.style.cssText = `
      width: 240px;
      height: 40px;
      display: inline-block;
      background: rgba(54, 55, 65, 0.8);
      color: white;
      border-radius: 10px;
      display: flex;
      align-item: center;
      justify-content: center;
      overflow: hidden;
      box-shadow: 0 0 10px 10px rgba(0,0,0,.1);
      margin: 5px 0;
      `;
	cDiv.innerHTML = `
      <style>
        #Listeners_btn button {
          flex: 1;
          color: #FFF;
          background: #000;
          cursor: pointer;
          border: none;
          outline: none;
        }
      </style>
      <button id="Listeners_btn_start" style="background: #2e9fff">导出数据</button>
      `;
	$("#Listeners_ctrl_area").appendChild(cDiv);
}
// 提示框
function createTaskTips() {
	let cDiv = document.createElement("div");
	cDiv.style.cssText = `
      width: 240px;
      // height: 80px;
      display: inline-block;
      background: rgba(54, 55, 65, 0.8);
      color: white;
      border-radius: 10px;
      margin-bottom: 5px;
      `;
	cDiv.innerHTML = `
      <div style="display: flex;
      width: 100%;
      line-height: 20px;
      font-size: 12px;
      padding: 10px;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      flex-direction: row;" 
      id="douyinAutoTaskTips">点击 导出数据 可默认导出第一个表格，如需导出指定表格数据，请输入包含表格的容器，如：#app 或 .app 或 body</div>
    `;
	$("#Listeners_ctrl_area").insertBefore(
		cDiv,
		$("#Listeners_ctrl_area").firstChild
	);
}
// 输入框
function createTargetValue() {
	let cDiv = document.createElement("div");
	cDiv.style.cssText = `
      width: 240px;
      height: 32px;
      background: rgba(54, 55, 65, 1);
      color: white;
      border-radius: 6px;
      margin-bottom: 5px;
      `;
	cDiv.innerHTML = `
      <div style="
      display: flex;
      width: 100%;
      height: 100%;
      font-size: 12px;
      padding: 0 6px;
      align-items: center;
      box-sizing: border-box;
      ">
      <input id="inputTargetValue" placeholder="输入包含表格的容器，如：#app" style="flex:1;border-radius: 4px;padding:2px 5px;color: #000;"/>
      </div>
    `;
	$("#Listeners_ctrl_area").insertBefore(
		cDiv,
		$("#Listeners_ctrl_area").firstChild
	);
}

// 重写window.XMLHttpRequest，添加拦截
function ajax() {
	const _this = this;
	const originalXHR = window.XMLHttpRequest;
	let myXHR = function() {
		let requestMethod = undefined;

		function initXMLHttpRequest() {
			let open = originalXHR.prototype.open;
			originalXHR.prototype.open = function(...args) {
				// 请求前拦截
				modifyBefore(args);
				return open.apply(this, args);
			};
		}
		const modifyBefore = (args) => {
			// 抛出请求的method
			requestMethod = args[0];
		};
		initXMLHttpRequest();

		const xhr = new originalXHR();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				getData(xhr);
			}
		};

		for (let attr in xhr) {
			if (typeof xhr[attr] === "function") {
				this[attr] = xhr[attr].bind(xhr);
			} else {
				// responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
				if (attr === "responseText" || attr === "response") {
					Object.defineProperty(this, attr, {
						get: () =>
							this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
						set: (val) => (this[`_${attr}`] = val),
						enumerable: true,
					});
				} else {
					Object.defineProperty(this, attr, {
						get: () => xhr[attr],
						set: (val) => (xhr[attr] = val),
						enumerable: true,
					});
				}
			}
		}
	};
	window.XMLHttpRequest = myXHR;
}
// 拦截到的数据
function getData(xhr) {
	// console.log(xhr);
	let response = xhr.response ? JSON.parse(xhr.response) : "";
	console.log(response);
}
