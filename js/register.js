class Register{
     // 状态的保存
    static userState=false;
    static psdState=false;
    static ckPsdState=false;
    //input框的值
    static uVal='';
    static pVal='';
    static rpVal='';


    constructor(){
       // 绑定事件
        $_('.userPhone').addEventListener('blur',this.userCheck);
        $_('.userPsd').addEventListener('blur',this.checkPsd);
        $_('.ckUserPsd').addEventListener('blur',this.checkRepeat);
        $_('.reg').addEventListener('click',this.registerData);
        
    }
    
    // 用户名
    userCheck(){
        // console.log(this.value);
        Register.uVal=this.value;
        // console.log(Register.uVal);
        var reg=/^[1]{1}[3-9]{1}\d{9}$/;
        if(reg.test(Register.uVal)){
            this.nextElementSibling.innerHTML='用户名格式正确';
            Register.userState=true;
        }else{
            this.nextElementSibling.innerHTML='  用户名格式不正确';
            Register.userState=false;
        }
       
    }
    // 用户密码
    checkPsd(){
         Register.pVal=this.value;
        // console.log(1111);
        if(Register.pVal.length>=8&&Register.pVal.length<=20){
            // console.log(111);
            var reg=/\d+[a-zA-Z]+[@,./!#&]+/;
            if(reg.test(Register.pVal)){
                this.nextElementSibling.innerHTML=' 密码格式正确';
                Register.psdState=true;
            }else{
                this.nextElementSibling.innerHTML=' 密码格式不正确';
                Register.psdState=false;
            }
        }else{
            this.nextElementSibling.innerHTML=' 密码长度不足';
            Register.psdState=false;
        }
        
    }

    // 验证密码
    checkRepeat(){
        Register.rpVal=this.value;
    //    console.log(pVal);
        if(Register.pVal==Register.pVal&&Register.pVal!=''){
            this.nextElementSibling.innerHTML=' 两次密码一致';
            Register.ckPsdState=true;
        }else{
            this.nextElementSibling.innerHTML=' 两次密码不一致';
            Register.ckPsdState=false;
        }
        
    }

    // 提交注册
    registerData(){ 
        if(Register.userState&&Register.psdState&&Register.ckPsdState){
            console.log('注册成功');
            let userPhone=Register.uVal;
            let userPsd=Register.pVal;
            Ajax.post('./server/register.php?fn=add',{userPhone:userPhone,userPsd:userPsd}).then(res=>{
                alert('添加成功');
            })
        }else{
            console.log('注册失败');
        }
    }

}
new Register;