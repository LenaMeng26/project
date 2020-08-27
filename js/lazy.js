
window.onload = function () {
    let img = all("img");
    // 获取滚动条高度
    let scrollT =0;
    function lazy(img) {
    //   console.log(1111, img);
      // 获取可视高度
      let clientT = document.documentElement.clientHeight;
      // console.log(clientT);
       scrollT= document.documentElement.scrollTop;
      // console.log(scrollT);
      for (var i = 0; i < img.length; i++) {
        // console.log(44444);
        if (clientT + scrollT > img[i].offsetTop) {
          (function (i) {
            setTimeout(function () {
              // 不加立即执行函数i会等于9
              // 隐形加载图片或其他资源，
              //创建一个临时图片，这个图片在内存中不会到页面上去。实现隐形加载
              var temp = new Image();
              temp.src = img[i].getAttribute("data-src"); //只会请求一次
              // onload判断图片加载完毕，真是图片加载完毕，再赋值给dom节点
              temp.onload = function () {
                // 获取自定义属性data-src，用真图片替换假图片
                img[i].src = img[i].getAttribute("data-src");
              };
            }, 800);
          })(i);
        }
      }
    }
    // lazy(img);
    window.onscroll = function () {
    //  console.log(1111);
      let rightObj = document.querySelector("#rightNav");
      scrollT= document.documentElement.scrollTop;
      //console.log(toTop);
      if (scrollT >0) {
        $(rightObj).fadeIn(400);
      } else {
        $(rightObj).fadeOut(400);
      }
     
      lazy(img);
    };
  };