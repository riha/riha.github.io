---
date: 2007-01-17 17:27:04+00:00
layout: post
title: "Assembly loading policy from the GAC"
categories: [.NET, BizTalk 2006]
---

UPDATE: This does not apply to BizTalk ... I've made an update [post here](http://richardhallgren.com/blog/?p=51). Sorry.

We're working with a lot of code libraries that we use in different parts of our BizTalk solutions. As the are used on several servers and by loads of different "BizTalk parts" (both in orchestrations and maps) it's important that we always keep the version number of the assemblies up to date. That means that every little change should increase the current version number. But as they are used in so many places people have started to skip this step as they thought they had to compile all parts that should use the new code (say it's a bug fix and you'd like all "using parts" of the assembly to load the updated version). This is where GAC loading policy comes to the resource!

First we have to understand that every .NET assembly is identified using four characteristics: 

  * Assembly name  
  * Major or minor version  
  * Public key token  
  * Culture

Then we need to know that the first version number in for example version 1.1.2.1 is the **major version**. The second is the **minor version** and the third and fourth are **build, revision version number**. So this means that if you have 1.1.2.1 installed and make a minor change the easiest way to use the new assembly is to change the one of the build or revision numbers (the third or fourth number). Then the CLR will load the new assembly without any other changes!

But sometimes we have to change the minor or major version - and we still don't have to recompile a thing! We can use a publisher policy file. This is an example of such a file defined for version 1.0.0.0 moving to 2.0.0.0.
    
    <div><span style="color: #0000FF; "><</span><span style="color: #800000; ">configuration</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">runtime</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">assemblyBinding </span><span style="color: #FF0000; ">xmlns</span><span style="color: #0000FF; ">="urn:schemas-microsoft-com:asm.v1"</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">dependentAssembly</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
                    </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">assemblyIdentity </span><span style="color: #FF0000; ">name</span><span style="color: #0000FF; ">="BaseHelper"</span><span style="color: #FF0000; "> publicKeyToken</span><span style="color: #0000FF; ">="18517ea673f8584b"</span><span style="color: #FF0000; "> culture</span><span style="color: #0000FF; ">="neutral"</span><span style="color: #FF0000; "> </span><span style="color: #0000FF; ">/></span><span style="color: #000000; ">
                        </span><span style="color: #0000FF; "><</span><span style="color: #800000; ">bindingRedirect </span><span style="color: #FF0000; ">oldVersion</span><span style="color: #0000FF; ">="1.0.0.0"</span><span style="color: #FF0000; "> newVersion</span><span style="color: #0000FF; ">="2.0.0.0"</span><span style="color: #0000FF; ">/></span><span style="color: #000000; ">
                </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">dependentAssembly</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
            </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">assemblyBinding</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
        </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">runtime</span><span style="color: #0000FF; ">></span><span style="color: #000000; ">
    </span><span style="color: #0000FF; "></</span><span style="color: #800000; ">configuration</span><span style="color: #0000FF; ">></span></div>




This [kb article](http://support.microsoft.com/kb/891030) describes what to do next:






  1. **Change the version and recompile.** The first step is to create the new version of your component. After you've done that, you will need to modify the version number in the AssemblyInfo file for your component.   
**Create the publisher policy file. **Create the publisher policy file for the assembly using the format shown above.   
**Use Assembly Linker (Al.exe) to create the publisher policy assembly.** The Assembly Linker is included with the .NET Framework SDK. To create the publisher policy assembly that redirects a binding from version 1.0 of Website.dll to version 2.0 using a publisher policy file called website.config, run the following command:   
  


    
    <div><span style="color: #000000; ">al /link:BaseHelper.config /out:policy.1.0.BaseHelper.dll /keyfile:c:\keyfile.snk</span></div>

This command will create a new assembly called policy.1.0.BaseHelper.dll. This naming convention is important, as indicated in the "What Is a Publisher Policy Assembly?" section.

  2. **Install the publisher policy assembly into the Global Assembly Cache.** The publisher policy assembly is installed into the GAC. It will be used by the .NET runtime when any application attempts to bind to version 1.0 of the BaseHelper.dll, and it will force the application to bind to the new version automatically.

  3. **Install the new version into the Global Assembly Cache. **Install the new version of the component into the GAC. After the new version has been installed, the old version can be safely removed. 



So no more excuses for not updating the version number!
