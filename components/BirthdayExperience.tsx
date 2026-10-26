"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Gift, Heart, Music, Pause, Play, RotateCcw, Sparkles, Star, X } from "lucide-react";

type Scene = "opening" | "welcome" | "game" | "cake" | "gallery" | "letter" | "final";

const starMessages = [
  "You deserve a little extra happiness today. ♡",
  "May your days be filled with beautiful little moments.",
  "Never forget how much potential you have.",
  "Here's to more laughter and wonderful memories!",
  "And now... your birthday surprise awaits! ✨",
];

const photos = [
  { src: "/images/birthday/photo-1.jpg", caption: "A little moment to remember ♡" },
  { src: "/images/birthday/photo-2.jpg", caption: "A little reason to smile" },
  { src: "/images/birthday/photo-3.jpg", caption: "Keep this lovely energy ✨" },
  { src: "/images/birthday/photo-4.jpg", caption: "Collecting beautiful moments" },
  { src: "/images/birthday/photo-5.jpg", caption: "A little sunshine, just because" },
  { src: "/images/birthday/photo-6.jpg", caption: "Wishing you more days like this ♡" },
];

const sceneVariants = {
  initial: { opacity: 0, y: 16, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.28 } },
};

function StarField() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="star-field" aria-hidden="true">
      {Array.from({ length: 42 }, (_, i) => (
        <span
          key={i}
          className={`sky-star sky-star-${i % 4}`}
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 23 + 7) % 100}%`,
            animationDelay: `${(i % 9) * 0.37}s`,
            animationDuration: `${2.3 + (i % 5) * 0.55}s`,
          }}
        />
      ))}
      <div className={`moon ${reduceMotion ? "no-motion" : ""}`} />
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
    </div>
  );
}

function Button({
  children,
  onClick,
  secondary = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`button ${secondary ? "button-secondary" : "button-primary"} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default function BirthdayExperience() {
  const [scene, setScene] = useState<Scene>("opening");
  const [collected, setCollected] = useState<number[]>([]);
  const [lastStar, setLastStar] = useState<number | null>(null);
  const [candlesOut, setCandlesOut] = useState(false);
  const [openedLetter, setOpenedLetter] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [photoErrors, setPhotoErrors] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setMusicStarted(true);
        })
        .catch(() => {
          // Browser autoplay policy requires user gesture
        });
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0.5;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setMusicStarted(true);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    // 1. Try to autoplay right away when page mounts
    startMusic();

    // 2. Catch the very first interaction on window or document in capture phase
    const triggerAudio = () => {
      startMusic();
    };

    const gestureEvents = ["pointerdown", "touchstart", "mousedown", "click", "keydown"];
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, triggerAudio, { capture: true, passive: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, triggerAudio, { capture: true });
      });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const collectStar = (index: number) => {
    startMusic();
    if (collected.includes(index)) return;
    setCollected((previous) => [...previous, index]);
    setLastStar(index);
    window.setTimeout(() => setLastStar((current) => current === index ? null : current), 2600);
  };

  const reset = (target: Scene = "opening") => {
    setCollected([]);
    setLastStar(null);
    setCandlesOut(false);
    setOpenedLetter(false);
    setLightbox(null);
    setScene(target);
  };

  const goTo = (next: Scene) => {
    startMusic();
    setScene(next);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <main className={`experience scene-${scene}`}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src="/music.mp3"
        autoPlay
        loop
        playsInline
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setMusicStarted(true);
        }}
        onPause={() => setIsPlaying(false)}
      />
      <motion.button
        className={`music-btn ${isPlaying ? "is-playing" : ""}`}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
        title={isPlaying ? "Jeda musik: Nadin Amizah - Semua Aku Dirayakan" : "Putar musik: Nadin Amizah - Semua Aku Dirayakan"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="music-icon-wrap">
          {isPlaying ? <Pause size={14} /> : <Music size={14} />}
        </span>
        <span className="music-label">
          {isPlaying ? (
            <>
              <span className="music-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span>Semua Aku Dirayakan</span>
            </>
          ) : (
            <span>{musicStarted ? "Lanjutkan Musik ♪" : "Putar Musik ♪"}</span>
          )}
        </span>
      </motion.button>
      <div className="ambient-glow" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {scene === "opening" && (
          <motion.section key="opening" className="scene scene-dark opening-scene" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <StarField />
            <div className="scene-content opening-content">
              <div className="eyebrow"><Sparkles size={14} /> A LITTLE SOMETHING FOR YOU</div>
              <motion.div
                className="envelope-wrap"
                animate={reduceMotion ? {} : { y: [0, -8, 0], rotate: [0, 1, 0, -1, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => goTo("welcome")}
                style={{ cursor: "pointer" }}
                title="Buka Kejutan"
              >
                <div className="envelope-glow" />
                <div className="envelope">
                  <div className="envelope-back" />
                  <div className="letter-peek"><Heart size={24} fill="currentColor" /></div>
                  <div className="envelope-flap" />
                  <div className="envelope-front" />
                  <div className="seal"><Heart size={19} fill="currentColor" /></div>
                </div>
              </motion.div>
              <p className="script-label">just for you,</p>
              <h1 className="hero-title">A Little Birthday<br /><em>Surprise</em></h1>
              <p className="intro-copy">Someone prepared something special for you...</p>
              <Button onClick={() => goTo("welcome")}>Open Your Surprise <Heart size={16} /></Button>
              <div className="bottom-note">MADE WITH A LITTLE EXTRA CARE <span>✦</span></div>
            </div>
          </motion.section>
        )}

        {scene === "welcome" && (
          <motion.section key="welcome" className="scene scene-dark welcome-scene" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <StarField />
            <div className="scene-content welcome-content">
              <div className="tiny-orbit"><span>✦</span><span>✧</span><span>⋆</span></div>
              <p className="eyebrow">A LITTLE ADVENTURE AWAITS</p>
              <h1 className="hero-title">Hey, <em>Asyamsalsa!</em></h1>
              <p className="intro-copy wide-copy">Before your birthday surprise begins, there&apos;s a tiny adventure waiting for you.</p>
              <div className="welcome-note"><Star size={18} /> Five little stars. One little surprise. <Star size={18} /></div>
              <Button onClick={() => goTo("game")}>Let&apos;s Begin <Sparkles size={16} /></Button>
              <button className="text-back" onClick={() => goTo("opening")}><ArrowLeft size={14} /> Back</button>
            </div>
          </motion.section>
        )}

        {scene === "game" && (
          <motion.section key="game" className="scene scene-dark game-scene" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <StarField />
            <div className="game-top">
              <div className="eyebrow"><Sparkles size={14} /> YOUR LITTLE ADVENTURE</div>
              <div className="score-pill"><Star size={15} fill="currentColor" /> {collected.length}/5 STARS</div>
            </div>
            <div className="game-heading">
              <h1 className="section-title light-title">Collect the <em>little stars</em></h1>
              <p>Tap all five glowing stars to unlock your surprise.</p>
            </div>
            <div className="game-board">
              <div className="game-constellation" aria-hidden="true">✧ · ˚ ⋆ · ✦ · ˚ ✧</div>
              {[
                { x: "17%", y: "22%" }, { x: "73%", y: "18%" }, { x: "48%", y: "47%" }, { x: "24%", y: "70%" }, { x: "79%", y: "72%" },
              ].map((pos, index) => {
                const done = collected.includes(index);
                return (
                  <motion.button
                    key={index}
                    type="button"
                    aria-label={`Collect star ${index + 1}${done ? ", collected" : ""}`}
                    className={`collectible-star ${done ? "collected-star" : ""}`}
                    style={{ left: pos.x, top: pos.y }}
                    onClick={() => collectStar(index)}
                    disabled={done}
                    whileHover={done ? {} : { scale: 1.25, rotate: 12 }}
                    whileTap={done ? {} : { scale: 0.8 }}
                    animate={done ? { scale: 0.2, opacity: 0, rotate: 80 } : (reduceMotion ? {} : { y: [0, -9, 0], rotate: [0, 7, 0, -5, 0] })}
                    transition={done ? { duration: 0.35 } : { duration: 3 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
                  >
                    <Star size={34} fill="currentColor" strokeWidth={1.2} />
                    {!done && <span className="star-halo" />}
                  </motion.button>
                );
              })}
              {collected.length === 5 && (
                <motion.div className="game-complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="complete-icon"><Gift size={30} /></div>
                  <h2>You found them all!</h2>
                  <p>Your little surprise is ready, Asyamsalsa. ♡</p>
                  <Button onClick={() => goTo("cake")}>Unlock Your Surprise <ArrowRight size={16} /></Button>
                </motion.div>
              )}
            </div>
            {lastStar !== null && (
              <motion.div className="star-message" key={lastStar} initial={{ opacity: 0, y: 12, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}>
                <span className="message-sparkle">✦</span>{starMessages[lastStar]}
              </motion.div>
            )}
            <div className="game-footer">
              <p>{collected.length === 5 ? "A little magic, just for you ✨" : "Every little star has a little wish inside."}</p>
              <button className="text-back" onClick={() => goTo("welcome")}><ArrowLeft size={14} /> Go back</button>
            </div>
          </motion.section>
        )}

        {scene === "cake" && (
          <motion.section key="cake" className="scene scene-paper cake-scene" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="paper-decoration decor-star">✧</div><div className="paper-decoration decor-flower">✿</div><div className="paper-decoration decor-spark">⋆</div>
            {!candlesOut ? (
              <div className="scene-content cake-content">
                <p className="eyebrow paper-eyebrow"><Sparkles size={14} /> YOUR SPECIAL DAY</p>
                <h1 className="section-title">You did it, <em>Asyamsalsa!</em></h1>
                <p className="paper-copy">Take a little moment, close your eyes, and make a wish.</p>
                <div className="cake-illustration" role="img" aria-label="Illustration of a birthday cake with three lit candles">
                  <div className="cake-sparkle cake-sparkle-one">✦</div><div className="cake-sparkle cake-sparkle-two">✧</div>
                  <div className="candles">
                    {[0, 1, 2].map((c) => <div className="candle" key={c}><span className="flame" /><span className="wick" /></div>)}
                  </div>
                  <div className="cake-top"><span className="icing-drip drip-one" /><span className="icing-drip drip-two" /><span className="icing-drip drip-three" /><span className="icing-dot dot-one">✦</span><span className="icing-dot dot-two">♡</span><span className="icing-dot dot-three">✦</span></div>
                  <div className="cake-layer cake-layer-top" /><div className="cake-layer cake-layer-bottom" /><div className="cake-plate" />
                </div>
                <Button onClick={() => setCandlesOut(true)}>Blow Out the Candles <Sparkles size={16} /></Button>
                <p className="tiny-hint">Make a wish first. It&apos;s just between you and the stars. ♡</p>
              </div>
            ) : (
              <motion.div className="scene-content reveal-content" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="confetti-burst" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{["✦", "✧", "·", "♡"][i % 4]}</span>)}</div>
                <p className="eyebrow paper-eyebrow">TODAY IS ALL ABOUT YOU</p>
                <h1 className="birthday-title">Happy<br /><em>Birthday</em></h1>
                <p className="birthday-name">Asyamsalsa <span>♡</span></p>
                <p className="paper-copy reveal-copy">May this new chapter bring you happiness, wonderful memories, and countless reasons to smile.</p>
                <Button onClick={() => goTo("gallery")}>See Your Birthday Memories <ArrowRight size={16} /></Button>
              </motion.div>
            )}
          </motion.section>
        )}

        {scene === "gallery" && (
          <motion.section key="gallery" className="scene scene-paper gallery-scene" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="gallery-header">
              <p className="eyebrow paper-eyebrow"><Heart size={14} /> A LITTLE COLLECTION</p>
              <h1 className="section-title">A Few Little <em>Moments</em></h1>
              <p className="paper-copy">Six little snapshots to make today a little more special.</p>
              <div className="gallery-divider"><span>✦</span><span>♡</span><span>✦</span></div>
            </div>
            <div className="photo-grid">
              {photos.map((photo, index) => {
                const hasError = photoErrors.includes(index);
                return (
                  <motion.button
                    key={photo.src}
                    type="button"
                    className={`polaroid polaroid-${index + 1}`}
                    onClick={() => setLightbox(index)}
                    whileHover={{ y: -7, rotate: 0, scale: 1.025 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <div className={`photo-area ${hasError ? "photo-placeholder" : ""}`}>
                      {!hasError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo.src}
                          alt={`Birthday memory ${index + 1} for Asyamsalsa`}
                          loading="lazy"
                          onError={() => setPhotoErrors((prev) => prev.includes(index) ? prev : [...prev, index])}
                        />
                      ) : (
                        <div className="placeholder-content"><span className="placeholder-number">0{index + 1}</span><Heart size={26} /><span>Add your photo here</span><small>photo-{index + 1}.jpg</small></div>
                      )}
                      <span className="photo-open-hint">{hasError ? "ADD PHOTO ↗" : "VIEW PHOTO ↗"}</span>
                    </div>
                    <span className="polaroid-caption">{photo.caption}</span>
                    <span className="tape" aria-hidden="true" />
                  </motion.button>
                );
              })}
            </div>
            <p className="gallery-note"><Sparkles size={14} /> Little moments, lovely memories.</p>
            <Button onClick={() => goTo("letter")}>A Little Note for You <ArrowRight size={16} /></Button>
            <button className="text-back paper-back" onClick={() => goTo("cake")}><ArrowLeft size={14} /> Back to your cake</button>
            {lightbox !== null && (
              <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo preview" onClick={() => setLightbox(null)}>
                <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo preview"><X size={22} /></button>
                <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 5) % 6); }} aria-label="Previous photo"><ArrowLeft /></button>
                {photoErrors.includes(lightbox) ? (
                  <div className="lightbox-placeholder" onClick={(e) => e.stopPropagation()}>
                    <span className="placeholder-number">0{lightbox + 1}</span>
                    <Heart size={40} />
                    <p>Place your photo here</p>
                    <small>public/images/birthday/photo-{lightbox + 1}.jpg</small>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photos[lightbox].src} alt={`Birthday memory ${lightbox + 1}`} onClick={(e) => e.stopPropagation()} />
                )}
                <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % 6); }} aria-label="Next photo"><ArrowRight /></button>
                <p>{photos[lightbox].caption}</p>
              </div>
            )}
          </motion.section>
        )}

        {scene === "letter" && (
          <motion.section key="letter" className="scene scene-paper letter-scene" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="paper-decoration decor-flower letter-flower">✿</div><div className="paper-decoration letter-spark">✧</div>
            <div className="scene-content letter-content">
              <p className="eyebrow paper-eyebrow"><Heart size={14} /> A NOTE FROM THE HEART</p>
              <h1 className="section-title">A Little Note <em>for You</em></h1>
              {!openedLetter ? (
                <>
                  <p className="paper-copy">There&apos;s one more little thing I wanted to share with you.</p>
                  <motion.button className="letter-envelope" type="button" onClick={() => setOpenedLetter(true)} whileHover={{ y: -5, rotate: -1 }} whileTap={{ scale: 0.97 }} aria-label="Open your birthday letter">
                    <div className="letter-paper-peek"><Heart size={25} fill="currentColor" /></div>
                    <div className="letter-envelope-body" />
                    <div className="letter-envelope-flap" />
                    <div className="letter-wax">♡</div>
                  </motion.button>
                  <Button onClick={() => setOpenedLetter(true)}>Open Your Letter <Heart size={16} /></Button>
                </>
              ) : (
                <motion.article className="birthday-letter" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="letter-top-flower">✿</div>
                  <h2>Happy birthday, Asyamsalsa! <span>♡</span></h2>
                  <p>Semoga di usia yang baru ini, kamu semakin bahagia, dikelilingi orang-orang baik, dan dipertemukan dengan banyak hal yang membuatmu tersenyum.</p>
                  <p>Semoga semua hal yang sedang kamu usahakan perlahan menemukan jalannya. Kalau ada hari yang terasa berat, semoga selalu ada alasan kecil untuk membuatmu kembali semangat.</p>
                  <p>Terus jadi dirimu sendiri, terus tumbuh, dan jangan lupa menikmati hal-hal sederhana yang membuat hidup terasa menyenangkan.</p>
                  <p>I hope this little surprise brings a smile to your face and makes your birthday a little more special.</p>
                  <p className="letter-signoff">Have a wonderful birthday, Asyamsalsa! <span>♡</span></p>
                  <div className="letter-footer">A LITTLE WISH, JUST FOR YOU ✦</div>
                  <Button onClick={() => goTo("final")}>One Last Surprise <ArrowRight size={16} /></Button>
                </motion.article>
              )}
              <button className="text-back paper-back" onClick={() => goTo("gallery")}><ArrowLeft size={14} /> Back to your memories</button>
            </div>
          </motion.section>
        )}

        {scene === "final" && (
          <motion.section key="final" className="scene scene-final" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <StarField />
            <div className="final-flower final-flower-one">✿</div><div className="final-flower final-flower-two">✾</div>
            <div className="scene-content final-content">
              <div className="final-gift"><Gift size={43} strokeWidth={1.2} /><span>♡</span></div>
              <p className="eyebrow">ONE LAST LITTLE WISH</p>
              <h1 className="hero-title final-title">Keep shining,<br /><em>Asyamsalsa.</em></h1>
              <div className="final-divider"><span>✦</span><Heart size={15} fill="currentColor" /><span>✦</span></div>
              <p className="final-message">I hope this little surprise made you smile today.<br /><br />May your days ahead be filled with kindness, laughter, good people, and beautiful new memories.</p>
              <p className="final-signoff">Made with a little extra care, just for your special day. ♡</p>
              <div className="final-actions">
                <Button onClick={() => reset("opening")}><RotateCcw size={16} /> Replay My Surprise</Button>
                <Button secondary onClick={() => { setCollected([]); setLastStar(null); goTo("game"); }}><Star size={16} /> Back to the Stars</Button>
              </div>
              <div className="bottom-note final-bottom">HAPPY BIRTHDAY <span>✦</span> ASYAMSALSA</div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="scene-progress" aria-label={`Scene ${["opening", "welcome", "game", "cake", "gallery", "letter", "final"].indexOf(scene) + 1} of 7`}>
        {(["opening", "welcome", "game", "cake", "gallery", "letter", "final"] as Scene[]).map((item) => (
          <span key={item} className={scene === item ? "progress-active" : ""} />
        ))}
      </div>
    </main>
  );
}
