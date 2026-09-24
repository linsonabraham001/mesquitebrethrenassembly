Setting up EmailJS for the survey form (survey/index.html)
============================================================

The survey page is fully built and working in the browser (try it locally
first), but submissions won't actually go anywhere until you connect an
EmailJS account. EmailJS sends form data straight to your inbox — no
server needed.

1. Sign up free at https://www.emailjs.com (free tier: 200 emails/month).

2. Add an Email Service (Email Services -> Add New Service). Connect the
   Gmail/Outlook/etc. inbox you want survey responses delivered to. This
   gives you a SERVICE ID (looks like "service_abc1234").

3. Create an Email Template (Email Templates -> Create New Template).
   Build it using these variables — they must match the form field
   `name` attributes exactly:
     {{helpfulness}}      - 1-5 rating for the food kit
     {{needs}}            - biggest needs besides food (free text)
     {{prayer_wanted}}    - "yes" or "no"
     {{prayer_request}}   - prayer request detail (blank if prayer_wanted=no)
     {{open_to_learn}}    - "yes" or "no"
     {{contact_name}}     - only filled if open_to_learn=yes
     {{attendees}}        - number of people planning to attend (open_to_learn=yes)
     {{contact_phone}}    - only filled if open_to_learn=yes
     {{contact_email}}    - only filled if open_to_learn=yes
   Save the template and note its TEMPLATE ID (looks like "template_xyz789").

4. Get your Public Key: Account -> General -> Public Key.

5. Open script.js and find this block near the top (search "EMAILJS"):

     var EMAILJS_PUBLIC_KEY = 'REPLACE_WITH_YOUR_EMAILJS_PUBLIC_KEY';
     var EMAILJS_SERVICE_ID = 'REPLACE_WITH_YOUR_EMAILJS_SERVICE_ID';
     var EMAILJS_TEMPLATE_ID = 'REPLACE_WITH_YOUR_EMAILJS_TEMPLATE_ID';

   Replace all three placeholder strings with the real values from steps
   2-4.

6. Open survey/index.html and search for "[GOSPEL MEETING DATE" — replace
   that placeholder with the actual date/time of the gospel meeting so the
   lucky-draw note is accurate.

7. Test it: fill out the form on the live site and confirm the email
   arrives. EmailJS's dashboard (Email Logs) also shows every submission,
   which is a good way to confirm it's wired up correctly.

Note: EmailJS's free tier is a fine starting point, but if the QR code
gets scanned a lot (200+ responses/month), you'll need to upgrade their
plan or switch services.
