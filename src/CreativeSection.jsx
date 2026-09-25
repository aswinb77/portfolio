import { getMedia } from './assets/media'
import { useState, useEffect, useCallback, useMemo } from 'react'
import './CreativeSection.css'

// ── Game Constants ──
const N = 10
const S = 44
const M = 30
const TOTAL_DOTS = (N * (N + 1)) / 2 // 55

const pos = (r, c) => [M + c * S, M + r * S]

// Generate all 27 legitimate lines in the right-angled triangle grid:
// 1. Horizontal Rows (r = 1..9): 9 lines of lengths 2..10
// 2. Vertical Columns (c = 0..8): 9 lines of lengths 10..2
// 3. Diagonals (\ parallel to hypotenuse): 9 lines of lengths 10..2 (every diagonal has a unique length, no duplicate lines)
function generateAllLines() {
  const lines = []

  // 1. Horizontal Rows (r = 1..9): dots from [r, 0] to [r, r]
  for (let r = 1; r < N; r++) {
    const dots = []
    for (let c = 0; c <= r; c++) dots.push([r, c])
    lines.push({ type: 'horizontal', dots })
  }

  // 2. Vertical Columns (c = 0..8): dots from [c, c] to [9, c]
  for (let c = 0; c < N - 1; c++) {
    const dots = []
    for (let r = c; r < N; r++) dots.push([r, c])
    lines.push({ type: 'vertical', dots })
  }

  // 3. Diagonals (\ top-left to bottom-right, parallel to hypotenuse): d = 0..8
  for (let d = 0; d < N - 1; d++) {
    const dots = []
    for (let i = 0; d + i < N; i++) dots.push([d + i, i])
    lines.push({ type: 'diagonal', dots })
  }

  return lines
}

const ALL_LINES = generateAllLines()

// Compute line endpoints extended by 22px past the boundary dots so cuts visibly slash through
function getExtendedLine(dots) {
  const [r1, c1] = dots[0]
  const [r2, c2] = dots[dots.length - 1]
  const [x1, y1] = pos(r1, c1)
  const [x2, y2] = pos(r2, c2)
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  if (len === 0) return { x1, y1, x2, y2 }
  const ext = 22
  return {
    x1: x1 - (dx / len) * ext,
    y1: y1 - (dy / len) * ext,
    x2: x2 + (dx / len) * ext,
    y2: y2 + (dy / len) * ext,
  }
}

// Insane IQ Computer Engine (Minimax safety + Greedy chain-cutting + Human response)
function getInsaneAiMove(grid, completedLineSet, lastHumanMove) {
  const available = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c <= r; c++) {
      if (grid[r][c] === null) available.push([r, c])
    }
  }
  if (available.length === 0) return null

  // 1. Immediate Score Check: Claim any line that completes on this turn (Weighted by 10 pts per bubble!)
  let bestScore = -1
  let scoringMoves = []

  for (const [r, c] of available) {
    let points = 0
    ALL_LINES.forEach((lObj, lIdx) => {
      if (completedLineSet.has(lIdx)) return
      if (!lObj.dots.some(([lr, lc]) => lr === r && lc === c)) return
      const isFull = lObj.dots.every(
        ([lr, lc]) => (lr === r && lc === c ? true : grid[lr][lc] !== null)
      )
      if (isFull) {
        points += lObj.dots.length * 10
      }
    })

    if (points > bestScore) {
      bestScore = points
      scoringMoves = [{ move: [r, c], score: points }]
    } else if (points === bestScore && points > 0) {
      scoringMoves.push({ move: [r, c], score: points })
    }
  }

  if (bestScore > 0) {
    // If multiple scoring moves, pick the one completing maximum points or touching most lines
    scoringMoves.sort((a, b) => b.score - a.score)
    return scoringMoves[0].move
  }

  // 2. Evaluated Candidate Moves (Avoid blunders: NEVER leave any line at 1 dot remaining)
  const evaluated = []

  for (const [r, c] of available) {
    let blundersGiven = 0 // lines that would be left with 1 dot remaining (free gift to human)
    let pointsSurrendered = 0 // points given to human if this move is made
    let safeLinesCount = 0
    let strategicScore = 0

    ALL_LINES.forEach((lObj, lIdx) => {
      if (completedLineSet.has(lIdx)) return
      const onLine = lObj.dots.some(([lr, lc]) => lr === r && lc === c)
      if (!onLine) return

      const remainingBefore = lObj.dots.filter(([lr, lc]) => grid[lr][lc] === null).length
      const remainingAfter = remainingBefore - 1

      if (remainingAfter === 1) {
        blundersGiven++ // Bad! Gives opponent an instant cut!
        pointsSurrendered += lObj.dots.length * 10 // Surrendering a 10-bubble line costs 100 pts vs 20 for 2-bubble line
      } else if (remainingAfter >= 2) {
        safeLinesCount++
        strategicScore += lObj.dots.length * 4 // Longer lines have higher point value
      }

      // Responsive to user moves: contest the human's active line
      if (lastHumanMove && lObj.dots.some(([lr, lc]) => lr === lastHumanMove[0] && lc === lastHumanMove[1])) {
        strategicScore += 10
      }
    })

    // Central geometric board presence
    const distFromCenter = Math.abs(r - 5) + Math.abs(c - (r / 2))
    strategicScore += Math.max(0, 8 - distFromCenter)

    evaluated.push({
      move: [r, c],
      blundersGiven,
      pointsSurrendered,
      safeLinesCount,
      strategicScore,
    })
  }

  // 3. Pick from strictly safe moves (0 blunders)
  const safeMoves = evaluated.filter((e) => e.blundersGiven === 0)
  if (safeMoves.length > 0) {
    safeMoves.sort(
      (a, b) =>
        b.strategicScore + b.safeLinesCount * 4 - (a.strategicScore + a.safeLinesCount * 4)
    )
    return safeMoves[0].move
  }

  // 4. Forced endgame sacrifice: pick move that surrenders the minimum points
  evaluated.sort((a, b) => {
    if (a.pointsSurrendered !== b.pointsSurrendered) {
      return a.pointsSurrendered - b.pointsSurrendered
    }
    return a.blundersGiven - b.blundersGiven
  })
  return evaluated[0].move
}

// Duolingo-style cheerful Web Audio chimes
function playTone(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const now = ctx.currentTime

    if (type === 'pop') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.1)
    } else if (type === 'slash') {
      ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.05)
        gain.gain.setValueAtTime(0.16, now + i * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.28)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.05)
        osc.stop(now + i * 0.05 + 0.28)
      })
    } else if (type === 'victory') {
      ;[587.33, 739.99, 880, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.08)
        gain.gain.setValueAtTime(0.2, now + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.08)
        osc.stop(now + i * 0.08 + 0.5)
      })
    }
  } catch {
    // Audio context unavailable
  }
}

export default function CreativeSection() {
  const [own, setOwn] = useState(() =>
    Array.from({ length: N }, (_, r) => Array(r + 1).fill(null))
  )
  const [completedLines, setCompletedLines] = useState([])
  const [curPlayer, setCurPlayer] = useState(0) // 0: You (Red), 1: Computer (Blue)
  const [scores, setScores] = useState([0, 0])
  const [filledCount, setFilledCount] = useState(0)
  const [vsAi, _setVsAi] = useState(true) // Player 2 is Computer by default!
  const [soundEnabled, _setSoundEnabled] = useState(true)
  const [lastUserMove, setLastUserMove] = useState(null)
  const [hoveredDot, setHoveredDot] = useState(null)

  // Reset Game
  const resetGame = useCallback(() => {
    setOwn(Array.from({ length: N }, (_, r) => Array(r + 1).fill(null)))
    setCompletedLines([])
    setCurPlayer(0)
    setScores([0, 0])
    setFilledCount(0)
    setLastUserMove(null)
    setHoveredDot(null)
  }, [])

  // Execute Move
  const handlePlayDot = useCallback(
    (r, c) => {
      if (own[r][c] !== null || filledCount >= TOTAL_DOTS) {
        return
      }

      if (curPlayer === 0) {
        setLastUserMove([r, c])
      }

      if (soundEnabled) playTone('pop')

      const nextOwn = own.map((row, rIdx) =>
        rIdx === r ? row.map((val, cIdx) => (cIdx === c ? curPlayer : val)) : [...row]
      )

      const newlyCompleted = []
      let newScore = 0

      // Check all 42 lines
      ALL_LINES.forEach((lineObj, lineIdx) => {
        if (completedLines.some((cl) => cl.lineIdx === lineIdx)) return
        const hasPoint = lineObj.dots.some(([lr, lc]) => lr === r && lc === c)
        if (!hasPoint) return

        const isFull = lineObj.dots.every(([lr, lc]) => nextOwn[lr][lc] !== null)
        if (isFull) {
          const { x1, y1, x2, y2 } = getExtendedLine(lineObj.dots)
          newlyCompleted.push({
            lineIdx,
            x1,
            y1,
            x2,
            y2,
            type: lineObj.type,
            player: curPlayer,
          })
          // Each bubble on the completed line gives 10 points!
          const linePoints = lineObj.dots.length * 10
          newScore += linePoints
        }
      })

      const nextCompleted = [...completedLines, ...newlyCompleted]
      const nextScores = [scores[0], scores[1]]
      if (newScore > 0) {
        nextScores[curPlayer] += newScore
        if (soundEnabled) playTone('slash')
      }

      const nextFilled = filledCount + 1

      // Next player turn: ALWAYS switches (bonus cut feature removed)
      const nextPlayer = 1 - curPlayer

      setOwn(nextOwn)
      setCompletedLines(nextCompleted)
      setScores(nextScores)
      setFilledCount(nextFilled)
      setCurPlayer(nextPlayer)

      if (nextFilled === TOTAL_DOTS && soundEnabled) {
        setTimeout(() => playTone('victory'), 250)
      }
    },
    [own, completedLines, curPlayer, scores, filledCount, soundEnabled]
  )

  // Insane-IQ AI Move with slightly paced human-like timing
  useEffect(() => {
    if (!vsAi || curPlayer !== 1 || filledCount >= TOTAL_DOTS) return

    // ~420ms natural reaction time so player can clearly see their own move before bot acts
    const timer = setTimeout(() => {
      const completedSet = new Set(completedLines.map((cl) => cl.lineIdx))
      const bestMove = getInsaneAiMove(own, completedSet, lastUserMove)
      if (bestMove) {
        handlePlayDot(bestMove[0], bestMove[1])
      }
    }, 420)

    return () => clearTimeout(timer)
  }, [vsAi, curPlayer, own, completedLines, filledCount, lastUserMove, handlePlayDot])

  // Game Over Result (in matching Fredoka font)
  const isGameOver = filledCount === TOTAL_DOTS
  const gameResult = useMemo(() => {
    if (!isGameOver) return null
    if (scores[0] > scores[1]) {
      return {
        title: 'you won !',
        emoji: '👑',
        type: 'win',
      }
    } else if (scores[0] < scores[1]) {
      return {
        title: 'you lose !',
        emoji: '🤖',
        type: 'lose',
      }
    } else {
      return {
        title: 'Draw !',
        emoji: '🤝',
        type: 'draw',
      }
    }
  }, [isGameOver, scores])

  // Auto-restart game after displaying the result popup (or instant on button click)
  useEffect(() => {
    if (filledCount < TOTAL_DOTS) return

    const restartTimer = setTimeout(() => {
      resetGame()
    }, 4500)

    return () => clearTimeout(restartTimer)
  }, [filledCount, resetGame])


  const [isExpanded, setIsExpanded] = useState(false)

  // Auto-expand if user navigates to #creative directly
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#creative') {
        setIsExpanded(true)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  return (
    <section
      className={`duo-game-section ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
      id="creative"
      data-nav-theme={isExpanded ? 'light' : 'dark'}
      aria-label="Game"
    >
      {!isExpanded ? (
        <div className="duo-postit-stage">
          <div
            className="duo-postit-note"
            onClick={() => setIsExpanded(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsExpanded(true)}
            aria-label="Poojyam Vett kalikkunno - Click to expand game"
          >
            {/* Realistic Silver Metal Paperclip Pinned on Top Right */}
            <div className="duo-paperclip" aria-hidden="true">
              <svg viewBox="0 0 28 68" width="24" height="58" fill="none">
                <defs>
                  <linearGradient id="clip-steel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="35%" stopColor="#ffffff" />
                    <stop offset="65%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>
                {/* Paperclip drop shadow on paper */}
                <path
                  d="M9 16v34a5 5 0 0 0 10 0V12a8 8 0 0 0-16 0v40a10 10 0 0 0 20 0V18"
                  stroke="rgba(0, 0, 0, 0.3)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(1.5, 2)"
                />
                {/* Metallic wire body */}
                <path
                  d="M9 16v34a5 5 0 0 0 10 0V12a8 8 0 0 0-16 0v40a10 10 0 0 0 20 0V18"
                  stroke="url(#clip-steel)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Specular highlight */}
                <path
                  d="M9 16v34a5 5 0 0 0 10 0V12a8 8 0 0 0-16 0v40a10 10 0 0 0 20 0V18"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              </svg>
            </div>

            {/* Handwritten Note Body */}
            <div className="duo-postit-content">
              <h3 className="duo-postit-title">Poojyam Vett</h3>
              <p className="duo-postit-malayalam">കളിക്കുന്നോ ?</p>

              <div className="duo-postit-doodle" aria-hidden="true">
                {/* Hand-drawn style Cross (X) */}
                <svg
                  className="duo-doodle-icon duo-doodle-x"
                  viewBox="0 0 28 28"
                  width="26"
                  height="26"
                  fill="none"
                >
                  <line x1="6.5" y1="6.5" x2="21.5" y2="21.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                  <line x1="21.5" y1="6.5" x2="6.5" y2="21.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                </svg>

                {/* Hand-drawn style Circle (O) */}
                <svg
                  className="duo-doodle-icon duo-doodle-o"
                  viewBox="0 0 28 28"
                  width="26"
                  height="26"
                  fill="none"
                >
                  <circle cx="14" cy="14" r="8.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                </svg>

                {/* Hand-drawn style Triangle */}
                <svg
                  className="duo-doodle-icon duo-doodle-tri"
                  viewBox="0 0 28 28"
                  width="26"
                  height="26"
                  fill="none"
                >
                  <path
                    d="M14 5.6 L22.8 21.6 C23.2 22.3 22.7 23 21.9 23 L6.1 23 C5.3 23 4.8 22.3 5.2 21.6 Z"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span className="duo-postit-action">click to expand ! 🎮</span>
            </div>

            {/* Curled Bottom-Left Corner with Authentic 3D Peel */}
            <div className="duo-postit-curl" aria-hidden="true">
              <svg viewBox="0 0 38 38" width="38" height="38" className="duo-postit-curl-svg">
                <defs>
                  <filter id="postit-flap-shadow" x="-30%" y="-30%" width="170%" height="170%">
                    <feDropShadow dx="2" dy="-2" stdDeviation="2.5" floodColor="rgba(0, 0, 0, 0.28)" />
                  </filter>
                  <linearGradient id="postit-flap-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="35%" stopColor="#fde047" />
                    <stop offset="70%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#fffdf0" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 38,0 38,38" fill="url(#postit-flap-grad)" filter="url(#postit-flap-shadow)" />
                <line x1="0" y1="0" x2="38" y2="38" stroke="rgba(0, 0, 0, 0.12)" strokeWidth="0.8" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="duo-expanded-wrap">
          <div className="duo-collapse-bar">
            <button
              type="button"
              className="duo-collapse-btn"
              onClick={() => setIsExpanded(false)}
              aria-label="Minimize Game"
            >
              <span>Minimize Game ▴</span>
            </button>
          </div>

          <div className="duo-game-container">
        {/* Left Side: Playful Matching Heading */}
        <div className="duo-heading-side">
          <h2 className="duo-game-heading">
            Poojyam Vett<br />
            <span className="duo-heading-accent">കളിക്കുന്നോ ?</span>
          </h2>
        </div>

        {/* Pure Clean Game Board Card */}
        <div className="duo-board-card">
          <svg
            id="vettu-board"
            viewBox="0 0 460 460"
            className="duo-svg"
            aria-label="Game Board"
          >
            {/* 1. Base Interactive Slot Nodes (Empty Slot / Filled Slot from keywords.png) */}
            <g className="duo-dots">
              {Array.from({ length: N }).map((_, r) =>
                Array.from({ length: r + 1 }).map((__, c) => {
                  const [x, y] = pos(r, c)
                  const isClaimed = own[r][c] !== null
                  const isHovered = hoveredDot && hoveredDot[0] === r && hoveredDot[1] === c

                  return (
                    <g
                      key={`dot_${r}_${c}`}
                      className={`duo-dot-group ${isClaimed ? 'is-claimed' : 'is-open'}`}
                      onClick={() => handlePlayDot(r, c)}
                      onMouseEnter={() => setHoveredDot([r, c])}
                      onMouseLeave={() => setHoveredDot(null)}
                    >
                      {/* Generous Hitbox */}
                      <circle
                        cx={x}
                        cy={y}
                        r={20}
                        fill="transparent"
                        cursor={isClaimed ? 'default' : 'pointer'}
                      />

                      {/* Slot UI: Empty Slot by default, Filled Slot when claimed or hovered */}
                      <image
                        href={isClaimed || isHovered ? getMedia('/vettu-slot-filled.png') : getMedia('/vettu-slot-empty.png')}
                        x={x - 18}
                        y={y - 18}
                        width="36"
                        height="36"
                        className={`duo-slot-graphic ${isHovered && !isClaimed ? 'is-hovered' : ''}`}
                        pointerEvents="none"
                      />

                      {/* Ghost preview of active player on hover */}
                      {!isClaimed && isHovered && (
                        <image
                          href={curPlayer === 0 ? getMedia('/vettu-x-red.png') : getMedia('/vettu-x-blue.png')}
                          x={x - 16}
                          y={y - 16}
                          width="32"
                          height="32"
                          opacity="0.55"
                          className="duo-ghost-mark"
                          pointerEvents="none"
                        />
                      )}
                    </g>
                  )
                })
              )}
            </g>

            {/* 2. Placed 3D Cross Marks (X Red & X Blue from keywords.png) */}
            <g className="duo-crosses">
              {own.map((row, r) =>
                row.map((owner, c) => {
                  if (owner === null) return null
                  const [x, y] = pos(r, c)
                  return (
                    <image
                      key={`mark_${r}_${c}`}
                      href={owner === 0 ? getMedia('/vettu-x-red.png') : getMedia('/vettu-x-blue.png')}
                      x={x - 17}
                      y={y - 17}
                      width="34"
                      height="34"
                      className="duo-placed-mark"
                      pointerEvents="none"
                    />
                  )
                })
              )}
            </g>

            {/* 3. Razor-Sharp Solid Cut Slashes */}
            <g className="duo-cut-lines">
              {completedLines.map((cl, idx) => (
                <line
                  key={`cut_${idx}`}
                  x1={cl.x1}
                  y1={cl.y1}
                  x2={cl.x2}
                  y2={cl.y2}
                  stroke={cl.player === 0 ? '#ef4444' : '#0284c7'}
                  strokeWidth="4.8"
                  strokeLinecap="round"
                  className="duo-cut-clean"
                />
              ))}
            </g>
          </svg>

          {/* Game Over Popup Overlay in matching font */}
          {gameResult && (
            <div className="duo-game-overlay">
              <div className={`duo-game-modal is-${gameResult.type}`}>
                <div className="duo-modal-emoji">{gameResult.emoji}</div>
                <h3 className="duo-modal-title">{gameResult.title}</h3>
                <div className="duo-modal-scores">
                  <div className="duo-modal-team is-you">
                    <img src={getMedia('/vettu-x-red.png')} alt="You" />
                    <span>{scores[0]} pts</span>
                  </div>
                  <span className="duo-modal-divider">:</span>
                  <div className="duo-modal-team is-bot">
                    <img src={getMedia('/vettu-x-blue.png')} alt="Bot" />
                    <span>{scores[1]} pts</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="duo-modal-btn"
                  onClick={resetGame}
                >
                  play again ↺
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</section>
  )
}
