import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { entry } = await request.json();
    
    const prompt = `Analyze this journal entry and provide:
    1. Primary emotion (one word: happy, sad, anxious, angry, neutral, excited, scared)
    2. Energy level (1-10, where 1 is low, 10 is high)
    3. One practical micro-action suggestion (max 10 words)
    
    Format your response as JSON: {emotion: string, energy: number, suggestion: string}
    
    Journal entry: "${entry}"`;
    
    const response = await getGeminiResponse(prompt);
    
    // Extract JSON from response
    let analysis;
    try {
      const jsonMatch = response.match(/{[^}]*}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if JSON parsing fails
        analysis = {
          emotion: 'neutral',
          energy: 5,
          suggestion: 'Take a few deep breaths and stretch'
        };
      }
    } catch (e) {
      analysis = {
        emotion: 'neutral',
        energy: 5,
        suggestion: 'Take a few deep breaths and stretch'
      };
    }
    
    // Validate energy is between 1-10
    if (analysis.energy < 1) analysis.energy = 1;
    if (analysis.energy > 10) analysis.energy = 10;
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Journal analysis error:', error);
    return NextResponse.json(
      { 
        emotion: 'neutral',
        energy: 5,
        suggestion: 'Be kind to yourself today'
      },
      { status: 500 }
    );
  }
}