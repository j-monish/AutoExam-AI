"use client";

import { Navbar } from "@/components/navbar";
import { Inputp } from "@/components/ui/apikeyinput";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainMenusGradientCard } from "@/components/eldoraui/animatedcard";
import { ArrowButton } from "@/components/eldoraui/arrowbutton";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  FileText,
  Settings2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

const generationStages = [
  "Uploading PDF...",
  "Extracting Content...",
  "Understanding Context...",
  "Planning Assessment...",
  "Generating Questions...",
  "Generating Answer Key...",
  "Formatting Output...",
  "Finalizing...",
];

function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [questionHeader, setQuestionHeader] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [modelName, setModelName] = useState("qwen/qwq-32b:free");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [typingText, setTypingText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [displayedContentLength, setDisplayedContentLength] = useState(0);
  const typingSpeed = 5;
  const typingInterval = useRef<NodeJS.Timeout | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);
  const scrolling = useRef(false);
  const [currentStage, setCurrentStage] = useState(0);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const cleanupEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupEventSource();
    };
  }, []);

  // Animate through loading stages
  useEffect(() => {
    if (isLoading && !isFormSubmitted) {
      setCurrentStage(0);
      const interval = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev < generationStages.length - 1) return prev + 1;
          return prev;
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading, isFormSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionHeader.trim()) {
      setError("Question header is required");
      return;
    }
    if (!questionDescription.trim()) {
      setError("Question description is required");
      return;
    }
    if (!apiKey.trim()) {
      setError("API key is required");
      return;
    }
    if (files.length === 0) {
      setError("Please upload at least one file");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });
      formData.append("questionHeader", questionHeader);
      formData.append("questionDescription", questionDescription);
      formData.append("apiKey", apiKey);
      formData.append("modelName", modelName);

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate questions");
      }

      const data = await response.json();

      if (data.uploadedFiles && data.uploadedFiles.length > 0) {
        setUploadedFileNames(data.uploadedFiles);
        setTimeout(() => {
          fetchGeneratedQuestions(data.uploadedFiles);
        }, 50);
      } else {
        setError("No files were processed. Please try again.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setIsLoading(false);
    }
  };

  const fetchGeneratedQuestions = (files: string[] = []) => {
    setGeneratedContent("");
    setDisplayedContentLength(0);
    setTypingText("");
    setIsTypingComplete(false);
    setIsGenerating(true);
    setError("");

    cleanupEventSource();

    const params = new URLSearchParams();
    params.set("questionHeader", questionHeader);
    params.set("questionDescription", questionDescription);
    params.set("modelName", modelName);

    const filesToUse = files.length > 0 ? files : uploadedFileNames;
    if (filesToUse.length > 0) {
      params.set("uploadedFiles", filesToUse.join(","));
    }

    const requestUrl = `/api/generate-questions?${params.toString()}`;

    const abortController = new AbortController();
    eventSourceRef.current = { close: () => abortController.abort() } as EventSource;

    (async () => {
      try {
        const response = await fetch(requestUrl, {
          headers: { "x-api-key": apiKey },
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          setError("Error receiving data from the server. Please try again.");
          setIsGenerating(false);
          return;
        }

        console.log("EventSource connection established");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("event: complete")) {
              setIsGenerating(false);
              cleanupEventSource();
              return;
            }
            if (!line.startsWith("data: ")) continue;
            const dataStr = line.slice(6);
            if (dataStr === "done") continue;

            try {
              const data = JSON.parse(dataStr);

              if (!isFormSubmitted && data.content && data.content.trim() !== "") {
                setIsAnimating(true);
                setTimeout(() => {
                  setIsFormSubmitted(true);
                  setIsAnimating(false);
                  setIsLoading(false);
                  setTimeout(() => scrollToBottom(), 100);
                }, 500);
              }

              if (data.type === "error") {
                setError(data.content);
                setIsGenerating(false);
                setIsLoading(false);
                cleanupEventSource();
                return;
              }

              setGeneratedContent((prev) => {
                const newContent = prev + (prev ? "\n\n" : "") + data.content;
                requestAnimationFrame(() => {
                  if (isGenerating) scrollToBottom();
                });
                return newContent;
              });
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
              setGeneratedContent((prev) => prev + (prev ? "\n\n" : "") + dataStr);
            }
          }
        }

        setIsGenerating(false);
        cleanupEventSource();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Error receiving data from the server. Please try again.");
        setIsGenerating(false);
        cleanupEventSource();
      }
    })();
  };

  const handleGoBack = () => {
    cleanupEventSource();
    setIsAnimating(true);
    setTimeout(() => {
      setIsFormSubmitted(false);
      setIsAnimating(false);
      setGeneratedContent("");
      setIsGenerating(false);
    }, 500);
  };

  useEffect(() => {
    if (!generatedContent || !isFormSubmitted || isGenerating) return;
    if (typingInterval.current) clearInterval(typingInterval.current);

    setIsTypingComplete(false);
    typingInterval.current = setInterval(() => {
      setDisplayedContentLength((prev) => {
        if (prev + typingSpeed >= generatedContent.length) {
          clearInterval(typingInterval.current!);
          setIsTypingComplete(true);
          return generatedContent.length;
        }
        return prev + typingSpeed;
      });
    }, 10);

    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
    };
  }, [generatedContent, isFormSubmitted, isGenerating]);

  useEffect(() => {
    setTypingText(generatedContent.substring(0, displayedContentLength));
  }, [displayedContentLength, generatedContent]);

  const scrollToBottom = () => {
    if (contentRef.current && !scrolling.current) {
      scrolling.current = true;
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        scrolling.current = false;
        if (contentRef.current && isGenerating) {
          const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
          if (scrollHeight - scrollTop - clientHeight > 50) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
          }
        }
      }, 300);
    }
  };

  useEffect(() => {
    if (isGenerating && contentRef.current) {
      lastScrollPosition.current = contentRef.current.scrollHeight;
      requestAnimationFrame(() => scrollToBottom());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedContent, isGenerating]);

  useEffect(() => {
    if (isGenerating && contentRef.current && typingText) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom) {
        requestAnimationFrame(() => scrollToBottom());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingText, isGenerating]);

  const handleContentScroll = () => {
    if (!contentRef.current) return;
    const { scrollHeight, clientHeight } = contentRef.current;
    setShowScrollButton(scrollHeight > clientHeight + 20);
  };

  useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleContentScroll);
      handleContentScroll();
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleContentScroll);
      }
    };
  }, [isFormSubmitted]);

  useEffect(() => {
    if (contentRef.current) {
      setTimeout(handleContentScroll, 100);
    }
  }, [generatedContent, typingText]);

  const renderAnimatedContent = () => {
    if (isGenerating) {
      return (
        <div
          ref={contentRef}
          className="relative overflow-y-scroll overflow-x-hidden overflow-scrollbar-hidden max-h-[70vh] scroll-smooth"
        >
          {/* Generation progress */}
          {!generatedContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 py-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#6C63FF] animate-pulse-subtle" />
                </div>
                <p className="text-sm font-medium text-[#B0B0B5]">
                  Generating your assessment...
                </p>
              </div>
              <div className="space-y-2">
                {generationStages.map((stage, idx) => (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: idx <= currentStage ? 1 : 0.3,
                      x: 0,
                    }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-center gap-3 py-1.5"
                  >
                    {idx < currentStage ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                    ) : idx === currentStage ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[#6C63FF] border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/[0.08] flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        idx <= currentStage
                          ? "text-[#F5F5F5]"
                          : "text-[#71717A]/50"
                      }`}
                    >
                      {stage}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2"
            >
              <div className="prose-custom">
                <ReactMarkdown>{typingText}</ReactMarkdown>
                {!isTypingComplete && (
                  <motion.span
                    className="inline-block w-[2px] h-5 bg-[#6C63FF] ml-0.5"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
            </motion.div>
          )}

          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="fixed right-6 bottom-6 w-10 h-10 rounded-xl bg-[#17181B] border border-white/[0.08] flex items-center justify-center shadow-card hover:bg-white/[0.04] transition-all duration-200 z-50"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="w-4 h-4 text-[#B0B0B5]" />
            </motion.button>
          )}
        </div>
      );
    }

    if (!generatedContent) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-sm text-[#71717A]">
            No content generated yet. There might have been an error.
          </p>
          {error && <p className="text-sm text-[#EF4444] mt-2">{error}</p>}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full overflow-y-scroll overflow-x-hidden overflow-scrollbar-hidden max-h-[70vh] relative scroll-smooth"
        onScroll={handleContentScroll}
      >
        <div className="prose-custom">
          <ReactMarkdown>{typingText}</ReactMarkdown>
          {!isTypingComplete && (
            <motion.span
              className="inline-block w-[2px] h-5 bg-[#6C63FF] ml-0.5"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </div>

        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="fixed right-6 bottom-6 w-10 h-10 rounded-xl bg-[#17181B] border border-white/[0.08] flex items-center justify-center shadow-card hover:bg-white/[0.04] transition-all duration-200 z-50"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-4 h-4 text-[#B0B0B5]" />
          </motion.button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      <Navbar />

      <AnimatePresence mode="wait">
        {!isFormSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isAnimating ? 0 : 1,
              y: isAnimating ? -20 : 0,
              scale: isAnimating ? 0.98 : 1,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="pt-24 pb-16"
          >
            <div className="mx-auto max-w-[800px] px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">
                  New Assessment
                </h1>
                <p className="mt-2 text-sm text-[#71717A]">
                  Upload your materials and configure the exam parameters below.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-sm text-[#EF4444]"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Upload Material Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#6C63FF]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[#F5F5F5]">
                        Upload Material
                      </h2>
                      <p className="text-xs text-[#71717A]">
                        PDF documents for question generation
                      </p>
                    </div>
                  </div>
                  <FileUpload onChange={handleFileUpload} />
                </motion.div>

                {/* Assessment Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                      <Settings2 className="w-4 h-4 text-[#6C63FF]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[#F5F5F5]">
                        Assessment Information
                      </h2>
                      <p className="text-xs text-[#71717A]">
                        Header details and exam description
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="questionHeader" className="mb-2 block">
                        Question Header
                      </Label>
                      <p className="text-xs text-[#71717A] mb-2">
                        Include: Institution Name, Exam Type, Course Name, Code,
                        Semester, Duration & Marks
                      </p>
                      <Input
                        id="questionHeader"
                        value={questionHeader}
                        onChange={(e) => setQuestionHeader(e.target.value)}
                        placeholder="e.g. Midterm Examination — Physics 101 — Fall 2024 — 3 Hours — 100 Marks"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="questionDescription" className="mb-2 block">
                        Question Description
                      </Label>
                      <Input
                        id="questionDescription"
                        value={questionDescription}
                        onChange={(e) => setQuestionDescription(e.target.value)}
                        placeholder="e.g. Cover chapters 1-8. Focus on mechanics and thermodynamics."
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* AI Configuration */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#6C63FF]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[#F5F5F5]">
                        AI Configuration
                      </h2>
                      <p className="text-xs text-[#71717A]">
                        API credentials and model selection
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apiKey" className="mb-2 block">
                        API Key
                      </Label>
                      <Inputp
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your OpenRouter API key"
                      />
                    </div>
                    <div>
                      <Label htmlFor="modelName" className="mb-2 block">
                        Model
                      </Label>
                      <Inputp
                        id="modelName"
                        type="text"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder="e.g. qwen/qwq-32b:free"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end pt-2"
                >
                  {!isLoading ? (
                    <button type="submit" className="btn-primary text-base px-8 py-3.5">
                      Generate Question Paper
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="card p-6 w-full">
                      {/* Loading stages */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[#6C63FF] animate-pulse-subtle" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F5F5F5]">
                            Processing your request
                          </p>
                          <p className="text-xs text-[#71717A]">
                            This may take a moment...
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {generationStages.map((stage, idx) => (
                          <motion.div
                            key={stage}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: idx <= currentStage ? 1 : 0.3,
                              x: 0,
                            }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="flex items-center gap-3 py-1"
                          >
                            {idx < currentStage ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
                            ) : idx === currentStage ? (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#6C63FF] border-t-transparent animate-spin flex-shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-white/[0.08] flex-shrink-0" />
                            )}
                            <span
                              className={`text-xs ${
                                idx <= currentStage
                                  ? "text-[#B0B0B5]"
                                  : "text-[#71717A]/40"
                              }`}
                            >
                              {stage}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isAnimating ? 0 : 1,
              y: isAnimating ? 20 : 0,
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="pt-24 pb-16"
          >
            <div className="mx-auto max-w-[900px] px-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-8">
                <div onClick={handleGoBack} className="mt-1 flex-shrink-0">
                  <ArrowButton />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#F5F5F5] tracking-tight">
                    {isGenerating
                      ? "Generating Your Question Paper..."
                      : "Generated Question Paper"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {questionHeader
                      .split(/[—,|]/)
                      .filter(Boolean)
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-[#B0B0B5]"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    {!isGenerating && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 text-xs text-[#22C55E]">
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                      </span>
                    )}
                    {isGenerating && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-xs text-[#6C63FF]">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Card */}
              <MainMenusGradientCard
                className="px-0 py-0"
                description={questionDescription}
                title={
                  isGenerating
                    ? "Generating Your Question Paper..."
                    : "Generated Question Paper"
                }
              >
                {renderAnimatedContent()}
              </MainMenusGradientCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Page;
