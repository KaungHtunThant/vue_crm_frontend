<template>
  <div class="patientRegistration mt-4 pe-3 bg-white rounded-3 p-3 pb-0 me-2">
    <h3>Patient Registration</h3>
    <div
      class="d-flex justify-content-between align-items-center mt-2 pt-2 pb-2 px-2"
      :class="{ 'vip-highlight': isVipChecked }"
    >
      <div class="mrNo">
        <label class="me-2">MR No</label>
        <input
          type="text"
          class="bg-blue text-white border-0 rounded-1 p-1 ps-2"
          disabled
          value="003672"
        />
      </div>
      <div class="d-flex align-items-center">
        <div class="form-check me-3">
          <input
            type="checkbox"
            class="form-check-input mt-2"
            id="vipCheckbox"
            v-model="isVipChecked"
          />
          <label class="form-check-label fs-5" for="vipCheckbox">VIP</label>
        </div>
        <button
          type="submit"
          class="btn d-flex align-items-center bg-blue text-white btnReadEid"
        >
          <span class="me-1">READ EID</span>
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            src="data:image/svg+xml,%3csvg%20width='50'%20height='50'%20viewBox='0%200%2050%2050'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M39.5846%2016.6667H37.5013V6.25H12.5013V16.6667H10.418C6.95964%2016.6667%204.16797%2019.4583%204.16797%2022.9167V35.4167H12.5013V43.75H37.5013V35.4167H45.8346V22.9167C45.8346%2019.4583%2043.043%2016.6667%2039.5846%2016.6667ZM16.668%2010.4167H33.3346V16.6667H16.668V10.4167ZM33.3346%2035.4167V39.5833H16.668V31.25H33.3346V35.4167ZM37.5013%2031.25V27.0833H12.5013V31.25H8.33464V22.9167C8.33464%2021.7708%209.27214%2020.8333%2010.418%2020.8333H39.5846C40.7305%2020.8333%2041.668%2021.7708%2041.668%2022.9167V31.25H37.5013Z'%20fill='white'/%3e%3cpath%20d='M37.5013%2026.0417C38.6519%2026.0417%2039.5846%2025.1089%2039.5846%2023.9583C39.5846%2022.8077%2038.6519%2021.875%2037.5013%2021.875C36.3507%2021.875%2035.418%2022.8077%2035.418%2023.9583C35.418%2025.1089%2036.3507%2026.0417%2037.5013%2026.0417Z'%20fill='white'/%3e%3c/svg%3e"
            alt="print"
            class="sc-kvWrVE ksvbme"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              d="M7 3H4v3H2V1h5v2zm15 3V1h-5v2h3v3h2zM7 21H4v-3H2v5h5v-2zm13-3v3h-3v2h5v-5h-2zm-1 0c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v12zM15 8H9v2h6V8zm0 3H9v2h6v-2zm0 3H9v2h6v-2z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <hr class="mt-0" />
    <div class="information w-100">
      <ul class="nav nav-tabs my-4 border-0 w-100" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="OfficialInfo-tab"
            data-bs-toggle="tab"
            data-bs-target="#OfficialInfo-tab-pane"
            type="button"
            role="tab"
            aria-controls="OfficialInfo-tab-pane"
            aria-selected="true"
          >
            OfficialInfo
          </button>
        </li>
        <li class="nav-item border-0" role="presentation">
          <button
            class="nav-link"
            id="ContactInfo-tab"
            data-bs-toggle="tab"
            data-bs-target="#ContactInfo-tab-pane"
            type="button"
            role="tab"
            aria-controls="ContactInfo-tab-pane"
            aria-selected="false"
          >
            ContactInfo
          </button>
        </li>
      </ul>
      <div class="tab-content w-100" id="myTabContent">
        <div
          class="tab-pane fade show active w-100"
          id="OfficialInfo-tab-pane"
          role="tabpanel"
          aria-labelledby="OfficialInfo-tab"
          tabindex="0"
        >
          <form class="w-100">
            <div class="row g-4 w-100">
              <div class="col-lg-6 border-end">
                <div class="mb-4">
                  <h5
                    class="pb-2 text-white pt-1 ps-1 bg-blue"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    Info
                  </h5>
                  <div class="row mb-3 align-items-center ps-2 mt-3">
                    <div class="col-3">
                      <label class="form-label"
                        >Reg Date & Time
                        <span class="text-danger">*</span></label
                      >
                    </div>
                    <div class="col">
                      <input type="date" lang="en" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Nabidh Consent</label>
                    </div>
                    <div class="col">
                      <select class="form-select">
                        <option disabled selected>
                          Select a Nabidh Consent
                        </option>
                        <option value="yes">yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-end g-3 ps-2">
                    <div class="col">
                      <div class="row align-items-center">
                        <div class="col-3">
                          <label class="form-label">Reference</label>
                        </div>
                        <div class="col">
                          <Multiselect
                            v-model="referenceValue"
                            :options="referenceOptions"
                            :searchable="true"
                            placeholder="Search Reference"
                            label="label"
                            valueProp="value"
                            class="multiselect p-0 w-100"
                          >
                            <template #option="{ option }">
                              {{ option.label }}
                            </template>
                          </Multiselect>
                        </div>
                        <div class="col-2 d-flex gap-2 justify-content-end">
                          <label class="form-label d-block">Insurance</label>
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="insuranceSwitch"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Old File No</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Old File No"
                      />
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h5
                    class="pb-2 bg-blue ps-1 pt-1 text-white"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    Personal Info
                  </h5>
                  <div class="row mb-3 align-items-center ps-2 mt-3">
                    <div class="col-3">
                      <label class="form-label"
                        >First Name <span class="text-danger">*</span></label
                      >
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter First Name"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Middle Name</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Middle Name"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Last Name</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Last Name"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Date of Birth *</label>
                    </div>
                    <div class="col">
                      <input type="date" lang="en" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label"
                        >Age <span class="text-danger">*</span></label
                      >
                    </div>
                    <div class="col">
                      <input
                        type="number"
                        lang="en"
                        class="form-control"
                        placeholder="Years"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Gender *</label>
                    </div>
                    <div class="col">
                      <select class="form-select">
                        <option disabled selected>Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Emirates ID</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Emirates ID"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Emirates ID Expiry</label>
                    </div>
                    <div class="col">
                      <input type="date" lang="en" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Passport No</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Passport No"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Passport Expiry</label>
                    </div>
                    <div class="col">
                      <input type="date" lang="en" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Martial Status</label>
                    </div>
                    <div class="col">
                      <select class="form-select">
                        <option disabled selected>Select Martial Status</option>
                        <option>Single</option>
                        <option>Widower</option>
                        <option>Not Specified</option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Preferred Language</label>
                    </div>
                    <div class="col">
                      <Multiselect
                        v-model="languageValue"
                        :options="languageOptions"
                        :searchable="true"
                        placeholder="Search Language"
                        label="label"
                        valueProp="value"
                        class="multiselect p-0"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Religion</label>
                    </div>
                    <div class="col">
                      <Multiselect
                        v-model="religionValue"
                        :options="religionOptions"
                        :searchable="true"
                        placeholder="Search Religion"
                        label="label"
                        valueProp="value"
                        class="multiselect p-0"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">E-Mail</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Email"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Occupation</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Occupation"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Next of Kin</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Next of Kin"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Previous Dr</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Previous Doctor"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Previous Clinic</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Previous Clinic"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="mb-4">
                  <h5
                    class="pb-2 bg-blue pt-1 ps-1 text-white"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    Contact Info
                  </h5>
                  <div class="row g-3 mt-2 p-0">
                    <div class="col-8">
                      <div class="row mb-3 align-items-center ps-2">
                        <div class="col-3">
                          <label class="form-label">Mobile No *</label>
                        </div>
                        <div class="col">
                          <input
                            type="text"
                            class="form-control"
                            ref="mobilePhoneInput"
                            placeholder="Mobile Number"
                          />
                        </div>
                      </div>
                      <div class="row mb-3 align-items-center ps-2">
                        <div class="col-3">
                          <label class="form-label">WhatsApp No</label>
                        </div>
                        <div class="col">
                          <input
                            type="text"
                            class="form-control"
                            ref="whatsappPhoneInput"
                            placeholder="WhatsApp No"
                          />
                        </div>
                      </div>
                      <div class="row mb-3 align-items-center ps-2">
                        <div class="col-3">
                          <label class="form-label">Home Tel</label>
                        </div>
                        <div class="col">
                          <input
                            type="text"
                            class="form-control"
                            ref="homePhoneInput"
                            placeholder="Home Tel"
                          />
                        </div>
                      </div>
                      <div class="row mb-3 align-items-center ps-2">
                        <div class="col-3">
                          <label class="form-label">International No</label>
                        </div>
                        <div class="col">
                          <input
                            type="text"
                            class="form-control"
                            ref="internationalPhoneInput"
                            placeholder="Int. No"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div
                        class="image-upload-container"
                        @click="triggerFileInput"
                      >
                        <img
                          :src="imagedefailt"
                          class="img-fluid rounded-circle border"
                          alt="Profile Image"
                        />
                        <div
                          class="image-overlay d-flex justify-content-center align-items-center"
                        >
                          <span class="text-white"
                            ><i class="fa-solid fa-image"></i> Change
                            Image</span
                          >
                        </div>
                      </div>
                      <input
                        type="file"
                        ref="fileInput"
                        accept="image/*"
                        class="d-none"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-3 mt-2">
                    <div class="col-3">
                      <label class="form-label">Work Phone No</label>
                    </div>
                    <div class="col-9">
                      <input
                        type="text"
                        class="form-control tttt"
                        ref="workPhoneInput"
                        placeholder="Work Phone No"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-3">
                    <div class="col-3">
                      <label class="form-label"
                        >Address Line1 <span class="text-danger">*</span></label
                      >
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Address Line 1"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-3">
                    <div class="col-3">
                      <label class="form-label">Address Line2</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Address Line 2"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-3">
                    <div class="col-3">
                      <label class="form-label">State</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter State"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-3">
                    <div class="col-3">
                      <label class="form-label">Country</label>
                    </div>
                    <div class="col">
                      <Multiselect
                        v-model="countryValue"
                        :options="countryOptions"
                        :searchable="true"
                        placeholder="Search Country"
                        label="label"
                        valueProp="value"
                        class="multiselect p-0"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-3">
                    <div class="col-3">
                      <label class="form-label">City/Emirates</label>
                    </div>
                    <div class="col">
                      <Multiselect
                        v-model="cityValue"
                        :options="cityOptions"
                        :searchable="true"
                        placeholder="Search City"
                        label="label"
                        valueProp="value"
                        class="multiselect p-0"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-3">
                    <div class="col-3">
                      <label class="form-label">Nationality</label>
                    </div>
                    <div class="col">
                      <Multiselect
                        v-model="nationalityValue"
                        :options="nationalityOptions"
                        :searchable="true"
                        placeholder="Search Reference"
                        label="label"
                        valueProp="value"
                        class="multiselect p-0"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-3">
                    <div class="col-3">
                      <label class="form-label">P.O Box No</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter P.O Box No"
                      />
                    </div>
                  </div>
                  <h5
                    class="pb-2 bg-blue pt-1 ps-1 text-white"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    Company Info
                  </h5>
                  <div class="row mb-3 align-items-center mt-3">
                    <div class="col-3">
                      <label class="form-label">Company </label>
                    </div>
                    <div class="col">
                      <select class="form-select">
                        <option disabled selected>Select Company</option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center">
                    <div class="col-3">
                      <label class="form-label">Job Title </label>
                    </div>
                    <div class="col">
                      <Multiselect
                        v-model="jobTitleValue"
                        :options="jobTitleOptions"
                        :searchable="true"
                        placeholder="Search Reference"
                        label="label"
                        valueProp="value"
                        class="multiselect p-0"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center">
                    <div class="col-3">
                      <label class="form-label">Company ID</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Company ID"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div
          class="tab-pane fade w-100"
          id="ContactInfo-tab-pane"
          role="tabpanel"
          aria-labelledby="ContactInfo-tab"
          tabindex="0"
        >
          <form class="w-100">
            <div class="row g-4 w-100">
              <div class="col-lg-6">
                <div class="mb-4">
                  <h5
                    class="pb-2 bg-blue ps-1 pt-1 text-white"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    Primary Emergency Contact Info
                  </h5>
                  <div class="row mb-3 align-items-center ps-2 mt-3">
                    <div class="col-3">
                      <label class="form-label">Name</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Name"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Relationship </label>
                    </div>
                    <div class="col">
                      <Multiselect
                        v-model="relationshipValue"
                        :options="relationshipOptions"
                        :searchable="true"
                        placeholder="Search Reference"
                        label="label"
                        valueProp="value"
                        class="multiselect p-0"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Contact No</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        ref="primaryEmergencyPhoneInput"
                        placeholder="Contact No"
                      />
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h5
                    class="border-bottom pb-2 bg-blue ps-1 pt-1 text-white"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    Secondary Emergency Contact Info
                  </h5>
                  <div class="row mb-3 align-items-center ps-2 mt-3">
                    <div class="col-3">
                      <label class="form-label">Name</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Name"
                      />
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Relationship </label>
                    </div>
                    <div class="col">
                      <Multiselect
                        v-model="relationshipValue"
                        :options="relationshipOptions"
                        :searchable="true"
                        placeholder="Search Reference"
                        label="label"
                        valueProp="value"
                        class="multiselect p-0"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                  <div class="row mb-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Contact No</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        ref="secondaryEmergencyPhoneInput"
                        placeholder="Contact No"
                      />
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h5
                    class="pb-2 ps-1 bg-blue text-white pt-1"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    How Did You Know About Us?
                  </h5>
                  <div class="row mb-3 align-items-center">
                    <div class="col">
                      <select class="form-select">
                        <option disabled selected>Select</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="mb-4">
                  <h5
                    class="border-bottom pb-2 bg-blue text-white ps-1 pt-1"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    If Completing For Child
                  </h5>
                  <div class="row g-3 mt-2">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Child vaccination</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Child Vaccination"
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">School</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter School"
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Primary carer</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Primary Carer"
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Primary contact</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Primary Contact"
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Father's name</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Father's Name"
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Mother's name</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Mother's Name"
                      />
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h5
                    class="pb-2 bg-blue ps-1 pt-1 text-white"
                    :class="{ 'vip-highlight': isVipChecked }"
                  >
                    Do You Suffer From Any Below Condition
                  </h5>
                  <div class="row g-3 mt-2">
                    <div class="col-12">
                      <div class="row">
                        <div class="col-4">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="cardiac"
                            />
                            <label class="form-check-label" for="cardiac"
                              >cardiac disease</label
                            >
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="surgery"
                            />
                            <label class="form-check-label" for="surgery"
                              >any surgeries</label
                            >
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="cancer"
                            />
                            <label class="form-check-label" for="cancer"
                              >Cancer</label
                            >
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="ulcer"
                            />
                            <label class="form-check-label" for="ulcer"
                              >Ulcerative colitis</label
                            >
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="diverticulitis"
                            />
                            <label class="form-check-label" for="diverticulitis"
                              >Diverticulitis</label
                            >
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="crohn"
                            />
                            <label class="form-check-label" for="crohn"
                              >Crohn's disease</label
                            >
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="diabetes"
                            />
                            <label class="form-check-label" for="diabetes"
                              >Diabetes</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Blood Group</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Blood Group"
                      />
                    </div>
                  </div>
                  <div class="row mt-3 align-items-center ps-2">
                    <div class="col-3">
                      <label class="form-label">Any Allergies</label>
                    </div>
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Any Allergies"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import intlTelInput from "intl-tel-input";
import imagedefailt from "../assets/whatsappImage/default-userImage.jpg";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import "intl-tel-input/build/css/intlTelInput.css";

export default {
  name: "PatientRegistrationView",
  components: {
    Multiselect,
  },
  setup() {
    const mobilePhoneInput = ref(null);
    const whatsappPhoneInput = ref(null);
    const homePhoneInput = ref(null);
    const internationalPhoneInput = ref(null);
    const workPhoneInput = ref(null);
    const primaryEmergencyPhoneInput = ref(null);
    const secondaryEmergencyPhoneInput = ref(null);

    const itiInstances = [];

    const fileInput = ref(null);

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const isVipChecked = ref(false);

    const referenceValue = ref(null);
    const referenceOptions = ref([
      { value: "reference1", label: "reference 1" },
      { value: "reference2", label: "reference 2" },
      { value: "reference3", label: "reference 3" },
    ]);
    const religionValue = ref(null);
    const religionOptions = ref([
      { value: "religion1", label: "Religion 1" },
      { value: "religion2", label: "Religion 2" },
      { value: "religion3", label: "Religion 3" },
    ]);
    const languageValue = ref(null);
    const languageOptions = ref([
      { value: "AR", label: "Arabic" },
      { value: "EN", label: "English" },
    ]);
    const countryValue = ref(null);
    const countryOptions = ref([
      { value: "country1", label: "Country 1" },
      { value: "country2", label: "Country 2" },
    ]);
    const cityValue = ref(null);
    const cityOptions = ref([
      { value: "city1", label: "City 1" },
      { value: "city2", label: "City 2" },
    ]);
    const nationalityValue = ref(null);
    const nationalityOptions = ref([
      { value: "nationality1", label: "Nationality 1" },
      { value: "nationality2", label: "Nationality 2" },
    ]);
    const jobTitleValue = ref(null);
    const jobTitleOptions = ref([
      { value: "jobTitle1", label: "Job Title 1" },
      { value: "jobTitle2", label: "Job Title 2" },
    ]);
    const relationshipValue = ref(null);
    const relationshipOptions = ref([
      { value: "relationship1", label: "Relationship1" },
      { value: "relationship2", label: "Relationship 2" },
    ]);

    onMounted(() => {
      if (mobilePhoneInput.value) {
        const iti = intlTelInput(mobilePhoneInput.value, {
          separateDialCode: true,
          excludeCountries: ["in", "il"],
          preferredCountries: ["ae", "sa", "qa", "kw", "bh", "om"],
        });
        itiInstances.push(iti);
        nextTick(() => {
          if (mobilePhoneInput.value && mobilePhoneInput.value.parentElement) {
            mobilePhoneInput.value.parentElement.classList.add("w-100");
          }
        });
      }
      if (whatsappPhoneInput.value) {
        const iti = intlTelInput(whatsappPhoneInput.value, {
          separateDialCode: true,
          excludeCountries: ["in", "il"],
          preferredCountries: ["ae", "sa", "qa", "kw", "bh", "om"],
        });

        itiInstances.push(iti);
        nextTick(() => {
          if (
            whatsappPhoneInput.value &&
            whatsappPhoneInput.value.parentElement
          ) {
            whatsappPhoneInput.value.parentElement.classList.add("w-100");
          }
        });
      }
      if (homePhoneInput.value) {
        const iti = intlTelInput(homePhoneInput.value, {
          separateDialCode: true,
          excludeCountries: ["in", "il"],
          preferredCountries: ["ae", "sa", "qa", "kw", "bh", "om"],
        });
        itiInstances.push(iti);
        nextTick(() => {
          if (homePhoneInput.value && homePhoneInput.value.parentElement) {
            homePhoneInput.value.parentElement.classList.add("w-100");
          }
        });
      }
      if (internationalPhoneInput.value) {
        const iti = intlTelInput(internationalPhoneInput.value, {
          separateDialCode: true,
          excludeCountries: ["in", "il"],
          preferredCountries: ["ae", "sa", "qa", "kw", "bh", "om"],
        });
        itiInstances.push(iti);
        nextTick(() => {
          if (
            internationalPhoneInput.value &&
            internationalPhoneInput.value.parentElement
          ) {
            internationalPhoneInput.value.parentElement.classList.add("w-100");
          }
        });
      }
      if (workPhoneInput.value) {
        const iti = intlTelInput(workPhoneInput.value, {
          separateDialCode: true,
          excludeCountries: ["in", "il"],
          preferredCountries: ["ae", "sa", "qa", "kw", "bh", "om"],
        });
        itiInstances.push(iti);
        nextTick(() => {
          if (workPhoneInput.value && workPhoneInput.value.parentElement) {
            workPhoneInput.value.parentElement.classList.add("w-100");
          }
        });
      }
      if (primaryEmergencyPhoneInput.value) {
        const iti = intlTelInput(primaryEmergencyPhoneInput.value, {
          separateDialCode: true,
          excludeCountries: ["in", "il"],
          preferredCountries: ["ae", "sa", "qa", "kw", "bh", "om"],
        });
        itiInstances.push(iti);
        nextTick(() => {
          if (
            primaryEmergencyPhoneInput.value &&
            primaryEmergencyPhoneInput.value.parentElement
          ) {
            primaryEmergencyPhoneInput.value.parentElement.classList.add(
              "w-100"
            );
          }
        });
      }
      if (secondaryEmergencyPhoneInput.value) {
        const iti = intlTelInput(secondaryEmergencyPhoneInput.value, {
          separateDialCode: true,
          excludeCountries: ["in", "il"],
          preferredCountries: ["ae", "sa", "qa", "kw", "bh", "om"],
        });
        itiInstances.push(iti);
        nextTick(() => {
          if (
            secondaryEmergencyPhoneInput.value &&
            secondaryEmergencyPhoneInput.value.parentElement
          ) {
            secondaryEmergencyPhoneInput.value.parentElement.classList.add(
              "w-100"
            );
          }
        });
      }
    });

    onBeforeUnmount(() => {
      itiInstances.forEach((iti) => {
        iti.destroy();
      });
    });

    return {
      mobilePhoneInput,
      whatsappPhoneInput,
      homePhoneInput,
      internationalPhoneInput,
      workPhoneInput,
      primaryEmergencyPhoneInput,
      secondaryEmergencyPhoneInput,
      imagedefailt,
      fileInput,
      triggerFileInput,
      isVipChecked,
      referenceValue,
      referenceOptions,
      religionValue,
      religionOptions,
      languageValue,
      languageOptions,
      countryValue,
      countryOptions,
      cityValue,
      cityOptions,
      nationalityValue,
      nationalityOptions,
      jobTitleValue,
      jobTitleOptions,
      relationshipValue,
      relationshipOptions,
    };
  },
};
</script>
<style scoped>
.patientRegistration {
  width: 99.7%;
}
.information {
  max-height: 75vh;
  overflow-y: auto;
}

.bg-blue {
  background-color: rgb(14, 116, 144);
}

.btnReadEid:hover {
  background-color: transparent !important;
  border: 1px solid #0e7490;
  color: #0e7490 !important;
}

.nav-link {
  margin-right: 10px;
  background-color: transparent !important;
  border: 1px solid #0e7490 !important;
  color: #0e7490 !important;
  border-radius: 5px;
}

.nav-link.active {
  border: none !important;
  background-color: #0e7490 !important;
  margin-right: 10px;
  color: #ffffff !important;
}

.image-upload-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 50%;
}

.image-upload-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay span {
  font-size: 1rem;
}

.form-check-input:checked {
  background-color: #0e7490 !important;
  border-color: #0e7490 !important;
}

.vip-highlight {
  background-color: gold !important;
}
.multiselect:deep(.multiselect__placeholder) {
  color: #181717 !important;
  font-size: 16px;
}
input::placeholder,
select::placeholder {
  color: #181717 !important;
}
</style>
