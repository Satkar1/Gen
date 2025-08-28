import { NextResponse } from 'next/server';
import { supabase, getSessionId } from '@/lib/supabase';

export async function GET(request) {
  try {
    const sessionId = getSessionId();
    
    // Get last 5 user messages from current session
    const { data: messages, error } = await supabase
      .from('chat_history')
      .select('message, created_at')
      .eq('session_id', sessionId)
      .eq('is_user', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Memory retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve memory' },
      { status: 500 }
    );
  }
}