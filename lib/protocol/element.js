module.exports = function element (value, callback) {

    var using,
        requestOptions = {
        path:"/session/:sessionId/element",
        method:"POST"
    };

    // check value type
    // use id strategy if value starts with # and doesnt contain any other CSS selector-relevant character
    if(value.indexOf('#') === 0 && value.search(/(\s|>|\.|[|])/) === -1) {
        using = 'id';
        value = value.slice(1);

    // use xPath startegy if value startes with //
    } else if(value.indexOf('//') === 0) {
        using = 'xpath';

    // use link text startegy if value startes with =
    } else if(value.indexOf('=') === 0) {
        using = 'link text';
        value = value.slice(1);

    // use partial link text startegy if value startes with =*
    } else if(value.indexOf('*=') === 0) {
        using = 'partial link text';
        value = value.slice(2);

    // use tag name strategy if value contains a tag
    // e.g. "<div>" or "<div />"
    } else if(value.search(/<[a-zA-Z-]+( \/)*>/g) >= 0) {
        using = 'tag name';
        value = value.replace(/<|>|\/|\s/g,'');

    // use name strategy if value queries elements with name attributes
    // e.g. "[name='myName']" or '[name="myName"]'
    } else if(value.search(/\[name=("|')([a-zA-z0-9-_]+)("|')\]/) >= 0) {
        using = 'name';
        value = value.match(/\[name=("|')([a-zA-z0-9-_]+)("|')\]/)[2];

    // if nothing fits with the supported strategies we fall back to the css selector strategy
    } else {
        using = 'css selector';
    }

    this.requestHandler.create(requestOptions,{'using':using, 'value':value},callback);

};