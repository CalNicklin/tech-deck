"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import Scene from "./components/scene";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIResponse {
  animations: string[];
  response: string;
}

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimations, setCurrentAnimations] = useState<string[]>([]);
  const [lastRunAnimations, setLastRunAnimations] = useState<string[]>([]);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: (message) => {
      try {
        const parsedResponse: AIResponse = JSON.parse(message.content);

        if (
          parsedResponse.animations &&
          Array.isArray(parsedResponse.animations) &&
          parsedResponse.animations.every((anim) => typeof anim === "string")
        ) {
          setCurrentAnimations(parsedResponse.animations);
          setLastRunAnimations(parsedResponse.animations);
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1500);
        }
      } catch (error) {
        console.error("Error parsing AI response:", error, message.content);
      }
    },
  });

  const renderMessage = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return parsed.response;
    } catch {
      return content;
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const replayLastTrick = () => {
    if (lastRunAnimations.length > 0) {
      setCurrentAnimations(lastRunAnimations);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1500);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Main content */}
      <div className="flex flex-col flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4">
          You can't beat this H.O.R.S.E.
        </h1>

        {/* Scene */}
        <div className="flex-grow bg-card rounded-lg overflow-hidden border border-border">
          <Scene isAnimating={isAnimating} animations={currentAnimations} />
        </div>

        {/* Last Run Animation */}
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Last Run Animation</CardTitle>
            <Button onClick={replayLastTrick} disabled={lastRunAnimations.length === 0}>
              Replay
            </Button>
          </CardHeader>
          <CardContent>
            {lastRunAnimations.length > 0 ? (
              <p>Steps: {lastRunAnimations.join(" → ")}</p>
            ) : (
              <p>No animations run yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat side panel */}
      <Card className="w-96 border-l border-border rounded-none">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <div className="space-y-4">
              {messages
                .filter((m) => m.role !== "system")
                .map((m) => (
                  <div key={m.id} className="p-4 rounded-lg bg-muted">
                    <strong>{m.role === "user" ? "You: " : "Coach: "}</strong>
                    {renderMessage(m.content)}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={onSubmit} className="flex w-full space-x-2">
            <Input
              className="flex-grow"
              placeholder="Describe a skateboard trick..."
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit">Animate</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

