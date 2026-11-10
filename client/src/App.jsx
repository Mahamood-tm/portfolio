import { useCallback, useState } from 'react'
import ParticleName from './components/ParticleName.jsx'
import InterestModal from './components/InterestModal.jsx'
import { profile, intro, about, path, projects, skills, certifications } from './data.js'

const NAME_WORDS = [profile.firstName, profile.lastName]

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [openProject, setOpenProject] = useState(0)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>

      <header className="nav">
        <a className="nav-mark" href="#top" aria-label="Back to top">
          <span className="mark-square" aria-hidden="true" />
          Mahamood
        </a>
        <nav aria-label="Sections">
          <a href="#about">About</a>
          <a href="#path">Path</a>
          <a href="#work">Work</a>
          <a href="#toolkit">Toolkit</a>
        </nav>
        <button className="btn btn-primary btn-small" onClick={openModal}>
          I'm interested
        </button>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <p className="hero-meta">
            <span>{profile.role}</span>
            <span className="sep" aria-hidden="true" />
            <span>{profile.location}</span>
          </p>
          <ParticleName words={NAME_WORDS} label={`${profile.firstName} ${profile.lastName}`} />
          <div className="hero-foot">
            <p className="hero-intro">{intro}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={openModal}>
                I'm interested
              </button>
              <a className="btn btn-ghost" href={profile.resume} download>
                Download résumé
              </a>
            </div>
          </div>
          <p className="hero-hint" aria-hidden="true">Move your pointer through the letters.</p>
        </section>

        <section className="section" id="about">
          <h2 className="section-title">About</h2>
          <div className="section-body prose">
            {about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </section>

        <section className="section" id="path">
          <h2 className="section-title">Path</h2>
          <ol className="timeline section-body">
            {path.map((item) => (
              <li key={item.title} className="timeline-item">
                <p className="timeline-when">{item.when}</p>
                <div>
                  <h3>{item.title}</h3>
                  <p className="timeline-org">{item.org}</p>
                  {item.stack && <p className="timeline-stack">{item.stack}</p>}
                  {item.points && (
                    <ul className="ticks">
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

        <section className="section" id="work">
          <h2 className="section-title">Work</h2>
          <div className="projects section-body">
            {projects.map((p, i) => {
              const isOpen = openProject === i
              const panelId = `project-panel-${i}`
              return (
                <article key={p.name} className={`project${isOpen ? ' is-open' : ''}`}>
                  <button
                    className="project-head"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenProject(isOpen ? -1 : i)}
                  >
                    <span className="project-name">{p.name}</span>
                    <span className={`project-status${p.status === 'Live' ? ' is-live' : ''}`}>
                      {p.status === 'Live' && <span className="pulse" aria-hidden="true" />}
                      {p.status}
                    </span>
                    <span className="project-toggle" aria-hidden="true" />
                  </button>
                  <div className="project-panel" id={panelId} role="region">
                    <div className="project-inner">
                      <p className="project-context">{p.context}</p>
                      <ul className="ticks">
                        {p.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                      <p className="chips">
                        {p.stack.map((s) => (
                          <span key={s} className="chip">{s}</span>
                        ))}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="section" id="toolkit">
          <h2 className="section-title">Toolkit</h2>
          <div className="section-body">
            <dl className="skills">
              {skills.map((s) => (
                <div key={s.group} className="skill-row">
                  <dt>{s.group}</dt>
                  <dd>{s.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
            <h3 className="sub-title">Certifications</h3>
            <ul className="plain-list">
              {certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cta" id="contact">
          <h2 className="cta-title">Hiring, or building something?</h2>
          <p className="cta-text">
            Tell me who you are and I'll reply by email. I'm open to full-time software engineer roles and
            freelance builds.
          </p>
          <button className="btn btn-primary btn-large" onClick={openModal}>
            I'm interested
          </button>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mahamood T M</p>
        <ul>
          <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
      </footer>

      <InterestModal open={modalOpen} onClose={closeModal} />
    </>
  )
}
