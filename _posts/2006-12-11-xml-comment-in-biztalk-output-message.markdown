---
date: 2006-12-11 13:18:36+00:00
layout: post
title: "XML comment in BizTalk output message"
categories: [BizTalk 2006]
---

We ran into an issue today when we had to have an XML comment just below the XML declaration in a message we're producing in our BizTalk 2006 solution. We needed to produce something like the below.
    
    <div><span style="color: #0000FF; "><?</span><span style="color: #FF00FF; ">xml version="1.0"</span><span style="color: #0000FF; ">?></span><span style="color: #000000; ">
    </span><span style="color: #008000; "><!--</span><span style="color: #008000; "> Comment goes here </span><span style="color: #008000; ">--></span></div>




Our first approach was to create a map in the send port and to have a custom XSLT template in there that added the comment before the whole transformation process started. We actually got this to work but it meant that we had to have a whole new map with a separate XSLT document in the project!




[![](http://richardhallgren.com/blog/wp-content/uploads/2006/12/WindowsLiveWriter/XMLcommentinBizTalkoutputmessage_C9D4/xml%20assembler%20settings_thumb%5B1%5D5.jpg)](http://richardhallgren.com/blog/wp-content/uploads/2006/12/WindowsLiveWriter/XMLcommentinBizTalkoutputmessage_C9D4/xml%20assembler%20settings%5B1%5D5.jpg)Eventually we found a property called _Xml Asm Processing Instructions_ (highlighted in the figure - click it to view it in original size) on the XML assembly component (used in the standard XMLTransmit pipeline). 




We just put the comment as a value in this property and we were done! No new artifacts or code! Just a weird property - typical BizTalk behavior!
