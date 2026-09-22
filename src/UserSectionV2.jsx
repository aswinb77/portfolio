import './UserSectionV2.css'

const TECH_ELEMENTS = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    icon: '/claude.png',
    animClass: 'float-anim--1',
    coords: { top: '12%', left: '16%' },
    badgeClass: 'user-v2__logo-pure--claude',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '/typescript.svg',
    animClass: 'float-anim--2',
    coords: { top: '32%', left: '10%' },
    badgeClass: 'user-v2__logo-pure--typescript',
  },
  {
    id: 'react',
    name: 'React',
    icon: '/react-dark.svg',
    animClass: 'float-anim--3',
    coords: { top: '52%', left: '8%' },
    badgeClass: 'user-v2__logo-pure--react',
  },
  {
    id: 'git',
    name: 'Git',
    icon: '/git.svg',
    animClass: 'float-anim--4',
    coords: { top: '74%', left: '16%' },
    badgeClass: 'user-v2__logo-pure--git',
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    icon: '/antigravity.svg',
    animClass: 'float-anim--5',
    coords: { top: '12%', right: '16%' },
    badgeClass: 'user-v2__logo-pure--antigravity',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    icon: '/flutter.svg',
    animClass: 'float-anim--6',
    coords: { top: '32%', right: '10%' },
    badgeClass: 'user-v2__logo-pure--flutter',
  },
  {
    id: 'postman',
    name: 'Postman',
    icon: '/postman.svg',
    animClass: 'float-anim--7',
    coords: { top: '52%', right: '8%' },
    badgeClass: 'user-v2__logo-pure--postman',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '/github.svg',
    animClass: 'float-anim--8',
    coords: { top: '74%', right: '16%' },
    badgeClass: 'user-v2__logo-pure--github',
  },
]

export default function UserSectionV2() {
  return (
    <section className="user-v2-section" id="developer-v2">
      <div className="user-v2__container">
        
        {/* Header without doodle icon */}
        <div className="user-v2__heading-wrap">
          <h2 className="user-v2__title">My Skills</h2>
          <p className="user-v2__subtitle">
            My go to tools for making ideas come to life.
          </p>
        </div>

        {/* Hero Stage: Still Character + Non-Interactive Floating Logos */}
        <div className="user-v2__stage">
          
          {/* Centered Character (Anchored, Still) */}
          <div className="user-v2__character-anchor">
            <div className="user-v2__ground-shadow" aria-hidden="true" />
            <picture>
              <source srcSet="/user-v2-transparent.webp" type="image/webp" />
              <img
                src="/user-v2-transparent.png"
                alt="Aswin Biju - Developer"
                className="user-v2__character-img"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>

          {/* Floating Logos Layer (Pure float, no hover effects) */}
          <div className="user-v2__floating-layer">
            {TECH_ELEMENTS.map((tech) => (
              <div
                key={tech.id}
                className={`user-v2__logo-item ${tech.animClass}`}
                style={tech.coords}
                aria-label={tech.name}
              >
                <div className={`user-v2__logo-pure ${tech.badgeClass}`}>
                  <img
                    src={tech.icon}
                    alt={tech.name}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
