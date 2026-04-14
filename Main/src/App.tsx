import { useState, useCallback, useMemo } from 'react'
import { Layout } from './components/Layout'
import { StepIndicator } from './components/StepIndicator'
import { ChecklistPage } from './components/ChecklistPage'
import { ResultPage } from './components/ResultPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { importantList, skilledList, likedList } from './data/lists'

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [importantIds, setImportantIds] = useLocalStorage<number[]>('lp-important', [])
  const [skilledIds, setSkilledIds] = useLocalStorage<number[]>('lp-skilled', [])
  const [likedIds, setLikedIds] = useLocalStorage<number[]>('lp-liked', [])

  const importantSet = useMemo(() => new Set(importantIds), [importantIds])
  const skilledSet = useMemo(() => new Set(skilledIds), [skilledIds])
  const likedSet = useMemo(() => new Set(likedIds), [likedIds])

  const toggle = useCallback((list: 'important' | 'skilled' | 'liked', id: number) => {
    const setters = { important: setImportantIds, skilled: setSkilledIds, liked: setLikedIds }
    setters[list](prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [setImportantIds, setSkilledIds, setLikedIds])

  const counts: [number, number, number] = [importantIds.length, skilledIds.length, likedIds.length]

  return (
    <Layout>
      <div className="container">
        <StepIndicator
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          counts={counts}
        />
      </div>

      {currentStep === 0 && (
        <ChecklistPage
          type="important"
          items={importantList}
          selectedIds={importantSet}
          onToggle={id => toggle('important', id)}
          onNext={() => setCurrentStep(1)}
          stepLabel="第一步：重要的事"
          stepDescription={'选出对你而言「重要的价值观」——它们定义了你认为人生中最重要的是什么。'}
        />
      )}

      {currentStep === 1 && (
        <ChecklistPage
          type="skilled"
          items={skilledList}
          selectedIds={skilledSet}
          onToggle={id => toggle('skilled', id)}
          onNext={() => setCurrentStep(2)}
          onPrev={() => setCurrentStep(0)}
          stepLabel="第二步：擅长的事"
          stepDescription={'选出你「擅长的才能」——那些你天生就做得好、做起来不费力的事。'}
        />
      )}

      {currentStep === 2 && (
        <ChecklistPage
          type="liked"
          items={likedList}
          selectedIds={likedSet}
          onToggle={id => toggle('liked', id)}
          onNext={() => setCurrentStep(3)}
          onPrev={() => setCurrentStep(1)}
          stepLabel="第三步：喜欢的事"
          stepDescription={'选出你「感兴趣的领域」——那些能让你发自内心感到快乐的方向。'}
        />
      )}

      {currentStep === 3 && (
        <ResultPage
          importantIds={importantSet}
          skilledIds={skilledSet}
          likedIds={likedSet}
          onBack={() => setCurrentStep(2)}
        />
      )}
    </Layout>
  )
}
