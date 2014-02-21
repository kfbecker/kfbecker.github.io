var Mint = new Object();
Mint.save = function() 
{
	var now		= new Date();
	var debug	= false; // this is set by php 
	if (window.location.hash == '#Mint:Debug') { debug = true; };
	var path	= 'http://smoothgallery.jondesign.net/mint/?record&key=33335574337358526342333539324d4f393331';
	path 		= path.replace(/^https?:/, window.location.protocol);
	
	// Loop through the different plug-ins to assemble the query string
	for (var developer in this) 
	{
		for (var plugin in this[developer]) 
		{
			if (this[developer][plugin] && this[developer][plugin].onsave) 
			{
				path += this[developer][plugin].onsave();
			};
		};
	};
	// Slap the current time on there to prevent caching on subsequent page views in a few browsers
	path += '&'+now.getTime();
	
	// Redirect to the debug page
	if (debug) { window.open(path+'&debug&errors', 'MintLiveDebug'+now.getTime()); return; };
	
	var ie = /*@cc_on!@*/0;
	if (!ie && document.getElementsByTagName && (document.createElementNS || document.createElement))
	{
		var tag = (document.createElementNS) ? document.createElementNS('http://www.w3.org/1999/xhtml', 'script') : document.createElement('script');
		tag.type = 'text/javascript';
		tag.src = path + '&serve_js';
		document.getElementsByTagName('head')[0].appendChild(tag);
	}
	else if (document.write)
	{
		document.write('<' + 'script type="text/javascript" src="' + path + '&amp;serve_js"><' + '/script>');
	};
};
if (!Mint.SI) { Mint.SI = new Object(); }
Mint.SI.Referrer = 
{
	onsave	: function() 
	{
		var encoded = 0;
		if (typeof Mint_SI_DocumentTitle == 'undefined') { Mint_SI_DocumentTitle = document.title; }
		else { encoded = 1; };
		var referer		= (window.decodeURI)?window.decodeURI(document.referrer):document.referrer;
		var resource	= (window.decodeURI)?window.decodeURI(document.URL):document.URL;
		return '&referer=' + escape(referer) + '&resource=' + escape(resource) + '&resource_title=' + escape(Mint_SI_DocumentTitle) + '&resource_title_encoded=' + encoded;
	}
};

var Mint_TK_script = 'http://smoothgallery.jondesign.net/mint/pepper/tillkruess/downloads/tracker.php?uri=';
var Mint_TK_domains = 'smoothgallery.jondesign.net';
var Mint_TK_extensions = 'zip, rar, tar, gz, gzip, bz2, master';

function Mint_TK_redirect_links() {
	extensions = Mint_TK_extensions.split(', ');
	domains = Mint_TK_domains.split(', ');
	var e = document.getElementsByTagName('a');
	for (var i = 0; i < e.length; i++) {
		if (e[i].href.indexOf(Mint_TK_script) == -1) {
			for (var j = 0; j < extensions.length; j++) {
				if (extensions[j] == e[i].href.substring(e[i].href.length - extensions[j].length, e[i].href.length)) {
					for (var h = 0; h < domains.length; h++) {
						if ((e[i].href.substr(e[i].href.indexOf('//') + 2)).substr(0, (e[i].href.substr(e[i].href.indexOf('//') + 2)).indexOf('/')).indexOf(domains[h]) != -1) {
							e[i].href = Mint_TK_script + escape(e[i].href);
						}
					}
				}
			}
		}
	}
}

if (window.addEventListener) {
	window.addEventListener('load', Mint_TK_redirect_links, false);
} else if (window.attachEvent) {
	window['eload' + Mint_TK_redirect_links] = Mint_TK_redirect_links;
	window['load' + Mint_TK_redirect_links] = function() {
		window['eload' + Mint_TK_redirect_links](window.event);
	}
	window.attachEvent('onload', window['load' + Mint_TK_redirect_links]);
}
Mint.save();