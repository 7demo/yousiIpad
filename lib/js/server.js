//var serverip = "http://218.242.217.210:9055";
var serverip = "http://172.16.3.141";
var serverpic = serverip + "/Public";


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
 
// 调用方法

function kset( key , value )
{
    window.localStorage.setItem( key , value );
}

function kget( key  )
{
    return window.localStorage.getItem( key );
}

function kremove( key )
{
    window.localStorage.removeItem( key );
}

function clealAllKey(){
    window.localStorage.clear();
}

function iosalert(value,callBack,title,btnName)
{
    navigator.notification.alert(
        value,                  // 显示信息
        callBack,         // 警告被忽视的回调函数
        title,                  // 标题
        btnName                 // 按钮名称
    );
}


function hideKeyboard(){
    console.log("关闭键盘");
    cordova.exec("ChildBrowserCommand.hideKeyboard", "隐藏键盘");
}

function checkout(key,val){
    var info = {
        phone:{
            0:"手机号码格式不正确",
            1:"请输入手机号码"
        },
        name:{
            0:"请输入6~20为字母或数字"
        },
        email:{
            0:"请输入邮箱",
            1:"邮箱格式不正确"
        },
        pwd:{
            0:"密码不能为空",
            1:"密码不能包含特殊字符",
            2:"确认密码与密码不一致，请重新输入"
        },
        realname:{
            0:" 真实姓名不能为空",
            1:"请输入中文"
        },
        empty:"验证码不能为空"
    }
    var regEx = {
        phone:/^((\(\d{2,3}\))|(\d{3}\-))?1[358]\d{9}$/,
        name: /^[A-Za-z0-9]{6,20}$/,
        realname: /^[\u4e00-\u9fa5]+$/,
        idcard: /(^[0-9]{17}[0-9xX]$)|(^[0-9]{15}$)/,
        email: /^[a-z0-9]([a-z0-9]*[-_\.]?[a-z0-9]+)*@([a-z0-9]+(-?[a-z0-9]+)?)(\.[a-z0-9]+(-?[a-z0-9]+))*[\.][a-z]{2,4}$/i,
        password: /[\\.(!@#$%&`:;'")]/           
    }
    var messageout = function(desc,index){
        alert(desc);
        // $('#registerVerify').siblings('img').click();
        // $('#restWrap .registerInfor img').css('display','inline');
        // $('#restWrap .registerInfor p').text(desc);
        // $('#registerInforError').siblings('img').show();
        // $('#registerform .registerInput').eq(index).css('border-color','#AF0202');
    }
    if(key==""){
        return "检验失败";
    }
    switch(key){
        case "realname":
            if(val[0]==""){
                messageout(info[key][0],3);
                return false;
            }else if(regEx.name.test(val[0])){
                messageout(info[key][1],3);      
                return false;
            }else{
                return true;
            }
            break;
        case "email":
            if(val[0]==""){
                messageout(info[key][0],0);
                return false;
            }else if(!regEx.email.test(val[0])){
                messageout(info[key][1],0);
                return false;
            }else{
                return true;
            }
            break;
        case "pwd":
            if(val[0]==""){
                messageout(info[key][0],1);
                return false;
            }else if(regEx.password.test(val[0])){
                messageout(info[key][1],1);
                return false;
            }else{
                return true;
            }
            break;
        case "verify":
            if(val[0]==""){
                messageout(info['empty'],3);
                return false;
            }else{
                return true;
            }
            break;
        case "phone":
            if(val[0]==""){
                messageout(info[key][1],0);
                return false;
            }else if(!regEx.phone.test(val[0])){
                messageout(info[key][0],0);      
                return false;
            }else{
                return true;
            }
            break;
                    
    }
}


