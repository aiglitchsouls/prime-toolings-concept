import { useSyncExternalStore } from 'react'

import type Lenis from 'lenis'

// Tiny external stores shared across the tree without context re-renders.

function createStore<T>(initial: T) {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return
      value = next
      listeners.forEach((listener) => listener())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export const menuStore = createStore(false)

export const useMenuOpen = () => useSyncExternalStore(menuStore.subscribe, menuStore.get, () => false)

let lenis: Lenis | null = null
export const lenisRef = {
  get: () => lenis,
  set: (instance: Lenis | null) => {
    lenis = instance
  },
}
