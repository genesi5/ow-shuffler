<template>
  <!-- NAVBAR -->
  <header>
    <nav class="container-fluid navbar navbar-expand-lg bg-light fixed-top navbar-light m-0 py-1 py-sm-2">
      <!-- LOGO -->
      <div class="col col-4 d-flex align-items-end navbar-title ps-3">
        <img class="navbar-brand d-inline-block align-text-top me-2" src="./assets/svg/ow_icon.svg"
          alt="Overwatch logo">
        <p class="d-none d-md-block fw-bold mb-0 h4">OVERWATCH<br />TEAM SHUFFLER</p>
        <p class="d-none d-md-block fw-normal ms-2 mb-0 fs-6">ver. {{ appVersion }}</p>
      </div>
      <!-- BUTTON -->
      <div class="col col-4 d-flex justify-content-center">
        <button class="d-none d-sm-block btn btn-lg btn-outline-ow pb-0" v-on:click="shuffleTeams">
          <p class="m-0">SHUFFLE!</p>
        </button>
        <button class="d-sm-none btn btn-sm btn-outline-ow py-0" v-on:click="shuffleTeams">
          <p class="m-0">SHUFFLE!</p>
        </button>
      </div>
      <!-- SETTINGS -->
      <div class="col col-4 d-flex justify-content-end pb-0 pe-3">
        <button class="d-none d-sm-block btn btn-lg btn-outline-ow pb-0" v-on:click="toggleSettingsOffcanvas(true)">
          <p class="m-0">{{ $t('settings.navButton').toUpperCase() }}</p>
        </button>
        <div id="settingsButton">
          <p class="d-sm-none bi bi-gear fs-1 lh-1 mb-0" v-on:click="toggleSettingsOffcanvas(true)">
          </p>
        </div>
      </div>
    </nav>
  </header>

  <!-- MAIN-->
  <div class="container" id="mainCollapsePanel">
    <!-- FILTERS AND OPTIONS-->
    <div class="row justify-content-center">
      <div class="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8 btn-group btn-group-justified" role="group">
        <button class="btn btn-sm btn-ow-main border-bottom-0 fs-5" id="button-main-mapFilter"
          v-on:click="toggleFilterCollapse('mapFilter')" v-text="$t('mapData.collapseButton').toUpperCase()" />
        <button class="btn btn-sm btn-ow-main border-bottom-0 fs-5" id="button-main-heroFilter"
          v-on:click="toggleFilterCollapse('heroFilter')" v-text="$t('heroData.collapseButton').toUpperCase()" />
        <button class="btn btn-sm btn-ow-main border-bottom-0 fs-5" id="button-main-extraOptions"
          v-on:click="toggleFilterCollapse('extraOptions')" v-text="$t('extra.collapseButton').toUpperCase()" />
      </div>
    </div>
  </div>
  <!-- MAP COLLAPSE BLOCK-->
  <div class="container">
    <div class="row justify-content-center collapse" id="collapse-main-mapFilter">
      <div class="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
        <div class="card сard-body container px-2 px-sm-4 sharp-edge-top">
          <div class="row mt-2 mb-3">
            <p class="fw-bold h4">{{ $t('mapData.title') }}</p>
            <!-- MAP FILTER BUTTON -->
            <div class="col col-12 col-xs-12 col-lg-4">
              <button class="btn btn-sm btn-outline-ow justify-content-center fw-bold py-0 mt-2 mb-1"
                :class="{ disabled: !mapData.state }" v-on:click="resetMapFilter"
                v-text="$t('mapData.resetButton').toUpperCase()" />
            </div>
            <!-- MAP FILTER ALERT LG+ -->
            <div class="col col-8 d-none d-lg-block">
              <div class="collapse mb-2" id="collapseMapFilterAlertLg">
                <div class="alert alert-success mt-2 mb-0 p-1" role="alert">
                  <h5 class="d-none d-lg-block fw-normal text-center p-0 m-0">{{
                      $t('mapData.alert')
                  }}</h5>
                </div>
              </div>
            </div>
          </div>
          <!-- MAP FILTER ALERT MD -->
          <div class="row d-lg-none justify-content-center collapse m-0" id="collapseMapFilterAlertSm">
            <div class="col col-12 mb-2 alert alert-success p-1" role="alert">
              <h6 class="d-lg-none fw-normal text-center p-0 m-0">{{ $t('mapData.alert') }}
              </h6>
            </div>
          </div>
          <!-- MAP FILTER MODES-->
          <div class="row mt-1 mb-0">
            <div class="col col-12 col-lg-6 mb-3" v-for="mode in mapData.modes" v-bind:key="mode.id" v-show="mode.show">
              <div class="d-flex mb-2" data-bs-toggle="collapse" :id="`block-` + mode.id"
                :href="`#collapse-mapFilter-` + mode.id">
                <p class="fw-normal h4 pe-2 mb-0">{{ $t(`mapData.mapModes.${mode.id}`) }}</p>
                <p class="d-lg-none bi bi-chevron-down chevron-rotate h3 lh-1 mb-0" :id="`chevron-` + mode.id" />
              </div>
              <!-- MAPS BY MODE COLLAPSE -->
              <ul class="d-lg-none list-group list-group-flush collapse" :id="`collapse-mapFilter-` + mode.id">
                <li class="list-group-item fw-normal align-items-center text-break li-no-ul"
                  v-for="item in getMapsByMode(mode.id)" v-bind:key="item.id" v-show="mode.show">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="mapData.filter[item.id]"
                      v-on:click="mapData.filter[item.id] = !mapData.filter[item.id]">
                    <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !mapData.filter[item.id] }">{{
                        $t(`mapData.maps.${item.id}`)
                    }}</label>
                  </div>
                </li>
              </ul>
              <!-- MAPS BY MODE LG+ -->
              <ul class="d-none d-lg-block list-group list-group-flush">
                <li class="list-group-item fw-normal align-items-center text-break li-no-ul"
                  v-for="item in getMapsByMode(mode.id)" v-bind:key="item.id" v-show="mode.show">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="mapData.filter[item.id]"
                      v-on:click="mapData.filter[item.id] = !mapData.filter[item.id]">
                    <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !mapData.filter[item.id] }">{{
                        $t(`mapData.maps.${item.id}`)
                    }}</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- HERO COLLAPSE BLOCK-->
    <div class="row justify-content-center collapse" id="collapse-main-heroFilter">
      <div class="col col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
        <div class="card сard-body container px-2 px-sm-4 sharp-edge-top">
          <div class="row mt-2 mb-3">
            <p class="fw-bold h4">{{ $t('heroData.title') }}</p>
            <!-- HERO FILTER BUTTON -->
            <div class="col col-12 col-xs-12 col-lg-4 ">
              <button class="btn btn-sm btn-outline-ow justify-content-center fw-bold py-0 mt-2 mb-1"
                :class="{ disabled: !heroData.state }" v-on:click="resetHeroFilter"
                v-text="$t('heroData.resetButton').toUpperCase()" />
            </div>
            <!-- HERO FILTER ALERT LG+ -->
            <div class="col col-8 d-none d-lg-block">
              <div class="collapse mb-2" id="collapseHeroFilterAlertLg">
                <div class="alert alert-success mt-2 mb-0 p-1" role="alert">
                  <h5 class="d-none d-lg-block fw-normal text-center p-0 m-0">{{
                      $t('heroData.alert')
                  }}</h5>
                </div>
              </div>
            </div>
          </div>
          <!-- HERO FILTER ALERT MD -->
          <div class="row d-lg-none justify-content-center collapse m-0" id="collapseHeroFilterAlertSm">
            <div class="col col-12 mb-2 alert alert-success p-1" role="alert">
              <h6 class="d-lg-none fw-normal text-center p-0 m-0">{{ $t('heroData.alert') }}
              </h6>
            </div>
          </div>
          <!-- HERO FILTER CLASSES MD -->
          <div class="row mt-1 mb-0">
            <div class="col col-12 d-lg-none mb-3" v-for="role in heroData.classes" v-bind:key="role">
              <div class="d-flex mb-2" data-bs-toggle="collapse" :id="`block-` + role"
                :href="`#collapse-heroFilter-` + role">
                <p class="fw-normal h4 pe-2 mb-0">{{ $t(`heroData.heroClasses.${role}`) }}</p>
                <p class="h3 lh-1 mb-0 bi-chevron-down chevron-rotate" :id="`chevron-` + role" />
              </div>
              <!-- HERO FILTER CLASSES COLLAPSE -->
              <ul class="list-group list-group-flush collapse" :id="`collapse-heroFilter-` + role">
                <li class="list-group-item fw-normal align-items-center text-break li-no-ul"
                  v-for="item in getHeroesByClass(role)" v-bind:key="item.id">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="heroData.filter[item.id]"
                      v-on:click="heroData.filter[item.id] = !heroData.filter[item.id]">
                    <label class="form-check-label h5 mb-0"
                      v-bind:class="{ 'text-muted': !heroData.filter[item.id] }">{{
                          $t(`heroData.heroes.${item.id}`)
                      }}</label>
                  </div>
                </li>
              </ul>
            </div>
            <!-- HERO FILTER CLASSES LG+ -->
            <div class="col col-lg-6 d-none d-lg-block mb-3" v-for="role in ['tank', 'support']" v-bind:key="role">
              <p class="fw-normal h4">{{ $t(`heroData.heroClasses.${role}`) }}</p>
              <ul class="list-group list-group-flush">
                <li class="list-group-item fw-normal align-items-center text-break li-no-ul"
                  v-for="item in getHeroesByClass(role)" v-bind:key="item.id">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="heroData.filter[item.id]"
                      v-on:click="heroData.filter[item.id] = !heroData.filter[item.id]">
                    <label class="form-check-label h5 mb-0"
                      v-bind:class="{ 'text-muted': !heroData.filter[item.id] }">{{
                          $t(`heroData.heroes.${item.id}`)
                      }}</label>
                  </div>
                </li>
              </ul>
            </div>
            <p class="d-none d-lg-block fw-normal h4">{{ $t(`heroData.heroClasses.damage`) }}</p>
            <div class="col col-lg-6 d-none d-lg-block mb-3">
              <ul class="list-group list-group-flush">
                <li class="list-group-item fw-normal align-items-center text-break li-no-ul"
                  v-for="item in getHeroesByClass('damage').slice(0, Math.ceil(getHeroesByClass('damage').length / 2))"
                  v-bind:key="item.id">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="heroData.filter[item.id]"
                      v-on:click="heroData.filter[item.id] = !heroData.filter[item.id]">
                    <label class="form-check-label h5 mb-0"
                      v-bind:class="{ 'text-muted': !heroData.filter[item.id] }">{{
                          $t(`heroData.heroes.${item.id}`)
                      }}</label>
                  </div>
                </li>
              </ul>
            </div>
            <div class="col col-lg-6 d-none d-lg-block mb-3">
              <ul class="list-group list-group-flush">
                <li class="list-group-item fw-normal align-items-center text-break li-no-ul"
                  v-for="item in getHeroesByClass('damage').slice((Math.ceil(getHeroesByClass('damage').length) / 2) + 1)"
                  v-bind:key="item.id">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="heroData.filter[item.id]"
                      v-on:click="heroData.filter[item.id] = !heroData.filter[item.id]">
                    <label class="form-check-label h5 mb-0"
                      v-bind:class="{ 'text-muted': !heroData.filter[item.id] }">{{
                          $t(`heroData.heroes.${item.id}`)
                      }}</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- EXTRA COLLAPSE BLOCK-->
    <div class="row justify-content-center collapse" id="collapse-main-extraOptions">
      <div class="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
        <div class="card сard-body container px-2 px-sm-4 pb-0 pb-sm-3 sharp-edge-top">
          <!-- EXTRA OPTIONS -->
          <div class="row mt-2 mb-2">
            <div class="d-flex align-items-center">
              <p class="fw-bold h4">{{ $t('extra.title') }}</p>
            </div>
          </div>
          <!-- TEAM NAMES -->
          <div class="row card m-0 mb-2"
            :class="flags.invalidTeamName.blue || flags.invalidTeamName.red ? 'border-danger' : ''">
            <div class="input-group p-2 pt-sm-3 pb-sm-3">
              <!-- TEAM BLUE -->
              <div class="col col-12 col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xl-6 px-sm-2 mb-2 mb-xl-0">
                <div class="form-floating">
                  <input type="text" id="inputTeamBlue" :value="teamNames.blue" placeholder="placeholder"
                    class="form-control fw-normal fs-4" :class="{ 'is-invalid': flags.invalidTeamName.blue }"
                    @change="(event) => { if (event.target.value.length) teamNames['blue'] = event.target.value.trim() }"
                    @input="validateTeamNameInput($event, 'blue')">
                  <label class="fw-normal fs-5 pt-2" v-text="$t('extra.options.teams.blue')" />
                </div>
                <p class="fw-normal text-danger lh-1 mb-2 pt-1" v-text="alerts.teamInput.blue"
                  v-show="flags.invalidTeamName.blue" />
              </div>
              <!-- TEAM RED -->
              <div class="col col-12 col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xl-6 px-sm-2">
                <div class="form-floating">
                  <input type="text" id="inputTeamRed" :value="teamNames.red" placeholder="placeholder"
                    class="form-control fw-normal fs-4" :class="{ 'is-invalid': flags.invalidTeamName.red }"
                    @change="(event) => { if (event.target.value.length) teamNames['red'] = event.target.value.trim() }"
                    @input="validateTeamNameInput($event, 'red')">
                  <label class="fw-normal fs-5 pt-2" v-text="$t('extra.options.teams.red')" />
                </div>
                <p class="fw-normal text-danger lh-1 mb-2 pt-1" v-text="alerts.teamInput.red"
                  v-show="flags.invalidTeamName.red" />
              </div>
            </div>
          </div>
          <!-- GENERAL RANDOMIZE OPTIONS -->
          <div class="row card m-0 mb-2">
            <div class="input-group p-2 pb-sm-3">
              <!-- RANDOM CAPTAINS -->
              <div class="col col-12 col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xl-6 px-sm-2 mb-2 mb-xl-0">
                <div class="form-check form-switch fw-normal mb-0">
                  <input class="form-check-input" type="checkbox" v-model="extraOptions.captains"
                    v-on:click="extraOptions.captains = !extraOptions.captains">
                  <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !extraOptions.captains }">{{
                      $t('extra.options.captains')
                  }}</label>
                </div>
              </div>
              <!-- RANDOM MAP -->
              <div class="col col-12 col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xl-6 px-sm-2">
                <div class="form-check form-switch fw-normal mb-0">
                  <input class="form-check-input" type="checkbox" v-model="extraOptions.map"
                    v-on:click="extraOptions.map = !extraOptions.map">
                  <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !extraOptions.map }">{{
                      $t('extra.options.map')
                  }}</label>
                </div>
              </div>
            </div>
          </div>
          <!-- RANDOM ROLES -->
          <div class="row card m-0 mb-2"
            :class="{ 'border-opacity-50': extraOptions.captains || !extraOptions.roles, 'border-danger': flags.invalidRoleSets }">
            <div class="input-group p-2 pb-sm-3">
              <!-- RANDOM ROLES FLAG -->
              <div class="col col-12 col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xl-6 px-sm-2 mb-2 mb-xl-0">
                <div class="form-check form-switch fw-normal">
                  <input class="form-check-input" type="checkbox" v-model="extraOptions.roles"
                    v-on:click="extraOptions.roles = !extraOptions.roles" :disabled="extraOptions.captains">
                  <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !extraOptions.roles }">{{
                      $t('extra.options.roles.switch')
                  }}</label>
                </div>
              </div>
              <!-- ROLE RATIO SETUP -->
              <div class="col col-12 col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xl-6 px-sm-2">
                <label class="fw-normal mb-1" v-bind:class="{ 'text-muted': extraOptions.captains }"
                  :disabled="!extraOptions.roles || extraOptions.captains">{{
                      $t('extra.options.roles.roleSets')
                  }}</label>
                <div class="row">
                  <div class="col col-3">
                    <button class="w-100 btn btn-sm btn-block btn-outline-ow dropdown-toggle fs-4 pb-0 pt-0"
                      type="button" data-bs-toggle="dropdown" aria-expanded="false"
                      :disabled="!extraOptions.roles || extraOptions.captains">{{ currentRoleSet }}
                    </button>
                    <ul class="dropdown-menu">
                      <li class="dropdown-item fw-normal" v-on:click="currentRoleSet = key"
                        v-for="key in Object.keys(roleSets).sort((a, b) => b - a)" :key="key"
                        :class="{ 'active': currentRoleSet == key, 'disabled': flags.beta && Number(key) == 6 }">
                        {{ $tc('extra.options.roles.dropdown', Number(key - 3), [key]) }}
                      </li>
                    </ul>
                  </div>
                  <div class="col col-3 ps-0">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text p-0 px-1">
                        <label class="fw-normal ow-role-tank fs-6"
                          :class="{ 'text-black-50': !extraOptions.roles || extraOptions.captains }" />
                      </span>
                      <input type="number" min="0" :max="currentRoleSet" id="inputTank"
                        class="form-control fw-normal fs-4 lh-1" :value="roleSets[currentRoleSet].tank"
                        :disabled="!extraOptions.roles || extraOptions.captains" v-on:keydown.enter.prevent
                        @input="validateRoleInput(roleSets[currentRoleSet], $event, 'tank')">
                    </div>
                  </div>
                  <div class="col col-3 ps-0">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text p-0 px-1">
                        <label class="fw-normal ow-role-damage fs-6"
                          :class="{ 'text-black-50': !extraOptions.roles || extraOptions.captains }" />
                      </span>
                      <input type="number" min="0" :max="currentRoleSet" id="inputDamage"
                        class="form-control fw-normal fs-4 lh-1" :value="roleSets[currentRoleSet].damage"
                        :disabled="!extraOptions.roles || extraOptions.captains" v-on:keydown.enter.prevent
                        @input="validateRoleInput(roleSets[currentRoleSet], $event, 'damage')">

                    </div>
                  </div>
                  <div class="col col-3 ps-0">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text p-0 px-1">
                        <label class="fw-normal ow-role-support fs-6"
                          :class="{ 'text-black-50': !extraOptions.roles || extraOptions.captains }" />
                      </span>
                      <input type="number" min="0" :max="currentRoleSet" id="inputSupport"
                        class="form-control fw-normal fs-4 lh-1" :value="roleSets[currentRoleSet].support"
                        :disabled="!extraOptions.roles || extraOptions.captains" v-on:keydown.enter.prevent
                        @input="validateRoleInput(roleSets[currentRoleSet], $event, 'support')">
                    </div>
                  </div>
                </div>
                <p class="fw-normal text-danger lh-1 mb-2 pt-1"
                  :class="{ 'opacity-50': !extraOptions.roles || extraOptions.captains }"
                  v-text="$t('extra.options.roles.invalidRoleSet', [currentRoleSet])"
                  v-show="flags.invalidRoleSets && Object.values(roleSets[currentRoleSet]).reduce((a, b) => a + b) != Number(currentRoleSet)" />
              </div>
            </div>
          </div>
          <!-- RANDOM HEROES -->
          <div class="row card m-0 mb-2">
            <div class="input-group p-2 pb-sm-3">
              <!-- RANDOM HEROES FLAG -->
              <div class="col col-12 col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xl-6 px-sm-2 mb-2 mb-xl-0">
                <div class="form-check form-switch fw-normal">
                  <input class="form-check-input" type="checkbox" v-model="extraOptions.heroes"
                    v-on:click="extraOptions.heroes = !extraOptions.heroes" :disabled="extraOptions.captains">
                  <label class="form-check-label h5 mb-0" v-bind:class="{ 'text-muted': !extraOptions.heroes }">{{
                      $t('extra.options.heroes.switch')
                  }}</label>
                </div>
              </div>
              <!-- RANDOM HERO BAN -->
              <div class="col col-12 col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xl-6 px-sm-2">
                <div class="input-group">
                  <div class="d-flex mb-1">
                    <label class="fw-normal">{{ $t('extra.options.heroes.heroBan') }}</label>
                    <label class="fw-bold m-0 ms-1">{{ extraOptions.heroBan }}</label>
                  </div>
                  <input type="range" class="form-range" min="0" max="10" v-model.number="extraOptions.heroBan">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container mt-2 mb-4">
    <!-- INPUT-->
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6">
        <div class="form-floating opac">
          <input class="form-control fw-normal fs-3" type="text" id="inputPlayer" placeholder="placeholder"
            v-on:keyup.enter="addPlayer($event.target.value.trim())">
          <label class="fw-normal fs-5 pt-1">{{ $t('input.placeholder') }}</label>
        </div>
        <!-- INPUT ALERT-->
        <div class="collapse" id="collapseInputAlert">
          <div class="d-flex alert alert-warning align-items-center mb-0 p-2 p-sm-3" id="alertInputMessage"
            role="alert">
            <p class="d-sm-none bi-exclamation-triangle-fill mb-0 h6" />
            <p class="d-sm-none fw-normal h6 ms-2 mb-0">{{ alerts.playerInput }}</p>
            <p class="d-none d-sm-block bi-exclamation-triangle-fill mb-0 h5" />
            <p class="d-none d-sm-block fw-normal h5 ms-2 mb-0">{{ alerts.playerInput }}</p>
          </div>
        </div>
        <!-- PLAYER LIST-->
        <transition-group name="list" class="list-group player-roster" tag="ul">
          <li
            class="list-group-item justify-content-between align-items-center opac d-flex text-break panel py-1 py-sm-2"
            v-for="(item, index) in playerList" :key="item.id" :id="`player-list-` + item.id"
            :class="{ 'opacity-50': index >= 10 && flags.beta }">
            <p class="mb-0 fw-bold h4" :class="{ 'opacity-50': index >= versionVars.playerLimit }"
              v-text="item.name.toUpperCase()" />
            <p class="bi bi-trash h5 mb-0" style="cursor: pointer;"
              :class="{ 'opacity-50': index >= versionVars.playerLimit }" v-on:click="delPlayer(item.id)" />
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
          <h5 class="modal-title fw-bold h4" id="exampleModalLabel">{{ $t('general.errors.title').toUpperCase()
          }}
          </h5>
          <button type="button" class="btn-close d-sm-none" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body fw-normal h4">{{ alerts.modal }}</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-ow btn-close-modal" data-bs-dismiss="modal"
            v-text="$t('general.close').toUpperCase()" />
        </div>
      </div>
    </div>
  </div>

  <!-- SETTINGS -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="settingsOffcanvasPanel"
    aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <h5 class="modal-title fw-bold h4">{{ $t('settings.navButton').toUpperCase() }}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">

      <!-- LANGUAGE -->
      <div class="row py-2 border-top">
        <div class="d-flex align-items-center">
          <p class="fw-bold h4">{{ $t('settings.lang.title') }}</p>
          <p class="bi bi-translate ms-2 mb-2 mt-0" />
        </div>
        <div class="col col-xs-12 col-lg-4">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-ow align-items-center d-flex py-0 mt-2 mb-1 dropdown-toggle"
              type="button" data-bs-toggle="dropdown" v-text="$t('settings.lang.langButton').toUpperCase()" />
            <ul class="dropdown-menu fw-normal">
              <li class="dropdown-item" v-for="item in supportedLocales.filter(x => x != getCurrentLocale())"
                v-bind:key="item" v-on:click="changeLocale(item)" v-text="$t(`locales.${item}`)" />
            </ul>
          </div>
        </div>
      </div>

      <!-- LOCAL STORAGE-->
      <div class="row py-2 mt-2 border-top">
        <div class="d-flex align-items-center">
          <p class="fw-bold h4">{{ $t('settings.ls.title') }}</p>
          <transition name="settings-status" mode="out-in">
            <p class="bi bi-server ms-2 mb-2 mt-0" :class="{ 'settings-icon': flags.localStorage }"
              :style="flags.localStorage ? 'cursor: help;' : 'cursor: auto;'" id="localStorageIcon"
              data-bs-toggle="tooltip" data-bs-custom-class="settings-tooltip" data-bs-placement="top" />
          </transition>
        </div>
        <!-- LOCAL STORAGE BUTTON -->
        <div class="col col-12">
          <button class="btn btn-sm btn-outline-ow py-0 mt-2 mb-1" v-on:click="clearLocalStorage"
            :class="{ disabled: !flags.localStorage }" v-text="$t('settings.ls.clearButton').toUpperCase()" />
        </div>
      </div>
      <!-- LOCAL STORAGE ALERT -->
      <div class="row justify-content-center collapse p-0 mt-0 mb-1" id="collapseLocalStorageAlert">
        <div class="col col-12 mb-2 alert alert-success p-1" role="alert">
          <h6 class="fw-normal text-center p-0 m-0">{{ $t('settings.ls.alert') }}
          </h6>
        </div>
      </div>

      <!-- OVERWATCH VERSION -->
      <div v-show="!betaEnd" class="row py-0 mt-2 border-top">
        <div class="d-flex align-items-center">
          <p class="fw-bold h4">{{ $t('settings.switch.title') }}</p>
        </div>
        <!-- BUTTON SWITCH -->
        <div class="col col-12">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-sm btn-outline-ow py-0 mt-2 mb-1" :class="{ 'active': !flags.beta }"
              v-on:click="changeVersion(false)">OVERWATCH</button>
            <button type="button" class="btn btn-sm btn-outline-ow py-0 mt-2 mb-1" :class="{ 'active': flags.beta }"
              v-on:click="changeVersion(true)">OVERWATCH 2 BETA</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SHUFFLE MODAL BLOCK -->
  <div class="modal fade" id="shuffleResult" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header border-bottom-0 py-0 lh-1">
          <div class="container-fluid">
            <div class="row align-items-center">
              <div class="d-flex align-items-center mt-2 p-0" :class="flags.restrictHeroes ? 'justify-content-between'
              : 'justify-content-end'">
                <!-- RESTICT HEROES -->
                <p class="h4 bi bi-exclamation-triangle navbar-title restrict-heroes mb-0 ms-1"
                  v-show="flags.restrictHeroes" data-bs-toggle="tooltip" data-bs-custom-class="restrict-hero-tooltip"
                  data-bs-placement="top" id="shuffleRestrictHeroes" />
                <!-- SCREENSHOT BUTTON -->
                <div class="d-flex align-items-center" id="screenshotButton">
                  <transition name="clipboard-alert" mode="out-in">
                    <p v-if="flags.shuffleClipboard" class="h6 mb-0 me-3 lh-1 fw-normal"
                      v-text="$t(`shuffle.photo.clipboard`)" />
                  </transition>
                  <p class="h4 bi bi-camera team-grey mb-0 me-1" v-on:click="saveTeamPic()" />
                </div>
              </div>
            </div>
            <div class="row collapse" id="clipboardFirefoxError">
              <div class="alert alert-danger m-0" role="alert" v-html="$t(`shuffle.photo.clipboardItemError`)">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-body" id="shuffleResultBody">
          <div class="container-fluid">
            <!-- CAPTAINS -->
            <div v-if="extraOptions.captains && (captains.blue && captains.red)" class="row mb-3">
              <div class="col col-12">
                <p class="h2 fw-bold text-center team-grey">{{ $t(`shuffle.captains`) }}</p>
              </div>
              <div class="col col-12 col-xs-12 col-lg-6">
                <p class="h1 fw-bold team-blue text-start text-lg-end"
                  v-text="String(extraOptions.teamNames.blue).toUpperCase()" />
                <div class="d-flex justify-content-start justify-content-lg-end align-items-center">
                  <p class="d-lg-none h1 fw-bold team-grey text-start text-lg-end lh-1 m-0"
                    v-text="String(captains.blue.name).toUpperCase()" />
                  <p v-if="captains.blue.first" class="team-grey mb-0 ms-1 me-lg-1"
                    :class="captains.blue.first ? ['bi', 'bi-star-fill'] : ''" data-bs-toggle="tooltip"
                    data-bs-placement="top" :title="$t('shuffle.firstPicker')" id="firstPicker" />
                  <p class="d-none d-lg-block h1 fw-bold team-grey text-start text-lg-end lh-1 m-0"
                    v-text="String(captains.blue.name).toUpperCase()" />
                </div>
              </div>
              <div class="col col-12 col-xs-12 col-lg-6">
                <p class="h1 fw-bold team-red text-end text-lg-start"
                  v-text="String(extraOptions.teamNames.red).toUpperCase()" />
                <div class="d-flex justify-content-end justify-content-lg-start align-items-center">
                  <p class="d-none d-lg-block h1 fw-bold team-grey text-start lh-1 m-0"
                    v-text="String(captains.red.name).toUpperCase()" />
                  <p v-if="captains.red.first" class="team-grey mb-0 me-1 ms-lg-1"
                    :class="captains.red.first ? ['bi', 'bi-star-fill'] : ''" data-bs-toggle="tooltip"
                    data-bs-placement="top" :title="$t('shuffle.firstPicker')" id="firstPicker" />
                  <p class="d-lg-none h1 fw-bold team-grey text-end text-start lh-1 m-0"
                    v-text="String(captains.red.name).toUpperCase()" />
                </div>
              </div>
            </div>
            <!-- TEAM ROSTER -->
            <div v-else-if="!extraOptions.captains && teams.blue.length != 0 && teams.red.length != 0" class="row mb-2">
              <!-- TEAM BLUE -->
              <div class="col col-12 col-xs-12 col-lg-6" v-if="teams.blue.length != 0">
                <p class="fw-bold team-blue text-start text-lg-end text-truncate h1 px-1">
                  {{ String(extraOptions.teamNames.blue).toUpperCase() }}</p>
                <ul class="list-group list-group-flush border-top">
                  <li class="list-group-item fw-bold team-grey bg-transparent border-bottom-0 p-0"
                    v-for="item in teams.blue" :key="item" :id="`player_${item.id}`">
                    <div
                      class="d-flex justify-content-start justify-content-lg-end align-items-center lh-1 lh-lg-sm py-lg-1">
                      <p class="d-none d-lg-block text-truncate fs-1 py-0 px-1 mb-0" v-text="item.name.toUpperCase()"
                        :class="{ 'pe-lg-2': !extraOptions.roles && !extraOptions.heroes }" />
                      <p v-if="extraOptions.roles && (flags.restrictHeroes || !extraOptions.heroes)"
                        class="player-list-role m-lg-0 ms-lg-2 me-lg-0 m-0 ms-0 me-2 fw-normal"
                        :class="getIcon(item.role, 'role')" data-bs-toggle="tooltip" data-bs-placement="top"
                        :title="$t(`heroData.heroClasses.${item.role}`)" />
                      <p v-if="!flags.restrictHeroes && extraOptions.heroes"
                        class="player-list-hero ms-lg-2 me-lg-0 m-0 me-1 fw-normal" data-bs-toggle="tooltip"
                        data-bs-placement="top" :title="$t(`heroData.heroes.${item.hero}`)"
                        :class="getIcon(item.hero, 'hero')" />
                      <p class="d-lg-none text-truncate fs-1 py-0 px-1 mb-0" v-text="item.name.toUpperCase()"
                        :class="{ 'ps-2': !extraOptions.roles && !extraOptions.heroes }" />
                    </div>
                  </li>
                </ul>
              </div>
              <!-- SMALL WIDTH DELIMITER-->
              <div class="col col-12 d-md-none m-2" whoe="teams.blue.length == 0 && teams.red.length == 0" />
              <!-- TEAM RED-->
              <div class="col col-12 col-xs-12 col-lg-6" v-if="teams.red.length != 0">
                <p class="fw-bold team-red text-end text-lg-start text-truncate h1 px-1">
                  {{ String(extraOptions.teamNames.red).toUpperCase() }}</p>
                <ul class="list-group list-group-flush border-top">
                  <li class="list-group-item fw-bold team-grey bg-transparent border-bottom-0 p-0"
                    v-for="item in teams.red" :key="item" :id="`player_${item.id}`">
                    <div
                      class="d-flex justify-content-end justify-content-lg-start align-items-center lh-1 lh-lg-sm py-lg-1">
                      <p class="d-lg-none text-truncate fs-1 py-0 px-1 mb-0" v-text="item.name.toUpperCase()"
                        :class="{ 'pe-2': !extraOptions.roles && !extraOptions.heroes }" />
                      <p v-if="extraOptions.roles && (flags.restrictHeroes || !extraOptions.heroes)"
                        class="player-list-role m-lg-0 me-lg-2 ms-lg-0 m-0 ms-2 me-0 fw-normal"
                        :class="getIcon(item.role, 'role')" data-bs-toggle="tooltip" data-bs-placement="top"
                        :title="$t(`heroData.heroClasses.${item.role}`)" />
                      <p v-if="!flags.restrictHeroes && extraOptions.heroes"
                        class="player-list-hero me-lg-2 ms-lg-0 ms-1 m-0 fw-normal" data-bs-toggle="tooltip"
                        data-bs-placement="top" :title="$t(`heroData.heroes.${item.hero}`)"
                        :class="getIcon(item.hero, 'hero')" />
                      <p class="d-none d-lg-block text-truncate fs-1 py-0 px-1 mb-0" v-text="item.name.toUpperCase()"
                        :class="{ 'ps-lg-2': !extraOptions.roles && !extraOptions.heroes }" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- HERO BAN -->
            <div v-if="![0, heroData.list.length].includes(bannedHeroes.length) && !flags.restrictHeroes"
              class="row pb-3"
              :class="(playerList.length != 0 && playerList.length % 2 == 0) ? ['pt-3', 'border-top'] : 'pt-0'">
              <div class="col col-12">
                <p class="h4 fw-normal text-center team-grey">{{ $t(`shuffle.bannedHeroes`) }}</p>
                <div class="d-flex flex-wrap justify-content-center" id="bannedHeroStrip">
                  <p class="player-list-hero team-grey lh-1 m-0 mx-lg-1 mx-1" v-for="item in bannedHeroes" :key="item"
                    data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                    :title="$t(`heroData.heroes.${item}`)" :class="getIcon(item, 'hero')" />
                </div>
              </div>
            </div>
            <!-- MAP BLOCK -->
            <div v-if="extraOptions.map && currentMap" class="row justify-content-center pb-3"
              :class="(playerList.length != 0 && playerList.length % 2 == 0) || bannedHeroes.length != 0 ? ['pt-3', 'border-top'] : 'pt-0'">
              <div class="col-6 text-end">
                <p class="h4 fw-normal team-grey">{{ $t('shuffle.nextMap') }}</p>
              </div>
              <div class="clearfix col-6 text-start">
                <p class="h2 fw-bold team-grey lh-1 mb-0" v-text="$t(`mapData.maps.${currentMap.id}`)" />
                <p class="fs-6 fw-normal team-grey mb-0" v-text="$t(`mapData.mapModes.${currentMap.mode}`)" />
              </div>
            </div>
          </div>
        </div>
        <!-- SHUFFLE FOOTER -->
        <div class="modal-footer">
          <div class="col-xs-2 col-sm-2" />
          <button type="button" class="btn btn-outline-ow btn-shuffle-modal col h3" data-bs-dismiss="modal"
            v-on:click="togglePlayerModal(false)" v-text="$t('general.close').toUpperCase()" />
          <div class="col-xs-2 col-sm-2" />
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer bg-light mt-auto">
    <div class="container-fluid p-0 m-0 bg-light">
      <div class="d-flex flex-wrap justify-content-between align-items-center py-1 py-sm-2 sticky-bottom">
        <div class="d-flex ps-1 ps-sm-2 me-0 align-items-center">
          <img src="./assets/svg/ow_icon.svg" class="ps-1 ps-sm-2 ow-footer-logo" alt="Overwatch logo">
          <p class="fw-bold text-muted lh-1 fs-6 m-1 footer-copyright">2022 CREATED BY GENESI5<br />OVERWATCH © 2022
            BLIZZARD</p>
        </div>
        <ul class="d-flex justify-content-end list-unstyled social-item m-0 pe-0 pe-sm-2">
          <li class="m-2 my-0">
            <a class="bi bi-github text-decoration-none m-0" href="https://github.com/genesi5/ow-shuffler"
              id="githubLink" alt="GitHub link" />
          </li>
          <li class="m-2 my-0">
            <a class="bi bi-twitch text-decoration-none m-0" href="https://www.twitch.tv/genesi5_1995" id="twitchLink"
              alt="Twitch link" />
          </li>
          <!-- <li class="m-2 my-0">
            <a class="bi bi-instagram text-decoration-none d-inline-block position-relative m-0" href=""
              id="instagramLink">
              <span class="bi-instagram instagram-color position-absolute" />
            </a>
          </li> -->
          <!-- <li class="m-2 my-0">
            <a class="bi bi-twitter text-decoration-none m-0" href="" id="twitterLink" alt="Twitter link" />
          </li> -->
        </ul>
      </div>
    </div>
  </div>

</template>

<style lang="scss">
@import "./assets/scss/_main.scss";
@import "./assets/scss/_shuffle-modal.scss";
@import "./assets/scss/_overwatch-icons.scss";
@import "./assets/scss/_main-collapse-tabs.scss";
@import "./assets/scss/_settings-offcanvas.scss";
@import "./assets/scss/_player-input.scss";

@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>

<script>
import { default as mapList } from './misc/maps.json'
import { default as heroList } from './misc/heroes.json'
import { default as packageJson } from '../package.json'

import { Button, Collapse, Modal, Offcanvas, Tooltip } from 'bootstrap'

import { clone, cloneDeep, shuffle, keys, values, random, ceil, round, sum } from 'lodash'

import { SUPPORT_LOCALES } from './i18n'

import html2canvas from 'html2canvas'

export default {
  name: 'app',
  el: "#app",

  data() {
    return {
      teams: {
        red: [],
        blue: []
      },
      teamNames: {
        red: undefined,
        blue: undefined
      },
      captains: {
        red: undefined,
        blue: undefined
      },
      versionVars: {
        playerLimit: undefined,
        defaultRoleSet: undefined
      },
      flags: {
        beta: false,
        localStorage: false,
        restrictHeroes: false,
        invalidTeamName: {
          red: false,
          blue: false
        },
        invalidRoleSets: false,
        shuffleClipboard: false,
        clipboardFirefoxError: false
      },
      alerts: {
        playerInput: undefined,
        teamInput: {
          red: undefined,
          blue: undefined
        },
        modal: undefined
      },
      counter: 0,
      locale: undefined,
      betaEnd: undefined,
      mapData: undefined,
      heroData: undefined,
      roleSets: undefined,
      playerList: undefined,
      currentMap: undefined,
      extraOptions: undefined,
      bannedHeroes: undefined,
      currentRoleSet: undefined,
      appVersion: packageJson.version,
      supportedLocales: SUPPORT_LOCALES,
    }
  },
  created() {
    this.setLocale()
    this.setVersion()
    this.setMapData()
    this.setHeroData()
    this.setExtraOptions()
    document.title += ` ${this.appVersion}`
  },
  mounted() {
    this.setupEventHandlers()
    this.loadPlayersFromLocalStorage()
  },
  watch: {
    locale: {
      handler(newValue) {
        // console.log('in watcher mapData', cloneDeep(newValue))
        if (newValue != undefined)
          this.updateSupervisedObjects("locale")
      },
      deep: false
    },
    mapData: {
      handler(newValue, oldValue) {
        // console.log('in watcher mapData', cloneDeep(newValue), cloneDeep(oldValue))
        if (newValue != undefined && oldValue != undefined)
          this.updateSupervisedObjects("mapData")
      },
      deep: true
    },
    heroData: {
      handler(newValue, oldValue) {
        // console.log('in watcher heroData', cloneDeep(newValue), cloneDeep(oldValue))
        if (newValue != undefined && oldValue != undefined)
          this.updateSupervisedObjects("heroData")
      },
      deep: true
    },
    playerList: {
      handler(newValue, oldValue) {
        // console.log('in watcher playerList', cloneDeep(newValue), cloneDeep(oldValue))
        if (newValue != undefined && oldValue != undefined)
          this.updateSupervisedObjects("playerList")
      },
      deep: true
    },
    extraOptions: {
      handler(newValue, oldValue) {
        // console.log('in watcher extraOptions', cloneDeep(newValue), cloneDeep(oldValue))
        if (newValue != undefined && oldValue != undefined)
          this.updateSupervisedObjects("extraOptions")
      },
      deep: true
    },
    teamNames: {
      handler(newValue, oldValue) {
        // console.log('in watcher teamNames', cloneDeep(newValue), cloneDeep(oldValue))
        if (newValue != undefined && oldValue != undefined)
          this.writeTeamNames()
      },
      deep: true
    },
    roleSets: {
      handler(newValue, oldValue) {
        // console.log('in watcher roleSets', cloneDeep(newValue), cloneDeep(oldValue))
        if (newValue != undefined && oldValue != undefined)
          this.validateRoleRatio()
      },
      deep: true
    }
  },
  methods: {
    // Setup event listeners for exact set of Bootstrap components
    setupEventHandlers() {
      // Map mode filter collapse
      this.mapData.modes.map(x => (x.id)).forEach((mode) => {
        document.getElementById(`collapse-mapFilter-${mode}`).addEventListener('show.bs.collapse', () => {
          // animate chevron on show
          document.getElementById(`chevron-${mode}`).classList.toggle('out')
          // collapse all but this block
          document.querySelectorAll(`ul[id^='collapse-mapFilter'].show:not(ul[id=collapse-mapFilter-${mode}])`)
            .forEach((node) => { new Collapse(node).hide() })
        })
        document.getElementById(`collapse-mapFilter-${mode}`).addEventListener('hide.bs.collapse', () => {
          // animate chevron on hide
          document.getElementById(`chevron-${mode}`).classList.toggle('out')
        })
      })
      // Hero class filter collapse
      this.heroData.classes.forEach((role) => {
        document.getElementById(`collapse-heroFilter-${role}`).addEventListener('show.bs.collapse', () => {
          // animate chevron on show
          document.getElementById(`chevron-${role}`).classList.toggle('out')
          // collapse all but this block
          document.querySelectorAll(`ul[id^='collapse-heroFilter'].show:not(ul[id=collapse-heroFilter-${role}])`)
            .forEach((node) => { new Collapse(node).hide() })
        })
        document.getElementById(`collapse-heroFilter-${role}`).addEventListener('hide.bs.collapse', () => {
          // animate chevron on hide
          document.getElementById(`chevron-${role}`).classList.toggle('out')
        })
      })
      // Main collapse button group bottom edges
      Array.from(['mapFilter', 'heroFilter', 'extraOptions']).forEach((collapse) => {
        document.getElementById(`collapse-main-${collapse}`).addEventListener('hidden.bs.collapse', e => {
          if (e.target == e.currentTarget) {
            // waiting for all collapses to be hidden for state check
            setTimeout(() => {
              if (Array.from(document.querySelectorAll(`div[id^='collapse-main']`)).every(node => !node.classList.contains('show'))) {
                // add radius after full collapse
                document.getElementById('button-main-mapFilter').style.borderBottomLeftRadius = '0.2rem'
                document.getElementById('button-main-extraOptions').style.borderBottomRightRadius = '0.2rem'
              }
            }, 125)
          }
        })
        document.getElementById(`collapse-main-${collapse}`).addEventListener('show.bs.collapse', () => {
          // remove radius after collapse show
          document.getElementById('button-main-mapFilter').style.borderBottomLeftRadius = '0rem'
          document.getElementById('button-main-extraOptions').style.borderBottomRightRadius = '0rem'
        })
      })
      // Input alert message cleanup
      document.getElementById('collapseInputAlert').addEventListener('hidden.bs.collapse', () => {
        this.alerts.modal = undefined
      })
      // Shuffler modal tooltips
      document.getElementById('shuffleResult').addEventListener('shown.bs.modal', () => {
        // Hero restriction flag trinagle
        if (this.flags.restrictHeroes) {
          document.getElementById('shuffleRestrictHeroes').title = this.$t(`shuffle.restrictHeroes`)
          new Tooltip(document.getElementById('shuffleRestrictHeroes'))
        }
        // Hero and role tooltips near players 
        document.querySelectorAll('p[class^="player-list"], p[id="firstPicker"]')
          .forEach(tooltipNode => new Tooltip(tooltipNode))
      })
      // Initialize static tooltips
      document.getElementById('settingsOffcanvasPanel').addEventListener('show.bs.offcanvas', () => {
        this.updateLocalStorageStatus()
      })
      // Discard variables on hiding shuffle modal
      document.getElementById('shuffleResult').addEventListener('hidden.bs.modal', () => {
        this.teams.blue = []
        this.teams.red = []
        this.flags.restrictHeroes = false
        this.currentMap = undefined
        if (this.bannedHeroes != undefined) this.bannedHeroes = []
        if (this.extraOptions.captains) this.captains = { blue: undefined, red: undefined }
        Collapse.getOrCreateInstance(document.getElementById('clipboardFirefoxError')).hide()
        Tooltip.getOrCreateInstance(document.getElementById('shuffleRestrictHeroes')).dispose()
      })
      // Validate team names on load
      keys(this.teamNames).forEach((side) => {
        if (this.teamNames[side].length > 20) {
          this.flags.invalidTeamName[side] = true
          this.alerts.teamInput[side] = this.$t('extra.options.teams.alerts.outLimit', [20])
        }
      })
      // Validate role sets on load
      keys(this.roleSets).forEach((set) => {
        if (sum(values(this.roleSets[set])) != Number(set)) {
          this.flags.invalidRoleSets = true
          return
        }
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

    // Validate exact role input for out-of-range (team capacity) values 
    validateRoleInput(prevSet, event, role) {
      if (Number(event.target.value) > this.currentRoleSet) event.target.value = prevSet[role]
      else this.roleSets[this.currentRoleSet][role] = Number(event.target.value)
    },
    // Check if all sums of role sets are not out of team capacity
    validateRoleRatio() {
      if (keys(this.roleSets).every(set => sum(values(this.roleSets[set])) == Number(set))) {
        this.flags.invalidRoleSets = false
      }
      else this.flags.invalidRoleSets = true
      this.extraOptions.roleSets = cloneDeep(this.roleSets)
    },
    // Validate team name for invalid values
    validateTeamNameInput(event, side) {
      if (event.target.value.trim().length <= 20 && event.target.value.trim() != "") {
        this.flags.invalidTeamName[side] = false
      }
      if (event.target.value.trim().length > 20 || event.target.value.trim() == "") {
        const msg = (event.target.value.trim().length > 20)
          ? this.$t('extra.options.teams.alerts.outLimit', [20])
          : this.$t('extra.options.teams.alerts.emptyValue')
        this.alerts.teamInput[side] = msg
        this.flags.invalidTeamName[side] = true
      }
      this.teamNames[side] = event.target.value
    },
    writeTeamNames() {
      this.extraOptions.teamNames = cloneDeep(this.teamNames)
    },

    setVersion() {
      let
        ls = window.localStorage.getItem("beta")
      this.betaEnd = new Date('July 18, 2022 01:00:00 CST').getTime() < new Date().getTime()
      if (ls != null && !this.betaEnd) {
        this.flags.beta = JSON.parse(ls)
        if (this.flags.beta) this.flags.localStorage = true
      }
      else this.flags.beta = false
      this.versionVars = {
        playerLimit: (this.flags.beta) ? 10 : 12,
        defaultRoleSet: (this.flags.beta) ? 5 : 6
      }
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
    setMapData() {
      let
        mapData = {
          modes: [
            { id: "control", show: true },
            { id: "escort", show: true },
            { id: "hybrid", show: true },
            { id: "assault", show: true },
            { id: "push", show: true }
          ],
          state: false
        },
        ls = window.localStorage.getItem("mapFilter")
      // Get map list depending on what version is set
      if (this.flags.beta) mapData.list = [...mapList].filter(x => !x.deprecated)
      else mapData.list = [...mapList].filter(x => x.legacy)
      // console.log("MAPS", mapData.list)

      // Assault mode is replaced by brand new Push mode in OW2
      if (this.flags.beta) mapData.modes[mapData.modes.findIndex((x => x.id === 'assault'))].show = false
      else mapData.modes[mapData.modes.findIndex((x => x.id === 'push'))].show = false
      // console.log("MODES", mapData.modes)
      if (ls != null) {
        mapData.filter = JSON.parse(ls)
        mapData.state = true
      }
      // Map map filter object with bool values with map list 
      else mapData.filter = [...mapList].reduce((prev, cur) => ({ ...prev, [cur.id]: true }), {})
      // console.log("MAP FILTERS", mapData.filter)
      this.mapData = mapData
    },
    setHeroData() {
      let
        heroData = {
          classes: ['tank', 'support', 'damage'],
          state: false
        },
        ls = window.localStorage.getItem("heroFilter")

      // Get hero list depending on what version is set
      if (this.flags.beta) {
        heroData.list = [...heroList]
        // Doomfist is moved into Tank class in Overwatch 2
        heroData.list[heroData.list.findIndex(x => x.id === 'doomfist')].heroClass = "tank"
      }
      else heroData.list = [...heroList].filter(x => x.legacy)
      // console.log("HEROES", heroData.list.map(x => x.id))
      if (ls != null) {
        heroData.filter = JSON.parse(ls)
        heroData.state = true
      }
      // Map hero filter object with bool values with hero list 
      else heroData.filter = [...heroList].reduce((prev, cur) => ({ ...prev, [cur.id]: true }), {})
      // console.log("HERO FILTERS", heroData.filter)
      this.bannedHeroes = []
      this.heroData = heroData
    },
    setExtraOptions() {
      let
        ls = new Object(),
        extraOptions = {}
      if (window.localStorage.getItem("extraOptions") != null) ls = JSON.parse(window.localStorage.getItem("extraOptions"))
      extraOptions.roles = ('roles' in ls) ? ls.roles : false
      extraOptions.heroes = ('heroes' in ls) ? ls.heroes : false
      extraOptions.map = ('map' in ls) ? ls.map : false
      extraOptions.captains = ('captains' in ls) ? ls.captains : false
      extraOptions.heroBan = ('heroBan' in ls) ? Number(ls.heroBan) : 0
      extraOptions.roleSets = ('roleSets' in ls)
        ? { '6': ls.roleSets['6'], '5': ls.roleSets['5'], '4': ls.roleSets['4'], '3': ls.roleSets['3'] }
        : {
          '6': { tank: 2, damage: 2, support: 2 },
          '5': { tank: 1, damage: 2, support: 2 },
          '4': { tank: 0, damage: 2, support: 2 },
          '3': { tank: 0, damage: 2, support: 1 }
        }
      extraOptions.teamNames = ('teamNames' in ls)
        ? {
          blue: (ls.teamNames.blue) ? ls.teamNames.blue : "TEAM BLUE",
          red: (ls.teamNames.red) ? ls.teamNames.red : "TEAM RED"
        }
        : { blue: "TEAM BLUE", red: "TEAM RED" }
      // Clone role sets into reactive buffer variable
      this.roleSets = { ...extraOptions.roleSets }
      // Clone team names into reactive buffer variable
      this.teamNames = { ...extraOptions.teamNames }
      this.currentRoleSet = clone(this.versionVars.defaultRoleSet)
      this.extraOptions = extraOptions
    },

    getMapsByMode(mode) {
      if (String(mode)) return this.mapData.list.filter(x => x.mode == mode)
    },
    getHeroesByClass(role) {
      if (String(role)) return this.heroData.list.filter(x => x.heroClass == role)
    },
    getCurrentLocale() {
      if (this.supportedLocales.includes(this.$i18n.locale)) return this.$i18n.locale
      else if (this.$i18n.fallbackLocale[this.$i18n.locale] != undefined) {
        return this.$i18n.fallbackLocale[this.$i18n.locale][0]
      }
      return this.$i18n.fallbackLocale.default[0]
    },
    // Get icon in shuffle modal
    getIcon(id, type) {
      if (String(id) != null && String(type != null)) {
        if (String(type) == "role") return `ow-role-${id}`
        else if (String(type) == "hero") return `ow-hero-${id}`
      }
    },
    // Get role set depending on how much players in the team
    getRoleSet(players) {
      if (Number(players) >= 3) {
        let
          roles = new Array(),
          roleSet = this.extraOptions.roleSets[players]
        keys(roleSet).forEach((role) => {
          if (roleSet[role] != 0) for (let i = 0; i < Number(roleSet[role]); i++) roles.push(role)
        })
        return roles
      }
      return null
    },

    addPlayer(name) {
      if (String(name)) {
        if (this.playerList) {
          // Find namesake before adding new player
          let dupItem = this.playerList.find(x => name.toLowerCase() == x.name.toLowerCase())
          if (dupItem == undefined && this.playerList.length < this.versionVars.playerLimit) {
            // reset input after adding
            document.getElementById('inputPlayer').value = ''
            let newPlayer = { id: this.counter++, name: name }
            this.playerList.push(newPlayer)
            // console.info("ADDED", newPlayer)
          }
          // Show alert if namesake found
          else if (dupItem != undefined) {
            let
              dupName = this.playerList[this.playerList.findIndex(x => name.toLowerCase() == x.name.toLowerCase())].name,
              msg = this.$t('input.alerts.duplicateFound', [dupName])
            this.toggleAlertInput(msg)
            // console.warn(`Duplicate found: ${dupName}`)
          }
          // In case of adding player over player roster limit
          else if (this.playerList.length >= this.versionVars.playerLimit) {
            let msg = this.$t(`input.alerts.rosterExceeded`, [this.versionVars.playerLimit])
            this.toggleAlertInput(msg)
            // console.warn(`OVERWATCH player limit has been exceded (${this.versionVars.playerLimit} players maximum)`)
          }
        }
      }
    },
    delPlayer(id) {
      if (id != undefined) {
        // Find index of player to delete
        let playerIndex = this.playerList.findIndex(item => { return item.id === id });
        if (playerIndex != undefined) {
          // let playerObj = this.playerList[playerIndex]
          this.playerList.splice(playerIndex, 1)
          // console.info("DELETED", playerObj)
        }
      }
    },

    shuffleTeams() {
      let newMaps = []
      let newHeroes = []
      let roleSet = {}

      // Randomize map
      if (this.extraOptions.map) {
        newMaps = cloneDeep(this.mapData.list.filter(x => this.mapData.filter[x.id]))
        if (newMaps.length != 0) this.currentMap = newMaps[Math.floor(Math.random() * newMaps.length)]
        else {
          this.toggleAlertModal(true, this.$t('general.errors.mapPoolEmpty'))
          // console.warn("Map pool is empty")
          return
        }
      }
      // Apply hero ban from extra options
      if (this.extraOptions.heroBan != 0) {
        const
          tank = round((this.extraOptions.heroBan / 100) * random(10, 24)),     // 10-25% probability for tanks
          support = round((this.extraOptions.heroBan / 100) * random(10, 24)),  // 10-25% probability for supports
          damage = this.extraOptions.heroBan - (tank + support)                 // the rest for damage dealers

        // Get list of banned heroes, depending of probability percentage
        this.bannedHeroes = [
          ...cloneDeep(this.heroData.list).filter(x => x.heroClass == "damage")
            .sort(() => Math.random() - Math.random()).slice(0, damage).map(x => x.id),
          ...cloneDeep(this.heroData.list).filter(x => x.heroClass == "support")
            .sort(() => Math.random() - Math.random()).slice(0, support).map(x => x.id),
          ...cloneDeep(this.heroData.list).filter(x => x.heroClass == "tank")
            .sort(() => Math.random() - Math.random()).slice(0, tank).map(x => x.id)
        ].sort()
        newHeroes = cloneDeep(this.heroData.list).filter(x => !this.bannedHeroes.includes(x.id))
      }
      // Apply hero ban from filter tab
      else {
        // Valid number of players depenidng on OW version
        let
          list = (this.flags.beta)
            ? ((this.playerList.length > this.versionVars.playerLimit)
              ? this.versionVars.playerLimit
              : this.playerList.length)
            : this.playerList.length
        newHeroes = cloneDeep(this.heroData.list).filter(x => this.heroData.filter[x.id])
        if (this.extraOptions.heroes && newHeroes.length < ceil(list / 2)) this.flags.restrictHeroes = true
        this.bannedHeroes = keys(this.heroData.filter).filter((x) => !this.heroData.filter[x])
      }

      // Randomize player teams
      if (this.playerList.length != 0) {
        // Check team names for invalid values 
        if (values(this.flags.invalidTeamName).some(x => x)) {
          if (values(this.flags.invalidTeamName).every(x => x)) {
            this.toggleAlertModal(true, this.$tc('general.errors.invalidTeamName', 2))
            return
          }
          this.toggleAlertModal(true, this.$tc('general.errors.invalidTeamName', 1))
          return
          // console.warn("Team names are not valid")
        }
        // Pick random captains
        if (this.extraOptions.captains) {
          if (this.playerList.length >= 2) {
            let pair = cloneDeep(this.playerList)
              .sort(() => Math.random() - Math.random())
              .slice(0, 2)
            pair.forEach((x) => { x.first = false })
            // Chosing who will pick teammates first
            pair[Math.round(Math.random())].first = true
            this.captains = { blue: pair.pop(), red: pair.pop() }
          }
          else {
            this.toggleAlertModal(true, this.$t('general.errors.notEnoughForCaps'))
            // console.warn("Not enouth players to assign captains")
            return
          }
        }
        // Roles and heroes
        else {
          const
            list = (this.flags.beta)
              // Ignoring 11th and 12th player if exist in OW2 mode
              ? shuffle(cloneDeep(this.playerList)
                .splice(0, (this.playerList.length > this.versionVars.playerLimit)
                  ? this.versionVars.playerLimit
                  : this.playerList.length))
              // OW mode
              : shuffle(cloneDeep(this.playerList)),
            half = Math.ceil(list.length / 2)

          if (list.length % 2 != 0) {
            this.toggleAlertModal(true, this.$t('general.errors.rosterNotEven'))
            // console.warn("Roster is not even")
            return
          }
          // Assign shuffled slices of players into teams
          this.teams.blue = cloneDeep(list).slice(0, half)
          this.teams.red = cloneDeep(list).slice(-half)

          // Randomize roles
          if (this.extraOptions.roles) {
            // Don't assign roles if there's less than three players in teams
            if (half >= 3) {
              // Check role sets for invalid ratio
              if (this.flags.invalidRoleSets && sum(values(this.roleSets[half])) != half) {
                this.toggleAlertModal(true, this.$t('general.errors.invalidRoleSet', [half]))
                // console.warn("Role set is invalid")
                return
              }
              roleSet = {
                blue: shuffle(this.getRoleSet(half)),
                red: shuffle(this.getRoleSet(half))
              }
              this.teams.blue.forEach((x, i) => x.role = roleSet.blue[i])
              this.teams.red.forEach((x, i) => x.role = roleSet.red[i])
            }
          }
          // Randomize heroes
          if (this.extraOptions.heroes) {
            // Randomize heroes by roles
            if (this.extraOptions.roles && half >= 3) {
              // Sort heroes into separate arrays 
              let
                heroSortedSet = {
                  damage: shuffle(cloneDeep(newHeroes).filter(x => x.heroClass == "damage")),
                  support: shuffle(cloneDeep(newHeroes).filter(x => x.heroClass == "support")),
                  tank: shuffle(cloneDeep(newHeroes).filter(x => x.heroClass == "tank"))
                },
                setBlue = cloneDeep(heroSortedSet),
                setRed = cloneDeep(heroSortedSet)
              // Toggle hero restriction flag if one of the hero classes has less heroes than players of this class in team
              if (
                roleSet.blue.filter(x => x == "tank").length > heroSortedSet.tank.length ||
                roleSet.blue.filter(x => x == "support").length > heroSortedSet.support.length ||
                roleSet.blue.filter(x => x == "damage").length > heroSortedSet.damage.length
              ) this.flags.restrictHeroes = true

              // Assign random heroes for teams depending on roles
              this.teams.blue.forEach((x) => {
                while (setBlue[x.role].length) {
                  x.hero = setBlue[x.role].splice(setBlue[x.role].length * Math.random() | 0, 1)[0]['id'];
                  return
                }
              })
              this.teams.red.forEach((x) => {
                while (setRed[x.role].length) {
                  x.hero = setRed[x.role].splice(setRed[x.role].length * Math.random() | 0, 1)[0]['id'];
                  return
                }
              })
            }
            // Assign random heroes without role assignation
            else if (!this.flags.restrictHeroes) {
              let
                setBlue = shuffle(cloneDeep(newHeroes)),
                setRed = shuffle(cloneDeep(newHeroes))
              this.teams.blue.forEach((x) => {
                while (setBlue.length) {
                  x.hero = setBlue.splice(setBlue.length * Math.random() | 0, 1)[0]['id'];
                  return
                }
              })
              this.teams.red.forEach((x) => {
                while (setRed.length) {
                  x.hero = setRed.splice(setRed.length * Math.random() | 0, 1)[0]['id'];
                  return
                }
              })
            }
          }
        }
        // console.info('TEAM BLUE', this.teams.blue)
        // console.info('TEAM RED', this.teams.red)
        this.togglePlayerModal(true)
      }
      else {
        // Show modal if no players but map and hero ban flag are toggled
        if (this.extraOptions.map || (this.bannedHeroes.length != 0 && !this.restrictHeroes))
          this.togglePlayerModal(true)
        else {
          this.toggleAlertModal(true, this.$t('general.errors.rosterEmpty'))
          // console.warn("Roster is empty")
          return
        }
      }
    },

    saveTeamPic() {
      const { ClipboardItem } = window;
      html2canvas(document.querySelector("#shuffleResultBody")).then(canvas => {
        canvas.toBlob((blob) => {
          const content = Object.defineProperty({}, blob.type, { value: blob, enumerable: true })
          /*  
          Test 'dom.events.asyncClipboard.clipboardItem' parameter in Mozilla Firefox, 
          since 'false' value causes ClipboardItem() constructor to fail 
          */
          if (navigator.userAgent.match(/firefox|fxios/i)) {
            try { [new ClipboardItem(content)] }
            catch (err) {
              new Collapse(document.getElementById('clipboardFirefoxError')).show()
              return
            }
          }
          this.flags.shuffleClipboard = true
          navigator.clipboard
            .write([new ClipboardItem(content)])
            .then(() => { setTimeout(() => { this.flags.shuffleClipboard = false }, 3000) });
        });
      });
    },

    // Handle main collapses on page
    toggleFilterCollapse(id) {
      /* 
      Here's some Bootstrap 5.x bug that can't handle collapse states and can show two or more collapses at once. 
      Waiting for fix from BS team or looking for another option to make it slick and smooth
      */
      let button = new Button(document.getElementById(`button-main-${id}`))
      let collapse = new Collapse(document.getElementById(`collapse-main-${id}`))
      // Untoggle other tabs (buttons)
      document.querySelectorAll(`button[id^='button-main'].active:not(button[id=button-main-${id}])`)
        .forEach((node) => {
          new Button(node).toggle()
        })
      button.toggle()
      // Collapse other panels and show current
      document.querySelectorAll(`div[id^='collapse-main'].show:not(div[id^=collapse-main-${id}])`)
        .forEach((node) => {
          new Collapse(node).hide()
        })
      collapse.show()
    },
    toggleSettingsOffcanvas(opt) {
      let settingsOffcanvas = new Offcanvas(document.getElementById('settingsOffcanvasPanel'))
      if (opt) settingsOffcanvas.show()
      else settingsOffcanvas.hide()
    },
    togglePlayerModal(opt) {
      let playerModal = new Modal(document.getElementById('shuffleResult'))
      if (opt) playerModal.show()
      else playerModal.hide()
    },
    toggleAlertModal(opt, message) {
      let alertModal = new Modal(document.getElementById('shuffleAlert'))
      if (opt) {
        this.alerts.modal = message
        alertModal.show()
      }
      else {
        alertModal.hide()
        this.alerts.modal = undefined
      }
    },
    toggleAlertInput(message) {
      this.alerts.playerInput = message
      const collapse = new Collapse("#collapseInputAlert")
      collapse.show()
      setTimeout(() => {
        collapse.hide()
      }, 3000)
    },

    resetMapFilter() {
      if (Object.keys(this.mapData.filter).some((key) => !this.mapData.filter[key])) {
        this.mapData.filter = Object.fromEntries(Object.keys(this.mapData.filter).map((key) => [key, true]))
        this.mapData.state = false
        let collapse = {
          lg: new Collapse("#collapseMapFilterAlertLg"),
          sm: new Collapse("#collapseMapFilterAlertSm")
        }
        collapse.lg.show()
        collapse.sm.show()
        setTimeout(() => {
          collapse.lg.hide()
          collapse.sm.hide()
        }, 3000)
      }
    },
    resetHeroFilter() {
      if (Object.keys(this.heroData.filter).some((key) => !this.heroData.filter[key])) {
        this.heroData.filter = Object.fromEntries(Object.keys(this.heroData.filter).map((key) => [key, true]))
        this.heroData.state = false
        let collapse = {
          lg: new Collapse("#collapseHeroFilterAlertLg"),
          sm: new Collapse("#collapseHeroFilterAlertSm")
        }
        collapse.lg.show()
        collapse.sm.show()
        setTimeout(() => {
          collapse.lg.hide()
          collapse.sm.hide()
        }, 3000)
      }
    },
    changeVersion(flag) {
      if (flag) {
        this.versionVars.playerLimit = 10
        this.mapData.list = cloneDeep(mapList).filter(x => !x.deprecated)
        // Assault mode is replaced by brand new Push mode in OW2
        this.mapData.modes[this.mapData.modes.findIndex((x => x.id === 'assault'))].show = false
        this.mapData.modes[this.mapData.modes.findIndex((x => x.id === 'push'))].show = true
        this.heroData.list = cloneDeep(heroList)
        // Doomfist is moved into Tank class in Overwatch 2
        this.heroData.list[this.heroData.list.findIndex(x => x.id === 'doomfist')].heroClass = "tank"
      }
      else {
        this.versionVars.playerLimit = 12
        this.mapData.list = cloneDeep(mapList).filter(x => x.legacy)
        this.mapData.modes[this.mapData.modes.findIndex((x => x.id === 'assault'))].show = true
        this.mapData.modes[this.mapData.modes.findIndex((x => x.id === 'push'))].show = false
        this.heroData.list = cloneDeep(heroList).filter(x => x.legacy)
      }
      this.currentRoleSet = this.versionVars.playerLimit / 2
      this.flags.beta = flag
      this.updateSupervisedObjects('beta')
    },
    changeLocale(item) {
      this.locale = item
      if (this.locale != undefined) window.localStorage.setItem('locale', this.locale)
      // console.log("LOCALE", this.locale)
    },
    updateLocalStorageStatus() {
      const lsTooltip = document.getElementById('localStorageIcon')
      if (window.localStorage.length > 0) {
        this.flags.localStorage = true
        lsTooltip.title = this.$t('settings.ls.exist')
        new Tooltip(lsTooltip)
      }
      else {
        this.flags.localStorage = false
        Tooltip.getOrCreateInstance(lsTooltip).dispose()
      }
    },
    // Save watched data into local storage on their change 
    updateSupervisedObjects(obj) {
      // console.log(obj)
      switch (obj) {
        case "locale":
          // console.log(`Updated ${obj}`, this.locale)
          this.$i18n.locale = this.locale
          window.localStorage.setItem("locale", this.locale)
          document.querySelector('html').setAttribute('lang', this.locale)
          this.updateLocalStorageStatus()
          break
        case "beta":
          // console.log(`Updated ${obj}`, this.flags.beta)
          window.localStorage.setItem("beta", this.flags.beta)
          this.updateLocalStorageStatus()
          break
        case "extraOptions":
          // console.log(`Updated ${obj}`, this.extraOptions)
          window.localStorage.setItem("extraOptions", JSON.stringify(this.extraOptions))
          this.updateLocalStorageStatus()
          break
        case "mapData":
          // console.log(`Updated ${obj}`, this.mapData)
          if (Object.keys(this.mapData.filter).every((key) => this.mapData.filter[key])) {
            window.localStorage.removeItem('mapFilter')
            this.mapData.state = false
          }
          else {
            window.localStorage.setItem("mapFilter", JSON.stringify(this.mapData.filter))
            this.mapData.state = true
          }
          this.updateLocalStorageStatus()
          break
        case "heroData":
          // console.log(`Updated ${obj}`, this.heroData)
          if (Object.keys(this.heroData.filter).every((key) => this.heroData.filter[key])) {
            window.localStorage.removeItem('heroFilter')
            this.bannedHeroes.filter = []
            this.heroData.state = false
          }
          else {
            window.localStorage.setItem("heroFilter", JSON.stringify(this.heroData.filter))
            this.bannedHeroes.filter = keys(this.heroData.filter).filter((x) => !this.heroData.filter[x])
            this.heroData.state = true
          }
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
      if (this.flags.localStorage) {
        let collapse = new Collapse("#collapseLocalStorageAlert")
        window.localStorage.clear()
        this.updateLocalStorageStatus()

        collapse.show()
        setTimeout(() => {
          collapse.hide()
        }, 3000)
      }
    }
  }
}
</script>
