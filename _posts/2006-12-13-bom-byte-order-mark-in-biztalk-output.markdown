---
date: 2006-12-13 15:38:05+00:00
layout: post
title: "BOM - Byte Order Mark in BizTalk output"
categories: [BizTalk 2006]
---

Today was another day of new BizTalk problems ... The task was easy; produce a XML file and send to a receiving system. Fine. Done. ... Not.

The receiving system could not read the file because of some strange characters in the beginning of the file! It looked something like the below when opening the file in a fancy text editor ([UltraEdit](http://www.ultraedit.com/) or [TextPad](http://www.textpad.com/) for example).
    
    <div><span style="color: #000000; ">i»¿</span><span style="color: #0000FF; "><?</span><span style="color: #FF00FF; ">xml version="1.0" encoding="utf-8"</span><span style="color: #0000FF; ">?></span></div>







After a couple of very interesting (:/) hours of [Googling](http://en.wikipedia.org/wiki/Google_(verb)) I found this from Ben McFarlin




<blockquote>

> 
> It is because internal BizTalk messages are in UTF8 format and include  
the byte order mark. When you added the xml declaration for UTF16 it  
confused the engine; the declaration read UTF16 but the byte order mark indicated UTF8.
> 
> </blockquote>




[![Preserve BOM](http://richardhallgren.com/blog/wp-content/uploads/2006/12/WindowsLiveWriter/BOMByteOrderMark_EA75/preserveBOM_thumb%5B5%5D5.jpg)](http://richardhallgren.com/blog/wp-content/uploads/2006/12/WindowsLiveWriter/BOMByteOrderMark_EA75/preserveBOM%5B5%5D5.jpg)When I finally found the cause the solution was easy. Just another of those [weird properties](http://support.microsoft.com/kb/921044) ... This time it's called _Preserve BOM_ (on the properties of the XML Assembly pipeline component - see figure on the right). _BOM_ of course stands for _Byte Order Mark_.
