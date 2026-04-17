import { useState, useEffect, useCallback, useRef } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const initialValueRef = useRef(initialValue)

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) as T : initialValueRef.current
    } catch {
      return initialValueRef.current
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value
      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue))
      } catch {
        // quota exceeded — silently fail
      }
      return nextValue
    })
  }, [key])

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      setStoredValue(item ? JSON.parse(item) as T : initialValueRef.current)
    } catch {
      setStoredValue(initialValueRef.current)
    }
  }, [key])

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) as T : initialValueRef.current)
        } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [storedValue, setValue]
}
