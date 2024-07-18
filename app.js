//app.js
import express from "express";

import sheets, { sheetId } from "./utils/sheetClient.js";

import { z, ZodError } from "zod";

const app = express();

app.use(express.json());

const userFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "email is required" }),
  message: z.string().min(0, { message: "message should be present" }),
});

// A, B, C... are the rolumns
// 1,2,3,4,5,6,7,8,9 are the rows
// A1 is the first column of the first row
// A3 is the first column of the third row
// D8 would be 8th column of the 4th row

app.post("/sendData", async (req, res) => {
  try {
    let userData = userFormSchema.parse(req.body);

    userData = Object.values(userData);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:C", //name of the sheet
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "RAW",
      requestBody: { values: [userData] },
    });

    res.status(200).json({ message: "insertation successfull" });
  } catch (error) {
    if (error instanceof ZodError || error instanceof z.ZodError)
      // both the ways are are correct and will be same so implement any one of these
      return res
        .status(400)
        .json({ message: error?.errors?.[0]?.message ?? error.message });
  }
});

app.get("/getData", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "contactInfo!A2",
    });
    res.status(200).json({ message: "insertation successfull" });
  } catch (error) {
    return res.status(400).json({ message: "Err: " + error });
  }
});

app.get("/updateData", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "contactInfo!C2",
      valueInputOption: "RAW",
      resource: { values: [["Updated Value"]] },
    });

    res.status(200).json({ message: "insertation successfull" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Err: " + error });
  }
});

app.get("/deleteData", async (req, res) => {
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: "contactInfo!C2",
    });
    res.status(200).json({ message: "insertation successfull" });
  } catch (error) {
    return res.status(400).json({ message: "Err: " + error });
  }
});

app.listen(5000, () => {
  console.log("http://localhost:5000");
});
