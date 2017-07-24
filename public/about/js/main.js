(function () {
  var types = {
    "div": "盒子",
    "img": "图片",
    "p": "段落",
    "span": "字节",
    "a": "超链接"
  }
  var userData = {
    id: "0",
    type: "div",
    text: "",
    src: "",
    name: "主界面",
    style: {},
    content: []
  };
  // 获取元素
  function g(id, parentEl) {
    parentEl = parentEl || document;
    if (id.substr(0, 1) == '.') {
      return parentEl.getElementsByClassName(id.substr(1));
    }
    return parentEl.getElementById(id);
  }
  function isJSONStr(str) {
    try {
      var parame = JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  function isClass(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
  }
  //  下载页面
  function downloadFile(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob([content], {
      type: "application/js"
    });
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
    aLink.click();
  }
  var tools = {
    // 添加/修改 节点
    setData: function (data, json) {
      var isRender = false;
      if (data.parentId) {
        if (json.id == data.parentId) {
          var newData = tools.setAllData(newData, data);
          newData.id = guid();
          delete newData.parentId;
          json.content.push(newData);
          isRender = true;
        } else {
          var l = json.content.length;
          for (var i = 0; i < l; i++) {
            tools.setData(data, json.content[i]);
          }
        }
      } else {
        if (json.id == data.id) {
          tools.setAllData(json, data);
          isRender = true;
        } else {
          var l = json.content.length;
          for (var i = 0; i < l; i++) {
            tools.setData(data, json.content[i]);
          }
        }
      }
      if (isRender) {
        tools.updateFace();
      }
    },
    updateFace: function () {
      app.render();
      phone.render();
      tools.setLocal();
    },
    // 写入本地缓存
    setLocal: function () {
      localStorage.setItem("userData", JSON.stringify(userData));
    },
    // 删除节点
    removeData: function (data, json, parent, i) {
      var isRender = false;
      if (json.id == data.id) {
        parent.splice(i, 1);
        isRender = true;
      } else {
        var l = json.content.length;
        for (var i = 0; i < l; i++) {
          tools.removeData(data, json.content[i], json.content, i);
        }
      }
      if (isRender) {
        tools.updateFace();
      }
    },
    // 替换节点
    setAllData: function (result, obj) {
      var oClass = isClass(obj);
      //确定result的类型
      if (oClass === "Object") {
        result = {};
      } else if (oClass === "Array") {
        result = [];
      } else {
        return obj;
      }
      for (key in obj) {
        var copy = obj[key];

        if (isClass(copy) == "Object") {
          result[key] = arguments.callee(result[key], copy);//递归调用
        } else if (isClass(copy) == "Array") {
          result[key] = arguments.callee(result[key], copy);
        } else {
          result[key] = obj[key];
        }
        if (key == "id") {
          result[key] = guid();
        }
      }
      return result;
    },
    //  上移节点
    upData: function (data, json, parent, i) {
      var isRender = false;
      if (json.id == data.id) {
        parent = tools.swap(parent, i, i - 1);
        isRender = true;
      } else {
        var l = json.content.length;
        for (var i = 0; i < l; i++) {
          tools.upData(data, json.content[i], json.content, i);
        }
      }
      if (isRender) {
        tools.updateFace();
      }
    },
    // 下移节点
    downData: function (data, json, parent, i) {
      var isRender = false;
      if (json.id == data.id) {
        // parent.splice(i, 1);
        parent = tools.swap(parent, i, i + 1);
        isRender = true;
      } else {
        var l = json.content.length;
        for (var i = l - 1; i >= 0; i--) {
          tools.downData(data, json.content[i], json.content, i);
        }
      }
      if (isRender) {
        tools.updateFace();
      }
    },
    // 插入节点
    insertData: function (data, json, parent, i) {
      var isRender = false;
      if (json.id == data.id) {
        var newData = {};
        newData = tools.setAllData(newData, data);
        newData.id = guid();
        parent.splice(i, 0, newData);
        isRender = true;
      } else {
        var l = json.content.length;
        for (var i = l - 1; i >= 0; i--) {
          tools.insertData(data, json.content[i], json.content, i);
        }
      }
      if (isRender) {
        tools.updateFace();
      }
    },
    upFirstData: function (data, json, parent, i) {
      var isRender = false;
      if (json.id == data.id) {
        parent.splice(i, 1);
        parent.unshift(data);
        isRender = true;
      } else {
        var l = json.content.length;
        for (var i = 0; i < l; i++) {
          tools.upFirstData(data, json.content[i], json.content, i);
        }
      }
      if (isRender) {
        tools.updateFace();
      }
    },
    downLastData: function (data, json, parent, i) {
      var isRender = false;
      if (json.id == data.id) {
        parent.splice(i, 1);
        parent.push(data);
        isRender = true;
      } else {
        var l = json.content.length;
        for (var i = l - 1; i >= 0; i--) {
          tools.downLastData(data, json.content[i], json.content, i);
        }
      }
      if (isRender) {
        tools.updateFace();
      }
    },
    // 交换数组内对象位置
    swap: function (array, first, second) {
      if (!array[second] || !array[first]) {
        return array;
      }
      var tmp = array[second];
      array[second] = array[first];
      array[first] = tmp;
      return array;
    }
  }
  // 主控制界面
  function App() {
    var dom = document, self = this;
    this.data = {};
    this.hideJson = {};
    this.init = function () {
      this.cacheEl();
      this.addEvents();
      this.render();
    };
    this.cacheEl = function () {
      // this.phoneBox = g(".phone-box")[0];
      this.configBox = g(".configs-tree")[0];
      this.jsonStrEl = g(".json-str")[0];
      this.applyJson = g(".applyJson")[0];
      this.downPageBtn = g(".downPage")[0];
      this.useDemoInput = g(".useDemoInput")[0];
      this.useDemoBtn = g(".useDemoBtn")[0];
      // this.configsBtns = g(".configs-btns")[0];
    };
    this.addEvents = function () {
      this.configBox.addEventListener("click", this.clickConfigs);
      this.applyJson.addEventListener("click", this.applyJsonData)
      this.downPageBtn.addEventListener("click", this.downPage);
      this.useDemoBtn.addEventListener("click", this.useDemo);
      // this.configsBtns.addEventListener("click", this.clickBtns);
    };
    this.useDemo = function () {
      var link = self.useDemoInput.value;
      if (!link) {
        alert("输入链接为空");
      }
      var script = dom.createElement("script");
      script.src = link;
      document.body.append(script);
      script.onload = function () {
        if (typeof aboutConfig !== "Undefined") {
          userData = aboutConfig;
          tools.updateFace();
        }
      };
    };
    this.downPage = function () {
      var jsonStr = self.jsonStrEl.value;
      if (isJSONStr(jsonStr)) {
        downloadFile(self.getTimeStr() + ".js", "var aboutConfig=" + jsonStr);
      } else {
        alert("json格式有误");
      }
    };
    this.getTimeStr = function () {
      var date = new Date();
      var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes();
      return str;
    };
    this.applyJsonData = function () {
      var jsonStr = self.jsonStrEl.value;
      if (isJSONStr(jsonStr)) {
        var json = JSON.parse(jsonStr);
        userData = json;
        tools.updateFace();
      } else {
        alert("json格式有误");
      }
    };
    this.clickBtns = function (e) {
      var target = e.target;
      if (target.tagName == "BUTTON") {
        var _type = target.getAttribute("v-type");
        var _id = target.getAttribute("v-id");
        var _name = target.title;
        var data = self.data[_id];
        this.setDataToType(_type, data, _name);
      }
    };
    this.setDataToType = function (_type, data, _name) {
      switch (_type) {
        case "delete":
          var r = confirm("确定要删掉节点" + data.name || "" + "吗?");
          if (r) {
            tools.removeData(data, userData);
          }
          break;
        case "add":
          win.openWin(_type, data, _name);
          break;
        case "update":
          win.openWin(_type, data, _name);
          break;
        case "up":
          tools.upData(data, userData);
          break;
        case "down":
          tools.downData(data, userData);
          break;
        case "insert":
          tools.insertData(data, userData);
          break;
        case "upFirst":
          tools.upFirstData(data, userData);
          break;
        case "downLast":
          tools.downLastData(data, userData);
          break;
        case "copy":
          self.setCopyData(data, userData);
          break;
        case "paste":
          if (!self.copyData) {
            return;
          }
          self.copyData.parentId = data.id;
          tools.setData(self.copyData, userData);
          break;
        default:
          break;
      }
    };
    this.setCopyData = function (data) {
      this.copyData = tools.setAllData(this.copyData, data);
    };
    this.clickConfigs = function (e) {
      var target = e.target;
      if (target.className.indexOf("li") > -1) {
        if (self.activeEl) {
          self.activeEl.className = self.activeEl.className.replace(" active", "");
        }
        self.activeEl = target;
        self.activeEl.className += " active";
        var _id = target.getAttribute("v-id");
        var json = self.data[_id];
        self.activeJson = json;
        // self.setBtns(self.configsBtns, json);
      } else if (target.tagName == "BUTTON") {
        self.clickBtns(e);
      } else if (target.className.indexOf("hideBox") > -1) {
        var el = target.parentElement;
        var _id = target.getAttribute("v-id");
        if (self.hideJson[_id]) {
          self.hideJson[_id] = null;
          delete self.hideJson[_id];
          el.className = el.className.replace(" hideChild", "");
        } else {
          self.hideJson[_id] = true;
          el.className += " hideChild";
        }
      }
    };
    this.render = function () {
      // this.phoneBox.innerHTML = "";
      this.configBox.innerHTML = "";
      self.activeEl && (self.activeEl.className = "li");
      // this.setPhone(this.phoneBox, userData);
      this.setTree(this.configBox, userData);
      this.jsonStrEl.value = JSON.stringify(userData, null, 2);
    };
    this.setTree = function (el, json) {
      var newEl = dom.createElement("div");
      var hideEl = dom.createElement("div");
      newEl.className = "li";
      hideEl.className = "hideBox";
      hideEl.setAttribute("v-id", json.id);
      if (this.activeJson && this.activeJson.id == json.id) {
        newEl.className += " active";
        self.activeEl = newEl;
      }
      if (this.hideJson && this.hideJson[json.id]) {
        newEl.className += " hideChild";
      }

      newEl.setAttribute("v-id", json.id);
      newEl.innerHTML = "<div class='text'>" + this.getStr(json) + "</div>";
      el.append(newEl);
      if (json.content.length > 0) newEl.append(hideEl);
      this.setBtns(newEl, json);
      this.data[json.id] = json;
      if (!json.content) return;
      var len = json.content.length;
      for (var j = 0; j < len; j++) {
        this.setTree(newEl, json.content[j]);
      }
    };
    this.setBtns = function (el, json) {
      var newEl = dom.createElement("div");
      newEl.className = "configs-btns";
      el.append(newEl);
      // el.innerHTML = "";
      if (json.type !== "img" && json.type !== "span") {
        this.setBtn(newEl, "＋", "add", json, "添加子节点");
      }
      this.setBtn(newEl, "✎", "update", json, "更新节点");
      if (json.id !== "0") {
        this.setBtn(newEl, " ☒ ", "delete", json, "删除");
        this.setBtn(newEl, " ↙ ", "insert", json, "向下复制插入");
        this.setBtn(newEl, "↑↑", "upFirst", json, "置顶");
        this.setBtn(newEl, "↑", "up", json, "向上移");
        this.setBtn(newEl, "↓", "down", json, "向下移");
        this.setBtn(newEl, "↓↓", "downLast", json, "置底");
        this.setBtn(newEl, "C", "copy", json, "复制该节点");
        this.setBtn(newEl, "V", "paste", json, "黏贴到此节点中");
      }
    };
    this.setBtn = function (el, name, type, json, title) {
      var btn = dom.createElement("button");
      btn.innerText = name;
      btn.className = type;
      btn.title = title || "";
      btn.setAttribute("v-type", type);
      btn.setAttribute("v-id", json.id);
      // btn.setAttribute("v-data", JSON.stringify(json));
      el.append(btn);
    };
    this.getStr = function (json) {
      var strArr = [];
      strArr.push("<p>名称：<strong>" + (json.name || "未命名") + "</strong></p>");
      strArr.push("节点属性：<strong>" + types[json.type] + ";</strong>");
      strArr.push("宽度：" + (json.style.width || "自动;"));
      strArr.push("高度：" + (json.style.height || "自动;"));
      json.style.background && strArr.push("背景颜色：" + "<span style='padding: 0 5px;background:" + json.style.background + "'></span>;" || "");
      json.text && strArr.push("<p>内容：" + json.text.substr(0, 20) + (json.text.length > 20 ? "..." : "") + "</p>");
      json.src && strArr.push("<p>图片：<img style='width:50px' src='" + json.src + "'></p>");
      return strArr.join("");
    };
  };
  // 渲染手机
  function Phone() {
    var dom = document, self = this;
    this.init = function () {
      this.cacheEl();
      this.addEvents();
      this.render();
    };
    this.cacheEl = function () {
      this.phoneBox = g(".phone-box")[0];
    };
    this.addEvents = function () {
      this.phoneBox.addEventListener("click", this.clickPhone);
    };
    this.clickPhone = function (e) {
      var target = e.target;
      if (target.className.indexOf("hideContent") > -1) {
        var nextEl = target.nextSibling;
        if (nextEl && nextEl.style.display == "none") {
          nextEl.style.display = "block";
        } else if (nextEl) {
          nextEl.style.display = "none";
        }
      } else if (target.className.indexOf("hideAll") > -1) {
        self.hideAll();
      }
    };
    this.hideAll = function () {
      var boxs = g(".hideContent", self.phoneBox);
      for (var i = 0, l = boxs.length; i < l; i++) {
        var nextEl = boxs[i].nextSibling;
        if(nextEl){
          nextEl.style.display = "none";
        }
      }
    };
    this.render = function () {
      this.phoneBox.innerHTML = "";
      this.setPhone(this.phoneBox, userData);
    };
    this.setPhone = function (el, json) {
      var newEl = document.createElement(json.type);
      for (i in json) {
        newEl[i] = json[i];
      }
      for (i in json.style) {
        newEl.style[i] = json.style[i];
      }
      el.append(newEl);
      if (json.type !== "img") {
        newEl.innerText = json.text || "";
      } else {
        newEl.src = json.src;
      }
      if (!json.content) return;
      var len = json.content.length;
      for (var j = 0; j < len; j++) {
        this.setPhone(newEl, json.content[j]);
      }
    };
  };
  // 弹窗配置界面
  function Win() {
    this.el = g(".config-win")[0];
    var self = this, click = "click";
    this.init = function () {
      this.cacheEl();
      this.addEvents();
      this.setTypeSelect();
    };
    this.cacheEl = function () {
      this.returnEl = g(".closeBtn", this.el)[0];
      this.subBtn = g(".subBtn", this.el)[0];
      this.values = g(".value", this.el);
      this.title = g(".title", this.el)[0];
      this.typesEl = g(".type", this.el)[0];
    };
    this.addEvents = function () {
      this.returnEl.addEventListener(click, this.hide);
      this.subBtn.addEventListener(click, this.sub.bind(this));
    };
    this.setTypeSelect = function () {
      var a = [];
      for (i in types) {
        a.push("<option value='" + i + "'>" + types[i] + "</option>");
      }
      this.typesEl.innerHTML = a.join("");
    };
    this.openWin = function (type, data, name) {
      this.type = type;
      this.data = {};
      if (type == "add") {
        this.data.parentId = data.id;
      } else if (type == "update") {
        this.data.parentId = null;
        this.data = data;
        this.setValues();
      }
      this.show();
      this.title.innerText = name;
    };
    this.setValues = function () {
      var l = this.values.length;
      for (var i = 0; i < l; i++) {
        var _name = this.values[i].getAttribute("v-name");
        var _style = this.values[i].getAttribute("v-style");
        if (_name) this.values[i].value = this.data[_name] || "";
        if (_style) this.values[i].value = this.data.style[_style] || "";
      }
    };
    this.sub = function () {
      this.data.style = this.data.style || {};
      var l = this.values.length;
      for (var i = 0; i < l; i++) {
        var _name = this.values[i].getAttribute("v-name");
        var _style = this.values[i].getAttribute("v-style");
        if (_name) this.data[_name] = this.values[i].value || "";
        if (_style) this.data.style[_style] = this.values[i].value || "";
      }
      if (!this.data.type) {
        alert("请选择节点类型");
        return;
      }
      this.data.content = this.data.content || [];
      tools.setData(this.data, userData);
      this.hide();
    };
    this.initVaue = function () {
      var l = this.values.length;
      for (var i = 0; i < l; i++) {
        this.values[i].value = "";
      }
      this.data = {};
    };
    this.show = function () {
      this.el.style.display = "block";
    };
    this.hide = function () {
      self.el.style.display = "none";
      self.initVaue();
    };
  };
  var app = new App();
  var phone = new Phone();
  var win = new Win();
  document.addEventListener("DOMContentLoaded", function () {
    var local = localStorage.getItem("userData");
    if (local) {
      userData = JSON.parse(local);
    }
    app.init();
    win.init();
    phone.init();
  }, false);
})();