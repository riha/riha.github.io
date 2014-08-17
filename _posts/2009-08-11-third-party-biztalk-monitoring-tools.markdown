---
date: 2009-08-11 15:18:11+00:00
layout: post
title: "Third party BizTalk monitoring tools"
categories: [BAM, BizMon, BizTalk 2006, BizTalk 2009, Monitoring, Tools]
---

<blockquote>  
> 
> **Update 2012-03-28**        
When looking into BizTalk monitoring and overall governance tools for BizTalk, don’t miss [BizTalk360](http://www.biztalk360.com/). BizTalk 360 wasn't available when this post was written and has some really compelling features. 
> 
>    
> 
> **Update 2010-09-30:** BizMon is now owned and developed by [Communicate Norway](http://www.communicate.no). They have renamed, and further developed the product, to IPM (Integration Monitoring Platform) – check it out [here](http://ipm.communicate.no/exciting-news).
> 
> </blockquote>

 

I’ll start this post by clarifying two important things

 

  
  1. I am involved in the development and marketing of “BizMon”. Therefore I am biased and you have to decide for yourself if that affects the content of the post. As always it is best to [try it for yourself](http://bizmontool.com/buy) and see if it is useful for you. 
   
  2. I have talked about BizTalk monitoring tools in a previous post and my goal then was then to start a an open source project. That did not happened and you can read why in the update to [that post](http://www.richardhallgren.com/aggregated-monitoring-of-biztalk-solutions-using-bizmon/). 
 

### Why “monitoring” for BizTalk?

 

![image](../assets/2009/08/image1.png) I have worked as a BizTalk developer for many years but it was not until I really got in to maintaining a large integration solution that I realized that the tools I really needed was not there. I found myself using the following “tools” and techniques over and over again.

 

  
  1. Open the BizTalk Administration Console and query for suspended messages, running instances, routing errors etc, etc.      

But as I had to pull for this information it took time and discipline (two things I’m short of) to quickly find out when errors occurred.

  
   
  2. I used the HAT to try and find out when the last messages was sent and received on the different applications. This gave me a “guarantee” that things worked as I accepted and that the solution had a “pulse” – messages at least moved back and forward.

The problem is that the HAT tool is bad and it is hard to find what one is looking for (It is a bit better in BizTalk 2009 but it is still tricky to get useful information out of it.)

  
   
  3. Some of the integrations in our environment used BAM to track messages and their state.      

The problem was that all solutions was developed by either myself or different consultants. This made it hard to get everyone to use the same tracking. It was also hard to convince management to go back and try and “instrument” old working integrations with BAM tracking.

  
 

At the same time as we had the “tools” and techniques mentioned above available, management had the following requirements for us.

 

  
  1. Start working on fixing an error _within 10 minutes_ after it occurred _24/7 all 365 days_ … 
   
  2. Be able to delegate simple monitoring task to support personnel (a help desk). 
   
  3. Not have to actively “pull” for information but be quickly altered of errors and get the information “pushed” to us.      

The idea was that this would would save time as people don’t have to look for errors when everything is working fine. Time that people can use for other tasks …

  
   
  4. Enable reporting so we can provide systems owners and other interested people with information on how much data has been sent received to the systems and parties they care about. 
 

All the above lead up to the realization that we needed some sort of tool.

 

### What are the existing options for BizTalk monitoring tooling?

 

At the time we started looking for options all we could find was [System Center Operations Manager (SCOM)](http://www.microsoft.com/systemcenter/operationsmanager/en/us/default.aspx). We looked at [SCOM BizTalk Management Pack](http://msdn.microsoft.com/en-us/library/ee308798%28BTS.10%29.aspx) and decided that _for us_ this was not the right solution. It was too big, too complicated and it would be to hard to get it to the what we wanted to do.

 

<blockquote>  
> 
> The decision to not use SCOM I think was right for us. We wanted something leaner and more specialized. I am however **_not saying _**that it is the right decision for you.
> 
>    
> 
> If you are successfully suing SCOM to monitor BizTalk I would love to [hear about it](mailto:richard.hallgren@gmail.com)!
> 
> </blockquote>

 

### What we ended up with

 

We ended up building [BizMon](http://bizmontool.com/). It does what we need and our help desk can now basically monitor about 100 different BizTalk application themselves. At the same time they do all the other support task they have to do. When something happens (and it does …) they are the first to know. Some easy tasks they can solve themselves, otherwise they make sure to notify the users and quickly call the developer that knows more and can help them.

 

Support personnel can now also setup custom reports that users can subscribe to, all based on BAM that they now easily can interject tracking points in existing solutions – both new and old ones.

 

As I said. This worked out out good and helped us. If you think that it could work for you as well – [give it a try](http://bizmontool.com/buy).

 

I am also really interested to how you have solved similar requirements as we had with your own tool or other solutions.

 

### What else is there?

 

Recently [FRENDS](http://www.frends.com/) released a beta version of their [FRENDS Helium](http://www.frends.com/product/monitoring-technologies/) product that looks promising could potentially solve a lot of the same issues that BizMon does and that I have discussed in this post.

 

Check it out and let us know what you think.
