---
date: 2015-03-31 12:00:0+01:00
layout: post
title: "Build and generate environment specific binding files for BizTalk Server using Team Foundation Build Services"
---
As most know a BizTalk Solution has two major parts – its resources in form of dlls, and its configuration in form of bindings. 
In an [previous post](http://richardhallgren.com/build-and-generate-msi-for-biztalk-server-using-team-foundation-build-services/) 
I described how to build and pack _resources_ into an MSI using Team Foundation Server (TFS) Build Services. Managing the configuration in a similar way is however equally important.
So let’s see how we can build environment specific binding files using TFS Build Services and some config transformations syntax goodness.


##Creating a simple binding example for development and test environment

Let’s start with a simple example of a simple binding with a receive port, receive location and a send port. 

<table>
    <tr>
        <th>Port type</th>
        <th>Name</th>
        <th>Path in Test</th>
        <th>Path in Production</th>
    </tr>
    <tr>
        <td>Receive Port</td>
        <td>BtsSample_ReceivePort_A</td>
        <td>N/A</td>
        <td>N/A</td>
    </tr>
        <tr>
        <td>Receive Location</td>
        <td>BtsSample_ReceivePort_A_Location</td>
        <td>C:\Temp\In\*.xml</td>
        <td>C:\Temp\In\*.xml</td>
    </tr>
        <tr>
        <td>Send Port</td>
        <td>BtsSample_SendPort_A</td>
        <td>C:\Temp\TEST\Out\%MessageID%.xml</td>
        <td>C:\Temp\PROD\Out\%MessageID%.xml</td>
    </tr>
</table>

As one can see there's a small difference between the paths in test and production in the paths for the send port.

##Exporting a binding template
Let's start by creating a binding template. The binding template will be the file that holds all information that is shared between the different environments. 
We’ll achiveive this by an ordinary export of the binding template from the BizTalk Adnministration Console - as you’ve probably done many times before.

<script src="https://gist.github.com/riha/72a597136892e428cf92.js"></script>

 
##Creating environment specific bindings using web.config Transformation Syntax
The [web.config Transformation Syntax](https://msdn.microsoft.com/en-us/library/dd465326.aspx) is feature that showed up in Visual Studio 2010 and 
that it’s most known usecase is to transform app.config and web.config files between different versions and environments – but it will of course work on any type 
of configuration file. Including BizTalk binding files!

Next we'll create to create two environment specific config files that only contains the changes that differs between the template and the values that specific for test and production. 
We use the web.config Transformation Syntax to match the nodes and values that we like to update in the template.

Below is the test environment specific file matching the send port and replacing the value with the value specific for test.
<script src="https://gist.github.com/riha/9f9fb0d2ca57502bd6f5.js"></script>

The production specific file also matches the send port but with a different value.
<script src="https://gist.github.com/riha/bf86d3de83f48b910809.js"></script>

##Using MSBuild to execute the transformation
As part of the Visual Studio installation an MsBuild target is installed for executing the transform. The target is installed into the standard [MSBuild Extensions Path](https://msdn.microsoft.com/en-us/library/ms164309.aspx) 
which usally mean something lilke `C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v10.0\Web\Microsoft.Web.Publishing.targets` depending a Visual Studio version etc.

Finally we'll add a small .proj file to pass some parameters to the MSBuild process. We need to tell the process what file to use as template and what different environment specific files we like to use.

<script src="https://gist.github.com/riha/79c4dab8854b8db6c692.js"></script>

Next we can kick of MsBUild and point it to the cretated proj file. `C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild build.proj`.

Voilla! MSBuild has performed our tranformation and created two complete environment specific binding file by combining the template with the specific environment files - one of test and one for production.

![Two specific binding files](https://www.dropbox.com/s/i0lt7i3lu54uih5/2.png?raw=1)

##Generationg the file using TFS Build Services
Start by setting up a TFS build defintion as described in previus post on [Generating BizTalk MSI using TFS Build Services](http://richardhallgren.com/build-and-generate-msi-for-biztalk-server-using-team-foundation-build-services/).

We then need to add the $(DestinationPath) property to our Destination path to make sure the outputted binding files are written to the same path as the rest of the reosurces

<script src="https://gist.github.com/riha/5213f920b22912fd1476.js"></script>

Once we have our build template all that's needed is to add the builöd.proj file to the files to coimplile as shown below

![Adding a build file](https://www.dropbox.com/s/o71ofgvt1f5ngay/3.png?raw=1)

When finally running the build our two binding files are written to the deployment area!
![Binding files in the deployment area](https://www.dropbox.com/s/szlteu8h963o1z7/4.png?raw=1)