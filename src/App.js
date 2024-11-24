import React, { useState } from "react";
import "./styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [settings, setSettings] = useState({
    autoCapitalize: true,
    addPunctuation: true,
    simplifyTerms: true,
    improveReadability: true,
    splitSentences: true,
    addTransitions: true,
    fixSpacing: true,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dicționar de înlocuiri
  const technicalToSimple = {
    utilizează: "folosește",
    implementare: "realizare",
    conectare: "legătură",
    facilități: "servicii",
    optimizează: "îmbunătățește",
    automatizare: "automatizare",
    "inteligență artificială": "AI",
    telemuncă: "muncă de la distanță",
    implementează: "folosește",
    funcționalitate: "opțiune",
    infrastructură: "sistem",
    metodologie: "mod de lucru",
    optimizare: "îmbunătățire",
    parametru: "setare",
    protocol: "regulă",
    specificație: "cerință",
    validare: "verificare",
    interfață: "ecran",
    utilizator: "persoană",
    procesare: "prelucrare",
  };

  const transitionPhrases = {
    startSentence: [
      "În plus",
      "Mai mult decât atât",
      "Pe de altă parte",
      "De asemenea",
      "Cu toate acestea",
      "În consecință",
      "Prin urmare",
      "Astfel",
      "Totuși",
      "În acest context",
    ],
    endSentence: [
      "în cele din urmă",
      "în final",
      "în concluzie",
      "în esență",
      "în ansamblu",
    ],
  };

  const humanizeText = (text) => {
    if (!text.trim()) return "";

    let humanized = text;

    if (settings.autoCapitalize) {
      humanized = humanized.replace(/(^\s*\w|[.!?]\s+\w)/g, (letter) =>
        letter.toUpperCase()
      );
    }

    if (settings.addPunctuation) {
      if (!/[.!?]$/.test(humanized)) {
        humanized += ".";
      }
      humanized = humanized.replace(/([.!?]),/g, "$1");
      humanized = humanized.replace(/([.!?])(?=\w)/g, "$1 ");
    }

    if (settings.simplifyTerms) {
      Object.entries(technicalToSimple).forEach(([technical, simple]) => {
        const regex = new RegExp(`\\b${technical}\\b`, "gi");
        humanized = humanized.replace(regex, simple);
      });
    }

    if (settings.splitSentences) {
      humanized = humanized.replace(
        /([^.!?]+?),\s*(și|dar|însă|deoarece|pentru că|astfel|totuși)\s+([^.!?]+)/g,
        "$1. $2 $3"
      );
    }

    if (settings.addTransitions) {
      humanized = humanized.replace(
        /\.\s+([A-ZĂÂÎȘȚ][^.!?]+?)([.!?])/g,
        (match, sentence, punctuation) => {
          const shouldAddTransition = Math.random() < 0.3;
          if (shouldAddTransition) {
            const transition =
              transitionPhrases.startSentence[
                Math.floor(
                  Math.random() * transitionPhrases.startSentence.length
                )
              ];
            return `. ${transition}, ${sentence.toLowerCase()}${punctuation}`;
          }
          return match;
        }
      );
    }

    if (settings.fixSpacing) {
      humanized = humanized
        .replace(/\s+/g, " ")
        .replace(/ ,/g, ",")
        .replace(/ \./g, ".")
        .replace(/ !/g, "!")
        .replace(/ \?/g, "?")
        .trim();
    }

    return humanized;
  };

  const handleHumanize = () => {
    setLoading(true);
    try {
      const result = humanizeText(inputText);
      setOutputText(result);
      setError("");

      setHistory((prev) =>
        [
          ...prev,
          {
            input: inputText,
            output: result,
            timestamp: new Date().toLocaleString("ro-RO"),
          },
        ].slice(-5)
      );
    } catch (err) {
      console.error(err);
      setError("A apărut o eroare la procesarea textului.");
      setOutputText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>
            <i className="fas fa-edit"></i> Umanizator de Text Inteligent
          </h1>
          <p>
            Transformă textul tehnic într-un limbaj mai accesibil și natural.
          </p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "editor" ? "active" : ""}`}
            onClick={() => setActiveTab("editor")}
          >
            <i className="fas fa-pencil-alt"></i> Editor
          </button>
          <button
            className={`tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <i className="fas fa-cog"></i> Setări
          </button>
        </div>

        {activeTab === "editor" ? (
          <div>
            <textarea
              className="textarea"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Introdu textul aici..."
            ></textarea>

            <button
              className="button"
              onClick={handleHumanize}
              disabled={!inputText.trim()}
            >
              Umanizează Textul
            </button>

            {loading && <div className="loader"></div>}

            {error && <div className="error">{error}</div>}

            {outputText && (
              <div className="output">
                <h2>Text Umanizat:</h2>
                <div className="output-text">{outputText}</div>
              </div>
            )}

            {history.length > 0 && (
              <div className="history">
                <h3>Istoric Transformări:</h3>
                {history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="timestamp">{item.timestamp}</div>
                    <div className="content">
                      <div>
                        <strong>Original:</strong>{" "}
                        {item.input.substring(0, 100)}
                        ...
                      </div>
                      <div>
                        <strong>Umanizat:</strong>{" "}
                        {item.output.substring(0, 100)}
                        ...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="settings">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="setting-item">
                <span>{key.split(/(?=[A-Z])/).join(" ")}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
