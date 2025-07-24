import OpenAI from 'openai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
	OPEN_AI_KEY: string;
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'/*',
	cors({
		origin: '*',
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
		allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
		exposeHeaders: ['X-Kuma-Revision', 'Content-Length'],
		maxAge: 600,
		credentials: true,
	})
);
app.get('/', (c) => c.text('Hello World!'));

app.post('/chatToDocument', async (c) => {

	// Need to set up OpenAI with your API key to env variable
	const openai = new OpenAI({
		apiKey: c.env.OPEN_AI_KEY,
	});

	const { documentData, question } = await c.req.json();

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content:
					' You are a assistant helping the user to chat to a document, I am providing a JSON file of the document. Using this, answer the users question in the clearest way possible, and give markdown in response with batter style. The document is about' +
					documentData,
			},
			{
				role: 'user',
				content: 'question is: ' + question,
			},
		],
		model: "gpt-4o-mini",
		temperature: 0.5,
		
	});

	const response = chatCompletion.choices[0].message.content;

	return c.json({ message: response });
});

app.post('/translateDocument', async (c) => {
	const { documentData, targetLang } = await c.req.json();

	// Generate a summary of the document
	const summaryResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
		min_length: 300,
	});

	// Translate the summary to the target language
	const response = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summaryResponse.summary,
		source_lang: 'english',
		target_lang: targetLang,
	});

	return new Response(JSON.stringify(JSON.stringify(response)));
});

export default app;
