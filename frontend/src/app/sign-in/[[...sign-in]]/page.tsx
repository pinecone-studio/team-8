import { SignIn } from "@clerk/nextjs";

const LeftBracket = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 14 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="balloonL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8c0ff" />
        <stop offset="30%" stopColor="#7097e0" />
        <stop offset="65%" stopColor="#395acf" />
        <stop offset="100%" stopColor="#091294" />
      </linearGradient>
      <linearGradient id="shineL" x1="20%" y1="0%" x2="60%" y2="60%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id="dropL" x="-30%" y="-20%" width="160%" height="140%">
        <feDropShadow
          dx="1.5"
          dy="3"
          stdDeviation="1.5"
          floodColor="#091294"
          floodOpacity="0.45"
        />
      </filter>
    </defs>
    <path
      d="M5.11038 2.76848L0.806264 10.8246C0.269142 11.8328 0 12.9394 0 14.0474C0 15.1556 0.269142 16.2619 0.806264 17.2702L5.11038 25.3265C5.9037 26.8145 7.45516 27.7439 9.14352 27.7439H13.7153V25.4617H13.7138C12.8704 25.4617 12.0946 24.9977 11.6979 24.2538L7.39543 16.196C7.03585 15.5243 6.85665 14.7867 6.85665 14.0474C6.85665 13.3081 7.03585 12.5705 7.39543 11.899L11.6979 3.84121C12.0946 3.09711 12.8704 2.63325 13.7138 2.63325H13.7153V0.350922H9.14352C7.45516 0.350922 5.9037 1.28046 5.11038 2.76848Z"
      fill="url(#balloonL)"
      filter="url(#dropL)"
    />
    <path
      d="M5.11038 2.76848L0.806264 10.8246C0.269142 11.8328 0 12.9394 0 14.0474C0 15.1556 0.269142 16.2619 0.806264 17.2702L5.11038 25.3265C5.9037 26.8145 7.45516 27.7439 9.14352 27.7439H13.7153V25.4617H13.7138C12.8704 25.4617 12.0946 24.9977 11.6979 24.2538L7.39543 16.196C7.03585 15.5243 6.85665 14.7867 6.85665 14.0474C6.85665 13.3081 7.03585 12.5705 7.39543 11.899L11.6979 3.84121C12.0946 3.09711 12.8704 2.63325 13.7138 2.63325H13.7153V0.350922H9.14352C7.45516 0.350922 5.9037 1.28046 5.11038 2.76848Z"
      fill="url(#shineL)"
    />
  </svg>
);

const RightBracket = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 14 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="balloonR" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a8c0ff" />
        <stop offset="30%" stopColor="#7097e0" />
        <stop offset="65%" stopColor="#395acf" />
        <stop offset="100%" stopColor="#091294" />
      </linearGradient>
      <linearGradient id="shineR" x1="80%" y1="0%" x2="40%" y2="60%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id="dropR" x="-30%" y="-20%" width="160%" height="140%">
        <feDropShadow
          dx="-1.5"
          dy="3"
          stdDeviation="1.5"
          floodColor="#091294"
          floodOpacity="0.45"
        />
      </filter>
    </defs>
    <path
      d="M8.88962 2.76848L13.1937 10.8246C13.7309 11.8328 14 12.9394 14 14.0474C14 15.1556 13.7309 16.2619 13.1937 17.2702L8.88962 25.3265C8.0963 26.8145 6.54484 27.7439 4.85648 27.7439H0.284668V25.4617H0.286224C1.12962 25.4617 1.90541 24.9977 2.30212 24.2538L6.60457 16.196C6.96415 15.5243 7.14335 14.7867 7.14335 14.0474C7.14335 13.3081 6.96415 12.5705 6.60457 11.899L2.30212 3.84121C1.90541 3.09711 1.12962 2.63325 0.286224 2.63325H0.284668V0.350922H4.85648C6.54484 0.350922 8.0963 1.28046 8.88962 2.76848Z"
      fill="url(#balloonR)"
      filter="url(#dropR)"
    />
    <path
      d="M8.88962 2.76848L13.1937 10.8246C13.7309 11.8328 14 12.9394 14 14.0474C14 15.1556 13.7309 16.2619 13.1937 17.2702L8.88962 25.3265C8.0963 26.8145 6.54484 27.7439 4.85648 27.7439H0.284668V25.4617H0.286224C1.12962 25.4617 1.90541 24.9977 2.30212 24.2538L6.60457 16.196C6.96415 15.5243 7.14335 14.7867 7.14335 14.0474C7.14335 13.3081 6.96415 12.5705 6.60457 11.899L2.30212 3.84121C1.90541 3.09711 1.12962 2.63325 0.286224 2.63325H0.284668V0.350922H4.85648C6.54484 0.350922 8.0963 1.28046 8.88962 2.76848Z"
      fill="url(#shineR)"
    />
  </svg>
);

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Unbounded:wght@400;700;900&display=swap');

        /* ── single horizontal sweep ── */
        @keyframes sweepH {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        .sweep-h {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: #395acf;
          animation: sweepH 5s linear infinite;
          pointer-events: none;
          filter: drop-shadow(0 0 4px rgba(9,18,148,0.6));
        }

        /* ── float ── */
        @keyframes floatBig  { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-20px) rotate(2deg)} }
        @keyframes floatSm   { 0%,100%{transform:translateY(0) rotate(4deg)}  50%{transform:translateY(-13px) rotate(-2deg)} }
        @keyframes floatTiny { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-9px) rotate(3deg)} }
        .float-big  { animation: floatBig  7s ease-in-out infinite; }
        .float-sm   { animation: floatSm   5.5s ease-in-out infinite; animation-delay:-2s; }
        .float-tiny { animation: floatTiny 4.5s ease-in-out infinite; animation-delay:-1s; }

        /* ── page enter ── */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .enter-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .enter-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .enter-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both; }

        /* ── Clerk ── */
        .cl-rootBox { font-family:'DM Mono',monospace !important; }
        .cl-card {
          background: rgba(255,255,255,0.97) !important;
          border: 1px solid rgba(57,90,207,0.14) !important;
          box-shadow:
            0 0 0 6px rgba(112,151,224,0.05),
            0 24px 80px rgba(9,18,148,0.09),
            0 4px 20px rgba(57,90,207,0.06) !important;
          border-radius: 20px !important;
        }
        .cl-headerTitle {
          font-family:'Unbounded',sans-serif !important;
          font-weight:900 !important; color:#091294 !important;
          font-size:20px !important; letter-spacing:-0.03em !important;
        }
        .cl-headerSubtitle {
          font-family:'DM Mono',monospace !important;
          color:#7097e0 !important; font-size:11px !important;
        }
        .cl-formButtonPrimary {
          background: #395acf !important;
          font-family:'DM Mono',monospace !important; font-weight:500 !important;
          letter-spacing:0.07em !important; border-radius:10px !important;
          box-shadow:0 6px 24px rgba(9,18,148,0.28) !important; border:none !important;
          transition: all 0.2s !important;
        }
        .cl-formButtonPrimary:hover {
          background: #7097e0 !important;
          transform:translateY(-1px) !important;
        }
        .cl-formFieldInput {
          font-family:'DM Mono',monospace !important;
          background:rgba(112,151,224,0.05) !important;
          border:1.5px solid rgba(57,90,207,0.2) !important;
          border-radius:10px !important; color:#091294 !important;
          transition: all 0.2s !important;
        }
        .cl-formFieldInput:focus {
          border-color:#395acf !important;
          box-shadow:0 0 0 3px rgba(57,90,207,0.12) !important;
        }
        .cl-formFieldLabel {
          font-family:'DM Mono',monospace !important; color:#395acf !important;
          font-size:10px !important; letter-spacing:0.1em !important;
          text-transform:uppercase !important; font-weight:500 !important;
        }
        .cl-footerActionLink { color:#395acf !important; font-family:'DM Mono',monospace !important; }
        .cl-footerActionText { color:rgba(9,18,148,0.4) !important; font-family:'DM Mono',monospace !important; }
        .cl-dividerLine { background:rgba(57,90,207,0.12) !important; }
        .cl-dividerText { color:rgba(57,90,207,0.45) !important; font-family:'DM Mono',monospace !important; }
        .cl-socialButtonsBlockButton {
          border:1.5px solid rgba(57,90,207,0.18) !important;
          background:rgba(112,151,224,0.04) !important;
          color:#091294 !important; font-family:'DM Mono',monospace !important;
          border-radius:10px !important; transition: all 0.2s !important;
        }
        .cl-socialButtonsBlockButton:hover {
          background:rgba(57,90,207,0.08) !important;
          border-color:#395acf !important; transform:translateY(-1px) !important;
        }
      `}</style>

      {/* ── BIG grid — 120px cells, thin 1px lines ── */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* ── content ── */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* wordmark */}
        <div className="enter-1 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <LeftBracket className="w-[32px] h-auto" />

            <RightBracket className="w-[32px] h-auto" />
          </div>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 28,
                height: 1,
                background: "#7097e0",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: "#395acf",
                letterSpacing: "0.28em",
                opacity: 0.7,
              }}
            >
              EMPLOYEE PORTAL
            </span>
            <div
              style={{
                width: 28,
                height: 1,
                background: "#7097e0",
              }}
            />
          </div>
        </div>

        {/* Clerk */}
        <div className="enter-2">
          <SignIn
            path="/sign-in"
            routing="path"
            withSignUp={false}
            fallbackRedirectUrl="/"
          />
        </div>

        <p
          className="enter-3"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "rgba(9,18,148,0.2)",
            letterSpacing: "0.14em",
          }}
        >
          © {new Date().getFullYear()} PINECONE — INTERNAL USE ONLY
        </p>
      </div>
    </main>
  );
}
