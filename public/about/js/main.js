(function () {
  var types = {
    "div": "盒子",
    "img": "图片",
    "p": "段落"
  }
  var userData = {
    id: "1",
    type: "div",
    name: "主界面",
    style: {
      width: "100%",
      background: "#496be6",
      padding: "5px",
      float: "left",
      fontSize: "",
    },
    content: [{
      id: "XXXXX",
      type: "p",
      name: "主界面",
      style: {
        width: "100%",
        background: "#ddd",
        padding: "5px",
        float: "left",
        textAlign: "center"
      },
      text: "lalala"
    }, {
      id: "XXXXX",
      type: "p",
      name: "主界面",
      style: {
        width: "100%",
        background: "#ddd",
        padding: "5px",
        float: "left"
      },
      text: "lalala"
    }
    ]
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
    };
    this.addEvents = function () {
      this.configBox.addEventListener("click", this.clickConfigs);
    };
    this.clickConfigs = function (e) {
      console.dir(e.target);
      var target = e.target;
      if (target.tagName == "BUTTON") {
        win.show();
      }
    };
    this.render = function () {
      this.setPhone(this.phoneBox, userData);
      this.setTree(this.configBox, userData);
    };
    this.setPhone = function (el, json) {
      var newEl = document.createElement(json.type);
      for (i in json.style) {
        newEl.style[i] = json.style[i];
      }
      el.append(newEl);
      if (json.type == "p") {
        newEl.innerText = json.text;
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
      this.setBtns(newEl, json.id);
      if (!json.content) return;
      var len = json.content.length;
      for (var j = 0; j < len; j++) {
        this.setTree(newEl, json.content[j]);
      }
    };
    this.setBtns = function (el, id) {
      this.setBtn(el, "添加子节点", "add", id);
      this.setBtn(el, "更新本节点", "update", id);
      this.setBtn(el, "删除本节点", "delete", id);
    };
    this.setBtn = function (el, name, type, id) {
      var btn = dom.createElement("button");
      btn.innerText = name;
      btn.setAttribute("v-type", type);
      btn.setAttribute("v-id", id);
      el.append(btn);
    };
    this.getStr = function (json) {
      var strArr = [];
      strArr.push("名称：" + (json.name || "未命名"));
      strArr.push("节点属性：" + types[json.type]);
      strArr.push("<p>样式：" + JSON.stringify(json.style) + "</p>");
      return strArr.join("；");
    };
  };

  function Win() {
    this.el = g(".config-win")[0];
    var self = this;
    this.init = function(){
      this.cacheEl();
      this.addEvents();
    };
    this.cacheEl = function(){
      this.returnEl = g(".closeBtn", this.el)[0];
    };
    this.addEvents = function(){
      this.returnEl.addEventListener("click", this.hide)
    };
    this.openWin = function(type, id){
      if(type == "add"){
        this.parentId = id;
      }else if(type == "update"){
        
      }
    };
    this.show = function () {
      this.el.style.display = "block";
    };
    this.hide = function () {
      self.el.style.display = "none";
    };
  };
  var app = new App();
  var win = new Win();
  document.addEventListener("DOMContentLoaded", function () {
    app.init();
    win.init();
  }, false);
})();