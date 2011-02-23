/********************************
 * jQuery XML Helper
 * 
 * Created by Kamran Ayub (c)2011
 * https://github.com/kamranayub/jQuery-XML-Helper
 *
 * Makes working with XML using jQuery a lot easier
 * for Internet Explorer.
 *
 * With help from:
 *      - jdbartlett for window.innerShiv
 *          http://jdbartlett.github.com/innershiv
 *      - Shamasis Bhattacharya for Array.prototype.unique
 *          http://www.shamasis.net/2009/09/fast-algorithm-to-find-unique-items-in-javascript-array/
 *
 * Change Log:
 *
 *      - 2/22/11
 *          > Initial version
 */
$.xml = function (xml) {
    /// <summary>
    /// Makes working with XML a little more
    /// cross-browser compatible thanks
    /// to innerShiv and document.createElement
    /// for IE 6+
    /// </summary>

    "use strict";

    Array.prototype.unique = function () {
        var o = {}, i, l = this.length, r = [];
        for (i = 0; i < l; i++) {
            o[this[i]] = this[i];
        }
        for (i in o) {
            if (o.hasOwnProperty(i)) {
                r.push(o[i]);
            }
        }
        return r;
    };

    //
    // Helps in manipulation for IE
    //
    // http://jdbartlett.github.com/innershiv | WTFPL License
    window.innerShiv = (function () {
        var div, frag,
            inaTable = /^<(tbody|tr|td|col|colgroup|thead|tfoot)/i,
            remptyTag = /(<([\w:]+)[^>]*?)\/>/g,
            rselfClosing = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,
            fcloseTag = function (all, front, tag) {
                return rselfClosing.test(tag) ? all : front + '></' + tag + '>';
            };             

        return function (html, returnFrag) {
            if (!div) {
                div = document.createElement('div');
                frag = document.createDocumentFragment();
                /*@cc_on div.style.display = 'none';@*/
            }

            html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '');            
            
            var tabled = html.match(inaTable), myDiv = div.cloneNode(true);
            if (tabled) {
                html = '<table>' + html + '</table>';
            }

            /*@cc_on document.body.appendChild(myDiv);@*/
            myDiv.innerHTML = html.replace(remptyTag, fcloseTag);            
            /*@cc_on document.body.removeChild(myDiv);@*/

            if (tabled) {
                myDiv = myDiv.getElementsByTagName(tabled[1])[0].parentNode;
            }

            if (returnFrag === false) {
                return myDiv.childNodes;
            }

            var myFrag = frag.cloneNode(true), i = myDiv.childNodes.length;
            while (i--) { myFrag.appendChild(myDiv.firstChild); }

            return myFrag;
        };
    }());
    
    //
    // Clean
    //
    
    function htmlEncode(value) {    
        return $('<div/>').text(value).html();  
    }  
    
    //
    // Handle CDATA
    // Since this is being converted to HTML, can't use CDATA
    // but at least we can encode it
    //
    xml = xml.replace(/<!\[CDATA\[(.*?)\]\]>/g, htmlEncode('$1'));
    
    // Replace IE problematic tags and attributes
    // and use custom namespace or enclose in quotes
    /*@cc_on
    xml = xml.replace(/<(\/)?(title|head|meta|link|body|html)/g, "<$1jxml:$2");    
    @*/
    
    //
    // Register and discover XML tags (IE only)
    //            

    /*@cc_on
    var tagRx = /\<([a-z_]+)/ig, // match opening tag only
        tmp, tags = [];

    while ((tmp = tagRx.exec(xml)) !== null) {
        tags.push(tmp[1]);
    }

    $.each(tags.unique(), function () { 
        document.createElement(this);
    });
    @*/   

    return $(window.innerShiv(xml, false));
};

$.fn.outerXml = function () {
    /// <summary>
    /// Gets full XML document and fixes IE issues
    /// </summary>

    var plainXml = $("<div></div>").append($(this).clone()).html();

    if ($.browser.msie) {
        
        // Enclose weird IE-specific attributes in quotes
        plainXml = plainXml.replace(/(id)=(\w+)/gi, '$1="$2"');
        
        // Replace empty namespaces (:) or jxml: namespace
        plainXml = plainXml.replace(/<(\/)?(jxml)?\:/g, "<$1");
        
        return plainXml;
    } else {
        return plainXml;
    }
};