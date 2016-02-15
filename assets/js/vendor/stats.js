
/* Google Analytics tracking code */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	// Changes site-specific tracking code and domain based on domain
	var siteSpecificCode;
	var siteSpecificDomain;
	switch (document.domain.replace('www.','')) {
		case "kent.gov.uk":
			siteSpecificCode = "UA-47252497-1";
			break;
		case "democracy.kent.gov.uk":
			siteSpecificCode = "UA-47252497-2";
			break;
	}

	if( siteSpecificCode ){
		ga('create', siteSpecificCode, siteSpecificDomain || 'auto');
		ga('create', 'UA-47252497-7', 'auto', { 'name': 'rollup'});
		ga('send', 'pageview');
		ga('rollup.send', 'pageview');
	}

/* End Google Analytics tracking code */

/* Track Downloads & Outbound Links in Google Analytics
http://www.blastam.com/blog/index.php/2013/09/howto-track-downloads-links-universalanalytics/ */
if (typeof jQuery != 'undefined') {
	var filetypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
	var baseHref = '';
	if (jQuery('base').attr('href') != undefined) baseHref = jQuery('base').attr('href');
	var hrefRedirect = '';

	jQuery('body').on('click', 'a', function(event) {
		var el = jQuery(this);
		var track = true;
		var href = (typeof(el.attr('href')) != 'undefined' ) ? el.attr('href') : '';
		var isThisDomain = href.match(document.domain.split('.').reverse()[1] + '.' + document.domain.split('.').reverse()[0]);
		if (!href.match(/^javascript:/i)) {
			var elEv = []; elEv.value=0, elEv.non_i=false;
			if (href.match(/^mailto\:/i)) {
				elEv.category = 'email';
				elEv.action = 'click';
				elEv.label = href.replace(/^mailto\:/i, '');
				elEv.loc = href;
			}
			else if (href.match(filetypes)) {
				var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
				elEv.category = 'download';
				elEv.action = 'click-' + extension[0];
				elEv.label = href.replace(/ /g,'-');
				elEv.loc = baseHref + href;
			}
			else if (href.match(/^https?\:/i) && !isThisDomain) {
				elEv.category = 'external';
				elEv.action = 'click';
				elEv.label = href.replace(/^https?\:\/\//i, '');
				elEv.non_i = true;
				elEv.loc = href;
			}
			else if (href.match(/^tel\:/i)) {
				elEv.category = 'telephone';
				elEv.action = 'click';
				elEv.label = href.replace(/^tel\:/i, '');
				elEv.loc = href;
			}
			else track = false;
 
			if (track) {
				var ret = true;
 
				if((elEv.category == 'external' || elEv.category == 'download') && (el.attr('target') == undefined || el.attr('target').toLowerCase() != '_blank') ) {
					hrefRedirect = elEv.loc;
 
					ga('send','event', elEv.category.toLowerCase(),elEv.action.toLowerCase(),elEv.label.toLowerCase(),elEv.value,{
						'nonInteraction': elEv.non_i ,
						'hitCallback':gaHitCallbackHandler
					});
 
					ret = false;
				}
				else {
					ga('send','event', elEv.category.toLowerCase(),elEv.action.toLowerCase(),elEv.label.toLowerCase(),elEv.value,{
						'nonInteraction': elEv.non_i
					});
				}
 
				return ret;
			}
		}
	});
 
	gaHitCallbackHandler = function() {
		window.location.href = hrefRedirect;
	}
}
/* End Google Analytics file download tracking */

// Creare's 'Implied Consent' EU Cookie Law Banner v:2.4
// Conceived by Robert Kent, James Bavington & Tom Foyster
var dropCookie = true; // false disables the Cookie, allowing you to style the banner
var cookieDuration = 365; // Number of days before the cookie expires, and the banner reappears
var cookieName = 'complianceCookie'; // Name of our cookie
var cookieValue = 'on'; // Value of cookie

function createDiv(){
	var bodytag = document.getElementsByTagName('body')[0];
	var div = document.createElement('div');
	div.setAttribute('id','cookie-law');
	div.innerHTML = '<div class="row"><div class="large-12 column"><div class="alert-box"><p>We use <a href="/about-the-council/about-the-website/cookies">cookies</a> to give you the best experience of this website. If you continue without changing your settings, we\'ll assume you are happy to receive all cookies from us.</p><a class="close-cookie-banner close" href="javascript:void(0);" onclick="removeMe();">&times;</a></div></div></div>';

	// Be advised the Close Banner 'X' link requires jQuery
	// bodytag.appendChild(div); // Adds the Cookie Law Banner just before the closing </body> tag
	// or
	bodytag.insertBefore(div,bodytag.lastChild); // Adds the Cookie Law Banner just after the opening <body> tag
	//document.getElementsByTagName('body')[0].className+=' cookiebanner'; //Adds a class tothe <body> tag when the banner is visible
	createCookie(window.cookieName,window.cookieValue, window.cookieDuration); // Create the cookie
}

function createCookie(name,value,days) {
	if (days) {
	var date = new Date();
	date.setTime(date.getTime()+(days*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	if(window.dropCookie) {
	document.cookie = name+"="+value+expires+"; path=/";
	}
}

function checkCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

/*window.onload = function(){
	if(checkCookie(window.cookieName) != window.cookieValue){
		createDiv();
	}
}*/

$(document).ready(function() {
	if(checkCookie(window.cookieName) != window.cookieValue){
		createDiv();
	}
});
 
function removeMe(){
	/*var element = document.getElementById('cookie-law');
	element.parentNode.removeChild(element);*/
	$('#cookie-law').fadeOut(700);
}

/* End Creare's 'Implied Consent' EU Cookie Law Banner v:2.4 */