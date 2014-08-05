---
date: 2007-08-02 08:44:09+00:00
layout: post
title: "Transform and split messages using an Xslt transformation pipeline component
  and the XmlDissasembler"
categories: [BizTalk 2006]
---

There was a question on the [Microsoft newsgroup](http://www.microsoft.com/technet/community/newsgroups/dgbrowser/en-us/default.mspx?dg=microsoft.public.biztalk.general) the other day where someone had to split a message into parts. But some of the information that was supposed to go in to the different parts were part of the envelope. I thought I'd give my solution to the problem a try - here it is.

Say for example that we receive the following message.
    
    <div><span style="color: #0000FF; "><</span><span style="color: #800000; ">ns0:EmployeeSalesReport </span><span style="color: #FF0000; ">ReportID</span><span style="color: #0000FF; ">="R100"</span><span style="color: #FF0000; "> EmployeeID</span><span style="color: #0000FF; ">="0012345"</span><span style="color: #FF0000; "> xmlns:ns0</span><span style="color: #0000FF; ">="http://Example.TransformAndSplit.EmployeeSalesReport"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Sales</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ns1:Sale </span><span style="color: #FF0000; ">xmlns:ns1</span><span style="color: #0000FF; ">="http://Example.TransformAndSplit.Sale"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ItemID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">100</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ItemID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Amount</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">10</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Amount</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ns1:Sale</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ns1:Sale </span><span style="color: #FF0000; ">xmlns:ns1</span><span style="color: #0000FF; ">="http://Example.TransformAndSplit.Sale"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ItemID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">200</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ItemID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Amount</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">20</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Amount</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ns1:Sale</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Sales</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ns0:EmployeeSalesReport</span><span style="color: #0000FF; ">></span></div>




In the above message we have different sales information from one employee **but all the global employee and report information (the _ReportID_ and _EmployeeID_ attributes) exists in the root node** (what we'll call the _envelope_ of the message). 




What we like to achieve is to split this envelope message into it's different sale item so we get separate message looking something like the below where each item contains the global information from the envelope.



    
    <div><span style="color: #0000FF; "><</span><span style="color: #800000; ">Sale </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">="http://Example.TransformAndSplit.Sale"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ItemID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">200</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ItemID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Amount </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">20</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Amount</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">EmployeeID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">0012345</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">EmployeeID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ReportID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">R100</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ReportID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Sale</span><span style="color: #0000FF; ">></span></div>




There might be different needs for doing this in a pipeline but much of it comes down to choice of architecture style in your BizTalk solution. Personally I'd refuse to introduce another orchestration for splitting a message like this. I don't believe that's what orchestrations are for (they should deal with possible logic and workflow in my world). I'm sure other people feel different - feel free to use the comments.




## Step 1 - Transforming the envelope message using XSLT




The first thing we'll need to do is to transform the envelope message so that the information from the root node (the _ReportID_ and the _EmployeeID_) get into every single _Sale-_node. There are a couple of ways of achieving this but I'll use the [XSLT-transformation pipeline component](http://msdn2.microsoft.com/en-us/library/aa561389.aspx) that ships with the BizTalk 2006 SDK.




All this component does is to let you point out a [XSLT stylesheet](http://en.wikipedia.org/wiki/XSLT) you like to use to transform your message. 




[![](/assets/2007/08/windowslivewritertransformandsplitmessagesusinganxslttrab-f7f6xsltpipeline-thumb9.jpg)](/assets/2007/08/windowslivewritertransformandsplitmessagesusinganxslttrab-f7f6xsltpipeline29.jpg)




The stylesheet I've used is part of the solution that you can download here. I will not show the stylesheet full script here but rather the result after the message travel through the component.



    
    <div><span style="color: #0000FF; "><?</span><span style="color: #FF00FF; ">xml version="1.0" encoding="utf-8"</span><span style="color: #0000FF; ">?></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">EmployeeSalesReport </span><span style="color: #FF0000; ">EmployeeID</span><span style="color: #0000FF; ">="0012345"</span><span style="color: #FF0000; "> ReportID</span><span style="color: #0000FF; ">="R100"</span><span style="color: #FF0000; "> xmlns</span><span style="color: #0000FF; ">="http://Example.TransformAndSplit.EmployeeSalesReport"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Sales </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Sale </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">="http://Example.TransformAndSplit.Sale"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ItemID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">100</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ItemID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Amount </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">10</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Amount</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">EmployeeID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">0012345</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">EmployeeID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ReportID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">R100</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ReportID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Sale</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Sale </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">="http://Example.TransformAndSplit.Sale"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ItemID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">200</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ItemID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Amount </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">20</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Amount</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">EmployeeID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">0012345</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">EmployeeID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ReportID </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">=""</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">R100</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ReportID</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Sale</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Sales</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">EmployeeSalesReport</span><span style="color: #0000FF; ">></span></div>




Ok, nice. Now we have all the information we like in each of the _Sale_-nodes! All we have to do now is to split the message!




## Step 2 - Splitting the message




We'll use the standard [_XmlDisassembler_](http://msdn2.microsoft.com/en-us/library/ms964545.aspx) component for splitting the message. All we have to do is to make sure we done the following.






  1. Set the schema envelope property to "**true"** in the schema editor. 

  2. Set the _Body Xpath_ property on the _EmployeeSalesReport-_node to point to the _Sale-_node.

  3. Configure the _Document Schemas _and_ Envelope Schemas (_same properties are called _DocumentSpecNames_ and _EnvelopeSpecNames_ if your doing the configuration after deployment in the administration console_)_ properties of the _XmlDisassember_ component to match the names of your schemas.



This is what the envelope schema looks like in this example.




[![](/assets/2007/08/windowslivewritertransformandsplitmessagesusinganxslttrab-f7f6envelopeschema-thumb19.jpg)](/assets/2007/08/windowslivewritertransformandsplitmessagesusinganxslttrab-f7f6envelopeschema59.jpg)




This is what the _XmlDisassembler_ configuration looks like.




[![](/assets/2007/08/windowslivewritertransformandsplitmessagesusinganxslttrab-f7f6pipelineconfig-thumb9.jpg)](/assets/2007/08/windowslivewritertransformandsplitmessagesusinganxslttrab-f7f6pipelineconfig29.jpg)




There, we're done! Now we can drop a test file containing two _Sale_-nodes and all the report/employee information on the top and have the two following separate files as a result when using a file send port.




[![](/assets/2007/08/windowslivewritertransformandsplitmessagesusinganxslttrab-f7f6out-thumb9.jpg)](/assets/2007/08/windowslivewritertransformandsplitmessagesusinganxslttrab-f7f6out29.jpg)




## Setting up the test solution






  1. [Download](http://www.richardhallgren.com/blogfiles/Example.TransformAndSplit.zip) a zipped version of the solution.

  2. You'll have to unzip the project to _C:\Example.TransformAndSplit_. If that isn't possible you'll have to change the path to the XSLT stylesheet in the _XsltComponent_ in the pipeline as this is a fixed path.

  3. When you build the _XsltComponent_ the _Output path_ is set to the _Pipeline Components_ folder. This assumes that BizTalk is installed at _C:\Program Files\Microsoft BizTalk Server 2006\_. If that isn't the case make sure to change the output path of the component.

  4. If you'd like to run the pipeline component in debug I've set this up using the [pipeline.exe tool.](http://msdn.microsoft.com/library/en-us/sdk/htm/ebiz_sdk_utils_pipeline_ackm.asp?frame=true) There are however some paths in the debug setting of the _XsltComponent_ project also that assumes that your BizTalk solutions is installed at _C:\Program Files\Microsoft BizTalk Server 2006\. _If this isn't the case you'll have to change some values in the _Command lines arguments_ property, but that only if you like to run debug.

  5. Build and deploy.

  6. Set up a receive port and location using the _TransformAndSplitSales_ pipeline.

  7. Set up a send port with for example a filter on the name of the _Receiveport_ you've just set up.

  8. Drop the example message that's part of the solution!



## Final thoughts




This example didn't really take much more than an hour to put together. I do however realize that this is a simplified incoming message and that in the case of a more complex message we'd get a messy XSLT stylesheet to maintain. It's also important to remember that using this method with XSLT transformation means that we will load the entire incoming Xml document into memory, so when we're dealing with bigger Xml documents we'll have manipulate the incoming message using other techniques.




Hope this is useful for someone!
