"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { BrandLogo } from "@/components/brand-logo";
import {
  ArrowRight,
  FileText,
  Brain,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Document Analysis",
    description:
      "Upload PDFs and educational materials. Our AI extracts and understands content contextually.",
  },
  {
    icon: Brain,
    title: "Intelligent Question Generation",
    description:
      "Generate professional question papers with MCQs, short answers, and structured sections automatically.",
  },
  {
    icon: CheckCircle2,
    title: "AI-Assisted Evaluation",
    description:
      "Automated answer key generation with marking schemes and grading rubrics.",
  },
  {
    icon: Sparkles,
    title: "Multi-Model Support",
    description:
      "Powered by advanced LLMs via OpenRouter. Choose the model that fits your needs and budget.",
  },
  {
    icon: BookOpen,
    title: "Structured Assessments",
    description:
      "Create exams with proper sections, difficulty levels, marks distribution, and professional formatting.",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description:
      "Built for universities, companies, and educational institutions. Professional-grade output quality.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#6C63FF]/[0.07] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#6C63FF]/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-[1280px] px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse-subtle" />
                <span className="text-xs font-medium text-[#B0B0B5]">
                  AI-Powered Assessment Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-[68px] font-bold text-[#F5F5F5] leading-[1.1] tracking-tight text-balance"
            >
              Create Professional Exams{" "}
              <span className="text-[#6C63FF]">Using AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-[#B0B0B5] leading-relaxed max-w-2xl mx-auto"
            >
              Upload educational material and instantly generate question papers,
              answer keys and AI-assisted student evaluation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/chat">
                <button className="btn-primary text-base px-8 py-3.5">
                  Generate Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="#features">
                <button className="btn-secondary text-base px-8 py-3.5">
                  Learn More
                </button>
              </a>
            </motion.div>
          </div>

          {/* Product Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 mx-auto max-w-4xl"
          >
            <div className="card p-1 shadow-card">
              <div className="rounded-xl bg-[#111214] border border-white/[0.04] overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="mx-auto max-w-xs h-6 rounded-md bg-white/[0.04] flex items-center justify-center">
                      <span className="text-[10px] text-[#71717A]">
                        autoexam.ai/chat
                      </span>
                    </div>
                  </div>
                </div>
                {/* App preview */}
                <div className="p-8 md:p-12">
                  <div className="space-y-4">
                    {/* Upload area mockup */}
                    <div className="border-2 border-dashed border-white/[0.06] rounded-xl p-8 text-center">
                      <FileText className="w-8 h-8 text-[#6C63FF]/60 mx-auto mb-3" />
                      <p className="text-sm text-[#71717A]">
                        Upload your educational material
                      </p>
                    </div>
                    {/* Input mockup */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-10 rounded-xl bg-white/[0.02] border border-white/[0.06]" />
                      <div className="h-10 rounded-xl bg-white/[0.02] border border-white/[0.06]" />
                    </div>
                    {/* Button mockup */}
                    <div className="flex justify-end">
                      <div className="h-10 w-48 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-white/[0.04]">
        <div className="mx-auto max-w-[1280px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] tracking-tight">
              Everything you need
            </h2>
            <p className="mt-4 text-lg text-[#71717A] max-w-xl mx-auto">
              From document upload to graded assessments — a complete AI-powered
              examination pipeline.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover p-6 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#6C63FF]/15 transition-colors duration-200">
                  <feature.icon className="w-5 h-5 text-[#6C63FF]" />
                </div>
                <h3 className="text-[17px] font-semibold text-[#F5F5F5] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] tracking-tight">
              Ready to transform assessments?
            </h2>
            <p className="mt-4 text-lg text-[#71717A]">
              Start generating professional exam papers in minutes.
            </p>
            <Link href="/chat" className="mt-8 inline-block">
              <button className="btn-primary text-base px-8 py-3.5">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <BrandLogo size="sm" />
            <p className="text-xs text-[#71717A]">
              Built with AI. Designed for education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
