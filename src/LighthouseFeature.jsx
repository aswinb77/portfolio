import { useState, useRef, useCallback } from 'react'
import './LighthouseFeature.css'
import claudeImg    from './assets/claude.png'
import antigravityImg from './assets/antigravity-color.svg'

// ─── SVG COORDINATE SPACE ────────────────────────────────────────────────────
// Everything lives in a single SVG: viewBox="0 0 1000 220"
// Lantern center is drawn at (LX, LY) — beam pivots from there.
// Icons are placed in the same space so alignment is ALWAYS perfect.

const SVG_W = 1000
const SVG_H = 220
const LX    = 36    // lantern cx in SVG coords — anchored at the corner
const LY    = 68    // lantern cy in SVG coords

// Perpendicular-distance illumination:
// An icon is lit if its perpendicular distance from the beam ray < BEAM_RADIUS
const BEAM_RADIUS = 28   // px in SVG space
const BEAM_DEG    = 0    // default horizontal beam
const SWAY        = 16   // max ± sway in degrees

// Icons scattered organically around the beam centerline y=LY (±25px)
const TOOLS = [
  { id: 'claude',      name: 'Claude Code',  role: 'Anthropic AI',               src: claudeImg,         glow: '#e07a5f', x: 124, y: LY +  8 },
  { id: 'antigravity', name: 'Antigravity',  role: 'Google Agentic AI',           src: antigravityImg,    glow: '#38bdf8', x: 194, y: LY - 14 },
  { id: 'react',       name: 'React',         role: 'UI Framework',                src: '/react.svg',      glow: '#61dafb', x: 274, y: LY + 20 },
  { id: 'typescript',  name: 'TypeScript',    role: 'Type Architecture',           src: '/typescript.svg', glow: '#3178c6', x: 356, y: LY -  8 },
  { id: 'flutter',     name: 'Flutter',       role: 'Cross-Platform UI',           src: '/flutter.svg',    glow: '#54c5f8', x: 436, y: LY + 22 },
  { id: 'github',      name: 'GitHub',        role: 'CI/CD & Version Control',     src: '/github.svg',     glow: '#cccccc', x: 520, y: LY - 18 },
  { id: 'php',         name: 'PHP',           role: 'Backend & Web Engine',        src: '/php.svg',        glow: '#a78bfa', x: 604, y: LY + 12 },
  { id: 'mongo',       name: 'MongoDB',       role: 'NoSQL Database',              src: '/mogo.svg',       glow: '#47a248', x: 690, y: LY - 22 },
  { id: 'postman',     name: 'Postman',       role: 'API Testing',                 src: '/postman.svg',    glow: '#ff6c37', x: 774, y: LY +  6 },
]

// Perpendicular distance from point (px,py) to ray from (LX,LY) at angleDeg
function perpDist(px, py, angleDeg) {
  const rad  = angleDeg * (Math.PI / 180)
  const cosA = Math.cos(rad)
  const sinA = Math.sin(rad)
  const dx   = px - LX
  const dy   = py - LY
  // Only illuminate what's ahead of the lantern (positive dot product)
  if (dx * cosA + dy * sinA < 0) return Infinity
  return Math.abs(dx * sinA - dy * cosA)
}

function computeLit(angleDeg) {
  return new Set(TOOLS.filter(t => perpDist(t.x, t.y, angleDeg) < BEAM_RADIUS).map(t => t.id))
}

export default function LighthouseFeature() {
  const svgRef = useRef(null)
  const [angle,  setAngle]  = useState(BEAM_DEG)
  const [lit,    setLit]    = useState(() => computeLit(BEAM_DEG))
  const [active, setActive] = useState(null)
  const [burst,  setBurst]  = useState(null)
  const [surge,  setSurge]  = useState(false)

  // Convert mouse clientX/Y → SVG coordinate space
  const toSVG = (e) => {
    const svg = svgRef.current
    if (!svg) return null
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(svg.getScreenCTM().inverse())
  }

  const onMouseMove = useCallback((e) => {
    const p = toSVG(e)
    if (!p) return
    let deg = Math.atan2(p.y - LY, p.x - LX) * (180 / Math.PI)
    deg = Math.max(BEAM_DEG - SWAY, Math.min(BEAM_DEG + SWAY, deg))
    setAngle(deg)
    setLit(computeLit(deg))
  }, [])

  const onMouseLeave = useCallback(() => {
    setAngle(BEAM_DEG)
    setLit(computeLit(BEAM_DEG))
  }, [])

  const onSurge = () => {
    setSurge(true)
    setTimeout(() => setSurge(false), 1200)
  }

  const onToolClick = (id) => {
    setBurst(id)
    setTimeout(() => setBurst(null), 700)
  }

  // Beam polygon: triangle from lantern tip, wide cone
  const rad  = angle * (Math.PI / 180)
  const cosA = Math.cos(rad)
  const sinA = Math.sin(rad)
  const len  = 1600          // extends beyond SVG width across any screen
  const half = 90            // half-width of cone at tip (px)
  // Perpendicular direction
  const px = -sinA, py = cosA
  const tip = { x: LX, y: LY }
  const far1 = { x: LX + cosA * len + px * half, y: LY + sinA * len + py * half }
  const far2 = { x: LX + cosA * len - px * half, y: LY + sinA * len - py * half }
  const beamPoly = `${tip.x},${tip.y} ${far1.x},${far1.y} ${far2.x},${far2.y}`

  // Spine (narrow bright center)
  const sh = 18
  const spFar1 = { x: LX + cosA * len + px * sh, y: LY + sinA * len + py * sh }
  const spFar2 = { x: LX + cosA * len - px * sh, y: LY + sinA * len - py * sh }
  const spinePoly = `${tip.x},${tip.y} ${spFar1.x},${spFar1.y} ${spFar2.x},${spFar2.y}`

  return (
    <div className="lhf-wrap" onMouseLeave={onMouseLeave}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        preserveAspectRatio="xMinYMax meet"
        className={`lhf-svg${surge ? ' lhf-svg--surge' : ''}`}
        onMouseMove={onMouseMove}
        aria-label="Interactive lighthouse with glowing tools"
      >
        <defs>
          {/* Beam gradient: bright at tip, fades out */}
          <linearGradient id="beamGrad" x1={LX} y1={LY} x2={LX + 1200} y2={LY}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffe88a" stopOpacity="0.92"/>
            <stop offset="28%"  stopColor="#ffc85a" stopOpacity="0.45"/>
            <stop offset="62%"  stopColor="#ffaa22" stopOpacity="0.14"/>
            <stop offset="100%" stopColor="#ff8800" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="spineGrad" x1={LX} y1={LY} x2={LX + 900} y2={LY}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#fffde0" stopOpacity="0.98"/>
            <stop offset="35%"  stopColor="#fff4b0" stopOpacity="0.55"/>
            <stop offset="70%"  stopColor="#ffd86a" stopOpacity="0.14"/>
            <stop offset="100%" stopColor="#ffaa22" stopOpacity="0"/>
          </linearGradient>
          {/* Lantern glow */}
          <radialGradient id="lGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="30%"  stopColor="#fffce0" stopOpacity="0.95"/>
            <stop offset="60%"  stopColor="#ffdd6a" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ff9900" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="lFlare" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffe090" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#ff9900" stopOpacity="0"/>
          </radialGradient>
          {/* Filter: icon glow */}
          <filter id="iconGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Surge filter */}
          <filter id="surgeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* ── Lighthouse Architectural Gradients ── */}
          {/* Cylinder stone gradient for tower */}
          <linearGradient id="lhStoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#fbf9f5"/>
            <stop offset="20%"  stopColor="#eee7dc"/>
            <stop offset="55%"  stopColor="#cfc4b4"/>
            <stop offset="82%"  stopColor="#998b7a"/>
            <stop offset="100%" stopColor="#695c4d"/>
          </linearGradient>

          {/* Red band cylindrical wrap gradient */}
          <linearGradient id="lhRedBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#d94b3d"/>
            <stop offset="28%"  stopColor="#b82d21"/>
            <stop offset="68%"  stopColor="#881a11"/>
            <stop offset="100%" stopColor="#560d07"/>
          </linearGradient>

          {/* Slate / Patina copper roof gradient */}
          <linearGradient id="lhRoofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#485a67"/>
            <stop offset="35%"  stopColor="#33424e"/>
            <stop offset="75%"  stopColor="#1e2932"/>
            <stop offset="100%" stopColor="#121b22"/>
          </linearGradient>

          {/* Cast iron gallery & brackets */}
          <linearGradient id="lhIronGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3d454e"/>
            <stop offset="50%"  stopColor="#252b32"/>
            <stop offset="100%" stopColor="#15191d"/>
          </linearGradient>

          {/* Warm interior window lamp glow */}
          <linearGradient id="lhWindowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#fff5bd"/>
            <stop offset="55%"  stopColor="#ffba3b"/>
            <stop offset="100%" stopColor="#c76400"/>
          </linearGradient>

          {/* Ambient rock ground glow */}
          <radialGradient id="lhGroundGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffc85a" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#ff9900" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* ── Beam cone (volumetric) ── */}
        <polygon
          points={beamPoly}
          fill="url(#beamGrad)"
          className="lhf-beam-cone"
        />
        {/* ── Beam spine (bright center) ── */}
        <polygon
          points={spinePoly}
          fill="url(#spineGrad)"
          className="lhf-beam-spine"
        />

        {/* ── Tool Icons ── */}
        {TOOLS.map((tool) => {
          const isLit    = lit.has(tool.id)
          const isActive = active === tool.id
          const isBurst  = burst  === tool.id
          const size     = 36
          const x0       = tool.x - size / 2
          const y0       = tool.y - size / 2
          const cls = ['lhf-orb-g',
            isLit    ? 'lhf-orb-g--lit'    : '',
            isActive ? 'lhf-orb-g--active' : '',
            isBurst  ? 'lhf-orb-g--burst'  : '',
          ].filter(Boolean).join(' ')

          return (
            <g key={tool.id} className={cls}
              onMouseEnter={() => setActive(tool.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => onToolClick(tool.id)}
              style={{ '--g': tool.glow, cursor: 'pointer' }}
              role="button" aria-label={`${tool.name} — ${tool.role}`}
            >
              {/* Clean unmasked logo image — no circle covering it */}
              <image
                href={tool.src}
                x={x0}
                y={y0}
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid meet"
                className="lhf-orb-img"
              />
            </g>
          )
        })}

        {/* ── Active Tool Floating Tooltip (Exact Capsule Pill Style) ── */}
        {(() => {
          const activeTool = TOOLS.find((t) => t.id === active)
          if (!activeTool) return null

          const nameLen = activeTool.name.length
          const roleLen = activeTool.role.length
          const tipW = Math.max(126, Math.max(nameLen * 8.2, roleLen * 7.2) + 28)
          const tipH = 36
          const tipR = tipH / 2  // Exact capsule semicircular ends (border-radius: 999px)
          const isUpper = activeTool.y < 74
          const tipX = Math.max(8, Math.min(SVG_W - tipW - 8, activeTool.x - tipW / 2))
          const tipY = isUpper ? activeTool.y + 24 : activeTool.y - 46

          // Caret points directly to activeTool.x, activeTool.y
          const arrowPoints = isUpper
            ? `${activeTool.x - 5},${tipY} ${activeTool.x + 5},${tipY} ${activeTool.x},${tipY - 5}`
            : `${activeTool.x - 5},${tipY + tipH} ${activeTool.x + 5},${tipY + tipH} ${activeTool.x},${tipY + tipH + 5}`

          return (
            <g className="lhf-tooltip-svg" style={{ pointerEvents: 'none' }}>
              {/* Soft ambient brand glow */}
              <rect
                x={tipX - 1}
                y={tipY - 1}
                width={tipW + 2}
                height={tipH + 2}
                rx={tipR}
                ry={tipR}
                fill={activeTool.glow}
                opacity={0.38}
                filter="url(#iconGlow)"
              />
              {/* Main dark capsule pill */}
              <rect
                x={tipX}
                y={tipY}
                width={tipW}
                height={tipH}
                rx={tipR}
                ry={tipR}
                fill="#0e0904"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="1"
              />
              {/* Pointer caret arrow */}
              <polygon
                points={arrowPoints}
                fill="#0e0904"
              />
              {/* Tool Name */}
              <text
                x={activeTool.x}
                y={tipY + 14}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                letterSpacing="0.02em"
              >
                {activeTool.name}
              </text>
              {/* Tool Role */}
              <text
                x={activeTool.x}
                y={tipY + 27.5}
                textAnchor="middle"
                fill="#e5a47e"
                fontSize="9.5"
                fontWeight="500"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                letterSpacing="0.01em"
              >
                {activeTool.role}
              </text>
            </g>
          )
        })()}

        {/* ── SVG Lighthouse Drawing (Anchored at Bottom-Left Corner) ── */}
        <g className="lhf-tower-svg" onClick={onSurge} style={{ cursor: 'pointer' }} role="button" aria-label="Lighthouse — click to surge lamp">
          {/* Ground & Rock Atmospheric Light Reflection */}
          <ellipse cx="60" cy="188" rx="28" ry="7" fill="url(#lhGroundGlow)" opacity="0.6"/>

          {/* Craggy Coastal Granite Base (faceted 3D rock planes) */}
          {/* Silhouette backdrop */}
          <path d="M-27 220 L-27 196 L-10 188 L12 176 L32 174 L56 178 L82 185 L102 198 L104 220 Z"
            fill="#1e2026"/>

          {/* Faceted Rock Polygons (light/shadow chiseled faces) */}
          <polygon points="-27,196 -8,188 0,204 -18,220 -27,220" fill="#2c2f38"/>
          <polygon points="-8,188 12,176 8,196 0,204" fill="#393e4b"/>
          <polygon points="12,176 34,174 30,192 8,196" fill="#464d5c"/>
          <polygon points="34,174 56,178 52,194 30,192" fill="#3b404e"/>
          <polygon points="56,178 82,185 74,206 52,194" fill="#2f343e"/>
          <polygon points="82,185 102,198 104,220 74,206" fill="#22252c"/>

          {/* Sunlit/Lighthouse-lit Rock Top Crests */}
          <polygon points="-10,188 10,176 12,178 -6,190" fill="#636c7e"/>
          <polygon points="10,176 32,174 34,176 12,178" fill="#758095"/>
          <polygon points="32,174 54,178 52,180 34,176" fill="#626b7c"/>
          <polygon points="56,178 80,185 78,187 54,180" fill="#525b6a"/>

          {/* Rock Crevice Cleft Shadows */}
          <line x1="0" y1="204" x2="-6" y2="220" stroke="#121317" strokeWidth="1.8"/>
          <line x1="8" y1="196" x2="14" y2="220" stroke="#121317" strokeWidth="1.8"/>
          <line x1="30" y1="192" x2="34" y2="220" stroke="#121317" strokeWidth="1.6"/>
          <line x1="52" y1="194" x2="56" y2="220" stroke="#121317" strokeWidth="1.8"/>
          <line x1="74" y1="206" x2="76" y2="220" stroke="#121317" strokeWidth="1.6"/>

          {/* Waterline Surf Spray / Ocean Foam at Base */}
          <path d="M-24 219 Q-10 216 4 219 Q20 215 36 219 Q54 216 72 219 Q88 216 102 219"
            stroke="rgba(215, 230, 245, 0.45)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M-18 220 Q-2 217 16 220 Q34 217 54 220 Q74 217 96 220"
            stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.2" fill="none"/>

          {/* Keeper's Quarters Stone Cottage (Right annex on cliff) */}
          <path d="M54 186 L54 206 L80 206 L80 186 Z" fill="url(#lhStoneGrad)"/>
          <path d="M52 186 L67 174 L82 186 Z" fill="url(#lhRoofGrad)"/>
          <line x1="52" y1="186" x2="67" y2="174" stroke="#607282" strokeWidth="1.4"/>
          <line x1="67" y1="174" x2="82" y2="186" stroke="#253039" strokeWidth="1.4"/>
          {/* Cottage Chimney */}
          <rect x="72" y="170" width="5" height="8" rx="0.5" fill="#3a3028"/>
          <rect x="71" y="169" width="7" height="1.8" rx="0.5" fill="#4d4136"/>
          {/* Cottage Warm Arched Window */}
          <rect x="61" y="188" width="11" height="12" rx="2" fill="#201a14"/>
          <rect x="62.5" y="189.5" width="8" height="9" rx="1" fill="url(#lhWindowGrad)"/>
          <line x1="66.5" y1="189.5" x2="66.5" y2="198.5" stroke="#3d2c18" strokeWidth="0.8"/>
          <line x1="62.5" y1="193.5" x2="70.5" y2="193.5" stroke="#3d2c18" strokeWidth="0.8"/>
          <ellipse cx="66.5" cy="204" rx="8" ry="2.2" fill="#ffb834" opacity="0.25"/>

          {/* Tower Masonry Plinth / Foundation */}
          <path d="M15 165 L13 184 L59 184 L57 165 Z" fill="url(#lhStoneGrad)"/>
          {/* Chamfered ledge transition */}
          <polygon points="13,165 16,162 56,162 59,165" fill="#e8dfd3"/>
          <line x1="14" y1="175" x2="58" y2="175" stroke="#877b6d" strokeWidth="0.75"/>

          {/* Heavy Arch Entrance Doorway */}
          <path d="M31 184 L31 173 Q36 167 41 173 L41 184 Z" fill="#251f1a"/>
          <path d="M32.5 184 L32.5 174 Q36 169 39.5 174 L39.5 184 Z" fill="#483827"/>
          <line x1="36" y1="166" x2="36" y2="169" stroke="#968979" strokeWidth="1.2"/>
          <line x1="32.5" y1="168" x2="34" y2="171" stroke="#968979" strokeWidth="1"/>
          <line x1="39.5" y1="168" x2="38" y2="171" stroke="#968979" strokeWidth="1"/>
          <line x1="33" y1="176" x2="37" y2="176" stroke="#1d1712" strokeWidth="0.9"/>
          <line x1="33" y1="181" x2="37" y2="181" stroke="#1d1712" strokeWidth="0.9"/>

          {/* Main Tower Shaft (tapered stone column with cylindrical shading) */}
          <path d="M23 88 L16.5 163 Q36 166.5 55.5 163 L49 88 Z" fill="url(#lhStoneGrad)"/>

          {/* Nautical Red Bands (cylindrical wrapping curves) */}
          {/* Lower Band */}
          <path d="M18.2 138 L17.2 152 Q36 155.5 54.8 152 L53.8 138 Q36 141.5 18.2 138 Z"
            fill="url(#lhRedBandGrad)"/>
          {/* Upper Band */}
          <path d="M21.6 104 L20.5 118 Q36 121.5 51.5 118 L50.4 104 Q36 107.5 21.6 104 Z"
            fill="url(#lhRedBandGrad)"/>

          {/* Curved Masonry Joint Courses */}
          <path d="M22.5 96 Q36 99 49.5 96" stroke="#aba092" strokeWidth="0.7" fill="none"/>
          <path d="M20.2 125 Q36 128.5 51.8 125" stroke="#aba092" strokeWidth="0.7" fill="none"/>
          <path d="M19.2 132 Q36 135.5 52.8 132" stroke="#aba092" strokeWidth="0.7" fill="none"/>
          <path d="M17.5 158 Q36 161.5 54.5 158" stroke="#aba092" strokeWidth="0.7" fill="none"/>

          {/* Arched Classical Windows on Tower */}
          {/* Upper Window */}
          <path d="M33 97 Q36 93.5 39 97 L39 103 L33 103 Z" fill="#241e18"/>
          <path d="M34 98 Q36 95 38 98 L38 102.2 L34 102.2 Z" fill="url(#lhWindowGrad)"/>
          <line x1="32" y1="103.5" x2="40" y2="103.5" stroke="#9e9182" strokeWidth="1.2"/>
          {/* Mid Window */}
          <path d="M33 127 Q36 123.5 39 127 L39 133 L33 133 Z" fill="#241e18"/>
          <path d="M34 128 Q36 125 38 128 L38 132.2 L34 132.2 Z" fill="url(#lhWindowGrad)"/>
          <line x1="32" y1="133.5" x2="40" y2="133.5" stroke="#9e9182" strokeWidth="1.2"/>

          {/* Gallery Support: Flared Corbel Brackets */}
          <path d="M23 88 Q18 83 11 81.5 L61 81.5 Q54 83 49 88 Z" fill="url(#lhIronGrad)"/>
          {/* Corbel Modillion Brackets */}
          <line x1="15" y1="82" x2="21" y2="87" stroke="#181b1f" strokeWidth="1.5"/>
          <line x1="23" y1="82" x2="26" y2="87" stroke="#181b1f" strokeWidth="1.5"/>
          <line x1="31" y1="82" x2="32" y2="87" stroke="#181b1f" strokeWidth="1.5"/>
          <line x1="41" y1="82" x2="40" y2="87" stroke="#181b1f" strokeWidth="1.5"/>
          <line x1="49" y1="82" x2="46" y2="87" stroke="#181b1f" strokeWidth="1.5"/>
          <line x1="57" y1="82" x2="51" y2="87" stroke="#181b1f" strokeWidth="1.5"/>

          {/* Promenade Deck Platform */}
          <rect x="10" y="80" width="52" height="3" rx="0.8" fill="url(#lhIronGrad)"/>
          <line x1="11" y1="80.5" x2="61" y2="80.5" stroke="#606b77" strokeWidth="0.8"/>

          {/* Cast Iron Gallery Balustrade / Railing */}
          <line x1="11" y1="73.5" x2="61" y2="73.5" stroke="#414952" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="11.5" y1="77" x2="60.5" y2="77" stroke="#252a30" strokeWidth="0.8"/>
          {/* Vertical Balusters */}
          {[14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58].map((bx) => (
            <line key={`bal-${bx}`} x1={bx} y1="73.5" x2={bx} y2="80" stroke="#1e2329" strokeWidth="0.9"/>
          ))}
          <circle cx="11.5" cy="73" r="1.2" fill="#758291"/>
          <circle cx="60.5" cy="73" r="1.2" fill="#758291"/>

          {/* Lantern Room Parapet / Base ring */}
          <rect x="18" y="78" width="36" height="3" rx="0.6" fill="#222830"/>
          <line x1="19" y1="78.5" x2="53" y2="78.5" stroke="#485360" strokeWidth="0.6"/>

          {/* Lantern Room Glass Chamber (Center: LX=36, LY=68) */}
          <rect x="19" y="58" width="34" height="20" rx="2" fill="#14181e"/>
          <rect x="19" y="58" width="34" height="20" rx="2" fill="#ffc85a" opacity="0.18"/>

          {/* Internal Brass Fresnel Lamp Pedestal */}
          <rect x="34" y="71" width="4" height="7" rx="0.5" fill="#8f6929"/>
          <rect x="31.5" y="69.5" width="9" height="2" rx="0.5" fill="#cca34b"/>

          {/* Glass Pane Diagonal Astragal Lattice Framing */}
          <line x1="19" y1="58" x2="27.5" y2="78" stroke="#2d3744" strokeWidth="0.8" strokeOpacity="0.85"/>
          <line x1="27.5" y1="58" x2="19" y2="78" stroke="#2d3744" strokeWidth="0.8" strokeOpacity="0.85"/>
          <line x1="27.5" y1="58" x2="36" y2="78" stroke="#2d3744" strokeWidth="0.8" strokeOpacity="0.85"/>
          <line x1="36" y1="58" x2="27.5" y2="78" stroke="#2d3744" strokeWidth="0.8" strokeOpacity="0.85"/>
          <line x1="36" y1="58" x2="44.5" y2="78" stroke="#2d3744" strokeWidth="0.8" strokeOpacity="0.85"/>
          <line x1="44.5" y1="58" x2="36" y2="78" stroke="#2d3744" strokeWidth="0.8" strokeOpacity="0.85"/>
          <line x1="44.5" y1="58" x2="53" y2="78" stroke="#2d3744" strokeWidth="0.8" strokeOpacity="0.85"/>
          <line x1="53" y1="58" x2="44.5" y2="78" stroke="#2d3744" strokeWidth="0.8" strokeOpacity="0.85"/>

          {/* Vertical Cast-Iron Mullion Ribs */}
          <line x1="19" y1="58" x2="19" y2="78" stroke="#1c2128" strokeWidth="2"/>
          <line x1="27.5" y1="58" x2="27.5" y2="78" stroke="#252c36" strokeWidth="1.5"/>
          <line x1="36" y1="58" x2="36" y2="78" stroke="#28303a" strokeWidth="1.4"/>
          <line x1="44.5" y1="58" x2="44.5" y2="78" stroke="#252c36" strokeWidth="1.5"/>
          <line x1="53" y1="58" x2="53" y2="78" stroke="#1c2128" strokeWidth="2"/>

          {/* Glass Reflection Glints */}
          <line x1="22" y1="59" x2="26" y2="77" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="47" y1="59" x2="50" y2="77" stroke="rgba(255,255,255,0.22)" strokeWidth="0.9" strokeLinecap="round"/>

          {/* Lantern Dome Eave Cornice */}
          <rect x="16" y="56" width="40" height="3" rx="0.8" fill="url(#lhIronGrad)"/>
          <line x1="17" y1="56.5" x2="55" y2="56.5" stroke="#687888" strokeWidth="0.7"/>

          {/* Swept Bell-Shaped Copper Dome */}
          <path d="M17 56 C19 48, 26 38, 36 36 C46 38, 53 48, 55 56 Z" fill="url(#lhRoofGrad)"/>
          {/* Copper Seam Ribs */}
          <path d="M26 56 C28 48, 32 41, 36 36" stroke="#161e25" strokeWidth="1" fill="none"/>
          <path d="M46 56 C44 48, 40 41, 36 36" stroke="#161e25" strokeWidth="1" fill="none"/>
          <path d="M26.5 56 C28.5 48, 32.5 41, 36 36" stroke="#62788c" strokeWidth="0.6" fill="none"/>

          {/* Ventilator Cap, Brass Ball & Spire Needle */}
          <rect x="33.5" y="34" width="5" height="3" rx="0.5" fill="#252f38"/>
          <circle cx="36" cy="32" r="3.2" fill="#cca34b"/>
          <circle cx="35" cy="31" r="1.2" fill="#fff4b8"/>
          <rect x="34" y="27" width="4" height="2.5" rx="0.4" fill="#1e2730"/>
          <line x1="36" y1="18" x2="36" y2="28" stroke="#9bb1c4" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="36" cy="18" r="1.1" fill="#e0f2fe"/>

          {/* ── Lantern Radiant Glow Circles at exact (LX, LY) = (36, 68) ── */}
          <circle cx={LX} cy={LY} r="28" fill="url(#lFlare)"
            className="lhf-lantern-flare-circle"/>
          <circle cx={LX} cy={LY} r="17" fill="url(#lGlow)"
            className="lhf-lantern-glow"/>
          <circle cx={LX} cy={LY} r="6" fill="#fffde0"
            className="lhf-lantern-core-circle"/>
        </g>

        {/* ── Tagline ── */}
        <text x={96} y={SVG_H - 10} className="lhf-caption-svg">
          The beam stays. The tools don't.
        </text>
      </svg>
    </div>
  )
}
