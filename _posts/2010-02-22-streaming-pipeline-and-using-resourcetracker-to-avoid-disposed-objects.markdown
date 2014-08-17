---
date: 2010-02-22 08:50:16+00:00
layout: post
title: "Streaming pipeline and using context ResourceTracker to avoid disposed streams"
categories: [BizTalk, BizTalk 2006, BizTalk 2009, Pipelines, R2]
---

Recently there’s been a few really good resources on streaming pipeline handling published. You can find some of the [here](http://msdn.microsoft.com/en-us/library/ee377071(BTS.10).aspx) and [here](http://msdn.microsoft.com/en-us/library/ff384124(BTS.10).aspx).

 

The [Optimizing Pipeline Performance](http://msdn.microsoft.com/en-us/library/ee377071(BTS.10,classic).aspx) MSDN article has two great examples of how to use some of the [Microsoft.BizTalk.Streaming.dl](http://technet.microsoft.com/en-us/library/microsoft.biztalk.streaming(BTS.20).aspx) classes. The execute method of first example looks something like below.

 
    
    public IBaseMessage Execute(IPipelineContext context, IBaseMessage message)
    {
        try
        {
            ...
            IBaseMessageContext messageContext = message.Context;
            if (string.IsNullOrEmpty(xPath) && string.IsNullOrEmpty(propertyValue))
            {
                throw new ArgumentException(...);
            }
            IBaseMessagePart bodyPart = message.BodyPart;
            Stream inboundStream = bodyPart.GetOriginalDataStream();
            VirtualStream virtualStream = new VirtualStream(bufferSize, thresholdSize);
            ReadOnlySeekableStream readOnlySeekableStream = new ReadOnlySeekableStream(inboundStream, virtualStream, bufferSize);
            XmlTextReader xmlTextReader = new XmlTextReader(readOnlySeekableStream);
            XPathCollection xPathCollection = new XPathCollection();
            XPathReader xPathReader = new XPathReader(xmlTextReader, xPathCollection);
            xPathCollection.Add(xPath);
            bool ok = false;
            while (xPathReader.ReadUntilMatch())
            {
                if (xPathReader.Match(0) && !ok)
                {
                    propertyValue = xPathReader.ReadString();
                    messageContext.Promote(propertyName, propertyNamespace, propertyValue);
                    ok = true;
                }
            }
            readOnlySeekableStream.Position = 0;
            bodyPart.Data = readOnlySeekableStream;
        }
        catch (Exception ex)
        {
            if (message != null)
            {
                message.SetErrorInfo(ex);
            }
            ...
            throw ex;
        }
        return message;
    }





We used this example as a base when developing something very similar in a recent project. At first every thing worked fine but after a while we stared getting an error saying:





<blockquote>
  
> 
> Cannot access a disposed object. Object name: DataReader
> 
> 
</blockquote>





It took us a while to figure out the real problem here, everything worked fine when sending in simple messages but as soon as we used to code in a pipeline were we also [debatched](http://geekswithblogs.net/benny/archive/2007/02/15/106329.aspx) messages we got the “disposed object” problem.





[![image](../assets/2010/02/image_thumb1.png)](../assets/2010/02/image1.png)It turns out that when we debatched messages the execute method of the custom pipeline ran multiple times, one time for each sub-messages. This forced the .NET Garbage Collector to run.





The GC found the XmlTextReader that we used to read the stream as unreferenced and decided to destoy it.





The problem is that **will also dispose the readOnlySeekable-Stream stream that we connected to our message data object**!





****





**It’s then the BizTalk End Point Manager (EPM) that throws the error as it hits a disposed stream object when trying to read the message body and save it to the BizTalkMsgBox!**





### ResourceTracker to the rescue!





Turns out that the BizTalk message context object has a nice little class connected to it called the _ResourceTracker_. This object has a “AddResouce”-method that makes it possible to add an object and the context will the hold a reference to this object, **this will tell the GC not to dispose it!**





So when adding the below before ending the method everything works fine - even when debatching messages!




    
    context.ResourceTracker.AddResource(xmlTextReader);
