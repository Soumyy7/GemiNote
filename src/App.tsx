/* eslint-disable prefer-const */
import "./App.css";
import { useState, useEffect } from "react";
import generateContent from "./test.ts";

function App() {
  const [text, setText] = useState("Waiting for generating Text");
  const [isTextUpdated, setIsTextUpdated] = useState(false);
  const [checker, setChecker] = useState(false);

  const askGeminiWithTweet = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript<string[], string>(
      {
        target: { tabId: tab.id! },
        func: () => {
          const tweetText = document.querySelector(
            'div[data-testid="tweetText"] span.css-1jxf684'
          ) as HTMLElement;
          return tweetText?.innerText || "No tweet found";
        },
      },
      async (result) => {
        if (result[0]?.result) {
          const originalTweet = result[0].result;

          const response = await generateContent(originalTweet);
          setText(response);
          setIsTextUpdated(true);
        } else {
          console.error("Unable to retrieve tweet text");
        }
      }
    );
  };

  useEffect(() => {
    const appendToTweet = async () => {
      let [tab] = await chrome.tabs.query({ active: true });

      chrome.scripting.executeScript<string[], void>({
        target: { tabId: tab.id! },
        args: [text],
        func: (text) => {
          const tweetText = document.querySelector(
            'div[data-testid="tweetText"]'
          );
          if (tweetText) {
            const responseElement = document.createElement("div");

            const titleElement = document.createElement("span");
            titleElement.textContent = "Gemini's Community Note:";
            titleElement.style.fontWeight = "bold";
            titleElement.style.color = "#1DA1F2";

            const contentElement = document.createElement("span");
            contentElement.textContent = text;
            contentElement.style.color = "#1DA1F2";
            contentElement.style.fontSize = "14px";

            responseElement.appendChild(titleElement);
            responseElement.appendChild(document.createElement("br"));
            responseElement.appendChild(contentElement);

            responseElement.style.marginTop = "10px";
            responseElement.style.padding = "10px";
            responseElement.style.border = "1px solid rgba(29, 155, 240, 0.5)";
            responseElement.style.borderRadius = "12px";
            responseElement.style.backgroundColor = "rgba(29, 155, 240, 0.1)";
            responseElement.style.fontFamily =
              "'TwitterChirp', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

            tweetText.appendChild(responseElement);
            console.log("Response with border appended successfully!");
          }
        },
      });

      setIsTextUpdated(false);
      setChecker(true);
    };

    if (isTextUpdated) {
      appendToTweet();
    }
  }, [text, isTextUpdated]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GemiNote</h1>
        <p>Powered by Gemini AI</p>
      </header>

      <div className="card">
        <button onClick={askGeminiWithTweet}>
          {checker ? "Gemini has Answered!" : "Ask Gemini?"}
        </button>
      </div>

      <div className="made-with-love">
        <p>Built with ❤️ for fact-checking tweets</p>
      </div>

      <footer className="developer-info">
        <p className="name">
          <a
            href="https://soumyportfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Soumy Prajapati
          </a>
        </p>
        <div className="contact-links">
          <p>
            <a
              href="https://github.com/soumyy7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </p>
          <p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=symbols.soumy7@gmail.com"
              target="_blank"
            >
              Mail
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
