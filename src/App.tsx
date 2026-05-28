import React, { useState, useEffect, useRef } from "react";
import { 
  Home, 
  Sparkles, 
  Bookmark, 
  User, 
  Share2, 
  RefreshCcw, 
  Plus, 
  Check, 
  ArrowRight, 
  Lock, 
  Settings, 
  LogOut, 
  MapPin, 
  Mail, 
  Compass, 
  Grid, 
  Hash, 
  Image as ImageIcon, 
  Sliders, 
  ChevronLeft, 
  Copy,
  Heart,
  Pin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { 
  Moodboard, 
  MoodboardPanel, 
  UserSession, 
  ScreenView 
} from "./types";

import { 
  getIndustryImage, 
  INTEREST_TAGS, 
  INITIAL_EXPLORE_BOARDS 
} from "./mockData";

// Curated creative hubs for location autocomplete (India-oriented)
const CREATIVE_CITIES = [
  { city: "Bengaluru", state: "Karnataka", country: "India" },
  { city: "Mumbai", state: "Maharashtra", country: "India" },
  { city: "Delhi", state: "NCT", country: "India" },
  { city: "Gurgaon", state: "Haryana", country: "India" },
  { city: "Noida", state: "Uttar Pradesh", country: "India" },
  { city: "Pune", state: "Maharashtra", country: "India" },
  { city: "Hyderabad", state: "Telangana", country: "India" },
  { city: "Chennai", state: "Tamil Nadu", country: "India" },
  { city: "Kolkata", state: "West Bengal", country: "India" },
  { city: "Jaipur", state: "Rajasthan", country: "India" },
  { city: "Goa", state: "Goa", country: "India" },
  { city: "Ahmedabad", state: "Gujarat", country: "India" },
  { city: "Kochi", state: "Kerala", country: "India" },
  { city: "Chandigarh", state: "Punjab", country: "India" },
  { city: "Guwahati", state: "Assam", country: "India" }
];

export const INDUSTRIES_LIST = [
  "Fashion", "Technology", "SaaS", "Luxury", "Beauty", "Fitness", "Interior Design", 
  "Architecture", "Gaming", "Music", "Photography", "Editorial", "Food & Beverage", 
  "Travel", "Healthcare", "Finance", "E-commerce", "Automotive", "Education", "Streetwear", "Lifestyle"
];

export const AESTHETICS_LIST = [
  "Minimal", "Editorial", "Modern", "Luxury", "Futuristic", "Brutalist", "Organic", 
  "Monochrome", "Bold", "Elegant", "Soft", "Dark", "Experimental", "Glassmorphism", 
  "Cyberpunk", "Retro", "Japanese", "Scandinavian", "Bauhaus", "Neo-modern"
];

// Preset gorgeous palettes for the Generate screen picker
const PRESET_PALETTES = [
  { name: "Sartorial Contrast", colors: ["#2B00EB", "#FFFFFF", "#F5F3EF", "#625E54", "#111111"] },
  { name: "Monolithic Travertine", colors: ["#2B00EB", "#FAFAFA", "#EADCC1", "#7E7666", "#1C1C1E"] },
  { name: "Northern Cobalt", colors: ["#2B00EB", "#EBF3FF", "#A3C4FC", "#3E5780", "#0D0050"] },
  { name: "Warm Gastronomy", colors: ["#2B00EB", "#FFFFFF", "#D6C3B0", "#5C4A3A", "#111111"] },
  { name: "Cyber Radiant", colors: ["#2B00EB", "#0B0621", "#FF0055", "#00FFA2", "#FFFFFF"] },
  { name: "Nordic Softness", colors: ["#2B00EB", "#F4F6F4", "#D8E2DC", "#FFE5D9", "#353D32"] }
];

// High contrast light country prefix indexes
const COUNTRIES_LIST = [
  { name: "United States", flag: "🇺🇸", code: "+1" },
  { name: "India", flag: "🇮🇳", code: "+91" },
  { name: "United Kingdom", flag: "🇬🇧", code: "+44" },
  { name: "Canada", flag: "🇨🇦", code: "+1" },
  { name: "Australia", flag: "🇦🇺", code: "+61" },
  { name: "Japan", flag: "🇯🇵", code: "+81" },
  { name: "Germany", flag: "🇩🇪", code: "+49" },
  { name: "France", flag: "🇫🇷", code: "+33" },
  { name: "Spain", flag: "🇪🇸", code: "+34" },
  { name: "Italy", flag: "🇮🇹", code: "+39" },
  { name: "Singapore", flag: "🇸🇬", code: "+65" },
  { name: "United Arab Emirates", flag: "🇦🇪", code: "+971" },
  { name: "Brazil", flag: "🇧🇷", code: "+55" },
  { name: "South Africa", flag: "🇿🇦", code: "+27" },
  { name: "Mexico", flag: "🇲🇽", code: "+52" },
  { name: "Netherlands", flag: "🇳🇱", code: "+31" },
  { name: "Sweden", flag: "🇸🇪", code: "+46" },
  { name: "Switzerland", flag: "🇨🇭", code: "+41" },
  { name: "Saudi Arabia", flag: "🇸🇦", code: "+966" },
  { name: "New Zealand", flag: "🇳🇿", code: "+64" }
];

export default function App() {
  // --- STATE ---
  const [screen, setScreen] = useState<ScreenView>("splash");
  const [session, setSession] = useState<UserSession>({ isGuest: false, isLoggedIn: false });
  const [feedBoards, setFeedBoards] = useState<Moodboard[]>(INITIAL_EXPLORE_BOARDS);
  const [activeTab, setActiveTab] = useState<"home" | "generate" | "saved" | "profile">("home");
  
  // Login flow values
  const [mobileNumber, setMobileNumber] = useState("");
  const [detectedCountry, setDetectedCountry] = useState({ name: "United States", flag: "🇺🇸", code: "+1" });
  const [phoneInputError, setPhoneInputError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [activeGeneratedCode, setActiveGeneratedCode] = useState("");
  const [simulatedIncomingSms, setSimulatedIncomingSms] = useState<{ sender: string; body: string; code: string } | null>(null);
  
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otpError, setOtpError] = useState("");
  const [otpResendTimer, setOtpResendTimer] = useState(30);

  // Loading screens state tracking
  const [authLoadingStep, setAuthLoadingStep] = useState(0);
  const [genLoadingStep, setGenLoadingStep] = useState(0);

  // Onboarding screen inputs
  const [onboardName, setOnboardName] = useState("");
  const [onboardUsername, setOnboardUsername] = useState("");
  const [onboardEmail, setOnboardEmail] = useState("");
  const [onboardLocation, setOnboardLocation] = useState("");
  const [locationSearchOpen, setLocationSearchOpen] = useState(false);
  const [onboardIndustries, setOnboardIndustries] = useState<string[]>([]);
  const [onboardAesthetics, setOnboardAesthetics] = useState<string[]>([]);

  // Toast message notify state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Bento grid animation state for login screen
  const [bentoState, setBentoState] = useState(0);

  // Generate Inputs
  const [customColors, setCustomColors] = useState<string[]>(["#2B00EB", "#FAFAFA", "#ECECEC", "#707070", "#111111"]);
  const [creativeDirection, setCreativeDirection] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("Fashion & Apparel");
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [editColorHex, setEditColorHex] = useState("#2B00EB");

  // Generated Result output target
  const [currentResult, setCurrentResult] = useState<Moodboard | null>(null);
  const [resultTab, setResultTab] = useState<"grid" | "mockups" | "specs">("grid");

  // --- PERSISTENCE ---
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem("moodgrid_session");
      const storedBoards = localStorage.getItem("moodgrid_boards");
      
      if (storedSession) {
        const parsed = JSON.parse(storedSession) as UserSession;
        setSession(parsed);
        if (parsed.isLoggedIn) {
          // Skip directly into Feed
          setScreen("feed");
        }
      }
      
      if (storedBoards) {
        setFeedBoards(JSON.parse(storedBoards));
      }
    } catch (e) {
      console.error("Local storage initialization failed", e);
    }
  }, []);

  const saveSession = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem("moodgrid_session", JSON.stringify(newSession));
    } catch (e) {}
  };

  const saveBoards = (updatedBoards: Moodboard[]) => {
    setFeedBoards(updatedBoards);
    try {
      localStorage.setItem("moodgrid_boards", JSON.stringify(updatedBoards));
    } catch (e) {}
  };

  // --- AUTOMATIC TIMERS FOR SPLASH & AUTH LOADING ---
  useEffect(() => {
    if (screen === "splash") {
      const splashTimer = setTimeout(() => {
        // If logged in, go straight to Feed, otherwise Login
        if (session.isLoggedIn) {
          setScreen("feed");
        } else {
          setScreen("login");
        }
      }, 5000);
      return () => clearTimeout(splashTimer);
    }
  }, [screen, session]);

  // Bento box animation interval specifically for active login screen
  useEffect(() => {
    if (screen !== "login") return;
    const interval = setInterval(() => {
      setBentoState((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [screen]);

  // Auth loading state steps (5 seconds)
  useEffect(() => {
    if (screen === "auth-loading") {
      setAuthLoadingStep(0);
      const stepInterval = setInterval(() => {
        setAuthLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1200);

      const doneTimer = setTimeout(() => {
        setScreen("onboarding");
      }, 5000);

      return () => {
        clearInterval(stepInterval);
        clearTimeout(doneTimer);
      };
    }
  }, [screen]);

  // OTP resent Timer
  useEffect(() => {
    if (screen === "otp" && otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [screen, otpResendTimer]);

  // Generator Loading Phase texts (simulated)
  useEffect(() => {
    if (screen === "loading-gen") {
      setGenLoadingStep(0);
      const stepInterval = setInterval(() => {
        setGenLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1000);

      return () => clearInterval(stepInterval);
    }
  }, [screen]);

  // Automatic Geolocation on mount to detect default country matching client's location
  useEffect(() => {
    const detectClientIPCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (data && data.country_code) {
            const found = COUNTRIES_LIST.find(
              (c) => c.code === data.country_calling_code || c.name.toLowerCase() === data.country_name?.toLowerCase()
            );
            if (found) {
              setDetectedCountry(found);
            } else if (data.country_calling_code) {
              const codePoints = data.country_code
                .toUpperCase()
                .split("")
                .map((char: string) => 127397 + char.charCodeAt(0));
              const flagEmoji = String.fromCodePoint(...codePoints);
              setDetectedCountry({
                name: data.country_name || "Detected Country",
                flag: flagEmoji,
                code: data.country_calling_code
              });
            }
          }
        }
      } catch (e) {
        console.warn("Client background geolocation detection bypassed", e);
      }
    };
    detectClientIPCountry();
  }, []);

  // --- TOAST HELPER ---
  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- ACTION HANDLERS ---
  const handlePhoneInputChange = (val: string) => {
    // Only allow numbers, spaces, parentheses, hyphens, and starting '+'
    let filtered = val.replace(/[^\d\s()+-]/g, "");
    setMobileNumber(filtered);

    const digitsOnly = filtered.replace(/\D/g, "");
    if (!digitsOnly) {
      setPhoneInputError("");
      setDetectedCountry({ name: "United States", flag: "🇺🇸", code: "+1" });
      return;
    }

    // Sort countries by dialing code prefix descending (longest matching prefix first)
    const sortedCountries = [...COUNTRIES_LIST].sort(
      (a, b) => b.code.replace("+", "").length - a.code.replace("+", "").length
    );

    let found = null;

    if (filtered.startsWith("+")) {
      found = sortedCountries.find((c) => {
        const codeDigits = c.code.replace("+", "");
        return digitsOnly.startsWith(codeDigits);
      });
    } else {
      // If it doesn't start with '+', they might be typing a known dialect prefix directly.
      // E.g. "9198755..." -> India.
      found = sortedCountries.find((c) => {
        const codeDigits = c.code.replace("+", "");
        if (codeDigits === "1") {
          return digitsOnly.startsWith("1") && digitsOnly.length >= 4;
        }
        return digitsOnly.startsWith(codeDigits) && digitsOnly.length >= codeDigits.length + 1;
      });
    }

    if (found) {
      setDetectedCountry(found);
      const dialCodeDigits = found.code.replace("+", "");
      const localDigitsLength = filtered.startsWith("+") || digitsOnly.startsWith(dialCodeDigits)
        ? digitsOnly.length - dialCodeDigits.length
        : digitsOnly.length;

      if (localDigitsLength < 7) {
        setPhoneInputError(`Number is too short for ${found.name}.`);
      } else if (digitsOnly.length > 15) {
        setPhoneInputError("Number exceeds standard international limit of 15 digits.");
      } else {
        setPhoneInputError("");
      }
    } else {
      // Fallback formatting check
      if (digitsOnly.length < 10) {
        setPhoneInputError("Number is too short. Please enter a valid 10-15 digit mobile number.");
      } else if (digitsOnly.length > 15) {
        setPhoneInputError("Number exceeds standard limit of 15 digits.");
      } else {
        setPhoneInputError("");
      }
    }
  };

  const handleGoogleLogin = () => {
    setOnboardName("Aman Chourasiya");
    setOnboardEmail("chourasiyaaman76@gmail.com");
    setOnboardLocation("San Francisco, CA");
    setOnboardIndustries(["Technology", "Photography", "Editorial"]);
    setOnboardAesthetics(["Minimal", "Modern", "Bold"]);
    triggerToast("Google authenticating...", "success");
    setScreen("auth-loading");
  };

  const handleLoginContinue = async () => {
    const cleanNum = mobileNumber.replace(/\D/g, "");
    if (cleanNum.length < 5) {
      setPhoneInputError("Please enter a valid mobile number.");
      triggerToast("Please enter a valid mobile number", "error");
      return;
    }

    if (phoneInputError) {
      triggerToast(phoneInputError, "error");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanNum,
          countryCode: filteredStartsWithPlus(mobileNumber) ? "" : detectedCountry.code
        })
      });
      
      const data = await response.json();
      setIsSendingOtp(false);

      if (response.ok && data.success) {
        setOtpResendTimer(30);
        setOtpCode(["", "", "", ""]);
        setActiveGeneratedCode(data.code);
        setScreen("otp");

        // Trigger an elegant interactive notification after a short professional delay
        setTimeout(() => {
          setSimulatedIncomingSms({
            sender: "MoodGrid Security",
            body: `Your secure creative key code is ${data.code}. Do not share this with anyone.`,
            code: data.code
          });
        }, 800);

        triggerToast("Authentication key dispatched!", "success");

        // Auto-focus first input
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 150);
      } else {
        triggerToast(data.error || "Failed to trigger OTP delivery. Please try again.", "error");
      }
    } catch (err) {
      setIsSendingOtp(false);
      triggerToast("Connectivity issue sending security key.", "error");
    }
  };

  // Helper function to check if raw string starts with '+'
  const filteredStartsWithPlus = (str: string) => {
    return str.trim().startsWith("+");
  };

  // Handle individual OTP key focus shifts
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = clean;
    setOtpCode(newOtp);

    // Focus next input if populated
    if (clean && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const combined = otpCode.join("");
    if (combined.length < 4) {
      triggerToast("Please enter the 4-digit security code", "error");
      return;
    }

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mobileNumber.replace(/\D/g, ""),
          code: combined
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSimulatedIncomingSms(null);
        setScreen("auth-loading");
      } else {
        triggerToast(data.error || "Incorrect verification pin, try again.", "error");
      }
    } catch (err) {
      triggerToast("Connectivity issue during secure validation.", "error");
    }
  };

  const handleGuestLogin = () => {
    const guestSession: UserSession = {
      isGuest: true,
      isLoggedIn: true,
      fullName: "Guest Designer",
      email: "guest@moodgrid.ai",
      interests: ["Minimalist Architecture", "Quiet Luxury Fabrics"]
    };
    saveSession(guestSession);
    triggerToast("Logged in as Guest", "success");
    setScreen("feed");
  };

  const handleOnboardingSubmit = () => {
    if (!onboardName.trim()) {
      triggerToast("Full name is a required field", "error");
      return;
    }
    if (!onboardUsername.trim()) {
      triggerToast("Username is a required field", "error");
      return;
    }
    if (!onboardEmail.trim() || !onboardEmail.includes("@")) {
      triggerToast("A valid email address is required", "error");
      return;
    }

    const completedSession: UserSession = {
      isGuest: false,
      isLoggedIn: true,
      mobileNumber,
      fullName: onboardName,
      username: onboardUsername,
      email: onboardEmail,
      location: onboardLocation,
      interests: [...onboardIndustries, ...onboardAesthetics]
    };

    saveSession(completedSession);
    triggerToast("Onboarding complete, welcome to MoodGrid!", "success");
    setScreen("feed");
    setActiveTab("home");
  };

  const handleToggleIndustry = (tag: string) => {
    if (onboardIndustries.includes(tag)) {
      setOnboardIndustries(onboardIndustries.filter((t) => t !== tag));
    } else {
      if (onboardIndustries.length >= 5) {
        triggerToast("Maximum of 5 selections reached for Creative Industry", "info");
        return;
      }
      setOnboardIndustries([...onboardIndustries, tag]);
    }
  };

  const handleToggleAesthetic = (tag: string) => {
    if (onboardAesthetics.includes(tag)) {
      setOnboardAesthetics(onboardAesthetics.filter((t) => t !== tag));
    } else {
      if (onboardAesthetics.length >= 5) {
        triggerToast("Maximum of 5 selections reached for Visual Aesthetics", "info");
        return;
      }
      setOnboardAesthetics([...onboardAesthetics, tag]);
    }
  };

  // Preset Color Palettes Loader
  const handleSelectPresetPalette = (colors: string[]) => {
    setCustomColors([...colors]);
    setEditColorHex(colors[0]);
    setActiveColorIdx(0);
    triggerToast("Color palette loaded", "info");
  };

  const handleUpdateActiveColor = (hex: string) => {
    const val = hex.startsWith("#") ? hex : "#" + hex;
    setEditColorHex(val);
    const updated = [...customColors];
    updated[activeColorIdx] = val;
    setCustomColors(updated);
  };

  // Perform Generation call to the backend `/api/generate`
  const handleGenerateMoodboard = async () => {
    if (!creativeDirection.trim()) {
      triggerToast("Please describe your creative direction first", "error");
      return;
    }

    setScreen("loading-gen");

    const timer = setTimeout(() => {
      // Proceed call to backend
    }, 100);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colors: customColors,
          direction: creativeDirection,
          industry: selectedIndustry
        })
      });

      if (!res.ok) {
        throw new Error("Generation request failed");
      }

      const generatedData = await res.json();
      
      // Post-process response to match structure and assign gorgeous Unsplash references
      const panelsWithImages = generatedData.panels.map((p: MoodboardPanel, index: number) => {
        const fallbackUrl = getIndustryImage(selectedIndustry, index, p.imageKeywords || []);
        return {
          ...p,
          imageUrl: p.type === 'image_reference' || p.type === 'abstract_graphic' ? fallbackUrl : undefined,
          patternType: p.type === 'abstract_graphic' 
            ? (['grid', 'waves', 'circles', 'diagonal'][index % 4] as any) 
            : undefined
        };
      });

      const uniqueId = "board-" + Date.now();
      const newBoard: Moodboard = {
        id: uniqueId,
        title: generatedData.title || "Untitled Vision",
        tagline: generatedData.tagline || "Evocative visual narrative concept.",
        adjectives: generatedData.adjectives || ["Minimalist", "Editorial"],
        colors: generatedData.colors || [
          { hex: customColors[0], name: "Primary", role: "Accent" },
          { hex: customColors[1], name: "Canvas", role: "Base" },
          { hex: customColors[2], name: "Border", role: "Divider" },
          { hex: customColors[3], name: "Text Muted", role: "Secondary" },
          { hex: customColors[4], name: "Text Dark", role: "Core" }
        ],
        editorialSpecs: generatedData.editorialSpecs || {
          typographyPairing: "Poppins Display",
          photographyStyle: "Directional glare",
          layoutConcept: "Asymmetric density spacing"
        },
        panels: panelsWithImages,
        createdBy: session.fullName || "Designer",
        createdAt: new Date().toISOString(),
        likesCount: 0,
        likedByMe: false,
        savedByMe: false,
        industry: selectedIndustry,
        creativeDirection: creativeDirection
      };

      // Add minimum delay block for loading aesthetic sequence
      setTimeout(() => {
        setCurrentResult(newBoard);
        setScreen("result");
        triggerToast("MoodGrid generated successfully", "success");
      }, 3500);

    } catch (e) {
      console.warn("Express Gemini API call issue, using fallback generation.", e);
      // Construct fallback instantly
      const fallbackPayload = getFallbackMockPayload();
      setTimeout(() => {
        setCurrentResult(fallbackPayload);
        setScreen("result");
        triggerToast("Generated successfully (Local Engine)", "success");
      }, 3500);
    }

    return () => clearTimeout(timer);
  };

  const getFallbackMockPayload = (): Moodboard => {
    // Elegant fallback based on user's color selection
    const generatedPalette = [
      { hex: customColors[0], name: "Accent Vibe", role: "Visual Callout" },
      { hex: customColors[1], name: "Main Light Surface", role: "Background Canvas" },
      { hex: customColors[2], name: "Soft Outline Depth", role: "Divider Contrast" },
      { hex: customColors[3], name: "Muted Text Ink", role: "Slogans Metadata" },
      { hex: customColors[4], name: "Primary Obsidian", role: "Main Headings Ink" }
    ];

    return {
      id: "board-fallback-" + Date.now(),
      title: "Synthesised " + selectedIndustry.split(" ")[0],
      tagline: `An exploration of tactile space styled under the creative idea: "${creativeDirection.slice(0, 40)}..."`,
      adjectives: ["Tactile", "Curated", "Editorial", "Minimal"],
      colors: generatedPalette,
      editorialSpecs: {
        typographyPairing: "Poppins Medium Display + Lato Regular body",
        photographyStyle: "Ambient lighting reflecting off unpolished materials and stone grain textures",
        layoutConcept: "Bento placement prioritizing balanced blocks and accent focal points"
      },
      panels: [
        {
          id: "p1",
          type: "image_reference",
          title: "Aesthetic Composition",
          subtitle: "Editorial Node",
          content: customColors[0],
          imageKeywords: ["minimalist cement plaster shape"],
          colSpan: 2,
          rowSpan: 1,
          imageUrl: getIndustryImage(selectedIndustry, 0, ["minimalist", "composition"])
        },
        {
          id: "p2",
          type: "color_accent",
          title: "Palette Specimen",
          subtitle: "Solid Color",
          content: customColors[0],
          imageKeywords: ["vibrant color background"],
          colSpan: 1,
          rowSpan: 1
        },
        {
          id: "p3",
          type: "typography_spec",
          title: "Art",
          subtitle: "Form Pairing",
          content: "Simplicity is the final outcome of structural integrity.",
          imageKeywords: [],
          colSpan: 1,
          rowSpan: 1
        },
        {
          id: "p4",
          type: "concept_words",
          title: "Narrative core",
          subtitle: "Art Concept",
          content: creativeDirection,
          imageKeywords: [],
          colSpan: 2,
          rowSpan: 1
        }
      ],
      createdBy: session.fullName || "Independent Designer",
      createdAt: new Date().toISOString(),
      likesCount: 1,
      likedByMe: false,
      savedByMe: false,
      industry: selectedIndustry,
      creativeDirection: creativeDirection
    };
  };

  // Save generated moodboard output to saved folder
  const handleSaveResult = () => {
    if (!currentResult) return;
    const isSavedAlready = currentResult.savedByMe;
    
    const updated = { ...currentResult, savedByMe: !isSavedAlready };
    setCurrentResult(updated);

    // Track list representation
    let updatedFeed = feedBoards.map((b) => (b.id === currentResult.id ? { ...b, savedByMe: !isSavedAlready } : b));
    
    // Add to feed if it doesn't exist
    const exists = feedBoards.some((b) => b.id === currentResult.id);
    if (!exists && !isSavedAlready) {
      updatedFeed = [updated, ...feedBoards];
    }
    
    saveBoards(updatedFeed);
    triggerToast(!isSavedAlready ? "Moodboard added to Saved collection" : "Removed from Saved collection", "success");
  };

  // Publish generated board to public explore feed
  const handlePublishResult = () => {
    if (!currentResult) return;
    
    const updated = { ...currentResult, savedByMe: true };
    setCurrentResult(updated);

    // Insert or update in live feed list
    const exists = feedBoards.some((b) => b.id === currentResult.id);
    let updatedFeed = [...feedBoards];
    
    if (exists) {
      updatedFeed = feedBoards.map((b) => b.id === currentResult.id ? updated : b);
    } else {
      updatedFeed = [updated, ...feedBoards];
    }

    saveBoards(updatedFeed);
    triggerToast("Idea published to Community Explore", "success");
    // Swap screen back to main Feed feed
    setScreen("feed");
    setActiveTab("home");
  };

  // Remix a board: copy color and industry values, direct to generate workspace!
  const handleRemixBoard = (board: Moodboard) => {
    const rawHexes = board.colors.map((c) => c.hex);
    setCustomColors(rawHexes);
    setCreativeDirection(`Remix inspired by "${board.title}". ${board.creativeDirection || ""}`);
    setSelectedIndustry(board.industry);
    setActiveTab("generate");
    setScreen("feed"); // Since we keep tabs, direct to feed routing context of generate trigger
    triggerToast("Remix parameters pre-filled!", "info");
  };

  const handleLikeBoard = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = feedBoards.map((b) => {
      if (b.id === id) {
        const liked = !b.likedByMe;
        return {
          ...b,
          likedByMe: liked,
          likesCount: liked ? b.likesCount + 1 : b.likesCount - 1
        };
      }
      return b;
    });
    saveBoards(updated);
    
    // Sycren with result screen if matches
    if (currentResult && currentResult.id === id) {
      const liked = !currentResult.likedByMe;
      setCurrentResult({
        ...currentResult,
        likedByMe: liked,
        likesCount: liked ? currentResult.likesCount + 1 : currentResult.likesCount - 1
      });
    }
  };

  const handleSaveBoardToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = feedBoards.map((b) => {
      if (b.id === id) {
        return { ...b, savedByMe: !b.savedByMe };
      }
      return b;
    });
    saveBoards(updated);
    triggerToast("Saved collection updated", "success");
  };

  const handleShareBoard = (board: Moodboard, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://moodgrid.ai/board/${board.id}`);
      triggerToast("Mock link copied to clipboard!", "success");
    } else {
      triggerToast(`Shared: ${board.title}`, "info");
    }
  };

  const handleResetSession = () => {
    localStorage.removeItem("moodgrid_session");
    setSession({ isGuest: false, isLoggedIn: false });
    setOnboardName("");
    setOnboardEmail("");
    setOnboardLocation("");
    setOnboardIndustries([]);
    setOnboardAesthetics([]);
    setMobileNumber("");
    setOtpCode(["", "", "", ""]);
    setScreen("login");
    triggerToast("Session reset successfully", "info");
  };

  // Filter only saved boards for saved gallery screen
  const savedBoardsList = feedBoards.filter((b) => b.savedByMe);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-0 sm:p-4 text-[#111111] font-body selection:bg-accent selection:text-white relative w-full overflow-hidden">
      
      {/* 360x720 / 390x844 Reference phone container */}
      <div className="relative w-full max-w-full sm:max-w-[390px] h-screen sm:h-[844px] bg-white rounded-none sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border-[8px] sm:border-[#111111]">
        
        {/* Mock phone status indicator details (premium design rule: minimalist context) */}
        <div className="hidden sm:flex shrink-0 justify-between items-center px-8 pt-3 pb-2 bg-white text-[11px] font-inter font-medium select-none z-30">
          <span>9:41</span>
          <div className="w-[124px] h-[24px] bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2 flex items-center justify-center opacity-95">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 mr-2"></span>
            <span className="w-3 h-1.5 rounded-full bg-zinc-900"></span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3.5 h-2 border border-black rounded-[3px] p-[1px] inline-flex items-center"><span className="w-2 h-full bg-black block rounded-[1px]"></span></span>
          </div>
        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {simulatedIncomingSms && (
            <motion.div
              key="simulated-sms-toast"
              initial={{ opacity: 0, y: -100, scale: 0.9 }}
              animate={{ opacity: 1, y: 12, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-2xl rounded-2xl p-4 flex flex-col space-y-2.5 z-50 text-xs font-inter select-none pointer-events-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#2B00EB] flex items-center justify-center text-white font-bold text-[10px]">
                    mg.
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 uppercase tracking-wide">Studio Verification Key</h4>
                    <p className="text-[10px] text-zinc-500">Carrier SMS • Just now</p>
                  </div>
                </div>
                <button
                  onClick={() => setSimulatedIncomingSms(null)}
                  className="text-zinc-400 hover:text-zinc-600 text-sm font-bold bg-zinc-100/60 hover:bg-zinc-200/60 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-zinc-700 leading-normal flex items-start justify-between space-x-2">
                <div>
                  <p className="font-medium text-zinc-800">{simulatedIncomingSms.body}</p>
                </div>
                <div className="bg-[#2B00EB]/10 border border-[#2B00EB]/20 text-[#2B00EB] rounded-lg px-2.5 py-1 font-mono font-bold text-sm tracking-widest select-all select-text shrink-0 animate-pulse">
                  {simulatedIncomingSms.code}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const digits = simulatedIncomingSms.code.split("");
                    setOtpCode(digits);
                    setSimulatedIncomingSms(null);
                    triggerToast("Verification key auto-filled!", "success");
                  }}
                  className="grow bg-[#2B00EB] text-white py-2 px-3 rounded-xl font-bold active:scale-[0.98] transition-transform flex items-center justify-center space-x-1 hover:brightness-110 cursor-pointer"
                >
                  <span>Auto-fill Verification Code</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {toast && (
            <motion.div 
              key="global-notification-alert-toast"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 w-[85%] bg-[#111111] text-white py-3 px-4 rounded-[14px] shadow-lg flex items-center space-x-2 text-xs font-inter tracking-tight z-50 justify-between"
            >
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-[#2B00EB]" : toast.type === "error" ? "bg-[#E53935]" : "bg-white"}`}></span>
                <p className="font-medium">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)} className="text-zinc-400 font-inter hover:text-white pb-0.5">×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN ROUTING CONTAINER --- */}
        <div className={`grow w-full relative flex flex-col bg-white ${
          ["feed", "generate", "saved", "profile", "result"].includes(screen) 
            ? "h-full min-h-0 overflow-hidden" 
            : "overflow-y-auto overflow-x-hidden"
        }`}>
          
          {/* SCREEN 1: SPLASH */}
          {screen === "splash" && (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 z-40 select-none overflow-hidden">
              
              {/* Background Interactive Mockup / Design Cards Collage */}
              <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
                {/* Product/Design Card 1 - Minimal Palette / Pastel Swatches */}
                <motion.div
                  drag
                  dragElastic={0.3}
                  dragMomentum={true}
                  whileHover={{ 
                    scale: 1.05, 
                    zIndex: 10,
                    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%"
                  }}
                  whileTap={{ 
                    scale: 0.9, 
                    borderRadius: "45% 55% 65% 35% / 40% 60% 40% 60%" 
                  }}
                  initial={{ opacity: 0, scale: 0.6, y: 50, rotate: -15, borderRadius: "24px" }}
                  animate={{ 
                    opacity: 0.7, 
                    scale: 1, 
                    rotate: [-15, -13, -15],
                    y: [0, -8, 0]
                  }}
                  transition={{
                    initial: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                    rotate: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                    borderRadius: { type: "spring", stiffness: 100, damping: 10 }
                  }}
                  className="absolute top-[3%] left-[-9%] w-28 h-28 bg-white border border-zinc-200/40 overflow-hidden cursor-grab active:cursor-grabbing opacity-70"
                >
                  <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80" alt="Moodboard 1" className="w-full h-full object-cover pointer-events-none select-none" />
                </motion.div>

                {/* Product/Design Card 2 - Soft Sunset Colors (Branding Backgrounds) */}
                <motion.div
                  drag
                  dragElastic={0.3}
                  dragMomentum={true}
                  whileHover={{ 
                    scale: 1.05, 
                    zIndex: 10,
                    borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%"
                  }}
                  whileTap={{ 
                    scale: 0.9, 
                    borderRadius: "35% 65% 45% 55% / 55% 45% 55% 45%" 
                  }}
                  initial={{ opacity: 0, scale: 0.6, y: -50, rotate: 12, borderRadius: "24px" }}
                  animate={{ 
                    opacity: 0.7, 
                    scale: 1, 
                    rotate: [12, 14, 12],
                    y: [0, 8, 0]
                  }}
                  transition={{
                    initial: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
                    rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                    borderRadius: { type: "spring", stiffness: 100, damping: 10 }
                  }}
                  className="absolute top-[8%] right-[-11%] w-32 h-32 bg-white border border-zinc-200/40 overflow-hidden cursor-grab active:cursor-grabbing opacity-70"
                >
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80" alt="Moodboard 2" className="w-full h-full object-cover pointer-events-none select-none" />
                </motion.div>

                {/* Product/Design Card 3 - Fluid Colors & Pastel Gradation */}
                <motion.div
                  drag
                  dragElastic={0.3}
                  dragMomentum={true}
                  whileHover={{ 
                    scale: 1.05, 
                    zIndex: 10,
                    borderRadius: "45% 55% 60% 40% / 55% 45% 55% 45%"
                  }}
                  whileTap={{ 
                    scale: 0.9, 
                    borderRadius: "50% 50% 70% 30% / 30% 70% 30% 70%" 
                  }}
                  initial={{ opacity: 0, scale: 0.6, x: -60, rotate: -10, borderRadius: "24px" }}
                  animate={{ 
                    opacity: 0.7, 
                    scale: 1, 
                    rotate: [-10, -7, -10],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    initial: { duration: 1.3, ease: [0.16, 1, 0.3, 1] },
                    rotate: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 7, ease: "easeInOut" },
                    borderRadius: { type: "spring", stiffness: 100, damping: 10 }
                  }}
                  className="absolute top-[58%] left-[-11%] w-28 h-36 bg-white border border-zinc-200/40 overflow-hidden cursor-grab active:cursor-grabbing opacity-70"
                >
                  <img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&auto=format&fit=crop&q=80" alt="Moodboard 3" className="w-full h-full object-cover pointer-events-none select-none" />
                </motion.div>

                {/* Product/Design Card 4 - Minimal Geometric Concept & Branding Swatches */}
                <motion.div
                  drag
                  dragElastic={0.3}
                  dragMomentum={true}
                  whileHover={{ 
                    scale: 1.05, 
                    zIndex: 10,
                    borderRadius: "50% 50% 40% 60% / 40% 60% 40% 60%"
                  }}
                  whileTap={{ 
                    scale: 0.9, 
                    borderRadius: "30% 70% 50% 50% / 50% 50% 30% 70%" 
                  }}
                  initial={{ opacity: 0, scale: 0.6, x: 60, rotate: 8, borderRadius: "24px" }}
                  animate={{ 
                    opacity: 0.7, 
                    scale: 1, 
                    rotate: [8, 11, 8],
                    y: [0, -6, 0]
                  }}
                  transition={{
                    initial: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                    rotate: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                    borderRadius: { type: "spring", stiffness: 100, damping: 10 }
                  }}
                  className="absolute bottom-[6%] right-[-10%] w-28 h-36 bg-white border border-zinc-200/40 overflow-hidden cursor-grab active:cursor-grabbing opacity-70"
                >
                  <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&auto=format&fit=crop&q=80" alt="Moodboard 4" className="w-full h-full object-cover pointer-events-none select-none" />
                </motion.div>

                {/* Product/Design Card 5 - Pantone Swatch Deck Inspiration */}
                <motion.div
                  drag
                  dragElastic={0.3}
                  dragMomentum={true}
                  whileHover={{ 
                    scale: 1.05, 
                    zIndex: 10,
                    borderRadius: "35% 65% 55% 45% / 45% 55% 45% 55%"
                  }}
                  whileTap={{ 
                    scale: 0.9, 
                    borderRadius: "60% 40% 40% 60% / 40% 60% 40% 60%" 
                  }}
                  initial={{ opacity: 0, scale: 0.6, y: 70, rotate: -8, borderRadius: "24px" }}
                  animate={{ 
                    opacity: 0.7, 
                    scale: 1, 
                    rotate: [-8, -11, -8],
                    y: [0, 8, 0]
                  }}
                  transition={{
                    initial: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
                    rotate: { repeat: Infinity, duration: 6.2, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 6.5, ease: "easeInOut" },
                    borderRadius: { type: "spring", stiffness: 100, damping: 10 }
                  }}
                  className="absolute bottom-[-6%] left-[4%] w-32 h-28 bg-white border border-zinc-200/40 overflow-hidden cursor-grab active:cursor-grabbing opacity-70"
                >
                  <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80" alt="Moodboard 5" className="w-full h-full object-cover pointer-events-none select-none" />
                </motion.div>
              </div>

              {/* Central Floating Branding Overlay Panel with frosted glass effect */}
              <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 bg-white/75 backdrop-blur-md rounded-[28px] border border-white/50 w-52 h-52 shadow-none">
                {/* Image Logo Container for bottom-to-top reveal animation */}
                <div className="relative mb-0 overflow-hidden flex justify-center items-center h-24 w-24">
                  <motion.img 
                    src="/image/moodgridlogo.svg" 
                    alt="MoodGrid Logo"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      duration: 1.4, 
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="w-20 h-20 object-contain"
                  />
                </div>

                {/* Minimalist 'mg.' typography reveal (tight height, negative margin to offset SVG empty space) */}
                <div className="relative overflow-hidden h-12 flex items-center justify-center -mt-4">
                  <motion.h1 
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      duration: 1.4, 
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.25
                    }}
                    className="text-[32px] font-sans font-extrabold tracking-tight text-[#2B00EB] select-none leading-none"
                  >
                    mg.
                  </motion.h1>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: LOGIN */}
          {screen === "login" && (
            <div className="flex-1 flex flex-col justify-between py-8 px-4 w-full bg-white z-20">
              <div className="pt-4">
                {/* Logo mark - Side by side small */}
                <div className="flex items-center space-x-1.5 mb-6 select-none">
                  <img src="/image/moodgridlogo.svg" alt="MoodGrid Logo" className="w-6.5 h-6.5 object-contain" />
                  <span className="text-md font-sans font-extrabold tracking-tight bg-gradient-to-r from-[#2B00EB] to-[#0D0050] bg-clip-text text-transparent leading-none">
                    MoodGrid
                  </span>
                </div>
                
                <h1 className="text-[36px] font-sans font-medium tracking-tight text-zinc-950 leading-[44px] mb-2">
                  Transform visual inspiration.
                </h1>
                <p className="text-[#707070] font-sans text-[14px] leading-[22px] font-normal">
                  Enter your mobile number to establish your secure creative profile space.
                </p>
              </div>

              {/* Animated Bento Grid - Hollow strokes in light grey, blank inside */}
              <div className="flex-1 flex items-center justify-center my-6 py-2">
                <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full max-w-[290px] h-[170px] relative">
                  {/* Box 0 */}
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className={`${
                      bentoState === 0
                        ? "col-start-1 col-span-2 row-start-1 row-span-1"
                        : bentoState === 1
                        ? "col-start-1 col-span-1 row-start-1 row-span-2"
                        : bentoState === 2
                        ? "col-start-1 col-span-2 row-start-1 row-span-1"
                        : "col-start-1 col-span-1 row-start-1 row-span-1"
                    } border border-zinc-200 rounded-[14px] bg-white`}
                  />

                  {/* Box 1 */}
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className={`${
                      bentoState === 0
                        ? "col-start-3 col-span-1 row-start-1 row-span-1"
                        : bentoState === 1
                        ? "col-start-2 col-span-2 row-start-1 row-span-1"
                        : bentoState === 2
                        ? "col-start-1 col-span-1 row-start-2 row-span-1"
                        : "col-start-2 col-span-2 row-start-1 row-span-1"
                    } border border-zinc-200 rounded-[14px] bg-white`}
                  />

                  {/* Box 2 */}
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className={`${
                      bentoState === 0
                        ? "col-start-1 col-span-1 row-start-2 row-span-1"
                        : bentoState === 1
                        ? "col-start-2 col-span-1 row-start-2 row-span-1"
                        : bentoState === 2
                        ? "col-start-2 col-span-1 row-start-2 row-span-1"
                        : "col-start-1 col-span-2 row-start-2 row-span-1"
                    } border border-zinc-200 rounded-[14px] bg-white`}
                  />

                  {/* Box 3 */}
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className={`${
                      bentoState === 0
                        ? "col-start-2 col-span-2 row-start-2 row-span-1"
                        : bentoState === 1
                        ? "col-start-3 col-span-1 row-start-2 row-span-1"
                        : bentoState === 2
                        ? "col-start-3 col-span-1 row-start-1 row-span-2"
                        : "col-start-3 col-span-1 row-start-2 row-span-1"
                    } border border-zinc-200 rounded-[14px] bg-white`}
                  />
                </div>
              </div>

              {/* Mobile Number Entry & Action Button at the bottom */}
              <div className="space-y-4 pb-4">
                <div className="relative w-full">
                  <div className={`flex border-[1.5px] ${phoneInputError ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400/10 focus-within:border-red-400" : "border-zinc-300 focus-within:ring-2 focus-within:ring-[#2B00EB]/10 focus-within:border-[#2B00EB]"} rounded-[14px] overflow-hidden bg-white transition-all items-center pl-3.5`}>
                    {/* Visual flag prefix inside field */}
                    <div className="flex items-center space-x-1.5 pr-2.5 border-r border-zinc-150 py-1.5 select-none shrink-0" title={detectedCountry.name}>
                      <span className="text-base leading-none">{detectedCountry.flag}</span>
                      <span className="text-xs font-mono font-bold text-[#2B00EB] leading-none">{detectedCountry.code}</span>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Enter your mobile number"
                      value={mobileNumber}
                      onChange={(e) => handlePhoneInputChange(e.target.value)}
                      className="grow px-3 py-3 bg-transparent text-sm font-sans font-normal text-zinc-900 placeholder-zinc-400 focus:outline-none"
                    />
                  </div>
                  {phoneInputError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2.5"
                    >
                      <span className="text-[11px] font-inter font-semibold text-red-600 flex items-center space-x-1">
                        <span>⚠️</span>
                        <span className="font-normal text-[10px]">{phoneInputError}</span>
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Continue Action */}
                <button 
                  onClick={handleLoginContinue}
                  disabled={isSendingOtp}
                  style={{ background: "linear-gradient(135deg, #2B00EB 0%, #0D0050 100%)" }}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-[16px] text-white font-sans text-sm font-medium tracking-tight shadow-md active:scale-[0.98] transition-transform cursor-pointer disabled:opacity-50"
                >
                  <span>{isSendingOtp ? "Generating creative key..." : "Continue to login"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider space delimiter */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#787878]"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-inter font-normal text-[#000000] uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-[#787878]"></div>
                </div>

                {/* primary Google Button */}
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center space-x-2.5 py-3 px-4 rounded-[16px] border border-zinc-200 bg-white text-zinc-800 font-inter text-sm font-medium hover:bg-zinc-50 active:scale-[0.97] transition-all cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: OTP VERIFICATION */}
          {screen === "otp" && (
            <div className="flex-1 flex flex-col justify-between py-8 px-4 w-full bg-white z-20">
              <div>
                {/* Back link */}
                <button 
                  onClick={() => setScreen("login")}
                  className="flex items-center space-x-1 text-zinc-500 hover:text-black font-inter text-xs font-semibold mb-6 mt-4 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Edit Number</span>
                </button>

                <h1 className="text-[26px] font-sans font-bold tracking-tight text-zinc-950 leading-[32px] mb-2">
                  Verify your identity.
                </h1>
                <p className="text-[#707070] font-inter text-xs leading-relaxed mb-8">
                  We sent a 4-digit code to <span className="font-semibold text-zinc-900">{filteredStartsWithPlus(mobileNumber) ? "" : detectedCountry.code + " "}{mobileNumber}</span>. Please insert code:
                </p>

                {/* OTP Boxes Grid */}
                <div className="flex justify-between space-x-4 max-w-[280px] mx-auto mb-8">
                  {otpCode.map((digit, idx) => (
                    <input 
                      key={idx}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      placeholder="•"
                      className="w-14 h-14 border border-zinc-200 rounded-[14px] text-center bg-zinc-50 text-xl font-sans font-semibold text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                    />
                  ))}
                </div>

                {/* Verification Action */}
                <button 
                  onClick={handleVerifyOtp}
                  style={{ background: "linear-gradient(135deg, #2B00EB 0%, #0D0050 100%)" }}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-[16px] text-white font-sans text-sm font-medium tracking-tight shadow-md active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Submit security code</span>
                </button>
              </div>

              {/* Resend actions footer */}
              <div className="text-center mt-4">
                {otpResendTimer > 0 ? (
                  <p className="text-xs font-inter text-[#707070]">
                    Resend secure key in <span className="font-semibold text-zinc-900">{otpResendTimer}s</span>
                  </p>
                ) : (
                  <button 
                    onClick={() => {
                      setOtpResendTimer(30);
                      triggerToast("New mock verification key sent!", "info");
                    }}
                    className="text-xs font-inter font-semibold text-accent underline cursor-pointer"
                  >
                    Resend authentication key
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 4: AUTH LOADING */}
          {screen === "auth-loading" && (
            <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white z-20 text-center">
              {/* Spinner anim with logo in center */}
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 border-[2.5px] border-zinc-100 border-t-accent rounded-full"
                ></motion.div>
                <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-xs">
                  <img src="/image/moodgridlogo.svg" alt="MoodGrid Logo" className="w-11 h-11 object-contain" />
                </div>
              </div>

              {/* Text Phases */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={authLoadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1.5"
                >
                  <p className="text-xs font-inter font-bold tracking-widest text-[#707070] uppercase">
                    Security Sync
                  </p>
                  <h3 className="text-base font-sans font-semibold text-zinc-900 max-w-[200px] mx-auto leading-relaxed">
                    {authLoadingStep === 0 && "Decoding mobile signature..."}
                    {authLoadingStep === 1 && "Verifying authentication matrix..."}
                    {authLoadingStep === 2 && "Establishing secure workspace..."}
                    {authLoadingStep === 3 && "Synthesizing custom layout variables..."}
                  </h3>
                </motion.div>
              </AnimatePresence>

              {/* Subtle visual timer index bars */}
              <div className="flex justify-center space-x-1 mt-8">
                {[0, 1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`h-1 rounded-full transition-all duration-300 ${s <= authLoadingStep ? "w-6 bg-accent" : "w-1.5 bg-zinc-200"}`}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 5: ONBOARDING DETAILS */}
          {screen === "onboarding" && (
            <div className="flex-1 flex flex-col justify-between py-6 px-4 w-full bg-white z-20">
              <div className="overflow-y-auto pr-1">
                <h1 className="text-2xl font-sans font-bold tracking-tight text-zinc-950 mb-1 mt-2">
                  About your studio.
                </h1>
                <p className="text-xs font-inter text-[#707070] mb-6">
                  Fill in your details to customize the editorial moodboard engine.
                </p>

                {/* Form Elements */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070] mb-1.5">
                      Full name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Jhon Doe"
                      value={onboardName}
                      onChange={(e) => setOnboardName(e.target.value)}
                      className="w-full px-4 py-3 border-[1.5px] border-zinc-300 rounded-[14px] bg-white text-sm font-sans font-normal text-[#1c1c1c] placeholder-[#404040] focus:outline-none focus:ring-2 focus:ring-[#2B00EB]/10 focus:border-[#2B00EB] transition-all"
                      style={{ fontWeight: "normal", color: "#1c1c1c" }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070] mb-1.5">
                      Username
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-zinc-500 text-sm font-mono select-none">@</span>
                      <input 
                        type="text" 
                        placeholder="jhondoe"
                        value={onboardUsername}
                        onChange={(e) => setOnboardUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                        className="w-full pl-8 pr-4 py-3 border-[1.5px] border-zinc-300 rounded-[14px] bg-white text-sm font-sans font-normal text-zinc-900 placeholder-[#404040] focus:outline-none focus:ring-2 focus:ring-[#2B00EB]/10 focus:border-[#2B00EB] transition-all"
                        style={{ fontWeight: "normal" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070] mb-1.5">
                      Email
                    </label>
                    <input 
                      type="email" 
                      placeholder="jhondoe@gmail.com"
                      value={onboardEmail}
                      onChange={(e) => setOnboardEmail(e.target.value)}
                      className="w-full px-4 py-3 border-[1.5px] border-zinc-300 rounded-[14px] bg-white text-sm font-sans font-normal text-[#404040] placeholder-[#404040] focus:outline-none focus:ring-2 focus:ring-[#2B00EB]/10 focus:border-[#2B00EB] transition-all"
                      style={{ fontWeight: "normal", color: "#404040" }}
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070] mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Type to search design hubs..."
                        value={onboardLocation}
                        onChange={(e) => {
                          setOnboardLocation(e.target.value);
                          setLocationSearchOpen(true);
                        }}
                        onFocus={() => setLocationSearchOpen(true)}
                        onBlur={() => {
                          setTimeout(() => setLocationSearchOpen(false), 250);
                        }}
                        className="w-full pl-10 pr-4 py-3 border-[1.5px] border-zinc-300 rounded-[14px] bg-white text-sm font-sans font-normal text-zinc-900 placeholder-[#404040] focus:outline-none focus:ring-2 focus:ring-[#2B00EB]/10 focus:border-[#2B00EB] transition-all"
                        style={{ fontWeight: "normal" }}
                      />
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-[15px]" />
                    </div>

                    {locationSearchOpen && (
                      <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-zinc-200 rounded-[14px] shadow-lg z-50 py-1.5 divide-y divide-zinc-50 font-sans">
                        {((onboardLocation.trim() === "" 
                          ? CREATIVE_CITIES 
                          : CREATIVE_CITIES.filter(c => 
                              `${c.city}, ${c.state}, ${c.country}`.toLowerCase().includes(onboardLocation.toLowerCase())
                            )
                        )).length > 0 ? (
                          (onboardLocation.trim() === "" 
                            ? CREATIVE_CITIES 
                            : CREATIVE_CITIES.filter(c => 
                                `${c.city}, ${c.state}, ${c.country}`.toLowerCase().includes(onboardLocation.toLowerCase())
                              )
                          ).map((item, sIdx) => {
                            const fullStr = `${item.city}, ${item.state}, ${item.country}`;
                            return (
                              <button
                                key={`loc-suggest-${sIdx}`}
                                type="button"
                                onMouseDown={() => {
                                  setOnboardLocation(fullStr);
                                  setLocationSearchOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors flex flex-col cursor-pointer"
                              >
                                <span className="text-sm font-medium text-zinc-900">{item.city}</span>
                                <span className="text-[11px] text-zinc-400">{item.state}, {item.country}</span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-3 text-xs text-zinc-400 italic">
                            No curated hubs found, press enter to use custom
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Creative Industry pills */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070]">
                        Creative industry
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400 font-medium">{onboardIndustries.length}/5 selected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pt-1 rounded-md">
                      {INDUSTRIES_LIST.map((tag) => {
                        const active = onboardIndustries.includes(tag);
                        return (
                          <button 
                            key={`ind-${tag}`}
                            type="button"
                            onClick={() => handleToggleIndustry(tag)}
                            className={`px-3 py-1.5 rounded-[10px] font-inter text-[11px] font-semibold tracking-tight transition-all flex items-center space-x-1.5 border cursor-pointer ${
                              active 
                                ? "bg-zinc-950 text-white border-zinc-950 shadow-inner" 
                                : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? '#FFFFFF' : '#D4D4D8' }} />
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Visual Aesthetics pills */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070]">
                        Visual aesthetics
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400 font-medium">{onboardAesthetics.length}/5 selected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pt-1 rounded-md">
                      {AESTHETICS_LIST.map((tag) => {
                        const active = onboardAesthetics.includes(tag);
                        return (
                          <button 
                            key={`aes-${tag}`}
                            type="button"
                            onClick={() => handleToggleAesthetic(tag)}
                            className={`px-3 py-1.5 rounded-[10px] font-inter text-[11px] font-semibold tracking-tight transition-all flex items-center space-x-1.5 border cursor-pointer ${
                              active 
                                ? "bg-zinc-950 text-white border-zinc-950 shadow-inner" 
                                : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? '#FFFFFF' : '#D4D4D8' }} />
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and finish onboarding footer */}
              <div className="pt-4 border-t border-zinc-100 mt-4">
                <button 
                  onClick={handleOnboardingSubmit}
                  style={{ background: "linear-gradient(135deg, #2B00EB 0%, #0D0050 100%)" }}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-[16px] text-white font-sans text-sm font-semibold tracking-tight shadow-md active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <span>Build Portfolio Feed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* MAIN TABS VIEWS (HOME, GENERATE, SAVED, PROFILE) */}
          {["feed", "generate", "saved", "profile"].includes(screen) && (
            <div className="flex-1 h-full min-h-0 flex flex-col bg-white">
              
              {/* COMPONENT: SCREEN HEADERS */}
              <div className="px-6 pt-5 pb-3 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-30 shrink-0">
                <div>
                  <h1 className="text-[20px] font-sans font-bold tracking-tight text-zinc-950 leading-tight">
                    {activeTab === "home" && "Explore"}
                    {activeTab === "generate" && "Creative Hub"}
                    {activeTab === "saved" && "Pinned"}
                    {activeTab === "profile" && "Portfolio"}
                  </h1>
                </div>
                
                {/* Decorative status index tag */}
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-inter font-bold tracking-wider text-accent uppercase">
                    MoodGrid
                  </span>
                  <button 
                    onClick={() => {
                      setActiveTab("profile");
                      setScreen("feed");
                    }}
                    title="User Portfolio"
                    className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-250 flex items-center justify-center text-[11px] font-inter font-extrabold text-zinc-800 select-none hover:bg-zinc-200 hover:border-zinc-400 active:scale-95 transition-all cursor-pointer"
                  >
                    {session.fullName ? session.fullName[0].toUpperCase() : "D"}
                  </button>
                </div>
              </div>

              {/* ACTIVE TAB DISPLAY LOGIC */}
              <div className={`flex-1 min-h-0 ${activeTab === "home" ? "overflow-y-auto snap-y snap-mandatory scroll-smooth" : "overflow-y-auto pb-4"}`}>
                
                {/* TAB 1: HOME/FEED */}
                {activeTab === "home" && (
                  <div className="flex flex-col">
                    {feedBoards.map((board, idx) => {
                      const featuredImg = board.panels.find((p) => p.type === "image_reference")?.imageUrl || getIndustryImage(board.industry, idx);
                      const isLiked = board.likedByMe;
                      const isSaved = board.savedByMe;

                      // Extract typography and colors for live side-by-side spec layout preview
                      const typeTitle = board.panels.find(p => p.type === "typography_spec")?.title || "Editorial";
                      const typeDesc = board.panels.find(p => p.type === "typography_spec")?.content || "Elegant serif pairing.";

                      return (
                        <div 
                          key={`feed-board-${board.id}-${idx}`}
                          className="w-full h-[calc(100vh-145px)] sm:h-[663px] snap-start shrink-0 flex flex-col justify-between p-5 relative border-b border-zinc-150 bg-white"
                        >
                          {/* 1. Header of the Card */}
                          <div className="flex items-center justify-between pb-3 shrink-0">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2B00EB] to-[#1E1B4B] text-white flex items-center justify-center font-sans font-black text-xs shadow-xs">
                                {board.createdBy[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-xs font-sans font-bold text-zinc-900 tracking-tight leading-none">{board.createdBy}</span>
                                </div>
                                <span className="text-[9px] font-inter text-[#707070] font-bold uppercase tracking-wider leading-none mt-1 inline-block">{board.industry}</span>
                              </div>
                            </div>
                            
                            <button 
                              onClick={(e) => handleToggleSaveAction(e, board)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                                isSaved ? "bg-[#2B00EB]/10 text-[#2B00EB]" : "bg-zinc-50 hover:bg-zinc-100 text-zinc-400"
                              }`}
                              title="Pin of this concept"
                            >
                              <Pin className={`w-3.5 h-3.5 rotate-45 ${isSaved ? "fill-[#2B00EB] text-[#2B00EB]" : ""}`} />
                            </button>
                          </div>

                          {/* 2. Central Split Spec bento collage layout */}
                          <div 
                            onClick={() => {
                              setCurrentResult(board);
                              setScreen("result");
                            }}
                            className="grow my-1 bg-zinc-50 border border-zinc-200/65 rounded-[22px] overflow-hidden flex cursor-pointer hover:border-zinc-300 transition-all shadow-xs group"
                          >
                            {/* Left: Featured Image */}
                            <div className="w-[58%] h-full relative overflow-hidden border-r border-zinc-100">
                              <img 
                                src={featuredImg} 
                                alt={board.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3 bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-inter font-bold uppercase tracking-widest text-white">
                                Art core
                              </div>
                            </div>

                            {/* Right Spec metrics */}
                            <div className="w-[42%] h-full flex flex-col justify-between p-3 bg-[#FAFBFD] space-y-3">
                              
                              {/* Swatches block */}
                              <div className="space-y-1.5">
                                <span className="text-[8px] font-inter font-bold tracking-wider text-zinc-400 uppercase">Swatches</span>
                                <div className="grid grid-cols-2 gap-1">
                                  {board.colors.slice(0, 4).map((col, cIdx) => (
                                    <div key={`sw-${cIdx}`} className="flex items-center space-x-1 bg-white p-1 rounded-[6px] border border-zinc-100 shadow-3xs">
                                      <span className="w-2.5 h-2.5 rounded-full shrink-0 flex-none" style={{ backgroundColor: col.hex }} />
                                      <span className="text-[7.5px] font-mono font-medium text-zinc-500 uppercase leading-none truncate">{col.hex}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Typography segment block */}
                              <div className="border-t border-zinc-150/60 pt-2.5 space-y-1">
                                <span className="text-[8px] font-inter font-bold tracking-wider text-zinc-400 uppercase">Typography</span>
                                <div className="bg-white p-1.5 rounded-[8px] border border-zinc-100 shadow-3xs">
                                  <p className="text-[9.5px] font-sans font-black text-zinc-800 tracking-tight leading-tight line-clamp-1">
                                    {typeTitle}
                                  </p>
                                  <p className="text-[7px] font-inter text-[#707070] font-medium leading-normal line-clamp-2 mt-0.5">
                                    {typeDesc}
                                  </p>
                                </div>
                              </div>

                              {/* Tone Narrative preview segment */}
                              <div className="border-t border-zinc-150/60 pt-2.5 flex-1 flex flex-col justify-end">
                                <span className="text-[8px] font-inter font-bold tracking-wider text-zinc-400 uppercase mb-1">Tone profile</span>
                                <div className="text-[8.5px] font-inter text-zinc-600 font-bold leading-normal line-clamp-3 bg-zinc-150/30 p-1.5 rounded-[8px] italic">
                                  "{board.tagline || String(board.adjectives.slice(0, 3).join(', '))}"
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* 3. Bottom text description & CTA controls */}
                          <div className="pt-2 shrink-0 space-y-2.5">
                            <div className="flex items-start justify-between space-x-4">
                              <div>
                                <h3 className="text-xs.5 font-sans font-extrabold text-zinc-950 tracking-tight line-clamp-1 leading-tight">
                                  {board.title}
                                </h3>
                                <p className="text-[10.5px] font-inter text-[#707070] font-medium leading-relaxed line-clamp-1">
                                  {board.tagline}
                                </p>
                              </div>
                              <span className="text-[9.5px] font-mono text-zinc-400 font-medium">By {board.createdBy.split(" ")[0]}</span>
                            </div>

                            {/* Card action controls footer bar */}
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                              <div className="flex space-x-3.5">
                                <button 
                                  onClick={(e) => handleLikeBoardAction(e, board.id)}
                                  className={`flex items-center space-x-1.5 text-xs font-inter font-bold transition-transform active:scale-95 cursor-pointer ${
                                    isLiked ? "text-[#2B00EB]" : "text-zinc-500 hover:text-black"
                                  }`}
                                >
                                  <Heart className={`w-[15px] h-[15px] ${isLiked ? "fill-[#2B00EB] stroke-[#2B00EB]" : ""}`} />
                                  <span>{board.likesCount}</span>
                                </button>
                              </div>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemixBoard(board);
                                }}
                                className="flex items-center space-x-1 bg-[#2B00EB]/10 hover:bg-[#2B00EB] text-[#2B00EB] hover:text-white px-3.5 py-1.5 rounded-[12px] text-xs font-inter font-bold transition-all active:scale-95 cursor-pointer"
                                title="Remix concept elements"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Remix Spec</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 2: GENERATE FORM */}
                {activeTab === "generate" && (
                  <div className="p-5 space-y-6">
                    <p className="text-xs font-inter text-[#707070] leading-relaxed -mt-2">
                      Structure your art direction. Choose dynamic base accent colors, choose target context industry, and define the style.
                    </p>

                    <div>
                      <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070] uppercase mb-2">
                        Base Palette Swatches (Tap to Edit)
                      </label>
                      <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-[16px] border border-zinc-100">
                        <div className="flex space-x-2">
                          {customColors.map((color, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setActiveColorIdx(idx);
                                setEditColorHex(color);
                              }}
                              style={{ backgroundColor: color }}
                              className={`w-10 h-10 rounded-full border-2 transition-transform h-10 ${
                                idx === activeColorIdx ? "border-accent scale-105 shadow-md" : "border-white/50"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-inter font-bold text-[#707070]">
                          5 Swatches
                        </span>
                      </div>

                      {/* Swatch Editor */}
                      <div className="mt-3 p-3 bg-zinc-50 rounded-[14px] flex items-center justify-between border border-zinc-100">
                        <span className="text-[11px] font-inter text-[#707070] font-semibold">
                          Edit swatch {activeColorIdx + 1}:
                        </span>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="text"
                            value={editColorHex}
                            onChange={(e) => handleUpdateActiveColor(e.target.value)}
                            className="w-20 px-2 py-1 bg-white border border-zinc-200 rounded-md text-center text-xs font-inter font-semibold text-zinc-800"
                          />
                          <input 
                            type="color"
                            value={editColorHex}
                            onChange={(e) => handleUpdateActiveColor(e.target.value)}
                            className="w-8 h-8 rounded-full border-0 cursor-pointer overflow-hidden p-0"
                          />
                        </div>
                      </div>

                      {/* Presets Row */}
                      <div className="mt-4">
                        <span className="block text-[10px] font-inter font-bold text-zinc-400 mb-2 uppercase">
                          Or load designer preset:
                        </span>
                        <div className="flex space-x-1.5 overflow-x-auto pb-1">
                          {PRESET_PALETTES.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => handleSelectPresetPalette(preset.colors)}
                              className="shrink-0 bg-white border border-zinc-200 py-1.5 px-2.5 rounded-[12px] flex items-center space-x-1 hover:border-accent active:scale-[0.98] cursor-pointer"
                            >
                              <div className="flex -space-x-1.5">
                                {preset.colors.slice(0, 3).map((c, i) => (
                                  <span key={i} style={{ backgroundColor: c }} className="w-2.5 h-2.5 rounded-full border border-white" />
                                ))}
                              </div>
                              <span className="text-[10px] font-inter font-bold text-zinc-700">{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Creative direction narrative input */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070] uppercase">
                          Creative Direction Narrative
                        </label>
                        <button 
                          onClick={() => {
                            const prompts = [
                              "A crisp morning in Paris, warm wool coat, coffee vapor, light cedar and black steel shadows.",
                              "Brutalist concrete architecture in Berlin with neon blue and green laser guidelines cutting cold dust.",
                              "Copenhagen organic flax textiles, unpolished birchwood, natural clay pots under high soft white ambient daylight.",
                              "Spiced amber perfume flask aesthetic, dark rich leather glazes, chiaroscuro shadows with warm golden glow accents."
                            ];
                            const choose = prompts[Math.floor(Math.random() * prompts.length)];
                            setCreativeDirection(choose);
                          }}
                          className="text-[10px] font-inter font-bold text-accent hover:underline flex items-center space-x-0.5 cursor-pointer"
                        >
                          <RefreshCcw className="w-3 h-3" />
                          <span>Autofill Vibe</span>
                        </button>
                      </div>
                      <textarea 
                        rows={3}
                        placeholder="A quiet wool jacket story, light oak tables and morning window cast shadows with small minimal cobalt brand accents..."
                        value={creativeDirection}
                        onChange={(e) => setCreativeDirection(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-[14px] bg-white text-sm font-sans text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      />
                    </div>

                    {/* Choose Industry */}
                    <div>
                      <label className="block text-[11px] font-inter font-medium tracking-wider text-[#707070] uppercase mb-2">
                        Target Industry
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Fashion & Apparel", 
                          "Interior Architecture", 
                          "Sleek Digital Tech", 
                          "Fine Gastronomy", 
                          "Art & Gallery Spec",
                          "Industrial Craft"
                        ].map((ind) => {
                          const active = selectedIndustry === ind;
                          return (
                            <button
                              key={ind}
                              onClick={() => setSelectedIndustry(ind)}
                              className={`py-2.5 px-3 border rounded-[14px] text-left font-inter text-xs font-semibold transition-all cursor-pointer ${
                                active 
                                  ? "border-accent bg-accent/5 text-accent font-bold shadow-sm"
                                  : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                              }`}
                            >
                              {ind}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action button trigger generation */}
                    <div className="pt-4">
                      <button
                        onClick={handleGenerateMoodboard}
                        style={{ background: "linear-gradient(135deg, #2B00EB 0%, #0D0050 100%)" }}
                        className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-[16px] text-white font-sans text-sm font-semibold tracking-tight shadow-md active:scale-[0.98] transition-transform cursor-pointer mt-2"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Generate MoodGrid Vision</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: SAVED COLLECTION */}
                {activeTab === "saved" && (
                  <div className="p-5">
                    {savedBoardsList.length === 0 ? (
                      <div className="text-center py-16 px-4 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                          <Pin className="w-5 h-5 text-zinc-400 rotate-45" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-sans font-bold text-zinc-900">Your collection is empty</h3>
                          <p className="text-xs font-inter text-[#707070] max-w-[200px] mx-auto leading-relaxed">
                            Generate visual concepts and click Pin to store them here in secure device memory.
                          </p>
                        </div>
                        <button 
                          onClick={() => setActiveTab("generate")}
                          className="shrink-0 font-inter text-xs font-semibold text-accent border border-zinc-200 py-2 px-4 rounded-[12px] bg-white text-center mt-2"
                        >
                          Generate Now
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {savedBoardsList.map((board, idx) => {
                          const featuredImg = board.panels.find((p) => p.type === "image_reference")?.imageUrl || getIndustryImage(board.industry, idx);
                          return (
                            <div 
                              key={`saved-board-${board.id}-${idx}`}
                              onClick={() => {
                                setCurrentResult(board);
                                setScreen("result");
                              }}
                              className="bg-white border border-zinc-100 rounded-[20px] overflow-hidden flex flex-col group cursor-pointer active:scale-[0.98] hover:border-zinc-300 transition-all"
                            >
                              <div className="h-28 bg-zinc-100 relative overflow-hidden">
                                <img 
                                  src={featuredImg} 
                                  alt={board.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-2 left-2 flex space-x-1 bg-black/30 backdrop-blur-xs py-1 px-1 rounded-full">
                                  {board.colors.slice(0, 3).map((col, colIdx) => (
                                    <span 
                                      key={`${col.hex}-${colIdx}`} 
                                      style={{ backgroundColor: col.hex }}
                                      className="w-2 h-2 rounded-full border border-white/20"
                                    ></span>
                                  ))}
                                </div>
                              </div>
                              <div className="p-3">
                                <h3 className="text-xs font-sans font-bold text-zinc-900 line-clamp-1 mb-0.5">
                                  {board.title}
                                </h3>
                                <p className="text-[10px] font-inter text-zinc-400 font-medium truncate">
                                  {board.industry}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: PROFILE & SETTINGS */}
                {activeTab === "profile" && (
                  <div className="p-5 space-y-6">
                    {/* Author Intro block */}
                    <div className="flex items-center space-x-4 bg-zinc-50 p-4 rounded-[20px] border border-zinc-100">
                      <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-xl font-sans font-bold border border-zinc-200 shadow-inner">
                        {session.fullName ? session.fullName[0].toUpperCase() : "D"}
                      </div>
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <h2 className="text-sm font-sans font-bold text-zinc-900">{session.fullName || "Studio Designer"}</h2>
                          {session.username && (
                            <span className="text-[10px] font-mono font-medium text-accent">@{session.username}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-zinc-400 text-[10px] font-inter font-medium mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{session.email || "designer@studio.ai"}</span>
                        </div>
                        {session.location && (
                          <div className="flex items-center space-x-1 text-zinc-400 text-[10px] font-inter font-medium mt-0.5">
                            <MapPin className="w-3 h-3 text-zinc-400" />
                            <span>{session.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Client stats metrics values */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#FAFAFA] border border-zinc-150 p-3 rounded-[14px] text-center">
                        <span className="block text-lg font-sans font-bold text-zinc-900">
                          {feedBoards.length}
                        </span>
                        <span className="text-[9px] font-inter font-bold text-[#707070] uppercase tracking-wider">
                          Created
                        </span>
                      </div>
                      <div className="bg-[#FAFAFA] border border-zinc-150 p-3 rounded-[14px] text-center">
                        <span className="block text-lg font-sans font-bold text-zinc-900">
                          {savedBoardsList.length}
                        </span>
                        <span className="text-[9px] font-inter font-bold text-[#707070] uppercase tracking-wider">
                          Saved
                        </span>
                      </div>
                      <div className="bg-[#FAFAFA] border border-zinc-150 p-3 rounded-[14px] text-center">
                        <span className="block text-lg font-sans font-bold text-zinc-900">
                          {feedBoards.reduce((acc, current) => acc + (current.likedByMe ? 1 : 0), 0)}
                        </span>
                        <span className="text-[9px] font-inter font-bold text-[#707070] uppercase tracking-wider">
                          Liked
                        </span>
                      </div>
                    </div>

                    {/* Interest details read out */}
                    {session.interests && session.interests.length > 0 && (
                      <div>
                        <span className="block text-[11px] font-inter font-bold tracking-wider text-[#707070] uppercase mb-2">
                          My Aesthetic Preferences
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {session.interests.map((tag, tagIdx) => (
                            <span 
                              key={`${tag}-${tagIdx}`}
                              className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-inter font-semibold text-zinc-600 border border-zinc-150"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* published boards section grid */}
                    <div>
                      <span className="block text-[11px] font-inter font-bold tracking-wider text-[#707070] uppercase mb-3">
                        My Published Boards
                      </span>
                      {feedBoards.filter((b) => b.createdBy === session.fullName).length === 0 ? (
                        <p className="text-xs font-inter text-zinc-400 italic">No published boards yet. Generate and click publish.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {feedBoards.filter((b) => b.createdBy === session.fullName).map((board, bIdx) => (
                            <div 
                              key={`profile-board-${board.id}-${bIdx}`}
                              onClick={() => {
                                setCurrentResult(board);
                                setScreen("result");
                              }}
                              className="bg-white border border-borderColor rounded-[14px] overflow-hidden cursor-pointer"
                            >
                              <div className="h-20 bg-zinc-100 relative">
                                <img 
                                  src={board.panels.find((p) => p.type === "image_reference")?.imageUrl || getIndustryImage(board.industry, 0)} 
                                  alt={board.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="p-2 text-[10px] font-inter font-bold text-zinc-800 truncate">{board.title}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Log out reset button detail */}
                    <div className="pt-4 border-t border-zinc-100">
                      <button
                        onClick={handleResetSession}
                        className="w-full flex items-center justify-center space-x-2 py-3 border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 rounded-[16px] text-xs font-inter font-bold active:scale-[0.98] transition-transform cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Reset Workspace Session / Sign out</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* COMPONENT: BOTTOM NAVIGATION TAB BAR */}
              <div className="h-[83px] bg-white border-t border-zinc-150 flex items-center justify-around px-4 pb-5 shrink-0 z-30">
                <button 
                  onClick={() => {
                    setActiveTab("home");
                    setScreen("feed");
                  }}
                  className="flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Home"
                >
                  <Home className={`w-6 h-6 transition-colors duration-200 ${activeTab === "home" ? "text-accent stroke-[2.25px]" : "text-zinc-400 stroke-[1.75px]"}`} />
                </button>

                <div className="flex items-center justify-center">
                  <button 
                    onClick={() => {
                      setActiveTab("generate");
                      setScreen("feed");
                    }}
                    className={`flex items-center justify-center rounded-full shadow-md transition-all duration-200 cursor-pointer active:scale-95 ${
                      activeTab === "generate" 
                        ? "bg-gradient-to-tr from-[#2B00EB] to-[#1E1B4B] w-12 h-12 shadow-lg brightness-110 border border-zinc-950/25" 
                        : "bg-gradient-to-tr from-[#2B00EB] to-[#5a38ff] w-12 h-12 hover:scale-105"
                    }`}
                    title="Generate Spec"
                  >
                    <Sparkles className="w-5 h-5 text-white stroke-[1.85px]" />
                  </button>
                </div>

                <button 
                  onClick={() => {
                    setActiveTab("saved");
                    setScreen("feed");
                  }}
                  className="flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Pinned"
                >
                  <Pin className={`w-6 h-6 rotate-45 transition-colors duration-200 ${activeTab === "saved" ? "text-accent stroke-[2.25px]" : "text-zinc-400 stroke-[1.75px]"}`} />
                </button>
              </div>

            </div>
          )}

          {/* SCREEN 8: GENERATING IN PROCESS */}
          {screen === "loading-gen" && (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#070513] text-white p-10 z-20 text-center relative overflow-hidden">
              {/* Complex gradient pulsing visual-first orb */}
              <div className="absolute w-[300px] h-[300px] bg-indigo-900/10 rounded-full blur-[80px] -top-12 -left-12"></div>
              <div className="absolute w-[250px] h-[250px] bg-accent/20 rounded-full blur-[80px] -bottom-12 -right-12 animate-pulse"></div>

              {/* Animated orb shape (keyframed inline CSS) */}
              <div className="relative w-28 h-28 mb-10 mt-4 flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-accent to-[#E53935] rounded-full filter blur-md opacity-40 animate-pulse scale-105"
                  style={{ animationDuration: "2.5s" }}
                ></div>
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/20 flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-8 h-8 text-accent animate-bounce" style={{ animationDuration: "3s" }} />
                </div>
              </div>

              {/* Step Sequence message displayer */}
              <div className="space-y-2 mt-4 max-w-[240px]">
                <span className="text-[10px] font-inter font-bold tracking-widest text-accent uppercase">
                  Moodboard Synthesizer
                </span>
                
                <h3 className="text-base font-sans font-semibold text-white tracking-tight leading-relaxed">
                  {genLoadingStep === 0 && "Interpreting creative direction..."}
                  {genLoadingStep === 1 && "Synthesizing color depths..."}
                  {genLoadingStep === 2 && "Generatively mapping textures..."}
                  {genLoadingStep >= 3 && "Curating custom Bento compositions..."}
                </h3>
                
                <p className="text-[11px] font-inter text-zinc-400 leading-normal font-medium italic">
                  "{creativeDirection.length > 50 ? creativeDirection.slice(0, 50) + "..." : creativeDirection}"
                </p>
              </div>

              {/* Standard status progress indicators */}
              <div className="w-full max-w-[200px] h-[3px] bg-white/10 rounded-full overflow-hidden mt-8 mx-auto">
                <div 
                  className="h-full bg-accent transition-all duration-300" 
                  style={{ width: `${Math.min(100, (genLoadingStep + 1) * 25)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* SCREEN 9: GENERATED RESULT VIEW */}
          {screen === "result" && currentResult && (
            <div className="flex-1 flex flex-col justify-between bg-white z-20 overflow-y-auto">
              
              {/* Header inside result */}
              <div className="px-6 pt-5 pb-3 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-30">
                <button 
                  onClick={() => {
                    // Navigate back to where they came from
                    setScreen("feed");
                  }}
                  className="flex items-center space-x-1 text-zinc-500 hover:text-black font-inter text-xs font-semibold cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <span className="text-[10px] font-inter font-bold bg-accent/10 text-accent px-3 py-1 rounded-full uppercase">
                  {currentResult.industry}
                </span>
              </div>

              {/* Main Content scroll body */}
              <div className="p-6 space-y-6 flex-1">
                
                {/* Board info */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-sans font-bold tracking-tight text-zinc-950">
                    {currentResult.title}
                  </h1>
                  <p className="text-xs font-inter text-[#707070] leading-relaxed italic">
                    {currentResult.tagline}
                  </p>
                  
                  {/* Evocative adjectives */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentResult.adjectives.map((adj, adjIdx) => (
                      <span 
                        key={`${adj}-${adjIdx}`}
                        className="px-2 py-0.5 rounded-[4px] bg-zinc-50 text-zinc-600 border border-zinc-150 text-[10px] font-inter font-bold uppercase tracking-wider"
                      >
                        {adj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* UPGRADED SEGMENTED SUB-TABS */}
                <div className="flex bg-zinc-100 p-1 rounded-[14px]">
                  <button
                    onClick={() => setResultTab("grid")}
                    className={`flex-1 text-center py-2.5 text-xs font-sans font-extrabold transition-all rounded-[10px] cursor-pointer ${
                      resultTab === "grid" 
                        ? "bg-white text-zinc-950 shadow-xs" 
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    Bento Grid
                  </button>
                  <button
                    onClick={() => setResultTab("mockups")}
                    className={`flex-1 text-center py-2.5 text-xs font-sans font-extrabold transition-all rounded-[10px] cursor-pointer ${
                      resultTab === "mockups" 
                        ? "bg-white text-zinc-950 shadow-xs" 
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    Live Mockups
                  </button>
                  <button
                    onClick={() => setResultTab("specs")}
                    className={`flex-1 text-center py-2.5 text-xs font-sans font-extrabold transition-all rounded-[10px] cursor-pointer ${
                      resultTab === "specs" 
                        ? "bg-white text-zinc-950 shadow-xs" 
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    Guidelines
                  </button>
                </div>

                {/* SUB-TAB CONTENTS */}

                {/* TAB 1: BENTO COLLEGE COLLAGE */}
                {resultTab === "grid" && (
                  <div className="grid grid-cols-2 gap-3.5 pr-0.5 animate-fadeIn">
                    {currentResult.panels.map((panel, idx) => {
                      const dynamicColSpan = panel.colSpan === 2 ? "col-span-2" : "col-span-1";
                      const dynamicRowSpan = panel.rowSpan === 2 ? "row-span-2" : "row-span-1";
                      
                      return (
                        <div
                          key={`result-panel-${panel.id || 'idx'}-${idx}`}
                          className={`relative rounded-[20px] overflow-hidden border border-zinc-100 flex flex-col justify-between p-4 min-h-[140px] shadow-xs ${dynamicColSpan} ${dynamicRowSpan}`}
                          style={{
                            backgroundColor: panel.type === 'color_accent' ? panel.content : '#FAFAFA'
                          }}
                        >
                          {/* Render based on panel type rules */}
                          
                          {/* TYPE: COLOR ACCENT */}
                          {panel.type === 'color_accent' && (
                            <div className="flex flex-col justify-between h-full w-full">
                              <span className="text-[10px] uppercase font-inter font-bold tracking-wide mix-blend-difference text-white">
                                Accent Spot
                              </span>
                              <div className="space-y-0.5">
                                <p className="text-xs font-inter font-bold tracking-tight mix-blend-difference text-white truncate">
                                  {panel.title}
                                </p>
                                <code className="text-[9px] font-inter font-bold tracking-wider mix-blend-difference text-white">
                                  {panel.content}
                                </code>
                              </div>
                            </div>
                          )}

                          {/* TYPE: IMAGE REFERENCE */}
                          {panel.type === 'image_reference' && panel.imageUrl && (
                            <div className="absolute inset-0 z-0">
                              <img 
                                src={panel.imageUrl} 
                                alt={panel.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              {/* Dark gradient base overlay to let text breathe */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>
                              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10 text-white">
                                <span className="text-[9px] uppercase font-inter font-bold tracking-wider bg-white/20 backdrop-blur-xs py-0.5 px-1.5 rounded-full inline-block self-start">
                                  Visual Vibe
                                </span>
                                <div className="space-y-0.5">
                                  <h4 className="text-xs font-inter font-bold leading-tight">{panel.title}</h4>
                                  <p className="text-[9px] font-inter font-medium text-zinc-300 opacity-90 line-clamp-1">{panel.subtitle}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* TYPE: TYPOGRAPHY SPEC */}
                          {panel.type === 'typography_spec' && (
                            <div className="flex flex-col justify-between h-full bg-zinc-50 border border-zinc-200 p-4 rounded-[20px]">
                              <h3 className="text-4xl font-sans font-bold text-zinc-900 mb-2 leading-none">
                                {panel.title}
                              </h3>
                              <div className="space-y-1">
                                <p className="text-[10px] font-body italic text-zinc-700 leading-normal line-clamp-3">
                                  "{panel.content}"
                                </p>
                                <span className="text-[8px] font-inter font-bold text-[#707070] uppercase tracking-wider block">
                                  {panel.subtitle}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* TYPE: ABSTRACT GRAPHIC */}
                          {panel.type === 'abstract_graphic' && (
                            <div className="absolute inset-0 z-0 flex flex-col justify-between">
                              {panel.imageUrl ? (
                                <>
                                  <img src={panel.imageUrl} className="w-full h-full object-cover opacity-20 filter grayscale" alt="graphic bg" />
                                  <div className="absolute inset-4 flex flex-col justify-between z-10">
                                    <span className="text-[9px] font-inter font-bold text-[#707070] uppercase">Graphic Spec</span>
                                    <div>
                                      <h5 className="text-xs font-inter font-bold text-zinc-900 leading-tight">{panel.title}</h5>
                                      <p className="text-[8px] font-inter text-[#707070] truncate">{panel.content}</p>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="absolute inset-4 flex flex-col justify-between">
                                  <Grid className="w-8 h-8 text-zinc-200" />
                                  <div className="space-y-1">
                                    <h4 className="text-xs font-inter font-bold text-zinc-900">{panel.title}</h4>
                                    <p className="text-[9px] font-inter text-zinc-500">{panel.content}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* TYPE: CONCEPT WORDS */}
                          {panel.type === 'concept_words' && (
                            <div className="flex flex-col justify-between h-full">
                              <span className="text-[9px] font-inter font-bold text-zinc-400 uppercase tracking-widest">{panel.subtitle}</span>
                              <div className="space-y-2 my-2">
                                <h4 className="text-xs font-sans font-bold text-zinc-900 leading-snug">{panel.title}</h4>
                                <p className="text-[11px] font-body text-zinc-600 leading-relaxed font-medium">
                                  {panel.content}
                                </p>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 2: LIVE PREVIEW APPLICATIONS & REALISTIC MOCKUPS */}
                {resultTab === "mockups" && (
                  <div className="space-y-6 pr-0.5 animate-fadeIn">
                    <p className="text-[11px] font-inter text-[#707070] font-medium leading-relaxed bg-[#FAFBFD] p-3 rounded-[12px] border border-zinc-150">
                      We have simulated actual brand applications demonstrating your generated color strategy, design language guidelines, and visual resources.
                    </p>

                    {/* MOCKUP 1: PRETTY MOBILE APP PREVIEW DEVICE */}
                    <div className="border border-zinc-150 rounded-[24px] overflow-hidden bg-white shadow-sm">
                      <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                        <span className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-wider">Mockup A • Mobile Landing Page</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      
                      <div className="p-4 bg-zinc-100 flex justify-center">
                        {/* iPhone/Mobile emulator shell layout */}
                        <div className="w-[280px] rounded-[32px] bg-[#0d0d0d] p-2.5 shadow-xl border border-zinc-800">
                          <div className="bg-white rounded-[24px] overflow-hidden min-h-[360px] flex flex-col justify-between relative text-zinc-900">
                            
                            {/* Simulated Camera Notch */}
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#0d0d0d] rounded-full z-40 flex items-center justify-around px-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
                              <span className="w-3 h-1 bg-zinc-900 rounded-full"></span>
                            </div>

                            {/* App Header & Navigation */}
                            <div className="pt-6 px-4 pb-2.5 flex items-center justify-between bg-white border-b border-zinc-100 z-30">
                              <span className="text-[11px] font-sans font-black tracking-tight uppercase" style={{ color: currentResult.colors[0].hex }}>
                                {currentResult.title.split(" ")[0] || "BRAND"}
                              </span>
                              <div className="flex space-x-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                              </div>
                            </div>

                            {/* Main Body Grid */}
                            <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
                              
                              {/* Dynamic Image Cover Frame */}
                              <div className="h-28 rounded-[16px] overflow-hidden relative shadow-3xs bg-zinc-200">
                                <img 
                                  src={currentResult.panels.find(p => p.type === 'image_reference')?.imageUrl || getIndustryImage(currentResult.industry, 0)} 
                                  alt="Mobile visual focus area" 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <span className="absolute bottom-2 left-2.5 text-[8px] font-sans font-bold text-white tracking-widest uppercase">
                                  {currentResult.adjectives[0]} aesthetics
                                </span>
                              </div>

                              {/* Live Typography rendering with calculated font-style */}
                              <div className="space-y-1.5">
                                <h4 className="text-[15px] font-sans font-bold text-zinc-950 leading-tight tracking-tight">
                                  Introducing The Next Generation Concept
                                </h4>
                                <p className="text-[9.5px] font-inter text-[#707070] font-medium leading-relaxed">
                                  {currentResult.tagline}
                                </p>
                              </div>

                              {/* Interactive Swatch Line */}
                              <div className="flex space-x-1.5 py-1">
                                {currentResult.colors.slice(0, 4).map((col, idx) => (
                                  <div 
                                    key={idx} 
                                    className="flex-1 h-3 rounded-full flex items-center justify-center border border-black/5" 
                                    style={{ backgroundColor: col.hex }}
                                    title={col.name}
                                  />
                                ))}
                              </div>

                            </div>

                            {/* Dynamic Premium CTA Button styled with Brand Accent color */}
                            <div className="p-3 bg-white border-t border-zinc-50 text-center">
                              <button 
                                className="w-full py-2.5 rounded-[12px] text-white text-[10px] font-inter font-bold tracking-wider uppercase shadow-xs transition-transform active:scale-[0.97]"
                                style={{ 
                                  background: `linear-gradient(135deg, ${currentResult.colors[0].hex} 0%, ${currentResult.colors[0].hex}dd 100%)`
                                }}
                              >
                                Discover Experience
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MOCKUP 2: BRAND MANUAL SWATCH POSTER CARD */}
                    <div className="border border-zinc-150 rounded-[24px] overflow-hidden bg-white shadow-xs">
                      <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                        <span className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-wider">Mockup B • Identity Swatch Poster</span>
                        <span className="text-[9px] font-mono text-zinc-400">Spec v1.4</span>
                      </div>

                      <div className="p-5 bg-zinc-50 flex items-center justify-center">
                        <div className="w-[280px] bg-white border border-zinc-200 p-5 rounded-[16px] shadow-sm space-y-4 relative">
                          {/* Aesthetic graphic side margin stamp */}
                          <div className="absolute top-4 right-4 w-6 h-6 border-2 rounded-full flex items-center justify-center opacity-35" style={{ borderColor: currentResult.colors[0].hex }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentResult.colors[0].hex }}></div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[8px] font-mono uppercase tracking-widest text-[#707070]">Creative Core Spec</span>
                            <h3 className="text-sm font-sans font-extrabold text-zinc-950 tracking-tight leading-none">
                              {currentResult.title}
                            </h3>
                          </div>

                          {/* Soft visual horizontal color bands */}
                          <div className="space-y-1 pb-1">
                            {currentResult.colors.slice(0, 3).map((col, idx) => (
                              <div key={idx} className="h-5 rounded-[4px] flex items-center justify-between px-3 text-[9px] font-mono font-bold" style={{ backgroundColor: col.hex + "15", borderLeft: `3px solid ${col.hex}` }}>
                                <span className="text-zinc-700">{col.name}</span>
                                <span className="text-zinc-500 uppercase">{col.hex}</span>
                              </div>
                            ))}
                          </div>

                          {/* Swatch detail lists */}
                          <div className="border-t border-zinc-100 pt-3 space-y-2">
                            <div className="flex justify-between items-start text-[9.5px]">
                              <span className="font-inter text-[#707070]">Photography focus</span>
                              <span className="font-sans font-bold text-zinc-900 text-right max-w-[140px] leading-tight text-[9px]">
                                {currentResult.editorialSpecs.photographyStyle}
                              </span>
                            </div>
                            <div className="flex justify-between items-start text-[9.5px]">
                              <span className="font-inter text-[#707070]">Typography spec</span>
                              <span className="font-sans font-bold text-zinc-900 text-right max-w-[140px] leading-tight text-[9px]">
                                {currentResult.editorialSpecs.typographyPairing}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MOCKUP 3: INSTAGRAM COLLATERAL / PRODUCT LABEL */}
                    <div className="border border-zinc-150 rounded-[24px] overflow-hidden bg-white shadow-xs">
                      <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                        <span className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-wider">Mockup C • Editorial Social Post</span>
                        <span className="text-[9px] font-inter font-bold text-zinc-500 bg-zinc-150/40 px-2 py-0.5 rounded-full">Square</span>
                      </div>

                      <div className="p-4 bg-zinc-150 flex items-center justify-center">
                        {/* 1:1 Instagram Square mockup container layout */}
                        <div className="w-[260px] aspect-square bg-[#FCFCFD] border border-zinc-200 shadow-sm flex flex-col justify-between p-4.5 text-zinc-950 relative overflow-hidden">
                          
                          {/* Accent circle shadow background ornament */}
                          <div className="absolute w-36 h-36 rounded-full blur-[45px] -top-12 -right-12 opacity-15" style={{ backgroundColor: currentResult.colors[0].hex }}></div>

                          <div className="flex justify-between items-start z-10">
                            <span className="text-[7.5px] font-mono bg-zinc-900 text-white px-2 py-0.5 rounded-full tracking-wider uppercase font-extrabold">
                              {currentResult.industry}
                            </span>
                            <span className="text-[8.5px] font-inter font-bold text-zinc-400 italic">#{currentResult.adjectives[0].toLowerCase()}</span>
                          </div>

                          <div className="z-10 space-y-2 max-w-[90%] my-3">
                            {/* Dramatic big editorial text using custom typography title font styling */}
                            <h2 className="text-[21px] font-sans font-black tracking-tight text-zinc-900 leading-[1.1]">
                              {currentResult.title}
                            </h2>
                            <p className="text-[10px] font-inter text-[#707070] font-semibold leading-relaxed line-clamp-2">
                              {currentResult.tagline}
                            </p>
                          </div>

                          {/* Bottom Swatch Block Container with beautiful colors styling */}
                          <div className="flex items-center justify-between pt-3 border-t border-zinc-150/50 z-10">
                            <div className="flex space-x-1">
                              {currentResult.colors.slice(0, 3).map((col, idx) => (
                                <span 
                                  key={idx} 
                                  className="w-4 h-4 rounded-full border border-white block" 
                                  style={{ backgroundColor: col.hex }}
                                  title={col.name}
                                />
                              ))}
                            </div>
                            <span className="text-[8.5px] font-mono text-[#707070] font-bold uppercase">{currentResult.colors[0].hex} CORE</span>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 3: MINIMALIST SPECIFICATIONS & GUIDELINES */}
                {resultTab === "specs" && (
                  <div className="space-y-6 pr-0.5 animate-fadeIn">
                    
                    {/* COLOR PALETTE SPEC RANGE PRINT */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-sans font-bold tracking-wider text-[#707070] uppercase">
                        Refined Color Strategy
                      </h3>
                      <div className="grid grid-cols-1 gap-2.5">
                        {currentResult.colors.map((color, colorIdx) => (
                          <div 
                            key={`${color.hex}-${colorIdx}`} 
                            className="flex items-center justify-between p-3 rounded-[14px] bg-zinc-50 border border-zinc-150"
                          >
                            <div className="flex items-center space-x-3.5">
                              <span 
                                style={{ backgroundColor: color.hex }}
                                className="w-8 h-8 rounded-full border border-white shadow-xs block"
                              ></span>
                              <div>
                                <h4 className="text-xs font-sans font-bold text-zinc-900 leading-tight">{color.name}</h4>
                                <p className="text-[9.5px] font-inter text-[#707070] font-medium mt-0.5">{color.role}</p>
                              </div>
                            </div>
                            <code className="text-[10px] font-inter font-bold text-zinc-500 uppercase bg-zinc-100/70 border border-zinc-200 py-1 px-2.5 rounded-md">
                              {color.hex}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DESIGN ART DIRECTION SPEC NOTES */}
                    <div className="bg-[#FAFBFD] border border-zinc-150 p-5 rounded-[20px] space-y-4">
                      <h3 className="text-xs font-sans font-bold tracking-wider text-[#707070] uppercase">
                        Editorial Specifications
                      </h3>

                      <div className="space-y-4.5">
                        <div className="border-b border-zinc-150/40 pb-3.5">
                          <h4 className="text-xs font-sans font-bold text-zinc-900 flex items-center mb-1">
                            <Sliders className="w-3.5 h-3.5 mr-1.5 text-accent" />
                            <span>Typography Intent</span>
                          </h4>
                          <p className="text-[11.5px] font-inter text-zinc-600 font-medium leading-relaxed pl-5">
                            {currentResult.editorialSpecs.typographyPairing}
                          </p>
                        </div>

                        <div className="border-b border-zinc-150/40 pb-3.5">
                          <h4 className="text-xs font-sans font-bold text-zinc-900 flex items-center mb-1">
                            <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-accent" />
                            <span>Photography Focus</span>
                          </h4>
                          <p className="text-[11.5px] font-inter text-zinc-600 font-medium leading-relaxed pl-5">
                            {currentResult.editorialSpecs.photographyStyle}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-sans font-bold text-zinc-950 flex items-center mb-1">
                            <Grid className="w-3.5 h-3.5 mr-1.5 text-accent" />
                            <span>Layout Spatial Concept</span>
                          </h4>
                          <p className="text-[11.5px] font-inter text-zinc-600 font-medium leading-relaxed pl-5">
                            {currentResult.editorialSpecs.layoutConcept}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Action layout CTAs footer */}
              <div className="p-6 border-t border-zinc-100 bg-white sticky bottom-0 z-30 space-y-3 shrink-0">
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveResult}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-[16px] border font-inter text-xs font-bold active:scale-[0.98] transition-transform cursor-pointer ${
                      currentResult.savedByMe 
                        ? "bg-zinc-100 border-zinc-200 text-[#707070]" 
                        : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <Pin className={`w-3.5 h-3.5 rotate-45 ${currentResult.savedByMe ? "fill-[#707070] text-[#707070]" : ""}`} />
                    <span>{currentResult.savedByMe ? "Pinned to Vault" : "Pin to Vault"}</span>
                  </button>

                  <button
                    onClick={handlePublishResult}
                    style={{ background: "linear-gradient(135deg, #2B00EB 0%, #0D0050 100%)" }}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-[16px] text-white font-inter text-xs font-bold active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <span>Publish Idea</span>
                    <Share2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setScreen("feed");
                    setActiveTab("generate");
                  }}
                  className="w-full flex items-center justify-center py-2 text-xs font-inter font-bold text-accent hover:underline cursor-pointer"
                >
                  <RefreshCcw className="w-3 h-3 mr-1" />
                  <span>Configure options again</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Smart phone hardware notch bottom visual strip */}
        <div className="hidden sm:block h-6 bg-white shrink-0 relative z-30">
          <div className="w-[120px] h-1.5 bg-zinc-800 rounded-full absolute bottom-2 left-1/2 -translate-x-1/2"></div>
        </div>

      </div>

    </div>
  );

  // Helper inside click wraps to prevent propagation bugs on lists representation
  function handleLikeBoardAction(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    handleLikeBoard(id);
  }

  function handleToggleSaveAction(e: React.MouseEvent, brd: Moodboard) {
    e.stopPropagation();
    handleSaveBoardToggle(brd.id, e);
  }
}
