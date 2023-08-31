export const config = {
  siteInfo: {
    name: "Confidential Clothing",
    description: "Clothing Brand",
    instagram: "https://www.instagram.com/confidentialclo/",
    domain: "https://www.confidentialclo.com",
  },

  stripe: {
    clientSecret:
      "sk_test_51Km6AdLiR1OAlqsJwFZ74rmLosYUWEBOXiJ0hn7L0bfoyoi5Sthu7BqKuyOCJ4ov9j3vHkOXAZzT7xJqmi80Y6hO00BdIZNKZ2",
    publishableKey:
      "pk_test_51Km6AdLiR1OAlqsJcc5Lq7PIc5tOTe6VMZbQ3ilsUWhW6Cw9YqcmJEWBQpwTaeDy3O8B6vVvpSGyECv6UcZ7EBGd00q6bEydkc",
    webhookSecret:
      "whsec_81b20b581b6bfee164298d2d74defb3677dd3570c817404d7a2c36898a9b8590",
  },

  supabase: {
    url: "https://agturycpruntfrbwqehu.supabase.co",
    apiKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndHVyeWNwcnVudGZyYndxZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA3MzY3OTUsImV4cCI6MjAwNjMxMjc5NX0.ycsJ8MzHUXdJ5Mn_MTBVlrbVXtNV9cQ-eIYqgg_CBz4",
  },

  emails: {
    transporter: {
      host: "smtp.zoho.com",
      port: "465",
      secure: true,
      auth: {
        user: "noreply@xolify.store",
        pass: "Waleed7867$!",
      },
    },
    html: "<div style='padding: 1em; word-break: break-word; word-wrap: break-word;'><img src='{LOGO}' width='125px' height='125px' style='text-align: center; margin-left: auto; margin-right: auto;'><h2 stype='padding-bottom: 8px; width: 70%; margin-left: auto; margin-right: auto; border-bottom: solid 2px black'>{SITE_NAME}</h2><hr> <p style='text-align: start; padding-bottom: 1em;'>{REPLACE_CONTENT}</p><hr><a href='{DOMAIN}/account' style='padding: 1em;' target='_blank'>Change Communication Preferences</a></div>",
  },

  resend: {
    apiKey: "re_X9ap6WEs_KbDFTKKZ1fCEbgM7Xp36kGJk",
  },

  google: {
    clientId:
      "777443537845-ei2lalr4f52pmkrc9u12n5rbg0kf7igm.apps.googleusercontent.com",
    clientSecret: "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",
  },
};
