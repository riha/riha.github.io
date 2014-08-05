---
date: 2008-06-09 07:14:04+00:00
layout: post
title: "Does BizTalk have man-boobs?"
categories: [Architecture, BizTalk 2006, R2, Webcast]
---

I've just finished watching [this webcast](http://www.infoq.com/presentations/soa-without-esb) from [QCon 2008](http://qcon.infoq.com/sanfrancisco-2008/conference/) with [Martin Fowler](http://martinfowler.com/) and [Jim Webber](http://jim.webber.name/). It's basically their view on how integration middleware is used today and how we plan and implement our SOA and ESB project. 

 

Their main point is that we use much to bloated middleware (BizTalk is mentioned as an example here) and that we should have a more agile approach to implement SOA and ESBs. They've used all the agile ideas (testing, isolated testable functionality, deliver small and often, continuous builds etc, etc) and applied them to integration - fair enough. I totally agree that trying to convert your complete enterprise architecture into a SOA architecture is a guaranteed failure. This is also [something we heard for a while now from others](http://www.microsoft.com/biztalk/solutions/soa/overview.mspx#EZB) as well.

 

I do also agree that BizTalk is a huge platform and that it isn't perfect in all aspects. IMHO it does however give us some important advantages compared to a custom coded message bus and services. I'll try and list a few of them below.

 

  
  1. **Fixed architecture**         
We don't have invent the wheel every time. BizTalk is a product with an [architecture](http://msdn.microsoft.com/en-us/library/aa561521.aspx) that one have to learn and use. There are times when this is a pain (did I hear low latency and BizTalk persistence points?) but it's also a huge kick start to all projects once you learnt it. Once you figured out how you use the products you'll actually have something up and running in no time.         
       
Isn't an early delivery that we can test something good? I'm sure I can deliver a BizTalk based integration faster that some can using custom code when starting from scratch.         

   
  2. **Drag-and-drop**         
There is a learning curve to BizTalk and all it's tools but once one gotten over this one can move really fast, even without a deep understanding of .NET and software development (there are of course both pros and cons to this). I've seen projects with 50+ integration processes (to me that's a big, complex project) where we actually used people fresh out of school, spent two weeks to teach them basic BizTalk and had them deliver critical parts of the projects. I'd like to see that happen custom coded ESB project with thousands lines of code ...         
       
You probably get a nice design and implementation if you can hire 10 top developers and a couple of architects, but that isn't always possible.         

   
  3. **Tools          
**Does a custom code, lean approach, really scale in this scenario? Do you take the time to pause and build that management and configuration tool that you don't get with a custom code project? I don't say that we got the perfect view and control of our processes and messages in BizTalk but at least we got **some** control. At least I got the [BizTalk Administration Console](http://technet.microsoft.com/en-us/library/aa578089.aspx) to let me see how my different application are doing, what messages and process etc that got suspended. At least I got the BAM framework where I can configure a tracking and monitoring in no time (usually ...) etc, etc.   

   
  4. **It works          
**Say your implementing a process that receives purchase orders and that these orders might contain orders for a couple of millions dollars. Do you want to be developer that tells you boss that you think you might have lost a message due to a exception in your custom code? Of course you have 90% test coverage and continuous integration but you never tested for this exception case ... I don't want to be that developer/architect. 
 

I don't say don't test. I'm very pro testing and I really feel that agile is the right approach. I'm just saying I need something tested and safe to build this super critical solutions on. Something that I know works and that I can be really productive on and start solving business cases from minute one.

 

What do you think? Does BizTalk have man-bobs and is that only a bad thing? And does Martin Fowler really have leather pants on?    
