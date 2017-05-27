(function () {
  var defaultData = {
    pay_json: { "coinPrice": 200, "coinNum": 1, "fee": [{ "pulseNum": 8, "fee": 500, "count": 8, "feeStatus": 1 }, { "pulseNum": 7, "fee": 400, "count": 8, "feeStatus": 1 }, { "pulseNum": 6, "fee": 300, "count": 8, "feeStatus": 1 }, { "pulseNum": 5, "fee": 200, "count": 5, "feeStatus": 1 }] },
    device_json: { "proprietorId": 7690, "deviceType": 1, "productType": 1, "deviceName": "娃娃机", "maxCoinThreshold": 30, "deviceMac": "862810037575061", "pfServiceStatus": 1, "deviceId": 123594, "userId": 17, "status": 1, "addressId": 11, "units": "次" },

    user_json: { "userId": 1, "openId": "xxx", "ecNum": 100 },

    ec_json: { "address": { "coinPrice": 100, "ecIndate": 30 }, "isWalletState": 1, "isAdjustBuyEcNum": 1, "isCoinMachineBuyEc": 1, "devices": [{ "deviceId": 123594, "deviceName": "设备名称", "deviceMark": "A", "coinNum": 1, "maxCoinThreshold": 30, "isOnLine": 0 }, { "deviceId": 123294, "deviceName": "设备名称", "deviceMark": "B", "coinNum": 1, "maxCoinThreshold": 30, "isOnLine": 0 }, { "deviceId": 123194, "deviceName": "设备名称", "deviceMark": "A", "coinNum": 1, "maxCoinThreshold": 30, "isOnLine": 0 }, { "deviceId": 123294, "deviceName": "设备名称", "deviceMark": "A", "coinNum": 1, "maxCoinThreshold": 30, "isOnLine": 0 }, { "deviceId": 123694, "deviceName": "设备名称", "deviceMark": "A", "coinNum": 1, "maxCoinThreshold": 30, "isOnLine": 0 }], "feeBusinesses": [{ "id": "1", "fee": 1, "ecNum": 1 }, { "id": "2", "fee": 200, "ecNum": 2 }, { "id": "2", "fee": 200, "ecNum": 2 }, { "id": "2", "fee": 200, "ecNum": 2 }, { "id": "2", "fee": 200, "ecNum": 3 }, { "id": "2", "fee": 200, "ecNum": 2 }] }
  };
  function Pay() {
    var test = true;
    if (test) {
      this.data = defaultData;
    } else {
      this.data = userData;
    }
  };
  Pay.prototype = {
    // 初始话页面
    init: function () {
      this.fee = {
        fee: this.data.pay_json.coinPrice,
        pulseNum: this.data.pay_json.pulseNum
      };
      this.cachePage();
      this.addEvent();
      this.getFeeList();
    },
    /**
     * 基础方法
     */
    // 缓存元素
    cachePage: function () {
      var dom = document;
      // 套餐列表
      this.feeListEl = dom.getElementById("feeList");
      // 套餐模板
      this.feeDemo = dom.getElementById("feeDemo").innerHTML;
      // 设备信息
      this.coinNumEl = dom.getElementById("coinNum");
      this.coinPriceEl = dom.getElementById("coinPrice");
      // 当前选择套餐信息
      this.feeCoinEl = dom.getElementById("feeCoin");
      this.feePriceEl = dom.getElementById("feePrice");
      this.feePriceEle = dom.getElementById("feePriceEle");
      // 加减币数
      this.minusEl = dom.getElementsByClassName("minus")[0];
      this.pulsEl = dom.getElementsByClassName("puls")[0];
      // 支付信息
      this.payCoin = dom.getElementById("payCoin");
      this.payPrice = dom.getElementById("payPrice");
      // 支付按钮
      this.payBtn = dom.getElementById("payBtn");
      // 确认支付窗口
      this.confirmPayWin = dom.getElementById("confirmPayWin");
      this.confirmPayBtn = this.confirmPayWin.getElementsByClassName("pay-btn")[0];
      // 支付成功窗口
      this.paySuccessWin = dom.getElementById("paySuccess");
      // loading
      this.loadingWin = dom.getElementsByClassName("loading-win")[0];
      this.errorWin = dom.getElementById("errorWin");
    },
    // 添加事件
    addEvent: function () {
      var touch = 'touchstart';
      var self = this;
      // 事件委托 监听点击套餐
      this.feeListEl.addEventListener(touch, this.touchFee.bind(this));
      // 币数操作
      if (this.minusEl)
        this.minusEl.addEventListener(touch, this.minusCoin.bind(this));
      if (this.pulsEl)
        this.pulsEl.addEventListener(touch, this.pulsCoin.bind(this));
      // 支付确认
      this.payBtn.addEventListener(touch, this.showConfirmPayWin.bind(this));
      // 支付
      this.confirmPayBtn.addEventListener(touch, this.confirmPay.bind(this));
    },
    // 渲染界面
    renderFee: function () {
      var pay_json = this.data.pay_json;
      if (this.coinPriceEl)
        this.coinPriceEl.innerHTML = this.filitPrice(pay_json.coinPrice * pay_json.coinNum);
      // 操作相关
      if (this.coinNumEl)
        this.coinNumEl.innerHTML = pay_json.coinNum;
      if (this.feeCoinEl)
        this.feeCoinEl.innerHTML = this.fee.pulseNum;
      if (this.feePriceEl)
        this.feePriceEl.innerHTML = this.filitPrice(this.fee.fee);
      if (this.feePriceEle)
        this.feePriceEle.innerHTML = this.fee.pulseNum > 9 ? this.fee.pulseNum : "0" + this.fee.pulseNum;
      // -------------------------------------------------------
      // 支付相关
      if (this.payCoin)
        this.payCoin.innerHTML = this.fee.pulseNum;
      if (this.payPrice)
        this.payPrice.innerHTML = this.filitPrice(this.fee.fee, 2);
    },
    /**
     * 操作函数
     */
    // 减少币数
    minusCoin: function () {
      if (this.fee.pulseNum > this.data.pay_json.coinNum) {
        this.fee.pulseNum -= this.data.pay_json.coinNum;
        this.fee.fee = this.fee.pulseNum * this.data.pay_json.coinPrice;
        this.getFeeBox();
      }
    },
    // 添加币数
    pulsCoin: function () {
      if (this.fee.pulseNum < this.data.device_json.maxCoinThreshold) {
        this.fee.pulseNum += this.data.pay_json.coinNum;
        this.fee.fee = this.fee.pulseNum * this.data.pay_json.coinPrice;
        this.getFeeBox();
      }
    },
    // 获取当前套餐是否存在
    getFeeBox: function () {
      var els = this.feeListEl.children;
      var length = els.length;
      this.initFeeClassName();
      for (var i = 0; i < length; i++) {
        var data = this.getElData(els[i]);
        if (data.pulseNum === this.fee.pulseNum) {
          this.selectFee(els[i]);
        }
      }
      this.renderFee();
    },

    // 获取套餐列表
    getFeeList: function () {
      var fee = this.data.pay_json.fee;
      var l = fee.length;
      var feeList = [];
      for (var i = 0; i < l; i++) {
        feeList.push(this.getFeeStr(fee[i]));
      }
      this.feeListEl.innerHTML = feeList.join("");
      var el = this.feeListEl.children[0];
      this.selectFee(el);
    },
    // 获取套餐html
    getFeeStr: function (fee) {
      var coinPrice = this.data.pay_json.coinPrice;
      var give = ((fee.pulseNum * coinPrice) - fee.fee) / 100;
      return this.feeDemo.replace(/{{price}}/g, this.filitPrice(fee.fee))
        .replace(/{{data}}/g, JSON.stringify(fee))
        .replace(/{{coin}}/g, fee.pulseNum)
        .replace(/{{give}}/g, parseInt(give))
        .replace(/{{display}}/g, give ? "block" : "none");
    },
    // 点击弹窗列表 
    touchFee: function (e) {
      var target = e.target;
      if (target.className.indexOf("fee-box") > -1) {
        this.initFeeClassName();
        this.selectFee(target);
      }
    },
    // 选择套餐列表
    selectFee: function (el) {
      el.className += " active";
      this.fee = this.getElData(el);
      this.renderFee();
    },
    // 初始话套餐选择
    initFeeClassName: function () {
      var feeBoxs = this.feeListEl.children;
      var length = feeBoxs.length;
      for (var i = 0; i < length; i++) {
        feeBoxs[i].className = feeBoxs[i].className.replace("active", "");
      }
    },
    /**
     * 弹窗管理
     */
    // 显示确认支付框
    showConfirmPayWin: function () {
      tools.showWin(this.confirmPayWin);
      var closeEl = this.confirmPayWin.getElementsByClassName("close")[0];
      if (closeEl)
        closeEl.addEventListener("touchstart", this.hideConfirmPayWin.bind(this));
    },
    // 隐藏确认支付框
    hideConfirmPayWin: function () {
      tools.hideWin(this.confirmPayWin);
    },
    // 显示支付成功框
    showPaySuccessWin: function () {
      tools.showWin(this.paySuccessWin);
      this.showArrowsMain();
    },
    showArrowsMain: function () {
      var arrows = document.getElementsByClassName("arrow");
      var self = this;
      var showArrows = function (el, i, length) {
        setTimeout(function () {
          el.style.opacity = 1;
          if (i == length - 1 && self.paySuccessWin.style.display == "block") {
            setTimeout(function () {
              self.showArrowsMain();
            }, 100)
          }
        }, (i+1) * 200);
      }
      for (var i = 0, l = arrows.length; i < l; i++) {
        arrows[i].style.opacity = 0;
        showArrows(arrows[i], i, l);
      }
    },
    // 隐藏支付成功框
    hidePaySuccessWin: function () {
      tools.hideWin(this.paySuccessWin);
    },
    // 显示loading
    showLoading: function () {
      tools.showWin(this.loadingWin);
    },
    // 隐藏loading
    hideLoading: function () {
      tools.hideWin(this.loadingWin);
    },
    showErrorWin: function (msg) {
      var msgBox = this.errorWin.getElementsByClassName("msg")[0];
      msgBox.innerHTML = msg;
      tools.showWin(this.errorWin);
    },
    /**
     * 请求处理
     */
    // 确认支付
    confirmPay: function () {
      var json = {

      }
      var self = this;
      this.showLoading();
      self.hideConfirmPayWin();
      setTimeout(function () {
        self.hideLoading();
        self.showPaySuccessWin();
        // self.showErrorWin("支付失败");
      }, 1000);
    },
    /**
     * 工具类==============================
     */
    // 获取元素的v-data 数据
    getElData: function (el) {
      if (el && el.getAttribute) {
        var dataStr = el.getAttribute("v-data");
        var data = JSON.parse(dataStr);
        return data;
      }
      return {};
    },
    // 转换价格
    filitPrice: function (value, floatStr) {
      value = value || 0;
      if (floatStr) {
        return parseFloat(value / 100).toFixed(floatStr);
      } else {
        return parseInt(value / 100) || 0;
      }
    },
  }
  document.addEventListener("DOMContentLoaded", function () {
    var pay = new Pay();
    pay.init();
  }, false);
})();