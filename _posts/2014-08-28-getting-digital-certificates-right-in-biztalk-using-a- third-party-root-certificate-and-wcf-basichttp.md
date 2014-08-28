---
date: 2014-08-28 23:00:0+01:00
layout: post
title: "Getting digital certificates right in BizTalk using a third party root certificate in combination with client certificate security and WCF BasicHttp"
---

Digital certificates and asymmetric security is notoriously hard to get right in a Windows environment. Getting it right in a _BizTalk context_ isn't exatlly easier. 

In this scenario a BizTalk Server act as a client and communicates with a service over https. The service also uses a client certificate for client authentication.

![presentation1](https://cloud.githubusercontent.com/assets/1317734/4082243/e3123c2e-2eef-11e4-9218-3ec8b31c041e.png)

## Long story short ##

Third party root certificates always needs to be places under "Third-Party Root Certifation Authorities" or directly under the "Trusted Root Certifaction Authorities" folder on Local Machine level. When however also configuring the WCF-BasicHttp adapter to also use client certificate aturization the BizTalk administration requires the thumbnail id of a specifik server certificate (in addition to the client certificate thumbnail). **This makes the runtime also look for the for the public certifiates under Trusted People folder and causes and error if we don't _also_ place it that folder.**
 
## Server certificate ##

Let's start by getting the server certificate right.

After configuring everything in BizTalk using a standard `WCF-BasicHttp` port and selecting `Transport` security I encountered the following error message.

> A message sent to adapter "WCF-BasicHttp" on send port "SP1" with URI "https://skattjakt.cloudapp.net/Service1.svc" is suspended.

> Error details: System.ServiceModel.Security.SecurityNegotiationException: Could not establish trust relationship for the SSL/TLS secure channel with authority 'skattjakt.cloudapp.net'. ---> System.Net.WebException: The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel. ---> System.Security.Authentication.AuthenticationException: The remote certificate is invalid according to the validation procedure. 

The error message is pretty straightforward: `Could not establish trust relationship for the SSL/TLS secure channel with authority`.
    
The first thing that happens when trying to establish SSL channel is that a public server certificate is sent down the client for the client to use when encrypting further messages to the server. This certificate is validated so it hasn't been revoked, that it's `Valid to` date hasn't passed, that the `Issued to` name actually matches the services domain and so on. 

But to be able to trust the information in the certificate it needs to be issued by someone we trust, a certificate authority (CA).  

If we take an example of a request to Google we actually don't trust the information in the Google server certificate, neither do we trust the intermediate certificate they use to sign their server certificate. The root certificate that issued the intermediary Google Certificate is however one of the preinstalled trusted certificate authorities in Windows.

![](https://cloud.githubusercontent.com/assets/1317734/4075616/ca0ada30-2eb1-11e4-86fa-a00a89d34559.png) 

What authorities and certificates to trust is in Windows based on what certificates exists in the Certificate Store under the `Trusted Root Certificate Authorities` folder.

![ca](https://cloud.githubusercontent.com/assets/1317734/4075860/ce641792-2eb4-11e4-8544-6a20e92ea9fe.png)

In our case the service didn't use a certificate from one of the trusted authorities but had based their certificate on a root certificate they created themselves. 

![ca2](https://cloud.githubusercontent.com/assets/1317734/4075933/8178a456-2eb5-11e4-8818-ca1b74fc66e2.png)

Further the Certificate Manager in Windows has three different levels: "Local Machine", "Service" and "Current User". The top level is the "Local Machine" and certificates added on this level are available for all users. "Service" and "Current User" are more specific and only available for specific services and the current running user. From a BizTalk perspective it's important to place the certificate so it's _accessible for the user running the BizTalk host instance_.

So after requesting the used root certificate and placing it in the trusted authorities folder for the Local Machine we're able to successfully establish an SSL session!

## Client certificate ##

As the server however required a client certificate for authorization I reconfigured the send port to use `Certificate` as client credential type.   
![3](https://cloud.githubusercontent.com/assets/1317734/4076354/713ca4c6-2eb9-11e4-8293-ed462b550fdc.png)

The BizTalk Administration Console then also requires one to enter the thumbprint of the certificates to use. When browsing for picking the client certificate the console will look for certificates to choose from in the "Personal" folder on the "Current User" level. So for the certificate to show up one has to add the client certificate to the "Personal" folder running as the user that eventually will run the console. Adding it only to the "Personal" folder of "Local Machine" will not make it show up in the console.

When selecting `Certificate` client credential type the BizTalk Administration console also requires one to pick a server certificate to use, even though we still just want to use the same root certificate as just added ... When locating server certificates to display the console will in this case look in the "Other People" folder on "Local Computer" level. So for making out root certificate show up we also have to this to this folder. It turns out that when pinpointing a specific server certificate the BizTalk runtime will throw an error if the server certificate is placed in the "Other People" folder. Likewise will an error we be thrown if the certificate is placed only in one of the truse autoritizes folders.
 
> A message sent to adapter "WCF-BasicHttp" on send port "SP1" with URI "https://skattjakt.cloudapp.net:444/Service42.svc" is suspended. 
>  Error details: System.InvalidOperationException: Cannot find the X.509 certificate using the following search criteria: StoreName 'AddressBook', StoreLocation 'LocalMachine', FindType 'FindByThumbprint', FindValue '70A9899E6CF89B014E6195ADE6E1BA12BEA58728'. 
