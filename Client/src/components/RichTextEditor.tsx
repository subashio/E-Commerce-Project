import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ImageResize from "tiptap-extension-resize-image";
import ToolBar from "./ui/ToolBar";
import HardBreak from "@tiptap/extension-hard-break";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: any) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        hardBreak: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            "Mod-Enter": () => this.editor.commands.setHardBreak(),
            "Shift-Enter": () => this.editor.commands.setHardBreak(),
          };
        },
      }),
      Highlight,
      Image,
      ImageResize,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md  py-2 px-3",
      },
    },

    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent
        style={{ whiteSpace: "pre-wrap" }}
        placeholder="Tell a little bit about your product"
        editor={editor}
      />
    </div>
  );
}
