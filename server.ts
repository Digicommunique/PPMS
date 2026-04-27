import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Tally Integration API Endpoint
  // This is where the TallyAPIConnectorV1.0.exe from the user's local machine will send requests
  app.post("/api/tally/sync", (req, res) => {
    console.log("Received Tally Sync Request:", req.body);
    
    // Simulate processing
    res.json({
      status: "success",
      message: "Sync handshake successful",
      timestamp: new Date().toISOString(),
      company: req.body.company || "Default Tally Company",
      recordsProcessed: 0
    });
  });

  app.get("/api/tally/status", (req, res) => {
    res.json({
      connected: true,
      lastSync: new Date().toISOString(),
      servicePort: 9000
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
