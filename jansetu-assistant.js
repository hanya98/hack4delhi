// 1. INITIALIZE SPEECH ENGINE
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-IN';
recognition.interimResults = false;

const voiceBtn = document.getElementById('voiceBtn');
const voiceOverlay = document.getElementById('voice-overlay');

// 2. START LISTENING
function startListening() {
    try {
        recognition.start();
        voiceBtn.classList.add('listening');
        console.log("Assistant listening...");
    } catch (e) {
        console.log("Recognition already started or blocked.");
    }
}

recognition.onresult = (event) => {
    voiceBtn.classList.remove('listening');
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Command received: " + command);
    handleVoiceCommand(command);
};

recognition.onerror = () => {
    voiceBtn.classList.remove('listening');
    console.error("Speech recognition error.");
};

// 3. COMMAND LOGIC (Context-Aware)
function handleVoiceCommand(cmd) {
    let targetId = null;
    let instruction = "";

    // Check if we are on the Policymaker Dashboard
    const isPolicymaker = document.getElementById('btn-overview') !== null;

    if (isPolicymaker) {
        // --- POLICYMAKER DASHBOARD COMMANDS ---
        if (cmd.includes("overview") || cmd.includes("main")) {
            showPage('overview');
            targetId = "btn-overview";
            instruction = "Viewing the high-level analytics overview.";
        } 
        else if (cmd.includes("complaint") || cmd.includes("grievance") || cmd.includes("insight")) {
            showPage('grievances'); 
            targetId = "btn-grievances";
            instruction = "Analyze complaint categories and ward-wise issues here.";
        }
        else if (cmd.includes("impact") || cmd.includes("performance") || cmd.includes("scheme")) {
            showPage('impact');
            targetId = "btn-impact";
            instruction = "Review how policies are performing across districts.";
        }
        else if (cmd.includes("report") || cmd.includes("generate") || cmd.includes("pdf")) {
            showPage('reports');
            targetId = "btn-reports";
            instruction = "Create and download custom administrative reports.";
        }
        else if (cmd.includes("ai") || cmd.includes("analyze") || cmd.includes("sparkle")) {
            showPage('impact');
            targetId = "ai-card";
            instruction = "I'm highlighting the AI Policy Insight tool.";
        }
    } 
    else {
        // --- USER DASHBOARD COMMANDS ---
        if (cmd.includes("bus") || cmd.includes("travel") || cmd.includes("devi")) {
            targetId = "tileBus";
            instruction = "Check DEVI Bus routes and timings here.";
        } 
        else if (cmd.includes("food") || cmd.includes("hungry") || cmd.includes("canteen") || cmd.includes("meal")) {
            targetId = "tileCanteen";
            instruction = "Find Atal Canteens for affordable meals here.";
        }
        else if (cmd.includes("community") || cmd.includes("library") || cmd.includes("nearby") || cmd.includes("event")) {
            targetId = "tileCommunity";
            instruction = "Explore local events, libraries, and community discussions.";
        }
        else if (cmd.includes("complaint") || cmd.includes("problem") || cmd.includes("report") || cmd.includes("raise")) {
            targetId = "tileNew";
            instruction = "Click here to report an issue or raise a complaint.";
        }
        else if (cmd.includes("scheme") || cmd.includes("benefit") || cmd.includes("awareness")) {
            speak("Opening the Awareness Hub for government schemes.");
            window.location.href = "user.html#awareness";
            return; 
        }
        else if (cmd.includes("update") || cmd.includes("news") || cmd.includes("alert")) {
            targetId = "alerts";
            instruction = "View the latest district notifications and alerts.";
        }
    }

    // --- GLOBAL COMMANDS ---
    if (cmd.includes("dark mode") || cmd.includes("theme") || cmd.includes("night")) {
        toggleDarkMode();
        instruction = "Toggled dashboard theme.";
        speak(instruction);
        return;
    }

    // EXECUTE VISUAL HIGHLIGHT
    if (targetId && document.getElementById(targetId)) {
        showSpotlight(targetId, instruction);
        speak(instruction);
    } else {
        speak("I heard " + cmd + ", but I couldn't find that section on this page.");
    }
}

// 4. VISUAL SPOTLIGHT EFFECT
function showSpotlight(id, text) {
    const el = document.getElementById(id);
    const rect = el.getBoundingClientRect();
    
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;

    voiceOverlay.style.display = 'block';
    voiceOverlay.innerHTML = `
        <div class="highlight-ring" style="
            top: ${top - 10}px; 
            left: ${left - 10}px; 
            width: ${rect.width + 20}px; 
            height: ${rect.height + 20}px;">
        </div>
        <div class="voice-indicator" style="
            top: ${top + rect.height + 20}px; 
            left: ${left}px;">
            👆 ${text}
        </div>
    `;

    // Auto-hide after 6 seconds
    setTimeout(() => {
        voiceOverlay.style.display = 'none';
    }, 6000);
}

// 5. TEXT TO SPEECH
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(msg);
}

// Hide overlay if user scrolls
window.onscroll = () => { 
    if(voiceOverlay) voiceOverlay.style.display = 'none'; 
};