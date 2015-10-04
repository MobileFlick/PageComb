function test()
{
	alert("This is home controller");
}

$('#btnCalc').click(function () {
	var a = parseInt($('#txtA').val());
	var b = parseInt($('#txtB').val());
	alert(a + b);
});