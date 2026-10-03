# SparkPreneurs Website Content Plan

**Document role:** Source of truth for the content architecture of the new Astro website  
**Research date:** August 23, 2026  
**Business location:** 3445 Yonge St., Second Floor, Toronto, Ontario, M4N 2N1  
**Current website:** [sparkpreneurs.ca](https://sparkpreneurs.ca/)

This document defines what the new website needs to contain and how its content should relate. It does not define visual design, components, code, payment implementation, or unverified business claims.

## Executive Recommendation

SparkPreneurs should not present every offering as an undifferentiated “program.” The new architecture should use four clear entry paths:

1. **Programs by audience:** Kids & Youth and Adults.
2. **High-intent formats:** Camps, After School, and Workshops.
3. **Hosted occasions:** Events, with distinct pages for birthdays, private events, corporate events, and bridal showers.
4. **Space-only use:** Studio Rental, clearly separated from hosted events.

Every active class or activity should have one canonical program page. Audience pages, format pages, activity filters, and homepage cards should link to that page rather than repeat its description. A separate **Offering** record should hold changeable details such as session dates, schedule, price, capacity, availability, and registration link. This separation is the key to keeping an Astro site accurate and scalable.

The site should launch with a deliberately small set of useful pages. Art, STEM, wellness, age, day, and season should usually be controlled taxonomy and filters—not automatically generated SEO pages. A category page should exist only when SparkPreneurs has enough current offerings and unique information to make it genuinely useful.

---

# 1. Existing Website Analysis

## 1.1 Current Navigation and Content Structure

The current primary navigation is:

- Home
- Programs
- Camps & Afterschool
- Gallery
- About
- Book Your Event
- Contact
- Waiver

Several of these links point to homepage sections rather than standalone pages. “Programs” returns visitors to the homepage program area, while Gallery and Contact are homepage sections. Separate Kids & Youth and Adult hubs exist but are reached through homepage cards rather than clear audience choices in the main navigation.

The current footer consistently provides email, address, phone, and Instagram. It does not provide a durable secondary sitemap, hours, directions, policies, or a dedicated location/contact page.

## 1.2 Current Content and Conversion Patterns

Current content is organized into these broad groups:

- **Kids & Youth:** classes, workshops, summer camp, and after-school care.
- **Adults:** pottery wheel, hand-building pottery, Papier-Mâché, acrylic painting, watercolour, and drawing/sketching.
- **Creative technology:** an active kids 3D printing registration page plus a generic older 3D printing schedule page.
- **Wellness and movement:** an active seasonal Zumba registration page and an older generic Yoga & Dance schedule page.
- **Events:** birthday parties, private events, business events, and bridal showers on one page.
- **Studio rental:** mentioned on the homepage and About page, but no standalone page exists.
- **Gallery:** a large homepage image section, but no standalone page.
- **Registration:** active pages combine program description, session selection, participant/contact fields, cart totals, and a “Continue to Secure Payment” action.
- **Interest capture:** Kids & Youth and Adult hubs collect interest for programs that are not currently scheduled.
- **Waiver:** a standalone utility page states that online submission storage is not connected.

Primary current calls to action include:

- Explore Programs / Learn More
- View Summer Camp / View After School
- Register Now / Reserve Your Spot
- Add to Cart / Continue to Secure Payment
- Join Interest List
- Start Booking / Request a Private Workshop
- Contact Us / Call

The main conversion problem is not a lack of calls to action; it is that the action changes unpredictably between pages. The new site should map availability to one of four explicit actions: **Register**, **Join the Interest List**, **Request a Private Booking**, or **Contact Us**.

## 1.3 Current-Site Inventory

Recommendations use the required terms KEEP, MOVE, MERGE, REPLACE, and REMOVE. “Current” means present in the live/repository-backed site as reviewed on the research date; it does not guarantee that every dated offering remains available after that date.

| Current URL | Page name | Purpose | Audience | Content type | Current parent/category | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Homepage | Explain the studio and route visitors to major offerings | All visitors | Marketing landing page | Root | **KEEP**; refocus around audience and task-based choices |
| `/#explore-sparkpreneurs` | Explore SparkPreneurs | Homepage cards for kids, adults, Zumba, events, and rental | All visitors | Homepage section | Homepage | **MERGE** into the new homepage and `/programs/` |
| `/#gallery` | Gallery | Show classes, camps, events, studio, and work | All visitors | Homepage gallery | Homepage | **MOVE** to `/gallery/`, with a smaller homepage preview |
| `/#about` | About summary | Brief studio positioning and mission | General visitors | Homepage section | Homepage | **MERGE** into homepage proof and `/about/` |
| `/#contact` | Contact | Provide contact details | All visitors | Homepage/footer section | Homepage | **MOVE** to `/contact/`; retain concise footer details |
| `/about-us/index.html` | Our Mission | Explain mission, name, entrepreneurial mindset, benefits, events, and rental | General visitors; families; adults; partners | Standard information page | About | **MOVE** to `/about/` |
| `/camps/index.html` | Kids & Youth Programs | Route families to classes, workshops, camps, after school, and an interest form | Parents; children; teens | Audience landing page | Programs | **MOVE** to `/programs/kids-youth/`; the current slug is misleading |
| `/classes/index.html` | Kids & Youth Classes | List current kids classes; currently only 3D Printing | Parents; kids/youth | Thin listing page | Kids & Youth | **MERGE** into `/programs/kids-youth/` and `/programs/` |
| `/3d-printing/index.html` | 3D Printing | Explain and register for a six-session kids/youth 3D printing program | Parents; kids/youth | Program detail + registration | Kids & Youth Classes | **MOVE** to `/programs/3d-printing/` |
| `/workshops/index.html` | Workshops | Introduce short kids/youth art, pottery, seasonal, and creative technology workshops | Parents; kids/youth | Format landing page | Kids & Youth | **MOVE** to `/workshops/` and expand to all supported audiences when scheduled |
| `/camp/index.html` | Camp Programs | Gateway to Summer Camp and After School | Parents | Gateway/listing page | Camps & Afterschool | **REPLACE** with a focused `/camps/` page; do not continue mixing camp and after-school content |
| `/summer-camp/index.html` | Summer Camp Ages 4–10 | Select an August week/session and register | Parents; children ages 4–10 | Camp detail + registration | Camp Programs | **MOVE** to `/camps/summer-camp/`; use one stable seasonal URL |
| `/after-school/index.html` | After School | Compare 3-, 4-, and 5-day options and register for a four-week minimum | Parents; school-age children | Program detail + registration | Camps & Afterschool | **KEEP** at clean URL `/after-school/`; strengthen supporting details |
| `/art-studio/index.html` | Adult Art Studio | List current and interest-based adult creative programs | Adults; private groups | Audience landing page + interest form | Programs | **MOVE** to `/programs/adults/` |
| `/pottery-wheel/index.html` | Pottery Wheel | Explain a four-session adult course, compare cohorts, and register | Adults | Program detail + registration | Adult Art Studio | **MOVE** to `/programs/pottery-wheel/` |
| `/hand-building-pottery/index.html` | Hand-Building Pottery | Compare adult schedules and register for four sessions | Adults | Program detail + registration | Adult Art Studio | **MOVE** to `/programs/hand-building-pottery/` |
| `/zumba/index.html` | Summer Zumba 2026 | Compare session passes, select dates, and register | Audience not stated on current page | Seasonal program detail + registration | Homepage/programs | **MOVE** to stable `/programs/zumba/`; confirm audience before categorization |
| `/book-your-event/index.html` | Book Your Event | Introduce birthday, private, business, and bridal shower events | Families; adults; businesses | Event landing page | Events | **MOVE** to `/events/` and distribute unique details to event-type pages |
| `/waiver/index.html` | Waiver | Launch/confirm a participant or guardian waiver | Registered participants/guardians | Transactional utility page | Utility navigation | **KEEP** as `/waiver/`, remove from primary navigation, and keep non-indexable |
| `/music-club/index.html` | Pottery Schedule | Generic all-ages pottery overview and schedule despite an unrelated slug | Unspecified/all ages | Legacy/orphan program page | None | **MERGE** useful pottery explanation into current pottery pages; redirect to `/programs/pottery/` |
| `/robotics-lab/index.html` | 3D Printing Schedule | Generic all-ages 3D printing overview and schedule despite an inaccurate slug | Unspecified/all ages | Legacy/orphan program page | None | **MERGE** into `/programs/3d-printing/` |
| `/yoga-gymnastics/index.html` | Yoga & Dance | Generic movement overview and schedule | Age/audience not specified | Legacy/orphan program page | None | **MERGE** only verified content into the relevant future program; redirect to `/programs/` until availability is confirmed |

## 1.4 Existing Information-Architecture Problems

1. **Misleading slugs:** `/camps/` is the Kids & Youth hub, `/camp/` mixes camps and after school, `/music-club/` is pottery, and `/robotics-lab/` is 3D printing.
2. **Mixed dimensions:** audience, activity, format, season, and booking state are treated as equivalent navigation categories.
3. **Duplicate or competing explanations:** 3D printing and pottery appear in both active detail pages and generic schedule pages.
4. **Orphan pages:** older schedule pages are not linked through the current hubs but remain valid URLs.
5. **Seasonal content in evergreen positions:** Zumba and Summer Camp embed specific 2026 availability into pages that should remain useful from season to season.
6. **No dedicated rental decision path:** rental is marketed but routes to the same event page as hosted celebrations.
7. **Insufficient decision information:** several pages omit confirmed ages, prerequisites, capacity, exact session dates, what to bring, policies, or availability state.
8. **Inconsistent labels:** “Business Events” and “Corporate Events” refer to the same journey; “Kids-Youth,” “Kids & Youth,” and “children and teenagers” vary.
9. **Registration and discovery are fused:** listing, program explanation, checkout selection, participant details, and payment action all compete on some pages.
10. **Thin utility navigation:** Waiver is treated as a primary discovery destination even though it is a post-registration task.

---

# 2. User Journeys

## 2.1 Primary Journeys

### Parent Finding a Class

Parent → Programs → Kids & Youth → filter or scan by age/activity → program detail → review schedule, price, dates, and fit → Register or Join Interest List

Required decision information: exact age range, activity, format, session count/dates, day/time, price/tax treatment, availability, inclusions, location, and registration status.

### Parent Finding Care or Camp

Parent → Camps or After School → review age/school-pickup eligibility and schedule → compare available offering options → read policies/preparation information → Register

Camps and After School should not be nested invisibly inside a generic Programs menu. They are distinct parent tasks with different practical questions.

### Adult Finding a Creative or Wellness Program

Adult → Programs → Adults → choose activity (for example pottery or Zumba) → program detail → select a current cohort/pass → Register

If a program is not scheduled: Adult → program summary/Adults page → Join Interest List. The site must not make an interest-only activity look immediately bookable.

### Pottery Customer Choosing a Format

Visitor → Pottery Programs → compare pottery wheel and hand-building → open one program → review experience level, inclusions, firing/pickup information, dates, and price → Register

This justifies one `/programs/pottery/` comparison page because two distinct active pottery formats already exist.

### Birthday or Private Event Customer

Customer → Events → choose Birthday Party, Private Event, or Bridal Shower → review supported activities, group requirements, inclusions, and booking process → submit inquiry/call → receive quote and confirmation

### Business Event Customer

Business visitor → Events → Corporate Events → understand creative team-event options and practical logistics → submit company/group inquiry → receive quote and confirmation

Use “Corporate Events” consistently; mention team-building in headings/body where accurate.

### Studio Rental Customer

Instructor/artist/business → Studio Rental → determine whether the space fits the intended use → review room options, capacity, amenities, access, rates, and rules → request availability/book

The page must explain the distinction between renting space and purchasing a SparkPreneurs-hosted activity.

### General Visitor

Visitor → Homepage or About → understand what SparkPreneurs is, who it serves, and where it is → explore the relevant audience/task → contact or register

## 2.2 Secondary Journeys

- Existing registrant → Waiver link received after registration → complete waiver → see confirmation.
- Visitor with a date/activity question → Contact → choose the relevant inquiry type → send details.
- Visitor uncertain about fit → All Programs → filter by audience/activity/format → compare options.
- Visitor seeking evidence → Gallery → view relevant class, camp, event, and space images → follow a contextual link.
- Visitor whose desired class is not open → Join Interest List → receive confirmation and next-step expectations.
- Participant returning from payment → see a clear success, pending, cancelled, or error state. These are transactional states, not indexable content pages.

---

# 3. Comparable Business Research

The competitor review is intentionally concise and focuses on structural patterns, not wording or claims.

| Comparable business | Relevant structural pattern | Lesson for SparkPreneurs |
| --- | --- | --- |
| [Create Art Studio](https://createartstudio.ca/) — Toronto | Top-level Classes, Workshops, Camps, After School, Team Events, and Parties; class/workshop menus then segment by Adults, Teens, Kids, and Families | Keep high-intent formats visible, but use audience subdivisions below them. Do not make every age/activity combination a top-level page. |
| [Artbarn School](https://artbarnschool.com/) — Midtown Toronto | Homepage routes separately to Adult Classes + Workshops, Kids Classes + Workshops + Camps, Birthday Parties, and Private Events; dated workshops use individual entries | Audience landing pages and event journeys should be distinct. Scheduled workshops benefit from reusable date-based offerings. |
| [MakerKids](https://makerkids.com/) — Toronto | Programs menu separates weekly classes, camps/PA days, after-school pickup, private classes, birthday parties, and school programs; ages and locations are prominent | Parents need age, format, schedule, and location before activity detail. SparkPreneurs should borrow the clarity, not the much larger menu. |
| [Clay Space Studio](https://clayspacestudio.com/) — Toronto | Separate Classes, Workshops, Studio Rental, and Corporate & Private Events; adult versus kids/teens appears under Classes | Studio rental is a different product from a hosted event. Pottery program pages should distinguish recurring classes, one-time workshops, private events, and independent space use. |
| [The Creative Child](https://www.thecreativechild.ca/) — Toronto | Classes are browsable by age band; Camps, After School, Birthday Parties, Events/Workshops, and studio rental are separate journeys | Age is a valuable browsing aid for parents, while care/camp/event tasks need dedicated pages. SparkPreneurs can use filters rather than six age landing pages at its current scale. |

### Research Synthesis

The recurring pattern is a two-layer architecture:

- **First layer:** the visitor’s task or audience—kids, adults, camps, after school, events, rentals.
- **Second layer:** activity, age, schedule, and availability.

The main caution is menu growth. Larger competitors can support many age and format pages because they have substantial current inventory. SparkPreneurs should launch with fewer permanent pages and add a landing page only when it offers a real choice, unique content, and stable demand.

---

# 4. Architecture Principles

## 4.1 Separate the Core Concepts

| Concept | Definition | Architecture role |
| --- | --- | --- |
| Audience | Who the experience is designed for | Kids & Youth and Adults are permanent landing pages; finer age bands are filters/fields |
| Activity | What participants do | Controlled taxonomy and filter; only Pottery initially earns a standalone comparison page |
| Program | Evergreen description of an experience | One canonical detail page per actual program |
| Offering | A bookable or interest-based instance of a program | Holds dates, times, price, availability, and registration action |
| Format | How the experience is delivered | Camps, After School, and Workshops have task-based landing pages; classes/seasonal passes can be filters |
| Event type | A customizable hosted occasion | Events landing plus Birthday, Private, Corporate, and Bridal Shower pages |
| Rental | Space-only or space-led booking | Standalone Studio Rental page, cross-linked with Events |
| Location | Where all in-person experiences occur | Contact/location page and a reusable location record |

## 4.2 Rules That Prevent Duplication

1. A program has one canonical detail page even if it belongs to multiple audiences, activities, or formats.
2. Audience and format pages summarize and link; they do not repeat the full program copy.
3. Schedule, price, dates, capacity, and registration state belong to Offering records, not evergreen program prose.
4. Filters may change the listing interface but should not generate indexable combinations by default.
5. Seasonal pages use stable URLs; the offering data changes by season/year.
6. Ended offerings disappear from current listings, but an evergreen program page remains useful if the program is expected to return.
7. Event pages describe hosted experiences. Rental pages describe access to space. Neither should impersonate the other.

---

# 5. Recommended Top-Level Architecture

## 5.1 Primary Navigation

1. **Programs**
   - All Programs
   - Kids & Youth
   - Adults
   - Pottery
   - Workshops
2. **Camps**
3. **After School**
4. **Events**
   - Birthday Parties
   - Private Events
   - Corporate Events
   - Bridal Showers
5. **Studio Rental**
6. **About**
7. **Contact**

Recommended persistent action button: **Find a Program** → `/programs/`.

Do not use “Register” as a universal header link: events and rentals require inquiries, and some programs accept only interest. Registration should appear only when a current offering can actually be selected.

## 5.2 Footer Navigation

- Programs: All Programs, Kids & Youth, Adults, Workshops
- Family Programs: Camps, After School
- Events: Events overview, Birthday Parties, Corporate Events, Studio Rental
- Visit: About, Gallery, Contact
- Policies: Privacy, Registration & Cancellation
- Utility: Waiver (only where operationally useful; it does not need broad promotion)
- Consistent name, address, phone, email, and Instagram

## 5.3 Naming Standards

- Use **Kids & Youth** consistently unless the business supplies exact age definitions that support a different label.
- Use **After School** in navigation and **after-school program** in prose.
- Use **Corporate Events** consistently; “team-building” may be a supporting search/user phrase.
- Use **Studio Rental** for space-only bookings and **Events** for hosted experiences.
- Use **3D Printing** for the current creative technology program; do not label it Robotics or STEM unless the program content actually includes those subjects.

---

# 6. Recommended Sitemap

The public sitemap below contains the recommended launch architecture. Bracketed notes are architectural annotations, not URL segments.

```text
/
├── programs/
│   ├── kids-youth/
│   ├── adults/
│   ├── pottery/
│   ├── 3d-printing/
│   ├── pottery-wheel/
│   ├── hand-building-pottery/
│   └── zumba/
├── workshops/
├── camps/
│   └── summer-camp/
├── after-school/
├── events/
│   ├── birthday-parties/
│   ├── private-events/
│   ├── corporate-events/
│   └── bridal-showers/
├── studio-rental/
├── gallery/
├── about/
├── contact/
└── policies/
    ├── privacy/
    └── registration-cancellation/

Utility route (not in XML sitemap; noindex):
/waiver/
```

No separate Art, STEM, Creative Technology, Wellness, Teens, or seasonal-year landing pages are recommended at launch. Those concepts should remain taxonomy until there is enough current content to support a meaningful page.

## 6.1 Final Page Register

| URL | Page | Purpose | Audience | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| `/` | Homepage | Explain SparkPreneurs, establish location/value, and route users by task/audience | All visitors | Homepage | EXISTING |
| `/programs/` | All Programs | Show current and interest-based programs with limited useful filters | All program seekers | Program listing | MERGE |
| `/programs/kids-youth/` | Kids & Youth Programs | Help parents find classes/workshops by age, activity, and availability | Parents; kids; youth; teens | Audience landing | MOVE |
| `/programs/adults/` | Adult Programs | Show current and interest-based adult creative/wellness options | Adults; private groups | Audience landing | MOVE |
| `/programs/pottery/` | Pottery Programs | Compare pottery wheel and hand-building and explain shared firing context | Adults initially; other verified audiences later | Activity comparison landing | NEW |
| `/programs/3d-printing/` | 3D Printing | Explain the current program and show bookable offerings | Parents; kids/youth | Program detail | MOVE |
| `/programs/pottery-wheel/` | Pottery Wheel | Explain the adult course and show current cohorts | Adults | Program detail | MOVE |
| `/programs/hand-building-pottery/` | Hand-Building Pottery | Explain the adult course and show current cohorts | Adults | Program detail | MOVE |
| `/programs/zumba/` | Zumba | Explain the program and show current passes/sessions | `[CONTENT REQUIRED FROM BUSINESS: audience]` | Program detail | MOVE |
| `/workshops/` | Workshops | List current one-time/short workshops across verified audiences | Parents; youth; adults | Format listing | MOVE |
| `/camps/` | Camps | Explain the camp offer and route to current seasonal camp offerings | Parents; children/youth | Format landing | MERGE |
| `/camps/summer-camp/` | Summer Camp | Provide evergreen camp details and current bookable weeks/sessions | Parents; verified age groups | Camp/program detail | MOVE |
| `/after-school/` | After-School Program | Explain care/program details, pickup eligibility, schedules, and current options | Parents; school-age children | Program detail | EXISTING |
| `/events/` | Events & Celebrations | Compare hosted event types and explain the common booking process | Families; adults; businesses | Event landing | MOVE |
| `/events/birthday-parties/` | Birthday Parties | Answer birthday-specific fit, activity, package, and booking questions | Parents; adults where supported | Event-type detail | NEW |
| `/events/private-events/` | Private Events | Explain private creative gatherings and booking options | Adults; families; friend groups | Event-type detail | NEW |
| `/events/corporate-events/` | Corporate Events | Explain team workshops/client gatherings and inquiry logistics | Businesses; team organizers | Event-type detail | NEW |
| `/events/bridal-showers/` | Bridal Showers | Explain shower-specific creative/keepsake options and booking | Bridal party organizers | Event-type detail | NEW |
| `/studio-rental/` | Studio Rental | Explain space-only rental options, fit, logistics, and inquiry process | Artists; instructors; businesses; community organizers | Rental landing/detail | NEW |
| `/gallery/` | Gallery | Provide categorized visual proof and route to relevant offerings | All visitors | Gallery listing | MOVE |
| `/about/` | About SparkPreneurs | Explain mission, name, approach, benefits, and community role | General visitors; families; adults; partners | Standard page | MOVE |
| `/contact/` | Contact & Visit | Centralize location, contact, hours, directions, accessibility, and inquiry routes | All visitors | Contact/location page | MOVE |
| `/policies/privacy/` | Privacy Policy | Explain handling of inquiry, registration, waiver, and analytics data | All form users | Policy page | NEW |
| `/policies/registration-cancellation/` | Registration & Cancellation Policy | Explain registration, cancellation, refund, transfer, and missed-session rules | Registrants | Policy page | NEW |
| `/waiver/` | Participant Waiver | Complete a required participant/guardian waiver | Registrants/guardians | Transactional utility | EXISTING |

Event-type pages and policies must not be published as thin placeholders. They require the business-supplied details identified later in this document.

---

# 7. Program Architecture and Taxonomy

## 7.1 Recommended Primary and Secondary Dimensions

| Dimension | Values supported by current content | Recommended role |
| --- | --- | --- |
| Audience | Kids & Youth; Adults; age/audience unknown for some movement programs | Primary audience landing pages; filter on listings |
| Age | Current summer page says ages 4–10; Kids hub also mentions ages 9–14; other exact ages are inconsistent or absent | Structured numeric range on programs/offerings; filter; never infer |
| Activity | Art & Mixed Media; Pottery; Creative Technology/3D Printing; Wellness & Movement | Filter/tag; Pottery alone gets an initial activity landing page |
| Format | Class; Workshop; Camp; After School; Seasonal Pass | Camps, After School, and Workshops get dedicated pages; other values filter listings |
| Availability | Open; Upcoming; Interest List; Waitlist; Full; Ended; Paused | Display state and CTA logic, not navigation |
| Schedule | Day, time, session dates, duration, number of sessions | Offering fields and listing filters when inventory warrants |
| Season | Spring, Summer, Fall, Winter; year | Offering metadata; stable page URLs, not routine year-based pages |

## 7.2 Actual Program/Offering Matrix to Migrate

This matrix distinguishes supported content from claims that still need confirmation.

| Program/experience | Audience | Activity | Format | Current state in source site | Architecture treatment |
| --- | --- | --- | --- | --- | --- |
| Kids 3D Printing | Kids & Youth | Creative Technology / 3D Printing | Six-session class | Active registration page | Canonical Program + one or more Offerings |
| Pottery Wheel | Adults | Pottery | Four-session class | Active cohorts/registration | Canonical Program + cohort Offerings |
| Hand-Building Pottery | Adults | Pottery | Four-session class | Active schedules/registration | Canonical Program + cohort Offerings |
| Zumba | Not specified on detail page | Wellness & Movement | Single session and multi-session pass | Active seasonal registration | Canonical Program + dated session/pass Offerings; confirm audience |
| Summer Camp | Children; current detail says ages 4–10 | Art/creativity/movement mix | Camp | Active seasonal registration; Kids hub also claims 9–14 options | Canonical Program + weekly/session Offerings; verify every age band |
| After-School Program | School-age children; exact ages not stated | Creative mixed activities | After School | Active 3/4/5-day registration | Canonical Program + schedule-plan Offerings; verify schools/ages |
| Kids painting, drawing, pottery, Papier-Mâché | Kids & Youth | Art & Mixed Media / Pottery | Classes or workshops | Mentioned on hub/interest form; no current detail pages | Keep as interest categories until a real program and offering exist |
| Adult Papier-Mâché | Adults | Art & Mixed Media | Workshop/class | Listed “Available Now,” but CTA goes to contact rather than a program page | Confirm availability; create Program only when details are supplied |
| Adult acrylic, watercolour, drawing/sketching | Adults | Art & Mixed Media | Workshop/class | Available by request/interest list | Interest taxonomy; do not create thin detail pages yet |
| Yoga & Dance | Audience not specified | Wellness & Movement | Class | Legacy/orphan schedule page only | Do not list as active until business confirms current offering |
| Adult 3D Printing | Adults | Creative Technology | Unspecified | Claimed on homepage, absent from Adult hub details | Confirm before listing as a program |
| Birthday, private, corporate, bridal shower | Varies | Art, pottery, 3D printing, wellness, movement | Hosted event | Supported on current event page | EventType records, not Programs |
| Studio Rental | Artists, instructors, meetings, classes, photos, gatherings | Space use | Hourly/daily rental | Supported in homepage/About copy; no detail page | StudioRental singleton, not a Program |

## 7.3 Taxonomy Governance

- Use controlled singular values in data and user-friendly plural labels in navigation.
- Store exact minimum/maximum age when known. “Kids,” “Youth,” and “Teens” are display groups, not substitutes for verified age limits.
- A program may have multiple activity tags, but one `primaryActivity` should control its main label and breadcrumb.
- Do not create separate copies such as “Kids Pottery” and “Pottery for Kids” unless they are genuinely different programs.
- A program can appear on Kids & Youth, Pottery, Workshops, or Camps listings through references to the same source record.
- An offering inherits audience/activity from its program but may narrow an age range or experience level.
- Dated offerings should have start/end dates and an explicit status so expired registration options cannot remain silently open.

## 7.4 Registration Content Boundary

The Astro content layer supports discovery and display; it is not the trusted checkout source.

- Each registration period must continue to use its own private spreadsheet and standalone Apps Script backend, with `Products`, `Checkout Attempts`, and `Registrations` tabs.
- Program and Offering content may display names, dates, times, availability, prices, and tax, but the backend must validate submitted program/item codes and recalculate the total from its trusted `Products` rows.
- Public Offering records therefore need stable `programCode` and `itemCode` mappings when they are registrable. These are identifiers, not secret credentials.
- The public site must show payment success only after the backend retrieves and verifies the Stripe Checkout Session. A browser return URL is not proof of payment.
- Waiver, medical, participant, and payment-attempt data are operational/private records. They do not belong in Astro content collections, public page data, analytics payloads, or Stripe metadata.
- Checkout success, pending, cancel, and error states are transactional states and should remain non-indexable.

These boundaries preserve the repository’s period-specific registration architecture while keeping this document focused on public content.

## 7.5 When to Add a New Category Landing Page

Create an activity or audience landing page only when all are true:

1. At least two current or predictably recurring programs belong to it.
2. Visitors have a real comparison decision to make.
3. SparkPreneurs can provide a unique introduction, selection guidance, and common FAQs.
4. The page can remain useful when one offering ends.

At launch, Pottery meets this threshold. Art & Mixed Media, Creative Technology, Wellness & Movement, and Teens should remain filters/tags until the content inventory grows.

---

# 8. Content Models

These models are content architecture, not a prescribed code schema. Required versus optional validation can be finalized during Astro implementation.

## Model: Program

Represents an evergreen class, activity, camp, after-school experience, or wellness experience. It does not hold volatile checkout totals or secret/payment configuration.

Fields:

- `title`
- `slug`
- `shortDescription`
- `overview`
- `primaryAudience`
- `additionalAudiences` (optional)
- `minimumAge` and `maximumAge` (nullable; never guessed)
- `primaryActivity`
- `activityTags`
- `format`
- `experienceLevel` (optional)
- `sessionOverview` (for example “four instructor-led sessions,” without dated schedule)
- `learningOrExperienceHighlights`
- `inclusions`
- `materialsOrPreparation` (optional)
- `firingAndPickupDetails` (pottery only, optional)
- `location` (reference)
- `availabilityMode` (`registration`, `interest`, `inquiry`, `paused`)
- `primaryImage`
- `galleryImages` (optional)
- `faqs` (embedded, optional)
- `relatedPrograms` (references, optional)
- `seoTitle`
- `seoDescription`
- `lastReviewedDate`

## Model: Offering

Represents a scheduled cohort, camp week/session, Zumba pass/session, after-school plan, or other selectable instance of a Program.

Fields:

- `id` (stable internal identifier)
- `program` (reference)
- `programCode` and `itemCode` (stable public mappings for registrable offerings)
- `label` (for example “Monday evenings” or “Week 1 — Morning”)
- `status` (`open`, `upcoming`, `waitlist`, `full`, `ended`, `cancelled`)
- `startDate`
- `endDate`
- `sessionDates` (when exact dates are known)
- `dayOfWeek` and `startTime`/`endTime`
- `numberOfSessions`
- `duration`
- `minimumAge` and `maximumAge` override (optional)
- `capacityDisplay` or `spacesRemainingDisplay` (optional; only if maintained accurately)
- `price`
- `currency`
- `taxDisplay`
- `displayDataLastSynced` (editorial safeguard; backend pricing remains authoritative)
- `discountLabel` and `originalPrice` (optional, time-bounded)
- `includedItems` override (optional)
- `registrationMode` (`checkout`, `external`, `interest`, `inquiry`)
- `registrationUrl` or form reference
- `registrationOpenDate` and `registrationCloseDate` (optional)
- `location` (reference)
- `businessNotes` (internal/editorial, not public)

## Model: EventType

Represents an evergreen hosted occasion. Initial records: Birthday Party, Private Event, Corporate Event, Bridal Shower.

Fields:

- `title`
- `slug`
- `shortDescription`
- `overview`
- `intendedGroups`
- `supportedActivities`
- `groupSize` (when confirmed)
- `durationOptions` (when confirmed)
- `inclusions`
- `addOnsOrCustomizations` (optional)
- `pricingApproach` (fixed/from/custom quote; only when confirmed)
- `foodCakeAndDecorationRules` (optional)
- `accessibilityAndSetupNotes` (optional)
- `bookingSteps`
- `inquiryRequirements` (date, guest count, activity, etc.)
- `primaryImage`
- `galleryImages` (optional)
- `faqs` (embedded, optional)
- `relatedEventTypes` (references)
- `seoTitle`
- `seoDescription`
- `lastReviewedDate`

## Model: StudioRental

A singleton page model is sufficient while SparkPreneurs has one location and one general rental offer.

Fields:

- `title`
- `shortDescription`
- `overview`
- `suitableUses`
- `spacesOrRoomOptions` (only if distinct options exist)
- `capacityBySetup`
- `rentalDurations` (hourly/daily as currently supported)
- `ratesOrQuoteMethod`
- `includedAmenities`
- `optionalServices`
- `accessAndSetupWindow`
- `rulesAndRestrictions`
- `accessibilityInformation`
- `availabilityProcess`
- `inquiryRequirements`
- `location` (reference)
- `primaryImage`
- `galleryImages`
- `faqs` (embedded, optional)
- `seoTitle`
- `seoDescription`
- `lastReviewedDate`

## Model: GalleryItem

Fields:

- `image`
- `altText`
- `caption` (optional)
- `category` (`program`, `camp`, `event`, `studio`, `finished-work`)
- `relatedProgram` or `relatedEventType` (optional reference)
- `audienceTags` (optional)
- `dateOrSeason` (optional)
- `featured`
- `sortOrder` (optional)

## Model: Location

One singleton record should power Contact, footer, local structured data, and program location references.

Fields:

- `name`
- `streetAddress`
- `unitOrFloor`
- `city`
- `province`
- `postalCode`
- `country`
- `phone`
- `email`
- `hours` (when supplied)
- `mapUrl`
- `directions`
- `transitInformation`
- `parkingInformation`
- `accessibilityInformation`
- `latitude` and `longitude` (optional, verified)
- `socialProfiles`

## Controlled Taxonomy Configuration (Not a Content Collection)

Maintain a small controlled list for audience, activity, format, availability, season, and age bands. These terms do not need their own Markdown files or public pages at launch.

## Models Not Recommended at Launch

- **Separate Camp and Workshop models:** Program + Offering already supports their content and schedule differences.
- **Activity or Program Category collection:** a controlled taxonomy is enough at current scale.
- **Instructor:** current site does not provide bios or instructor-linked content. Add only when the business can maintain it.
- **Blog/Article:** no current editorial program supports it. Do not launch an empty blog for SEO.
- **Public Event:** current “Events” are customizable booking types, not a calendar of public dated events.
- **Standalone FAQ collection:** embed relevant FAQs with the page they answer; extract later only if reuse becomes substantial.
- **Multiple Location collection:** one Location singleton is sufficient until a second studio exists.

---

# 9. Page Templates

## Homepage

- **Purpose:** Explain what SparkPreneurs is, establish Midtown Toronto location, and route visitors quickly.
- **Required sections:** clear value statement; audience/task choices; current program highlights; Camps/After School; Events versus Studio Rental; why choose SparkPreneurs; gallery proof; location/contact summary; final route chooser.
- **Optional sections:** time-sensitive announcement; selected testimonial only when permission/source is documented.
- **Models:** Program, Offering, EventType, StudioRental, GalleryItem, Location.
- **Primary CTA:** Find a Program.

## All Programs Listing

- **Purpose:** Provide one accurate view of current and interest-based programs.
- **Required sections:** page introduction; audience toggles; simple filters for activity/format/availability; program cards with age, format, status, and next action; help choosing.
- **Optional sections:** featured seasonal offering.
- **Models:** Program + current Offering.
- **Primary CTA:** View Program (then Register/Join Interest List on detail).

## Audience Landing (Kids & Youth / Adults)

- **Purpose:** Help one audience understand its choices without browsing unrelated content.
- **Required sections:** audience-specific introduction; current programs; interest/upcoming programs clearly separated; format routes; selection guidance; relevant FAQs.
- **Optional sections:** age filters; relevant gallery preview.
- **Models:** Program, Offering, GalleryItem.
- **Primary CTA:** View Current Programs.

## Activity Comparison Landing (Pottery)

- **Purpose:** Help visitors choose between pottery formats and understand shared practical details.
- **Required sections:** overview; wheel versus hand-building comparison; current program cards; experience guidance; firing/finishing explanation; FAQs.
- **Optional sections:** pottery gallery.
- **Models:** Program, Offering, GalleryItem.
- **Primary CTA:** Compare Current Pottery Programs.

## Program Detail

- **Purpose:** Answer fit questions and lead to the correct action.
- **Required sections:** program identity and audience/age; overview; what participants do/learn; current offering selector; dates/schedule/duration; price/tax display; inclusions/materials; location; preparation/policies; related programs; contextual FAQs.
- **Optional sections:** experience level, firing/pickup, gallery, instructor details only if supplied.
- **Models:** Program + Offering + Location + GalleryItem.
- **Primary CTA:** Register, Join Interest List, or Ask a Question according to `availabilityMode`.

## Workshops Listing

- **Purpose:** List short, date-based experiences without creating permanent pages for empty categories.
- **Required sections:** current workshops ordered by date; audience/age/activity; date/time; price; availability; interest option when none are scheduled.
- **Optional sections:** past-workshop gallery (not past checkout links).
- **Models:** Program + Offering.
- **Primary CTA:** View Workshop / Register.

## Camps Landing

- **Purpose:** Explain camp formats and route parents to available seasons.
- **Required sections:** current camp options; verified age groups; schedule overview; what a camp day includes; location; parent essentials; registration/policy links.
- **Optional sections:** future PA day or March Break cards only when real offerings exist.
- **Models:** Program + Offering + GalleryItem.
- **Primary CTA:** View Current Camp Dates.

## Summer Camp Detail

- **Purpose:** Provide stable parent information while showing changeable weeks/sessions.
- **Required sections:** verified ages; weekly/session selector; exact dates/times; price/tax; activities at a supported level of specificity; what to bring; drop-off/pickup; health/safety/policy links; registration form/action.
- **Optional sections:** week themes, sample day, gallery, sibling/extended-care information only if offered.
- **Models:** Program + Offering + Location.
- **Primary CTA:** Register for a Camp Session.

## After-School Detail

- **Purpose:** Help parents evaluate care, pickup, schedule, commitment, and price.
- **Required sections:** exact ages/grades; eligible pickup schools/area or confirmation process; hours; 3/4/5-day options; minimum commitment; activities; price/tax; calendar/start dates; pickup/late policies; registration.
- **Optional sections:** sample afternoon, snacks/homework information only if offered.
- **Models:** Program + Offering + Location.
- **Primary CTA:** Choose an After-School Option.

## Events Landing

- **Purpose:** Compare hosted event types and explain the shared process.
- **Required sections:** event-type chooser; supported activity overview; Events versus Studio Rental explanation; common booking steps; inquiry information; gallery proof.
- **Optional sections:** shared FAQs.
- **Models:** EventType + GalleryItem + Location.
- **Primary CTA:** Choose Your Event Type.

## Event-Type Detail

- **Purpose:** Answer occasion-specific questions and collect a qualified inquiry.
- **Required sections:** who/what it is for; supported activities; inclusions; verified group size/duration/pricing method; booking steps; inquiry form; policies; related event/rental link.
- **Optional sections:** packages, add-ons, food/decor rules, gallery, FAQs.
- **Models:** EventType + GalleryItem + Location.
- **Primary CTA:** Request Event Availability.

## Studio Rental

- **Purpose:** Qualify space-rental inquiries and prevent confusion with hosted events.
- **Required sections:** suitable uses; space/room description; photos; capacity and layout; amenities; hourly/daily options; rates or quote method; access/rules; booking steps; inquiry form; hosted-event alternative.
- **Optional sections:** floor plan, equipment list, setup diagrams only when supplied.
- **Models:** StudioRental + Location + GalleryItem.
- **Primary CTA:** Request Rental Availability.

## About

- **Purpose:** Explain mission, name, entrepreneurial mindset, approach, and why the studio exists.
- **Required sections:** concise story; mission; meaning of SparkPreneurs; approach and outcomes; audiences/offerings; Midtown Toronto community role; route to programs/contact.
- **Optional sections:** founder/team/instructor information, credentials, partners, testimonials only when verified.
- **Models:** standard page + Location.
- **Primary CTA:** Explore Programs.

## Gallery

- **Purpose:** Provide categorized evidence of the studio and experiences.
- **Required sections:** accessible images grouped or filterable by programs, camps, events, and studio; contextual links.
- **Optional sections:** captions and finished-work stories with permission.
- **Models:** GalleryItem.
- **Primary CTA:** Explore Related Programs.

## Contact & Visit

- **Purpose:** Centralize contact, location, practical visit information, and inquiry routing.
- **Required sections:** address/floor; map; phone; email; hours; directions/transit; parking; accessibility; inquiry type chooser/form; response expectation when verified.
- **Optional sections:** social links, exterior/entrance photo.
- **Models:** Location.
- **Primary CTA:** Contact SparkPreneurs.

## Policy and Waiver Utility

- **Purpose:** Give registrants durable, directly linkable terms and complete required waiver tasks.
- **Required sections:** approved business/legal text; effective/review date; contact route. Waiver also needs form/state/error/confirmation content.
- **Models:** standard policy content; transactional waiver data is outside content collections.
- **Primary CTA:** policy pages—Contact with Questions; waiver—Complete Waiver.

---

# 10. SEO and URL Architecture

## 10.1 URL Rules

- Use lowercase, readable, hyphen-separated slugs and no `.html` or `index.html` in public URLs.
- Use trailing slashes consistently because the intended Astro/GitHub Pages output is directory-based.
- Keep URLs stable across seasons: `/camps/summer-camp/` and `/programs/zumba/`, not routine `/summer-camp-2027/` or `/zumba-fall-2027/` pages.
- Use one canonical URL per page and redirect every legacy route to it.
- Do not expose additive filter combinations as indexable URLs. If query parameters are used for interface state, canonicalize to the useful listing page unless a curated landing page exists.
- Use root-relative internal links in the implementation.

This follows Google’s guidance to use simple, descriptive, human-readable URLs and hyphens, and to avoid unnecessary parameter combinations: [URL structure best practices](https://developers.google.com/search/docs/crawling-indexing/url-structure).

## 10.2 Breadcrumbs

Use visible breadcrumbs on all pages below the first level. Breadcrumbs should represent the useful visitor path, which does not have to duplicate the URL path exactly. Examples:

- Home → Programs → Kids & Youth → 3D Printing
- Home → Programs → Pottery → Pottery Wheel
- Home → Camps → Summer Camp
- Home → Events → Corporate Events

Google explicitly recommends breadcrumbs as a way to communicate site position and says they should represent a typical user path: [Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

## 10.3 Page Titles and Search Intent

Use unique titles based on real page content. Suggested patterns:

- Homepage: `Creative Art, Pottery, Tech & Wellness Studio in Midtown Toronto | SparkPreneurs`
- Audience: `Kids & Youth Creative Programs in Midtown Toronto | SparkPreneurs`
- Program: `[Program Name] in Midtown Toronto | SparkPreneurs`
- Camps: `Creative Summer Camp in Midtown Toronto | SparkPreneurs`
- After School: `Creative After-School Program in Midtown Toronto | SparkPreneurs`
- Event type: `[Event Type] in Toronto | SparkPreneurs`
- Rental: `Creative Studio Rental in Midtown Toronto | SparkPreneurs`

These are title formulas, not permission to add unsupported claims. Each meta description should state the verified audience, activity, location, format, and next action in natural language.

## 10.4 Local SEO

- Centralize the official name, address, phone, email, and hours in the Location model; reuse it consistently in the footer, Contact page, and structured data.
- Make `/contact/` the strongest location page with address, second-floor detail, map, directions, transit, parking, accessibility, and studio hours.
- Use “Midtown Toronto” and “Toronto” naturally where location is relevant; do not repeat location phrases mechanically.
- Keep the Google Business Profile name/address/phone/hours aligned with the website. Google recommends a Business Profile for local map visibility: [local business search appearance guidance](https://developers.google.com/search/help/site-appearance-faq#local-business).
- Use original studio/program/event imagery with descriptive alt text and meaningful filenames.
- Add LocalBusiness/Organization structured data only with visible, verified details. Google advises placing LocalBusiness data on a page containing business information and following Organization fields as applicable: [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business).

## 10.5 Structured Data

- `LocalBusiness` and/or suitable `Organization` data on Contact/About, using the one verified location record.
- `BreadcrumbList` on hierarchical pages.
- Use `Event` only for a genuine public dated event page with visible matching details—not for an evergreen Birthday Party or Corporate Events service page.
- Structured data must match visible content and should not be used to imply reviews, prices, dates, or availability that the page does not show. See Google’s [general structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## 10.6 Canonicals, Redirects, and Indexation

- Every indexable page should have a self-referencing canonical URL on `https://sparkpreneurs.ca/`.
- Send permanent server/platform redirects from each old page to the migration target; do not rely on canonical tags alone for moved URLs.
- Include only canonical, indexable, live pages in the XML sitemap.
- Exclude checkout return states, form success/error states, query-filter combinations, and `/waiver/` from the XML sitemap and mark them `noindex` where they resolve as standalone states.
- Keep internal links pointed at canonical URLs.
- Google treats redirects and canonical annotations as strong canonicalization signals and sitemap inclusion as a weaker signal: [canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## 10.7 Internal Linking Rules

- Homepage links to all primary journeys, not every detail page.
- Audience pages link to their canonical Program pages.
- Program pages link back to their audience, activity comparison (when it exists), relevant format, and two or three genuinely related programs.
- Camp and After School pages cross-link because parents may compare them, but neither should be the parent of the other.
- Event-type pages cross-link to the Events overview and Studio Rental with a plain explanation of the difference.
- Gallery items link to relevant programs/events only where the relationship is real.
- About links to Programs and Contact; Contact links back to main booking paths.

## 10.8 Content Lifecycle and Seasonal SEO

- Keep evergreen program copy separate from dated offerings.
- Update the visible `lastReviewedDate` only when useful to users; always maintain it editorially.
- When registration ends, change the offering to Ended and remove its checkout action. Keep the program page indexed if the experience is expected to return, with an interest/contact action.
- Do not keep expired prices or “limited-time” promotions in evergreen prose.
- Do not create yearly archive pages unless SparkPreneurs later develops substantial, useful historical content.

---

# 11. Migration Mapping

All old directory and explicit `index.html` forms should resolve to the same new canonical target. Redirect implementation is outside this document, but the mapping is mandatory for launch.

| Current URL | New URL | Action | Content model | Notes |
| --- | --- | --- | --- | --- |
| `/` | `/` | Keep and rewrite structure | Homepage composition | Preserve brand/location meaning; replace generic program routing |
| `/#explore-sparkpreneurs` | `/programs/` | Merge and update links | Program listing | Homepage may retain a smaller Explore section |
| `/#gallery` | `/gallery/` | Move | GalleryItem | Keep a curated homepage preview |
| `/#about` | `/about/` | Merge | Standard page | Anchor links should point to the canonical About page |
| `/#contact` | `/contact/` | Move | Location | Footer still carries concise contact details |
| `/about-us/` and `/about-us/index.html` | `/about/` | 301 redirect; move | Standard page | Preserve mission/name explanation; remove duplicated event/rental detail |
| `/camps/` and `/camps/index.html` | `/programs/kids-youth/` | 301 redirect; move | Audience landing | Current slug does not describe the page |
| `/classes/` and `/classes/index.html` | `/programs/kids-youth/` | 301 redirect; merge | Program listing | Current page only lists 3D Printing; canonical detail remains separate |
| `/3d-printing/` and `/3d-printing/index.html` | `/programs/3d-printing/` | 301 redirect; move | Program + Offering | Preserve program/registration information; validate current dates/ages |
| `/workshops/` and `/workshops/index.html` | `/workshops/` | Keep clean URL; move content | Program + Offering listing | Replace placeholder/waiver remnants with actual current listings |
| `/camp/` and `/camp/index.html` | `/camps/` | 301 redirect; replace | Format landing | Remove After School as a child of Camps; cross-link it instead |
| `/summer-camp/` and `/summer-camp/index.html` | `/camps/summer-camp/` | 301 redirect; move | Program + Offering | Stable seasonal page; verify ages and all current sessions |
| `/after-school/` and `/after-school/index.html` | `/after-school/` | Keep canonical clean URL | Program + Offering | Expand parent essentials and confirm pickup eligibility |
| `/art-studio/` and `/art-studio/index.html` | `/programs/adults/` | 301 redirect; move | Audience landing | “Adult Programs” is clearer and includes wellness/technology when verified |
| `/pottery-wheel/` and `/pottery-wheel/index.html` | `/programs/pottery-wheel/` | 301 redirect; move | Program + Offering | Move dated cohort information into Offerings |
| `/hand-building-pottery/` and `/hand-building-pottery/index.html` | `/programs/hand-building-pottery/` | 301 redirect; move | Program + Offering | Move promotion/schedules into time-bounded Offerings |
| `/zumba/` and `/zumba/index.html` | `/programs/zumba/` | 301 redirect; move | Program + Offering | Keep stable URL; confirm audience and current session range |
| `/book-your-event/` and `/book-your-event/index.html` | `/events/` | 301 redirect; move | EventType listing | Split unique, supplied details into child event pages |
| `/music-club/` and `/music-club/index.html` | `/programs/pottery/` | 301 redirect; merge | Activity landing + Program | Do not preserve inaccurate Music Club slug/title |
| `/robotics-lab/` and `/robotics-lab/index.html` | `/programs/3d-printing/` | 301 redirect; merge | Program | Do not imply robotics if the actual content is 3D printing |
| `/yoga-gymnastics/` and `/yoga-gymnastics/index.html` | `/programs/` | 301 redirect; merge verified content only | Program listing | Create a specific movement program page later only when currently offered |
| `/waiver/` and `/waiver/index.html` | `/waiver/` | Keep utility URL | Transactional utility | Remove from primary nav; noindex; replace placeholder claims when workflow is connected |

### Migration Rules

1. Redirect old URLs one-to-one wherever a clear successor exists.
2. Never redirect all removed content to the homepage; use the closest useful destination.
3. Preserve only verified, current claims. A migration is an editorial review, not a blind copy.
4. Extract dates, price, promotions, and availability into Offering data.
5. Retain useful mission, program, firing, event, and rental information once; remove duplicated copies elsewhere.
6. Do not publish a child event page, policy, or rental detail page until its required business content is supplied.
7. After launch, test old URLs, canonical tags, breadcrumbs, internal links, XML sitemap membership, and form/registration destinations.

---

# 12. Content Gaps

The following are information requirements, not invented facts.

## High Priority

### Program Accuracy and Registration

- Exact audience and age/grade range for every program, especially Zumba, After School, 3D Printing, and any yoga/dance offer. `[CONTENT REQUIRED FROM BUSINESS]`
- Confirmation of whether the Kids hub’s ages 9–14 summer camp is a real current/repeating offer. `[CONTENT REQUIRED FROM BUSINESS]`
- Current status for Adult Papier-Mâché, Adult 3D Printing, Yoga & Dance, kids art/pottery classes, and all interest-only categories. `[CONTENT REQUIRED FROM BUSINESS]`
- Exact session dates, times, duration, capacity, price, tax display, registration window, and status for every current Offering. `[CONTENT REQUIRED FROM BUSINESS]`
- A consistent rule for Register versus Join Interest List versus Request Booking. `[CONTENT REQUIRED FROM BUSINESS]`
- Program prerequisites, materials, what to bring, missed-session/makeup rules, and cancellation/refund/transfer rules. `[CONTENT REQUIRED FROM BUSINESS]`
- Pottery firing, glazing, additional-piece fees, processing time, and pickup policy reconciled across both pottery programs. `[CONTENT REQUIRED FROM BUSINESS]`

### Camps and After School

- Verified camp ages, dates, themes/activities, daily schedule, drop-off/pickup, lunch/snack requirements, what to bring, and health/safety information. `[CONTENT REQUIRED FROM BUSINESS]`
- After-school eligible ages/grades, start/end calendar, eligible pickup schools or geographic rule, pickup process, late pickup policy, and what the afternoon includes. `[CONTENT REQUIRED FROM BUSINESS]`

### Events

- Unique details for Birthday, Private, Corporate, and Bridal Shower pages: supported activities, minimum/maximum group, duration, pricing/quote method, inclusions, add-ons, food/cake/decor rules, deposits, cancellation, accessibility, and booking lead time. `[CONTENT REQUIRED FROM BUSINESS]`
- One qualified event inquiry form and a confirmed response expectation. `[CONTENT REQUIRED FROM BUSINESS]`

### Studio Rental

- Space/room descriptions, capacities by setup, dimensions if useful, photos, accessibility, included furniture/equipment, hourly/daily rates or quote method, minimum booking, setup/cleanup time, permitted uses, restrictions, insurance/deposit/cancellation rules, and availability process. `[CONTENT REQUIRED FROM BUSINESS]`

### Location, Trust, and Policies

- Official studio hours and any appointment-only rules. `[CONTENT REQUIRED FROM BUSINESS]`
- Directions, nearby transit, parking, entrance/second-floor access, and accessibility details. `[CONTENT REQUIRED FROM BUSINESS]`
- Approved Privacy Policy covering inquiries, registration, waiver, payment handoff, mailing-list consent, analytics, retention, and contact requests. `[CONTENT REQUIRED FROM BUSINESS]`
- Approved Registration & Cancellation Policy. `[CONTENT REQUIRED FROM BUSINESS]`
- Confirmation of the live waiver workflow and when registrants receive the waiver link. `[CONTENT REQUIRED FROM BUSINESS]`
- Verifiable reasons to choose SparkPreneurs: instructor qualifications, class-size approach, safety practices, accessibility, or testimonials only where evidence/permission exists. `[CONTENT REQUIRED FROM BUSINESS]`

## Medium Priority

- Contextual FAQs for Programs, Camps, After School, Events, and Rental, based on real customer questions. `[CONTENT REQUIRED FROM BUSINESS]`
- Better gallery metadata: meaningful alt text, category, related program/event, approximate season, and usage permission. `[CONTENT REQUIRED FROM BUSINESS]`
- Founder/team/instructor story and approved photos if the business wants people-led trust content. `[CONTENT REQUIRED FROM BUSINESS]`
- A concise sample camp day and sample after-school afternoon, if the actual experience is consistent enough to describe. `[CONTENT REQUIRED FROM BUSINESS]`
- A plain-language “How registration works” explanation, including what happens after payment and when confirmation arrives. `[CONTENT REQUIRED FROM BUSINESS]`
- Inquiry confirmation messages that state what was received and what happens next.
- Consistent photography coverage for each active program, each event type, and the actual rental space.

## Low Priority

- Instructor model and profile pages after there are multiple maintained bios and a user need to browse them.
- Public event/calendar model only if SparkPreneurs begins hosting recurring public dated events.
- Blog/resources only after an owner, cadence, and useful topics are defined; do not create an empty blog for SEO.
- Additional activity landing pages after the category threshold in section 7.5 is met.
- Multiple location pages only if another physical studio opens.

---

# Final Recommended Architecture

This section is the implementation handoff. A new Astro project should follow it without repeating the research.

## 1. Final Sitemap

```text
/
├── programs/
│   ├── kids-youth/
│   ├── adults/
│   ├── pottery/
│   ├── 3d-printing/
│   ├── pottery-wheel/
│   ├── hand-building-pottery/
│   └── zumba/
├── workshops/
├── camps/
│   └── summer-camp/
├── after-school/
├── events/
│   ├── birthday-parties/
│   ├── private-events/
│   ├── corporate-events/
│   └── bridal-showers/
├── studio-rental/
├── gallery/
├── about/
├── contact/
└── policies/
    ├── privacy/
    └── registration-cancellation/

Utility, noindex, excluded from XML sitemap:
/waiver/
```

## 2. Final Navigation

- Programs
  - All Programs
  - Kids & Youth
  - Adults
  - Pottery
  - Workshops
- Camps
- After School
- Events
  - Birthday Parties
  - Private Events
  - Corporate Events
  - Bridal Showers
- Studio Rental
- About
- Contact
- Persistent action: **Find a Program**

Gallery and policies belong in the footer. Waiver is a transactional link supplied to registrants, not a primary discovery item.

## 3. Final Page Types

1. Homepage
2. All Programs listing
3. Audience landing
4. Activity comparison landing (Pottery only at launch)
5. Program detail with current Offerings
6. Workshops listing
7. Camps landing
8. Summer Camp detail
9. After-School detail
10. Events landing
11. Event-type detail
12. Studio Rental detail
13. About
14. Gallery
15. Contact & Visit
16. Policy
17. Waiver/transaction utility

## 4. Final Content Models

- **Program:** evergreen identity, audience, activity, format, benefits/experience, inclusions, preparation, location, availability mode, media, FAQs, relations, and SEO.
- **Offering:** program reference, public program/item codes, selectable label, status, dates/times/duration, session count, optional narrowed age, display price/tax/promotion, registration mode/link, and location. The period backend remains authoritative for price and availability.
- **EventType:** one record each for Birthday, Private, Corporate, and Bridal Shower, with occasion-specific activity, capacity, duration, inclusion, pricing method, booking, media, FAQ, and SEO fields.
- **StudioRental:** one singleton with uses, spaces/capacity, durations/rates, amenities, rules, access, inquiry, media, and location.
- **GalleryItem:** image, alt text, category, optional caption/date, related content, and featured/order controls.
- **Location:** the single official name/address/floor/city/postal code/phone/email/hours/map/directions/transit/parking/accessibility/social source.
- **Controlled taxonomy config:** Audience, Activity, Format, Availability, Age band, and Season. Do not create a collection/page per term.

Do not create separate Camp, Workshop, Activity, Instructor, Blog, Public Event, FAQ, or multiple-Location models at launch.

## 5. Final Program Taxonomy

- **Primary browsing audiences:** Kids & Youth; Adults.
- **Activity filters:** Art & Mixed Media; Pottery; Creative Technology / 3D Printing; Wellness & Movement.
- **Format:** Class; Workshop; Camp; After School; Seasonal Pass.
- **Availability:** Open; Upcoming; Interest List; Waitlist; Full; Ended; Paused.
- **Age:** exact numeric min/max where verified; user-facing age bands derived for filtering.
- **Schedule metadata:** day, time, exact session dates, duration, and session count on Offerings.
- **Season metadata:** season/year on Offerings; never routine year-based public URLs.

Pottery receives a landing page because visitors must choose between two current formats. Other activity terms remain filters until they support at least two current programs plus unique selection content.

## 6. Final User Journeys

- Parent → Kids & Youth → choose/filter by fit → Program → Offering → Register.
- Parent → Camps → Summer Camp → week/session → Register.
- Parent → After School → verify age/pickup/schedule → plan → Register.
- Adult → Adult Programs → activity → Program → cohort/pass → Register.
- Unscheduled-program visitor → relevant audience/program context → Join Interest List.
- Event customer → Events → event type → details → Request Event Availability.
- Business organizer → Corporate Events → logistics/options → Request Event Availability.
- Artist/instructor/business → Studio Rental → fit/rates/rules → Request Rental Availability.
- General visitor → Home/About → understand studio/location → Programs, Events, Rental, or Contact.
- Registrant → direct Waiver link → complete → confirmation.

## 7. Migration Rules

- Use one canonical page per program and one Offering record per schedule/cohort/pass/week.
- Permanently redirect every legacy path according to section 11.
- Replace misleading paths: `/camps/` (old Kids hub), `/music-club/`, and `/robotics-lab/` must not survive as canonical URLs.
- Separate `/camps/` from `/after-school/`; cross-link them rather than nesting one under the other.
- Move `/book-your-event/` to `/events/`; create child event pages only with unique supplied content.
- Move homepage About, Gallery, and Contact anchors to permanent pages while retaining short homepage/footer summaries.
- Keep `/waiver/` as a noindex utility and remove it from primary navigation.
- Extract dates, prices, promotions, availability, and registration actions from page prose into Offerings.
- Keep Astro Offering data display-only for checkout purposes; period-specific Apps Script `Products` rows remain authoritative, and success appears only after server-side Stripe verification.
- Remove or withhold unverified claims; use `[CONTENT REQUIRED FROM BUSINESS]` rather than inference.
- Include only canonical, indexable pages in the XML sitemap; use self-canonicals and clean trailing-slash URLs.

## 8. Content Gaps

Before launch, the business must supply or approve:

- Exact audiences/ages, current availability, dates, times, prices, capacities, inclusions, preparation, and policies for every active program.
- Reconciled information for camp age groups, after-school ages/schools/pickup, pottery firing/pickup, and Zumba audience/schedule.
- Unique packages/logistics/booking rules for all four event types.
- Complete Studio Rental capacity, amenities, rates/quote method, access, rules, photos, and booking details.
- Contact hours, directions/transit/parking, second-floor access, and accessibility information.
- Privacy and Registration & Cancellation policies, plus confirmation of the real waiver workflow.
- Verified trust content and image permissions.

Until those facts are supplied, do not publish thin event/policy/rental pages or present interest-only programs as open for registration.
