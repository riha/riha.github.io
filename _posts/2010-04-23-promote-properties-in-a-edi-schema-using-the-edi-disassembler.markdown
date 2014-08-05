---
date: 2010-04-23 07:08:46+00:00
layout: post
title: "Promote properties in a EDI schema using the EDI Disassembler"
categories: [BizTalk 2006, EDI, R2]
---

I’ve doing a lot of EDI related work in BizTalk lately and I have to say that I’ve really enjoyed it! EDI takes a while to get used to (see example below), but once one started to understand it I’ve found it to be a real nice, strict standard - with some cool features built into BizTalk!     


 
    
    UNB+IATB:1+6XPPC+LHPPC+940101:0950+1'
    UNH+1+PAORES:93:1:IA'
    MSG+1:45'
    IFT+3+XYZCOMPANY AVAILABILITY'
    ERC+A7V:1:AMD'
    IFT+3+NO MORE FLIGHTS'
    ODI'
    TVL+240493:1000::1220+FRA+JFK+DL+400+C'
    ...





There are however some things that _doesn't _work as expected …





### Promoting values





According to the [MSDN documentation](http://msdn.microsoft.com/en-us/library/bb226404(BTS.20).aspx) the EDI Disassembler by default promotes the following EDI fields: UNB2.1, UNB2.3, UNB3.1, UNB11; UNG1, UNG2.1, UNG3.1; UNH2.1, UNH2.2, UNH2.3.





There are however situation where one would like _other_ values promoted.





I my case I wanted the C002/1001 value in the [BGM segment](http://www.stylusstudio.com/edifact/d04b/BGM_.htm). This is a value identifying the purpose of the document and I needed to route the incoming message based on the value.





The short version is that _creating a property schema, promoting the field in the schema and having the EDI Disassembler promoting the value **will not work** (as with the XML Disassembler)_. To do this you’ll need to use a custom pipeline component to promote the value. Rikard Alard seem to have come to the same conclusion [here](http://rikardalard.wordpress.com/2009/06/15/promoted-properties-in-edi-schema-is-not-promoted-by-edireceive/).





### Promote pipeline component to use





If you don’t want to spend time on writing your own pipeline component to do this yourself you can find a nice “promote component” on CodePlex [here](http://eebiztalkpipelinecom.codeplex.com/) by [Jan Eliasen](http://blog.eliasen.dk).





If you however expect to receive lots and lots of big messages you might want to look into changing the component to use XPathReader and custom stream implementations in the Microsoft.BizTalk.Streaming.dll. You can find more detailed information on how to do that in this [MSDN article](http://msdn.microsoft.com/en-us/library/ee377071(BTS.10).aspx).
