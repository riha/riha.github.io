---
date: 2010-04-12 07:38:47+00:00
layout: post
title: "Use code blocks to extend your BizTalk custom XSLT maps"
categories: [BizTalk 2006, BizTalk 2009, XSLT]
---

<blockquote>**Update 2010-04-13
**Grant Samuels commented and made me aware of the fact that inline scripts might in some cases cause memory leaks. He has some further information [here](http://linderalex.blogspot.com/2008/06/memory-leak-using-biztalk-mapper.html) and you’ll find a kb-article [here](http://support.microsoft.com/kb/918643).** **</blockquote>


I’ve posted a few times before on how powerful I think it is in complex mapping to be able to replace the BizTalk Mapper with a custom XSLT script ([here’s how to](http://msdn.microsoft.com/en-us/library/aa560154(BTS.20).aspx)). The BizTalk Mapper is nice and productive in simpler scenarios but in my experience it break down in more complex ones and maintaining a good overview is _hard_. I’m however looking forward to the new version of the [tool in BizTalk 2010](http://www.microsoft.com/biztalk/en/us/roadmap.aspx#2009r2) – but until then I’m using custom XSLT when things gets complicated.

Custom XSLT however lacks a few things once has gotten used to have - such as scripting blocks, clever functoids etc. In some previously post ([here](http://www.richardhallgren.com/how-the-extend-a-custom-xslt-in-biztalk-using-exslt-and-the-mvpxml-project/) and [here](http://www.richardhallgren.com/using-xslt-1-0-to-summarize-a-node-set-with-comma-separated-values/)) I’ve talked about using EXSLT as a way to extend the capabilities of custom XSLT when used in BizTalk.


### Bye, bye external libraries – heeeello inline scripts ;)


Another way to achieve much of the same functionality even easier is to use embedded scripting that’s supported by the XslTransform class. Using a script block in XSLT is easy and is also the way the BizTalk Mapper makes it possible to include C# snippets right into your maps.

Have a look at the following XSLT sample:

    
    <?xml version="1.0" encoding="utf-8"?>
    <xsl:stylesheet
        version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:msxsl="urn:schemas-microsoft-com:xslt"
        xmlns:code="http://richardhallgren.com/Sample/XsltCode"
        exclude-result-prefixes="msxsl code"
        >
        <xsl:output method="xml" indent="yes"/>
    
        <xsl:template match="@* | node()">
            <Test>
                <UniqueNumber>
                    <xsl:value-of select="code:GetUniqueId()" />
                </UniqueNumber>
                <SpecialDateFormat>
                    <xsl:value-of select="code:GetInternationalDateFormat('11/16/2003')" />
                </SpecialDateFormat>
                <IncludesBizTalk>
                    <xsl:value-of select="code:IncludesSpecialWord('This is a text with BizTalk in it', 'BizTalk')" />
                </IncludesBizTalk>
            </Test>
        </xsl:template>
    
        <msxsl:script language="CSharp" implements-prefix="code">
            //Gets a unique id based on a guid
            public string GetUniqueId()
            {
                return Guid.NewGuid().ToString();
            }
    
            //Formats US based dates to standard international
            public string GetInternationalDateFormat(String date)
            {
                return DateTime.Parse(date, new System.Globalization.CultureInfo("en-US")).ToString("yyyy-MM-dd");
            }
    
            //Use regular expression to look for a pattern in a string
            public bool IncludesSpecialWord(String s, String pattern)
            {
                Regex rx = new Regex(pattern);
                return rx.Match(s).Success;
            }
        </msxsl:script>
    </xsl:stylesheet>


All one has to do is to define a code block, reference the xml-namespace used and start coding! Say goodbye to all those external library dlls!

It’s possible to use a few core namespaces without the full .NET namespace path but all namespaces are available as long as they are fully qualified. MSDN has a great page with all the details [here](http://msdn.microsoft.com/en-us/library/533texsx(VS.71).aspx).
