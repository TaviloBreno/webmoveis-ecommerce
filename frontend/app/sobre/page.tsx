"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import ParallaxHero from "@/components/ui/ParallaxHero";
import { Users, Target, Award, TrendingUp, Heart, Shield, Zap, Globe } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SobrePage() {
  const values = [
    {
      icon: Heart,
      title: "Paixão pelo Cliente",
      description: "Nosso compromisso é superar expectativas e criar experiências memoráveis."
    },
    {
      icon: Shield,
      title: "Confiança e Segurança",
      description: "Transações 100% seguras e proteção total dos seus dados."
    },
    {
      icon: Zap,
      title: "Inovação Constante",
      description: "Sempre buscando as melhores soluções tecnológicas do mercado."
    },
    {
      icon: Globe,
      title: "Sustentabilidade",
      description: "Comprometidos com práticas ecológicas e responsabilidade social."
    }
  ];

  const stats = [
    { value: "10+", label: "Anos de Mercado" },
    { value: "50k+", label: "Clientes Felizes" },
    { value: "10k+", label: "Produtos" },
    { value: "4.9", label: "Avaliação Média" }
  ];

  const team = [
    {
      name: "Ana Silva",
      role: "CEO & Fundadora",
      image: "photo-1573496359142-b8d87734a5a2"
    },
    {
      name: "Carlos Santos",
      role: "CTO",
      image: "photo-1472099645785-5658abf4ff4e"
    },
    {
      name: "Mariana Costa",
      role: "Diretora de Marketing",
      image: "photo-1580489944761-15a19d654956"
    },
    {
      name: "Pedro Oliveira",
      role: "Diretor de Operações",
      image: "photo-1519085360753-af0119f7cbe7"
    }
  ];

  return (
    <Layout>
      {/* Hero Section with Parallax */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
        title="Sobre Nós"
        subtitle="Conheça nossa história e valores"
        height="h-[500px]"
      />

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800"
                  alt="Nossa Missão"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Target className="text-primary-600" size={40} />
                <h2 className="text-4xl font-bold text-neutral-900">Nossa Missão</h2>
              </div>
              <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                Oferecer a melhor experiência de compra online, conectando pessoas aos produtos
                que amam através de uma plataforma confiável, inovadora e centrada no cliente.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Acreditamos que o e-commerce deve ser simples, seguro e acessível para todos.
                Por isso, trabalhamos incansavelmente para criar uma plataforma que supera
                expectativas e gera valor real para nossos clientes.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Nossos Valores</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Princípios que guiam cada decisão e ação da nossa empresa
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card hover className="h-full">
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-4">
                      <value.icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-neutral-600">{value.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Nossa Equipe</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Líderes apaixonados por inovação e excelência
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card hover className="overflow-hidden">
                  <div className="relative h-80 group">
                    <Image
                      src={`https://images.unsplash.com/${member.image}?auto=format&fit=crop&q=80&w=400`}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-medium">{member.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600">
          <Image
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2000"
            alt="Join Us"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Quer fazer parte da nossa história?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Estamos sempre em busca de talentos apaixonados por tecnologia e inovação
            </p>
            <a
              href="/contatos"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-100 transition-all hover:scale-105 shadow-xl"
            >
              Entre em Contato
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
