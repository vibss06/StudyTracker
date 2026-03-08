import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Globe from "@/components/ui/globe";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, Target, TrendingUp, Calendar, ListTodo, MessageCircle, BarChart3, Mail, Phone, Flame } from "lucide-react";

// Parse percentage string to number
const parsePercent = (str) => parseFloat(str.replace('%', ''));

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.4 },
    { top: "25%", left: "50%", scale: 0.9 },
    { top: "15%", left: "90%", scale: 2 },
    { top: "50%", left: "50%", scale: 1.8 },
    { top: "80%", left: "80%", scale: 1.2 },
  ]
};

function ScrollGlobe({ sections, globeConfig = defaultGlobeConfig, className }) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const animationFrameId = useRef();

  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, [globeConfig.positions]);

  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    setScrollProgress(progress);

    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    const currentPos = calculatedPositions[newActiveSection];
    const transform = `translate3d(${currentPos.left}vw, ${currentPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${currentPos.scale}, ${currentPos.scale}, 1)`;

    setGlobeTransform(transform);
    setActiveSection(newActiveSection);
  }, [calculatedPositions]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateScrollPosition]);

  useEffect(() => {
    const initialPos = calculatedPositions[0];
    const initialTransform = `translate3d(${initialPos.left}vw, ${initialPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${initialPos.scale}, ${initialPos.scale}, 1)`;
    setGlobeTransform(initialTransform);
  }, [calculatedPositions]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-screen overflow-x-hidden min-h-screen bg-[#0a0a0a] text-white",
        className
      )}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-white/5 via-white/10 to-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 will-change-transform shadow-sm"
          style={{
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: 'left center',
            transition: 'transform 0.15s ease-out',
            filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))'
          }}
        />
      </div>

      {/* Side Navigation */}
      <div className="hidden sm:flex fixed right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="relative group">
              <div
                className={cn(
                  "nav-label absolute right-5 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2",
                  "px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap",
                  "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl z-50",
                  activeSection === index ? "animate-fadeOut" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                  <div className="w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs sm:text-sm lg:text-base text-white/90">
                    {section.badge || `Section ${index + 1}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
                className={cn(
                  "relative w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 hover:scale-125",
                  "before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300",
                  activeSection === index
                    ? "bg-emerald-400 border-emerald-400 shadow-lg before:animate-ping before:bg-emerald-400/20"
                    : "bg-transparent border-white/40 hover:border-emerald-400/60 hover:bg-emerald-400/10"
                )}
                aria-label={`Go to ${section.badge || `section ${index + 1}`}`}
              />
            </div>
          ))}
        </div>

        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 lg:w-px bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent -translate-x-1/2 -z-10" />
      </div>

      {/* Globe */}
      <div
        className="fixed z-10 pointer-events-none will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          filter: `opacity(${activeSection === 3 ? 0.4 : 0.85})`,
        }}
      >
        <div className="scale-75 sm:scale-90 lg:scale-100">
          <Globe />
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          className={cn(
            "relative min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 z-20 py-12 sm:py-16 lg:py-20",
            "w-full max-w-full overflow-hidden",
            section.align === 'center' && "items-center text-center",
            section.align === 'right' && "items-end text-right",
            section.align !== 'center' && section.align !== 'right' && "items-start text-left"
          )}
        >
          <div className={cn(
            "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl will-change-transform transition-all duration-700",
            "opacity-100 translate-y-0"
          )}>

            <h1 className={cn(
              "font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight",
              index === 0
                ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
                : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
            )}>
              {section.subtitle ? (
                <div className="space-y-1 sm:space-y-2">
                  <div className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {section.title}
                  </div>
                  <div className="text-white/60 text-[0.6em] sm:text-[0.7em] font-medium tracking-wider">
                    {section.subtitle}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                  {section.title}
                </div>
              )}
            </h1>

            <div className={cn(
              "text-white/60 leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl font-light",
              section.align === 'center' ? "max-w-full mx-auto text-center" : "max-w-full"
            )}>
              <p className="mb-3 sm:mb-4">{section.description}</p>
              {index === 0 && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/40 mt-4 sm:mt-6">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Interactive Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <span>Scroll to Explore</span>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            {section.features && (
              <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-10">
                {section.features.map((feature, featureIndex) => (
                  <div
                    key={feature.title}
                    className={cn(
                      "group p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5",
                      "hover:border-emerald-400/20 hover:-translate-y-1"
                    )}
                    style={{ animationDelay: `${featureIndex * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {feature.icon && (
                        <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-400/20 transition-colors">
                          {feature.icon}
                        </div>
                      )}
                      {!feature.icon && (
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400/60 mt-1.5 sm:mt-2 group-hover:bg-emerald-400 transition-colors flex-shrink-0" />
                      )}
                      <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                        <h3 className="font-semibold text-white text-base sm:text-lg">{feature.title}</h3>
                        <p className="text-white/50 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            {section.actions && (
              <div className={cn(
                "flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4",
                section.align === 'center' && "justify-center",
                section.align === 'right' && "justify-end",
                (!section.align || section.align === 'left') && "justify-start"
              )}>
                {section.actions.map((action, actionIndex) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={cn(
                      "group relative px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base",
                      "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20 w-full sm:w-auto cursor-pointer",
                      action.variant === 'primary'
                        ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30"
                        : "border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-400/30 text-white"
                    )}
                    style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                  >
                    <span className="relative z-10">{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// StudyTracker Landing Page
export default function LandingPage() {
  const navigate = useNavigate();

  const studySections = [
    {
      id: "hero",
      badge: "Welcome",
      title: "Track Your",
      subtitle: "Study Journey",
      description: "StudyTracker helps you master your academic goals with intelligent planning, focused study sessions, and insightful progress tracking. Build habits that last and watch your knowledge grow.",
      align: "left",
      actions: [
        { label: "Get Started — It's Free", variant: "primary", onClick: () => navigate("/register") },
        { label: "Sign In", variant: "secondary", onClick: () => navigate("/login") },
      ]
    },
    {
      id: "features",
      badge: "Features",
      title: "Smart Study Tools",
      description: "Everything you need to plan, execute, and optimize your study sessions. Built by students, for students — with the tools that actually matter.",
      align: "center",
      features: [
        {
          title: "Dashboard Overview",
          description: "See your daily goal, current streak, weekly hours, and today's sessions — all at a glance.",
          icon: <Flame className="w-5 h-5 text-emerald-400" />,
        },
        {
          title: "Pomodoro Timer",
          description: "Stay focused with timed study sessions. Supports Pomodoro, short breaks, and long breaks.",
          icon: <Clock className="w-5 h-5 text-emerald-400" />,
        },
        {
          title: "Subject Management",
          description: "Organize subjects with color codes and weekly goals. Track progress per subject.",
          icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
        },
        {
          title: "Study Planner",
          description: "Plan and schedule your study sessions in advance. Stay organized and prepared.",
          icon: <Calendar className="w-5 h-5 text-emerald-400" />,
        },
        {
          title: "Progress Analytics",
          description: "Visualize study habits with bar charts, trend lines, and a 30-day activity heatmap.",
          icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
        },
        {
          title: "AI Study Assistant",
          description: "Chat with an AI tutor powered by Sarvam AI. Get instant help with any concept or topic.",
          icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
        },
      ]
    },
    {
      id: "discovery",
      badge: "Discover",
      title: "Your Complete",
      subtitle: "Study Toolkit",
      description: "From daily routines to long-term goals, StudyTracker has every tool to help you succeed academically.",
      align: "left",
      features: [
        {
          title: "Daily Routine Planner",
          description: "Block your day into focused study sessions with our visual timeline. Track what you do from 6 AM to 11 PM.",
          icon: <ListTodo className="w-5 h-5 text-emerald-400" />,
        },
        {
          title: "Focus Timer",
          description: "Stay locked in with our Pomodoro-inspired timer. Log sessions automatically and track minutes studied per subject.",
          icon: <Clock className="w-5 h-5 text-emerald-400" />,
        },
        {
          title: "Subject Tracking",
          description: "Organize your subjects with color codes, weekly goals, and progress stats. See exactly where your time goes.",
          icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
        },
        {
          title: "Goal Setting & Streaks",
          description: "Set targets with urgency levels, track due dates, and maintain your study streak. Build consistency day by day.",
          icon: <Target className="w-5 h-5 text-emerald-400" />,
        },
      ]
    },
    {
      id: "cta",
      badge: "Join",
      title: "Start Your",
      subtitle: "Journey Today",
      description: "Join thousands of students who are already studying smarter. Your free account is just one click away — no credit card required.",
      align: "center",
      actions: [
        { label: "Create Free Account", variant: "primary", onClick: () => navigate("/register") },
        { label: "Explore Features", variant: "secondary", onClick: () => {
          document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
        }},
      ]
    }
  ];

  const contactSection = (
    <footer className="relative z-20 border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">StudyTracker</h3>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Built to help students master their academic goals with intelligent planning, focused sessions, and smart analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2.5">
              <button onClick={() => navigate('/register')} className="block text-white/40 hover:text-emerald-400 transition-colors text-sm cursor-pointer">Get Started</button>
              <button onClick={() => navigate('/login')} className="block text-white/40 hover:text-emerald-400 transition-colors text-sm cursor-pointer">Sign In</button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="block text-white/40 hover:text-emerald-400 transition-colors text-sm cursor-pointer">Features</button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:vibhanshugajalkar006@gmail.com" className="flex items-center gap-3 text-white/40 hover:text-emerald-400 transition-colors text-sm group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                vibhanshugajalkar006@gmail.com
              </a>
              <a href="tel:+917666488722" className="flex items-center gap-3 text-white/40 hover:text-emerald-400 transition-colors text-sm group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                +91 7666488722
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} StudyTracker. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Made with ❤️ for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <>
      <ScrollGlobe
        sections={studySections}
        className="bg-gradient-to-br from-[#0a0a0a] via-[#0f1a0f] to-[#0a0a0a]"
      />
      {contactSection}
    </>
  );
}
