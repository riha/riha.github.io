---
date: 2008-02-18 22:36:06+00:00
layout: post
title: "Random thoughts on SQL Server Adapter and T-SQL Stored Procedures for BizTalk
  2006"
categories: [BizTalk 2006]
---

Writing Stored Procedures is an art of its own. As all of you know it's very different from writing ordinary code and presents its own kind of problems and issues when it comes to performance, builds, version control, testing etc. This post will try and highlight a few points that I find important when it comes to Stored Procedures, and the especially in a BizTalk and integration related scenario.

 

Consider the simplified procedure below, I'll use is an example for much of the discussion in the rest of the post. Basically the procedure inserts or updates (based on if the optional EmployeeID exists from before or not) employee information to the Employee table of a database named "TestDB".

 

  
    
    <span class="kwrd"></span>



  


    
    
    <div><span style="color: #0000ff">Use</span><span style="color: #000000"> </span><span style="color: #ff0000">[</span><span style="color: #ff0000">TestDB</span><span style="color: #ff0000">]</span><span style="color: #000000">
    </span><span style="color: #0000ff">Go</span><span style="color: #000000"> 
    </span><span style="color: #0000ff">If</span><span style="color: #000000"> </span><span style="color: #808080">Exists</span><span style="color: #000000">(</span><span style="color: #0000ff">select</span><span style="color: #000000"> </span><span style="color: #808080">*</span><span style="color: #000000"> </span><span style="color: #0000ff">From</span><span style="color: #000000"> dbo.sysobjects </span><span style="color: #0000ff">Where</span><span style="color: #000000"> id </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #ff00ff">object_id</span><span style="color: #000000">(N</span><span style="color: #ff0000">'</span><span style="color: #ff0000">AddEmployee</span><span style="color: #ff0000">'</span><span style="color: #000000">) </span><span style="color: #808080">And</span><span style="color: #000000"> </span><span style="color: #ff00ff">OBJECTPROPERTY</span><span style="color: #000000">(id, N</span><span style="color: #ff0000">'</span><span style="color: #ff0000">IsProcedure</span><span style="color: #ff0000">'</span><span style="color: #000000">) </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #800000; font-weight: bold">1</span><span style="color: #000000">) </span><span style="color: #0000ff">Drop</span><span style="color: #000000"> </span><span style="color: #0000ff">Procedure</span><span style="color: #000000"> AddEmployeeGo 
    </span><span style="color: #0000ff">Create</span><span style="color: #000000"> </span><span style="color: #0000ff">Procedure</span><span style="color: #000000"> AddEmployee    
        </span><span style="color: #008000">@EmployeeId</span><span style="color: #000000"> </span><span style="color: #000000; font-weight: bold">Int</span><span style="color: #000000"> </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #808080">-</span><span style="color: #800000; font-weight: bold">1</span><span style="color: #000000">,    
        </span><span style="color: #008000">@LastName</span><span style="color: #000000"> </span><span style="color: #000000; font-weight: bold">Varchar</span><span style="color: #000000">(</span><span style="color: #800000; font-weight: bold">30</span><span style="color: #000000">),    
        </span><span style="color: #008000">@FirstName</span><span style="color: #000000"> </span><span style="color: #000000; font-weight: bold">Varchar</span><span style="color: #000000">(</span><span style="color: #800000; font-weight: bold">30</span><span style="color: #000000">),    
        </span><span style="color: #008000">@MiddleName</span><span style="color: #000000"> </span><span style="color: #000000; font-weight: bold">Varchar</span><span style="color: #000000">(</span><span style="color: #800000; font-weight: bold">30</span><span style="color: #000000">)
    </span><span style="color: #0000ff">As</span><span style="color: #000000"> 
    </span><span style="color: #0000ff">Begin</span><span style="color: #000000">    
        </span><span style="color: #0000ff">Declare</span><span style="color: #000000"> </span><span style="color: #008000">@currentEmployeeId</span><span style="color: #000000"> </span><span style="color: #000000; font-weight: bold">int</span><span style="color: #000000">    
        </span><span style="color: #0000ff">Declare</span><span style="color: #000000"> </span><span style="color: #008000">@currentAction</span><span style="color: #000000"> </span><span style="color: #000000; font-weight: bold">tinyint</span><span style="color: #000000">    
        </span><span style="color: #008080">--</span><span style="color: #008080"> Check based on the EmployeeId if the employee exists from before    </span><span style="color: #008080">
    </span><span style="color: #000000">    </span><span style="color: #0000ff">If</span><span style="color: #000000"> </span><span style="color: #808080">Not</span><span style="color: #000000"> </span><span style="color: #808080">Exists</span><span style="color: #000000">(</span><span style="color: #0000ff">Select</span><span style="color: #000000"> EmployeeId </span><span style="color: #0000ff">From</span><span style="color: #000000"> Employee </span><span style="color: #0000ff">Where</span><span style="color: #000000"> EmployeeId </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #008000">@EmployeeId</span><span style="color: #000000">)    
            </span><span style="color: #0000ff">Begin</span><span style="color: #000000">        
                </span><span style="color: #008080">--</span><span style="color: #008080"> Inserts new employee        </span><span style="color: #008080">
    </span><span style="color: #000000">            </span><span style="color: #0000ff">Insert</span><span style="color: #000000"> </span><span style="color: #0000ff">Into</span><span style="color: #000000"> Employee (LastName,FirstName,MiddleName)         
                </span><span style="color: #0000ff">Values</span><span style="color: #000000"> (</span><span style="color: #008000">@LastName</span><span style="color: #000000">, </span><span style="color: #008000">@FirstName</span><span style="color: #000000">, </span><span style="color: #008000">@MiddleName</span><span style="color: #000000">)        
                </span><span style="color: #0000ff">Set</span><span style="color: #000000"> </span><span style="color: #008000">@currentEmployeeId</span><span style="color: #000000"> </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #ff00ff">Scope_Identity</span><span style="color: #000000">()        
                </span><span style="color: #0000ff">Set</span><span style="color: #000000"> </span><span style="color: #008000">@currentAction</span><span style="color: #000000"> </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #800000; font-weight: bold">1</span><span style="color: #000000">    
            </span><span style="color: #0000ff">End</span><span style="color: #000000">    
        </span><span style="color: #0000ff">Else</span><span style="color: #000000">    
            </span><span style="color: #0000ff">Begin</span><span style="color: #000000">        
                </span><span style="color: #008080">--</span><span style="color: #008080"> Updates employee        </span><span style="color: #008080">
    </span><span style="color: #000000">            </span><span style="color: #0000ff">Update</span><span style="color: #000000"> Employee </span><span style="color: #0000ff">Set</span><span style="color: #000000"> LastName </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #008000">@LastName</span><span style="color: #000000">,        
                FirstName </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #008000">@FirstName</span><span style="color: #000000"> </span><span style="color: #0000ff">WHERE</span><span style="color: #000000"> EmployeeId </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #008000">@EmployeeId</span><span style="color: #000000">        
                </span><span style="color: #0000ff">Set</span><span style="color: #000000"> </span><span style="color: #008000">@currentEmployeeId</span><span style="color: #000000"> </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #008000">@EmployeeId</span><span style="color: #000000">        
                </span><span style="color: #0000ff">Set</span><span style="color: #000000"> </span><span style="color: #008000">@currentAction</span><span style="color: #000000"> </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #800000; font-weight: bold">2</span><span style="color: #000000">    
            </span><span style="color: #0000ff">End</span><span style="color: #000000">      
    
        </span><span style="color: #0000ff">Select</span><span style="color: #000000"> </span><span style="color: #008000">@currentEmployeeId</span><span style="color: #000000"> </span><span style="color: #0000ff">As</span><span style="color: #000000"> </span><span style="color: #ff0000">[</span><span style="color: #ff0000">@EmployeeId</span><span style="color: #ff0000">]</span><span style="color: #000000">, </span><span style="color: #008000">@currentAction</span><span style="color: #000000">     
        </span><span style="color: #0000ff">As</span><span style="color: #000000"> </span><span style="color: #ff0000">[</span><span style="color: #ff0000">@ProcedureAction</span><span style="color: #ff0000">]</span><span style="color: #000000"> </span><span style="color: #0000ff">For</span><span style="color: #000000"> Xml Path (</span><span style="color: #ff0000">'</span><span style="color: #ff0000">Response</span><span style="color: #ff0000">'</span><span style="color: #000000">)
    </span><span style="color: #0000ff">End</span><span style="color: #000000">
    </span><span style="color: #0000ff">Go</span></div>



    


  








### Builds and version control





I always try to have the complete database version controlled. One solution to this that some people advocate is to have a central development database. I have however always found it to be a lot of hassle with overwriting each others changes and so on and always try to make it possible for each developer to build a local version of the database for development. It should also be possible to always check out the latest version and run it to build all the database objects - no matter what you have from before. This is of course a bit tricky when it comes to the actual tables as you might have data and so on (in my opinion it shouldn't be the case during development but that's another post discussing test data for the database etc).





When it however comes to Stored Procedure as in this post it's easy - **drop the old one if it exists and create the new one as in the example**.






  
    
    <div><span style="color: #0000ff">If</span><span style="color: #000000"> </span><span style="color: #808080">Exists</span><span style="color: #000000">(</span><span style="color: #0000ff">select</span><span style="color: #000000"> </span><span style="color: #808080">*</span><span style="color: #000000"> </span><span style="color: #0000ff">From</span><span style="color: #000000"> dbo.sysobjectsWhere id </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #ff00ff">object_id</span><span style="color: #000000">(N</span><span style="color: #ff0000">'</span><span style="color: #ff0000">AddEmployee</span><span style="color: #ff0000">'</span><span style="color: #000000">) </span><span style="color: #808080">And</span><span style="color: #000000"> </span><span style="color: #ff00ff">OBJECTPROPERTY</span><span style="color: #000000">(id, N</span><span style="color: #ff0000">'</span><span style="color: #ff0000">IsProcedure</span><span style="color: #ff0000">'</span><span style="color: #000000">) </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #800000; font-weight: bold">1</span><span style="color: #000000">) </span><span style="color: #0000ff">Drop</span><span style="color: #000000"> </span><span style="color: #0000ff">Procedure</span><span style="color: #000000"> AddEmployee
    </span><span style="color: #0000ff">Go</span><span style="color: #000000">
    </span><span style="color: #0000ff">Create</span><span style="color: #000000"> </span><span style="color: #0000ff">Procedure</span><span style="color: #000000"> AddEmployee </span><span style="color: #008000">@EmployeeId</span><span style="color: #000000"> </span><span style="color: #000000; font-weight: bold">Int</span><span style="color: #000000"> </span><span style="color: #808080">=</span><span style="color: #000000"> </span><span style="color: #808080">-</span><span style="color: #800000; font-weight: bold">1</span><span style="color: #000000">, ...</span></div>



  









If found [this article](http://www.codinghorror.com/blog/archives/001050.html) by Jeff Atwood over at [Coding Horror](http://www.codinghorror.com/blog/) (and [the articles](http://odetocode.com/Blogs/scott/archive/2008/01/30/11702.aspx) by K. Scott Allen it links to) very good on how to think about version control database objects.





### Idempotent procedures





In complex integration solution it's a common problem with multiple messages - sending systems might send the same message twice for a number of reasons and one will end up with a shaky system if that causes an error in the integration. I've also seen solutions to this problem where a check is done against the database (say from a BizTalk orchestration) and based on that result a decision is made to call an update or an insert procedure. In my opinion that just unnecessary complexity and database communication. I believe **one should try and handle whether to update or insert inside the procedure as long as that's possible and effective**.





I in the AddEmployee Stored Procedure example might receive a EmployeeID as an input parameter and based on a check inside the procedure if the employee exists from before with that id a post is either updated or inserted.





### Response message





I generally always want two things in return from a Store Procedure like the one in the AddEmployee example (In a select based procedure that would of course be very different as we like all the data in return).






  
  1. The id that been added or changed 


  
  2. What action that's been performed (insert or update) 





What action that was performed is a good idea to return as it's quite usual to use this in for example BAM tracking or other logging and so on (we might want know how many employees that was added versus updated for example).





Using the [Xml Path syntax](http://msdn2.microsoft.com/en-us/library/ms189885.aspx) for generating the Xml response (thanks again Nick for a [great post](http://www.modhul.com/2008/01/23/an-easier-way-to-do-complex-for-xml-explicit/)) from the procedure has made it even simpler to actually skip using the [Add Generated Item](Add Generated Item ) option in BizTalk. All you have think about is to **set name of the child node the request root node to the same name as the procedure** (in this case AddEmployee). Also remember that the type should be **set up as a Multi-Part Message Type in the orchestrations** you use it from and that the **Receive Pipeline you choose in the Send Port must use a Xml Disassembler component **(XmlReceive pipeline will do fine unless you have your custom pipeline for some reason).





[![SchemaDBTest](../assets/2008/02/windowslivewritertsqlstoreproceduresforbiztalk-c235schemadbtest-thumb.jpg)](../assets/2008/02/windowslivewritertsqlstoreproceduresforbiztalk-c235schemadbtest-2.jpg)





### Error handling





Some people might find it strange that I don't have any error handling in my Stored Procedures but in most cases an error in the procedure will cause an exception in the port communication with the database and that's fine. If I'd like to handle that error I'll handle that either in the orchestration or using other mechanisms in BizTalk like [Failed Message Routing](http://msdn2.microsoft.com/en-us/library/aa578516.aspx) etc. **If I can't handle the error in the procedure I don't see a reason to catch it.**





### Security





I've seen to many cases where developers actually used the user and password login option available on the database adapter and port. Even if the credentials are safe in the SSO database there is a risk you'll end up in a mess with login data spread all over the BizTalk administration. **One should always use try to use Windows NT Integrated Security!**





Even more common than the above is to have a user that part of the administrators group or similar to hit the database - **don't!** I usually try an set up one Host to run as in all the communication with a specific database (Could also be a Host for that database and that BizTalk Application so that different applications have their own Host). I'll then give that specific user the **least privileges **needed in the specific database.





In the AddEmployee and TestDB example I'd create **a new Group in the AD called for example "BizTalk TestDB Users"**. I'd then create **a User in the AD called "BizTalk TestDB User"**. It's based on this I'd then create a Host in BizTalk referencing the above created Group.





[![TestDBHost](../assets/2008/02/windowslivewritertsqlstoreproceduresforbiztalk-c235testdbhost-thumb.jpg)](../assets/2008/02/windowslivewritertsqlstoreproceduresforbiztalk-c235testdbhost-2.jpg)





Finally we'll create a Host Instance and make a Send Handler of it on the SQL Server Adapter.





[![DBTestHostInstance](../assets/2008/02/windowslivewritertsqlstoreproceduresforbiztalk-c235dbtesthostinstance-thumb-1.jpg)](../assets/2008/02/windowslivewritertsqlstoreproceduresforbiztalk-c235dbtesthostinstance-4.jpg)





[![DBTestSqlAdapter](../assets/2008/02/windowslivewritertsqlstoreproceduresforbiztalk-c235dbtestsqladapter-thumb.jpg)](../assets/2008/02/windowslivewritertsqlstoreproceduresforbiztalk-c235dbtestsqladapter-2.jpg)





Now we can **set the least required privileges on the "BizTalk TestDB Users" in Sql Server as that the Group the User belongs that'll hit the database**. In this case this means granting the Group to the [standard BizTalk required privileges for a Host](http://msdn2.microsoft.com/en-us/library/aa547356.aspx) besides granting it Execute right on the AddEmployee Stored Procedure.





Something I missed? How do you handle your database communication and security in your BizTalk implementations?
