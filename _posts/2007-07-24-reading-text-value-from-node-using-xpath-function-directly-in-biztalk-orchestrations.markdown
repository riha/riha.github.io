---
date: 2007-07-24 14:10:02+00:00
layout: post
title: "Reading text value from node using XPath function directly in BizTalk orchestrations"
categories: [BizTalk 2006, Tools]
---

The XPath function that's available directly inside BizTalk orchestration is a powerful little tool. However I've seen a couple of project where developers just grown tired of it and started creating their own little libraries instead. I'll be the first to admit that the XPath function isn't perfect, and it sure doesn't work like most of the other XPath engines (which is the biggest problem) but it's still **inside** the orchestration and you can use it to both read and [assign values](http://msdn2.microsoft.com/en-us/library/ms963270.aspx) to a message which is super useful! **Basically I don't see a valid reason for bringing more complexity into your solution by adding another library** - as long as you're just going to read or set value using XPath. 

However there is one trick that you should know of when it comes to reading a text value from a node. Basically you have to use both the [string()](http://msdn2.microsoft.com/en-us/library/ms256180.aspx) and   
text() XPath functions. Both [Charles Young](http://geekswithblogs.net/cyoung/archive/2006/12/12/100981.aspx) and [Yossi Dahan](http://www.sabratech.co.uk/blogs/yossidahan/2006/09/returning-text-only-from-xpath-in.html) has good post on this subject. Also if your new to writing XPath expressions for complex schemas with loads of namespaces and stuff (like schemas in BizTalk) [this post](http://www.webhostingsearch.com/blogs/richard/nevermind-the-xml-namespaces-in-xpath-expressions/) could be useful for you.

Finally a nice tool for writing and testing small XPath expression inside Visual Studio (if you don't want to spend x minutes waiting for XmlSpy to start up ...) is [XPathmania](http://www.codeplex.com/MVPXML/Release/ProjectReleases.aspx?ReleaseId=4894). Read about it [here](http://donxml.com/allthingstechie/archive/2006/07/07/2792.aspx) - I use it all the time!
