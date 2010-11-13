/*
	Simple OpenID Plugin
	http://code.google.com/p/openid-selector/
	
	This code is licensed under the New BSD License.
*/

var providers;

/**
 * @class OpenIdSelector
 */
var OpenIdSelector = new Class({
	version : '1.3', // version constant
	demo : false,
	demo_text : null,
	cookie_expires : 6 * 30, // 6 months.
	cookie_name : 'openid_provider',
	cookie_path : '/',

	img_path : 'images/',
	locale : null, // is set in openid-<locale>.js
	sprite : null, // usually equals to locale, is set in
	// openid-<locale>.js
	signin_text : null, // text on submit button on the form
	input_id : null,
	provider_url : null,
	provider_id : null,
	all_small : false, // output large providers w/ small icons
	no_sprite : false, // don't use sprite image
	image_title : '{provider}', // for image title

	/**
	 * Class constructor
	 * 
	 * @return {Void}
	 */
	initialize : function(input_id) {
		providers = $merge(providers_large, providers_small);
		var openid_btns = $('openid_btns');
		this.input_id = input_id;
		$('openid_choice').setStyle('display', 'block');
		$('openid_input_area').empty();
		// add box for each provider
		for (id in providers_large) {
			box = this.getBoxHTML(providers_large[id], 'large', '.gif');
			box.inject(openid_btns);
		}

		if (providers_small) {
			openid_btns.grab(new Element('br'));
			for (id in providers_small) {
				box = this.getBoxHTML(providers_small[id], 'small', '.ico.gif');
				box.inject(openid_btns);
			}
		}
		$('openid_form').addEvent('submit', this.submit.bind(this));
		var box_id = this.readCookie();
		if (box_id) {
			this.signin(box_id, true);
		}
	},

	/**
	 * @return {Element}
	 */
	getBoxHTML : function(provider, box_size, image_ext) {
		var box_id = provider.name.toLowerCase();
		var openid = this;
		return new Element('a', {
			'href' : "javascript:void(0);",
			'title' : provider.name,
			'class' : box_id + ' openid_' + box_size + '_btn',
			'styles' : {
				'display' : 'block',
				'background' : '#fff url(' + this.img_path + (box_size == 'small' ? '../images.small/' : '../images.large/') + box_id + image_ext
						+ ') no-repeat center center'
			},
			'events' : {
				'click' : openid.signin.pass(box_id, openid)
			}
		});
	},

	/**
	 * Provider image click
	 * 
	 * @return {Void}
	 */
	signin : function(box_id, onload) {
		var provider = providers[box_id];
		if (!provider) {
			return;
		}
		this.highlight(box_id);
		this.setCookie(box_id);
		this.provider_id = box_id;
		this.provider_url = provider['url'];
		// prompt user for input?
		if (provider['label']) {
			this.useInputBox(provider);
		} else {
			this.setOpenIdUrl(provider.url);
			if (!onload) {
				$('openid_form').submit();
			}
		}
	},

	/**
	 * Sign-in button click
	 * 
	 * @return {Boolean}
	 */
	submit : function() {
		var url = this.provider_url;
		if (url) {
			url = url.substitute({
				'username' : $('openid_username').get('value')
			});
			this.setOpenIdUrl(url);
		}
		if (this.demo) {
			alert(this.demo_text + "\r\n" + document.getElementById(this.input_id).value);
			return false;
		}
		if (url.indexOf("javascript:") == 0) {
			url = url.substr("javascript:".length);
			eval(url);
			return false;
		}
		return true;
	},

	/**
	 * @return {Void}
	 */
	setOpenIdUrl : function(url) {
		var hidden = $(this.input_id);
		if (hidden) {
			hidden.set('value', url);
		} else {
			$('openid_form').grab(new Element('input', {
				'type' : 'hidden',
				'id' : this.input_id,
				'name' : this.input_id,
				'value' : url
			}));
		}
	},

	/**
	 * @return {Void}
	 */
	highlight : function(box_id) {
		// remove previous highlight.
		var highlight = $('openid_highlight');
		if (highlight) {
			$('openid_highlight').getFirst('a').replaces(highlight);
		}
		// add new highlight.
		new Element('div', {
			'id' : 'openid_highlight'
		}).wraps($$('.' + box_id)[0]);
	},

	setCookie : function(value) {
		Cookie.write(this.cookie_name, value, {
			duration : this.cookie_expires,
			path : this.cookie_path
		});
	},

	readCookie : function() {
		return Cookie.read(this.cookie_name);
	},

	/**
	 * @return {Void}
	 */
	useInputBox : function(provider) {
		var input_area = $('openid_input_area');
		var html = '';
		var id = 'openid_username';
		var value = '';
		var label = provider['label'];
		var style = '';
		if (label) {
			html = '<p>' + label + '</p>';
		}
		if (provider['name'] == 'OpenID') {
			id = this.input_id;
			value = 'http://';
			style = 'background:#FFF url(' + this.img_path + 'openid-inputicon.gif) no-repeat scroll 0 50%; padding-left:18px;';
		}
		html += '<input id="' + id + '" type="text" style="' + style + '" name="' + id + '" value="' + value + '" />'
				+ '<input id="openid_submit" type="submit" value="' + this.signin_text + '"/>';
		input_area.set('html', html);
		$(id).focus();
	},

	setDemoMode : function(demoMode) {
		this.demo = demoMode;
	}
});
