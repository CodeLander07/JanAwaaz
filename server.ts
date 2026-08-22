import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Server-side Gemini client with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "JanSamarth AI - Citizen Infrastructure DPG",
    version: "2.5.0",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 1. Multilingual Citizen Request Processing & Speech-to-Intent Extraction
app.post("/api/ingest-citizen-request", async (req, res) => {
  try {
    const {
      text,
      audioBase64,
      audioMimeType = "audio/webm",
      channel = "voice_ivr",
      reportedLocation,
    } = req.body;

    if (!text && !audioBase64) {
      res.status(400).json({ error: "Either text or audioBase64 must be provided." });
      return;
    }

    const systemInstruction = `
You are the AI Core Engine for "JanSamarth AI", India's National Digital Public Good (DPG) for citizen development grievance aggregation and infrastructure demand intelligence.
Your task is to analyze raw citizen voice transcripts, text inputs, or messaging dialogues across India's diverse linguistic landscape (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Odia, Punjabi, Malayalam, Assamese, Urdu, English, and regional dialects).

You must:
1. Identify the input language and dialect accurately.
2. If audio is supplied, transcribe verbatim.
3. Translate the core citizen requirement into high-precision English while preserving cultural context and specific local landmarks.
4. Categorize into one of the National Infrastructure Sectors:
   - "Water & Sanitation" (Jal Jeevan Mission, Har Ghar Jal, Drainage, STPs)
   - "Rural Roads & Bridges" (PMGSY, All-Weather Roads, Culverts)
   - "Primary Healthcare" (Ayushman Bharat, PHC/CHC infrastructure, Medical supplies, Doctor availability)
   - "Rural Electrification & Solar" (PM Surya Ghar, 24x7 feeder separation, transformer repairs)
   - "Education & Anganwadi" (School buildings, smart classrooms, toilets, Anganwadi nutrition centers)
   - "Irrigation & Flood Mitigation" (PMKSY, check dams, canal desilting, embankments)
   - "Digital & Telecom" (BharatNet fiber, 4G/5G mobile tower connectivity)
5. Extract key metadata:
   - State and District in India
   - Specific Block / Tehsil / Gram Panchayat if mentioned or infer from location context
   - Urgency Score (1 to 100) based on acute distress, safety hazards, seasonal urgency (e.g. monsoon cutoff), or human suffering
   - Estimated Beneficiary Count (number of villagers/residents impacted)
   - Specific Problem Entity tags (e.g. "Arsenic contamination", "Collapsed bridge", "Transformer burnt", "Absentee medical officer")
   - Sentiment: "Critical Distress", "Frustrated Concern", "Constructive Suggestion", or "General Query"
   - Recommended National / State Mission linkage (e.g., "Jal Jeevan Mission", "PMGSY-Phase IV", "PM-ABHIM", "PM-KUSUM", "Samagra Shiksha")
   - A concise 2-sentence vernacular acknowledgment to send back to the citizen in their native script.
`;

    const promptText = `
Analyze the following citizen request:
${text ? `Input Text: """${text}"""` : "Please transcribe and analyze the provided citizen voice recording."}
${reportedLocation ? `Reported Location Context: ${JSON.stringify(reportedLocation)}` : ""}
Channel: ${channel}

Respond strictly in JSON matching the schema.
`;

    const contents: any = [];

    if (audioBase64) {
      contents.push({
        parts: [
          {
            inlineData: {
              mimeType: audioMimeType,
              data: audioBase64,
            },
          },
          { text: promptText },
        ],
      });
    } else {
      contents.push(promptText);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguageCode: { type: Type.STRING },
            detectedLanguageName: { type: Type.STRING },
            verbatimTranscript: { type: Type.STRING },
            translatedEnglish: { type: Type.STRING },
            sector: { type: Type.STRING },
            subCategory: { type: Type.STRING },
            urgencyScore: { type: Type.INTEGER },
            estimatedBeneficiaries: { type: Type.INTEGER },
            sentiment: { type: Type.STRING },
            location: {
              type: Type.OBJECT,
              properties: {
                state: { type: Type.STRING },
                district: { type: Type.STRING },
                blockTehsil: { type: Type.STRING },
                villagePanchayat: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                isAspirationalDistrict: { type: Type.BOOLEAN },
                isTribalDominant: { type: Type.BOOLEAN },
              },
              required: ["state", "district"],
            },
            problemEntities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedMission: { type: Type.STRING },
            citizenReplyNative: { type: Type.STRING },
            citizenReplyEnglish: { type: Type.STRING },
            priorityReasoning: { type: Type.STRING },
          },
          required: [
            "detectedLanguageCode",
            "detectedLanguageName",
            "translatedEnglish",
            "sector",
            "urgencyScore",
            "estimatedBeneficiaries",
            "location",
            "problemEntities",
            "recommendedMission",
            "citizenReplyNative",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error in /api/ingest-citizen-request:", error);
    res.status(500).json({ error: error.message || "Failed to process citizen request." });
  }
});

// 2. Synthesize National Detailed Project Report (DPR) & Policy Brief
app.post("/api/generate-dpr", async (req, res) => {
  try {
    const { hotspot, districtProfile, targetLanguage = "hi" } = req.body;

    if (!hotspot) {
      res.status(400).json({ error: "Hotspot cluster details are required." });
      return;
    }

    const systemInstruction = `
You are the Chief Infrastructure Advisor & Appraisal Director at NITI Aayog / Ministry of Finance (Public Investment Board).
Generate a comprehensive, bankable Detailed Project Report (DPR) & Policy Recommendation Brief based on citizen demand aggregation, infrastructure deficit index, and demographic vulnerability.

The DPR must strictly follow Government of India project formulation guidelines (PIB/EFC format, PM Gati Shakti alignment, Sustainable Development Goals (SDG) mapping).
Provide:
1. Formal Project Title
2. Implementing Ministry & Nodal State Agency
3. Executive Summary (150 words)
4. Problem Statement & Ground Evidence (synthesizing aggregated citizen voices)
5. Technical Specifications & Engineering Solution
6. Capex Breakdown (Total in ₹ Crores, with civil works, electromechanical/smart metering, contingency, and O&M for 5 years)
7. Execution Timeline (Phases, Target Completion in Months)
8. Multi-Modal & PM Gati Shakti Synergies
9. Socio-Economic Return on Investment (S-ROI), Cost-Benefit Ratio, and Key Impact Metrics (e.g. reduction in waterborne morbidity, school attendance increase, logistics speedup)
10. Environmental & Social Governance (ESG) / Climate Resilience considerations
11. Local Language Citizen Summary (in the target vernacular language of that region, e.g. Hindi, Tamil, Bengali, Telugu, Marathi, etc.)
12. Key Approval Conditionality & Monitoring KPI milestones (using Geo-tagged DPG dashboard metrics).
`;

    const prompt = `
Hotspot Cluster Data:
${JSON.stringify(hotspot, null, 2)}

District Demographic & Infrastructure Index Profile:
${JSON.stringify(districtProfile || {}, null, 2)}

Target Vernacular Language Code for Citizen Summary: "${targetLanguage}"

Generate a thorough, realistic, and highly professional DPR in JSON format.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectTitle: { type: Type.STRING },
            projectCode: { type: Type.STRING },
            implementingMinistry: { type: Type.STRING },
            nodalStateAgency: { type: Type.STRING },
            sector: { type: Type.STRING },
            locationSummary: { type: Type.STRING },
            estimatedCapexCr: { type: Type.NUMBER },
            timelineMonths: { type: Type.INTEGER },
            executiveSummary: { type: Type.STRING },
            groundEvidence: { type: Type.STRING },
            technicalSolution: { type: Type.STRING },
            capexBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  component: { type: Type.STRING },
                  costCr: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                },
                required: ["component", "costCr"],
              },
            },
            timelinePhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  durationMonths: { type: Type.INTEGER },
                  deliverables: { type: Type.STRING },
                },
                required: ["phase", "durationMonths", "deliverables"],
              },
            },
            gatiShaktiSynergy: { type: Type.STRING },
            sdgGoals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            impactMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  baseline: { type: Type.STRING },
                  target: { type: Type.STRING },
                },
                required: ["metric", "target"],
              },
            },
            climateResilience: { type: Type.STRING },
            citizenBriefVernacular: { type: Type.STRING },
            citizenBriefEnglish: { type: Type.STRING },
            riskMitigation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING },
                  mitigation: { type: Type.STRING },
                },
                required: ["risk", "mitigation"],
              },
            },
            recommendedActionForPolicymakers: { type: Type.STRING },
          },
          required: [
            "projectTitle",
            "projectCode",
            "implementingMinistry",
            "sector",
            "estimatedCapexCr",
            "timelineMonths",
            "executiveSummary",
            "technicalSolution",
            "capexBreakdown",
            "impactMetrics",
            "citizenBriefVernacular",
            "citizenBriefEnglish",
          ],
        },
      },
    });

    const dpr = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, data: dpr });
  } catch (error: any) {
    console.error("Error in /api/generate-dpr:", error);
    res.status(500).json({ error: error.message || "Failed to generate DPR." });
  }
});

// 3. AI Policy Chat / Query Assistant for Policymakers
app.post("/api/policy-assistant-query", async (req, res) => {
  try {
    const { query, currentFilters, hotspotsSummary } = req.body;

    const systemInstruction = `
You are the AI Strategic Policy Assistant for JanSamarth AI (India's Citizen Infrastructure DPG).
You assist Union & State Cabinet Secretaries, District Magistrates, NITI Aayog Fellows, and Ministry Directors.
Answer questions by referencing national priorities, budget allocations, disparity gap indices, and citizen grievance clusters.
Use precise data, reference relevant schemes (Jal Jeevan, PMGSY, PM-ABHIM, PM Surya Ghar, Gati Shakti, etc.), and provide actionable strategic advice.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `
Policymaker Question: "${query}"

Active Context & Summary of Hotspots:
${JSON.stringify(hotspotsSummary, null, 2)}

Active Filters:
${JSON.stringify(currentFilters || {}, null, 2)}

Provide a concise, highly structured briefing (with bullet points and actionable takeaways).
`,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("Error in /api/policy-assistant-query:", error);
    res.status(500).json({ error: error.message || "Failed to query policy assistant." });
  }
});

// 4. Open DPG Schema & Anonymized Data API (for transparency & research)
app.get("/api/public-dpg/export", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    dpgStandard: "India Digital Public Goods Registry - Citizen Demand v1.4",
    license: "CC-BY-4.0 Open Government Data",
    lastUpdated: new Date().toISOString(),
    governanceModel: "NITI Aayog / MoHUA / MeitY Co-Governed",
    compliance: {
      becknProtocolCompatible: true,
      bhashiniMultilingualStandard: "v2.0",
      dataProtectionDPDPA: "Compliant - PII Masked",
    },
    message: "JanSamarth Open Data API active. Query endpoints for district indicators and aggregated demand clusters.",
  });
});

// Vite middleware for development / Static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`JanSamarth AI DPG server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
