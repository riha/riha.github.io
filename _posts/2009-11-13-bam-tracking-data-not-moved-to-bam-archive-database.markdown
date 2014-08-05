---
date: 2009-11-13 15:31:20+00:00
layout: post
title: "BAM tracking data not moved to BAM Archive database"
categories: [BAM, BizTalk]
---

There are a few really good blog post that explains BAM – like [this](http://blogs.digitaldeposit.net/SARAVANA/post/2009/10/08/BAM-Production-environment-management.aspx) from Saravana Kumar and [this](http://geekswithblogs.net/andym/archive/2009/05/21/132346.aspx) by Andy Morrison. They both do a great job explaining the complete BAM process in detail.

 

This post will however focus on some details in the last step of the process that has to do with archiving the data. Let’s start with a quick walk-through of the whole process.

 

### BAM Tracking Data lifecycle

 

[![image](/assets/2009/11/image_thumb.png)](/assets/2009/11/image3.png)

 

  
  1. The tracked data is intercepted in the BizTalk process and written to the “BizTalk MsgBox” database. 
   
  2. The TDDS service reads the messages and moves them to the correct table in the “BAM Primary Import” database. 
   
  3. The SSIS package for the current BAM activity has to be triggered (this is manual job or something that one has to schedule). When executing the job will do couple of things.             
    1. Create a new partitioned table with a name that is a combination of the active table name and a GUID. 
       
    2. Move data from the active table to this new table. The whole point is of course to keep the active table as small and efficient as possible for writing new data to. 
       
    3. Add the newly created table to a database view definition. It is this view we can then use to read all tracked data (including data from the active and partitioned tables). 
       
    4. Read from the “BAM Metadata Activities” table to find out the configured time to keep data in the BAM Primary Import database. This value is called the “online window”. 
       
    5. Move data that is older than the online window to the “BAM Archive” database (or delete it if you have that [option](http://support.microsoft.com/kb/971984)). 
       
 

Sound simple doesn’t it? I was however surprised to see _that my data was not moved to the BAM Archive database, even if it was clearly outside of the configured online window_.

 

### So, what data is moved to the BAM Archive database then?

 

Below there is a deployed tracking activity called “SimpleTracking” with a online window of 7 days. Ergo, _all data that is older than 7 days should be moved to the BAM Archive database when we run the SSIS job for the activity_.

 

[![image](/assets/2009/11/image_thumb5.png)](/assets/2009/11/image8.png)

 

If we then look at the “BAM Completed” table for this activity we see that all the data is much older than 7 days as today's date is “13-11-2009”.

 

_So if we run the SSIS job these rows should be moved to the archive database. lets run the SSIS job. Right?_

 

[![image](/assets/2009/11/image_thumb6.png)](/assets/2009/11/image9.png)

 

But when we execute the SSIS job the BAM Archive database is still empty! All we see are the partitioned tables that were created as part of the first steps of the SSIS job. _All data from the active table is however moved to the new partitioned table but not moved to the Archive database._

 

[![image](/assets/2009/11/image_thumb7.png)](/assets/2009/11/image10.png)

 

_It turns out that the SSIS job does **not at all look at the the “Last Modified” values** of each row **but on the “Creation Time” of the partitioned table in the “BAM MetaData Partitions” table** that is shown below._

 

[![image](/assets/2009/11/image_thumb8.png)](/assets/2009/11/image11.png)

 

The idea behind this is of course to not have to read from tables that potentially are huge and find those rows that should be moved. But it also means that it will _take another 7 days before the data in the partitioned view is actually move to the archive database._

 

This might actually be a problem if you haven not scheduled the SSIS job to run from day one and you BAM Primary Import database is starting to get to big and you quickly have to move data over to archiving. All you then have to is of course to change that “Creation Time” value in the BAM Metadata Partitions table so it is outside of the online window value for the activity.
