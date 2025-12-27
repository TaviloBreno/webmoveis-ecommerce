import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">WebMoveis</h3>
            <p className="text-sm mb-4">
              Sua loja online de confiança com os melhores produtos e preços.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Atendimento</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pedidos" className="hover:text-white transition-colors">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link href="/rastreamento" className="hover:text-white transition-colors">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="hover:text-white transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>Rua Exemplo, 123<br />São Paulo - SP</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span>contato@webmoveis.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} WebMoveis. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
