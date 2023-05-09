// Rename this file to SECRETS.js and fill in the values below.

// BabySlideChat - a GPT Chat editor add-on for Google Slides
// Copyright (C) 2023  Asaf Prihadash TailorVJ.com

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.


const apiKey = 'sk-123456789123456789123456789123456789123456789000';
const orgId = 'org-1234567891234567891234567';

const adminSdk = {
  "type": "service_account",
  "project_id": "projectname",
  "private_key_id": "1234567891234567891234567891234567890000",
  "private_key": "-----BEGIN PRIVATE KEY-----\n=\n-----END PRIVATE KEY-----\n",
  "client_email": "project@userforaccount.iam.gserviceaccount.com",
  "client_id": "123456789123456789000",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/project%40userforaccount.iam.gserviceaccount.com"
};


function getGPTKey(){
  return apiKey;
}

function getGPTOrgId(){
  return orgId;
}

function getProjectId(){
  return adminSdk.project_id;
}

function getServiceAccountEmail() {
  return adminSdk.client_email;
}

function getPrivateKey() {
  return adminSdk.private_key;
}


var PROJECT_ID = getProjectId();
var PRIVATE_KEY = getPrivateKey();
var CLIENT_EMAIL = getServiceAccountEmail();

// Using FirestoreGoogleAppsScript open source library with GSUnit.
// I published my own version that inclues both in the same project
function getFirestore() {
  return FirestoreGoogleAppsScript.getFirestore(CLIENT_EMAIL, PRIVATE_KEY, PROJECT_ID);
}