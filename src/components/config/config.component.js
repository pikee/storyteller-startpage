class ConfigTab extends Component {
  refs = {
    config: '#config',
    textarea: '#config textarea[type="text"]',
    save: '.save',
    close: '.close'
  };

  constructor() {
    super();

    this.config = JSON.parse(localStorage.getItem("config")).config;
  }

  style() {
    return `
      #config {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 11;
          padding: 24px;
          background: var(--glass-deep);
          backdrop-filter: blur(16px);
          visibility: hidden;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 200ms var(--ease), transform 260ms var(--ease), visibility 200ms;
      }
      #config.active { visibility: visible; opacity: 1; transform: translateY(0); }
      .dialog-panel { position: relative; width: 90%; }
      h2 { color: var(--accent); font: 300 34px / 1.1 var(--font-display); padding-right: 130px; margin-bottom: 22px; }
      #config textarea {
          display: block;
          width: 100%;
          height: 280px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 6px;
          outline: none;
          background: rgb(17 30 29 / 48%);
          color: var(--text);
          font: 400 13px / 1.65 'Cascadia Code', Consolas, monospace;
          tab-size: 4;
          resize: none;
          scrollbar-width: thin;
          scrollbar-color: var(--muted) transparent;
      }
      #config textarea:focus { border-color: rgb(213 182 109 / 65%); }
      .save, .close {
          position: absolute;
          top: 0;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 5px;
          background: transparent;
      }
      .save { right: 44px; padding: 0 15px; background: var(--accent); color: var(--bg); border-color: var(--accent); font-size: 12px; font-weight: 500; }
      .save:hover { background: #e3c785; }
      .close { right: 0; width: 34px; color: var(--muted); }
      .close:hover { color: var(--accent); border-color: var(--accent); }
      @media (max-width: 540px) {
          #config { padding: 18px; }
          .dialog-panel { width: 100%; }
          h2 { font-size: 26px; padding-right: 112px; }
          #config textarea { height: 350px; padding: 12px; font-size: 11px; }
          .save { padding: 0 10px; }
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
        <div id="config" role="dialog" aria-label="Configuration">
          <div class="dialog-panel">
            <h2>Configuration</h2>
            <textarea type="text" spellcheck="false" aria-label="Configuration JSON"></textarea>
            <button class="save">Save</button>
            <button class="close" aria-label="Close configuration" title="Close · Esc"><i class="material-icons" aria-hidden="true">&#xE5CD;</i></button>
          </div>
        </div>
    `;
  }

  activate() {
    this.refs.config.classList.add('active');
    setTimeout(() => this.refs.textarea.focus({ preventScroll: true }), 100);
  }

  deactivate() {
    this.refs.config.classList.remove('active');
  }

  saveConfig() {
    localStorage.setItem("CONFIG", this.refs.textarea.value);
    this.deactivate();
    location.reload();
  }

  handleSearch(event) {
    const { key } = event;

    if (key === 'Escape')
      this.deactivate();
  }

  setEvents() {
    this.refs.textarea.onkeydown = (event) => event.stopPropagation();
    this.refs.config.onkeyup = (e) => this.handleSearch(e);
    this.refs.close.onclick = () => this.deactivate();
    this.refs.save.onclick = () => this.saveConfig();
  }

  setConfig() {
    this.refs.textarea.value =  JSON.stringify(this.config, null, 4);
  }

  connectedCallback() {
    this.render().then(() => {
      this.setEvents();
      this.setConfig();
    });
  }
}
