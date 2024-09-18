// %% Load env
import "jsr:@std/dotenv/load";
// %% import OpenAI
import OpenAI from "https://deno.land/x/openai@v4.56.0/mod.ts";
const client = new OpenAI();

const outlinePrompt = (theme: string, tone: string) => `
  # Blog Post Outline Generator

  Create a detailed outline for a blog post about ${theme} with a ${tone} tone. The outline should include:

  1. An attention-grabbing title
  2. Introduction (2-3 key points)
  3. Main body (4-6 sections with subpoints)
  4. Conclusion (2-3 key takeaways)
  5. Call-to-action

  For each section, provide brief descriptions of the content to be included. Ensure the outline flows logically and covers the topic comprehensively.

  Additional requirements:
  - Incorporate relevant statistics or data points (indicate where these should be researched)
  - Suggest areas where examples or case studies could be included
  - Identify potential keywords for SEO optimization
  - Propose ideas for visual elements (e.g., infographics, images) that could enhance the post

  Remember to maintain a ${tone} tone throughout the outline.

  To write the contents of ${theme}, the following types of information will be required:

  1. Background information on ${theme}
  2. Current trends or developments related to ${theme}
  3. Expert opinions or quotes on ${theme}
  4. Statistical data or research findings about ${theme}
  5. Real-world examples or case studies illustrating aspects of ${theme}
  6. Common misconceptions or challenges associated with ${theme}
  7. Best practices or tips related to ${theme}
  8. Future predictions or potential impacts of ${theme}
  9. Relevant laws, regulations, or industry standards (if applicable)
  10. Comparisons or contrasts with related topics or alternative approaches

  Please generate an outline based on these guidelines.
  `;

// %% ブログのアウトラインを作る
await client.chat.completions.create({
  messages: [
    {
      role: "user",
      content: outlinePrompt(
        '"Saionjisanha kajioshinai(Japanese TV Drama)" is good for a person who is chalenging the complicated objectives',
        "friendry",
      ),
    },
  ],
  model: "gpt-4o-mini",
});
// %% 今日の天気を確認する2
await client.chat.completions.create({
  messages: [
    // NEW MESSAGE
    {
      role: "system",
      content:
        "あなたは親切なアシスタントです。必要であれば以下の情報を使ってユーザーの質問に回答してください。今日の天気: 晴れ",
    },
    // こちらは前と同じ
    { role: "user", content: "今日の天気はなんですか？" },
  ],
  model: "gpt-4o-mini",
});

// %% 今日の天気を確認する3
await client.chat.completions.create({
  messages: [
    {
      role: "system",
      content: `あなたは親切なアシスタントです。必要であれば<context>の情報を使ってユーザーの質問に回答してください。なお、情報の提示の方法は<template>に従ってください。

        <context>
        今日の天気: 晴れ
        </context>

        <template>
        - 季節の挨拶
        - 天気の情報
        - おすすめのご飯
        </template>

        `,
    },
    { role: "user", content: "今日の天気はなんですか？" },
  ],
  model: "gpt-4o-mini",
});
// %% この仕組みを他の質問でも適用できるようにする
async function textGenerationWithContext(query: string, context: string) {
  return await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `あなたは親切なアシスタントです。必要であれば<天気情報>の情報を使ってユーザーの質問に回答してください。

          <天気情報>
          ${context}
          </天気情報>`,
      },
      { role: "user", content: query },
    ],
    model: "gpt-4o-mini",
  });
}
await textGenerationWithContext("今日の天気は？", "今日の天気: 晴れ");

// %% 天気をAPIで取得するようにする
function getWeather() {
  const weatherConditions = [
    "今日の天気: 晴れ",
    "今日の天気: 曇り",
    "今日の天気: 雨",
  ];
  return weatherConditions[
    Math.floor(Math.random() * weatherConditions.length)
  ];
}

await textGenerationWithContext("今日の天気は？", getWeather());
