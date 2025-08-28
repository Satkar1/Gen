export const checkForCrisis = (text) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'want to die', 
    'hurt myself', 'no reason to live', 'better off without me'
  ];
  
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
};

export const crisisResponse = {
  message: "I hear you. You're not alone, and your feelings matter. Please reach out to the 988 Suicide & Crisis Lifeline for immediate support. They're available 24/7 and it's completely confidential.",
  resources: [
    {
      name: "988 Suicide & Crisis Lifeline",
      contact: "Call or text 988",
      copyText: "988",
      description: "Free, confidential support available 24/7"
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      copyText: "HOME to 741741",
      description: "Free, 24/7 support via text"
    },
    {
      name: "International WhatsApp Support",
      contact: "+1-585-301-5657",
      copyText: "+1-585-301-5657",
      description: "Global support via WhatsApp",
      link: "https://wa.me/15853015657"
    }
  ]
};