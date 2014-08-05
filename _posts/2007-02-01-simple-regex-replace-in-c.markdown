---
date: 2007-02-01 07:22:47+00:00
layout: post
title: Simple RegEx replace in C#
categories: [.NET]
---

As I don't use regular expressions that often I always forget the syntax. So I thought I just put a basic replace pattern up here. 

This method takes a schema, finds all places where is says _schemaLocation="whatever"_ in a text and changes this to _schemaLocation="whatever**.xsd**"_ and then returns the schema.
    
    <div><span style="color: #0000FF; ">private</span><span style="color: #000000; "> XmlSchema FixSchemaLocation(XmlSchema schema)
    {
      System.Text.RegularExpressions.Regex locationReplacePattern </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> System.Text.RegularExpressions.Regex(</span><span style="color: #000000; ">"</span><span style="color: #000000; ">schemaLocation=\"(?<location>.*?)\"</span><span style="color: #000000; ">"</span><span style="color: #000000; ">);
      </span><span style="color: #0000FF; ">string</span><span style="color: #000000; "> locationReplaceValue </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #000000; ">"</span><span style="color: #000000; ">schemaLocation=\"${location}.xsd\"</span><span style="color: #000000; ">"</span><span style="color: #000000; ">;
      </span><span style="color: #008000; ">//</span><span style="color: #008000; ">Puts .xsd after the schemaLocation. We need this find the imported schemas</span><span style="color: #008000; ">
    </span><span style="color: #000000; ">  StringWriter sw </span><span style="color: #000000; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> StringWriter();
      schema.Write(sw);
      XmlSchema formatedSchema </span><span style="color: #000000; ">=</span><span style="color: #000000; "> XmlSchema.Read(</span><span style="color: #0000FF; ">new</span><span style="color: #000000; "> StringReader(locationReplacePattern.Replace(sw.ToString(), locationReplaceValue)),</span><span style="color: #0000FF; ">null</span><span style="color: #000000; ">);
      </span><span style="color: #0000FF; ">return</span><span style="color: #000000; "> formatedSchema;
    }</span></div>
