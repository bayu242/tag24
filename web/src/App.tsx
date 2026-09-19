import { useState } from "react";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { LandingPage } from "./LandingPage";
import { ParserPage } from "./parser/ParserPage";

function App() {
  const [encoded] = useState(() => new URLSearchParams(window.location.search).get("d"));

  return (
    <LanguageProvider>
      {encoded !== null ? <ParserPage encoded={encoded} /> : <LandingPage />}
    </LanguageProvider>
  );
}

export default App;
