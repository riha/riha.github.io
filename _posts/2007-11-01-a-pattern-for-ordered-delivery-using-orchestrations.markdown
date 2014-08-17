---
date: 2007-11-01 13:37:46+00:00
layout: post
title: "A pattern for Ordered Delivery using orchestrations"
categories: [BizTalk 2006]
---

[Ordered Delivery](http://msdn2.microsoft.com/en-us/library/aa559637.aspx) is a great feature of BizTalk 2006. The problem is however that as soon as one introduce a orchestration in the process it doesn't work. The Ordered Delivery option on ports in BizTalk 2006 ensures two things today: 

  1. Messages are published to the MessageBox in the same order as they were consumed by the Receive Port.  
  2. Messages are consumed from the MessageB0ox and published to the end destination by the send port in the same order as they were persisted in the MessageBox.

# What's the problem?

Fine. But if we introduce an orchestration each message being persisted in the  the MessageBox will start it's own orchestration instance. These instances could (and in many cases will) finish in different order than they started. This means that we loose the correct order of the messages one they are persisted back to the MessageBox from the orchestration instance. 

The above "limitation" is well known and the solution to this has always been a [Sequential Orchestration](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/bts_2004wp/html/956fd4cb-aacc-43ee-99b6-f6137a5a2914.asp) pattern (also called Singleton Orchestration). Basically this correlates messages from for example a specific Receive Port of a particular Message Type. This ensures that only one instance of the orchestration will be started and we can keep the order of the messages. We've experienced a lot of problems using this this kind of solution for Ordered Delivery - all from [Zombies](http://msdn2.microsoft.com/en-us/library/bb203853.aspx) to them using huge amounts of memory and so on. 

# Microsoft's new solution

Now [![](../assets/2007/11/windowslivewriterapatternforordereddeliverythatworksfinal-c24buntitled31.gif)](http://msdn2.microsoft.com/en-us/library/Bb851740.1542441d-d33a-4634-898f-c89efb0d94fa(en-us,MSDN.10).gif)it finally looks like this problem is about to be solved! Microsoft released a [white paper](http://msdn2.microsoft.com/en-us/library/bb851740.aspx) recently (download it [here](http://www.microsoft.com/downloads/details.aspx?FamilyID=02c5fd53-fee9-44fc-a780-5d1d34ee8754&displaylang=en) - found it via [Richard Seroter’s blog](http://seroter.wordpress.com/)) to solve these problems in a other way. It basically means that a pipeline will stamp the messages with a sequence number as they enter BizTalk (the messages are then in order as we're then using Ordered Delivery on the port). Then one can have as many orchestration as one like processing these messages and publish them back to the MessageBox (now possibly out of order but with a sequence number stamped on them). The last business orchestration will set a "destination" property that will route the message to a resequence orchestration. This orchestration resequences the messages and decides by checking the last sequence number it sent out if the current message should be sent out or put back on queue.

# Conclusion

My biggest concern in this solution is that is still based on a singleton. We've had cases where where the send procedure been extremely slow (for example when we used SOAP and had a slow Web Service in the other end), then the orchestration has built up in memory as it queued messages internally. However it looks like this solution is well thought through with a "flush queue" functionality, stop message, some ideas on how to handle errors (remember that if the singleton fails and you don't handle this your processes stop) and so on. 

[Read it](http://msdn2.microsoft.com/en-us/library/bb851740.aspx) and please let me know what you think!
