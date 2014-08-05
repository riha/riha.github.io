---
date: 2007-05-11 06:18:39+00:00
layout: post
title: "What’s an ESB architecture!?"
categories: [Architecture]
---

I've just finished reading a [paper written by David Pallmann](http://www.neudesic.com/media/Neudesic%20-%20Neuron%20ESB%20White%20Paper%20(P1).pdf) (PDF) from _[Neudesic](http://www.neudesic.com/)_. Belive it or not (or even better check it out), it's a short and understandable description of what an ESB is!

_Neudesic_ sells a product called _[Cyclone](http://www.neudesic.com/Main.aspx?SS=7&PE=75)_ which is something they call a _ESB architecture and framework software_ and even if describing this product is the main purpose of the paper the first part deals with describing the basics of an ESB and try's to "assemble a synthesis of popular ESB definitions".

I've chosen a couple of parts of the paper that really appealed to me but I really recommend the full length version (only 8 pages!).

<blockquote>Defining the ESB
> 
>   * An ESB is a backbone for connecting and integrating an enterprise’s applications and services.  
>   * An ESB provides the necessary infrastructure to create a service oriented architecture.  
>   * An ESB is a convergence of EAI, MOM, and SOA concepts.  
>   * An ESB is based on open standards such as XML, SOAP, and WS-*.  
>   * An ESB provides intelligent routing, such as publish-subscribe, message brokering, and failover routing.  
>   * An ESB provides mediation, overcoming data, communication, and security differences between endpoints.  
>   * An ESB integrates with legacy systems using standardsbased adapters.  
>   * An ESB provides logical centralized management but is  
physically decentralized.  
>   * An ESB is able to apply EAI concepts such as rules and  
orchestrations.  
>   * An ESB is able to monitor and throttle activity as per a Service Level Agreement (SLA).
> </blockquote>

I never thought of an ESB as an convergence of EAI (Enterprise Application Integration), MOM (Message Oriented Middleware) and SOA (Service Oriented Architecture) concepts. But, ok, so what does the writer really mean by these concepts?

<blockquote>SOA makes loosely-coupled, decentralized solutions possible that are enterprise-ready and based on interoperable standards. EAI allows integration of any combination of systems, with sophisticated message brokering, message translation, business process orchestration, and rules engine processing. MOM provides intelligent routing such as publish-subscribe topical messaging and strong managerial controls over routing, auditing, activity monitoring, and throttling.
> 
> </blockquote>

And why do we need a bus architecture on top of SOA, MOM and EAI?

<blockquote>Point-to-point architecture  
works all right on a small scale, but its problems become  
apparent when used at the enterprise level. If each system has to know the connection details of every other system, then each new system added increases the problem of configuration and management exponentially. This was the impetus that led us to hub-and-spoke architectures, which most EAI products use. This architecture was a vast improvement over point-to-point architectures, and each system needed to communicate with only the hub. In addition, the hub could provide excellent management features since it was a party to all communication. It only took time to reveal some shortcomings with the hub-and-spoke approach, and today it is often associated with concerns about scalability, single point of failure, and vendor lock-in.  
> 
> ... 
> 
> Fortunately, there is a sound compromise to be found in the bus architecture, which provides the benefits of logical centralization but is physically decentralized. The bus architecture in earlier days was often used in message bus systems based on proprietary technologies, but an ESB implements this architecture using WS-* standards.
> 
> </blockquote>

So using all three of them will make an ESB? Well, not really ...

<blockquote>If combining disciplines was all there was to an ESB, we’d simply call it “consulting”. To properly leverage these disciplines they need to be combined in the right way through an architecture that lets their strengths shine and overcome their inherent weaknesses. Each discipline has some weak areas that the others help to resolve: SOA needs better enterprise manageability; EAI needs to become decentralized; MOM needs to get away from proprietary technologies. Combining these disciplines properly in an ESB overcomes these weaknesses.
> 
> </blockquote>

I'd be very intreseted in comments of other artciles, papers and so on relating to the ESB concept!
