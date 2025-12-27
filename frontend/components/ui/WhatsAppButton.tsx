"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  lgpdVisible?: boolean;
}

export default function WhatsAppButton({
  phoneNumber = "5511999999999", // Número padrão (formato: código do país + DDD + número)
  message = "Olá! Gostaria de mais informações sobre os produtos.",
  lgpdVisible = false,
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Mostra o tooltip após 3 segundos
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Esconde o tooltip após 5 segundos
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <motion.div
      className="fixed z-40 whatsapp-button"
      style={{
        right: "1.5rem",
        bottom: lgpdVisible ? "28rem" : "1.5rem", // Eleva quando LGPD está visível
      }}
      animate={{
        bottom: lgpdVisible ? "28rem" : "1.5rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="relative">
        {/* Tooltip */}
        <AnimatePresence>
          {(showTooltip || isOpen) && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-white rounded-xl shadow-xl border border-neutral-200 px-4 py-3 relative">
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
                  aria-label="Fechar"
                >
                  <X size={14} />
                </button>
                <p className="text-sm font-semibold text-neutral-900 mb-1">
                  Precisa de ajuda?
                </p>
                <p className="text-xs text-neutral-600 pr-4">
                  Fale conosco pelo WhatsApp!
                </p>
                {/* Seta */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-white" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Falar no WhatsApp"
        >
          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          
          {/* Icon */}
          <MessageCircle className="text-white relative z-10" size={28} />

          {/* Badge (opcional - pode mostrar mensagens não lidas) */}
          {/* <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            3
          </span> */}
        </motion.button>

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#25D366]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
