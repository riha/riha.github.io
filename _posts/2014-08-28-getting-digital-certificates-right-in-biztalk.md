---
date: 2014-08-28 17:00:0+01:00
layout: post
title: "Getting digital certificates right in BizTalk"
---

Digital certificates and asymmetric security is notoriously hard to get right in a Windows environment. Getting it right in a BizTalk context isn't actually easier. 

In this scenario a BizTalk Server act a client and communicates with a service over https. The service also uses a client certificate for client authentication.

Let's start getting the server certificate right.

## Server certificate ##

After configuring everything in BizTalk using a standard `WCF-BasicHttp` port and selecting `Transport` security the following error message was received when trying to reach the service.

    A message sent to adapter "WCF-BasicHttp" on send port "SP1" with URI "https://skattjakt.cloudapp.net/Service1.svc" is suspended.
    Error details: System.ServiceModel.Security.SecurityNegotiationException: Could not establish trust relationship for the SSL/TLS secure channel with authority 'skattjakt.cloudapp.net'. ---> System.Net.WebException: The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel. ---> System.Security.Authentication.AuthenticationException: The remote certificate is invalid according to the validation procedure. 

The error message is pretty straight forward: `Could not establish trust relationship for the SSL/TLS secure channel with authority`.
    
The first thing that happens when trying to establish ssl channel is that a public server certificate is sent down the client for the client to use for encrypting further messages to the server. This certificate is validated so it hasn't been revoked, that it's `Valid to` date hasn't passed, that the `Issued to` name actually matches the services domain and so on. 

But to be able to trust the information in the certificate it need to be issued by someone we trust, a certificate authority.  

Looking at this when communicating with Google we actually don't trust the information in the Google server certificate, neither do we trust the intermediate certificate they use to sign their server certificate. We do however trust GeoTrust that they've used as their root certificate and therefor we can move on and establish a secure channel.

![](https://cloud.githubusercontent.com/assets/1317734/4075616/ca0ada30-2eb1-11e4-86fa-a00a89d34559.png) 

The way in Windows we decide what authorities and certificates to trust is on based on what certificates we have in our Certificate store under the `Trusted Root Certificate Authorities` folder.

![ca](https://cloud.githubusercontent.com/assets/1317734/4075860/ce641792-2eb4-11e4-8544-6a20e92ea9fe.png)

In our case the service didn't use a certificate from one of the trusted authorities but had based their certificate on a root certificate they created themselves.

![ca2](https://cloud.githubusercontent.com/assets/1317734/4075933/8178a456-2eb5-11e4-8818-ca1b74fc66e2.png)

Further the Certificate Manager in Windows has three different of level - `Local Machine`, `Service` and `Current User`. On the highest level is the Local Machine and certificates added on this level are available for all users. Service and Current user are more specific and only available for specific services and the current running user. From a BizTalk perspective it's important to place the certificate so it's accessible for the user running the BizTalk host instance.

So after placing the CA certificate used in the trusted authorities folder for the Local Machine ssl was established.

## Client certificate ##

As the server however required a client certificate for authorization I reconfigured the send port to use `Certificate` as client credential type.   
![3](https://cloud.githubusercontent.com/assets/1317734/4076354/713ca4c6-2eb9-11e4-8293-ed462b550fdc.png)

The BizTalk Administration Console then also requires one to enter the thumbprint of the certificate to use. When hitting browse in the GUI for picking a certificate the console will look for certificates to choose from in the `Personal` folder on the Current User level. So for the certificate to show up one has to add the client certificate to the Personal folder when running as the user that currently runs the run console. Adding it only to the Personal folder of Local Machine will not work make it show up in the console.

When selecting Certificate client credential type the BizTalk Administration console also requires one to pick a server certificate to use, even though we still just want to use the same root certificate as just added. When trying to locate the server certificate the GUI will look for these in `Other People` folder on Local Computer level so for making it show up in the console we also have to add the server certificate there ...

When sending another message the following error message is returned. 

    A message sent to adapter "WCF-BasicHttp" on send port "SP1" with URI "https://skattjakt.cloudapp.net:444/Service42.svc" is suspended. 
     Error details: System.InvalidOperationException: Cannot find the X.509 certificate using the following search criteria: StoreName 'My', StoreLocation 'CurrentUser', FindType 'FindByThumbprint', FindValue 'F4EBACFB5A0AF7875A4D315B04E65EB92C7526CA'.

This is of course occurs because I've added the client certificate as the user logged in and this placed it on the Current User level for that user and not the user running the host instance. After also adding the certificate to the Personal folder on Current User level running Credential Manager as the user running the host instance everything is good. 






 
 


  



 

