"use client";

import { useState, useRef, useEffect } from "react";

export default function ShareButton({ url, title }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const fullUrl = `https://landr.fyi${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleOpen = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 192, // 192px = w-48
      });
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.closest("[data-share]")?.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  return (
    <div className="relative" data-share onClick={(e) => e.stopPropagation()} style={{ zIndex: 9999 }}>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition"
      >
        🔗 Share
      </button>

      {open && (
        <div
          className="fixed w-48 bg-white border rounded-2xl shadow-lg overflow-visible"
          style={{ top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
        >
          <button
            onClick={copyLink}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition flex items-center gap-2"
          >
            {copied ? "✅ Copied!" : "🔗 Copy link"}
          </button>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
          >
            💼 LinkedIn
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
          >
            𝕏 X (Twitter)
          </a>

          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
          >
            💬 WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
