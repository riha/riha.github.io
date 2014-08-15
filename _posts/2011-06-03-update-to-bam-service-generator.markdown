---
date: 2011-06-03 05:58:29+00:00
layout: post
title: "Update to BAM Service Generator"
categories: [BizTalk 2006]
---

I have previously [written](http://www.richardhallgren.com/end-to-end-tracking-using-bam-services-and-the-bam-service-generator-tool/) about how to generate a types set of WCF services to achieve end-to-end BAM based tracking – making BAM logging possible from outside potential firewalls and/or from non .NET based clients.

In that post I reference a open source tool to generate the services based on the BAM definition files to be able to make types BAM API calls. I called the tool [BAM Service Generator](http://bmsrvgen.codeplex.com/) and it’s published on CodePlex.

The first version of the tool only made it possible to make simple activity tracking calls, even missing the option to defining a custom activity id. All advanced scenarios like continuation, activity and data reference or even updating a activity wasn’t possible. That has now been fixed and the second version of the tool enables the following operations.

  * **LogCompleteActivity**         
Creates a simple logging line and is the most efficient option if one only want's to begin, update and and end an activity logging as soon as possible. 
   
  * **BeginActivity**         
Start a new activity with a custom activity id 
   
  * **UpdateActivity**         
Updates a already started activity and accepts a types object as a parameter. The typed object is of course based on what's has been defined in the BAM definition file. Multiple updates can be made until EndActivity is called. 
   
  * **EnableContinuation**         
Enables continuation. This is used if you have multiple activity loggings that belong together but you can not use the same activity id. This enables you to tie those related activities together using some other set of id (could for example be the invoice id). 
   
  * **AddActivivityReference**         
Add a reference to an another activity and enables you to for example display a link or read that whole activity when reading the main one. 
   
  * **AddReference**         
Adds a custom reference to something that isn’t necessarily an activity. Could for example be a link to a document of some sort. Limited to 1024 characters. 
   
  * **AddLongReference**         
Similar to AddReference but enables to also store a blog of data using the LongRefernceData parameter – limited to 512 KB. 
   
  * **EndActivity**         
Ends a started activity. 

Let [me know](mailto:richard.hallgren@gmail.com) if you think that something is missing, if something isn’t working as would expect etc.
