---
date: 2011-01-18 14:48:36+00:00
layout: post
title: "End-to-end tracking using BAM services and the BAM Service Generator tool"
categories: [BizTalk 2006]
---

An integration between systems can often be view upon as a chain of system and services working together to move a message to its final destination.

 

[![image](/assets/2011/01/image_thumb5.png)](/assets/2011/01/image5.png)

 

One problem with this loosely-coupled way of dealing with message transfers is that its hard to see if and where something has gone wrong. Usually all we know is that the sending system has send the message, but the final system never received it. The problem could then be within any of the components in between. Tracking messages within BizTalk is one thing but achieving a _end-to-end tracking _within the whole “chain” is much harder.

 

One way of solving the end-to-end tracking problem is to use [BAM](http://msdn.microsoft.com/en-us/library/ee253368(BTS.10).aspx). BAM is optimized for these kind of scenarios were we might have to deal with huge amount of messages and data – several of the potential problems around these issues are solved out-of-the-box (write optimized tables, partitioning of tables, aggregated views, archiving jobs and so on).

 

And even though BAM is a product that in theory isn’t tied to BizTalk its still a product that is easier to use in the context of BizTalk than outside of it due tools like the [BizTalk Tracking Profile Editor](http://msdn.microsoft.com/en-us/library/ee253776(v=bts.10).aspx) and the built in BAM-interceptor patterns within BizTalk. It is however fully possible to track BAM data and take advantage of the BAM infrastructure even outside of BizTalk using the [BAM API](http://msdn.microsoft.com/en-us/library/ee277263(v=bts.10).aspx). 

 

The BAM API is a .NET based API used for writing tracking data to the BAM infrastructure from any .NET based application. There are however a few issues with this approach.

 

The application sending the tracking data has to be .NET based and use the loose string based API. So for example writing to the “ApprovedInvoice” activity below would look something like this – lots of untyped strings.

 
    
    public void Log(ApprovedInvoicesServiceType value) 
    { 
        string approvedInvoicesServiceActivityID = Guid.NewGuid().ToString();
        
        var es = new DirectEventStream("Integrated Security=SSPI;Data Source=.;Initial Catalog=BAMPrimaryImportw", 1);
    
        es.BeginActivity("ApprovedInvoices", approvedInvoicesServiceActivityID);
    
        es.UpdateActivity("ApprovedInvoices", approvedInvoicesServiceActivityID, 
            "ApprovedDate", "2011-01-18 12:02", 
            "ApprovedBy", "Richard", 
            "Amount", 122.34, 
            "InvoiceId", "Invoic123");
     
        es.EndActivity("ApprovedInvoices", approvedInvoicesServiceActivityID); 
    }





One way of getting around problem with the usage of strings is to use the “[Generate Typed BAM API tool](http://generatetypedbamapi.codeplex.com/)”. The tool reads the BAM definition file and generates a dll containing strong types that corresponds to the fields in the definition. By referencing the dll in the sending application we can get a strong typed .NET call. The fact that this still however _requires a .NET based application_ remains. 





The obvious way to solve the limitation of a .NET based client - and to get one step closer to a end-to-end tracking scenario - is of course to wrap the call to the API in a service. 





### BAM Service Generator





[BAM Service Generator](http://bmsrvgen.codeplex.com/) is very similar to the Generate Typed BAM API tool mentioned above with the difference that instead of generation a .NET dll it generates a WCF service for each activity.




    
    c:\Tools\bmsrvgen.exe /help 
    	
    BAM Service Generator Version 1.0 
    
    Generates a WCF service based on a BizTalk BAM definition file.
    
     -defintionfile: Sets path to BAM definition file.
     -output: Sets path to output folder.
     -namespace: Sets namespace to use.
    
    Example: bmsrvgen.exe -defintionfile:c:\MyFiles\MyActivityDef.xml 
    -output:c:\tempservices -nampespace:MyCompanyNamespace





The [BAM Service Generator](http://bmsrvgen.codeplex.com/) is a command line tool that will read the BAM definition file and generate a compiled .NET 4.0 WCF service. The service is configured with a default basicHttp endpoint and is ready to go straight into AppFabric or similar hosting. 





[![image](/assets/2011/01/image_thumb7.png)](/assets/2011/01/image7.png)





This service-approach makes it possible to take advantage of the BAM infrastructure from all different types of system, and even in cases when they aren’t behind the same firewall! As shown in figure below this could take us one step closer to the end-to-end tracking scenario.





[![image](/assets/2011/01/image_thumb8.png)](/assets/2011/01/image8.png)





“BAM Service Generator” is open-source and can be found [here](http://bmsrvgen.codeplex.com/).
