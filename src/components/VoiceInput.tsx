"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onResult: (text: string) => void;
  disabled?: boolean;
  lang?: string;
};

type SR = typeof window extends { SpeechRecognition: infer T }
  ? T
  : typeof window extends { webkitSpeechRecognition: infer T }
    ? T
    : null;

export function VoiceInput({ onResult, disabled, lang = "es-MX" }: Props) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [partial, setPartial] = useState("");
  const recRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim) setPartial(interim);
      if (final) {
        setPartial("");
        onResult(final.trim());
        setListening(false);
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => rec.abort();
  }, [lang, onResult]);

  const toggle = () => {
    if (!recRef.current) return;
    if (listening) {
      recRef.current.stop();
      setListening(false);
    } else {
      setPartial("");
      recRef.current.start();
      setListening(true);
    }
  };

  if (!supported) {
    return (
      <p className="text-xs text-zinc-400">
        Tu navegador no soporta voz. Escribe tu mensaje abajo.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={cn(
          "relative grid h-24 w-24 place-items-center rounded-full transition-all",
          "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white",
          "shadow-[0_8px_40px_-8px_rgba(16,185,129,0.6)] hover:shadow-[0_8px_50px_-8px_rgba(16,185,129,0.8)]",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          listening && "scale-110",
        )}
      >
        {listening && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
            <span className="absolute inset-0 animate-pulse rounded-full bg-emerald-300/20" />
          </>
        )}
        {listening ? <Square className="h-9 w-9" /> : <Mic className="h-9 w-9" />}
      </button>
      <p className="min-h-[1.25rem] text-center text-sm text-zinc-300">
        {listening
          ? partial || "Escuchando…"
          : "Tap y di cuánto y a quién"}
      </p>
    </div>
  );
}
