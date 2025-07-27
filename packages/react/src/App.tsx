import { useEffect, useState } from "react";
import { FeedbackItWidget } from ".";
import ChatWidget from "./ChatWidget";

export default function App() {
  const [showChatWidget, setShowChatWidget] = useState(false);
  const fetchWidget = async () => {
    const response = await fetch("http://localhost:3000/api/widget?apikey=abcde", {
      headers: {
        "x-api-key": "abcde"
      }
    });
  }
  useEffect(() => {
    fetchWidget();
  }, []);
  return (
    <div>
      <h1>Hello World</h1>
      <ChatWidget projectId="123" 
      lang="fr" showFeedbackButton={true} pollAlerts={true} 
      position="bottom-right"
      marginTop={24}
      marginRight={24}
      marginBottom={24}
      marginLeft={24}
      primaryColor="#000"
      textColor="#fff"
      />
      <FeedbackItWidget projectId="123" lang="fr" />
    </div>
  );
}