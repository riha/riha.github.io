---
date: 2007-12-20 12:38:24+00:00
layout: post
title: "Removing namespace from outgoing messages"
categories: [BizTalk 2006]
---

Way to often I get a request to deliver a message from BizTalk without any [XML namespace](http://en.wikipedia.org/wiki/XML_namespace). Comments like the one below aren't that rare.

 

<blockquote>  
> 
> Why do you put those "ns0" I front of every tag!? We can't read the XML when it's written like that! All our XPath and XSLT seems to fail.
> 
>    
> 
> We don't want _**<ns0:OutMessage xmlns:ns0="Acme.Messages.OutMessage/1.0">**_ ... We expect the messages from you to be like _**<OutMessage>**_ ...
> 
>    
> 
> Is that some BizTalk specific?
> 
> </blockquote>

 

I always try to explain what XML namespaces are, and why it's a good idea to use them (especially when it comes to versioning of messages). Sometimes it's just impossible to get people to understand the advantages of using it and to persuade them to change their solutions to handle XML namespaces. It's in these cases it'll be up to the implementation in BizTalk to remove the namespace.

 

### How to remove XML namespace

 

There are a couple of ways of achieving this, we can use [.NET code](http://www.pluralsight.com/blogs/keith/archive/2005/10/19/15714.aspx) that we call in a pipeline or in an orchestration. But we can also handle this using XSL - and that's what I'll show in this post. The XSL stylesheet below will remove all XML namespaces while transforming the message. Basically it just copies the nodes, attributes and it's values using the [local-name()](http://www.webhostingsearch.com/blogs/richard/nevermind-the-xml-namespaces-in-xpath-expressions/) function to ignore the XML namespaces.

 

  
    
    <div><span style="color: #0000ff"><?</span><span style="color: #ff00ff">xml version="1.0" encoding="utf-8"</span><span style="color: #0000ff">?></span><span style="color: #000000">
    
    </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:stylesheet </span><span style="color: #ff0000">version</span><span style="color: #0000ff">="1.0"</span><span style="color: #ff0000">
        xmlns:xsl</span><span style="color: #0000ff">="http://www.w3.org/1999/XSL/Transform"</span><span style="color: #0000ff">></span><span style="color: #000000">
    
        </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:template </span><span style="color: #ff0000">match</span><span style="color: #0000ff">="/"</span><span style="color: #0000ff">></span><span style="color: #000000">
            </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:copy</span><span style="color: #0000ff">></span><span style="color: #000000">
                </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:apply-templates </span><span style="color: #0000ff">/></span><span style="color: #000000">
            </span><span style="color: #0000ff"></</span><span style="color: #800000">xsl:copy</span><span style="color: #0000ff">></span><span style="color: #000000">
        </span><span style="color: #0000ff"></</span><span style="color: #800000">xsl:template</span><span style="color: #0000ff">></span><span style="color: #000000">
    
        </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:template </span><span style="color: #ff0000">match</span><span style="color: #0000ff">="*"</span><span style="color: #0000ff">></span><span style="color: #000000">
            </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:element </span><span style="color: #ff0000">name</span><span style="color: #0000ff">="{local-name()}"</span><span style="color: #0000ff">></span><span style="color: #000000">
                </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:apply-templates </span><span style="color: #ff0000">select</span><span style="color: #0000ff">="@* | node()"</span><span style="color: #ff0000"> </span><span style="color: #0000ff">/></span><span style="color: #000000">
            </span><span style="color: #0000ff"></</span><span style="color: #800000">xsl:element</span><span style="color: #0000ff">></span><span style="color: #000000">
        </span><span style="color: #0000ff"></</span><span style="color: #800000">xsl:template</span><span style="color: #0000ff">></span><span style="color: #000000">
    
        </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:template </span><span style="color: #ff0000">match</span><span style="color: #0000ff">="@*"</span><span style="color: #0000ff">></span><span style="color: #000000">
            </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:attribute </span><span style="color: #ff0000">name</span><span style="color: #0000ff">="{local-name()}"</span><span style="color: #0000ff">></span><span style="color: #000000">
                </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:value-of </span><span style="color: #ff0000">select</span><span style="color: #0000ff">="."</span><span style="color: #ff0000"></span><span style="color: #0000ff">/></span><span style="color: #000000"></span>
            <span style="color: #0000ff"></</span><span style="color: #800000">xsl:attribute</span><span style="color: #0000ff">></span><span style="color: #000000">
        </span><span style="color: #0000ff"></</span><span style="color: #800000">xsl:template</span><span style="color: #0000ff">></span><span style="color: #000000">
    
        </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:template </span><span style="color: #ff0000">match</span><span style="color: #0000ff">="text() | processing-instruction() | comment()"</span><span style="color: #0000ff">></span><span style="color: #000000">
            </span><span style="color: #0000ff"><</span><span style="color: #800000">xsl:copy </span><span style="color: #0000ff">/></span><span style="color: #000000">
        </span><span style="color: #0000ff"></</span><span style="color: #800000">xsl:template</span><span style="color: #0000ff">></span><span style="color: #000000">
    
    </span><span style="color: #0000ff"></</span><span style="color: #800000">xsl:stylesheet</span><span style="color: #0000ff">></span></div>



  








### Apply the XSL transformation





We can use this XSL stylesheet in a ordinary BizTalk map on the send port using the _Custom XSL Path_ property in the BizTalk Mapper. The result is that the XSL we usually generate in the mapping tool will be overridden by our own XSL stylesheet. The figure below shows how we use the property windows of the grid in the BizTalk Mapper to set the property and point the Mapper to our XSLT document.





[![](../assets/2007/12/windowslivewriterremovingnamespacefromoutgoingmessage-a4edxsltpath-thumb11.jpg)](../assets/2007/12/windowslivewriterremovingnamespacefromoutgoingmessage-a4edxsltpath51.jpg)





**But what if we already have a map on the send port and it's that already transformed message we like to remove the namespace from?** One possibility is to use the [_XSLT Transform_ pipeline component](http://msdn2.microsoft.com/en-us/library/aa561389.aspx) that comes with the BizTalk 2006 SDK. It's usually located at _C:\Program Files\Microsoft BizTalk Server 2006\SDK\Samples\Pipelines\XslTransformComponent\XslTransform_ on your development machine. I've written about this sample component before [here](http://www.webhostingsearch.com/blogs/richard/transform-and-split-messages-using-an-xslt-transformation-pipeline-component-and-the-xmldissasembler/) were I used it another scenario.





The figure below shows how we use the property windows of the _XSLT Transform Component_ in a pipeline in the Pipeline designer tool to set the path to our XSLT stylesheet.





[![](../assets/2007/12/windowslivewriterremovingnamespacefromoutgoingmessage-a4edxsltpath2-thumb1.jpg)](../assets/2007/12/windowslivewriterremovingnamespacefromoutgoingmessage-a4edxsltpath221.jpg)





### Final thoughts





The XSLT Transform component is far from perfect and the obvious problem is of course that the component loads the whole message into memory using the [XmlDocument class](http://msdn2.microsoft.com/en-us/library/system.xml.xmldocument.aspx) to read the message. That means that this solution isn't for those scenarios where you'll have huge messages coming in by the thousands. But for those cases where you have normal sized messages and you have a idea of the traffic you receive, it's a quick and easy solution.





Any comments on the pro and cons on this solution and how you usually solve this scenario will be appreciated!





<blockquote>
  
> 
> **UPDATE #1: **Make sure you don't miss [Johan Hedbergs solution](http://blogical.se/blogs/johan/archive/2008/01/07/removing-xml-namespace-in-a-pipeline-component.aspx) to this problem. Basically he solved it using the [Microsoft.BizTalk.Streaming.dll](http://technet.microsoft.com/en-us/library/microsoft.biztalk.streaming.aspx) which will give you better memory management.
> 
> 
</blockquote>





<blockquote>
  
> 
> **UPDATE #2: **Based on the comments to this post I've posted an "updated" post [here](http://www.richardhallgren.com/removing-xml-namespaces-revisit/) solving this using ordinary mapping and defining a schema without a XML namespace - easier and more correct. 
> 
> </blockquote>
