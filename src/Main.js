// BabySlideChat - a GPT Chat editor add-on for Google Slides
// Copyright (C) 2023  Asaf Prihadash TailorVJ.com

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.


  /**
   * @OnlyCurrentDoc
   */


/**
 * Runs once when the add-on is installed.
 */
function onInstall(e) {
  onOpen(e);
}



/**
 * Adds custom menu items to the Slides add-on menu.
 */  
function onOpen() {
  SlidesApp.getUi()
    .createAddonMenu()
    .addItem('Chat', 'showSidebar')
    .addToUi();
}



/**
 * Shows the sidebar for generating background images.
 */
function showSidebar() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Chat')
    .setWidth(300);
  SlidesApp.getUi().showSidebar(htmlOutput);
}

