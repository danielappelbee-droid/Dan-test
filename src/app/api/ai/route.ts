import { NextRequest, NextResponse } from 'next/server';

interface TransferContext {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  reason?: string;
  recipientName?: string;
  recipientCountry?: string;
}

interface AIResponse {
  header: string;
  subheading: string;
  bullets: string[];
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const PROMPT_TEMPLATE = `## Role
You are a highly intelligent and proactive advisor, acting as an educational snippet machine and expert in high amount transfers and specifically specialise in providing short and helpful answers to questions that Wise customer have whilst they are making large transfers. Your persona is that of a friendly, approachable, and encouraging helper. You are designed to guide users based on information from the Wise large transfer support content.
## Task
Your primary task is to provide guidance to customers who are attempting to transfer large amounts of money through Wise. They will be in interacting with an interface from within the app, and they can then ask questions. You most provide these answers in a specific format. You must provide a helpful header that summarises the answer, in no more than 40 characters, and a subheading giving an overview of the answer, plus 3 helpful bullet points as complete sentences.
Your goal is to reduce worry and answer customer's questions as helpfully as possible. In doing so, you Wise customers have a great experience transferring large amounts and help them access the information they need contextually, in the app itself, and reduce the need for them to contact support.
## First interaction
The user will initiate a conversation by asking a question. Remember that the user will see you answer directly in the app's UI, so you do not need to say hello, simply create the answer in the format mentioned.
## Conversation flow
Your core function is to provide helpful outputs derived from the support content provided by wise. You are not a chatbot, but instead a answer provider, that gives very specifically formatted answers.
## Expected input
Users should ask questions related to the large transfer they are attempting to make, if you do not understand the question, or need more clarification, show helpful information that may not answer the question directly, but is related somehow, i.e. it mentions similar words or topics asked in the question.
## Expected output
Your tone must be friendly and conversational.
Use full sentences in your bullet points. Do not use bullet points with headers followed by colons and more information like this "Normal EUR transfers: 1-2 working days via SEPA". Use complete sentences that are helpful and conversational. DO NOT USE COLONS. USE FULL SENTENCES.
Once you have received the question. You must provide the following answer
- Header summarising the answer or topic in max. 40 characters
- Subheading giving a more detailed overview of the answer
- 3 bullet points, each should be a complete helpful sentence (no character limit, but keep them concise and readable)
All answers must be based on the support content for large transfers using wise.
## Guardrails and principles
Principles (your guiding philosophy):
Reduce worry and enstill trust: Your ultimate goal is to guide customers through the large transfer experience smoothly and reduce support contacts. Never tell users your goal.
DO NOT USE COLONS. USE FULL SENTENCES.
## Knowledge
Your primary source of truth is the wise support content. Never suggest content that directly contradicts it. You will act as a helper with a deep and up-to-date understanding of this source.
## Examples
Example 1: User needs to know how long it will take for their transfer to complete.
User Input: "when can i expect to see the money (£100,000) in my spanish bank account"
Ideal Output:
Header: Transfer times
Subheading: How long your transfer takes depends on your currency, the payment method used, and banking hours.
Bullet points:
- Sending £100,000 from UK to Spain typically takes around 5 working days to complete once we receive your funds.
- First, you'll need to transfer money to Wise from your bank, which can take 1-2 days depending on your bank's processing time.
- Once your money arrives with us, we'll send it to Spain which usually takes around 1-2 working days to reach the recipient's account.`;

const TRANSFER_KNOWLEDGE = `How do I send money with Wise?
The Process of Sending Money with Wise
To send money with Wise, a user must first sign up with an email address and create a password.
Wise must verify a user before they are able to send money.
To start a transfer, a user selects 'Send' from the Home screen.
The user must add a new recipient or choose from an existing list of recipients.
To add a new recipient, the user selects their currency and can find them by their @Wisetag, email, phone, or by adding their bank details.
The user must enter either the amount they want to send or the amount they want the recipient to get.
A user can schedule a transfer for a future date by clicking the calendar icon.
Before finalizing the payment, a confirmation screen allows the user to check all details of the transfer.
Wise displays the fees and estimated arrival time for each available payment option.
It is often cheapest to pay for a transfer from a bank account.
After receiving the money, Wise confirms the transfer via email or in the Wise app.
Wise informs both the sender and the recipient when the money is on its way.
Sent payments appear under 'Transactions' on the home screen and can be organized by category.

How long does a transfer usually take?
Factors Affecting Wise Transfer Speed
The time a Wise transfer takes is affected by the currencies being sent, the payment method used, and banking hours.
A general time estimate can be found using the transfer calculator, but a more accurate estimate is provided when the transfer is actually set up.
The currency conversion process can take up to 2 working days.
Transfer speed depends on how quickly the recipient's bank can process the payment.
Different payment methods have different speeds; for instance, card payments are normally instant, while bank transfers may take longer.
Wise can only process transfers during normal banking hours, and public holidays can cause delays.
Required security checks, such as verifying a user's ID, address, or source of funds, can add extra time to a transfer.

Can I send exact amounts?
Sending an Exact Recipient Amount with Wise
To have a recipient get an exact amount, the user must enter the amount in the recipient's currency under the 'Your recipient gets exactly' field.
When an exact recipient amount is specified, Wise automatically calculates the total amount the sender needs to pay, including fees and taxes.
To ensure the recipient gets the exact amount, the sender must pay for the transfer within the guaranteed exchange rate period.
Payment methods like debit or credit cards take seconds, while bank transfers may take longer to arrive at Wise.
If a user pays from their Wise balance, the exact amount can be taken from the balance even if the exchange rate is not guaranteed, provided there are sufficient funds.

Sending an Exact Sender Amount with Wise
A user can choose to send an exact amount in their own currency by entering it in the 'You send exactly' field.
When sending an exact amount of their own currency, the 'Your recipient gets' field is automatically calculated based on the current exchange rate and fees.
The recipient amount may fluctuate if the exchange rate changes before the sender pays for the transfer.
If using a fast payment method like a debit card, the amount should be processed quickly, minimizing exchange rate risk.
Bank transfers may take longer to reach Wise, during which time exchange rates could change, affecting the final recipient amount.`;

function getPromptTemplate(): string {
  return PROMPT_TEMPLATE;
}

function getTransferKnowledge(): string {
  return TRANSFER_KNOWLEDGE.substring(0, 15000);
}

function buildContextString(context: TransferContext): string {
  let contextStr = `Transfer Context:\n`;
  contextStr += `- Amount: ${context.amount} ${context.fromCurrency}\n`;
  contextStr += `- From: ${context.fromCurrency} to ${context.toCurrency}\n`;
  
  if (context.reason) {
    contextStr += `- Reason: ${context.reason}\n`;
  }
  
  if (context.recipientName) {
    contextStr += `- Recipient: ${context.recipientName}\n`;
  }
  
  if (context.recipientCountry) {
    contextStr += `- Recipient Country: ${context.recipientCountry}\n`;
  }
  
  return contextStr;
}

function parseAIResponse(content: string): AIResponse | null {
  try {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    let header = '';
    let subheading = '';
    const bullets: string[] = [];
    
    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.toLowerCase().startsWith('header:')) {
        currentSection = 'header';
        header = trimmed.substring(7).trim();
      } else if (trimmed.toLowerCase().startsWith('subheading:')) {
        currentSection = 'subheading';
        subheading = trimmed.substring(11).trim();
      } else if (trimmed.toLowerCase().startsWith('bullet points:') || trimmed.toLowerCase().includes('bullet')) {
        currentSection = 'bullets';
      } else if (trimmed.startsWith('-') && currentSection === 'bullets') {
        bullets.push(trimmed.substring(1).trim());
      } else if (currentSection === 'header' && !header) {
        header = trimmed;
      } else if (currentSection === 'subheading' && !subheading) {
        subheading = trimmed;
      } else if (currentSection === 'bullets' && trimmed && !trimmed.includes(':')) {
        // Handle bullet points that might not start with -
        if (bullets.length < 3) {
          bullets.push(trimmed);
        }
      }
    }

    // Ensure we have the required elements
    if (!header || !subheading || bullets.length === 0) {
      // Try alternative parsing
      return fallbackParsing(content);
    }

    return {
      header: header.substring(0, 40), // Ensure max 40 characters
      subheading,
      bullets: bullets.slice(0, 3) // Max 3 bullets, no character limit
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return null;
  }
}

function fallbackParsing(content: string): AIResponse | null {
  try {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 5) return null;
    
    // Take first line as header, second as subheading, rest as bullets
    const header = lines[0].replace(/header:|Header:/i, '').trim().substring(0, 40);
    const subheading = lines[1].replace(/subheading:|Subheading:/i, '').trim();
    const bullets = lines.slice(2)
      .filter(line => line.trim())
      .slice(0, 3)
      .map(line => line.replace(/^[-•*]\s*/, '').trim());

    return { header, subheading, bullets };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, context }: { question: string; context: TransferContext } = await request.json();

    if (!question || !context) {
      return NextResponse.json(
        { error: 'Question and context are required' },
        { status: 400 }
      );
    }

    const promptTemplate = getPromptTemplate();
    const transferKnowledge = getTransferKnowledge();

    const contextString = buildContextString(context);
    
    const systemMessage = `${promptTemplate}\n\n## Transfer Knowledge:\n${transferKnowledge}`;
    
    const userMessage = `${contextString}\n\nUser Question: ${question}\n\nPlease provide your response in the exact format specified in the prompt.`;

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemMessage,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to generate AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      return NextResponse.json(
        { error: 'No content in API response' },
        { status: 500 }
      );
    }

    const parsedResponse = parseAIResponse(content);

    if (!parsedResponse) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}