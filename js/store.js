class Store {
  constructor() {
    this.layUi();
    this.toTop();
    this.changeRed();
    this.list();
    this.state();
  }

  // 轮播图
  layUi() {
    layui.use("carousel", function () {
      var carousel = layui.carousel;
      //建造实例
      carousel.render({
        elem: "#test1",
        width: "100%", //设置容器宽度
        height: "470px",
        arrow: "hover", //始终显示箭头
        //,anim: 'updown' //切换动画方式
      });
    });
  }

  //  右侧去顶端
  toTop() {
    $_(".toTop").onclick = function () {
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        1000
      );
    };
  }
  // 右侧移入变红
  changeRed() {
    // 移入变红
    all("#rightNav .unClick").forEach((ele, index) => {
      ele.onmouseover = function () {
        // console.log(asObj[i]);
        this.style.display = "none";
        all("#rightNav .clickRed")[index].style.display = "block";
      };
      ele.onmouseout = function () {
        // console.log(this);
        this.style.display = "block";
        all("#rightNav .clickRed")[index].style.display = "none";
      };
    });
  }

  // 商品渲染
  list() {
    Ajax.get("./server/goods.php", { fn: "lists" }).then((res) => {
      // console.log(res);
      let { stateCode, data } = JSON.parse(res);
      //  console.log(data);
      if (stateCode == 200) {
        let str = "";
        data.forEach((ele) => {
          str += ` <li class="liGoods">
            <div class="img">
                <img src="./images/jt.gif" data-src="${ele.goodsImg}" alt="">
            </div>
            <p class="names">${ele.goodsName}</p>
            <p class="titles">${ele.goodsDesc}</p>
            <div class="price">
                <div class="price-top">
                    <span class="price-sign">￥</span>
                    <span class="price-num">${ele.price}</span>
                    <a href="#"  class="price-btn" onclick="Store.buyGoods(${ele.id})">立即抢购</a>
                </div>
            </div>
            </li>`;
        });
        $_(".ulGoods").innerHTML = str;
      }
    });
  }

  // 抢购
  static buyGoods(gId) {
    localStorage.setItem("gId", gId);
    location.href = "http://127.0.0.1/project/productDetail.html";
  }

  // 登录状态
  state() {
    // 判断状态
    let userId = localStorage.getItem("userId");
    // console.log(useId);
    if (userId) {
      let login = document.querySelector(".h-right");
      Ajax.post("./server/register.php?fn=lists", { userId: userId }).then(
        (res) => {
          //  console.log(res);
          let { stateCode, data } = JSON.parse(res);
          if (stateCode == 200) {
            let str = "";
            data.forEach((ele) => {
              let userPh = ele.userPhone;
              var reg = /(\d{3})\d{4}(\d{4})/;
              let userPhone = userPh.replace(reg, "$1****$2");
              // console.log(userPhone);
              login.style.display = "none";
              str = `<div class="exit">
                  <span>欢迎${userPhone}用户!</span>
                  <a href="#" class="unLogin" onclick='Store.unLogin(this,${ele.userId})'>退出登录</a>
                   </div>`;
              // console.log(str);
            });
            $_(".exits").innerHTML = str;
          }
        }
      );
    }
  }

  // 退出登录
  static unLogin(eleObj) {
    let exit = eleObj.parentNode;
    // console.log(exit);
    exit.style.display = "none";
    // console.log(right);
    $_(".h-right").style.display = "block";
    localStorage.removeItem("userId");
  }
}
new Store();
