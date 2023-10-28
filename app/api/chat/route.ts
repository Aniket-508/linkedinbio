import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { industry, jobTitle, skills, achievements, objectives } =
    await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    stream: true,
    messages: [
      {
        role: "user",
        content: `As a proficient personal branding specialist, create an engaging LinkedIn bio for me, taking into account these essential elements:

        * Industry or Field: ${industry}
        * Job Title: ${jobTitle}
        * Primary Skills: ${skills}
        * Significant Experiences: ${achievements}
        * Aims: ${objectives}
        
        Task Guidelines:
        
        1. Grasp the industry, main skills, prominent experiences, and objectives.
        2. Compose a succinct and captivating LinkedIn bio that displays your distinct value proposition.
        3. Begin with a powerful introductory statement: Utilize the initial sentence to capture the reader's interest and emphasize your primary skills and expertise.
        4. Emphasize your main skills and experiences, establishing yourself as a specialist in your area.
        5. Make sure the bio is consistent with your professional objectives and appeals to your target audience.
        6. Integrate industry and skill-related keywords to enhance your profile's discoverability in search results.
        7. Maintain conciseness: Limit your bio to 3-4 paragraphs, concentrating on the most relevant information and omitting unnecessary specifics.
        8. Incorporate a personal aspect: Share information about your hobbies, interests, or volunteer work to present a more comprehensive view of yourself. Use these details for this purpose: [Provide a list of hobbies and interests]
        9. Optimize the bio for readability, professionalism, and personal brand enhancement.
        
        Deliverable:
        
        Supply an engaging LinkedIn bio that is customized to your chosen industry, primary skills, significant experiences, and objectives. The bio should highlight your unique value proposition and establish you as an expert in your field, optimized for readability, professionalism, and personal brand development. Present the content in markdown format.`,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
