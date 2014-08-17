---
date: 2008-10-30 14:59:17+00:00
layout: post
title: "Using BizUnitExtensions to poke around in some XML"
categories: [BizTalk 2006, BizUnit, BizUnitExtensions]
---

I'll start by saying that I really (like in "really, **_really!_**") like [BizUnit](http://www.codeplex.com/bizunit)! BizUnit in combination with [MSBuild](http://msdn.microsoft.com/en-us/library/wea2sca5.aspx), [NUnit](http://www.nunit.org/index.php) and [CruiseControl.NET](http://confluence.public.thoughtworks.org/display/CCNET/Welcome+to+CruiseControl.NET) has really changed the way work and how I _feel_ about work in general and BizTalk development in particular.

If you haven't started looking into what for example MSBuild can do you for you and your BizTalk build process you're missing out on something great. The time spent on setting up a automatic build process is time well spent - take my word for it!

But build processes isn't was this post is supposed to be about. This post is about one of the few limitations of BizUnit and the possibilities to work around one of those in particular.

<blockquote>BizUnit is a test framework that is intended to test Biztalk solutions. BizUnit was created by Kevin.B.Smith and can be found on [this CodePlex space](http://www.codeplex.com/bizunit) . BizUnit has quite a significant number of steps that have nothing to do with Biztalk per se and can be used for any integration project testing.
> 
> </blockquote>

<blockquote>[![note](../assets/2008/10/windowslivewriterusingbizunitextensionstopokesomexml-d286note-thumb.gif)](../assets/2008/10/windowslivewriterusingbizunitextensionstopokesomexml-d286note-2.gif)If you have used BizUnit before and need an introduction before reading further, start [here](http://www.codeproject.com/KB/biztalk/BizUnit2006.aspx), [here](http://www.codeplex.com/bizunit) or [here](http://biztalkia.blogspot.com/2007/03/getting-started-with-nunit-and-bizunit.html) - they're all excellent articles.
> 
> </blockquote>

As stated BizTalk has quite a significant number of steps but to my knowledge it's missing a step to change and update file from within the test script. This step and a couple of other are added in separate fork-project to BizUnit called [BizUnitExtensions](http://www.codeplex.com/bizunitextensions).

<blockquote>This project [_BizUnitExtension_] aims to provide some more test step libraries, tools and utilities to enhance the reach of BizUnit. Here you can find some enhancements/extensions to the steps in the base libraries , new steps, support applications, tutorials and other documentation to help you understand and use it....This project is currently owned and contributed to by Santosh Benjamin and Gar Mac Críostaand. Our colleagues have also contributed steps and suggestions. We welcome more participation and contributions. 
> 
> </blockquote>

Amongst other steps (some for Oracle DBs etc) BizUnitExtensions adds a [XmlPokeStep](http://www.codeplex.com/bizunitextensions/Wiki/View.aspx?title=BizUnit%20Extensions&referringTitle=Documentation)!

<blockquote>**XmlPokeStep:** This step is modelled on the lines of the NAnt XmlPoke task The XmlPokeStep is used to update data in an XML file with values from the context This will enable the user to write tests which can use the output of one step to modify the input of another step.
> 
> </blockquote>

A cool thing about BizUnitExtensions is that it really just extends BizUnit. You'll continue to run on the BizUnit dll:s when you use steps form BizUnit and just use the BizUnitExtensions code when you actually use some of steps from that library.

The example below shows how we first use an ordinary BizUnit task to validate and read a value from a file. We then use BizUnitExtension to gain some new powers and update the file with that value we just read.
    
    <!–Ordinary BizUnit step to validate a file –>
    <TestStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.FileValidateStep">
        <Timeout>5000</Timeout>
        <Directory>..\..\ReceiveRequest</Directory>
        <SearchPattern>*Request.xml</SearchPattern>
        <DeleteFile>false</DeleteFile>
    
        <ContextLoaderStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.XmlContextLoader">
            <XPath contextKey="messageID">/*[local-name()=’SystemRequest’]/ID</XPath>
        </ContextLoaderStep>
    
    </TestStep>
    
    <!–Use BizUnitExtensions to poke the value and change it –>
    <TestStep assemblyPath="BizUnitExtensions.dll" typeName="BizUnit.Extensions.XmlPokeStep">
        <InputFileName>..\..\SystemResponse.xml</InputFileName>
        <XPathExpressions>
            <Expression>
                <XPath>/*[local-name()=’SystemResponse’]/ID</XPath>
                <NewValue takeFromCtx="messageID"></NewValue>
            </Expression>
        </XPathExpressions>
    </TestStep>

This of course means that all you need to extend you current test steps and gain some cool new abilities is to add another assembly to you test project![![image](../assets/2008/10/windowslivewriterusingbizunitextensionstopokesomexml-d286image-thumb-3.png)](../assets/2008/10/windowslivewriterusingbizunitextensionstopokesomexml-d286image-8.png) 


### Using BizUnitExtensions in a "real" scenario




An scenario when this can be useful is the following example were we need to test some message correlation.[![image](../assets/2008/10/windowslivewriterusingbizunitextensionstopokesomexml-d286image-thumb.png)](../assets/2008/10/windowslivewriterusingbizunitextensionstopokesomexml-d286image-2.png)






  1. A message request is received via a web service. 

  2. The message is sent to a queue via an orchestration in BizTalk. _To be able to correlate the response **a message id is added to the message request** sent to the back-end system._
  3. A message response is sent from the back-end system using a second queue. _The response message contains the same message id as the incoming request contained_. 

  4. BizTalk correlates the message back to the web service using the message id. 



So how can we **_now test this_**? The steps should be something like the below.




<blockquote>

> 
> [![note](../assets/2008/10/windowslivewriterusingbizunitextensionstopokesomexml-d286note-thumb-1.gif)](../assets/2008/10/windowslivewriterusingbizunitextensionstopokesomexml-d286note-4.gif) Notice that we read and write to the file system in the example. Once deployed to test these send ports and receive location will be reconfigured to use the queuing adapter. But for testing the scenario the file system works just fine a simplifies things IMHO.
> 
> </blockquote>






  1. Send a request message using BizUnit and the _HttpRequestResponseStep_. Make sure it runs _**concurrently**_ with the other steps and then wait for a response (using the _runConcurrently-_attribute on the step).
  2. Configure the send port so the orchestration that added the generated message id writes the message to a folder. Use the _FileValidateStep_ and a nested _XmlContextLoader_ to read the message from the folder and write the message id the context.
  3. Use the context and the _XmlPokeStep_ from BizUnitExtensions to update a response message template with the message id from the request message (this is of course needed so we can correlate the response message back to the right orchestration).
  4. Copy the update response message template using the _FileCreateStep_ to the folder that is monitored by the the receive location used for reading responses. 
    
    <TestCase testName="TestCorrelationTest">
        <TestSetup>
            <!–Clean up!–>
            <TestStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.FileDeleteMultipleStep">
                <Directory>..\..\ReceiveRequest</Directory>
                <SearchPattern>*.*</SearchPattern>
            </TestStep>
            <TestStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.FileDeleteMultipleStep">
                <Directory>..\..\SendResponse</Directory>
                <SearchPattern>*.*</SearchPattern>
            </TestStep>
        </TestSetup>
    
        <TestExecution>
            <!–Post a request message on the SOAP port. Run it Concurrently–>
            <TestStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.HttpRequestResponseStep" runConcurrently="true">
                <SourcePath>..\..\WebRequest.xml</SourcePath>
                <DestinationUrl>http://localhost:8090/BizTalkWebService/WebService1.asmx?op=WebMethod1</DestinationUrl>
                <RequestTimeout>15000</RequestTimeout>
            </TestStep>
    
            <!–Read the system request message and read the generaed id to the context–>
            <TestStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.FileValidateStep">
                <Timeout>5000</Timeout>
                <Directory>..\..\ReceiveRequest</Directory>
                <SearchPattern>*Request.xml</SearchPattern>
                <DeleteFile>false</DeleteFile>
                <ContextLoaderStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.XmlContextLoader">
                    <XPath contextKey="messageID">/*[local-name()=’SystemRequest’]/ID</XPath>
                </ContextLoaderStep>
            </TestStep>
    
            <!–If we have the file in source control it might be read-only -> remove that attribute–>
            <TestStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.ExecuteCommandStep">
                <ProcessName>attrib</ProcessName>
                <ProcessParams>SystemResponse.xml -r</ProcessParams>
                <WorkingDirectory>..\..\</WorkingDirectory>
            </TestStep>
    
            <!–Update our response template (using BizUnitExtensions) and add the message id that we read into the the context–>
            <TestStep assemblyPath="BizUnitExtensions.dll" typeName="BizUnit.Extensions.XmlPokeStep">
                <InputFileName>..\..\SystemResponse.xml</InputFileName>
                <XPathExpressions>
                    <Expression>
                        <XPath>/*[local-name()=’SystemResponse’]/ID</XPath>
                        <NewValue takeFromCtx="messageID"></NewValue>
                    </Expression>
                </XPathExpressions>
            </TestStep>
    
            <!–Wait a moment so we don’t copy the file until we’re done updating it–>
            <TestStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.DelayStep">
                <Delay>1000</Delay>
            </TestStep>
    
            <!–Copy the file to the folder that monitored by the receive location for opicking up system responses–>
            <TestStep assemblyPath="" typeName="Microsoft.Services.BizTalkApplicationFramework.BizUnit.FileCreateStep">
                <SourcePath>..\..\SystemResponse.xml</SourcePath>
                <CreationPath>..\..\SendResponse\SystemResponse.xml</CreationPath>
            </TestStep>
        </TestExecution>
    </TestCase>




This might look messy at first but I think it's really cool I also think it worth thinking about on how you should run this at during development otherwise? You would then have to build some small stub to return a response message with the right id ... I prefer this method!







BizUnitExtension makes me like BizUnit even more! Thanks to [_Kevin. B. Smith_](http://kevinsmi.blogspot.com/), [_Santosh Benjamin_](http://santoshbenjamin.wordpress.com/) and _[Gar Mac Críostaand](http://thetaoofbiztalk.blogspot.com/)_ for spending so much time on this and sharing it with us mere mortals!




Update: Gar's blog can be found [here](http://thetaoofbiztalk.blogspot.com/).
