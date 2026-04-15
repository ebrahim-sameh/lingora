/**
 * Map of language code → Cartesia Sonic-3 voice id.
 *
 * These are default multilingual voices from Cartesia's public voice library.
 * v2 will allow users to upload voice clones and store per-user mappings in the DB.
 *
 * The fallback voice (`DEFAULT_VOICE_ID`) is Sonic's multilingual voice which
 * handles any language Sonic-3 supports. Override on a per-language basis below
 * when a specific native voice produces noticeably better output.
 */

export const DEFAULT_VOICE_ID = '79a125e8-cd45-4c13-8a67-188112f4dd22';

export const VOICE_MAP: Record<string, string> = {
  en: '79a125e8-cd45-4c13-8a67-188112f4dd22',
  'en-GB': 'a0e99841-438c-4a64-b679-ae501e7d6091',
  es: '846d6cb0-2301-48b6-9683-48f5618ea2f6',
  'es-MX': '15a9cd88-84b0-4a8b-95f2-5d583b54c72e',
  fr: 'a8a1eb38-5f15-4c1d-8722-7ac0f329727d',
  'fr-CA': 'a249eaff-1e96-4d2c-b23b-12efa4f66f41',
  de: '3f4ade23-6eb4-4279-ab05-6a144947c4d5',
  it: '0e99d967-0d3d-48b6-b4a5-7e6a2f3d8e13',
  pt: 'd4d4b115-57a0-48ea-9a1a-9898966c2966',
  'pt-BR': '5c5ad5e7-1020-476b-8b91-fdcbe9cc313c',
  nl: '4f8651b0-bbbd-46ac-8b37-5168c5923303',
  pl: '82a7fc13-2927-4e42-9b8a-bb1f9e506521',
  ru: 'd2b2e9fb-d5d1-4f9e-8c2b-7e4d4b3b3e22',
  uk: '779673f3-895f-4935-b6b5-b031dc78b319',
  cs: 'e3e43a8a-18bc-4d82-8aa2-3b5c36e69b70',
  sv: '38aabb6a-f52b-4fb0-a3d1-988518f4dc06',
  no: '7e6b5fef-d2b9-471b-9b90-bd3e9dcf9c16',
  da: '3dcaa773-fb5f-41df-9b70-a1a85cd4c4a4',
  fi: '8d0a40eb-2db0-4d51-b2bc-a9e47e9bca8a',
  tr: 'bf0a246a-8642-498a-9950-80c35e9276b5',
  ar: '87bc56aa-ab01-4baa-9071-77d497064686',
  he: '95d51f79-c397-46f9-b49a-23763d3eaa2d',
  fa: '7fe6faca-9b6a-4aa1-9f37-5e3f2a1e4a48',
  hi: '7f423809-0011-4658-ba48-a411f5e516ba',
  bn: 'a0a9dcdd-7d0e-4a4e-8e78-d4a7e6c14a5d',
  ur: 'c99e9b45-cd0a-4a36-9c6e-c6ea0b2d10b1',
  ta: '28e9f19a-2fdb-4bf4-b70d-5c6dda77b23f',
  te: '9cebb910-d4b7-4a4a-85a4-12c5139b6b04',
  zh: '3a63e2d1-1c1e-425d-8e79-5100bc910e90',
  'zh-TW': 'eda5bbff-1ff1-4886-8ef1-4e69a77640a0',
  ja: '2b568345-1d48-4047-b25f-7baccf842eb0',
  ko: '304fdbd8-65e6-40d6-ab78-f9d18b9efdf9',
  vi: '0f0b7d8a-b40e-4e64-ada2-7e6d5f0e9712',
  th: 'd47f03c8-44e3-4d20-b4b2-8c4a1e5f9b6d',
  id: 'a3788fbd-27c2-49d3-a00c-0f93c9a94962',
  ms: '872f4166-7d0f-4b1b-acf3-f2b2e3f5b1b8',
  tl: '846fa30b-6e1a-41b9-b0a7-533231f8c3c4',
  sw: 'b5d8f1e2-6f1c-4d5e-8a9b-3c7d4e5f6a7b',
};

export function getVoiceForLanguage(languageCode: string): string {
  return VOICE_MAP[languageCode] ?? DEFAULT_VOICE_ID;
}
