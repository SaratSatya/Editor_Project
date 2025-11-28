import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface EnhancePromptRequest {
  prompt: string
  context?: {
    fileName?: string
    language?: string
    codeContent?: string
  }
}

async function generateAIResponse(messages: ChatMessage[]) {
  const systemPrompt = `You are an expert AI coding assistant...`

  const fullMessages = [{ role: "system", content: systemPrompt }, ...messages]
  const prompt = fullMessages.map((m) => `${m.role}: ${m.content}`).join("\n\n")

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:1b",   // ✅ FIXED
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          repeat_penalty: 1.1,
          num_predict: 1000,     // ✅ FIXED
        },
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const data = await response.json()
    return data.response?.trim()
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

async function enhancePrompt(req: EnhancePromptRequest) {
  const enhancementPrompt = `You are a prompt enhancement assistant...`

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:1b",   // ✅ FIXED
        prompt: enhancementPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 500,     // ✅ FIXED
        },
      }),
    })

    const data = await response.json()
    return data.response?.trim() || req.prompt
  } catch {
    return req.prompt
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.action === "enhance") {
      const enhanced = await enhancePrompt(body)
      return NextResponse.json({ enhancedPrompt: enhanced })
    }

    const { message, history } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 })
    }

    const validHistory = Array.isArray(history)
      ? history.filter(
          (x: any) =>
            x &&
            typeof x === "object" &&
            ["user", "assistant"].includes(x.role)
        )
      : []

    const messages: ChatMessage[] = [
      ...validHistory.slice(-10),
      { role: "user", content: message },
    ]

    const aiResponse = await generateAIResponse(messages)

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "API running",
    timestamp: new Date().toISOString(),
  })
}
