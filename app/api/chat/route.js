import { NextResponse } from 'next/server';
import { getGeminiResponse, detectEmotion } from '@/lib/gemini';
import { supabase, getSessionId } from '@/lib/supabase';
import { checkForCrisis, crisisResponse } from '@/lib/crisisDetection';

export async function POST(request) {
  try {
    const { message } = await request.json();
    const sessionId = getSessionId();
    
    // Check for crisis keywords
    if (checkForCrisis(message)) {
      return NextResponse.json({
        response: crisisResponse,
        isCrisis: true,
        emotion: 'crisis'
      });
    }
    
    // Store message in session history
    const { error: insertError } = await supabase
      .from('chat_history')
      .insert([
        { 
          session_id: sessionId, 
          message, 
          is_user: true,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) throw insertError;

    // Get last 5 messages for context
    const { data: history, error: historyError } = await supabase
      .from('chat_history')
      .select('message, is_user')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (historyError) throw historyError;

    const context = history.reverse().map(msg => ({
      role: msg.is_user ? 'user' : 'model',
      parts: [{ text: msg.message }]
    }));

    // Get AI response
    const aiResponse = await getGeminiResponse(message, context);
    
    // Detect emotion from user message
    const emotion = await detectEmotion(message);
    
    // Store AI response
    const { error: responseError } = await supabase
      .from('chat_history')
      .insert([
        { 
          session_id: sessionId, 
          message: aiResponse, 
          is_user: false,
          emotion,
          created_at: new Date().toISOString()
        }
      ]);

    if (responseError) throw responseError;

    return NextResponse.json({
      response: aiResponse,
      emotion,
      isCrisis: false
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}