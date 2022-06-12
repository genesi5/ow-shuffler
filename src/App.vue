<template>
  <!-- NAVBAR -->
  <div class="container">
    <nav class="navbar navbar-expand-lg bg-light fixed-top navbar-light ">
      <!-- LOGO -->
      <div class="col-4 d-flex align-items-end navbar-title  ps-3">
        <img class="navbar-brand d-inline-block align-text-top me-2" width="50" src="./assets/img/ow_icon.svg">
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

  <!-- FOOTER -->
  <div class="container">
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-2 fixed-bottom bg-light">
      <div class="col-8 d-flex ps-2 me-0 align-items-center">
        <img src="./assets/img/ow_icon.svg" class="ps-2" style="height:30px;">
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
          <hr class="row mt-0 mb-0"><!-- EXTRA OPTIONS -->
          <div class="row mt-2 mb-3">
            <div class="d-flex align-items-center">
              <p class="ow-font-bold h4">{{ $t('settings.extra.title') }}</p>
            </div>
            <div class="col col-xs-12 col-lg-12">
              <li class="list-group-item ow-font-middle align-items-center text-break li-no-ul">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="extraOptions.roles"
                    v-on:click="extraOptions.roles = !extraOptions.roles">
                  <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !extraOptions.roles }">{{
                      $t('settings.extra.options.roles')
                  }}</label>
                </div>
              </li>
              <li class="list-group-item ow-font-middle align-items-center text-break li-no-ul">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="extraOptions.heroes"
                    v-on:click="extraOptions.heroes = !extraOptions.heroes">
                  <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !extraOptions.heroes }">{{
                      $t('settings.extra.options.heroes')
                  }}</label>
                </div>
              </li>
              <li class="list-group-item ow-font-middle align-items-center text-break li-no-ul">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="extraOptions.map"
                    v-on:click="extraOptions.map = !extraOptions.map">
                  <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !extraOptions.map }">{{
                      $t('settings.extra.options.map')
                  }}</label>
                </div>
              </li>
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
              <!-- MAPS BY MODE COLLAPSE -->
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
              <!-- MAPS BY MODE FULL -->
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
        <!-- SETTINGS FOOTER -->
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
          <div class="container-fluid">
            <div class="row">
              <!-- TEAM RED ROSTER -->
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6" v-if="teamBlue.length != 0">
                <p class="d-none d-lg-block ow-font-bold team-blue text-end h1">TEAM BLUE</p>
                <p class="d-lg-none ow-font-bold team-blue text-start h1">TEAM BLUE</p>
                <hr class="mb-0 mt-0">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ow-font-bold player-list p-0" v-for="item in teamBlue" :key="item"
                    :id="`player_${item.id}`">
                    <div class="d-flex justify-content-start justify-content-lg-end  align-items-center">
                      <p class="d-none d-lg-block pb-0 pt-0 mb-0 h1"
                        :class="{ 'pe-lg-2': !extraOptions.roles && !extraOptions.heroes }">{{ item.name.toUpperCase()
                        }}
                      </p>
                      <p class="player-list-role lh-1 m-0 ms-lg-3 me-lg-0 me-3" :class="getIcon(item.role, 'role')"
                        v-if="extraOptions.roles && !extraOptions.heroes" />
                      <p class="player-list-hero lh-1 m-0 ms-lg-2 me-lg-0 me-2" data-bs-toggle="tooltip"
                        data-bs-placement="top" data-bs-custom-class="custom-tooltip" :title="$t(`heroes.${item.hero}`)"
                        :class="getIcon(item.hero, 'hero')" v-if="extraOptions.heroes" />
                      <p class="d-lg-none pb-0 pt-0 mb-0 h1"
                        :class="{ 'ps-2': !extraOptions.roles && !extraOptions.heroes }">{{ item.name.toUpperCase()
                        }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <!--XS - MD DELIMITER-->
              <div class=" col-12 d-md-none" style="height: 15px;" />
              <!-- TEAM RED ROSTER -->
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6" v-if="teamRed.length != 0">
                <p class="d-none d-lg-block ow-font-bold team-red text-start h1">TEAM RED</p>
                <p class="d-lg-none ow-font-bold team-red text-end h1">TEAM RED</p>
                <hr class="mb-0 mt-0">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ow-font-bold player-list p-0" v-for="item in teamRed" :key="item"
                    :id="`player_${item.id}`">
                    <div class="d-flex justify-content-end justify-content-lg-start align-items-center">
                      <p class="d-lg-none pb-0 pt-0 mb-0 h1"
                        :class="{ 'pe-2': !extraOptions.roles && !extraOptions.heroes }">{{
                            item.name.toUpperCase()
                        }}
                      </p>
                      <p class="player-list-role lh-1 m-0 me-lg-3 ms-lg-0 ms-3" :class="getIcon(item.role, 'role')"
                        v-if="extraOptions.roles && !extraOptions.heroes" />
                      <p class="player-list-hero lh-1 m-0 me-lg-2 ms-lg-0 ms-2" data-bs-toggle="tooltip"
                        data-bs-placement="top" data-bs-custom-class="custom-tooltip" :title="$t(`heroes.${item.hero}`)"
                        :class="getIcon(item.hero, 'hero')" v-if="extraOptions.heroes" />
                      <p class="d-none d-lg-block pb-0 pt-0 mb-0 h1"
                        :class="{ 'ps-lg-2': !extraOptions.roles && !extraOptions.heroes }">
                        {{ item.name.toUpperCase() }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <hr v-if="extraOptions.map && currentMap && playerList.length != 0">
            <!-- MAP BLOCK -->
            <div class="row justify-content-center" v-if="extraOptions.map && currentMap">
              <div class="col-6 text-end">
                <p class="h4 ow-font-middle">{{ $t('general.nextMap') }}</p>
              </div>
              <div class="clearfix col-6 text-start">
                <p class="d-none d-md-block h2 ow-font-bold player-list lh-1 mb-0">{{
                    $t(`maps.${currentMap.id}`)
                }}
                </p>
                <p class="d-md-none h4 ow-font-bold player-list lh-1 mb-0">{{ $t(`maps.${currentMap.id}`) }}</p>
                <p class="fs-6 ow-font-middle">{{ $t(`modes.${currentMap.mode}`) }}</p>
              </div>
            </div>
          </div>
          <!-- SHUFFLE FOOTER -->
          <div class="modal-footer">
            <div class="col-xs-2 col-sm-2" />
            <button type="button" class="btn btn-outline-ow btn-shuffle-modal col h3" data-bs-dismiss="modal"
              v-on:click="togglePlayerModal(false)">{{
                  $t('general.close').toUpperCase()
              }}</button>
            <div class="col-xs-2 col-sm-2" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss">
@import "./assets/scss/_custom.scss";
@import "./assets/scss/_overwatch-icons.scss";
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>

<script>
import { default as mapList } from './misc/maps.json'
import { default as heroList } from './misc/heroes.json'
import { default as packageJson } from '../package.json'

// import { Collapse, Modal } from 'bootstrap'
import { Collapse, Modal, Tooltip } from 'bootstrap'
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
      extraOptions: undefined,
      localStorageStatus: undefined,
      appVersion: packageJson.version,
      supportedLocales: SUPPORT_LOCALES,
      // teamNames: {red: "TEAM RED", blue: "TEAM BLUE"},
    }
  },
  created() {
    this.setLocale()
    this.setMapList()
    this.setMapFilter()
    this.setExtraOptions()
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
    extraOptions: {
      handler(newValue, oldValue) { if (newValue != undefined && oldValue != undefined) this.updateLocalStorage("extraOptions") },
      deep: true,
    },
    locale: {
      handler(newValue) { if (newValue != undefined) this.updateLocalStorage("locale") },
      deep: false,
    }
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
      // Shuffler modal
      document.getElementById('shuffleResult').addEventListener('shown.bs.modal', function () {
        document.querySelectorAll('p[data-bs-toggle="tooltip"]')
          .forEach(tooltipNode => new Tooltip(tooltipNode))
      })
      document.getElementById('shuffleResult').addEventListener('hidden.bs.modal', function () {
        this.teamBlue = []
        this.teamRed = []
      })
    },
    loadPlayersFromLocalStorage() {
      let ls = JSON.parse(window.localStorage.getItem("playerList"))
      if (ls != null) {
        for (let i = 0; i < ls.length; i++) ls[i].id = i
        this.playerList = ls
        this.counter = ls.length
      }
      else this.playerList = []
    },
    randomiseList(list) {
      let
        randomIndex,
        currentIndex = list.length
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]]
      }
      return list
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
    setExtraOptions() {
      let ls = window.localStorage.getItem("extraOptions")
      if (ls != undefined) this.extraOptions = JSON.parse(ls)
      else this.extraOptions = { roles: false, heroes: false, map: false }
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
    getIcon(id, type) {
      if (String(id) != null && String(type != null)) {
        if (String(type) == "role") return `ow-role-${id}`
        else if (String(type) == "hero") return `ow-hero-${id}`
      }
    },
    getRoleSet(length) {
      // Parametrize in future
      const
        roleSets = {
          6: "2D-2T-2S",
          5: "2D-1T-2S",
          4: "2D-2S",
          3: "2D-1S"
        },
        hash = { T: "tank", D: "damage", S: "support" }
      if (Number(length) >= 3) {
        let
          roles = new Array(),
          roleSet = roleSets[length].split('-')
        for (let set of roleSet) {
          roles.push(String(hash[set[1]]))
          if (Number(set[0]) == 2) roles.push(roles[roles.length - 1])
        }
        return roles
      }
      return null
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
    
    shuffleTeams() {
      // Randomize map
      if (this.extraOptions.map) {
        let newMaps = Object.create(this.mapList.filter(x => this.mapFilter[x.id]))
        if (newMaps.length != 0) this.currentMap = newMaps[Math.floor(Math.random() * newMaps.length)]
        else {
          this.toggleAlertModal(true, this.$t('general.errors.mapPoolEmpty'))
          // console.warn("Map pool is empty")
          return
        }
      }
      // Randomize player teams
      if (this.playerList.length != 0) {
        const
          list = this.randomiseList(Object.create(this.playerList)),
          half = Math.ceil(list.length / 2)
        if (this.playerList.length % 2 != 0) {
          this.toggleAlertModal(true, this.$t('general.errors.rosterNotEven'))
          // console.warn("Roster is not even")
          return
        }
        this.teamBlue = Object.create(list.slice(0, half))
        this.teamRed = Object.create(list.slice(-half))

        // Randomize roles
        if (this.extraOptions.roles) {
          if (half >= 3) {
            let roles = {
              blue: this.randomiseList(this.getRoleSet(half)),
              red: this.randomiseList(this.getRoleSet(half))
            }
            this.teamBlue.forEach((x, i) => x.role = roles.blue[i])
            this.teamRed.forEach((x, i) => x.role = roles.red[i])
          }
          // Don't assign roles if there's less than three players in teams
          else if (half < 3) {
            this.teamBlue.forEach((x) => x.role = null)
            this.teamRed.forEach((x) => x.role = null)
          }
        }
        // Randomize heroes
        if (this.extraOptions.heroes) {
          // Randomize heroes by roles
          if (this.extraOptions.roles) {
            const
              heroSortedSet = {
                damage: this.randomiseList(Object.create(heroList.filter(x => x.class == "damage"))),
                support: this.randomiseList(Object.create(heroList.filter(x => x.class == "support"))),
                tank: this.randomiseList(Object.create(heroList.filter(x => x.class == "tank")))
              }
            let
              setBlue = Object.create(heroSortedSet),
              setRed = Object.create(heroSortedSet)

            this.teamBlue.forEach(function (x) {
              while (setBlue[x.role].length) {
                x.hero = setBlue[x.role].splice(setBlue[x.role].length * Math.random() | 0, 1)[0]['id'];
                return
              }
            })
            this.teamRed.forEach(function (x) {
              while (setRed[x.role].length) {
                x.hero = setRed[x.role].splice(setRed[x.role].length * Math.random() | 0, 1)[0]['id'];
                return
              }
            })
          }
          // Assign random heroes
          else {
            let
              setBlue = this.randomiseList(Object.create(heroList)),
              setRed = this.randomiseList(Object.create(heroList))
            this.teamBlue.forEach(function (x) {
              while (setBlue.length) {
                x.hero = setBlue.splice(setBlue.length * Math.random() | 0, 1)[0]['id'];
                return
              }
            })
            this.teamRed.forEach(function (x) {
              while (setRed.length) {
                x.hero = setRed.splice(setRed.length * Math.random() | 0, 1)[0]['id'];
                return
              }
            })
          }
        }
        // console.info('TEAM BLUE', this.teamBlue)
        // console.info('TEAM RED', this.teamRed)
        this.togglePlayerModal(true)
      }
      else {
        if (this.extraOptions.map) this.togglePlayerModal(true)
        else {
          this.toggleAlertModal(true, this.$t('general.errors.rosterEmpty'))
          // console.warn("Roster is empty")
          return
        }
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
        case "extraOptions":
          // console.log(`Updated ${obj}`, this.locale)
          window.localStorage.setItem("extraOptions", JSON.stringify(this.extraOptions))
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
