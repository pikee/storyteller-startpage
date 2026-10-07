let saved_config = JSON.parse(localStorage.getItem("CONFIG"));

const default_config = {
  overrideStorage: true,

  temperature: {
    location: "Moscow, Russia",
    scale: "C",
  },

  clock: {
    format: "H:i",
    iconColor: "#ea6962",
  },

  search: {
    engines: {
      g: ["https://google.com/search?q=", "Google"],
      ya: ["https://yandex.ru/search/?text=", "Yandex"],
      yt: ["https://youtube.com/results?search_query=", "Youtube"],
      p: ["https://www.pinterest.es/search/pins/?q=", "Pinterest"],
    },
  },

  keybindings: {
    s: "search-bar",
  },

  disabled: [],
  localIcons: false,
  fastlink: "https://chatgpt.com/",
  openLastVisitedTab: true,

  tabs: [
    {
      name: "daily",
      background_url: "src/img/banners/cbg-2.gif",
      categories: [
        {
          name: "social",
          links: [
            {
              name: "Mail",
              url: "https://mail.yandex.ru/",
              icon: "mail",
              icon_color: "#e78a4e",
            },
            {
              name: "Proton",
              url: "https://mail.proton.me/u/1/inbox#category=primary",
              icon: "shield-lock",
              icon_color: "#d3869b",
            },
            {
              name: "X",
              url: "https://x.com/",
              icon: "brand-twitter-filled",
              icon_color: "#d4be98",
            },
            {
              name: "VK",
              url: "https://vk.com/",
              icon: "brand-vk",
              icon_color: "#7daea3",
            },
          ],
        },

        {
          name: "media",
          links: [
            {
              name: "YouTube",
              url: "https://www.youtube.com/",
              icon: "brand-youtube-filled",
              icon_color: "#ea6962",
            },
            {
              name: "Twitch",
              url: "https://www.twitch.tv/",
              icon: "brand-twitch",
              icon_color: "#d3869b",
            },
            {
              name: "Kinopoisk",
              url: "https://www.kinopoisk.ru/",
              icon: "movie",
              icon_color: "#e78a4e",
            },
          ],
        },

        {
          name: "tools",
          links: [
            {
              name: "ChatGPT",
              url: "https://chatgpt.com/",
              icon: "brand-openai",
              icon_color: "#89b482",
            },
            {
              name: "Translator",
              url: "https://translate.yandex.ru/",
              icon: "language",
              icon_color: "#7daea3",
            },
            {
              name: "FunPay",
              url: "https://funpay.com/",
              icon: "coin",
              icon_color: "#a9b665",
            },
          ],
        },
      ],
    },

    {
      name: "work",
      background_url: "src/img/banners/cbg-7.gif",
      categories: [
        {
          name: "development",
          links: [
            {
              name: "GitHub",
              url: "https://github.com/",
              icon: "brand-github",
              icon_color: "#d4be98",
            },
            {
              name: "VPS",
              url: "https://cabinet.dhost.su/",
              icon: "server",
              icon_color: "#7daea3",
            },
            {
              name: "Senzari",
              url: "https://senzari.cc/",
              icon: "activity-heartbeat",
              icon_color: "#89b482",
            },
            {
              name: "Metrika",
              url: "https://metrika.yandex.ru/",
              icon: "chart-bar",
              icon_color: "#e78a4e",
            },
          ],
        },

        {
          name: "design",
          links: [
            {
              name: "Pinterest",
              url: "https://www.pinterest.com/",
              icon: "brand-pinterest",
              icon_color: "#ea6962",
            },
            {
              name: "Cosmos",
              url: "https://www.cosmos.so/explore",
              icon: "photo",
              icon_color: "#7daea3",
            },
            {
              name: "Fontjoy",
              url: "https://fontjoy.com/",
              icon: "typography",
              icon_color: "#a9b665",
            },
            {
              name: "ClippingMagic",
              url: "https://clippingmagic.com/",
              icon: "cut",
              icon_color: "#e78a4e",
            },
          ],
        },
      ],
    },

    {
      name: "play",
      background_url: "src/img/banners/cbg-9.gif",
      categories: [
        {
          name: "games",
          links: [
            {
              name: "Steam",
              url: "https://store.steampowered.com/",
              icon: "brand-steam",
              icon_color: "#7daea3",
            },
            {
              name: "Dota 2",
              url: "steam://rungameid/570",
              icon: "swords",
              icon_color: "#ea6962",
            },
            {
              name: "Deadlock",
              url: "steam://rungameid/1422450",
              icon: "crosshair",
              icon_color: "#e78a4e",
            },
            {
              name: "osu!",
              url: "https://osu.ppy.sh/",
              icon: "circle",
              icon_color: "#d3869b",
            },
            {
              name: "Monkeytype",
              url: "https://monkeytype.com/",
              icon: "keyboard",
              icon_color: "#a9b665",
            },
          ],
        },
      ],
    },
  ],
};

const CONFIG = new Config(saved_config ?? default_config);
// const CONFIG = new Config(default_config);

(function () {
  var css = document.createElement("link");
  css.href = "src/css/tabler-icons.min.css";
  css.rel = "stylesheet";
  css.type = "text/css";

  if (!CONFIG.config.localIcons)
    document.getElementsByTagName("head")[0].appendChild(css);
})();
