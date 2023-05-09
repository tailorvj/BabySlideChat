# BabySlideChat - An AppsScript add-on for Group discussion with GPT within Google Slides Documents

This Proof of concept Google Slides Editor add-on allows multiple users to have a chat with a GPT 3.5 Turbo based agent about authoring, designing and editing Slides presentation.

![1683660166516](image/README/1683660166516.png)

**IMPORTANT**: This code is experimental and not yet ready for publishing to the Google Workspace Marketplace

The goal of this project is to providie a simple implementation of the BabyAGI architecture within a Google Slides Editor add-on project, for the purposes of autonomous agent Slides document authoring, editing and design.

## Prerequisites

In order to run this project, you will need:

* A Google Cloud and Workspace user account
* Basic knowledge about the Apps Script environment and Google Slides
* Git installed on your system
* A terminal
* Node.js and NPM
* Clasp installed on your system

### Install Clasp

```bash
npm install -g @google/clasp
```

## Setup

Clone this project to your system

Rename src/SECRETSexample.js to SECRETS.js

Enter your Open AI API Key and OrgId into SECRETS.js and save

Create a new Firebase project

Enable Firestore database in your project

Create security rules that allow logged in users to read and write to the firestore - TODO: harden security rules

Create a service account for your Firebase project and provide it with the Datastore owner persmissions

Save the service account JSON file to your hard drive

Open the service account JSON file. Copy the service account JSON object

Replace the value of adminSdk in SECRETS.js with you service account JSON object

```bash
cd src

clasp login

clasp create --type=slides

clasp push

clasp open
```

Create new test deployment on one of your Slides presentations

Open Extensions -> BabySlideChat -> Chat

Send a message and don't forget to tag @Agnes

You should see a response from Agnes within 2-5 seconds.

## Multiple user chat

In order to allow more users to access the BabySlideChat add-on:

1. Share the script project and the Slides document with them
2. Instruct them how to run the Text deployment and how to open the Extension menu
3. It should work for them without any issue

## Contributing code

I'm actively looking for collaborators for this project.

1. Create issues
2. Fork
3. Branch
4. Send pull requests

## LICENSE - AGPL 3.0

BabySlideChat - a GPT Chat editor add-on for Google Slides
Copyright (C) 2023  Asaf Prihadash TailorVJ.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
