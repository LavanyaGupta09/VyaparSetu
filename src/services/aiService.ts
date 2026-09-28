const API_URL = 'http://localhost:3000/api/ai/chat';

async function callAI(messages: any[], locale: string = 'en') {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context: { locale } }),
  });
  if (!response.ok) throw new Error('AI Service Error');
  const data = await response.json();
  return data.reply;
}

export const aiService = {
  chat: async (messages: any[], context: any, retries = 1): Promise<string> => {
    const locale = context.locale || 'en';
    const systemPrompt = {
      role: 'system',
      content: `You are Mitra AI, an Industrial Approval Copilot for the MAHA-SETU platform (Maharashtra State Government).
IMPORTANT: Answer in locale: "${locale}".

CRITICAL UX RULES:
1. Transform complex approval information into a simple guided action plan.
2. Use simple language. Avoid government/legal jargon unless necessary.

FORMATTING RULES:
You MUST output your ENTIRE response as a strictly valid JSON object matching this schema:
{
  "message": "Your main conversational response explaining the situation. Use emojis like 🔴 DO NOW, 🟡 DO NEXT, 🟢 LATER to group things clearly.",
  "cards": [
    {
      "title": "Approval Name",
      "status": "Not Started",
      "authority": "Authority Name",
      "whyRequired": "1-sentence explanation of why it is needed.",
      "documents": ["Doc 1", "Doc 2"],
      "actionLabel": "Start Application",
      "actionType": "apply"
    }
  ]
}

DO NOT wrap the JSON in markdown code blocks. DO NOT output any prose outside the JSON. Return ONLY the raw JSON string.

User Context:
${JSON.stringify(context, null, 2)}`
    };

    try {
      let rawReply = await callAI([systemPrompt, ...messages], locale);
      
      if (rawReply.trim().startsWith('\`\`\`json')) {
        rawReply = rawReply.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      } else if (rawReply.trim().startsWith('\`\`\`')) {
        rawReply = rawReply.replace(/\`\`\`/g, '').trim();
      }
      
      JSON.parse(rawReply);
      return rawReply;
    } catch (e) {
      if (retries > 0) {
        return aiService.chat(messages, context, retries - 1);
      }
      return JSON.stringify({
        message: "I'm having trouble formatting my response right now, but I'm here to help. Could you try asking your question slightly differently?",
        cards: []
      });
    }
  },

  generateRoadmapExplanation: async (approvalName: string, locale: string) => {
    return callAI([
      { role: 'system', content: `Explain why an industrial unit needs ${approvalName} in ${locale}. Keep it under 2 sentences.` }
    ], locale);
  },

  explainRule: async (ruleContext: string, locale: string) => {
    return callAI([
      { role: 'system', content: `Explain the following regulatory rule in simple, friendly terms to an entrepreneur. Language: ${locale}` },
      { role: 'user', content: ruleContext }
    ], locale);
  },

  preCheckSummary: async (documentText: string, locale: string) => {
    return callAI([
      { role: 'system', content: `You are an AI document validator. Provide a 3 bullet point summary of the following document and identify if any signatures are missing. Output as markdown list. Language: ${locale}` },
      { role: 'user', content: documentText }
    ], locale);
  },

  schemeReasoning: async (profile: any, scheme: string, locale: string) => {
    return callAI([
      { role: 'system', content: `Explain why the given industrial profile matches the scheme "${scheme}". Keep it under 2 sentences. Language: ${locale}` },
      { role: 'user', content: JSON.stringify(profile) }
    ], locale);
  },

  officerCaseSummary: async (applicationData: any, locale: string = 'en') => {
    return callAI([
      { role: 'system', content: `You are an AI assistant for a Government Officer. Provide a 3 bullet point summary of this application for quick review. Language: ${locale}` },
      { role: 'user', content: JSON.stringify(applicationData) }
    ], locale);
  },

  draftQueryLetter: async (applicationData: any, issue: string, locale: string = 'en') => {
    return callAI([
      { role: 'system', content: `Draft a polite, legally sound deficiency letter from the MPCB pointing out: ${issue}. Keep it under 100 words. Language: ${locale}` },
      { role: 'user', content: JSON.stringify(applicationData) }
    ], locale);
  },

  nextBestAction: async (profile: any, locale: string = 'en') => {
    return callAI([
      { role: 'system', content: `Based on this industrial profile, suggest the absolute single next best action they should take right now. Keep it to one short sentence. Language: ${locale}` },
      { role: 'user', content: JSON.stringify(profile) }
    ], locale);
  },

  findSchemes: async (profile: any) => {
    const response = await fetch('http://localhost:3000/api/ai/schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });
    const data = await response.json();
    return data.schemes || [];
  },

  validateDocument: async (documentName: string, documentType: string) => {
    const response = await fetch('http://localhost:3000/api/ai/validate-docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentName, documentType }),
    });
    const data = await response.json();
    return data.validation;
  },

  extractDocumentData: async (base64: string, fileType: string) => {
    const response = await fetch('http://localhost:3000/api/ocr/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64, fileType }),
    });
    const data = await response.json();
    return data;
  }
};
