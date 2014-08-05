---
date: 2006-12-20 10:09:33+00:00
layout: post
title: "Web service times out before the orchestration completes"
categories: [BizTalk 2006]
---

Today we ran into some problems when making a call to a web service that took more than 90 seconds via the SOAP adapter. After 90 seconds we got a "System.Net.WebException: The operation has timed-out" error in return. It turned out that we had to set the _SOAP.ClientConnectionTimeOut_ context property for the request message. We did this in the message construction using the following code.
    
    <div><span style="color: #000000; ">MyRequestMessage(SOAP.ClientConnectionTimeout) = 200000;</span></div>




I found this [post by Thomas Restrepo](http://www.winterdom.com/weblog/2005/07/17/WebServiceCallTimeoutInBizTalk.aspx) useful for understanding both the problem and solution. Apparently the default value is 90000 (90 seconds) before the adapter times out. This [article on MSDN](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/BTS_2004WP/html/5cab05ab-6848-4f6c-8d11-9abc4dd1d1fa.asp) is also an excellent read when working with web services and BizTalk server.
