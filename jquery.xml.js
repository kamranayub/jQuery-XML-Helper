/********************************
 * jQuery XML Helper
 * 
 * Created by Kamran Ayub (c)2011
 * https://github.com/kamranayub/jQuery-XML-Helper
 *
 * Makes working with XML using jQuery a bit easier
 * for Internet Explorer.
 *
 *
 */
 var $$ = $.sub();
 
$.xml = function (xml) {
    /// <summary>
    /// Makes working with XML a little more
    /// cross-browser compatible by overloading
	/// and extending some core jQuery functions
    /// </summary>

    "use strict";    
    	
	$$.parseXML = function (data, xml, tmp) {
		// Slightly modified to use
		// ActiveX for IE9 as well (reversed
		// statements
		if ( window.ActiveXObject ) { // IE6+
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		} else { // Standard						
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	};
	
	$$.fn.append = function () {
		var target = arguments[0],
			nodes = [],
			numNodes,
            curDOM,
            fallback = false;
		
        this.each(function () {
            curDOM = this;
            
            if (curDOM !== null && $.find.isXML(curDOM)) {
                // XMLDOM?			
                if ($.find.isXML(target)) {		
                    nodes = target.childNodes;
                // $-wrapped XML?
                } else if (target instanceof $ && $.find.isXML(target[0])) {
                    nodes = target;
                // String?
                } else if (typeof target === "string") {
                    // Wrap in case multiple elements were requested
                    nodes = $$.parseXML("<jxmlroot>" + target + "</jxmlroot>").firstChild.childNodes;
                }
                
                // Nodes get removed from array when moved
                numNodes = nodes.length;			
                for (i = 0; i < numNodes; i++) {
                    if ($.browser.webkit) {					
                        curDOM.appendChild(curDOM.ownerDocument.importNode(nodes[i], true));
                    } else {
                        curDOM.appendChild(nodes[0]);
                    }
                }                                	
            } else {
                fallback = true;
            }
        });
        
        if (fallback === true) {
            return $.fn.append.apply(this, arguments);
        } else {
            return this;
        }
	};
    
    $$.fn.before = function () {
        if (typeof arguments[0] === "string") {
			if ($.browser.webkit) {
				arguments[0] = this[0].ownerDocument.importNode(
					$$.parseXML("<jxmlroot>" + arguments[0] + "</jxmlroot>"
				).firstChild, true).childNodes;
			} else {
				arguments[0] = $.xml(arguments[0]);
			}
			
            return $.fn.before.apply(this, arguments);
        } else {
            return $.fn.before.apply(this, arguments);
        }
    };
    
    $$.fn.text = function () {
        var text = arguments[0],
            curDOM,
            textNode, i, 
            curNodes, curNodeLength, node;
        
        if (text) {
            this.each(function () {
                curDOM = this;
                
                textNode = curDOM.ownerDocument.createTextNode(text);

                curNodes = curDOM.childNodes;
                curNodeLength = curNodes.length;
                
                // Remove all nodes as we're setting the value of the node to
                // a text node
                for (i = 0; i < curNodeLength; i++) {
                    node = curNodes[0];
                    
                    node.parentNode.removeChild(node);
                }
                
                curDOM.appendChild(textNode);               
            });
            
            return this;
        } else {
            return $.fn.text.apply(this, arguments);
        }                             
    };
    
    $$.fn.cdata = function (data) {
        var curDOM, i, node, cdata;
		
        // Set CDATA
        if (data) {	
            this.each(function () {
                curDOM = this;
                
                cdata = curDOM.ownerDocument.createCDATASection(data);
                
                // Remove existing CDATA, if any.
                for (i = 0; i < curDOM.childNodes.length; i++) {
                    node = curDOM.childNodes[i];
                    if (node.nodeType === 4) { // cdata
                        node.parentNode.removeChild(node);
                        break;
                    }
                }
                
                if ($.browser.webkit) {
                    curDOM.appendChild(curDOM.ownerDocument.importNode(cdata, true));
                } else {
                    curDOM.appendChild(cdata);
                }
            
            });
            
            return this;
        } else {
            // Get CDATA
            curDOM = this[0];
            for (i = 0; i < curDOM.childNodes.length; i++) {
                if (curDOM.childNodes[i].nodeType === 4) { // cdata
                    return curDOM.childNodes[i].nodeValue;
                }
            }
        }
        
        return null;
    };
    
    $$.fn.html = function () {
        // Redirect HTML w/ no args to .cdata()
        if ($.find.isXML(this[0]) && !arguments[0]) {
            return this.cdata();
        } else if ($.find.isXML(this[0]) && arguments[0]) {
            return this.cdata(arguments[0]);
        } else {
			return $.fn.html.apply(this, arguments);
		}
    };
	
	$$.fn.xml = function () {
		/// <summary>
		/// Gets outer XML. Expects $-wrapped XMLDOM.
		/// </summary>
        
		// for IE 
		if (window.ActiveXObject) {
			return this[0].xml;
		} else {
			// code for Mozilla, Firefox, Opera, etc.
		   return (new XMLSerializer()).serializeToString(this[0]);
		}
	};
    
    // Wrap in root tag so when creating new standalone markup, things
    // should still work.
    var parser = $$.parseXML("<jxmlroot>" + xml + "</jxmlroot>");
    
	return $$(parser).find("jxmlroot > *");
};