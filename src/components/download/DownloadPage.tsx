"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Monitor,
  Globe,
  Download,
  Shield,
  Zap,
  CheckCircle,
  ExternalLink,
  Copy,
  QrCode,
} from "lucide-react";
import { useState } from "react";

const platforms = [
  {
    id: "android",
    name: "Android",
    icon: <Smartphone className="w-8 h-8" />,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    fileName: "FinTrack.apk",
    size: "~15 MB",
    steps: [
      "Click the download button below",
      "Open the APK file when downloaded",
      "Allow 'Install from unknown sources' if prompted",
      "Tap Install — done!",
    ],
    note: "Works on Android 8.0+",
  },
  {
    id: "windows",
    name: "Windows",
    icon: <Monitor className="w-8 h-8" />,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    fileName: "FinTrack.exe",
    size: "~10 MB",
    steps: [
      "Click the download button below",
      "Open the EXE file when downloaded",
      "Click 'More info' → 'Run anyway' if SmartScreen appears",
      "App opens — done!",
    ],
    note: "Works on Windows 10/11",
  },
  {
    id: "pwa",
    name: "Any Device",
    icon: <Globe className="w-8 h-8" />,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    fileName: "Web App (PWA)",
    size: "Instant",
    steps: [
      "Open the app link on your device",
      "Android: Tap 'Add to Home Screen'",
      "iPhone: Tap Share → 'Add to Home Screen'",
      "Desktop: Click install icon in address bar",
    ],
    note: "Works on any device with a browser",
  },
];

export default function DownloadPage() {
  const [copied, setCopied] = useState(false);
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              FinTrack
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your premium financial tracker. Install it on any device — phone, tablet, or laptop.
            </p>
          </motion.div>

          {/* Quick Share Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 mb-8"
          >
            <span className="text-sm text-muted-foreground">Share this link:</span>
            <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
              {appUrl}/download
            </code>
            <button
              onClick={copyLink}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`relative rounded-2xl border ${platform.borderColor} ${platform.bgColor} p-6`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white mb-4`}>
                {platform.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-1">{platform.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{platform.fileName}</p>
              <p className="text-xs text-muted-foreground mb-4">{platform.size}</p>

              <ol className="space-y-2 mb-6">
                {platform.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              {platform.id === "pwa" ? (
                <a
                  href="/"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  <Globe className="w-5 h-5" />
                  Open Web App
                </a>
              ) : (
                <a
                  href={`/api/download/${platform.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  <Download className="w-5 h-5" />
                  Download {platform.name}
                </a>
              )}

              <p className="text-xs text-muted-foreground mt-3 text-center">{platform.note}</p>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">Why FinTrack?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "100% Private", desc: "Your data stays on your device. No cloud, no tracking." },
              { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast", desc: "Native app speed. Works offline. No internet needed." },
              { icon: <CheckCircle className="w-6 h-6" />, title: "Free Forever", desc: "No subscriptions, no ads, no hidden fees." },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
