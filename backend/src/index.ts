// --- Caminho: backend/src/index.ts ---
import express from "express";
import dotenv from "dotenv";
import path from "path";
import db from "./database/database";
import { runMigrations } from "./database/migrations/migrate";
import viaCepRoutes from "./routes/viacepRoutes";
import cataBagulhoRoutes from "./routes/cataBagulhoRoutes";
import geocodeRoutes from "./routes/geocodeRoutes"; // <-- IMPORTAR NOVA ROTA

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
    // ... (restante dos console.log de debug)
    console.log("===================");

    console.log("🔄 Aguardando 5 segundos para o PostgreSQL inicializar...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // ... (restante da lógica de teste de conexão e migração)
    console.log("🔄 Testando conexão com banco de dados...");
    const testResult = await db.query("SELECT NOW() as current_time");
    console.log("✅ Conexão com banco estabelecida!", testResult.rows[0].current_time);

    console.log("🔄 Iniciando migrações...");
    await runMigrations();
    console.log("✅ Migrações concluídas!");

    // ========== ROTAS ==========

    // Rota de status do sistema
    app.get("/api/status", async (req, res) => {
        // ... (código da rota de status)
        try {
            const dbTest = await db.query("SELECT NOW() as time");
            res.status(200).json({ status: "Backend is running!", database: "Connected", server_time: dbTest.rows[0].time });
        } catch (error: any) {
            res.status(500).json({ status: "Backend is running!", database: "Disconnected", error: error.message });
        }
    });
    
    // Registrar rotas
    app.use("/api", viaCepRoutes);
    app.use("/api", cataBagulhoRoutes);
    app.use("/api", geocodeRoutes); // <-- REGISTRAR NOVA ROTA

    // Middleware para rotas não encontradas
    app.use((req, res) => {
      res.status(404).json({
        error: "Rota não encontrada",
        message: `Endpoint ${req.method} ${req.originalUrl} não existe`,
      });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Backend server listening on port ${PORT}`);
      console.log(`📊 Status: http://localhost:${PORT}/api/status`);
      console.log(`📍 ViaCEP: http://localhost:${PORT}/api/cep/{cep}`);
      console.log(`🌍 Geocode: http://localhost:${PORT}/api/geocode?q={endereco}`);
    });
  } catch (error) {
    console.error("💥 FALHA CRÍTICA ao iniciar o backend:", error);
    process.exit(1);
  }
}

startServer();