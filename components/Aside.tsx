import style from "./style/Aside.module.css";
import frontCard from "../images/bg-card-front.png";
import backCard from "../images/bg-card-back.png";
interface AsideProps {
  cardNumber: string;
  cardNumberMM: string;
  cardNumberYY: string;
  cardNumberCVC: string;
  cardName: string;
}
export default function Aside({
  cardNumber,
  cardNumberMM,
  cardNumberYY,
  cardNumberCVC,
  cardName,
}: AsideProps) {
  return (
    <aside>
      <div className={style.cardFront}>
        <img src={frontCard} alt="card back" width="447" height="245" />
        <span className={style.cardFrontNumber}>
          {cardNumber === "" ? "0000 0000 0000 0000" : cardNumber}
        </span>
        <div className={style.cardFrontInfo}>
          <span>{cardName === "" ? "JANE APPLESEED" : cardName}</span>
          <span>
            {cardNumberMM === "" ? "0" : cardNumberMM}
            <span>/</span>
            {cardNumberYY === "" ? "0" : cardNumberYY}
          </span>
        </div>
      </div>
      <div className={style.cardBack}>
        <img src={backCard} alt="card front" width="447" height="245" />
        <div className={style.cardBackNumber}>
          <span>{cardNumberCVC === "" ? "000" : cardNumberCVC}</span>
        </div>
      </div>
    </aside>
  );
}
