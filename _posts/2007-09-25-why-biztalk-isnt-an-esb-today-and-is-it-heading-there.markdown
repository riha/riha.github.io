---
date: 2007-09-25 14:01:57+00:00
layout: post
title: "Why BizTalk isn’t an ESB today and is it heading there?"
categories: [BizTalk 2006]
---

I've written about the ESB concept [before](http://www.webhostingsearch.com/blogs/richard/index.php) and what I think an ESB architecture is. In the posts comments there were some discussion about if BizTalk is an ESB or not. And if not - **why not**? 

I think [this article](http://dotnet.sys-con.com/read/121831.htm) does a great job in explaining and discussing this subject. Basically it says that the main reason for BizTalk not qualifying as an ESB today (I know about the [ESB Guidance](http://www.codeplex.com/esb) - we get there ;)) is because of it's "all-or-nothing" packaging. What that means is that it's different functionality can not be separately deployed a cross a bus structure. For example; the scenario of having the transformation functionality in one place and the routing functionality in another just isn't possible in today's architecture. Today you install the full product in one place. 

I think I've personally have learnt to live with this limitation. On the other hand I can see that the possibility of splitting parts up definitely changes things as the possibility of reuse and single point of failure problems etc.

# Is BizTalk going the ESB way?

I still haven't had as much time as I'd like to examine the [ESB Guidance](http://www.codeplex.com/esb) but I look forward to see how they worked around the problem described above.

[![](../assets/2007/09/windowslivewriterisbiztalkanesb-e886microsoftesbtechnicaloverview-thumb31.jpg)](../assets/2007/09/windowslivewriterisbiztalkanesb-e886microsoftesbtechnicaloverview51.jpg) Just looking at this architecture image shows that they've split things up in a new way and that each part is accessible trough services - nice! Could this be the future architecture of BizTalk server? What do you think?

I'll try and install the ESB project as soon as I get some more time on my hands. In the mean time I'd love some tips and comments on articles and other reading on the experiences of the ESB Guidance project.
