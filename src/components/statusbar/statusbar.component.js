class Statusbar extends Component {
  externalRefs = {};

  refs = {
    categories: ".categories ul",
    tabs: "#tabs ul li",
    indicator: ".indicator",
    fastlink: ".fastlink",
  };

  currentTabIndex = 0;

  constructor() {
    super();

    this.setDependencies();
  }

  setDependencies() {
    this.externalRefs = {
      categories: this.parentNode.querySelectorAll(this.refs.categories),
    };
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material,
    ];
  }

  style() {
    return `
      :host { display: block; }
      #tabs { height: 100%; }
      #tabs > cols { display: flex; align-items: center; height: 100%; padding: 0 10px 0 0; gap: 8px; }
      .fastlink {
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: stretch;
          flex: 0 0 48px;
          border: 0;
          border-right: 1px solid var(--line);
          border-radius: 8px 0 0 8px;
          background: rgb(210 182 113 / 8%);
          transition: background 160ms var(--ease);
      }
      .fastlink:hover { background: rgb(210 182 113 / 20%); }
      .fastlink-icon { width: 24px; height: 24px; filter: sepia(1) saturate(.8); opacity: .85; }
      .indicator { display: flex; align-self: stretch; min-width: 0; overflow-x: auto; scrollbar-width: none; counter-reset: tabs; }
      .indicator li:not(:last-child) {
          position: relative;
          flex: 0 0 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 5px 0;
          border-radius: 4px;
          font-size: 12px;
          color: var(--muted);
          cursor: pointer;
          transition: background 140ms var(--ease), color 140ms var(--ease);
      }
      .indicator li:not(:last-child)::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 32px;
          border-radius: 5px;
          background: transparent;
          content: "";
          transform: translate(-50%, -50%);
          transition: background 140ms var(--ease);
      }
      .indicator li:not(:last-child)::after { counter-increment: tabs; content: counter(tabs); }
      .indicator li:not(:last-child):hover { color: var(--accent); }
      .indicator li:not(:last-child):hover::before { background: rgb(213 182 109 / 10%); }
      .indicator li[active]:not(:last-child) {
          color: var(--accent);
      }
      .indicator li[active]:not(:last-child)::before {
          background: rgb(213 182 109 / 10%);
      }
      .indicator li:last-child { display: none; }
      .widgets { display: flex; align-items: center; margin-left: auto; flex-shrink: 0; height: 100%; gap: 4px; }
      .widget { display: flex; align-items: center; justify-content: center; padding: 0 12px; height: 100%; }
      .weather { cursor: pointer; border-left: 1px solid var(--line); }
      .toolbar-action {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 30px;
          height: 32px;
          border: 1px solid transparent;
          border-radius: 5px;
          background: transparent;
          color: var(--muted);
          transition: color 140ms var(--ease), background 140ms var(--ease);
      }
      .toolbar-action .material-icons { font-size: 17px; }
      .toolbar-action:hover { color: var(--accent); background: rgb(213 182 109 / 10%); }
      .toolbar-action:disabled { opacity: .35; cursor: default; }
      current-time:not(:defined), weather-forecast:not(:defined) { display: none; }
      @media (max-width: 540px) {
          #tabs > cols { padding-right: 5px; gap: 3px; }
          .fastlink { flex-basis: 34px; }
          .fastlink-icon { width: 21px; }
          .indicator li:not(:last-child) { flex-basis: 26px; }
          .indicator li:not(:last-child)::before { width: 26px; }
          .widgets { gap: 0; }
          .widget { padding: 0 6px; }
          .toolbar-action { width: 26px; }
      }
    `;
  }

  template() {
    return `
        <div id="tabs">
            <cols>
                <button class="+ fastlink" aria-label="Open quick link" title="Open quick link">
                  <img class="fastlink-icon" src="src/img/storyteller.svg" alt=""/>
                </button>
                <ul class="- indicator"></ul>
                <div class="+ widgets col-end">
                    <current-time class="+ widget"></current-time>
                    <weather-forecast class="+ widget weather" title="Click to switch °C / °F"></weather-forecast>
                    ${CONFIG.disabled.includes('search-bar') ? '' : '<button class="toolbar-action search-action" aria-label="Search" title="Search · S"><i class="material-icons" aria-hidden="true">search</i></button>'}
                    ${CONFIG.disabled.includes('config-tab') ? '' : '<button class="toolbar-action config-action" aria-label="Configuration" title="Configuration"><i class="material-icons" aria-hidden="true">tune</i></button>'}
                    <button class="toolbar-action motion-action" aria-label="Pause background" title="Pause background" aria-pressed="true"><i class="material-icons" aria-hidden="true">pause</i></button>
                </div>
            </cols>
        </div>`;
  }

  setEvents() {
    this.refs.tabs.forEach(
      (tab) => {
        tab.onclick = ({ currentTarget }) => this.handleTabChange(currentTarget);
        tab.onkeydown = (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleTabChange(event.currentTarget);
          }
        };
      },
    );

    document.onkeydown = (e) => this.handleKeyPress(e);
    document.onwheel = (e) => this.handleWheelScroll(e);
    this.refs.fastlink.onclick = () => {
      console.log(CONFIG.fastlink);
      if (CONFIG.config.fastlink) {
        window.location.href = CONFIG.config.fastlink;
      }
    };

    this.shadow.querySelector('.search-action')?.addEventListener('click', () =>
      RenderedComponents['search-bar']?.activate());
    this.shadow.querySelector('.config-action')?.addEventListener('click', () =>
      RenderedComponents['config-tab']?.activate());

    const motionButton = this.shadow.querySelector('.motion-action');
    motionButton.addEventListener('click', () => document.dispatchEvent(new Event('landscape-toggle')));
    document.addEventListener('landscape-state', ({ detail }) => {
      const label = detail.reducedMotion ? 'Background motion disabled by system preference'
        : detail.failed ? 'Static background' : detail.paused ? 'Play background' : 'Pause background';
      motionButton.title = label;
      motionButton.setAttribute('aria-label', label);
      motionButton.setAttribute('aria-pressed', String(!detail.paused));
      motionButton.disabled = detail.reducedMotion || detail.failed;
      motionButton.firstElementChild.textContent = detail.paused ? 'play_arrow' : 'pause';
    });
    document.dispatchEvent(new Event('landscape-ready'));

    if (CONFIG.openLastVisitedTab) {
      window.onbeforeunload = () => this.saveCurrentTab();
    }
  }

  saveCurrentTab() {
    localStorage.lastVisitedTab = this.currentTabIndex;
  }

  openLastVisitedTab() {
    if (!CONFIG.openLastVisitedTab) return;
    this.activateByKey(Number(localStorage.lastVisitedTab ?? 0));
  }

  handleTabChange(tab) {
    this.activateByKey(Number(tab.getAttribute("tab-index")));
  }

  handleWheelScroll(event) {
    if (!event) return;

    let { wheelDelta } = event;

    if (event.composedPath().some(element => element.matches?.('input, textarea, [role="dialog"], [contenteditable="true"]'))) return;

    let activeTab = -1;
    this.refs.tabs.forEach((tab, index) => {
      if (tab.getAttribute("active") === "") {
        activeTab = index;
      }
    });

    if (wheelDelta < 0) {
      this.activateByKey((activeTab + 1) % (this.refs.tabs.length - 1));
    } else {
      this.activateByKey(
        activeTab - 1 < 0 ? this.refs.tabs.length - 2 : activeTab - 1,
      );
    }
  }

  handleKeyPress(event) {
    if (!event) return;

    let { key } = event;

    if (event.composedPath().some(element => element.matches?.('input, textarea, [role="dialog"], [contenteditable="true"]'))) return;

    if (
      Number.isInteger(parseInt(key)) &&
      key <= this.externalRefs.categories.length
    ) {
      this.activateByKey(key - 1);
    }
  }

  activateByKey(key) {
    if (!Number.isInteger(key) || key < 0 || key >= this.externalRefs.categories.length) return;
    this.currentTabIndex = key;

    this.activate(this.refs.tabs, this.refs.tabs[key]);
    this.activate(
      this.externalRefs.categories,
      this.externalRefs.categories[key],
    );
  }

  createTabs() {
    const categoriesCount = this.externalRefs.categories.length;

    for (let i = 0; i <= categoriesCount; i++) {
      this.refs.indicator.innerHTML += `<li tab-index=${i} ${
        i == 0 ? "active" : ""
      } ${i < categoriesCount ? 'role="button" tabindex="0"' : 'aria-hidden="true"'}></li>`;
    }

    this.refs.tabs.forEach((tab, index) => {
      if (index < categoriesCount) tab.setAttribute('aria-label', `${index + 1}: ${CONFIG.tabs[index].name}`);
    });
  }

  activate(target, item) {
    target.forEach((i) => i.removeAttribute("active"));
    item.setAttribute("active", "");
  }

  connectedCallback() {
    this.render().then(() => {
      this.createTabs();
      this.setEvents();
      this.openLastVisitedTab();
    });
  }
}
