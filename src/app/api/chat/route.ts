import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4'),
    system: `You are a skateboarding coach who breaks down tricks into their basic components. 
You can only use these available animations: 'flip', 'heelFlip', 'shuvit', 'ollie'.

Respond ONLY with a JSON array of strings representing the sequence of animations needed.
For example:
- "do a kickflip" -> ["ollie", "flip"]
- "do a heelflip" -> ["ollie", "heelFlip"]
- "do a pop shuvit" -> ["ollie", "shuvit"]

If you don't know how to break down a trick or it requires unavailable animations, return an empty array [].`,
    messages,
  });

  return result.toDataStreamResponse();
}