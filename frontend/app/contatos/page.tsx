"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ContatosPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSuccess(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    
    setTimeout(() => setSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      content: "(11) 3456-7890",
      link: "tel:+551134567890"
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "contato@webmoveis.com",
      link: "mailto:contato@webmoveis.com"
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "Av. Paulista, 1000 - São Paulo, SP",
      link: "https://maps.google.com"
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Seg-Sex: 9h às 18h",
      link: null
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000"
            alt="Contato"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Estamos aqui para ajudar. Fale conosco!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Contact Info Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {contactInfo.map((info, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card hover className="h-full">
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-4">
                    <info.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-neutral-600">{info.content}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form and Map */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card>
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="text-primary-600" size={32} />
                  <h2 className="text-3xl font-bold text-neutral-900">
                    Envie sua Mensagem
                  </h2>
                </div>

                {success && (
                  <div className="mb-6 p-4 bg-accent-50 border border-accent-200 rounded-lg">
                    <p className="text-accent-700 font-medium">
                      ✓ Mensagem enviada com sucesso! Retornaremos em breve.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Nome Completo"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome"
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                  />

                  <Input
                    label="Telefone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                  />

                  <Input
                    label="Assunto"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Qual o motivo do contato?"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Descreva sua dúvida ou sugestão..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send size={20} className="mr-2" />
                        Enviar Mensagem
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>

          {/* Map and Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Map */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <Image
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                  alt="Localização"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Nossa Localização</h3>
                    <p className="text-white/90">Av. Paulista, 1000 - São Paulo, SP</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* FAQ */}
            <Card>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                  Perguntas Frequentes
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      Qual o prazo de entrega?
                    </h4>
                    <p className="text-neutral-600 text-sm">
                      O prazo varia de 3 a 7 dias úteis, dependendo da sua região.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      Posso trocar um produto?
                    </h4>
                    <p className="text-neutral-600 text-sm">
                      Sim! Você tem até 30 dias para solicitar a troca.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      Como acompanho meu pedido?
                    </h4>
                    <p className="text-neutral-600 text-sm">
                      Acesse "Meus Pedidos" na sua conta para rastrear em tempo real.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
