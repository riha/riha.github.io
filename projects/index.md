---
date: 2014-10-31 13:11:57+00:00
layout: page
---

#BtsMsiLib and BtsMsiTask#
MSI are great for deployment. These two projects enables packaging of BizTalk and BizTalk related dlls into a single MSI that then can be deployed to BizTalk - without first having to install into BizTalk Server.

[BtsMsiLib](https://github.com/riha/BtsMsiLib) is a standalone .NET library that exposes methods for packing dlls, making it possible to build custom solutions that leverages the MSI packing functionality. BtsMsiLib is available as a [NuGet package](https://www.nuget.org/packages/BtsMsiLib/).

[BtsMsiTask](https://github.com/riha/BtsMsiTask) is a MsBuild task built upon  BtsMsiLib that exposes the packing functionality as MsBuild task. Read more about the features and how to get going at the [documentation site](https://riha.github.io/BtsMsiTask).

#BizTalk Web Documentor#
Takes the idea of automatically generated technical documentation from a BizTalk server and creates a static web site. [BtsWebDoc](https://github.com/riha/btswebdoc) exposes everything for orchestrations and mapping details to information about ports and much much more

Unfortunately the project in currently on halt due to lack of time.

#Spin2Win#
Simple small project in TypeScript that tries to make "lottery draws" and so on more fun. Enter a number of names and get a spinning prize wheel.

[Open source](https://github.com/riha/spin2win), available for  [playing](http://spin2win.azurewebsites.net/) using a Facebook login.

#Snake Pit#
God old Snake using JavaScript and TypeScript - super useful of course! Had an idea of an multiplayer game using [SignalR](http://signalr.net/) but never have had time to finish it. Have a look at some [code](https://github.com/riha/SnakePit) or [start working](http://snakepit.azurewebsites.net/) on your own highscore today.
