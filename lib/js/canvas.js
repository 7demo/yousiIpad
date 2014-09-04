var thisaction = [];//贝塞尔数组记录
var isonclass = 0; //是否在上课
var drawFlag = false;
var drawStartPoint = [];
var pagenum = 0;
var pagelength = 0;

//增加画布
function addPage(){
    pagelength += 1;
    pagenum = pagelength;
    //增加新DIV框架
    $('#canvas').append('<div id = "page'+pagenum+'" style="width:100%;height: 100%"><canvas id="page'+pagenum+'paper" width="1608px" height="1396px" class="pagebg pagepaper"></canvas><canvas id="page'+pagenum+'down" width="1608px" height="1396px" class="pagedown" ></canvas><canvas id="page'+pagenum+'write" width="1608px" height="1396px" class="pagewrite"></canvas></div>');
    //设定画板的大小
    // changeCanvasDiv();
    showPage(pagenum);
    //显示新DIV框架
};

addPage();

function showPage(page){
    for(var i=1;i<=pagelength;i++){
        $('#page'+i).hide();
    }
    $('#page'+page).show();
    pagenum = page;
}


// /去除字符串前后空格
function trim(str){
    str = str.replace(/^(\s|\u00A0)+/,'');
    for(var i=str.length-1; i>=0; i--){
        if(/\S/.test(str.charAt(i))){
            str = str.substring(0, i+1);
            break;
        }
    }
    return str;
}

//图片是否移动
function dragPicFunc(flag){
    for(var i=0;i<shapesArray.length;i++){
        var shape = shapesArray[i];
        for(var k=0;k<shape.length;k++){
            if(shape[k].className=='Image'){
                var draggable = shape[k].draggable();
                shape[k].draggable(flag);
            }
        };
        layerArry[i].draw();
    }
}


//config
var httpline = 'http://172.16.3.141';
//进入不同的聊天房间

var room = io.connect(httpline+':3000/room');
getRoomId = GetQueryString("roomid")

//刷新用户列表
room.on('fresh shtudent list msg',function(data){
    addStudent(data.UpStudent,null);
    addAudit(data.DownStudent,null);
});
room.on('fresh shtudent list other msg',function(data){
    addStudent(data.UpStudent,null);
    addAudit(data.DownStudent,null);
});

//进行加入房间的判定
room.on('connect',function() {
    room.emit('student join room',{roomID:getRoomId,user:encodeURI('大头')});
}) 




//增加上课学生列表
function addStudent(stuArray){
    $('#onStudent ul').html('');
    if(!stuArray) return;
    console.log(stuArray,2)
    stuArray = eval('('+ stuArray +')');
    if(stuArray.length!=0){
        for(var i=0;i<stuArray.length;i++){
            var studentName = decodeURI(stuArray[i].sname);
            var li = $('<li></li>');
            li.attr('class','fn-clear');
            li.html('<div class="classroomStudentName fn-left">'+studentName+'</div><div class="classroomStudentStatus fn-right"><i class="classroomIconCamera1"></i><i class="classroomIconAudio1"></i><i class="classroomIconWrite1"></i></div>');
            $('#onStudent ul').append(li);
        };
    }
}

//增加旁听列表
function addAudit(stuArray){
    
    $('#offStudent ul').html('');
    if(!stuArray) return;
    console.log(stuArray,1)
    stuArray = eval('('+ stuArray +')');
    if(stuArray.length){
        for(var i=0;i<stuArray.length;i++){
            
            var studentName = decodeURI(stuArray[i].sname);
            var li = $('<li></li>');
            li.attr('class','fn-clear');
            li.html('<div class="classroomStudentName fn-left">'+studentName+'</div><div class="classroomStudentStatus fn-right"><i class="classroomIconCamera1"></i><i class="classroomIconAudio1"></i><i class="classroomIconWrite1"></i></div>');
            $('#offStudent ul').append(li);
        };
    }
}


//通知自己是房间的老师还学生
room.on('permission',function(data){
    console.log('欢迎来到'+decodeURI(data.roomName)+'教室');
    console.log(data)
    $('.nav').text(decodeURI(data.roomName)+'的教室');
    // var _arr = eval('('+ data.students +')')
    addAudit(data.upBlock);
});

//通知有人进来了 -----旁听
room.on('rooms other perple',function(data){
   addAudit(data.downBlock);
   console.log('有人进来了');
});

//解散房间
room.on('disslove room',function(){
    console.log('房间已解散，请离开');
})

//更新房间学生列表-----旁听
room.on('update room students',function(data){
//    addAudit(data)
console.log(data);
    addAudit(data.downBlock,data.upBlock);
});

//答疑
$('#answerBtn').click(function(){
    $('#answerBlockWrap').show();
});

var uploadFlag = true;
//上传状态初始化
function uploadStautInit(){
    $('.uploadTips').text('');
    $('.progress').css('width',0);
    $('.answerBlockName').text('为选择文件');
}



//更新画布页面
function updatePage(){
    var curNums = $('.mainTitle li').length;
    for(var m=0;m<curNums;m++){
        $('.mainTitle li').eq(m).html('<span>×</span>'+'Page'+(m+1))
    }
}


//
//
//********聊天
//
//
var curUser = '哈哈';


$(document).keydown(function(e){
	if(e.keyCode==13){
		$('#chatBtn').click();
	}
});

//
//
// +++++++++画画操作
//
//


function changeCanvasDiv(){}




// //作用
// function dragLi(){
//     var dragItems = document.querySelectorAll('[draggable=true]');

//     for (var i = 0; i < dragItems.length; i++) {
//         dragItems[i].addEventListener('dragstart', function (event) {
//             event.dataTransfer.setData('Text', this.id);
//             //      用于
//         });
//     }
// }


//上传
$('.classroomStudentBtn i').click(function(){
    $('.classroomUpload').show();
});
$('.classroomUploadInput button').click(function(){
    $('#uploadify').click();
});

$('.classroomUploadCancel').click(function(){
    $('.classroomUpload').hide();
    $('.answerBlockName').text('未选择文件');
    $('.classroomUploadProgress i').css('width',0);
    $('.uploadTips').text('');
});

$('#uploadify').fileupload({
    singleFileUploads: true,
    url: httpline+':3000/answerUpload',
    dataType: "json",
    limitConcurrentUploads: 1,
    maxNumberOfFiles: 1,
    fileTypeExts: '*.gif; *.jpg; *.png; *.pdf',
    progressInterval: 100,
    change: function (e, data) {
        $.each(data.files, function (index, file) {
            $('.answerBlockName').text(file.name);
            var _reg = /(gif|jpe?g|png|pdf)$/;
            if(!_reg.test(file.type)){
                uploadFlag = false;
                $('.uploadTips').text('文件格式不对，请重新选择');
            }else if(5242880<file.size){
                uploadFlag = false;
                $('.uploadTips').text('文件超过限制大小，请重新选择');
            }else{
                uploadFlag = true;
                $('.uploadTips').text('');
            };
        });
    },
    add: function (e, data) {
         if(uploadFlag){
             data.submit();
         }
    },
    done: function (e, data) {
         //更新学生列表
         room.emit('upload file list',{type:data.result.type,url:data.result.url,name:encodeURI(data.result.name),user:encodeURI("大头"),roomId:getRoomId});
         room.emit('reload list',null);

         $('.classroomUploadCancel').click();
    },
    progress: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('.classroomUploadProgress i').css('width',progress+'%');
    }
})



//鼠标位置
room.on('mouse location msg',function(data){
    var canvasWidth = $(window).width();
    var canvasHeight = $(window).height();
    var x= Math.floor((data.data)[0])+180;
    var y= Math.floor((data.data)[1])+60;
	$('#cursor').show();
	$('#cursor').css({'left':x,'top':y+10});
});

//移动操作
room.on('draw type move msg',function(data){
    paramter.type = 'move';
    cursor = 'move';

    $('.canvasTool li').removeClass('active');
    $('#drawTypeMove').addClass('active');
});

//选择划线
room.on('draw type line msg',function(data){
    console.log(1);
    paramter.type = 'line';
    cursor = 'line';
    $('.canvasTool li').removeClass('active');
    $('#drawTypeLine').addClass('active');
});

//选择橡皮擦

room.on('draw type earser msg',function(data){
    paramter.type = 'earser';
    cursor = 'earser';
    $('.canvasTool li').removeClass('active');
    $('#drawTypeEarser').addClass('active');
});

//进行形状操作
room.on('draw type shape msg',function(data){
    if($('#shapeCtn').is(':visible')==true){
        $('#shapeCtn').hide();
    }else{
        paramter.type = 'shape';
        cursor = 'shape';
        $('#shapeCtn').show();
    }
});

//形状内容操作
room.on('draw type shape ctn msg',function(data){
    paramter.type = data.data;
    cursor = data.data;

    $('.canvasTool li').removeClass('active');
    $('#drawTypeShape').addClass('active');

    $('#shapeCtn').hide();
});


//点击进行颜色操作 线
room.on('draw type color msg',function(){
    if($('#colorCtn').is(':visible')==true){
        $('#colorCtn').hide();
    }else{
        $('#colorCtn').show();
    }
});

//颜色选择操作  线
room.on('draw line color msg',function(data){
    $('#colorCtn').hide();
    var liList = $('#colorCtn li');
    for(var i=0;i<liList.length;i++){
        if(liList.eq(i).attr('type')==data.color){
            $('#drawTypeColor>img').attr('src',liList.eq(i).attr('sourceimg'));
        }
    };
    paramter.lineColor = data.color;
});

//出现上传框
room.on('show upload file msg',function(){
    $('#uploadCtn').show();
    $('.canvasTool li').removeClass('active');
    $('#drawTypeUpload').addClass('active');
    cursor='upload';
    paramter.type='upload';
});


//右边学生和作业切换
room.on('rightRitle slide msg',function(data){
    if(data.type=='studentList'){
        $('.rightRitle span').eq(0).addClass('active').siblings().removeClass('active');
        $('#studentList').show();
        $('#courseware').hide();
    }else if(data.type=='courseware'){
        $('.rightRitle span').eq(1).addClass('active').siblings().removeClass('active');
        $('#studentList').hide();
        $('#courseware').show();
    }
});
//
////画线样式按钮
room.on('draw style btn msg',function(index){
	$('#drawType>button').eq(index.index).addClass('active').siblings('button').removeClass('active');
	if(index.index===2){
		$('#shapeClassfy').show();
	}else{
		$('#shapeClassfy').hide();
	}
	cursor = $('#drawType>button').eq(index.index).attr('type');
	paramter.type = $('#drawType>button').eq(index.index).attr('type');
});
room.on('draw shape style btn msg',function(index){
	$('#shapeClassfy').hide();
	paramter.type = $('#shapeClassfy>button').eq(index.index).attr('type');

});
//
////刷新学生列表
room.on('reload list msg',function(data){
    console.log(21,data)
    addAudit(data.downBlock,null);
    addStudent(data.upBlock,null);
});

//
////画线
room.on('draw line msg',function(para){
    paramter['point']=(para.para);
	// paramter['point'][0] = (para.para)[0];
	// paramter['point'][1] = (para.para)[1];
	// paramter['point'][2] = (para.para)[2];
	// paramter['point'][3] = (para.para)[3];
    var thispoint = [(para.para)[0],(para.para)[1]];
    thisaction.push(thispoint);
    ysDraw(paramter);
});


//填充色
room.on('draw color msg',function(data){
	$('#drawColor>p>span')[0].style.background=data.color;
	paramter.fillColor = data.color!='white'?data.color:null;
});

//线的宽度
room.on('draw line width msg',function(data){
    if(data.value==0){
        paramter.lineWidth = 1;
        $('#drawTypeLineFlag').attr('src','images/pencilSmall.png');
    }else if(data.value==1){
        paramter.lineWidth =3;
        $('#drawTypeLineFlag').attr('src','images/pencilMid.png');
    }else if(data.value==2){
        paramter.lineWidth = 6;
        $('#drawTypeLineFlag').attr('src','images/pencilBig.png');
    }
});

//线的样式
room.on('draw line style msg',function(data){
	if(data.index===0){
		paramter.lineStyle = [0,0];
	}else{
		paramter.lineStyle = [10,10];
	}
	console.log(data.index);
	// $('#drawLineStyle input').attr('checked','false');
	// $('#drawLineStyle input').eq(data.index).attr('checked','checked');
	$('#drawLineStyle input').eq(data.index).click();
});

//鼠标弹起
room.on('mouse up msg',function(){
	drawFlag = false;
	strightFlag = false;
    inputAction(paramter);
    thisaction =[];
	drawStartPoint=[];
	paramter.point=[];
});

//选择写字
room.on('chose draw txt msg',function(){
	cursor = 'text';

    $('.canvasTool li').removeClass('active');
    $('#drawTypeText').addClass('active');

	paramter.type=null;
});

//写字框弹出
room.on('text input show msg',function(data){
	txtStartPoint[0]=(data.pos)[0];
	txtStartPoint[1]=(data.pos)[1];
	$('#fillTxtdiv').show();
	//$('#fillTxtdiv').focus();
});

//写字框大小改变
room.on('text input change msg',function(data){
	$('#fillTxtdiv,#fillTxt').css({'top':txtStartPoint[1]+70,'left':txtStartPoint[0]+185,'width':(data.pos)[0]-txtStartPoint[0],'height':(data.pos)[1]-txtStartPoint[1]});
});

//文字框内容同步
room.on('text input ctn msg',function(data){
	$('#fillTxt').val(decodeURI(data.ctn));
});

//写字
room.on('draw txt msg',function(){
    filltextok();
    paramter.point=[];
    paramter.ctn='';
});

function filltextok(){
    var val = $('#fillTxt').val();
    if(val.length===0){
        $('#fillTxt').val('');
        $('#fillTxtdiv').hide();
    }else{
        paramter.type='text';
        paramter.ctn = val;
        paramter.point=[txtStartPoint[0]-236,txtStartPoint[1]-25];
        ysDraw(paramter);
        $('#fillTxt').val('');
        $('#fillTxtdiv').hide();

    }
    if(cursor==='text'){
        txtInputFlag = false;
    }
}
//上传
//上传
room.on('upload file msg',function(data){
    paramter.type = 'upload';
    var imgPara = data.data
    var src = imgPara[0];
    src = src.substr(1);
    paramter.ctn = httpline+':3000'+src;
    paramter.point[0] = imgPara[1];
    paramter.point[1] = imgPara[2];
    ysDraw(paramter);
    paramter.type = null;
    paramter.ctn = null;

    $('#uploadCtn').hide();
});

//上传pdf
room.on('upload pdf msg',function(data){
	pdfUrl = data.url;
	$('#pdfWrap').show();
	pdfShow(pdfUrl);
});

//前翻pdf
room.on('pdf pre msg',function(){
	console.log('5555');
	nums--;
    pdfShow(pdfUrl);
});

//后翻pdf
room.on('pdf next msg',function(){
	nums++;
    pdfShow(pdfUrl);
});

//关闭pdf
room.on('pdf close msg',function(){
	$('#pdfWrap').hide();
});

//翻滚pdf
room.on('pdf scroll msg',function(data){
	console.log(';5');
	console.log(data);
	$('#pdfWrap').scrollTop(data.height);
});

//新建画布
room.on('create layer msg',function(){
    var liNums = $('.mainTitle li').length+1;
    $('.mainTitle li').removeClass('active');
    $('#createLayer').before('<li class="active"><span>×</span>'+'Page'+liNums+'</li>');
    addPage();
});

//翻页画布----后
room.on('next layer msg',function(){
	var curLayerIndex = null;
	for(var i=0;i<layerArry.length;i++){
		if(layerArry[i]==layer){
			console.log('hou'+i);
			if(i===layerArry.length-1) return;
			curLayerIndex = i+1 ;
		}
		layerArry[i].hide();
		layerArry[i].draw();
	}
	layer = layerArry[curLayerIndex];
	layerArry[curLayerIndex].show();
	layerArry[curLayerIndex].draw();
});

//翻页画布
room.on('pre layer msg',function(data){
    $('.mainTitle li').eq(data.index).addClass('active').siblings().removeClass('active');
    showPage(data.index+1);


    $(this).addClass('active').siblings().removeClass('active');
    var curLayerIndex = $('.mainTitle li').index($(this));

    showPage(curLayerIndex+1);
});

//删除画布
room.on('delete layer msg',function(data){
    var hitIndex = data.index;
    if(hitIndex==0){//
        alert('此页暂时无法删除');
    }else{
        $('.mainTitle li').eq(hitIndex).remove();
        $('.mainTitle li').eq(hitIndex-1).addClass('active').siblings().removeClass('active');
    };

    //删除对应画布的整个DIV
    if(hitIndex>0){
        $('#page'+(hitIndex+1)).remove();
        pagelength -= 1;
    }else{console.error('页面报错')};
    if((hitIndex+1)<$('.mainTitle li').length+1){
        console.log('进入c');
        for(var i=hitIndex;i<($('.mainTitle li').length+1);i++){
            console.log(i);
            console.log($('.mainTitle li').eq(i).html('<span>×</span>Page'+(i+1)));
            $('#page'+(i+1)).attr({id:'page'+i});
            $('#page'+(i+1)+'paper').attr({id:'page'+i+'paper'});
            $('#page'+(i+1)+'down').attr({id:'page'+i+'down'});
            $('#page'+(i+1)+'write').attr({id:'page'+i+'write'});
        }
    }

    //如果页面后边还有页面
    //pagenum = pagenum-1;
    //console.log(pagenum);
    showPage(hitIndex);
})