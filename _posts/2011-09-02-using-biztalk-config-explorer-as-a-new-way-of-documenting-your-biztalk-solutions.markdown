---
date: 2011-09-02 11:01:22+00:00
layout: post
title: "Using BizTalk Web Documenter as a new way of documenting your BizTalk solutions"
categories: [BizTalk 2006, BizTalk 2009, BizTalk 2010, R2]
---

<blockquote>  
> 
> 2012-09-30: I’ve renamed the whole project and moved it to [GitHub](https://github.com/riha/btswebdoc). Hope to see you there!
> 
> </blockquote>

 

As most BizTalk developers/architects you have probably been in a situation were documentation of your integration solution has been discussed. And you probably also been just as happy as me when you first found [BizTalk Documenter](http://biztalkdocumenter.codeplex.com/). BizTalk Documenter is a great tool for extracting all that configuration data that is so vital to BizTalk and create a nice technical documentation of it.

 

![documentation levels](/assets/2011/09/documentation-levels.png)There are of course several levels to documentation in BizTalk Server based solution were the technical information is at the lowest level. Above that you would then have you integration process descriptions and then possible another level above that where you fit the integration processes into bigger business processes, and so on – but let’s stick to the technical documentation for now.

 

BizTalk Documenter does a nice job of automating the creation of technical documentation, instead of basically having to all that configuration job a second time when documenting. Doing technical documentation by hand usually also breaks down after a while as solution setup and configuration changes a lot and the work is really time consuming. And as documentation that isn’t up to date frankly is completely worthless people soon looses interest in both reading and maintaining the technical documentation.

 

Using BizTalk Documenter however has a few problems …

 

  
  * The tool generates either a [CHM](http://en.wikipedia.org/wiki/Microsoft_Compiled_HTML_Help) file or a word file with documentation. As more and more organizations however move their documentation online new output formats are needed. 
   
  * The latest 3.4 versions of the tools throws OutOfMemory Exceptions on bigger solutions. 
 

### BizTalk <strike>Config Explorer</strike> Web Documenter

 

As we started trying to find ways to solve the issues above we had a few ideas we wanted the new solution to handle better.

 

  
  * **Web based documentation          
**A web based documentation is both much easier to distribute and more accessible to read – sending a link and reading a web page rather then sending around a CHM file. 
   
  * **Easy way of see changes in versions          
**Sometimes one wants to see how things have changed and how things used to be configured. The tools should support “jumping back in time” and see previous versions. 
 

[![config explorer](/assets/2011/09/config-explorer.png)](http://demo.configexplorer.com/)

 

Check out an an [example](http://demo.btswebdoc.com) of a Config Explorer yourself.

 

### Getting started

 

Config Explorer is a open source tool [published](https://github.com/riha/btswebdoc) on <strike>CodePlex GitHub</strike> - a good place to start to understanding the workflow of creating documentation and to download the tool itself.

 

### Contribute!

 

This release is a 1.0 release and there will are many features we haven’t had time for, but a few of them we’ve planned for future releases. Unfortunately there will however also be bugs and obvious things we’ve missed. Please use the <strike>CodePlex GutHub</strike> [Issue Tracker](https://github.com/riha/btswebdoc/issues) to let us know what you like us to add and what possible issues you’ve found.

 

I’ll of course also check for any comments here ![Winking smile](/assets/2011/09/wlEmoticon-winkingsmile.png).
