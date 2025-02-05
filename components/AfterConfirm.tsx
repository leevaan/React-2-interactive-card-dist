import style from "./style/AfterConfirm.module.css";
import icon from "../images/iconComplete.svg";

interface props {
  setConfirmOnOf: (value: boolean) => void;
}
export default function AfterConfirm({ setConfirmOnOf }: props) {
  const confirm = () => {
    setConfirmOnOf(false);
  };
  return (
    <section className={style.sec}>
      <img src={icon} alt="icons" />
      <h1>THANK YOU!</h1>
      <span>We’ve added your card details</span>
      <button onClick={confirm}>Continue</button>
    </section>
  );
}
