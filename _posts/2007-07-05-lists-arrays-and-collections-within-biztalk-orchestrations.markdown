---
date: 2007-07-05 12:40:30+00:00
layout: post
title: "Lists, Arrays and collections within BizTalk orchestrations"
categories: [BizTalk 2006]
---

<blockquote>  
> 
> **Update 2012-03-28**        
Unfortunately the images for this post was lost in upgrade of the blog.
> 
> </blockquote>

 

This post shows how it's possible to create your own .NET class and then use this within your orchestration (as a variable) to work with typed lists - something that unfortunately isn't supported out of the box in BizTalk orchestrations. Below is the class used to create a typed list for System.String objects.

 
    
    <span class="kwrd">using</span> System;
    <span class="kwrd">using</span> System.Collections.Generic;
    <span class="kwrd">using</span> System.Text;
    
    <span class="kwrd">namespace</span> Sample.BizTalkCollections
    {
        [Serializable]
        <span class="kwrd">public</span> <span class="kwrd">class</span> StringList
        {
            <span class="kwrd">private</span> List<<span class="kwrd">string</span>> _list = <span class="kwrd">new</span> List<<span class="kwrd">string</span>>();
    
            <span class="kwrd">public</span> <span class="kwrd">void</span> Add(<span class="kwrd">string</span> item)
            {
                _list.Add(item);
            }
    
            <span class="kwrd">public</span> <span class="kwrd">int</span> Count()
            {
                <span class="kwrd">return</span> _list.Count;
            }
    
            <span class="kwrd">public</span> <span class="kwrd">bool</span> Remove(<span class="kwrd">string</span> item)
            {
                <span class="kwrd">return</span> _list.Remove(item);
            }
    
            <span class="kwrd">public</span> <span class="kwrd">void</span> RemoveAt(<span class="kwrd">int</span> index)
            {
                _list.RemoveAt(index);
            }
    
            <span class="kwrd">public</span> <span class="kwrd">override</span> <span class="kwrd">string</span> ToString()
            {
                StringBuilder builder = <span class="kwrd">new</span> StringBuilder();
                <span class="kwrd">foreach</span> (<span class="kwrd">string</span> item <span class="kwrd">in</span> _list)
                {
                    builder.AppendLine(item);
                }
    
                <span class="kwrd">return</span> builder.ToString();
            }
        }
    }










Notice that the class is [serializable](http://msdn2.microsoft.com/en-us/library/system.serializableattribute.aspx) so BizTalk can serialize when [dehydrating the orchestration](http://msdn2.microsoft.com/en-us/library/aa995563.aspx) to the database. We've also chosen not to extend the [IList interface](http://msdn2.microsoft.com/en-us/library/system.collections.ilist.aspx) as we don't want to expose all methods of that interface, but only the once we'll really going use within our orchestrations.





This _StringList_ class exists within the _BizTalkCollections_ namespace where we have other classes for lists types with different datatypes (for example _ObjectList_, _Int32List_ and so on). Below is a picture showing the structure of the Visual Studio project containing all the collections we current have implemented. This project and the BizTalk testproject is available for [download here](http://www.richardhallgren.com/blogfiles/Sample.BizTalkCollection.zip).





[![](/assets/2007/07/windowslivewriterlistsarraysandcollectionswithinorchestra-b729biztalkcollections-thumb23.jpg)](/assets/2007/07/windowslivewriterlistsarraysandcollectionswithinorchestra-b729biztalkcollections23.jpg)





In the orchestration we then have set up a variable and type this to our _StringList_ class within the _Sample.BizTalkCollections_ namespace.





[![](/assets/2007/07/windowslivewriterlistsarraysandcollectionswithinorchestra-b729variable-thumb53.jpg)](/assets/2007/07/windowslivewriterlistsarraysandcollectionswithinorchestra-b729variable53.jpg)





Also make sure the assembly with your collection class is installed in the [GAC](http://support.microsoft.com/kb/815808), otherwise you'll end up with a _FileNotFound exception _saying





<blockquote>
  
> 
> Could not load file or assembly 'Sample.BizTalkCollections, Version=1.0.0.0, Culture=neutral, PublicKeyToken=7109528d5dbf986b' or one of its dependencies. The system cannot find the file specified.
> 
> 
</blockquote>





Then you can use the following code within your orchestration! [Download the sample project](http://www.richardhallgren.com/blogfiles/Sample.BizTalkCollection.zip) and test it.





[![](/assets/2007/07/windowslivewriterlistsarraysandcollectionswithinorchestra-b729code2-thumb12.jpg)](/assets/2007/07/windowslivewriterlistsarraysandcollectionswithinorchestra-b729code212.jpg)





## A really generic class





I'd really like for it be possible to create my own generic classes and then initialize these using something like the below.




    
    genericList = Sample.BizTalkCollections.GenericList<System.String>();










However this isn't possible as BizTalk orchestrations don't seem to understand generic classes ... If someone found a solution to this please let me/us know via the comments to this post.
