// Comprehensive tax ID type list mirroring Stripe's API + UI taxonomy.
// Each entry pairs a country with its supported tax ID format(s).
// `value` matches Stripe's tax_id_type code (es_cif, eu_vat, gb_vat, etc.).
// `country` is the ISO-2 code used to fetch the flag image from flagcdn.com.
//
// EU VAT is intentionally split into 27 per-country entries so the picker
// behaves like Stripe's: a Spanish admin sees "ES VAT — Spain", a French
// admin sees "FR VAT — France", but all save the same `value: 'eu_vat'` (the
// backend resolver only cares about the type, not which specific EU country).
//
// The four lock-in-relevant types (es_cif, es_nif, eu_vat, no_vat) drive the
// VAT logic; everything else is recorded as the user's chosen type for
// accounting/Stripe-passthrough but treats reverse-charge as N/A.

const EU_COUNTRIES = [
  ['AT', 'Austria'],     ['BE', 'Belgium'],     ['BG', 'Bulgaria'],
  ['CY', 'Cyprus'],      ['CZ', 'Czechia'],     ['DE', 'Germany'],
  ['DK', 'Denmark'],     ['EE', 'Estonia'],     ['EL', 'Greece'],
  ['ES', 'Spain'],       ['FI', 'Finland'],     ['FR', 'France'],
  ['HR', 'Croatia'],     ['HU', 'Hungary'],     ['IE', 'Ireland'],
  ['IT', 'Italy'],       ['LT', 'Lithuania'],   ['LU', 'Luxembourg'],
  ['LV', 'Latvia'],      ['MT', 'Malta'],       ['NL', 'Netherlands'],
  ['PL', 'Poland'],      ['PT', 'Portugal'],    ['RO', 'Romania'],
  ['SE', 'Sweden'],      ['SI', 'Slovenia'],    ['SK', 'Slovakia'],
];

const EU_VAT_ENTRIES = EU_COUNTRIES.map(([code, name]) => ({
  value: 'eu_vat',
  country: code === 'EL' ? 'GR' : code,  // flagcdn uses GR for Greece, not EL
  countryStripe: code,                    // Stripe / VIES uses EL for Greece
  label: `${code} VAT (intracomunitario)`,
  name,
}));

export const TAX_ID_TYPES = [
  { value: 'ad_nrt',     country: 'AD', label: 'AD NRT',                          name: 'Andorra' },
  { value: 'ae_trn',     country: 'AE', label: 'AE TRN',                          name: 'United Arab Emirates' },
  { value: 'al_tin',     country: 'AL', label: 'AL TIN',                          name: 'Albania' },
  { value: 'am_tin',     country: 'AM', label: 'AM TIN',                          name: 'Armenia' },
  { value: 'ao_tin',     country: 'AO', label: 'AO TIN',                          name: 'Angola' },
  { value: 'ar_cuit',    country: 'AR', label: 'AR CUIT',                         name: 'Argentina' },
  { value: 'au_abn',     country: 'AU', label: 'AU ABN',                          name: 'Australia' },
  { value: 'au_arn',     country: 'AU', label: 'AU ARN',                          name: 'Australia' },
  { value: 'ba_tin',     country: 'BA', label: 'BA TIN',                          name: 'Bosnia and Herzegovina' },
  { value: 'bb_tin',     country: 'BB', label: 'BB TIN',                          name: 'Barbados' },
  { value: 'bd_bin',     country: 'BD', label: 'BD BIN',                          name: 'Bangladesh' },
  { value: 'bf_ifu',     country: 'BF', label: 'BF IFU',                          name: 'Burkina Faso' },
  { value: 'bg_uic',     country: 'BG', label: 'BG UIC',                          name: 'Bulgaria' },
  { value: 'bh_vat',     country: 'BH', label: 'BH VAT',                          name: 'Bahrain' },
  { value: 'bj_ifu',     country: 'BJ', label: 'BJ IFU',                          name: 'Benin' },
  { value: 'bo_tin',     country: 'BO', label: 'BO TIN',                          name: 'Bolivia' },
  { value: 'br_cnpj',    country: 'BR', label: 'BR CNPJ',                         name: 'Brazil' },
  { value: 'br_cpf',     country: 'BR', label: 'BR CPF',                          name: 'Brazil' },
  { value: 'bs_tin',     country: 'BS', label: 'BS TIN',                          name: 'Bahamas' },
  { value: 'by_tin',     country: 'BY', label: 'BY TIN',                          name: 'Belarus' },
  { value: 'ca_bn',      country: 'CA', label: 'CA BN',                           name: 'Canada' },
  { value: 'ca_gst_hst', country: 'CA', label: 'CA GST/HST',                      name: 'Canada' },
  { value: 'ca_qst',     country: 'CA', label: 'CA QST',                          name: 'Canada' },
  { value: 'cd_nif',     country: 'CD', label: 'CD NIF',                          name: 'DR Congo' },
  { value: 'ch_uid',     country: 'CH', label: 'CH UID',                          name: 'Switzerland' },
  { value: 'ch_vat',     country: 'CH', label: 'CH VAT',                          name: 'Switzerland' },
  { value: 'cl_tin',     country: 'CL', label: 'CL TIN',                          name: 'Chile' },
  { value: 'cm_niu',     country: 'CM', label: 'CM NIU',                          name: 'Cameroon' },
  { value: 'cn_tin',     country: 'CN', label: 'CN TIN',                          name: 'China' },
  { value: 'co_nit',     country: 'CO', label: 'CO NIT',                          name: 'Colombia' },
  { value: 'cr_tin',     country: 'CR', label: 'CR TIN',                          name: 'Costa Rica' },
  { value: 'cv_nif',     country: 'CV', label: 'CV NIF',                          name: 'Cape Verde' },
  { value: 'de_stn',     country: 'DE', label: 'DE STN',                          name: 'Germany' },
  { value: 'do_rcn',     country: 'DO', label: 'DO RCN',                          name: 'Dominican Republic' },
  { value: 'ec_ruc',     country: 'EC', label: 'EC RUC',                          name: 'Ecuador' },
  { value: 'eg_tin',     country: 'EG', label: 'EG TIN',                          name: 'Egypt' },
  { value: 'es_cif',     country: 'ES', label: 'ES CIF (empresa)',                name: 'Spain' },
  { value: 'es_nif',     country: 'ES', label: 'ES NIF (autónomo / persona)',    name: 'Spain' },
  { value: 'et_tin',     country: 'ET', label: 'ET TIN',                          name: 'Ethiopia' },
  { value: 'eu_oss_vat', country: 'EU', label: 'EU OSS VAT',                      name: 'European Union (OSS)' },
  ...EU_VAT_ENTRIES,
  { value: 'gb_vat',     country: 'GB', label: 'GB VAT',                          name: 'United Kingdom' },
  { value: 'ge_vat',     country: 'GE', label: 'GE VAT',                          name: 'Georgia' },
  { value: 'gn_nif',     country: 'GN', label: 'GN NIF',                          name: 'Guinea' },
  { value: 'hk_br',      country: 'HK', label: 'HK BR',                           name: 'Hong Kong' },
  { value: 'hr_oib',     country: 'HR', label: 'HR OIB',                          name: 'Croatia' },
  { value: 'hu_tin',     country: 'HU', label: 'HU TIN',                          name: 'Hungary' },
  { value: 'id_npwp',    country: 'ID', label: 'ID NPWP',                         name: 'Indonesia' },
  { value: 'il_vat',     country: 'IL', label: 'IL VAT',                          name: 'Israel' },
  { value: 'in_gst',     country: 'IN', label: 'IN GST',                          name: 'India' },
  { value: 'is_vat',     country: 'IS', label: 'IS VAT',                          name: 'Iceland' },
  { value: 'jp_cn',      country: 'JP', label: 'JP CN',                           name: 'Japan' },
  { value: 'jp_rn',      country: 'JP', label: 'JP RN',                           name: 'Japan' },
  { value: 'jp_trn',     country: 'JP', label: 'JP TRN',                          name: 'Japan' },
  { value: 'ke_pin',     country: 'KE', label: 'KE PIN',                          name: 'Kenya' },
  { value: 'kg_tin',     country: 'KG', label: 'KG TIN',                          name: 'Kyrgyzstan' },
  { value: 'kh_tin',     country: 'KH', label: 'KH TIN',                          name: 'Cambodia' },
  { value: 'kr_brn',     country: 'KR', label: 'KR BRN',                          name: 'South Korea' },
  { value: 'kz_bin',     country: 'KZ', label: 'KZ BIN',                          name: 'Kazakhstan' },
  { value: 'la_tin',     country: 'LA', label: 'LA TIN',                          name: 'Laos' },
  { value: 'li_uid',     country: 'LI', label: 'LI UID',                          name: 'Liechtenstein' },
  { value: 'li_vat',     country: 'LI', label: 'LI VAT',                          name: 'Liechtenstein' },
  { value: 'ma_vat',     country: 'MA', label: 'MA VAT',                          name: 'Morocco' },
  { value: 'md_vat',     country: 'MD', label: 'MD VAT',                          name: 'Moldova' },
  { value: 'me_pib',     country: 'ME', label: 'ME PIB',                          name: 'Montenegro' },
  { value: 'mk_vat',     country: 'MK', label: 'MK VAT',                          name: 'North Macedonia' },
  { value: 'mr_nif',     country: 'MR', label: 'MR NIF',                          name: 'Mauritania' },
  { value: 'mx_rfc',     country: 'MX', label: 'MX RFC',                          name: 'Mexico' },
  { value: 'my_frp',     country: 'MY', label: 'MY FRP',                          name: 'Malaysia' },
  { value: 'my_itn',     country: 'MY', label: 'MY ITN',                          name: 'Malaysia' },
  { value: 'my_sst',     country: 'MY', label: 'MY SST',                          name: 'Malaysia' },
  { value: 'ng_tin',     country: 'NG', label: 'NG TIN',                          name: 'Nigeria' },
  { value: 'no_vat',     country: 'NO', label: 'NO VAT',                          name: 'Norway' },
  { value: 'no_voec',    country: 'NO', label: 'NO VOEC',                         name: 'Norway' },
  { value: 'np_pan',     country: 'NP', label: 'NP PAN',                          name: 'Nepal' },
  { value: 'nz_gst',     country: 'NZ', label: 'NZ GST',                          name: 'New Zealand' },
  { value: 'om_vat',     country: 'OM', label: 'OM VAT',                          name: 'Oman' },
  { value: 'pe_ruc',     country: 'PE', label: 'PE RUC',                          name: 'Peru' },
  { value: 'ph_tin',     country: 'PH', label: 'PH TIN',                          name: 'Philippines' },
  { value: 'ro_tin',     country: 'RO', label: 'RO TIN',                          name: 'Romania' },
  { value: 'rs_pib',     country: 'RS', label: 'RS PIB',                          name: 'Serbia' },
  { value: 'ru_inn',     country: 'RU', label: 'RU INN',                          name: 'Russia' },
  { value: 'ru_kpp',     country: 'RU', label: 'RU KPP',                          name: 'Russia' },
  { value: 'sa_vat',     country: 'SA', label: 'SA VAT',                          name: 'Saudi Arabia' },
  { value: 'sg_gst',     country: 'SG', label: 'SG GST',                          name: 'Singapore' },
  { value: 'sg_uen',     country: 'SG', label: 'SG UEN',                          name: 'Singapore' },
  { value: 'si_tin',     country: 'SI', label: 'SI TIN',                          name: 'Slovenia' },
  { value: 'sn_ninea',   country: 'SN', label: 'SN NINEA',                        name: 'Senegal' },
  { value: 'sr_fin',     country: 'SR', label: 'SR FIN',                          name: 'Suriname' },
  { value: 'sv_nit',     country: 'SV', label: 'SV NIT',                          name: 'El Salvador' },
  { value: 'th_vat',     country: 'TH', label: 'TH VAT',                          name: 'Thailand' },
  { value: 'tj_tin',     country: 'TJ', label: 'TJ TIN',                          name: 'Tajikistan' },
  { value: 'tr_tin',     country: 'TR', label: 'TR TIN',                          name: 'Turkey' },
  { value: 'tw_vat',     country: 'TW', label: 'TW VAT',                          name: 'Taiwan' },
  { value: 'tz_vat',     country: 'TZ', label: 'TZ VAT',                          name: 'Tanzania' },
  { value: 'ua_vat',     country: 'UA', label: 'UA VAT',                          name: 'Ukraine' },
  { value: 'ug_tin',     country: 'UG', label: 'UG TIN',                          name: 'Uganda' },
  { value: 'us_ein',     country: 'US', label: 'US EIN',                          name: 'United States' },
  { value: 'uy_ruc',     country: 'UY', label: 'UY RUC',                          name: 'Uruguay' },
  { value: 'uz_tin',     country: 'UZ', label: 'UZ TIN',                          name: 'Uzbekistan' },
  { value: 'uz_vat',     country: 'UZ', label: 'UZ VAT',                          name: 'Uzbekistan' },
  { value: 've_rif',     country: 'VE', label: 'VE RIF',                          name: 'Venezuela' },
  { value: 'vn_tin',     country: 'VN', label: 'VN TIN',                          name: 'Vietnam' },
  { value: 'za_vat',     country: 'ZA', label: 'ZA VAT',                          name: 'South Africa' },
  { value: 'zm_tin',     country: 'ZM', label: 'ZM TIN',                          name: 'Zambia' },
  { value: 'zw_tin',     country: 'ZW', label: 'ZW TIN',                          name: 'Zimbabwe' },
];

/** Returns the FIRST entry matching the value (e.g. for 'eu_vat' returns the first EU VAT entry). */
export const taxIdTypeOption = (value) => TAX_ID_TYPES.find(t => t.value === value) || null;

/** Real PNG flag URL via flagcdn (free CDN). 20x15 looks crisp at 1x and 2x. */
export const flagUrl = (countryCode) => {
  if (!countryCode) return null;
  return `https://flagcdn.com/20x15/${countryCode.toLowerCase()}.png`;
};
