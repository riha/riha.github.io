---
date: 2014-06-03 09:33:09+00:00
layout: post
title: "Why full NuGet support for BizTalk projects is important!"
categories: [BizTalk]
---

Let’s start with a summary for those who don’t feel like reading the full post.

 

Using NuGet to handle BizTalk dependencies for shared schemas, pipeline components and so on works fine today.

 

As .btproj files however aren’t supported by NuGet (as shown in [this pull request](https://nuget.codeplex.com/SourceControl/network/forks/robinhultman/NuGetWithBizTalkProjectExtension/changeset/d1f1a29c9b322670c820f52d769422cb111253b3)) and are not in the current white list of allowed project types _Package Restore will not work_ (issue closed as by design [here](https://nuget.codeplex.com/workitem/3010)).

 

Not having Package Restore of course is a problem as one now is forced to check in all packages as part of the solutions, something that in the end leads to bloated and messy solutions.

 

So please reach out to your Microsoft contacts and let’s get this fixed!

 

### NuGet

 

As most people know NuGet is the package management solution from Microsoft for .NET. It started off as an initiative to further boost open source within the .NET community and NuGet packages uploaded to the [NuGet.org platform](http://www.nuget.org/) are open and available directly within Visual Studio through the NuGet add-in. Currently there are well over 20 000 open packages for everyone to download and use.

 

Lately there has however been lots of discussions within the community to use NuGet as a package manager for _internal_ shared resources as well (by [Hanselman](http://www.hanselman.com/blog/NuGetForTheEnterpriseNuGetInAContinuousIntegrationAutomatedBuildSystem.aspx) and [others](https://www.simple-talk.com/dotnet/.net-framework/taking-nuget-to-the-enterprise/)). Solutions like [MyGet](https://www.myget.org/) allows for _private_ NuGet feeds – only available to those within your organization but still levering all the ease and control offered by NuGet.

 

Using NuGet for references has a number of of advantages:

 

  
  * **Communication**         
All available resources are directly visible in Visual Studio and when updates to a used library is a available a notification is shown. No more spam mails about changes and never read list of available libraries. 
   
  * **Versioning**         
A NuGet package has it’s own versioning. This is useful as it isn’t always optimal to change the dll version, but by using the NuGet package version one can still indicate that something has changed.         
As you also reference a specific version of a NuGet package from your solution you always have full control of _exactly_ what version you’re targeting and where to find the built and ready bits. 
   
  * **Efficiency**         
When starting to work on a project with many references one first have to get the source code from source control for the references, build these (hopefully in the right version … hopefully you have your tags and labels in order …) until all the broken references are fix.         
With NuGet references this just works straight away and you can be sure you get the right version as the resource isn’t the latest from source control but the actual built dlls that’s part of the referenced NuGet package. 
 

#### NuGet Feeds

 

As mentioned NuGet feeds can be public or private. A NuGet feed is basically a RSS feed with available resources and versions of these. A feed and a NuGet server can be a hosted web based solution or something as simple as a folder where you write your NuGet packages to. The [NuGet documentation](http://docs.nuget.org/docs/creating-packages/hosting-your-own-nuget-feeds) covers these options in depth.       
The point being that creating your own private NuGet feed is very simple!

 

<blockquote>  
> 
> So if you haven’t already realized it by now - NuGet is not only a great tool to manage all public external dependencies but can add a **a lot a value for internal references** as well.
> 
> </blockquote>

 

#### Couple of relevant NuGet features

 

  
  * **NuGet Package Restore          
**[NuGet Package Restore](http://docs.nuget.org/docs/reference/package-restore) enables NuGet to download the used referenced package from the package area. The goal is to avoid having to check in the actual references in source control as this will bloat the version control system and in the end the create a messy solution. 
   
  * **NuGet Specification (nuspec) metadata token replacements          
**All packages are based on a nuspec file that dictates the version, package description and other meta information.         
NuGet has the capability to by using replacement tokens (such as _$version$_ for example) read some of this information from the _AssemblyInfo_ files.         
This is far from a critical feature but nice to have and avoid having to repeat oneself and have the same information in a number of places.**          
**
 

### BizTalk and NuGet?

 

A typical BizTalk solution has a number of shared resources such as shared schemas, shared libraries and pipeline components. As the resources usually are shared between a number of project they often live in a separate development cycle. So when opening a BizTalk project with such resources it’s not only a lot of work getting the referenced code and building the references, there’s also this nagging feeling that it _might not be in the right version _and that the source might have changed since the first time the reference was added.

 

Another reference issue occurs when using a build server for a solution with references. As the solution has a dependency to the referenced project one has to make sure not only that the main solution is fetched to the build workarea by the build server, but also that all the referenced project are fetched from version control – and again, hopefully the latest version in the attended version …      
This kind of works using TFS Build Service and common TFS Source Control. If however one’s using Git and have resources in separate repositories this becomes impossible as TFS Build Service currently only supports fetching a single repository per build definition to the build workarea …       
(This issue does not apply for [TeamCity](http://www.jetbrains.com/teamcity/) that has a number of different options for dependency management)

 

All the these issues are actually solved when using NuGet references instead of traditional references as we can be sure we’re getting the packaged dlls as part of the NuGet package _in the version that one referenced and not the latest checked in version_.       
A NuGet reference also makes things a bit easier when it comes to managing the workarea for the TFS Build Service as one only have to sure the NuGet package is available (either as checked in as part of the solution or by using Package Restore).

 

**_But …_**

 

### NuGet doesn’t support BizTalk projects!

 

As disused [here](https://nuget.codeplex.com/workitem/3010) NuGet currently doesn't support .btproj files. As BizTalk project files are are basically a standard .NET project file with some extra information a two line change in the NuGet whitelist is needed as in [this pull request](https://nuget.codeplex.com/SourceControl/network/forks/robinhultman/NuGetWithBizTalkProjectExtension/contribution/5960#!/tab/changes).

 

![nolove](/assets/2014/06/nolove.png)

 

So the main issue it that by _not having full support of .btproj files Package Restore won’t work_ and we’re for now force to check in all the NuGet packages as part of our solutions.       
An other minor issue is that the token replacement feature also doesn’t work. I also think that if we could actually get full BizTalk support we’d see more BizTalk specific open shared packages for things like useful libraries and pipeline components.

 

**_Call for action_**: Reach out to [the NuGet Team](https://twitter.com/nuget) or other Microsoft connections and let’s get those two lines added to the white list!
