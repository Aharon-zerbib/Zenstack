"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Mail, Github, Linkedin } from "lucide-react";

import crmPng from "./img/image.png";
import ninaPng from "./img/Nina.png";

// --- COMPOSANT : SUIVI DE SOURIS (GLOW) ---
const MouseGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ left: springX, top: springY }}
      className="pointer-events-none fixed z-0 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
    </motion.div>
  );
};

// --- COMPOSANT : SKILL ICON ---
const SkillIcon = ({ src, alt, href }: { src: string; alt: string; href: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    whileHover={{ y: -5, scale: 1.1 }}
    className="relative group p-3 rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-sm hover:border-blue-500/50 transition-colors"
  >
    {/* Using raw <img> for third-party icons (allowed) */}
    <img
      src={src.replace("github.com/tandpfun/skill-icons/blob/main/icons", "raw.githubusercontent.com/tandpfun/skill-icons/main/icons")}
      alt={alt}
      className="w-10 h-10 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
    />
  </motion.a>
);

// --- COMPONENTS UI ---
const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle: string }) => (
  <div className="mb-12 space-y-4">
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500"
    >
      {subtitle}
    </motion.span>
    <motion.h2 className="text-4xl md:text-5xl font-light tracking-tight">{children}</motion.h2>
  </div>
);

export default function Home() {
  const [isNinaOpen, setIsNinaOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasPushedHistory = useRef(false);
  const closedFromPop = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isNinaOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isNinaOpen]);

  // Masquer la nav lors du scroll vers le bas, réafficher au scroll vers le haut
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      // Ignore small scrolls
      if (Math.abs(current - lastScrollY.current) < 10) return;
      if (current > lastScrollY.current && current > 50) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isNinaOpen) {
      if (!hasPushedHistory.current) {
        window.history.pushState({ modal: "nina" }, "");
        hasPushedHistory.current = true;
      }
      const handlePop = () => {
        if (hasPushedHistory.current) {
          closedFromPop.current = true;
          setIsNinaOpen(false);
        }
      };
      window.addEventListener("popstate", handlePop);
      return () => window.removeEventListener("popstate", handlePop);
    }

    if (hasPushedHistory.current) {
      if (!closedFromPop.current) {
        window.history.back();
      }
      hasPushedHistory.current = false;
      closedFromPop.current = false;
    }
  }, [isNinaOpen]);

  const handleNinaOpen = () => {
    if (isMobile) {
      setIsNinaOpen(true);
      return;
    }
    window.open("https://nina-carducci-rosy.vercel.app", "_blank", "noopener,noreferrer");
  };
  return (
    <div className="relative min-h-screen bg-[#030303] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <MouseGlow />
      <div className="fixed inset-0 z-99 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* NAV */}
      <nav className={`fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 backdrop-blur-md border-b border-white/5 transition-transform duration-1500 ${navHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="flex items-center gap-3">
          <img src="/image.png" alt="Zenstack logo" className="h-15 w-15 md:h-15 md:w-15 object-contain" />
          <span className="text-2xl font-medium tracking-tighter">Zenstack</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-light text-white/60">
          <a href="#skills" className="hover:text-white transition-colors">Stack</a>
          {/*<a href="#services" className="hover:text-white transition-colors">Services</a>*/}
          <a href="#projets" className="hover:text-white transition-colors">Projets</a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO */}
        <section className="relative h-screen flex flex-col justify-center px-6 md:px-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl">
            <h1 className="text-6xl md:text-[120px] font-light leading-[0.9] tracking-tighter mb-8">
              Développeur <br /><span className="text-blue-500 italic"> Full-stack.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/50 max-w-2xl font-light leading-relaxed">
              
              Je conçois des applications modernes, rapides et intuitives, pensées pour offrir une expérience utilisateur fluide .
            </p>
          </motion.div>
        </section>

        {isNinaOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-0">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsNinaOpen(false)} />
            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-5xl h-full md:h-[85vh] bg-[#050505] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3 bg-white/5 backdrop-blur-sm border-b border-white/10">
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400">Preview mobile-friendly</span>
                  <span className="text-base font-medium">Nina Carducci</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://nina-carducci-rosy.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:inline-flex text-xs font-semibold uppercase tracking-wide bg-white text-black px-3 py-2 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    Ouvrir dans un onglet
                  </a>
                  <button
                    onClick={() => setIsNinaOpen(false)}
                    aria-label="Fermer la previsualisation"
                    className="inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wide bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
                  >
                    Retour
                  </button>
                </div>
              </div>
              <iframe src="https://nina-carducci-rosy.vercel.app" title="Nina - Preview" className="flex-1 w-full border-0" />
            </div>
          </div>
        )}

        {/* SKILLS SECTION (Nouveau) */}
        <section id="skills" className="py-32 px-6 md:px-24 bg-white/1 border-y border-white/5 backdrop-blur-sm">
          <SectionTitle subtitle="Technos">Maîtrise & Apprentissage</SectionTitle>
          
          <div className="space-y-16">
            {/* Mastered */}
            <div>
              <h3 className="text-xl font-light mb-8 text-white/80 flex items-center gap-3">
                <div className="h-px w-8 bg-blue-500" /> Skills
              </h3>
              <div className="flex flex-wrap gap-4">
                <SkillIcon alt="HTML" src="https://github.com/tandpfun/skill-icons/blob/main/icons/HTML.svg" href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5" />
                <SkillIcon alt="CSS3" src="https://github.com/tandpfun/skill-icons/blob/main/icons/CSS.svg" href="https://www.w3.org/TR/CSS/#css" />
                <SkillIcon alt="Sass" src="https://github.com/tandpfun/skill-icons/blob/main/icons/Sass.svg" href="https://sass-lang.com/" />
                <SkillIcon alt="JS" src="https://github.com/tandpfun/skill-icons/blob/main/icons/JavaScript.svg" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" />
                <SkillIcon alt="TS" src="https://github.com/tandpfun/skill-icons/blob/main/icons/TypeScript.svg" href="https://www.typescriptlang.org/" />
                <SkillIcon alt="React" src="https://github.com/tandpfun/skill-icons/blob/main/icons/React-Dark.svg" href="https://reactjs.org/" />
                <SkillIcon alt="Next" src="https://github.com/tandpfun/skill-icons/blob/main/icons/NextJS-Dark.svg" href="https://nextjs.org/" />
                <SkillIcon alt="Laravel" src="https://github.com/tandpfun/skill-icons/blob/main/icons/Laravel-Dark.svg" href="https://laravel.com/docs" />
                <SkillIcon alt="PHP" src="https://github.com/tandpfun/skill-icons/blob/main/icons/PHP-Dark.svg" href="https://www.php.net/docs.php" />
                <SkillIcon alt="MySQL" src="https://github.com/tandpfun/skill-icons/blob/main/icons/MySQL-Dark.svg" href="https://dev.mysql.com/doc/" />
                <SkillIcon alt="Tailwind" src="https://github.com/tandpfun/skill-icons/blob/main/icons/TailwindCSS-Dark.svg" href="https://tailwindcss.com/" />
                <SkillIcon alt="Vite" src="https://github.com/tandpfun/skill-icons/blob/main/icons/Vite-Dark.svg" href="https://vitejs.dev/" />
                <SkillIcon alt="MongoDB" src="https://github.com/tandpfun/skill-icons/blob/main/icons/MongoDB.svg" href="https://www.mongodb.com" />
                <SkillIcon alt="Git" src="https://github.com/tandpfun/skill-icons/blob/main/icons/Git.svg" href="https://git-scm.com/" />
                <SkillIcon alt="Figma" src="https://github.com/tandpfun/skill-icons/blob/main/icons/Figma-Dark.svg" href="https://www.figma.com/" />
              </div>
            </div>

            {/* Learning & Backend */}
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-xl font-light mb-8 text-white/80 flex items-center gap-3">
                  <div className="h-px w-8 bg-blue-500" /> Learning 
                </h3>
                <div className="flex flex-wrap gap-4">
                  <SkillIcon alt="Angular" src="https://github.com/tandpfun/skill-icons/blob/main/icons/Angular-Dark.svg" href="https://angular.dev/overview" />
                  <SkillIcon alt="Python" src="https://github.com/tandpfun/skill-icons/blob/main/icons/Python-Dark.svg" href="https://www.python.org/doc/" />
                  <SkillIcon alt="Node" src="https://github.com/tandpfun/skill-icons/blob/main/icons/NodeJS-Dark.svg" href="https://nodejs.org" />
                  <SkillIcon alt="C" src="https://github.com/tandpfun/skill-icons/blob/main/icons/C.svg" href="https://devdocs.io/c/" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-light mb-8 text-white/80 flex items-center gap-3">
                  <div className="h-px w-8 bg-blue-500" /> Graph & 3D
                </h3>
                <div className="flex flex-wrap gap-4">
                  <SkillIcon alt="Blender" src="https://github.com/tandpfun/skill-icons/blob/main/icons/Blender-Dark.svg" href="https://www.blender.org" />
                  <SkillIcon alt="Unreal" src="https://github.com/tandpfun/skill-icons/blob/main/icons/UnrealEngine.svg" href="https://www.unrealengine.com" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJETS */}
        <section id="projets" className="py-32 px-6 md:px-24">
          <SectionTitle subtitle="Portfolio">Sélection de travaux</SectionTitle>
          <div className="space-y-32">
            {[1, 2].map((item) => (
              <motion.div key={item} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 overflow-hidden rounded-2xl aspect-video bg-zinc-800 border border-white/5">
                  {item === 1 ? (
                    <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                      <img src={crmPng} alt="E-commerce de Luxe" className="object-cover w-full h-full" />
                    </div>
                  ) : item === 2 ? (
                    <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                      <img src={ninaPng} alt="Nina - Projet" className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-900/40 to-zinc-900 group-hover:scale-105 transition-transform duration-700" />
                  )}
                </div>
                <div className="md:col-span-5 space-y-6">
                  {item === 1 ? (
                    <>
                      <span className="text-sm font-mono text-blue-500">01 / LARAVEL + INERTIA + TYPESCRIPT + MYSQL</span>
                      <h3 className="text-4xl font-light text-white">CRM pour les Micro-entreprise</h3>
                      <button className="flex items-center gap-2 text-sm font-bold uppercase border-b border-blue-500 pb-2"> En face de Développement   </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-mono text-blue-500">02 / REACT </span>
                      <h3 className="text-4xl font-light text-white">Nina Carducci</h3>
                      <button onClick={handleNinaOpen} className="inline-flex items-center gap-2 text-sm font-bold uppercase border-b border-blue-500 pb-2">
                        Explorer <ArrowRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-32 px-6 md:px-24 border-t border-white/5 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-light tracking-tighter mb-12"
          >
            Prêt pour le <span className="text-blue-500 italic">Next level ?</span>
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {/* Email */}
            <a href="mailto:contact @zenstack.fr" className="flex items-center gap-3 text-xl md:text-2xl font-light hover:text-blue-500 transition-colors group">
              <Mail className="group-hover:scale-110 transition-transform" /> 
              contact @zenstack.fr 
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/aharon-zerbib-911bb6276/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 text-xl md:text-2xl font-light hover:text-blue-500 transition-colors group"
            >
              <Linkedin className="group-hover:scale-110 transition-transform" /> 
              LinkedIn
            </a>

            {/* GitHub */}
            <a 
              href="https://github.com/Aharon-zerbib" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 text-xl md:text-2xl font-light hover:text-blue-500 transition-colors group"
            >
              <Github className="group-hover:scale-110 transition-transform" /> 
              GitHub
            </a>
          </div>

          <p className="mt-24 text-white/20 text-sm tracking-widest uppercase">
            © 2026 ZENSTACK 
          </p>
        </footer>
      </main>
    </div>
  );
}
