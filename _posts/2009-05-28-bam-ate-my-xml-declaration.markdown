---
date: 2009-05-28 12:14:49+00:00
layout: post
title: "BAM ate my XML declaration!"
categories: [BAM, BizTalk 2006]
---

There are integrations which only purpose is to move a file _just as it is_. No advanced routing. No orchestration processing. No transformation. Just a simple port-to-port messaging scenario.

 

It is however still a good idea to monitor these just as one would monitor a more complicated integration. We use BAM to monitor all our integrations and to measure how many messages that has been processed in a integration. Using BAM monitoring in a simple solution as the above however has its issues …

 

### Setting up a simple test solution

 

[![image](/assets/2009/05/image-thumb.png)](/assets/2009/05/image.png)

 

  
  1. The solution will move a XML file between two port called “SimpleTrackingReceivePort” and “SimpleTrackingSendPort”. 
   
  2. Both port have _PassThru pipelines configured_. 
   
  3. _The XML file does not have a installed schema_. Remember we are just moving the file not actually doing anything with it. 
   
  4. A BAM tracking definition with one milestone called “StartPort” will be used. This will be mapped to the “PortStartTime” property on both the receiving and sending port .
 

Our tracking profile configuration will like below. Dead simple.

 

[![image](/assets/2009/05/image-thumb1.png)](/assets/2009/05/image1.png)

 

### So – what’s the problem?

 

Let us drop a XML message looking some like this.

 
    
    <?xml version="1.0" encoding="UTF-16"?>
    <SimpleTest>
        <SimpleContent Text="This is a test" />
    </SimpleTest>





Remember that there is not a schema installed so we do not really have to worry about the structure of the file. It should just be “a file” to BizTalk and everything should be transferred between the ports. Even if we drop a executable or whatever - it should just be transferred. **_Nothing should read or examine the file_** as it’s just a pass thru!





**_As soon as BAM tracking is configured on a port that is however not the case_**. Lets take a look at the file we receive on the other end of our integration.




    
    <SimpleTest>
        <SimpleContent Text="This is a test" />
    </SimpleTest>





**_BizTalk now removed our XML declaration!_** Basically it treated the message as a XML message and parsed the message as such while tracking it. It' will also add the dreaded [Byte-Order-Mark](http://en.wikipedia.org/wiki/Byte-order_mark) and fail any non-valid XML messages. The problem is that **_this is not the behavior what one expects_** and causes receiving systems that rely on the XML declaration to fail!





As we also don’t have a installed schema it is not possible to use a XMLTransmit pipeline to add the XML declaration and remove the BOM.





### What to do?





If you’d like to track a XML based message using BAM make sure you have the schema installed … Even if you are just using PassThru.





Is it a bug or just something one should expect? In my opinion it is at least **_very_** annoying!
