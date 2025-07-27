window.FeedbackIt = window.FeedbackIt || {};

FeedbackIt.init = function(userConfig) {
    // Default configuration
    const defaultConfig = {
        projectId: 'your-project-id',
        position: 'bottom-right',
        showFeedbackButton: true,
        pollAlerts: true,
        lang: 'en',
        marginTop: 24,
        marginRight: 24,
        marginBottom: 24,
        marginLeft: 24,
        primaryColor: '#12355b',
        textColor: '#ffffff'
    };

    // Merge user config with defaults
    const config = { ...defaultConfig, ...userConfig };

    // Translations
    const translations = {
        en: {
            feedbackButton: 'Give feedback',
            placeholder: 'Your feedback',
            send: 'Send',
            chat: 'Chat',
            help: 'Help',
            weRunOn: 'We run on FeedBacKit',
            faqTitle: 'Frequently Asked Questions',
            faqs: [
                {
                    question: "How do I reset my password?",
                    answer: "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email."
                },
                {
                    question: "How can I update my profile information?",
                    answer: "You can update your profile by navigating to the 'My Account' section in the top menu. Click on 'Edit Profile' to make changes."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards including Visa, MasterCard, and American Express. We also support PayPal and bank transfers."
                },
                {
                    question: "How do I contact customer support?",
                    answer: "You can contact our support team 24/7 through this chat widget, or email us at support@example.com. Our average response time is under 30 minutes."
                },
                {
                    question: "Can I cancel my subscription anytime?",
                    answer: "Yes, you can cancel your subscription at any time without penalty. Your access will continue until the end of your current billing period."
                }
            ]
        },
        fr: {
            feedbackButton: 'Donner un avis',
            placeholder: 'Votre avis',
            send: 'Envoyer',
            chat: 'Chat',
            help: 'Aide',
            weRunOn: 'Nous utilisons FeedBacKit',
            faqTitle: 'Questions Fréquemment Posées',
            faqs: [
                {
                    question: "Comment réinitialiser mon mot de passe?",
                    answer: "Pour réinitialiser votre mot de passe, allez à la page de connexion et cliquez sur 'Mot de passe oublié'. Suivez les instructions envoyées à votre e-mail."
                },
                {
                    question: "Comment puis-je mettre à jour mes informations de profil?",
                    answer: "Vous pouvez mettre à jour votre profil en accédant à la section 'Mon Compte' dans le menu supérieur. Cliquez sur 'Modifier le profil' pour apporter des modifications."
                },
                {
                    question: "Quels modes de paiement acceptez-vous?",
                    answer: "Nous acceptons toutes les principales cartes de crédit, y compris Visa, MasterCard et American Express. Nous prenons également en charge PayPal et les virements bancaires."
                },
                {
                    question: "Comment puis-je contacter le service client?",
                    answer: "Vous pouvez contacter notre équipe d'assistance 24h/24 et 7j/7 via ce widget de chat ou par e-mail à support@example.com. Notre temps de réponse moyen est inférieur à 30 minutes."
                },
                {
                    question: "Puis-je annuler mon abonnement à tout moment?",
                    answer: "Oui, vous pouvez annuler votre abonnement à tout moment sans pénalité. Votre accès continuera jusqu'à la fin de votre période de facturation actuelle."
                }
            ]
        }
    };
    
    // Detect language
    function detectLang(prop) {
        if (prop && translations[prop]) return prop;
        if (typeof navigator !== 'undefined' && navigator.language.startsWith('fr')) return 'fr';
        return 'en';
    }
    
    // Create widget
    const locale = detectLang(config.lang);
    const t = translations[locale];
    
    // State
    let state = {
        alert: null,
        isOpen: false,
        isVisible: false,
        animationPhase: 'idle',
        inputValue: '',
        activeTab: 'chat',
        messages: [
            {
                id: '1',
                type: 'event',
                content: 'Chat started',
                timestamp: '10:42 AM'
            },
            {
                id: '2',
                type: 'message',
                content: 'Hello! How can I help you today?',
                sender: 'agent',
                timestamp: '10:42 AM'
            },
            {
                id: '3',
                type: 'message',
                content: 'I need help with my account settings',
                sender: 'user',
                timestamp: '10:43 AM'
            },
            {
                id: '4',
                type: 'attachment',
                content: 'document.pdf',
                attachmentUrl: '#',
                sender: 'user',
                timestamp: '10:44 AM'
            },
            {
                id: '5',
                type: 'message',
                content: 'Sure, I can help with that. What exactly do you need?',
                sender: 'agent',
                timestamp: '10:45 AM'
            }
        ],
        faqs: t.faqs.map((faq, index) => ({
            id: `faq-${index}`,
            question: faq.question,
            answer: faq.answer,
            expanded: false
        }))
    };
    
    // Create root container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'feedbackit-widget';
    document.body.appendChild(widgetContainer);
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--primary-color', config.primaryColor);
    widgetContainer.style.setProperty('--text-color', config.textColor);
    
    // Create keyframes
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        @keyframes slideInBottom {
            from { transform: translateY(100%) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes slideOutBottom {
            from { transform: translateY(0) scale(1); opacity: 1; }
            to { transform: translateY(100%) scale(0.95); opacity: 0; }
        }
        @keyframes slideInTop {
            from { transform: translateY(-100%) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes slideOutTop {
            from { transform: translateY(0) scale(1); opacity: 1; }
            to { transform: translateY(-100%) scale(0.95); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        #feedbackit-widget {
            --primary-color: ${config.primaryColor};
            --text-color: ${config.textColor};
        }
        
        #feedbackit-widget .feedbackit-toggle {
            background-color: var(--primary-color);
            color: var(--text-color);
        }
    `;
    document.head.appendChild(styleTag);
    
    // Helper function to set inline styles from object
    function applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }
    
    // Render function
    function render() {
        widgetContainer.innerHTML = '';
        
        // Set CSS variables for colors
        widgetContainer.style.setProperty('--primary-color', config.primaryColor);
        widgetContainer.style.setProperty('--text-color', config.textColor);
        
        // Render alert
        if (state.alert) {
            const alertStyles = {
                padding: '0.75rem 1rem',
                margin: '1rem 0',
                borderRadius: '4px',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                display: 'block'
            };
            
            switch (state.alert.type) {
                case 'success':
                    Object.assign(alertStyles, {
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb'
                    });
                    break;
                case 'error':
                    Object.assign(alertStyles, {
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb'
                    });
                    break;
                case 'warning':
                    Object.assign(alertStyles, {
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        border: '1px solid #ffeeba'
                    });
                    break;
                default:
                    Object.assign(alertStyles, {
                        backgroundColor: '#cce5ff',
                        color: '#004085',
                        border: '1px solid #b8daff'
                    });
            }
            
            const alertDiv = document.createElement('div');
            alertDiv.textContent = state.alert.message;
            applyStyles(alertDiv, alertStyles);
            widgetContainer.appendChild(alertDiv);
        }
        
        // Render toggle button
        if (config.showFeedbackButton) {
            const positionStyles = getPositionStyles();
            
            const toggleButton = document.createElement('button');
            toggleButton.className = 'feedbackit-toggle';
            applyStyles(toggleButton, {
                ...positionStyles.button,
                backgroundColor: 'var(--primary-color)',
                color: 'var(--text-color)'
            });
            toggleButton.setAttribute('aria-label', state.isOpen ? "Close chat" : "Open chat");
            toggleButton.onclick = toggleWidget;
            
            const iconContainer = document.createElement('div');
            applyStyles(iconContainer, {
                position: 'relative',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });
            
            if (!state.isOpen) {
                const chatIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                chatIcon.setAttribute('viewBox', '0 0 24 24');
                applyStyles(chatIcon, {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    color: 'var(--text-color)',
                    transition: 'opacity 200ms',
                    opacity: state.animationPhase === 'closing' ? 0 : 1
                });
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z');
                path.setAttribute('fill', 'currentColor');
                chatIcon.appendChild(path);
                iconContainer.appendChild(chatIcon);
            }
            
            const closeIconContainer = document.createElement('div');
            applyStyles(closeIconContainer, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${state.animationPhase === 'closing' ? '0deg' : state.animationPhase === 'opening' ? '0deg' : '0deg'})`,
                transition: `transform 200ms ${state.animationPhase === 'closing' ? 'ease-in' : 'ease-out'}`,
                opacity: state.isOpen ? 1 : 0
            });
            
            const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            closeIcon.setAttribute('viewBox', '0 0 24 24');
            applyStyles(closeIcon, { width: '100%', height: '100%' });
            const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            closePath.setAttribute('d', 'M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z');
            closePath.setAttribute('fill', 'currentColor');
            closeIcon.appendChild(closePath);
            closeIconContainer.appendChild(closeIcon);
            iconContainer.appendChild(closeIconContainer);
            
            toggleButton.appendChild(iconContainer);
            widgetContainer.appendChild(toggleButton);
        }
        
        // Render panel
        if (state.isVisible) {
            const positionStyles = getPositionStyles();
            
            const panel = document.createElement('div');
            panel.className = 'feedbackit-panel';
            applyStyles(panel, positionStyles.panel);
            
            const transform = state.animationPhase === 'opening' ? 
                (positionStyles.animationDirection === 'bottom' 
                    ? 'translateY(100%) scale(0.95)' 
                    : 'translateY(-100%) scale(0.95)') : 
                'translateY(0) scale(1)';
            
            let animation = '';
            if (state.animationPhase === 'opening') {
                animation = `animation: slideIn${positionStyles.animationDirection === 'bottom' ? 'Bottom' : 'Top'} 350ms cubic-bezier(0.22,1,0.36,1) forwards;`;
            } else if (state.animationPhase === 'closing') {
                animation = `animation: slideOut${positionStyles.animationDirection === 'bottom' ? 'Bottom' : 'Top'} 300ms ease-in forwards;`;
            }
            
            applyStyles(panel, {
                transform: transform,
                opacity: state.animationPhase === 'opening' ? 0 : 1,
                animation: animation
            });
            
            // Render header
            const header = document.createElement('div');
            applyStyles(header, {
                height: '56px',
                background: 'var(--primary-color)',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: state.animationPhase === 'opening' ? 0 : 1,
                animation: state.animationPhase === 'opening' ? 
                    'fadeIn 200ms ease forwards' : 
                    state.animationPhase === 'closing' ? 
                        'fadeOut 200ms ease forwards' : 
                        'none',
                animationDelay: state.animationPhase === 'opening' ? '100ms' : '0ms'
            });
            
            const tabsContainer = document.createElement('div');
            applyStyles(tabsContainer, {
                display: 'flex',
                gap: '4px'
            });
            
            [t.chat, t.help].forEach((tab, index) => {
                const tabKey = index === 0 ? 'chat' : 'help';
                const tabButton = document.createElement('button');
                tabButton.textContent = tab;
                applyStyles(tabButton, {
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '9999px',
                    background: state.activeTab === tabKey ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: state.activeTab === tabKey ? 'var(--text-color)' : 'rgba(255,255,255,0.7)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 200ms, color 200ms'
                });
                tabButton.onclick = () => setActiveTab(tabKey);
                tabsContainer.appendChild(tabButton);
            });
            
            header.appendChild(tabsContainer);
            panel.appendChild(header);
            
            // Render message area
            const messageArea = document.createElement('div');
            applyStyles(messageArea, {
                flex: '1',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '16px',
                backgroundColor: 'white',
                opacity: state.animationPhase === 'opening' ? 0 : 1,
                animation: state.animationPhase === 'opening' ? 
                    'fadeIn 200ms ease forwards' : 
                    state.animationPhase === 'closing' ? 
                        'fadeOut 200ms ease forwards' : 
                        'none',
                animationDelay: state.animationPhase === 'opening' ? '150ms' : '0ms'
            });
            
            if (state.activeTab === 'chat') {
                state.messages.forEach(msg => {
                    if (msg.type === 'event') {
                        const eventDiv = document.createElement('div');
                        applyStyles(eventDiv, {
                            textAlign: 'center',
                            margin: '16px 0',
                            fontWeight: '600',
                            color: '#555'
                        });
                        eventDiv.textContent = msg.content;
                        messageArea.appendChild(eventDiv);
                    } else {
                        const isUser = msg.sender === 'user';
                        const messageContainer = document.createElement('div');
                        applyStyles(messageContainer, {
                            display: 'flex',
                            justifyContent: isUser ? 'flex-end' : 'flex-start',
                            marginBottom: '16px'
                        });
                        
                        const messageBubble = document.createElement('div');
                        applyStyles(messageBubble, {
                            maxWidth: '80%',
                            backgroundColor: isUser ? 'var(--primary-color)' : '#f0f0f0',
                            color: isUser ? 'var(--text-color)' : '#333',
                            borderRadius: '18px',
                            borderTopLeftRadius: isUser ? '18px' : '4px',
                            borderTopRightRadius: isUser ? '4px' : '18px',
                            padding: '12px 16px',
                            position: 'relative'
                        });
                        
                        if (msg.type === 'attachment') {
                            const attachmentDiv = document.createElement('div');
                            applyStyles(attachmentDiv, {
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '4px'
                            });
                            
                            const attachmentIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            attachmentIcon.setAttribute('width', '16');
                            attachmentIcon.setAttribute('height', '16');
                            attachmentIcon.setAttribute('viewBox', '0 0 24 24');
                            attachmentIcon.setAttribute('fill', 'none');
                            applyStyles(attachmentIcon, {
                                marginRight: '8px',
                                color: isUser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'
                            });
                            
                            const attachmentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                            attachmentPath.setAttribute('d', 'M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 15.01L9.41 16.42L11 14.84V19H13V14.84L14.59 16.43L16 15.01L12.01 11L8 15.01Z');
                            attachmentPath.setAttribute('fill', 'currentColor');
                            attachmentIcon.appendChild(attachmentPath);
                            
                            const attachmentText = document.createElement('span');
                            applyStyles(attachmentText, {
                                fontWeight: '500',
                                fontSize: '14px',
                                color: isUser ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)'
                            });
                            attachmentText.textContent = msg.content;
                            
                            attachmentDiv.appendChild(attachmentIcon);
                            attachmentDiv.appendChild(attachmentText);
                            messageBubble.appendChild(attachmentDiv);
                        }
                        
                        if (msg.type === 'message') {
                            const messageText = document.createElement('p');
                            applyStyles(messageText, { margin: '0' });
                            messageText.textContent = msg.content;
                            messageBubble.appendChild(messageText);
                        }
                        
                        const timestampDiv = document.createElement('div');
                        applyStyles(timestampDiv, {
                            fontSize: '11px',
                            color: isUser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                            textAlign: 'right',
                            marginTop: '4px'
                        });
                        timestampDiv.textContent = msg.timestamp;
                        messageBubble.appendChild(timestampDiv);
                        
                        messageContainer.appendChild(messageBubble);
                        messageArea.appendChild(messageContainer);
                    }
                });
                
                const messagesEnd = document.createElement('div');
                messagesEnd.setAttribute('ref', 'messagesEnd');
                messageArea.appendChild(messagesEnd);
            } else {
                // Render help section
                const faqSection = document.createElement('div');
                
                const faqTitle = document.createElement('h3');
                applyStyles(faqTitle, {
                    margin: '0 0 16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333',
                    textAlign: 'center'
                });
                faqTitle.textContent = t.faqTitle;
                faqSection.appendChild(faqTitle);
                
                state.faqs.forEach(faq => {
                    const faqItem = document.createElement('div');
                    applyStyles(faqItem, {
                        marginBottom: '16px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        overflow: 'hidden'
                    });
                    faqItem.dataset.id = faq.id;
                    faqItem.onclick = () => toggleFaq(faq.id);
                    
                    const faqContent = document.createElement('div');
                    applyStyles(faqContent, {
                        display: 'flex',
                        alignItems: 'flex-start'
                    });
                    
                    const chevron = document.createElement('div');
                    applyStyles(chevron, {
                        marginRight: '12px',
                        minWidth: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: '0'
                    });
                    
                    const chevronIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    chevronIcon.setAttribute('width', '12');
                    chevronIcon.setAttribute('height', '12');
                    chevronIcon.setAttribute('viewBox', '0 0 24 24');
                    chevronIcon.setAttribute('fill', 'none');
                    applyStyles(chevronIcon, {
                        transform: faq.expanded ? 'rotate(90deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease',
                        color: 'var(--text-color)'
                    });
                    
                    const chevronPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    chevronPath.setAttribute('d', 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z');
                    chevronPath.setAttribute('fill', 'currentColor');
                    chevronIcon.appendChild(chevronPath);
                    chevron.appendChild(chevronIcon);
                    
                    const faqText = document.createElement('div');
                    applyStyles(faqText, {
                        flex: '1',
                        minWidth: '0',
                        overflow: 'hidden'
                    });
                    
                    const question = document.createElement('div');
                    applyStyles(question, {
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '4px',
                        wordBreak: 'break-word'
                    });
                    question.textContent = faq.question;
                    
                    const answer = document.createElement('div');
                    applyStyles(answer, {
                        color: '#666',
                        fontSize: '14px',
                        maxHeight: faq.expanded ? '500px' : '1.5em',
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease',
                        wordBreak: 'break-word'
                    });
                    
                    if (faq.expanded) {
                        const answerContent = document.createElement('div');
                        applyStyles(answerContent, {
                            paddingRight: '8px',
                            whiteSpace: 'normal'
                        });
                        answerContent.textContent = faq.answer;
                        answer.appendChild(answerContent);
                    } else {
                        const answerPreview = document.createElement('div');
                        applyStyles(answerPreview, {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        });
                        answerPreview.textContent = faq.answer;
                        answer.appendChild(answerPreview);
                    }
                    
                    faqText.appendChild(question);
                    faqText.appendChild(answer);
                    faqContent.appendChild(chevron);
                    faqContent.appendChild(faqText);
                    faqItem.appendChild(faqContent);
                    faqSection.appendChild(faqItem);
                });
                
                messageArea.appendChild(faqSection);
            }
            
            panel.appendChild(messageArea);
            
            // Render input area
            if (state.activeTab === 'chat') {
                const inputArea = document.createElement('div');
                applyStyles(inputArea, {
                    borderTop: '1px solid #e0e0e0',
                    padding: '12px',
                    opacity: state.animationPhase === 'opening' ? 0 : 1,
                    animation: state.animationPhase === 'opening' ? 
                        'fadeIn 200ms ease forwards' : 
                        state.animationPhase === 'closing' ? 
                            'fadeOut 200ms ease forwards' : 
                            'none',
                    animationDelay: state.animationPhase === 'opening' ? '200ms' : '0ms'
                });
                
                const form = document.createElement('form');
                applyStyles(form, { position: 'relative' });
                form.onsubmit = handleSendMessage;
                
                const input = document.createElement('input');
                input.type = 'text';
                input.value = state.inputValue;
                input.placeholder = t.placeholder;
                applyStyles(input, {
                    width: '100%',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '9999px',
                    padding: '12px 100px 12px 16px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px'
                });
                input.oninput = (e) => {
                    state.inputValue = e.target.value;
                    render();
                };
                form.appendChild(input);
                
                const actions = document.createElement('div');
                applyStyles(actions, {
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    gap: '8px'
                });
                
                const attachButton = document.createElement('button');
                attachButton.type = 'button';
                applyStyles(attachButton, {
                    color: '#666',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });
                attachButton.onclick = handleAttachment;
                
                const attachIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                attachIcon.setAttribute('width', '20');
                attachIcon.setAttribute('height', '20');
                attachIcon.setAttribute('viewBox', '0 0 24 24');
                attachIcon.setAttribute('fill', 'none');
                const attachPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                attachPath.setAttribute('d', 'M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 15.01L9.41 16.42L11 14.84V19H13V14.84L14.59 16.43L16 15.01L12.01 11L8 15.01Z');
                attachPath.setAttribute('fill', 'currentColor');
                attachIcon.appendChild(attachPath);
                attachButton.appendChild(attachIcon);
                actions.appendChild(attachButton);
                
                const sendButton = document.createElement('button');
                sendButton.type = 'submit';
                sendButton.disabled = !state.inputValue.trim();
                applyStyles(sendButton, {
                    color: state.inputValue.trim() ? 'var(--primary-color)' : '#999',
                    border: 'none',
                    background: 'none',
                    cursor: state.inputValue.trim() ? 'pointer' : 'default',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });
                
                const sendIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                sendIcon.setAttribute('width', '20');
                sendIcon.setAttribute('height', '20');
                sendIcon.setAttribute('viewBox', '0 0 24 24');
                sendIcon.setAttribute('fill', 'none');
                const sendPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                sendPath.setAttribute('d', 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z');
                sendPath.setAttribute('fill', 'currentColor');
                sendIcon.appendChild(sendPath);
                sendButton.appendChild(sendIcon);
                actions.appendChild(sendButton);
                
                form.appendChild(actions);
                inputArea.appendChild(form);
                
                const footer = document.createElement('div');
                applyStyles(footer, {
                    textAlign: 'center',
                    marginTop: '8px'
                });
                
                const footerText = document.createElement('span');
                applyStyles(footerText, {
                    fontSize: '12px',
                    color: '#666'
                });
                footerText.textContent = t.weRunOn;
                footer.appendChild(footerText);
                inputArea.appendChild(footer);
                
                panel.appendChild(inputArea);
            }
            
            widgetContainer.appendChild(panel);
        }
    }
    
    // Position styles helper
    function getPositionStyles() {
        const commonButtonStyle = {
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--text-color)',
            boxShadow: '0 0 12px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            zIndex: '1001',
            transition: 'transform 200ms',
            position: 'fixed'
        };

        const commonPanelStyle = {
            width: '360px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px 12px 0 0',
            backgroundColor: 'white',
            border: '1px solid #dee5ec',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            zIndex: '1000',
            overflow: 'hidden',
            position: 'fixed'
        };

        const gap = 8; // gap between button and panel

        switch (config.position) {
            case 'top-right':
                return {
                    button: {
                        ...commonButtonStyle,
                        top: `${config.marginTop}px`,
                        right: `${config.marginRight}px`,
                    },
                    panel: {
                        ...commonPanelStyle,
                        top: `calc(${config.marginTop}px + 56px + ${gap}px)`,
                        right: `${config.marginRight}px`,
                        transformOrigin: 'top right'
                    },
                    animationDirection: 'top'
                };
            case 'top-left':
                return {
                    button: {
                        ...commonButtonStyle,
                        top: `${config.marginTop}px`,
                        left: `${config.marginLeft}px`,
                    },
                    panel: {
                        ...commonPanelStyle,
                        top: `calc(${config.marginTop}px + 56px + ${gap}px)`,
                        left: `${config.marginLeft}px`,
                        transformOrigin: 'top left'
                    },
                    animationDirection: 'top'
                };
            case 'bottom-left':
                return {
                    button: {
                        ...commonButtonStyle,
                        bottom: `${config.marginBottom}px`,
                        left: `${config.marginLeft}px`,
                    },
                    panel: {
                        ...commonPanelStyle,
                        bottom: `calc(${config.marginBottom}px + 56px + ${gap}px)`,
                        left: `${config.marginLeft}px`,
                        transformOrigin: 'bottom left'
                    },
                    animationDirection: 'bottom'
                };
            case 'bottom-right':
            default:
                return {
                    button: {
                        ...commonButtonStyle,
                        bottom: `${config.marginBottom}px`,
                        right: `${config.marginRight}px`,
                    },
                    panel: {
                        ...commonPanelStyle,
                        bottom: `calc(${config.marginBottom}px + 56px + ${gap}px)`,
                        right: `${config.marginRight}px`,
                        transformOrigin: 'bottom right'
                    },
                    animationDirection: 'bottom'
                };
        }
    }
    
    // Toggle widget
    function toggleWidget() {
        if (state.isOpen) {
            state.animationPhase = 'closing';
            render();
            setTimeout(() => {
                state.isVisible = false;
                state.isOpen = false;
                state.animationPhase = 'idle';
                render();
            }, 300);
        } else {
            state.isOpen = true;
            state.animationPhase = 'opening';
            state.isVisible = true;
            render();
            setTimeout(() => {
                state.animationPhase = 'idle';
                render();
            }, 350);
        }
    }
    
    // Set active tab
    function setActiveTab(tab) {
        state.activeTab = tab;
        render();
    }
    
    // Toggle FAQ
    function toggleFaq(id) {
        state.faqs = state.faqs.map(faq => 
            faq.id === id 
                ? { ...faq, expanded: !faq.expanded } 
                : { ...faq, expanded: false }
        );
        render();
    }
    
    // Handle send message
    function handleSendMessage(e) {
        e.preventDefault();
        if (state.inputValue.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                type: 'message',
                content: state.inputValue,
                sender: 'user',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            state.messages = [...state.messages, newMessage];
            state.inputValue = '';
            render();
            
            // Scroll to bottom
            setTimeout(() => {
                const messageArea = widgetContainer.querySelector('.feedbackit-message-area');
                if (messageArea) {
                    messageArea.scrollTop = messageArea.scrollHeight;
                }
            }, 100);
        }
    }
    
    // Handle attachment
    function handleAttachment() {
        const newAttachment = {
            id: Date.now().toString(),
            type: 'attachment',
            content: 'file.jpg',
            attachmentUrl: '#',
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        state.messages = [...state.messages, newAttachment];
        render();
    }
    
    // Fetch alerts
    function fetchAlerts() {
        if (!config.pollAlerts) return;
        
        fetch(`https://api.feedbackit.io/alerts?projectId=${config.projectId}`)
            .then(r => r.json())
            .then(a => {
                state.alert = a.active ? a : null;
                render();
            })
            .catch(() => {});
    }
    
    // Initial render
    render();
    fetchAlerts();
};