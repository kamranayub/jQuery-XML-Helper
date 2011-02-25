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

Usage
-----

    // Load up an XML string
    var $xml = $.xml(your_string_xml);
    
    // Find children
    $xml.find("foo");
    
    // Manipulate (can wrap new XML elements in $.xml or use plain strings)
    $xml.append("<newel foo='baz' />");

As you can see, you can use all the same jQuery methods as it is a proper jQuery object.

Known Issues
----------

 - None

Untested
--------

 - Complicated XML documents with namespaces (Could use xmlns jQuery plugin?)
 - Methods:
   - prepend, prependTo
   - clone
   - empty, removeAll
   - replaceWith, replaceAll
   - wrap, wrapAll, wrapInner