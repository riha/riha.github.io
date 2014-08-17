---
date: 2007-07-31 07:38:33+00:00
layout: post
title: "Developing and debugging orchestrations using DebugView and SOAPTrace tools"
categories: [BizTalk 2006, Tools]
---

The main problem I have with developing BizTalk orchestrations is the fact that I'm so blind when it comes to follow the runtime processing. Using the [debugger](http://msdn2.microsoft.com/EN-US/library/aa577988.aspx) that is part of the HAT tool is slow and clumsy which IMHO makes the tool almost useless in everyday development. But there is hope!

## DebugView

[Sysinternals](http://www.microsoft.com/technet/sysinternals/default.mspx) (_Windows Sysinternal_ now - Microsoft bought them last year) [DebugView](http://www.microsoft.com/technet/sysinternals/Miscellaneous/DebugView.mspx) is a wonderful little tool and is especially useful when it comes to figure out what's actually going on inside an orchestration. Basically the tool listens to system wide debug output. From an orchestration it's possible to write debug information using the .NET _[System.Diagnostics](http://msdn2.microsoft.com/en-us/library/system.diagnostics.aspx)_ namespace and the [_Debug_](http://msdn2.microsoft.com/en-us/library/system.diagnostics.debug.aspx) or _[Trace](http://msdn2.microsoft.com/en-us/library/system.diagnostics.trace.aspx)_ class.

### Decide on how to filter

There are a couple of handy little tricks that makes DebugView a even better in BizTalk development. First one should try and have something in the debug messages that makes it possible to filter and distinct one's own (as DebugView listens system wide debug output all running applications debug info will show up). Our team decided on "[Sogeti](http://www.sogeti.com)" (our company name) for all our development and to have a method in our BaseLibrary component that outputs something like the below (the BaseLibrary is a small little .NET component with a couple of very useful classes we use company wide in our BizTalk related development).
    
    <div><span style="color: #000000; ">System.Diagnostics.Debug.WrtieLine(</span><span style="color: #000000; ">"</span><span style="color: #000000; ">Sogeti, your debug/trace message here</span><span style="color: #000000; ">"</span><span style="color: #000000; ">)</span></div>







This make is possible to have a filter in DebugView and to for example have it look something like this.




[![](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1debugview1-thumb13.jpg)](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1debugview133.jpg)




### Trace full context of messages




Another little useful trick is to trace the full context of messages. This is done be storing the message in a _XmlDocument_ typed variable and get the _OuterXml_ property of that variable. The below code is and example of this.






    
    <div><span style="color: #000000; ">tempXml </span><span style="color: #000000; ">=</span><span style="color: #000000; "> msgFindPartyRequest.parameters;
    System.Diagnostics.Trace.Write(System.String.Concat(</span><span style="color: #000000; ">"</span><span style="color: #000000; ">Sogeti, msgFindPartyRequest: </span><span style="color: #000000; ">"</span><span style="color: #000000; ">, tempXml.OuterXml));</span></div>







Example of a full message trace.




[![](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1debugview2-thumb13.jpg)](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1debugview253.jpg)




### To Trace or Debug - that's the question




As stated earlier both _System.Diagnostics.Debug_ and _System.Diagnostics.Trace_ has methods (_Write_, _WriteLine_ and so on) for outputting debug information. However there is only one that stays in your compiled code when switching from Development to Deployment compilation mode (guess which one ;)). So make sure you choose the right class for the right information. I like to have some critical messages left using Trace and be able to trace these even on the test and production server.




### DebugView on a remote desktop




When running DebugView on an other server (say a test or a production server) using [Remote Desktop](http://www.microsoft.com/windowsxp/downloads/tools/rdclientdl.mspx) I've found that ones has to use the [console user](http://firechewy.com/blog/archive/2005/10/18/926.aspx) on the server. This kind of makes sense as if we're connection "normally" we're creating a virtual session and that's not were the debug information is written to.




## Microsoft SOAP Toolkit 3.0




This is a totally [other tool](http://www.microsoft.com/downloads/details.aspx?FamilyId=C943C0DD-CEEC-4088-9753-86F052EC8450&displaylang=en) than DebugView but I thought it fit here any way. It's a handy tool when working with SOAP based messages. Without it's very hard to actually figure out how the raw request and response message look and why your orchestration web service is acting the way it does.




[![](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1soaptrace1-thumb3.jpg)](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1soaptrace123.jpg)




The trace tool is placed as a [reverse proxy](http://en.wikipedia.org/wiki/Reverse_proxy) between BizTalk and the Internet. It's setup by telling the tracing tool which localhost port to listen at (for example 9091 as in the example below) then we'll redirect to that port by changing the setting in the BizTalk send port. 




[![](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1soapsendport1-thumb2.jpg)](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1soapsendport122.jpg)




Finally we'll set up the trace tool to listen to port 9091 and redirect all traffic to our web service URL at port 80 in this case. So basically the trace tool will catch all the traffic hitting the 9091 port and forward it.




[![](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1soaptrace2-thumb2.jpg)](../assets/2007/07/windowslivewriterdevelopinganddebugingorchestrationsusing-dfd1soaptrace222.jpg)




That's it! This is probably basic stuff for most of you but hopefully it's useful for someone!




I've also noticed that the SOAP Toolkit is deprecated by Microsoft and I'd like to hear if anyone used something else (like [Fiddler](http://www.fiddlertool.com/fiddler/) example) for tracing SOAP messages. I'd also love some other tips, tools and methods you use for debugging BizTalk orchestrations.
