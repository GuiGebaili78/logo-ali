import { Pool, QueryResult, QueryResultRow } from "pg";
import dotenv from "dotenv";
import path from "path";

// Carregar variáveis de ambiente
dotenv.config({
  path: path.resolve(__dirname, "..", "..", "..", ".env.development"),
});

// Determina a porta baseada no ambiente
function getDatabasePort(): number {
  const envPort = process.env.POSTGRES_PORT;

  // Se estamos dentro do Docker (NODE_ENV=development com Docker)
  // o PostgreSQL sempre roda na porta 5432 DENTRO da rede Docker
  if (
    process.env.NODE_ENV === "development" &&
    process.env.POSTGRES_HOST === "logo-ali-db"
  ) {
    console.log("🐳 Executando dentro do Docker - usando porta interna 5432");
    return 5432;
  }

  // Se estamos rodando localmente (fora do Docker)
  // usa a porta do .env (5434 para este projeto)
  console.log(`💻 Executando localmente - usando porta ${envPort}`);
  return Number(envPort) || 5432;
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: getDatabasePort(),
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === "production" ? true : false,
});

async function query(
  queryObject: string,
  params: any[] = []
): Promise<QueryResult<QueryResultRow>> {
  try {
    const result = await pool.query(queryObject, params);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getClient() {
  return pool.connect();
}

export default {
  query,
  getClient,
};
