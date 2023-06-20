// BabySlideChat - a GPT Chat editor add-on for Google Slides
// Copyright (C) 2023  Asaf Prihadash TailorVJ.com

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

    /**
     * Sends the user's message to Agnes and returns Agnes's response.
     * @param {string} userMessage - The message from the user.
     * @param {Array} recentMessages - The recent chat history.
     * @return {Promise} - A promise that resolves with Agnes's response.
     */
    function sendToAgnes(userMessage, recentMessages) {
      const messageText = userMessage;
      const recentText = JSON.stringify(recentMessages);
      Logger.log(`sendToAgnes messageText: ${messageText}`);
      Logger.log(`sendToAgnes recentMessages: ${recentText}`);
      const agnesResponse = getResponseFromAgnes(messageText, recentMessages);
      return agnesResponse;
  }


  /**
   * Fetches a response from Agnes, an AI assistant.
   * @param {string} prompt - The user's message.
   * @param {Array} recentMessages - The recent chat history.
   * @return {Promise} - A promise that resolves with Agnes's response.
   */
  function getResponseFromAgnes(prompt, recentMessages) {
  const model = "gpt-3.5-turbo";
  const endpoint = "v1/chat/completions";

  const apiKey = getGPTKey();
  const orgId = getGPTOrgId();
  const temperature = 0.1;
  const maxTokens = 250;

  // Map recentMessages to the expected format
  const formattedRecentMessages = recentMessages.map((message) => {
      return {
      role: message.sender === 'Agnes' ? 'assistant' : 'user',
      content: (message.sender !== 'Agnes' ? `${message.senderName}: ` : '') + message.content
      };
  });

  Logger.log(`getResponseFromAgnes formattedRecentMessages: ${formattedRecentMessages}`);

  // Include an initial system message to define Agnes as a GPT agent
  const messages = [
      {
      role: "system",
      content: `You are Agnes, a GPT agent that is an expert in marketing, educational neuroscience, presentation copywriting, presentation design, Google Slides, Apps Script, Google Slides Service for Apps Script, public speaking, and everything related to delivering the best possible presentation in every context, be it corporate, education, government, and for any target audience. You are participating in an ongoing conversation to author and design a Google Slides presentation with a group of people and chat bots in a chat room within a Google Slides presentation sidebar. Your goal is to provide the best possible advice in every step of the ongoing conversation. The users in the chat room have names and they often start their messages by addressing you as "@Agnes" and may sign their messages with their name. When responding, you can address the entire chat room or address a specific participant by tagging them with their name at the beginning of your response, e.g., "@Name, ...". Please be polite and keep your messages short and to the point. You can ask questions in order to clarify matters, or provide your response immediately. It is up to you. Remember, this is an ongoing conversation, but our goal is to reach the best possible outcome in the shortest possible time. Please note that your response length should be limited to ${maxTokens} tokens. If you suspect ${maxTokens} tokens might not be enough in order to provide a full response, provide part of the response and ask the user to send you a message saying "continue" for the next part or your response`
      },
      ...formattedRecentMessages,
      {
      role: "user",
      content: prompt
      }
  ];

  const stringifiedPayload = JSON.stringify({
      "model": model,
      "messages": messages,
      "temperature": temperature,
      "max_tokens": maxTokens, // Limit the response length
  });

  Logger.log(`getResponseFromAgnes stringifiedPayload: ${stringifiedPayload}`);

  const requestOptions = {
      method: "post",
      contentType: "application/json",
      headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json",
      "X-Organization-ID": orgId
      },
      payload: stringifiedPayload,
      muteHttpExceptions: true,
  };

  const fetchPromise = UrlFetchApp.fetch("https://api.openai.com/" + endpoint, requestOptions);

  // Set up a timeout promise that will reject after 10 seconds
  const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
      reject(new Error('OpenAI API request timed out'));
      }, 10000);
  });

  // Use Promise.race to resolve with the first promise that resolves or rejects
  return Promise.race([fetchPromise, timeoutPromise])
      .then((response) => {
      const responseText = response.getContentText();
      const json = JSON.parse(responseText);
      const openAITextResponse = getContent(json);
      return openAITextResponse;
      });
  }


  /**
   * Extracts the AI assistant's response from the OpenAI API response.
   * @param {Object} json - The JSON response from the OpenAI API.
   * @return {string} - The assistant's response.
   * @throws {Error} - If the assistant's response cannot be extracted.
   */
  function getContent(json) {
  const message = json.choices && json.choices[0] && json.choices[0].message;
  if (message && message.role === "assistant") {
      return message.content;
  } else {
      console.error('Failed to extract content from GPT response:', json);
      throw new Error('Failed to extract content from GPT response');
  }
  }


  /**
   * Retrieves the active user's Google profile.
   * @return {Object} - The user's Google profile.
   */
  function getUserProfile() {
  const personFields = 'names,emailAddresses,photos';
  const requestParameters = {
      'personFields': personFields
  };
  const profile = People.People.get('people/me', requestParameters);
  console.log(`getUserProfile : ${profile}`);
  return profile;
  }


  /**
   * Constructs the Firestore collection path for the current presentation.
   * @return {string} - The Firestore collection path.
   */
  function getCollectionPath(){
  const presentationId = getPresentationId();
  return 'chat/' + presentationId + '/messages';
  }


  /**
   * Retrieves the chat messages from Firestore.
   * @return {Array} - The chat messages.
   */
  function clientGetMessagesFromFirestore() {
  try {
      const firestore = getFirestore();
      const collectionPath = getCollectionPath();
      const query = firestore.query(collectionPath).OrderBy("timestamp");
      const messages = query.Execute();
      return messages.map((message) => {
      return {
          sender: message.obj.sender,
          senderName: message.obj.senderName,
          senderPhotoUrl: message.obj.senderPhotoUrl,
          content: message.obj.content,
          timestamp: message.obj.timestamp
      };
      });
  } catch (error) {
      console.error('clientGetMessagesFromFirestore Error fetching messages from Firestore:', error);
  }
  }


  /**
   * Retrieves the active user's email address.
   * @return {string} - The user's email address.
   */
  function getUserEmail() {
  return Session.getActiveUser().getEmail();
  }


  /**
   * Retrieves the ID of the active Google Slides presentation.
   * @return {string} - The presentation ID.
   */
  function getPresentationId() {
  return SlidesApp.getActivePresentation().getId();
  }


  /**
   * Constructs a new Firestore document path for the current presentation.
   * @return {string} - The Firestore document path.
   */
  function createNewDocumentPath(){
  const presentationId = getPresentationId();
  return 'chat/' + presentationId + '/messages/' + Utilities.getUuid();
  } 


  /**
   * Writes a chat message to Firestore.
   * @param {Object} sentMessage - The chat message.
   */
  function clientWriteToFirestore(sentMessage) {
  try {
      const firestore = getFirestore();
      const data = {
      "sender": sentMessage.sender,
      "senderName": sentMessage.senderName,
      "senderPhotoUrl": sentMessage.senderPhotoUrl,
      "content": sentMessage.content,
      "timestamp": sentMessage.timestamp
      };
      const documentPath = createNewDocumentPath();
      firestore.createDocument(documentPath, data);
  } catch (error) {
      console.error('clientWriteToFirestore Error writing to Firestore:', error);
  }
  }