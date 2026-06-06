// ─── MANONG AI CHATHEAD LOGIC ─────────────────────────────────────────────
const chatContainer = document.getElementById('manong-chat-container');
const chathead = document.getElementById('manong-chathead');
const chatWindow = document.getElementById('manong-chat-window');
const closeChatBtn = document.getElementById('manong-close-btn');
const chatInput = document.getElementById('manong-chat-input');
const sendBtn = document.getElementById('manong-send-btn');
const messagesArea = document.getElementById('manong-chat-messages');

let isDraggingChathead = false;
let hasMoved = false;
let startX, startY, initialLeft, initialTop;

// Drag Start
function onDragStart(e) {
  const touch = e.type.includes('touch') ? e.touches[0] : e;
  startX = touch.clientX;
  startY = touch.clientY;
  
  const rect = chatContainer.getBoundingClientRect();
  initialLeft = rect.left;
  initialTop = rect.top;
  
  // CRITICAL: Kill the transition so the chathead instantly sticks to your finger
  chatContainer.style.transition = 'none'; 
  
  isDraggingChathead = true;
  hasMoved = false;

  chathead.classList.add('is-dragging'); 

  document.addEventListener('mousemove', onDragMove, { passive: false });
  document.addEventListener('touchmove', onDragMove, { passive: false });
  document.addEventListener('mouseup', onDragEnd);
  document.addEventListener('touchend', onDragEnd);
}

// Drag Move (WITH SCREEN & BOTTOM SHEET BOUNDARY FIX)
function onDragMove(e) {
  if (!isDraggingChathead) return;
  const touch = e.type.includes('touch') ? e.touches[0] : e;
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
    hasMoved = true;
  }

  if (hasMoved) {
    e.preventDefault(); 
    
    // Close the chat window if it's open while dragging
    if (!chatWindow.classList.contains('hidden')) {
      chatWindow.classList.add('hidden');
    }
    
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // Boundary Math
    const maxLeft = window.innerWidth - 52 - 16; 
    const sheetTop = document.getElementById('bottom-sheet').getBoundingClientRect().top;
    const maxTop = sheetTop - 52 - 16;

    // Lock coordinates inside screen and above sheet
    newLeft = Math.max(16, Math.min(maxLeft, newLeft));
    newTop = Math.max(16, Math.min(maxTop, newTop));

    chatContainer.style.right = 'auto'; 
    chatContainer.style.bottom = 'auto'; 
    chatContainer.style.left = `${newLeft}px`;
    chatContainer.style.top = `${newTop}px`;

    // CRITICAL: Update the relative offset based on where the user dragged it!
    // This ensures that when the sheet moves next, Manong remembers this exact distance.
    chatRelativeOffset = newTop - sheetTop;
  }
}

// Click to Open (WITH 4-QUADRANT ALIGNMENT FIX)
chathead.addEventListener('click', () => {
  if (!hasMoved) {
    const rect = chatContainer.getBoundingClientRect();
    const screenMidX = window.innerWidth / 2;
    const screenMidY = window.innerHeight / 2;
    
    // 1. Reset absolute positioning properties
    chatWindow.style.top = 'auto';
    chatWindow.style.bottom = 'auto';
    chatWindow.style.left = 'auto';
    chatWindow.style.right = 'auto';

    // 2. Vertical Alignment (Top Half vs Bottom Half)
    if (rect.top < screenMidY) {
      chatWindow.style.top = '64px'; // Sprout downwards
      chatWindow.style.transformOrigin = rect.left < screenMidX ? 'top left' : 'top right';
    } else {
      chatWindow.style.bottom = '64px'; // Sprout upwards
      chatWindow.style.transformOrigin = rect.left < screenMidX ? 'bottom left' : 'bottom right';
    }

    // 3. Horizontal Alignment (Left Half vs Right Half)
    if (rect.left < screenMidX) {
      chatWindow.style.left = '0'; // Align left edges
    } else {
      chatWindow.style.right = '0'; // Align right edges
    }

    // Toggle visibility
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatInput.focus();
    }
  }
});

// Drag End
function onDragEnd() {
  isDraggingChathead = false;
  chathead.classList.remove('is-dragging');

  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('touchmove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
  document.removeEventListener('touchend', onDragEnd);

  // Snap to nearest horizontal edge (left or right)
  if (hasMoved) {
    const rect = chatContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const snapToRight = centerX > window.innerWidth / 2;

    const snapEdge = 16; // margin from screen edge
    const sheetTop = document.getElementById('bottom-sheet').getBoundingClientRect().top;
    const currentTop = rect.top;
    const clampedTop = Math.max(16, Math.min(sheetTop - rect.height - 16, currentTop));

    chatContainer.style.transition = 'left 0.25s cubic-bezier(0.25,0.46,0.45,0.94), top 0.25s cubic-bezier(0.25,0.46,0.45,0.94)';
    chatContainer.style.bottom = 'auto';
    chatContainer.style.right  = 'auto';

    if (snapToRight) {
      chatContainer.style.left = `${window.innerWidth - rect.width - snapEdge}px`;
    } else {
      chatContainer.style.left = `${snapEdge}px`;
    }
    chatContainer.style.top = `${clampedTop}px`;

    chatRelativeOffset = clampedTop - sheetTop;

    // Clear transition after it finishes so dragging stays instant
    setTimeout(() => { chatContainer.style.transition = 'none'; }, 280);
  }
}

chathead.addEventListener('mousedown', onDragStart);
chathead.addEventListener('touchstart', onDragStart, { passive: false });

// ─── OPENROUTER API CHAT LOGIC ────────────────────────────────────────

const API_KEY = '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'; // Replace with OpenRouter Key
let chatHistory = [];

function appendMessage(text, senderType) {
  const bubble = document.createElement('div');
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  bubble.className = `chat-bubble ${senderType}-bubble`;
  messagesArea.appendChild(bubble);
  messagesArea.scrollTop = messagesArea.scrollHeight; 
  return bubble;
}

async function handleSendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // 1. Display User Message
  appendMessage(text, 'user');
  chatInput.value = '';

  // 2. Save User Message to History (Updated for OpenRouter/OpenAI format)
  chatHistory.push({
    role: "user",
    content: text
  });

  // 3. Show Loading State
  const loadingBubble = appendMessage("Manong is typing...", 'ai loading-bubble');

  try {
    // 4. Fetch response from OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        // Optional but recommended by OpenRouter for routing
        'HTTP-Referer': window.location.href, 
        'X-Title': 'Jee.ply Manong AI' 
      },
      body: JSON.stringify({
        model: "gpt-oss-120b", // You can change this to any OpenRouter model
        messages: [
          {
            role: "system",
            content:
            `
            You are Manong, a helpful local transit assistant for Cebu and the Central Visayas.

            # PERSONA & TONE
            - Speak in a friendly mix of English and conversational Bisaya (e.g., "Icopy boss", "Trapik gamay").
            - Be concise, practical, and accurate. Keep responses to 1–3 short sentences.
            - Give the answer first, then any optional note.
            - If the question is unrelated to the commute, reply with introducing why the question is unrelated followed by "I'm here to help with transportation routes and fares in Cebu. Ask me about your trip!"
            - Avoid action asterisks (like *smiles*), markdown bolding (**), and unnecessary filler.

            # ROUTING RULES (CRITICAL)
            1. CURRENT ROUTE OVERRIDE: If data exists under "CURRENT ROUTE RESULTS", you MUST use those exact paths, fares, and travel times. Do not invent outside options.
            2. MANUAL ROUTING: If "CURRENT ROUTE RESULTS" says none are calculated, DO NOT tell the user to click buttons. Manually trace the connection between the user's Origin and Destination using the "AVAILABLE ROUTES" JSON data. 
            3. SELECTION PRIORITY: Always recommend exactly ONE route. Prioritize the route with the least number of transfers, then shortest time, then lowest fare. Do not explain your selection criteria; just provide the route and the total.

            # MANUAL FARE CALCULATION
            Only if you are manually calculating a route (and the fare is not provided in CURRENT ROUTE RESULTS), strictly use this formula (ROUND UP TO THE NEAREST 25 CENTS):
            - Traditional Jeepneys: ₱13 base for the first 4 km, plus ₱1.80 per succeeding km.
            - Modern Jeepneys/Buses: ₱15 base for the first 4 km, plus ₱2.20 per succeeding km.
            - Discounts: Apply a strict 20% discount to the final total for Senior citizens, PWDs, and students (if mentioned).

            --- DYNAMIC APP CONTEXT ---

            [AVAILABLE ROUTES]
            ${JSON.stringify(JEEP_ROUTES)}

            [LANDMARKS/TERMINALS]
            ${JSON.stringify(LANDMARKS)}

            [USER'S CURRENT APP STATE]
            Origin: ${state.origin ? state.origin.name : "Not set"}
            Destination: ${state.dest ? state.dest.name : "Not set"}
            Detours: ${state.detours.filter(d => d !== null).map(d => d.name).join(', ') || "None"}

            [CURRENT ROUTE RESULTS]
            ${state.routes && state.routes.length > 0 
              ? state.routes.map((r, i) => {
                  const vehicleUsed = r.lineCode || r.name || (r.lines ? r.lines.join(' -> ') : 'Direct vehicle');
                  return `Option ${i + 1}: Take ${vehicleUsed} (${r.type === 'stitched' ? 'Transfer Route' : 'Direct Route'}) - Fare: ₱${r.fare}, Time: ${r.travelTime} mins`;
                }).join('\n') 
              : "No active map route calculated yet. Use the AVAILABLE ROUTES JSON data to find a solution for the user manually."}
            `
          },
          ...chatHistory // This dynamically appends the entire conversation history
        ]
      })
    });


    const data = await response.json();
    
    // 5. Remove Loading Bubble
    messagesArea.removeChild(loadingBubble);

    if (data.error) {
      appendMessage("Sorry boss, API error: " + data.error.message, 'ai');
      return;
    }

    // 6. Display AI Response (Updated for OpenRouter/OpenAI format)
    const aiResponseText = data.choices[0].message.content;
    appendMessage(aiResponseText, 'ai');

    // 7. Save AI Response to History so context is maintained (Updated format)
    chatHistory.push({
      role: "assistant", // OpenRouter uses 'assistant' instead of 'model'
      content: aiResponseText
    });

  } catch (error) {
    messagesArea.removeChild(loadingBubble);
    appendMessage("Sorry boss, network error. Check your internet connection.", 'ai');
    console.error(error);
  }
}

sendBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSendMessage();
});