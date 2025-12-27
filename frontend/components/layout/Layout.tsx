"use client";

import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LgpdBanner from "@/components/ui/LgpdBanner";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [lgpdVisible, setLgpdVisible] = useState(false);

  useEffect(() => {
    // Verifica se o banner LGPD está visível
    const checkLgpdVisibility = () => {
      const hasAccepted = localStorage.getItem("lgpd-accepted");
      setLgpdVisible(!hasAccepted);
    };

    checkLgpdVisibility();

    // Escuta mudanças no localStorage (para sincronizar entre abas)
    const handleStorageChange = () => {
      checkLgpdVisibility();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Também verifica periodicamente (para detectar quando o banner fecha)
    const interval = setInterval(checkLgpdVisibility, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">{children}</main>
      <Footer />
      
      {/* LGPD Banner */}
      <LgpdBanner />
      
      {/* WhatsApp Button - eleva quando LGPD está visível */}
      <WhatsAppButton 
        phoneNumber="5511999999999" 
        message="Olá! Gostaria de saber mais sobre os produtos da WebMóveis."
        lgpdVisible={lgpdVisible}
      />
    </div>
  );
}
