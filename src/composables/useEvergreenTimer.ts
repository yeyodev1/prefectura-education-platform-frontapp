import { ref, onMounted, onBeforeUnmount } from 'vue'

const TIMER_KEY = 'fud_timer_target'
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000

export function useEvergreenTimer() {
  const remaining = ref({ d: 0, h: 0, m: 0, s: 0 })
  let targetDate = 0
  let intervalId: number | null = null

  function getOrSetTarget() {
    const stored = localStorage.getItem(TIMER_KEY)
    if (stored) {
      return parseInt(stored, 10)
    }

    // Initial phase: 3 days
    const newTarget = Date.now() + THREE_DAYS
    localStorage.setItem(TIMER_KEY, newTarget.toString())
    return newTarget
  }

  function updateTimer() {
    const now = Date.now()
    let diff = targetDate - now

    if (diff <= 0) {
      // Transition to next phase: 3 days
      targetDate = Date.now() + THREE_DAYS
      localStorage.setItem(TIMER_KEY, targetDate.toString())
      diff = THREE_DAYS
    }

    remaining.value = {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((diff % (1000 * 60)) / 1000)
    }
  }

  onMounted(() => {
    targetDate = getOrSetTarget()
    updateTimer()
    intervalId = window.setInterval(updateTimer, 1000)
  })

  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return {
    remaining
  }
}
