<template>
  <div
    class="modal fade"
    id="dealDataCard"
    tabindex="-1"
    aria-labelledby="dealDataCardLabel"
    aria-hidden="true"
    data-bs-backdrop="false"
  >
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div
          class="modal-header py-0 d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center gap-4">
            <h5 class="modal-title" id="dealDataCardLabel">
              {{ t("kanban-modal-edit-heading") }}
              <button
                type="button"
                @click="toggleEditMode"
                class="border-0 p-0 bg-transparent"
                v-if="!isEditMode"
              >
                <i class="fa-solid fa-pencil"></i>
              </button>
            </h5>
          </div>
          <!-- <div class="">
            <button @click="PrintCase" class="bg-transparent border-0">
              <i class="fa-solid fa-print"></i>
              {{ t("kanban-modal-edit-print-case") }}
            </button>
          </div> -->
          <div class="rating">
            <rating-stars
              v-model="customerData.rating"
              :isEditable="isEditMode"
            />
          </div>
          <div class="source">
            <i class="fa-solid fa-circle-exclamation me-1"></i>
            <span
              >{{ t("kanban-modal-edit-source-heading") }}:
              {{ sourceName }}</span
            >
          </div>
          <div class="d-flex justify-content-end align-items-center gap-2">
            <button class="btn border-none text-primary" @click="startCall">
              <i class="fa-solid fa-phone-volume fs-5"></i>
              {{ t("kanban-modal-edit-call-heading") }}
            </button>
            <button
              class="btn border-none text-primary"
              @click="openWhatsappModal(customerData.id)"
            >
              <i class="fab fa-whatsapp border-none text-primary fs-5"></i>
              {{ t("kanban-modal-edit-whatsapp") }}
            </button>
            <button class="btn border-none text-primary" @click="sendEmail">
              <i class="fas fa-envelope fs-5"></i>
              {{ t("kanban-modal-edit-sendemail") }}
            </button>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div class="modal-body">
          <!-- Stages -->
          <div class="stages-container mb-4" @dblclick="handleDoubleClick">
            <div class="d-flex stages-wrapper">
              <button
                v-for="stage in stages"
                :key="stage.id"
                class="btn stage-btn border-0"
                :class="getStageClasses(stage.id).classes"
                @mouseover="handleStageHover(stage.id)"
                @mouseleave="handleStageLeave"
                @click="changeStage(stage.id)"
                :title="stage.name"
                :style="{
                  backgroundColor: getStageClasses(stage.id).backgroundColor,
                  color: getStageClasses(stage.id).textColor || 'white',
                }"
              >
                {{ truncateText(stage.name) }}
              </button>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6 border-end">
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-id-card"></i>
                    {{ t("kanban-modal-edit-label-profile") }}</label
                  >
                </div>
                <!-- Full Name -->
                <div class="col">
                  <label class="form-label" for="name"
                    ><i class="fa-solid fa-user"></i>
                    {{ t("kanban-modal-edit-label-fullname")
                    }}<span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    :class="[
                      'form-control',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                      'py-2',
                    ]"
                    v-model="customerData.name"
                    :placeholder="t('kanban-modal-edit-placeholder-fullname')"
                    :readonly="!isEditMode"
                    name="name"
                  />
                </div>
                <div class="col">
                  <label class="form-label" for="nationality"
                    ><i class="fa-solid fa-flag"></i>
                    {{ t("kanban-modal-edit-label-nationality") }}
                  </label>
                  <select
                    :class="[
                      'form-select',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                      'py-2',
                    ]"
                    v-model="customerData.nationality"
                    :disabled="!isEditMode"
                    name="nationality"
                    @dblclick="handleDoubleClick"
                  >
                    <option
                      :value="null"
                      disabled
                      v-if="!customerData.nationality"
                    >
                      {{ t("kanban-modal-edit-placeholder-nationality") }}
                    </option>
                    <option
                      v-for="(value, key) in nationalities"
                      :key="key"
                      :value="key"
                    >
                      {{ value }}
                    </option>
                  </select>
                </div>
                <div class="col">
                  <label class="form-label" for="language">
                    <i class="fa-solid fa-language"></i>
                    {{ t("kanban-modal-edit-label-prefered-language") }}
                  </label>
                  <select
                    :class="[
                      'form-select',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                      'py-2',
                    ]"
                    v-model="customerData.language"
                    :disabled="!isEditMode"
                    name="nationality"
                    @dblclick="handleDoubleClick"
                  >
                    <option
                      :value="null"
                      disabled
                      v-if="!customerData.language"
                    >
                      {{ t("kanban-modal-edit-placeholder-prefered-language") }}
                    </option>
                    <option
                      v-for="(value, key) in languages"
                      :key="key"
                      :value="key"
                    >
                      {{ value }}
                    </option>
                  </select>
                </div>
                <div class="row mt-2 pe-0">
                  <div class="col-2"></div>
                  <div class="col" @dblclick="handleDoubleClick">
                    <label class="form-label" for="date_of_birth"
                      ><i class="fa-solid fa-calendar-days"></i>
                      {{ t("kanban-modal-edit-label-dob")
                      }}<span class="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      lang="en"
                      :disabled="!isEditMode"
                      :class="[
                        'form-control',
                        isEditMode ? 'bg-input-edit' : 'bg-input',
                        'py-2',
                      ]"
                      v-model="customerData.date_of_birth"
                      :placeholder="t('kanban-modal-edit-placeholder-dob')"
                      name="date_of_birth"
                      @mousedown="dateTaskClick"
                    />
                  </div>
                  <!-- maritalStatus -->
                  <div class="col">
                    <label class="form-label" for="maritalStatus"
                      ><i class="fa-solid fa-heart"></i>
                      {{ t("kanban-modal-edit-label-maritalstatus") }}
                    </label>
                    <select
                      :class="[
                        'form-select',
                        isEditMode ? 'bg-input-edit' : 'bg-input',
                        'py-2',
                      ]"
                      v-model="customerData.maritalStatus"
                      :disabled="!isEditMode"
                      name="maritalStatus"
                      @dblclick="handleDoubleClick"
                    >
                      <option
                        :value="null"
                        disabled
                        :selected="!customerData.maritalStatus"
                      >
                        {{ t("kanban-modal-edit-maritalstatus-placeholder") }}
                      </option>
                      <option
                        v-for="(value, key) in maritalStatusList"
                        :key="key"
                        :value="key"
                      >
                        {{ value }}
                      </option>
                    </select>
                  </div>
                  <!-- Personal Companion -->
                  <div class="col p-0">
                    <label class="form-label" for="personalCompanion"
                      ><i class="fa-solid fa-person-circle-plus"></i>
                      {{ t("kanban-modal-edit-label-personal-companion") }}
                    </label>
                    <select
                      v-model.number="customerData.personalCompanion"
                      :class="[
                        'form-select',
                        isEditMode ? 'bg-input-edit' : 'bg-input',
                        'py-2',
                      ]"
                      :disabled="!isEditMode"
                      name="personalCompanion"
                      @dblclick="handleDoubleClick"
                    >
                      <option
                        :value="null"
                        disabled
                        v-if="!customerData.personalCompanion"
                      >
                        {{
                          t("kanban-modal-edit-placeholder-personal-companion")
                        }}
                      </option>
                      <option
                        v-for="(value, key) in personalCompanionList"
                        :key="key"
                        :value="key"
                      >
                        {{ value }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Phone -->
              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="customerData.phone"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-phone-volume"></i>
                    {{ t("kanban-modal-edit-label-phone")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <div class="input-group">
                    <input
                      type="text"
                      :class="[
                        'form-control',
                        isEditMode ? 'bg-input-edit' : 'bg-input',
                        'py-2',
                      ]"
                      v-model="customerData.phone"
                      :placeholder="t('kanban-modal-edit-placeholder-phone')"
                      :readonly="
                        !permissionStore.hasPermission(
                          PERMISSIONS.EDIT_CONTACT_PHONE
                        ) || !isEditMode
                      "
                    />
                    <button
                      :class="['btn px-3 fs-5 btn-primary']"
                      @click="togglePhone2"
                    >
                      {{ showPhone2 ? "-" : "+" }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- phone2 -->
              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="showPhone2 && customerData.phone"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-phone-volume"></i>
                    {{ t("kanban-modal-edit-label-phone")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    :class="[
                      'form-control',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                      'py-2',
                    ]"
                    v-model="customerData.phone2"
                    :placeholder="t('kanban-modal-edit-placeholder-phone')"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-envelope"></i>
                    {{ t("kanban-modal-edit-label-email") }}
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    :class="[
                      'form-control',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                      'py-2',
                    ]"
                    v-model="customerData.email"
                    :placeholder="t('kanban-modal-edit-placeholder-email')"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>
              <hr />
              <!-- Notes -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-note-sticky"></i>
                    {{ t("kanban-modal-edit-label-notes") }}</label
                  >
                </div>
                <div class="col-10">
                  <textarea
                    :class="[
                      'form-control',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                    ]"
                    rows="4"
                    v-model="customerData.note"
                    :readonly="!isEditMode"
                  ></textarea>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-2">
                  <label for=""
                    ><i class="fa-solid fa-circle-question"></i>
                    {{ t("kanban-modal-edit-label-questions") }}</label
                  >
                </div>
                <div class="col-10">
                  <button
                    class="btn btn-primary w-100"
                    @click="openQuestionsModal"
                  >
                    {{ t("kanban-modal-edit-button-reports") }}
                  </button>
                </div>
              </div>

              <!-- Patient Problems -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2 pt-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-notes-medical"></i>
                    {{ t("kanban-modal-edit-label-initialdiagnosis") }}</label
                  >
                </div>
                <div class="col-10">
                  <div class="" v-if="customerData.patient_problems.length > 0">
                    <div class="row m-0 g-0">
                      <div
                        class="col-12 col-lg-6 p-0"
                        v-for="(
                          problem, index
                        ) in customerData.patient_problems"
                        :key="index"
                      >
                        <div class="row p-0 g-0 pe-2">
                          <div
                            class="col-7 pe-2 pb-2"
                            @dblclick="handleDoubleClick"
                          >
                            <select
                              class="form-select py-2 me-2"
                              :class="isEditMode ? 'bg-input-edit' : 'bg-input'"
                              v-model="problem.id"
                              :disabled="!isEditMode"
                              @dblclick="handleDoubleClick"
                            >
                              <option value="" disabled>
                                {{
                                  t(
                                    "kanban-modal-edit-placeholder-initialdiagnosis"
                                  )
                                }}
                              </option>
                              <option
                                v-for="pkg in diagnoses_packages"
                                :key="pkg.id"
                                :value="pkg.id"
                              >
                                {{ pkg.name }}
                              </option>
                            </select>
                          </div>
                          <div class="col-4 pe-2 pb-2">
                            <select
                              class="form-select py-2 me-2"
                              :class="isEditMode ? 'bg-input-edit' : 'bg-input'"
                              v-model="problem.severity"
                              :disabled="!isEditMode"
                              @dblclick="handleDoubleClick"
                            >
                              <option value="" disabled>
                                {{
                                  t("kanban-modal-edit-placeholder-severity")
                                }}
                              </option>
                              <option value="mild">
                                {{ t("kanban-modal-edit-severity-low") }}
                              </option>
                              <option value="moderate">
                                {{ t("kanban-modal-edit-severity-medium") }}
                              </option>
                              <option value="severe">
                                {{ t("kanban-modal-edit-severity-high") }}
                              </option>
                            </select>
                          </div>
                          <div class="col-1 pb-2">
                            <button
                              class="btn btn-primary me-2 h-100"
                              @click="removePatientProblem(index)"
                              v-show="isEditMode"
                            >
                              x
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pt-2" v-else-if="!isEditMode">
                    {{ t("kanban-modal-edit-label-no-initialdiagnosis") }}
                  </div>
                  <div class="w-100 d-flex mt-2 justify-content-start gap-2">
                    <button
                      class="btn btn-primary fs-5 px-3"
                      @click="addNewPatientProblem"
                      :disabled="!isEditMode"
                      v-show="isEditMode"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <hr />
              <!-- Kanban Packages -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2 pt-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-cubes"></i>
                    {{ t("kanban-modal-edit-label-kanban-packages") }}</label
                  >
                </div>
                <div class="col-10">
                  <div class="" v-if="customerData.kanban_packages.length > 0">
                    <div
                      v-for="(pkg, index) in customerData.kanban_packages"
                      :key="index"
                      class="packages mb-2 px-2"
                    >
                      <div class="row p-0">
                        <div
                          class="col-8 p-1 px-1"
                          @dblclick="handleDoubleClick"
                        >
                          <select
                            class="form-select py-2"
                            :class="isEditMode ? 'bg-input-edit' : 'bg-input'"
                            v-model="pkg.id"
                            :disabled="!isEditMode"
                            @dblclick="handleDoubleClick"
                          >
                            <option value="" disabled>
                              {{
                                t("kanban-modal-edit-placeholder-packages-name")
                              }}
                            </option>
                            <option
                              v-for="pkg in treatment_packages"
                              :key="pkg.id"
                              :value="pkg.id"
                            >
                              {{ pkg.name }}
                            </option>
                          </select>
                        </div>
                        <div class="col-3 p-1 px-1">
                          <div class="input-group">
                            <span class="input-group-text">Qty</span>
                            <input
                              type="number"
                              lang="en"
                              :class="[
                                'bg-input',
                                isEditMode ? 'bg-input-edit' : 'bg-input',
                                'p-2',
                                'rounded-right-2',
                                'form-control',
                              ]"
                              v-model="pkg.quantity"
                              :placeholder="
                                t(
                                  'kanban-modal-edit-placeholder-packages-quantity'
                                )
                              "
                              :readonly="!isEditMode"
                              min="1"
                            />
                          </div>
                        </div>
                        <div class="col-2 p-1 px-0 d-none">
                          <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input
                              type="number"
                              lang="en"
                              :class="[
                                'bg-input',
                                isEditMode ? 'bg-input-edit' : 'bg-input',
                                'p-2',
                                'rounded-right-2',
                                'form-control',
                              ]"
                              v-model="pkg.total_price"
                              :placeholder="
                                t(
                                  'kanban-modal-edit-placeholder-packages-price'
                                )
                              "
                              :readonly="!isEditMode"
                              min="0"
                            />
                          </div>
                        </div>
                        <div class="col-1 py-1">
                          <button
                            class="btn btn-primary"
                            @click="removeKanbanPackage(index)"
                            v-if="isEditMode"
                          >
                            x
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pt-2" v-else-if="!isEditMode">
                    {{ t("kanban-modal-edit-label-no-packages") }}
                  </div>
                  <div class="w-100 d-flex mt-2 justify-content-between gap-2">
                    <button
                      class="btn btn-primary fs-5 px-3"
                      @click="addNewKanbanPackage"
                      :disabled="!isEditMode"
                      v-show="isEditMode"
                    >
                      +
                    </button>
                    <div class="input-group">
                      <span class="input-group-text">
                        {{ t("kanban-modal-edit-label-total-cost") }}
                        {{ currency }}
                      </span>
                      <input
                        type="number"
                        lang="en"
                        :class="[
                          'bg-input',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'p-2',
                          'rounded-right-2',
                          'form-control',
                        ]"
                        v-model="customerData.kanban_total_cost"
                        :placeholder="`${t(
                          'kanban-modal-edit-placeholder-total-cost'
                        )} ${currency}`"
                        :readonly="!isEditMode"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Additional Services -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2 pt-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-hand-holding-medical"></i>
                    {{ t("kanban-modal-edit-label-addon") }}</label
                  >
                </div>
                <div class="col-10">
                  <div
                    class="row m-0 g-2"
                    v-if="customerData.additional_services.length > 0"
                  >
                    <div
                      class="col-12 col-lg-6 px-0 pe-2"
                      v-for="(
                        service, index
                      ) in customerData.additional_services"
                      :key="index"
                    >
                      <div class="row m-0 gx-0">
                        <div class="col-7 pe-2" @dblclick="handleDoubleClick">
                          <select
                            class="form-select py-2"
                            :class="isEditMode ? 'bg-input-edit' : 'bg-input'"
                            v-model="service.id"
                            :disabled="!isEditMode"
                            @dblclick="handleDoubleClick"
                          >
                            <option value="" disabled>
                              {{ t("kanban-modal-edit-placeholder-addon") }}
                            </option>
                            <option
                              v-for="pkg in additional_packages"
                              :key="pkg.id"
                              :value="pkg.id"
                            >
                              {{ pkg.name }}
                            </option>
                          </select>
                        </div>
                        <div class="col-4 pe-2">
                          <input
                            type="number"
                            v-model="service.days"
                            :placeholder="
                              t(
                                'kanban-model-edit-addon-input-placeholder-days'
                              )
                            "
                            class="form-control py-2"
                            :class="isEditMode ? 'bg-input-edit' : 'bg-input'"
                            :readonly="!isEditMode"
                            min="1"
                          />
                        </div>
                        <div class="col-1 pe-2">
                          <button
                            class="btn btn-primary h-100"
                            @click="removeAdditionalService(index)"
                            v-if="isEditMode"
                          >
                            x
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pt-2" v-else-if="!isEditMode">
                    {{ t("kanban-modal-edit-label-noaddon") }}
                  </div>
                  <div class="w-100 d-flex mt-2 justify-content-start gap-2">
                    <button
                      class="btn btn-primary fs-5 px-3"
                      @click="addNewAdditionalService"
                      :disabled="!isEditMode"
                      v-show="isEditMode"
                    >
                      +
                    </button>
                    <div class="input-group">
                      <span class="input-group-text">
                        {{ t("kanban-modal-edit-label-total-cost") }}
                        {{ currency }}
                      </span>
                      <input
                        type="number"
                        lang="en"
                        :class="[
                          'bg-input',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'p-2',
                          'rounded-right-2',
                          'form-control',
                        ]"
                        v-model="customerData.add_on_total_cost"
                        :placeholder="`${t(
                          'kanban-modal-edit-placeholder-total-cost'
                        )} ${currency}`"
                        :readonly="!isEditMode"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-"></i>
                    {{ t("kanban-modal-edit-label-warranty") }}
                  </label>
                </div>
                <div class="col-10">
                  <select
                    :class="[
                      'form-select',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                      'py-2',
                    ]"
                    v-model="customerData.warranty"
                    :disabled="!isEditMode"
                    name="warranty"
                    @dblclick="handleDoubleClick"
                  >
                    <option
                      :value="null"
                      disabled
                      v-if="!customerData.warranty"
                    >
                      {{
                        t("kanban-modal-edit-placeholder-personal-companion")
                      }}
                    </option>
                    <option
                      v-for="(value, key) in warrantyList"
                      :key="key"
                      :value="key"
                    >
                      {{ value }}
                    </option>
                  </select>
                </div>
              </div>
              <hr />
              <div class="row mb-3">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-list"></i>
                    {{ t("kanban-modal-edit-label-islocal") }}</label
                  >
                </div>
                <div class="col-10">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-6">
                        <button
                          :class="`btn btn-${
                            customerData.is_local
                              ? 'success'
                              : 'outline-success'
                          } w-100`"
                          @click="toggleIsLocal(1)"
                        >
                          {{ t("kanban-modal-edit-button-islocal-true") }}
                        </button>
                      </div>
                      <div class="col-6">
                        <button
                          :class="`btn btn-${
                            customerData.is_local ? 'outline-danger' : 'danger'
                          } w-100`"
                          @click="toggleIsLocal(0)"
                        >
                          {{ t("kanban-modal-edit-button-islocal-false") }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Deal ticket upload -->
              <div class="row mb-3" v-show="!customerData.is_local">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-list"></i>
                    {{ t("kanban-modal-edit-label-ticket") }}</label
                  >
                </div>
                <div class="col-10">
                  <input
                    v-if="!customerData.ticket"
                    type="file"
                    :class="[
                      'form-control',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                    ]"
                    @change="handleTicketUpload"
                    @dblclick="handleDoubleClick"
                    :disabled="!isEditMode"
                  />
                  <div class="row" v-else>
                    <div class="col-4">
                      <button
                        class="btn btn-primary w-100"
                        @click="removeTicket"
                        :disabled="!isEditMode"
                      >
                        <i class="fa-solid fa-file"></i>
                        {{ t("kanban-modal-edit-button-remove-ticket") }}
                      </button>
                    </div>
                    <div class="col-4">
                      <a
                        class="btn btn-primary w-100"
                        :href="customerData.ticket"
                        target="_blank"
                      >
                        <i class="fa-solid fa-file"></i>
                        {{ t("kanban-modal-edit-button-view-ticket") }}
                      </a>
                    </div>
                    <div class="col-4">
                      <a
                        class="btn btn-primary w-100"
                        :href="customerData.ticket"
                        target="_blank"
                        download
                      >
                        <i class="fa-solid fa-file"></i>
                        {{ t("kanban-modal-edit-button-download-ticket") }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="row mb-3"
                v-if="customerData.ticket && !customerData.is_local"
                @dblclick="handleDoubleClick"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-list"></i>
                    {{ t("kanban-modal-edit-label-ticket-details") }}</label
                  >
                </div>
                <div class="col-10">
                  <div class="row p-0 g-2">
                    <div class="col-4">
                      <label for="flight_number" class="form-label">
                        {{ t("kanban-modal-edit-label-flight-number") }}
                      </label>
                      <input
                        type="text"
                        name="flight_number"
                        v-model="customerData.flight_number"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'py-2',
                        ]"
                        :placeholder="
                          t('kanban-modal-edit-placeholder-flight-number')
                        "
                        @dblclick="handleDoubleClick"
                        :readonly="!isEditMode"
                      />
                    </div>
                    <div class="col-4">
                      <label for="arrival_date" class="form-label">
                        {{ t("kanban-modal-edit-label-arrival-date") }}
                      </label>
                      <input
                        type="datetime-local"
                        lang="en"
                        name="arrival_date"
                        v-model="customerData.arrival_date"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'py-2',
                        ]"
                        @dblclick="handleDoubleClick"
                        :readonly="!isEditMode"
                      />
                    </div>
                    <div class="col-4">
                      <label for="departure_date" class="form-label">
                        {{ t("kanban-modal-edit-label-departure-date") }}
                      </label>
                      <input
                        type="datetime-local"
                        lang="en"
                        name="departure_date"
                        v-model="customerData.departure_date"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'py-2',
                        ]"
                        @dblclick="handleDoubleClick"
                        :readonly="!isEditMode"
                      />
                    </div>
                    <div class="col-4">
                      <label for="hotel_name" class="form-label">
                        {{ t("kanban-modal-edit-label-hotel-name") }}
                      </label>
                      <input
                        type="text"
                        name="hotel_name"
                        v-model="hotel_name"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'py-2',
                        ]"
                        :placeholder="
                          t('kanban-modal-edit-placeholder-hotel-name')
                        "
                        @dblclick="handleDoubleClick"
                        :readonly="!isEditMode"
                      />
                    </div>
                    <div class="col-4">
                      <label for="hotel_check_in" class="form-label">
                        {{ t("kanban-modal-edit-label-hotel-check-in") }}
                      </label>
                      <input
                        type="datetime-local"
                        lang="en"
                        name="hotel_check_in"
                        v-model="hotel_check_in"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'py-2',
                        ]"
                        @dblclick="handleDoubleClick"
                        :readonly="!isEditMode"
                      />
                    </div>
                    <div class="col-4">
                      <label for="hotel_check_out" class="form-label">
                        {{ t("kanban-modal-edit-label-hotel-check-out") }}
                      </label>
                      <input
                        type="datetime-local"
                        lang="en"
                        name="hotel_check_out"
                        v-model="customerData.hotel_check_out"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'py-2',
                        ]"
                        @dblclick="handleDoubleClick"
                        :readonly="!isEditMode"
                      />
                    </div>
                    <div class="col-4">
                      <label class="form-label">{{
                        t("kanban-modal-edit-label-transportation")
                      }}</label>
                      <div class="form-check mt-1">
                        <div class="container-fluid">
                          <label for="transportation_true" class="form-label">
                            {{
                              t("kanban-modal-edit-label-transportation-true")
                            }}
                          </label>
                          <input
                            type="radio"
                            name="transportation"
                            id="transportation_true"
                            value="1"
                            v-model="customerData.transportation"
                            class="form-check-input"
                            @dblclick="handleDoubleClick"
                            :readonly="!isEditMode"
                          />
                        </div>
                        <div class="container-fluid">
                          <label for="transportation_false" class="form-label">
                            {{
                              t("kanban-modal-edit-label-transportation-false")
                            }}
                          </label>
                          <input
                            type="radio"
                            name="transportation"
                            id="transportation_false"
                            value="0"
                            v-model="customerData.transportation"
                            class="form-check-input"
                            @dblclick="handleDoubleClick"
                            :readonly="!isEditMode"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-4">
                      <label for="hotel_gmap_link" class="form-label">
                        {{ t("kanban-modal-edit-label-hotel-gmap-link") }}
                      </label>
                      <input
                        type="text"
                        name="hotel_gmap_link"
                        v-model="customerData.hotel_gmap_link"
                        v-show="isEditMode || !customerData.hotel_gmap_link"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'py-2',
                        ]"
                        :placeholder="
                          t('kanban-modal-edit-placeholder-hotel-gmap-link')
                        "
                        @dblclick="handleDoubleClick"
                        :readonly="!isEditMode"
                      />
                      <a
                        v-if="!isEditMode && customerData.hotel_gmap_link"
                        :href="customerData.hotel_gmap_link"
                        target="_blank"
                        class="btn btn-primary w-100"
                        >{{ t("kanban-modal-edit-button-hotel-gmap-link") }}</a
                      >
                    </div>
                    <div class="col-4">
                      <label for="time" class="form-label">
                        {{ t("kanban-modal-edit-label-time") }}
                      </label>
                      <input
                        type="datetime-local"
                        lang="en"
                        name="time"
                        v-model="customerData.time"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'py-2',
                        ]"
                        @dblclick="handleDoubleClick"
                        :readonly="!isEditMode"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Deal passport upload -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-list"></i>
                    {{
                      customerData.is_local
                        ? t("kanban-modal-edit-label-idcard")
                        : t("kanban-modal-edit-label-passport")
                    }}
                  </label>
                </div>
                <div class="col-10">
                  <div class="row p-0 g-2">
                    <div class="col-12 col-md-8">
                      <input
                        v-if="customerData.passports.length === 0"
                        type="file"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                        ]"
                        @change="handlePassportUpload"
                        @dblclick="handleDoubleClick"
                        :disabled="!isEditMode"
                      />
                      <div
                        v-for="(passport, index) in customerData.passports"
                        :key="index"
                      >
                        <div class="row">
                          <div class="col-4">
                            <button
                              class="btn btn-primary w-100"
                              @click="removePassport(index)"
                              :disabled="!isEditMode"
                            >
                              <i class="fa-solid fa-file"></i>
                              {{
                                t("kanban-modal-edit-button-remove-passport")
                              }}
                            </button>
                          </div>
                          <div class="col-4">
                            <a
                              class="btn btn-primary w-100"
                              :href="passport"
                              target="_blank"
                            >
                              <i class="fa-solid fa-file"></i>
                              {{ t("kanban-modal-edit-button-view-passport") }}
                            </a>
                          </div>
                          <div class="col-4">
                            <a
                              class="btn btn-primary w-100"
                              :href="passport"
                              target="_blank"
                              download
                            >
                              <i class="fa-solid fa-file"></i>
                              {{
                                t("kanban-modal-edit-button-download-passport")
                              }}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Passport Number -->
                    <div class="col-12 col-md-4 p-0 pe-1">
                      <input
                        type="text"
                        :class="[
                          'form-control',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          '',
                        ]"
                        v-model="customerData.passportNumber"
                        :placeholder="
                          customerData.is_local
                            ? t('kanban-modal-edit-label-placeholder-idcard')
                            : t('kanban-modal-edit-placeholder-passport-number')
                        "
                        :readonly="!isEditMode"
                        name="passportNumber"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <!-- Hospital Packages -->
              <div
                v-if="
                  permissionStore.hasPermission(
                    PERMISSIONS.VIEW_HOSPITAL_PACKAGE
                  )
                "
                class="row mb-3"
                @dblclick="handleDoubleClick"
              >
                <div class="col-2 pt-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-cubes"></i>
                    {{ t("kanban-modal-edit-label-hospital-packages") }}</label
                  >
                </div>
                <div class="col-10">
                  <div
                    class=""
                    v-if="customerData.hospital_packages.length > 0"
                  >
                    <div
                      v-for="(pkg, index) in customerData.hospital_packages"
                      :key="index"
                      class="packages mb-2 px-2"
                    >
                      <div class="row p-0">
                        <div
                          class="col-7 p-1 px-1"
                          @dblclick="handleDoubleClick"
                        >
                          <select
                            class="form-select py-2"
                            :class="isEditMode ? 'bg-input-edit' : 'bg-input'"
                            v-model="pkg.id"
                            :disabled="!isEditMode"
                            @dblclick="handleDoubleClick"
                          >
                            <option value="" disabled>
                              {{
                                t("kanban-modal-edit-placeholder-packages-name")
                              }}
                            </option>
                            <option
                              v-for="pkg in treatment_packages"
                              :key="pkg.id"
                              :value="pkg.id"
                            >
                              {{ pkg.name }}
                            </option>
                          </select>
                        </div>
                        <div class="col-2 p-1 px-1">
                          <div class="input-group">
                            <span class="input-group-text">Qty</span>
                            <input
                              type="number"
                              lang="en"
                              :class="[
                                'bg-input',
                                isEditMode ? 'bg-input-edit' : 'bg-input',
                                'p-2',
                                'rounded-right-2',
                                'form-control',
                              ]"
                              v-model="pkg.quantity"
                              :placeholder="
                                t(
                                  'kanban-modal-edit-placeholder-packages-quantity'
                                )
                              "
                              :readonly="!isEditMode"
                              min="1"
                            />
                          </div>
                        </div>
                        <div class="col-2 p-1 px-0">
                          <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input
                              type="number"
                              lang="en"
                              :class="[
                                'bg-input',
                                isEditMode ? 'bg-input-edit' : 'bg-input',
                                'p-2',
                                'rounded-right-2',
                                'form-control',
                              ]"
                              v-model="pkg.total_price"
                              :placeholder="
                                t(
                                  'kanban-modal-edit-placeholder-packages-price'
                                )
                              "
                              :readonly="!isEditMode"
                              min="0"
                            />
                          </div>
                        </div>
                        <div class="col-1 py-1">
                          <button
                            class="btn btn-primary"
                            @click="removeHospitalPackage(index)"
                            v-show="isEditMode"
                          >
                            x
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pt-2" v-else-if="!isEditMode">
                    {{ t("kanban-modal-edit-label-no-packages") }}
                  </div>
                  <div class="w-100 d-flex mt-2 justify-content-between gap-2">
                    <button
                      class="btn btn-primary fs-5 px-3"
                      @click="addNewHospitalPackage"
                      :disabled="!isEditMode"
                      v-if="isEditMode"
                    >
                      +
                    </button>
                    <div class="input-group">
                      <span class="input-group-text">
                        {{ t("kanban-modal-edit-label-total-cost") }}
                        {{ currency }}
                      </span>
                      <input
                        type="number"
                        lang="en"
                        :class="[
                          'bg-input',
                          isEditMode ? 'bg-input-edit' : 'bg-input',
                          'p-2',
                          'rounded-right-2',
                          'form-control',
                        ]"
                        v-model="customerData.hospital_total_cost"
                        :placeholder="`${t(
                          'kanban-modal-edit-placeholder-total-cost'
                        )} ${currency}`"
                        :readonly="!isEditMode"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Assigned To -->
              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="permissionStore.hasPermission('add-assigned-to-deal')"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-users"></i>
                    {{ t("kanban-modal-edit-label-assignedto") }}</label
                  >
                </div>
                <div class="col-10">
                  <select
                    :class="[
                      'form-select',
                      isEditMode ? 'bg-input-edit' : 'bg-input',
                      'py-2',
                    ]"
                    v-model="customerData.assigned_to"
                    :disabled="!isEditMode"
                  >
                    <option value="" disabled>
                      {{ t("kanban-modal-edit-placeholder-representative") }}
                    </option>
                    <option
                      v-for="user in logStore.users"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.name }}
                    </option>
                  </select>
                </div>
              </div>
              <!-- History -->
              <div class="row">
                <div class="col-6 pt-2">
                  <h5
                    v-if="permissionStore.hasPermission(PERMISSIONS.EDIT_STAGE)"
                  >
                    {{ t("kanban-modal-edit-history-heading") }}
                  </h5>
                </div>
                <div
                  class="col-6 d-flex justify-content-end align-items-center gap-2"
                  v-if="isEditMode"
                >
                  <button
                    class="btn btn-success text-white px-4 py-2"
                    @click="confirm"
                  >
                    {{ t("kanban-modal-edit-button-submit") }}
                  </button>
                  <button
                    class="btn btn-danger text-white px-4 py-2"
                    @click="closeEditMode"
                  >
                    {{ t("kanban-modal-edit-button-cancel") }}
                  </button>
                </div>
              </div>
              <div
                class="history ps-2 mt-2"
                v-if="
                  permissionStore.hasPermission(
                    PERMISSIONS.ADD_ASSIGNED_TO_DEAL
                  )
                "
              >
                <div
                  v-for="log in logStore?.logs || []"
                  :key="log.id"
                  class="row bg-input pt-2 text-secondary border border-top"
                >
                  <div class="col" style="font-size: 12px">
                    <template
                      v-for="(part, index) in logStore.formatLogEntry(
                        log,
                        getStageName,
                        getStageColor,
                        formatDate,
                        logStore.getUserName,
                        logStore.getUserColor
                      )"
                      :key="index"
                    >
                      <span v-if="typeof part === 'string'">{{ part }}</span>
                      <span
                        v-else-if="part.isBadge"
                        class="badge me-1"
                        :style="{
                          backgroundColor: part.backgroundColor,
                          color: 'white',
                        }"
                        >{{ part.text }}</span
                      >
                    </template>
                  </div>
                  <div class="col-auto ps-2">
                    <p style="font-size: 12px">
                      {{ new Date(log.created_at).toLocaleString() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- right section Comments And Tasks -->
            <div class="col-12 col-md-6 px-4">
              <!-- Comments Section -->
              <div class="row">
                <div class="col-12 px-0">
                  <div class="d-flex align-items-start">
                    <span
                      class="btn btn-light text-primary me-1 px-4 rounded-end-0"
                      style="background-color: #eee"
                    >
                      {{ t("kanban-modal-edit-comment-heading") }}
                    </span>
                    <textarea
                      ref="commentInput"
                      v-model="customerData.comment"
                      :placeholder="t('kanban-modal-edit-comment-placeholder')"
                      class="form-control comment-textarea bg-input text-secondary rounded-0 me-1"
                      rows="1"
                      style="
                        resize: none;
                        overflow-y: hidden;
                        min-height: 38px;
                        min-width: 50px;
                        width: 100%;
                      "
                      @input="autoResize($event.target)"
                      @keydown.enter="handleEnter"
                    ></textarea>
                    <button
                      class="btn btn-primary rounded-start-0 fixed-action-btn"
                      type="submit"
                      @click="handleAddComment"
                    >
                      {{ t("kanban-modal-edit-comment-button-submit") }}
                    </button>
                  </div>
                </div>
                <div class="col-12 mt-2 bg-input showComments py-2 rounded-3">
                  <div
                    v-for="comment in sortedComments"
                    :key="comment.id"
                    class="mt-2 d-flex justify-content-start align-items-start flex-nowrap"
                  >
                    <div class="pe-0">
                      <img
                        :src="comment.image"
                        class="rounded-5"
                        alt="Seals Image"
                        width="45"
                        height="45"
                      />
                      <!-- <span class="ms-2">{{ comment.username }}</span> -->
                    </div>
                    <div
                      class="position-relative ps-0"
                      style="max-width: calc(100% - 45px)"
                    >
                      <div
                        class="rounded-3 p-2"
                        style="
                          word-break: break-word;
                          overflow-wrap: break-word;
                          min-width: 50px !important;
                          max-width: 100% !important;
                          width: fit-content !important;
                        "
                      >
                        <h6
                          class="mb-2"
                          style="font-size: 16px; font-weight: 600"
                        >
                          {{ comment.isAdmin ? "System" : comment.username }}
                        </h6>
                        <div
                          :class="[
                            'rounded-3 p-2',
                            comment.isAdmin
                              ? 'adminComment'
                              : 'bg-light text-dark',
                          ]"
                        >
                          <div v-if="editingCommentId === comment.id">
                            <textarea
                              :id="`edit-textarea-${comment.id}`"
                              v-model="editingCommentText"
                              class="form-control rounded-2 bg-white text-dark ps-2"
                              style="
                                resize: none;
                                overflow-y: hidden;
                                min-height: 30px;
                                height: fit-content !important;
                                min-width: 50px;
                                max-width: 100% !important;
                                width: fit-content !important;
                                font-size: 14px;
                                box-sizing: border-box;
                                display: inline-block;
                                overflow-x: auto;
                                width: auto !important;
                              "
                              @input="
                                autoResize($event.target);
                                autoResizeEditWidth($event.target);
                              "
                            ></textarea>
                            <div class="d-flex justify-content-end gap-2 mt-1">
                              <button
                                class="btn btn-success btn-sm"
                                @click="handleUpdateComment(comment)"
                                style="font-size: 10px"
                              >
                                <i class="fa fa-check"></i>
                              </button>
                              <button
                                class="btn btn-danger btn-sm"
                                @click="cancelEditComment"
                                style="font-size: 10px"
                              >
                                <i class="fa fa-times"></i>
                              </button>
                            </div>
                          </div>
                          <div v-else>
                            <div
                              :ref="`commentText-${comment.id}`"
                              style="
                                white-space: pre-line;
                                min-width: 50px;
                                word-break: break-word;
                                overflow-wrap: break-word;
                                display: inline-block;
                                box-sizing: border-box;
                                overflow-x: hidden;
                                width: auto !important;
                              "
                              :style="{
                                width: getCommentTextWidth(comment.id),
                              }"
                              v-html="comment.text_body"
                            />
                          </div>
                        </div>
                        <div
                          class="d-flex justify-content-end align-items-center gap-2 mt-2"
                        >
                          <!-- pin button -->
                          <button
                            class="btn btn-sm p-0"
                            @click="togglePin(comment)"
                            :title="comment.isPinned ? 'Unpin' : 'Pin'"
                            style="z-index: 2"
                          >
                            <i
                              :class="[
                                'fa-solid',
                                'fa-thumbtack',
                                comment.isPinned
                                  ? 'text-warning'
                                  : comment.isAdmin
                                  ? ''
                                  : 'text-dark',
                              ]"
                              style="transform: rotate(-30deg); font-size: 12px"
                            ></i>
                          </button>
                          <button
                            v-if="editingCommentId !== comment.id"
                            class="btn btn-sm p-0 text-dark"
                            @click="editComment(comment)"
                          >
                            <i
                              class="fa-solid fa-pencil text-dark"
                              style="font-size: 12px"
                            ></i>
                          </button>
                          <button
                            class="btn btn-sm p-0 text-dark"
                            @click.prevent="copyComment(comment.text_body)"
                          >
                            <i
                              class="fa-solid fa-copy dark"
                              style="font-size: 12px"
                            ></i>
                          </button>
                          <span
                            class="text-secondary"
                            style="font-size: 10px"
                            >{{ formatDate(comment.created_at) }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- task Section -->
              <div class="row mt-4">
                <div class="col-12 p-0">
                  <div class="input-group">
                    <span
                      class="btn btn-light text-primary me-1 px-4"
                      style="background-color: #eee"
                    >
                      {{ t("kanban-modal-edit-tasks-heading") }}
                    </span>
                    <input
                      type="text"
                      class="form-control bg-input text-secondary py-2 me-1"
                      v-model="customerData.task"
                      :placeholder="t('kanban-modal-edit-tasks-placeholder')"
                      @keyup.enter="handleAddTask"
                    />
                    <input
                      type="date"
                      lang="en"
                      class="form-control bg-input text-secondary py-2 me-1"
                      v-model="customerData.date"
                      :placeholder="t('modals.selectDate')"
                      @mousedown="dateTaskClick"
                      @keyup.enter="handleAddTask"
                    />
                    <input
                      type="time"
                      class="form-control bg-input text-secondary py-2 me-1"
                      v-model="customerData.time"
                      :placeholder="t('modals.selectTime')"
                      @keyup.enter="handleAddTask"
                    />
                    <button
                      class="btn btn-primary py-1 px-4 fixed-action-btn"
                      type="submit"
                      @click="handleAddTask"
                    >
                      {{ t("kanban-modal-edit-tasks-button-add") }}
                    </button>
                  </div>
                </div>
                <div class="col-12 mt-2 bg-input p-3 showTasks rounded-3">
                  <div
                    class="row bg-input-subtle border-top border-bottom py-1"
                  >
                    <div class="col-4 text-center">
                      {{ t("kanban-modal-edit-tasks-table-description") }}
                    </div>
                    <div class="col-2 text-center">
                      {{ t("kanban-modal-edit-tasks-table-due-date") }}
                    </div>
                    <div class="col-2 text-center">
                      {{ t("kanban-modal-edit-tasks-table-due-time") }}
                    </div>
                    <div class="col-2 text-center">
                      {{ t("kanban-modal-edit-tasks-table-status") }}
                    </div>
                    <div class="col-2 text-center">
                      {{ t("kanban-modal-edit-tasks-table-actions") }}
                    </div>
                  </div>
                  <!-- data Tasks -->
                  <div
                    v-for="task in activeTasks"
                    :key="task.id"
                    class="row text-secondary mt-2 align-items-center border-light-subtle pb-2 border-bottom"
                    :class="{ 'delete-animation': task.toDelete }"
                  >
                    <div class="col-4">
                      {{ task.description }}
                    </div>
                    <div class="col-2">
                      <input
                        type="date"
                        lang="en"
                        class="form-control bg-secondary-subtle text-secondary py-2 me-1"
                        v-model="task.duedate"
                        :placeholder="t('modals.selectDate')"
                        @mousedown="dateTaskClick"
                        @click="storeOldValue(task.id, task.duedate)"
                        @change="
                          taskDataModified = true;
                          modified_id = task.id;
                        "
                      />
                    </div>
                    <div class="col-2">
                      <input
                        type="time"
                        class="form-control bg-secondary-subtle text-secondary py-2 me-1"
                        v-model="task.duetime"
                        :placeholder="t('modals.selectTime')"
                        @change="
                          taskDataModified = true;
                          modified_id = task.id;
                        "
                      />
                    </div>
                    <div class="col-2 text-center">
                      <span
                        class="fs-8"
                        :style="{
                          color: task.stage?.color,
                        }"
                        >{{ t("tasks-status-" + task.stage?.name) }}</span
                      >
                    </div>
                    <div class="col-2 text-center">
                      <button
                        v-show="taskDataModified && modified_id === task.id"
                        class="btn btn-sm btn-outline-warning align-middle fs-7 me-1"
                        @click="
                          handleTaskUpdate(task.id, task.duedate, task.duetime)
                        "
                        :title="t('kanban-modal-edit-tasks-button-update')"
                      >
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button
                        v-show="task.status !== 'completed'"
                        class="btn btn-sm btn-outline-success align-middle fs-7"
                        @click="handleTaskCompletion(task.id)"
                        :title="t('kanban-modal-edit-tasks-button-complete')"
                      >
                        <i class="fa-solid fa-check"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="position-fixed trashCustm">
          <button
            v-if="this.user_role !== 'after-sales'"
            class="btn bg-warning py-2 px-3 rounded-3 me-2"
            @click="openSuggestApprovalModal"
          >
            <i class="fa-solid fa-user text-white"></i>
          </button>
          <button
            v-if="this.user_role !== 'after-sales'"
            class="btn bg-danger py-2 px-3 rounded-3"
            @click="openTrashDealModal"
          >
            <i class="fa-solid fa-trash text-white"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <view-report ref="questionsModalRef" :deal_id="deal?.id" />
  <suggest-user-modal
    ref="suggestUserModalRef"
    :users="users"
    :phone="customerData?.phone"
    :dealId="deal?.id"
    @deal-suggested="handleDealSuggestion"
  />
  <trash-deal
    ref="trashDealModalRef"
    :dealId="deal?.id"
    @deal-trashed="handleStageUpdate"
  />
</template>

<script>
import {
  ref,
  reactive,
  computed,
  onMounted,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import RatingStars from "@/components/CreateDealElements/CrmDealKanbanDealDataModalRatingStars.vue";
import ViewReport from "@/components/kanban/CrmDealKanbanDealDataModalReportModal.vue";
import { Modal } from "bootstrap";
// import { useToast } from "vue-toastification";
// import {
//   showSuccess,
//   showError,
//   showInfo,
// } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";

import { useI18n } from "vue-i18n";
import TrashDeal from "@/components/modals/CrmDealKanbanDealDataModalTrashDealModal.vue";
import SuggestUserModal from "@/components/modals/SuggestUserModal.vue";
import { updateDealStage, updateDeal } from "@/plugins/services/dealService";
import {
  getAvailableStages,
  getAvailableAfterSalesStages,
} from "@/plugins/services/stageService";
import {
  fetchConversationByDealId,
  createConversation,
} from "@/plugins/services/whatsappService";
import {
  createComment,
  updateComments,
  toggleCommentPin,
} from "@/plugins/services/commentService";
import { createTask, updateTask } from "@/plugins/services/taskService";

import { PERMISSIONS, usePermissionStore } from "@/stores/PermissionStore";
import moveCardSound from "@/assets/move-card.wav";
import { useLogStore } from "@/stores/LogStore";
import { usePackageStore } from "@/stores/PackageStore";
import { useSourceStore } from "@/stores/SourceStore";
import Cookies from "js-cookie";

export default {
  name: "CrmDealKanbanDealDataModal",
  components: { RatingStars, ViewReport, TrashDeal, SuggestUserModal },
  props: {
    deal: {
      type: Object,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
    packages: {
      type: Array,
      required: true,
    },
    stages: {
      type: Array,
      required: true,
    },
    currentStageId: {
      type: [Number, String],
      required: true,
    },
    viewType: {
      type: String,
      default: "deal",
    },
  },
  setup(props, { emit }) {
    const notificationStore = useNotificationStore();
    const logStore = useLogStore();
    const packageStore = usePackageStore();
    const route = useRoute();
    const router = useRouter();
    const permissionStore = usePermissionStore();
    const selected_conversation = ref(null);
    const { t, locale } = useI18n();
    // const toast = useToast();
    const sourceStore = useSourceStore();
    const sources = computed(() => sourceStore.sources);
    const allStages = ref(null);
    const isEditMode = ref(false);
    const hoveredStage = ref(null);
    const stageColors = reactive({});
    const commentInput = ref(null);
    const user_role = ref(null);
    const currency = Cookies.get("currency") || "USD";
    const treatment_packages = computed(() =>
      packageStore.getPackagesWithCategory("treatments")
    );
    const additional_packages = computed(() =>
      packageStore.getPackagesWithCategory("add-ons")
    );
    const diagnoses_packages = computed(() =>
      packageStore.getPackagesWithCategory("initial-diagnosis")
    );

    const commentTextWidths = reactive({});
    const originalDataValue = ref({});
    const dataDealCopy = (obj) => JSON.parse(JSON.stringify(obj));

    const taskDataModified = ref(false);
    const modified_id = ref(null);

    const resizeDisplayedCommentWidth = (commentId) => {
      nextTick(() => {
        const span = document.querySelector(
          `span[ref="commentText-${commentId}"]`
        );
        if (span) {
          const tempSpan = document.createElement("span");
          tempSpan.style.visibility = "hidden";
          tempSpan.style.whiteSpace = "pre-line";
          const computedStyle = window.getComputedStyle(span);
          tempSpan.style.font = computedStyle.font;
          tempSpan.style.padding = computedStyle.padding;
          tempSpan.style.border = computedStyle.border;
          tempSpan.style.boxSizing = computedStyle.boxSizing;
          tempSpan.style.wordBreak = computedStyle.wordBreak;
          tempSpan.style.overflowWrap = computedStyle.overflowWrap;
          tempSpan.style.minWidth = computedStyle.minWidth;

          tempSpan.textContent = span.textContent || " ";

          document.body.appendChild(tempSpan);

          const contentWidth = tempSpan.offsetWidth;

          const minWidth = parseFloat(computedStyle.minWidth) || 50;

          commentTextWidths[commentId] = `${Math.max(
            minWidth,
            contentWidth + 5
          )}px`;

          document.body.removeChild(tempSpan);
        }
      });
    };

    const autoResizeEditWidth = (textarea) => {
      if (!textarea) return;

      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.whiteSpace = "pre";
      const computedStyle = window.getComputedStyle(textarea);
      span.style.font = computedStyle.font;
      span.style.padding = computedStyle.padding;
      span.style.border = computedStyle.border;
      span.style.boxSizing = computedStyle.boxSizing;
      span.style.wordBreak = computedStyle.wordBreak;
      span.style.overflowWrap = computedStyle.overflowWrap;
      span.style.minWidth = computedStyle.minWidth;

      span.textContent = textarea.value || textarea.placeholder || " ";

      document.body.appendChild(span);

      const contentWidth = span.offsetWidth;

      const minWidth = parseFloat(computedStyle.minWidth) || 50;

      textarea.style.width = Math.max(minWidth, contentWidth + 15) + "px";

      document.body.removeChild(span);
    };

    const getCommentTextWidth = computed(() => (commentId) => {
      return commentTextWidths[commentId] || "fit-content";
    });

    const customerData = reactive({
      id: props.deal?.id,
      name: props.deal?.contact.name || "Custome Name",
      nationality: props.deal?.contact.nationality || null,
      language: props.deal?.contact.language || null,
      personalCompanion: props.deal?.contact.companion || null,
      maritalStatus: props.deal?.contact.marital_status || null,
      passportNumber: props.deal?.contact.passportNumber || null,
      date_of_birth: props.deal?.contact.dob || null,
      phone: props.deal?.contact.phones[0]?.phone || "",
      phone2: props.deal?.contact.phones[1]?.phone || "",
      email: props.deal?.contact.email || "",
      note: props.deal?.note || "",
      rating: props.deal?.rating || 0,
      source_id: props.deal?.source_id || "",
      stage_id: props.deal?.stage_id || "",
      tasks: props.deal?.tasks || [],
      comments:
        props.deal?.comments.map((comment) => ({
          id: comment.id,
          text_body: comment.text_body || "No text",
          created_at: comment.created_at || "No date",
          username: comment.user?.name || "No user",
          image: comment.user?.image_url,
          isAdmin:
            (comment.user && comment.user.role === "super-admin") ||
            (comment.user && comment.user.role === "crm-admin")
              ? true
              : false,
          isPinned: comment.pinned || false,
        })) || [],
      assigned_to: props.deal?.assigned_to_id || "",
      is_local: props.deal?.is_local || 0,
      ticket: props.deal?.ticket || null,
      kanban_packages: props.deal?.kanban_packages || [],
      hospital_packages: props.deal?.hospital_packages || [],
      flight_number: props.deal?.flight_number || "",
      arrival_date: props.deal?.arrival_date || "",
      departure_date: props.deal?.departure_date || "",
      hotel_name: props.deal?.hotel_name || "",
      hotel_check_in: props.deal?.hotel_check_in || "",
      hotel_check_out: props.deal?.hotel_check_out || "",
      hotel_gmap_link: props.deal?.hotel_gmap_link || "",
      transportation: props.deal?.transportation || 0,
      time: props.deal?.time || "",
      kanban_total_cost: props.deal?.kanban_total_cost || null,
      hospital_total_cost: props.deal?.hospital_total_cost || null,
      passports: props.deal?.passports || [],
      patient_problems: props.deal?.diagnoses || [],
      additional_services: props.deal?.additional_services || [],
      add_on_total_cost: props.deal?.add_on_total_cost || null,
      warranty: props.deal?.warranty || null,
    });
    const nationalities_options = {
      afghan: {
        en: "Afghan",
        ar: "أفغاني",
      },
      albanian: {
        en: "Albanian",
        ar: "ألباني",
      },
      algerian: {
        en: "Algerian",
        ar: "جزائري",
      },
      american: {
        en: "American",
        ar: "أمريكي",
      },
      andorran: {
        en: "Andorran",
        ar: "أندوري",
      },
      angolan: {
        en: "Angolan",
        ar: "أنغولي",
      },
      antiguans: {
        en: "Antiguans",
        ar: "أنتيغوان",
      },
      argentinean: {
        en: "Argentinean",
        ar: "أرجنتيني",
      },
      armenian: {
        en: "Armenian",
        ar: "أرميني",
      },
      australian: {
        en: "Australian",
        ar: "أسترالي",
      },
      austrian: {
        en: "Austrian",
        ar: "نمساوي",
      },
      azerbaijani: {
        en: "Azerbaijani",
        ar: "أذربيجاني",
      },
      bahamian: {
        en: "Bahamian",
        ar: "باهامي",
      },
      bahraini: {
        en: "Bahraini",
        ar: "بحريني",
      },
      bangladeshi: {
        en: "Bangladeshi",
        ar: "بنغلاديشي",
      },
      barbadian: {
        en: "Barbadian",
        ar: "باربادوسي",
      },
      barbudans: {
        en: "Barbudans",
        ar: "باربودي",
      },
      batswana: {
        en: "Batswana",
        ar: "بوتسواني",
      },
      belarusian: {
        en: "Belarusian",
        ar: "بيلاروسي",
      },
      belgian: {
        en: "Belgian",
        ar: "بلجيكي",
      },
      belizean: {
        en: "Belizean",
        ar: "بليزي",
      },
      beninese: {
        en: "Beninese",
        ar: "بنيني",
      },
      bhutanese: {
        en: "Bhutanese",
        ar: "بوتاني",
      },
      bolivian: {
        en: "Bolivian",
        ar: "بوليفي",
      },
      bosnian: {
        en: "Bosnian",
        ar: "بوسني",
      },
      botswanan: {
        en: "Botswanan",
        ar: "بوتسواني",
      },
      brazilian: {
        en: "Brazilian",
        ar: "برازيلي",
      },
      british: {
        en: "British",
        ar: "بريطاني",
      },
      bruneian: {
        en: "Bruneian",
        ar: "بروناي",
      },
      bulgarian: {
        en: "Bulgarian",
        ar: "بلغاري",
      },
      burkinabe: {
        en: "Burkinabe",
        ar: "بوركيني فاسو",
      },
      burmese: {
        en: "Burmese",
        ar: "ميانماري (بورمي)",
      },
      burundian: {
        en: "Burundian",
        ar: "بوروندي",
      },
      cambodian: {
        en: "Cambodian",
        ar: "كمبودي",
      },
      cameroonian: {
        en: "Cameroonian",
        ar: "كاميروني",
      },
      canadian: {
        en: "Canadian",
        ar: "كندي",
      },
      cape_verdean: {
        en: "Cape Verdean",
        ar: "كاب فيردي (الرأس الأخضر)",
      },
      central_african: {
        en: "Central African",
        ar: "وسط أفريقي (جمهورية أفريقيا الوسطى)",
      },
      chadian: {
        en: "Chadian",
        ar: "تشادي",
      },
      chilean: {
        en: "Chilean",
        ar: "شيلي (تشيلي)",
      },
      chinese: {
        en: "Chinese",
        ar: "صيني (صين)",
      },
      colombian: {
        en: "Colombian",
        ar: "كولومبي (كولومبيا)",
      },
      comoran: {
        en: "Comoran",
        ar: "جزر القمر (جزر القمر)",
      },
      congolese: {
        en: "Congolese",
        ar: "كونغولي (الكونغو)",
      },
      costa_rican: {
        en: "Costa Rican",
        ar: "كوستاريكي (كوستاريكا)",
      },
      croatian: {
        en: "Croatian",
        ar: "كرواتي (كرواتيا)",
      },
      cuban: {
        en: "Cuban",
        ar: "كوبي (كوبا)",
      },
      cypriot: {
        en: "Cypriot",
        ar: "قبرصي (قبرص)",
      },
      czech: {
        en: "Czech",
        ar: "تشيكي (جمهورية التشيك)",
      },
      danish: {
        en: "Danish",
        ar: "دنماركي (الدنمارك)",
      },
      djibouti: {
        en: "Djibouti",
        ar: "دومينيكي",
      },
      dominican: {
        en: "Dominican",
        ar: "دومينيكي",
      },
      dutch: {
        en: "Dutch",
        ar: "هولندي",
      },
      east_timorese: {
        en: "East Timorese",
        ar: "تيموري شرقي",
      },
      ecuadorean: {
        en: "Ecuadorean",
        ar: "إكوادوري",
      },
      egyptian: {
        en: "Egyptian",
        ar: "مصري",
      },
      emirati: {
        en: "Emirati",
        ar: "إماراتي",
      },
      equatorial_guinean: {
        en: "Equatorial Guinean",
        ar: "غيني استوائي",
      },
      eritrean: {
        en: "Eritrean",
        ar: "إريتري",
      },
      estonian: {
        en: "Estonian",
        ar: "إستوني",
      },
      ethiopian: {
        en: "Ethiopian",
        ar: "إثيوبي",
      },
      fijian: {
        en: "Fijian",
        ar: "فيجي",
      },
      filipino: {
        en: "Filipino",
        ar: "فلبيني",
      },
      finnish: {
        en: "Finnish",
        ar: "فنلندي",
      },
      french: {
        en: "French",
        ar: "فرنسي",
      },
      gabonese: {
        en: "Gabonese",
        ar: "غابوني",
      },
      gambian: {
        en: "Gambian",
        ar: "غامبي",
      },
      georgian: {
        en: "Georgian",
        ar: "جورجي",
      },
      german: {
        en: "German",
        ar: "ألماني",
      },
      ghanaian: {
        en: "Ghanaian",
        ar: "غاني",
      },
      greek: {
        en: "Greek",
        ar: "يوناني",
      },
      grenadian: {
        en: "Grenadian",
        ar: "غرينادي",
      },
      guatemalan: {
        en: "Guatemalan",
        ar: "غواتيمالي",
      },
      guinea_bissauan: {
        en: "Guinea-Bissauan",
        ar: "غيني بيساوي",
      },
      guinean: {
        en: "Guinean",
        ar: "غيني",
      },
      guyanese: {
        en: "Guyanese",
        ar: "غياني",
      },
      haitian: {
        en: "Haitian",
        ar: "هايتي",
      },
      herzegovinian: {
        en: "Herzegovinian",
        ar: "هندوراسي",
      },
      honduran: {
        en: "Honduran",
        ar: "هندوراسي",
      },
      hungarian: {
        en: "Hungarian",
        ar: "مجري",
      },
      i_kiribati: {
        en: "I-Kiribati",
        ar: "آيسلندي",
      },
      icelander: {
        en: "Icelander",
        ar: "آيسلندي",
      },
      indian: {
        en: "Indian",
        ar: "هندي",
      },
      indonesian: {
        en: "Indonesian",
        ar: "إندونيسي",
      },
      iranian: {
        en: "Iranian",
        ar: "إيراني",
      },
      iraqi: {
        en: "Iraqi",
        ar: "عراقي",
      },
      irish: {
        en: "Irish",
        ar: "إيرلندي",
      },
      israeli: {
        en: "Israeli",
        ar: "إسرائيلي",
      },
      italian: {
        en: "Italian",
        ar: "إيطالي",
      },
      ivorian: {
        en: "Ivorian",
        ar: "ساحل العاج",
      },
      jamaican: {
        en: "Jamaican",
        ar: "جامايكي",
      },
      japanese: {
        en: "Japanese",
        ar: "ياباني",
      },
      jordanian: {
        en: "Jordanian",
        ar: "أردني",
      },
      kazakhstani: {
        en: "Kazakhstani",
        ar: "كازاخستاني",
      },
      kenyan: {
        en: "Kenyan",
        ar: "كيني",
      },
      kittian_and_nevisian: {
        en: "Kittian and Nevisian",
        ar: "كيتسي ونيفيسي",
      },
      kuwaiti: {
        en: "Kuwaiti",
        ar: "كويتي",
      },
      kyrgyz: {
        en: "Kyrgyz",
        ar: "قيرغيزي",
      },
      laotian: {
        en: "Laotian",
        ar: "لاوسي",
      },
      latvian: {
        en: "Latvian",
        ar: "لاتفي",
      },
      lebanese: {
        en: "Lebanese",
        ar: "لبناني",
      },
      liberian: {
        en: "Liberian",
        ar: "ليبيري",
      },
      libyan: {
        en: "Libyan",
        ar: "ليبي",
      },
      liechtensteiner: {
        en: "Liechtensteiner",
        ar: "ليختنشتايني",
      },
      lithuanian: {
        en: "Lithuanian",
        ar: "ليتواني",
      },
      luxembourger: {
        en: "Luxembourger",
        ar: "لوكسمبورغي",
      },
      macedonian: {
        en: "Macedonian",
        ar: "مقدوني",
      },
      malagasy: {
        en: "Malagasy",
        ar: "مدغشقري",
      },
      malawian: {
        en: "Malawian",
        ar: "مالاوي",
      },
      malaysian: {
        en: "Malaysian",
        ar: "ماليزي",
      },
      maldivan: {
        en: "Maldivan",
        ar: "مالديفي",
      },
      malian: {
        en: "Malian",
        ar: "مالي",
      },
      maltese: {
        en: "Maltese",
        ar: "مالطي",
      },
      marshallese: {
        en: "Marshallese",
        ar: "مارشالي",
      },
      mauritanian: {
        en: "Mauritanian",
        ar: "موريتاني",
      },
      mauritian: {
        en: "Mauritian",
        ar: "موريشي",
      },
      mexican: {
        en: "Mexican",
        ar: "مكسيكي",
      },
      micronesian: {
        en: "Micronesian",
        ar: "ميكرونيزي",
      },
      moldovan: {
        en: "Moldovan",
        ar: "مولدوفي",
      },
      monacan: {
        en: "Monacan",
        ar: "موناكي",
      },
      mongolian: {
        en: "Mongolian",
        ar: "منغولي",
      },
      moroccan: {
        en: "Moroccan",
        ar: "مغربي",
      },
      mosotho: {
        en: "Mosotho",
        ar: "موزمبيقي",
      },
      motswana: {
        en: "Motswana",
        ar: "ناميبي",
      },
      mozambican: {
        en: "Mozambican",
        ar: "موزمبيقي",
      },
      namibian: {
        en: "Namibian",
        ar: "ناميبي",
      },
      nauruan: {
        en: "Nauruan",
        ar: "ناورو",
      },
      nepalese: {
        en: "Nepalese",
        ar: "نيبالي",
      },
      new_zealander: {
        en: "New Zealander",
        ar: "نيوزيلندي",
      },
      nicaraguan: {
        en: "Nicaraguan",
        ar: "نيكاراغوي",
      },
      nigerian: {
        en: "Nigerian",
        ar: "نيجيري",
      },
      nigerien: {
        en: "Nigerien",
        ar: "نيجري",
      },
      north_korean: {
        en: "North Korean",
        ar: "كوري شمالي",
      },
      northern_irish: {
        en: "Northern Irish",
        ar: "إيرلندي شمالي",
      },
      norwegian: {
        en: "Norwegian",
        ar: "نرويجي",
      },
      omani: {
        en: "Omani",
        ar: "عماني",
      },
      pakistani: {
        en: "Pakistani",
        ar: "باكستاني",
      },
      palauan: {
        en: "Palauan",
        ar: "بالاوي",
      },
      palestinian: {
        en: "Palestinian",
        ar: "فلسطيني",
      },
      panamanian: {
        en: "Panamanian",
        ar: "بنمي",
      },
      papua_new_guinean: {
        en: "Papua New Guinean",
        ar: "بابوا غينيا الجديدة",
      },
      paraguayan: {
        en: "Paraguayan",
        ar: "باراغواي",
      },
      peruvian: {
        en: "Peruvian",
        ar: "بيروفي",
      },
      polish: {
        en: "Polish",
        ar: "بولندي",
      },
      portuguese: {
        en: "Portuguese",
        ar: "برتغالي",
      },
      qatari: {
        en: "Qatari",
        ar: "قطري",
      },
      romanian: {
        en: "Romanian",
        ar: "روماني",
      },
      russian: {
        en: "Russian",
        ar: "روسي",
      },
      rwandan: {
        en: "Rwandan",
        ar: "رواندي",
      },
      saint_lucian: {
        en: "Saint Lucian",
        ar: "سانت لوسي",
      },
      salvadoran: {
        en: "Salvadoran",
        ar: "سلفادوري",
      },
      samoan: {
        en: "Samoan",
        ar: "ساموي",
      },
      san_marinese: {
        en: "San Marinese",
        ar: "سان ماريني",
      },
      sao_tomean: {
        en: "Sao Tomean",
        ar: "ساو تومي",
      },
      saudi: {
        en: "Saudi",
        ar: "سعودي",
      },
      scottish: {
        en: "Scottish",
        ar: "اسكتلندي",
      },
      senegalese: {
        en: "Senegalese",
        ar: "سنغالي",
      },
      serbian: {
        en: "Serbian",
        ar: "صربي",
      },
      seychellois: {
        en: "Seychellois",
        ar: "سيشلي",
      },
      sierra_leonean: {
        en: "Sierra Leonean",
        ar: "سيراليوني",
      },
      singaporean: {
        en: "Singaporean",
        ar: "سنغافوري",
      },
      slovakian: {
        en: "Slovakian",
        ar: "سلوفاكي",
      },
      slovenian: {
        en: "Slovenian",
        ar: "سلوفيني",
      },
      solomon_islander: {
        en: "Solomon Islander",
        ar: "جزر سليمان",
      },
      somali: {
        en: "Somali",
        ar: "صومالي",
      },
      south_african: {
        en: "South African",
        ar: "جنوب أفريقي",
      },
      south_korean: {
        en: "South Korean",
        ar: "كوري جنوبي",
      },
      spanish: {
        en: "Spanish",
        ar: "إسباني",
      },
      sri_lankan: {
        en: "Sri Lankan",
        ar: "سريلانكي",
      },
      sudanese: {
        en: "Sudanese",
        ar: "سوداني",
      },
      surinamer: {
        en: "Surinamer",
        ar: "سورينامي",
      },
      swazi: {
        en: "Swazi",
        ar: "سوازي",
      },
      swedish: {
        en: "Swedish",
        ar: "سويدي",
      },
      swiss: {
        en: "Swiss",
        ar: "سويسري",
      },
      syrian: {
        en: "Syrian",
        ar: "سوري",
      },
      taiwanese: {
        en: "Taiwanese",
        ar: "تايواني",
      },
      tajik: {
        en: "Tajik",
        ar: "طاجيكي",
      },
      tanzanian: {
        en: "Tanzanian",
        ar: "تنزاني",
      },
      thai: {
        en: "Thai",
        ar: "تايلاندي",
      },
      togolese: {
        en: "Togolese",
        ar: "توغولي",
      },
      tongan: {
        en: "Tongan",
        ar: "تونغي",
      },
      trinidadian_or_tobagonian: {
        en: "Trinidadian or Tobagonian",
        ar: "ترينيدادي أو توباغوني",
      },
      tunisian: {
        en: "Tunisian",
        ar: "تونسي",
      },
      turkish: {
        en: "Turkish",
        ar: "تركي",
      },
      tuvaluan: {
        en: "Tuvaluan",
        ar: "توفالي",
      },
      ugandan: {
        en: "Ugandan",
        ar: "أوغندي",
      },
      ukrainian: {
        en: "Ukrainian",
        ar: "أوكراني",
      },
      uruguayan: {
        en: "Uruguayan",
        ar: "أوروغواياني",
      },
      uzbekistani: {
        en: "Uzbekistani",
        ar: "أوزبكستاني",
      },
      venezuelan: {
        en: "Venezuelan",
        ar: "فنزويلي",
      },
      vietnamese: {
        en: "Vietnamese",
        ar: "فيتنامي",
      },
      welsh: {
        en: "Welsh",
        ar: "ويلزي",
      },
      yemenite: {
        en: "Yemenite",
        ar: "يمني",
      },
      zambian: {
        en: "Zambian",
        ar: "زامبي",
      },
      zimbabwean: {
        en: "Zimbabwean",
        ar: "زيمبابوي",
      },
    };
    const nationalities = computed(() => {
      return Object.fromEntries(
        Object.entries(nationalities_options).map(([key, value]) => [
          key,
          locale.value === "ar" ? value.ar : value.en,
        ])
      );
    });
    const language_options = {
      arabic: {
        en: "Arabic",
        ar: "العربية",
      },
      english: {
        en: "English",
        ar: "الإنجليزية",
      },
      french: {
        en: "French",
        ar: "الفرنسية",
      },
    };
    const languages = computed(() => {
      return Object.fromEntries(
        Object.entries(language_options).map(([key, value]) => [
          key,
          locale.value === "ar" ? value.ar : value.en,
        ])
      );
    });
    const maritalStatusOptions = {
      single: {
        en: "Single",
        ar: "أعزب",
        fr: "Célibataire",
      },
      married: {
        en: "Married",
        ar: "متزوج",
        fr: "Marié(e)",
      },
    };

    const maritalStatusList = computed(() => {
      return Object.fromEntries(
        Object.entries(maritalStatusOptions).map(([key, value]) => [
          key,
          locale.value === "ar"
            ? value.ar
            : locale.value === "fr"
            ? value.fr
            : value.en,
        ])
      );
    });
    const personalCompanionOptions = {
      1: {
        en: "Yes",
        ar: "موجود",
        fr: "Oui",
      },
      0: {
        en: "No",
        ar: "غير موجود",
        fr: "Non",
      },
    };
    const warrantyOptions = {
      0: {
        en: " Not provided",
        ar: "غير متوفر",
        fr: "Non fourni",
      },
      1: {
        en: "Provided",
        ar: "متوفر",
        fr: "Fournie",
      },
    };
    const warrantyList = computed(() => {
      return Object.fromEntries(
        Object.entries(warrantyOptions).map(([key, value]) => [
          key,
          locale.value === "ar"
            ? value.ar
            : locale.value === "fr"
            ? value.fr
            : value.en,
        ])
      );
    });

    const personalCompanionList = computed(() => {
      return Object.fromEntries(
        Object.entries(personalCompanionOptions).map(([key, value]) => [
          key,
          locale.value === "ar"
            ? value.ar
            : locale.value === "fr"
            ? value.fr
            : value.en,
        ])
      );
    });
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    };
    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    };
    const sourceName = computed(() => {
      const source = sources.value.find((s) => s.id === props.deal?.source_id);
      return source ? source.name : "null";
    });
    const currentStageIdLocal = ref(props.currentStageId);
    const currentStage = computed(() => {
      return (
        (props.stages || []).find(
          (s) => s.id === currentStageIdLocal.value
        ) || {
          id: "",
          name: "",
          color_code: "#333",
        }
      );
    });
    const stageColor = computed(() => {
      return currentStage.value.color_code;
    });
    const newComment = ref("");
    const newTask = ref("");
    const taskDate = ref("");
    const rating = ref(0);
    const showPhone2 = ref(false);
    const togglePhone2 = () => {
      showPhone2.value = !showPhone2.value;
    };
    const openTrashDealModal = () => {
      if (!props.deal?.id) {
        notificationStore.error(t("error.dealNotFound"), {
          timeout: 3000,
        });
        return;
      }
      try {
        // const openModals = document.querySelectorAll(".modal.show");
        // openModals.forEach((modal) => {
        //   const modalInstance = Modal.getInstance(modal);
        //   if (modalInstance) {
        //     modalInstance.hide();
        //   }
        // });
        const trashDealModal = new Modal(
          document.getElementById("trashDealModal")
        );
        trashDealModal.show();
        const modalBackdrop = document.createElement("div");
        modalBackdrop.className = "modal-backdrop fade show";
        modalBackdrop.style.zIndex = "9999";
        document.body.appendChild(modalBackdrop);
      } catch (error) {
        console.error("Error opening trash modal:", error);
        notificationStore.error(t("error.openTrashModal"), {
          timeout: 3000,
        });
      }
    };
    const openSuggestApprovalModal = () => {
      if (!props.deal?.id) {
        notificationStore.error(t("error.dealNotFound"), {
          timeout: 3000,
        });
        return;
      }
      try {
        // const openModals = document.querySelectorAll(".modal.show");
        // openModals.forEach((modal) => {
        //   const modalInstance = Modal.getInstance(modal);
        //   if (modalInstance) {
        //     modalInstance.hide();
        //   }
        // });
        const suggestUserModal = new Modal(
          document.getElementById("suggestUserModal")
        );
        suggestUserModal.show();
        const modalBackdrop = document.createElement("div");
        modalBackdrop.className = "modal-backdrop fade show";
        modalBackdrop.style.zIndex = "9999";
        document.body.appendChild(modalBackdrop);
      } catch (error) {
        console.error("Error opening suggest user modal:", error);
        notificationStore.error(t("error.openSuggestUserModal"), {
          timeout: 3000,
        });
      }
    };
    const handleStageHover = (stageId) => {
      hoveredStage.value = stageId;
    };

    const handleStageLeave = () => {
      hoveredStage.value = null;
    };

    const playSound = () => {
      const moveSound = new Audio(moveCardSound);
      moveSound.currentTime = 0;
      moveSound
        .play()
        .catch((error) => console.error("Failed to play sound:", error));
    };

    const changeStage = async (stageId) => {
      try {
        currentStageIdLocal.value = stageId;
        const stageIndex = (props.stages || []).findIndex(
          (s) => s.id === stageId
        );
        (props.stages || []).forEach((stage, index) => {
          if (index <= stageIndex) {
            stageColors[stage.id] = (props.stages || [])[stageIndex].color_code;
          } else {
            stageColors[stage.id] = "";
          }
        });
        const response = await updateDealStage(props.deal.id, stageId);
        if (response.status === 200) {
          emit("stage-change", props.deal.id, stageId, props.deal.stage_id, 0);
          playSound();
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };

    const getStageClasses = (stageId) => {
      const stagesArr = props.stages || [];
      const stageIndex = stagesArr.findIndex((s) => s.id === stageId);
      const hoveredIndex = hoveredStage.value
        ? stagesArr.findIndex((s) => s.id === hoveredStage.value)
        : -1;
      const currentIndex = stagesArr.findIndex(
        (s) => s.id === currentStageIdLocal.value
      );

      const classes = { "": true };
      let backgroundColor = "";

      if (hoveredStage.value) {
        if (stageIndex <= hoveredIndex) {
          backgroundColor = stagesArr[hoveredIndex]?.color_code || "#333";
        } else {
          classes["btn-secondary"] = true;
        }
      } else {
        if (stageIndex <= currentIndex) {
          backgroundColor = stagesArr[currentIndex]?.color_code || "#333";
        } else {
          classes["btn-secondary"] = true;
        }
      }
      const textColor = getContrastColor(backgroundColor);
      return { classes, backgroundColor, textColor };
    };
    const getContrastColor = (hexColor) => {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 170 ? "#000000" : "#FFFFFF";
    };
    const startCall = () => {
      notificationStore.info(t("success.startCall"), {
        timeout: 3000,
      });
    };

    const startWhatsapp = () => {
      const modal = new Modal(document.getElementById("whatsappModal"));
      modal.show();
    };

    const sendEmail = () => {
      notificationStore.info(t("success.sendEmail"), {
        timeout: 3000,
      });
    };
    const confirm = async () => {
      try {
        if (originalDataValue.value.phone && !customerData.phone) {
          notificationStore.error("Phone is required.", {
            timeout: 3000,
          });
          return;
        }
        const phones = [customerData.phone];
        if (customerData.phone2) {
          phones.push(customerData.phone2);
        }

        const formData = {
          name: customerData.name,
          nationality: customerData.nationality,
          language: customerData.language,
          companion: customerData.personalCompanion,
          marital_status: customerData.maritalStatus,
          phones: phones,
          email: customerData.email || "",
          note: customerData.note || "",
          rating: customerData.rating || 0,
          user_id: customerData.assigned_to || "",
          is_local: customerData.is_local ? 1 : 0,
          ticket: customerData.ticket || null,
          kanban_packages: customerData.kanban_packages || null,
          hospital_packages: customerData.hospital_packages || null,
          flight_number: customerData.flight_number || "",
          arrival_date: customerData.arrival_date || "",
          departure_date: customerData.departure_date || "",
          hotel_name: customerData.hotel_name || "",
          hotel_check_in: customerData.hotel_check_in || "",
          hotel_check_out: customerData.hotel_check_out || "",
          hotel_gmap_link: customerData.hotel_gmap_link || "",
          transportation: customerData.transportation || 0,
          time: customerData.time || "",
          kanban_total_cost: customerData.kanban_total_cost || null,
          hospital_total_cost: customerData.hospital_total_cost || null,
          add_on_total_cost: customerData.add_on_total_cost || null,
          passports: [customerData.passport || null],
          diagnosis: customerData.patient_problems || [],
          additional_services: customerData.additional_services || [],
          dob: customerData.date_of_birth || [],
          passportNumber: customerData.passportNumber || [],
          warranty: customerData.warranty || [],
        };

        const response = await updateDeal(props.deal.id, formData);
        if (response.data) {
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
          isEditMode.value = false;
          emit("update-deal", formData);
        } else {
          notificationStore.error(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error saving changes:", error);
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };
    const closeEditMode = () => {
      Object.assign(customerData, dataDealCopy(originalDataValue.value));
      isEditMode.value = false;
    };
    const updateRating = (newRating) => {
      try {
        rating.value = newRating;
        notificationStore.error(t("success.updateRating"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error updating rating:", error);
        notificationStore.error(t("error.updateRating"), {
          timeout: 3000,
        });
      }
    };

    const truncateText = (text) => {
      if (text.length > 20) {
        return text.substring(0, 20) + "...";
      }
      return text;
    };

    const addNewKanbanPackage = () => {
      if (!isEditMode.value) return;
      customerData.kanban_packages.push({
        id: "",
        quantity: null,
        total_price: null,
      });
    };

    const addNewHospitalPackage = () => {
      if (!isEditMode.value) return;
      customerData.hospital_packages.push({
        id: "",
        quantity: null,
        total_price: null,
      });
    };

    const removeKanbanPackage = (index) => {
      try {
        customerData.kanban_packages.splice(index, 1);
        notificationStore.success(t("success.removePackage"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error removing package:", error);
        notificationStore.error(t("error.removePackage"), {
          timeout: 3000,
        });
      }
    };

    const removeHospitalPackage = (index) => {
      try {
        customerData.hospital_packages.splice(index, 1);
        notificationStore.success(t("success.removePackage"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error removing package:", error);
        notificationStore.error(t("error.removePackage"), {
          timeout: 3000,
        });
      }
    };

    const addNewPatientProblem = () => {
      if (!isEditMode.value) return;
      customerData.patient_problems.push({
        id: "",
      });
    };

    const removePatientProblem = (index) => {
      try {
        customerData.patient_problems.splice(index, 1);
        notificationStore.success(t("success.removePatientProblem"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error removing patient problem:", error);
        notificationStore.success(t("error.removePatientProblem"), {
          timeout: 3000,
        });
      }
    };

    const addNewAdditionalService = () => {
      if (!isEditMode.value) return;
      customerData.additional_services.push({
        id: "",
      });
    };

    const removeAdditionalService = (index) => {
      try {
        customerData.additional_services.splice(index, 1);
      } catch (error) {
        console.error("Error removing additional service:", error);
        notificationStore.error(t("error.removeAdditionalService"), {
          timeout: 3000,
        });
      }
    };

    const handleTaskCompletion = async (taskId) => {
      try {
        const task = customerData.tasks.find((t) => t.id === taskId);
        const formData = {
          status: "completed",
          duedate: task.duedate,
        };
        const response = await updateTask(task.id, formData);
        if (response.data) {
          task.status = "completed";
          notificationStore.success(t("success.taskCompleted"), {
            timeout: 3000,
          });
          emit("task-finish", task.duedate);
        } else {
          notificationStore.error(t("error.completingTask"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error completing task:", error);
        notificationStore.error(t("error.completingTask"), {
          timeout: 3000,
        });
      }
    };
    const openQuestionsModal = () => {
      try {
        const modal = new Modal(document.getElementById("questionsModal"));
        modal.show();
      } catch (error) {
        console.error("Error opening questions modal:", error);
        notificationStore.error(t("error.openQuestionsModal"), {
          timeout: 3000,
        });
      }
    };

    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value;
    };

    const handleDoubleClick = () => {
      isEditMode.value = true;
    };
    const openWhatsappModal = async (id) => {
      try {
        let conversation = await fetchConversationByDealId(id);
        if (!conversation.data?.data) {
          conversation = await createConversation(id);
        }
        selected_conversation.value = conversation.data.data;
        await nextTick();
        const modalElement = document.getElementById("whatsappModal");
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.show();
        } else {
          console.warn("Modal element not found in DOM.");
        }
        // emit("open-whatsapp-modal", selected_conversation.value);
        emit(
          "open-whatsapp-modal",
          {
            ...selected_conversation.value,
            img:
              selected_conversation.value.img ||
              require("@/assets/whatsappImage/default-userImage.jpg"),
            phone:
              selected_conversation.value.phone?.phone ||
              selected_conversation.value.phone,
          },
          id
        );
      } catch (error) {
        console.error("Error opening WhatsApp modal:", error);
        notificationStore.error(t("error.openWhatsappModal"), {
          timeout: 3000,
        });
      }
    };

    const autoResize = (textarea) => {
      if (!textarea) return;

      textarea.style.height = "30px";
      const newHeight = textarea.scrollHeight;
      const maxRows = 7;
      const lineHeight = 44;
      const maxHeight = maxRows * lineHeight;
      const calculatedHeight = Math.min(newHeight, maxHeight);

      textarea.style.height = calculatedHeight + "px";

      if (newHeight > maxHeight) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    };

    const handleAddComment = async () => {
      try {
        const formData = {
          text_body: customerData.comment,
          deal_id: props.deal?.id,
        };
        const response = await createComment(formData);
        if (response.status === 200 || response.status === 201) {
          const newComment = {
            id: response.data.data.id,
            text_body: customerData.comment,
            created_at: new Date().toISOString(),
            username: response.data.data.user?.name || "No user",
            isAdmin: response.data.data.user?.role === "super-admin",
          };
          customerData.comments.unshift(newComment);

          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
          customerData.comment = "";
          nextTick(() => {
            const textarea = document.querySelector(".comment-textarea");
            if (textarea) {
              autoResize(textarea);
            }
            resizeDisplayedCommentWidth(newComment.id);
          });
        } else {
          notificationStore.error(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };
    const handleEnter = (event) => {
      if (!event.shiftKey) {
        event.preventDefault();
        handleAddComment();
        resetTextareaSize(event.target);
      }
    };
    const resetTextareaSize = (textarea) => {
      if (textarea) {
        textarea.style.height = "30px";
        textarea.style.overflowY = "hidden";
      }
    };
    const handleAddTask = async () => {
      try {
        const deal_id = props.deal?.id;
        const formData = {
          description: customerData.task,
          duedate: customerData.date,
          duetime: customerData.time,
          deal_id: props.deal?.id,
        };
        const response = await createTask(formData);
        if (response.status === 200 || response.status === 201) {
          customerData.tasks.unshift({
            id: response.data.data.id,
            description: customerData.task,
            duedate: customerData.date,
            duetime: customerData.time,
            status: "active",
            stage: getTaskStageName(customerData.date),
          });
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
          if (route.path === "/crm-tasks") {
            emit("task-added", {
              deal_id: deal_id,
              duedate: customerData.date,
              duetime: customerData.time,
            });
          }
          customerData.task = "";
          customerData.date = "";
          customerData.time = "";
        } else {
          notificationStore.error(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error adding task:", error);
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };
    const activeTasks = computed(() => {
      return customerData.tasks.filter((task) => task.status === "active");
    });
    const handleStageUpdate = (deal_id, new_stage_id, is_trash = false) => {
      if (!props.deal?.id) {
        notificationStore.error(t("error.dealNotFound"), {
          timeout: 3000,
        });
        return;
      }

      if (is_trash) {
        const dealDataModal = Modal.getInstance(
          document.getElementById("dealDataCard")
        );
        if (dealDataModal) {
          dealDataModal.hide();
        }
      }

      emit(
        "stage-change",
        deal_id,
        new_stage_id,
        props.deal.stage_id,
        0,
        is_trash
      );
    };
    watch(
      () => props.deal,
      (newDeal) => {
        if (newDeal) {
          // fetchLogs(newDeal.id);
          if (newDeal?.id) {
            logStore.logs = [];
            logStore.fetchLogs(newDeal.id);
          }
          nextTick(() => {
            if (newDeal.comments) {
              newDeal.comments.forEach((comment) => {
                resizeDisplayedCommentWidth(comment.id);
              });
            }
          });
          originalDataValue.value = dataDealCopy(customerData);
        }
      },
      { immediate: true }
    );
    const activeMenu = ref(null);
    const toggleMenu = (commentId) => {
      activeMenu.value = activeMenu.value === commentId ? null : commentId;
    };
    const copyComment = (text) => {
      navigator.clipboard.writeText(text);
      activeMenu.value = null;
      notificationStore?.success?.("Copied!");
    };
    const editingCommentId = ref(null);
    const editingCommentText = ref("");
    const editComment = (comment) => {
      editingCommentId.value = comment.id;
      editingCommentText.value = comment.text_body;
      nextTick(() => {
        const textarea = document.getElementById(`edit-textarea-${comment.id}`);
        if (textarea) {
          autoResize(textarea);
          autoResizeEditWidth(textarea);
          textarea.focus();

          setTimeout(() => {
            autoResize(textarea);
          }, 0);
        }
      });
    };
    const handleUpdateComment = async (comment) => {
      try {
        const formData = {
          text_body: editingCommentText.value,
          comment_id: comment.id,
        };
        const response = await updateComments(comment.id, formData);
        if (response.data) {
          const idx = customerData.comments.findIndex(
            (c) => c.id === comment.id
          );
          if (idx !== -1) {
            customerData.comments[idx].text_body = editingCommentText.value;
          }
          notificationStore.success(t("success.commentUpdated"));
          editingCommentId.value = null;
          editingCommentText.value = "";
          nextTick(() => {
            resizeDisplayedCommentWidth(comment.id);
          });
        } else {
          notificationStore.error(t("error.updatingComment"));
        }
      } catch (error) {
        console.error("Error updating comment:", error);
        notificationStore.error(t("error.updatingComment"));
      }
    };
    const togglePin = async (comment) => {
      comment.isPinned = !comment.isPinned;
      try {
        const response = await toggleCommentPin(comment.id);
        if (response.status === 200) {
          const idx = customerData.comments.findIndex(
            (c) => c.id === comment.id
          );
          if (idx !== -1) {
            const [pinnedComment] = customerData.comments.splice(idx, 1);
            customerData.comments.unshift(pinnedComment);
          }
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
        } else {
          throw new Error(t("error.updatingCommentPin"));
        }
      } catch (error) {
        console.error("Error updating comment pin status:", error);
        comment.isPinned = !comment.isPinned;
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };
    const sortedComments = computed(() => {
      return customerData.comments.slice().sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    });
    const cancelEditComment = () => {
      editingCommentId.value = null;
      editingCommentText.value = "";
    };
    onMounted(async () => {
      await logStore.fetchUsers();
      if (props.deal?.id) await logStore.fetchLogs(props.deal.id);
      // fetchUsers();
      document.addEventListener("click", handleClickOutside);

      if (commentInput.value) {
        autoResize(commentInput.value);
      }
      nextTick(() => {
        if (customerData.comments) {
          customerData.comments.forEach((comment) => {
            resizeDisplayedCommentWidth(comment.id);
          });
        }
      });
      originalDataValue.value = dataDealCopy(customerData);
      const modalElement = document.getElementById("dealDataCard");
      if (modalElement) {
        modalElement.__cancelEditHandler = () => {
          if (isEditMode.value) {
            closeEditMode();
          }
        };
        modalElement.addEventListener(
          "hidden.bs.modal",
          modalElement.__cancelEditHandler
        );
      }
      if (props.viewType == "after-sales") {
        getAvailableAfterSalesStages().then((response) => {
          if (response.data && response.data.data) {
            allStages.value = response.data.data;
          } else {
            allStages.value = [];
          }
        });
      } else {
        getAvailableStages().then((response) => {
          if (response.data && response.data.data) {
            allStages.value = response.data.data;
          } else {
            allStages.value = [];
          }
        });
      }
    });
    watch(
      () => customerData.comments,
      (newComments) => {
        nextTick(() => {
          newComments.forEach((comment) => {
            resizeDisplayedCommentWidth(comment.id);
          });
        });
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
      const modalElement = document.getElementById("dealDataCard");
      if (modalElement && modalElement.__cancelEditHandler) {
        modalElement.removeEventListener(
          "hidden.bs.modal",
          modalElement.__cancelEditHandler
        );
        delete modalElement.__cancelEditHandler;
      }
    });
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".comment-menu") &&
        !e.target.closest(".fa-ellipsis-vertical")
      ) {
        activeMenu.value = null;
      }
    };
    const handleTicketUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        customerData.ticket = file;
        notificationStore.success(t("success.fileUploaded"), {
          timeout: 3000,
        });
      }
    };
    const handlePassportUpload = (event) => {
      const passport = event.target.files[0];
      if (passport) {
        customerData.passport = passport;
        notificationStore.success(t("success.fileUploaded"), {
          timeout: 3000,
        });
      }
    };
    const dateTaskClick = (event) => {
      event.preventDefault();
      if (event.target && typeof event.target.showPicker === "function") {
        event.target.showPicker();
      }
    };
    const removeTicket = () => {
      customerData.ticket = null;
      notificationStore.success(t("success.fileRemoved"), {
        timeout: 3000,
      });
    };
    const removePassport = (index) => {
      customerData.passports.splice(index, 1);
      notificationStore.success(t("success.fileRemoved"), {
        timeout: 3000,
      });
    };
    const handleDealSuggestion = () => {
      if (!props.deal?.id) {
        notificationStore.error(t("error.dealNotFound"), {
          timeout: 3000,
        });
        return;
      }
      emit("suggest-user", props.deal.id);
    };
    const old_duedate = ref("");
    const old_task_id = ref("");
    const storeOldValue = (task_id, duedate) => {
      if (old_task_id.value !== task_id) {
        old_duedate.value = duedate;
        old_task_id.value = task_id;
      }
    };
    const handleTaskUpdate = async (taskId, duedate, duetime) => {
      if (
        !/^\d{2}:\d{2}$/.test(duetime) &&
        duetime !== "" &&
        duetime !== null
      ) {
        console.error("Invalid time format. Expected HH:MM.");
        const [hours, minutes] = duetime.split(":");
        duetime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      }
      try {
        taskDataModified.value = false;
        const formData = {
          duedate,
          duetime,
        };
        const response = await updateTask(taskId, formData);
        if (response.status === 200 || response.status === 201) {
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
          if (route.path === "/crm-tasks") {
            emit("task-updated", {
              new_duedate: duedate,
              old_duedate: old_duedate.value,
            });
          }
          const stage = getTaskStageName(duedate);
          const task = customerData.tasks.find((t) => t.id === taskId);
          if (task) {
            task.stage = stage;
          }
        } else {
          notificationStore.error(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error updating task:", error);
        notificationStore.error(t("error.updatingTask"), {
          timeout: 3000,
        });
      }
    };

    const getTaskStageName = (due_date) => {
      let name = "";
      let color = "";
      const duedate = due_date ? new Date(due_date) : null;
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      if (!duedate) {
        name = name + "idle";
        color = "#1c6ab8";
      } else {
        const duedateStr = duedate.toISOString().slice(0, 10);

        if (duedateStr < todayStr) {
          name = name + "overdue";
          color = "#b80f0f";
        } else if (duedateStr === todayStr) {
          name = name + "due-today";
          color = "#bf6811";
        } else {
          // Calculate date ranges for tomorrow, this week, next week
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().slice(0, 10);

          const nextWeek = new Date(today);
          // Set nextWeek to the start of next week (Monday)
          const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
          const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
          nextWeek.setDate(today.getDate() + daysUntilNextMonday);
          const nextWeekStr = nextWeek.toISOString().slice(0, 10);

          const twoWeeks = new Date(today);
          const daysUntilSecondMonday = daysUntilNextMonday + 7;
          twoWeeks.setDate(today.getDate() + daysUntilSecondMonday);
          const twoWeeksStr = twoWeeks.toISOString().slice(0, 10);

          if (duedateStr === tomorrowStr) {
            name = name + "due-tomorrow";
            color = "#bf6811";
          } else if (duedateStr > todayStr && duedateStr < nextWeekStr) {
            name = name + "due-this-week";
            color = "#b8b818";
          } else if (duedateStr >= nextWeekStr && duedateStr < twoWeeksStr) {
            name = name + "due-next-week";
            color = "#15ad71";
          } else if (duedateStr >= twoWeeksStr) {
            name = name + "due-later";
            color = "#12a193";
          } else {
            console.error("No matching stage found for due date");
          }
        }
      }
      return { name: name, color: color };
    };

    const toggleIsLocal = (value) => {
      handleDoubleClick();
      if (value) {
        customerData.is_local = true;
      } else {
        customerData.is_local = false;
      }
    };
    const PrintCase = () => {
      try {
        const routeData = router.resolve({
          path: "/CompleteCase",
          query: { dealId: props.deal?.id },
        });
        const printWindow = window.open(
          routeData.href,
          "_blank",
          "width=800,height=600"
        );
        printWindow.onload = () => {
          setTimeout(() => {
            const style = printWindow.document.createElement("style");
            style.innerHTML = `
          @page {
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;       
            padding: 0;
          }
          .top-bar {
            display: none;
          }
        `;
            printWindow.document.head.appendChild(style);

            printWindow.focus();
            printWindow.print();
            printWindow.close();
          }, 5000);
        };
      } catch (error) {
        console.error("Error printing the Documents", error);
        notificationStore.error(t("error.PrintCase"), {
          timeout: 3000,
        });
      }
    };
    const getStageName = (stageId) => {
      const stage = props.stages.find((s) => s.id === stageId);
      return stage ? stage.name : `Stage#${stageId}`;
    };
    const getStageColor = (id) => {
      const stage = props.stages.find((s) => s.id === id);
      return stage ? stage.color_code : id;
    };
    onMounted(() => {
      packageStore.fetchAll();
      user_role.value = Cookies.get("user_role");
    });

    return {
      modified_id,
      getStageColor,
      getStageName,
      toggleIsLocal,
      storeOldValue,
      removePassport,
      handleDealSuggestion,
      allStages,
      currentStage,
      customerData,
      newComment,
      newTask,
      taskDate,
      selected_conversation,
      changeStage,
      startCall,
      startWhatsapp,
      sendEmail,
      confirm,
      rating,
      updateRating,
      truncateText,
      togglePhone2,
      showPhone2,
      addNewKanbanPackage,
      addNewHospitalPackage,
      removeKanbanPackage,
      removeHospitalPackage,
      handleTaskCompletion,
      handleStageHover,
      handleStageLeave,
      getStageClasses,
      openQuestionsModal,
      toggleEditMode,
      handleDoubleClick,
      isEditMode,
      openWhatsappModal,
      t,
      sourceName,
      stageColor,
      handleAddComment,
      handleAddTask,
      activeTasks,
      formatDate,
      closeEditMode,
      formatDateForInput,
      openTrashDealModal,
      handleStageUpdate,
      permissionStore,
      PERMISSIONS,
      getContrastColor,
      handleEnter,
      autoResize,
      resetTextareaSize,
      activeMenu,
      toggleMenu,
      copyComment,
      handleClickOutside,
      editingCommentId,
      editingCommentText,
      editComment,
      handleUpdateComment,
      togglePin,
      sortedComments,
      cancelEditComment,
      logStore,
      users: logStore.users,
      commentInput,
      autoResizeEditWidth,
      resizeDisplayedCommentWidth,
      getCommentTextWidth,
      commentTextWidths,
      handleTicketUpload,
      originalDataValue,
      dataDealCopy,
      dateTaskClick,
      currentStageIdLocal,
      removeTicket,
      nationalities,
      languages,
      openSuggestApprovalModal,
      taskDataModified,
      handleTaskUpdate,
      handlePassportUpload,
      PrintCase,
      maritalStatusList,
      personalCompanionList,
      addNewPatientProblem,
      removePatientProblem,
      addNewAdditionalService,
      removeAdditionalService,
      treatment_packages,
      additional_packages,
      diagnoses_packages,
      user_role,
      warrantyList,
      currency,
    };
  },
};
</script>

<style scoped>
input {
  border: none;
  font-size: 16px;
}
input:focus {
  border: none !important;
  box-shadow: none;
}
select {
  border: none;
  font-size: 16px;
}
select:focus {
  border: none;
  box-shadow: none;
}
textarea {
  border: none;
  font-size: 16px;
}
textarea:focus {
  border: none;
  box-shadow: none;
}
.stages-container {
  padding: 0.5rem;
}

.stages-wrapper {
  display: flex;
  gap: 2px;
  align-items: center;
  height: 35px;
}

.stage-btn {
  font-size: 0.8rem;
  padding: 0.5rem 0.8rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  z-index: 1;
  text-align: start;
  clip-path: polygon(
    0 0,
    calc(100% - 15px) 0,
    100% 50%,
    calc(100% - 15px) 100%,
    0 100%
  );
}

.stage-btn:hover {
  width: 350px;
  min-width: 120px;
  z-index: 2;
}

.stage-btn.selected {
  font-weight: bold;
}

.stages-container::-webkit-scrollbar {
  height: 4px;
}

.stages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.stages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.stages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.history {
  height: 220px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.history::-webkit-scrollbar {
  width: 4px;
}

.history::-webkit-scrollbar-track {
  background: transparent;
}

.history::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.history::-webkit-scrollbar-button {
  display: none;
}
.showComments {
  height: 302px;
  max-height: 302px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
}
.showTasks {
  height: 302px;
  max-height: 302px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
}
label {
  font-size: 13px;
  font-weight: 500;
}

.modal-dialog,
.modal-body,
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.modal-dialog::-webkit-scrollbar,
.modal-body::-webkit-scrollbar,
.modal-content::-webkit-scrollbar {
  width: 4px;
}

.modal-dialog::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track,
.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-dialog::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-dialog::-webkit-scrollbar-button,
.modal-body::-webkit-scrollbar-button,
.modal-content::-webkit-scrollbar-button {
  display: none;
}

.showComments,
.showTasks {
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.showComments::-webkit-scrollbar,
.showTasks::-webkit-scrollbar {
  width: 4px;
}

.showComments::-webkit-scrollbar-track,
.showTasks::-webkit-scrollbar-track {
  background: transparent;
}

.showComments::-webkit-scrollbar-thumb,
.showTasks::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.showComments::-webkit-scrollbar-button,
.showTasks::-webkit-scrollbar-button {
  display: none;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #0d6efd;
}

.custom-checkbox:checked {
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.delete-animation {
  background-color: red;
  transition: background-color 0.5s ease;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    background-color: #ff000040;
  }
  to {
    opacity: 0;
    background-color: #ff000040;
  }
}
.trashCustm {
  right: 2%;
  bottom: 3%;
  z-index: 9999;
}
/* .ApprovalCustm {
  right: 5%;
  bottom: 3%;
  z-index: 9999;
} */
.adminComment {
  background: linear-gradient(45deg, #e5c086, #f1d65e, #e5c086, #f1d65e);
  color: #000;
  background-size: 400% 400%;
  animation: adminComment 4s ease infinite;
}
@keyframes adminComment {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.text-gold {
  color: #ffd700;
}

.text-lightgray {
  color: #d3d3d3;
}

.comment-textarea {
  flex-grow: 1;
  padding: 6.5px 10px;
  font-size: 1rem;
  scrollbar-width: thin;
  min-width: 50px;
  width: 100% !important;
  box-sizing: border-box;
  resize: none;
  overflow-y: hidden;
  min-height: 30px;
  overflow-x: hidden;
}

.col position-relative > div > textarea,
.col position-relative > div > span {
  min-width: 50px;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;
}

.col position-relative > div > textarea {
  display: inline-block;
  overflow-x: auto;
}

.col position-relative > div > span {
  display: inline-block;
  overflow-x: hidden;
}

.fixed-action-btn {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  padding: 6px 0 !important;
  white-space: normal;
  text-align: center;
  font-size: 1rem;
}
.comment-textarea::-webkit-scrollbar {
  width: 6px;
}

.comment-textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.comment-textarea::-webkit-scrollbar-thumb {
  background: #888888cb;
  border-radius: 4px;
}

.comment-textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.comment-menu {
  width: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 14px;
}
.comment-menu .dropdown-item {
  cursor: pointer;
  padding: 0px 7px !important;
}
.comment-menu .dropdown-item:hover {
  background: #f1f1f1;
  border-radius: 4px;
}
.bg-input {
  background-color: #eee !important;
}
.bg-input-edit {
  background-color: #d1d1d1e4 !important;
}
.form-check-input {
  cursor: pointer;
  border: 1px solid #333;
}
.form-check-input:checked {
  background-color: var(--bs-dark);
  border-color: var(--bs-dark-subtle);
  accent-color: var(--bs-blue);
}
.fs-7 {
  font-size: 0.9rem !important;
}
</style>
