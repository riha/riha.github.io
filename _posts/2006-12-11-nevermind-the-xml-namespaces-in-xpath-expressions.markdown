---
date: 2006-12-11 15:45:59+00:00
layout: post
title: "Nevermind the XML namespaces in Xpath expressions"
categories: [BizTalk 2006]
---

Understanding [Xpath](http://www.w3.org/TR/xpath) expressions is definitely a success factor when working with BizTalk development. Xpath is extremely powerful (when one gets it right) but it's one of the must frustration techniques I've ever worked with! Xpath is one of those languages that either gives you to answer you want to a query - or (more often) just doesn't give you anything in return! In 99 percent of the cases this means that you missed something in your match. In 99 percent of these cases this means that you got some problems with namespaces in the XML document your querying (This is certainly true when working with BizTalk that "namespace-heavy"). One technique to get around this is to use the same approach as BizTalk itself uses - the [Xpath local-name() function](http://www.w3.org/TR/xpath#function-local-name)!

Consider the following XML document.
    
    <div><span style="color: #0000FF; "><</span><span style="color: #800000; ">Message </span><span style="color: #FF0000; ">xmlns:ns0</span><span style="color: #0000FF; ">="Standard.Envelope/1.1"</span><span style="color: #FF0000; "> xmlns:xsi</span><span style="color: #0000FF; ">="http://www.w3.org/2001/XMLSchema-instance"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">ns0:Envelope</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Header</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">MessageTypeInfo</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                    </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">MessageType</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">.</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">MessageType</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">MessageTypeInfo</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Action</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">INSERTED</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Action</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Addressees</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                    </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">SenderCode</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">Mill</span><span style="color: #0000FF; "></</span><span style="color: #800000; ">SenderCode</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Addressees</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Header</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">ns0:Envelope</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">Message</span><span style="color: #0000FF; ">></span></div>




The Xpath expression below will hit the _Envelope _node. But is's very fragile! As soon as the namespace prefix changes (It might change to _ns1_ and namespace _ns0_ will be used for something else.) you'll end up with an empty result.



    
    <div><span style="color: #000000; ">/Message/ns0:Envelope</span></div>




However, if one uses the below expressions instead - that makes use of the local-name function - it ignores the namespace and only cares about the name of the node (_Envelope_ that is ;)). And this is of course far less sensitive to change.






    
    <div><span style="color: #000000; ">/Message/*[local-name()='Envelope']</span></div>
