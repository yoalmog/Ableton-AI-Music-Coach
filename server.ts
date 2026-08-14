import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { authRouter } from "./server/authRoutes.js";
import { paymentRouter } from "./server/paymentRoutes.js";
import { dbStore } from "./server/dbStore.js";

dotenv.config();

const PORT = 3000;
const OLLAMA_DEFAULT_URL = process.env.OLLAMA_URL || "http://localhost:11434";

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Mount API routers
  app.use("/api/auth", authRouter);
  app.use("/api/payments", paymentRouter);

  // Helper lazy init for Gemini API
  const getGeminiClient = (customKey?: string) => {
    const apiKey = customKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      appName: "Ableton AI Music Coach",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
      ollamaEndpoint: OLLAMA_DEFAULT_URL,
    });
  });

  // Helper timeout wrapper for AI promises
  function withTimeout<T>(promise: Promise<T>, ms = 25000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`AI Request timed out after ${Math.round(ms / 1000)} seconds.`));
      }, ms);

      promise
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  // Ollama Health Check Proxy
  app.get("/api/ai/ollama/health", async (_req, res) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const ollamaRes = await fetch(`${OLLAMA_DEFAULT_URL}/api/tags`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        return res.json({
          ok: true,
          status: "CONNECTED",
          endpoint: OLLAMA_DEFAULT_URL,
          models: data.models || [],
        });
      }
      return res.json({ ok: false, status: "NOT RUNNING", endpoint: OLLAMA_DEFAULT_URL });
    } catch {
      return res.json({ ok: false, status: "NOT RUNNING", endpoint: OLLAMA_DEFAULT_URL });
    }
  });

  // Helper helper to generate content with model fallback retries for 503 / timeout
  async function generateContentWithFallback(
    ai: GoogleGenAI,
    preferredModel: string,
    contents: any,
    config?: any,
    timeoutMs = 20000
  ): Promise<{ response: any; modelUsed: string; fallbackUsed: boolean }> {
    let targetPreferred = preferredModel || "gemini-2.5-flash";
    if (targetPreferred.includes("gemini-3.") || targetPreferred.includes("latest")) {
      targetPreferred = "gemini-2.5-flash";
    }

    const candidates = Array.from(
      new Set([targetPreferred, "gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash"])
    );

    let lastError: any = null;

    for (let i = 0; i < candidates.length; i++) {
      const model = candidates[i];
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents,
            config,
          }),
          timeoutMs
        );
        return {
          response,
          modelUsed: model,
          fallbackUsed: model !== preferredModel,
        };
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);

        // If invalid key or rate limit / quota exhausted, throw immediately to prevent candidate spam
        if (
          errStr.includes("API_KEY_INVALID") ||
          errStr.includes("API key not valid") ||
          errStr.includes("429") ||
          errStr.includes("RESOURCE_EXHAUSTED") ||
          errStr.includes("quota")
        ) {
          throw err;
        }

        console.warn(`Model ${model} failed (${errStr}). Trying next candidate if available...`);
      }
    }

    throw lastError || new Error("All Gemini model candidates failed.");
  }

  // Fallback pattern generator
  function getFallbackPattern(type?: string, genre?: string, bpm?: number, key?: string, scale?: string) {
    const actualKey = key || "F#";
    const actualGenre = genre || "Psytrance";
    const actualBpm = Number(bpm) || 142;
    return {
      id: `pat_${Date.now()}`,
      name: `${actualGenre} ${type || "bassline"} (${actualKey})`,
      type: type || "bassline",
      genre: actualGenre,
      bpm: actualBpm,
      key: actualKey,
      scale: scale || "Minor",
      timeSignature: "4/4",
      notes: [
        { pitch: `${actualKey}1`, time: 0.25, duration: 0.2, velocity: 100 },
        { pitch: `${actualKey}1`, time: 0.5, duration: 0.2, velocity: 95 },
        { pitch: `${actualKey}1`, time: 0.75, duration: 0.2, velocity: 105 },
        { pitch: `${actualKey}1`, time: 1.25, duration: 0.2, velocity: 100 },
        { pitch: `${actualKey}1`, time: 1.5, duration: 0.2, velocity: 95 },
        { pitch: `${actualKey}1`, time: 1.75, duration: 0.2, velocity: 105 },
        { pitch: `${actualKey}1`, time: 2.25, duration: 0.2, velocity: 100 },
        { pitch: `${actualKey}1`, time: 2.5, duration: 0.2, velocity: 95 },
        { pitch: `${actualKey}1`, time: 2.75, duration: 0.2, velocity: 105 },
        { pitch: `${actualKey}1`, time: 3.25, duration: 0.2, velocity: 100 },
        { pitch: `${actualKey}1`, time: 3.5, duration: 0.2, velocity: 95 },
        { pitch: `${actualKey}1`, time: 3.75, duration: 0.2, velocity: 110 },
      ],
      abletonTips: "In Ableton Live 12, insert Operator or Drift. Set Osc A to Saw wave, 24dB LP Filter, 0ms Attack, 160ms Decay, 0 Sustain.",
      createdAt: new Date().toISOString(),
    };
  }

  // Fallback track analysis
  function getFallbackAnalysis(genre?: string, lufs?: number) {
    return {
      overallRating: "Mix Analysis (Offline Fallback)",
      loudnessAssessment: `Measured LUFS is ${lufs ?? -12} dB. Standard target for ${genre || "Electronic"} master is -8 LUFS to -6 LUFS.`,
      spectralBalance: "Sub-bass and high frequencies detected. Ensure 200Hz - 500Hz boxiness is notched on synth leads.",
      dynamicsAndWidth: "Ensure sub frequencies below 120Hz are set to 100% Mono in Ableton Live Utility.",
      actionableSteps: [
        "Add Ableton Live 12 Utility plugin to Master Bus. Enable 'Bass Mono' at 120Hz.",
        "Use EQ Eight on Sub Bass with a high pass filter at 30Hz.",
        "Apply Auto Filter sidechain compression on bass triggered by Kick drum C1.",
        "Insert Saturator on K&B bus with 2dB soft clip drive to glue transients.",
      ],
    };
  }

  // Ollama Web Proxy endpoints
  app.get("/api/ollama/status", async (req, res) => {
    try {
      const response = await fetch("http://localhost:11434/api/version");
      if (response.ok) {
        const data = await response.json();
        return res.json({ installed: true, running: true, version: data.version, endpoint: "http://localhost:11434" });
      }
    } catch {}
    return res.json({ installed: false, running: false, endpoint: "http://localhost:11434" });
  });

  app.get("/api/ollama/tags", async (req, res) => {
    try {
      const response = await fetch("http://localhost:11434/api/tags");
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    } catch {}
    return res.json({ models: [] });
  });

  app.post("/api/ollama/pull", async (req, res) => {
    const { modelName } = req.body || {};
    const targetModel = modelName || "qwen3.5:4b";

    try {
      const ollamaRes = await fetch("http://localhost:11434/api/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: targetModel, stream: true }),
      });

      if (!ollamaRes.ok || !ollamaRes.body) {
        return res.status(500).json({ error: "Failed to connect to Ollama pull endpoint" });
      }

      res.setHeader("Content-Type", "application/x-ndjson");
      const reader = ollamaRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Ollama pull error" });
    }
  });

  app.post("/api/ollama/test", async (req, res) => {
    const { modelName } = req.body || {};
    const modelToTest = modelName || "qwen3.5:4b";
    try {
      const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelToTest,
          prompt: "Respond with exactly: LOCAL AI READY",
          stream: false,
        }),
      });

      if (!ollamaRes.ok) {
        return res.json({ ok: false, reply: `HTTP ${ollamaRes.status}` });
      }

      const data = await ollamaRes.json();
      const reply = String(data.response || "").trim();
      const isReady = reply.toUpperCase().includes("LOCAL AI READY") || reply.length > 0;
      return res.json({ ok: isReady, reply });
    } catch (err: any) {
      return res.json({ ok: false, reply: err.message || "Could not connect to Ollama" });
    }
  });

  // Test Connection endpoint
  app.post("/api/ai/test-connection", async (req, res) => {
    try {
      const { customKey, customModel } = req.body || {};
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      const modelName = customModel || "gemini-2.5-flash";

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          ok: false,
          statusMessage: "Gemini API Key is missing. Please set your API Key in Settings or environment variables.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' },
        },
      });

      const startTime = Date.now();
      const { response, modelUsed, fallbackUsed } = await generateContentWithFallback(
        ai,
        modelName,
        'Ping. Confirm Ableton AI Music Coach engine status.',
        { temperature: 0.1 },
        20000
      );

      const duration = Date.now() - startTime;
      const statusMsg = fallbackUsed
        ? `✓ Connected to Gemini API (${modelUsed} • Fallback from ${modelName} due to demand/timeout • ${duration}ms)`
        : `✓ Connected to Gemini API (${modelUsed} • ${duration}ms)`;

      return res.json({
        ok: true,
        statusMessage: statusMsg,
        modelUsed,
        responseTimeMs: duration,
      });
    } catch (err: any) {
      const errStr = String(err?.message || err);
      if (errStr.includes("API_KEY_INVALID") || errStr.includes("API key not valid")) {
        console.warn("Gemini API Key is invalid.");
        return res.json({ ok: false, statusMessage: "✕ Invalid API Key. Please verify your Gemini API Key." });
      } else if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota")) {
        console.warn("Gemini API rate limit or free tier quota reached (429). Local AI (Ollama) is available.");
        return res.json({
          ok: false,
          statusMessage: "✕ Quota Exceeded for this API Key. Please use Local AI (Ollama) or enter your custom Gemini API key in Settings.",
        });
      } else if (errStr.includes("503") || errStr.includes("UNAVAILABLE") || errStr.includes("high demand")) {
        console.warn("Gemini Cloud models busy (503). Local AI active.");
        return res.json({
          ok: false,
          statusMessage: "✕ Cloud models are currently experiencing high demand (503). Local AI (Ollama) is available for offline use.",
        });
      }
      console.warn("Server test connection note:", errStr);
      return res.json({ ok: false, statusMessage: `✕ Connection error: ${errStr}` });
    }
  });

  // AI Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history, context, model } = req.body;
      const modelName = model || "gemini-2.5-flash";
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          offline: true,
          reply: `[OFFLINE MODE] Cloud Gemini API Key is not configured. Local AI (Ollama) is available for zero-cloud music production coaching.`,
        });
      }

      // Check user token & usage limit if present
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace(/^Bearer\s+/i, "").trim();
      if (token) {
        const session = dbStore.getSession(token);
        if (session) {
          const usageCheck = dbStore.incrementAiUsage(session.userId);
          if (!usageCheck.allowed) {
            return res.json({
              offline: false,
              reply: `[AI Monthly Request Limit Reached] You have used ${usageCheck.usage.aiCloudRequestsCount}/${usageCheck.usage.aiCloudRequestsLimit} cloud requests this month. Upgrade to Pro for high fair-use requests or switch to Local AI (Ollama) for unlimited local inference.`,
            });
          }
        }
      }

      let promptText = `User Query: ${message}\n\n`;
      if (context) {
        promptText += `Project Context:\n`;
        promptText += `- Genre: ${context.genre || "Psytrance"}\n`;
        promptText += `- Tempo: ${context.bpm || 142} BPM\n`;
        promptText += `- Key: ${context.key || "F#"} ${context.scale || "Minor"}\n`;
        promptText += `- UI Language: ${context.language || "he"}\n\n`;
      }

      if (history && history.length > 0) {
        promptText += `Recent Conversation History:\n`;
        history.slice(-8).forEach((h: any) => {
          promptText += `${h.sender === "user" ? "User" : "Coach"}: ${h.text}\n`;
        });
        promptText += `\nRespond to the latest query specifically:`;
      }

      const { response, modelUsed } = await generateContentWithFallback(
        ai,
        modelName,
        promptText,
        { temperature: 0.7 },
        20000
      );

      return res.json({
        offline: false,
        reply: response.text || "No response generated.",
        modelUsed,
      });
    } catch (error: any) {
      console.error("Gemini AI Chat Error:", error);
      const errStr = String(error?.message || error);
      let userMsg = `[AI Connection Notice] Could not reach Cloud AI service: ${errStr}`;
      if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota")) {
        userMsg = `[Quota Limit Reached] The daily free tier quota for Gemini API has been reached. Please add your own custom Gemini API key in Settings or use Local AI (Ollama).`;
      }
      return res.json({
        offline: true,
        reply: userMsg,
      });
    }
  });

  // AI Pattern Generator endpoint
  app.post("/api/ai/generate-pattern", async (req, res) => {
    try {
      const { type, genre, bpm, key, scale, energy } = req.body || {};
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          offline: true,
          pattern: getFallbackPattern(type, genre, bpm, key, scale),
        });
      }

      const promptText = `Generate a musical MIDI pattern as a JSON object for Ableton Live 12.
Type: ${type || "bassline"}, Genre: ${genre || "Psytrance"}, BPM: ${bpm || 142}, Key: ${key || "F#"}, Scale: ${scale || "Minor"}, Energy Level: ${energy || 80}/100.
Return JSON ONLY matching structure:
{
  "name": "Pattern Name",
  "notes": [ { "pitch": "F#1", "time": 0.25, "duration": 0.2, "velocity": 100 } ],
  "abletonTips": "Specific Operator or Drift synth setup tips in Ableton Live 12"
}`;

      const { response, modelUsed } = await generateContentWithFallback(
        ai,
        "gemini-2.5-flash",
        promptText,
        {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
        20000
      );

      let parsed: any = null;
      try {
        const text = response.text || "{}";
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.warn("Failed to parse JSON response for pattern:", e);
      }

      if (!parsed || !Array.isArray(parsed.notes)) {
        return res.json({
          offline: false,
          modelUsed,
          pattern: getFallbackPattern(type, genre, bpm, key, scale),
        });
      }

      const pattern = {
        id: `pat_${Date.now()}`,
        name: parsed.name || `${genre || "Psytrance"} ${type || "bassline"} (${key || "F#"})`,
        type: type || "bassline",
        genre: genre || "Psytrance",
        bpm: Number(bpm) || 142,
        key: key || "F#",
        scale: scale || "Minor",
        timeSignature: "4/4",
        notes: parsed.notes,
        abletonTips: parsed.abletonTips || "In Ableton Live 12, load Operator or Drift on an Instrument Track.",
        createdAt: new Date().toISOString(),
      };

      return res.json({ offline: false, pattern, modelUsed });
    } catch (error: any) {
      console.error("Generate Pattern Error:", error);
      const { type, genre, bpm, key, scale } = req.body || {};
      return res.json({
        offline: true,
        pattern: getFallbackPattern(type, genre, bpm, key, scale),
      });
    }
  });

  // AI Track Analysis endpoint
  app.post("/api/ai/analyze-track", async (req, res) => {
    try {
      const { genre, lufs, rms, peak, lowMidRatio, stereoWidth, userNotes } = req.body || {};
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          offline: true,
          analysis: getFallbackAnalysis(genre, lufs),
        });
      }

      const promptText = `Analyze this audio mix for Ableton Live 12 mastering:
Genre: ${genre || "Psytrance"}, LUFS: ${lufs} dB, RMS: ${rms} dB, Peak: ${peak} dB, Low-Mid Ratio: ${lowMidRatio}, Stereo Width: ${stereoWidth}.
User Notes: ${userNotes || "None"}.
Return JSON ONLY matching structure:
{
  "overallRating": "e.g. Clean & Balanced Master",
  "loudnessAssessment": "Assessment regarding target LUFS",
  "spectralBalance": "Assessment regarding EQ balance",
  "dynamicsAndWidth": "Assessment regarding stereo width and dynamics",
  "actionableSteps": ["Step 1 for Ableton Live 12", "Step 2", "Step 3", "Step 4"]
}`;

      const { response } = await generateContentWithFallback(
        ai,
        "gemini-2.5-flash",
        promptText,
        {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
        20000
      );

      let parsed: any = null;
      try {
        const text = response.text || "{}";
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.warn("Failed to parse JSON response for track analysis:", e);
      }

      if (!parsed || !parsed.actionableSteps) {
        return res.json({ offline: false, analysis: getFallbackAnalysis(genre, lufs) });
      }

      return res.json({ offline: false, analysis: parsed });
    } catch (error: any) {
      console.error("Analyze Track Error:", error);
      const { genre, lufs } = req.body || {};
      return res.json({ offline: true, analysis: getFallbackAnalysis(genre, lufs) });
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ableton AI Music Coach server running on http://localhost:${PORT}`);
  });
}

startServer();
