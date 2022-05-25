<template>
  <!-- NAVBAR -->
  <div class="container">
    <nav class="navbar navbar-expand-lg bg-light fixed-top navbar-light ">
      <!-- LOGO -->
      <div class="col-4 d-flex align-items-end navbar-title  ps-3">
        <img class="navbar-brand d-inline-block align-text-top me-2" width="50" src="./assets/img/icon.png">
        <p class="d-none d-md-block ow-font-bold mb-0 h4">OVERWATCH<br />TEAM SHUFFLER</p>
        <p class="d-none d-md-block ow-font-middle ms-2 mb-0 fs-6">ver. {{ appVersion }}</p>
      </div>
      <!-- BUTTON -->
      <div class="col-4 d-flex justify-content-center">
        <button class="btn btn-lg btn-outline-ow justify-content-center align-items-stretch pb-0"
          v-on:click="shuffleTeams">SHUFFLE!</button>
      </div>
      <!-- SETTINGS -->
      <div class="col-4 d-flex justify-content-end pb-0 pe-3">
        <button class="d-none d-sm-block btn btn-lg btn-outline-ow justify-content-between align-items-stretch pb-0"
          v-on:click="toggleSettingsModal(true)">{{ $t('settings.navButton').toUpperCase() }}
        </button>
        <p class="d-sm-none bi-gear gear pt-0 pe-2 mb-0" v-on:click="toggleSettingsModal(true)" id="settingsButton">
        </p>
      </div>
    </nav>
  </div>

  <!-- MAIN-->
  <div class="container player-list-margin">
    <!-- INPUT-->
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6">
        <div class="input-group opac mt-5">
          <input type="text" style="font-size: 1.5rem;" id="playerInput" class="form-control ow-font-middle"
            :placeholder="$t('input.placeholder')" v-bind:value='inputName'
            v-on:keyup.enter="addPlayer($event.target.value)">
        </div>
        <!-- INPUT ALERT-->
        <div class="collapse" id="collapseInputAlert">
          <div class="alert alert-warning d-flex mb-0 align-items-center" id="alertInputMessage" role="alert">
            <p class="bi-exclamation-triangle-fill mb-0 h5" />
            <p class="ow-font-middle h5 ms-2 mb-0">{{ alertInputMessage }}</p>
          </div>
        </div>
        <!-- PLAYER LIST-->
        <transition-group name="list" class="list-group player-roster mb-5" tag="ul">
          <li class="list-group-item justify-content-between align-items-center opac d-flex text-break panel"
            v-for="item in playerList" :key="item.id" :id="`player-list-` + item.id">
            <p class="mb-0 ow-font-bold h4" style="color: #585858 !important">{{ item.name.toUpperCase() }}</p>
            <button class="btn-close" v-on:click="delPlayer(item.id)"></button>
          </li>
        </transition-group>
      </div>
    </div>
  </div>

  <!-- ERROR MODAL -->
  <div class="modal fade" id="shuffleAlert" tabindex="-1" aria-labelledby="shuffleAlert" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title ow-font-bold h4" id="exampleModalLabel">{{ $t('general.errors.title').toUpperCase() }}
          </h5>
          <button type="button" class="btn-close d-sm-none" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body ow-font-middle h4">{{ alertModalMessage }}</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-ow btn-close-modal" data-bs-dismiss="modal">{{
              $t('general.close').toUpperCase()
          }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SETTINGS -->
  <div class="modal fade" id="settings" tabindex="-1" aria-labelledby="settings" aria-hidden="true">
    <div class="modal-dialog modal-lg ">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title ow-font-bold h4">{{ $t('settings.navButton').toUpperCase() }}</h5>
          <button type="button" class="btn-close d-sm-none" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body pt-0 mb-2" style="overflow-y: auto;overflow-x: hidden;">
          <!-- LANGUAGE -->
          <div class="row mt-2 mb-3">
            <div class="d-flex align-items-center">
              <p class="ow-font-bold h4">{{ $t('settings.lang.title') }}</p>
            </div>
            <div class="col col-xs-12 col-lg-4">
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-ow align-items-center d-flex pb-0 pt-0 mt-2 mb-1 dropdown-toggle"
                  type="button" data-bs-toggle="dropdown" aria-expanded="false">{{
                      $t('settings.lang.langButton').toUpperCase()
                  }}
                  <!-- <p class="m-0 pt-0 pb-1 h4">{{ $t('settings.lang.langButton').toUpperCase() }}</p> -->
                </button>
                <ul class="dropdown-menu ow-font-middle">
                  <li class="dropdown-item" v-for="item in supportedLocales.filter(x => x != getCurrentLocale())"
                    v-bind:key="item" v-on:click="changeLocale(item)">
                    {{ $t(`locales.${item}`) }}</li>
                </ul>
              </div>
            </div>
          </div>
          <hr class="row mt-0 mb-0">
          <!-- LOCAL STORAGE-->
          <div class="row mt-2 mb-3">
            <div class="d-flex align-items-center">
              <p class="ow-font-bold h4">{{ $t('settings.ls.title') }}</p>
              <transition name="settings-status" style="transition: opacity .5s" mode="out-in">
                <div v-if="localStorageStatus">
                  <p class="ow-font-middle h6 ms-2 ">{{ $t('settings.ls.exist') }}</p>
                </div>
              </transition>
            </div>
            <!-- LOCAL STORAGE BUTTON -->
            <div class="col col-xs-12 col-lg-4">
              <div class="btn-group ow-font-bold" role="group">
                <button class="btn btn-sm btn-outline-ow  justify-content-center ow-font-bold pb-0 pt-0 mt-2 mb-1"
                  v-on:click="clearLocalStorage">{{ $t('settings.ls.clearButton').toUpperCase() }}
                  <!-- <p class="mb-0 pb-1 h4">{{ $t('settings.ls.clearButton').toUpperCase() }}</p> -->
                </button>
              </div>
            </div>
            <!-- LOCAL STORAGE ALERT LG+ -->
            <div class="col col-8 d-none d-lg-block">
              <div class="collapse mb-2" id="collapseLocalStorageAlertLg">
                <div class="alert alert-success mt-2 mb-0 p-1" role="alert">
                  <h5 class="d-none d-lg-block ow-font-middle text-center p-0 m-0">{{
                      $t('settings.ls.alert')
                  }}</h5>
                </div>
              </div>
            </div>
          </div>
          <!-- LOCAL STORAGE ALERT MD -->
          <div class="row d-lg-none justify-content-center collapse p-0 mt-0 mb-1" id="collapseLocalStorageAlertSm">
            <div class="col col-12 mb-2 alert alert-success p-1" role="alert">
              <h6 class="d-lg-none ow-font-middle text-center p-0 m-0">{{ $t('settings.ls.alert') }}
              </h6>
            </div>
          </div>
          <hr class="row mt-0 mb-0">
          <!-- MAP FILTER -->
          <div class="row mt-2 mb-3">
            <p class="ow-font-bold h4">{{ $t('settings.mapFilter.title') }}</p>
            <!-- MAP FILTER BUTTON -->
            <div class="col col-xs-12 col-lg-4">
              <div class="btn-group ow-font-bold" role="group">
                <button class="btn btn-sm btn-outline-ow   justify-content-center ow-font-bold pb-0 pt-0 mt-2 mb-1"
                  v-on:click="resetMapFilter">{{ $t('settings.mapFilter.resetButton').toUpperCase() }}
                  <!-- <p class="mb-0 pb-1 h4">{{ $t('settings.mapFilter.resetButton').toUpperCase() }}</p> -->
                </button>
              </div>
            </div>
            <!-- MAP FILTER ALERT LG+ -->
            <div class="col col-8 d-none d-lg-block">
              <div class="collapse mb-2" id="collapseMapFilterAlertLg">
                <div class="alert alert-success mt-2 mb-0 p-1" role="alert">
                  <h5 class="d-none d-lg-block ow-font-middle text-center p-0 m-0">{{
                      $t('settings.mapFilter.alert')
                  }}</h5>
                </div>
              </div>
            </div>
          </div>
          <!-- MAP FILTER ALERT MD -->
          <div class="row d-lg-none justify-content-center collapse p-0 mb-0" id="collapseMapFilterAlertSm">
            <div class="col col-12 mb-2 alert alert-success p-1" role="alert">
              <h6 class="d-lg-none ow-font-middle text-center p-0 m-0">{{ $t('settings.mapFilter.alert') }}
              </h6>
            </div>
          </div>
          <!-- MAP FILTER MODES-->
          <div class="row mt-1 mb-0">
            <div class="col col-12 col-lg-6 mb-3" v-for="mode in mapModes" v-bind:key="mode">
              <div class="d-flex" data-bs-toggle="collapse" :id="`block-` + mode" :href="`#collapse-` + mode">
                <p class="ow-font-middle h4">{{ $t(`modes.${mode}`) }}</p>
                <p class="d-lg-none h3 ps-2 mb-0 bi-chevron-down" :id="`chevron-` + mode" />
              </div>
              <!-- MAPS BY MODE FULL-->
              <ul class="d-lg-none list-group list-group-flush collapse" :id="`collapse-` + mode">
                <li class="list-group-item ow-font-middle align-items-center text-break li-no-ul"
                  v-for="item in getMapsByMode(mode)" v-bind:key="item.id">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="mapFilter[item.id]"
                      v-on:click="mapFilter[item.id] = !mapFilter[item.id]">
                    <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !mapFilter[item.id] }">{{
                        $t(`maps.${item.id}`)
                    }}</label>
                  </div>
                </li>
              </ul>
              <!-- MAPS BY MODE COLLAPSE -->
              <ul class="d-none d-lg-block list-group list-group-flush">
                <li class="list-group-item ow-font-middle align-items-center text-break li-no-ul"
                  v-for="item in getMapsByMode(mode)" v-bind:key="item.id">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="mapFilter[item.id]"
                      v-on:click="mapFilter[item.id] = !mapFilter[item.id]">
                    <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !mapFilter[item.id] }">{{
                        $t(`maps.${item.id}`)
                    }}</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- SETTINGS FOOTER-->
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-ow btn-close-modal" data-bs-dismiss="modal">{{
              $t('general.close').toUpperCase()
          }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SHUFFLE MODAL BLOCK -->
  <div class="modal fade" id="shuffleResult" tabindex="-1" aria-labelledby="shuffleResult" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <div class="container-fluid" v-if="teamRed.length != 0 && teamBlue.length != 0">
            <div class="row justify-content-center">
              <!-- TEAM RED ROSTER -->
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 "
                v-if="teamBlue.length != 0 || teamBlue != undefined">
                <p class="d-none d-lg-block ow-font-bold team-blue text-end h1">TEAM BLUE</p>
                <p class="d-lg-none ow-font-bold team-blue text-start h1">TEAM BLUE</p>
                <hr class="mb-0 mt-0">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ow-font-bold player-list pb-0 pt-0" v-for="item in teamBlue"
                    v-bind:key="item.id">
                    <p class="d-none d-lg-block text-end pb-0 pt-0 mb-0 h1">{{ item.name.toUpperCase() }}</p>
                    <p class="d-lg-none text-start pb-0 pt-0 mb-0 h1">{{ item.name.toUpperCase() }}</p>
                  </li>
                </ul>
              </div>
              <!-- XS-MD DELIMITER -->
              <div class="col-12 d-md-none" style="height: 15px;" />
              <!-- TEAM RED ROSTER -->
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 "
                v-if="teamRed.length != 0 || teamRed != undefined">
                <p class="d-none d-lg-block ow-font-bold team-red text-start h1">TEAM RED</p>
                <p class="d-lg-none ow-font-bold team-red text-end h1">TEAM RED</p>
                <hr class="mb-0 mt-0">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ow-font-bold player-list pb-0 pt-0" v-for="item in teamRed"
                    v-bind:key="item.id">
                    <p class="d-none d-lg-block text-start pb-0 pt-0 mb-0 h1">{{ item.name.toUpperCase() }}</p>
                    <p class="d-lg-none text-end pb-0 pt-0 mb-0 h1">{{ item.name.toUpperCase() }}</p>
                  </li>
                </ul>
              </div>
            </div>
            <hr>
            <!-- RANDOM MAP BLOCK -->
            <div class="row justify-content-center" v-if="currentMap">
              <div class="col-6 text-end">
                <p class="h4 ow-font-middle">{{ $t('general.nextMap') }}</p>
              </div>
              <div class="clearfix col-6 text-start">
                <p class="d-none d-md-block h2 ow-font-bold player-list lh-1 mb-0">{{ $t(`maps.${currentMap.id}`) }}
                </p>
                <p class="d-md-none h4 ow-font-bold player-list lh-1 mb-0">{{ $t(`maps.${currentMap.id}`) }}</p>
                <p class="fs-6 ow-font-middle">{{ $t(`modes.${currentMap.mode}`) }}</p>
              </div>
            </div>
          </div>
          <!-- SHUFFLE FOOTER -->
          <div class="modal-footer">
            <div class="col-xs-2 col-sm-2" />
            <button type="button" class="btn btn-outline-ow btn-shuffle-modal col h3" data-bs-dismiss="modal">{{
                $t('general.close').toUpperCase()
            }}</button>
            <div class="col-xs-2 col-sm-2" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="container">
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-2 fixed-bottom bg-light">
      <div class="col-8 d-flex ps-2 me-0 align-items-center">
        <img src="./assets/img/icon.png" class="ps-2" style="height:30px;">
        <p class="ow-font-bold text-muted lh-1 m-1 pe-2">2022 CREATED BY GENESI5<br />OVERWATCH © 2022 BLIZZARD</p>
      </div>
      <ul class="col-4 justify-content-end align-items-center m-0 list-unstyled d-flex pe-2">
        <li class="m-2 mb-0">
          <a class="text-decoration-none" href="https://github.com/genesi5/ow-shuffler">
            <p class="bi-github social-item h2" id="githubLink" />
          </a>
        </li>
        <!-- <li class="m-2 mb-0">
          <a class="text-decoration-none" href="">
            <p class="bi-instagram social-item h2" id="instagramLink"></p>
          </a>
        </li> -->
        <!--<li class="m-2 mb-0">
            <a class="text-decoration-none text-reset" href="">
              <p class="bi-twitter h2" id="twitterLink"></p>
            </a>
          </li> -->
      </ul>
    </footer>
  </div>

</template>

<style lang="scss">
@import "./assets/scss/_custom.scss";
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>

<script>

import { default as mapList } from './misc/maps.json'
import { default as packageJson } from '../package.json'

import { Collapse, Modal } from 'bootstrap'
import { SUPPORT_LOCALES } from './i18n'

export default {
  name: 'app',
  el: "#app",

  data() {
    return {
      counter: 0,
      teamRed: [],
      teamBlue: [],
      locale: undefined,
      playerList: undefined,
      alertModalMessage: undefined,
      alertInputMessage: undefined,
      mapList: undefined,
      mapModes: undefined,
      mapFilter: undefined,
      currentMap: undefined,
      localStorageStatus: undefined,
      appVersion: packageJson.version,
      supportedLocales: SUPPORT_LOCALES,
    }
  },
  created() {
    this.setLocale()
    this.setMapList()
    this.setMapFilter()
    document.title += ` ${this.appVersion}`
  },
  mounted() {
    this.setupEventHandlers()
    this.loadPlayersFromLocalStorage()
  },
  props: {
    inputName: String
  },
  watch: {
    mapFilter: {
      handler(newValue, oldValue) { if (newValue != undefined && oldValue != undefined) this.updateLocalStorage("mapFilter") },
      deep: true,
    },
    playerList: {
      handler(newValue, oldValue) { if (newValue != undefined && oldValue != undefined) this.updateLocalStorage("playerList") },
      deep: true,
    },
    locale: {
      handler(newValue) { if (newValue != undefined) this.updateLocalStorage("locale") },
      deep: false,
    },
  },
  methods: {
    setupEventHandlers() {
      // Map mode filter collapse
      this.mapModes.forEach((mode) => {
        document.getElementById(`collapse-${mode}`).addEventListener('show.bs.collapse', function () {
          document.getElementById(`chevron-${mode}`).classList.replace('bi-chevron-down', 'bi-chevron-up')
        })
        document.getElementById(`collapse-${mode}`).addEventListener('hide.bs.collapse', function () {
          document.getElementById(`chevron-${mode}`).classList.replace('bi-chevron-up', 'bi-chevron-down')
        })
      })
      // XS settings icon switcher
      document.getElementById('settingsButton').addEventListener('mouseenter', function () {
        document.getElementById('settingsButton').classList.replace('bi-gear', 'bi-gear-fill')
      })
      document.getElementById('settingsButton').addEventListener('mouseleave', function () {
        document.getElementById('settingsButton').classList.replace('bi-gear-fill', 'bi-gear')
      })
    },
    loadPlayersFromLocalStorage() {
      let ls = JSON.parse(window.localStorage.getItem("playerList"))
      if (ls != null) {
        this.playerList = ls
        // console.log("MAPS",this.mapList.map(x => this.mapNames[x.id]))
      }
      else this.playerList = []
    },
    setLocale() {
      let ls = window.localStorage.getItem("locale")
      if (ls != null) {
        if (this.supportedLocales.includes(ls)) {
          this.locale = ls
          this.$i18n.locale = this.locale
        }
        else this.$i18n.locale = 'en'
      }
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
      let ls = window.localStorage.getItem("mapFilter")
      if (ls != null) this.mapFilter = JSON.parse(ls)
      else this.mapFilter = mapList.reduce((prev, cur) => ({ ...prev, [cur.id]: true }), {})
      // console.log("FILTERS", this.mapFilter)
    },
    getMapsByMode(mode) {
      if (String(mode)) return this.mapList.filter(x => x.mode == mode)
    },
    getCurrentLocale() {
      if (this.supportedLocales.includes(this.$i18n.locale)) return this.$i18n.locale
      else if (this.$i18n.fallbackLocale[this.$i18n.locale] != undefined) {
        return this.$i18n.fallbackLocale[this.$i18n.locale][0]
      }
      return this.$i18n.fallbackLocale.default[0]
    },
    addPlayer(name) {
      if (String(name)) {
        if (this.playerList) {
          let dupItem = this.playerList.find(x => name.toLowerCase() == x.name.toLowerCase())
          if (dupItem == undefined && this.playerList.length < 12) {
            document.getElementById('playerInput').value = ''
            let newPlayer = { id: this.counter++, name: name }
            this.playerList.push(newPlayer)
            // console.info("ADDED", newPlayer)
          }
          else if (dupItem != undefined) {
            let
              dupName = this.playerList[this.playerList.findIndex(x => name.toLowerCase() == x.name.toLowerCase())].name,
              msg = this.$t('input.alerts.duplicateFound', [dupName])
            this.toggleAlertInput(msg)
            // console.warn(`Duplicate found: ${dupName}`)
          }
          else if (this.playerList.length >= 12) {
            let msg = this.$t(`input.alerts.rosterExceeded`)
            this.toggleAlertInput(msg)
            // console.warn("OVERWATCH player limit has been exceded (12 players maximum)")
          }
        }
      }
    },
    delPlayer(id) {
      if (id != undefined) {
        let playerIndex = this.playerList.findIndex(item => { return item.id === id });
        if (playerIndex != undefined) {
          // let playerObj = this.playerList[playerIndex]
          this.playerList.splice(playerIndex, 1)
          // console.info("DELETED", playerObj)
        }
      }
    },
    pickRandomMap() {
      let newMaps = Object.create(this.mapList.filter(x => this.mapFilter[x.id]))
      this.currentMap = newMaps[Math.floor(Math.random() * newMaps.length)]
      // console.info("CURRENT MAP", this.currentMap)
    },
    resetMapFilter() {
      if (Object.keys(this.mapFilter).some((key) => !this.mapFilter[key])) {
        this.mapFilter = Object.fromEntries(Object.keys(this.mapFilter).map((key) => [key, true]))
        let mapFilterCollapse = {
          lg: new Collapse("#collapseMapFilterAlertLg"),
          sm: new Collapse("#collapseMapFilterAlertSm")
        }
        mapFilterCollapse.lg.show()
        mapFilterCollapse.sm.show()
        setTimeout(() => {
          mapFilterCollapse.lg.hide()
          mapFilterCollapse.sm.hide()
        }, 3000)
      }
    },
    shuffleTeams() {
      if (this.playerList.length != 0 && this.playerList.length % 2 == 0) {
        let list = Object.create(this.playerList)
        var randomIndex, currentIndex = list.length, half = Math.ceil(list.length / 2);
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex--
          [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]]
        }
        this.teamRed = list.slice(0, half)
        // console.info('TEAM RED', this.teamRed.map(x => x.name))
        this.teamBlue = list.slice(-half)
        // console.info('TEAM BLUE', this.teamBlue.map(x => x.name))
        this.pickRandomMap()
        if (this.currentMap != undefined) this.togglePlayerModal(true)
        else {
          this.toggleAlertModal(true, this.$t('general.errors.mapPoolEmpty'))
          // console.warn("Map pool is empty")
        }
      }
      else if (this.playerList.length % 2 != 0) {
        this.toggleAlertModal(true, this.$t('general.errors.rosterNotEven'))
        // console.warn("Roster is not even")
      }
      else if (this.playerList.length == 0) {
        this.toggleAlertModal(true, this.$t('general.errors.rosterEmpty'))
        // console.warn("Roster is empty")
      }
    },
    togglePlayerModal(opt) {
      let playerModal = new Modal(document.getElementById('shuffleResult'))
      if (opt) playerModal.show()
      else playerModal.hide()
    },
    toggleSettingsModal(opt) {
      this.updateLocalStorageStatus()
      let settingsModal = new Modal(document.getElementById('settings'))
      if (opt) settingsModal.show()
      else settingsModal.hide()
    },
    toggleAlertModal(opt, message) {
      let alertModal = new Modal(document.getElementById('shuffleAlert'))
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
      let alertInputCollapse = new Collapse("#collapseInputAlert")
      alertInputCollapse.show()
      setTimeout(() => {
        alertInputCollapse.hide()
        this.alertInputMessage = undefined
      }, 3000)
    },
    changeLocale(item) {
      this.locale = item
      if (this.locale != undefined) window.localStorage.setItem('locale', this.locale)
      // console.log("LOCALE", this.locale)
    },
    updateLocalStorageStatus() {
      if (window.localStorage.length > 0) this.localStorageStatus = true
      else this.localStorageStatus = false
    },
    updateLocalStorage(obj) {
      switch (obj) {
        case "locale":
          // console.log(`Updated ${obj}`, this.locale)
          this.$i18n.locale = this.locale
          window.localStorage.setItem("locale", this.locale)
          document.querySelector('html').setAttribute('lang', this.locale)
          this.updateLocalStorageStatus()
          break
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
        let localStorageCollapse = {
          lg: new Collapse("#collapseLocalStorageAlertLg"),
          sm: new Collapse("#collapseLocalStorageAlertSm")
        }
        this.localStorageStatus = false
        localStorageCollapse.lg.show()
        localStorageCollapse.sm.show()
        setTimeout(() => {
          localStorageCollapse.lg.hide()
          localStorageCollapse.sm.hide()
        }, 3000)
      }
    }
  }
}
</script>
