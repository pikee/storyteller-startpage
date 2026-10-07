class Links extends Component {
  constructor() {
    super();
  }

  static getIcon(link) {
    const defaultColor = "#726f6f";

    return link.icon
      ? `<i class="ti ti-${link.icon} link-icon"
            style="color: ${link.icon_color ?? defaultColor}"></i>`
      : "";
  }

  static getAll(tabName, tabs) {
    const { categories } = tabs.find((f) => f.name === tabName);

    return `
      ${
      categories.map(({ name, links }) => {
        return `
          <li>
            <h1>${name}</h1>
              <div class="links-wrapper">
              ${
          links.map((link) => `
                  <div class="link-info">
                    <a href="${link.url}">
                      ${Links.getIcon(link)}
                      ${
            link.name ? `<p class="link-name">${link.name}</p>` : ""
          }
                    </a>
                </div>`).join("")
        }
            </div>
          </li>`;
      }).join("")
    }
    `;
  }
}

class Category extends Component {
  constructor() {
    super();
  }

  static getBackgroundStyle(url) {
    return `style="background-image: url(${url});"`;
  }

  static getAll(tabs) {
    return `
      ${
      tabs.map(({ name, background_url }, index) => {
        return `<ul class="${name}" ${index == 0 ? "active" : ""}>
            <div class="banner" ${Category.getBackgroundStyle(background_url)}></div>
            <div class="links">${Links.getAll(name, tabs)}</div>
            <span class="category-label" aria-hidden="true">${Array.from(name.toLowerCase(), letter => `<span>${letter}</span>`).join("")}</span>
          </ul>`;
      }).join("")
    }
    `;
  }
}

class Tabs extends Component {
  refs = {};

  constructor() {
    super();
    this.tabs = CONFIG.tabs;
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.icons.tabler,
      this.resources.fonts.roboto,
      this.resources.fonts.raleway,
    ];
  }

  style() {
    return `
      :host { display: block; }
      #links {
          display: grid;
          place-items: center;
          min-height: 100svh;
          padding: 64px 0 108px;
      }
      #panels { position: relative; width: 90%; max-width: 1200px; height: 450px; }
      status-bar {
          display: block;
          position: absolute;
          inset: auto 0 -68px;
          height: 46px;
          border: 1px solid var(--line);
          border-radius: 9px;
          background: var(--glass);
          backdrop-filter: blur(20px) saturate(.85);
          box-shadow: 0 8px 32px rgb(10 23 24 / 16%), inset 0 1px rgb(255 255 230 / 4%);
      }
      .categories {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: var(--glass);
          backdrop-filter: blur(20px) saturate(.85);
          box-shadow: 0 20px 70px rgb(11 24 24 / 24%), inset 0 1px rgb(255 255 230 / 5%);
      }
      .categories ul {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: min(40%, 366px) minmax(0, 1fr);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateX(-12px);
          transition: opacity 220ms var(--ease), transform 300ms var(--ease), visibility 220ms;
      }
      .categories ul[active] {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(0);
          z-index: 1;
      }
      .banner {
          position: relative;
          height: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          border-right: 1px solid var(--line);
          filter: saturate(.5);
      }
      .banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgb(28 48 45 / 12%), rgb(28 48 45 / 45%));
          box-shadow: inset -20px 0 40px rgb(20 39 37 / 12%);
      }
      .category-label {
          position: absolute;
          top: 50%;
          left: 15%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 76px;
          height: 300px;
          max-height: 90%;
          padding: 24px 12px;
          font: 300 32px / 1 var(--font-display);
          color: var(--text);
          border: 1px solid rgb(222 198 135 / 46%);
          border-radius: 5px;
          background: rgb(33 53 48 / 48%);
          backdrop-filter: blur(8px);
          text-shadow: 0 2px 12px rgb(16 26 23 / 40%);
          pointer-events: none;
      }
      .category-label > span {
          display: grid;
          place-items: center;
          flex: 0 0 1em;
          width: 1em;
          line-height: 1;
      }
      .links {
          min-width: 0;
          overflow: auto;
          align-content: center;
          padding: 34px clamp(26px, 4.3vw, 58px);
          scrollbar-width: thin;
          scrollbar-color: var(--line) transparent;
      }
      .links li { list-style: none; }
      .links li + li { border-top: 1px solid var(--line); margin-top: 22px; padding-top: 18px; }
      .links h1 {
          margin-bottom: 12px;
          color: var(--accent);
          font: 300 25px / 1.1 var(--font-display);
          letter-spacing: .025em;
      }
      .links-wrapper { display: flex; flex-wrap: wrap; gap: 9px; }
      .link-info { min-width: 0; display: flex; }
      .links a {
          display: inline-flex;
          align-items: center;
          min-height: 42px;
          max-width: 100%;
          gap: 10px;
          padding: 8px 13px;
          border: 1px solid rgb(210 212 179 / 13%);
          border-radius: 5px;
          background: rgb(179 189 157 / 5%);
          color: var(--text);
          font: 400 15px / 1.35 var(--font-ui);
          transition: background 160ms var(--ease), border-color 160ms var(--ease), transform 180ms var(--ease);
      }
      .links a:hover {
          background: rgb(213 182 109 / 15%);
          border-color: rgb(213 182 109 / 46%);
          transform: translateY(-1px);
      }
      .links a:active { transform: translateY(0); }
      .link-name { overflow-wrap: anywhere; }
      .link-icon { flex-shrink: 0; font-size: 23px; filter: saturate(.72); }
      search-bar:not(:defined), config-tab:not(:defined), status-bar:not(:defined) { display: none; }
      @media (max-width: 800px) {
          #panels { width: 92%; height: 480px; }
          .categories ul { grid-template-columns: min(50%, 390px) minmax(0, 1fr); }
          .links { padding: 28px; }
          .links a { padding: 8px 10px; font-size: 14px; gap: 8px; }
      }
      @media (max-width: 540px) {
          #links { padding: 32px 0 102px; }
          #panels { height: 548px; }
          .categories ul { grid-template-columns: 23% 77%; }
          .category-label { left: 11.5%; width: 52px; height: 270px; font-size: 27px; }
          .links { padding: 22px 16px; }
          .links h1 { font-size: 24px; }
          .links-wrapper { gap: 7px; }
          .links li + li { margin-top: 18px; padding-top: 16px; }
          .links a { min-height: 40px; padding: 8px; font-size: 13px; gap: 7px; }
          .link-icon { font-size: 20px; }
          status-bar { bottom: -76px; height: 58px; }
      }
    `;
  }

  template() {
    return `
      <div id="links" class="-">

        <div id="panels">
          <div class="categories">
            ${Category.getAll(this.tabs)}
            <search-bar></search-bar>
            <config-tab></config-tab>
          </div>
          <status-bar class="!-"></status-bar>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.render().then(() => {
      document.fonts.ready.then(() => this.equalizeCategoryLabelSpacing());
    });
  }

  equalizeCategoryLabelSpacing() {
    const labels = this.shadow.querySelectorAll('.category-label');
    const context = document.createElement('canvas').getContext('2d');

    if (!context) return;

    labels.forEach((label) => {
      const style = getComputedStyle(label);
      const fontSize = parseFloat(style.fontSize);
      const letters = [...label.children];
      const font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
      context.font = font;

      const metrics = letters.map((letter) => context.measureText(letter.textContent));
      const targetGap = fontSize * .32;

      letters.forEach((letter, index) => {
        const current = metrics[index];
        const next = metrics[index + 1];

        letter.style.marginBlockEnd = next
          ? `${(targetGap + current.actualBoundingBoxDescent + next.actualBoundingBoxAscent - fontSize) / fontSize}em`
          : '0';
      });
    });
  }
}
