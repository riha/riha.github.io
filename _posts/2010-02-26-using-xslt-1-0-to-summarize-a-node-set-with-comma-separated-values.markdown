---
date: 2010-02-26 09:31:50+00:00
layout: post
title: "Using XSLT 1.0 to summarize a node-set with comma separated values"
categories: [XSLT]
---

Pure XSLT is very powerful but it definitely has its weaknesses (I’ve written about how to extend XSLT using mapping and BizTalk previously [here](http://www.richardhallgren.com/how-the-extend-a-custom-xslt-in-biztalk-using-exslt-and-the-mvpxml-project/)) … One of those are handling numbers that uses a different decimal-separator than a point (“.”).

Take for example the XML below

    
    <Prices>
      <Price>10,1</Price>
      <Price>10,2</Price>
      <Price>10,3</Price>
    </Prices>


Just using the [XSLT sum-function](http://www.zvon.org/xxl/XSLTreference/Output/function_sum.html) on these values will give us a “NaN” values. To solve it we’ll have to use recursion and something like in the sample below.

The sample will select the node-set to summarize and send it to the “SummarizePrice” template. It will then add the value for the first Price tag of the by transforming the comma to a point. It will then check if it’s the last value and if not use recursion to call into itself again with the next value. It will  keep adding to the total amount until it reaches the last value of the node set.

    
    <xsl:template match="Prices">
      <xsl:call-template name="SummurizePrice">
        <xsl:with-param name="nodes" select="Price" />
      </xsl:call-template>
    </xsl:template>
    
    <xsl:template name="SummurizePrice">
      <xsl:param name="index" select="1" />
      <xsl:param name="nodes" />
      <xsl:param name="totalPrice" select="0" />
    
      <xsl:variable name="currentPrice" select="translate($nodes[$index], ',', '.')"/>
    
      <xsl:choose>
        <xsl:when test="$index=count($nodes)">
          <xsl:value-of select="$totalPrice + $currentPrice"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="SummurizePrice">
            <xsl:with-param name="index" select="$index + 1" />
            <xsl:with-param name="totalPrice" select="$totalPrice + $currentPrice" />
            <xsl:with-param name="nodes" select="$nodes" />
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    
    </xsl:template>


Simple but a bit messy and nice to have for future cut and paste ;)
