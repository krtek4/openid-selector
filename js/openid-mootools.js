/**
 * Simple OpenID Plugin
 * 
 * @see 	http://code.google.com/p/openid-selector/
 * @licence New BSD License <http://www.opensource.org/licenses/bsd-license.php>
 */

/**
 * @class OpenIdProviders
 */
var OpenIdProviders = new Class({

	all: {},

	large: {
	    google: {
	        name: 'Google',
	        url: 'https://www.google.com/accounts/o8/id'
	    },
	    yahoo: {
	        name: 'Yahoo',      
	        url: 'http://me.yahoo.com/'
	    },    
	    aol: {
	        name: 'AOL',     
	        label: 'Enter your AOL screenname.',
	        url: 'http://openid.aol.com/{username}/'
	    },
	    openid: {
	        name: 'OpenID',     
	        label: 'Enter your OpenID.',
	        url: null
	    }
	},

	small: {
		myopenid: {
	        name: 'MyOpenID',
	        label: 'Enter your MyOpenID username.',
	        url: 'http://{username}.myopenid.com/'
	    },
	    livejournal: {
	        name: 'LiveJournal',
	        label: 'Enter your Livejournal username.',
	        url: 'http://{username}.livejournal.com/'
	    },
	    flickr: {
	        name: 'Flickr',        
	        label: 'Enter your Flickr username.',
	        url: 'http://flickr.com/{username}/'
	    },
	    technorati: {
	        name: 'Technorati',
	        label: 'Enter your Technorati username.',
	        url: 'http://technorati.com/people/technorati/{username}/'
	    },
	    wordpress: {
	        name: 'Wordpress',
	        label: 'Enter your Wordpress.com username.',
	        url: 'http://{username}.wordpress.com/'
	    },
	    blogger: {
	        name: 'Blogger',
	        label: 'Your Blogger account',
	        url: 'http://{username}.blogspot.com/'
	    },
	    verisign: {
	        name: 'Verisign',
	        label: 'Your Verisign username',
	        url: 'http://{username}.pip.verisignlabs.com/'
	    },
	    vidoop: {
	        name: 'Vidoop',
	        label: 'Your Vidoop username',
	        url: 'http://{username}.myvidoop.com/'
	    },
	    verisign: {
	        name: 'Verisign',
	        label: 'Your Verisign username',
	        url: 'http://{username}.pip.verisignlabs.com/'
	    },
	    claimid: {
	        name: 'ClaimID',
	        label: 'Your ClaimID username',
	        url: 'http://claimid.com/{username}'
	    }
	},

	initialize: function(){
		this.all = $merge(this.large, this.small);
	}
});

/**
 * @class OpenIdSelector
 */
var OpenIdSelector = new Class({

	cookie_expires: 6*30, // 6 months.
    cookie_name: 'openid_provider',
    cookie_path: '/',

    img_path: 'images/',

    input_id: null,
    provider_url: null,

    providers: null,

    /**
     * Class constructor
     * 
     * @return {Void}
     */
    initialize: function(input_id) {

        var openid_btns = $('openid_btns');

        this.input_id  = input_id;
        this.providers = new OpenIdProviders();

        $('openid_choice').setStyle('display', 'block');
        $('openid_input_area').empty();

        // add box for each provider
        for (id in this.providers.large) {
        	box = this.getBoxHTML(this.providers.large[id], 'large', '.gif');
        	box.inject(openid_btns);
        }

        if (this.providers.small) {
            openid_btns.grab(new Element('br'));
            for (id in this.providers.small) {
                box = this.getBoxHTML(this.providers.small[id], 'small', '.ico.gif');
                box.inject(openid_btns);
            }
        }

        $('openid_form').addEvent('submit', this.submit.bind(this));

        var box_id = Cookie.read(this.cookie_name);
        if (box_id !== null) this.signin(box_id, true);
    },

    /**
     * @return {Element}
     */
    getBoxHTML: function(provider, box_size, image_ext){
        var box_id = provider.name.toLowerCase();
        var openid = this;
        return  new Element('a', {
        	'href':  "javascript:void(0);",
        	'title': provider.name,
            'class': box_id + ' openid_' + box_size + '_btn',
            'styles': {
        		'display': 'block',
                'background': '#fff url(' + this.img_path + (box_size == 'small' ? '../images.small/' : '../images.large/') + box_id + image_ext + ') no-repeat center center'
            },
            'events': {
            	'click': openid.signin.pass(box_id, openid)
            }
        });
    },
    
    /**
     * Provider image click
     * 
     * @return {Void}
     */
    signin: function(box_id, onload){

        var provider = this.providers.all[box_id];
        if (!provider) return;

        this.highlight(box_id);

        Cookie.write(this.cookie_name, box_id, {
            duration: this.cookie_expires,
            path: this.cookie_path
        });
        
        // prompt user for input?
        if (provider.label) {
            this.useInputBox(provider);
            this.provider_url = provider.url;
        }

        else {
            this.setOpenIdUrl(provider.url);
            if (!onload) $('openid_form').submit();
        }
    },
    
    /**
     * Sign-in button click
     * 
     * @return {Boolean}
     */
    submit: function(){
        var url = this.provider_url; 
        if (url) {
            url = url.substitute({ 'username': $('openid_username').get('value') });
            this.setOpenIdUrl(url);
        }
        return true;
    },

    /**
     * @return {Void}
     */
    setOpenIdUrl: function(url){

    	var hidden = $(this.input_id);

        if (hidden) {
            hidden.set('value', url);
        }
        else {
        	$('openid_form').grab(new Element('input', {
            	'type':  'hidden',
            	'id':    this.input_id,
            	'name':  this.input_id,
            	'value': url
        	}));
        }
    },

    /**
     * @return {Void}
     */
    highlight: function(box_id){
        // remove previous highlight.
        var highlight = $('openid_highlight');
        if (highlight)
            $('openid_highlight').getFirst('a').replaces(highlight);
        // add new highlight.
        new Element('div', { 'id': 'openid_highlight' }).wraps($$('.' + box_id)[0]);
    },

    /**
     * @return {Void}
     */
    useInputBox: function(provider){

        var input_area = $('openid_input_area');

        var html  = '';
        var id    = 'openid_username';
        var value = '';
        var label = provider['label'];
        var style = '';

        if (label)
        	html  = '<p>' + label + '</p>';

        if (provider['name'] == 'OpenID') {
            id    = this.input_id;
            value = 'http://';
            style = 'background: #fff url(' + this.img_path + 'openid-inputicon.gif) no-repeat scroll 0 50%; padding-left:18px;';
        }

        html += '<input id="'+id+'" type="text" style="'+style+'" name="'+id+'" value="'+value+'" />' + 
                '<input id="openid_submit" type="submit" value="Sign-In"/>';

        input_area.set('html', html);

        $(id).focus();
    }
});
