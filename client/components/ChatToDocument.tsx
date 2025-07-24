"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BotIcon, MessageCircleCode } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import * as Y from "yjs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Markdown from "react-markdown";

function ChatToDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    setQuestion(input);

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: input,
            documentData,
          }),
        }
      );

      

      if (res.ok) {
        const response = await res.json();

        setSummary(response.message);
        setInput("");
      } else {
        console.error("Failed to get response from AI");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" asChild>
        <DialogTrigger>
          <MessageCircleCode className="mr-2" />
          Ask AI
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to document!</DialogTitle>
          <DialogDescription>
            Ask a question about the document, and AI will respond.
          </DialogDescription>

          <hr className="my-4" />
          {question && (
            <p className="text-gray-500 text-center">Q: {question}</p>
          )}
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0/>" />
              <p className="font-bold">
                GPT {isPending ? "is thinking..." : "Says:"}
              </p>
            </div>
            <Markdown>{summary}</Markdown>
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="i.e. What is this about?"
            className="w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button type="submit" disabled={!input || isPending}>
            {isPending ? "AI Thinking..." : "Ask "}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default ChatToDocument;
