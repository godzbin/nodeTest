(function () {
  var types = {
    "div": "盒子",
    "img": "图片",
    "p": "段落",
    "span": "字节",
    "a" : "超链接"
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
  function setData(data, json) {
    var isRender = false;
    if (data.parentId) {
      if (json.id == data.parentId) {
        data.id = guid();
        delete data.parentId;
        json.content.push(data);
        isRender = true;
      } else {
        var l = json.content.length;
        for (var i = 0; i < l; i++) {
          setData(data, json.content[i]);
        }
      }
    } else {
      if (json.id == data.id) {
        setAllData(json, data);
        isRender = true;
      } else {
        var l = json.content.length;
        for (var i = 0; i < l; i++) {
          setData(data, json.content[i]);
        }
      }
    }
    if (isRender) {
      app.render();
      setLocal();
    }
  }
  function setLocal(){
    localStorage.setItem("userData", JSON.stringify(userData));
  }
  function removeData(data, json, parent, i) {
    var isRender = false;
    if (json.id == data.id) {
      parent.splice(i, 1);
      isRender = true;
    } else {
      var l = json.content.length;
      for (var i = 0; i < l; i++) {
        removeData(data, json.content[i], json.content, i);
      }
    }
    if (isRender) {
      app.render();
      setLocal();
    }
  }
  function setAllData(json, data) {
    for (i in json) {
      json[i] = data[i];
    }
    return json;
  };
  function App() {
    var dom = document, self = this;
    this.init = function () {
      this.cacheEl();
      this.addEvents();
      this.render();
    };
    this.cacheEl = function () {
      this.phoneBox = g(".phone-box")[0];
      this.configBox = g(".configs-tree")[0];
      this.jsonStrEl = g(".json-str")[0];
    };
    this.addEvents = function () {
      this.configBox.addEventListener("click", this.clickConfigs);
    };
    this.clickConfigs = function (e) {
      console.dir(e.target);
      var target = e.target;
      if (target.tagName == "BUTTON") {
        var _type = target.getAttribute("v-type");
        var dataStr = target.getAttribute("v-data");
        var _name = target.innerText;
        var data = isJSONStr(dataStr) ? JSON.parse(dataStr) : dataStr;
        if (_type == "delete") {
          var r = confirm("确定要删掉节点" + data.name || "" + "吗?");
          if (r) {
            removeData(data, userData);
          }
        } else {
          win.openWin(_type, data, _name);
        }
      }
    };
    this.render = function () {
      this.phoneBox.innerHTML = "";
      this.configBox.innerHTML = "";
      this.setPhone(this.phoneBox, userData);
      this.setTree(this.configBox, userData);
      this.jsonStrEl.value = JSON.stringify(userData, null, 2);
    };
    this.setPhone = function (el, json) {
      var newEl = document.createElement(json.type);
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
    this.setTree = function (el, json) {
      var newEl = dom.createElement("div");
      newEl.className = "li";
      newEl.innerHTML = "<div>" + this.getStr(json) + "</div>";
      el.append(newEl);
      this.setBtns(newEl, json);
      if (!json.content) return;
      var len = json.content.length;
      for (var j = 0; j < len; j++) {
        this.setTree(newEl, json.content[j]);
      }
    };
    this.setBtns = function (el, json) {
      if (json.type !== "img") this.setBtn(el, "添加子节点", "add", json);
      this.setBtn(el, "更新本节点", "update", json);
      if (json.id !== "0") this.setBtn(el, "删除本节点", "delete", json);
    };
    this.setBtn = function (el, name, type, json) {
      var btn = dom.createElement("button");
      btn.innerText = name;
      btn.className = type;
      btn.setAttribute("v-type", type);
      btn.setAttribute("v-data", JSON.stringify(json));
      el.append(btn);
    };
    this.getStr = function (json) {
      var strArr = [];
      strArr.push("名称：" + (json.name || "未命名"));
      strArr.push("节点属性：<strong>" + types[json.type] + "</strong>");
      strArr.push("宽度：" + json.style.width  || "自动");
      strArr.push("高度：" + json.style.height || "自动");
      strArr.push("背景颜色：" + "<span style='padding: 0 5px;background:"+json.style.background+"'></span>" || "");
      // strArr.push("<p>样式：" + JSON.stringify(json.style) + "</p>");
      return strArr.join("；");
    };
  };

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
      setData(this.data, userData);
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
  var win = new Win();
  document.addEventListener("DOMContentLoaded", function () {
    var local = localStorage.getItem("userData");
    if(local){
      userData = JSON.parse(local);
    }
    app.init();
    win.init();
  }, false);
})();