import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./Home.css";

export default function Home() {
    const navigate =useNavigate();

    function handlePlanRoute(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const start = formData.get("start")
        const destination = formData.get("destination")

        navigate(
          `/map?start=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}`
        );
    }

  function handleHeroImageError(event) {
    event.currentTarget.src = "/assets/hero-accessible-city-fallback.svg";
    event.currentTarget.alt =
      "Platzhaltergrafik.";
  }

  return (
    <>
      <Header />
      <main id="main-content" className="landing" aria-labelledby="landing-title">
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="eyebrow">AccessNow+</p>
            <h1 id="landing-title">Navigation that fits your life.</h1>
            <p className="lede">
              Plan routes with step-free paths, and clear guidance for every mobility need.
            </p>

            <form className="route-form" onSubmit={handlePlanRoute} aria-label="Plan route">
              <div className="form-field">
                <label htmlFor="start">Start</label>
                <input
                  id="start"
                  name="start"
                  type="text"
                  placeholder="Enter starting point"
                  autoComplete="street-address"
                  aria-describedby="start-help"
                  required
                />
                <p id="start-help" className="field-help">
                  Type an address.
                </p>
              </div>

              <div className="form-field">
                <label htmlFor="destination">Destination</label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  placeholder="Enter destination"
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit">Plan route</button>
                <Link to="/login" className="ghost-button">
                  Log in to see recent trips
                </Link>
              </div>
            </form>

            <div className="hero-footnote">
              Built to meet WCAG AA
            </div>
          </div>

          <figure className="hero-visual">
            <div className="visual-frame">
              <img
                className="hero-image"
                src="/assets/hero-accessible-city.jpg.png"
                alt="Menschen nutzen Navigations-App."
                loading="lazy"
                onError={handleHeroImageError}
              />
            </div>
            <figcaption className="visually-hidden">
              Menschen mit unterschiedlichen Mobilitätsbedürfnissen.
            </figcaption>
          </figure>
        </section>

        <section className="feature-grid" aria-label="Highlights">
          <article className="feature-card">
            <p className="eyebrow">Inclusive by default</p>
            <h2>Clarity for every user</h2>
            <p>
              High-contrast palette, readable typography, and keyboard-first flows keep the experience frictionless.
            </p>
          </article>
          <article className="feature-card">
            <p className="eyebrow">Access intelligence</p>
            <h2>Step-free routing</h2>
            <p>Parking, public restrooms, real-time elevator status. Choose routes that match your mobility aids.</p>
          </article>
          <article className="feature-card">
            <p className="eyebrow">Privacy first</p>
            <h2>Local-first preferences</h2>
            <p>We keep your mobility settings on your device; you control when to share.</p>
          </article>
        </section>
      </main>
    </>
  );
}
