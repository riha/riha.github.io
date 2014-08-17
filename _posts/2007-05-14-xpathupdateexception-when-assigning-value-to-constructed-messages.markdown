---
date: 2007-05-14 14:11:53+00:00
layout: post
title: "XPathUpdateException when assigning value to constructed messages"
categories: [BizTalk 2006]
---

Ever had a "use of unconstructed message" error message in your orchestrations? Then you know that messages has to be constructed before one can use them within orchestrations. Basically messages in orchestrations are created in ports or when executing a map in a construct shape. However there is also the possibility of creating messages in expression shapes using code. Matt Meleski does a great job explain the different approaches in his _[Constructing BizTalk 2004 XML Messages (In an Orchestration) - Choices](http://objectsharp.com/cs/blogs/matt/archive/2004/11/09/1009.aspx)_ blog post_._

However there are some pitfalls when constructing messages from scratch within orchestration (a part from the fact that there really isn't a clean way of doing it ... Scott Colestock has some ideas in [this post](http://www.traceofthought.net/PermaLink,guid,c1164c59-72e2-49e2-be7a-47e4e8dc46d4.aspx)).

A common problem is _XPathUpdateException_. Say one has a mapping that looks like the one below where one node isn't mapped. **This will create a message without the _ElementB_ element**. This doesn't have to be in a mapping, it could also happend when constructing a message using code in a expression shape. A common scenario is that we **add code for constructing the bone structure of the XML message**, then change the schema **without updating the construct code. Ergo a message will be constructed without that element** (could be both valid or invalid XML then depending on the _Min Occurs_ value)!

[[](../assets/2007/05/windowslivewriterxpa.setdistinguishedfieldwhileassigningv-ceb2complexmapping23.jpg)](../assets/2007/05/windowslivewriterxpa.setdistinguishedfieldwhileassigningv-ceb2complexmapping23.jpg)[![](../assets/2007/05/windowslivewriterxpa.setdistinguishedfieldwhileassigningv-ceb2complexmapping-thumb61.jpg)](../assets/2007/05/windowslivewriterxpa.setdistinguishedfieldwhileassigningv-ceb2complexmapping61.jpg)

When we then try to add a value to the element that hasn't been created the exception will be thrown!

[![](../assets/2007/05/windowslivewriterxpa.setdistinguishedfieldwhileassigningv-ceb2assignment-thumb31.jpg)](../assets/2007/05/windowslivewriterxpa.setdistinguishedfieldwhileassigningv-ceb2assignment31.jpg)

One way around when using a map is to make sure to have a default value on every element to force them be constructed. Adding the following to map will make it work.

[![](../assets/2007/05/windowslivewriterxpa.setdistinguishedfieldwhileassigningv-ceb2defaultvalue-thumb61.jpg)](../assets/2007/05/windowslivewriterxpa.setdistinguishedfieldwhileassigningv-ceb2defaultvalue61.jpg)

It's a one time mistake but it's good to know what to look for when the _XPathUpdateException in Microsoft.XLANGs.Core.XSDPart.SetDistinguishedField_ (if it's a distinguished field that is) shows up in the event log.
