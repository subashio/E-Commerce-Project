import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Upload,
} from "lucide-react";
import { Toggle } from "../ui/toggle";

export default function ToolBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      preesed: editor.isActive("code"),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive("highlight"),
    },
    {
      icon: <Upload className="size-4" />,
      onClick: () => addImage(),
      preesed: editor.isActive("image"),
    },
    {
      icon: <p>Add table</p>,
      onClick: () =>
        editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
      preesed: editor.isActive("table"),
    },

    {
      icon: <p className="">Row After</p>,
      onClick: () => editor.chain().focus().addRowAfter().run(),
      preesed: false,
    },
    {
      icon: <p>Row Before</p>,
      onClick: () => editor.chain().focus().addRowBefore().run(),
      preesed: false,
    },
    {
      icon: <p className="">Delete Row</p>,
      onClick: () => editor.chain().focus().deleteRow().run(),
      preesed: false,
    },
    {
      icon: <p className="">Delete Column</p>,
      onClick: () => editor.chain().focus().deleteColumn().run(),
      preesed: false,
    },
    {
      icon: <p className="">Delete Table</p>,
      onClick: () => editor.chain().focus().deleteTable().run(),
      preesed: false,
    },
    {
      icon: <p className="">Highlight cell</p>,
      onClick: () => editor.chain().focus().toggleHeaderCell().run(),
      preesed: false,
    },
  ];

  return (
    <div className="mb-1 space-x-1 rounded-lg border p-1.5">
      {Options.map((option, i) => (
        <Toggle
          key={i}
          size="sm"
          className="data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
