---
date: 2015-03-31 12:00:0+01:00
layout: post
title: "Build and generate environment specific binding files for BizTalk Server using Team Foundation Build Services"
---
As most know a BizTalk Solution has two major parts – its resources in form of dlls, and its configuration in form of bindings. 
In an [previous post](http://richardhallgren.com/build-and-generate-msi-for-biztalk-server-using-team-foundation-build-services/) 
I described how to build and pack _resources_ into an MSI using Team Foundation Server (TFS) Build Services. Managing the configuration in a similar way is equally important.
So let’s see how we can build environment specific binding files using TFS Build Services and some config transformations syntax goodness!

![Workflow](https://www.dropbox.com/s/3c4hz5v643v1p4z/5.png?raw=1)

##Creating a simple binding example for development and test environment

Let’s start with a simple example of a simple binding with a receive port, receive location and a 
send port for two different environments - one called "Test" and one "Production".

<table class="post" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <th>Port type</th>
        <th>Name</th>
        <th>Destination path in Test</th>
        <th>Destination path in Production</th>
    </tr>
    <tr>
        <td>Receive Port</td>
        <td>BtsSample_ReceivePort_A</td>
        <td>N/A</td>
        <td>N/A</td>
    </tr>
        <tr>
        <td>Receive Location</td>
        <td>BtsSample_ReceivePort_A_Location (File)</td>
        <td>C:\Temp\In\*.xml</td>
        <td>C:\Temp\In\*.xml</td>
    </tr>
        <tr>
        <td>Send Port</td>
        <td>BtsSample_SendPort_A (File)</td>
        <td>C:\Temp\<strong>TEST</strong>\Out\%MessageID%.xml</td>
        <td>C:\Temp\<strong>PROD</strong>\Out\%MessageID%.xml</td>
    </tr>
</table>
As one can see there's a small difference between the send ports destinations paths in Test and Production.

##Exporting a binding template
Next we'll create a binding template. The binding template will hold all information that is shared between the different environments. 
This is achieved this by an ordinary export of the application binding from the BizTalk Administration Console - as you’ve probably done many times before.
<script src="https://gist.github.com/riha/72a597136892e428cf92.js"></script>
 
##Creating environment specific bindings using web.config Transformation Syntax
The [Web.config Transformation Syntax](https://msdn.microsoft.com/en-us/library/dd465326.aspx) is feature that showed up in Visual Studio 2010 and 
is often used to transform app.config and web.config files between different versions and environments – but it will of course work on any type 
of configuration file. Including BizTalk binding files!

So for each environment we'll then create an environment specific config file that only contains the values that differs between the template and 
the values for that environment. We use the Web.config Transformation Syntax to match the nodes and values that we like to update in the template.

Below is the Test environment specific file matching the send port and replacing the value with the value specific for Test.
<script src="https://gist.github.com/riha/9f9fb0d2ca57502bd6f5.js"></script>

The Production specific file also matches the send port but with a different value for the Destination path.
<script src="https://gist.github.com/riha/bf86d3de83f48b910809.js"></script>

##Using MSBuild to execute the transformation
As part of the Visual Studio installation an MSBuild target is installed for executing the transform. 
The target is installed into the standard [MSBuild Extensions Path](https://msdn.microsoft.com/en-us/library/ms164309.aspx) 
which usally mean something lilke `C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v10.0\Web\Microsoft.Web.Publishing.targets` 
depending a Visual Studio version etc.

Finally we'll add a small .proj file to pass some parameters to the MSBuild process. We need to tell the process what file to use as 
template and what different environment specific files we like to use.
<script src="https://gist.github.com/riha/79c4dab8854b8db6c692.js"></script>

Next we can kick of MSBuild and point it to the cretated proj file. `C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild build.proj`.

Voila! MSBuild has performed our transformation and created two complete environment specific binding file by combining the template with the specific environment files - one of test and one for production.

![Two specific binding files](https://www.dropbox.com/s/i0lt7i3lu54uih5/2.png?raw=1)

##Generating the file using TFS Build Services
Start by setting up a TFS build definition as described in previous post on 
[Generating BizTalk MSI using TFS Build Services](http://richardhallgren.com/build-and-generate-msi-for-biztalk-server-using-team-foundation-build-services/).

We then need to add the $(DestinationPath) property to our Destination path to make sure the outputted binding files are written to the same 
path as the rest of the resources.

<script src="https://gist.github.com/riha/5213f920b22912fd1476.js"></script>

Once we have our build template all that's needed is to add the build.proj file to the files to compile as shown below.

![Adding a build file](https://www.dropbox.com/s/o71ofgvt1f5ngay/3.png?raw=1)

When finally running the build our two complete binding files are written to the deployment area and ready for installation!

![Binding files in the deployment area](https://www.dropbox.com/s/szlteu8h963o1z7/4.png?raw=1)