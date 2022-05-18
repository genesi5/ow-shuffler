const messages = {
  en: {
    general: {
      close: "CLOSE",
      nextMap: "Next map is:",
      errors: {
        title: "ERROR",
        rosterNotEven: "Unable to assign players fairly: roster is not even.",
        rosterEmpty: "Unable to assign players: roster is empty.",
        mapPoolEmpty: "Selected map pool for random pick is empty.",
      },
    },
    input: {
      placeholder: " Enter player nickname...",
      alerts: {
        rosterExceded: "OVERWATCH player limit has been exceded (12 players maximum).",
        duplicateFound: ({ named }) => `Player with nickname "${named('name')}" is already exists`
      }
    },
    settings: {
      navButton: "SETTINGS",
      ls: {
        title: "Local storage",
        clearCache: {
          base: "CLEAR CACHE",
          extend: ""
        },
        exist: "(cached data in storage)",
        alert: {
          short: "Storage has been successfully cleared",
          full: "Storage has been successfully cleared"
        }
      },
      mapFilter: {
        title: "Map filter",
        resetFilter: {
          base: "RESET FILTER",
          extend: ""
        },
        alert: {
          short: "Map filter has been reset to default",
          full: "Map filter has been reset to default"
        }
      },
    },
    maps: {
      lijiang: "Lijiang Tower",
      ilios: "Ilios",
      nepal: "Nepal",
      oasis: "Oasis",
      busan: "Busan",
      havana: "Havana",
      junkertown: "Junkertown",
      monaco: "Curcuit Royale",
      dorado: "Dorado",
      rialto: "Rialto",
      gibraltar: "Watchpoint: Gibraltar",
      route66: "Route 66",
      blizzworld: "Blizzard World",
      eichenwalde: "Eichenwalde",
      hollywood: "Hollywood",
      kingsrow: "King's Row",
      midtown: "Midtown",
      numbani: "Numbani",
      volskaya: "Volskaya Industries",
      horizon: "Horizon Lunar Colony",
      paris: "Paris",
      hanamura: "Hanamura",
      anubis: "Temple of Anubis",
      rome: "Colloseo",
      toronto: "New Queen Street",
    },
    modes: {
      hybrid: "Hybrid",
      control: "Control",
      assault: "Assault",
      escort: "Escort",
      push: "Push",
    }
  },
  ru: {
    general: {
      close: "ЗАКРЫТЬ",
      nextMap: "Следующая карта:",
      errors: {
        title: "ОШИБКА",
        rosterNotEven: "Нечётное количество игроков: невозможно честно разделить игроков по командам.",
        rosterEmpty: "Невозможно разделить игроков по командам: список игроков пуст.",
        mapPoolEmpty: "Пул карт, отмеченных для случайного выбора, пуст.",
      },
    },
    input: {
      placeholder: " Введите ник игрока...",
      alerts: {
        rosterExceded: "Лимит игроков в OVERWATCH превышен (максимум 12 игроков).",
        duplicateFound: ({ named }) => `рок с именем "${named('name')}" уже существует`
      }
    },
    settings: {
      navButton: "НАСТРОЙКИ",
      ls: {
        title: 'Локальное хранилище',
        clearCache: {
          base: "ОЧИСТИТЬ",
          extend: "&nbsp;КЭШ"
        },
        exist: "(имеются сохр. данные)",
        alert: {
          short: "Хранилище успешно очищено",
          full: "Локальное хранилище успешно очищено"
        }
      },
      mapFilter: {
        title: "Фильтр карт",
        resetFilter: {
          base: "СБРОСИТЬ",
          extend: "&nbsp;ФИЛЬТР"
        },
        alert: {
          short: "Фильтр успешно сброшен",
          full: "Фильтр карт успешно сброшен"
        }
      },
    },
    maps: {
      lijiang: "Башня Лицзянь",
      ilios: "Илиос",
      nepal: "Непал",
      oasis: "Оазис",
      busan: "Пусан",
      havana: "Гавана",
      junkertown: "Джанкертаун",
      monaco: "Королевская трасса",
      dorado: "Дорадо",
      rialto: "Риальто",
      gibraltar: "Пункт наблюдения: Гибралтар",
      route66: "Шоссе 66",
      blizzworld: "Blizzard World",
      eichenwalde: "Айхенвальд",
      hollywood: "Голливуд",
      kingsrow: "Кингс Роу",
      midtown: "Мидтаун",
      numbani: "Нумбани",
      volskaya: "КБ Вольской",
      horizon: "Лунная колония \"Горизонт\"",
      paris: "Париж",
      hanamura: "Ханамура",
      anubis: "Храм Анубиса",
      rome: "Коллизей",
      toronto: "Нью Квин Стрит",
    },
    modes: {
      hybrid: "Гибридный режим",
      control: "Контроль точки",
      assault: "Захват точек",
      escort: "Эскорт",
      push: "Натиск",
    }
  }
}

const i18n = VueI18n.createI18n({
  locale: navigator.language,
  availableLocales: ['ru', 'en'],
  fallbackLocale: {
    'default': ['en']
  },
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  messages,
})

const app = Vue.createApp({
  el: "#app",
  data() {
    return {
      shufflerVersion: "0.1.3",
      counter: 0,
      teamRed: [],
      teamBlue: [],
      locale: undefined,
      playerList: undefined,
      alertInput: false,
      alertModalMessage: undefined,
      alertInputMessage: undefined,
      mapList: undefined,
      mapModes: undefined,
      mapFilter: undefined,
      currentMap: undefined,
      localStorageAlert: undefined,
      localStorageStatus: undefined,
      mapFilterAlert: undefined,
      settingsEventListeners: undefined
    }
  },
  created() {
    this.setMapList()
    this.setMapFilter()
    this.setLocale()
    this.loadPlayersFromLocalStorage()
  },
  props: [
    'inputName'
  ],
  watch: {
    mapFilter: {
      handler(newValue, oldValue) { if (newValue != undefined && oldValue != undefined) this.updateLocalStorage("mapFilter") },
      deep: true,
    },
    playerList: {
      handler(newValue, oldValue) { if (newValue != undefined && oldValue != undefined) this.updateLocalStorage("playerList") },
      deep: true,
    },
  },
  methods: {
    loadPlayersFromLocalStorage() {
      pls = JSON.parse(window.localStorage.getItem("playerList"))
      if (pls != null) {
        this.playerList = pls
        // console.log("MAPS",this.mapList.map(x => this.mapNames[x.id]))
      }
      else this.playerList = []
    },
    setMapList() {
      this.mapList = Object.create(mapList.filter(x => x.legacy))
      this.setMapModes()
      // console.log("MAPS",this.mapList.map(x => this.mapNames[x.id]))
    },
    setMapModes() {
      this.mapModes = Object.create(this.mapList
        .map(({ mode }) => mode)
        .filter(function (item, pos, self) { return self.indexOf(item) == pos }))
      // console.log("MODES", this.mapModes)
    },
    setMapFilter() {
      mls = window.localStorage.getItem("mapFilter")
      if (mls != null) this.mapFilter = JSON.parse(mls)
      else this.mapFilter = mapList.reduce((prev, cur) => ({ ...prev, [cur.id]: true }), {})
      // console.log("FILTERS", this.mapFilter)
    },
    setLocale() {
      if (navigator.language == undefined) {
        this.locale = navigator.languages[1]
      }
      else this.locale = navigator.language
      // console.warn("LOCALE", this.locale)
    },
    getMapsByMode(mode) {
      if (!!mode) return this.mapList.filter(x => x.mode == mode)
    },
    addPlayer(name) {
      if (!!name) {
        if (this.playerList) {
          dupItem = this.playerList.find(x => name.toLowerCase() == x.name.toLowerCase())
          if (dupItem == undefined && this.playerList.length < 12) {
            document.getElementById('playerInput').value = ''
            newPlayer = { id: this.counter++, name: name }
            this.playerList.push(newPlayer)
            // console.info("ADDED", newPlayer)
          }
          else if (dupItem != undefined) {
            dupName = this.playerList[this.playerList.findIndex(x => name.toLowerCase() == x.name.toLowerCase())].name
            msg = this.$t('input.alerts.duplicateFound', { name: dupName })
            this.toggleAlertInput(msg)
            console.warn(`Duplicate found: ${dupName}`)
          }
          else if (this.playerList.length >= 12) {
            msg = this.$t(`input.alerts.rosterExceded`)
            this.toggleAlertInput(msg)
            console.warn("OVERWATCH player limit has been exceded (12 players maximum)")
          }
        }
      }
    },
    delPlayer(id) {
      if (id != undefined) {
        playerIndex = this.playerList.findIndex(item => { return item.id === id });
        if (playerIndex != undefined) {
          playerObj = this.playerList[playerIndex]
          this.playerList.splice(playerIndex, 1)
          // console.info("DELETED", playerObj)
        }
      }
    },
    pickRandomMap() {
      newMaps = Object.create(this.mapList.filter(x => this.mapFilter[x.id]))
      this.currentMap = newMaps[Math.floor(Math.random() * newMaps.length)]
      // console.info("CURRENT MAP", this.currentMap)
    },
    resetMapFilter() {
      this.mapFilter = Object.fromEntries(Object.keys(this.mapFilter).map((key) => [key, true]))
      this.mapFilterAlert = true
      setTimeout(() => {
        this.mapFilterAlert = false
      }, 3000)
    },
    uppercase(string) {
      if (!string) return ''
      return string.toUpperCase()
    },
    shuffleTeams() {
      if (this.playerList.length != 0 && this.playerList.length % 2 == 0) {
        list = Object.create(this.playerList)
        var randomIndex, currentIndex = list.length, half = Math.ceil(list.length / 2);
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex--
          [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]]
        }
        this.teamRed = list.slice(0, half)
        this.teamBlue = list.slice(-half)
        // console.info('TEAM RED', this.teamRed.map(x => x.name))
        // console.info('TEAM BLUE', this.teamBlue.map(x => x.name))
        this.pickRandomMap()
        if (!!this.currentMap) this.togglePlayerModal(true)
        else {
          this.toggleAlertModal(true, this.$t('general.errors.emptyMapPool'))
          console.warn("Map pool is empty")
        }
      }
      else if (this.playerList.length % 2 != 0) {
        this.toggleAlertModal(true, this.$t('general.errors.rosterNotEven'))
        console.warn("Roster is not even")
      }
      else if (this.playerList.length == 0) {
        this.toggleAlertModal(true, this.$t('general.errors.rosterEmpty'))
        console.warn("Roster is empty")
      }
    },
    togglePlayerModal(opt) {
      playerModal = new bootstrap.Modal(document.getElementById('shuffleResult'))
      if (opt) playerModal.show()
      else playerModal.hide()
    },
    toggleSettingsModal(opt) {
      if (this.settingsEventListeners == undefined) {
        this.settingsEventListeners = new Object
        Object.entries(this.mapModes).forEach((mode) => {
          this.settingsEventListeners[mode] = document.getElementById(`collapse-${mode}`)
          this.settingsEventListeners[mode].addEventListener('show.bs.collapse', function () {
            document.getElementById(`chevron-${mode}`).classList.replace('bi-chevron-down', 'bi-chevron-up')
          })
          this.settingsEventListeners[mode].addEventListener('hide.bs.collapse', function () {
            document.getElementById(`chevron-${mode}`).classList.replace('bi-chevron-up', 'bi-chevron-down')
          })
        })
      }
      this.updateLocalStorageStatus()
      settingsModal = new bootstrap.Modal(document.getElementById('settings'))
      if (opt) settingsModal.show()
      else settingsModal.hide()
    },
    toggleAlertModal(opt, message) {
      alertModal = new bootstrap.Modal(document.getElementById('shuffleAlert'))
      if (opt) {
        this.alertModalMessage = message
        alertModal.show()
      }
      else {
        alertModal.hide()
        this.alertModalMessage = undefined
      }
    },
    toggleAlertInput(message) {
      this.alertInputMessage = message
      this.alertInput = true
      setTimeout(() => {
        this.alertInput = false
      }, 3000)
    },
    updateLocalStorageStatus() {
      if (window.localStorage.getItem("mapFilter") || window.localStorage.getItem("playerList")) this.localStorageStatus = true
      else this.localStorageStatus = false
    },
    updateLocalStorage(obj) {
      switch (obj) {
        case "mapFilter":
          // console.log(`Updated ${obj}`, this.mapFilter)
          window.localStorage.setItem("mapFilter", JSON.stringify(this.mapFilter))
          this.updateLocalStorageStatus()
          break
        case "playerList":
          // console.log(`Updated ${obj}`, this.playerList)
          if (this.playerList.length != 0) {
            window.localStorage.setItem("playerList", JSON.stringify(this.playerList))
            this.updateLocalStorageStatus()
          }
          else window.localStorage.removeItem("playerList")
          break
      }
    },
    clearLocalStorage() {
      if (this.localStorageStatus) {
        window.localStorage.clear()
        this.localStorageStatus = false
        this.localStorageAlert = true
        setTimeout(() => {
          this.localStorageAlert = false
        }, 3000)
      }
    },
  }
})

const mapList = [
  {
    id: "lijiang",
    mode: "control",
    image: "./src/img/map_lijiang.jpg",
    legacy: true,
    deprecated: false
  },
  {
    id: "ilios",
    mode: "control",
    image: "./src/img/map_ilios.jpg",
    legacy: true,
    deprecated: false
  },
  {
    id: "nepal",
    mode: "control",
    image: "./src/img/map_nepal.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "oasis",
    mode: "control",
    image: "./src/img/map_oasis.jpg",
    legacy: true,
    deprecated: false
  },
  {
    id: "busan",
    mode: "control",
    image: "./src/img/map_busan.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "havana",
    mode: "escort",
    image: "./src/img/map_havana.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "junkertown",
    mode: "escort",
    image: "./src/img/map_junkertown.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "monaco",
    mode: "escort",
    image: "./src/img/map_monaco.jpg",
    legacy: false,
    deprecated: false
  },
  {
    id: "dorado",
    mode: "escort",
    image: "./src/img/map_dorado.jpg",
    legacy: true,
    deprecated: false
  },
  {
    id: "gibraltar",
    mode: "escort",
    image: "./src/img/map_gibraltar.jpg",
    legacy: true,
    deprecated: false
  },
  {
    id: "rialto",
    mode: "escort",
    image: "./src/img/map_gibraltar.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "route66",
    mode: "escort",
    image: "./src/img/map_route66.jpg",
    legacy: true,
    deprecated: false
  },
  {
    id: "blizzworld",
    mode: "hybrid",
    image: "./src/img/map_blizzworld.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "eichenwalde",
    mode: "hybrid",
    image: "./src/img/map_eichenwalde.jpg",
    legacy: true,
    deprecated: false
  },
  {
    id: "hollywood",
    mode: "hybrid",
    image: "./src/img/map_hollywood.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "kingsrow",
    mode: "hybrid",
    image: "./src/img/map_kingsrow.jpg",
    legacy: true,
    deprecated: false
  },
  {
    id: "midtown",
    mode: "hybrid",
    image: "./src/img/map_midtown.jpg",
    legacy: false,
    deprecated: false
  },
  {
    id: "numbani",
    mode: "hybrid",
    image: "./src/img/map_numbani.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "volskaya",
    mode: "assault",
    image: "./src/img/map_volskaya.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "horizon",
    mode: "assault",
    image: "./src/img/map_horizon.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "paris",
    mode: "assault",
    image: "./src/img/map_paris.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "hanamura",
    mode: "assault",
    image: "./src/img/map_hanamura.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "anubis",
    mode: "assault",
    image: "./src/img/map_anubis.jpg",
    legacy: true,
    deprecated: true
  },
  {
    id: "rome",
    mode: "push",
    image: "./src/img/rome.jpg",
    legacy: false,
    deprecated: false
  },
  {
    id: "toronto",
    mode: "push",
    image: "./src/img/map_toronto.jpg",
    legacy: false,
    deprecated: false
  }
]

app.use(i18n)
app.mount("#app")