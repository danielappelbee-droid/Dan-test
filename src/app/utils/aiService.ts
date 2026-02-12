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

class AIService {
  private static instance: AIService;
  private baseUrl: string = '/api/ai';

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }


  async generateAnswer(question: string, context: TransferContext): Promise<AIResponse | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const aiResponse = await response.json();
      return aiResponse as AIResponse;
    } catch (error) {
      console.error('Failed to generate AI answer:', error);
      return null;
    }
  }

}

export const aiService = AIService.getInstance();
export type { TransferContext, AIResponse };