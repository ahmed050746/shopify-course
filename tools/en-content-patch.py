# One-off content + eyebrow patch for index.html (English mobile/desktop copy)
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "index.html"
text = path.read_text(encoding="utf-8")

# --- Mobile hero block ---
old_hero = """              <h1 id="m-hero-title" class="m-hero__title">
                <span class="m-hero__lead" data-shine="Sirf Store Banana Nahi,">Sirf Store Banana Nahi,</span>
                <span class="m-hero__punch"><span class="m-hero__mark">Sales</span> Lana</span>
                <span class="m-hero__bang"><span class="m-hero__bhi">Bhi </span><span class="m-hero__seek"><span class="m-seek__sr">Seekhein!</span><span aria-hidden="true"><span class="m-seek__ch">S</span><span class="m-seek__ch">e</span><span class="m-seek__ch">e</span><span class="m-seek__ch">k</span><span class="m-seek__ch">h</span><span class="m-seek__ch">e</span><span class="m-seek__ch">i</span><span class="m-seek__ch">n</span><span class="m-seek__ch">!</span></span></span></span>
              </h1>
              <p class="m-hero__desc">
                <span class="m-hero__desc-phone">Woh strategies seekhein jin se aap apni products sell kar sakte hain.</span>
                <span class="m-hero__desc-wide">Shopify par apna store kaise banana hai, winning products kaise choose karne hain aur apni products ko sell kaise karna hai — yeh sab seekhein, step by step.</span>
              </p>
              <hr class="m-hero__rule">
              <a class="m-hero__cta" href="pay.html">Enroll Now <span aria-hidden="true">→</span></a>
              <p class="m-hero__note">Over 2,000+ Students Successfully Trained.</p>"""

new_hero = """              <h1 id="m-hero-title" class="m-hero__title">
                <span class="m-hero__lead" data-shine="Don't just build a store,">Don't just build a store,</span>
                <span class="m-hero__punch">Learn to <span class="m-hero__mark">Drive Sales</span></span>
                <span class="m-hero__bang"><span class="m-hero__seek">Too!</span></span>
              </h1>
              <p class="m-hero__desc">
                <span class="m-hero__desc-phone">Learn practical strategies to sell your products online.</span>
                <span class="m-hero__desc-wide">Build your Shopify store, choose winning products, and learn to sell step by step.</span>
              </p>
              <hr class="m-hero__rule">
              <a class="m-hero__cta" href="pay.html">Enroll Now <span aria-hidden="true">→</span></a>
              <p class="m-hero__note">2,000+ students successfully trained.</p>"""

if old_hero not in text:
    raise SystemExit("Mobile hero block not found")
text = text.replace(old_hero, new_hero, 1)

replacements = [
    ('<div class="m-testi__head">\n            <h2 id="m-testi-title"',
     '<div class="m-testi__head">\n            <span class="m-testi__eyebrow">Social proof</span>\n            <h2 id="m-testi-title"'),
    ('“Student ka short review yahan aayega.”', '“Add a short student review here.”'),
    ('<header class="m-fit__head">\n              <h2 id="m-fit-title"',
     '<header class="m-fit__head">\n              <span class="m-fit__eyebrow">Self-check</span>\n              <h2 id="m-fit-title"'),
    ('Yeh aap ke liye hai agar aap…', 'This is for you if you…'),
    ('<p class="m-fit__item-title">Bilkul beginner hain</p>\n                  <p class="m-fit__item-text">Aur samajh nahi aa raha kahan se shuru karein.</p>',
     '<p class="m-fit__item-title">You are a complete beginner</p>\n                  <p class="m-fit__item-text">And you are not sure where to start.</p>'),
    ('<p class="m-fit__item-title">Student ya job holder hain</p>\n                  <p class="m-fit__item-text">Aur saath saath e-commerce seekhna chahte hain.</p>',
     '<p class="m-fit__item-title">You are a student or working professional</p>\n                  <p class="m-fit__item-text">And you want to learn e-commerce on the side.</p>'),
    ('<p class="m-fit__item-title">Business krna chahte hain</p>\n                  <p class="m-fit__item-text">Aur use sahi tareeqe se shuru karna chahte hain.</p>',
     '<p class="m-fit__item-title">You want to run a business</p>\n                  <p class="m-fit__item-text">And you want to start the right way.</p>'),
    ('<p class="m-fit__item-title">Pehle try kar chuke hain</p>\n                  <p class="m-fit__item-text">Magar product selection ya business model samajh nahi aaya.</p>',
     '<p class="m-fit__item-title">You have tried before</p>\n                  <p class="m-fit__item-text">But product selection or the business model still felt unclear.</p>'),
    ('Yeh aap ke liye nahi agar aap…', 'This is not for you if you…'),
    ('<li>Bina seekhe guaranteed income chahte hain</li>', '<li>You want guaranteed income without learning</li>'),
    ('<li>Raaton raat results ki umeed rakhte hain</li>', '<li>You expect overnight results</li>'),
    ('<li>Seekhne aur practice ke liye time nahi de sakte</li>', '<li>You cannot make time to learn and practice</li>'),
    ('<header class="m-learn__head">\n              <h2 id="m-learn-title"',
     '<header class="m-learn__head">\n              <span class="m-learn__eyebrow">Learning outcomes</span>\n              <h2 id="m-learn-title"'),
    ('Shopify aur dropshipping fundamentals', 'Shopify and dropshipping fundamentals'),
    ('Bina inventory ke apna pehla store confidently chala sakenge.', 'Run your first store confidently without holding inventory.'),
    ('Product research aur sourcing', 'Product research and sourcing'),
    ('Winning products dhoond kar reliable suppliers se source kar sakenge.', 'Find winning products and source from reliable suppliers.'),
    ('Store setup aur order fulfilment', 'Store setup and order fulfillment'),
    ('Store khud setup karke har order customer tak pohncha sakenge.', 'Set up your store and deliver every order to customers.'),
    ('Business costs aur profit calculation', 'Business costs and profit calculation'),
    ('Har product ka asal profit nikaal kar sahi price set kar sakenge.', 'Calculate real profit per product and price correctly.'),
    ('Paid aur free marketing strategies', 'Paid and free marketing strategies'),
    ('Samjhenge ke Pakistan ya global market mein kaunsa model aap ke liye sahi hai.',
     'Use paid ads and organic channels to reach buyers and grow sales.'),
    ('Khud mentor se seekhein', 'Learn directly from your mentor'),
    ('Mere 16 saal ke business aur IT experience se faida uthayein.', 'Benefit from 16+ years of business and IT experience.'),
    ('USA se hasil ki gayi education', 'US-based education and training'),
    ('Meri international education aur professional experience se seekhein.', 'Learn from international education and professional experience.'),
    ('Har hafte live Q&amp;A', 'Weekly live Q&amp;A'),
    ('Har haftay online session mein apne sawal poochhein aur unke jawab hasil karein.',
     'Ask questions every week in live online sessions and get clear answers.'),
    ('Apni raftaar se seekhein', 'Learn at your own pace'),
    ('Recorded lessons ko apni sahulat ke mutabiq dekhein aur concepts samjhein.',
     'Watch recorded lessons on your schedule and master each concept.'),
    ('Guidance jab zaroorat ho', 'Guidance when you need it'),
    ('Business se related confusion aur sawalat ko weekly Q&amp;A session mein discuss karein.',
     'Discuss business confusion and questions in weekly Q&amp;A sessions.'),
    ('Online business kaise kaam karta hai, kaunse models hain, aur shuru karne se pehle kya samajhna zaroori hai.',
     'How online business works, which models exist, and what to understand before you start.'),
    ('Apne liye sahi business model chun sakenge.', 'You will choose the right business model for you.'),
    ('Market demand, competition aur trends dekh kar products ko judge karna, aur winning product pehchanne ke tareeqe.',
     'Judge products using demand, competition, and trends, plus proven ways to spot winners.'),
    ('Data ki buniyaad par bikne wali products select kar sakenge.', 'You will pick products that sell based on data.'),
    ('Suppliers aur sourcing', 'Suppliers and sourcing'),
    ('Reliable suppliers dhoondna, samples aur pricing par baat karna, aur local ya international sourcing ke options.',
     'Find reliable suppliers, negotiate samples and pricing, and compare local vs international sourcing.'),
    ('Sahi supplier se munasib qeemat par maal mangwa sakenge.', 'You will source inventory at fair prices from the right suppliers.'),
    ('Shopify aur store setup', 'Shopify and store setup'),
    ('Shopify account se le kar theme, product pages, payment aur shipping settings tak — poora store step by step.',
     'From Shopify account to theme, product pages, payments, and shipping — build the full store step by step.'),
    ('Apna professional store khud launch kar sakenge.', 'You will launch a professional store yourself.'),
    ('Marketing aur order management', 'Marketing and order management'),
    ('Social media aur paid ads se customers lana, orders process karna, aur delivery ya returns handle karna.',
     'Bring customers with social media and paid ads, process orders, and handle delivery and returns.'),
    ('Sales la kar har order smoothly deliver kar sakenge.', 'You will drive sales and fulfill orders smoothly.'),
    ('Daraz, eBay, Walmart aur Etsy jaise marketplaces kaise kaam karte hain, aur aap ke business ke liye kaunsa behtar hai.',
     'How marketplaces like Daraz, eBay, Walmart, and Etsy work, and which fits your business.'),
    ('Apne business ko naye marketplaces par scale kar sakenge.', 'You will scale your business onto new marketplaces.'),
    ('Lecture 01 · E-commerce ka introduction', 'Lecture 01 · Introduction to e-commerce'),
    ('E-commerce ka introduction', 'Introduction to e-commerce'),
    ('Lecture 02 · Winning product kaise dhoondein', 'Lecture 02 · How to find winning products'),
    ('Winning product kaise dhoondein', 'How to find winning products'),
    ('Lecture 04 · Supplier se deal kaise karein', 'Lecture 04 · How to deal with suppliers'),
    ('Supplier se deal kaise karein', 'How to deal with suppliers'),
    ('Lecture 05 · Pehli sale ke liye marketing', 'Lecture 05 · Marketing for your first sale'),
    ('Pehli sale ke liye marketing', 'Marketing for your first sale'),
    ('Ek fee, <span class="price__title-accent">poori mentorship</span></h2>',
     'One fee, <span class="price__title-accent">full mentorship</span></h2>'),
    ('<span class="sr-only">Asal price</span>', '<span class="sr-only">Original price</span>'),
    ('Aap bachate hain Rs 2,400', 'You save Rs 2,400'),
    ('<li>6 practical modules — fundamentals se marketplaces tak</li>',
     '<li>6 practical modules from fundamentals to marketplaces</li>'),
    ('<li>Recorded lectures, apni raftaar se dekhein</li>', '<li>Recorded lectures at your own pace</li>'),
    ('<li>Business sawalat par mentor ki direct guidance</li>', '<li>Direct mentor guidance on business questions</li>'),
    ('Discount khatam hone par price Rs 6,900 ho jayegi.', 'Price returns to Rs 6,900 when the discount ends.'),
    ('<h1 id="d-hero-title" class="d-hero__title"><span class="d-hero__title-accent">Product se<br>Sale Tak</span></h1>',
     '<h1 id="d-hero-title" class="d-hero__title"><span class="d-hero__title-accent">From Product<br>to Sale</span></h1>'),
    ('<p class="d-hero__desc">Shopify par apna store kaise banana hai, winning products kaise choose karne hain aur apni products ko sell kaise karna hai — yeh sab seekhein, step by step.</p>',
     '<p class="d-hero__desc">Build your Shopify store, choose winning products, and learn to sell your products step by step.</p>'),
    ('<header class="d-testi__head">\n            <div>',
     '<header class="d-testi__head">\n            <div>\n              <span class="d-testi__eyebrow">Social proof</span>'),
    ('<p class="d-fit__sub">Dekhein, kya aap in mein se kisi situation mein hain?</p>',
     '<p class="d-fit__sub">See if any of these situations sound like you.</p>'),
    ('<header class="d-learn__head">\n            <h2 id="d-learn-title"',
     '<header class="d-learn__head">\n            <span class="d-learn__eyebrow">Learning outcomes</span>\n            <h2 id="d-learn-title"'),
    ('<p class="d-learn__sub">Sirf topics nahi — har skill ke saath yeh bhi samjhenge ke aap usay apne business mein kahan aur kaise use karenge.</p>',
     '<p class="d-learn__sub">Not just topics — you will see where and how to apply each skill in your business.</p>'),
    ('<p class="d-curr__sub">6 practical modules — har module ke saath yeh bhi pata ho ke aap us ke baad kya kar sakenge.</p>',
     '<p class="d-curr__sub">6 practical modules — know what you can do after each one.</p>'),
    ('<p class="price__sub">Koi subscription nahi — ek dafa enroll karein aur poora program join karein.</p>',
     '<p class="price__sub">No subscription — enroll once and join the full program.</p>'),
    ('<p class="price__side-title">Is fee mein shamil hai</p>', '<p class="price__side-title">What is included</p>'),
    ('<p class="d-fit__cta-text">Left side mein khud ko dekha? <span>Chaliye shuru karte hain.</span></p>',
     '<p class="d-fit__cta-text">See yourself on the left? <span>Let\'s get started.</span></p>'),
    ('<p class="d-fit__item-title">Bilkul beginner hain</p>', '<p class="d-fit__item-title">You are a complete beginner</p>'),
    ('<p class="d-fit__item-text">Aur samajh nahi aa raha kahan se shuru karein.</p>', '<p class="d-fit__item-text">And you are not sure where to start.</p>'),
    ('<p class="d-fit__item-title">Student ya job holder hain</p>', '<p class="d-fit__item-title">You are a student or working professional</p>'),
    ('<p class="d-fit__item-text">Aur saath saath e-commerce seekhna chahte hain.</p>', '<p class="d-fit__item-text">And you want to learn e-commerce on the side.</p>'),
    ('<p class="d-fit__item-title">Bina seekhe guaranteed income chahte hain</p>', '<p class="d-fit__item-title">You want guaranteed income without learning</p>'),
    ('<p class="d-fit__item-text">Yahan shortcut nahi, skill aur samajh milti hai.</p>', '<p class="d-fit__item-text">There are no shortcuts here — you build skill and clarity.</p>'),
    ('<p class="d-fit__item-title">Raaton raat results ki umeed rakhte hain</p>', '<p class="d-fit__item-title">You expect overnight results</p>'),
    ('<p class="d-fit__item-text">Business banane mein waqt aur consistency lagti hai.</p>', '<p class="d-fit__item-text">Building a business takes time and consistency.</p>'),
    ('<p class="d-fit__item-title">Seekhne aur practice ke liye time nahi de sakte</p>', '<p class="d-fit__item-title">You cannot make time to learn and practice</p>'),
    ('<p class="d-fit__item-text">Har session ke baad apne store par kaam zaroori hai.</p>', '<p class="d-fit__item-text">You need to work on your store after each session.</p>'),
    ('<legend class="sr-only">Aap E-commerce kyun seekhna chahte hain?</legend>',
     '<legend class="sr-only">Why do you want to learn e-commerce?</legend>'),
    ('<span class="quiz-field__qtext">Aap E-commerce kyun seekhna chahte hain? <em>*</em>',
     '<span class="quiz-field__qtext">Why do you want to learn e-commerce? <em>*</em>'),
    ('value="Online business start karna hai" required><span>Online business start karna hai</span>',
     'value="Start an online business" required><span>Start an online business</span>'),
    ('value="Part-time income ke liye"><span>Part-time income ke liye</span>',
     'value="Part-time income"><span>Part-time income</span>'),
    ('value="Existing business grow karna hai"><span>Existing business grow karna hai</span>',
     'value="Grow an existing business"><span>Grow an existing business</span>'),
    ('value="Sirf information chahiye"><span>Sirf information chahiye</span>',
     'value="Just gathering information"><span>Just gathering information</span>'),
    ('<legend class="sr-only">Aapka current level kya hai?</legend>',
     '<legend class="sr-only">What is your current level?</legend>'),
    ('<span class="quiz-field__qtext">Aapka current level kya hai? <em>*</em>',
     '<span class="quiz-field__qtext">What is your current level? <em>*</em>'),
    ('value="Thora experience hai"><span>Thora experience hai</span>',
     'value="Some experience"><span>Some experience</span>'),
    ('value="Already business kar raha/rahi hoon"><span>Already business kar raha/rahi hoon</span>',
     'value="Already running a business"><span>Already running a business</span>'),
    ('<legend class="sr-only">1-on-1 mentorship ki fee Rs. 4,500 hai. Kya aap interested hain?</legend>',
     '<legend class="sr-only">The 1-on-1 mentorship fee is Rs. 4,500. Are you interested?</legend>'),
    ('<span class="quiz-field__qtext">1-on-1 mentorship ki fee Rs. 4,500 hai. Kya aap interested hain? <em>*</em>',
     '<span class="quiz-field__qtext">The 1-on-1 mentorship fee is Rs. 4,500. Are you interested? <em>*</em>'),
    ('value="Ji, main serious hoon" required><span>Ji, main serious hoon</span>',
     'value="Yes, I am serious" required><span>Yes, I am serious</span>'),
    ('value="Pehle details chahiye"><span>Pehle details chahiye</span>',
     'value="Need more details first"><span>Need more details first</span>'),
    ('value="Abhi budget available nahi hai"><span>Abhi budget available nahi hai</span>',
     'value="Budget not available right now"><span>Budget not available right now</span>'),
]

for old, new in replacements:
    if old not in text:
        print("WARN missing:", old[:60])
    text = text.replace(old, new)

path.write_text(text, encoding="utf-8")
print("Done.")
