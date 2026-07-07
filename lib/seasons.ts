export interface SeasonReading {
  usfm: string;
  chapter: number;
  title: string;
  prompt: string;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  themes: string[];
  readings: SeasonReading[];
}

export const SEASONS: Season[] = [
  {
    id: "courage-and-wisdom",
    name: "Battling for Courage and Wisdom",
    description:
      "A season of pressing through fear and uncertainty, seeking God's strength and discernment for the battles ahead.",
    themes: ["courage", "wisdom", "strength", "trust", "discernment"],
    readings: [
      {
        usfm: "JOS",
        chapter: 1,
        title: "The Charge to Be Strong",
        prompt:
          "Three times God tells Joshua 'be strong and courageous.' What situation in your life needs that same command spoken over it?",
      },
      {
        usfm: "PSA",
        chapter: 27,
        title: "The Lord Is My Light",
        prompt:
          "David faces enemies yet chooses confidence over fear. What does it look like for you to 'wait for the Lord' right now?",
      },
      {
        usfm: "PRO",
        chapter: 2,
        title: "The Search for Wisdom",
        prompt:
          "Wisdom is described as a treasure to seek. What decision in front of you needs wisdom more than speed?",
      },
      {
        usfm: "ISA",
        chapter: 41,
        title: "Fear Not, I Am With You",
        prompt:
          "'Fear not, for I am with you; be not dismayed.' Where do you need to hear God say this to you today?",
      },
      {
        usfm: "PRO",
        chapter: 4,
        title: "Guard Your Heart",
        prompt:
          "Wisdom begins with guarding what enters your heart. What inputs are shaping your courage or draining it?",
      },
      {
        usfm: "DAN",
        chapter: 3,
        title: "Courage in the Fire",
        prompt:
          "Three men chose faithfulness over safety. What would it look like for you to stand firm even without a guaranteed outcome?",
      },
      {
        usfm: "PSA",
        chapter: 46,
        title: "God Is Our Refuge",
        prompt:
          "'Be still and know that I am God.' What noise do you need to silence so you can hear that truth?",
      },
      {
        usfm: "PRO",
        chapter: 8,
        title: "Wisdom Calls Out",
        prompt:
          "Wisdom is personified as calling in the streets. Where in your daily life might wisdom be speaking and you've been too busy to hear?",
      },
      {
        usfm: "DAN",
        chapter: 6,
        title: "Faithfulness in the Den",
        prompt:
          "Daniel's habits of prayer sustained him through crisis. What spiritual habit is anchoring you in this season?",
      },
      {
        usfm: "PSA",
        chapter: 91,
        title: "Under His Wings",
        prompt:
          "This psalm promises shelter and protection. What fear can you bring under God's shelter today?",
      },
      {
        usfm: "JAS",
        chapter: 1,
        title: "Ask God for Wisdom",
        prompt:
          "'If any of you lack wisdom, let him ask of God.' Have you actually asked, simply and directly, for wisdom this week?",
      },
      {
        usfm: "ECC",
        chapter: 3,
        title: "A Time for Everything",
        prompt:
          "There is a time to act and a time to wait. Which does this season call for -- and how do you know?",
      },
      {
        usfm: "PSA",
        chapter: 31,
        title: "Into Your Hands",
        prompt:
          "David entrusts his spirit to God in distress. What outcome do you need to release into God's hands?",
      },
      {
        usfm: "ACT",
        chapter: 4,
        title: "Boldness in the Spirit",
        prompt:
          "The early church prayed for boldness, not comfort. What would change if you prayed for courage instead of ease?",
      },
      {
        usfm: "2TI",
        chapter: 1,
        title: "A Spirit of Power",
        prompt:
          "'God has not given us the spirit of fear, but of power, love, and a sound mind.' Which of those three do you need most today?",
      },
      {
        usfm: "PRO",
        chapter: 1,
        title: "The Beginning of Knowledge",
        prompt:
          "'The fear of the Lord is the beginning of knowledge.' How does reverence for God reframe the thing you're afraid of?",
      },
      {
        usfm: "JOB",
        chapter: 28,
        title: "Where Is Wisdom Found?",
        prompt:
          "Job searches for wisdom in the deepest places. What has this difficult season taught you that comfort never could?",
      },
      {
        usfm: "PSA",
        chapter: 121,
        title: "My Help Comes from the Lord",
        prompt:
          "The psalmist lifts his eyes to the hills. Where are you looking for help -- and is it the right direction?",
      },
      {
        usfm: "JAS",
        chapter: 3,
        title: "Wisdom from Above",
        prompt:
          "Heavenly wisdom is 'pure, peaceable, gentle.' How does the wisdom you're following measure up to that description?",
      },
      {
        usfm: "PRO",
        chapter: 3,
        title: "Trust in the Lord",
        prompt:
          "'Trust in the Lord with all your heart and lean not on your own understanding.' What are you still trying to figure out on your own?",
      },
    ],
  },
];

export function getSeasonById(id: string): Season | undefined {
  return SEASONS.find((s) => s.id === id);
}

export function getDefaultSeason(): Season {
  return SEASONS[0];
}
