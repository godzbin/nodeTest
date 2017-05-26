var tools = {};
(function () {
  tools.touch = "touchstart";
  tools.showWin = function (win) {
    var self = this;
    setTimeout(function () {
      win.className += " active";
    }, 100);
    win.style.display = "block";
    var closeEls = win.getElementsByClassName("close");
    for (var i = 0, l = closeEls.length; i < l; i++) {
      var el = closeEls[i];
      el.addEventListener(tools.touch, function () {
        tools.hideWin(win);
      });
    }
  };
  tools.hideWin = function (win) {
    win.className = win.className.replace("active", "");
    setTimeout(function () {
      win.style.display = "none";
    }, 500);
  };
})();