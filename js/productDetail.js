class Detail {
 

  constructor() {
    this.scroll();
    this.changeRed();
    this.changeHtml();
    this.state();
    this.setVal();
    this.add();
  }

  // 右侧滚动条回顶部
  scroll() {
    // 右侧导航栏返回顶部
    // 绑定滚动条事件
    // 获取滚动条到顶部的距离

    window.onscroll = function () {
      var top = document.documentElement.scrollTop;
      // console.log(111);
      let rightObj = $_("#rightNav");
      //    console.log(toTop);
      if (top > 0) {
        $(rightObj).fadeIn(400);
      } else {
        $(rightObj).fadeOut(400);
      }
    };
    // 点击返回顶部
    $_(".toTop").onclick = function () {
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        1000
      );
    };
  }

  //  移入变红
  changeRed() {
    var asObj = all("#rightNav .unClick");
    var aRedObj = all("#rightNav .clickRed");

    asObj.forEach((ele, index) => {
      ele.onmouseover = function () {
        // console.log(asObj[i]);
        this.style.display = "none";
        aRedObj[index].style.display = "block";
      };
      ele.onmouseout = function () {
        // console.log(this);
        this.style.display = "block";
        aRedObj[index].style.display = "none";
      };
    });
  }

  // 页面渲染
  changeHtml() {
    let gId = localStorage.getItem("gId");
    Ajax.get("./server/goods.php", { fn: "lit", gId: gId }).then((res) => {
      // console.log(res);
      let { stateCode, data } = JSON.parse(res);
      let str = "";
      let str2="";
      if (stateCode == 200) {
        data.forEach((ele) => {
          // console.log(ele.price);
          str = `<div class="small" id="small" >
                       <img class="smallImg"  src="${ele.goodsImg}" width="350" alt="">
                        <div class="mask" id="mask"></div>
                 </div>
                  <div class="big" id="big" >
                    <img class="bigImg" src="${ele.goodsImg}" width="600" alt="" >
                  </div>`;
          str2=`<span class="sign">¥</span>
          <span class="show">${ele.price}</span>`
           
        });
        $_("#box").innerHTML = str;
        $_(".priceNum").innerHTML=str2;
        // 放大镜
        // 小方块移入显示
         $_("#small").addEventListener('mouseover',this.show);

        //  小方块移出隐藏
        $_("#small").addEventListener('mouseout',this.hide);
        // 移动

        $_("#small").addEventListener('mousemove',this.move);
    
      }
    });
  }

  // 显示
  show(){
    $_("#mask").style.display = "block";
    $_("#big").style.display = "block";
  }
  // 隐藏
  hide(){
    $_("#mask").style.display = "none";
    $_("#big").style.display = "none";
  }
  // 移动
  move(eve){
    // 鼠标的位置
    var mouseX = eve.pageX;
    var mouseY = eve.pageY;

    // 获取box的位置
    var boxL = $_("#box").offsetLeft;
    var boxT = $_("#box").offsetTop;

    // mask的自身宽高度
    var maskW = $_("#mask").offsetWidth;
    var maskH = $_("#mask").offsetHeight;

    // 计算小黄块相对于图的距离
    var tmpX = mouseX - boxL - maskW / 2;
    var tmpY = mouseY - boxT - maskH / 2 - 150;
    // console.log(tmpX,tmpY);

    // 目标
    // 设置目标距离
    var targetX =  $_("#small").offsetWidth - maskW;
    var targetY =  $_("#small").offsetHeight - maskH;
    // 判断是否到达最大距离
    if (tmpX > targetX) tmpX = targetX;
    if (tmpY > targetY) tmpY = targetY;

    if (tmpX < 0) tmpX = 0;
    if (tmpY < 0) tmpY = 0;

    $_("#mask").style.left = tmpX + "px";
    $_("#mask").style.top = tmpY + "px";

    var bigTargetX =  $_(".bigImg").offsetWidth -$_("#big").offsetWidth;
    var bigTargetY =  $_(".bigImg").offsetHeight -$_("#big").offsetHeight;
    var bigX = (tmpX / targetX) * bigTargetX;
    var bigY = (tmpY / targetX) * bigTargetY;

    // 设置最终大图位置
    // console.log(bigX,bigY)
    $_(".bigImg").style.left = -bigX + "px";
    $_(".bigImg").style.top = -bigY + "px";
  }

  setVal(){
    let getV=$_(".txt").value ;
    localStorage.setItem('gNum',getV );
  }
  // 给加减号绑定事件
  add() {
    // 事件
    $_(".add").onclick = function () {
      $_(".txt").value = $_(".txt").value - 0 + 1;
      localStorage.setItem('gNum',$_(".txt").value );
    };
    $_(".reduce").onclick = function () {
      $_(".txt").value =$_(".txt").value - 1;
      if ($_(".txt").value < 1) {
        $_(".txt").value = 1;
      }
      localStorage.setItem('gNum', $_(".txt").value );
    };
  }

 
  
  

  static addCart(){
    let gId=localStorage.getItem('gId');
      // console.log(gId);
      let gNum=localStorage.getItem('gNum')-0;
      // console.log(gNum);
    //判断用户是否存在
    if(localStorage.getItem('userId')){
        // console.log(111);
        // 存在数据库
        Detail.saveDataBase(gId,gNum);
    }else{
      //  console.log(222);
      // 存在本地
        Detail.saveLocal(gId,gNum);
    }
  }


  // 存放在数据库
  static saveDataBase(gId,gNum){
    // 获取用户id
    let userId=localStorage.getItem('userId');
    Ajax.post('./server/goods.php?fn=add',{userId:userId,gId:gId,gNum:gNum}).then(res=>{
      alert('已加入购物车')
    })
  }

  // 存放在浏览器
  static saveLocal(gId,gNum){
    alert('已加入购物车')
    //  查看是否存在carts
    let goods=localStorage.getItem('carts');
    if(goods){
        // 存在获取数据,转换对象使用
        goods=JSON.parse(goods);
        for(let attr in goods){
          if(gId==attr){
            gNum=goods[gId]-0+gNum;
          }
        }
        // 商品不存在
        goods[gId]=gNum;
        // 进行设置
        localStorage.setItem('carts',JSON.stringify(goods));
       
      }else{
      console.log(gId);
      // 创建对象
      let goodsObj={[gId]:gNum};
      // 设置carts
      localStorage.setItem('carts',JSON.stringify(goodsObj))
    }
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
                    <a href="#" class="unLogin" onclick='Detail.unLogin(this,${ele.userId})'>退出登录</a>
                     </div>`;
              // console.log(str);
            });
            document.querySelector(".exits").innerHTML = str;
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
      let right=document.querySelector('.h-right');
      // console.log(right);
      right.style.display='block';
     localStorage.removeItem('userId');
      
      }

  
}
new Detail();
