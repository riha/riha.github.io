---
date: 2008-11-12 12:53:32+00:00
layout: post
title: "Handle the 'bodyTypeAssemblyQualifiedName' SOAP Adapter bug in MSBuild as a RegEx ninja"
categories: [BizTalk 2006, MSBuild, RegEx]
---

This is a very specific problem but I'm sure some of you stumbled over it. When disassembling a XML message in a SOAP port BizTalk can't read the message type. This causes problems when for example trying to handle an envelope message and split it to smaller independent messages in the port. It's a known problem discussed [here](http://blogs.msdn.com/richardbpi/archive/2006/09/15/Fixing-_2200_SOAP-_2F00_-Envelope-Schema_2200_-Error-In-BizTalk.aspx) and [here](http://www.digitaldeposit.net/saravana/post/2007/08/17/SOAP-Adapter-and-BizTalk-Web-Publishing-Wizard-things-you-need-to-know.aspx) (you also find information about it in the [BizTalk Developer's Troubleshooting Guide](http://download.microsoft.com/download/3/7/6/376a6f6c-8c97-4ab5-9d5a-416c76793fbb/bts06developerstroubleshootingguide.doc)) and the solution is to make a small change in the generated web service class. Below is a small part of he generated class.
    
    //[cut for clarity] ...
                Microsoft.BizTalk.WebServices.ServerProxy.ParamInfo[] outParamInfos = null;
                string bodyTypeAssemblyQualifiedName = "XXX.NO.XI.CustomerPayment.Schemas.r1.CustomerPayments_v01, XXX.NO.XI.CustomerPaym" +
                    "ent.Schemas.r1, Version=1.0.0.0, Culture=neutral, PublicKeyToken=ac564f277cd4488" +
                    "e";
                // BizTalk invocation
                this.Invoke("SaveCustomerPayment", invokeParams, inParamInfos, outParamInfos, 0, bodyTypeAssemblyQualifiedName, inHeaders, inoutHeaders, out inoutHeaderResponses, out outHeaderResponses, null, null, null, out unknownHeaderResponses, true, false);
            }
        }
    }




Basically the problem is that the generated code puts the wrong _DocumentSpecName _property in the message context. I'll not dicusses the problem in detail here but Saravana Kumar does thorough dissection of the problem in [his post](http://www.digitaldeposit.net/saravana/post/2007/08/17/SOAP-Adapter-and-BizTalk-Web-Publishing-Wizard-things-you-need-to-know.aspx) on it. 







The solution is to update the _bodyTypeAssemblyQualifiedName_ to set a null value. That will cause the _XmlDiassasemler_ to work as we're used to and expect.




<blockquote>

> 
> If the value _null_ is passed instead of _bodyTypeAssemblyQualifiedName_, SOAP adapter won't add the _DocumentSpecName_ property to the context. Now, when we configure our auto-generated SOAP_ReceiveLocation_ to use _XmlReceive_ pipeline, the _XmlDisassembler_ component inside _XmlReceive_ will go through the process of automatic dynamic schema resolution mechanism, pick up the correct schema and promotes all the required properties (distinguished and promoted) defined in the schema and it also promotes the _MessageType_ property.
> 
> 

> 
> **From:** [http://www.digitaldeposit.net/saravana/post/2007/08/17/SOAP-Adapter-and-BizTalk-Web-Publishing-Wizard-things-you-need-to-know.aspx](http://www.digitaldeposit.net/saravana/post/2007/08/17/SOAP-Adapter-and-BizTalk-Web-Publishing-Wizard-things-you-need-to-know.aspx)
> 
> </blockquote>
    
    //[cut for clarity] ...
                Microsoft.BizTalk.WebServices.ServerProxy.ParamInfo[] outParamInfos = null;
                string bodyTypeAssemblyQualifiedName = null;
                // BizTalk invocation
                this.Invoke("SaveCustomerPayment", invokeParams, inParamInfos, outParamInfos, 0, bodyTypeAssemblyQualifiedName, inHeaders, inoutHeaders, out inoutHeaderResponses, out outHeaderResponses, null, null, null, out unknownHeaderResponses, true, false);
            }
        }
    }




But if you have an automated deployment process you probably use [MSBuild to generate your Web Services](http://geekswithblogs.net/michaelstephenson/archive/2006/09/16/91369.aspx). Then is soon becomes **_very _**annoying to remember to update the .cs-file again and again for every deployment. **So how can we script that update?**




First we need to find a regular expression to find the right values. With some help from [StackOverflow](http://stackoverflow.com/) (let's face it, there are some **_crazy_** regular expressions skills out there ...) I ended up on the following.
    
    (?<=string\sbodyTypeAssemblyQualifiedName\s=\s)(?s:[^;]*)(?=;)

![ninja5](/assets/2008/11/windowslivewriterhandlethebodytypeassemblyqualifiednameso-adf4ninja5-thumb.jpg) If you're not a RegEx ninja the line above does something like this:



  1. After the string "string bodyTypeAssemblyQualifiedName = " 

  2. turn on single line (treat "\r\n" as any other character) ( this is what "(?s: )" does) 

  3. match every character that is not a semicolon 

  4. until a single semicolon is reached. 



Then I used a task from the [SDC Task library](http://www.codeplex.com/sdctasks) (you probably already use this if you're using MSBuild and BizTalk). More specially we use the _File.Replace_
    
    <Target Name="FixSOAPServiceCode">
        <File.Replace
                Path="$(WebSiteServicePath)CustomerPaymentService\App_Code\CustomerPaymentService.asmx.cs"
                Force="true"
                NewValue="null"
                RegularExpression="(?&lt;=string\sbodyTypeAssemblyQualifiedName\s=\s)(?s:[^;]*)(?=;)">
        </File.Replace>
    </Target>




Now this task is part of the build script and called right after the tasks that generates the web service. This saves me a lot of manual work and potential errors! 
