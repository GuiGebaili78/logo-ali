-- Migração inicial do sistema LogoAli
-- Arquivo: C:\workspace\Meus Projetos\LogoAli\logo-ali\backend\src\database\migrations\001_initial_setup.sql

-- Criação de extensões úteis (se necessário)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurações iniciais do banco
-- COMMENT ON DATABASE logo_ali_db IS 'Banco de dados do sistema LogoAli - Serviços Públicos SP';

-- Log da migração inicial
DO $$ 
BEGIN
    RAISE NOTICE 'Executando migração inicial 001_initial_setup.sql';
    RAISE NOTICE 'Sistema LogoAli - Base de dados inicializada';
END $$;