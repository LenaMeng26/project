class Index {

 
 
  constructor() {
    // 渲染商品
    this.list();
    this.layUI();
    this.toTop();
    this.changeRed();
    this.state();
  }
  // 渲染商品
  list(){
    Ajax.get("./server/goods.php", { fn: "lits" }).then((res) => {
      let { stateCode, data } = JSON.parse(res);
      if(stateCode==200){
        let str='';
        data.forEach(ele=>{
          str+=`<li onclick="Index.buyGoods(${ele.id})">
          <!-- 商品图片1 -->
          <div class="box-t">
              <a href="#">
                  <img src="./images/jt.gif" data-src="${ele.goodsImg}">
              </a>
          </div>
          <!-- 商品详情 -->
          <div class="box-b">
              <a class="bigFont" href="#">
                 ${ele.goodsName}
              </a>
              <a class="grayFont" href="#">
                 ${ele.goodsDesc}
              </a>
              <a class="price" href="#">
                  <span>￥</span>
                  <span>${ele.price}</span>
              </a>
          </div>
      </li>`;
        })
        $_(".indexGoods").innerHTML=str;
        $_(".indexGoods2").innerHTML=str;
      }
    })

  }
  
 
  // 点击li进行跳转详情页
  static buyGoods(gId){
    localStorage.setItem('gId',gId);
    location.href='http://127.0.0.1/project/productDetail.html'; 
  }

  // 轮播图
  layUI() {
    // 轮播图
    layui.use("carousel", function () {
      var carousel = layui.carousel;
      //建造实例
      carousel.render({
        elem: "#test1",
        width: "100%", //设置容器宽度
        height: "470px",
        arrow: "hover", //始终显示箭头
        // ,anim: 'updown' //切换动画方式
      });
    });
  }

 
  // 获取滚动条到顶部的距离
  toTop() {
    // 点击返回顶部
    $_(".toTop").onclick = function () {
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        500
      );
    };
  }

  // 移入变红
  changeRed() {
    all("#rightNav .unClick").forEach((ele, index) => {
      // 移入
      ele.onmouseover = function () {
        // console.log(asObj[i]);
        this.style.display = "none";
        all("#rightNav .clickRed")[index].style.display = "block";
      };
      // 移出
      ele.onmouseout = function () {
        // console.log(this);
        this.style.display = "block";
        all("#rightNav .clickRed")[index].style.display = "none";
      };
    });
  }

  // 登录状态
  state() {
    // 判断状态
    let userId = localStorage.getItem("userId");
    // console.log(useId);
    if (userId) {
      // let login = document.querySelector(".h-right");
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
              $_(".h-right").style.display = "none";
              str = `<div class="exit">
                    <span>欢迎${userPhone}用户!</span>
                    <a href="#" class="unLogin" onclick='Index.unLogin(this,${ele.userId})'>退出登录</a>
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
  static unLogin(eleObj){
      let exit=eleObj.parentNode;
      // console.log(exit);
      exit.style.display='none';
      // let right=document.querySelector('.h-right');
      // console.log(right);
      $_('.h-right').style.display='block';
     localStorage.removeItem('userId');
      
      }
}
new Index();


