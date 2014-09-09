---
date: 2009-12-11 10:19:52+00:00
layout: post
title: "Checking if BizTalk binding file is up-to date during deployment"
categories: [BizTalk 2006, MSBuild]
---

As all of you know the number one time consuming task in BizTalk is deployment. How many times have you worked your way through the steps below (and even more interesting - how much time have you spent on them …)
 
  * Build 
   
  * Create application 
   
  * Deploy schemas 
   
  * Deploy transformations 
   
  * Deploy orchestration 
   
  * Deploy components 
   
  * Deploy pipelines 
   
  * Deploy web services 
   
  * Create the external databases 
   
  * Change config settings 
   
  * GAC libraries 
   
  * Apply bindings on applications 
   
  * Bounce the host instances 
   
  * Send test messages 
   
  * Etc, etc … 

Not only is this time consuming it’s also _drop dead boring_ and therefore also very prone - small mistakes that takes ages to find and fix.

The good news is however that the steps are quite easy to script. We use a combination of a couple of different open-source MsBuild libraries (like [this](http://www.codeplex.com/sdctasks) and [this](http://msbuildtasks.tigris.org/)) and have created our own little build framework. There is however the [BizTalk Deployment Framework](http://biztalkdeployment.codeplex.com/) by [Scott Colescott](http://www.traceofthought.net/) and [Thomas F. Abraham](http://www.tfabraham.com/blog/) that looks great and is very similar to what we have (ok, ok, it’s a _bit_ more polished …).

### Binding files problem

Keeping the binding files in a source control system is of course a super-important part of the whole build concept. If something goes wrong and you need to roll back, or even rebuild the whole solution, having the right version of the binding file is critical.

A problem is however that _if someone has done changes to the configuration via the administration console and **missed** to export these binding to source control we’ll deploy an old version of the binding when redeploying_. This can be a huge problem when for example addresses etc have changed on ports and we redeploy old configurations.

 
> What!? If fixed that configuration issue in production last week and now it back …


So **how can we reassure** that the binding file is up-to-date when deploying?

One solution is to do and export of the current binding file and compare that to one we’re about to deploy in a “pre-deploy”-step using a custom MsBuild target.

### Custom build task

Custom build task in MsBuild are easy, a good explanation of how to write one can be found [here](http://msdn.microsoft.com/en-us/library/t9883dzc.aspx). The custom task below does the following.
 
1. Require a path to the binding file being deployed. 
   
2. Require a path to the old deployed binding file to compare against. 
   
3. Using a regular expression to strip out the time stamp in the files as this is the time the file was exported and that will otherwise differ between the files. 
   
4. Compare the content of the files and return a boolean saying if they are equal or not. 
    

        public class CompareBindingFiles : Task
        {
            string _bindingFileToInstallPath;
            string _bindingFileDeployedPath;
            bool _value = false; 
    
            [Required]
            public string BindingFileToInstallPath
            {
                get { return _bindingFileToInstallPath; }
                set { _bindingFileToInstallPath = value; }
            } 
    
            [Required]
            public string BindingFileDeployedPath
            {
                get { return _bindingFileDeployedPath; }
                set { _bindingFileDeployedPath = value; }
            } 
    
            [Output]
            public bool Value
            {
                get { return _value; }
                set { _value = value; } 
    
            } 
    
            public override bool Execute()
            {
                _value = GetStrippedXmlContent(_bindingFileDeployedPath).Equals(GetStrippedXmlContent(_bindingFileToInstallPath));
                return true; //successful
            } 
    
            private string GetStrippedXmlContent(string path)
            {
                StreamReader reader = new StreamReader(path);
                string content = reader.ReadToEnd();
                Regex pattern = new Regex("<Timestamp>.*</Timestamp>");
                return pattern.Replace(content, string.Empty);
            } 
    
        }

### Using the build task in MsBuild

After compiling the task above when have to reference the dll in <UsingTask> element like below.

    
    <UsingTask AssemblyFile="My.Shared.MSBuildTasks.dll" TaskName="My.Shared.MSBuildTasks.CompareBindingFiles"/>

    
We can then do the following in out build script! 
    
    <!--
        This target will export the current binding file, save as a temporary biding file and use a custom target to compare the exported file against the one we’re about to deploy.
        A boolean value will be returned as IsValidBindingFile telling us if they are equal of not.
    -->
    <Target Name="IsValidBindingFile" Condition="$(ApplicationExists)=='True'">
        <Message Text="Comparing binding file to the one deployed"/> 
    
        <Exec Command='BTSTask ExportBindings /ApplicationName:$(ApplicationName) "/Destination:Temp_$(BindingFile)"'/> 
    
        <CompareBindingFiles BindingFileToInstallPath="$(BindingFile)"
                             BindingFileDeployedPath="Temp_$(BindingFile)">
            <Output TaskParameter="Value" PropertyName="IsValidBindingFile" />
        </CompareBindingFiles> 
    
        <Message Text="Binding files is equal: $(IsValidBindingFile)" /> 
    
    </Target>
    
    <!--
        This pre-build step runs only if the application exists from before. If so it will check if the binding file we try to deploy is equal to one deployed. If not this step will break the build.
    -->
    <Target Name="PreBuild" Condition="$(ApplicationExists)=='True'" DependsOnTargets="ApplicationExists;IsValidBindingFile">
        <!--We'll break the build if the deployed binding files doesn't match the one being deployed-->
        <Error Condition="$(IsValidBindingFile) == 'False'" Text="Binding files is not equal to deployed" /> 
    
    <!--All other pre-build steps goes here-->
    
    </Target>

<img src="../assets/2009/12/rocket.jpg" style="float:right" />

So we now break the build if the binding file being deployed aren’t up-to-date!

This is _far_ from rocket science but can potentially save you from making some stupid mistakes.
