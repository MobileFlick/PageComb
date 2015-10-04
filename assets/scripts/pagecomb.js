var __performance;
var dispose = {};
var webRootPath;
var __init = false;
var __currentControllerScript;

function Back()
{
	if (history.state == null)
		return;
	history.go(-1);
	PopView(document.location);
	if (history.state)
		__performance = history.state.performance;
	return false;
}

function Startup()
{
	touch.on('body', 'swiperight', function () {
		Back();
	});
	
	
	webRootPath = document.location.toString();
	webRootPath = webRootPath.substr(0, webRootPath.length - 13);
	
	$('#pagecomb-pool').unbind().load(function () {
		console.log($('#pagecomb-pool').contents().find('body').html());
		var viewStart = JSON.parse($('#pagecomb-pool').contents().find('body').html());
		RedirectTo(ParseUrl(viewStart.home), 'no');
		__init = true;
	});
	$('#pagecomb-pool').attr('src', './views/_viewStart.json.html');
}

function ParseUrl(url)
{
	if (url[0] == '~')
		url = webRootPath + '/views' + url.substr(1, url.length - 1);
	else if (url[0] == '%')
		url = webRootPath + '/controllers' + url.substr(1, url.length - 1);
	else if (url[0] == '@')
		url = webRootPath + url.substr(1, url.length - 1);
	return url.toString();
}

function LoadStyle(url, alias)
{
	if (typeof(alias) == 'undefined')
		alias = url;
	$('body').append('<link href="' + ParseUrl(url) + '" rel="stylesheet" id="style_' + alias + '" />');
}

function UnloadStyle(identifier)
{
	$('#style_' + identifier).remove();
	$('script[src="' + identifier + '"]').remove();
}

function LoadScript(url, alias)
{
	if (typeof(alias) == 'undefined')
		alias = url;
	if ($('script[src="' + ParseUrl(url) + '"]').length > 0)
	{
		console.warn(url + ' has been already loaded.');
		return;
	}
	$('body').append('<script src="' + ParseUrl(url) + '" id="script_' + alias + '"></script>');
}

function UnloadScript(identifier)
{
	try {
		dispose[identifier]();
	} catch (err) {
	}
	$('script[src="' + ParseUrl(identifier) + '"]').remove();
	try { $('#script_' + identifier).remove(); } catch (err) { }
}

$(document).ready(function () {
	$(document).unbind('click').on('click', function (e) {
		if ($(e.target).is('a') && $(e.target).attr('href').toString().indexOf('javascript') >= 0)
			return true;
		if ($(e.target).is('a') && $(e.target).attr('href')[0] != '#') {
			RedirectTo($(e.target).attr('href'), $(e.target).attr('data-performance'));
			return false;
		}
	});
	window.onpopstate = function (e) {
		if (__init) {
			PopView(document.location);
			if (history.state)
				__performance = history.state.performance;
			return false;
		}
	};
});

function GetInversePerformance(performance)
{
	if (performance == 'slideLeft')
		return 'leaveRight';
	else if (performance == 'slideRight')
		return 'leaveLeft';
	else if (performance == 'slideUp')
		return 'leaveDown';
	else if (performance == 'slideDown')
		return 'leaveUp';
	else if (performance == 'leaveRight')
		return 'slideLeft';
	else if (performance == 'leaveLeft')
		return 'slideRight';
	else if (performance == 'leaveDown')
		return 'slideUp';
	else if (performance == 'leaveUp')
		return 'slideDown';
	else
		return performance;
}

function ConjectureControllerName(url)
{
	url = ParseUrl(url);
	var a = url.indexOf('views/');
	var b = url.substr(a + 6, url.length - a - 6);
	console.log(b);
	var c = b.indexOf('/');
	var d = b.substr(0, c);
	console.log(d);
	return d + 'Controller';
}

function PopView(url)
{
	if ($('.container').length <= 1) return;
	var old = $($('.container')[$('.container').length - 1]);
	var container = $($('.container')[$('.container').length - 2]);
	var performance = GetInversePerformance(__performance);
	if (performance == 'slideLeft')
		container.css('margin-left', $(window).width());
	else if (performance == 'slideRight')
		container.css('margin-left', -$(window).width());
	else if (performance == 'slideUp')
		container.css('margin-top', $(window).height());
	else if (performance == 'slideDown')
		container.css('margin-top', -$(window).height());
	else if (performance == 'leaveRight') {
		old.css('z-index', 999);
		old.css('margin-left', $(window).width());
	}
	else if (performance == 'leaveLeft') {
		old.css('z-index', 999);
		old.css('margin-left', -$(window).width());
	}
	else if (performance == 'leaveUp') {
		old.css('z-index', 999);
		old.css('margin-top', -$(window).height());
	}
	else if (performance == 'leaveDown') {
		old.css('z-index', 999);
		old.css('margin-top', $(window).height());
	}
	setTimeout(function () { 
		if (performance.indexOf('leave') >= 0)
			old.remove(); 
		container.removeClass('pagecomb-entering');
		
		if (__currentControllerScript)
			UnloadScript(__currentControllerScript);
		
		__currentControllerScript = '%/' + ConjectureControllerName(url) + '.js';
		LoadScript('%/' + ConjectureControllerName(url) + '.js');
	}, 450);
}

function RedirectTo(url, performance)
{
	url = ParseUrl(url);
	$('#pagecomb-pool').unbind().load(function () {
		if (typeof(performance) == 'undefined')
			performance = 'slideLeft';
		var tmp = $('#pagecomb-pool').contents().find('.container')[0];
		var container = $(tmp);
		var old = $('.container')[$('.container').length - 1];
		container.addClass('pagecomb-entering');
		if (performance == 'slideLeft')
			container.css('margin-left', $(window).width());
		else if (performance == 'slideRight')
			container.css('margin-left', -$(window).width());
		else if (performance == 'slideUp')
			container.css('margin-top', $(window).height());
		else if (performance == 'slideDown')
			container.css('margin-top', -$(window).height());
		container.appendTo('body');
		if (performance == 'leaveRight') {
			old.css('z-index', 999);
			old.css('margin-left', $(window).width());
		}
		else if (performance == 'leaveLeft') {
			old.css('z-index', 999);
			old.css('margin-left', -$(window).width());
		}
		else if (performance == 'leaveUp') {
			old.css('z-index', 999);
			old.css('margin-top', -$(window).height());
		}
		else if (performance == 'leaveDown') {
			old.css('z-index', 999);
			old.css('margin-top', $(window).height());
		}
		container.removeClass('pagecomb-entering');
		window.history.pushState({ url: url, performance: performance }, '', url);
		__performance = history.state.performance;
		setTimeout(function () { 
			container.css('margin-left', 0); 
			container.css('margin-top', 0); }, 150);
		setTimeout(function () { 
			if (performance.indexOf('leave') >= 0)
				old.remove(); 
			container.removeClass('pagecomb-entering');
			
			if (__currentControllerScript)
				UnloadScript(__currentControllerScript);
			
			__currentControllerScript = '%/' + ConjectureControllerName(url) + '.js';
			LoadScript('%/' + ConjectureControllerName(url) + '.js');
		}, 450);
	});
	$('#pagecomb-pool').attr('src', url);
}