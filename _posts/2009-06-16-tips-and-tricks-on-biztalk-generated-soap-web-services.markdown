---
date: 2009-06-16 08:30:32+00:00
layout: post
title: "Tips and tricks on BizTalk generated SOAP Web Services"
categories: [BizTalk 2006, MSBuild, R2]
---

Traditional SOAP Web Services might feel kind of old as more and more people move over to WCF. But a lot of integration projects still relay heavily on old fashion SOAP Web Services.

 

Using BizTalk generated Web Services however has a few issues and one needs to add a few extra steps and procedures to make them effective and easy to work with. This post aims to collect, link and discuss all those issues and solutions.

 

### 1. Building and deploying

 

BizTalk Server includes the “BizTalk Web Services Publishing Wizard” tool that integrates with Visual Studio. This is basically a tool to generate a [DSL](http://en.wikipedia.org/wiki/Domain-specific_programming_language) based script for generating web services.

 

[![image](/assets/2009/06/image-thumb.png)](/assets/2009/06/image.png)

 

The wizard collects information about what schema or a orchestration to expose, namespaces, names of service and method, where on IIS to publish the service etc, etc.

 

The output of the tool is then a xml file (a “WebServiceDescription” file) that has all the collected values in it.

 

[![image](/assets/2009/06/image-thumb1.png)](/assets/2009/06/image1.png)

 

As a final step Visual Studio uses the newly created description file as input to a class called WebServiceBuilder in the .NET Framework. It is this class that is responsible for interpreting the description, configure and generate the service.

 

A common procedure is to use the wizard and click thru it and input values for **_every_** single deployment. This is of course slow, error prone and stupid.

 

What is much better is to take a copy of the generated “WebServiceDescription” file, save it to your source control system and then programmatically pass the file to the WebServiceBuilder class as part of your deployment process. Possible changes to the details of the service can then be done directly in the description file.

 

I have seen this approach save lots of time and problems related to deployment.

 

  
  * Paul Petrov has a great post on how to call the “WebServiceBuilder” class and pass the description file using C#.        
[http://geekswithblogs.net/paulp/archive/2006/05/22/79282.aspx](http://geekswithblogs.net/paulp/archive/2006/05/22/79282.aspx)
   
  * Michael Stephenson has a good post on how to used the “WebServiceBuilder” class via MSBuild.        
[http://geekswithblogs.net/michaelstephenson/archive/2006/09/16/91369.aspx](http://geekswithblogs.net/michaelstephenson/archive/2006/09/16/91369.aspx)
 

### 2. Fixing namespace

 

Another annoying problem (I’d would actually go so far as calling it a bug) is the problem with the _bodyTypeAssemblyQualifiedName_ value in the generated Web Service class.

 

This causes BizTalk to skip looking up the actual message type for the incoming message. As no message type exists for the message is in BizTalk mapping and routing on message types etc will fail. It is a know problem and there are solutions to it. I would also recommend take the extra time need to make this small “post process step” be part of your deployment process (see how [here](http://www.richardhallgren.com/handle-the-bodytypeassemblyqualifiedname-soap-adapter-bug-in-msbuild-as-a-regex-ninja/)).

 

  
  * Saravana Kumar discusses the problem and solutions in this great post.        
[http://www.digitaldeposit.net/saravana/post/2007/08/17/SOAP-Adapter-and-BizTalk-Web-Publishing-Wizard-things-you-need-to-know.aspx](http://www.digitaldeposit.net/saravana/post/2007/08/17/SOAP-Adapter-and-BizTalk-Web-Publishing-Wizard-things-you-need-to-know.aspx)
   
  * Richard Seroter has a short and well written post published.        
[http://blogs.msdn.com/richardbpi/archive/2006/09/15/Fixing-_2200_SOAP-_2F00_-Envelope-Schema_2200_-Error-In-BizTalk.aspx](http://blogs.msdn.com/richardbpi/archive/2006/09/15/Fixing-_2200_SOAP-_2F00_-Envelope-Schema_2200_-Error-In-BizTalk.aspx)
   
  * I have a post on how to solve the issue using MSBuild.        
[http://www.richardhallgren.com/handle-the-bodytypeassemblyqualifiedname-soap-adapter-bug-in-msbuild-as-a-regex-ninja/](http://www.richardhallgren.com/handle-the-bodytypeassemblyqualifiedname-soap-adapter-bug-in-msbuild-as-a-regex-ninja/)
 

### 3. Pre-compiling

 

By default the “WebServiceBuilder” class generates a web service _without_ pre-compiling it. Usually this is not a problem. _But_ in some cases were one really on the web service being online and give a quick response-message the performance problems in this approach can be a huge problem.

 

When generating the web service without pre-compiling it IIS has to compile the service and then keep the compiled service in memory. That means that when IIS releases the service from memory there is a latency before IIS re-compiled the service, loaded it into memory and executed it. This is a known problem and I have seen this “slow first hit” issue been a frequent question the different forums.

 

The solution is to use the aspnet_compiler.exe tool and pre-compile the service and the use those pre-compiled dlls as the service. IIS then never has to recompile it and will serve initial hits much faster.

 

Here is an example of how we defined a target to do this as part of our deployment process using MSBuild.

 

  
  1. Pre-compile the service into a new folder 
   
  2. Clean out the “old” not compile service folder. 
   
  3. Copy the pre-complied service into the service folder 
 
    
    <Target Name="CompileWeb">
        <Message Text="Uses aspnet compiler to compile the service into a new folder. Then copies the compiled content back into its original place" />
        <AspNetCompiler
            PhysicalPath="$(WebSiteServicePath)InitiateProjectService\"
            VirtualPath="/WebServiceName"
            TargetPath="$(WebSiteServicePath)$(WebServiceName)Compiled\"
            Force="true" />
    
        <Folder.CleanFolder Path="$(WebSiteServicePath)$(WebServiceName)\"/>
    
        <Folder.CopyFolder
                    Source="$(WebSiteServicePath)$(WebServiceName)Compiled\"
                    Destination="$(WebSiteServicePath)$(WebServiceName)\" />
    
    </Target>






  
  * Paul Petrov has two different articles here describing the process and also a different way that above on how to include the pre-compilation in you build process. 
    

[http://geekswithblogs.net/paulp/archive/2006/03/30/73900.aspx](http://geekswithblogs.net/paulp/archive/2006/03/30/73900.aspx), [http://geekswithblogs.net/paulp/archive/2006/04/19/75633.aspx](http://geekswithblogs.net/paulp/archive/2006/04/19/75633.aspx)


  


