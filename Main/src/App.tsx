import { useState, useCallback, useMemo } from 'react'
import { Layout } from './components/Layout'
import { StepIndicator } from './components/StepIndicator'
import { ChecklistPage } from './components/ChecklistPage'
import { ResultPage } from './components/ResultPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { importantList, skilledList, likedList, type ImportantItem, type SkilledItem, type LikedItem } from './data/lists'
import type { AppLanguage } from './i18n'
import { getNextCustomId } from './utils/customOptions'

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [language, setLanguage] = useLocalStorage<AppLanguage>('lp-language', 'zh')
  const [importantIds, setImportantIds] = useLocalStorage<number[]>('lp-important', [])
  const [skilledIds, setSkilledIds] = useLocalStorage<number[]>('lp-skilled', [])
  const [likedIds, setLikedIds] = useLocalStorage<number[]>('lp-liked', [])
  const [customImportant, setCustomImportant] = useLocalStorage<ImportantItem[]>('lp-custom-important', [])
  const [customSkilled, setCustomSkilled] = useLocalStorage<SkilledItem[]>('lp-custom-skilled', [])
  const [customLiked, setCustomLiked] = useLocalStorage<LikedItem[]>('lp-custom-liked', [])

  const allImportant = useMemo(() => [...importantList, ...customImportant], [customImportant])
  const allSkilled = useMemo(() => [...skilledList, ...customSkilled], [customSkilled])
  const allLiked = useMemo(() => [...likedList, ...customLiked], [customLiked])

  const importantSet = useMemo(() => new Set(importantIds), [importantIds])
  const skilledSet = useMemo(() => new Set(skilledIds), [skilledIds])
  const likedSet = useMemo(() => new Set(likedIds), [likedIds])

  const toggle = useCallback((list: 'important' | 'skilled' | 'liked', id: number) => {
    const setters = { important: setImportantIds, skilled: setSkilledIds, liked: setLikedIds }
    setters[list](prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [setImportantIds, setSkilledIds, setLikedIds])

  const addCustomImportant = useCallback((item: Omit<ImportantItem, 'id'>) => {
    const id = getNextCustomId([...importantList, ...customImportant])
    setCustomImportant(prev => [...prev, { id, ...item }])
    setImportantIds(prev => prev.includes(id) ? prev : [...prev, id])
    return id
  }, [customImportant, setCustomImportant, setImportantIds])

  const addCustomSkilled = useCallback((item: Omit<SkilledItem, 'id'>) => {
    const id = getNextCustomId([...skilledList, ...customSkilled])
    setCustomSkilled(prev => [...prev, { id, ...item }])
    setSkilledIds(prev => prev.includes(id) ? prev : [...prev, id])
    return id
  }, [customSkilled, setCustomSkilled, setSkilledIds])

  const addCustomLiked = useCallback((item: Omit<LikedItem, 'id'>) => {
    const id = getNextCustomId([...likedList, ...customLiked])
    setCustomLiked(prev => [...prev, { id, ...item }])
    setLikedIds(prev => prev.includes(id) ? prev : [...prev, id])
    return id
  }, [customLiked, setCustomLiked, setLikedIds])

  const selectedImportant = useMemo(
    () => allImportant.filter(item => importantSet.has(item.id)),
    [allImportant, importantSet],
  )
  const selectedSkilled = useMemo(
    () => allSkilled.filter(item => skilledSet.has(item.id)),
    [allSkilled, skilledSet],
  )
  const selectedLiked = useMemo(
    () => allLiked.filter(item => likedSet.has(item.id)),
    [allLiked, likedSet],
  )

  const counts: [number, number, number] = [importantIds.length, skilledIds.length, likedIds.length]

  return (
    <Layout language={language} onLanguageChange={setLanguage}>
      <div className="container">
        <StepIndicator
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          counts={counts}
          language={language}
        />
      </div>

      {currentStep === 0 && (
        <ChecklistPage
          language={language}
          type="important"
          items={allImportant}
          selectedIds={importantSet}
           onToggle={(id: number) => toggle('important', id)}
           onCreateCustomOption={(item: Omit<ImportantItem, 'id'>) => addCustomImportant(item)}
          onNext={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 1 && (
        <ChecklistPage
          language={language}
          type="skilled"
          items={allSkilled}
          selectedIds={skilledSet}
           onToggle={(id: number) => toggle('skilled', id)}
           onCreateCustomOption={(item: Omit<SkilledItem, 'id'>) => addCustomSkilled(item)}
          onNext={() => setCurrentStep(2)}
          onPrev={() => setCurrentStep(0)}
        />
      )}

      {currentStep === 2 && (
        <ChecklistPage
          language={language}
          type="liked"
          items={allLiked}
          selectedIds={likedSet}
           onToggle={(id: number) => toggle('liked', id)}
           onCreateCustomOption={(item: Omit<LikedItem, 'id'>) => addCustomLiked(item)}
          onNext={() => setCurrentStep(3)}
          onPrev={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <ResultPage
          language={language}
          importantItems={selectedImportant}
          skilledItems={selectedSkilled}
          likedItems={selectedLiked}
          onBack={() => setCurrentStep(2)}
        />
      )}
    </Layout>
  )
}
