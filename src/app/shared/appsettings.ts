// import * as angular from "angular";
//
export class AppSettings {
  //
  //     gUrl: string = 'https://web.iframe-apps.com';
  //     apiUrl: string = 'https://web-preprod.iframe-apps.com/api/v1';
  //     crmUrl: string = 'https://crm.iframe-apps.com';
  //     sattUrl: string = 'https://wallet.iframe-apps.com:3014';
  //     sattUrlV2: string = 'https://wallet.iframe-apps.com:3014/v2';
  //     SaleWebSiteUrl: string = 'https://www.atayen.us/satt/';
  //     editorCampagneUrl: string = 'http://127.0.0.1:8080/#/campaign/';
  //     walletUrl: string = "http://127.0.0.1:8080/#/";
  //     sattUrl: string = "https://wallet.iframe-apps.com:3014";
  //
  //     paypalConfiguration = {
  //         sandbox: 'AYVp7U1xSM7HFwH2dgXFB109v467ztCBKlrDUM3HnqqLBsL-yb3RY-d_ZH9rv_7XDtzd4pWqUlbU1KIk',
  //         production: 'AYVp7U1xSM7HFwH2dgXFB109v467ztCBKlrDUM3HnqqLBsL-yb3RY-d_ZH9rv_7XDtzd4pWqUlbU1KIk',
  //         price: 0,
  //         currency: 'USD',
  //         symbol: 'usd',
  //         id: '',
  //         show: 'true',
  //         env: 'sandbox'
  //     };
  //
  //     countriesListObj = {
  //         "BD": "Bangladesh",
  //         "BE": "Belgium",
  //         "BF": "Burkina Faso",
  //         "BG": "Bulgaria",
  //         "BA": "Bosnia and Herzegovina",
  //         "BB": "Barbados",
  //         "WF": "Wallis and Futuna",
  //         "BL": "Saint Barthelemy",
  //         "BM": "Bermuda",
  //         "BN": "Brunei",
  //         "BO": "Bolivia",
  //         "BH": "Bahrain",
  //         "BI": "Burundi",
  //         "BJ": "Benin",
  //         "BT": "Bhutan",
  //         "JM": "Jamaica",
  //         "BV": "Bouvet Island",
  //         "BW": "Botswana",
  //         "WS": "Samoa",
  //         "BQ": "Bonaire, Saint Eustatius and Saba ",
  //         "BR": "Brazil",
  //         "BS": "Bahamas",
  //         "JE": "Jersey",
  //         "BY": "Belarus",
  //         "BZ": "Belize",
  //         "RU": "Russia",
  //         "RW": "Rwanda",
  //         "RS": "Serbia",
  //         "TL": "East Timor",
  //         "RE": "Reunion",
  //         "TM": "Turkmenistan",
  //         "TJ": "Tajikistan",
  //         "RO": "Romania",
  //         "TK": "Tokelau",
  //         "GW": "Guinea-Bissau",
  //         "GU": "Guam",
  //         "GT": "Guatemala",
  //         "GS": "South Georgia and the South Sandwich Islands",
  //         "GR": "Greece",
  //         "GQ": "Equatorial Guinea",
  //         "GP": "Guadeloupe",
  //         "JP": "Japan",
  //         "GY": "Guyana",
  //         "GG": "Guernsey",
  //         "GF": "French Guiana",
  //         "GE": "Georgia",
  //         "GD": "Grenada",
  //         "GB": "United Kingdom",
  //         "GA": "Gabon",
  //         "SV": "El Salvador",
  //         "GN": "Guinea",
  //         "GM": "Gambia",
  //         "GL": "Greenland",
  //         "GI": "Gibraltar",
  //         "GH": "Ghana",
  //         "OM": "Oman",
  //         "TN": "Tunisia",
  //         "JO": "Jordan",
  //         "HR": "Croatia",
  //         "HT": "Haiti",
  //         "HU": "Hungary",
  //         "HK": "Hong Kong",
  //         "HN": "Honduras",
  //         "HM": "Heard Island and McDonald Islands",
  //         "VE": "Venezuela",
  //         "PR": "Puerto Rico",
  //         "PS": "Palestinian Territory",
  //         "PW": "Palau",
  //         "PT": "Portugal",
  //         "SJ": "Svalbard and Jan Mayen",
  //         "PY": "Paraguay",
  //         "IQ": "Iraq",
  //         "PA": "Panama",
  //         "PF": "French Polynesia",
  //         "PG": "Papua New Guinea",
  //         "PE": "Peru",
  //         "PK": "Pakistan",
  //         "PH": "Philippines",
  //         "PN": "Pitcairn",
  //         "PL": "Poland",
  //         "PM": "Saint Pierre and Miquelon",
  //         "ZM": "Zambia",
  //         "EH": "Western Sahara",
  //         "EE": "Estonia",
  //         "EG": "Egypt",
  //         "ZA": "South Africa",
  //         "EC": "Ecuador",
  //         "IT": "Italy",
  //         "VN": "Vietnam",
  //         "SB": "Solomon Islands",
  //         "ET": "Ethiopia",
  //         "SO": "Somalia",
  //         "ZW": "Zimbabwe",
  //         "SA": "Saudi Arabia",
  //         "ES": "Spain",
  //         "ER": "Eritrea",
  //         "ME": "Montenegro",
  //         "MD": "Moldova",
  //         "MG": "Madagascar",
  //         "MF": "Saint Martin",
  //         "MA": "Morocco",
  //         "MC": "Monaco",
  //         "UZ": "Uzbekistan",
  //         "MM": "Myanmar",
  //         "ML": "Mali",
  //         "MO": "Macao",
  //         "MN": "Mongolia",
  //         "MH": "Marshall Islands",
  //         "MK": "Macedonia",
  //         "MU": "Mauritius",
  //         "MT": "Malta",
  //         "MW": "Malawi",
  //         "MV": "Maldives",
  //         "MQ": "Martinique",
  //         "MP": "Northern Mariana Islands",
  //         "MS": "Montserrat",
  //         "MR": "Mauritania",
  //         "IM": "Isle of Man",
  //         "UG": "Uganda",
  //         "TZ": "Tanzania",
  //         "MY": "Malaysia",
  //         "MX": "Mexico",
  //         "IL": "Israel",
  //         "FR": "France",
  //         "IO": "British Indian Ocean Territory",
  //         "SH": "Saint Helena",
  //         "FI": "Finland",
  //         "FJ": "Fiji",
  //         "FK": "Falkland Islands",
  //         "FM": "Micronesia",
  //         "FO": "Faroe Islands",
  //         "NI": "Nicaragua",
  //         "NL": "Netherlands",
  //         "NO": "Norway",
  //         "NA": "Namibia",
  //         "VU": "Vanuatu",
  //         "NC": "New Caledonia",
  //         "NE": "Niger",
  //         "NF": "Norfolk Island",
  //         "NG": "Nigeria",
  //         "NZ": "New Zealand",
  //         "NP": "Nepal",
  //         "NR": "Nauru",
  //         "NU": "Niue",
  //         "CK": "Cook Islands",
  //         "XK": "Kosovo",
  //         "CI": "Ivory Coast",
  //         "CH": "Switzerland",
  //         "CO": "Colombia",
  //         "CN": "China",
  //         "CM": "Cameroon",
  //         "CL": "Chile",
  //         "CC": "Cocos Islands",
  //         "CA": "Canada",
  //         "CG": "Republic of the Congo",
  //         "CF": "Central African Republic",
  //         "CD": "Democratic Republic of the Congo",
  //         "CZ": "Czech Republic",
  //         "CY": "Cyprus",
  //         "CX": "Christmas Island",
  //         "CR": "Costa Rica",
  //         "CW": "Curacao",
  //         "CV": "Cape Verde",
  //         "CU": "Cuba",
  //         "SZ": "Swaziland",
  //         "SY": "Syria",
  //         "SX": "Sint Maarten",
  //         "KG": "Kyrgyzstan",
  //         "KE": "Kenya",
  //         "SS": "South Sudan",
  //         "SR": "Suriname",
  //         "KI": "Kiribati",
  //         "KH": "Cambodia",
  //         "KN": "Saint Kitts and Nevis",
  //         "KM": "Comoros",
  //         "ST": "Sao Tome and Principe",
  //         "SK": "Slovakia",
  //         "KR": "South Korea",
  //         "SI": "Slovenia",
  //         "KP": "North Korea",
  //         "KW": "Kuwait",
  //         "SN": "Senegal",
  //         "SM": "San Marino",
  //         "SL": "Sierra Leone",
  //         "SC": "Seychelles",
  //         "KZ": "Kazakhstan",
  //         "KY": "Cayman Islands",
  //         "SG": "Singapore",
  //         "SE": "Sweden",
  //         "SD": "Sudan",
  //         "DO": "Dominican Republic",
  //         "DM": "Dominica",
  //         "DJ": "Djibouti",
  //         "DK": "Denmark",
  //         "VG": "British Virgin Islands",
  //         "DE": "Germany",
  //         "YE": "Yemen",
  //         "DZ": "Algeria",
  //         "US": "United States",
  //         "UY": "Uruguay",
  //         "YT": "Mayotte",
  //         "UM": "United States Minor Outlying Islands",
  //         "LB": "Lebanon",
  //         "LC": "Saint Lucia",
  //         "LA": "Laos",
  //         "TV": "Tuvalu",
  //         "TW": "Taiwan",
  //         "TT": "Trinidad and Tobago",
  //         "TR": "Turkey",
  //         "LK": "Sri Lanka",
  //         "LI": "Liechtenstein",
  //         "LV": "Latvia",
  //         "TO": "Tonga",
  //         "LT": "Lithuania",
  //         "LU": "Luxembourg",
  //         "LR": "Liberia",
  //         "LS": "Lesotho",
  //         "TH": "Thailand",
  //         "TF": "French Southern Territories",
  //         "TG": "Togo",
  //         "TD": "Chad",
  //         "TC": "Turks and Caicos Islands",
  //         "LY": "Libya",
  //         "VA": "Vatican",
  //         "VC": "Saint Vincent and the Grenadines",
  //         "AE": "United Arab Emirates",
  //         "AD": "Andorra",
  //         "AG": "Antigua and Barbuda",
  //         "AF": "Afghanistan",
  //         "AI": "Anguilla",
  //         "VI": "U.S. Virgin Islands",
  //         "IS": "Iceland",
  //         "IR": "Iran",
  //         "AM": "Armenia",
  //         "AL": "Albania",
  //         "AO": "Angola",
  //         "AQ": "Antarctica",
  //         "AS": "American Samoa",
  //         "AR": "Argentina",
  //         "AU": "Australia",
  //         "AT": "Austria",
  //         "AW": "Aruba",
  //         "IN": "India",
  //         "AX": "Aland Islands",
  //         "AZ": "Azerbaijan",
  //         "IE": "Ireland",
  //         "ID": "Indonesia",
  //         "UA": "Ukraine",
  //         "QA": "Qatar",
  //         "MZ": "Mozambique"
  //     };
  //     countriesList = this.getCountriesList;
  //
  //     languagesList = {
  //         "ab": {
  //             "name": "Abkhaz",
  //             "nativeName": "????????????????????"
  //         },
  //         "aa": {
  //             "name": "Afar",
  //             "nativeName": "Afaraf"
  //         },
  //         "af": {
  //             "name": "Afrikaans",
  //             "nativeName": "Afrikaans"
  //         },
  //         "ak": {
  //             "name": "Akan",
  //             "nativeName": "Akan"
  //         },
  //         "sq": {
  //             "name": "Albanian",
  //             "nativeName": "Shqip"
  //         },
  //         "am": {
  //             "name": "Amharic",
  //             "nativeName": "??????????????????????????"
  //         },
  //         "ar": {
  //             "name": "Arabic",
  //             "nativeName": "?????????????????????????????"
  //         },
  //         "an": {
  //             "name": "Aragonese",
  //             "nativeName": "Aragon????s"
  //         },
  //         "hy": {
  //             "name": "Armenian",
  //             "nativeName": "??????????????????????????????"
  //         },
  //         "as": {
  //             "name": "Assamese",
  //             "nativeName": "????????????????????????????????????????????"
  //         },
  //         "av": {
  //             "name": "Avaric",
  //             "nativeName": "????????????????? ??????????????????, ?????????????????????????????????? ??????????????????"
  //         },
  //         "ae": {
  //             "name": "Avestan",
  //             "nativeName": "avesta"
  //         },
  //         "ay": {
  //             "name": "Aymara",
  //             "nativeName": "aymar aru"
  //         },
  //         "az": {
  //             "name": "Azerbaijani",
  //             "nativeName": "az?????rbaycan dili"
  //         },
  //         "bm": {
  //             "name": "Bambara",
  //             "nativeName": "bamanankan"
  //         },
  //         "ba": {
  //             "name": "Bashkir",
  //             "nativeName": "?????????????????????????????? ?????????????????"
  //         },
  //         "eu": {
  //             "name": "Basque",
  //             "nativeName": "euskara, euskera"
  //         },
  //         "be": {
  //             "name": "Belarusian",
  //             "nativeName": "??????????????????????????????????????????"
  //         },
  //         "bn": {
  //             "name": "Bengali",
  //             "nativeName": "???????????????????????????????"
  //         },
  //         "bh": {
  //             "name": "Bihari",
  //             "nativeName": "????????????????????????????????????????????"
  //         },
  //         "bi": {
  //             "name": "Bislama",
  //             "nativeName": "Bislama"
  //         },
  //         "bs": {
  //             "name": "Bosnian",
  //             "nativeName": "bosanski jezik"
  //         },
  //         "br": {
  //             "name": "Breton",
  //             "nativeName": "brezhoneg"
  //         },
  //         "bg": {
  //             "name": "Bulgarian",
  //             "nativeName": "????????????????????????????????????? ????????????????"
  //         },
  //         "my": {
  //             "name": "Burmese",
  //             "nativeName": "??????????????????????????????????????"
  //         },
  //         "ca": {
  //             "name": "Catalan; Valencian",
  //             "nativeName": "Catal????"
  //         },
  //         "ch": {
  //             "name": "Chamorro",
  //             "nativeName": "Chamoru"
  //         },
  //         "ce": {
  //             "name": "Chechen",
  //             "nativeName": "?????????????????????????????? ??????????????????"
  //         },
  //         "ny": {
  //             "name": "Chichewa; Chewa; Nyanja",
  //             "nativeName": "chiChe????a, chinyanja"
  //         },
  //         "zh": {
  //             "name": "Chinese",
  //             "nativeName": "?????????????? (Zh????ngw????n), ?????????????, ????????????"
  //         },
  //         "cv": {
  //             "name": "Chuvash",
  //             "nativeName": "?????????????????????? ???????????????????????"
  //         },
  //         "kw": {
  //             "name": "Cornish",
  //             "nativeName": "Kernewek"
  //         },
  //         "co": {
  //             "name": "Corsican",
  //             "nativeName": "corsu, lingua corsa"
  //         },
  //         "cr": {
  //             "name": "Cree",
  //             "nativeName": "?????????????????????????????????????????????"
  //         },
  //         "hr": {
  //             "name": "Croatian",
  //             "nativeName": "hrvatski"
  //         },
  //         "cs": {
  //             "name": "Czech",
  //             "nativeName": "????esky, ????e????tina"
  //         },
  //         "da": {
  //             "name": "Danish",
  //             "nativeName": "dansk"
  //         },
  //         "dv": {
  //             "name": "Divehi; Dhivehi; Maldivian;",
  //             "nativeName": "??????????????????????????"
  //         },
  //         "nl": {
  //             "name": "Dutch",
  //             "nativeName": "Nederlands, Vlaams"
  //         },
  //         "en": {
  //             "name": "English",
  //             "nativeName": "English"
  //         },
  //         "eo": {
  //             "name": "Esperanto",
  //             "nativeName": "Esperanto"
  //         },
  //         "et": {
  //             "name": "Estonian",
  //             "nativeName": "eesti, eesti keel"
  //         },
  //         "ee": {
  //             "name": "Ewe",
  //             "nativeName": "E?????egbe"
  //         },
  //         "fo": {
  //             "name": "Faroese",
  //             "nativeName": "f????royskt"
  //         },
  //         "fj": {
  //             "name": "Fijian",
  //             "nativeName": "vosa Vakaviti"
  //         },
  //         "fi": {
  //             "name": "Finnish",
  //             "nativeName": "suomi, suomen kieli"
  //         },
  //         "fr": {
  //             "name": "French",
  //             "nativeName": "fran????ais, langue fran????aise"
  //         },
  //         "ff": {
  //             "name": "Fula; Fulah; Pulaar; Pular",
  //             "nativeName": "Fulfulde, Pulaar, Pular"
  //         },
  //         "gl": {
  //             "name": "Galician",
  //             "nativeName": "Galego"
  //         },
  //         "ka": {
  //             "name": "Georgian",
  //             "nativeName": "???????????????????????????????????????????"
  //         },
  //         "de": {
  //             "name": "German",
  //             "nativeName": "Deutsch"
  //         },
  //         "el": {
  //             "name": "Greek, Modern",
  //             "nativeName": "?????????????????????????????????"
  //         },
  //         "gn": {
  //             "name": "Guaran????",
  //             "nativeName": "Ava????e??????"
  //         },
  //         "gu": {
  //             "name": "Gujarati",
  //             "nativeName": "????????????????????????????????????????????"
  //         },
  //         "ht": {
  //             "name": "Haitian; Haitian Creole",
  //             "nativeName": "Krey????l ayisyen"
  //         },
  //         "ha": {
  //             "name": "Hausa",
  //             "nativeName": "Hausa, ?????????????????????????"
  //         },
  //         "he": {
  //             "name": "Hebrew (modern)",
  //             "nativeName": "??????????????????????"
  //         },
  //         "hz": {
  //             "name": "Herero",
  //             "nativeName": "Otjiherero"
  //         },
  //         "hi": {
  //             "name": "Hindi",
  //             "nativeName": "?????????????????????????????????????, ????????????????????????????????"
  //         },
  //         "ho": {
  //             "name": "Hiri Motu",
  //             "nativeName": "Hiri Motu"
  //         },
  //         "hu": {
  //             "name": "Hungarian",
  //             "nativeName": "Magyar"
  //         },
  //         "ia": {
  //             "name": "Interlingua",
  //             "nativeName": "Interlingua"
  //         },
  //         "id": {
  //             "name": "Indonesian",
  //             "nativeName": "Bahasa Indonesia"
  //         },
  //         "ie": {
  //             "name": "Interlingue",
  //             "nativeName": "Originally called Occidental; then Interlingue after WWII"
  //         },
  //         "ga": {
  //             "name": "Irish",
  //             "nativeName": "Gaeilge"
  //         },
  //         "ig": {
  //             "name": "Igbo",
  //             "nativeName": "As??????s?????? Igbo"
  //         },
  //         "ik": {
  //             "name": "Inupiaq",
  //             "nativeName": "I????upiaq, I????upiatun"
  //         },
  //         "io": {
  //             "name": "Ido",
  //             "nativeName": "Ido"
  //         },
  //         "is": {
  //             "name": "Icelandic",
  //             "nativeName": "????slenska"
  //         },
  //         "it": {
  //             "name": "Italian",
  //             "nativeName": "Italiano"
  //         },
  //         "iu": {
  //             "name": "Inuktitut",
  //             "nativeName": "??????????????????????????????????????????"
  //         },
  //         "ja": {
  //             "name": "Japanese",
  //             "nativeName": "??????????????????? (??????????????????????????????????????????????????????????????????)"
  //         },
  //         "jv": {
  //             "name": "Javanese",
  //             "nativeName": "basa Jawa"
  //         },
  //         "kl": {
  //             "name": "Kalaallisut, Greenlandic",
  //             "nativeName": "kalaallisut, kalaallit oqaasii"
  //         },
  //         "kn": {
  //             "name": "Kannada",
  //             "nativeName": "???????????????????????????????"
  //         },
  //         "kr": {
  //             "name": "Kanuri",
  //             "nativeName": "Kanuri"
  //         },
  //         "ks": {
  //             "name": "Kashmiri",
  //             "nativeName": "?????????????????????????????????????????????, ????????????????????????????????"
  //         },
  //         "kk": {
  //             "name": "Kazakh",
  //             "nativeName": "????????????????????? ???????????????????"
  //         },
  //         "km": {
  //             "name": "Khmer",
  //             "nativeName": "?????????????????????????????????????????????????????????"
  //         },
  //         "ki": {
  //             "name": "Kikuyu, Gikuyu",
  //             "nativeName": "G????k????y????"
  //         },
  //         "rw": {
  //             "name": "Kinyarwanda",
  //             "nativeName": "Ikinyarwanda"
  //         },
  //         "ky": {
  //             "name": "Kirghiz, Kyrgyz",
  //             "nativeName": "??????????????????????????? ?????????????????"
  //         },
  //         "kv": {
  //             "name": "Komi",
  //             "nativeName": "???????????????? ?????????????"
  //         },
  //         "kg": {
  //             "name": "Kongo",
  //             "nativeName": "KiKongo"
  //         },
  //         "ko": {
  //             "name": "Korean",
  //             "nativeName": "???????????????????? (????????????????????), ??????????????????? (??????????????????)"
  //         },
  //         "ku": {
  //             "name": "Kurdish",
  //             "nativeName": "Kurd????, ???????????????????????????"
  //         },
  //         "kj": {
  //             "name": "Kwanyama, Kuanyama",
  //             "nativeName": "Kuanyama"
  //         },
  //         "la": {
  //             "name": "Latin",
  //             "nativeName": "latine, lingua latina"
  //         },
  //         "lb": {
  //             "name": "Luxembourgish, Letzeburgesch",
  //             "nativeName": "L????tzebuergesch"
  //         },
  //         "lg": {
  //             "name": "Luganda",
  //             "nativeName": "Luganda"
  //         },
  //         "li": {
  //             "name": "Limburgish, Limburgan, Limburger",
  //             "nativeName": "Limburgs"
  //         },
  //         "ln": {
  //             "name": "Lingala",
  //             "nativeName": "Ling????la"
  //         },
  //         "lo": {
  //             "name": "Lao",
  //             "nativeName": "??????????????????????????????????????????"
  //         },
  //         "lt": {
  //             "name": "Lithuanian",
  //             "nativeName": "lietuvi???? kalba"
  //         },
  //         "lu": {
  //             "name": "Luba-Katanga",
  //             "nativeName": ""
  //         },
  //         "lv": {
  //             "name": "Latvian",
  //             "nativeName": "latvie????u valoda"
  //         },
  //         "gv": {
  //             "name": "Manx",
  //             "nativeName": "Gaelg, Gailck"
  //         },
  //         "mk": {
  //             "name": "Macedonian",
  //             "nativeName": "???????????????????????????????????????? ????????????????????"
  //         },
  //         "mg": {
  //             "name": "Malagasy",
  //             "nativeName": "Malagasy fiteny"
  //         },
  //         "ms": {
  //             "name": "Malay",
  //             "nativeName": "bahasa Melayu, ????????????????? ?????????????????????????????"
  //         },
  //         "ml": {
  //             "name": "Malayalam",
  //             "nativeName": "?????????????????????????????????????"
  //         },
  //         "mt": {
  //             "name": "Maltese",
  //             "nativeName": "Malti"
  //         },
  //         "mi": {
  //             "name": "M????ori",
  //             "nativeName": "te reo M????ori"
  //         },
  //         "mr": {
  //             "name": "Marathi (Mar??????????h????)",
  //             "nativeName": "???????????????????????????????"
  //         },
  //         "mh": {
  //             "name": "Marshallese",
  //             "nativeName": "Kajin M????aje????"
  //         },
  //         "mn": {
  //             "name": "Mongolian",
  //             "nativeName": "????????????????????????"
  //         },
  //         "na": {
  //             "name": "Nauru",
  //             "nativeName": "Ekakair???? Naoero"
  //         },
  //         "nv": {
  //             "name": "Navajo, Navaho",
  //             "nativeName": "Din???? bizaad, Din????k????eh????????"
  //         },
  //         "nb": {
  //             "name": "Norwegian Bokm????l",
  //             "nativeName": "Norsk bokm????l"
  //         },
  //         "nd": {
  //             "name": "North Ndebele",
  //             "nativeName": "isiNdebele"
  //         },
  //         "ne": {
  //             "name": "Nepali",
  //             "nativeName": "??????????????????????????????????????"
  //         },
  //         "ng": {
  //             "name": "Ndonga",
  //             "nativeName": "Owambo"
  //         },
  //         "nn": {
  //             "name": "Norwegian Nynorsk",
  //             "nativeName": "Norsk nynorsk"
  //         },
  //         "no": {
  //             "name": "Norwegian",
  //             "nativeName": "Norsk"
  //         },
  //         "ii": {
  //             "name": "Nuosu",
  //             "nativeName": "???????????????????? Nuosuhxop"
  //         },
  //         "nr": {
  //             "name": "South Ndebele",
  //             "nativeName": "isiNdebele"
  //         },
  //         "oc": {
  //             "name": "Occitan",
  //             "nativeName": "Occitan"
  //         },
  //         "oj": {
  //             "name": "Ojibwe, Ojibwa",
  //             "nativeName": "???????????????????????????????????????????????????????"
  //         },
  //         "cu": {
  //             "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
  //             "nativeName": "????????????????????? ????????????????????????????????????????"
  //         },
  //         "om": {
  //             "name": "Oromo",
  //             "nativeName": "Afaan Oromoo"
  //         },
  //         "or": {
  //             "name": "Oriya",
  //             "nativeName": "????????????????????????????????"
  //         },
  //         "os": {
  //             "name": "Ossetian, Ossetic",
  //             "nativeName": "????????????????? ????????????????????"
  //         },
  //         "pa": {
  //             "name": "Panjabi, Punjabi",
  //             "nativeName": "?????????????????????????????????????, ????????????????????????????????"
  //         },
  //         "pi": {
  //             "name": "P????li",
  //             "nativeName": "????????????????????????"
  //         },
  //         "fa": {
  //             "name": "Persian",
  //             "nativeName": "????????????????????"
  //         },
  //         "pl": {
  //             "name": "Polish",
  //             "nativeName": "polski"
  //         },
  //         "ps": {
  //             "name": "Pashto, Pushto",
  //             "nativeName": "????????????????"
  //         },
  //         "pt": {
  //             "name": "Portuguese",
  //             "nativeName": "Portugu????s"
  //         },
  //         "qu": {
  //             "name": "Quechua",
  //             "nativeName": "Runa Simi, Kichwa"
  //         },
  //         "rm": {
  //             "name": "Romansh",
  //             "nativeName": "rumantsch grischun"
  //         },
  //         "rn": {
  //             "name": "Kirundi",
  //             "nativeName": "kiRundi"
  //         },
  //         "ro": {
  //             "name": "Romanian, Moldavian, Moldovan",
  //             "nativeName": "rom????n????"
  //         },
  //         "ru": {
  //             "name": "Russian",
  //             "nativeName": "????????????????????????????? ?????????????????"
  //         },
  //         "sa": {
  //             "name": "Sanskrit (Sa??????sk???????ta)",
  //             "nativeName": "????????????????????????????????????????????????????????"
  //         },
  //         "sc": {
  //             "name": "Sardinian",
  //             "nativeName": "sardu"
  //         },
  //         "sd": {
  //             "name": "Sindhi",
  //             "nativeName": "?????????????????????????????????????, ????????????????????? ????????????????????????????"
  //         },
  //         "se": {
  //             "name": "Northern Sami",
  //             "nativeName": "Davvis????megiella"
  //         },
  //         "sm": {
  //             "name": "Samoan",
  //             "nativeName": "gagana faa Samoa"
  //         },
  //         "sg": {
  //             "name": "Sango",
  //             "nativeName": "y????ng???? t???? s????ng????"
  //         },
  //         "sr": {
  //             "name": "Serbian",
  //             "nativeName": "????????????????????????? ????????????????????"
  //         },
  //         "gd": {
  //             "name": "Scottish Gaelic; Gaelic",
  //             "nativeName": "G????idhlig"
  //         },
  //         "sn": {
  //             "name": "Shona",
  //             "nativeName": "chiShona"
  //         },
  //         "si": {
  //             "name": "Sinhala, Sinhalese",
  //             "nativeName": "?????????????????????????????????"
  //         },
  //         "sk": {
  //             "name": "Slovak",
  //             "nativeName": "sloven????ina"
  //         },
  //         "sl": {
  //             "name": "Slovene",
  //             "nativeName": "sloven????????ina"
  //         },
  //         "so": {
  //             "name": "Somali",
  //             "nativeName": "Soomaaliga, af Soomaali"
  //         },
  //         "st": {
  //             "name": "Southern Sotho",
  //             "nativeName": "Sesotho"
  //         },
  //         "es": {
  //             "name": "Spanish; Castilian",
  //             "nativeName": "espa????ol, castellano"
  //         },
  //         "su": {
  //             "name": "Sundanese",
  //             "nativeName": "Basa Sunda"
  //         },
  //         "sw": {
  //             "name": "Swahili",
  //             "nativeName": "Kiswahili"
  //         },
  //         "ss": {
  //             "name": "Swati",
  //             "nativeName": "SiSwati"
  //         },
  //         "sv": {
  //             "name": "Swedish",
  //             "nativeName": "svenska"
  //         },
  //         "ta": {
  //             "name": "Tamil",
  //             "nativeName": "??????????????????????????????"
  //         },
  //         "te": {
  //             "name": "Telugu",
  //             "nativeName": "??????????????????????????????????????"
  //         },
  //         "tg": {
  //             "name": "Tajik",
  //             "nativeName": "?????????????????????????, to????ik????, ???????????????????????????????"
  //         },
  //         "th": {
  //             "name": "Thai",
  //             "nativeName": "????????????????????"
  //         },
  //         "ti": {
  //             "name": "Tigrinya",
  //             "nativeName": "??????????????????????????"
  //         },
  //         "bo": {
  //             "name": "Tibetan Standard, Tibetan, Central",
  //             "nativeName": "??????????????????????????????????????????????"
  //         },
  //         "tk": {
  //             "name": "Turkmen",
  //             "nativeName": "T????rkmen, ?????????????????????????????"
  //         },
  //         "tl": {
  //             "name": "Tagalog",
  //             "nativeName": "Wikang Tagalog, ????????????????????????????????? ?????????????????????????????????????????"
  //         },
  //         "tn": {
  //             "name": "Tswana",
  //             "nativeName": "Setswana"
  //         },
  //         "to": {
  //             "name": "Tonga (Tonga Islands)",
  //             "nativeName": "faka Tonga"
  //         },
  //         "tr": {
  //             "name": "Turkish",
  //             "nativeName": "T????rk????e"
  //         },
  //         "ts": {
  //             "name": "Tsonga",
  //             "nativeName": "Xitsonga"
  //         },
  //         "tt": {
  //             "name": "Tatar",
  //             "nativeName": "????????????????????????????????, tatar????a, ????????????????????????????????????"
  //         },
  //         "tw": {
  //             "name": "Twi",
  //             "nativeName": "Twi"
  //         },
  //         "ty": {
  //             "name": "Tahitian",
  //             "nativeName": "Reo Tahiti"
  //         },
  //         "ug": {
  //             "name": "Uighur, Uyghur",
  //             "nativeName": "Uy????urq?????, ???????????????????????????????????????????"
  //         },
  //         "uk": {
  //             "name": "Ukrainian",
  //             "nativeName": "??????????????????????????????????????????"
  //         },
  //         "ur": {
  //             "name": "Urdu",
  //             "nativeName": "????????????????"
  //         },
  //         "uz": {
  //             "name": "Uzbek",
  //             "nativeName": "zbek, ????????????????????, ????????????????????????????????"
  //         },
  //         "ve": {
  //             "name": "Venda",
  //             "nativeName": "Tshiven???????a"
  //         },
  //         "vi": {
  //             "name": "Vietnamese",
  //             "nativeName": "Ti??????ng Vi???????t"
  //         },
  //         "vo": {
  //             "name": "Volap????k",
  //             "nativeName": "Volap????k"
  //         },
  //         "wa": {
  //             "name": "Walloon",
  //             "nativeName": "Walon"
  //         },
  //         "cy": {
  //             "name": "Welsh",
  //             "nativeName": "Cymraeg"
  //         },
  //         "wo": {
  //             "name": "Wolof",
  //             "nativeName": "Wollof"
  //         },
  //         "fy": {
  //             "name": "Western Frisian",
  //             "nativeName": "Frysk"
  //         },
  //         "xh": {
  //             "name": "Xhosa",
  //             "nativeName": "isiXhosa"
  //         },
  //         "yi": {
  //             "name": "Yiddish",
  //             "nativeName": "????????????????????????????"
  //         },
  //         "yo": {
  //             "name": "Yoruba",
  //             "nativeName": "Yor????b????"
  //         },
  //         "za": {
  //             "name": "Zhuang, Chuang",
  //             "nativeName": "Sa???? cue??????????, Saw cuengh"
  //         }
  //     };
  //
  //     cryptoCurrenciesListObj = {
  //         "SaTT": "SaTT",
  //         "WSaTT": "WSaTT",
  //         "ETH": "Ethereum",
  //         "BTC": "Bitcoin",
  //         "JET": "Jetcoin",
  //         "DAI": "DAI",
  //         "OMG": "OmiseGo",
  //         "USDC": "USD Coin",
  //         "ZRX": "0x",
  //         "MKR": "Maker"
  //     };
  //     cryptoCurrenciesList = this.getcryptoCurrenciesList();
  //
  //     getcryptoCurrenciesList(): Array<any> {
  //         var result: Array<any> = [];
  //         angular.forEach(this.cryptoCurrenciesListObj, function (v, i) {
  //             result.push({"code": i, "name": v});
  //         });
  //         return result;
  //     }
  //
  //     getCountriesList(): Array<any> {
  //         var result: Array<any> = [];
  //         angular.forEach(this.countriesListObj, function (v, i) {
  //             result.push({"code": i, "name": v});
  //         });
  //         result.sort(function (a, b) {
  //             return a.name.localeCompare(b.name);
  //         });
  //         return result;
  //     }
  //
  //     validateEmail(email: string): Boolean {
  //         var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //         return re.test(String(email).toLowerCase());
  //     };
  //
  //     cloneObj(o: object, fields: Array<object>): any {
  //         var r = angular.copy(o);
  //         var i;
  //         for (i in o) { // @ts-ignore
  //             if (fields.indexOf(i) < 0) {
  //                 // @ts-ignore
  //                 delete r[i];
  //             }
  //         }
  //         return r;
  //     };
  //
  //     obj2Array(o: object): Array<object> {
  //         if (o instanceof Array)
  //             return o;
  //         if (!(o instanceof Object))
  //             return [];
  //         var els: Array<any> = [];
  //
  //         /*forEach(o, function (v) {
  //             els.push(v);
  //         });*/
  //         return els;
  //     };
  //
  //     objIndexById(o: any): Array<object> {
  //         var oo = this.obj2Array(o),
  //             r: Array<object> = [{}];
  //         angular.forEach(oo, function (v) {
  //             // @ts-ignore
  //             r[v.id] = v;
  //         });
  //         return r;
  //     };
  //
  //     objKeys(o: object): Array<any> {
  //         var r: Array<any> = [];
  //         angular.forEach(o, function (v, k) {
  //             r.push(k);
  //         });
  //         return r;
  //     };
  //
  //     arrPull(a: Array<object>, o: object): any {
  //         var ind = a.indexOf(o);
  //         if (ind >= 0)
  //             return a.splice(ind, 1);
  //     };
  //
  //     toKMUnit(nb: number): any {
  //         var m = Math.floor(nb / 1000000);
  //         var k = Math.floor(nb / 1000);
  //         if (m > 0)
  //             return m + 'M';
  //         if (k > 0)
  //             return k + 'K';
  //         return nb;
  //     };
}
