---
author: Richard
comments: true
date: 2006-08-30 05:32:30+00:00
layout: post
slug: my-first-nnug-meeting
title: My first NNUG meeting
wordpress_id: 17
categories:
- .NET
---

I just came back from my first [NNUG meeting](http://www.nnug.no/) (.NET user group) ever! The meeting consisted of two presentations (plus some Microsoft info about [Tech Ed](http://www.microsoft.com/events/teched2006/) etc), one about the new [Windows Workflow Foundation](http://wf.netfx3.com/) and one about the [Provider model in .NET 2.0](http://msdn.microsoft.com/asp.net/downloads/providers/default.aspx?pull=/library/en-us/dnaspnet/html/asp02182004.asp).

Neither of them were really breathtaking. Besides the fact that deleting the namespace in the web.coning in ASP.NET 2.0 actually enables the XML config code hinting!
    
    <div><span style="color: #000000; "><</span><span style="color: #000000; ">configuration
         xmlns</span><span style="color: #000000; ">=</span><span style="color: #000000; ">"</span><span style="color: #000000; ">http://schemas.microsoft.com/.NetConfiguration/v2.0</span><span style="color: #000000; ">"</span><span style="color: #000000; ">></span></div>




Becomes






    
    <div><span style="color: #000000; "><</span><span style="color: #000000; ">configuration</span><span style="color: #000000; ">></span></div>




Apparently it's a bug in Visual Studio 2005! It's always irritated me as I've seen it working in different presentations etc. At leats it's an easy fix.




The new [Windows Workflow Foundation](http://wf.netfx3.com/) is basically Orchestration from Biztalk that Microsoft put into a isolated component. This makes it possible to call orchestrations like processes (called workflows) from all .NET code.




I also got to talk to a guy with heavy [Biztalk 2004](http://www.microsoft.com/biztalk/) experience. It's interesting as my new job will involve some major Biztalk development. Apparently Biztalk has some issues consering the XML mapper and the XSLT it generates (I've heard that before). Sounds like I got some XSLT writing a head of me ... 
