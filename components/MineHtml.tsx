import style from "./style/MineHtml.module.css";
import React, { useState, useRef, useEffect } from "react";
import AfterConfirm from "./AfterConfirm";
interface props {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardNumberMM: string;
  setCardNumberMM: (value: string) => void;
  cardNumberYY: string;
  setCardNumberYY: (value: string) => void;
  cardNumberCVC: string;
  setCardNumberCVC: (value: string) => void;
  cardName: string;
  setCardName: (value: string) => void;
}
export default function MineHtml({
  cardNumber,
  setCardNumber,
  cardNumberMM,
  setCardNumberMM,
  cardNumberYY,
  setCardNumberYY,
  cardNumberCVC,
  setCardNumberCVC,
  cardName,
  setCardName,
}: props) {
  //CARD NUMBER HOOK
  let inputCardNumberRef = useRef<HTMLInputElement | null>(null);
  const cardNumberAlertRef = useRef<HTMLSpanElement>(null);
  const backspaceNumberRef = useRef<boolean>(false);
  // Exp. Date (MM/YY) HOOK
  let inputExpDateMMRef = useRef<HTMLInputElement | null>(null);
  let inputExpDateYYRef = useRef<HTMLInputElement | null>(null);
  const expDateAlertRef = useRef<HTMLSpanElement>(null);
  //CVC HOOK
  let inputCVCRef = useRef<HTMLInputElement | null>(null);
  const cvcNumberAlertRef = useRef<HTMLSpanElement>(null);
  //Card Name HOOK
  let inputCardNameRef = useRef<HTMLInputElement | null>(null);
  const cardNameAlertRef = useRef<HTMLSpanElement>(null);
  // For Confirm
  const inputCountRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [confirmOnOf, setConfirmOnOf] = useState(false);

  const [alertRefs, setAlertRefs] = useState({
    cardNameAlertRef: false,
    cardNumberAlertRef: false,
    expDateAlertRef: false,
    cvcNumberAlertRef: false,
  });
  // cursorPosition
  const cursorPositionRef = useRef<number | null>(null); // კურსორის პოზიცია
  // ᲛᲔᲮᲛᲐᲠᲔᲑᲐ ᲒᲐᲕᲘᲒᲝ ᲛᲝᲮᲓᲐ ᲗᲣ ᲐᲠᲐ ᲪᲘᲤᲠᲔᲑᲘᲡ ᲠᲔᲓᲐᲥᲢᲘᲠᲔᲑᲐ ᲨᲣᲐ ᲜᲐᲬᲘᲚᲘᲓᲐᲜ ᲠᲐᲡᲐᲪ ᲛᲔᲠᲔ ᲔᲤᲔᲥᲢᲨᲘ ᲕᲘᲧᲔᲜᲔᲑ.
  const saveSpaceRef = useRef<boolean>(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    // თუ კლავიატურაზე დაჭერილი ღილაკი არ არის ციფრი, მაშინ აკრძალეთ შეყვანა
    if (
      !/^[0-9]$/.test(event.key) && // მხოლოდ ციფრებია ნებადართული
      event.key !== "Backspace" && // უკან წაშლის ნებადართვა
      event.key !== "ArrowLeft" && // მარცხნივ ისრის ნებადართვა
      event.key !== "ArrowRight" && // მარჯვნივ ისრის ნებადართვა
      target.id !== "cardName" &&
      event.key !== "Delete"
    ) {
      event.preventDefault(); // შეყვანის დაბლოკვა
    }

    //გავიგოთ მომხმარებელი შლის თუ არა შეყვანილ ციფრეს რაც გამოგვადგება სფეისების ჩაშენებაში.
    if (
      target.id === "cardNumber" && event.key === "Backspace" ||
      event.key === "Delete"
    ) {
      backspaceNumberRef.current = true;
    } else {
      backspaceNumberRef.current = false;
    }

    // input card Name filter
    if (!/^[a-zA-Z\s]*$/.test(event.key) && target.id === "cardName") {
      event.preventDefault(); // შეყვანის დაბლოკვა
    }

  };
  const alertCard = (
    input: React.RefObject<HTMLInputElement>,
    element: React.RefObject<HTMLSpanElement>,
    id: string,
    e: React.FormEvent<HTMLInputElement>,
    lastLength: number
  ) => {
    const target = e.target as HTMLInputElement;
    if (element.current && input.current) {
      if (target.id === id) {
        if (input.current.value.length < lastLength) {
          element.current.style.opacity = "1";
          target.style.borderColor = "#FF5050";
        } else {
          element.current.style.opacity = "0";
          target.style.borderColor = "#DFDEE0";
        }
      }
    }
  };

  // backCardNumber catd pattern
  const backCardNumber = (
    event: React.FormEvent<HTMLInputElement>,
    id: string,
    value: string,
    maxNumber: number,
    setCardNumber: (value: string) => void
  ) => {
    const target = event.target as HTMLInputElement;
    if (target.id === id) {
      // 2 ციფრზე მეტის ჩAწერის უფლება არ მისცეს მომხმარებელს
      if (value.length > maxNumber) return;

      setCardNumber(value);
    }
  };

  const cardNumberCounter = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    // ᲕᲖᲦᲣᲓᲐᲕ expDateMM ᲓᲐ expDateYY ᲕᲚᲘᲣᲡᲔᲑᲡ ᲗᲣ 12 ᲐᲜᲣ ᲗᲕᲔᲖᲔ ᲛᲔᲢᲘᲐ ᲓᲐ 31 ᲠᲘᲪᲮᲕᲖᲔ
    if (
      (target.id === "expDateMM" && Number(target.value) > 12) ||
      (target.id === "expDateYY" && Number(target.value) > 31)
    ) {
      return;
    }

    const targetValue = target.value;
    // ვიღებ ინპუტიდან ციფრებს, სფეისების გარეშე.
    const lengthWithoutSpaces = targetValue.replace(/\s+/g, "").length;
    // .replace(/(.{4})/g, "$1 "); //ყოველი 4 ციფრის მერე სფეისის გამოყენება.
    const addedSpace = targetValue.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ");

    if (target.id === "cardNumber") {
      if (lengthWithoutSpaces > 16) return;
      // ᲕᲣᲦᲔᲑ ᲙᲣᲠᲡᲝᲠᲘᲡ ᲚᲐᲘᲕ ᲞᲝᲖᲘᲪᲘᲐᲡ
      let cursorPositionOnInput = target.selectionStart;
      //  ᲗᲣ ᲑᲔᲥᲡᲞᲔᲘᲡᲘ ᲐᲜ ᲓᲘᲚᲘᲗᲘᲗ ᲐᲠ ᲘᲨᲚᲔᲑᲐ ᲢᲔᲥᲡᲢᲘ ᲓᲐ ᲘᲧᲝᲤᲐ ᲣᲜᲐᲨᲗᲝᲓ 4ᲖᲔ. (ᲠᲐᲪ ᲜᲘᲨᲜᲐᲕᲡ ᲧᲝᲕᲔᲚ ᲛᲔᲗᲮᲔ ᲪᲘᲤᲠᲡ ᲠᲝᲓᲔᲡᲐᲪ ᲬᲔᲠᲡ ᲛᲝᲛᲐᲮᲛᲐᲠᲔᲑᲔᲚᲘ ᲓᲐ ᲐᲠᲐ ᲩᲐᲬᲔᲠᲘᲚ ᲪᲘᲤᲠᲔᲑᲡ ᲨᲚᲘᲡ).
      if (inputCardNumberRef.current && lengthWithoutSpaces % 4 === 0 && !backspaceNumberRef.current) {
        // 16 ციფრის შემდეგ აღარ დაწეროს სფეისი
        if (lengthWithoutSpaces > 15) {
          // ᲗᲣ ᲨᲣᲐᲜᲐᲬᲘᲚᲘᲓᲐᲜ ᲛᲝᲘᲓᲝᲛᲐ ᲛᲝᲛᲮᲐᲠᲔᲑᲔᲚᲛᲐ ᲪᲘᲤᲠᲔᲑᲘᲡ ᲙᲝᲠᲔᲥᲢᲘᲠᲔᲑᲐ.
          if (cursorPositionOnInput && cursorPositionOnInput !== targetValue.length) {
            // ᲑᲝᲚᲝᲨᲘ ᲡᲤᲔᲘᲡᲘᲗ ᲛᲘᲦᲔᲑᲣᲚᲘ 16 ᲜᲘᲨᲜᲐ ᲠᲘᲪᲮᲕᲘᲡᲗᲕᲘᲡ ᲡᲤᲔᲘᲡᲘᲡ ᲬᲐᲨᲚᲐ. trim()
            setCardNumber(addedSpace.trim());
            // ᲬᲐᲨᲚᲐᲔ ᲬᲘᲗᲔᲚᲘ ᲐᲚᲔᲠᲢᲘ
            alertCard(inputCardNumberRef, cardNumberAlertRef, "cardNumber", event, 19);
          } else {
            // ᲗᲣ ᲙᲝᲠᲔᲥᲢᲘᲠᲔᲑᲘᲡ ᲒᲐᲠᲔᲨᲔ ᲩᲐᲘᲬᲔᲠᲐ ᲠᲘᲪᲮᲕᲔᲑᲘ ᲑᲝᲚᲝᲨᲘ ᲡᲤᲔᲘᲡᲘ ᲒᲐᲠᲔᲨᲔ ᲓᲐᲒᲔᲜᲔᲠᲘᲠᲔᲑᲐ.
            setCardNumber(targetValue);
            // ᲬᲐᲨᲚᲐᲔ ᲬᲘᲗᲔᲚᲘ ᲐᲚᲔᲠᲢᲘ
            alertCard(inputCardNumberRef, cardNumberAlertRef, "cardNumber", event, 19);
          }
          return;

        } else {
          // ᲗU ᲩᲐᲬᲔᲠᲘᲚᲘ ᲪᲘᲤᲠᲔᲑᲘ ᲜᲐᲙᲚᲔᲑᲘᲐ 16ᲖᲔ. ᲐᲜᲣ ᲛᲝᲛᲮᲛᲐᲠᲔᲑᲔᲚᲘ ᲐᲠᲔᲓᲐᲥᲢᲘᲠᲔᲑᲡ ᲨᲣᲘᲓᲐᲜ ᲪᲘᲤᲠᲔᲑᲡ
          if (cursorPositionOnInput && cursorPositionOnInput !== targetValue.length) {
            // ᲐᲠ ᲩᲐᲐᲛᲢᲐᲝᲡ ᲡᲤᲔᲘᲡᲘ ᲠᲝᲓᲔᲡᲐᲪ ᲠᲔᲓᲐᲥᲢᲘᲠᲔᲑᲐ ᲮᲓᲔᲑᲐ ᲪᲘᲤᲠᲔᲑᲘᲡ ᲨᲣᲐ ᲜᲐᲬᲘᲚᲘᲓᲐᲜ ᲓᲐ ᲪᲘᲤᲠᲔᲑᲘᲡ ᲚᲔᲜᲒᲡᲘ ᲐᲠᲘᲡ 9 ᲐᲜ 14ᲢᲝᲚᲘ ᲠᲐᲓᲒᲐᲜ ᲠᲝᲓᲔᲡᲐᲪ ᲛᲐᲠᲯᲕᲜᲘᲡ ᲒᲐᲦᲛᲝᲩᲜᲓᲔᲑᲐ 4 ᲪᲘᲤᲠᲘ ᲓᲐ ᲙᲣᲠᲡᲝᲠᲘ ᲘᲥᲜᲔᲑᲐ ᲐᲛ ᲝᲗᲮᲘ ᲪᲘᲤᲠᲘᲡ ᲬᲘᲜ ᲛᲐᲨᲘᲜ ᲛᲐᲠᲯᲕᲜᲘᲕ ᲩᲐᲔᲛᲐᲢᲔᲑᲐ ᲡᲪᲤᲔᲘᲡᲘ ᲠᲐᲪ ᲐᲠ ᲒᲕᲭᲘᲠᲓᲔᲑᲐ.
            if (targetValue.length !== 4 && targetValue.length !== 9 && targetValue.length !== 14) {
              // ᲕᲘᲛᲐᲮᲡᲝᲕᲠᲔᲑ ᲬᲘᲜᲐ ᲞᲝᲖᲘᲪᲘᲐᲡ ᲡᲐᲜᲐᲛ ᲡᲤᲔᲘᲡᲘᲡ ᲩᲐᲛᲐᲢᲔᲑᲐ ᲛᲝᲮᲓᲔᲑᲐ, ᲠᲐᲪ ᲛᲔᲮᲛᲐᲠᲔᲑᲐ ᲙᲣᲠᲡᲝᲠᲘᲡ ᲡᲐᲡᲣᲠᲕᲔᲚ ᲞᲝᲖᲘᲪᲘᲖᲔ ᲧᲝᲤᲜᲐᲨᲘ
              cursorPositionRef.current = cursorPositionOnInput;
              // ᲛᲔᲮᲛᲐᲠᲔᲑᲐ ᲒᲐᲕᲘᲒᲝ ᲛᲝᲮᲓᲐ ᲗᲣ ᲐᲠᲐ ᲪᲘᲤᲠᲔᲑᲘᲡ ᲠᲔᲓᲐᲥᲢᲘᲠᲔᲑᲐ ᲨᲣᲐ ᲜᲐᲬᲘᲚᲘᲓᲐᲜ ᲠᲐᲡᲐᲪ ᲛᲔᲠᲔ ᲔᲤᲔᲥᲢᲨᲘ ᲕᲘᲧᲔᲜᲔᲑ.
              saveSpaceRef.current = true;
              setCardNumber(targetValue.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim());
            } else {
              setCardNumber(targetValue);
            }
          } else {
            // ᲓᲐᲐᲛᲐᲢᲔ ᲪᲘᲤᲠᲔᲑᲘ ᲠᲝᲓᲔᲡᲐᲪ ᲨᲣᲐ ᲜᲐᲬᲘᲚᲨᲘ ᲐᲠ ᲮᲓᲔᲑᲐ ᲔᲓᲘᲗᲘ ᲛᲐᲨᲘᲜ. ᲐᲜᲣ ᲓᲐᲘᲬᲧᲔ ᲓᲐ ᲓᲐᲐᲡᲠᲣᲚᲔ ᲡᲤᲔᲘᲡᲘᲐᲜᲐᲓ.
            setCardNumber(addedSpace);
          }

        }
      } else {
        // ᲠᲝᲓᲔᲡᲐᲪ ᲐᲠ ᲣᲬᲔᲕᲡ ᲡᲤᲔᲘᲡᲘᲡ ᲩᲐᲬᲔᲠᲐ
        setCardNumber(targetValue);

      }
    }

    // Iput value MM
    backCardNumber(event, "expDateMM", targetValue, 2, setCardNumberMM);
    // Iput value YY
    backCardNumber(event, "expDateYY", targetValue, 2, setCardNumberYY);
    // Iput value CVC
    backCardNumber(event, "cvcNumber", targetValue, 3, setCardNumberCVC);
    // Iput card Name
    backCardNumber(event, "cardName", targetValue, 30, setCardName);


    // ᲘᲜᲞᲣᲢᲩᲕᲚᲘᲚᲔᲑᲘᲡ ᲓᲠᲝᲡ ᲚᲐᲘᲕ ᲠᲔᲟᲘᲛᲨᲘ ᲛᲝᲐᲮᲓᲘᲜᲝᲡ ᲐᲚᲔᲠᲢᲘᲡ, ᲬᲘᲗᲔᲚᲘ ᲮᲐᲖᲘᲡ ᲓᲐ ᲒᲐᲛᲐᲑᲠᲗᲮᲘᲚᲔᲑᲔᲚᲘ ᲢᲔᲥᲡᲢᲘᲡ ᲒᲐᲥᲠᲝᲛᲐ ᲗᲣ ᲞᲘᲠᲝᲑᲐ ᲓᲐᲙᲛᲐᲧᲝᲤᲘᲚᲓᲐ.
    // Card Name
    alertCard(inputCardNameRef, cardNameAlertRef, "cardName", event, 2);
    // Card Number
    alertCard(inputCardNumberRef, cardNumberAlertRef, "cardNumber", event, 19);
    // EXP.DATE MM
    alertCard(inputExpDateMMRef, expDateAlertRef, "expDateMM", event, 1);
    // EXP.DATE YY
    alertCard(inputExpDateYYRef, expDateAlertRef, "expDateYY", event, 1);
    // CVC
    alertCard(inputCVCRef, cvcNumberAlertRef, "cvcNumber", event, 3);
  };


  useEffect(() => {
    let targetValue = inputCardNumberRef.current?.value;

    if (targetValue && saveSpaceRef.current) {
      inputCardNumberRef.current?.setSelectionRange(cursorPositionRef.current ? cursorPositionRef.current + 1 : null, cursorPositionRef.current ? cursorPositionRef.current + 1 : null);
      saveSpaceRef.current = false;
    }

  }, [cardNumber]);


  // // ALERT catd pattern
  const alertCardFocuse = (
    input: React.RefObject<HTMLInputElement>,
    element: React.RefObject<HTMLSpanElement>,
    id: string,
    e: React.FocusEvent<HTMLInputElement>,
    lastLength: number
  ) => {
    if (element.current && input.current) {
      if (e.target.id === id) {
        if (input.current.value.length < lastLength) {
          element.current.style.opacity = "1";
          e.target.style.borderColor = "#FF5050";
        } else {
          element.current.style.opacity = "0";
          e.target.style.borderColor = "#DFDEE0";
        }
      }
    }
  };
  const focusLoss = (event: React.FocusEvent<HTMLInputElement>) => {
    // Card Name
    alertCardFocuse(inputCardNameRef, cardNameAlertRef, "cardName", event, 2);
    // Card Number
    alertCardFocuse(inputCardNumberRef, cardNumberAlertRef, "cardNumber", event, 19);
    // EXP.DATE MM
    alertCardFocuse(inputExpDateMMRef, expDateAlertRef, "expDateMM", event, 1);
    // EXP.DATE YY
    alertCardFocuse(inputExpDateYYRef, expDateAlertRef, "expDateYY", event, 1);
    // CVC
    alertCardFocuse(inputCVCRef, cvcNumberAlertRef, "cvcNumber", event, 3);
    // ავტომატურად დაუწეროსნულიანი წინ რიცხვს თუ 10ზე ნაკლებია MM and YY ინპუტებში.
    if (!Number.isNaN(event.target.value) && event.target.value.length === 1) {
      if (event.target.id === "expDateMM" && Number(event.target.value) < 10) {
        setCardNumberMM("0" + event.target.value);
      } else if (
        event.target.id === "expDateYY" &&
        Number(event.target.value) < 10
      ) {
        setCardNumberYY("0" + event.target.value);
      }
    }
  };

  // Confirm Button
  const clickConfirm = (event: React.MouseEvent<HTMLInputElement>) => {
    // იმიტომ რომ ბიძია დრაკი გაბრაზდება
    event.preventDefault();

    let count = 0;
    inputCountRefs.current.forEach((element) => {
      if (element) {
        // ვიღებ ჩემი შექმნილი ატრიბუტის მხოლოდ ველიუს და ვაკერებ რეფ სახლში რადგან მქონდეს ინპუტის შესაბამის სოანზე წვდომა.
        const datasetKeys = Object.values(element.dataset)[0];
        const alertRefName = `${datasetKeys}AlertRef`;
        if (element.value === "") {
          event.preventDefault();
          setAlertRefs((prev) => ({ ...prev, [alertRefName]: true }));
          element.style.borderColor = "#FF5050";
          setConfirmOnOf(false);
        } else if (
          (element.id === "cardName" && element.value.length < 2) ||
          (element.id === "cardNumber" && element.value.length < 19) ||
          (element.id === "cvcNumber" && element.value.length < 3)
        ) {
          event.preventDefault();
          setConfirmOnOf(false);
        } else {
          // ვითვლით რამდენი ინპუტი არის ვალიდური სულ 5 გვაქვს
          count++;
          setAlertRefs((prev) => ({ ...prev, [alertRefName]: false }));
          if (count === 5) {
            inputCountRefs.current.forEach((element) => {
              if (element) {
                setCardNumber("")
                setCardNumberMM("")
                setCardNumberYY("")
                setCardNumberCVC("")
                setCardName("")
              }
            });
            setConfirmOnOf(true);
          }
        }
      }
    });
  };


  return (
    <main className={style.Mmain}>
      {confirmOnOf ? (
        <AfterConfirm setConfirmOnOf={setConfirmOnOf} />
      ) : (
        <form autoComplete="on">
          <label htmlFor="cardName" style={{ marginTop: 0 }}>
            Cardholder Name
          </label>
          <input
            autoComplete="name"
            name="name"
            data-card-name="cardName"
            value={cardName}
            onKeyDown={handleKeyDown}
            onInput={cardNumberCounter}
            onBlur={focusLoss}
            type="text"
            id="cardName"
            placeholder="e.g. John Doe"
            ref={(el) => {
              inputCardNameRef.current = el;
              inputCountRefs.current[0] = el;
            }}
          />
          <span
            ref={cardNameAlertRef}
            style={{
              display: "block",
              opacity: alertRefs.cardNameAlertRef ? "1" : "0",
            }}
          >
            Card Number
          </span>
          <label htmlFor="cardNumber">Card Number</label>
          <input
            autoComplete="cc-number"
            name="cc-number"
            data-card-number="cardNumber"
            type="text"
            value={cardNumber}
            placeholder="e.g. 1234 5678 9123"
            onKeyDown={handleKeyDown}
            onInput={cardNumberCounter}
            onBlur={focusLoss}
            id="cardNumber"
            ref={(el) => {
              inputCardNumberRef.current = el;
              inputCountRefs.current[1] = el;
            }}
          />
          <span
            ref={cardNumberAlertRef}
            style={{
              opacity: alertRefs.cardNumberAlertRef ? "1" : "0",
            }}
          >
            Insufficient numbers
          </span>
          <div className={style.cardBackInfo}>
            <div>
              <div>
                <label htmlFor="expDateMM">Exp. Date (MM/YY)</label>
                <div className={style.alertTxt}>
                  <input
                    autoComplete="cc-exp-month"
                    name="cc-exp-month"
                    data-exp-date="expDate"
                    value={cardNumberMM}
                    onKeyDown={handleKeyDown}
                    onInput={cardNumberCounter}
                    onBlur={focusLoss}
                    type="text"
                    id="expDateMM"
                    className={style.expDateMM}
                    placeholder="MM"
                    ref={(el) => {
                      inputExpDateMMRef.current = el;
                      inputCountRefs.current[2] = el;
                    }}
                  />
                  <input
                    autoComplete="cc-exp-year"
                    name="cc-exp-year"
                    data-exp-date="expDate"
                    value={cardNumberYY}
                    onKeyDown={handleKeyDown}
                    onInput={cardNumberCounter}
                    onBlur={focusLoss}
                    type="text"
                    className={style.expDateYY}
                    placeholder="YY"
                    id="expDateYY"
                    ref={(el) => {
                      inputExpDateYYRef.current = el;
                      inputCountRefs.current[3] = el;
                    }}
                  />
                </div>
                <span
                  ref={expDateAlertRef}
                  style={{
                    opacity: alertRefs.expDateAlertRef ? "1" : "0",
                  }}
                >
                  Can’t be blank
                </span>
              </div>
              <div>
                <label htmlFor="cvcNumber">CVC</label>
                <input
                  autoComplete="cc-csc"
                  name="cc-csc"
                  data-cvc-number="cvcNumber"
                  value={cardNumberCVC}
                  onKeyDown={handleKeyDown}
                  onInput={cardNumberCounter}
                  onBlur={focusLoss}
                  type="text"
                  id="cvcNumber"
                  placeholder="e.g. 123"
                  ref={(el) => {
                    inputCVCRef.current = el;
                    inputCountRefs.current[4] = el;
                  }}
                />
                <span
                  ref={cvcNumberAlertRef}
                  style={{
                    opacity: alertRefs.cvcNumberAlertRef ? "1" : "0",
                  }}
                >
                  Can’t be blank
                </span>
              </div>
            </div>
          </div>
          <input
            className={style.submit}
            type="submit"
            defaultValue="Confirm"
            onClick={clickConfirm}
          />
        </form>
      )}
    </main>
  );
}
