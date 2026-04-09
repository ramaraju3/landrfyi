"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "../../lib/supabase";

const ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

async function extractTextFromFile(file) {
  if (file.type === "application/pdf") {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text.trim();
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  }

  return null; // images — no text extraction
}

function fileIcon(file) {
  if (!file) return "📄";
  if (file.type.startsWith("image/")) return "🖼️";
  if (file.type === "application/pdf") return "📕";
  return "📝";
}

export default function Submit() {
  const [mode, setMode] = useState("upload"); // "upload" | "paste"
  const [form, setForm] = useState({
    role: "",
    company_tier: "",
    industry: "",
    years_of_experience: "",
    year_hired: "",
  });
  const [pasteText, setPasteText] = useState("");

  // Upload state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [fileError, setFileError] = useState("");
  const [displayMode, setDisplayMode] = useState("text"); // "text" | "file"
  const [dragOver, setDragOver] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const clearFile = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setExtractedText("");
    setFileError("");
    setDisplayMode("text");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]);

  const handleFile = useCallback(async (selected) => {
    setFileError("");
    if (!ACCEPTED_MIME_TYPES.has(selected.type)) {
      setFileError("Unsupported file type. Please upload a PDF, Word doc (.docx), or image.");
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setFileError("File too large. Maximum size is 10 MB.");
      return;
    }

    setFile(selected);
    setExtractedText("");

    if (selected.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selected));
      setDisplayMode("file");
      return;
    }

    setExtracting(true);
    try {
      const text = await extractTextFromFile(selected);
      if (text) {
        setExtractedText(text);
        setDisplayMode("text");
      } else {
        setFileError("Could not extract text. The file will be saved as-is.");
        setDisplayMode("file");
      }
    } catch {
      setFileError("Extraction failed. The file will be saved as-is.");
      setDisplayMode("file");
    } finally {
      setExtracting(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const isImage = file?.type.startsWith("image/");
  const activeText = mode === "paste" ? pasteText : extractedText;
  const overLimit = activeText.length > 5000;
  const underMin = activeText.length < 200;

  const lengthLabel = () => {
    if (underMin)
      return `Minimum 200 characters (${200 - activeText.length} more needed)`;
    if (overLimit)
      return `Too long — reduce by ${activeText.length - 5000} characters`;
    if (activeText.length < 1000) return "✓ Good";
    if (activeText.length < 2500) return "✓ Great";
    return "✓ Perfect";
  };

  const lengthColor = underMin
    ? "text-red-400"
    : overLimit
    ? "text-red-500 font-medium"
    : "text-green-600";

  const isSubmitDisabled =
    loading ||
    extracting ||
    (mode === "upload" && !file) ||
    (mode === "upload" && !isImage && overLimit) ||
    (mode === "paste" && (underMin || overLimit));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "paste" && underMin) {
      alert("Please add more detail — minimum 200 characters.");
      return;
    }
    setLoading(true);

    let fileUrl = null;

    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filename, file, { contentType: file.type });

      if (uploadError) {
        alert("File upload failed. Please try again.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filename);
      fileUrl = urlData.publicUrl;
    }

    const resume_text = isImage
      ? "[See attached file]"
      : mode === "upload"
      ? extractedText
      : pasteText;

    const { error } = await supabase.from("resumes").insert([
      {
        ...form,
        resume_text,
        file_url: fileUrl,
        display_mode: fileUrl ? displayMode : "text",
        years_of_experience: parseInt(form.years_of_experience),
        year_hired: parseInt(form.year_hired),
      },
    ]);

    if (!error) setSubmitted(true);
    else alert("Something went wrong, please try again.");

    setLoading(false);
  };

  // ─── Shared meta fields ───────────────────────────────────────────────────

  const metaFields = (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Role Title</label>
        <input
          type="text"
          name="role"
          required
          placeholder="e.g. Senior Product Manager"
          value={form.role}
          onChange={handleChange}
          className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company Tier</label>
        <select
          name="company_tier"
          required
          value={form.company_tier}
          onChange={handleChange}
          className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">Select company tier</option>
          <option value="FAANG">FAANG</option>
          <option value="Big Tech">Big Tech</option>
          <option value="Startup">Startup</option>
          <option value="Consulting">Consulting</option>
          <option value="Finance">Finance</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Industry</label>
        <select
          name="industry"
          required
          value={form.industry}
          onChange={handleChange}
          className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">Select industry</option>
          <option value="Tech">Tech</option>
          <option value="Finance">Finance</option>
          <option value="Consulting">Consulting</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            name="years_of_experience"
            required
            min="0"
            max="40"
            placeholder="e.g. 6"
            value={form.years_of_experience}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Year Hired</label>
          <input
            type="number"
            name="year_hired"
            required
            min="2015"
            max="2026"
            placeholder="e.g. 2024"
            value={form.year_hired}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>
    </>
  );

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b">
        <a href="/" className="text-2xl font-bold text-indigo-600">
          landr.fyi
        </a>
        <a
          href="/browse"
          className="text-sm text-gray-500 hover:text-indigo-600 transition"
        >
          Browse Resumes
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Share Your Resume</h1>
        <p className="text-gray-500 mb-10">
          You landed the job — help others do the same. Remove your name,
          contact info, and any identifying details before submitting.
        </p>

        {submitted ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">
              Thank you for contributing!
            </h2>
            <p className="text-gray-500 mb-6">
              Your resume will help others land their dream job.
            </p>
            <a
              href="/browse"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
            >
              Browse Resumes
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {metaFields}

            {/* ── Resume section ── */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Anonymized Resume
              </label>

              {/* Mode toggle */}
              <div className="flex border rounded-xl overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  className={`flex-1 py-2.5 text-sm font-medium transition ${
                    mode === "upload"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setMode("paste")}
                  className={`flex-1 py-2.5 text-sm font-medium transition ${
                    mode === "paste"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Paste Text
                </button>
              </div>

              {/* ── Upload mode ── */}
              {mode === "upload" && (
                <div>
                  {!file ? (
                    <>
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition select-none ${
                          dragOver
                            ? "border-indigo-400 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-4xl mb-3">📄</div>
                        <p className="text-sm font-medium text-gray-700">
                          Drop your resume here or{" "}
                          <span className="text-indigo-600">click to browse</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5">
                          PDF, Word (.docx), PNG, JPG — up to 10 MB
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.png,.jpg,.jpeg,.webp"
                        onChange={(e) =>
                          e.target.files[0] && handleFile(e.target.files[0])
                        }
                      />
                      {fileError && (
                        <p className="text-sm text-red-500 mt-2">{fileError}</p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* File chip */}
                      <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
                        <span className="text-xl">{fileIcon(file)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={clearFile}
                          className="text-xs text-gray-400 hover:text-red-500 transition"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Image preview */}
                      {isImage && previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Resume preview"
                          className="w-full rounded-xl border max-h-72 object-contain bg-gray-50"
                        />
                      )}

                      {/* Extracting spinner */}
                      {extracting && (
                        <p className="text-sm text-gray-400 text-center py-2">
                          Extracting text…
                        </p>
                      )}

                      {/* fileError after extraction */}
                      {!extracting && fileError && (
                        <p className="text-sm text-orange-500">{fileError}</p>
                      )}

                      {/* Extracted text (editable) */}
                      {!extracting && !isImage && extractedText && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1.5">
                            Extracted text — you can edit before submitting
                          </p>
                          <textarea
                            rows={10}
                            value={extractedText}
                            onChange={(e) => setExtractedText(e.target.value)}
                            className={`w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 resize-none text-sm ${
                              overLimit
                                ? "border-red-400 focus:ring-red-300"
                                : "focus:ring-indigo-300"
                            }`}
                          />
                          <div className="flex justify-between text-xs mt-1">
                            <span className={lengthColor}>{lengthLabel()}</span>
                            <span
                              className={
                                overLimit
                                  ? "text-red-500 font-medium"
                                  : "text-gray-400"
                              }
                            >
                              {extractedText.length} / 5000
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Display preference */}
                      {file && (
                        <div>
                          <label className="block text-sm font-medium mb-2">How should this be displayed?</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setDisplayMode("file")}
                              disabled={file && file.type !== "application/pdf" && !file.type.startsWith("image/")}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                displayMode === "file" ? "bg-indigo-600 text-white" :
                                file && file.type !== "application/pdf" && !file.type.startsWith("image/") ? "border text-gray-300 cursor-not-allowed" :
                                "border text-gray-500 hover:border-indigo-300"
                              }`}
                            >
                              📄 Show original file
                            </button>
                            <button
                              type="button"
                              onClick={() => setDisplayMode("text")}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition ${displayMode === "text" ? "bg-indigo-600 text-white" : "border text-gray-500 hover:border-indigo-300"}`}
                            >
                              📝 Show as text only
                            </button>
                          </div>
                          {file && file.type !== "application/pdf" && !file.type.startsWith("image/") && (
                            <p className="text-yellow-500 text-xs mt-2">⚠️ Word files can't be previewed in browser — showing as text only. Convert to PDF if you want to show the original layout.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Paste mode ── */}
              {mode === "paste" && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">
                    Remove your name, email, phone, LinkedIn, company names, and
                    any identifying details before pasting.
                  </p>
                  <textarea
                    name="resume_text"
                    required
                    rows={12}
                    placeholder="Paste your anonymized resume here..."
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    className={`w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 resize-none ${
                      overLimit
                        ? "border-red-400 focus:ring-red-300"
                        : "focus:ring-indigo-300"
                    }`}
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className={lengthColor}>{lengthLabel()}</span>
                    <span
                      className={
                        overLimit ? "text-red-500 font-medium" : "text-gray-400"
                      }
                    >
                      {pasteText.length} / 5000
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="bg-indigo-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting…" : "Submit Resume"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
