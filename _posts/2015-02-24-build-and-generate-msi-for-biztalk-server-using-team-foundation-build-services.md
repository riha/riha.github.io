---
date: 2015-02-26 12:00:0+01:00
layout: post
title: "Build and generate MSI for BizTalk Server using Team Foundation Build Services"
---
Build and generate MSI for BizTalk Server using Team Foundation Build Services

Using a build server and leveraging continuous integration is good practice in any software 
development project. The idea behind automated build and continuous integrations is to have a server that 
monitors once source code repository and that builds the solution as changes occurs. This separate build 
activity alone will ensure that all artefact are checked in and that a successful build doesn’t depend on any 
artefact or settings on the development machines.

![Build server](https://www.dropbox.com/s/qmifhapfsaxkjlb/1.png?raw=1)

Today build servers however do a lot more as part of the build - the build process usually involves execution of 
tests, labeling the source as well as packing the solution into a deployable artefact. 

In this post we'll see how a build process can be achieved using Team Foundation (TFS) Build Services, building a BizTalk project resulting in 
a deployable MSI artefact.


## TFS Build Services
[TFS Build services](https://msdn.microsoft.com/en-us/library/ee259687.aspx) is a component that is part of the standard TFS install media. 
Each TFS build controller controls a number of "Build Agents" that will perform the actual build process. For each solution to build one has to 
define its process. These processes are described in a "Build Template" that tells the agent what steps to go through 
and in what order.

Build templates in TFS Build Services are defined using Visual Studio. The image below shows a "Build Template" accessed thru Visual Studio Team Explorer.

![Visual Studio Team Explorer Build Templates](https://www.dropbox.com/s/shd29htzarcm6a4/2.png?raw=1)

### Major steps in a build template
As one creates a new build template" for a solution one has to go thru the following major steps:

**1. Define a trigger**

Decides what should trigger the build. Should it be triggered manually, should be a scheduled build or should it 
be triggered at a check-in of new code to the code repository?

**2. Source Setting**

This will tell the build process what part of the source tree the build template is relevant for. When queueing 
a new build this is the part of the source tree that will be downloaded to the staging area. It also tells the build 
services where on disk the source should be downloaded to.

**3. Process**

This is where all the steps and activities that the build service should perform are defined. Team Foundation Build 
Services comes with a number of standard templates and custom ones can be added. In this post we'll however stick with the default one.

## Build your first BizTalk solution

Building BizTalk Server solution using TFS Build Services is straight forward. 

In this post I will use [this sample](https://github.com/riha/BtsMsiTask/tree/master/Sample) BizTalk solution. After checking it into Team 
Foundation Source Control (I use TFS Source control in this post, but It work similarly using Git) I’ll create a new build template for the solution. All that needed to change is the MsBuild platform setting so we’re using x86 when executing MsBuild as shown below.
 
![Build process and the MsBuild platform setting](https://www.dropbox.com/s/2alqzwmicye7qsd/3.png?raw=1)

After queuing a build we can in the TFS Build Explorer see a successful build!
 
We can also download the output from the build where we can see all our build artefacts!
![First artifact drop](https://www.dropbox.com/s/hza1lx1tfb2cxbb/5.png?raw=1)
 
## Using BtsMsiTask to create a MSI as part of the build
Now that's all good but we started the article by saying that what we wanted was a deployable artefact. In the case of 
BizTalk this means a BizTalk MSI. Let’s see what we need to change to also have the build process create a MSI.

1. Install BtsMsiTask
Download and install [BtsMsiTask](http://richardhallgren.com/BtsMsiTask/). This will install a MsBuild task for generating the MSI.

2. Add a MsBuild project file (`build.proj`) to the solution 
<script src="https://gist.github.com/riha/24856902e68bae4ec244.js"></script> The project file will tell the BtsMsiTask process what artifacts to include. 
Add the created project file to the solution and check it in as part of the solution.

3. Add the MsBuild project file to the TFS build template by adding it to list of project to build
![Adding the build file to the build process](https://www.dropbox.com/s/9bvopwd0p6vas1p/6.png?raw=1)

After another successful build we can see that we also created a MSI as part of the build!
![Successful build with msi](https://www.dropbox.com/s/eadrq1eonqxivdb/7.png?raw=1)
 
## Adding build information to the MSI
### File name
As we can see the MSI we just created ended up with the default BtsMsiFile name that is a combination of the BizTalk application name property and the 
current date and time. Would it be nice of we instead could the build number as part of the name?
BtsMsiTask has an [optional property](http://richardhallgren.com/BtsMsiTask/available-parameters/) called file name that we for 
example can set to `<FileName>$(TF_BUILD_BUILDNUMBER).msi</FileName>`

### Source location
When then installing the artifact to BizTalk Server we can also see that the source location property in the BizTalk Administration Console is set to 
where the artifact was built on the staging area. 
![Source Location without build number](https://www.dropbox.com/s/vtayz2mh6h48e7i/8.png?raw=1)

It be nice to also here have information about what build that built these artifact. This will give the required information to know exactly what builds that are used for all the installed artifact.
 
We can change what set in the source location by using the source location property of BtsMsiTask `<SourceLocation>c:\$(TF_BUILD_BUILDNUMBER)</SourceLocation>`

So after setting the property as below, queue another build, reinstall using the MSI and we'll get the following result with the build number in the source location property.
![Source Location with build number](https://www.dropbox.com/s/lacj7iwzs8nt4e0/9.png?raw=1)

And finnaly This is the MsBuild project file we ended up with in our example. <script src="https://gist.github.com/riha/dd8d7b4a1fed1bad3ca5.js"></script>



 

