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

function getIndexTeacherPic(){
    $.get(serverip + "/Ipadinterface/getIndexhead",function(data,status){
       
       for ( var i in data.data ) {
          html = '';
          html = html + '<li>';
          html = html + '<a href=\"#\">';
          html = html + '<img src=\"'+ serverpic + data.data[i].t_picture1 +'\" >';
          html = html + '</a>';
          html = html + '<img class=\"showPic\" src=\"'+ serverpic + data.data[i].t_picture2 +'\">';
          html = html + '<div class=\'picCtn fn-clear\'>';
          // html = html + '<a href=\"/Account/teacherShow/{$t.t_id}\" target=\"_blank\">';
          html = html + '<a href=\"\" target=\"_blank\">';
          html = html + '<h2 class=\"fn-left\">'+ data.data[i].t_realname +'</h2>';
          html = html + '<p class=\"fn-right fn-clear\"><span>'+ data.data[i].t_school +'</span></p>';
          html = html + '</a>';
          html = html + '</div>';
          html = html + '</li>';

          $(".indexTeacherIcon").append(html);
          $('footer').setFooterPosition(); 

       };
       //图片外围li的高度设定
       var  picTxtSlide = null;
        function setPicWidth(){
                var width = $('#pic li').width();
                $('#pic li').css('height',width);
                var picTxtHeight = $('#pic li div').height();
                var picTxtPadding = $('#pic li div').css('paddingTop');
                picTxtPadding = picTxtPadding.slice(0,picTxtPadding.length-2);
                picTxtSlide = -(picTxtHeight+picTxtPadding*2);
                $('#pic li div.picCtn').css('bottom',-(picTxtHeight+picTxtPadding*2));;
            }
            setPicWidth();
            $(window).resize(function(){
                setPicWidth();
            });
                   //渐隐
        $('#pic li').children('.showPic').css({'top':'0','opacity':'0'});
        $('#pic li').mouseenter(function(){
            $(this).children('.showPic').stop(false,true).animate({'top':'0','opacity':'1'},300);
            picTxtBottom = $(this).children('div').css('bottom');
            $(this).children('div').stop(false,true).animate({'bottom':0},300);
        })
        $('#pic li').mouseleave(function(){
            $(this).children('.showPic').stop(false,true).animate({'top':'0','opacity':'0'},300);
            $(this).children('.picCtn').stop(false,true).animate({'bottom':picTxtSlide},300)
        });
    });
}


