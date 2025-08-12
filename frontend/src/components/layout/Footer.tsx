export default function Footer() {
  return (
    <footer className="bg-primary text-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-accent w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-light font-bold">L</span>
              </div>
              <h3 className="text-xl font-bold">LogoAli</h3>
            </div>
            <p className="text-gray-300">
              Conectando você aos serviços públicos de São Paulo de forma rápida
              e eficiente.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Coleta de Lixo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Cata-Bagulho
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Saúde Pública
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Bem-estar Animal
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Portal da Prefeitura
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  156 - Central de Atendimento
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Subprefeituras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Ouvidoria
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-gray-300">
              <p>📞 156 (Central SP)</p>
              <p>📧 contato@logoali.com.br</p>
              <p>🌐 www.logoali.com.br</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 LogoAli - by Guilherme Gebaili
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                Privacidade
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                Termos
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                Acessibilidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
