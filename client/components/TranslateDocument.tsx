"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import * as Y from "yjs";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BotIcon } from "lucide-react";
import { toast } from "sonner";

type Language =
  | "english"
  | "spanish"
  | "portuguese"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "bengali"
  | "russian"
  | "japanese";

const languages: Language[] = [
  "english",
  "spanish",
  "portuguese",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "bengali",
  "russian",
  "japanese",
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [language, setLanguage] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const blockNoteDoc = doc.get("document-store").toJSON();

      // Parse the string as XML/HTML

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(blockNoteDoc, "text/xml");
      const textTags = xmlDoc.querySelectorAll(
        "heading, paragraph, bulletlistitem"
      );

      let plainText = "";

      textTags.forEach((node) => {
        const content = node.textContent ? node.textContent.trim() : "";
        if (content) {
          plainText += content + "\n"; // add line break after each block
        }
      });
      const documentData = plainText.trim();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );

      if (res.ok) {
        const resp = await res.json();

        setSummary(JSON.parse(resp).translated_text);
        toast.success("Translation successful!");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" asChild>
        <DialogTrigger>Translate </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate a summary of the document</DialogTitle>
          <DialogDescription>
            Select a language to translate the document summary into.
          </DialogDescription>

          <hr className="mt-5" />
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0/>" />
              <p className="font-bold">
                GPT {isPending ? "is thinking..." : "Says:"}
              </p>
            </div>
            <p>{summary}</p>
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="flex gap-2 items-center">
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang, idx) => (
                <SelectItem key={lang + idx} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default TranslateDocument;
