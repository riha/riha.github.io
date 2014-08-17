---
date: 2008-09-05 20:15:55+00:00
layout: post
title: "How the extend a custom Xslt in BizTalk using EXSLT and the Mvp.Xml project"
categories: [BizTalk 2006, EXSLT, XSLT]
---

Lately I've been using custom Xslt [more](http://www.richardhallgren.com/efficient-grouping-and-debatching-of-big-files-using-biztalk-2006/) and more instead of the BizTalk mapping tool. I still use the mapping tool in easy scenarios when I just need to do some straight mapping or maybe even when I need to concatenate some fields, but as soon as I need to to some looping, grouping, calculations etc I've made a _promise_ to myself to use custom Xslt!

I find custom Xslt so much easier in more complex scenarios and once one get past the template matching and understands how and when to use recursion (No you can't reassign a variable in Xslt and you're not supposed to!) I find it to be a **dream** compared to the mapping tool. I also find the code so much easier to maintain compared to the result from the mapping tool. I mean someone would have to pay me good money to even start figuring out what [this](http://www.edsquared.com/content/binary/WindowsLiveWriter/DebugthatBizTalkMap_E215/BadMap_thumb.png) map is doing. And the scary thing is that if you worked with BizTalk for a while you probably know that maps like this isn't that rare! I've even seen worse!

Don't get me wrong, Xslt definitely has some **major** [limitations](http://biglist.com/lists/xsl-list/archives/200102/msg01384.html).

<blockquote>Some of the acute limitations of XSLT 1.0 I can think of off the top of my head are: 
> 
>   * The lack of real string comparison  
>   * No support for dates  
>   * No simple mechanism for grouping  
>   * No querying into RTF's 
> </blockquote>

And it doesn't take long before one runs up against one of these and suddenly you wish you were **back** in mapping tool were we just could add scripting functoid and some code or a external assembly. But then you remember ... (Sorry, I know it's painful just to watch it).

[![BadMap_thumb](../assets/2008/09/windowslivewriterhowtheextendacustomxsltinbizt.xmlproject-138fabadmap-thumb-thumb.png)](../assets/2008/09/windowslivewriterhowtheextendacustomxsltinbizt.xmlproject-138fabadmap-thumb-2.png)

**There has to be a better way of doing this and _combining_ the best out of the two worlds! **

I started looking into to how BizTalk actually solves combining Xslt and the possibility to use external assemblies. After a couple of searches I found Yossi's [nice article](http://www.sabratech.co.uk/blogs/yossidahan/archive/2005_08_01_archive.html) that explained it to me (from 2005! I'm behind on this one!) and it even turns out that there an [example](http://msdn.microsoft.com/en-us/library/ms966408.aspx) in the BizTalk SDK. 

Ok, so now I had what I need. I started a new class library project and began writing some date parsing methods, some padding methods and so on. 

It somehow however felt wrong from the start and I got this grinding feeling that I must be reinventing the wheel (I mean these are well know limitations of Xslt and must have been solved before). Even worse I also felt that I was creating a stupid _single point of failure_ as I started using the component from all different maps in my projects and I have actually seen how much pain a bug in similar shared dll:s could cause. Basically _a small bug in the component could halt all the process using the library_! Finally I realized that this kind of library would be under constant development as we ran into more and more areas of limitations in the our Xslt:s and that would just **increase** the risk of errors and mistakes. 

After some further investigation I found [EXSLT](http://www.exslt.org/) which looked like a solution to my problems! A _stable, tested_ library of Xslt extensions that we could take dependency on as **it's unlikely to have any bugs and that should include the functionality we're missing in standard Xslt!**

### How I used EXSLT in BizTalk

These days it's the [Xml Mvp crowd](http://www.codeplex.com/MVPXML/People/ProjectPeople.aspx) over at the [Mvp.Xml project](http://www.codeplex.com/MVPXML) who develops and maintains the .NET implementation of EXSLT. So I downloaded the latest [binaries](http://www.codeplex.com/MVPXML/Release/ProjectReleases.aspx?ReleaseId=4894) (version 2.3). Put the the _Mvp.Xml.dll_ in the GAC. Wrote a short custom extension Xml snippet that looked like this (using what I've learnt from [Yossi's article](http://www.sabratech.co.uk/blogs/yossidahan/archive/2005_08_01_archive.html)).
    
    <?xml version="1.0" encoding="utf-8"?>
    <ExtensionObjects>
        <ExtensionObject
         Namespace="http://exslt.org/dates-and-times"
         AssemblyName="Mvp.Xml, 
         Version=2.3.0.0, Culture=neutral, 
         PublicKeyToken=6ead800d778c9b9f"
         ClassName="Mvp.Xml.Exslt.ExsltDatesAndTimes"/>
    </ExtensionObjects>




All you define is the _Xml namespace _you like to use in your Xslt to reference the dll, the _full assembly name_ and finally the _name of the class_ in _Mvp.Xml.Exslt_ you want to use (make sure you also download the source to Xml.Mvp, it helps when looking up in what classes and namespaces different methods are placed). 




That means you need one _ExtensionObjects_ block for each class you want you use which really isn't a problem as the methods are nicely structured based on there functionality.




Then we can use this in a Xslt like this:
    
    <?xml version="1.0" encoding="utf-8"?>
    <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                    xmlns:S1="http://ExtendedMapping.Schema1"
                    xmlns:S2="http://ExtendedMapping.Schema2"
                    xmlns:exslt="http://exslt.org/dates-and-times"
                    version="1.0"> 
    
        <xsl:template match="/">
            <S2:Root>
                <Field>
                    <xsl:value-of select="exslt:dateTime()"/>
                </Field>
            </S2:Root>
        </xsl:template>
    </xsl:stylesheet>
    




Which gives us the below output. **Notice the current time and date! Cool!**
    
    <S2:Root xmlns:S1="http://ExtendedMapping.Schema1" xmlns:S2="http://ExtendedMapping.Schema2" xmlns:exslt="http://exslt.org/dates-and-times">
      <Field>2008-09-05T20:45:13+02:00</Field> 
    </S2:Root>




All you then have to do in you map is to reference the Xslt and the extension Xml.




[![Custom Extension In Map](../assets/2008/09/windowslivewriterhowtheextendacustomxsltinbizt.xmlproject-138facustom-extension-in-map-thumb.png)](../assets/2008/09/windowslivewriterhowtheextendacustomxsltinbizt.xmlproject-138facustom-extension-in-map-2.png)




Just as final teaser I'll paste a few methods from the [EXSLT documentation](http://www.exslt.org/)




Some _string_ methods:






  * str:align() 

  * str:concat() 

  * str:decode-uri() 

  * str:encode-uri() 

  * str:padding() 

  * str:replace() 

  * str:split() 

  * str:tokenize() 



Some _date and time_ methods:






  * date:add() 

  * date:add-duration() 

  * date:date() 

  * date:date-time() 

  * date:day-abbreviation() 

  * date:day-in-month() 

  * date:day-in-week() 

  * date:day-in-year() 

  * date:day-name() 

  * date:day-of-week-in-month() 

  * date:difference() 

  * date:duration() 

  * date:format-date() 

  * date:hour-in-day() 

  * date:leap-year() 

  * date:minute-in-hour() 

  * date:month-abbreviation() 

  * date:month-in-year() 

  * date:month-name() 

  * date:parse-date() 

  * date:second-in-minute() 

  * date:seconds() 

  * date:sum() 

  * date:time() 

  * date:week-in-month() 

  * date:week-in-year() 

  * date:year() 



As if this was enough (!) the Mvp Xml project added a couple of there own methods! What about **_string lowercase_** and **_string uppercase - _all in Xslt!** And about 30 new date-time related methods extra to the standard ones already in EXSLT!




Check out the full documentation [here](http://www.xmllab.net/mvpxml/default.aspx)!




Let me know how it works out for you.
