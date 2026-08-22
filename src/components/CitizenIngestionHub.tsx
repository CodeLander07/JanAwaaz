import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Send,
  Upload,
  MessageSquare,
  Smartphone,
  Building2,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Volume2,
  Languages,
  Loader2,
  RefreshCw,
  Clock,
  CheckCheck,
  Paperclip,
  Image as ImageIcon,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { CitizenRequest, SectorType } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/indianLanguages';

interface CitizenIngestionHubProps {
  onNewRequestIngested: (newReq: CitizenRequest) => void;
  selectedLanguage: string;
}

export const CitizenIngestionHub: React.FC<CitizenIngestionHubProps> = ({
  onNewRequestIngested,
  selectedLanguage,
}) => {
  const [activeChannel, setActiveChannel] = useState<'voice' | 'whatsapp' | 'csc' | 'batch'>('voice');

  // Voice Studio States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [selectedVoiceScenario, setSelectedVoiceScenario] = useState<any>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);
  const [lastAnalyzedResult, setLastAnalyzedResult] = useState<any | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // WhatsApp Simulator States
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: 'user' | 'bot'; text: string; time: string; status?: 'sent' | 'delivered' | 'read' }[]
  >([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Welcome to CivicPulse AI (Universal Citizen Infrastructure Intelligence Platform). You can voice or type your regional infrastructure priority (water, roads, bridges, electricity, health clinic) in any native language or dialect.',
      time: '09:30 AM',
      status: 'read',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  // CSC Form States
  const [cscState, setCscState] = useState<string>('Uttar Pradesh');
  const [cscDistrict, setCscDistrict] = useState<string>('Mahoba');
  const [cscBlock, setCscBlock] = useState<string>('Kabrai');
  const [cscSector, setCscSector] = useState<SectorType>('Water & Sanitation');
  const [cscGrievance, setCscGrievance] = useState<string>('');
  const [cscBeneficiaries, setCscBeneficiaries] = useState<number>(5000);
  const [isSubmittingCsc, setIsSubmittingCsc] = useState<boolean>(false);
  const [cscSuccessMsg, setCscSuccessMsg] = useState<string | null>(null);

  // Batch Ingestion States
  const [batchCount, setBatchCount] = useState<number>(25);
  const [isIngestingBatch, setIsIngestingBatch] = useState<boolean>(false);
  const [batchSuccessCount, setBatchSuccessCount] = useState<number | null>(null);

  // Audio Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Find language info
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  // Initialize with a representative sample scenario for the selected language
  useEffect(() => {
    if (currentLangObj && currentLangObj.sampleScenarios.length > 0) {
      setSelectedVoiceScenario(currentLangObj.sampleScenarios[0]);
    }
  }, [selectedLanguage]);

  // Audio wave visualizer during recording
  const startCanvasWave = (stream: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#f59e0b');
          gradient.addColorStop(1, '#ef4444');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
      };

      draw();
    } catch (e) {
      console.warn('Audio visualization not supported on this device/browser:', e);
    }
  };

  const stopCanvasWave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  // Start Real Microphone Recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(recordedBlob);
        stream.getTracks().forEach((track) => track.stop());
        stopCanvasWave();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      startCanvasWave(stream);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      alert('Microphone access was denied or is unavailable. You can also test with pre-recorded authentic vernacular audio scenarios.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Process Voice Recording / Scenario with Server Gemini
  const handleProcessVoiceInput = async () => {
    setIsProcessingVoice(true);
    setLastAnalyzedResult(null);

    try {
      let payload: any = {
        channel: 'voice_ivr',
        reportedLocation: selectedVoiceScenario
          ? { state: selectedVoiceScenario.state, district: selectedVoiceScenario.district }
          : undefined,
      };

      if (audioBlob) {
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64Data = (reader.result as string).split(',')[1];
            payload.audioBase64 = base64Data;
            payload.audioMimeType = audioBlob.type || 'audio/webm';
            resolve(true);
          };
        });
      } else if (selectedVoiceScenario) {
        payload.text = selectedVoiceScenario.vernacularText;
      }

      const res = await fetch('/api/ingest-citizen-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const parsed = data.data;
        const newReq: CitizenRequest = {
          id: `REQ-IN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          channel: 'voice_ivr',
          rawVernacularText: parsed.verbatimTranscript || selectedVoiceScenario?.vernacularText || 'Voice recording processed.',
          sourceLanguageCode: parsed.detectedLanguageCode || currentLangObj.code,
          sourceLanguageName: parsed.detectedLanguageName || currentLangObj.name,
          translatedEnglish: parsed.translatedEnglish || 'Citizen development grievance.',
          sector: parsed.sector || 'Water & Sanitation',
          subCategory: parsed.subCategory || 'Infrastructure Deficit',
          urgencyScore: parsed.urgencyScore || 85,
          estimatedBeneficiaries: parsed.estimatedBeneficiaries || 5000,
          sentiment: (parsed.sentiment as any) || 'Critical Distress',
          location: {
            state: parsed.location?.state || selectedVoiceScenario?.state || 'Uttar Pradesh',
            district: parsed.location?.district || selectedVoiceScenario?.district || 'Mahoba',
            blockTehsil: parsed.location?.blockTehsil || 'Block Sector',
            villagePanchayat: parsed.location?.villagePanchayat || 'Gram Panchayat',
            lat: parsed.location?.lat || 25.3,
            lng: parsed.location?.lng || 80.0,
            isAspirationalDistrict: true,
          },
          problemEntities: parsed.problemEntities || ['Infrastructure Deficit'],
          recommendedMission: parsed.recommendedMission || 'National Infrastructure Mission',
          citizenReplyNative: parsed.citizenReplyNative || 'आपकी समस्या जनसमर्थ पर दर्ज हो गई है।',
          citizenReplyEnglish: parsed.citizenReplyEnglish || 'Your grievance has been successfully logged.',
          verificationStatus: 'Aggregated into Hotspot',
          audioSimulated: true,
        };

        setLastAnalyzedResult(newReq);
        onNewRequestIngested(newReq);
      }
    } catch (err: any) {
      console.error('Error processing voice:', err);
      alert('Failed to process voice: ' + (err.message || 'Server error'));
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // WhatsApp Chat Interaction
  const handleSendWhatsAppMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' as const,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    try {
      const res = await fetch('/api/ingest-citizen-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          channel: 'whatsapp',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const parsed = data.data;
        const newReq: CitizenRequest = {
          id: `REQ-WA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          channel: 'whatsapp',
          rawVernacularText: text,
          sourceLanguageCode: parsed.detectedLanguageCode || currentLangObj.code,
          sourceLanguageName: parsed.detectedLanguageName || currentLangObj.name,
          translatedEnglish: parsed.translatedEnglish,
          sector: parsed.sector || 'Rural Roads & Bridges',
          subCategory: parsed.subCategory || 'Citizen Grievance',
          urgencyScore: parsed.urgencyScore || 80,
          estimatedBeneficiaries: parsed.estimatedBeneficiaries || 2500,
          sentiment: (parsed.sentiment as any) || 'Frustrated Concern',
          location: {
            state: parsed.location?.state || 'Maharashtra',
            district: parsed.location?.district || 'Gadchiroli',
            blockTehsil: parsed.location?.blockTehsil || 'Tribal Block',
            villagePanchayat: parsed.location?.villagePanchayat || 'GP Unit',
            lat: parsed.location?.lat || 20.18,
            lng: parsed.location?.lng || 80.0,
            isAspirationalDistrict: true,
          },
          problemEntities: parsed.problemEntities || ['Development Issue'],
          recommendedMission: parsed.recommendedMission || 'PMGSY / JJM',
          citizenReplyNative: parsed.citizenReplyNative,
          citizenReplyEnglish: parsed.citizenReplyEnglish,
          verificationStatus: 'Aggregated into Hotspot',
        };

        onNewRequestIngested(newReq);

        // Add Bot reply to chat
        const botReply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot' as const,
          text: `✅ ${parsed.citizenReplyNative}\n\n📋 **Grievance ID:** ${newReq.id}\n🎯 **Sector:** ${newReq.sector}\n🏛️ **Nodal Mission:** ${newReq.recommendedMission}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatMessages((prev) => [...prev, botReply]);
      }
    } catch (e) {
      console.error(e);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: 'क्षमा करें, सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // CSC Form Submission
  const handleSubmitCscForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cscGrievance.trim()) return;

    setIsSubmittingCsc(true);
    setCscSuccessMsg(null);

    try {
      const res = await fetch('/api/ingest-citizen-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cscGrievance,
          channel: 'csc_portal',
          reportedLocation: { state: cscState, district: cscDistrict, blockTehsil: cscBlock },
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const parsed = data.data;
        const newReq: CitizenRequest = {
          id: `REQ-CSC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          channel: 'csc_portal',
          rawVernacularText: cscGrievance,
          sourceLanguageCode: parsed.detectedLanguageCode || currentLangObj.code,
          sourceLanguageName: parsed.detectedLanguageName || currentLangObj.name,
          translatedEnglish: parsed.translatedEnglish,
          sector: cscSector,
          subCategory: parsed.subCategory || 'CSC Verified Entry',
          urgencyScore: parsed.urgencyScore || 88,
          estimatedBeneficiaries: cscBeneficiaries,
          sentiment: 'Constructive Suggestion',
          location: {
            state: cscState,
            district: cscDistrict,
            blockTehsil: cscBlock,
            villagePanchayat: `${cscBlock} Gram Sabha`,
            lat: parsed.location?.lat || 25.3,
            lng: parsed.location?.lng || 80.0,
            isAspirationalDistrict: true,
          },
          problemEntities: parsed.problemEntities || [cscSector],
          recommendedMission: parsed.recommendedMission || 'National Infrastructure Mission',
          citizenReplyNative: parsed.citizenReplyNative,
          citizenReplyEnglish: parsed.citizenReplyEnglish,
          verificationStatus: 'Field Officer Validated',
        };

        onNewRequestIngested(newReq);
        setCscSuccessMsg(`Grievance successfully registered with ID: ${newReq.id}. Ingested into National Demand Matrix.`);
        setCscGrievance('');
      }
    } catch (e: any) {
      alert('Error submitting CSC form: ' + e.message);
    } finally {
      setIsSubmittingCsc(false);
    }
  };

  // Batch Ingestion Simulation (generates multiple multi-state citizen entries)
  const handleRunBatchIngestion = async () => {
    setIsIngestingBatch(true);
    setBatchSuccessCount(null);

    setTimeout(() => {
      const generated = batchCount;
      // Synthesize requests for different aspirational districts
      for (let i = 0; i < generated; i++) {
        const randomLang = SUPPORTED_LANGUAGES[i % SUPPORTED_LANGUAGES.length];
        const scenario = randomLang.sampleScenarios[0] || SUPPORTED_LANGUAGES[0].sampleScenarios[0];

        const mockReq: CitizenRequest = {
          id: `REQ-BATCH-${Date.now()}-${i + 1}`,
          timestamp: new Date().toISOString(),
          channel: i % 2 === 0 ? 'voice_ivr' : 'csc_portal',
          rawVernacularText: scenario.vernacularText,
          sourceLanguageCode: randomLang.code,
          sourceLanguageName: randomLang.name,
          translatedEnglish: scenario.englishSummary,
          sector: scenario.sector,
          subCategory: 'District Field Survey Batch',
          urgencyScore: Math.floor(75 + Math.random() * 24),
          estimatedBeneficiaries: Math.floor(1200 + Math.random() * 8000),
          sentiment: 'Critical Distress',
          location: {
            state: scenario.state,
            district: scenario.district,
            blockTehsil: 'Surveillance Block Sector',
            villagePanchayat: 'Gram Panchayat Cluster',
            lat: 20 + Math.random() * 8,
            lng: 75 + Math.random() * 12,
            isAspirationalDistrict: true,
          },
          problemEntities: ['Batch Survey Claim', scenario.sector],
          recommendedMission: 'National Infrastructure Pipeline',
          citizenReplyNative: randomLang.greeting,
          citizenReplyEnglish: 'Batch request validated and aggregated into priority matrix.',
          verificationStatus: 'Aggregated into Hotspot',
        };

        onNewRequestIngested(mockReq);
      }

      setBatchSuccessCount(generated);
      setIsIngestingBatch(false);
    }, 1200);
  };

  return (
    <div id="citizen-ingestion-hub" className="space-y-6">
      {/* Channel Switcher Tabs - Geometric Balance */}
      <div className="bg-white border border-slate-200 rounded-sm p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="channel-tab-voice"
              onClick={() => setActiveChannel('voice')}
              className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeChannel === 'voice'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Mic className="w-4 h-4 text-orange-400" />
              <span>Voice &amp; IVR Studio</span>
            </button>

            <button
              id="channel-tab-whatsapp"
              onClick={() => setActiveChannel('whatsapp')}
              className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeChannel === 'whatsapp'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp / Sandes Gov Bot</span>
            </button>

            <button
              id="channel-tab-csc"
              onClick={() => setActiveChannel('csc')}
              className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeChannel === 'csc'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>CSC &amp; Panchayat Kiosk</span>
            </button>

            <button
              id="channel-tab-batch"
              onClick={() => setActiveChannel('batch')}
              className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                activeChannel === 'batch'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Batch Survey &amp; CSV Ingest</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-sm">
            <Languages className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dialect Engine:</span>
            <span className="font-bold text-indigo-900">{currentLangObj.name} ({currentLangObj.nativeName})</span>
          </div>
        </div>
      </div>

      {/* CHANNEL 1: LIVE VOICE & IVR STUDIO */}
      {activeChannel === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Recording & Scenario Selector (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-2">
                <Mic className="w-4 h-4 text-orange-500" />
                <span>Multilingual Speech-to-Intent Voice Studio</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Speak directly in any Indian dialect or select real-world rural voice transcripts for automatic entity extraction.
              </p>
            </div>

            {/* Live Web Audio Recorder Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 text-center space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span className="flex items-center text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2" />
                  Live Audio Stream Ready
                </span>
                <span className="font-mono text-indigo-900 font-bold text-sm">
                  {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Canvas Wave Visualizer */}
              <div className="w-full h-24 bg-indigo-950 rounded-sm overflow-hidden flex items-center justify-center border border-indigo-900 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={96}
                  className="w-full h-full"
                />
              </div>

              {/* Recording Action Buttons */}
              <div className="flex items-center justify-center space-x-4">
                {!isRecording ? (
                  <button
                    id="start-mic-record-btn"
                    onClick={handleStartRecording}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-sm shadow-xs flex items-center space-x-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Record Voice in {currentLangObj.name}</span>
                  </button>
                ) : (
                  <button
                    id="stop-mic-record-btn"
                    onClick={handleStopRecording}
                    className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-sm shadow-xs flex items-center space-x-2 cursor-pointer animate-pulse"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop Recording &amp; Transcribe</span>
                  </button>
                )}

                {audioBlob && !isRecording && (
                  <button
                    id="process-recorded-voice-btn"
                    disabled={isProcessingVoice}
                    onClick={handleProcessVoiceInput}
                    className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-sm shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingVoice ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                        <span>Analyzing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-orange-300" />
                        <span>Process Live Voice Recording</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Select Authentic Vernacular Audio Scenarios */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5">
                  <Volume2 className="w-4 h-4 text-orange-500" />
                  <span>Ground Field Voice Grievances ({currentLangObj.name})</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">12+ Linguistic Zones</span>
              </div>

              <div className="space-y-2.5">
                {currentLangObj.sampleScenarios.map((scenario, idx) => {
                  const isSelected = selectedVoiceScenario?.title === scenario.title;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedVoiceScenario(scenario);
                        setAudioBlob(null);
                      }}
                      className={`p-3.5 rounded-sm border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-l-4 border-l-orange-500 border-slate-300 shadow-xs ring-1 ring-orange-500/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          <span>{scenario.title}</span>
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm font-bold border border-slate-200 uppercase tracking-wider">
                          {scenario.district}, {scenario.state}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium italic text-xs leading-relaxed">
                        "{scenario.vernacularText}"
                      </p>
                    </div>
                  );
                })}
              </div>

              {selectedVoiceScenario && !audioBlob && (
                <button
                  id="process-selected-scenario-btn"
                  disabled={isProcessingVoice}
                  onClick={handleProcessVoiceInput}
                  className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-sm shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-3"
                >
                  {isProcessingVoice ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                      <span>Ingesting Vernacular Speech &amp; Correlating National Indices...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-orange-300" />
                      <span>Ingest Voice Grievance into National DPG Matrix</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right: Real-time Speech-to-Intent Extraction Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 border-l-4 border-l-indigo-600 rounded-sm p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5 border-b border-slate-200 pb-3">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>AI Speech-to-Intent Extraction Engine</span>
              </h4>

              {lastAnalyzedResult ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Language & Dialect Tag */}
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-sm p-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Detected Language</span>
                      <span className="font-bold text-indigo-900">
                        {lastAnalyzedResult.sourceLanguageName} ({lastAnalyzedResult.sourceLanguageCode})
                      </span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded-sm font-bold border border-emerald-200 uppercase tracking-wider">
                      Bhashini Verified
                    </span>
                  </div>

                  {/* Verbatim Transcript */}
                  <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-xs space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Native Audio Transcript:</span>
                    <p className="text-slate-800 font-medium italic text-xs leading-relaxed">
                      "{lastAnalyzedResult.rawVernacularText}"
                    </p>
                  </div>

                  {/* Translated English Output */}
                  <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-xs space-y-1">
                    <span className="text-[10px] text-indigo-900 font-bold uppercase tracking-wider block">English Intent Translation:</span>
                    <p className="text-slate-800 text-xs leading-relaxed">
                      {lastAnalyzedResult.translatedEnglish}
                    </p>
                  </div>

                  {/* Urgency & Sector Mapping */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Urgency Score</span>
                      <span className="text-base font-mono font-bold text-orange-600">
                        {lastAnalyzedResult.urgencyScore} / 100
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sector</span>
                      <span className="text-xs font-bold text-indigo-900 block truncate">
                        {lastAnalyzedResult.sector}
                      </span>
                    </div>
                  </div>

                  {/* Pinpoint Geolocation & Beneficiaries */}
                  <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target Geolocation</span>
                      <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                        ~{lastAnalyzedResult.estimatedBeneficiaries} Impacted
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 mr-1" />
                      {lastAnalyzedResult.location.villagePanchayat}, {lastAnalyzedResult.location.blockTehsil},{' '}
                      {lastAnalyzedResult.location.district} ({lastAnalyzedResult.location.state})
                    </p>
                  </div>

                  {/* Citizen Vernacular Reply Confirmation */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-3 text-xs space-y-1">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest block">
                      IVR / SMS Acknowledgment Sent to Citizen
                    </span>
                    <p className="text-emerald-950 font-medium text-xs">
                      {lastAnalyzedResult.citizenReplyNative}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-900">
                    <Languages className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Record voice audio or select a scenario to see real-time Speech-to-Intent extraction, entity extraction, and national index matching.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHANNEL 2: WHATSAPP / SANDES GOV BOT SIMULATOR */}
      {activeChannel === 'whatsapp' && (
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs">
          {/* WhatsApp Header */}
          <div className="bg-indigo-900 px-5 py-3.5 text-white flex items-center justify-between border-b border-indigo-950">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center font-bold text-sm">
                <Smartphone className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider leading-tight">JanSamarth AI • Messaging Helpline</h4>
                <span className="text-[10px] text-indigo-200 flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Official WhatsApp &amp; Sandes Helpline (+91-1800-JANSAMARTH)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-sm border border-white/20">
              Bhashini Multilingual
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="bg-slate-50 p-4 h-[420px] overflow-y-auto space-y-3 flex flex-col border-b border-slate-200">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-sm px-4 py-3 text-xs shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-900 text-white self-end border-l-4 border-l-orange-500'
                    : 'bg-white text-slate-800 self-start border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed font-medium">{msg.text}</p>
                <div className="flex items-center justify-end space-x-1 text-[9px] text-slate-400 mt-1 font-mono">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-orange-400" />}
                </div>
              </div>
            ))}

            {isBotTyping && (
              <div className="bg-white border border-slate-200 text-slate-600 text-xs px-3.5 py-2.5 rounded-sm self-start flex items-center space-x-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>JanSamarth AI is parsing linguistic entities &amp; indexing...</span>
              </div>
            )}
          </div>

          {/* Quick-Prompt Pill Suggestions */}
          <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Fast Prompts:</span>
            <button
              onClick={() => handleSendWhatsAppMessage('हमारे गांव में 6 महीने से पानी नहीं आ रहा है, जल जीवन मिशन पाइपलाइन टूटी है।')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-sm whitespace-nowrap font-medium text-xs cursor-pointer"
            >
              Water Supply Crisis
            </button>
            <button
              onClick={() => handleSendWhatsAppMessage('बाढ़ में पुलिया बह गई है, 12000 लोग स्कूल और अस्पताल से कटे हैं।')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-sm whitespace-nowrap font-medium text-xs cursor-pointer"
            >
              Bridge Cutoff
            </button>
            <button
              onClick={() => handleSendWhatsAppMessage('PHC अस्पताल में डॉक्टर नहीं हैं, प्रसूति वार्ड बंद है।')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-sm whitespace-nowrap font-medium text-xs cursor-pointer"
            >
              PHC Doctor Vacancy
            </button>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendWhatsAppMessage();
            }}
            className="bg-white p-3 flex items-center space-x-2"
          >
            <input
              id="whatsapp-chat-input"
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="अपनी मातृभाषा में समस्या लिखें... (Type in any Indian language)"
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isBotTyping}
              className="bg-indigo-900 hover:bg-indigo-800 text-white p-2.5 rounded-sm disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* CHANNEL 3: COMMON SERVICE CENTRE (CSC) PORTAL */}
      {activeChannel === 'csc' && (
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Common Service Centre (CSC) &amp; Panchayat Kiosk Intake</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official intake console used by Village Level Entrepreneurs (VLEs) &amp; Gram Rozgar Sahayaks
              </p>
            </div>
            <span className="bg-indigo-50 text-indigo-900 text-[10px] px-2.5 py-1 rounded-sm font-bold border border-indigo-200 uppercase tracking-wider">
              VLE Auth: ID-VLE-88412
            </span>
          </div>

          {cscSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-3.5 text-xs text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{cscSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitCscForm} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600 font-bold uppercase tracking-wider text-[10px] block mb-1">State / UT</label>
                <input
                  type="text"
                  value={cscState}
                  onChange={(e) => setCscState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="text-slate-600 font-bold uppercase tracking-wider text-[10px] block mb-1">District</label>
                <input
                  type="text"
                  value={cscDistrict}
                  onChange={(e) => setCscDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="text-slate-600 font-bold uppercase tracking-wider text-[10px] block mb-1">Block / Tehsil</label>
                <input
                  type="text"
                  value={cscBlock}
                  onChange={(e) => setCscBlock(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-bold uppercase tracking-wider text-[10px] block mb-1">Target Infrastructure Sector</label>
                <select
                  value={cscSector}
                  onChange={(e) => setCscSector(e.target.value as SectorType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-slate-900 font-semibold focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                >
                  <option value="Water & Sanitation">Water &amp; Sanitation (JJM)</option>
                  <option value="Rural Roads & Bridges">Rural Roads &amp; Bridges (PMGSY)</option>
                  <option value="Primary Healthcare">Primary Healthcare (PM-ABHIM)</option>
                  <option value="Rural Electrification & Solar">Rural Power &amp; Solar (PM Surya Ghar)</option>
                  <option value="Education & Anganwadi">Education &amp; Anganwadi</option>
                  <option value="Irrigation & Flood Mitigation">Irrigation &amp; Flood Mitigation</option>
                  <option value="Digital & Telecom">Digital &amp; Telecom (BharatNet)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-bold uppercase tracking-wider text-[10px] block mb-1">Estimated Beneficiary Villagers</label>
                <input
                  type="number"
                  value={cscBeneficiaries}
                  onChange={(e) => setCscBeneficiaries(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase tracking-wider text-[10px] block mb-1">
                Citizen Development Demand Details (Vernacular or English)
              </label>
              <textarea
                rows={3}
                value={cscGrievance}
                onChange={(e) => setCscGrievance(e.target.value)}
                placeholder="Enter exact description of missing infrastructure, duration of failure, and community demand..."
                className="w-full bg-slate-50 border border-slate-200 rounded-sm p-3 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <button
              id="submit-csc-grievance-btn"
              type="submit"
              disabled={isSubmittingCsc || !cscGrievance.trim()}
              className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-sm shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingCsc ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Validating &amp; Ingesting into DPG Ledger...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Submit to National Demand Ledger</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* CHANNEL 4: BATCH SURVEY & CSV DATASET INGESTION */}
      {activeChannel === 'batch' && (
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-2">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>District Administration Survey &amp; CSV Ingestion</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bulk ingest district-wide citizen survey feedback datasets across 112 Aspirational Districts
              </p>
            </div>
            <span className="text-[10px] bg-purple-50 text-purple-900 px-2.5 py-1 rounded-sm font-bold border border-purple-200 uppercase tracking-wider">
              DPG Open Data Format v1.4
            </span>
          </div>

          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-sm p-8 text-center space-y-3">
            <Upload className="w-10 h-10 text-indigo-600 mx-auto" />
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Drop Survey CSV / JSON Dataset</span>
              <span className="text-xs text-slate-500 mt-1 block">
                Supports NITI Aayog format, Gram Rozgar surveys, and Jal Jeevan Mission field audit data
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <span className="text-xs text-slate-600 font-medium">Or simulate synthetic batch:</span>
              <select
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="bg-white border border-slate-200 text-slate-900 font-semibold text-xs rounded-sm px-2.5 py-1 cursor-pointer"
              >
                <option value={10}>10 Multi-district Requests</option>
                <option value={25}>25 Multi-district Requests</option>
                <option value={50}>50 Multi-district Requests</option>
              </select>
            </div>
          </div>

          {batchSuccessCount !== null && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-3.5 text-xs text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Successfully ingested <strong>{batchSuccessCount}</strong> multi-lingual citizen records into the National Demand Hotspot matrix!
              </span>
            </div>
          )}

          <button
            id="run-batch-ingestion-btn"
            disabled={isIngestingBatch}
            onClick={handleRunBatchIngestion}
            className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-sm shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isIngestingBatch ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                <span>Ingesting and Recalculating Disparity Gap Matrix...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-orange-300" />
                <span>Execute Batch Ingestion &amp; Update National Hotspots</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
