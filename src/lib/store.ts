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

function readSoundPreference() {
  try {
    return localStorage.getItem('pt-sound') === 'on'
  } catch {
    return false
  }
}

/** True once the boot sequence has cleared, so the hero can start its intro. */
export const bootStore = createStore(false)
export const soundStore = createStore(readSoundPreference())
export const menuStore = createStore(false)

soundStore.subscribe(() => {
  try {
    localStorage.setItem('pt-sound', soundStore.get() ? 'on' : 'off')
  } catch {
    // storage blocked: preference lasts for this visit only
  }
})

export const useBooted = () => useSyncExternalStore(bootStore.subscribe, bootStore.get, () => false)
export const useSound = () => useSyncExternalStore(soundStore.subscribe, soundStore.get, () => false)
export const useMenuOpen = () => useSyncExternalStore(menuStore.subscribe, menuStore.get, () => false)

let lenis: Lenis | null = null
export const lenisRef = {
  get: () => lenis,
  set: (instance: Lenis | null) => {
    lenis = instance
  },
}
