---
date: 2009-03-19 16:37:01+00:00
layout: post
title: Receiving scheduled MsgBoxViewer-reports via e-mail
categories: [BizTalk 2006, Tools]
---

I attended a session the other day at TechDays here in Sweden with Microsoft Escalation Engineer [Niklas Engfelt](http://bizspace.blogspot.com/). The session was about troubleshooting BizTalk and Niklas of course showed the wonderful [MsgBoxViewer](http://blogs.technet.com/jpierauc/pages/what-is-biztalk-msgboxviewer.aspx) (MBV) tool by [Jean-Pierre Auconie](http://blogs.technet.com/jpierauc/default.aspx). If you haven't tested and looked deeper into this tool you _**need**_ to do so. It's great! 




I worked with the tool before but now I wanted to schedule the tool and to have MBV-reports e-mailed to relevant persons within the company on a weekly basis. This is quite easy to accomplish as MBV comes in two version. One GUI-based (shown below) version and one command-line based.




[![image](../assets/2009/03/windowslivewriterreceivingscheduledmsgboxviewereportsviae-f7aeimage-thumb-5.png)](../assets/2009/03/windowslivewriterreceivingscheduledmsgboxviewereportsviae-f7aeimage-12.png)




The command-line version is of course perfect for scheduling using the [Windows Task Scheduler](http://www.iopus.com/guides/winscheduler.htm). 




[![image](../assets/2009/03/windowslivewriterreceivingscheduledmsgboxviewereportsviae-f7aeimage-thumb-4.png)](../assets/2009/03/windowslivewriterreceivingscheduledmsgboxviewereportsviae-f7aeimage-10.png)




If you feel uncomfortable running all the queries (there is _a lot_ of them) on a schedule you can pick some you find important and configure the tool to only run those. Jean-Pierre has a post on how to do just that [here](http://blogs.technet.com/jpierauc/archive/2009/03/11/mbv-how-to-run-only-some-specific-queries-in-the-console-version-of-mbv-btsdbcollect-exe.aspx).




After MBV has completed all its queries and done its magic it will produce a html-report in the working folder (that's the folder in the "Start in" field in the scheduled task example above). 




We then use a tool called [AutoMailer NT](http://www.duodata.de/amlnt/index.htm) (cost €20 - there is a 30 days trial) to:






  1. Poll the working folder for a *.html report file.

  2. Compress the file (using zip).

  3. Send the report to a configured list of recipients.

  4. Delete the report file. 




The AutoMailer NT installation is a bit rough (don't miss to the _****_[separate download](http://www.duodata.de/amlnt/download.htm) (!) of the trial certificate). But once you have everything working it's great to have a fresh MBV report in you inbox every Monday telling you how your BizTalk environment is doing and possible issues to attend to.



