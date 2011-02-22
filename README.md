jQuery XML Helper
-----------------

**Requirements**

 - jQuery 1.5

This small plugin will make parsing **and** manipulating XML strings/documents in IE
much easier and work correctly.

The problem with using vanilla jQuery to manipulate an XML string in IE
is that IE does not recognize the unknown elements and does not support the jQuery
manipulation methods (append, etc.).

To get around this, this plugin leverages the `innerShiv` script by jdbartlett
(http://jdbartlett.github.com/innershiv) and HTML5-like shiving for the tags
in your XML document.

Usage
-----

    // Load up an XML string
    var $xml = $.xml(your_string_xml);
    
    // Find children
    $xml.find("foo");
    
    // Manipulate (must wrap new XML elements in $.xml)
    $xml.append($.xml("<newel foo='baz' />"));

As you can see, you can use all the same jQuery methods as it is a proper jQuery object.
Other browsers deal with XML parsing and manipulation fine, so it will just pass through.