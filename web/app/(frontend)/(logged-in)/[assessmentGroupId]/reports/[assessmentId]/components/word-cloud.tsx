import React, { useState } from 'react';

import { Button } from "@/components/ui/button"

import {
  AssessmentPart,
  AssessmentUserResponse,
  Attribute,
  Level,
  Section,
  Part
} from "@/prisma/mssql/generated/client"

import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import { useScreenSize } from '@visx/responsive';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';

interface WordData {
  text: string;
  value: number;
}

export default function WordCloud({
  attributes,
  assessmentResponses
}: Readonly<{
  attributes: (Attribute & {
    levels: Level[],
    section: Section & {
      part: Part & {
        assessmentPart: AssessmentPart[]
      }
    }
  })[],
  assessmentResponses: AssessmentUserResponse[]
}>) {

  const [currentAttribute, setCurrentAttribute] = useState(attributes[0])

  const colors = ['#4338ca', '#6366f1', '#a5b4fc'];

  function wordFreq(text: string): WordData[] {
    const words: RegExpMatchArray | null = text.match(/[a-zA-Z]+/g)
    const freqMap: Record<string, number> = {};

    const wordsToExclude = ["the", "and", "am", "an", "of", "to", "in", "is", "was", "has", "hasn", "are", "were", "it", "on", "as", "at", "be", "if", "or", "by", "for", "so", "my", "me", "up", "can", "its", "that", "they", "them", "he", "him", "she", "her", "aren", "our", "ours", "who", "also", "we", "have", "each", "very", "any", "more", "still", "itself", "out", "like", "until", "this", "into", "their", "his", "hers", "theirs", "how", "been", "ago", "all", "not", "etc", "where", "there", "such", "with", "but", "only", "may", "just", "no", "even", "will"];

    if (words === null) return [];
    for (const w of words) {
      if (w.length > 1 && !wordsToExclude.includes(w.toLowerCase())) {
        if (!freqMap[w]) freqMap[w] = 0;
        freqMap[w] += 1;
      }
    }
    return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] || 0 }));
  }

  const attributeResponses = assessmentResponses.filter(response => response.attributeId === currentAttribute?.id)

  const words = wordFreq(attributeResponses.map(response => response.notes).join(' '));

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [10, 100],
  });
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  const fixedValueGenerator = () => 0.5;

  const { width, height } = useScreenSize();

  return (
    <div className="w-full flex flex-col space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Word Cloud</h2>
        <h3 className="text-lg font-bold">{currentAttribute?.id}. {currentAttribute?.name}</h3>
        <div className="wordcloud">
          <Wordcloud
            words={words}
            width={width / 1.5}
            height={height / 1.5}
            fontSize={fontSizeSetter}
            font={'GeistSans'}
            padding={2}
            spiral={'archimedean'}
            rotate={0}
            random={fixedValueGenerator}
          >
            {(cloudWords) =>
              cloudWords.map((w, i) => (
                <Text
                  key={w.text}
                  fill={colors[i % colors.length]}
                  textAnchor={'middle'}
                  transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                  fontSize={w.size}
                  fontFamily={w.font}
                >
                  {w.text}
                </Text>
              ))
            }
          </Wordcloud>
          <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .wordcloud svg {
          margin: auto;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
        </div>
        <h3 className="text-xl font-bold">Factors</h3>
        <div className="flex flex-row flex-wrap gap-4">
          {attributes.map((attribute) => (
            <Button
              key={attribute.id}
              onClick={() => setCurrentAttribute(attribute)}
              disabled={currentAttribute && currentAttribute.id === attribute.id}
            >
              {attribute.id}
            </Button>
          ))}
        </div>
      </div>
    </div>

  );
}