document.addEventListener('DOMContentLoaded', () => {
    const bootSequence = document.getElementById('boot-sequence');
    const mainContent = document.getElementById('main-content');
    const terminalBody = document.getElementById('terminal-body');
    const userInput = document.getElementById('user-input');

    // Boot Sequence Lines
    const bootLines = [
        "Initializing kernel...",
        "Loading modules...",
        "Mounting file systems...",
        "Checking memory... OK",
        "Loading interface... OK",
        "Starting user session...",
        "Welcome, user."
    ];

    let lineIndex = 0;

    function runBootSequence() {
        if (lineIndex < bootLines.length) {
            const line = document.createElement('div');
            line.classList.add('boot-line');
            line.textContent = `[OK] ${bootLines[lineIndex]}`;
            bootSequence.appendChild(line);
            lineIndex++;
            setTimeout(runBootSequence, 300); // Delay between lines
        } else {
            setTimeout(() => {
                bootSequence.style.display = 'none';
                mainContent.classList.remove('hidden');

                // Start at the top
                terminalBody.scrollTop = 0;

                // Scroll settings
                const scrollSpeed = 20; // pixels per tick
                const scrollDelay = 5; // ms per tick
                const initialDelay = 1000; // ms to wait before starting scroll

                // Wait 1 second, then start auto-scroll
                setTimeout(() => {
                    const autoScroll = setInterval(() => {
                        // Check if reached bottom
                        if (Math.ceil(terminalBody.scrollTop + terminalBody.clientHeight) >= terminalBody.scrollHeight) {
                            clearInterval(autoScroll);
                            userInput.focus();
                        } else {
                            terminalBody.scrollTop += scrollSpeed;
                        }
                    }, scrollDelay);

                    // Stop scrolling on user interaction
                    const stopScroll = () => clearInterval(autoScroll);
                    terminalBody.addEventListener('wheel', stopScroll);
                    terminalBody.addEventListener('touchstart', stopScroll);
                    terminalBody.addEventListener('keydown', stopScroll);
                    terminalBody.addEventListener('mousedown', stopScroll);
                }, initialDelay);

            }, 800);
        }
    }

    // Start Boot
    runBootSequence();

    const availableCommands = [
        'help', 'clear', 'ls', 'ls -l', 'll',
        'cat bio.txt', 'cat work_experience.log', 'cat education.txt',
        './list_projects.sh', 'list_projects.sh', 'cat achievements.txt',
        'grep -r "skills" .', 'grep -r "Skills" .', 'grep -r skills', 'grep -r Skills', 'skills',
        './contact_me.sh', 'contact_me.sh',
        'about', 'whoami', 'experience', 'projects', 'achievements', 'education', 'contact'
    ];

    // Command Line Interaction
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = userInput.value.trim();
            handleCommand(command); // handleCommand handles case insensitivity for command matching, but we pass raw for now
            userInput.value = '';
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const currentInput = userInput.value.toLowerCase();
            if (currentInput) {
                const matches = availableCommands.filter(cmd => cmd.toLowerCase().startsWith(currentInput));
                if (matches.length === 1) {
                    userInput.value = matches[0];
                } else if (matches.length > 1) {
                    // Find common prefix
                    const commonPrefix = matches.reduce((a, b) => {
                        let i = 0;
                        while (i < a.length && i < b.length && a[i] === b[i]) i++;
                        return a.substring(0, i);
                    });
                    userInput.value = commonPrefix;
                }
            }
        }
    });

    const fileContents = {
        'bio.txt': `
> Anupam Bor Boruah
> Front-end / Full Stack Developer
> Innovative, task-driven professional with 2+ years of self-learning experience
> Software Developer with 1.5+ years of professional full-stack experience
> React | React Native | Node.js | Express | MongoDB | Django | Firebase
        `,
        'work_experience.log': `
[ Jun 2024 – Present ] Full Stack Developer @ Antares Tech
> Built and maintained RESTful APIs using Node.js and Express.js for B2B & B2C workflows.
> Designed optimized MongoDB schemas, implemented AI-driven test sync, automated AWS backups, Dockerized backend.
> Node.js, Express, MongoDB, Docker, AWS

[ Feb 2024 – Jun 2024 | Remote ] Web Development Intern @ DigioMed Health Tech Pvt. Ltd.
> Developed cross-platform healthcare app with Django backend and Firebase integration.
> React Native, TypeScript, Django, Firebase

[ Dec 2022 – Jan 2023 | Tezpur University ] Frontend Development Intern @ Nutrify
> Designed UI for calorie-counting web app with HTML, CSS, JS within Flask framework.
> HTML, CSS, JavaScript, Flask
        `,
        'education.txt': `
Tezpur University
├── B.Tech in Computer Science & Engineering (2020 – 2024)

Assam Higher Secondary Education Council
├── Science with Computer Science

Sankardev Sishu/Vidya Niketan
├── HSLC, SEBA
        `,
        'skills_output': `
Languages:
JavaScript, TypeScript, C++, HTML, CSS, SCSS

Frameworks / Libraries:
React.js, React Native, Redux Toolkit, Django, Material UI, Bootstrap

Platforms / Tools:
Firebase, MongoDB, Git, GitHub, Docker, AWS
        `,
        'projects_output': `
[ Focus Assam – Exam Preparation App ]
> Mobile exam prep app in React Native.
> Full exam flow, REST API integration, state management, Play Store deployment.
> React Native, REST APIs, Play Console

[ CV Maker ]
> Full-stack web app to create, customize, and download CVs.
> React.js, TypeScript, Redux, Material UI

[ World Ranger Congress 2024 Website ]
> Official website connecting global conservationists.
> React, JavaScript, Material UI
        `,
        'achievements.txt': `
> 91% aggregate in Secondary School Examination
> Winner – Kabaddi Competition, Tezpur University Annual Meet 2021
        `,
        'contact_info': `
Email: anupamborboruah100@gmail.com
LinkedIn: https://www.linkedin.com/in/anupam-bor-boruah
GitHub: https://github.com/AnupamBB
Twitter: https://twitter.com/AnupamBBoruah
        `
    };

    function handleCommand(cmd) {
        const outputDiv = document.createElement('div');
        // Escape cmd to prevent XSS in the command echo
        const escapedCmd = cmd.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        outputDiv.innerHTML = `<span class="prompt">user@visitor:~$</span> <span class="command">${escapedCmd}</span>`;

        // Insert before the input line
        userInput.parentElement.before(outputDiv);

        let shouldScrollToBottom = true;
        let response = '';
        let useHTML = false;

        switch (cmd) {
            case 'help':
                response = `
                Available commands:
                - cat bio.txt: View bio
                - cat work_experience.log: View work experience
                - cat education.txt: View education
                - ./list_projects.sh: View projects
                - cat achievements.txt: View achievements
                - grep -r "skills" .: View skills
                - ./contact_me.sh: View contact info
                - clear: Clear terminal
                - ls: List files
                Shortcuts (Scroll):
                - about, experience, projects, achievements, skills, education, contact
                `;
                break;
            case 'clear':
                const allLines = Array.from(terminalBody.children);
                allLines.forEach(el => {
                    if (!el.classList.contains('interactive-line')) {
                        el.remove();
                    }
                });
                terminalBody.scrollTop = 0;
                return;
            case 'ls':
            case 'ls -l':
            case 'll':
                response = `bio.txt  work_experience.log  education.txt  list_projects.sh  achievements.txt  contact_me.sh`;
                break;
            case 'cat bio.txt':
            case 'whoami':
            case 'about':
                response = fileContents['bio.txt'];
                break;
            case 'cat work_experience.log':
            case 'experience':
                response = fileContents['work_experience.log'];
                break;
            case 'cat education.txt':
            case 'education':
                response = fileContents['education.txt'];
                break;
            case './list_projects.sh':
            case 'list_projects.sh':
            case 'projects':
                response = fileContents['projects_output'];
                break;
            case 'cat achievements.txt':
            case 'achievements':
                response = fileContents['achievements.txt'];
                break;
            case 'grep -r "skills" .':
            case 'grep -r "Skills" .':
            case 'grep -r skills':
            case 'grep -r Skills':
            case 'skills':
                response = fileContents['skills_output'];
                break;
            case './contact_me.sh':
            case 'contact_me.sh':
            case 'contact':
                response = fileContents['contact_info'];
                break;
            default:
                response = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        if (response) {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('output');
            responseDiv.classList.add('text-output');
            responseDiv.style.marginBottom = '10px';
            if (useHTML) {
                responseDiv.innerHTML = response;
            } else {
                responseDiv.innerText = response;
            }
            userInput.parentElement.before(responseDiv);
        }

        // Auto scroll to bottom only if not navigating
        if (shouldScrollToBottom) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    // Keep focus on input, but allow clicking on other inputs/links
    document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            userInput.focus({ preventScroll: true });
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

            window.location.href = `mailto:anupamborboruah100@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Optional: Show success message in terminal
            const outputDiv = document.createElement('div');
            outputDiv.classList.add('output');
            outputDiv.classList.add('text-output');
            outputDiv.style.marginBottom = '10px';
            outputDiv.innerText = "Opening email client...";
            userInput.parentElement.before(outputDiv);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        });

        // Handle button click manually if needed (though type="submit" should handle it)
        const sendBtn = contactForm.querySelector('button');
        sendBtn.addEventListener('click', () => {
            contactForm.dispatchEvent(new Event('submit'));
        });
    }

    // Custom block cursor positioning
    const blockCursor = document.querySelector('.block-cursor');
    const updateCursorPosition = () => {
        const text = userInput.value.substring(0, userInput.selectionStart);

        // Create a temporary span to measure text width
        const tempSpan = document.createElement('span');
        tempSpan.style.cssText = `
            position: absolute;
            visibility: hidden;
            font: ${window.getComputedStyle(userInput).font};
            white-space: pre;
        `;
        tempSpan.textContent = text || '\u200B'; // Zero-width space if empty
        document.body.appendChild(tempSpan);

        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        // Position cursor relative to input's parent
        const promptWidth = userInput.previousElementSibling.offsetWidth + 15; // prompt width + margin
        blockCursor.style.left = `${promptWidth + textWidth}px`;
    };

    // Update cursor position on various events
    userInput.addEventListener('input', updateCursorPosition);
    userInput.addEventListener('click', updateCursorPosition);
    userInput.addEventListener('keyup', updateCursorPosition);
    userInput.addEventListener('focus', updateCursorPosition);

    // Initial position
    setTimeout(updateCursorPosition, 100);
});