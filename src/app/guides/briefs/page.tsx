"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import BackButton from "../../components/BackButton";

export default function BriefsPage() {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    fetch("/api/markdown?file=briefs")
      .then((res) => res.text())
      .then((content) => setMarkdownContent(content))
      .catch((err) => console.error("Error loading markdown:", err));
  }, []);

  return (
    <div className="min-h-screen bg-wise-background-screen py-16 px-6">
      <BackButton href="/" />

      <div className="max-w-4xl mx-auto pt-8">
        <article className="prose prose-lg prose-slate max-w-none
          prose-headings:font-wise
          prose-headings:text-wise-content-primary
          prose-h1:text-5xl
          prose-h1:mb-8
          prose-h1:mt-0
          prose-h2:text-3xl
          prose-h2:mt-12
          prose-h2:mb-4
          prose-h2:font-semibold
          prose-p:text-wise-content-secondary
          prose-p:text-lg
          prose-p:leading-relaxed
          prose-p:mb-6
          prose-strong:text-wise-content-primary
          prose-strong:font-semibold
          prose-em:text-wise-content-tertiary
          prose-em:italic
          prose-hr:border-wise-border-neutral
          prose-hr:my-8
          prose-ul:text-wise-content-secondary
          prose-ol:text-wise-content-secondary
          prose-li:text-wise-content-secondary
          prose-blockquote:border-l-wise-interactive-accent
          prose-blockquote:text-wise-content-secondary
          prose-code:text-wise-content-primary
          prose-code:bg-wise-interactive-neutral-grey
          prose-code:px-1
          prose-code:py-0.5
          prose-code:rounded
          prose-a:text-wise-link-content
          prose-a:no-underline
          hover:prose-a:underline">
          {markdownContent ? (
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-wise-content-tertiary">Loading...</p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
