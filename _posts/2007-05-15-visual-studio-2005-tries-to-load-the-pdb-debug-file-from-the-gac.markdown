---
date: 2007-05-15 06:14:01+00:00
layout: post
title: "Visual Studio 2005 tries to load the .pdb debug file from the GAC"
categories: [.NET]
---

Ever seen this alert when trying to debug a project using Visual Studio 2005?

<blockquote>The following module was build with optimizations enabled or without information:
> 
> C:\Windows\assembly\GAC_MSIL\ ...
> 
> To debug this module, change its build configuration to debug mode. TO suppress this message, disable the 'Warn if no user code on launch' debugger option.
> 
> </blockquote>

Basically this means that **Visual Studio can't find the debug file **(the [.pdb file](http://msdn2.microsoft.com/en-us/library/ms241903.aspx))** at the same location as the dll is loaded from**. Reading the error message tells us that the **dll been loaded from the GAC** and there aren't any pdb files there! Just make sure to uninstall the dll from the GAC and Visual Studio should be able to load it from your Debug folder and  you'll probably  be good to go.
