import express from "express";
import dotenv from "dotenv";
import path from "path";
import db from "./database/database";
import { runMigrations } from "./database/migrations/migrate";
import viaCepRoutes from "./routes/viacepRoutes";
import cataBagulhoRoutes from "./routes/cataBagulhoRoutes"; // <

// Carrega variáveis de ambiente
dotenv.config({
  path: path.resolve(__dirname, "..", "..", ".env.development"),
});

const app = express();
const PORT = process.env.BACKEND_PORT || 3333;

app.use(express.json());

async function startServer() {
  try {
    console.log("🔧 === DEBUG INFO ===");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("POSTGRES_HOST:", process.env.POSTGRES_HOST);
    console.log("POSTGRES_PORT:", process.env.POSTGRES_PORT);
    console.log("POSTGRES_DB:", process.env.POSTGRES_DB);
    console.log("POSTGRES_USER:", process.env.POSTGRES_USER);
    console.log(
      "POSTGRES_PASSWORD:",
      process.env.POSTGRES_PASSWORD ? "***SET***" : "NOT SET"
    );
    console.log("===================");

    console.log("🔄 Aguardando 5 segundos para o PostgreSQL inicializar...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("🔄 Testando conexão com banco de dados...");

    // Testa a conexão primeiro com mais detalhes
    try {
      const testResult = await db.query(
        "SELECT NOW() as current_time, version() as pg_version"
      );
      console.log("✅ Conexão com banco estabelecida!");
      console.log("📅 Hora do servidor:", testResult.rows[0].current_time);
      console.log(
        "🐘 Versão PostgreSQL:",
        testResult.rows[0].pg_version.split(" ")[0]
      );
    } catch (connectionError) {
      console.error("❌ ERRO DE CONEXÃO:", connectionError);
      throw connectionError;
    }

    console.log("🔄 Iniciando migrações...");
    try {
      await runMigrations();
      console.log("✅ Migrações concluídas!");
    } catch (migrationError) {
      console.error("❌ ERRO NAS MIGRAÇÕES:", migrationError);
      throw migrationError;
    }

    // Verificar se as tabelas foram criadas
    try {
      const tableCheck = await db.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
      `);
      console.log(
        "📋 Tabelas existentes:",
        tableCheck.rows.map((r) => r.table_name)
      );
    } catch (error) {
      console.error("❌ Erro ao verificar tabelas:", error);
    }

    // ========== ROTAS ==========

    // Rota de status do sistema
    app.get("/api/status", async (req, res) => {
      try {
        const dbTest = await db.query("SELECT NOW() as time");
        const tablesResult = await db.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
        `);

        res.status(200).json({
          status: "Backend is running!",
          database: "Connected",
          port: PORT,
          server_time: dbTest.rows[0].time,
          tables: tablesResult.rows.map((r) => r.table_name),
          api_version: "1.0.0",
        });
      } catch (error: any) {
        console.error("Database connection failed:", error);
        res.status(500).json({
          status: "Backend is running!",
          database: "Disconnected",
          error: error.message,
        });
      }
    });

    // Rota para verificar migrações
    app.get("/api/migrations", async (req, res) => {
      try {
        const result = await db.query("SELECT * FROM migrations ORDER BY id");
        res.status(200).json({
          migrations: result.rows,
          total: result.rowCount,
        });
      } catch (error: any) {
        res.status(500).json({
          error: "Erro ao buscar migrações",
          message: error.message,
        });
      }
    });

    // Rota para forçar execução das migrações
    app.post("/api/force-migrations", async (req, res) => {
      try {
        console.log("🔄 Forçando execução das migrações...");
        await runMigrations();
        res.status(200).json({
          message: "Migrações executadas com sucesso!",
        });
      } catch (error: any) {
        console.error("❌ Erro ao forçar migrações:", error);
        res.status(500).json({
          error: "Erro ao executar migrações",
          message: error.message,
        });
      }
    });

    // Registrar rotas do ViaCEP
    app.use("/api", viaCepRoutes);
    app.use("/api", cataBagulhoRoutes);


    // CORRIGIDO: Middleware para rotas não encontradas - removido o "*"
    app.use((req, res) => {
      res.status(404).json({
        error: "Rota não encontrada",
        message: `Endpoint ${req.method} ${req.originalUrl} não existe`,
        available_endpoints: [
          "GET /api/status",
          "GET /api/migrations",
          "POST /api/force-migrations",
          "GET /api/cep/:cep",
          "GET /api/cep/cache/stats",
          "DELETE /api/cep/cache/expired",
          "POST /api/cep/test/fake",
        ],
      });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Backend server listening on port ${PORT}`);
      console.log(`📊 Status: http://localhost:${PORT}/api/status`);
      console.log(`📋 Migrações: http://localhost:${PORT}/api/migrations`);
      console.log(
        `🔄 Forçar migrações: POST http://localhost:${PORT}/api/force-migrations`
      );
      console.log(`📍 ViaCEP: http://localhost:${PORT}/api/cep/{cep}`);
      console.log(
        `📈 Cache Stats: http://localhost:${PORT}/api/cep/cache/stats`
      );
      console.log(
        `🧪 Teste Fake: POST http://localhost:${PORT}/api/cep/test/fake`
      );
    });
  } catch (error) {
    console.error("💥 FALHA CRÍTICA ao iniciar o backend:");
    console.error("Erro completo:", error);
    console.error("Stack trace:", (error as Error).stack);
    process.exit(1);
  }
}

startServer();
