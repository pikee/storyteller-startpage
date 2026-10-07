class Clock extends Component {
  refs = {
    clock: ".clock-time",
    icon: ".clock-icon",
  };

  constructor() {
    super();
  }

  imports() {
    return [this.resources.icons.material, this.resources.fonts.roboto];
  }

  style() {
    return `
      :host { display: flex; align-items: center; gap: 8px; }
      .clock-time {
          white-space: nowrap;
          font: var(--status-font-weight) var(--status-font-size) / 1 var(--status-font-family);
          font-variant-numeric: lining-nums tabular-nums;
          color: var(--text);
          letter-spacing: .02em;
      }
      .clock-icon { font-size: 14px; opacity: .7; filter: saturate(.6); }
      @media (max-width: 540px) {
          :host { gap: 5px; }
          .clock-icon { display: none; }
      }
    `;
  }

  template() {
    return `
        <span class="material-icons clock-icon">schedule</span>
        <p class="clock-time"></p>
    `;
  }

  setIconColor() {
    this.refs.icon.style.color = CONFIG.clock.iconColor;
  }

  setTime() {
    const date = new Date();

    this.refs.clock = date.strftime(CONFIG.clock.format);
  }

  connectedCallback() {
    this.render().then(() => {
      this.setTime();
      this.setIconColor();

      setInterval(() => this.setTime(), 1000);
    });
  }
}
