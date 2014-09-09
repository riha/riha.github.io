---
date: 2009-11-10 19:41:58+00:00
layout: post
title: "What kind of integration patters do you implement in BizTalk?"
categories: [Architecture, BizTalk, ESB Toolkit 2.0]
---

I like to divide BizTalk based integrations into three different patterns.

 

  
  1. Point-to-point integration 
   
  2. Broker-based integration 
   
  3. ESB-based integration 
 

I am sure someone could come up with fancier names but I will in this post try and dig into each of them, explain what I mean by them. I will also try and highlight some issues with each of the patterns.

 

### Point-to-point integration

 

[![image](../assets/2009/11/image-thumb.png)](../assets/2009/11/image.png) This is where a lot of us started. The idea is that the sending system has information and knowledge about the receiving system.

 

This usually means that the _messages are exported in a message format that is tailored to the format of the particular receiving system’s needs_. It also means that we usually _get one integration process for each receiving system there is_.

 

The example in the figure on the right shows a sending system that sends information about invoices to two different receiving systems (“System A” and “System B”). Using a point-to-point pattern in this scenario we end up with two different types of messages that are exported. Each of the exported messages that are suited and tailored to the format of the receiving system.

 

#### Issues

 

The main problem with this kind of point-to-point integration, where the sending system has detailed knowledge about the receiving systems, is that _this knowledge translates into a coupling between the systems_. When we tie the export message format from the sending system to the format of the receiving, _all changes in the receiving system will also cause changes in the sending system_.

 

Suppose there is a sudden need to change the format of the receiving system - _as we use that format as our export format we now also have to change it there_.

 

Another problem is the _lack of agility_. In this invoice scenario all other system that also has the need of invoice based information has to get this by going all the way back to the sending system and develop a whole new _specific_ integration - separate to the existing ones.

 

### Broker-based integration

 

[![image](../assets/2009/11/image-thumb1.png)](../assets/2009/11/image1.png)In the broker-based scenario the integration platform is used as a broker of messages.

 

This means that only **one canonical **format is exported from the sending system. The broker then handles the routing to the different systems and the transformation to the message formats that the receiving systems expects.

 

_The main advantage between this approach - where the sending system do not know anything about the receiving systems – and the point-to-point pattern is **agility**_.

 

If there now is a need for invoice information in a third, new system, we do not have to change the export from the sending system (as long as we have all the information need that is) or develop a whole new integration. _All we have to do is to route the invoices so that they also are sent to the third system and transformed into the format that the system expects_. A new BizTalk map and port and we are done!

 

#### Issues

 

In my point of view this approach to integration has a lot of advantages over the point-to-point integrations previously discussed. And in a lot of simpler, stabile scenarios it works just fine and is the way to go.

 

But in some scenarios it kind of breaks down and becomes hard to work with. The problems is related to configuration and how we define the routing information in BizTalk. In BizTalk we can either create an orchestration and “hardcode” the process that defines which systems the messages should be sent to. We can also create a “messaging” scenario where we configure this routing information in the different BizTalk port artifacts by setting up filters.

 

Regardless if we choose a “messaging” or orchestration based solution the routing information becomes hard to update as the solution grow in size. We either get very complicated orchestrations or loads of ports to maintain.

 

Furthermore the whole process is very coupled to the one canonical schema which makes versioning and updates hard. If the canonical schema needs to be updated and we still need to be able to send information using the old schema (so we have a “version 1” and “version 2” of the schema side-by-side) all artifacts needs to be more or less duplicated and the complexity of the solutions grows fast.

 

_This makes business agility hard and any changes takes long time to develop and deploy correctly._

 

> I guess these issues has more to do with how BizTalk works than the integration pattern itself - but this is a BizTalk blog!

### ESB-based integration

 

[![image](../assets/2009/11/image-thumb2.png)](../assets/2009/11/image2.png)ESB-based integration in BizTalk is today achieved using [ESB Toolkit](http://msdn.microsoft.com/en-us/biztalk/dd876606.aspx) from Microsoft.

 

One of the ideas of ESB-based integration is that the integration platform should not have hardcoded routing information. These routing rules should either be looked up at run time or travel with the actual payload of the message (called “dynamic routing”).

 

This in combination with having generic on- and off-ramps instead of loads of separate ports to maintain _promises to create more agile and configurable solutions _(called “Loosely coupled service composition” and “Endpoint run-time discovery and virtualization”).

 

The figure again shows the invoice scenario used previously. In this case we export a “Invoice 1.0”-format from the sending system. The format is not directly bound to a schema in the port (as we are used to in BizTalk) but it is basically possible to send **any** message format to the on-ramp.

 

The on-ramp then identifies what kind of message it received (for example using the XML-namespace) and looks up the routing rules for that specific message (the message “itinerary”) in a repository.

 

In this scenario there could be rules to route the message to a orchestration or directly to a send port. _All the configuration for this port is however configured as part of the itinerary and applied at run-time on the generic off-ramp port. And as itineraries are simple XML documents they are super light to update and deploy in the repository! _

 

So if we now wanted to update the “Invoice”-format to “version 2.0” all we would have to do is to create a new XML itinerary for the “Invoice 2.0” message type and possibly create new orchestration to handle the new message type. No new ports, no new bindings etc, etc. The configuration and deployment would be a lot simpler than before! We would end up with a lot fewer artifacts to maintain.

 

**And **the itinerary for “Invoice 1.0” would still be applied to all incoming Invoice 1.0 messages. _Thus we have achieved what used to be so hard with a lot less development power!_

 

#### Issues

 

With agility and dynamic capabilities comes complexity in debugging when something bad happens … I also feel that we give up a lot of validating and control capabilities that we had in the more schema-coupled patterns previously discussed.

 

I am new to this ESB-based model and I would love to hear your experiences, problems, stories etc! 

 

_I am however sure that this is the way to go and I would not be surprised if ESB like patterns will play an ever bigger role in future BizTalk versions!_
