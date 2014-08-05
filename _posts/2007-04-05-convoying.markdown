---
date: 2007-04-05 07:21:51+00:00
layout: post
title: "Convoying"
categories: [BizTalk 2006]
---

Convoying is one of BizTalk's real strengths but it has a lot of pitfalls (I'm talking performance, zombies etc). [This article](http://msdn2.microsoft.com/en-us/library/ms942189.aspx) is really good at explaining the different patterns used for creating convoys. It also makes some deep dives into how the subscriptions are solved, why zombies are created and how to deal with them. 

Even if you feel you understand the convoy patters from before the part about how BizTalk solves the subscriptions for correlations (the part called _Basic Convoy Theory_) is great.

**Using sequential convoy to handle ordered delivery**

A big selling point in BizTalk 2006 is it's ability to handle [Ordered Delivery](http://msdn2.microsoft.com/en-us/library/aa559637.aspx). It's important however to understand that this setting (on the Receive and Send port) only works in a pure messaging scenario (a scenario without orchestration, just passing messages between ports). To get order delivery in a scenario using orchestrations one has to use the sequential convoy pattern (basically forcing the orchestration to only one instance on one thread). This [Webcast](http://msevents.microsoft.com/cui/webcasteventdetails.aspx?eventid=1032288276&culture=en-us) explains this in depth and also deals with some of the different problems that are related to the issue. Problems like performance of course, but also the requirement for receive adapter (on the send side all adapters support ordered delivery) for enabling ordered delivery (you'll have to use MSMQ, MQSeries or specific scenarios of File, SOAP or HTTP).

Both convoying and ordered delivery are important concepts to understand in depth to be able to make the right decisions in a BizTalk 2006 solution.
