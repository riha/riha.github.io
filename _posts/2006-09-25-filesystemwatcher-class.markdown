---
author: Richard
comments: true
date: 2006-09-25 10:02:04+00:00
layout: post
slug: filesystemwatcher-class
title: FileSystemWatcher Class
wordpress_id: 25
categories:
- .NET
---

I just found the [FileSystemWatcher class](http://msdn2.microsoft.com/en-us/library/system.io.filesystemwatcher.aspx) in the [System.IO](http://msdn2.microsoft.com/en-us/library/29kt2zfk.aspx) namespace. It provides the functionality to listen on the file system for changes on a file or directory. The class fires a couple of events: _Changed_, _Created_, _Deleted_ and _Renamed_.

I didn't know of this class until now. I always thought one had to write a service to accomplish something like this! Definitely very useful!
