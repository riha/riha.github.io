---
date: 2014-10-17 12:00:0+01:00
layout: post
title: "Calling an on premise Microsoft Dynamics CRM using BizTalk and Active Directory Federated Security (ADFS)"
---

Federated security is a great way of accomplishing single-sign-on (SSO) security for your applications. It’s also a technique that is becoming increasingly relevant as things move to the cloud and we’re starting to get more hybrid situation with some applications on premise and some in the cloud.

Active Directory Federated Security (ADFS) is an implementation of federated security and is used by a number of Microsoft Applications, Microsoft Dynamics CRM being one of them.

Windows Communication Foundation (WCF) has a few techniques to simplify federated security communication and this post will show an example of using Microsoft BizTalk Server and WCF to communicate with an ADFS secured CRM installation.

## What is federated security? ##
Federated security at its core is pretty simple. In our scenario BizTalk Server (client) wants to login in and authenticate itself with the CRM system.

Traditionally the CRM system then had to manage the credentials for the client and verify these as login happened. There a number of drawback to this, the main one being that it doesn’t scale that well when we’re getting many separated systems that need access to each other as login information and login logic is spreads out across a number of systems.

When using federated security each part instead chooses to trust a common part (in this case the ADFS and AD), and as long as someone provide a token that can be validated with the trusted part, the CRM system will trust that it already has been authenticated and that everything is ok.

<img style="height:60%;width:60%;" src="https://cloud.githubusercontent.com/assets/1317734/4677004/35ce5cea-55e2-11e4-8283-91f8158ffbb2.png" alt="Information flow" />

1. Authentication and requesting token
1. Authentication against AD
1. Login authenticated
1. ADFS token response
1. ADFS token based authentication
1. Response from CRM
    
So basically a federated security model allows for separating all authentication and authorization out to a separate system.

As mentioned ADFS is just an implementation of federated security were Active Directory acts as the main repository with a Security Token Service implementation on top of it.

## BizTalk and ADFS ##
As BizTalk has great WCF support we can use the WCF stack to handle all of communication with ADFS and CRM. But it does involve a fair bit of configuration. BizTalk and Visual Studio will help in most mainstream WCF scenario where one can point Visual Studio at the WSDL location and a basic binding file is generated for us. However, in the case of and ADFS based WSDL this will just result in an empty binding file that doesn’t help much.

Lots of projects I’ve seen makes the decision at this point to use custom code and create a facade to solve authentication. As Microsoft Dynamics CRM comes with a nice SDK including a C# library to handle authentication is easy to understand how one would end up using that. The problem is however that this creates another code base that again needs to be maintained over time. One could also argue that using custom code that is called by BizTalk further complicates the overall solution and makes it harder to maintain.

So let’s configure the authentication from scratch using Windows Communication Foundation.

## Choosing the right WCF binding ##
First thing to do is to choose the right WCF binding. Let’s create a WCF-Custom Static Solicit-Response send port and choose the `ws2007FederationHttpBinding`.

<img style="height:60%;width:60%;" src="https://cloud.githubusercontent.com/assets/1317734/4677011/4c6ebf80-55e2-11e4-8176-5d6689344b9b.png" alt="Choose binding" />

## Adding the Issuer ##
First thing we need to add is information on how to connect to the Issuer. The Issuer is the one issuing the ticket, in our case that’s the ADFS.

<img style="height:60%;width:60%;" src="https://cloud.githubusercontent.com/assets/1317734/4677021/615e582e-55e2-11e4-8a20-d412647a9a54.png" alt="Issuer details" />

First we need to add information about the address of the Issuer. The WSDL tells us that the mex endpoint for the ADFS server is located at `https://adfs20.xxx.yy/adfs/trust/mex`.

![Mex file](https://cloud.githubusercontent.com/assets/1317734/4677037/75a339c6-55e2-11e4-8bee-262b54497e53.png)

Browsing the WSDL for the ADFS server shows a number of different endpoints. Which one to use depends on what kind of authentication being used when requesting the token. In our case we’re using a simple username and password so we’re using the `usernamemixed` endpoint (`https://adfs20.xxx.yy/adfs/services/trust/2005/usernamemixed`).

Secondly we need to add information about the binding and the binding configuration for communication with the ADFS service.

What this basically means is that we need to add information to a second, or an inner, binding configuration. The BizTalk Server WCF configuration GUI doesn’t provide a way to set this so the only way is to configure this is to use one of the relevant configuration files (“machine.config” or the BizTalk config) and ad a binding manually.

    <bindings>
     <ws2007HttpBinding>
      <clear/>
      <binding name="stsBinding">
       <security mode="TransportWithMessageCredential">
        <transport clientCredentialType="None"/>
        <message clientCredentialType="UserName" establishSecurityContext="false"/>
       </security>
      </binding>
     </ws2007HttpBinding>
    </bindings>

Once this is setup we can point our BizTalk Server WCF configuration to the correct URL and reference the WCF inner binding we just configured.

<img style="height:60%;width:60%;" src="https://cloud.githubusercontent.com/assets/1317734/4677048/8771fe58-55e2-11e4-9fb8-cdaea394039a.png" alt="Issuer configured" />

Finally we need to provide the username and password to authenticate ourselves to the ADFS server.

<img style="height:60%;width:60%;" src="https://cloud.githubusercontent.com/assets/1317734/4677053/980b0d04-55e2-11e4-97d4-2c3a9befb553.png" alt="Login details" />

We now have communication setup to the ADFS service and should be able to get a valid ticket that we then can use to authenticate ourselves to the CRM system!

We now however also need to provide information on how to connect to the actual CRM system.

## Configure communication to CRM ##

The rest is easy. Let’s start with adding the URL to the end service we want to call. As with any other service call we’ll also add the SOAP Action Header that in this case is the Update service (`http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Update`) of the `OrganizationService` service.

<img style="height:60%;width:60%;" src="https://cloud.githubusercontent.com/assets/1317734/4677061/a975aab8-55e2-11e4-9727-1ffbd12e5132.png" alt ="Service details" />

As out service also uses SSL for encryption we need to tell the binding to use `TransportWithMessageCredentials`.

<img style="height:60%;width:60%;" src="https://cloud.githubusercontent.com/assets/1317734/4677066/bab52f7e-55e2-11e4-8c17-5c93dde94637.png" alt="Transport encryption" />

## Establishing a Security Context – or not ##

Finally there is a little tweak that is needed. WCF supports establishing a Security Context. This will cache the token and avoid asking the STS for a new token for each call to the CRM system. BizTalk Server however doesn’t seem to support this so we need to turn it off.

<img style="height:60%;width:60%;" src="https://cloud.githubusercontent.com/assets/1317734/4677070/cc96a416-55e2-11e4-942a-851427e242ea.png" alt="Security Context" />

## Conclusion ##

Understanding federated security is important and will become increasingly important as we move over to systems hosted in the cloud – federated security is the de facto authentication standard used by hosted systems in the cloud. Avoiding custom code and custom facades is a key factor in building maintainable large scale BizTalk based systems over time. BizTalk has great WCF support and taking full advantage of it is important to be able to build solutions that easy to oversee and possible to maintain not just by those familiar and comfortable in custom code.