---
author: Richard
comments: true
date: 2006-09-13 06:24:29+00:00
layout: post
slug: vs-2005-project-on-the-old-iis
title: VS 2005 project on the old IIS
wordpress_id: 23
categories:
- ASP.NET
---

As most people know the web project that are created and tested in VS 2005 run on an internal web server (called Cassini).  

In some situations this is useful as it enables one to quickly get the project up and running and start testing. But as the sites usually are going to run on an IIS in production I usually like to test it and develop it on one as well (for other reasons, check [this](http://codebetter.com/blogs/peter.van.ooijen/archive/2006/09/12/Switching-from-the-VS-development-server-to-IIS.aspx) out).

Here's [a good article](http://codebetter.com/blogs/peter.van.ooijen/archive/2006/09/12/Switching-from-the-VS-development-server-to-IIS.aspx) on how to change the setting that makes VS behave as it it used to (put it on an URL and create a virtual directory for it). 

The only drawback I can think of is that it becomes a bit more complicated when it comes to deleting a project ...
