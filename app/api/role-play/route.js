import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { message, persona, history } = await request.json();
    
    const systemPrompt = `You are role-playing as a ${persona}. Respond with empathy and support. 
    Keep responses under 3 sentences. Be conversational and natural. Remember this is practice for the user.`;
    
    const conversationHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
    const response = await getGeminiResponse(fullPrompt, conversationHistory);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Role-play API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}