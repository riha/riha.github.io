---
date: 2010-03-17 11:14:25+00:00
layout: post
title: "Is there a bug in BizTalk 2006 R2 SP1?"
categories: [BizTalk 2006]
---


> Update 2012-03-28: This bug was fixed in the CU2 update for BizTalk 2006 R2 SP 1. Further details can be found [here](http://support.microsoft.com/kb/2211420) and [here](http://support.microsoft.com/kb/983185). 


> Update 2010-04-12: Seems like there is a patch coming that should fix all the bugs in SP1 … I’ve been told it should be public within a week or two. I’ll make sure to update the post as I know more. Our problem is still unsolved.

Late Thursday night last week we decided to upgrade one of our largest BizTalk 2006 R2 environment to recently released [Service Pack 1](http://msdn.microsoft.com/en-us/library/ee532481(BTS.20).aspx). The installation went fine and everything looked good.

… But after a while we started see loads of error messages looking like below.

    Unable to cast COM object of type 'System.__ComObject' to interface type
    'Microsoft.BizTalk.PipelineOM.IInterceptor'. This operation failed because the
    QueryInterface call on the COM component for the interface with IID
    '{24394515-91A3-4CF7-96A6-0891C6FB1360}' failed due to the following error: Interface not
    registered (Exception from HRESULT: 0x80040155).

After lots of investigation we found out that we got the errors on ports with the follow criteria:
  

- **Send port**
   
- **Uses the SQL Server adapter**
   
- **Has a mapping on the port**
   
- **Has a BAM tracking profile associated with the port**
 
In our environment the tracking on the port is on “SendDateTime” from the “Messaging Property Schema”. We haven’t looked further into if just any BAM tracking associated with port causes the error or if only has to do with some specific properties. 

### Reproduce it to prove it!

I’ve setup a really simple sample solution to reproduce the problem. [**Download it here**](http://www.richardhallgren.com/blogfiles/SP1Issue.zip).

The sample receives a XML file, maps it on the send port to schema made to match the store procedure. It also uses a dead simple tracking definition and profile to track a milestone on the send port.[![image](../assets/2010/03/image_thumb.png)](../assets/2010/03/image.png)

#### Sample solution installation instructions


1. Create a database called “Test”

2. Run the two SQL scripts (“TBL_CreateIds.sql” and “SP_CreateAddID.sql”) in the solution to create the necessary table and store procedure

3. Deploy the BizTalk solution just using simple deploy from Visual Studio

4. Apply the binding file (“Binding.xml”) found in the solution

5. Run the BM.exe tool to deploy the BAM tracking defintion.          
Should look something like:

    bm.exe deploy-all -definitionfile:<the path to the solution>\BAM\SimpleTestTrackingDefinition.xml

6. Start the tracking Profile editor and open the “SimpleTestTrackingProfile.btt“ that you’ll find in the solution and apply the profile

7. Drop the test file in the receive folder (“InSchema_output.xml”)

The sample solution _fails on a environment with SP 1 but works just fine on a “clean” BizTalk 2006 R2 environment_.

### What about you?

I haven’t had time to test this on a BizTalk 2009 environment but I’ll update the post as soon as I get around to it.

We also currently have a support case with Microsoft on this and I’ll make sure to let you as soon as something comes out of that. But until then I’d be **_really grateful _**to hear from you if any of you have the same behavior in your BizTalk 2006 R2 SP1 environment.
