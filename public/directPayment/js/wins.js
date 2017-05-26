(function () {
  var app = {
    init: function () {
      this.cacheEl();
      this.addEvent();
      this.urls = {
        complaint: "./complaint.html",
        about: "./about.html",
        record: "./record.html"
      }
    },
    cacheEl: function () {
      var dom = document;
      // 客服申诉
      this.complaintWinBtn = dom.getElementById("complaintWinBtn");
      this.complaintWin = dom.getElementById("complaintWin");
      // 关于
      this.aboutWinBtn = dom.getElementById("aboutWinBtn");
      this.aboutWin = dom.getElementById("aboutWin");
      // 消费记录
      this.recordWinBtn = dom.getElementById("recordWinBtn");
      this.recordWin = dom.getElementById("recordWin");
    },
    addEvent: function () {
      var touch = "touchstart";
      this.complaintWinBtn.addEventListener(touch, this.showComplaintWin.bind(this));
      this.aboutWinBtn.addEventListener(touch, this.showAboutWin.bind(this));
      this.recordWinBtn.addEventListener(touch, this.showRecordWin.bind(this));
    },
    showComplaintWin: function () {
      var contentEl = this.complaintWin.getElementsByClassName("win-content")[0];
      tools.showWin(this.complaintWin);
      if (!contentEl.innerHTML.replace(/(^\s*)|(\s*$)/g, "")) {
        this.getPage(contentEl,this.urls.complaint);
      }
    },
    // 隐藏 客服申述
    hideComplaintWin: function () {
      tools.hideWin(this.complaintWin);
    },
    // 显示 关于
    showAboutWin: function(){
      var contentEl = this.aboutWin.getElementsByClassName("win-content")[0];
      tools.showWin(this.aboutWin);
      if (!contentEl.innerHTML.replace(/(^\s*)|(\s*$)/g, "")) {
        this.getPage(contentEl,this.urls.about);
      }
    },
    //  隐藏关于
    hideAboutWin: function(){
      tools.hideWin(this.aboutWin);
    },
    // 显示消费记录
    showRecordWin: function(){
      var contentEl = this.recordWin.getElementsByClassName("win-content")[0];
      tools.showWin(this.recordWin);
      if (!contentEl.innerHTML.replace(/(^\s*)|(\s*$)/g, "")) {
        this.getPage(contentEl,this.urls.record);
      }
    },
    // 获取弹框 内容
    getPage: function (contentEl,url) {
      util.ajax({
        url: url, type: "GET", success: function (res) {
          contentEl.innerHTML = res;
        }
      });
    }
  };
  document.addEventListener("DOMContentLoaded", function () {
    app.init();
  }, false);
})();