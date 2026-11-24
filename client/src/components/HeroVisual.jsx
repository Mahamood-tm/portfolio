import Icon from './Icon.jsx'

// A ring of glass cards slowly orbiting the centre piece, all in 3D CSS.
// Pass `portrait` (an image path) to show a photo; leave it out to show the code window.
export default function HeroVisual({ cards, portrait }) {
  const step = 360 / cards.length
  return (
    <div className="hv" aria-hidden="true">
      <div className={`hv-scene${portrait ? ' is-portrait' : ''}`}>
        <div className="hv-tilt">
          <div className="hv-ring">
            {cards.map((c, i) => (
              <div className="hv-card" key={c.title} style={{ '--a': `${i * step}deg` }}>
                <div className="hv-face hv-front">
                  <span className="hv-icon" style={{ background: c.tint }}>
                    <Icon name={c.icon} size={16} />
                  </span>
                  <span className="hv-text">
                    <strong>{c.title}</strong>
                    <small>{c.text}</small>
                  </span>
                </div>
                <div className="hv-face hv-back">
                  <span className="hv-icon" style={{ background: c.tint }}>
                    <Icon name={c.icon} size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {portrait ? (
          <div className="hv-portrait">
            <img src={portrait} alt="" width="720" height="900" />
          </div>
        ) : (
        <div className="hv-code">
          <div className="hv-bar">
            <i />
            <i />
            <i />
            <span>server/index.js</span>
          </div>
          <pre>
            <code>
              <span className="c-mute">{'// save everyone who clicks "interested"'}</span>
              {'\n'}
              <span className="c-key">app</span>.<span className="c-fn">post</span>(
              <span className="c-str">'/api/interest'</span>, <span className="c-key">async</span> (req, res) =&gt; {'{'}
              {'\n  '}
              <span className="c-key">const</span> {'{ name, email, company }'} = req.body
              {'\n  '}
              <span className="c-key">await</span> supabase.<span className="c-fn">from</span>(
              <span className="c-str">'interests'</span>)
              {'\n    '}.<span className="c-fn">insert</span>({'{ name, email, company }'})
              {'\n  '}res.<span className="c-fn">status</span>(<span className="c-num">201</span>).
              <span className="c-fn">json</span>({'{ ok: '}
              <span className="c-key">true</span>
              {' })'}
              {'\n})'}
              <span className="caret" />
            </code>
          </pre>
        </div>
        )}
      </div>
    </div>
  )
}