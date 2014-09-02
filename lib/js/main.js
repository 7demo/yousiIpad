
$('.answerLi li').tap(function(){
	$('.teacherInfo').addClass('teacherStatusShow');
	return false;
});
$('.teacherInfo').swipeRight(function(){
	$('.teacherInfo').removeClass('teacherStatusShow');
	return false;
});
$('.acessNew').tap(function(){
	$('.accessCtn').addClass('accessCtnMove');
	return false;
});
$('.acessOld').tap(function(){
	$('.accessCtn').removeClass('accessCtnMove');
	return false;
});

