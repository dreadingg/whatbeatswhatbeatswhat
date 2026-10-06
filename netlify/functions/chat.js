export default async (req, context) => {
  try {
    const { previous, guess } = await req.json();
    const apiKey = Netlify.env.get("DEEPSEEK_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: 'You are a strict judge for a game called "What Beats Rock". Reply with ONLY the word "yes" or "no". No punctuation. No explanation.'
          },
          {
            role: "user",
            content: `Current item: "${previous}". Player suggests: "${guess}". Does "${guess}" logically, creatively, or humorously beat "${previous}"?`
          }
        ],
        temperature: 0.7,
        max_tokens: 5
      })
    });

    const data = await response.json();
    const answer = data.choices[0].message.content.trim().toLowerCase();

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
