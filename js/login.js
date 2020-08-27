class Login{
    static userState=false;
    static psdState=false;

    //  input框的值
    static uVal='';
    static pVal='';
    constructor(){
      
        // 获取节点,绑定事件
        $_('.userPhone').addEventListener('blur',this.userCheck);
        $_('.userPsd').addEventListener('blur',this.checkPsd);
        $_('.login-a').addEventListener('click',this.login);
    }
      // 用户名
      userCheck(){
        // console.log(this.value);
        Login.uVal=this.value;
        // console.log(Register.uVal);
        var reg=/^[1]{1}[3-9]{1}\d{9}$/;
        if(reg.test(Login.uVal)){
            this.nextElementSibling.innerHTML='用户名格式正确';
            Login.userState=true;
        }else{
            this.nextElementSibling.innerHTML='  用户名格式不正确';
            Login.userState=false;
        }
       
    }
    // 用户密码
    checkPsd(){
         Login.pVal=this.value;
        // console.log(1111);
        if(Login.pVal.length>=8&&Login.pVal.length<=20){
            // console.log(111);
            var reg=/\d+[a-zA-Z]+[@,./!#&]+/;
            if(reg.test(Login.pVal)){
                this.nextElementSibling.innerHTML=' 密码格式正确';
                Login.psdState=true;
            }else{
                this.nextElementSibling.innerHTML=' 密码格式不正确';
                Login.psdState=false;
            }
        }else{
            this.nextElementSibling.innerHTML=' 密码长度不足';
            Login.psdState=false;
        }
        
    }


    login(){
        if(Login.userState&&Login.psdState){
        //    / console.log('格式正确');
             // console.log(111);
        var uVal=$_('.userPhone').value;
        var pVal=$_('.userPsd').value;
        //  console.log(uVal,pVal);
        // localStorage.setItem('userId',1);
        Ajax.get('./server/register.php',{fn:'lit'}).then(res=>{
            //  console.log(111);
            let {stateCode,data}=JSON.parse(res);
            if(stateCode==200){
                data.forEach(ele=>{
                    // console.log(ele.userPhone,ele.userPsd);
                    if(uVal==ele.userPhone&&pVal==ele.userPsd){
                        localStorage.setItem('userId',ele.userId);
                        alert('登陆成功')
                        location.href='http://127.0.0.1/project/store.html';
                    }else if(uVal!=ele.userPhone){
                        alert('该会员不存在,请注册!')
                        location.href='http://127.0.0.1/project/register.html';  
                    }else if(pVal!=ele.userPsd){
                        alert('密码错误')
                    }
                });
            }
        })
           
        }
    }
}
new Login;