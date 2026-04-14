import type { ImportantItem, SkilledItem, LikedItem } from '../data/lists'

export function generatePrompt(
  important: ImportantItem[],
  skilled: SkilledItem[],
  liked: LikedItem[],
): string {
  const importantText = important
    .map(i => `- ${i.keyword}：${i.desc}`)
    .join('\n')

  const skilledText = skilled
    .map(s => `- ${s.talent}（长处：${s.strength}）`)
    .join('\n')

  const likedText = liked
    .map(l => `- ${l.name}`)
    .join('\n')

  return `你是一位专业的人生规划顾问。我正在使用八木仁平《如何找到想做的事》中的方法来探索自己真正想做的事。

根据八木仁平的理论：
- "重要的事"代表我的价值观——我认为人生中最重要的是什么
- "擅长的事"代表我的才能——我天生擅长、做起来不费力的事
- "喜欢的事"代表我的热情——我发自内心感兴趣的领域

当一件事同时满足"重要"、"擅长"和"喜欢"三个条件时，它很可能就是我真正想做的事。

以下是我从三个列表中选出的条目：

## 我重视的价值观（重要的事）
${importantText}

## 我的天赋才能（擅长的事）
${skilledText}

## 我感兴趣的领域（喜欢的事）
${likedText}

请你综合分析以上三个维度，帮我找出 3-5 个"真正想做的事"候选方向。对于每个方向，请说明：
1. 这个方向是什么（具体描述）
2. 它如何结合了我的价值观、才能和兴趣
3. 可能的职业/事业/生活方式实践路径
4. 为什么这个方向特别适合我

请尽量具体、有洞察力，避免泛泛而谈。`
}
