import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  type: 'message' | 'attachment' | 'event';
  content: string;
  attachmentUrl?: string;
  sender?: 'user' | 'agent';
  timestamp?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

interface ChatWidgetProps {
  projectId: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showFeedbackButton?: boolean;
  pollAlerts?: boolean;
  lang?: string;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  primaryColor?: string;
  textColor?: string;
}

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

function detectLang(prop?: string): keyof typeof translations {
  if (prop && translations[prop as keyof typeof translations]) return prop as keyof typeof translations;
  if (typeof navigator !== 'undefined' && navigator.language.startsWith('fr')) return 'fr';
  return 'en';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  projectId,
  position = 'bottom-right',
  lang = 'en',
  showFeedbackButton = true,
  pollAlerts = true,
  marginTop = 24,
  marginRight = 24,
  marginBottom = 24,
  marginLeft = 24,
  primaryColor = '#12355b',   // Default primary color
  textColor = '#ffffff'       // Default text color
}) => {
  const locale = detectLang(lang);
  const t = translations[locale];
  const [alert, setAlert] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'opening' | 'closing' | 'idle'>('idle');
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'help'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize FAQs with expanded state
  const [faqs, setFaqs] = useState<FAQItem[]>(() => 
    t.faqs.map((faq, index) => ({
      id: `faq-${index}`,
      question: faq.question,
      answer: faq.answer,
      expanded: false
    }))
  );
  
  // Sample chat data
  const [messages, setMessages] = useState<ChatMessage[]>([
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
  ]);

  const toggleWidget = () => {
    if (isOpen) {
      // Closing animation
      setAnimationPhase('closing');
      setTimeout(() => {
        setIsVisible(false);
        setIsOpen(false);
        setAnimationPhase('idle');
      }, 300);
    } else {
      // Opening animation
      setIsOpen(true);
      setAnimationPhase('opening');
      setIsVisible(true);
      setTimeout(() => {
        setAnimationPhase('idle');
      }, 350);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'message',
        content: inputValue,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
    }
  };

  const handleAttachment = () => {
    const newAttachment: ChatMessage = {
      id: Date.now().toString(),
      type: 'attachment',
      content: 'file.jpg',
      attachmentUrl: '#',
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newAttachment]);
  };

  const toggleFaq = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id 
        ? { ...faq, expanded: !faq.expanded } 
        : { ...faq, expanded: false } // Close others when opening one
    ));
  };

  // Calculate position styles
  const getPositionStyles = () => {
    const commonButtonStyle = {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: primaryColor,
      boxShadow: '0 0 12px rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      zIndex: 1001,
      transition: 'transform 200ms',
      position: 'fixed' as const
    };

    const commonPanelStyle = {
      width: '360px',
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column' as const,
      borderRadius: '12px 12px 0 0',
      backgroundColor: 'white',
      border: '1px solid #dee5ec',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      zIndex: 1000,
      overflow: 'hidden',
      position: 'fixed' as const
    };

    const gap = 8; // gap between button and panel

    switch (position) {
      case 'top-right':
        return {
          button: {
            ...commonButtonStyle,
            top: `${marginTop}px`,
            right: `${marginRight}px`,
          },
          panel: {
            ...commonPanelStyle,
            top: `calc(${marginTop}px + 56px + ${gap}px)`,
            right: `${marginRight}px`,
            transformOrigin: 'top right'
          },
          animationDirection: 'top'
        };
      case 'top-left':
        return {
          button: {
            ...commonButtonStyle,
            top: `${marginTop}px`,
            left: `${marginLeft}px`,
          },
          panel: {
            ...commonPanelStyle,
            top: `calc(${marginTop}px + 56px + ${gap}px)`,
            left: `${marginLeft}px`,
            transformOrigin: 'top left'
          },
          animationDirection: 'top'
        };
      case 'bottom-left':
        return {
          button: {
            ...commonButtonStyle,
            bottom: `${marginBottom}px`,
            left: `${marginLeft}px`,
          },
          panel: {
            ...commonPanelStyle,
            bottom: `calc(${marginBottom}px + 56px + ${gap}px)`,
            left: `${marginLeft}px`,
            transformOrigin: 'bottom left'
          },
          animationDirection: 'bottom'
        };
      case 'bottom-right':
      default:
        return {
          button: {
            ...commonButtonStyle,
            bottom: `${marginBottom}px`,
            right: `${marginRight}px`,
          },
          panel: {
            ...commonPanelStyle,
            bottom: `calc(${marginBottom}px + 56px + ${gap}px)`,
            right: `${marginRight}px`,
            transformOrigin: 'bottom right'
          },
          animationDirection: 'bottom'
        };
    }
  };

  const positionStyles = getPositionStyles();

  useEffect(() => {
    if (!pollAlerts) return;
    fetch(`https://api.feedbackit.io/alerts?projectId=${projectId}`)
      .then(r => r.json())
      .then(a => setAlert(a.active ? a : null))
      .catch(() => {});
  }, [projectId, pollAlerts]);

  return (
    <div>
      {alert && (() => {
      // base styles common to every alert
      const baseStyle: React.CSSProperties = {
        padding: '0.75rem 1rem',
        margin: '1rem 0',
        borderRadius: '4px',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        display: 'block',
      }

    // type-specific overrides
    let typeStyle: React.CSSProperties
    switch (alert.type) {
      case 'success':
        typeStyle = {
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
        }
        break
      case 'error':
        typeStyle = {
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
        }
        break
      case 'warning':
        typeStyle = {
          backgroundColor: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeeba',
        }
        break
      default:
        typeStyle = {
          backgroundColor: '#cce5ff',
          color: '#004085',
          border: '1px solid #b8daff',
        }
    }

    return (
      <div style={{ ...baseStyle, ...typeStyle }}>
        {alert.message}
      </div>
    )
      })()}

      {/* Toggle Button */}
      {showFeedbackButton && (
      <button
        onClick={toggleWidget}
        style={positionStyles.button}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div style={{
          position: 'relative',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Chat icon - shown when closed */}
          {!isOpen && (
            <svg 
              viewBox="0 0 24 24" 
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                color: textColor,
                transition: 'opacity 200ms',
                opacity: animationPhase === 'closing' ? 0 : 1
              }}
            >
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
            </svg>
          )}
          
          {/* Close icon - shown when open */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${animationPhase === 'closing' ? '0deg' : animationPhase === 'opening' ? '0deg' : '0deg'})`,
              transition: `transform 200ms ${animationPhase === 'closing' ? 'ease-in' : 'ease-out'}`,
              opacity: isOpen ? 1 : 0
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </button>
      )}
      {/* button to test alert */}
      <button onClick={() => setAlert({ type: 'error', message: 'This is an error alert' })}>Test Alert</button>
      {/* Chat Panel */}
      {isVisible && (
        <div 
          style={{
            ...positionStyles.panel,
            transform: animationPhase === 'opening' ? 
              (positionStyles.animationDirection === 'bottom' 
                ? 'translateY(100%) scale(0.95)' 
                : 'translateY(-100%) scale(0.95)') : 
              'translateY(0) scale(1)',
            opacity: animationPhase === 'opening' ? 0 : 1,
            animation: animationPhase === 'opening' ? 
              `slideIn${positionStyles.animationDirection === 'bottom' ? 'Bottom' : 'Top'} 350ms cubic-bezier(0.22,1,0.36,1) forwards` : 
              animationPhase === 'closing' ? 
                `slideOut${positionStyles.animationDirection === 'bottom' ? 'Bottom' : 'Top'} 300ms ease-in forwards` : 
                'none'
          }}
        >
          {/* Header */}
          <div 
            style={{
              height: '56px',
              backgroundColor: primaryColor,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: animationPhase === 'opening' ? 0 : 1,
              animation: animationPhase === 'opening' ? 
                'fadeIn 200ms ease forwards' : 
                animationPhase === 'closing' ? 
                  'fadeOut 200ms ease forwards' : 
                  'none',
              animationDelay: animationPhase === 'opening' ? '100ms' : '0ms'
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              {[t.chat, t.help].map((tab, index) => {
                const tabKey = index === 0 ? 'chat' : 'help';
                return (
                  <button 
                    key={tabKey}
                    style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderRadius: '9999px',
                      background: activeTab === tabKey ? 'rgba(255,255,255,0.2)' : 'transparent',
                      color: activeTab === tabKey ? textColor : `rgba(255,255,255,0.7)`,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 200ms, color 200ms'
                    }}
                    onClick={() => setActiveTab(tabKey)}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Area */}
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              backgroundColor: 'white',
              opacity: animationPhase === 'opening' ? 0 : 1,
              animation: animationPhase === 'opening' ? 
                'fadeIn 200ms ease forwards' : 
                animationPhase === 'closing' ? 
                  'fadeOut 200ms ease forwards' : 
                  'none',
              animationDelay: animationPhase === 'opening' ? '150ms' : '0ms'
            }}
          >
            {activeTab === 'chat' ? (
              <>
                {messages.map((msg) => {
                  if (msg.type === 'event') {
                    return (
                      <div 
                        key={msg.id}
                        style={{
                          textAlign: 'center',
                          margin: '16px 0',
                          fontWeight: 600,
                          color: '#555'
                        }}
                      >
                        {msg.content}
                      </div>
                    );
                  }
                  
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        marginBottom: '16px'
                      }}
                    >
                      <div style={{
                        maxWidth: '80%',
                        backgroundColor: isUser ? primaryColor : '#f0f0f0',
                        color: isUser ? textColor : '#333',
                        borderRadius: '18px',
                        borderTopLeftRadius: isUser ? '18px' : '4px',
                        borderTopRightRadius: isUser ? '4px' : '18px',
                        padding: '12px 16px',
                        position: 'relative'
                      }}>
                        {msg.type === 'attachment' && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '4px'
                          }}>
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none"
                              style={{ 
                                marginRight: '8px',
                                color: isUser ? `rgba(255,255,255,0.7)` : 'rgba(0,0,0,0.5)'
                              }}
                            >
                              <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 15.01L9.41 16.42L11 14.84V19H13V14.84L14.59 16.43L16 15.01L12.01 11L8 15.01Z" fill="currentColor"/>
                            </svg>
                            <span style={{
                              fontWeight: 500,
                              fontSize: '14px',
                              color: isUser ? `rgba(255,255,255,0.9)` : 'rgba(0,0,0,0.7)'
                            }}>
                              {msg.content}
                            </span>
                          </div>
                        )}
                        
                        {msg.type === 'message' && (
                          <p style={{ margin: 0 }}>{msg.content}</p>
                        )}
                        
                        <div style={{
                          fontSize: '11px',
                          color: isUser ? `rgba(255,255,255,0.7)` : 'rgba(0,0,0,0.5)',
                          textAlign: 'right',
                          marginTop: '4px'
                        }}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : (
              // Help Section (FAQs)
              <div>
                <h3 style={{
                  margin: '0 0 16px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#333',
                  textAlign: 'center'
                }}>
                  {t.faqTitle}
                </h3>
                
                {faqs.map(faq => (
                  <div 
                    key={faq.id}
                    style={{
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      overflow: 'hidden' // Prevent content overflow
                    }}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}>
                      {/* Chevron icon */}
                      <div style={{
                        marginRight: '12px',
                        minWidth: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none"
                          style={{ 
                            transform: faq.expanded ? 'rotate(90deg)' : 'rotate(0)',
                            transition: 'transform 0.3s ease',
                            color: textColor
                          }}
                        >
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
                        </svg>
                      </div>
                      
                      <div style={{ 
                        flex: 1,
                        minWidth: 0, // Allow text wrapping
                        overflow: 'hidden'
                      }}>
                        {/* Question */}
                        <div style={{
                          fontWeight: 600,
                          color: '#333',
                          marginBottom: '4px',
                          wordBreak: 'break-word' // Wrap long words
                        }}>
                          {faq.question}
                        </div>
                        
                        {/* Answer */}
                        <div style={{
                          color: '#666',
                          fontSize: '14px',
                          maxHeight: faq.expanded ? '500px' : '1.5em',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease',
                          wordBreak: 'break-word' // Wrap long words
                        }}>
                          {faq.expanded ? (
                            <div style={{ 
                              paddingRight: '8px',
                              whiteSpace: 'normal' // Ensure proper wrapping
                            }}>
                              {faq.answer}
                            </div>
                          ) : (
                            <div style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Input Area - Only shown in chat mode */}
          {activeTab === 'chat' && (
            <div 
              style={{
                borderTop: '1px solid #e0e0e0',
                padding: '12px',
                opacity: animationPhase === 'opening' ? 0 : 1,
                animation: animationPhase === 'opening' ? 
                  'fadeIn 200ms ease forwards' : 
                  animationPhase === 'closing' ? 
                    'fadeOut 200ms ease forwards' : 
                    'none',
                animationDelay: animationPhase === 'opening' ? '200ms' : '0ms'
              }}
            >
              <form 
                onSubmit={handleSendMessage}
                style={{ position: 'relative' }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.placeholder}
                  style={{
                    width: '100%',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '9999px',
                    padding: '12px 100px 12px 16px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    type="button"
                    onClick={handleAttachment}
                    style={{
                      color: '#666',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 15.01L9.41 16.42L11 14.84V19H13V14.84L14.59 16.43L16 15.01L12.01 11L8 15.01Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    style={{
                      color: inputValue.trim() ? primaryColor : '#999',
                      border: 'none',
                      background: 'none',
                      cursor: inputValue.trim() ? 'pointer' : 'default',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </form>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{t.weRunOn}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes slideInBottom {
          from {
            transform: translateY(100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideOutBottom {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(100%) scale(0.95);
            opacity: 0;
          }
        }
        
        @keyframes slideInTop {
          from {
            transform: translateY(-100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideOutTop {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(-100%) scale(0.95);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;