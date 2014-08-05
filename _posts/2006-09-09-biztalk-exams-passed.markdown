---
author: Richard
comments: true
date: 2006-09-09 10:44:33+00:00
layout: post
slug: biztalk-exams-passed
title: BizTalk exams passed!
wordpress_id: 19
categories:
- .NET
- BizTalk 2006
---

Yesterday I passed both the 2004 exam ([074-135: Developing E-Business Solutions Using Microsoft BizTalk Server 2004](http://www.microsoft.com/learning/exams/74-135.asp)) and the new 2006 BizTalk exam (070-235: TS: [Developing Business Process and Integration Solutions by Using Microsoft® BizTalk® Server 2006](http://www.microsoft.com/learning/exams/70-235.asp))!

### Webcasts

When I first started studying for the exam I hadn't really worked with BizTalk. These Webcasts provided an easy introduction to the basics of the products:

  1. [Getting up to speed with BizTalk Server for .NET Developer](http://msevents.microsoft.com/CUI/EventDetail.aspx?EventID=1032247084&Culture=en-US)  
  2. [BizTalk Orchestration](http://msevents.microsoft.com/CUI/WebCastEventDetails.aspx?EventID=1032262826&Culture=en-US)  
  3. [Biztalk Server 2004 Architecture](http://msevents.microsoft.com/CUI/WebCastEventDetails.aspx?EventID=1032262823&EventCategory=3&culture=en-US&CountryCode=US)

The Webcasts are help by [Scott Woodgate](http://blogs.msdn.com/scottwoo/). He used to be the product manager for BizTalk and knows it inside out (besides being a skilled presenter).

### Installation

Next thing I did was to install a Virtual PC with a Windows 2003 server. Then I used [this list](http://blogs.msdn.com/luke/articles/211384.aspx). The list saved me from some major pitfalls while installing BizTalk (especially 2004 is known to be a messy installation)! 

The only problem I ran into during the installation was a collation error on the SQL server (BizTalk Server does not support case-sensitive collations, use _Latin1_General_CI_AS_).

### Tutorials

Then I worked my way through [these tutorials](http://www.microsoft.com/downloads/details.aspx?familyid=9C64562C-3FA7-49BA-885E-82213D00776E&displaylang=en). They cover a big part of the product. I can also recommend reading the [BizTalk Unleashed 2004](http://book.itzero.com/read/microsoft/0505/Sams.Microsoft.BizTalk.Server.2004.Unleashed.Nov.2004.eBook-LiB_html/) book. Make sure to understand everything in the tutorials as most of it actually will show up on the exam. Make sure to pay extra attention to deployment and the development of business rules! Of course one also has to understand the basics of Orchestration and XML mapping.

### Exams

To pass the exams you'll have to **understand the whole architecture** and when messages are written to the message database (_dehydrate_ and _hydrate_). **Understand pipelines** - develop your own pipeline and deploy it to really understand this part (remember all the interfaces etc). While developing pipeline use the different **pipeline testing tools** that are available (pipeline.exe etc). Read about **message patters** and particularly the _convoy pattern_ etc. You will need to know most of the **mapping functiods** and what they are used for. Use and understand the _import_, _include_ and _redefine_ **functionality in the schema editor**. 

One big miss I did while studying was the security part and what **different BizTalk users groups that exists**. Use [this list](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/bts06coredocs/html/a01603bd-4105-4691-819d-de43b00b40f3.asp) and learn the most important ones (both the Windows and the SQL Server Roles). To pass the exam you don't really have to know that much about the specifics of _BAS_, _BAM_ ands _HWS_ - you do need to know what the different solutions are used for and what their limits are.

The new exams are a bit different as they involve setting up a lot of action-lists where one drag and drop actions to create a list of actions for completing a described task. No information about how many actions are required in the finished list etc. However the 2006 is "easier" as it deals a lot with actual development tasks and not so much with security things and details as the old ones (like specific user groups and interfaces etc). 

A few tips if your planing to take the 2006 exams is that you study the new **BTSTask tool**, developing business rules using the **Business Rule Composer** tool and BAM (Business Activity Monitoring) and especially **the process of configuring BAM**.
