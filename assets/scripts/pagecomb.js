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

function OnPageLoading (url)
{
	var elem = $('.container[data-url="' + url +  '"] input[type="checkbox"]').elements;
	var init = new Switchery(elem);
	touch.on('.switchery-button', 'swiperight', function (e) {
		if ($(e.target).parents('.switchery').length > 0)
		{
			$(e.target).parents('.switchery').prev('input[type="checkbox"]').attr('checked', 'checked');
		}
	});
	touch.on('.switchery-button', 'swipeleft', function (e) {
		if ($(e.target).parents('.switchery').length > 0)
		{
			$(e.target).parents('.switchery').prev('input[type="checkbox"]').removeAttr('checked');
		}
	});
}

function Startup()
{
	touch.on('body', 'swiperight', function (e) {
		if ($(e.target).hasClass('navigator') || $(e.target).parents('.navigator').length > 0)
			return;
		Back();
	});
	
	
	webRootPath = document.location.toString();
	webRootPath = webRootPath.substr(0, webRootPath.length - 13);
	
	$('#pagecomb-pool').unbind().load(function () {
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
	$('body').append('<link href="' + ParseUrl(url) + '" rel="stylesheet" />');
}

function UnloadStyle(url)
{
	$('script[src="' + url + '"]').remove();
}

function LoadScript(url)
{
	if ($('script[src="' + ParseUrl(url) + '"]').length > 0)
	{
		console.warn(url + ' has been already loaded.');
		return;
	}
	$('body').append('<script src="' + ParseUrl(url) + '"></script>');
}

function UnloadScript(identifier)
{
	try {
		dispose[identifier]();
	} catch (err) {
	}
	$('script[src="' + ParseUrl(identifier) + '"]').remove();
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
	var c = b.indexOf('/');
	var d = b.substr(0, c);
	return d + 'Controller';
}

function PopView(url)
{
	if ($('.container').length <= 1) return;
	var old = $($('.container')[$('.container').length - 1]);
	var container = $($('.container')[$('.container').length - 2]);
	container.css('margin-left', 0);
	var performance = GetInversePerformance(__performance);
	if (performance == 'slideLeft') {
		container.css('margin-left', $(window).width());
		container.find('.navigator').addClass('alpha');
		container.find('.navigator .title').css('margin-left', $(window).width() / 4);
		container.find('.navigator .title').css('opacity', 0);
		container.find('.navigator .left').css('margin-left', $(window).width() / 4);
		container.find('.navigator .left').css('opacity', 0);
		container.find('.navigator .right').css('margin-left', $(window).width() / 4);
		container.find('.navigator .right').css('opacity', 0);
		
		old.find('.navigator .title').css('margin-left', -$(window).width() / 4);
		old.find('.navigator .title').css('opacity', 0);
		old.find('.navigator .left').css('margin-left', -$(window).width() / 4);
		old.find('.navigator .left').css('opacity', 0);
		old.find('.navigator .right').css('margin-left', -$(window).width() / 4);
		old.find('.navigator .right').css('opacity', 0);
	}
	else if (performance == 'slideRight') {
		container.css('margin-left', -$(window).width());
		container.find('.navigator .title').css('margin-left', -$(window).width() / 4);
		container.find('.navigator .title').css('opacity', 0);
		container.find('.navigator .left').css('margin-left', -$(window).width() / 4);
		container.find('.navigator .left').css('opacity', 0);
		container.find('.navigator .right').css('margin-left', -$(window).width() / 4);
		container.find('.navigator .right').css('opacity', 0);
		
		old.find('.navigator .title').css('margin-left', $(window).width() / 4);
		old.find('.navigator .title').css('opacity', 0);
		old.find('.navigator .left').css('margin-left', $(window).width() / 4);
		old.find('.navigator .left').css('opacity', 0);
		old.find('.navigator .right').css('margin-left', $(window).width() / 4);
		old.find('.navigator .right').css('opacity', 0);
	}
	else if (performance == 'slideUp') {
		container.css('margin-top', $(window).height());
		
		container.find('.navigator .title').css('opacity', 0);
		container.find('.navigator .left').css('opacity', 0);
		container.find('.navigator .right').css('opacity', 0);
		
		old.find('.navigator .title').css('opacity', 0);
		old.find('.navigator .left').css('opacity', 0);
		old.find('.navigator .right').css('opacity', 0);
	}
	else if (performance == 'slideDown') {
		container.css('margin-top', -$(window).height());
		
		container.find('.navigator .title').css('opacity', 0);
		container.find('.navigator .left').css('opacity', 0);
		container.find('.navigator .right').css('opacity', 0);
		
		old.find('.navigator .title').css('opacity', 0);
		old.find('.navigator .left').css('opacity', 0);
		old.find('.navigator .right').css('opacity', 0);
	}
	else if (performance == 'leaveRight') {
		old.css('z-index', 100);
		old.css('margin-left', $(window).width());
		container.find('.navigator .title').css('margin-left', -$(window).width() / 4);
		container.find('.navigator .title').css('opacity', 0);
		container.find('.navigator .left').css('margin-left', -$(window).width() / 4);
		container.find('.navigator .left').css('opacity', 0);
		container.find('.navigator .right').css('margin-left', -$(window).width() / 4);
		container.find('.navigator .right').css('opacity', 0);
		
		old.find('.navigator .title').css('margin-left', $(window).width() / 4);
		old.find('.navigator .title').css('opacity', 0);
		old.find('.navigator .left').css('margin-left', $(window).width() / 4);
		old.find('.navigator .left').css('opacity', 0);
		old.find('.navigator .right').css('margin-left', $(window).width() / 4);
		old.find('.navigator .right').css('opacity', 0);
	}
	else if (performance == 'leaveLeft') {
		old.css('z-index', 100);
		old.css('margin-left', -$(window).width());
		container.find('.navigator .title').css('margin-left', $(window).width() / 4);
		container.find('.navigator .title').css('opacity', 0);
		container.find('.navigator .left').css('margin-left', $(window).width() / 4);
		container.find('.navigator .left').css('opacity', 0);
		container.find('.navigator .right').css('margin-left', $(window).width() / 4);
		container.find('.navigator .right').css('opacity', 0);
		
		old.find('.navigator .title').css('margin-left', -$(window).width() / 4);
		old.find('.navigator .title').css('opacity', 0);
		old.find('.navigator .left').css('margin-left', -$(window).width() / 4);
		old.find('.navigator .left').css('opacity', 0);
		old.find('.navigator .right').css('margin-left', -$(window).width() / 4);
		old.find('.navigator .right').css('opacity', 0);
	}
	else if (performance == 'leaveUp') {
		old.css('z-index', 100);
		old.css('margin-top', -$(window).height());
		
		container.find('.navigator .title').css('opacity', 0);
		container.find('.navigator .left').css('opacity', 0);
		container.find('.navigator .right').css('opacity', 0);
		
		old.find('.navigator .title').css('opacity', 0);
		old.find('.navigator .left').css('opacity', 0);
		old.find('.navigator .right').css('opacity', 0);
	}
	else if (performance == 'leaveDown') {
		old.css('z-index', 100);
		old.css('margin-top', $(window).height());
		
		container.find('.navigator .title').css('opacity', 0);
		container.find('.navigator .left').css('opacity', 0);
		container.find('.navigator .right').css('opacity', 0);
		
		old.find('.navigator .title').css('opacity', 0);
		old.find('.navigator .left').css('opacity', 0);
		old.find('.navigator .right').css('opacity', 0);
	}
	setTimeout(function () { 
		container.css('margin-left', 0); 
		container.css('margin-top', 0); 
		
		container.find('.navigator .title').css('opacity', 1);
		container.find('.navigator .title').css('margin-left', 0);
		container.find('.navigator .left').css('opacity', 1);
		container.find('.navigator .left').css('margin-left', 0);
		container.find('.navigator .right').css('opacity', 1);
		container.find('.navigator .right').css('margin-left', 0);
	}, 150);
	setTimeout(function () { 
		if (performance.indexOf('leave') >= 0)
			old.remove(); 
		
		container.find('.navigator').removeClass('alpha');
		
		if (__currentControllerScript)
			UnloadScript(__currentControllerScript);
		
		__currentControllerScript = '%/' + ConjectureControllerName(url) + '.js';
		LoadScript('%/' + ConjectureControllerName(url) + '.js');
	}, 300);
}

function RedirectTo(url, performance)
{
	url = ParseUrl(url);
	$('#pagecomb-pool').unbind().load(function () {
		if (typeof(performance) == 'undefined')
			performance = 'slideLeft';
		var tmp = $('#pagecomb-pool').contents().find('.container')[0];
		var container = $(tmp);
		var old = $($('.container')[$('.container').length - 1]);
		container.attr('data-url', url);
		container.addClass('pagecomb-entering');
		var move = 0;
		if (performance == 'slideLeft') {
			container.css('margin-left', $(window).width());
			container.find('.navigator').addClass('alpha');
			container.find('.navigator .title').css('margin-left', $(window).width() / 4);
			container.find('.navigator .title').css('opacity', 0);
			container.find('.navigator .left').css('margin-left', $(window).width() / 4);
			container.find('.navigator .left').css('opacity', 0);
			container.find('.navigator .right').css('margin-left', $(window).width() / 4);
			container.find('.navigator .right').css('opacity', 0);
			
			move = -$(window).width() / 4;
			old.find('.navigator .title').css('margin-left', -$(window).width() / 4);
			old.find('.navigator .title').css('opacity', 0);
			old.find('.navigator .left').css('margin-left', -$(window).width() / 4);
			old.find('.navigator .left').css('opacity', 0);
			old.find('.navigator .right').css('margin-left', -$(window).width() / 4);
			old.find('.navigator .right').css('opacity', 0);
		}
		else if (performance == 'slideRight') {
			container.css('margin-left', -$(window).width());
			container.find('.navigator .title').css('margin-left', -$(window).width() / 4);
			container.find('.navigator .title').css('opacity', 0);
			container.find('.navigator .left').css('margin-left', -$(window).width() / 4);
			container.find('.navigator .left').css('opacity', 0);
			container.find('.navigator .right').css('margin-left', -$(window).width() / 4);
			container.find('.navigator .right').css('opacity', 0);
			
			move = $(window).width() / 4;
			old.find('.navigator .title').css('margin-left', $(window).width() / 4);
			old.find('.navigator .title').css('opacity', 0);
			old.find('.navigator .left').css('margin-left', $(window).width() / 4);
			old.find('.navigator .left').css('opacity', 0);
			old.find('.navigator .right').css('margin-left', $(window).width() / 4);
			old.find('.navigator .right').css('opacity', 0);
		}
		else if (performance == 'slideUp') {
			container.css('margin-top', $(window).height());
			
			container.find('.navigator .title').css('opacity', 0);
			container.find('.navigator .left').css('opacity', 0);
			container.find('.navigator .right').css('opacity', 0);
			
			old.find('.navigator .title').css('opacity', 0);
			old.find('.navigator .left').css('opacity', 0);
			old.find('.navigator .right').css('opacity', 0);
		}
		else if (performance == 'slideDown') {
			container.css('margin-top', -$(window).height());
			
			container.find('.navigator .title').css('opacity', 0);
			container.find('.navigator .left').css('opacity', 0);
			container.find('.navigator .right').css('opacity', 0);
			
			old.find('.navigator .title').css('opacity', 0);
			old.find('.navigator .left').css('opacity', 0);
			old.find('.navigator .right').css('opacity', 0);
		}
		container.appendTo('body');
		OnPageLoading(container.selector);
		if (performance == 'leaveRight') {
			old.css('z-index', 100);
			old.css('margin-left', $(window).width());
			container.find('.navigator .title').css('margin-left', -$(window).width() / 4);
			container.find('.navigator .title').css('opacity', 0);
			container.find('.navigator .left').css('margin-left', -$(window).width() / 4);
			container.find('.navigator .left').css('opacity', 0);
			container.find('.navigator .right').css('margin-left', -$(window).width() / 4);
			container.find('.navigator .right').css('opacity', 0);
			
			move = -$(window).width() / 4;
			old.css('margin-left', -$(window).width() / 4);
			old.find('.navigator .title').css('margin-left', $(window).width() / 4);
			old.find('.navigator .title').css('opacity', 0);
			old.find('.navigator .left').css('margin-left', $(window).width() / 4);
			old.find('.navigator .left').css('opacity', 0);
			old.find('.navigator .right').css('margin-left', $(window).width() / 4);
			old.find('.navigator .right').css('opacity', 0);
		}
		else if (performance == 'leaveLeft') {
			old.css('z-index', 100);
			old.css('margin-left', -$(window).width());
			container.find('.navigator .title').css('margin-left', $(window).width() / 4);
			container.find('.navigator .title').css('opacity', 0);
			container.find('.navigator .left').css('margin-left', $(window).width() / 4);
			container.find('.navigator .left').css('opacity', 0);
			container.find('.navigator .right').css('margin-left', $(window).width() / 4);
			container.find('.navigator .right').css('opacity', 0);
			
			move = $(window).width() / 4;
			old.find('.navigator .title').css('margin-left', -$(window).width() / 4);
			old.find('.navigator .title').css('opacity', 0);
			old.find('.navigator .left').css('margin-left', -$(window).width() / 4);
			old.find('.navigator .left').css('opacity', 0);
			old.find('.navigator .right').css('margin-left', -$(window).width() / 4);
			old.find('.navigator .right').css('opacity', 0);
		}
		else if (performance == 'leaveUp') {
			old.css('z-index', 100);
			old.css('margin-top', -$(window).height());
			
			container.find('.navigator .title').css('opacity', 0);
			container.find('.navigator .left').css('opacity', 0);
			container.find('.navigator .right').css('opacity', 0);
			
			old.find('.navigator .title').css('opacity', 0);
			old.find('.navigator .left').css('opacity', 0);
			old.find('.navigator .right').css('opacity', 0);
		}
		else if (performance == 'leaveDown') {
			old.css('z-index', 100);
			old.css('margin-top', $(window).height());
			
			container.find('.navigator .title').css('opacity', 0);
			container.find('.navigator .left').css('opacity', 0);
			container.find('.navigator .right').css('opacity', 0);
			
			old.find('.navigator .title').css('opacity', 0);
			old.find('.navigator .left').css('opacity', 0);
			old.find('.navigator .right').css('opacity', 0);
		}
		container.removeClass('pagecomb-entering');
		window.history.pushState({ url: url, performance: performance }, '', url);
		__performance = history.state.performance;
		setTimeout(function () { 
			container.css('margin-left', 0); 
			container.css('margin-top', 0); 
			old.css('margin-left', move);
			container.find('.navigator .title').css('opacity', 1);
			container.find('.navigator .title').css('margin-left', 0);
			container.find('.navigator .left').css('opacity', 1);
			container.find('.navigator .left').css('margin-left', 0);
			container.find('.navigator .right').css('opacity', 1);
			container.find('.navigator .right').css('margin-left', 0);
		}, 150);
			
		setTimeout(function () { 
			if (performance.indexOf('leave') >= 0)
				old.remove(); 
			
			container.find('.navigator').removeClass('alpha');
			
			if (__currentControllerScript)
				UnloadScript(__currentControllerScript);
			
			__currentControllerScript = '%/' + ConjectureControllerName(url) + '.js';
			LoadScript('%/' + ConjectureControllerName(url) + '.js');
		}, 300);
	});
	$('#pagecomb-pool').attr('src', url);
}