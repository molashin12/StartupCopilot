import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { AIRequest, AIResponse } from '@/types';

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

// Model configurations
const MODEL_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

// Safety settings
const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Business Idea Analyzer
 */
export async function analyzeBusinessIdea(idea: string, targetMarket: string, additionalContext?: string): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: MODEL_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });

    const prompt = `
Analyze the following business idea and provide a comprehensive assessment:

Business Idea: ${idea}
Target Market: ${targetMarket}
Additional Context: ${additionalContext || 'None provided'}

Please provide:
1. Viability Score (1-10)
2. Market Potential Assessment
3. Key Strengths
4. Potential Challenges
5. Recommendations for improvement
6. Similar successful companies
7. Revenue model suggestions

Format your response as a structured JSON object with the following structure:
{
  "viabilityScore": number,
  "marketPotential": {
    "size": string,
    "growth": string,
    "competition": string
  },
  "strengths": [string],
  "challenges": [string],
  "recommendations": [string],
  "similarCompanies": [string],
  "revenueModels": [string],
  "summary": string
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedData = {
        viabilityScore: 7,
        summary: text,
        marketPotential: { size: 'Medium', growth: 'Moderate', competition: 'Competitive' },
        strengths: ['Innovative concept'],
        challenges: ['Market validation needed'],
        recommendations: ['Conduct market research'],
        similarCompanies: [],
        revenueModels: ['Subscription', 'Freemium']
      };
    }

    return {
      success: true,
      data: parsedData,
      usage: {
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro'
      }
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      usage: {
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro'
      }
    };
  }
}

/**
 * Competitor Research Engine
 */
export async function researchCompetitors(businessIdea: string, industry: string, targetMarket: string): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: MODEL_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });

    const prompt = `
Conduct a comprehensive competitor analysis for the following business:

Business Idea: ${businessIdea}
Industry: ${industry}
Target Market: ${targetMarket}

Please provide:
1. Direct competitors (3-5 companies)
2. Indirect competitors (3-5 companies)
3. Competitive landscape overview
4. Market positioning opportunities
5. Competitive advantages to focus on
6. Pricing strategy insights
7. Market gaps and opportunities

Format your response as a structured JSON object:
{
  "directCompetitors": [
    {
      "name": string,
      "description": string,
      "strengths": [string],
      "weaknesses": [string],
      "marketShare": string,
      "pricingModel": string
    }
  ],
  "indirectCompetitors": [
    {
      "name": string,
      "description": string,
      "relevance": string
    }
  ],
  "marketOverview": {
    "size": string,
    "growth": string,
    "trends": [string]
  },
  "opportunities": [string],
  "recommendations": [string],
  "competitiveAdvantages": [string]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      parsedData = {
        directCompetitors: [],
        indirectCompetitors: [],
        marketOverview: { size: 'Unknown', growth: 'Unknown', trends: [] },
        opportunities: ['Market research needed'],
        recommendations: ['Analyze competitor strategies'],
        competitiveAdvantages: ['Unique value proposition']
      };
    }

    return {
      success: true,
      data: parsedData,
      usage: {
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro'
      }
    };
  } catch (error) {
    console.error('Competitor Research Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      usage: {
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro'
      }
    };
  }
}

/**
 * SWOT Analysis Generator
 */
export async function generateSWOTAnalysis(businessIdea: string, marketContext: string): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: MODEL_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });

    const prompt = `
Generate a comprehensive SWOT analysis for the following business:

Business Idea: ${businessIdea}
Market Context: ${marketContext}

Provide detailed analysis for:
1. Strengths (internal positive factors)
2. Weaknesses (internal negative factors)
3. Opportunities (external positive factors)
4. Threats (external negative factors)

For each category, provide 3-5 specific, actionable points.

Format as JSON:
{
  "strengths": [
    {
      "point": string,
      "description": string,
      "impact": "high" | "medium" | "low"
    }
  ],
  "weaknesses": [
    {
      "point": string,
      "description": string,
      "impact": "high" | "medium" | "low"
    }
  ],
  "opportunities": [
    {
      "point": string,
      "description": string,
      "timeframe": "short" | "medium" | "long"
    }
  ],
  "threats": [
    {
      "point": string,
      "description": string,
      "likelihood": "high" | "medium" | "low"
    }
  ],
  "strategicRecommendations": [string]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      parsedData = {
        strengths: [{ point: 'Innovative approach', description: 'Unique solution to market problem', impact: 'high' }],
        weaknesses: [{ point: 'Limited resources', description: 'Startup constraints', impact: 'medium' }],
        opportunities: [{ point: 'Growing market', description: 'Expanding target audience', timeframe: 'medium' }],
        threats: [{ point: 'Competition', description: 'Established players', likelihood: 'medium' }],
        strategicRecommendations: ['Focus on core strengths', 'Address key weaknesses']
      };
    }

    return {
      success: true,
      data: parsedData,
      usage: {
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro'
      }
    };
  } catch (error) {
    console.error('SWOT Analysis Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      usage: {
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro'
      }
    };
  }
}

/**
 * Interactive AI Assistant
 */
export async function chatWithAI(message: string, context?: any): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: { ...MODEL_CONFIG, temperature: 0.8 },
      safetySettings: SAFETY_SETTINGS,
    });

    const systemPrompt = `
You are StartupCopilot AI, an expert business consultant specializing in startup strategy, market analysis, and business planning. 

Your role is to:
- Provide actionable business advice
- Help with strategic planning
- Offer market insights
- Assist with business model development
- Guide through startup challenges

Always be:
- Professional and knowledgeable
- Practical and actionable
- Encouraging but realistic
- Data-driven when possible

Context: ${context ? JSON.stringify(context) : 'No additional context provided'}

User Message: ${message}

Provide a helpful, detailed response:
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: { message: text },
      usage: {
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro'
      }
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      usage: {
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro'
      }
    };
  }
}

/**
 * Validate AI API configuration
 */
export function validateAIConfig(): boolean {
  return !!process.env.GOOGLE_GEMINI_API_KEY;
}