const timezones = {
  "(GMT-11:00) Midway Island": "Pacific/Midway",
  "(GMT-11:00) Samoa": "US/Samoa",
  "(GMT-10:00) Hawaii": "US/Hawaii",
  "(GMT-09:00) Alaska": "US/Alaska",
  "(GMT-08:00) Pacific Time (US & Canada)": "US/Pacific",
  "(GMT-08:00) Tijuana": "America/Tijuana",
  "(GMT-07:00) Arizona": "US/Arizona",
  "(GMT-07:00) Chihuahua": "America/Chihuahua",
  "(GMT-07:00) Mazatlan": "America/Mazatlan",
  "(GMT-07:00) Mountain Time (US & Canada)": "US/Mountain",
  "(GMT-06:00) Central Time (US & Canada)": "US/Central",
  "(GMT-06:00) Mexico City": "America/Mexico_City",
  "(GMT-06:00) Monterrey": "America/Monterrey",
  "(GMT-06:00) Saskatchewan": "Canada/Saskatchewan",
  "(GMT-05:00) Bogota": "America/Bogota",
  "(GMT-05:00) Eastern Time (US & Canada)": "US/Eastern",
  "(GMT-05:00) Indiana (East)": "US/East-Indiana",
  "(GMT-05:00) Lima": "America/Lima",
  "(GMT-04:30) Caracas": "America/Caracas",
  "(GMT-04:00) Atlantic Time (Canada)": "Canada/Atlantic",
  "(GMT-04:00) La Paz": "America/La_Paz",
  "(GMT-04:00) Santiago": "America/Santiago",
  "(GMT-03:30) Newfoundland": "Canada/Newfoundland",
  "(GMT-03:00) Buenos Aires": "America/Buenos_Aires",
  "(GMT-03:00) Greenland": "Greenland",
  "(GMT-02:00) Stanley": "Atlantic/Stanley",
  "(GMT-01:00) Azores": "Atlantic/Azores",
  "(GMT-01:00) Cape Verde Is.": "Atlantic/Cape_Verde",
  "(GMT-01:00) Praia": "Atlantic/Cape_Verde", // Added
  "(GMT+00:00) Accra": "Africa/Accra", // Added
  "(GMT+00:00) Bamako": "Africa/Bamako", // Added
  "(GMT+00:00) Banjul": "Africa/Banjul", // Added
  "(GMT+00:00) Bissau": "Africa/Bissau", // Added
  "(GMT+00:00) Conakry": "Africa/Conakry", // Added
  "(GMT+00:00) Dakar": "Africa/Dakar", // Added
  "(GMT+00:00) Dublin": "Europe/Dublin",
  "(GMT+00:00) Freetown": "Africa/Freetown", // Added
  "(GMT+00:00) Lisbon": "Europe/Lisbon",
  "(GMT+00:00) Lome": "Africa/Lome", // Added
  "(GMT+00:00) London": "Europe/London",
  "(GMT+00:00) Monrovia": "Africa/Monrovia", // Key Updated from (GMT)
  "(GMT+00:00) Nouakchott": "Africa/Nouakchott", // Added
  "(GMT+00:00) Ouagadougou": "Africa/Ouagadougou", // Added
  "(GMT+00:00) Sao Tome": "Africa/Sao_Tome", // Added
  "(GMT+00:00) Yamoussoukro": "Africa/Abidjan", // Added
  "(GMT+01:00) Abuja": "Africa/Lagos", // Added
  "(GMT+01:00) Algiers": "Africa/Algiers", // Added
  "(GMT+01:00) Amsterdam": "Europe/Amsterdam",
  "(GMT+01:00) Bangui": "Africa/Bangui", // Added
  "(GMT+01:00) Belgrade": "Europe/Belgrade",
  "(GMT+01:00) Berlin": "Europe/Berlin",
  "(GMT+01:00) Bratislava": "Europe/Bratislava",
  "(GMT+01:00) Brazzaville": "Africa/Brazzaville", // Added
  "(GMT+01:00) Brussels": "Europe/Brussels",
  "(GMT+01:00) Budapest": "Europe/Budapest",
  "(GMT+01:00) Copenhagen": "Europe/Copenhagen",
  "(GMT+01:00) Kinshasa": "Africa/Kinshasa", // Added
  "(GMT+01:00) Libreville": "Africa/Libreville", // Added
  "(GMT+01:00) Ljubljana": "Europe/Ljubljana",
  "(GMT+01:00) Luanda": "Africa/Luanda", // Added
  "(GMT+01:00) Madrid": "Europe/Madrid",
  "(GMT+01:00) Malabo": "Africa/Malabo", // Added
  "(GMT+01:00) N'Djamena": "Africa/Ndjamena", // Added
  "(GMT+01:00) Niamey": "Africa/Niamey", // Added
  "(GMT+01:00) Paris": "Europe/Paris",
  "(GMT+01:00) Porto-Novo": "Africa/Porto-Novo", // Added
  "(GMT+01:00) Prague": "Europe/Prague",
  "(GMT+01:00) Rabat": "Africa/Casablanca", // Added (Replaced Casablanca)
  "(GMT+01:00) Rome": "Europe/Rome",
  "(GMT+01:00) Sarajevo": "Europe/Sarajevo",
  "(GMT+01:00) Skopje": "Europe/Skopje",
  "(GMT+01:00) Stockholm": "Europe/Stockholm",
  "(GMT+01:00) Tunis": "Africa/Tunis", // Added
  "(GMT+01:00) Vienna": "Europe/Vienna",
  "(GMT+01:00) Warsaw": "Europe/Warsaw",
  "(GMT+01:00) Yaounde": "Africa/Douala", // Added
  "(GMT+01:00) Zagreb": "Europe/Zagreb",
  "(GMT+02:00) Athens": "Europe/Athens",
  "(GMT+02:00) Bucharest": "Europe/Bucharest",
  "(GMT+02:00) Cairo": "Africa/Cairo",
  "(GMT+02:00) Gaborone": "Africa/Gaborone", // Added
  "(GMT+02:00) Gitega": "Africa/Bujumbura", // Added
  "(GMT+02:00) Harare": "Africa/Harare",
  "(GMT+02:00) Helsinki": "Europe/Helsinki",
  "(GMT+02:00) Istanbul": "Europe/Istanbul",
  "(GMT+02:00) Jerusalem": "Asia/Jerusalem",
  "(GMT+02:00) Juba": "Africa/Juba", // Added
  "(GMT+02:00) Khartoum": "Africa/Khartoum", // Added
  "(GMT+02:00) Kigali": "Africa/Kigali", // Added
  "(GMT+02:00) Kyiv": "Europe/Kiev",
  "(GMT+02:00) Lilongwe": "Africa/Blantyre", // Added
  "(GMT+02:00) Lusaka": "Africa/Lusaka", // Added
  "(GMT+02:00) Maputo": "Africa/Maputo", // Added
  "(GMT+02:00) Maseru": "Africa/Maseru", // Added
  "(GMT+02:00) Mbabane": "Africa/Mbabane", // Added
  "(GMT+02:00) Minsk": "Europe/Minsk",
  "(GMT+02:00) Pretoria": "Africa/Johannesburg", // Added
  "(GMT+02:00) Riga": "Europe/Riga",
  "(GMT+02:00) Sofia": "Europe/Sofia",
  "(GMT+02:00) Tallinn": "Europe/Tallinn",
  "(GMT+02:00) Tripoli": "Africa/Tripoli", // Added
  "(GMT+02:00) Vilnius": "Europe/Vilnius",
  "(GMT+02:00) Windhoek": "Africa/Windhoek", // Added
  "(GMT+03:00) Addis Ababa": "Africa/Addis_Ababa", // Added
  "(GMT+03:00) Antananarivo": "Indian/Antananarivo", // Added
  "(GMT+03:00) Asmara": "Africa/Asmara", // Added
  "(GMT+03:00) Baghdad": "Asia/Baghdad",
  "(GMT+03:00) Djibouti": "Africa/Djibouti", // Added
  "(GMT+03:00) Dodoma": "Africa/Dar_es_Salaam", // Added
  "(GMT+03:00) Kampala": "Africa/Kampala",
  "(GMT+03:00) Kuwait": "Asia/Kuwait",
  "(GMT+03:00) Mogadishu": "Africa/Mogadishu", // Added
  "(GMT+03:00) Moroni": "Indian/Comoro", // Added
  "(GMT+03:00) Moscow": "Europe/Moscow",
  "(GMT+03:00) Nairobi": "Africa/Nairobi", // Added
  "(GMT+03:00) Riyadh": "Asia/Riyadh",
  "(GMT+03:30) Tehran": "Asia/Tehran",
  "(GMT+04:00) Baku": "Asia/Baku",
  "(GMT+04:00) Muscat": "Asia/Muscat",
  "(GMT+04:00) Port Louis": "Indian/Mauritius", // Added
  "(GMT+04:00) Tbilisi": "Asia/Tbilisi",
  "(GMT+04:00) Victoria": "Indian/Mahe", // Added (Seychelles)
  "(GMT+04:00) Volgograd": "Europe/Volgograd",
  "(GMT+04:00) Yerevan": "Asia/Yerevan",
  "(GMT+04:30) Kabul": "Asia/Kabul",
  "(GMT+05:00) Karachi": "Asia/Karachi",
  "(GMT+05:00) Tashkent": "Asia/Tashkent",
  "(GMT+05:30) Kolkata": "Asia/Kolkata",
  "(GMT+05:45) Kathmandu": "Asia/Kathmandu",
  "(GMT+06:00) Almaty": "Asia/Almaty",
  "(GMT+06:00) Dhaka": "Asia/Dhaka",
  "(GMT+06:00) Ekaterinburg": "Asia/Yekaterinburg",
  "(GMT+07:00) Bangkok": "Asia/Bangkok",
  "(GMT+07:00) Jakarta": "Asia/Jakarta",
  "(GMT+07:00) Novosibirsk": "Asia/Novosibirsk",
  "(GMT+08:00) Chongqing": "Asia/Chongqing",
  "(GMT+08:00) Hong Kong": "Asia/Hong_Kong",
  "(GMT+08:00) Krasnoyarsk": "Asia/Krasnoyarsk",
  "(GMT+08:00) Kuala Lumpur": "Asia/Kuala_Lumpur",
  "(GMT+08:00) Perth": "Australia/Perth",
  "(GMT+08:00) Singapore": "Asia/Singapore",
  "(GMT+08:00) Taipei": "Asia/Taipei",
  "(GMT+08:00) Ulaan Bataar": "Asia/Ulaanbaatar",
  "(GMT+08:00) Urumqi": "Asia/Urumqi",
  "(GMT+09:00) Irkutsk": "Asia/Irkutsk",
  "(GMT+09:00) Seoul": "Asia/Seoul",
  "(GMT+09:00) Tokyo": "Asia/Tokyo",
  "(GMT+09:30) Adelaide": "Australia/Adelaide",
  "(GMT+09:30) Darwin": "Australia/Darwin",
  "(GMT+10:00) Brisbane": "Australia/Brisbane",
  "(GMT+10:00) Canberra": "Australia/Canberra",
  "(GMT+10:00) Guam": "Pacific/Guam",
  "(GMT+10:00) Hobart": "Australia/Hobart",
  "(GMT+10:00) Melbourne": "Australia/Melbourne",
  "(GMT+10:00) Port Moresby": "Pacific/Port_Moresby",
  "(GMT+10:00) Sydney": "Australia/Sydney",
  "(GMT+10:00) Yakutsk": "Asia/Yakutsk",
  "(GMT+11:00) Vladivostok": "Asia/Vladivostok",
  "(GMT+12:00) Auckland": "Pacific/Auckland",
  "(GMT+12:00) Fiji": "Pacific/Fiji",
  "(GMT+12:00) Magadan": "Asia/Magadan"
}
const timezonesList = Object.values(timezones).sort();

function getGMTLabelFromTimezone(tz) {
  for (const [label, value] of Object.entries(timezones)) {
    if (value === tz) {
      return label;
    }
  }
  return null; // not found
}

function getGMTOffset(tz) {
  const label = getGMTLabelFromTimezone(tz);
  if (label) {
    const match = label.match(/\(GMT[+-]\d{2}:\d{2}\)/);
    return match ? match[0].replace(/[()]/g, '') : null;
  }
  return null;
}

export {getGMTOffset, timezonesList};