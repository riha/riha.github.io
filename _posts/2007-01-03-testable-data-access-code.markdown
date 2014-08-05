---
date: 2007-01-03 15:26:55+00:00
layout: post
title: "Testable data access code"
categories: [.NET]
---

As one of the most important rules for a test **is that it can't rely on state**, I've always found automated data access testing hard. As I view it there are three approaches to accomplish reliable testing of such a layer:

  1. A local database that is restored for each and every test.
  2. Using transactions that can rollback the database after the test completed
  3. Using mock objects

I guess all of them has drawbacks and are suitable in different situations.

It would be possible to have ones data access layer connected to a local database that's fully restored to a know state for every test. But as the database grows that process would soon get extremely slow. And as one of the requirements for testing and test driven development is that is possible to test often (and if we like to test often is has to be fast) I think this is a method that only works when we have a simple tiny database (something we almost never have ...). 

Another way of do it would be use transactions to rollback each test operation on the database. A problem here is that we might use transactions within the access layer we like to test! We might even have transactions disabled. This [excellent article](http://msdn.microsoft.com/msdnmag/issues/05/06/UnitTesting/default.aspx) by Roy Osherove discusses the possibilities of using the transactions from  Enterprise Services (COM+) for rolling back database operations. This is an interesting approach and with the new [System.Transactions namespace in .NET 2.0](http://msdn2.microsoft.com/en-us/library/system.transactions.aspx) things should be even easier. But still, if one is using transactions in the actually access layer that is being tested we still have to use something else. Another problem is that transactions always will cause a minor performance hit that might grow when using it in a large project with loads of tests.

And then we have mock objects. The first thing we have to think about here is what we should test in a unit test? Should we really test the all the way to the database or should we stay within the boundaries of the application? My option is that a unit test should not test all the way through to the database, then it's a integration test. **However** it might be very useful to have such a test in our test suite. If we decide to actually test trough to the database mock object will not do us any good. They will only be able to test that the right method in the data access class were called in correct order. 

Some links I found useful:  
[http://weblogs.asp.net/rosherove/archive/2004/12/10/279258.aspx](http://weblogs.asp.net/rosherove/archive/2004/12/10/279258.aspx)  
[http://weblogs.asp.net/rosherove/articles/dbunittesting.aspx](http://weblogs.asp.net/rosherove/articles/dbunittesting.aspx)  
[http://weblogs.asp.net/rosherove/archive/2004/07/20/187863.aspx](http://weblogs.asp.net/rosherove/archive/2004/07/20/187863.aspx)  
[http://msdn.microsoft.com/msdnmag/issues/04/10/NMock/default.aspx](http://msdn.microsoft.com/msdnmag/issues/04/10/NMock/default.aspx)  
[http://msdn.microsoft.com/library...testwithnunit.asp](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnaspp/html/aspnet-testwithnunit.asp)  
[http://msdn.microsoft.com/msdnmag...default.aspx](http://msdn.microsoft.com/msdnmag/issues/05/06/UnitTesting/default.aspx)
