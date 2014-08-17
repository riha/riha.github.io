---
date: 2008-07-09 09:04:22+00:00
layout: post
title: "Running MSBuild scripts from Visual Studio"
categories: [MSBuild]
---

[![MSBuild2](../assets/2008/07/windowslivewriterrunningmsbuildscriptsfromvisualstudio-9bb0msbuild2-thumb.png)](../assets/2008/07/windowslivewriterrunningmsbuildscriptsfromvisualstudio-9bb0msbuild2-2.png)It seems like there more build script one writes, the more often one wants to run them and it's always a bit annoying (and time consuming) having to leave Visual Studio and start MSBuild from the command line. Brennan Stehling has a cool solution to that problem [here](http://brennan.offwhite.net/blog/2007/05/31/running-msbuild-from-visual-studio/) were he sets up MSBuild as an external tool and runs it.

 

One problem for us was the we had our solution files in one place on the file system and our build files in a totally different place. The solution was to add the build file for the current solution as a [Solution Folder](http://msdn.microsoft.com/en-us/library/haytww03(VS.80).aspx) (as shown in the figure below) and then set MSBuild to use $(ItemDir) as its Initial Directory. That will kick of MSBuild from the directory that the current selected Solution Folder points to and in our case that's were the XXX.Build.Article.proj file exists.

 

[![MSBuild](../assets/2008/07/windowslivewriterrunningmsbuildscriptsfromvisualstudio-9bb0msbuild-thumb-2.png)](../assets/2008/07/windowslivewriterrunningmsbuildscriptsfromvisualstudio-9bb0msbuild-6.png)
