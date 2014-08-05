---
date: 2007-04-18 14:11:52+00:00
layout: post
title: "Get row identity from SQL Adapter response"
categories: [BizTalk 2006]
---

Recently I had to insert a record using a stored procedure and the SQL Adapter in BizTalk 2006. There are lots of examples on both how to insert records and how to select a number of record using this adapter. However I had problems finding how to **insert a record and receiving the new id of the inserted row in return **(the _[SCOPE_IDENTITY()](http://msdn2.microsoft.com/en-us/library/ms190315.aspx)_). In my scenario I needed the id to insert into another database further down in the orchestration.

I ended up with a stored procedure looking like the below.
    
    <div><span style="color: #0000FF; ">ALTER</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">PROCEDURE</span><span style="color: #000000; "> </span><span style="color: #FF0000; ">[</span><span style="color: #FF0000; ">dbo</span><span style="color: #FF0000; ">]</span><span style="color: #000000; ">.</span><span style="color: #FF0000; ">[</span><span style="color: #FF0000; ">TestInsertParty</span><span style="color: #FF0000; ">]</span><span style="color: #000000; ">
        </span><span style="color: #008000; ">@partyName</span><span style="color: #000000; "> </span><span style="color: #000000; font-weight: bold; ">nchar</span><span style="color: #000000; ">(</span><span style="color: #800000; font-weight: bold; ">30</span><span style="color: #000000; ">) </span><span style="color: #808080; ">=</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">NULL</span><span style="color: #000000; ">
    </span><span style="color: #0000FF; ">AS</span><span style="color: #000000; ">
    </span><span style="color: #0000FF; ">BEGIN</span><span style="color: #000000; ">
        </span><span style="color: #0000FF; ">SET</span><span style="color: #000000; "> NOCOUNT </span><span style="color: #0000FF; ">ON</span><span style="color: #000000; ">;
        </span><span style="color: #0000FF; ">Insert</span><span style="color: #000000; "> </span><span style="color: #0000FF; ">Into</span><span style="color: #000000; "> Party (</span><span style="color: #FF0000; ">[</span><span style="color: #FF0000; ">name</span><span style="color: #FF0000; ">]</span><span style="color: #000000; ">, chain_idx) </span><span style="color: #0000FF; ">Values</span><span style="color: #000000; ">(</span><span style="color: #008000; ">@partyName</span><span style="color: #000000; ">, </span><span style="color: #0000FF; ">NULL</span><span style="color: #000000; ">)
        </span><span style="color: #0000FF; ">Select</span><span style="color: #000000; "> </span><span style="color: #FF00FF; ">Scope_Identity</span><span style="color: #000000; ">() </span><span style="color: #0000FF; ">As</span><span style="color: #000000; "> Id </span><span style="color: #0000FF; ">For</span><span style="color: #000000; "> Xml </span><span style="color: #000000; font-weight: bold; ">Raw</span><span style="color: #000000; "> (</span><span style="color: #FF0000; ">'</span><span style="color: #FF0000; ">Response</span><span style="color: #FF0000; ">'</span><span style="color: #000000; ">)
    </span><span style="color: #0000FF; ">END</span></div>

The trick was to use the [_XML RAW Mode_](http://msdn2.microsoft.com/en-us/library/ms175140.aspx). This mode transforms the result set into a generic identifier as _<row>_. It is however possible to provide a element name, as <_Response>_. Basically this will insert the new value and return something like this from the stored procedure.




    
    <div><span style="color: #0000FF; "><</span><span style="color: #800000; ">Response </span><span style="color: #FF0000; ">Id</span><span style="color: #0000FF; ">="1054"</span><span style="color: #FF0000; "> </span><span style="color: #0000FF; ">/></span></div>

  
After return via the send port the orchestration will receive something like the below.  
  


    
    <div><span style="color: #0000FF; "><</span><span style="color: #800000; ">TestInsertResponse </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">="TestInsert"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">Response </span><span style="color: #FF0000; ">Id</span><span style="color: #0000FF; ">="1054"</span><span style="color: #FF0000; "> </span><span style="color: #0000FF; ">/></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">TestInsertResponse</span><span style="color: #0000FF; ">></span></div>

  
The schema that I use to both handling the response and request against the SQL Adapter is shown below. First I set the type of the Id-attribute to _xs:int_ but this gave me some problems when using the promoted value in the orchestration, everything worked fine when switching back to _xs:string_.  
  
[![](http://richardhallgren.com/blog/wp-content/uploads/2007/04/WindowsLiveWriter/GetrowidentityfromSQLAdapterresponse_D964/sqlinsertschema_thumb%5B12%5D2.jpg)](http://richardhallgren.com/blog/wp-content/uploads/2007/04/WindowsLiveWriter/GetrowidentityfromSQLAdapterresponse_D964/sqlinsertschema%5B12%5D2.jpg)   
The same technique would be used for receiving a code from the stored procedure (say 1 for success and 0 for failure or whatever) and then to make a logical decision in the orchestration.
