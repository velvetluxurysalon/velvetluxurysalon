import { useEffect, useState } from "react";
import { getOfferText } from "../services/contentService";

export default function OfferScroller() {
  const [offerText, setOfferText] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const loadOfferText = async () => {
      try {
        const offer = await getOfferText();
        if (offer && offer.isActive) {
          setOfferText(offer.text);
          setIsActive(true);
        }
      } catch (error) {
        console.error("Error loading offer text:", error);
      }
    };

    loadOfferText();
  }, []);

  if (!isActive || !offerText) {
    return null;
  }

  return (
    <div className="bg-slate-50 border-b border-slate-100 overflow-hidden relative h-5">
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .offer-scroll {
          animation: scroll 50s linear infinite;
          display: inline-block;
          white-space: nowrap;
          padding-right: 0;
          animation-delay: -25s;
        }
        .offer-scroll > p {
          margin: 0;
          padding: 0;
          line-height: 1.25;
          display: inline;
        }
        .offer-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="overflow-hidden relative h-full flex items-center">
        <div className="offer-scroll">
          <p className="text-[10px] font-medium text-slate-600 uppercase tracking-tight">
            ✨ {offerText} ✨ {offerText} ✨ {offerText} ✨ {offerText} ✨{" "}
            {offerText} ✨ {offerText} ✨
          </p>
          <p className="text-[10px] font-medium text-slate-600 uppercase tracking-tight">
            ✨ {offerText} ✨ {offerText} ✨ {offerText} ✨ {offerText} ✨{" "}
            {offerText} ✨ {offerText} ✨
          </p>
        </div>
      </div>

      {/* Fade effect on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
    </div>
  );
}
