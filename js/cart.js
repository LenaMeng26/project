class Cart {
  constructor() {
    this.state();
    this.addCart();

    // 给全选按钮绑定事件
    all('.check-all')[0].addEventListener('click',this.checkAll);
    all('.check-all')[1].addEventListener('click',this.checkAll);
  
    // 删除选中商品
    $_('.delChoose').addEventListener('click',this.delChecked);
}

  // 购物车内容渲染
  addCart() {
    // 是否登录
    let userId = localStorage.getItem("userId");
    let goodsId = "";
    // console.log(userId);
    if (userId) {
      Ajax.get("./server/cart.php", { fn: "getGoodsId", userId: userId }).then(
        (res) => {
          // console.log(res);
          let { stateCode, data } = JSON.parse(res);
          let goodsIdNum={};//将商品id和数量存放为对象
          if (stateCode == 200) {
            if (!data) return;
            data.forEach((ele) => {
              goodsId += ele.productId + ",";
            goodsIdNum[ele.productId]=ele.num;
            });
          }
          console.log(goodsId);
          Cart.getCartGoods(goodsId,goodsIdNum);
        }
      );
    } else {
      let goodsObj = JSON.parse(localStorage.getItem("carts"));
      if (!goodsObj) return;
      for (let gId in goodsObj) {
        goodsId += gId + ",";
      }
      console.log(goodsId);
      Cart.getCartGoods(goodsId);
    }
  }

  // 获取商品信息
  static getCartGoods(cgId,cIdNum='') {
   cIdNum=cIdNum || JSON.parse(localStorage.getItem('carts'));
    Ajax.post("./server/cart.php?fn=lst", { goodsId: cgId }).then((res) => {
      // console.log(res);
      let { stateCode, data } = JSON.parse(res);
      if (!data) return;
      if (stateCode == 200) {
        let str = "";
        data.forEach(ele => [
          str += `<tr>
                    <td  class="checkOne">
                        <input gId="${ele.id}" type="checkbox" class="check-one check" onclick="Cart.checkOne(this)" />
                    </td>
                    <td width="148px" class="tdImg">
                        <img src="${ele.goodsImg}" alt="">
                    </td>
                    <td width="257px" class="tdInfo">
                        <a href="#">${ele.goodsName}</a>
                        <div class="serve">
                            <a href="#">
                                <img src="//m1.lefile.cn/trade/cn/pc/images/base/lenovo_icon.jpg" alt="">
                                &nbsp; 购买联想服务
                            </a>
                        </div>
                    </td>
                    <td width="163" > </td>
                    <td width="152" class="tdPrice">  
                        <span class="price">${ele.price}</span>
                    </td>
                    <td width="152" class="tdAdd">
                        <label class="cal">
                            <input class="reduce" type="button" value="-" onclick="Cart.reduce(this,${ele.id})">
                            <input class="val" type="text" value="${cIdNum[ele.id]}">
                            <input class="add" type="button" value="+" onclick="Cart.add(this,${ele.id})">
                        </label>
                    </td>
                    <td width="152px" class="money">${(ele.price*cIdNum[ele.id]).toFixed(2)}</td>
                    <td width="117px" class="delete">
                        <a onclick="Cart.del(this,${ele.id})" href="#" class="aDel">
                            删除
                        </a>
                    </td>
                </tr>`
        ]);
        $_('.tbody').innerHTML=str;
      }
    });
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
                    <a href="#" class="unLogin" onclick='Cart.unLogin(this,${ele.userId})'>退出登录</a>
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
  static unLogin(eleObj) {
    let exit = eleObj.parentNode;
    // console.log(exit);
    exit.style.display = "none";
    let right = document.querySelector(".h-right");
    // console.log(right);
    right.style.display = "block";
    localStorage.removeItem("userId");
  }


//   删除指定商品
  delChecked(){
    //   获取所有的单选
    let checkOnes=all('.check-one');
    checkOnes.forEach(ele=>{
        if(ele.checked){
            // console.log(ele);
            let gId=ele.getAttribute('gId');
            // console.log(gId);
            Cart.del(ele,gId);
        }
    })
    
  }

//   商品删除
    static del(eleObj,gId){
       let userId=localStorage.getItem('userId');
       if(userId){
            Cart.delDataBase(userId,gId);
       }else{
            Cart.delLocal(gId);
       }
       eleObj.parentNode.parentNode.remove();
       all('.check-all')[0].checked=false;
       all('.check-all')[1].checked=false;
       Cart.updatePriceCount();
    }

    // 数据库删除
    static delDataBase(userId,gId){
        Ajax.get('./server/cart.php',{fn:'delete',userId:userId,gId:gId}).then(res=>{
            alert('删除成功');
        })
    }
    //浏览器删除
    static delLocal(gId){
        let cartGoods=JSON.parse(localStorage.getItem('carts'));
            // 删除指定属性
            delete cartGoods[gId];
            localStorage.setItem('carts',JSON.stringify(cartGoods));
    }

    // 总价
    static updatePriceCount(){
        // 获取页面
        let checkOne=all('.check-one');

        let count=0;
        let zj=0;
        checkOne.forEach(ele=>{
            if(ele.checked){
                // 拿到tr
                let trObj=ele.parentNode.parentNode;
                // console.log(trObj);
                let tmpCount=trObj.getElementsByClassName('val')[0].value;
                // console.log(tmpCount);
                let tmpPrice=trObj.getElementsByClassName('money')[0].innerHTML;
                // console.log(tmpPrice);

                count=tmpCount-0+count;
                zj=tmpPrice-0+zj;
            }
        })

        $_('#selectedTotal').innerHTML=count;
        $_('#priceTotal').innerHTML=zj.toFixed(2);
    }

    // 商品删除

   // 数量的增加
   static add(eleObj,gId){
    // 获取input数据
    let inputVal=eleObj.previousElementSibling;
    inputVal.value=inputVal.value-0+1;//不能在上面直接-0,会有干扰
    if(inputVal.value>5){
        inputVal.value=5;
    }
    // console.log(inputVal);
    // 根据当前登录状态进行修改
    if(localStorage.getItem('userId')){
        Cart.updateDataBase(gId,inputVal.value);
    }else{
        Cart.updateLocal(gId,inputVal.value);
    }
    // 实现小计
    // 获取单价
    let price=eleObj.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML;
    // console.log(price);
    eleObj.parentNode.parentNode.nextElementSibling.innerHTML=(price*inputVal.value).toFixed(2);

    Cart.updatePriceCount();
}

// 数量的减少
static reduce(eleObj,gId){
    // 获取input数据
    let inputVal=eleObj.nextElementSibling;
    inputVal.value=inputVal.value-1;//不能在上面直接-0,会有干扰
    if(inputVal.value<1){
        inputVal.value=1;
    }
    // console.log(inputVal);
    // 根据当前登录状态进行修改
    if(localStorage.getItem('userId')){
        Cart.updateDataBase(gId,inputVal.value);
    }else{
        Cart.updateLocal(gId,inputVal.value);
    }
    // 实现小计
    // 获取单价
    let price=eleObj.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML;
    // console.log(price);
    eleObj.parentNode.parentNode.nextElementSibling.innerHTML=(price*inputVal.value).toFixed(2);
    Cart.updatePriceCount();
}


// 数据库修改
static updateDataBase(gId,gNum){
    let userId=localStorage.getItem('userId');
    Ajax.get('./server/cart.php',{fn:'update',userId:userId,gId:gId,gNum:gNum}).then(res=>{
        console.log('修改成功');
    })
}

// 修改浏览器数据
static updateLocal(gId,gNum){
    let cartGoods=JSON.parse(localStorage.getItem('carts'));
    cartGoods[gId]=gNum;
    // 设置
    localStorage.setItem('carts',JSON.stringify(cartGoods));
}

//   实现全选
  checkAll(){
    //   console.log(11111);
    //   console.log(this);
      let state=this.checked;
      all('.check-all')[this.getAttribute('all-key')].checked=state;
  
    // 实现单选
    let singleCheck=all('.check-one');
    // console.log(singleCheck);
    singleCheck.forEach(ele=>{
        ele.checked=state;
    })
    Cart.updatePriceCount();
    }

    // 单选的实现
    static checkOne(eleObj){
        //  获取状态
        let state=eleObj.checked;

        if(!state){
            all('.check-all')[0].checked=false;
            all('.check-all')[1].checked=false;
        }else{
            // 获取所有的单选
            let checkOnes=all('.check-one');
            let length=checkOnes.length;

            let checkCount=0;
            checkOnes.forEach(ele=>{
                ele.checked && checkCount++;
            })

            if(checkCount==length){
                all('.check-all')[0].checked=true;
                all('.check-all')[1].checked=true;
            }
        }
        Cart.updatePriceCount();
    }

   
}
new Cart();
