//sheetClient.js

import { google } from "googleapis";

import key from "../secrets.json" assert { type: "json" };

export const sheetId = "1hqy19aeH9c6vCrq1vT-Nhy_iSViHUHupWT4GCGGwtbk";

const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

const sheets = new google.sheets({ version: "v4", auth: client });

export default sheets;
