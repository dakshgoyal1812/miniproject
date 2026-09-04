/**
 * SmartQueue — Google Apps Script
 * ================================
 * Deploy this in Google Apps Script (script.google.com) as a Web App.
 * 
 * SETUP:
 * 1. Go to https://script.google.com → New Project
 * 2. Paste this entire code into Code.gs
 * 3. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployed URL and put it in .env as APPS_SCRIPT_URL
 * 5. First run will ask for permissions — allow all (Mail, Spreadsheets, Drive)
 * 
 * MANIFEST (appsscript.json) — Add these scopes if needed:
 * {
 *   "oauthScopes": [
 *     "https://www.googleapis.com/auth/spreadsheets",
 *     "https://www.googleapis.com/auth/drive",
 *     "https://www.googleapis.com/auth/script.send_mail"
 *   ]
 * }
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { patientName, patientEmail, patientPhone, doctorEmail, doctor, hospital, date, time, bookingId, concern } = data;

    // 1. Confirmation email to patient (only if email provided)
    if (patientEmail) {
      sendPatientConfirmation(patientEmail, patientName, doctor, hospital, date, time, bookingId);
    }

    // 2. Excel sheet with appointment details to doctor (only if email provided)
    if (doctorEmail) {
      sendDoctorExcelSheet(doctorEmail, { patientName, patientPhone, doctor, hospital, date, time, bookingId, concern });
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendPatientConfirmation(toEmail, patientName, doctor, hospital, date, time, bookingId) {
  const subject = "✅ Appointment Confirmed - Smart Queue [" + bookingId + "]";
  
  const body = `Namaste ${patientName} ji,

Aapki appointment confirm ho gayi hai! 🎉

📋 Booking Details:
━━━━━━━━━━━━━━━━━━
🏥 Hospital: ${hospital}
👨‍⚕️ Doctor: ${doctor}
📅 Date: ${date}
🕐 Time: ${time}
🎫 Token: ${bookingId}
━━━━━━━━━━━━━━━━━━

📌 Important:
• Please 10-15 minutes pehle pahunch jaayein
• Apni purani prescriptions saath laaein
• Agar cancel karna ho toh Smart Queue app se karein

Thank you for choosing Smart Queue!

Warm regards,
Smart Queue Team
🏥 Your Health, Our Priority`;

  MailApp.sendEmail(toEmail, subject, body);
}

function sendDoctorExcelSheet(doctorEmail, appointment) {
  // Create temporary Google Sheet
  const ss = SpreadsheetApp.create("SmartQueue_Appointment_" + appointment.bookingId);
  const sheet = ss.getActiveSheet();
  sheet.setName("Appointment Details");
  
  // Header row (bold)
  const headerRange = sheet.getRange(1, 1, 1, 7);
  sheet.appendRow(["Booking ID", "Patient Name", "Phone", "Doctor", "Date", "Time", "Concern"]);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#101828");
  headerRange.setFontColor("#FFFFFF");
  
  // Data row
  sheet.appendRow([
    appointment.bookingId,
    appointment.patientName,
    appointment.patientPhone,
    appointment.doctor,
    appointment.date,
    appointment.time,
    appointment.concern || "General Consultation"
  ]);
  
  // Auto-resize columns
  for (var i = 1; i <= 7; i++) {
    sheet.autoResizeColumn(i);
  }
  
  SpreadsheetApp.flush();

  // Export as .xlsx
  const url = "https://docs.google.com/spreadsheets/d/" + ss.getId() + "/export?format=xlsx";
  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + token },
  });
  const xlsxBlob = response.getBlob().setName(appointment.bookingId + "_" + appointment.patientName + ".xlsx");

  // Send email to doctor with Excel attachment
  MailApp.sendEmail({
    to: doctorEmail,
    subject: "🏥 New Appointment - " + appointment.patientName + " [" + appointment.bookingId + "]",
    body: `Dear ${appointment.doctor},

A new appointment has been booked via Smart Queue:

Patient: ${appointment.patientName}
Phone: ${appointment.patientPhone}
Date: ${appointment.date}
Time: ${appointment.time}
Concern: ${appointment.concern || "General Consultation"}
Booking ID: ${appointment.bookingId}

The complete appointment details are attached as an Excel sheet.

— Smart Queue System`,
    attachments: [xlsxBlob],
  });

  // Clean up — trash the temp spreadsheet
  DriveApp.getFileById(ss.getId()).setTrashed(true);
}
