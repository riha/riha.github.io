---
date: 2007-03-02 08:31:13+00:00
layout: post
title: "Weekly sum up"
categories: [Architecture, BizTalk 2006]
---

I'll start trying to post a weekly sum up of BizTalk, .NET topics I've come across during the week. We'll see how goes as I'm not the most constant blogger ...

However I worked with mainly three things this week. 

### Error handling and General Exception

I've tested some ideas relating to an error handling pattern we like to implement in a one of our major integration projects. We've looked at how the new BizTalk 2006 [Failed Message Routing](http://msdn2.microsoft.com/en-us/library/aa578516.aspx) fits in with our project. The idea is to have and Orchestration listening to the Error Message, log these and then put the failing message parts to file. We'll then have a system that picks up the failed messages, launches them in an editor and makes it possible to resend the message after it's been edited. 

Problem arises when we get to handling exceptions in Orchestrations. Orchestrations doesn't have the possible to use Failed Message Routing as ports does (I guess that ok, we might want handle different errors in different ways and so on.). However that means that we have to catch an error and create our own Error Message to submit to the message data box for further routing to the Orchestration handling errors (the one that logs and puts the message to file.) So far so good as long as we don't get an [General Exception](http://geekswithblogs.net/cyoung/archive/2004/04/26/4345.aspx)! Usually when getting an General Exception, and we don't catch it, the message gets suspended and we get a some error details giving us an idea of what went wrong. However as soon as one catches a General Exception we loose all information about the error ... We've still haven't found a good way of handling these errors. We just can't afford loosing that error information! 

General Exceptions are still a mystery to me. I guess that are there so BizTalk has a chance in catching exception that aren't raised from .NET based code. But what kind of errors within an orchestration raises these kind of exceptions? I know a failure in a mapping does, what else? I'd really like this scenario to better documented. The error handling patter is based on a chapter in the [Pro BizTalk 2006 book](http://www.amazon.com/Pro-BizTalk-2006-George-Dunphy/dp/1590596994) (which is a excellent book in my opinion - buy it!) but the General Exception and how to deal with it isn't discussed there either. **Any ideas, book, articles are highly appreciated!**

### Validation

One important thing to think of in a BizTalk solution **is to not let anything either in or out that doesn't validate** (ok, there are exception to this, but generally speaking)! BizTalk has great built in support for this in the [XML Validator Pipeline Component](http://msdn2.microsoft.com/en-us/library/aa578187.aspx) (you might also want to have a look at [this code](http://thearchhacker.blogspot.com/2004/09/cool-xsd-validation-function-for.html)). However when working with this it's important to understand what one is validating against and it suddenly even more important to understand every details in the schemas (external system owners usually like some technical explanation when your telling them that their messages don't validate in your pipeline ;)). Things we run into this week is the [elementFormDefault](http://www.w3.org/TR/xmlschema-0/#NS) attribute. The following reading help me understanding what the attribute does:

  * [http://www.w3.org/TR/xmlschema-0/#NS](http://www.w3.org/TR/xmlschema-0/#NS)
  * [http://www.hanselman.com/blog/XmlValidating...XmlReaders.aspx](http://www.hanselman.com/blog/XmlValidatingReaderProblemsOverDerivedXmlReaders.aspx)
  * [http://geekswithblogs.net/dmillard...12935.aspx](http://geekswithblogs.net/dmillard/archive/2004/10/20/12935.aspx)
  * [http://blogs.msdn.com/ebattalio/archive/2006/03/03/543154.aspx](http://blogs.msdn.com/ebattalio/archive/2006/03/03/543154.aspx)

Another thing we ran into was white space handling and  the _xml:space_ attribute. Apparently if one likes to have a node with a space in it BizTalk removes this if the element doesn't have the _xml:space_ attribute. so _<node> </node>_ will come out as _<node></node>_ - sound familiar? 

But if the schema doesn't declare that the node will have a xml:space attribute the validation will fail! To get this working one has to get the schema declaring the the xml:space attribute and then reference it like [this example](http://www.jezuk.co.uk/cgi-bin/view/jez?id=2306). The schema from w3c (if you don't write your own like in the article) is located [here](http://www.w3.org/2001/xml.xsd). 

### End-to-end tracing in a SOA

I'll make this short even if it should be the longest part in this post. Basically we're trying to archive the following:

Our solution send loads of different messages types between five different BizTalk servers. The client likes to be able to have full text search within these messages and to also be able to see all the messages in each interchange within a server. 

So say for example that we receive and _Order message_ in a flat file format. This is transformed in to a Xml message that is then routed down to two other different BizTalk servers. It should then be possible for the client to start an application, click on the _Order message_ type, enter for example the _order number_ (an element i in the message) and see the the full content of the different files within the interchange (in this example that would be the flat file and the Xml file) where that _Order number_ is found. 

Basically it's does what the HAT does (with full text search and a custom GUI). In the first phase of the project we'll have it work per server, but in the final solution this should perform over all servers ... I'll come back to this in a later post. In the mean time listen to [this episode of Hanselminutes on end-to-end tracking](http://www.hanselminutes.com/default.aspx?showID=68). This will be a challenge in every service orientated architecture ...

### Finally

I've sold my [iPod Nano](http://www.apple.com/se/ipodnano/) and ordered the [Creative Vision Zen:M](http://www.creative.com/products/mp3/zenvisionm/). Now I'll catch up on all those [dnrTV Webcasts](http://www.dnrtv.com/)! I'll also make sure to watch everyone of the [BizTalk 2006 Webcasts](http://richardhallgren.com/blog/?p=25) during my commute to work.

Let me know if you found some of this information useful and I'll try harder to post some like this every Friday.
