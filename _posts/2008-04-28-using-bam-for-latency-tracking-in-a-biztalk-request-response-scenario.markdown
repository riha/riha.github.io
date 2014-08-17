---
date: 2008-04-28 13:35:15+00:00
layout: post
title: "Using BAM for latency tracking in a BizTalk request response scenario"
categories: [BAM,BizTalk 2006,Tutorial]
---

This post will try and explain how BAM tracking can be used in SOAP based request response scenario in BizTalk 2006. It important to notice that some of the issues discussed in the post are specific to the SOAP adapter and are non-issues if the scenario would for example use the the WCF adapter or similar.

 

### Describing the scenario

 

In this case we have a SOAP receive port that receives a request and returns a response. The request is routed to a orchestration that calls three different send ports. These ports then sends new requests to back-end systems and returns responses (communication with back-ends systems are also SOAP based). The three responses are used to build up the final response that is then returned to original receive port as a final response.

 

Our goal is to track the duration between the request and response on each of the ports. The idea is also to find a solution and tracking model that doesn’t have to change if we add or remove ports or add similar processes to track.

 

#### [![scenario](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0bscenario-thumb.jpg)](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0bscenario-2.jpg)

 

#### Defining and deploying the tracking model

 

We’ll start by defining our tracking model in Excel. Our activity contains of the following items:

 

  
  * **InterchangeId** (data item)         
As we won’t correlate all the tracking point into one single row (that would break the goal of having one model for all processes, the model would then have to be specific for one process and it’s specific ports) the interchange id will then tell us what different rows belong together and that describes one process. 
   
  * **ReceivePortName** (data item)         
The name of the receive port. 
   
  * **Request** (milestone item)         
The time the request was either sent or received (depending on if we track a port that received/sent the request using a receive port or send port). 
   
  * **Response** (milestone item)         
The time the response was either sent or received (depending on if we track a port that received/sent it's response on a receive port or send port). 
   
  * **SendPortName** (data item)         
The name of the send port. 
 

After we described the model it’s time to export it to an XML representation and then to use the [BM tool](http://technet.microsoft.com/en-us/library/aa547898.aspx) to deploy it and generate the BAM database infrastructure. You'll find some nice info on this [here](http://msdn2.microsoft.com/en-us/library/aa558802.aspx).

 

### Using the Tracking Profile Editor to bind the model

 

Next step is to bind the model to the implementation using the [Tracking Profile Editor](http://msdn2.microsoft.com/en-us/library/ms946851.aspx). The figure below shows the different properties that were used. Notice that none of the items was bound to the actual orchestration context. All properties are general properties that we track **on the ports**.** **This is important as that gives us the possibility to just add and remove ports to change the tracking.

 

**[![tracking profile using continuation](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0btracking-profile-using-continuation-thumb.jpg)](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0btracking-profile-using-continuation-2.jpg) **

 

****

 

The next figure shows how the tracking of the request milestone event actually happens on either the RP1 port or on any of the three different send ports! If we developed a new process using other ports we could just add it here, no new model required.

 

[![tracking profile configure ports 2](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0btracking-profile-configure-ports-2-thumb-1.jpg)](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0btracking-profile-configure-ports-2-4.jpg)

 

### What about the continuation then?

 

Our final problem is that unless we somehow correlate our request tracking point with our receive tracking point the receive we’ll end up with each tracking point spread over several different rows. In the example below I've marked the request for the RP01 port and the response event on the same port.

 

[![bam portal split results](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0bbam-portal-split-results-thumb-1.jpg)](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0bbam-portal-split-results-4.jpg)

 

The reason for this is of course that BAM doesn’t have a context for the two tracking points and doesn't know that actually belongs together. This differs from tracking in a orchestration were we always are in a context (the context of the orchestration), it’s then easy for BAM to understand that we like to view all the tracking point as one row – when tracking on ports it’s different. Continuation helps us tell BAM that we like have a context and correlate these two points.

 

[![tracking profile using continuation 2](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0btracking-profile-using-continuation-2-thumb-2.jpg)](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0btracking-profile-using-continuation-2-6.jpg)

 

In our case ServiceID is the prefect candidate for correlating the two points. A request and a response will have the same service id. In an other situation we could just as well have used a value from inside the message (say for example an invoice id).

 

**The result is one single row for the request response for each port**. So in our case a complete process (a complete interchange) is shown on four rows (one row for each of the ports). In the example below the first rows shows us the complete duration (and the other tracking data) between the request response to the client. The other rows show the duration for the send ports communication with the back-ends systems.

 

[![bam portal complete results](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0bbam-portal-complete-results-thumb.jpg)](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0bbam-portal-complete-results-2.jpg)

 

This model might not be optimal in an other scenario where your process are more fixed and you can then create a tracking model that is more specific to you actual process. But this solution meets our design goal as we’re now able to just add and remove port using the tracking profiler to track new port in completely new processes without having to go back and change the tracking model.

 

<blockquote>  
> 
> [![note](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0bnote-thumb.gif)](../assets/2008/04/windowslivewriterusingbamforlatencytrackinginabiztalkrequ-9c0bnote-2.gif) NOTE: When configuring BAM to track a port the _[MessageType](http://msdn2.microsoft.com/en-us/library/aa561650.aspx)_ is actually promoted. This causes some problems in combination with the SOAP based ports that have been published using the Web Services Publishing Wizard. Saravana writes about this [here](http://www.digitaldeposit.net/blog/2007/08/soap-adapter-and-biztalk-web-publishing.html) and all his articles on this subject is a must read when working with SOAP ports. The problem however comes down to that the Web Services Publishing Wizard generates code that puts the wrong _DocumentSpecName _in the message context and that causes the _XmlDisassembler_ to fail (it tricks the _XmlDisassembler_ to look for a _MessageType_ that doesn't exists).
> 
>    
> 
> This usually isn’t a problem (unless you like to use a map on a port) but as BAM will force the port to promote the _MessageType_ based on the _DocumentSpecName _we’ll have to fix this. Saravana has two solutions to the problem and I find the one that replaces the _DocumentSpecName_ with a null value and lets the _XmlDisassembler_ find the _MessageType_ to work well.
> 
> </blockquote>
