import { useCallback, useEffect, useState } from 'react'
import InterestModal from './components/InterestModal.jsx'
import Btn from './components/Btn.jsx'
import Icon from './components/Icon.jsx'
import HeroVisual from './components/HeroVisual.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import CountUp from './components/CountUp.jsx'
import {
  profile,
  hero,
  ring,
  about,
  aboutStats,
  path,
  projects,
  skills,
  certifications,
} from './data.js'

const SECTIONS = [
  ['about', 'About'],
  ['work', 'Work'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
]

// Fades every [data-reveal] element up the first time it scrolls into view.
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// Tracks the section on screen and whether the page has scrolled.
function useNav() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ;['top', ...SECTIONS.map(([id]) => id), 'contact'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])
  return { active, scrolled }
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [openProject, setOpenProject] = useState(0)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])
  const { active, scrolled } = useNav()
  useReveal()

  return (
    <>
      <ScrollProgress />
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a className="logo" href="#top" aria-label="Mahamood, back to top">
          Mahamood<sup>°</sup>
        </a>
        <nav className="nav-pill" aria-label="Sections">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <Btn size="small" icon="arrow-up-right" onClick={openModal}>
          I'm interested
        </Btn>
      </header>

      <main id="main">
        {/* ---------------- Hero ---------------- */}
        <section className="hero" id="top">
          <div className="badge load" style={{ '--d': 6 }} aria-hidden="true">
            <svg viewBox="0 0 120 120" className="badge-ring">
              <defs>
                <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#badge-circle" textLength="286" lengthAdjust="spacing">
                  {hero.badge}
                </textPath>
              </text>
            </svg>
            <Icon name="star" size={22} className="badge-star" />
          </div>

          <h1 className="hero-title">
            <span className="load" style={{ '--d': 0 }}>
              {hero.title}
            </span>
            <em className="load" style={{ '--d': 1 }}>
              {hero.titleItalic}
            </em>
          </h1>
          <p className="hero-sub load" style={{ '--d': 2 }}>
            {hero.sub}
          </p>
          <div className="hero-actions load" style={{ '--d': 3 }}>
            <Btn size="large" icon="arrow" onClick={openModal}>
              I'm interested
            </Btn>
            <Btn as="a" variant="light" size="large" iconLeft="download" href={profile.resume} download>
              Download résumé
            </Btn>
          </div>

          <div className="stage">
            <svg className="stage-lines" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength={1} d="M170 150 C 170 300, 320 340, 470 330" />
              <path pathLength={1} d="M1030 250 C 1030 380, 880 400, 740 390" />
            </svg>

            <div className="float-card float-left load" style={{ '--d': 5 }}>
              <span className="float-icon">
                <Icon name="wave" size={20} />
              </span>
              <strong>{hero.leftCard.title}</strong>
              <small>{hero.leftCard.text}</small>
            </div>

            <div className="float-card float-right load" style={{ '--d': 6 }}>
              <span className="stack-dots">
                <i>R</i>
                <i>N</i>
                <i>S</i>
                <i className="plus">
                  <Icon name="plus" size={12} />
                </i>
              </span>
              <strong>{hero.rightCard.title}</strong>
              <small>{hero.rightCard.text}</small>
            </div>

            <div className="load" style={{ '--d': 4 }}>
              <HeroVisual cards={ring} />
            </div>

            <div className="corner corner-left load" style={{ '--d': 7 }}>
              <span className="corner-rule" />
              {hero.bottomLeft.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <div className="corner corner-right load" style={{ '--d': 7 }}>
              <Icon name="star" size={16} className="corner-star" />
              <span className="corner-rule" />
              {hero.bottomRight.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- About ---------------- */}
        <section className="section about" id="about">
          <h2 className="serif-h" data-reveal>
            About <em>me.</em>
          </h2>
          <div className="about-body">
            {about.map((p, i) => (
              <p key={p.slice(0, 24)} data-reveal style={{ '--d': i + 1 }}>
                {p}
              </p>
            ))}
            <dl className="about-stats">
              {aboutStats.map((s, i) => (
                <div key={s.label} className="mini-card" data-reveal style={{ '--d': i + 2 }}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------- Work ---------------- */}
        <section className="section" id="work">
          <div className="section-head">
            <h2 className="serif-h" data-reveal>
              Selected <em>work.</em>
            </h2>
            <p className="section-note" data-reveal style={{ '--d': 1 }}>
              Three full-stack builds, from a live retail platform to a healthcare portal. Open one to see how it works.
            </p>
          </div>

          <div className="projects">
            {projects.map((p, i) => {
              const isOpen = openProject === i
              const panelId = `project-panel-${i}`
              return (
                <article
                  key={p.name}
                  className={`project card${isOpen ? ' is-open' : ''}`}
                  data-reveal
                  style={{ '--d': i }}
                >
                  <button
                    className="project-head"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenProject(isOpen ? -1 : i)}
                  >
                    <span className="project-titles">
                      <span className="project-context">{p.context}</span>
                      <span className="project-name">{p.name}</span>
                    </span>
                    <span className={`pill-status${p.status === 'Live' ? ' is-live' : ''}`}>
                      {p.status === 'Live' && <span className="live-dot" aria-hidden="true" />}
                      {p.status}
                    </span>
                    <span className="round-toggle" aria-hidden="true">
                      <Icon name="plus" size={18} />
                    </span>
                  </button>

                  <div className="project-panel" id={panelId} role="region" aria-label={p.name}>
                    <div className="project-inner">
                      <div className="project-body">
                        <div className="project-top">
                          <p className="project-summary">{p.summary}</p>
                          <dl className="stats">
                            {p.stats.map((s) => (
                              <div className="stat" key={s.label}>
                                <dt>{s.label}</dt>
                                <dd>
                                  <CountUp value={s.value} suffix={s.suffix} active={isOpen} />
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>

                        <div className="groups">
                          {p.groups.map((g) => (
                            <section className="group" key={g.title}>
                              <h4>{g.title}</h4>
                              <ul>
                                {g.points.map((pt) => (
                                  <li key={pt}>{pt}</li>
                                ))}
                              </ul>
                            </section>
                          ))}
                        </div>

                        <p className="chips">
                          {p.stack.map((s) => (
                            <span key={s} className="chip">
                              {s}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ---------------- Experience ---------------- */}
        <section className="section" id="experience">
          <div className="section-head">
            <h2 className="serif-h" data-reveal>
              Experience <em>&amp; education.</em>
            </h2>
          </div>
          <ol className="xp">
            {path.map((item, i) => (
              <li key={item.title} className="xp-item card" data-reveal style={{ '--d': i }}>
                <span className="xp-when">{item.when}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p className="xp-org">{item.org}</p>
                  {item.stack && <p className="xp-stack">{item.stack}</p>}
                  {item.points && (
                    <ul className="dots">
                      {item.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- Skills ---------------- */}
        <section className="section" id="skills">
          <div className="section-head">
            <h2 className="serif-h" data-reveal>
              Tools I <em>work with.</em>
            </h2>
          </div>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <div key={s.group} className="skill-card card" data-reveal style={{ '--d': i % 3 }}>
                <h3>{s.group}</h3>
                <p className="chips">
                  {s.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </p>
              </div>
            ))}
            <div className="skill-card card" data-reveal style={{ '--d': 2 }}>
              <h3>Certifications</h3>
              <ul className="dots">
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- Contact ---------------- */}
        <section className="section" id="contact">
          <div className="cta" data-reveal>
            <Icon name="star" size={20} className="cta-star cta-star-a" />
            <Icon name="star" size={12} className="cta-star cta-star-b" />
            <h2 className="cta-title">
              Let's build <em>something real.</em>
            </h2>
            <p className="cta-text">
              Hiring for a software engineer, or need a full-stack build? Leave your details and I'll reply by email.
            </p>
            <div className="cta-actions">
              <Btn variant="white" size="large" icon="arrow" onClick={openModal}>
                I'm interested
              </Btn>
              <a className="cta-mail" href={`mailto:${profile.email}`}>
                <Icon name="mail" size={16} />
                {profile.email}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span className="logo">
          Mahamood<sup>°</sup>
        </span>
        <p>© {new Date().getFullYear()} Mahamood T M, Kannur, Kerala</p>
        <ul>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={profile.resume} download>
              Résumé
            </a>
          </li>
        </ul>
      </footer>

      <InterestModal open={modalOpen} onClose={closeModal} />
    </>
  )
}