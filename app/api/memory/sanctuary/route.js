import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { topic } = await request.json();
    
    const prompt = `Generate 3 practical, actionable mental wellness tips for someone struggling with ${topic}. 
    Make them specific, evidence-based, and easy to implement. Format as a JSON array of strings.
    
    Example for anxiety: 
    ["Practice the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8",
     "Take a 5-minute walk outside to reset your nervous system",
     "Write down your worries to get them out of your head and onto paper"]`;
    
    const response = await getGeminiResponse(prompt);
    
    // Extract JSON array from response
    let tips = [];
    try {
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        tips = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if JSON parsing fails
        tips = response.split('\n')
          .filter(line => line.trim().match(/^[0-9]\.|^-/))
          .map(line => line.replace(/^[0-9]\.\s*|^-\s*/, '').trim())
          .slice(0, 3);
      }
    } catch (e) {
      // Final fallback
      tips = [
        "Practice deep breathing for 2-3 minutes to calm your nervous system",
        "Take a short break and move your body - stretch or walk around",
        "Write down three things you're grateful for today"
      ];
    }
    
    return NextResponse.json({ tips });
  } catch (error) {
    console.error('Sanctuary API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}