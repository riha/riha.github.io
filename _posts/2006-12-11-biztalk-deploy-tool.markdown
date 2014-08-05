---
author: Richard
comments: true
date: 2006-12-11 14:44:13+00:00
layout: post
slug: biztalk-deploy-tool
title: BizTalk Deploy Tool
wordpress_id: 32
categories:
- BizTalk 2006
- Tools
---

I'm currently working in a stabilization phase on a deployment application for BizTalk 2006 projects. We based the solution on the [Enterprise Solutions Build Framework](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=b4d6499f-0020-4771-a305-c156498db75e) and the [BizTalk Explorer Object Model](http://msdn2.microsoft.com/en-US/library/aa559050.aspx). Basically our solution has a GUI that makes it possible to point out which artifacts one likes to deploy (from the developers local BizTalk server). 

The application then figures out all the dependencies that the selected artifacts has (In our solution an Orchestration for example might have > 20 dependencies to different schemas, pipelines, C# libraries etc, etc).

All DLL:s of the different artifacts are then extracted from the local GAC (where they exist when deployed to the local BizTalk). These DLL:s are then packed in to one single deployment package also containing a single XML file that keeps track of the dependencies and the order of witch they have to be deployed in BizTalk (the most depending schemas first and so on). The XML file also contains other meta data information such as ports the artifacts use etc. 

This package is then loaded into another part of the application were it's possible to point out the different servers one like to deploy to. This view then shows information about what has to be done on the server to make it possible to deploy without conflicts (One might have running Orchestration or suspended messages for example that has to be stopped or terminated.). At this stage we also check the naming of the different artifacts. These have to comply with the naming conventions that are configured in the config file of the applications (a warning is shown if the artifact doesn't validate towards these). 

When no warnings (its possible to override a warning) or conflicts are shown one can deploy. We then move the deploy scripts to the servers and use the [MSBuild](http://msdn2.microsoft.com/en-us/library/wea2sca5.aspx) tasks in the [SBF](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=b4d6499f-0020-4771-a305-c156498db75e) to deploy everything for us. We really saved some serious time with this approach and even if it took us a while to get everything working it's been well worth it!

We have a huge feature list for the next phase of the tool and are planing to and support for [BizUnit](http://www.gotdotnet.com/workspaces/workspace.aspx?id=85ef830b-5903-4872-8071-4d4123a5553b) tests in the DLL:s (so that one gets a warning when deploying a Orchestration without etc). We also like to add more meta data about the port and make it possible to configure new ports as a part of the deployment process. Etc, etc ...

Feel free to comment or write we line for further information about this approach. It would also be interesting to hear about other approaches for deployment and what kind of features these solutions have.
