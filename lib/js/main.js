$('.teacherLi li').tap(function(){
	$('.teacherInfo').animate({
		right:0
	},300,'ease-out')
	return false;
});
$('.teacherInfo').swipeRight(function(){
	$('.teacherInfo').animate({
		right:'-1140px'
	},300,'ease-out')
	return false;
});