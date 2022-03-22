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
  //             "nativeName": "Ð°Ò§ÑÑƒÐ°"
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
  //             "nativeName": "áŠ áˆ›áˆ­áŠ›"
  //         },
  //         "ar": {
  //             "name": "Arabic",
  //             "nativeName": "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
  //         },
  //         "an": {
  //             "name": "Aragonese",
  //             "nativeName": "AragonÃ©s"
  //         },
  //         "hy": {
  //             "name": "Armenian",
  //             "nativeName": "Õ€Õ¡ÕµÕ¥Ö€Õ¥Õ¶"
  //         },
  //         "as": {
  //             "name": "Assamese",
  //             "nativeName": "à¦…à¦¸à¦®à§€à¦¯à¦¼à¦¾"
  //         },
  //         "av": {
  //             "name": "Avaric",
  //             "nativeName": "Ð°Ð²Ð°Ñ€ Ð¼Ð°Ñ†Ó€, Ð¼Ð°Ð³Ó€Ð°Ñ€ÑƒÐ» Ð¼Ð°Ñ†Ó€"
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
  //             "nativeName": "azÉ™rbaycan dili"
  //         },
  //         "bm": {
  //             "name": "Bambara",
  //             "nativeName": "bamanankan"
  //         },
  //         "ba": {
  //             "name": "Bashkir",
  //             "nativeName": "Ð±Ð°ÑˆÒ¡Ð¾Ñ€Ñ‚ Ñ‚ÐµÐ»Ðµ"
  //         },
  //         "eu": {
  //             "name": "Basque",
  //             "nativeName": "euskara, euskera"
  //         },
  //         "be": {
  //             "name": "Belarusian",
  //             "nativeName": "Ð‘ÐµÐ»Ð°Ñ€ÑƒÑÐºÐ°Ñ"
  //         },
  //         "bn": {
  //             "name": "Bengali",
  //             "nativeName": "à¦¬à¦¾à¦‚à¦²à¦¾"
  //         },
  //         "bh": {
  //             "name": "Bihari",
  //             "nativeName": "à¤­à¥‹à¤œà¤ªà¥à¤°à¥€"
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
  //             "nativeName": "Ð±ÑŠÐ»Ð³Ð°Ñ€ÑÐºÐ¸ ÐµÐ·Ð¸Ðº"
  //         },
  //         "my": {
  //             "name": "Burmese",
  //             "nativeName": "á€—á€™á€¬á€…á€¬"
  //         },
  //         "ca": {
  //             "name": "Catalan; Valencian",
  //             "nativeName": "CatalÃ "
  //         },
  //         "ch": {
  //             "name": "Chamorro",
  //             "nativeName": "Chamoru"
  //         },
  //         "ce": {
  //             "name": "Chechen",
  //             "nativeName": "Ð½Ð¾Ñ…Ñ‡Ð¸Ð¹Ð½ Ð¼Ð¾Ñ‚Ñ‚"
  //         },
  //         "ny": {
  //             "name": "Chichewa; Chewa; Nyanja",
  //             "nativeName": "chiCheÅµa, chinyanja"
  //         },
  //         "zh": {
  //             "name": "Chinese",
  //             "nativeName": "ä¸­æ–‡ (ZhÅngwÃ©n), æ±‰è¯­, æ¼¢èªž"
  //         },
  //         "cv": {
  //             "name": "Chuvash",
  //             "nativeName": "Ñ‡Ó‘Ð²Ð°Ñˆ Ñ‡Ó—Ð»Ñ…Ð¸"
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
  //             "nativeName": "á“€á¦áƒá”­ááá£"
  //         },
  //         "hr": {
  //             "name": "Croatian",
  //             "nativeName": "hrvatski"
  //         },
  //         "cs": {
  //             "name": "Czech",
  //             "nativeName": "Äesky, ÄeÅ¡tina"
  //         },
  //         "da": {
  //             "name": "Danish",
  //             "nativeName": "dansk"
  //         },
  //         "dv": {
  //             "name": "Divehi; Dhivehi; Maldivian;",
  //             "nativeName": "Þ‹Þ¨ÞˆÞ¬Þ€Þ¨"
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
  //             "nativeName": "EÊ‹egbe"
  //         },
  //         "fo": {
  //             "name": "Faroese",
  //             "nativeName": "fÃ¸royskt"
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
  //             "nativeName": "franÃ§ais, langue franÃ§aise"
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
  //             "nativeName": "áƒ¥áƒáƒ áƒ—áƒ£áƒšáƒ˜"
  //         },
  //         "de": {
  //             "name": "German",
  //             "nativeName": "Deutsch"
  //         },
  //         "el": {
  //             "name": "Greek, Modern",
  //             "nativeName": "Î•Î»Î»Î·Î½Î¹ÎºÎ¬"
  //         },
  //         "gn": {
  //             "name": "GuaranÃ­",
  //             "nativeName": "AvaÃ±eáº½"
  //         },
  //         "gu": {
  //             "name": "Gujarati",
  //             "nativeName": "àª—à«àªœàª°àª¾àª¤à«€"
  //         },
  //         "ht": {
  //             "name": "Haitian; Haitian Creole",
  //             "nativeName": "KreyÃ²l ayisyen"
  //         },
  //         "ha": {
  //             "name": "Hausa",
  //             "nativeName": "Hausa, Ù‡ÙŽÙˆÙØ³ÙŽ"
  //         },
  //         "he": {
  //             "name": "Hebrew (modern)",
  //             "nativeName": "×¢×‘×¨×™×ª"
  //         },
  //         "hz": {
  //             "name": "Herero",
  //             "nativeName": "Otjiherero"
  //         },
  //         "hi": {
  //             "name": "Hindi",
  //             "nativeName": "à¤¹à¤¿à¤¨à¥à¤¦à¥€, à¤¹à¤¿à¤‚à¤¦à¥€"
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
  //             "nativeName": "Asá»¥sá»¥ Igbo"
  //         },
  //         "ik": {
  //             "name": "Inupiaq",
  //             "nativeName": "IÃ±upiaq, IÃ±upiatun"
  //         },
  //         "io": {
  //             "name": "Ido",
  //             "nativeName": "Ido"
  //         },
  //         "is": {
  //             "name": "Icelandic",
  //             "nativeName": "Ãslenska"
  //         },
  //         "it": {
  //             "name": "Italian",
  //             "nativeName": "Italiano"
  //         },
  //         "iu": {
  //             "name": "Inuktitut",
  //             "nativeName": "áƒá“„á’ƒá‘Žá‘á‘¦"
  //         },
  //         "ja": {
  //             "name": "Japanese",
  //             "nativeName": "æ—¥æœ¬èªž (ã«ã»ã‚“ã”ï¼ã«ã£ã½ã‚“ã”)"
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
  //             "nativeName": "à²•à²¨à³à²¨à²¡"
  //         },
  //         "kr": {
  //             "name": "Kanuri",
  //             "nativeName": "Kanuri"
  //         },
  //         "ks": {
  //             "name": "Kashmiri",
  //             "nativeName": "à¤•à¤¶à¥à¤®à¥€à¤°à¥€, ÙƒØ´Ù…ÙŠØ±ÙŠâ€Ž"
  //         },
  //         "kk": {
  //             "name": "Kazakh",
  //             "nativeName": "ÒšÐ°Ð·Ð°Ò› Ñ‚Ñ–Ð»Ñ–"
  //         },
  //         "km": {
  //             "name": "Khmer",
  //             "nativeName": "áž—áž¶ážŸáž¶ážáŸ’áž˜áŸ‚ážš"
  //         },
  //         "ki": {
  //             "name": "Kikuyu, Gikuyu",
  //             "nativeName": "GÄ©kÅ©yÅ©"
  //         },
  //         "rw": {
  //             "name": "Kinyarwanda",
  //             "nativeName": "Ikinyarwanda"
  //         },
  //         "ky": {
  //             "name": "Kirghiz, Kyrgyz",
  //             "nativeName": "ÐºÑ‹Ñ€Ð³Ñ‹Ð· Ñ‚Ð¸Ð»Ð¸"
  //         },
  //         "kv": {
  //             "name": "Komi",
  //             "nativeName": "ÐºÐ¾Ð¼Ð¸ ÐºÑ‹Ð²"
  //         },
  //         "kg": {
  //             "name": "Kongo",
  //             "nativeName": "KiKongo"
  //         },
  //         "ko": {
  //             "name": "Korean",
  //             "nativeName": "í•œêµ­ì–´ (éŸ“åœ‹èªž), ì¡°ì„ ë§ (æœé®®èªž)"
  //         },
  //         "ku": {
  //             "name": "Kurdish",
  //             "nativeName": "KurdÃ®, ÙƒÙˆØ±Ø¯ÛŒâ€Ž"
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
  //             "nativeName": "LÃ«tzebuergesch"
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
  //             "nativeName": "LingÃ¡la"
  //         },
  //         "lo": {
  //             "name": "Lao",
  //             "nativeName": "àºžàº²àºªàº²àº¥àº²àº§"
  //         },
  //         "lt": {
  //             "name": "Lithuanian",
  //             "nativeName": "lietuviÅ³ kalba"
  //         },
  //         "lu": {
  //             "name": "Luba-Katanga",
  //             "nativeName": ""
  //         },
  //         "lv": {
  //             "name": "Latvian",
  //             "nativeName": "latvieÅ¡u valoda"
  //         },
  //         "gv": {
  //             "name": "Manx",
  //             "nativeName": "Gaelg, Gailck"
  //         },
  //         "mk": {
  //             "name": "Macedonian",
  //             "nativeName": "Ð¼Ð°ÐºÐµÐ´Ð¾Ð½ÑÐºÐ¸ Ñ˜Ð°Ð·Ð¸Ðº"
  //         },
  //         "mg": {
  //             "name": "Malagasy",
  //             "nativeName": "Malagasy fiteny"
  //         },
  //         "ms": {
  //             "name": "Malay",
  //             "nativeName": "bahasa Melayu, Ø¨Ù‡Ø§Ø³ Ù…Ù„Ø§ÙŠÙˆâ€Ž"
  //         },
  //         "ml": {
  //             "name": "Malayalam",
  //             "nativeName": "à´®à´²à´¯à´¾à´³à´‚"
  //         },
  //         "mt": {
  //             "name": "Maltese",
  //             "nativeName": "Malti"
  //         },
  //         "mi": {
  //             "name": "MÄori",
  //             "nativeName": "te reo MÄori"
  //         },
  //         "mr": {
  //             "name": "Marathi (MarÄá¹­hÄ«)",
  //             "nativeName": "à¤®à¤°à¤¾à¤ à¥€"
  //         },
  //         "mh": {
  //             "name": "Marshallese",
  //             "nativeName": "Kajin MÌ§ajeÄ¼"
  //         },
  //         "mn": {
  //             "name": "Mongolian",
  //             "nativeName": "Ð¼Ð¾Ð½Ð³Ð¾Ð»"
  //         },
  //         "na": {
  //             "name": "Nauru",
  //             "nativeName": "EkakairÅ© Naoero"
  //         },
  //         "nv": {
  //             "name": "Navajo, Navaho",
  //             "nativeName": "DinÃ© bizaad, DinÃ©kÊ¼ehÇ°Ã­"
  //         },
  //         "nb": {
  //             "name": "Norwegian BokmÃ¥l",
  //             "nativeName": "Norsk bokmÃ¥l"
  //         },
  //         "nd": {
  //             "name": "North Ndebele",
  //             "nativeName": "isiNdebele"
  //         },
  //         "ne": {
  //             "name": "Nepali",
  //             "nativeName": "à¤¨à¥‡à¤ªà¤¾à¤²à¥€"
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
  //             "nativeName": "ê†ˆêŒ ê’¿ Nuosuhxop"
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
  //             "nativeName": "áŠá“‚á”‘á“ˆá¯á’§áŽá“"
  //         },
  //         "cu": {
  //             "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
  //             "nativeName": "Ñ©Ð·Ñ‹ÐºÑŠ ÑÐ»Ð¾Ð²Ñ£Ð½ÑŒÑÐºÑŠ"
  //         },
  //         "om": {
  //             "name": "Oromo",
  //             "nativeName": "Afaan Oromoo"
  //         },
  //         "or": {
  //             "name": "Oriya",
  //             "nativeName": "à¬“à¬¡à¬¼à¬¿à¬†"
  //         },
  //         "os": {
  //             "name": "Ossetian, Ossetic",
  //             "nativeName": "Ð¸Ñ€Ð¾Ð½ Ã¦Ð²Ð·Ð°Ð³"
  //         },
  //         "pa": {
  //             "name": "Panjabi, Punjabi",
  //             "nativeName": "à¨ªà©°à¨œà¨¾à¨¬à©€, Ù¾Ù†Ø¬Ø§Ø¨ÛŒâ€Ž"
  //         },
  //         "pi": {
  //             "name": "PÄli",
  //             "nativeName": "à¤ªà¤¾à¤´à¤¿"
  //         },
  //         "fa": {
  //             "name": "Persian",
  //             "nativeName": "ÙØ§Ø±Ø³ÛŒ"
  //         },
  //         "pl": {
  //             "name": "Polish",
  //             "nativeName": "polski"
  //         },
  //         "ps": {
  //             "name": "Pashto, Pushto",
  //             "nativeName": "Ù¾ÚšØªÙˆ"
  //         },
  //         "pt": {
  //             "name": "Portuguese",
  //             "nativeName": "PortuguÃªs"
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
  //             "nativeName": "romÃ¢nÄƒ"
  //         },
  //         "ru": {
  //             "name": "Russian",
  //             "nativeName": "Ñ€ÑƒÑÑÐºÐ¸Ð¹ ÑÐ·Ñ‹Ðº"
  //         },
  //         "sa": {
  //             "name": "Sanskrit (Saá¹ská¹›ta)",
  //             "nativeName": "à¤¸à¤‚à¤¸à¥à¤•à¥ƒà¤¤à¤®à¥"
  //         },
  //         "sc": {
  //             "name": "Sardinian",
  //             "nativeName": "sardu"
  //         },
  //         "sd": {
  //             "name": "Sindhi",
  //             "nativeName": "à¤¸à¤¿à¤¨à¥à¤§à¥€, Ø³Ù†ÚŒÙŠØŒ Ø³Ù†Ø¯Ú¾ÛŒâ€Ž"
  //         },
  //         "se": {
  //             "name": "Northern Sami",
  //             "nativeName": "DavvisÃ¡megiella"
  //         },
  //         "sm": {
  //             "name": "Samoan",
  //             "nativeName": "gagana faa Samoa"
  //         },
  //         "sg": {
  //             "name": "Sango",
  //             "nativeName": "yÃ¢ngÃ¢ tÃ® sÃ¤ngÃ¶"
  //         },
  //         "sr": {
  //             "name": "Serbian",
  //             "nativeName": "ÑÑ€Ð¿ÑÐºÐ¸ Ñ˜ÐµÐ·Ð¸Ðº"
  //         },
  //         "gd": {
  //             "name": "Scottish Gaelic; Gaelic",
  //             "nativeName": "GÃ idhlig"
  //         },
  //         "sn": {
  //             "name": "Shona",
  //             "nativeName": "chiShona"
  //         },
  //         "si": {
  //             "name": "Sinhala, Sinhalese",
  //             "nativeName": "à·ƒà·’à¶‚à·„à¶½"
  //         },
  //         "sk": {
  //             "name": "Slovak",
  //             "nativeName": "slovenÄina"
  //         },
  //         "sl": {
  //             "name": "Slovene",
  //             "nativeName": "slovenÅ¡Äina"
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
  //             "nativeName": "espaÃ±ol, castellano"
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
  //             "nativeName": "à®¤à®®à®¿à®´à¯"
  //         },
  //         "te": {
  //             "name": "Telugu",
  //             "nativeName": "à°¤à±†à°²à±à°—à±"
  //         },
  //         "tg": {
  //             "name": "Tajik",
  //             "nativeName": "Ñ‚Ð¾Ò·Ð¸ÐºÓ£, toÄŸikÄ«, ØªØ§Ø¬ÛŒÚ©ÛŒâ€Ž"
  //         },
  //         "th": {
  //             "name": "Thai",
  //             "nativeName": "à¹„à¸—à¸¢"
  //         },
  //         "ti": {
  //             "name": "Tigrinya",
  //             "nativeName": "á‰µáŒáˆ­áŠ›"
  //         },
  //         "bo": {
  //             "name": "Tibetan Standard, Tibetan, Central",
  //             "nativeName": "à½–à½¼à½‘à¼‹à½¡à½²à½‚"
  //         },
  //         "tk": {
  //             "name": "Turkmen",
  //             "nativeName": "TÃ¼rkmen, Ð¢Ò¯Ñ€ÐºÐ¼ÐµÐ½"
  //         },
  //         "tl": {
  //             "name": "Tagalog",
  //             "nativeName": "Wikang Tagalog, áœáœ’áœƒáœ…áœ” áœ†áœ„áœŽáœ“áœ„áœ”"
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
  //             "nativeName": "TÃ¼rkÃ§e"
  //         },
  //         "ts": {
  //             "name": "Tsonga",
  //             "nativeName": "Xitsonga"
  //         },
  //         "tt": {
  //             "name": "Tatar",
  //             "nativeName": "Ñ‚Ð°Ñ‚Ð°Ñ€Ñ‡Ð°, tatarÃ§a, ØªØ§ØªØ§Ø±Ú†Ø§â€Ž"
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
  //             "nativeName": "UyÆ£urqÉ™, Ø¦Û‡ÙŠØºÛ‡Ø±Ú†Û•â€Ž"
  //         },
  //         "uk": {
  //             "name": "Ukrainian",
  //             "nativeName": "ÑƒÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÐ°"
  //         },
  //         "ur": {
  //             "name": "Urdu",
  //             "nativeName": "Ø§Ø±Ø¯Ùˆ"
  //         },
  //         "uz": {
  //             "name": "Uzbek",
  //             "nativeName": "zbek, ÐŽÐ·Ð±ÐµÐº, Ø£Û‡Ø²Ø¨ÛÙƒâ€Ž"
  //         },
  //         "ve": {
  //             "name": "Venda",
  //             "nativeName": "Tshivená¸“a"
  //         },
  //         "vi": {
  //             "name": "Vietnamese",
  //             "nativeName": "Tiáº¿ng Viá»‡t"
  //         },
  //         "vo": {
  //             "name": "VolapÃ¼k",
  //             "nativeName": "VolapÃ¼k"
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
  //             "nativeName": "×™×™Ö´×“×™×©"
  //         },
  //         "yo": {
  //             "name": "Yoruba",
  //             "nativeName": "YorÃ¹bÃ¡"
  //         },
  //         "za": {
  //             "name": "Zhuang, Chuang",
  //             "nativeName": "SaÉ¯ cueÅ‹Æ…, Saw cuengh"
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
