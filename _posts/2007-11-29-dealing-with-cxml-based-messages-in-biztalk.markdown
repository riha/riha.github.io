---
date: 2007-11-29 16:33:30+00:00
layout: post
title: "Dealing with cXML based messages in BizTalk"
categories: [BizTalk 2006]
---

[cXML](http://cxml.org/) (commerce eXtensible Markup Language) is a XML based standard for communication of data related to electronic commerce. The problem from a BizTalk perspective is that they **don't publish any [XML schemas](http://en.wikipedia.org/wiki/XML_Schema)** (XSD),  only [Document Type Definition](http://en.wikipedia.org/wiki/Document_Type_Definition) (DTD). 

When trying to generate a schema based on a DTD using the functionality in BizTalk (via [Add Generated Items](http://msdn2.microsoft.com/en-us/library/ms944737.aspx)) one ends up with a schema split of three files that really doesn't make any sense ([XmlSpy](http://www.altova.com/products/xmlspy/xml_editor.html) doesn't do a very good job either ...). So after a while I found [Nick Heppleston schema repository](http://www.modhul.com/schema-repository-cxml/)! After some tweaking I actually had a cXML Order schema in the version I was looking for! Thanks Nick!

The next set of problems was to handle **the lack** of [XML namespace](http://en.wikipedia.org/wiki/XML_namespace) and the [DOCTYPE declaration](http://msdn2.microsoft.com/en-us/library/ms256059.aspx) that messages validating against DTD carries on top.
    
    <div><span style="color: #0000FF; "><?</span><span style="color: #FF00FF; ">xml version="1.0" standalone="no"</span><span style="color: #0000FF; ">?></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "><!</span><span style="color: #FF00FF; ">DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">cXML </span><span style="color: #FF0000; ">xml:lang</span><span style="color: #0000FF; ">="en-US"</span><span style="color: #FF0000; "> payloadID</span><span style="color: #0000FF; ">="2007117.25919@Contempus"</span><span style="color: #FF0000; "> timestamp</span><span style="color: #0000FF; ">="2007-11-07T11:06:16+01:00"</span><span style="color: #0000FF; ">></span></div>







To handel these two issues I set up a receive pipeline that looked like the one below.




[![](../assets/2007/11/windowslivewriterba0c14911562-ef39pipeline-thumb12.jpg)](../assets/2007/11/windowslivewriterba0c14911562-ef39pipeline32.jpg)




# Remove the DOCTYPE declaration




First I created a pipeline component to remove the DOCTYPE node. It's simple code using [regular expression](http://en.wikipedia.org/wiki/Regular_expression) to find the DOCTYPE node, replace it with an empty string and return the message.



    
    <div><span style="color: #0000FF; ">public</span><span style="color: #000000; "> IBaseMessage Execute(IPipelineContext pc, IBaseMessage inmsg)
    {
       </span><span style="color: #0000FF; ">string</span><span style="color: #000000; "> messageString </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> StreamReader(inmsg.BodyPart.Data).ReadToEnd();
       Regex doctypePattern </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> Regex(</span><span style="color: #000000; ">"</span><span style="color: #000000; "><!DOCTYPE.+?></span><span style="color: #000000; ">"</span><span style="color: #000000; ">);
       messageString </span><span style="color: #000000; ">=</span><span style="color: #000000; "> doctypePattern.Replace(messageString, </span><span style="color: #0000FF; ">string</span><span style="color: #000000; ">.Empty);
       MemoryStream memStream </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> MemoryStream();
       </span><span style="color: #0000FF; ">byte</span><span style="color: #000000; ">[] data </span><span style="color: #000000; ">=</span><span style="color: #000000; "> Encoding.UTF8.GetBytes(messageString);
       memStream.Write(data, </span><span style="color: #000000; ">0</span><span style="color: #000000; ">, data.Length);
       memStream.Seek(</span><span style="color: #000000; ">0</span><span style="color: #000000; ">, SeekOrigin.Begin);
       inmsg.BodyPart.Data </span><span style="color: #000000; ">=</span><span style="color: #000000; "> memStream;
       </span><span style="color: #0000FF; ">return</span><span style="color: #000000; "> inmsg;
    }</span></div>




# Set an XML namespace 




Secondly I used [Richard Seroter's post](http://seroter.wordpress.com/2007/02/11/add-namespace-to-inbound-biztalk-messages/) on how to change the SetNSForMsg component to add a XML namespace. That's the second component showing in the decode stage of the pipeline.




Arrow number 3 shows how the SetMsgNS exposes a property that allows us to set the namespace that we can configure per pipeline. In this case I've set it to _http://schemas.modhul.com/cXML/1.2.014/OrderRequest__ _which is the namespace of the cXML schema I'm currently working agains.




In the end we'll have a message with the following declaration and root node. 






    
    <div><span style="color: #0000FF; "><?</span><span style="color: #FF00FF; ">xml version="1.0" encoding="utf-16" standalone="no"</span><span style="color: #0000FF; ">?></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">cXML </span><span style="color: #FF0000; ">xml:lang</span><span style="color: #0000FF; ">="en-US"</span><span style="color: #FF0000; "> payloadID</span><span style="color: #0000FF; ">="2007117.25919@Contempus"</span><span style="color: #FF0000; "> xmlns</span><span style="color: #0000FF; ">="http://schemas.modhul.com/cXML/1.2.014/OrderRequest"</span><span style="color: #FF0000; "> timestamp</span><span style="color: #0000FF; ">="2007-11-07T11:06:16+01:00"</span><span style="color: #0000FF; ">></span></div>




Now we're ready to start mapping!
