---
date: 2008-06-26 07:25:33+00:00
layout: post
title: "Removing XML namespaces - revisit"
categories: [BizTalk 2006, R2]
---

I have a [old post on removing XML namespace](http://www.richardhallgren.com/removing-namespace-from-outgoing-messages/) from outgoing messages using XSLT in a map on the send port. Removing XML namespace is usually a late requirement that shows up during integration tests with for example legacy systems that has problems reading XML and only finds XML namespaces messy and confusing and wants it removed. 

 

The post recently got commented by [Jeff Lynch](http://codebetter.com/blogs/jeff.lynch/) (one of the [codebetter.com](http://codebetter.com/) bloggers) asking me why I just didn't create a schema without any XML namespace in it to represent the outgoing schema (see figure below) and then map to that in the send port.

 

[![Removing XML namespaces - revisit](../assets/2008/06/windowslivewriterremovingxmlnamespacesrevisit-834dremoving-xml-namespaces-revisit-thumb.png)](../assets/2008/06/windowslivewriterremovingxmlnamespacesrevisit-834dremoving-xml-namespaces-revisit-2.png)

 

Say for example that we have incoming messages like the one below with namespaces.

 
    
    <div><span style="color: #0000FF; "><</span><span style="color: #800000; ">ns0:BlahRoot </span><span style="color: #FF0000; ">xmlns:ns0</span><span style="color: #0000FF; ">="http://Sample.BlahIncomingSchema"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
      </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">BlahNode</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">Test Value</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">BlahNode</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ns0:BlahRoot</span><span style="color: #0000FF; ">></span></div>





We've then defined a schema without namespace and map to that and get the following result.




    
    <div><span style="color: #0000FF; "><</span><span style="color: #800000; ">BlahRoot</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
      </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">BlahNode</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">Test Value</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">BlahNode</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">BlahRoot</span><span style="color: #0000FF; ">></span></div>





This method is of course much cleaner then any previous and it's also more conceptually correct as the schema actually represents the contact between BizTalk and the receiving system (the contract is a message without namespace in it, **not one with that we then remove**).





The only problem with this kind of approach is that as BizTalk recognized the message type using a combination between root node and XML namespace we can't have another schema with the _BlahRoot_ root node without a defined XML namespace. Even if those two schemas would look totally different in structure and be two different message types BizTalk would be able to see the difference (to BizTalk they both be _#BlahRoot_ message types).





Thanks Jeff for pointing this out to me. 
