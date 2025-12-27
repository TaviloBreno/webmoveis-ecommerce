"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Check } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LgpdBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies
    const hasAccepted = localStorage.getItem("lgpd-accepted");
    if (!hasAccepted) {
      // Mostra o banner após 1 segundo
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lgpd-accepted", "true");
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleReject = () => {
    localStorage.setItem("lgpd-accepted", "rejected");
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: isClosing ? 100 : 0, 
            opacity: isClosing ? 0 : 1 
          }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 lgpd-banner"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Header com gradiente */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Cookie className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Cookies e Privacidade
                  </h3>
                </div>
                <button
                  onClick={handleReject}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                Usamos cookies para melhorar sua experiência de navegação, personalizar
                conteúdo e analisar nosso tráfego. Ao continuar navegando, você concorda
                com nossa{" "}
                <a href="/politica-privacidade" className="text-primary-600 hover:underline font-medium">
                  Política de Privacidade
                </a>
                .
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                >
                  <Check size={18} className="mr-2" />
                  Aceitar Todos
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="flex-1"
                >
                  Apenas Essenciais
                </Button>
              </div>

              {/* Info adicional */}
              <p className="text-xs text-neutral-500 mt-4 text-center">
                Respeitamos sua privacidade conforme a LGPD (Lei nº 13.709/2018)
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
