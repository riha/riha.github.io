---
date: 2014-01-14 10:42:25+00:00
layout: post
title: Export BizTalk Server MSI packages directly from Visual Studio using BtsMsiTask
categories: [BizTalk 2006]
---

_Getting a full Continuous Integration (CI) process working with BizTalk Server is hard! _

 

_One of the big advantages in a working CI process is to always have tested and verified artifacts from the build server to deploy into test and production. Packaging these build resources into a deployable unit is however notorious hard in BizTalk Server as a Visual Studio build will not provide a deployable artifact (only raw dlls). The only way to get a deployable MSI package for BizTalk Server is to first install everything into the server and then export – until now._

 

## Why [Continuous Integration](http://martinfowler.com/articles/continuousIntegration.html)?

 

[Continuous Integration](http://martinfowler.com/articles/continuousIntegration.html) is a concept first described by Martin Fowler back in 2006. At its core its about team communication and fast feedback but also often leads to better quality software and more efficient processes. 

 

![CI](/assets/2014/01/CI1.png)

 

A CI process usually works something like the above picture.

 

  
  1. A developer checks in code to the source control server. 
   
  2. The build server detects that a check in has occurred, gets all the new code and initiates a new build while also running all the relevant unit tests.
   
  3. The result from the build and the tests are sent back to the team of developers and provides them with a up to date view of the “health” in the project.
   
  4. If the build and all the test are successful the built and tested resources are written to a deploy area.
 

As one can see the CI build server acts as another developer on the team but always builds everything on a fresh machine and bases everything on what is actually checked in to source control – guaranteeing that nothing is build using artifacts that for some reasons is not in source control or that some special setting etc is required to achieve a successful build. 

 

In step 4 above the CI server also writes everything to a deploy area. A golden rule for a CI workflow is to use artifacts and packages from this area for further deployment to test and production environments – and _never_ directly build and move artifacts from developer machines!   
As all resources from each successful build is stored safely and labeled one automatically achieves versioning and the possibility to roll back to previous versions and packages if needed.

 

## What is the problem with CI and BizTalk?

 

It is important to have the build and feedback process as efficient as possible to enable frequent checkins and to catch possible errors and mistake directly. As mentioned it is equally as important that the resources are written to the deploy area are the ones used to deploy to test and production so one gets all the advantages with versioning and roll back possibilities etc. 

 

The problem with BizTalk Server is however that only building a project in Visual Studio does not gives us a deployable package (only raw dlls)!

 

There are a number of different ways to get around this. One popular option is to automate the whole installation of the dlls generated in the build. This not only requires a whole lot of scripting and work, it also requires a full BizTalk Server installation on the build server. The automated process of installation also takes time and slows down the feedback loop back to development team. There are however great frameworks as for example the [BizTalk Deployment Framework](http://biztalkdeployment.codeplex.com/) to help with this (this solution of course also enables integration testing using [BizUnit](http://bizunit.codeplex.com/) and other framework). 

 

Some people would also argue that the whole script package and the raw dlls could be moved onto test and production and viewed on as a deployment package. But MSI is a powerful packaging tool and BizTalk Server has a number of specialized features around MSI. As MSI also is so simple and flexible it usually the preferred solution by IT operations.

 

A final possibility is of course to directly add the resources one by one using BizTalk Server Administration console. In more complex solutions this however takes time and requires deeper knowledge into the solution as one manually has to know in what order the different resources should be added.

 

## Another option in BtsMsiTask

 

Another option is then to use [BtsMsiTask](https://github.com/riha/BtsMsiTask) to directly generate a BizTalk Server MSI from the Visual Studio build and MsBuild.

 

![SimplerProcess](/assets/2014/01/SimplerProcess1.png)

 

The BtsMsiTask uses same approach and tools as the MSI export process implemented into BizTalk Server but extracts it into a MSBuild task that can be directly executed as part of the build process. 

 

BtsMsiTask enables the CI server to generate a deployable MSI package directly from the Visual Studio based build _without_ having to first install into BizTalk Server!
