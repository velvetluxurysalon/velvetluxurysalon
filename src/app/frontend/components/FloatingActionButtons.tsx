import { useNavigate } from "react-router-dom";

export default function FloatingActionButtons() {
  const navigate = useNavigate();

  const whatsappNumber = "919345678646";
  const whatsappMessage = "Hi, I would like to inquire about your services!";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-[76px] lg:bottom-6 right-6 z-[999] flex flex-col gap-3 items-end">
      {/* Spin Wheel Button - Roulette/Spinning Wheel Icon */}
      <button
        onClick={() => navigate("/spin")}
        title="Try your luck with the spin wheel"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 active:scale-95 group"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="group-hover:rotate-12 transition-transform"
        >
          {/* Colorful spin wheel segments */}
          <path d="M 50 50 L 50 5 A 45 45 0 0 1 81.8 17.24 Z" fill="#FF6B6B" />
          <path d="M 50 50 L 81.8 17.24 A 45 45 0 0 1 95 50 Z" fill="#FFD93D" />
          <path d="M 50 50 L 95 50 A 45 45 0 0 1 81.8 82.76 Z" fill="#6BCB77" />
          <path d="M 50 50 L 81.8 82.76 A 45 45 0 0 1 50 95 Z" fill="#4D96FF" />
          <path d="M 50 50 L 50 95 A 45 45 0 0 1 18.2 82.76 Z" fill="#9D4EDD" />
          <path d="M 50 50 L 18.2 82.76 A 45 45 0 0 1 5 50 Z" fill="#FF6B9D" />
          <path d="M 50 50 L 5 50 A 45 45 0 0 1 18.2 17.24 Z" fill="#FFD93D" />
          <path d="M 50 50 L 18.2 17.24 A 45 45 0 0 1 50 5 Z" fill="#6BCB77" />
          {/* Center circle */}
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="white"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="6" fill="#FFD700" />
          {/* Outer circle border */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </button>

      {/* WhatsApp Button - Official WhatsApp CDN Icon */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 active:scale-95"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/240px-WhatsApp.svg.png"
          alt="WhatsApp"
          className="w-8 h-8"
        />
      </a>
    </div>
  );
}
