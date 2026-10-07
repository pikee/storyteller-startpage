class Search extends Component {
  refs = {
    search: '#search',
    input: '#search input[type="text"]',
    engines: '.search-engines',
    close: '.close'
  };

  constructor() {
    super();

    this.engines = CONFIG.search.engines;
  }

  style() {
    return `
      #search {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          z-index: 10;
          background: var(--glass-deep);
          backdrop-filter: blur(16px);
          visibility: hidden;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 200ms var(--ease), transform 260ms var(--ease), visibility 200ms;
      }
      #search.active { visibility: visible; opacity: 1; transform: translateY(0); }
      .dialog-panel { position: relative; width: 80%; max-width: 760px; }
      h2 { color: var(--accent); font: 300 42px / 1.1 var(--font-display); margin-bottom: 26px; }
      #search input {
          width: 100%;
          padding: 15px 0;
          border: 0;
          border-bottom: 1px solid var(--line);
          border-radius: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font: 400 21px / 1.5 var(--font-ui);
          transition: border-color 150ms;
      }
      #search input:focus { border-color: var(--accent); }
      #search input::placeholder { color: var(--muted); }
      .close {
          position: absolute;
          top: 3px;
          right: 0;
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 1px solid var(--line);
          border-radius: 5px;
          background: transparent;
          color: var(--muted);
      }
      .close:hover { color: var(--accent); border-color: var(--accent); }
      .search-engines { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 20px; color: var(--muted); }
      .search-engines li { border: 1px solid var(--line); border-radius: 4px; padding: 5px 10px; }
      .search-engines p { font-size: 12px; line-height: 1.4; }
      .search-engines li.active { border-color: var(--accent); color: var(--accent); background: rgb(213 182 109 / 10%); }
      .dialog-hint { margin-top: 22px; color: var(--muted); font-size: 12px; line-height: 1.6; }
      @media (max-width: 540px) {
          #search { padding: 24px; }
          .dialog-panel { width: 100%; }
          h2 { font-size: 36px; }
          #search input { font-size: 17px; }
      }
    `;
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material
    ];
  }

  template() {
    return `
        <div id="search" role="dialog" aria-label="Search">
          <div class="dialog-panel">
            <h2>Search</h2>
            <input type="text" spellcheck="false" autocomplete="off" placeholder="search" aria-label="Search query">
            <button class="close" aria-label="Close search" title="Close · Esc"><i class="material-icons" aria-hidden="true">&#xE5CD;</i></button>
            <ul class="search-engines"></ul>
            <p class="dialog-hint">Use a prefix to choose a search engine. Enter to search, Esc to close.</p>
          </div>
        </div>
    `;
  }

  loadEngines() {
    for (var key in this.engines)
      this.refs.engines.innerHTML += `<li><p title="${this.engines[key][1]}">!${key}</p></li>`;
  }

  activate() {
    this.refs.search.classList.add('active');
    setTimeout(() => this.refs.input.focus({ preventScroll: true }), 100);
  }

  deactivate() {
    this.refs.search.classList.remove('active');
  }

  handleSearch(event) {
    const { target, key } = event;

    let args = target.value.split(' ');
    let prefix = args[0];
    let defaultEngine = this.engines['g'][0];
    let engine = defaultEngine;

    this.refs.engines.childNodes.forEach(engine => {
      if (prefix === engine.firstChild.innerHTML)
        engine.classList.add('active');
      else
        engine.classList.remove('active');
    });

    if (key === 'Enter') {
      if (prefix.indexOf('!') === 0) {
        engine = this.engines[prefix.substr(1)][0];
        args = args.slice(1);
      }

      window.location = engine + encodeURI(args.join(' '));
    }

    if (key === 'Escape')
      this.deactivate();
  }

  setEvents() {
    this.refs.input.onkeydown = (event) => event.stopPropagation();
    this.refs.search.onkeyup = (e) => this.handleSearch(e);
    this.refs.close.onclick = () => this.deactivate();
  }

  connectedCallback() {
    this.render().then(() => {
      this.loadEngines();
      this.setEvents();
    });
  }
}
