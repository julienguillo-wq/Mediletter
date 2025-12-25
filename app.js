// ==========================================
// MediLetter - Main Application Logic
// ==========================================

// State
let isRecording = false;
let recognition = null;
let currentTheme = 'dark';

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initSpeechRecognition();
    setupTextareaAutoResize();
});

function loadSettings() {
    // Load API key
    const savedApiKey = localStorage.getItem('mediletter_apikey');
    if (savedApiKey) {
        document.getElementById('apiKey').value = savedApiKey;
    }
    
    // Load doctor name
    const savedDoctorName = localStorage.getItem('mediletter_doctor');
    if (savedDoctorName) {
        document.getElementById('doctorName').value = savedDoctorName;
    }
    
    // Load theme
    const savedTheme = localStorage.getItem('mediletter_theme') || 'dark';
    setTheme(savedTheme);
}

function setupTextareaAutoResize() {
    const textarea = document.getElementById('inputText');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(160, this.scrollHeight) + 'px';
    });
}

// ==========================================
// Speech Recognition
// ==========================================

function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'fr-FR';
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            const textarea = document.getElementById('inputText');
            if (finalTranscript) {
                textarea.value += finalTranscript + ' ';
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopRecording();
            if (event.error === 'not-allowed') {
                alert('Veuillez autoriser l\'accès au microphone pour utiliser la dictée vocale.');
            }
        };
        
        recognition.onend = () => {
            if (isRecording) {
                recognition.start(); // Restart if still recording
            }
        };
    } else {
        // Hide mic button if not supported
        document.getElementById('micBtn').style.display = 'none';
        document.getElementById('micHint').textContent = 'Dictée non supportée';
    }
}

function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    if (!recognition) return;
    
    isRecording = true;
    recognition.start();
    
    const micBtn = document.getElementById('micBtn');
    const micHint = document.getElementById('micHint');
    
    micBtn.classList.add('recording');
    micHint.textContent = 'Cliquez pour arrêter';
}

function stopRecording() {
    if (!recognition) return;
    
    isRecording = false;
    recognition.stop();
    
    const micBtn = document.getElementById('micBtn');
    const micHint = document.getElementById('micHint');
    
    micBtn.classList.remove('recording');
    micHint.textContent = 'Cliquez pour dicter';
}

// ==========================================
// Quick Tags
// ==========================================

function addTag(text) {
    const textarea = document.getElementById('inputText');
    const currentValue = textarea.value.trim();
    
    if (currentValue) {
        textarea.value = currentValue + ', ' + text;
    } else {
        textarea.value = text;
    }
    
    textarea.focus();
}

// ==========================================
// Generate Letter
// ==========================================

async function generateLetter() {
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
        alert('Veuillez entrer les informations du patient.');
        return;
    }
    
    const apiKey = localStorage.getItem('mediletter_apikey');
    if (!apiKey) {
        openSettings();
        alert('Veuillez configurer votre clé API Claude dans les paramètres.');
        return;
    }
    
    const doctorName = localStorage.getItem('mediletter_doctor') || 'Dre Giulia Scattu';
    
    // Show loading state
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                system: SYSTEM_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: `Voici les informations du patient. Génère la section "Discussion et propositions" de la lettre médicale pour chaque problème identifié, en utilisant exactement le style et les formulations demandées.

Informations brutes :
${inputText}

Médecin assistant(e) : ${doctorName}

Génère uniquement le contenu médical structuré (pas d'en-tête de lettre, pas de formules de politesse). Pour chaque problème, utilise la structure : titre du problème en gras, puis Contexte, Investigations, Discussion, Propositions.`
                    }
                ]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        const generatedText = data.content[0].text;
        
        displayOutput(generatedText);
        
    } catch (error) {
        console.error('Error generating letter:', error);
        alert(`Erreur lors de la génération : ${error.message}`);
    } finally {
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
    }
}

function displayOutput(text) {
    const emptyState = document.getElementById('emptyState');
    const outputContent = document.getElementById('outputContent');
    
    emptyState.style.display = 'none';
    outputContent.classList.add('visible');
    
    // Format the text with some basic styling
    let formattedText = text
        // Bold titles
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Section headers
        .replace(/^(Contexte|Investigations|Discussion|Discussion\/proposition|Propositions|Attitude|Discussion et attitude)\s*:?\s*$/gm, '<h3>$1</h3>')
        // Line breaks
        .replace(/\n/g, '<br>');
    
    outputContent.innerHTML = formattedText;
    
    // Scroll to output on mobile
    if (window.innerWidth < 1024) {
        document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// Copy & Clear
// ==========================================

function copyLetter() {
    const outputContent = document.getElementById('outputContent');
    
    if (!outputContent.classList.contains('visible')) {
        return;
    }
    
    // Get text content without HTML
    const text = outputContent.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast();
    });
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function clearOutput() {
    const emptyState = document.getElementById('emptyState');
    const outputContent = document.getElementById('outputContent');
    
    outputContent.innerHTML = '';
    outputContent.classList.remove('visible');
    emptyState.style.display = 'flex';
}

// ==========================================
// Settings
// ==========================================

function openSettings() {
    document.getElementById('settingsModal').classList.add('show');
}

function closeSettings(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('settingsModal').classList.remove('show');
}

function toggleApiKeyVisibility() {
    const input = document.getElementById('apiKey');
    const icon = document.getElementById('eyeIcon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
        input.type = 'password';
        icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
}

function saveSettings() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const doctorName = document.getElementById('doctorName').value.trim();
    
    if (apiKey) {
        localStorage.setItem('mediletter_apikey', apiKey);
    }
    
    if (doctorName) {
        localStorage.setItem('mediletter_doctor', doctorName);
    }
    
    closeSettings();
    showToast();
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mediletter_theme', theme);
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

// ==========================================
// PWA Service Worker
// ==========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('ServiceWorker registration failed:', err);
        });
    });
}
