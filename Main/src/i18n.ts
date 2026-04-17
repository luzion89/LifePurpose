export type AppLanguage = 'zh' | 'en'
export type StepType = 'important' | 'skilled' | 'liked'

interface StepCopy {
  navLabel: string
  navSub: string
  title: string
  description: string
  recommendedRange: string
  guideTitle: string
  guideIntro: string
  chooseTitle: string
  chooseTips: string[]
  meaningTitle: string
  meaningCards: Array<{ label: string; description: string }>
  searchPlaceholder: string
  englishModeNote?: string
  customTitle: string
  customDescription: string
  customButton: string
  customSubmit: string
  customCancel: string
  customBadge: string
  emptySearch: string
  fields: Record<string, { label: string; placeholder: string }>
}

interface ResultCopy {
  title: string
  subtitle: string
  emptyState: string
  researchTitle: string
  researchBody: string
  summaryTitles: {
    important: string
    skilled: string
    liked: string
  }
  promptTitle: string
  promptHint: string
  promptReset: string
  promptResetDone: string
  promptCustomized: string
  copyPrompt: string
  copied: string
  askAi: string
  reselect: string
  backToSelection: string
  initialRequest: string
  aiBack: string
  configured: string
  setKey: string
  apiKeyLabel: string
  apiKeyPlaceholder: string
  apiKeyHint: string
  apiKeyClaudeHint: string
  noApiKey: string
  openKey: string
  thinking: string
  aiTyping: string
  sentPromptSuffix: string
}

interface LayoutCopy {
  subtitle: string
  language: string
}

interface CommonCopy {
  previous: string
  next: string
  selected: string
  notSelected: string
  quickGuide: string
}

export const UI_TEXT: Record<AppLanguage, {
  layout: LayoutCopy
  common: CommonCopy
  steps: Record<StepType, StepCopy>
  result: ResultCopy
}> = {
  zh: {
    layout: {
      subtitle: '找到你真正想做的事',
      language: '语言',
    },
    common: {
      previous: '上一步',
      next: '下一步 →',
      selected: '已选',
      notSelected: '未选择',
      quickGuide: '阅读指引',
    },
    steps: {
      important: {
        navLabel: '重要的事',
        navSub: '价值观',
        title: '第一步：重要的事',
        description: '选出对你而言真正重要的价值观。它们不是“别人说正确的事”，而是你愿意长期捍卫、愿意拿来做人生取舍的方向。',
        recommendedRange: '建议先选 5 到 15 项，先广一些，再慢慢收窄。',
        guideTitle: '这一步在做什么',
        guideIntro: '这一步不是在选“我应该成为什么样的人”，而是在选“什么值得我把人生时间投入进去”。当你以后面临职业、关系、生活方式的选择时，价值观会决定你想把人生带往哪里。',
        chooseTitle: '怎么选会更准',
        chooseTips: [
          '优先选择你愿意长期坚持，而不是看起来体面的价值。',
          '遇到相似选项时，问自己：如果只能保留一个，我最不愿放弃哪个。',
          '不要为了平衡而勉强平均分配，允许自己明显偏向某些价值。',
        ],
        meaningTitle: '怎么理解每个选项',
        meaningCards: [
          { label: '关键词', description: '是这个价值的名字，例如“自由”“成长”“贡献”。' },
          { label: '解释句', description: '说明这个价值在真实生活里通常意味着什么，帮助你避免只看字面意思。' },
          { label: '选择标准', description: '如果一个价值会反复影响你的决定、让你愿意为它付代价，它通常就值得被选中。' },
        ],
        searchPlaceholder: '搜索价值观关键词或解释…',
        customTitle: '新增自定义价值观',
        customDescription: '如果现有列表没有准确表达你的想法，可以自己补充一个新的价值观选项。',
        customButton: '新增自定义选项',
        customSubmit: '添加并选中',
        customCancel: '取消',
        customBadge: '自定义',
        emptySearch: '没有匹配的选项，试试换个词，或者直接新增一个更贴近你的表达。',
        fields: {
          keyword: { label: '关键词', placeholder: '例如：主导感、审美、探索' },
          desc: { label: '含义说明', placeholder: '用一句话说明这个价值观在你的人生里意味着什么' },
        },
      },
      skilled: {
        navLabel: '擅长的事',
        navSub: '才能',
        title: '第二步：擅长的事',
        description: '选出你天然更顺手的做事方式。这里更接近“默认模式”或“思维倾向”，不只是后天练出来的技能证书。',
        recommendedRange: '建议先选 5 到 12 项，重点找那些你经常自然会这样做的模式。',
        guideTitle: '这一步在做什么',
        guideIntro: '这一步不是问“我会什么”，而是问“我通常怎样把事情做好”。同一个人会写字、做表格、带团队，但真正稳定的优势，往往是背后的处理方式，例如分析、号召、结构化、共情、推进。',
        chooseTitle: '怎么选会更准',
        chooseTips: [
          '优先选择你经常自然流露出来的模式，而不是你逼自己练会的能力。',
          '如果别人常说“你总是会这样想/这样做”，这通常是稳定信号。',
          '注意长处和短处是一体两面：同一种才能用对了是优势，用过头就会带来代价。',
        ],
        meaningTitle: '怎么理解每个选项',
        meaningCards: [
          { label: '才能', description: '是你惯用的认知或行动模式，例如“系统化思考”“激励他人”。' },
          { label: '长处', description: '说明这项才能在用对场景时最容易转化成什么优势。' },
          { label: '短处', description: '提醒你这项才能在哪些情况下会过量、失衡或让人有压力。' },
        ],
        searchPlaceholder: '搜索才能、长处或短处…',
        customTitle: '新增自定义才能',
        customDescription: '如果你有一个常见于自己、但列表里没有的做事模式，可以补充进来。',
        customButton: '新增自定义选项',
        customSubmit: '添加并选中',
        customCancel: '取消',
        customBadge: '自定义',
        emptySearch: '没有匹配的选项，你可以新增一个更贴近你表达的才能描述。',
        fields: {
          talent: { label: '才能名称', placeholder: '例如：把复杂问题讲清楚、快速建立连接' },
          strength: { label: '长处表现', placeholder: '说明这项才能在发挥良好时会带来什么效果' },
          weakness: { label: '过度使用时的代价', placeholder: '说明这项才能什么时候会变成阻碍或让人有压力' },
        },
      },
      liked: {
        navLabel: '喜欢的事',
        navSub: '热情',
        title: '第三步：喜欢的事',
        description: '选出你愿意主动靠近、愿意持续了解的领域。这一步更像是在找“我愿意长期把注意力投向哪里”，而不是立刻决定职业头衔。',
        recommendedRange: '建议先选 5 到 15 项，先看兴趣分布，再看是否能收敛成几个主题。',
        guideTitle: '这一步在做什么',
        guideIntro: '兴趣不一定直接等于职业，但它能告诉你：哪类主题会让你愿意持续阅读、讨论、探索、投入时间。真正长期适合的方向，通常要同时满足兴趣、才能和价值，而不是只靠热情。',
        chooseTitle: '怎么选会更准',
        chooseTips: [
          '选那些你会自发点开、持续关注、愿意了解细节的领域。',
          '不要因为“这个行业挣钱”就选，除非你真的愿意长期接触它。',
          '这里选的是主题和领域，不是最终职业决定。',
        ],
        meaningTitle: '怎么理解每个选项',
        meaningCards: [
          { label: '领域名', description: '是一个你可能愿意长期接触的主题，例如心理、设计、教育、金融。' },
          { label: '选择标准', description: '如果你会主动搜索、愿意反复接触、对背后的机制感兴趣，就值得选。' },
          { label: '不要误解', description: '喜欢某个领域，不代表你必须做这个行业里的所有岗位。' },
        ],
        searchPlaceholder: '搜索感兴趣的领域…',
        customTitle: '新增自定义兴趣领域',
        customDescription: '如果你的兴趣主题不在当前列表里，可以直接补充自己的表达。',
        customButton: '新增自定义选项',
        customSubmit: '添加并选中',
        customCancel: '取消',
        customBadge: '自定义',
        emptySearch: '没有匹配的兴趣领域，你可以新增一个更贴近你的主题。',
        fields: {
          name: { label: '兴趣领域', placeholder: '例如：独立游戏、科学传播、城市观察' },
        },
      },
    },
    result: {
      title: '你的自我探索结果',
      subtitle: '共选择了 {count} 个条目，已生成可编辑的研究型提示词。',
      emptyState: '你还没有选择任何条目。请先回到前面的步骤进行勾选。',
      researchTitle: '这版会先做方向假设，不直接下唯一结论',
      researchBody: 'AI 会先整理你勾选里的稳定信号，再给出 3 个可验证的方向假设，并为每个方向附上可能误判点与 7 天实验。',
      summaryTitles: {
        important: '重要的事',
        skilled: '擅长的事',
        liked: '喜欢的事',
      },
      promptTitle: '生成的提示词',
      promptHint: '你可以直接在这里修改提示词。复制出去时会复制修改后的版本，App 内提问也会使用当前文本。',
      promptReset: '重置为默认',
      promptResetDone: '已重置',
      promptCustomized: '已自定义',
      copyPrompt: '复制提示词',
      copied: '✓ 已复制',
      askAi: '生成方向假设 ✦',
      reselect: '← 重新选择',
      backToSelection: '← 返回选择',
      initialRequest: '请先根据我的选择提炼稳定信号，再提出 3 个方向假设。不要直接给唯一的人生答案。每个方向都要写支持证据、可能误判点、置信度和 7 天验证实验。如果信息不足，请明确指出最关键的信息缺口。',
      aiBack: '← 返回',
      configured: '🔑 已配置',
      setKey: '⚙ 设置 Key',
      apiKeyLabel: 'API Key',
      apiKeyPlaceholder: '请输入 API Key',
      apiKeyHint: 'Key 仅保存在本地浏览器中，不会上传到任何服务器。',
      apiKeyClaudeHint: ' Claude API 可能存在浏览器端 CORS 限制，建议使用 OpenAI 或 DeepSeek。',
      noApiKey: '请先设置 API Key 以开始 AI 对话',
      openKey: '设置 API Key',
      thinking: '思考中...',
      aiTyping: 'AI 正在回复中...',
      sentPromptSuffix: '...(提示词已发送)',
    },
  },
  en: {
    layout: {
      subtitle: 'Find what you genuinely want to do',
      language: 'Language',
    },
    common: {
      previous: 'Back',
      next: 'Next →',
      selected: 'Selected',
      notSelected: 'None selected',
      quickGuide: 'Guide',
    },
    steps: {
      important: {
        navLabel: 'What Matters',
        navSub: 'Values',
        title: 'Step 1: What Matters',
        description: 'Choose the values that truly matter to you. These are not the “correct” answers, but the directions you would repeatedly defend when life asks you to choose.',
        recommendedRange: 'A good starting range is 5 to 15 items. Start broad, then narrow down.',
        guideTitle: 'What this step does',
        guideIntro: 'This step is about identifying what is worth spending your life energy on. Your values shape the direction of your work, relationships, and lifestyle choices.',
        chooseTitle: 'How to choose more accurately',
        chooseTips: [
          'Choose what you would still care about even if nobody praised you for it.',
          'When two options feel similar, ask which one you would hate to lose first.',
          'Do not force balance. It is fine if your values are clearly uneven.',
        ],
        meaningTitle: 'How to read each option',
        meaningCards: [
          { label: 'Keyword', description: 'The short name of the value, such as freedom, growth, or contribution.' },
          { label: 'Description', description: 'A practical explanation of how that value usually shows up in daily life.' },
          { label: 'Selection test', description: 'If this value repeatedly changes your decisions and feels worth paying a cost for, it is probably real for you.' },
        ],
        searchPlaceholder: 'Search values or descriptions…',
        englishModeNote: 'The built-in library currently keeps the original Chinese wording from the curated list. You can still add your own English options below.',
        customTitle: 'Add a custom value',
        customDescription: 'If the current list does not express your value precisely, add your own option here.',
        customButton: 'Add custom option',
        customSubmit: 'Add and select',
        customCancel: 'Cancel',
        customBadge: 'Custom',
        emptySearch: 'No matching options. Try another term, or add one that fits you better.',
        fields: {
          keyword: { label: 'Keyword', placeholder: 'For example: agency, taste, exploration' },
          desc: { label: 'Meaning', placeholder: 'Describe what this value means in your life in one sentence' },
        },
      },
      skilled: {
        navLabel: 'What You Do Well',
        navSub: 'Talents',
        title: 'Step 2: What You Do Well',
        description: 'Choose the patterns that feel natural to you. This is closer to your default way of thinking or operating than to a learned certification or job skill.',
        recommendedRange: 'A good starting range is 5 to 12 items. Focus on patterns that show up repeatedly and naturally.',
        guideTitle: 'What this step does',
        guideIntro: 'This step is not asking “What can I do?” but “How do I usually do things well?” Real strengths often live in the underlying mode: structuring, analyzing, persuading, noticing people, pushing things forward.',
        chooseTitle: 'How to choose more accurately',
        chooseTips: [
          'Prioritize patterns that come out naturally, not just skills you forced yourself to learn.',
          'If people often say “you always think like this” or “you naturally do this”, that is a strong signal.',
          'Remember that every talent has a cost when overused. Strength and downside are usually connected.',
        ],
        meaningTitle: 'How to read each option',
        meaningCards: [
          { label: 'Talent', description: 'The core thinking or action pattern, such as systemizing or energizing others.' },
          { label: 'Strength', description: 'What this pattern tends to create when used in the right context.' },
          { label: 'Trade-off', description: 'What can go wrong when the same pattern is overused or applied in the wrong place.' },
        ],
        searchPlaceholder: 'Search talents, strengths, or trade-offs…',
        englishModeNote: 'The built-in library currently keeps the original Chinese wording from the curated list. You can still add your own English options below.',
        customTitle: 'Add a custom talent',
        customDescription: 'If you have a repeatable way of working that is missing from the list, add it here.',
        customButton: 'Add custom option',
        customSubmit: 'Add and select',
        customCancel: 'Cancel',
        customBadge: 'Custom',
        emptySearch: 'No matching options. You can add a custom talent that describes you better.',
        fields: {
          talent: { label: 'Talent name', placeholder: 'For example: making complexity easy to understand' },
          strength: { label: 'When it works well', placeholder: 'Describe the positive effect when this pattern is used well' },
          weakness: { label: 'When it goes too far', placeholder: 'Describe the cost or downside when this pattern is overused' },
        },
      },
      liked: {
        navLabel: 'What You Like',
        navSub: 'Interests',
        title: 'Step 3: What You Like',
        description: 'Choose the domains you naturally want to move toward. This step is about where your attention wants to live, not about locking in a final job title.',
        recommendedRange: 'A good starting range is 5 to 15 items. First observe the spread of your interests, then see whether themes emerge.',
        guideTitle: 'What this step does',
        guideIntro: 'Interest does not automatically equal career fit, but it shows which themes keep pulling your attention back. Long-term fit usually appears when interest, talent, and values start reinforcing each other.',
        chooseTitle: 'How to choose more accurately',
        chooseTips: [
          'Pick themes you would voluntarily read about, watch, discuss, or explore in more depth.',
          'Do not choose something only because it sounds practical unless you genuinely want to stay close to it.',
          'These are domains and topics, not final career commitments.',
        ],
        meaningTitle: 'How to read each option',
        meaningCards: [
          { label: 'Domain', description: 'A topic you may want to stay close to over time, such as psychology, design, education, or finance.' },
          { label: 'Selection test', description: 'If you return to it willingly and want to understand how it works, it is worth selecting.' },
          { label: 'Do not over-interpret', description: 'Liking a field does not mean you must do every kind of job inside that field.' },
        ],
        searchPlaceholder: 'Search interest domains…',
        englishModeNote: 'The built-in library currently keeps the original Chinese wording from the curated list. You can still add your own English options below.',
        customTitle: 'Add a custom interest domain',
        customDescription: 'If your topic is missing from the current list, add it directly here.',
        customButton: 'Add custom option',
        customSubmit: 'Add and select',
        customCancel: 'Cancel',
        customBadge: 'Custom',
        emptySearch: 'No matching interests. You can add a custom topic that fits you better.',
        fields: {
          name: { label: 'Interest domain', placeholder: 'For example: indie games, science communication, urban observation' },
        },
      },
    },
    result: {
      title: 'Your Self-Discovery Summary',
      subtitle: '{count} items selected. A research-oriented prompt has been generated and can be edited below.',
      emptyState: 'You have not selected anything yet. Go back to the earlier steps first.',
      researchTitle: 'This version builds hypotheses before giving conclusions',
      researchBody: 'The AI will first extract stable signals from your selections, then propose 3 testable direction hypotheses with possible misreads and 7-day experiments.',
      summaryTitles: {
        important: 'What Matters',
        skilled: 'What You Do Well',
        liked: 'What You Like',
      },
      promptTitle: 'Generated Prompt',
      promptHint: 'You can edit the prompt directly here. The copied version and the in-app AI chat will both use the edited text.',
      promptReset: 'Reset to default',
      promptResetDone: 'Reset',
      promptCustomized: 'Customized',
      copyPrompt: 'Copy prompt',
      copied: '✓ Copied',
      askAi: 'Generate Hypotheses ✦',
      reselect: '← Revisit selections',
      backToSelection: '← Back to selection',
      initialRequest: 'Please extract stable signals from my selections first, then propose 3 direction hypotheses. Do not jump straight to one final life answer. For each direction, include supporting evidence, possible misread risks, confidence, and a 7-day validation experiment. If information is missing, explicitly tell me the most important gaps.',
      aiBack: '← Back',
      configured: '🔑 Configured',
      setKey: '⚙ Set Key',
      apiKeyLabel: 'API Key',
      apiKeyPlaceholder: 'Enter API Key',
      apiKeyHint: 'The key is stored only in your local browser and is not uploaded anywhere.',
      apiKeyClaudeHint: ' Claude API may hit browser-side CORS limits, so OpenAI or DeepSeek is recommended.',
      noApiKey: 'Set an API Key before starting the AI chat',
      openKey: 'Set API Key',
      thinking: 'Thinking...',
      aiTyping: 'AI is responding...',
      sentPromptSuffix: '...(prompt sent)',
    },
  },
}
