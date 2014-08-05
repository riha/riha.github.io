---
date: 2007-01-26 13:34:56+00:00
layout: post
title: "BizTalk assembly version redirection"
categories: [BizTalk 2006]
---

The version redirection in BizTalk do NOT work as one is used to coming from a ordinary .NET developer background (so I was wrong in [this post](http://richardhallgren.com/blog/?p=50) ...). Say that we made a reference to a code library in one of our orchestrations. This code library is in version 1.0.0.0 when we build and deploy the orchestration to BizTalk and to the GAC. The setup in VS 2005 looks something like this.

[![](http://richardhallgren.com/blog/wp-content/uploads/2007/02/WindowsLiveWriter/BizTalkassemblyversionredirection_CA12/VersionReference_thumb3.jpg)](http://richardhallgren.com/blog/wp-content/uploads/2007/02/WindowsLiveWriter/BizTalkassemblyversionredirection_CA12/VersionReference3.jpg)  

Then we make some minor changes in the code library, we fix them and set the version to 1.0.1.0. Build and deploy it. This means that we now have one 1.0.0.0 and one 1.0.1.0 version side-by-side in the GAC (as shown in the figure below). 

[![](http://richardhallgren.com/blog/wp-content/uploads/2007/02/WindowsLiveWriter/BizTalkassemblyversionredirection_CA12/GAC_thumb8.jpg)](http://richardhallgren.com/blog/wp-content/uploads/2007/02/WindowsLiveWriter/BizTalkassemblyversionredirection_CA12/GAC8.jpg)

Coming from .NET the CLR should now load the 1.0.1.0 version as it identifies assemblies based on the assembly name, major or minor version (NOT the build and revision version), public key token and culture ([more about this here](http://www.informit.com/articles/article.asp?p=99977&seqNum=6&rl=1)).

However, this does NOT work in BizTalk. BizTalk loads assemblies by fullname it has stored in the management database and the build and revision number are part of the fullname ... This means we have to build and redelopy EVERY part where we like to use new version of the code library.

There is one way around this for emergency use. Say that one has a code library that is used in loads of BizTalk artifacts (A place where we store all base functionality for the solution). Rebuilding all those parts and redeploying it, just to be able to update the version number, is not going to happened! It's to much work and to risky. **So it's possible to make a change in the _BTSBTSvc.exe.config_ file instead. **In my case the change would be something like the below ([read more about here](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpgenref/html/gngrfbindingredirect.asp)).
    
    <div><span style="color: #000000; "><</span><span style="color: #000000; ">dependentAssembly</span><span style="color: #000000; ">></span><span style="color: #000000; ">
      </span><span style="color: #000000; "><</span><span style="color: #000000; ">assemblyIdentity name</span><span style="color: #000000; ">=</span><span style="color: #000000; ">"</span><span style="color: #000000; ">StaticCodeLibrary</span><span style="color: #000000; ">"</span><span style="color: #000000; "> publicKeyToken</span><span style="color: #000000; ">=</span><span style="color: #000000; ">"</span><span style="color: #000000; ">32ab4ba45e0a69a1</span><span style="color: #000000; ">"</span><span style="color: #000000; "> culture</span><span style="color: #000000; ">=</span><span style="color: #000000; ">"</span><span style="color: #000000; ">neutral</span><span style="color: #000000; ">"</span><span style="color: #000000; "> </span><span style="color: #000000; ">/></span><span style="color: #000000; ">
      </span><span style="color: #000000; "><</span><span style="color: #000000; ">bindingRedirect oldVersion</span><span style="color: #000000; ">=</span><span style="color: #000000; ">"</span><span style="color: #000000; ">1.0.0.0</span><span style="color: #000000; ">"</span><span style="color: #000000; "> newVersion</span><span style="color: #000000; ">=</span><span style="color: #000000; ">"</span><span style="color: #000000; ">1.0.1.0</span><span style="color: #000000; ">"</span><span style="color: #000000; ">/></span><span style="color: #000000; ">
    </span><span style="color: #000000; "></</span><span style="color: #000000; ">dependentAssembly</span><span style="color: #000000; ">></span></div>
