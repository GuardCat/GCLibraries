<style>
  :root {
    --gc-bg: #f6f8fc;
    --gc-surface: #ffffff;
    --gc-text: #182033;
    --gc-muted: #667085;
    --gc-accent: #4f6df5;
    --gc-accent-hover: #3f5bd8;
    --gc-border: #e7eaf1;
    --gc-shadow: 0 18px 45px rgba(32, 45, 80, 0.10);
  }

  .gc-page {
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--gc-text);
    background:
      radial-gradient(circle at 10% 0%, rgba(79,109,245,.10), transparent 32%),
      radial-gradient(circle at 95% 8%, rgba(144,103,255,.08), transparent 30%),
      var(--gc-bg);
    border-radius: 28px;
    padding: clamp(28px, 6vw, 64px);
    margin: 18px 0 28px;
  }

  .gc-brand {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 8px 12px;
    border: 1px solid var(--gc-border);
    border-radius: 999px;
    background: rgba(255,255,255,.78);
    color: var(--gc-muted);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .04em;
  }

  .gc-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f6df5, #8c67ff);
    box-shadow: 0 0 0 5px rgba(79,109,245,.10);
  }

  .gc-hero {
    padding: clamp(42px, 8vw, 86px) 0 clamp(32px, 6vw, 58px);
  }

  .gc-kicker {
    margin: 0 0 12px;
    color: var(--gc-accent);
    font-size: 13px;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .gc-title {
    margin: 0;
    max-width: 760px;
    color: var(--gc-text);
    font-size: clamp(38px, 7vw, 70px);
    line-height: 1.02;
    letter-spacing: -.045em;
    font-weight: 800;
  }

  .gc-intro {
    max-width: 650px;
    margin: 20px 0 0;
    color: var(--gc-muted);
    font-size: clamp(16px, 2vw, 19px);
    line-height: 1.65;
  }

  .gc-section-title {
    margin: 0 0 16px;
    color: var(--gc-text);
    font-size: 14px;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .gc-card {
    position: relative;
    overflow: hidden;
    background: var(--gc-surface);
    border: 1px solid var(--gc-border);
    border-radius: 22px;
    padding: clamp(24px, 5vw, 38px);
    box-shadow: var(--gc-shadow);
  }

  .gc-card::before {
    content: "";
    position: absolute;
    width: 180px;
    height: 180px;
    right: -70px;
    top: -80px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(79,109,245,.15), rgba(140,103,255,.05));
  }

  .gc-card-label {
    position: relative;
    margin: 0 0 12px;
    color: var(--gc-accent);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .09em;
    text-transform: uppercase;
  }

  .gc-card-title {
    position: relative;
    margin: 0;
    max-width: 720px;
    color: var(--gc-text);
    font-size: clamp(25px, 4vw, 34px);
    line-height: 1.18;
    letter-spacing: -.025em;
    font-weight: 750;
  }

  .gc-card-subtitle {
    position: relative;
    margin: 12px 0 26px;
    max-width: 640px;
    color: var(--gc-muted);
    font-size: 17px;
    line-height: 1.55;
  }

  .gc-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 112px;
    padding: 12px 18px;
    border-radius: 12px;
    background: var(--gc-accent);
    color: #fff !important;
    font-weight: 700;
    text-decoration: none !important;
    transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
    box-shadow: 0 8px 18px rgba(79,109,245,.22);
  }

  .gc-button:hover {
    background: var(--gc-accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 11px 24px rgba(79,109,245,.28);
  }

  .gc-footer {
    margin-top: 28px;
    color: var(--gc-muted);
    font-size: 13px;
  }

  @media (max-width: 560px) {
    .gc-page {
      border-radius: 20px;
      padding: 24px 18px;
    }

    .gc-hero {
      padding-top: 38px;
    }
  }
</style>

<div class="gc-page">
  <div class="gc-brand">
    <span class="gc-dot"></span>
    GuardCat inc
  </div>

  <section class="gc-hero">
    <p class="gc-kicker">GuardCat inc</p>
    <h1 class="gc-title">Интересные проекты</h1>
    <p class="gc-intro">
      Небольшая коллекция инструментов, которые помогают принимать решения
      и лучше понимать собственные приоритеты.
    </p>
  </section>

  <section>
    <p class="gc-section-title">Проекты</p>

    <div class="gc-card">
      <p class="gc-card-label">Инструмент</p>
      <h2 class="gc-card-title">Выбор из множества вариантов</h2>
      <p class="gc-card-subtitle">Сравните варианты попарно и получите рейтинг для обоснованного выбора.</p>
      <a class="gc-button" href="./ValuePairs/pairs.html">Открыть</a>
    </div>
  </section>

  <div class="gc-footer">GuardCat inc</div>
</div>

