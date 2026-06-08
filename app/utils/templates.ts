export const passwordResetTemplate = (): string => {
  return `
      <!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title>Welcome to Mysore Minds</title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
    body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
    table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
    img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
    p { display:block;margin:13px 0; }</style><!--[if mso]>
  <noscript>
  <xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  </noscript>
  <![endif]--><!--[if lte mso 11]>
  <style type="text/css">
    .mj-outlook-group-fix { width:100% !important; }
  </style>
  <![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600&display=swap);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px) {
  .mj-column-per-100 { width:100% !important; max-width: 100%; }
  .mj-column-per-50 { width:50% !important; max-width: 50%; }
  }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
  .moz-text-html .mj-column-per-50 { width:50% !important; max-width: 50%; }</style><style type="text/css">@media only screen and (max-width:480px) {
  table.mj-full-width-mobile { width: 100% !important; }
  td.mj-full-width-mobile { width: auto !important; }
  }</style><!-- Import Public Sans font --><!-- Apply Public Sans globally --></head><body style="word-spacing:normal;background-color:#f4efed;"><div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Welcome email with login credentials</div><div style="background-color:#f4efed;"><!-- Header with logos --><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#f4efed" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="background:#f4efed;background-color:#f4efed;margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4efed;background-color:#f4efed;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:10px 0 25px 0;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="width:600px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;"><!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td style="vertical-align:middle;width:300px;" ><![endif]--><div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:50%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"><tbody><tr><td align="left" style="font-size:0px;padding:10px 0 0 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:90px;"><img height="80" src="{{FRONTEND_CLIENT_URL}}/logos/mysoreminds.png" style="border:0;display:block;outline:none;text-decoration:none;height:80px;width:100%;font-size:13px;" width="90"></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td style="vertical-align:middle;width:300px;" ><![endif]--><div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:50%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"><tbody><tr><td align="right" style="font-size:0px;padding:10px 25px 0 0;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:150px;"><img height="auto" src="{{FRONTEND_CLIENT_URL}}/logos/digi-trac.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150"></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--><!-- Full-width white section --><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"><tbody><tr><td><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td style="vertical-align:top;padding:20px 17px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:10px;word-break:break-word;"><div style="font-family:Public Sans, sans-serif;font-size:16px;font-weight:600;line-height:22px;text-align:left;color:#333333;">Hi {{FIRST_NAME}},</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Public Sans, sans-serif;font-size:14px;line-height:22px;text-align:left;color:#333333;">Welcome to Mysore Minds! We're thrilled to have you on board and look forward to delivering innovative solutions tailored to your needs. Your unique company code is {{COMPANY_CODE}}, which represents your affiliation with Mysore Minds. Please refer to this code for any official inquiries and system logins.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Public Sans, sans-serif;font-size:14px;line-height:22px;text-align:left;color:#333333;"><b>Company code:</b> <span style="color: #c09966">{{COMPANY_CODE}}</span><br><b>Username:</b> <span style="color: #c09966">{{USERNAME}}</span><br><b>Password:</b> <span style="color: #c09966">{{PASSWORD}}</span></div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Public Sans, sans-serif;font-size:14px;line-height:22px;text-align:left;color:#333333;">To help protect your data and ensure secure usage of our systems, we strongly recommend that you follow basic safety practices. These include keeping your login credentials confidential, changing your temporary password upon your first login, avoiding the sharing of your company code, and reporting any suspicious activity to our support team without delay.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;"><div style="font-family:Public Sans, sans-serif;font-size:14px;line-height:22px;text-align:left;color:#333333;">Best Regards,<br><span style="color: #c09966">Mysore Minds</span></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table><!-- Footer --><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#f4efed" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="background:#f4efed;background-color:#f4efed;margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4efed;background-color:#f4efed;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:560px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Public Sans, sans-serif;font-size:12px;line-height:22px;text-align:center;color:#333333;">Mysore Minds Pvt. Ltd.<br>123 Innovation Hub, Tech District<br>Mysore, Karnataka 570001, India<br>CIN: U72900KA2024PTC123456</div></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--> <!-- Footer Links with Border --><!-- <mj-wrapper
  border-top="1px solid #D9D9D9"
  border-bottom="1px solid #D9D9D9"
  border-radius="4px"
  padding="0px 20px"
  background-color="#f4efed"
  >
  <mj-section padding="10px 0">
  <mj-column>
    <mj-text font-size="12px" align="center" color="#999999">
      <a
        href="#"
        style="
          color: #c09966;
          text-decoration: underline;
          text-underline-offset: 3px;
          margin: 0 5px;
        "
      >
        Privacy policy
      </a>
      ·
      <a
        href="#"
        style="
          color: #c09966;
          text-decoration: underline;
          text-underline-offset: 3px;
          margin: 0 5px;
        "
      >
        Terms of service
      </a>
      ·
      <a
        href="#"
        style="
          color: #c09966;
          text-decoration: underline;
          text-underline-offset: 3px;
          margin: 0 5px;
        "
      >
        Help center
      </a>
      ·
      <a
        href="#"
        style="
          color: #c09966;
          text-decoration: underline;
          text-underline-offset: 3px;
          margin: 0 5px;
        "
      >
        Unsubscribe
      </a>
    </mj-text>
  </mj-column>
  </mj-section>
  </mj-wrapper> --><!-- Footer Copyright --><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#f4efed" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="background:#f4efed;background-color:#f4efed;margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4efed;background-color:#f4efed;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:10px 20px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:560px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Public Sans, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#000000;">© 2025 Mysore Minds. All rights reserved.<br>If you have any questions or need assistance, please feel free to contact our support team.</div></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>
    `;
};
