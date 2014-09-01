$('.teacherLi li').tap(function(){
	$('.teacherInfo').animate({
		right:0
	},600,'ease-out')
	return false;
});
$('.teacherInfo').swipeRight(function(){
	$('.teacherInfo').animate({
		right:'-1140px'
	},600,'ease-out')
	return false;
});