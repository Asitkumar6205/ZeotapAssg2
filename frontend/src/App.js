import React, { useState } from "react";
import { fetchOpenAIResponse } from "./api";

function formatString(input) {
  if (!input) return null; // Return null if input is undefined or null

  // Replace `**text**` with React <strong> elements
  const boldFormatted = input.split(/\*\*(.*?)\*\*/).map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  );

  // Replace `\n` with React <br /> elements
  return boldFormatted.map((part, index) =>
    typeof part === "string"
      ? part.split("\n").map((line, i) => (
          <React.Fragment key={`${index}-${i}`}>
            {i > 0 && <br />}
            {line}
          </React.Fragment>
        ))
      : part
  );
}


const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userInput.trim()) return;

    const newMessage = { role: "user", content: userInput };
    const updatedChatHistory = [...chatHistory, newMessage];

    setChatHistory(updatedChatHistory);
    setUserInput("");

    try {
      const assistantResponse = await fetchOpenAIResponse(userInput);
      console.log(assistantResponse.msg); // Debugging response structure

      const responseMessage = assistantResponse.msg;

      setChatHistory([
        ...updatedChatHistory,
        { role: "assistant", content: responseMessage },
      ]);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching the assistant's response.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Chatbot for CDP</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "20px",
          height: "70vh",
          overflowY: "auto",
        }}
      >
        {chatHistory.map((message, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
          <p>
            <strong>{message.role === "user" ? "You" : "Assistant"}:</strong>
          </p>
          {message.role === "assistant" && message.content ? (
            <>
              {message.content.acknowledgment && (
                <p>
                  {formatString(message.content.acknowledgment)}
                </p>
              )}
              {message.content.direct_answer && (
                <p>
                  {formatString(message.content.direct_answer)}
                </p>
              )}
              {message.content.expand_with_context && (
                <p>
                  {formatString(message.content.expand_with_context)}
                </p>
              )}
              {message.content.mention_tools_resources && (
                <p>
                  {formatString(message.content.mention_tools_resources)}
                </p>
              )}
              {message.content.follow_up_invitation && (
                <p>
                  {formatString(message.content.follow_up_invitation)}
                </p>
              )}
            </>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
        
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: "calc(100% - 120px)",
            padding: "10px",
            marginRight: "16px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{ width: "80px", fontSize: "16px", padding: "10px" }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default App;
