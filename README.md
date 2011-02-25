jQuery XML Helper
-----------------

**Requirements**

 - jQuery 1.5

This small plugin will make parsing **and** manipulating XML strings/documents in browsers
much easier and work correctly.

The problem with using vanilla jQuery to manipulate an XML string in browsers
is that jQuery isn't quite meant for using the XML DOM to append elements.

To get around this, this plugin wraps your XML string inside of the appropriate XMLDOM
and overrides some core jQuery methods to provide support for XML manipulation.

# Usage #

    // Load up an XML string
    var $xml = $.xml(your_string_xml);
    
    // Find children
    $xml.find("foo");
    
    // Manipulate (can wrap new XML elements in $.xml or use plain strings)
    $xml.append("<newel foo='baz' />");

As you can see, you can use all the same jQuery methods as it is a proper jQuery object.

# XML-specific Methods #

## .xml() ##

	$.xml("string").xml()

Returns the outer XML of the jQuery object. Use on the root (`$yourXmlVar.xml()`) to get the entire document
or use it on an element (`$yourXmlVar.find("child > grandchild").xml()`) to get its outer XML.

## .cdata([data]) ##

	// Get
	$.xml("string").find("child").cdata()
	// Or
	$.xml("string").find("child").html()
	
	// Set
	$.xml("string").find("child").cdata("some <strong>html</strong>")
	// Or
	$.xml("string").find("child").html("some <strong>html</strong>")

Gets or sets the CDATA for an element. It will overwrite any existing CDATA. You can also use `.html()` as another way
to get or set the same way.

# Known Issues #

 - FF 4 beta doesn't work
 
# What Seems to Work #

 - Browsers
   - IE7, IE8, IE9
   - FF 3.6
   - Chrome
   - Safari
   - Opera
 - Methods
   - append, appendTo
   - before, insertBefore
   - insertAfter
   - find
   - children
   - first
   - text
   - attr
   - html

# Untested #

 - Complicated XML documents with namespaces (Could use xmlns jQuery plugin?)
 - Methods:
   - after
   - prepend, prependTo
   - clone
   - empty, removeAll
   - replaceWith, replaceAll
   - wrap, wrapAll, wrapInner