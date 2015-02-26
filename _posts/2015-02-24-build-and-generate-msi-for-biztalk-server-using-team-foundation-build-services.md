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

In this post we'll see how a build process can be achived using Team Foundation (TFS) Build Services building a BizTalk project resulting in 
a deployable MSI artefact.


## TFS Build Services
[TFS Build services](https://msdn.microsoft.com/en-us/library/ee259687.aspx) is a component that is part of the standard TFS install media. 
Each TFS build controller controls a number of "Build Agents" that will perform the actual build process. For each solution to build one has to 
define its process. These processes are described in a "Build Template" that tells the agent what steps to go through 
and in what order.

Build Templates are defined usign Visual Studio and the image below shows a "Build Template" accessed thru Visual Studio Team Explorer.

![Visual Studio Team Explorer Build Templates](https://www.dropbox.com/s/shd29htzarcm6a4/2.png?raw=1)

### Major steps in a build template
As one creates a new Build Template for a solution one has to go thru the following major steps:

**1. Trigger**

Decides what should trigger the build, should it be triggered manually, should be a scheduled build or should it 
be triggered at a checkin of new code to the code repository.

**2. Source Setting**

This will tell Visual Studio  what part of the source tree the build template is relevant for. When staring 
a new build this is the part of the source tree that will be downloaded to the staging area. It also tells the build 
services where on disk the source should be downloaded to.

**3. Process**

This is where all the steps and activities that the build service should perform are defined. Team Foundation Build 
Services comes with a number and templates and one can add custom ones. In this post we'll however stick with the default one.

## Build your first BizTalk solution

Building BizTalk solution using Team Foundation Build services is straight forward. 

After downloading [this sample](https://github.com/riha/BtsMsiTask/tree/master/Sample) and checked it into Team 
Foundation I’ll create a new Build Template. All that needed to change is the MsBuild platform setting so we’re using x86 when executing MsBuild
 
![Build process and the MbUild platform setting](https://www.dropbox.com/s/2alqzwmicye7qsd/3.png?raw=1)

After our first successful build we can in the Build Explotrer see a successful build!
 
We can also download the output from the build where we can see all our build artefacts!
![First aritefact drop](https://www.dropbox.com/s/hza1lx1tfb2cxbb/5.png?raw=1)
 
## Using BtsMsiTask to create a MSI as part of the build
That's all good but we started the article by saying that what we wanted was a deployable artefact. In the case of 
BizTalk this means a BizTalk MSI. Let’s see what we need to change to also have the build process create a MSI.

1. Install BtsMsiTask
Download and install [BtsMsiTask](http://richardhallgren.com/BtsMsiTask/). This will install a MsBuild task for generating the MSI.

2. Add a proj file to the solution 
<script src="https://gist.github.com/riha/24856902e68bae4ec244.js"></script> The project file will tell the BtsMsiTask process what aretafect to include. Add the project file to the solution and check it in as 
part of the solution.

3. Add project file to the TFS build template by adding it to list of project to build
![Adding the build file to the build process](https://www.dropbox.com/s/9bvopwd0p6vas1p/6.png?raw=1)

After another successful build we can see that we also created a MSI as part of the build!
![Succesful build with msi](https://www.dropbox.com/s/eadrq1eonqxivdb/7.png?raw=1)
 
## Adding build information to the MSI
### File name
As we can see the MSI we just created ended up with the default BtsMsiFile name that is a combination of the BizTalk application name property and the 
current date and time. Would it be nice of we instead could the build number as part of the name?
BtsMsiTask has an [optional property](http://richardhallgren.com/BtsMsiTask/available-parameters/) called file name that we for 
example can set to `<FileName>$(TF_BUILD_BUILDNUMBER).msi</FileName>`

### Source location
When then installing the artefact to BizTalk we can also see that the source location property in the BizTalk Administration Console is set to 
where the artefat was build on the stagin area. 
![Source Location without build number](https://www.dropbox.com/s/vtayz2mh6h48e7i/8.png?raw=1)

It be nice to also here have information about what build that built these arefacts.
 
We can change what set in the source location by using the the source location property of BtsMsiTask. 
So after setting the property as below, build again and resinstall we get the following.
![Source Location with build number](https://www.dropbox.com/s/lacj7iwzs8nt4e0/9.png?raw=1)
 
