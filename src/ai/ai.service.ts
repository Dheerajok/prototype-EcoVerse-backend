import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
  }

  async generateChatResponse(message: string, history: any[] = []): Promise<string> {
    const systemPrompt = `You are EcoVerse AI Assistant — an intelligent, enthusiastic, cyberpunk-themed Sustainability & Zero-Waste Advisor for campus contestants. Help users recycle, reduce waste, calculate carbon savings, recommend upcycling projects, locate collection hubs, and maximize Eco Points. Provide direct, highly specific, problem-solving answers formatted nicely with markdown and emojis.`;

    // 1. Try Official Google Generative AI SDK
    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${message}`);
      const text = result.response?.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      this.logger.warn(`GoogleGenerativeAI SDK error: ${err?.message || err}`);
    }

    // 2. Try Direct REST API endpoints
    const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Query: ${message}` }],
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim().length > 0) {
            return candidateText.trim();
          }
        } else {
          const errText = await response.text();
          this.logger.warn(`Gemini REST endpoint ${model} returned ${response.status}: ${errText}`);
        }
      } catch (error: any) {
        this.logger.error(`Gemini REST fetch failed for ${model}: ${error?.message || error}`);
      }
    }

    // 3. Dynamic Contextual Fallback Response Engine
    return this.generateSmartContextualAnswer(message);
  }

  private generateSmartContextualAnswer(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('food') || q.includes('eat') || q.includes('meal') || q.includes('leftover') || q.includes('kitchen') || q.includes('canteen')) {
      return `🍱 **Food Rescue & Waste Action Plan**:
To handle your remaining food waste on campus:

1. **Share on EcoFood Rescue**: List surplus untouched meals under *Food Rescue* tab so fellow students or campus staff can claim them (+10 Pts).
2. **Donate to NGO Network**: If you have bulk canteen food, use *Offer to NGO* to dispatch to local Indore food banks (+25 Pts).
3. **Campus Organic Composting**: Dispose non-edible scraps in the Green Organic Bin at **Campus Eco Hub #1** behind Canteen Block B (+10 Pts).
4. **Impact**: Prevents methane emissions and saves approx **1.5 kg CO₂** per meal!`;
    }

    if (q.includes('e-waste') || q.includes('wire') || q.includes('cable') || q.includes('keyboard') || q.includes('phone') || q.includes('battery') || q.includes('electronic') || q.includes('laptop')) {
      return `⚡ **E-Waste Management & Upcycling Guide**:
For electronic scrap and cables:

1. **Eco Hub #2 Collection**: Deposit copper wires, PCBs, and batteries at **E-Waste Hub #2 (240m away, Tech Block B)** (+10 Pts).
2. **List on EcoMarket**: Sell working or repairable parts to engineering contestants on **EcoMarket** (+50 Pts bonus).
3. **Cyberpunk Upcycle**: Repurpose old wires and boards into custom keycaps or desk art projects on *Eco Build*.
4. **Safety Note**: Never throw lithium batteries into general trash bins!`;
    }

    if (q.includes('plastic') || q.includes('bottle') || q.includes('wrapper') || q.includes('bag') || q.includes('container')) {
      return `♻️ **Plastic Diversion & Recycling Plan**:

1. **Verify & Log Report**: Take a photo in *Report Waste* for instant AI material analysis (+10 Pts).
2. **Campus Shredder Hub**: Take PET bottles to the **Smart Plastic Shredder Kiosk** at North Gate to earn instant Eco Cash Vouchers.
3. **Upcycling Idea**: Convert plastic jugs into self-watering campus planters.
4. **Impact**: Prevents microplastic soil contamination and saves **0.8 kg CO₂** per bottle batch!`;
    }

    if (q.includes('paper') || q.includes('cardboard') || q.includes('book') || q.includes('box') || q.includes('notebook')) {
      return `📦 **Paper & Cardboard Recovery Plan**:

1. **EcoMarket Exchange**: Offer old textbooks and clean cardboard boxes to junior contestants on **EcoMarket**.
2. **Pulp Recycling Station**: Drop paper bundles at **Central Library Recycling Box** (+10 Pts).
3. **Upcycle Project**: Turn stiff cardboard into organizer dividers or prototype models.`;
    }

    if (q.includes('point') || q.includes('level') || q.includes('rank') || q.includes('earn') || q.includes('xp')) {
      return `🎮 **Eco Verse Points & Ranking Blueprint**:

- **Report Waste**: +10 Eco Points + 5 XP
- **Clean / Verify Report**: +50 Eco Points + 12 kg Waste Saved
- **Publish Social Action**: +50 Eco Points
- **Join Arena Challenge**: +100 Eco Points
- **Level Tiers**: 0-99 Pts (Rookie) ➔ 100-499 Pts (Survivor) ➔ 500-999 Pts (Vanguard) ➔ 1000+ Pts (Champion)!`;
    }

    return `🌱 **EcoVerse Advisor Response**:
Regarding your request: *"${query}"*

1. **Submit Waste Report**: Take a photo under *Report Waste* to get AI Neural Vision classification (+10 Pts).
2. **List on EcoMarket**: Exchange upcycled items or excess materials with campus contestants (+50 Pts).
3. **Eco Hub Collection**: Drop segregated waste at nearest **Campus Eco Hub #1 / #2** (+10 Pts).
4. **Food Rescue**: Share untouched food on *EcoFood* to reduce methane emissions.`;
  }
}
