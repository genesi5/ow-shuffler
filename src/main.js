const app = Vue.createApp({
  el: "#app",
  data() {
    return {
      appVersion: "0.1.1",
      counter: 0,
      teamRed: [],
      teamBlue: [],
      playerList: undefined,
      beta: undefined,
      alertInput: false,
      alertModalMessage: undefined,
      alertInputMessage: undefined,
      mapList: undefined,
      mapNames: undefined,
      mapModes: undefined,
      mapFilter: undefined,
      currentMap: undefined,
      localStorageAlert: undefined,
    }
  },
  mounted() {
    if ((new Date(Date.UTC(2022, 4, 17)).getTime() - new Date(Date.now()).getTime()) > 0) this.setVersion(true)
    else {
      this.setVersion(false)
      document.getElementById("versionSwitcher").remove()
      console.warn("Overwatch 2 Beta is over")
    }
  },
  created() {
    this.setMapNames()
    this.setMapFilter()
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
    setVersion(beta) {
      this.beta = beta
      this.setMapList()

      const playerLimit = (beta) ? 10 : 12
      if (this.playerList != undefined) {
        if (this.playerList.length > playerLimit) this.playerList = this.playerList.slice(0, playerLimit)
      }
      console.info("Switched to Overwatch %smode", (this.beta) ? "2 Beta " : "")
    },
    loadPlayersFromLocalStorage() {
      pls = JSON.parse(window.localStorage.getItem("playerList"))
      if (pls != null) {
        this.playerList = pls
        // console.log("MAPS",this.mapList.map(x => this.mapNames[x.id]))
      }
      else this.playerList = []
    },
    setMapList() {
      this.mapList = (this.beta)
        ? Object.create(mapList.filter(x => !x.deprecated))
        : Object.create(mapList.filter(x => x.legacy))
      this.setMapModes()
      // console.log("MAPS",this.mapList.map(x => this.mapNames[x.id]))
    },
    setMapModes() {
      newModes = new Object()
      this.mapList
        .map(({ mode }) => mode)
        .filter(function (item, pos, self) { return self.indexOf(item) == pos })
        .forEach(function (value) { newModes[value] = mapModes[value] })
      this.mapModes = newModes
      // console.log("MODES", this.mapModes)
    },
    setMapFilter() {
      mls = window.localStorage.getItem("mapFilter")
      if (mls != null) this.mapFilter = JSON.parse(mls)
      else this.mapFilter = mapList.reduce((prev, cur) => ({ ...prev, [cur.id]: true }), {})
      // console.log("FILTERS", this.mapFilter)
    },
    setMapNames() {
      this.mapNames = mapNames
    },
    getMapsByMode(mode) {
      if (!!mode) return this.mapList.filter(x => x.mode == mode)
    },
    addPlayer(name) {
      const playerLimit = (this.beta) ? 10 : 12
      if (!!name) {
        if (this.playerList) {
          dupItem = this.playerList.find(x => name.toLowerCase() == x.name.toLowerCase())
          if (dupItem == undefined && this.playerList.length < playerLimit) {
            newPlayer = { id: this.counter++, name: name }
            this.playerList.push(newPlayer)
            // console.info("ADDED", newPlayer)
          }
          else if (dupItem != undefined) {
            dupName = this.playerList[this.playerList.findIndex(x => name.toLowerCase() == x.name.toLowerCase())].name
            msg = `Игрок с именем "${dupName}" уже существует`
            this.toggleAlertInput(msg)
            console.warn(`Duplicate found: ${dupName}`)
          }
          else if (this.playerList.length >= playerLimit) {
            const ver = (this.beta) ? "2 Beta " : ""
            msg = `Лимит игроков в Overwatch ${ver}превышен (максимум ${playerLimit} игроков)`
            this.toggleAlertInput(msg)
            console.warn(`Overwatch ${ver}player limit has been exceded (${playerLimit} players maximum)`)
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
    shuffleTeams() {
      console.log
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
        // console.info(this.teamRed.map(x => x.name))
        // console.info(this.teamBlue.map(x => x.name))
        this.pickRandomMap()
        if (!!this.currentMap) this.togglePlayerModal(true)
        else {
          this.toggleAlertModal(true, "Пул карт, отмеченных для случайного выбора, пуст.")
          console.warn("Map pool is empty")
        }
      }
      else if (this.playerList.length % 2 != 0) {
        this.toggleAlertModal(true, "Нечётное количество игроков: невозможно честно разделить игроков по командам.")
        console.warn("Roster is not even")
      }
      else if (this.playerList.length == 0) {
        this.toggleAlertModal(true, "Невозможно разделить игроков по командам: список игроков пуст.")
        console.warn("Roster is empty")
      }
    },
    pickRandomMap() {
      newMaps = Object.create(this.mapList.filter(x => this.mapFilter[x.id]))
      this.currentMap = newMaps[Math.floor(Math.random() * newMaps.length)]
      // console.info("CURRENT MAP", this.currentMap)
    },
    togglePlayerModal(opt) {
      playerModal = new bootstrap.Modal(document.getElementById('shuffleResult'))
      if (opt) playerModal.show()
      else playerModal.hide()
    },
    toggleSettingsModal(opt) {
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
    uppercase(string) {
      if (!string) return ''
      return string.toUpperCase()
    },
    updateLocalStorage(obj) {
      switch (obj) {
        case "mapFilter":
          // console.log(`Updated ${obj}`, this.mapFilter)
          window.localStorage.setItem("mapFilter", JSON.stringify(this.mapFilter))
          break
        case "playerList":
          // console.log(`Updated ${obj}`, this.playerList)
          (this.playerList.length != 0)
            ? window.localStorage.setItem("playerList", JSON.stringify(this.playerList))
            : window.localStorage.removeItem("playerList")
          break
      }
    },
    clearLocalStorage() {
      window.localStorage.clear()
      this.localStorageAlert = true
      setTimeout(() => {
        this.localStorageAlert = false
      }, 3000)
    },
  }
})

const mapModes = {
  hybrid: "Гибридный режим",
  control: "Контроль точки",
  assault: "Захват точек",
  escort: "Эскорт",
  push: "Натиск",
}

const mapNames = {
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
}

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

app.mount("#app")

