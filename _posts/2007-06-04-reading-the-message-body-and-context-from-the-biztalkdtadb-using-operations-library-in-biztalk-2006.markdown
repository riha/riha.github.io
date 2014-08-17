---
date: 2007-06-04 14:18:20+00:00
layout: post
title: "Reading the message body and context from the BizTalkDTADb using operations
  library in BizTalk 2006"
categories: [BizTalk 2006]
---

**Update 2007-07-05:** The example project used in the post can be [downloaded from here](http://www.richardhallgren.com/blogfiles/BizTalkDTAReader.zip).




The operations dll (_Micrsoft.BizTalk.Operations_) is one of the new bits in BizTalk 2006 that at least I haven't heard much about (most of you probably find in the _C:\Program Files\Microsoft BizTalk Server 2006_ folder). However it's a library with a lot of useful functionality.  

In this post I'll focus on how it's possible to use the library to get hold of message parts and message context from the BizTalk tracking database (usually called the _BizTalkDTADb_). If you're unfamiliar with the architecture of the tracking in BizTalk [this article](http://msdn2.microsoft.com/en-us/library/aa559554.aspx) is a good place to start.  

## What used to be the problem?

In BizTalk 2004 one soon got into problems when trying to read the message parts and the message context from the tracking database. The problem is that the the Xml is compressed (something that makes totally sence - Xml is a perfect candidate for compression). To my knowledge no one has found a good way to decompress the message context. There's however a way to decompress **the message parts** (and only the parts) that [Rob posted on in the BizTalk newsgroup](http://groups.google.com/group/microsoft.public.biztalk.general/browse_thread/thread/599c038807317802). But this method doesn't work on the compressed context of the same message that the parts belong to! One could assume that the same method could be used for both compression and decompression but I haven't got it to work for the context of the message (read about my frustration [here](http://groups.google.com/group/microsoft.public.biztalk.general/browse_thread/thread/19a232369218b2f9))  

## What's wrong with WMI and _MSBTS_TrackedMessageInstance_?

So the option that was left to us before BizTalk 2006 for reading all the message parts as well as the message context was to use the [MSBTS_TrackedMessageInstance WMI scrtipt](http://msdn2.microsoft.com/en-us/library/aa546797.aspx) and save everything down to file. The problem with this approach is that it's slow and ugly! Say that we like to save a couple of thousand messages from the tracking database. When forced to save the messages to file we'll end up with a slow and ugly solution where writing to file takes ages, then we have to read the content of the different files before cleaning up and deleting the files.  

## Micrsoft.BizTalk.Operations to the rescue

A quick view in [Lutz Roeder's Reflector](http://www.aisto.com/roeder/dotnet/) shows us a couple of interesting methods in the operations dll. However I'll only use the _GetTrackedMessage_ method in this post.  

[![operations](../assets/2007/06/operations-thumb1.jpg)](../assets/2007/06/operations1.jpg)  

I've written a tiny test application that uses the library to read the body part of the message (the meat of the message) and a couple of properties I'm interested in from the context of the message. It looks something like this. If your interested drop me an email and I'll send it. The first screenshot below shows an example of reading the _InterchangeID_ from the context of a tracked message.  

[![OperationsTest2](../assets/2007/06/operationstest2-thumb2.jpg)](../assets/2007/06/operationstest22.jpg)  

This screenshot shows an example of reading the full body of a tracked message from the tracking database. Try doing this with less then 10 lines of code using the _MSBTS_TrackedMessageInstance_ script! 

[![OperationsTest1](../assets/2007/06/operationstest1-thumb1.jpg)](../assets/2007/06/operationstest11.jpg)  

There is really nothing to the application, reading a tracked message using the _MessageID_ will return an object implementing _[IBaseMessage](http://msdn2.microsoft.com/en-us/library/microsoft.biztalk.message.interop.ibasemessage_members.aspx)_ and we basically read the _[BodyPart](http://msdn2.microsoft.com/en-us/library/microsoft.biztalk.message.interop.ibasemessage.bodypart.aspx)_ property of - it really couldn't be any easier. 
    
    <div><span style="color: #0000FF; ">public</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">static</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">string</span><span style="color: #000000; "> GetMessageBodyByMessageID(</span><span style="color: #0000FF; ">string</span><span style="color: #000000; "> dbServer, </span><span style="color: #0000FF; ">string</span><span style="color: #000000; "> dbName, Guid messageID)
    {
        TrackingDatabase dta </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> TrackingDatabase(dbServer, dbName);
        BizTalkOperations operations </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> BizTalkOperations();
        IBaseMessage message </span><span style="color: #000000; ">=</span><span style="color: #000000; "> operations.GetTrackedMessage(messageID, dta);
        </span><span style="color: #0000FF; ">string</span><span style="color: #000000; "> body </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">string</span><span style="color: #000000; ">.Empty;
        </span><span style="color: #0000FF; ">using</span><span style="color: #000000; ">(StreamReader streamReader </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> StreamReader(message.BodyPart.Data))
        {
            body </span><span style="color: #000000; ">=</span><span style="color: #000000; "> streamReader.ReadToEnd();
        }
    
        </span><span style="color: #0000FF; ">return</span><span style="color: #000000; "> body;
    } </span></div>




I'd be very interested in how people use the operations library both when it comes to read and use tracked messages, but also in other ways! Use the comments to tell me and other readers how you use it your solutions! 
