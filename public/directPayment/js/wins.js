(function(){
  var app = {
    init: function(){
      this.cacheEl();
      this.addEvent();
    },
    cacheEl: function(){
      var dom =document;
      this.complaintWinBtn = dom.getElementById("complaintWinBtn");
      this.complaintWin = dom.getElementById("complaintWin");
    },
    addEvent: function(){
      var touch = "touchstart";
      this.complaintWinBtn.addEventListener(touch, this.showComplaintWin.bind(this));
      var close = this.complaintWin.getElementsByClassName("close")[0];
      close.addEventListener(touch, this.hideComplaintWin.bind(this));
    },
    showComplaintWin: function(){
      var contentEl = this.complaintWin.getElementsByClassName("win-content")[0];
      this.complaintWin.style.display = "block";
      if(!contentEl.innerHTML.replace(/(^\s*)|(\s*$)/g,"")){
        this.getPage(contentEl);
      }
    },
    hideComplaintWin: function(){
      this.complaintWin.style.display = "none";
    },
    getPage: function(contentEl){
      util.ajax({url:"./complaint.html",type: "GET", success:function(res){
        contentEl.innerHTML = res;
      }
      });
    }
  };
  document.addEventListener("DOMContentLoaded", function () {
    app.init();
  }, false);
})();