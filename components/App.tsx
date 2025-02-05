import { useState } from "react";
import "./style/App.css";
import Aside from "./Aside";
import MineHtml from "./MineHtml";

const App: React.FC = () => {
  // useState-hook-ის გამოყენება, ინპუტის მნიშვნელობის შენახვისთვის
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardNumberMM, setCardNumberMM] = useState<string>("");
  const [cardNumberYY, setCardNumberYY] = useState<string>("");
  const [cardNumberCVC, setCardNumberCVC] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");

  return (
    <>
      <Aside
        cardNumber={cardNumber}
        cardNumberMM={cardNumberMM}
        cardNumberYY={cardNumberYY}
        cardNumberCVC={cardNumberCVC}
        cardName={cardName}
      />
      <MineHtml
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        cardNumberMM={cardNumberMM}
        setCardNumberMM={setCardNumberMM}
        cardNumberYY={cardNumberYY}
        setCardNumberYY={setCardNumberYY}
        cardNumberCVC={cardNumberCVC}
        setCardNumberCVC={setCardNumberCVC}
        cardName={cardName}
        setCardName={setCardName}
      />
    </>
  );
};

export default App;
