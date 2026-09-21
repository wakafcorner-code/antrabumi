"use client";

import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";

// ─── Toolbar Button ───────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active = false, disabled = false, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={[
        "flex h-7 w-7 items-center justify-center rounded text-xs transition-colors focus-visible:outline-2 focus-visible:outline-neutral-500",
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  /** Hidden input name — the HTML content is submitted via this field */
  name: string;
  /** Initial HTML value */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Optional character limit */
  limit?: number;
  /** CSS class added to outer wrapper */
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  defaultValue = "",
  placeholder = "Tulis konten di sini…",
  limit,
  className,
}) => {
  const hiddenRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: { languageClassPrefix: "language-" },
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Typography,
      ...(limit ? [CharacterCount.configure({ limit })] : []),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-neutral max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-neutral-800",
        "data-testid": `rte-${name}`,
      },
    },
    onUpdate({ editor }) {
      if (hiddenRef.current) {
        hiddenRef.current.value = editor.getHTML();
      }
    },
  });

  // Sync hidden field on mount
  useEffect(() => {
    if (editor && hiddenRef.current) {
      hiddenRef.current.value = editor.getHTML();
    }
  }, [editor]);

  if (!editor) return null;

  const charCount = limit ? editor.storage?.characterCount?.characters?.() : null;

  return (
    <div className={["rounded-md border border-neutral-200 bg-white shadow-sm", className].join(" ")}>
      {/* Hidden input carries the HTML value on form submit */}
      <input type="hidden" name={name} ref={hiddenRef} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-100 px-2 py-1.5">
        {/* Marks */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton
          title="Code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <span className="font-mono">{"</>"}</span>
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-neutral-200" aria-hidden="true" />

        {/* Headings */}
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-neutral-200" aria-hidden="true" />

        {/* Lists */}
        <ToolbarButton
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M4 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm3 1a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 7 5zm0 5a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 7 10zm0 5a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 7 15zm-3-6a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M4 2a.75.75 0 0 1 .75.75V5h.5a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.5V3.5L2.5 4a.75.75 0 1 1-.5-1.414l1.5-.5A.75.75 0 0 1 4 2zm-1.6 7.586A.75.75 0 0 1 3 9h1.5a.75.75 0 0 1 .593 1.207l-.783.982h.19a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.593-1.207l.783-.982H2.5a.75.75 0 0 1-.1-1.414zM7 5a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 7 5zm0 5a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 7 10zm0 5a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 7 15z" clipRule="evenodd"/>
          </svg>
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-neutral-200" aria-hidden="true" />

        {/* Block */}
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M4.677 5.588A3.5 3.5 0 0 1 6 5c.978 0 1.87.38 2.53 1 .09.086.174.179.252.278L8 7.188A2.5 2.5 0 0 0 6 6.5a2.5 2.5 0 0 0-2.5 2.5v.5h.5a.5.5 0 0 1 0 1H3A.5.5 0 0 1 2.5 10V9a3.5 3.5 0 0 1 2.177-3.412zM10.677 5.588A3.5 3.5 0 0 1 12 5c.978 0 1.87.38 2.53 1 .09.086.174.179.252.278L14 7.188A2.5 2.5 0 0 0 12 6.5a2.5 2.5 0 0 0-2.5 2.5v.5h.5a.5.5 0 0 1 0 1H9A.5.5 0 0 1 8.5 10V9a3.5 3.5 0 0 1 2.177-3.412z"/>
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Code Block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <span className="font-mono text-[10px]">{`{ }`}</span>
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-neutral-200" aria-hidden="true" />

        {/* History */}
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 0 1-.025 1.06L6.053 5h6.447a4.5 4.5 0 0 1 0 9H9a.75.75 0 0 1 0-1.5h3.5a3 3 0 0 0 0-6H6.053l1.715 1.708a.75.75 0 0 1-1.06 1.06l-3-2.998a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.085.022z" clipRule="evenodd"/>
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M12.207 2.232a.75.75 0 0 0 .025 1.06L13.975 5H7.5a4.5 4.5 0 0 0 0 9H11a.75.75 0 0 0 0-1.5H7.5a3 3 0 0 1 0-6h6.475l-1.715 1.708a.75.75 0 1 0 1.06 1.06l3-2.998a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.113.022z" clipRule="evenodd"/>
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor Canvas */}
      <EditorContent editor={editor} />

      {/* Character Count */}
      {limit && charCount !== null && (
        <div
          className={[
            "flex justify-end border-t border-neutral-50 px-3 py-1.5 text-xs",
            charCount > limit * 0.9 ? "text-amber-600" : "text-neutral-400",
          ].join(" ")}
        >
          {charCount.toLocaleString()}/{limit.toLocaleString()} karakter
        </div>
      )}
    </div>
  );
};
