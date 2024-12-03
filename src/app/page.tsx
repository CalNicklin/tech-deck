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

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimations, setCurrentAnimations] = useState<string[]>([]);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: (message) => {
      try {
        const animations = JSON.parse(message.content);
        if (
          Array.isArray(animations) &&
          animations.every((anim) => typeof anim === "string")
        ) {
          setCurrentAnimations(animations);
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1500); // Adjust timing as needed
        } else {
          console.error("Invalid animation format received:", message.content);
        }
      } catch (error) {
        console.error("Error parsing AI response:", error);
      }
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Main content */}
      <div className="flex flex-col flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4">
          You cant beat this H.O.R.S.E.
        </h1>

        {/* Scene */}
        <div className="flex-grow bg-card rounded-lg overflow-hidden border border-border">
          <Scene isAnimating={isAnimating} animations={currentAnimations} />
        </div>

        {/* Animation info */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Current Animation</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnimating ? (
              <p>Running: {currentAnimations.join(", ")}</p>
            ) : (
              <p>No animation running</p>
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
                    <strong>{m.role === "user" ? "You: " : "AI: "}</strong>
                    {m.content}
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
            <Button type="submit">
              Animate
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

