<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <!-- Status Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-status") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3 d-flex justify-content-center flex-nowrap gap-2">
              <button
                v-for="status in statuses"
                :key="status.value"
                type="button"
                class="p-2"
                @click.prevent="toggleStatus(status.value)"
                :class="[
                  'btn',
                  selectedStatuses.includes(status.value)
                    ? 'btn-dark'
                    : 'btn-outline-dark',
                ]"
                style="font-size: 14px"
              >
                {{ status.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Source Filter -->
        <div
          class="row"
          v-if="permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)"
        >
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-source") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.source_id"
                class="form-select text-secondary"
              >
                <option value="" selected>
                  {{ t("crmlist-modal-filter-all") }}
                </option>
                <option
                  v-for="source in local_sources"
                  :key="source.value"
                  :value="source.value"
                >
                  {{ source.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- Stage Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-stage") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.stage_id"
                class="form-select text-secondary"
              >
                <option value="" selected>
                  {{ t("crmlist-modal-filter-all") }}
                </option>
                <option
                  v-for="stage in local_stages"
                  :key="stage.id"
                  :value="stage.id"
                >
                  {{ stage.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- User Filter -->
        <div
          class="row"
          v-if="
            permissionStore.hasPermission(PERMISSIONS.FILTER_DEAL_WITH_USER)
          "
        >
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-user") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.user_id"
                class="form-select text-secondary"
              >
                <option value="" selected>
                  {{ t("crmlist-modal-filter-all") }}
                </option>
                <option
                  v-for="user in local_users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div
          class="row"
          v-if="
            permissionStore.hasPermission(PERMISSIONS.FILTER_DEAL_WITH_USER)
          "
        >
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-excludeduser") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.excluded_user_id"
                class="form-select text-secondary"
              >
                <option value="" selected>
                  {{ t("crmlist-modal-filter-all") }}
                </option>
                <option
                  v-for="user in local_users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Package Filter -->
        <!-- <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-packages") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.package"
                class="form-select text-secondary"
              >
                <option
                  v-for="pkg in packages"
                  :key="pkg.value"
                  :value="pkg.value"
                >
                  {{ pkg.label }}
                </option>
              </select>
            </div>
          </div>
        </div> -->
        <div class="row">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-country") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.country"
                class="form-select text-secondary"
              >
                <option value="" selected>
                  {{ t("crmlist-modal-filter-label-all") }}
                </option>
                <option
                  v-for="country in nationalities"
                  :key="country"
                  :value="country"
                >
                  {{ country }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- Created Date Range -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-created-at") }}</span>
          </div>
          <div
            class="col-9 d-flex justify-content-center align-items-center gap-3"
          >
            <input
              type="date"
              lang="en"
              class="form-control text-secondary"
              v-model="localFilters.created_at_start"
            />
            <input
              type="date"
              lang="en"
              class="form-control text-secondary"
              v-model="localFilters.created_at_end"
            />
          </div>
        </div>

        <!-- Modified Date Range -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-updated-at") }}</span>
          </div>
          <div
            class="col-9 d-flex justify-content-center align-items-center gap-3"
          >
            <input
              type="date"
              lang="en"
              class="form-control text-secondary"
              v-model="localFilters.updated_at_start"
            />
            <input
              type="date"
              lang="en"
              class="form-control text-secondary"
              v-model="localFilters.updated_at_end"
            />
          </div>
        </div>

        <!-- Sorting Section -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-sort-by") }}</span>
          </div>
          <div class="col-9">
            <div class="d-flex gap-3">
              <select
                v-model="localFilters.sort_by"
                class="form-select text-secondary"
              >
                <option value="" selected>
                  {{ t("crmlist-modal-filter-none") }}
                </option>
                <option value="created_at">
                  {{ t("crmlist-modal-filter-sort-created-at") }}
                </option>
                <option value="updated_at">
                  {{ t("crmlist-modal-filter-sort-updated-at") }}
                </option>
                <option value="source_id">
                  {{ t("crmlist-modal-filter-sort-source") }}
                </option>
                <option value="stage_id">
                  {{ t("crmlist-modal-filter-sort-stage") }}
                </option>
              </select>
              <select
                v-model="localFilters.sort_order"
                class="form-select text-secondary"
              >
                <option value="" selected>
                  {{ t("crmlist-modal-filter-none") }}
                </option>
                <option value="desc">
                  {{ t("crmlist-modal-filter-sort-desc") }}
                </option>
                <option value="asc">
                  {{ t("crmlist-modal-filter-sort-asc") }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";

export default {
  name: "CrmListViewFilterModalFormItems",
  props: {
    filters: { type: Object, required: true },
    selectedStatuses: {
      type: Array,
      required: true,
    },
    stages: {
      type: Array,
      required: true,
      default: () => [],
    },
    sources: {
      type: Array,
      required: true,
      default: () => [],
    },
    users: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["update:filters", "update:selectedStatuses"],
  setup(props, { emit }) {
    const { t, locale } = useI18n();
    const localFilters = ref({
      source_id: null,
      stage_id: null,
      user_id: null,
      excluded_user_id: null,
      country: null,
      created_at_start: null,
      created_at_end: null,
      updated_at_start: null,
      updated_at_end: null,
      status: [],
      sort_by: "created_at",
      sort_order: "desc",
      ...props.filters,
    });
    const local_stages = ref(props.stages);
    const local_sources = ref(props.sources);
    const local_users = ref([]);
    const local_packages = ref([]);
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

    const statuses = ref([
      {
        value: "no_comments",
        label: t("kanban-modal-filter-status-nocomments"),
      },
      { value: "no_task", label: t("kanban-modal-filter-status-notasks") },
      { value: "overdue", label: t("kanban-modal-filter-status-overdue") },
      { value: "new", label: t("kanban-modal-filter-status-new") },
      {
        value: "admin_comments",
        label: t("kanban-modal-filter-status-admincomment"),
      },
    ]);

    const updateLocalFilters = (newFilters) => {
      if (newFilters) {
        Object.keys(localFilters.value).forEach((key) => {
          localFilters.value[key] = newFilters[key] ?? null;
        });
      }
    };

    const permissionStore = usePermissionStore();

    updateLocalFilters(props.filters);

    watch(
      () => props.filters,
      (newFilters) => {
        updateLocalFilters(newFilters);
      },
      { deep: true }
    );

    watch(
      () => props.selectedStatuses,
      (newStatuses) => {
        if (Array.isArray(newStatuses)) {
          localFilters.value.status = [...newStatuses];
        }
      }
    );

    const toggleStatus = (status) => {
      let newSelectedStatuses;
      if (props.selectedStatuses.includes(status)) {
        newSelectedStatuses = props.selectedStatuses.filter(
          (s) => s !== status
        );
      } else {
        newSelectedStatuses = [...props.selectedStatuses, status];
      }
      emit("update:selectedStatuses", newSelectedStatuses);
      localFilters.value.status = newSelectedStatuses;
      emit("update:filters", localFilters.value);
    };

    watch(
      () => localFilters.value,
      (newFilters) => {
        console.log("filter reset", newFilters);
        emit("update:filters", newFilters);
      },
      { deep: true }
    );

    watch(
      () => props.stages,
      (newStages) => {
        local_stages.value = newStages;
      },
      { deep: true }
    );

    watch(
      () => props.sources,
      (newSources) => {
        local_sources.value = newSources;
      },
      { deep: true }
    );

    watch(
      () => props.users,
      (newUsers) => {
        local_users.value = newUsers;
      },
      { deep: true }
    );

    watch(
      () => props.packages,
      (newPackages) => {
        local_packages.value = newPackages;
      },
      { deep: true }
    );

    onMounted(() => {
      if (permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)) {
        statuses.value.push({
          value: "unassigned",
          label: t("kanban-modal-filter-status-unassigned"),
        });
      }
    });

    return {
      nationalities,
      localFilters,
      statuses,
      toggleStatus,
      t,
      local_users,
      local_packages,
      local_stages,
      local_sources,
      permissionStore,
      PERMISSIONS,
    };
  },
};
</script>

<style scoped>
span {
  font-size: 14px;
}
</style>
