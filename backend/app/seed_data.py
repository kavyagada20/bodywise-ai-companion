import json
from sqlalchemy.orm import Session
from app.models import Product, User, UserProfile, Routine, RoutineTask, TaskCompletion, ProgressEntry, WeeklySummary, Reminder, Conversation, Message
import datetime

VERIFIED_PRODUCTS = [
    {
        "name": "1% Salicylic Acid Body Wash",
        "category": "Body",
        "intended_concern": "Body acne",
        "description": "Exfoliating body wash formulated with 1% Salicylic Acid and soothing Chamomile extract. Unclogs pores, cleanses excess sebum, reduces strawberry skin, and smoothens rough bumps without stripping natural skin moisture.",
        "ingredients": "Aqua, Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, 1% Salicylic Acid, Glycerin, Chamomilla Recutita (Chamomile) Flower Extract, Aloe Barbadensis Leaf Juice, Phenoxyethanol, Ethylhexylglycerin, Disodium EDTA, Fragrance.",
        "key_actives": "1% Salicylic Acid, Chamomile Extract, Aloe Vera",
        "usage_instructions": "Dispense a generous amount onto wet palms or a loofah. Gently massage onto damp skin in circular motions, focusing on chest, back, and rough patches. Leave on for 60 seconds, then rinse thoroughly with lukewarm water. Use 3-4 times a week or daily as tolerated.",
        "warnings": "For external use only. Avoid contact with eyes and broken skin. Discontinue use if irritation or rash develops. Use broad-spectrum sunscreen on exposed areas during daytime.",
        "benefits": "Unclogs body pores, clears back and chest breakouts, smoothens bumpy skin texture, and soothes irritation.",
        "price": 349.0,
        "rating": 4.8,
        "review_count": 1420,
        "source_url": "https://bebodywise.com/products/salicylic-acid-body-wash",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "How often should I use this body wash?", "a": "You can start by using it 3 times a week, and build up to daily use as tolerated by your skin."},
            {"q": "Can I use this on my face?", "a": "This formula is specifically buffered and designed for body skin, which is thicker. For facial acne, we recommend our 1% Salicylic Acid Face Wash."}
        ])
    },
    {
        "name": "2.5% Micronized Benzoyl Peroxide Body Wash",
        "category": "Body",
        "intended_concern": "Body acne",
        "description": "Potent dermatologically formulated acne-clearing cleanser with 2.5% micronized Benzoyl Peroxide. Targets acne-causing bacteria deep inside hair follicles, reduces active cysts, and prevents recurring backne and butt acne.",
        "ingredients": "Aqua, 2.5% Micronized Benzoyl Peroxide, Acrylates Copolymer, Glycerin, Cocamidopropyl Betaine, Sodium Cocoyl Glycinate, Sodium Hydroxide, Disodium EDTA, Phenoxyethanol.",
        "key_actives": "2.5% Micronized Benzoyl Peroxide, Glycerin",
        "usage_instructions": "Apply to wet skin on the back, shoulders, and chest. Gently lather and leave on skin for 2 to 3 minutes to allow the micronized actives to penetrate bacterial pores. Rinse thoroughly. Pat dry with a white towel.",
        "warnings": "Benzoyl Peroxide can bleach dark or coloured fabrics and towels. May cause mild peeling or dryness during initial 2 weeks. Discontinue if severe allergic contact dermatitis occurs.",
        "benefits": "Kills acne-causing Cutibacterium acnes, clears stubborn active pustules, and prevents post-inflammatory blemishes.",
        "price": 399.0,
        "rating": 4.7,
        "review_count": 980,
        "source_url": "https://bebodywise.com/products/benzoyl-peroxide-body-wash",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1608248597359-54313f898f79?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "Why do I need to leave it on for 2-3 minutes?", "a": "Micronized Benzoyl Peroxide requires short contact therapy (2-3 minutes) to effectively neutralize bacteria inside thick body pores before being rinsed."},
            {"q": "Will it bleach my clothes?", "a": "Yes, rinse very thoroughly and dry off with a white or light-coloured towel to avoid fabric discolouration."}
        ])
    },
    {
        "name": "10% Niacinamide Body Lotion with Aloe Vera",
        "category": "Body",
        "intended_concern": "Pigmentation",
        "description": "Ultra-lightweight, non-greasy brightening body lotion with high-purity 10% Niacinamide. Fades dark spots, sun tan, knee and elbow pigmentation, and strengthens the skin's lipid moisture barrier.",
        "ingredients": "Purified Water, 10% Niacinamide, Caprylic/Capric Triglyceride, Glycerin, Aloe Barbadensis Leaf Extract, Cetearyl Alcohol, Ceteareth-20, Shea Butter, Vitamin E Acetate, Xanthan Gum, Phenoxyethanol.",
        "key_actives": "10% Niacinamide, Pure Aloe Vera, Vitamin E",
        "usage_instructions": "Take an adequate amount and massage evenly over cleansed body skin immediately after bathing or showering while skin is slightly damp. Suitable for both morning and evening use.",
        "warnings": "For external topical use only. Perform a patch test inside the elbow 24 hours prior to first full application.",
        "benefits": "Brightens uneven skin tone, reduces hyperpigmentation on neck and joints, deeply hydrates without tackiness.",
        "price": 499.0,
        "rating": 4.9,
        "review_count": 2100,
        "source_url": "https://bebodywise.com/products/10-niacinamide-body-lotion",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "Can I use this daily?", "a": "Yes, it is gentle enough for daily use, preferably morning and night for best brightening results."},
            {"q": "Does it feel greasy in humid weather?", "a": "No, it features a quick-absorbing, water-gel cream texture designed specifically for warm climates."}
        ])
    },
    {
        "name": "4% AHA BHA Underarm Roll-On",
        "category": "Body",
        "intended_concern": "Pigmentation",
        "description": "Aluminum-free, non-staining underarm roll-on formulated with 4% AHA BHA (Lactic Acid + Mandelic Acid + Salicylic Acid). Gently exfoliates dead pigmented cells, prevents ingrown hairs, and neutralizes odor-causing bacteria.",
        "ingredients": "Aqua, Lactic Acid (3%), Mandelic Acid, Salicylic Acid (1%), Propylene Glycol, Zinc Ricinoleate, Hydroxyethylcellulose, Allantoin, Phenoxyethanol, Ethylhexylglycerin.",
        "key_actives": "Lactic Acid, Mandelic Acid, Salicylic Acid, Zinc Ricinoleate",
        "usage_instructions": "Glide 2-3 strokes over clean and dry underarms in the morning. Allow it to dry for 30 seconds before wearing clothes.",
        "warnings": "Do not apply on freshly waxed, shaved, or irritated skin. Wait 24 hours post-hair removal before applying AHAs.",
        "benefits": "Lightens hyperpigmented underarms, minimizes strawberry texture, and controls odor naturally.",
        "price": 279.0,
        "rating": 4.7,
        "review_count": 1850,
        "source_url": "https://bebodywise.com/products/aha-bha-underarm-roll-on",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "Does this contain aluminum?", "a": "No, it is 100% aluminum-free and lets your skin breathe while eliminating bacteria."},
            {"q": "When can I expect results for pigmentation?", "a": "Visible lightening of dark underarm patches is typically observed within 4 to 6 weeks of consistent daily application."}
        ])
    },
    {
        "name": "Hair Growth Serum with Redensyl & Procapil",
        "category": "Hair",
        "intended_concern": "Hair fall",
        "description": "Clinically proven water-based hair growth concentrate with 3% Redensyl, 3% Procapil, and 2% Baicapil. Reactivates dormant hair stem cells, prolongs the anagen growth phase, and reduces telogen hair fall without greasiness.",
        "ingredients": "Purified Water, 3% Redensyl (Glycerin, Sodium Metabisulfite, Glycine, Larix Europaea Wood Extract, Zinc Chloride, Camellia Sinensis Leaf Extract), 3% Procapil (Butylene Glycol, PPG-26-Buteth-26, PEG-40 Hydrogenated Castor Oil, Apigenin, Oleanolic Acid, Biotinoyl Tripeptide-1), 2% Baicapil, Saw Palmetto Extract, Phenoxyethanol, Ethylhexylglycerin.",
        "key_actives": "3% Redensyl, 3% Procapil, 2% Baicapil, Saw Palmetto",
        "usage_instructions": "Fill dropper with 1ml of serum. Part hair and apply drop-by-drop directly onto affected scalp areas (temples, crown, parting line). Gently massage with clean fingertips for 1-2 minutes. Use nightly before sleeping. Do not rinse.",
        "warnings": "For scalp application only. Do not wash hair immediately after application. Consistent daily usage for 3-4 months is necessary for cellular follicle reactivation.",
        "benefits": "Reduces hair thinning, stimulates new baby hair growth, increases follicle density, and leaves no oily residue.",
        "price": 799.0,
        "rating": 4.9,
        "review_count": 3400,
        "source_url": "https://bebodywise.com/products/hair-growth-serum",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "Will my hair look oily after applying?", "a": "No, it is a lightweight water-based formula that dries down completely within 5 minutes without stickiness."},
            {"q": "Does it cause initial shedding?", "a": "A small fraction of users might experience temporary shedding in the first 2-3 weeks as dormant telogen hairs make way for new anagen hairs."}
        ])
    },
    {
        "name": "1% Ketoconazole & ZPTO Anti-Dandruff Shampoo",
        "category": "Hair",
        "intended_concern": "Dandruff",
        "description": "Dual-action antifungal and soothing shampoo containing 1% Ketoconazole and 1% Zinc Pyrithione (ZPTO). Eliminates Malassezia dandruff fungus at the root, soothes persistent scalp itch, and prevents flake recurrence.",
        "ingredients": "Purified Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, 1% Ketoconazole, 1% Zinc Pyrithione, Aloe Barbadensis Leaf Juice, Polyquaternium-7, Panthenol (Vitamin B5), Citric Acid, Disodium EDTA, Fragrance.",
        "key_actives": "1% Ketoconazole, 1% Zinc Pyrithione, Aloe Vera, Vitamin B5",
        "usage_instructions": "Wet scalp and hair thoroughly. Apply shampoo and work into a rich lather. Crucial: leave the lather on your scalp for 3 to 5 minutes so the antifungal actives can penetrate before rinsing thoroughly. Use 2 to 3 times weekly.",
        "warnings": "Avoid contact with eyes. If irritation or severe redness occurs, stop use. For external scalp use only.",
        "benefits": "Clears stubborn greasy and dry dandruff flakes, relieves itching and scalp inflammation from the first wash.",
        "price": 349.0,
        "rating": 4.8,
        "review_count": 2200,
        "source_url": "https://bebodywise.com/products/anti-dandruff-shampoo",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "How long should I leave it on the scalp?", "a": "Always leave it on for at least 3-5 minutes before rinsing; rinsing too quickly reduces antifungal efficacy."},
            {"q": "Can I use regular conditioner afterwards?", "a": "Yes, apply conditioner to hair lengths and ends only, avoiding direct scalp application."}
        ])
    },
    {
        "name": "1% Salicylic Acid Face Wash",
        "category": "Face",
        "intended_concern": "Acne",
        "description": "Oil-free gel cleanser containing 1% encapsulated Salicylic Acid and soothing Allantoin. Deep cleans pores, dissolves blackheads and whiteheads, and balances facial oil production without disrupting skin barrier.",
        "ingredients": "Purified Water, Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, 1% Salicylic Acid, Glycerin, Allantoin, Niacinamide, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Phenoxyethanol, Disodium EDTA.",
        "key_actives": "1% Salicylic Acid, Allantoin, Tea Tree Oil",
        "usage_instructions": "Pump a small amount onto wet hands, massage gently onto face in upward circular motions for 60 seconds. Rinse thoroughly with water and pat dry. Use twice daily, morning and evening.",
        "warnings": "Avoid sensitive eye area. Mild dryness may happen in the first week. Follow up with an oil-free moisturizer.",
        "benefits": "Dissolves pore congestion, calms active cystic redness, controls midday oiliness, and smoothens skin texture.",
        "price": 299.0,
        "rating": 4.8,
        "review_count": 1650,
        "source_url": "https://bebodywise.com/products/salicylic-acid-face-wash",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1556228722-d0b9771b272f?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "Is this safe for sensitive acne-prone skin?", "a": "Yes, the 1% concentration paired with Allantoin ensures effective exfoliation without burning or flaking."},
            {"q": "Can teenagers use this?", "a": "Yes, suitable for anyone dealing with hormonal excess oil and breakouts above 16 years of age."}
        ])
    },
    {
        "name": "10% Niacinamide Face Serum with Zinc PCA",
        "category": "Face",
        "intended_concern": "Acne",
        "description": "Lightweight water-based corrective serum formulated with 10% high-grade Niacinamide and 1% Zinc PCA. Regulates sebum production, fades post-acne blemishes, and visibly tightens enlarged facial pores.",
        "ingredients": "Aqua, 10% Niacinamide, 1% Zinc PCA, Propanediol, Glycerin, Sodium Hyaluronate, Hydroxyethylcellulose, Phenoxyethanol, Ethylhexylglycerin.",
        "key_actives": "10% Niacinamide, 1% Zinc PCA, Hyaluronic Acid",
        "usage_instructions": "After cleansing, apply 2 to 3 drops to the entire face. Pat gently into skin until absorbed. Follow with moisturizer and daytime sunscreen. Use morning and night.",
        "warnings": "Do not layer concurrently with high-percentage pure L-Ascorbic Acid (Vitamin C) in the same immediate routine step.",
        "benefits": "Reduces redness, fades dark acne marks, regulates excess T-zone oil, and improves skin resilience.",
        "price": 549.0,
        "rating": 4.9,
        "review_count": 2890,
        "source_url": "https://bebodywise.com/products/10-niacinamide-serum",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "Can I use this with retinol?", "a": "Yes, Niacinamide pairs wonderfully with retinol and helps reduce retinol-induced dryness."},
            {"q": "How fast does it fade blemishes?", "a": "Most users see visible lightening of hyperpigmented post-acne marks within 3 to 4 weeks."}
        ])
    },
    {
        "name": "Ceramide & Hyaluronic Acid Barrier Moisturizer",
        "category": "Face",
        "intended_concern": "Dry skin",
        "description": "Non-comedogenic barrier repair cream enriched with 5 essential ceramides, botanical hyaluronic acid, and colloidal oat. Restores compromised skin barrier, locks in 72-hour moisture, and calms redness.",
        "ingredients": "Aqua, Caprylic/Capric Triglyceride, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Hyaluronate, Colloidal Oat, Carbomer, Phenoxyethanol.",
        "key_actives": "Ceramides Complex (NP, AP, EOP), Hyaluronic Acid, Colloidal Oat",
        "usage_instructions": "Take a dime-sized amount and warm between fingertips. Smooth evenly over face and neck morning and night. Reapply anytime skin feels parched or tight.",
        "warnings": "Store in a cool dry place away from direct sunlight. For external use only.",
        "benefits": "Instantly heals flaky or burning compromised skin barrier, prevents moisture loss, and imparts healthy dewy radiance.",
        "price": 449.0,
        "rating": 4.9,
        "review_count": 1980,
        "source_url": "https://bebodywise.com/products/ceramide-face-moisturizer",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "Will this clog my pores if I have combination skin?", "a": "No, it is 100% non-comedogenic and formulated to absorb without a heavy grease film."},
            {"q": "Is it fragrance-free?", "a": "Yes, it is completely fragrance-free and formulated for sensitive, barrier-compromised skin."}
        ])
    },
    {
        "name": "Biotin Hair Gummies with Zinc & Multivitamins",
        "category": "Nutrition",
        "intended_concern": "Hair growth",
        "description": "Delicious strawberry-flavoured vegan gummies packed with 5000 mcg Biotin, Zinc, Folic Acid, and Essential Vitamins A, C, D, and E. Nourishes hair roots internally, strengthens brittle nails, and promotes keratin production.",
        "ingredients": "Glucose Syrup, Sugar, Pectin, D-Biotin (5000 mcg), Zinc Citrate, Vitamin A Acetate, Vitamin C (Ascorbic Acid), Vitamin E, Folic Acid, Natural Strawberry Flavour, Citric Acid, Fruit & Vegetable Juice for colour.",
        "key_actives": "5000 mcg Biotin, Zinc Citrate, Vitamin C, Vitamin E",
        "usage_instructions": "Chew 1 gummy thoroughly once a day after breakfast or lunch. No water needed. Consume consistently for at least 60-90 days.",
        "warnings": "Dietary supplement only. Do not exceed the recommended daily allowance. Pregnant or nursing mothers and individuals with known medical conditions should consult a physician.",
        "benefits": "Boosts keratin synthesis, thickens hair shaft diameter, strengthens brittle nails, and reduces nutritional shedding.",
        "price": 499.0,
        "rating": 4.8,
        "review_count": 4200,
        "source_url": "https://bebodywise.com/products/biotin-hair-gummies",
        "verification_status": "Verified Be Bodywise Information",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
        "faq_json": json.dumps([
            {"q": "Are these gummies vegetarian?", "a": "Yes! They are 100% vegetarian and gelatin-free, formulated using natural fruit pectin."},
            {"q": "Do they cause weight gain?", "a": "No, each gummy contains less than 15 calories and contains no artificial additives."}
        ])
    }
]


def seed_database(db: Session):
    """Seed the database with verified products and a demo user profile."""
    # Seed Products
    existing_products_count = db.query(Product).count()
    if existing_products_count == 0:
        for p_data in VERIFIED_PRODUCTS:
            prod = Product(**p_data)
            db.add(prod)
        db.commit()

    # Seed Demo User
    demo_user = db.query(User).filter(User.email == "kavya@bodywise.demo").first()
    if not demo_user:
        demo_user = User(
            name="Kavya Gada",
            email="kavya@bodywise.demo",
            password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", # bcrypt hash of 'demo123'
            is_demo=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    # Seed Demo Profile
    if not demo_user.profile:
        profile = UserProfile(
            user_id=demo_user.id,
            age_range="25-34",
            primary_concern="Hair fall",
            secondary_concerns="Body acne, Pigmentation",
            current_products="Mild shampoo, regular soap",
            routine_frequency="daily",
            reminder_time="08:00 AM, 09:30 PM",
            preferences="Sensitive skin, fragrance-light",
            routine_habits="Intermediate"
        )
        db.add(profile)
        db.commit()

    # Seed Demo Routine
    active_routine = db.query(Routine).filter(Routine.user_id == demo_user.id, Routine.status == "active").first()
    if not active_routine:
        active_routine = Routine(
            user_id=demo_user.id,
            name="Personalized Hair Fall & Scalp Care Routine",
            goal="Reduce hair fall and strengthen root density in 90 days",
            frequency="daily",
            status="active"
        )
        db.add(active_routine)
        db.commit()
        db.refresh(active_routine)

        # Get relevant products
        hair_serum = db.query(Product).filter(Product.name.like("%Hair Growth Serum%")).first()
        gummies = db.query(Product).filter(Product.name.like("%Biotin Hair Gummies%")).first()
        body_wash = db.query(Product).filter(Product.name.like("%Salicylic Acid Body Wash%")).first()

        tasks = [
            RoutineTask(
                routine_id=active_routine.id,
                user_id=demo_user.id,
                title="Chew 1 Biotin Hair Gummy",
                description="Take post-breakfast for internal keratin & micronutrient support.",
                time_of_day="morning",
                scheduled_time="08:30 AM",
                step_order=1,
                frequency_days="Everyday",
                product_name="Biotin Hair Gummies with Zinc & Multivitamins",
                product_id=gummies.id if gummies else None
            ),
            RoutineTask(
                routine_id=active_routine.id,
                user_id=demo_user.id,
                title="Cleansing Shower with 1% Salicylic Acid Body Wash",
                description="Lather on damp skin, leave on for 60 seconds before rinsing to clear body acne.",
                time_of_day="morning",
                scheduled_time="09:00 AM",
                step_order=2,
                frequency_days="Mon/Wed/Fri/Sun",
                product_name="1% Salicylic Acid Body Wash",
                product_id=body_wash.id if body_wash else None
            ),
            RoutineTask(
                routine_id=active_routine.id,
                user_id=demo_user.id,
                title="Apply 1ml Hair Growth Serum to Scalp",
                description="Part dry scalp and apply 1ml directly. Massage gently for 1 minute before bed. Do not wash out.",
                time_of_day="evening",
                scheduled_time="09:30 PM",
                step_order=3,
                frequency_days="Everyday",
                product_name="Hair Growth Serum with Redensyl & Procapil",
                product_id=hair_serum.id if hair_serum else None
            )
        ]
        db.add_all(tasks)
        db.commit()

        # Seed initial task completion for demonstration
        today_str = datetime.date.today().isoformat()
        db.add(TaskCompletion(
            task_id=tasks[0].id,
            user_id=demo_user.id,
            date=today_str,
            notes="Taken after oats breakfast"
        ))
        db.commit()

    # Seed Demo Progress Entries for the past 7 days
    if db.query(ProgressEntry).filter(ProgressEntry.user_id == demo_user.id).count() == 0:
        base_date = datetime.date.today()
        history_data = [
            (6, 100.0, 3, 3, "Felt very good, serum absorbs easily without grease.", "Stable"),
            (5, 66.7, 2, 3, "Forgot morning shower wash due to early meeting, completed evening serum.", "Stable"),
            (4, 100.0, 3, 3, "Routine is becoming natural. Scalp feels less itchy.", "Improving"),
            (3, 100.0, 3, 3, "Consistent application. Hair feels softer.", "Improving"),
            (2, 66.7, 2, 3, "Missed gummy in the rush, took serum at night.", "Improving"),
            (1, 100.0, 3, 3, "All tasks completed on schedule.", "Improving"),
            (0, 33.3, 1, 3, "Today's progress so far.", "Improving"),
        ]
        for days_ago, adh, comp, tot, fb, cond in history_data:
            d = (base_date - datetime.timedelta(days=days_ago)).isoformat()
            db.add(ProgressEntry(
                user_id=demo_user.id,
                date=d,
                adherence_percentage=adh,
                completed_tasks=comp,
                total_tasks=tot,
                feedback=fb,
                skin_hair_condition=cond,
                notes="Demonstration adherence log"
            ))

        # Seed Demo Weekly Summary
        summary = WeeklySummary(
            user_id=demo_user.id,
            week_label=f"Week of {(base_date - datetime.timedelta(days=7)).strftime('%b %d')} - {base_date.strftime('%b %d, %Y')}",
            adherence_score=81.0,
            summary_text="Excellent consistency over the past 7 days. You adhered to 81% of your scheduled sessions with outstanding nighttime serum compliance. Scalp condition is steadily transitioning into the 'Improving' phase.",
            recommendations="1. Maintain nightly Redensyl & Procapil serum application without skipping.\n2. Keep Biotin gummy bottle beside your breakfast counter to avoid morning rush misses.\n3. Continue using 1% Salicylic Acid body wash 3-4x weekly for optimal body blemish prevention.",
            agent_insights="Progress Tracking Agent detected high evening routine adherence (95%) and slightly lower morning adherence (68%). Automated morning reminder nudges are recommended."
        )
        db.add(summary)

        # Seed Demo Conversation
        conv = Conversation(
            user_id=demo_user.id,
            title="Welcome & Routine Consultation"
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

        msg1 = Message(
            conversation_id=conv.id,
            role="assistant",
            agent_name="Personalisation Agent",
            content="Hello Kavya! I'm your Bodywise AI Companion. Based on your onboarding profile, I've created your personalized personal-care routine addressing Hair fall and Body acne. How are you feeling today?",
            metadata_json=json.dumps({"citations": [], "suggested_actions": ["Show me today's routine", "Help me understand the ingredients", "How does Redensyl work?"]})
        )
        db.add(msg1)
        db.commit()
