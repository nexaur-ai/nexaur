// ========================= =
// box.js (Full Version with Sound on Open & AI Features)
// Script for Shivay AI Button & Chatbox with Speech
// Enhanced & Developed Version (with Indian English Male Voice Priority & All Features)
// v2.6 - Corrected: Fixed race condition in mic timeout, improved event handling.
// v2.7 - Modified: AI logic moved to Flask backend API.
// ==========================

document.addEventListener('DOMContentLoaded', () => {
 // --- Configuration & Constants ---
 const CHATBOX_ID = 'chatBox';
 const START_BUTTON_SELECTOR = '.start-button'; // For AI button, not chat send
 const CHAT_BODY_ID = 'chatBody';
 const INPUT_AREA_MIC_ID = 'inputAreaMicIcon';
 const CHAT_INPUT_ID = 'shivayChatInput';
 const SEND_BUTTON_ID = 'sendChatMsgBtn';
 const HEADER_MIC_ICON_ID = 'headerMicIcon';
 const PRODUCT_LIST_SELECTOR = '#product-list .product-card'; // For scrolling to products
 const DESIRED_GAP_FROM_BUTTON = 15;
 const CLICK_ANIMATION_CLASS = 'animate-click';
 const CLICK_ANIMATION_DURATION = 450;
 const MESSAGE_ANIMATION_DELAY_STEP = 150;
 const MIC_LISTEN_DURATION = 5000; // 5 seconds for microphone listening attempt

 // Sound Element IDs
 const CHAT_OPEN_SOUND_ID = 'chatOpenSound';
 const MIC_TOGGLE_SOUND_ID = 'micToggleSound';
 const MESSAGE_SEND_SOUND_ID = 'messageSendSound';

 // --- DOM Element Selection ---
 const shivayChatBox = document.getElementById(CHATBOX_ID);
 const shivayStartButton = document.querySelector(START_BUTTON_SELECTOR);
 const chatBody = document.getElementById(CHAT_BODY_ID);
 const inputAreaMicIcon = document.getElementById(INPUT_AREA_MIC_ID);
 const chatInput = document.getElementById(CHAT_INPUT_ID);
 const sendBtn = document.getElementById(SEND_BUTTON_ID);
 const headerMicIcon = document.getElementById(HEADER_MIC_ICON_ID);

 // Sound Elements
 const chatOpenSoundElement = document.getElementById(CHAT_OPEN_SOUND_ID);
 const micToggleSoundElement = document.getElementById(MIC_TOGGLE_SOUND_ID);
 const messageSendSoundElement = document.getElementById(MESSAGE_SEND_SOUND_ID);

 // --- Check for Critical Elements ---
 if (!shivayChatBox) console.error(`Critical Error: Chatbox element with ID '${CHATBOX_ID}' not found.`);
 if (!shivayStartButton) console.error(`Critical Error: Start button with selector '${START_BUTTON_SELECTOR}' not found.`);
 if (!chatBody) console.error(`Critical Error: Chat body element with ID '${CHAT_BODY_ID}' not found.`);
 if (!chatInput) console.error(`Error: Chat input element with ID '${CHAT_INPUT_ID}' not found.`);
 if (!sendBtn) console.error(`Error: Send button element with ID '${SEND_BUTTON_ID}' not found.`);
 if (!headerMicIcon) console.warn(`Warning: Header mic icon with ID '${HEADER_MIC_ICON_ID}' not found.`);
 if (!inputAreaMicIcon) console.warn(`Warning: Input area mic icon with ID '${INPUT_AREA_MIC_ID}' not found.`);

 if (!chatOpenSoundElement) console.warn(`Warning: Chat open sound element with ID '${CHAT_OPEN_SOUND_ID}' not found.`);
 if (!micToggleSoundElement) console.warn(`Warning: Mic toggle sound element with ID '${MIC_TOGGLE_SOUND_ID}' not found.`);
 if (!messageSendSoundElement) console.warn(`Warning: Message send sound element with ID '${MESSAGE_SEND_SOUND_ID}' not found.`);

 // --- Speech Recognition Setup (for Chatbox) ---
 const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
 const chatRecognition = SpeechRecognitionAPI ? new SpeechRecognitionAPI() : null;
 let isChatListening = false;
 let recognitionStopTimer = null; // Timer to stop continuous recognition

 // --- Speech Synthesis Setup ---
 const speechSynthesis = window.speechSynthesis;
 let voices = { 'en-US': null, 'hi-IN': null };
 let voicesLoaded = false;
 let initialWelcomeSpoken = false;

 // Retrieve initial language from a global variable (set by Flask's context processor)
 let currentLanguage = window.shivayAiLang || 'en-US'; // Default to en-US if not set by Flask

 // --- Product Data Store ---
 // Still needed for client-side scrolling logic
 let productsData = [];
 let lastMessageTimestamp = 0;

 // --- Corrected Hindi Responses (for local UI messages if needed) ---
 // IMPORTANT: These are for client-side *local* messages (like mic errors).
 // The main AI responses come from the backend.
 const HINDI_RESPONSES = {
    "GREETING_WELCOME": "नमस्ते! मैं शिवाय हूँ, आपका नेक्सॉर वेब स्टोर एआई सहायक। मैं आज आपकी टेम्पलेट ढूँढने में कैसे मदद कर सकता हूँ?",
    "GREETING_WELCOME_REPLY": "नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?",
    "HOW_ARE_YOU_RESPONSE": "मैं बहुत अच्छा हूँ, आपकी टेम्पलेट के साथ सहायता करने के लिए तैयार हूँ!",
    "PRODUCT_FOUND_EXCELLENT": "बहुत बढ़िया! मुझे \"{productName}\" मिल गया।",
    "PRODUCT_NOT_FOUND_HMM": "हम्म, मुझे \"{searchTerm}\" नाम का कोई टेम्पलेट नहीं मिला।",
    "PRODUCT_DETAILS_HTML": "<br><button class=\"chat-action-btn\" data-action-type=\"redirect\" data-action-target=\"{detailPageUrl}\">विवरण देखें {productName}</button>",
    "PRODUCT_LIVE_PREVIEW_HTML": "<button class=\"chat-action-btn\" data-action-type=\"open_new_tab\" data-action-target=\"{livePreviewUrl}\">लाइव पूर्वावलोकन</button>",
    "PRODUCT_WHAT_TO_DO": "<br>आप क्या करना चाहेंगे?",
    "PRODUCT_OPENING_PAGE": "\"{productName}\" का पेज अब खोल रहा हूँ।",
    "ASK_SPECIFY_TEMPLATE": "कृपया बताएं कि आप कौन सा टेम्पलेट ढूंढ रहे हैं। उदाहरण के लिए, 'आधुनिक पोर्टफोलियो ढूंढो'।",
    "REDIRECTING_TO_PAGE": "\"{pageName}\" पर रीडायरेक्ट कर रहा हूँ...",
    "LANG_SWITCH_TO_HINDI_CONFIRM": "ठीक है, अब मैं हिंदी में बात करूँगा।",
    "LANG_HINDI_VOICE_NOT_FOUND": "क्षमा करें, इस सिस्टम पर मेरे पास हिंदी आवाज़ उपलब्ध नहीं है।",
    "LANG_SWITCH_TO_ENGLISH_CONFIRM": "ठीक है, अब मैं अंग्रेजी में बात करूँगा।",
    "DEFAULT_CONFUSION": "मैं पूरी तरह समझ नहीं पाया। आप मुझसे टेम्पलेट ढूंढने, श्रेणियों के बारे में पूछने, या खरीदने/किराए पर लेने के विकल्पों के बारे में पूछ सकते हैं।",
    "DEFAULT_FALLBACK_FOR_UNKNOWN": "मैं इस बारे में निश्चित नहीं हूँ। आप मुझसे टेम्पलेट ढूंढने या मेरी क्षमताओं के बारे में पूछ सकते हैं।",
    "CAPABILITIES_MESSAGE": "मैं शिवाय हूँ! मैं आपकी मदद कर सकता हूँ:<br>" +
                            "ðŸ”  वेबसाइट टेम्पलेट ढूंढने में (जैसे, 'एक पोर्टफोलियो टेम्पलेट ढूंढो')<br>" +
                            "ℹ️  उनकी विशेषताओं के बारे में बताने में<br>" +
                            "➡️  आपको उनके विवरण या लाइव पूर्वावलोकन पृष्ठों पर गाइड करने में।<br>" +
                            "बस पूछें!",
    "THANKS_RESPONSE_VERY_WELCOME": "आपका बहुत-बहुत स्वागत है! क्या मैं आज आपकी और कोई सहायता कर सकता हूँ?",
    "GOODBYE_MESSAGE": "अलविदा! आपकी सहायता करके खुशी हुई। आपका दिन शुभ हो!",
    "SETTINGS_INFO": "शिवाय एआई सेटिंग्स: यह सुविधा अभी निर्माणाधीन है। भविष्य के विकल्पों में आवाज़ का चयन या अन्य प्राथमिकताएं शामिल हो सकती हैं।",
    "MIC_NOT_SUPPORTED": "मुझे क्षमा करें, लेकिन आपके ब्राउज़र में वाक् पहचान समर्थित या सक्षम नहीं है।",
    "MIC_NO_SPEECH": "मैंने कुछ नहीं सुना। कृपया दोबारा प्रयास करें या ज़ोर से बोलें।",
    "MIC_NOT_ALLOWED": "माइक्रोफ़ोन की अनुमति नहीं है। कृपया अपनी ब्राउज़र सेटिंग्स में इसे सक्षम करें।",
    "MIC_START_ERROR": "माइक्रोफ़ोन शुरू करने में त्रुटि हुई। कृपया अनुमतियां जांचें।",
    "MIC_AUDIO_CAPTURE_ERROR": "माइक्रोफ़ोन में समस्या है। कृपया अपना माइक्रोफ़ोन हार्डवेयर और ब्राउज़र सेटिंग्स जांचें।",
    "MIC_NETWORK_ERROR": "नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।",
    "SPEECH_RECOGNITION_ERROR_GENERAL": "क्षमा करें, वाक् पहचान में एक त्रुटि हुई।"
 };


 // === Helper Functions ===
 function triggerClickAnimation(element) {
   if (element) {
     element.classList.add(CLICK_ANIMATION_CLASS);
     setTimeout(() => element.classList.remove(CLICK_ANIMATION_CLASS), CLICK_ANIMATION_DURATION);
   }
 }

 function stripHtml(html) {
   if (!html) return "";
   const doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
 }

 function extractProductData() {
   const productCards = document.querySelectorAll(PRODUCT_LIST_SELECTOR);
   if (productCards.length === 0) {
       // console.warn("No product cards found with selector:", PRODUCT_LIST_SELECTOR);
       return;
   }
   productsData = Array.from(productCards).map(card => ({
       id: card.dataset.productId, // This should now map to product_db_key
       name: card.dataset.name || card.querySelector('.card-title')?.textContent.trim(),
       category: card.dataset.category?.toLowerCase(),
       tech: card.dataset.tech?.toLowerCase(),
       description: card.querySelector('.card-text')?.textContent.trim(),
       buyPrice: card.querySelector('.product-price-buy')?.textContent.trim() || null,
       rentPrice: card.querySelector('.product-price-rent')?.textContent.trim() || null,
       detailPageUrl: (card.querySelector('.card-img-container a') || card.querySelector('.card-title a'))?.getAttribute('href') || null,
       livePreviewUrl: card.querySelector('.live-preview-btn')?.getAttribute('href') || null,
       element: card
     }));
   // console.log("Products data extracted:", productsData.length, "items");
 }

 // This getTranslatedResponse is only for *local* UI messages (like mic errors)
 // AI responses come from the backend, including their translated text.
 function getTranslatedResponse(key, fallbackText, replacements = {}) {
   let text = (currentLanguage === 'hi-IN' && HINDI_RESPONSES[key]) ? HINDI_RESPONSES[key] : fallbackText;
   for (const placeholder in replacements) {
     if (replacements.hasOwnProperty(placeholder)) {
       text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
     }
   }
   return text;
 }

 function loadVoices() {
     if (!speechSynthesis) return;
     let allSystemVoices = speechSynthesis.getVoices();

     if (allSystemVoices.length > 0) {
         voicesLoaded = true;
         const enInMaleCandidates = allSystemVoices.filter(v => v.lang.toLowerCase() === 'en-in' && (v.name.toLowerCase().includes('male') || !v.name.toLowerCase().includes('female')));
         voices['en-US'] = enInMaleCandidates.find(v => v.name.toLowerCase().includes('google')) || enInMaleCandidates[0];
         if (!voices['en-US']) {
             const enMaleCandidates = allSystemVoices.filter(v => v.lang.toLowerCase().startsWith('en-') && (v.name.toLowerCase().includes('male') || (!v.name.toLowerCase().includes('female') && (v.default || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('david')))));
             voices['en-US'] = enMaleCandidates.find(v => v.name.toLowerCase().includes('google')) || enMaleCandidates.find(v => v.name.toLowerCase().includes('david')) || enMaleCandidates[0];
         }
         if (!voices['en-US']) {
             const enCandidates = allSystemVoices.filter(v => v.lang.toLowerCase().startsWith('en-'));
             voices['en-US'] = enCandidates.find(v => v.default && !v.name.toLowerCase().includes('female')) || enCandidates.find(v => !v.name.toLowerCase().includes('female')) || enCandidates.find(v => v.default) || enCandidates[0];
         }
         const hiCandidates = allSystemVoices.filter(v => v.lang.toLowerCase() === 'hi-in');
         voices['hi-IN'] = hiCandidates.find(v => v.name.toLowerCase().includes('male')) || hiCandidates.find(v => !v.name.toLowerCase().includes('female')) || hiCandidates[0];
         // console.log("Voices loaded:", voices);
     }
 }

 function speak(text, emotion = 'neutral', langToSpeak = currentLanguage) {
   if (!speechSynthesis || !text) return;

   if (!voicesLoaded || !voices[langToSpeak]) {
     loadVoices(); // Attempt to load voices if not ready or specific voice missing
     if (!voices[langToSpeak]) {
       console.warn(`No specific voice for ${langToSpeak}. Browser default may be used or speech might fail.`);
     }
   }
   const voiceToUse = voices[langToSpeak];

   speechSynthesis.cancel(); // Cancel any ongoing speech
   const utterance = new SpeechSynthesisUtterance(text);
   utterance.lang = langToSpeak;
   if (voiceToUse) {
       utterance.voice = voiceToUse;
   }

   let rate = (langToSpeak === 'hi-IN') ? 0.95 : 1.0;
   utterance.pitch = 1.0; utterance.rate = rate; utterance.volume = 0.9;
   switch (emotion) {
     case 'greeting': case 'positive': utterance.pitch = 1.1; utterance.rate = (langToSpeak === 'hi-IN' ? 0.95 : 1.05); break;
     case 'error': utterance.pitch = 0.9; utterance.rate = (langToSpeak === 'hi-IN' ? 0.9 : 0.95); break;
     case 'closing': utterance.rate = (langToSpeak === 'hi-IN' ? 0.85 : 0.9); break;
   }
   try { speechSynthesis.speak(utterance); } catch (error) { console.error("Error speaking:", error); }
 }

 function addMessageToChat(text, sender, isError = false, isHTML = false) {
   if (!chatBody) return;
   const messageDiv = document.createElement('div');
   messageDiv.classList.add('chat-message', sender.toLowerCase());
   if (isError) messageDiv.classList.add('error');
   const bubbleDiv = document.createElement('div');
   bubbleDiv.classList.add('message-bubble');
   if (isHTML) {
       const tempDiv = document.createElement('div'); tempDiv.innerHTML = text;
       // Basic script tag removal. NOTE: This is not a full-fledged sanitizer.
       Array.from(tempDiv.getElementsByTagName('script')).forEach(s => s.remove());
       bubbleDiv.innerHTML = tempDiv.innerHTML;
   } else {
       bubbleDiv.textContent = text;
   }
   messageDiv.appendChild(bubbleDiv);
   const currentTime = Date.now(); let delay = 0;
   if (sender === 'ai' && chatBody.children.length > 0 && currentTime - lastMessageTimestamp < MESSAGE_ANIMATION_DELAY_STEP * 5) {
       delay = (Array.from(chatBody.querySelectorAll('.chat-message.ai')).slice(-5).length % 4) * MESSAGE_ANIMATION_DELAY_STEP;
   }
   messageDiv.style.animationDelay = `${delay}ms`;
   lastMessageTimestamp = currentTime;
   chatBody.appendChild(messageDiv);
   setTimeout(() => { if (chatBody.scrollHeight > chatBody.clientHeight) chatBody.scrollTop = chatBody.scrollHeight; }, delay + 100);
 }

 // --- Global Functions for HTML onclick ---
 window.handleStartButtonClick = function() {
   if (shivayStartButton) triggerClickAnimation(shivayStartButton);
   window.playSoundAndOpenChat();
 };
  window.playSoundAndOpenChat = function(initialMessageFromHero = null) {
   if (chatOpenSoundElement && typeof chatOpenSoundElement.play === 'function') {
     chatOpenSoundElement.currentTime = 0;
     chatOpenSoundElement.play()
       .then(() => window.openChat(initialMessageFromHero))
       .catch(error => { console.warn("Chat open sound error:", error); window.openChat(initialMessageFromHero); });
   } else {
     window.openChat(initialMessageFromHero);
   }
 };

 window.openChat = function(initialMessageFromHero = null) {
   if (!shivayChatBox || !shivayStartButton) return;
   if (productsData.length === 0) extractProductData(); // Ensure products are extracted for potential scroll actions

   try {
     const btnRect = shivayStartButton.getBoundingClientRect();
     const btnStyle = window.getComputedStyle(shivayStartButton);
     let btnDistBottom = parseFloat(btnStyle.bottom);
     if (isNaN(btnDistBottom) && btnStyle.top && btnStyle.top !== 'auto') {
          btnDistBottom = window.innerHeight - btnRect.bottom; // Distance from button bottom to viewport bottom
     } else if (isNaN(btnDistBottom)) {
         btnDistBottom = 20; // Fallback if 'bottom' is not set numerically
     }
     // Position chatbox bottom: button's distance from viewport bottom + button height + desired gap
     if (!isNaN(btnDistBottom) && btnRect.height > 0) {
       shivayChatBox.style.bottom = (btnDistBottom + btnRect.height + DESIRED_GAP_FROM_BUTTON) + 'px';
     } else {
       // Fallback positioning if button dimensions/style are tricky
       shivayChatBox.style.bottom = (20 + 50 + DESIRED_GAP_FROM_BUTTON) + 'px'; // Assuming button height ~50px
     }
   } catch (e) { console.error("Error positioning chatbox:", e); }

   shivayChatBox.classList.add('active');
   if (initialMessageFromHero) {
       addMessageToChat(initialMessageFromHero, 'user');
       sendUserMessageToAI(initialMessageFromHero, true); // Send initial message to backend
       initialWelcomeSpoken = true; // Mark as spoken because interaction started
   } else if (!initialWelcomeSpoken) {
     // If no initial message from hero, send an empty message to trigger the default greeting from AI
     sendUserMessageToAI("");
     initialWelcomeSpoken = true;
   }
   if (chatInput) chatInput.focus();
 };

 window.closeChat = function() {
   if (shivayChatBox) {
     const closeIcon = shivayChatBox.querySelector('.chatbox-icons .close-icon');
     if(closeIcon) triggerClickAnimation(closeIcon);
     shivayChatBox.classList.remove('active');
     if (chatRecognition && isChatListening) {
       try {
           if (recognitionStopTimer) clearTimeout(recognitionStopTimer);
           recognitionStopTimer = null;
           chatRecognition.stop();
       } catch (e) { console.warn("Error stopping recognition on close:", e); }
     }
     if (speechSynthesis) speechSynthesis.cancel();
     initialWelcomeSpoken = false; // Allow welcome message on next open
   }
 };

 window.openSettings = function() {
   const settingsIcon = shivayChatBox ? shivayChatBox.querySelector('.chatbox-icons .settings-icon') : null;
   if (settingsIcon) triggerClickAnimation(settingsIcon);
   // Send a specific command to the AI backend to get the settings response
   sendUserMessageToAI("show settings");
 };

 window.toggleChatMic = function(micElement) {
   if (micElement) triggerClickAnimation(micElement);

   if (micToggleSoundElement && typeof micToggleSoundElement.play === 'function') {
       micToggleSoundElement.currentTime = 0;
       micToggleSoundElement.play().catch(err => console.warn("Mic toggle sound play error:", err));
   }

   if (!chatRecognition) {
     const noMicMsg = getTranslatedResponse('MIC_NOT_SUPPORTED', "Speech Recognition not supported.");
     addMessageToChat(noMicMsg, "ai", true); speak(stripHtml(noMicMsg), 'error', currentLanguage);
     [headerMicIcon, inputAreaMicIcon].forEach(icon => icon?.classList.add('disabled-mic'));
     return;
   }

   if (!shivayChatBox || !shivayChatBox.classList.contains('active')) {
       window.playSoundAndOpenChat(); // Open chat first
       setTimeout(() => { // Then attempt to start mic after a delay
           if (!isChatListening) {
               try {
                   if (recognitionStopTimer) clearTimeout(recognitionStopTimer);
                   chatRecognition.lang = currentLanguage;
                   chatRecognition.continuous = false; // Set to false, we stop after first result
                   chatRecognition.interimResults = false;
                   chatRecognition.start(); // The 'onstart' event will handle the timeout logic
               } catch (e) { handleMicStartError(e); }
           }
       }, 750); // Delay to allow chatbox to open
       return;
   }

   if (isChatListening) { // If listening, stop it
       if (recognitionStopTimer) {
           clearTimeout(recognitionStopTimer);
           recognitionStopTimer = null;
       }
       try {
           chatRecognition.stop(); // This will trigger 'onend' which calls resetMicUI
       } catch(e) {
           console.error("Error stopping chat recognition:", e);
           resetMicUI(); // Fallback
       }
   } else { // If not listening, start it
       try {
           if (recognitionStopTimer) clearTimeout(recognitionStopTimer); // Clear any old timer
           chatRecognition.lang = currentLanguage;
           chatRecognition.continuous = false; // Listen for a single utterance
           chatRecognition.interimResults = false; // We only want final results
           chatRecognition.start(); // 'onstart' will now set isChatListening, UI, and the inactivity timer
       } catch (e) {
           handleMicStartError(e);
       }
   }
 };
  function handleMicStartError(e) {
   console.error("Error starting chat recognition:", e.name, e.message);
   let errorKey = 'MIC_START_ERROR';
   if (e.name === 'NotAllowedError' || e.name === 'SecurityError') errorKey = 'MIC_NOT_ALLOWED';
   else if (e.name === 'InvalidStateError') errorKey = 'MIC_INVALID_STATE';

   const errMsg = getTranslatedResponse(errorKey, "Could not start mic: " + e.message);
   addMessageToChat(errMsg, "ai", true); speak(stripHtml(errMsg), 'error', currentLanguage);
   resetMicUI();
 }

 function resetMicUI() {
     isChatListening = false;
     if (headerMicIcon) headerMicIcon.classList.remove('active-mic');
     if (inputAreaMicIcon) inputAreaMicIcon.classList.remove('active-mic');
     // console.log("Mic UI reset, isChatListening set to false.");
 }

 // --- Product Interaction and Command Handling ---
 // The main logic for handling commands is now in the Flask backend.
 // This client-side function now handles scrolling based on AI's 'action' response.
 function scrollToElement(elementIdOrSelector) {
   const targetElement = typeof elementIdOrSelector === 'string'
       ? (document.querySelector(elementIdOrSelector) || document.getElementById(elementIdOrSelector))
       : elementIdOrSelector;

   if (targetElement && typeof targetElement.scrollIntoView === 'function') {
     targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
     const highlightColor = getComputedStyle(document.documentElement).getPropertyValue('--ai-primary-color').trim() || '#007bff';

     // Ensure existing transition is not overridden abruptly, or apply a new one
     const originalTransition = targetElement.style.transition;
     targetElement.style.transition = 'outline 0.1s ease-in-out, box-shadow 0.1s ease-in-out';

     targetElement.style.outline = `3px solid ${highlightColor}`;
     targetElement.style.boxShadow = `0 0 10px ${highlightColor}`;

     setTimeout(() => {
         if (targetElement) {
             targetElement.style.outline = '';
             targetElement.style.boxShadow = '';
             targetElement.style.transition = originalTransition; // Restore original transition
         }
     }, 2500);
     return true;
   }
   return false;
 }

 // NEW: Function to send message to AI backend and process response
 async function sendUserMessageToAI(message, isExternalCall = false) {
   if (!message && !isExternalCall) return; // Allow empty message for initial greeting

   try {
     const response = await fetch('/api/chat', { // Your Flask API endpoint
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message: message, language: currentLanguage }) // Send current language
     });

     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }

     const data = await response.json();
     const { response_text, response_html, ai_response_type, action, new_language } = data;

     // Update frontend language based on AI's decision
     if (new_language && new_language !== currentLanguage) {
       currentLanguage = new_language;
       // Optional: Persist language choice in localStorage
       // localStorage.setItem('shivay_ai_lang', currentLanguage);
       if (chatRecognition) chatRecognition.lang = currentLanguage;
       console.log("AI switched language to:", currentLanguage);
     }

     let speakEmotion = 'neutral';
     if (ai_response_type.includes('greeting')) speakEmotion = 'greeting';
     else if (ai_response_type.includes('positive') || ai_response_type.includes('confirm') || ai_response_type.includes('found') || ai_response_type.includes('helpful')) speakEmotion = 'positive';
     else if (ai_response_type.includes('error') || ai_response_type.includes('apology') || ai_response_type.includes('confused')) speakEmotion = 'error';
     else if (ai_response_type.includes('closing') || ai_response_type.includes('redirecting')) speakEmotion = 'closing'; // Closing emotion for redirect too

     addMessageToChat(response_html, 'ai', false, true); // Always treat as HTML to render emojis/buttons

     // Speak the plain text
     speak(stripHtml(response_text), speakEmotion, currentLanguage);

     // Handle actions from the AI
     if (action) {
       const delayForAction = action.delay || Math.min(stripHtml(response_text).length * 70, 3000); // Delay based on text length

       setTimeout(() => {
         if (action.type === 'redirect' && action.url) {
           window.location.href = action.url;
         } else if (action.type === 'open_new_tab' && action.url) {
           window.open(action.url, '_blank');
         } else if (action.type === 'close_chat') {
           window.closeChat();
         } else if (action.type === 'scroll' && action.selector) {
             // Ensure productsData is available if we need to scroll to an element based on data-product-id
             if (productsData.length === 0) extractProductData();
             const targetElement = document.querySelector(action.selector);
             if (targetElement) {
                 scrollToElement(targetElement); // Existing scrollToElement function
             } else {
                 console.warn("Scroll target not found:", action.selector);
             }
         }
       }, delayForAction);
     }

   } catch (error) {
     console.error('Error communicating with AI backend:', error);
     const errorMsg = getTranslatedResponse('SPEECH_RECOGNITION_ERROR_GENERAL', "Sorry, I'm having trouble connecting right now. Please try again later.");
     addMessageToChat(errorMsg, 'ai', true);
     speak(stripHtml(errorMsg), 'error', currentLanguage);
   }
 }


 // --- Global function for external search integration ---
 // This is called from the frontend when user searches via the main search bar, etc.
 window.processSearchWithShivayAI = function(query) {
   if (!query || typeof query !== 'string' || query.trim() === '') return;
   if (!shivayChatBox || !shivayChatBox.classList.contains('active')) {
       window.playSoundAndOpenChat(query.trim()); // Open chat and send initial query
   } else {
       addMessageToChat(query.trim(), 'user');
       sendUserMessageToAI(query.trim()); // Just send the query if chat is already open
   }
 };

 // === Event Listeners for Chatbox UI ===
 if (sendBtn && chatInput) {
   const sendMessageFromChatInput = () => {
     triggerClickAnimation(sendBtn);
     const messageText = chatInput.value.trim();
     if (messageText) {
       if (messageSendSoundElement && typeof messageSendSoundElement.play === 'function') {
           messageSendSoundElement.currentTime = 0;
           messageSendSoundElement.play().catch(err => console.warn("Message send sound play error:", err));
       }
       addMessageToChat(messageText, 'user');
       sendUserMessageToAI(messageText); // Call the new async function
       chatInput.value = ''; chatInput.focus();
     }
   };
   sendBtn.addEventListener('click', sendMessageFromChatInput);
   // FIXED: Use 'keydown' for better reliability with the 'Enter' key.
   chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessageFromChatInput(); }});
 }

 // --- Init Chatbox Speech Recognition handlers ---
 if (chatRecognition) {
   // .continuous, .lang, .interimResults are set in toggleChatMic or handleCommand
   chatRecognition.maxAlternatives = 1;

   chatRecognition.onstart = () => {
     isChatListening = true;
     if (inputAreaMicIcon) inputAreaMicIcon.classList.add('active-mic');
     if (headerMicIcon) headerMicIcon.classList.add('active-mic');
     console.log("Speech recognition started. Language:", chatRecognition.lang);

     // Clear any previous timer.
     if (recognitionStopTimer) clearTimeout(recognitionStopTimer);

     // Set a new timer to automatically stop listening if no speech is detected.
     recognitionStopTimer = setTimeout(() => {
         if (isChatListening) {
             console.log(`Mic auto-stopping after ${MIC_LISTEN_DURATION / 1000}s of inactivity.`);
             try {
                 chatRecognition.stop();
             } catch (e) {
                 console.warn("Error during auto-stop of recognition:", e);
                 resetMicUI(); // Force UI reset
             }
         }
     }, MIC_LISTEN_DURATION);
   };

   chatRecognition.onend = () => {
     console.log("Speech recognition ended.");
     // Always clear timer and reset UI when recognition stops for any reason.
     if (recognitionStopTimer) {
         clearTimeout(recognitionStopTimer);
         recognitionStopTimer = null;
     }
     resetMicUI();
   };

   chatRecognition.onresult = (event) => {
     // Speech was detected, so clear the inactivity timer.
     if (recognitionStopTimer) {
         clearTimeout(recognitionStopTimer);
         recognitionStopTimer = null;
     }

     let finalTranscript = '';
     for (let i = event.resultIndex; i < event.results.length; ++i) {
         if (event.results[i].isFinal) {
             finalTranscript += event.results[i][0].transcript;
         }
     }
     finalTranscript = finalTranscript.trim();
     console.log("Speech result:", finalTranscript);

     if (finalTranscript) {
         addMessageToChat(finalTranscript, 'user');
         sendUserMessageToAI(finalTranscript); // Call the new async function
     }

     // Manually stop recognition after a result to have single-utterance behavior.
     if (isChatListening) {
          try { chatRecognition.stop(); } // This will trigger onend
          catch (e) { console.warn("Error stopping recognition post-result:", e); resetMicUI(); }
     }
   };
  chatRecognition.onerror = (event) => {
     console.error("Speech recognition error:", event.error, event.message);
     // An error occurred, clear the inactivity timer.
     if (recognitionStopTimer) {
         clearTimeout(recognitionStopTimer);
         recognitionStopTimer = null;
     }
     if  (event.error === 'aborted') { // Usually user/script initiated stop.
       console.log("Speech recognition aborted.");
       // 'onend' will handle UI reset.
       return;
     }
     let errorKey = 'SPEECH_RECOGNITION_ERROR_GENERAL';
     switch (event.error) {
         case 'no-speech': errorKey = 'MIC_NO_SPEECH'; break;
         case 'audio-capture': errorKey = 'MIC_AUDIO_CAPTURE_ERROR'; break;
         case 'not-allowed': case 'security': errorKey = 'MIC_NOT_ALLOWED'; break;
         case 'network': errorKey = 'MIC_NETWORK_ERROR'; break;
         case 'service-not-allowed': case 'bad-grammar': case 'language-not-supported':
             errorKey = 'MIC_START_ERROR'; break;
     }
    const errMsg = getTranslatedResponse(errorKey, "Speech Error: " + event.error + (event.message ? " - " + event.message : ""));
     addMessageToChat(errMsg, "ai", true);
     speak(stripHtml(errMsg), 'error', currentLanguage);
    // Ensure recognition is stopped and UI is reset.
     if (isChatListening) {
         try { chatRecognition.stop(); } // Will trigger onend
         catch (e) { console.warn("Error stopping recognition after error:", e); resetMicUI(); }
     } else {
         resetMicUI();
     }
   };
 } else { // chatRecognition API not supported
   [headerMicIcon, inputAreaMicIcon].forEach(icon => {
       if(icon) {
           icon.classList.add('disabled-mic');
           icon.title = getTranslatedResponse('MIC_NOT_SUPPORTED', "Speech recognition not supported in your browser.");
       }
   });
 }
 // --- General Event Listeners & Initialization ---
 if (shivayStartButton) {
   shivayStartButton.addEventListener('click', window.handleStartButtonClick);
 }
 document.addEventListener('keydown', (event) => {
   if (event.key === "Escape" && shivayChatBox && shivayChatBox.classList.contains('active')) {
     window.closeChat();
   }
 });
 // Initial voice loading for Speech Synthesis
 if (speechSynthesis) {
     if (speechSynthesis.onvoiceschanged !== undefined) {
         speechSynthesis.onvoiceschanged = loadVoices;
     }
     loadVoices(); // Attempt to load voices immediately
 } else {
     console.warn("Speech Synthesis API not supported.");
 }
  extractProductData(); // Extract product data on load
 console.log("Shivay AI Chatbox script initialized (v2.7).");

 // Add event listener for dynamic buttons created by AI responses
 chatBody.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('chat-action-btn')) {
        const actionType = target.dataset.actionType;
        const actionTarget = target.dataset.actionTarget;

        if (actionType === 'redirect' && actionTarget) {
            window.location.href = actionTarget;
        } else if (actionType === 'open_new_tab' && actionTarget) {
            window.open(actionTarget, '_blank');
        }
        // You can add more action types here if needed
    }
 });

}); // END OF DOMContentLoaded
