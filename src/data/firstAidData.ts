import { FirstAidGuide, LanguageOption } from '../types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export const FIRST_AID_CATEGORIES = [
  { id: 'all', label: 'All Guides', icon: 'Sparkles', color: 'indigo' },
  { id: 'wounds', label: 'Wounds', icon: 'Bandage', color: 'blue' },
  { id: 'burns', label: 'Burns', icon: 'Flame', color: 'amber' },
  { id: 'bleeding', label: 'Bleeding', icon: 'Droplets', color: 'rose' },
  { id: 'injuries', label: 'Injuries', icon: 'Activity', color: 'emerald' },
  { id: 'heat_cold', label: 'Heat & Cold', icon: 'Thermometer', color: 'orange' },
  { id: 'fainting', label: 'Fainting', icon: 'HeartPulse', color: 'purple' },
  { id: 'breathing', label: 'Breathing', icon: 'Wind', color: 'teal' },
  { id: 'other', label: 'Other', icon: 'AlertTriangle', color: 'red' },
] as const;

export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: 'minor-cut',
    category: 'wounds',
    categoryLabel: 'Wounds',
    categoryIcon: 'Bandage',
    title: 'Minor Cut & Scrape',
    quickSummary: 'Superficial skin lacerations with mild localized bleeding caused by sharp objects or abrasive surfaces.',
    severity: 'low',
    recommendedTimerSeconds: 300,
    timerLabel: 'Direct Pressure Timer (5 min)',
    whatToDoSteps: [
      'Wash your hands thoroughly with soap and warm water before touching the wound.',
      'Apply direct, steady pressure using clean gauze or cloth for at least 5 minutes to arrest bleeding.',
      'Gently rinse the cut under clean, cool running tap water to flush away dirt and debris.',
      'Apply a thin layer of antibacterial ointment or clean petroleum jelly.',
      'Cover with a sterile adhesive bandage; replace whenever wet or soiled.'
    ],
    thingsToAvoid: [
      'Do not apply harsh rubbing alcohol or hydrogen peroxide directly inside deep open wounds.',
      'Do not aggressively scrub dirt particles lodged deep in the flesh.',
      'Do not peel off dried clots once bleeding stops.'
    ],
    warningSigns: [
      'Bleeding does not stop after 10 full minutes of continuous firm pressure.',
      'Wound edges gape open wider than 1/4 inch or fat/muscle layer is visible.',
      'Wound caused by dirty or rusty metal (requires Tetanus assessment).',
      'Increasing redness, swelling, warmth, throbbing pain, or pus discharge within 24–48 hours.'
    ],
    whenToCallHelp: 'Visit the Campus Health Center or an Urgent Care clinic if stitches or a tetanus booster shot is needed.',
    translations: {
      en: {
        title: 'Minor Cut & Scrape',
        quickSummary: 'Superficial skin lacerations with mild localized bleeding.',
        whatToDoSteps: [
          'Wash hands thoroughly with soap and clean water.',
          'Apply direct, steady pressure with clean cloth for 5 minutes.',
          'Rinse the wound under clean cool water.',
          'Apply antiseptic or ointment and cover with a sterile bandage.'
        ],
        warningSigns: [
          'Bleeding does not stop after 10 minutes of direct pressure.',
          'Deep wound edges gaping apart.',
          'Signs of infection: redness, throbbing heat, or pus.'
        ],
        whenToCallHelp: 'Contact campus medical clinic if stitches or tetanus vaccination is required.'
      },
      hi: {
        title: 'मामूली कट और खरोंच (Minor Cut)',
        quickSummary: 'हल्के रक्तस्राव वाली सतही त्वचा की चोट।',
        whatToDoSteps: [
          'घाव छूने से पहले साबुन और पानी से हाथ धोएं।',
          'साफ कपड़े या पट्टी से 5 मिनट तक सीधा दबाव बनाएं।',
          'घाव को साफ और ठंडे बहते पानी से धोएं।',
          'एंटीसेप्टिक मरहम लगाएं और जीवाणुरहित पट्टी से ढकें।'
        ],
        warningSigns: [
          '10 मिनट के दबाव के बाद भी खून बहना न रुके।',
          'घाव बहुत गहरा हो या किनारे फटे हों।',
          'संक्रमण के लक्षण: लालिमा, तेज जलन या मवाद।'
        ],
        whenToCallHelp: 'यदि टांके या टिटनेस के टीके की आवश्यकता हो तो तुरंत स्वास्थ्य केंद्र जाएं।'
      },
      bn: {
        title: 'ছোটখাটো কাটা ও আঁচড় (Minor Cut)',
        quickSummary: 'হালকা রক্তপাতযুক্ত ত্বকের কাটা বা ছাল ওঠা।',
        whatToDoSteps: [
          'ক্ষত ছোঁয়ার আগে সাবান ও জল দিয়ে হাত ভালোভাবে ধুয়ে নিন।',
          'পরিষ্কার কাপড় দিয়ে ৫ মিনিট সরাসরি চাপ দিয়ে রক্তপাত বন্ধ করুন।',
          'পরিষ্কার ঠান্ডা জল দিয়ে ক্ষতস্থান ধুয়ে ফেলুন।',
          'অ্যান্টিসেপটিক মলম লাগান এবং ব্যান্ডেজ দিয়ে ঢেকে দিন।'
        ],
        warningSigns: [
          '১০ মিনিট একটানা চাপ দেওয়ার পরেও রক্তপাত বন্ধ না হলে।',
          'ক্ষতস্থান খুব গভীর হলে।',
          'সংক্রমণের লক্ষণ: অতিরিক্ত লালচে ভাব বা পুঁজ।'
        ],
        whenToCallHelp: 'যদি সেলাই বা টিটেনাস টিকার প্রয়োজন হয় তবে মেডিকেল সেন্টারে যোগাযোগ করুন।'
      },
      ta: {
        title: 'சிறிய வெட்டுக்காயம் மற்றும் சிராய்ப்பு',
        quickSummary: 'லேசான ரத்தப்போக்குடன் கூடிய மேலோட்டமான காயம்.',
        whatToDoSteps: [
          'காயத்தைத் தொடுவதற்கு முன் கைகளை சோப்பு போட்டு கழுவவும்.',
          'சுத்தமான துணியால் 5 நிமிடங்கள் தொடர்ந்து அழுத்தம் கொடுக்கவும்.',
          'சுத்தமான குளிர்ந்த நீரில் காயத்தைக் கழுவவும்.',
          'மருந்து தடவி கட்டுப்போடவும்.'
        ],
        warningSigns: [
          '10 நிமிடங்களுக்குப் பிறகும் ரத்தப்போக்கு நிற்கவில்லை என்றால்.',
          'காயம் மிகவும் ஆழமாக இருந்தால்.',
          'சீழ் அல்லது அதிக வீக்கம் போன்ற தொற்று அறிகுறிகள்.'
        ],
        whenToCallHelp: 'தையல் அல்லது டெட்டனஸ் ஊசி தேவைப்பட்டால் மருத்துவ மையத்தை அணுகவும்.'
      },
      te: {
        title: 'చిన్న గాయాలు మరియు గీతలు',
        quickSummary: 'స్వల్ప రక్తస్రావంతో కూడిన చర్మ గాయం.',
        whatToDoSteps: [
          'గాయాన్ని తాకే ముందు చేతులను సబ్బుతో శుభ్రంగా కడగాలి.',
          'శుభ్రమైన గుడ్డతో 5 నిమిషాల పాటు ఒత్తిడి కలిగించండి.',
          'మంచి నీటితో గాయాన్ని శుభ్రం చేయండి.',
          'యాంటీసెప్టిక్ పూసి పట్టీ వేయండి.'
        ],
        warningSigns: [
          '10 నిమిషాల తర్వాత కూడా రక్తం ఆగకపోతే.',
          'గాయం చాలా లోతుగా ఉంటే.',
          'ఎరుపుదనం, చీము లేదా సంక్రమణ సంకేతాలు.'
        ],
        whenToCallHelp: 'కుట్లు లేదా టెటానస్ ఇంజెక్షన్ అవసరమైతే వైద్యుడిని సంప్రదించండి.'
      },
      mr: {
        title: 'किरकोळ जखम आणि ओरखडा',
        quickSummary: 'हलका रक्तस्राव असणारी वरवरची जखम.',
        whatToDoSteps: [
          'जखम हाताळण्यापूर्वी हात स्वच्छ साबणाने धुवा.',
          'स्वच्छ कपड्याने ५ मिनिटे जखमेवर थेट दाब द्या.',
          'जखम स्वच्छ वाहत्या पाण्याने धुवा.',
          'मलम लावा आणि निर्जंतुक पट्टी बांधा.'
        ],
        warningSigns: [
          '१० मिनिटांनंतरही रक्तस्राव न थांबल्यास.',
          'जखम जास्त खोल असल्यास.',
          'संसर्गाची लक्षणे: लालसरपणा किंवा पू.'
        ],
        whenToCallHelp: 'टाके किंवा धनुర్వాత लस हवी असल्यास आरोग्य केंद्राशी संपर्क साधा.'
      },
      gu: {
        title: 'નાનો ઘા અને છોલાવું',
        quickSummary: 'હળવા રક્તસ્ત્રાવ સાથેની સામાન્ય ઈજા.',
        whatToDoSteps: [
          'ઘા અડતાં પહેલાં સાબુ અને પાણીથી હાથ ધુઓ.',
          'સાફ કપડાથી ૫ મિનિટ સુધી દબાણ આપો.',
          'સાફ પાણીથી ઘા ધોઈ લો.',
          'દવા લગાવીને પાટો બાંધો.'
        ],
        warningSigns: [
          '૧૦ મિનિટ પછી પણ લોહી વહેવાનું ચાલુ રહે.',
          'ઘા બહુ ઊંડો હોય.',
          'ચેપના ચિહ્નો: લાલાશ અથવા પરુ.'
        ],
        whenToCallHelp: 'ટાંકા અથવા ટીટેનસ ઇન્જેક્શનની જરૂર હોય તો દવાખાને જાઓ.'
      },
      kn: {
        title: 'ಸಣ್ಣ ಗಾಯ ಮತ್ತು ಪರಚು',
        quickSummary: 'ಸ್ವಲ್ಪ ರಕ್ತಸ್ರಾವವಿರುವ ಚರ್ಮದ ಗಾಯ.',
        whatToDoSteps: [
          'ಗಾಯ ಮುಟ್ಟುವ ಮುನ್ನ ಕೈಗಳನ್ನು ಸಾಬೂನಿನಿಂದ ತೊಳೆಯಿರಿ.',
          'ಸ್ವಚ್ಛ ಬಟ್ಟೆಯಿಂದ 5 ನಿಮಿಷ ನೇರ ಒತ್ತಡ ಹಾಕಿ.',
          'ಸ್ವಚ್ಛ ನೀರಿನಿಂದ ಗಾಯವನ್ನು ತೊಳೆಯಿರಿ.',
          'ಮುಲಾಮು ಹಚ್ಚಿ ಬ್ಯಾಂಡೇಜ್ ಹಾಕಿ.'
        ],
        warningSigns: [
          '10 ನಿಮಿಷಗಳ ನಂತರವೂ ರಕ್ತ ನಿಲ್ಲದಿದ್ದರೆ.',
          'ಗಾಯ ತುಂಬಾ ಆಳವಾಗಿದ್ದರೆ.',
          'ಸೋಂಕಿನ ಲಕ್ಷಣಗಳು: ಊತ ಅಥವಾ ಕೀವು.'
        ],
        whenToCallHelp: 'ಹೊಲಿಗೆ ಅಥವಾ ಟೆಟನಸ್ ಇಂಜೆಕ್ಷನ್ ಅಗತ್ಯವಿದ್ದರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.'
      },
      ml: {
        title: 'ചെറിയ മുറിവുകൾ',
        quickSummary: 'ചെറിയ തോതിലുള്ള രക്തസ്രാവം ഉള്ള മുറിവ്.',
        whatToDoSteps: [
          'മുറിവിൽ തൊടുന്നതിന് മുൻപ് കൈകൾ നന്നായി കഴുകുക.',
          'വൃത്തിയുള്ള തുണി ഉപയോഗിച്ച് 5 മിനിറ്റ് അമർത്തിപ്പിടിക്കുക.',
          'ശുദ്ധജലത്തിൽ മുറിവ് കഴുകുക.',
          'ആന്റിസെപ്റ്റിക് പുരട്ടി ബാൻഡേജ് ഇടുക.'
        ],
        warningSigns: [
          '10 മിനിറ്റിനു ശേഷവും രക്തം നിൽക്കുന്നില്ലെങ്കിൽ.',
          'മുറിവ് വളരെ ആഴമുള്ളതാണെങ്കിൽ.',
          'പഴുപ്പ് അല്ലെങ്കിൽ അണുബാധയുടെ ലക്ഷണങ്ങൾ.'
        ],
        whenToCallHelp: 'കുത്തിവയ്പ്പോ തുന്നലോ ആവശ്യമുണ്ടെങ്കിൽ ആരോഗ്യ കേന്ദ്രത്തിൽ പോകുക.'
      }
    }
  },
  {
    id: 'minor-burn',
    category: 'burns',
    categoryLabel: 'Burns',
    categoryIcon: 'Flame',
    title: 'First-Degree Thermal Burn',
    quickSummary: 'Mild burn affecting outer skin layer with redness, localized swelling, and pain (e.g., hot liquids, lab hotplates).',
    severity: 'moderate',
    recommendedTimerSeconds: 600,
    timerLabel: 'Cool Water Flush Timer (10 min)',
    whatToDoSteps: [
      'Immediately cool the burn under gentle, cool running tap water for 10 to 15 minutes (do not use ice).',
      'Carefully remove tight rings, watches, or clothing near the burn before swelling sets in.',
      'Gently apply pure aloe vera gel or a gentle water-based moisturizing lotion.',
      'Loosely protect the burn with a sterile, non-adhesive gauze pad.',
      'Take an over-the-counter pain reliever like acetaminophen or ibuprofen if approved for your use.'
    ],
    thingsToAvoid: [
      'NEVER apply ice or ice packs directly to burns (causes cryogenic tissue damage).',
      'NEVER apply butter, grease, cooking oil, or toothpaste to burns.',
      'Do not pop any blisters that form.'
    ],
    warningSigns: [
      'Burn creates blisters larger than 2 inches across.',
      'Burn involves face, hands, major joints, feet, or groin.',
      'Skin looks leathery, white, or charred (indicates 3rd-degree burn).',
      'Signs of chemical or electrical injury origin.'
    ],
    whenToCallHelp: 'Seek immediate emergency medical care for electrical burns, chemical burns, or extensive blistering.',
    translations: {
      en: {
        title: 'First-Degree Thermal Burn',
        quickSummary: 'Mild thermal burn causing redness and localized pain.',
        whatToDoSteps: [
          'Cool the burn under cool running water for 10-15 minutes.',
          'Remove tight jewelry or clothes before swelling begins.',
          'Apply aloe vera gel or soothing moisturizer.',
          'Cover loosely with a clean non-stick sterile pad.'
        ],
        warningSigns: [
          'Blisters larger than the palm of your hand.',
          'Burn on face, hands, or major joints.',
          'Skin appears white, charred, or painless (severe burn).'
        ],
        whenToCallHelp: 'Seek urgent medical attention for chemical, electrical, or widespread burns.'
      },
      hi: {
        title: 'हल्का जलना (Thermal Burn)',
        quickSummary: 'हल्की जलन, लालिमा और दर्द पैदा करने वाला सतही बर्न।',
        whatToDoSteps: [
          'तुरंत 10-15 मिनट तक ठंडे बहते पानी के नीचे रखें (बर्फ का उपयोग न करें)।',
          'सूजन आने से पहले अंगूठी या तंग कपड़े उतार दें।',
          'एलोवेरा जेल या मॉइस्चराइज़र लगाएं।',
          'साफ और ढीली पट्टी से ढकें।'
        ],
        warningSigns: [
          'हथेली से बड़े फफोले पड़ना।',
          'चेहरे, हाथ या जोड़ों पर जलना।',
          'त्वचा का सफेद या काला (झुलसा हुआ) दिखना।'
        ],
        whenToCallHelp: 'केमिकल या बिजली से जलने पर तुरंत आपातकालीन सहायता लें।'
      },
      bn: {
        title: 'হালকা পোড়া (First-Degree Burn)',
        quickSummary: 'গরম বস্তু বা তরলের কারণে ত্বকের হালকা লালচে ভাব ও জ্বালা।',
        whatToDoSteps: [
          '১০-১৫ মিনিট ঠান্ডা জলের নিচে ধরে রাখুন (বরফ দেবেন না)।',
          'ফোলা শুরুর আগে আংটি বা টাইট জামাকাপড় খুলে ফেলুন।',
          'অ্যালোভেরা জেল বা পরিষ্কার ক্রিম লাগান।',
          'হালকাভাবে পরিষ্কার ব্যান্ডেজ দিয়ে ঢেকে রাখুন।'
        ],
        warningSigns: [
          'বড় ফোসকা পড়লে।',
          'মুখ, হাত বা সংবেদনশীল স্থানে পুড়লে।',
          'চামড়া সাদা বা কালো হয়ে গেলে।'
        ],
        whenToCallHelp: 'রাসায়নিক বা বৈদ্যুতিক পোড়ার ক্ষেত্রে অবিলম্বে জরুরি সাহায্য নিন।'
      },
      ta: {
        title: 'லேசான தீக்காயம்',
        quickSummary: 'தோல் சிவந்து எரிச்சல் தரும் முதல் நிலை தீக்காயம்.',
        whatToDoSteps: [
          '10-15 நிமிடங்கள் குளிர்ந்த ஓடும் நீரில் காட்டவும் (ஐஸ் வைக்க வேண்டாம்).',
          'வீங்குவதற்கு முன் மோதிரம், நகைகளை கழற்றவும்.',
          'கற்றாழை ஜெல் தடவவும்.',
          'சுத்தமான துணியால் லேசாக மூடவும்.'
        ],
        warningSigns: [
          'பெரிய கொப்புளங்கள் உருவானால்.',
          'முகம் அல்லது கைகளில் காயம் ஏற்பட்டால்.',
          'தோல் வெள்ளை அல்லது கருகிய நிறமாக மாறினால்.'
        ],
        whenToCallHelp: 'ரசாயனம் அல்லது மின்சார தீக்காயங்களுக்கு உடனடியாக மருத்துவரை அணுகவும்.'
      },
      te: {
        title: 'తేలికపాటి కాలిన గాయాలు',
        quickSummary: 'చర్మం ఎర్రబడి మంట కలిగించే గాయం.',
        whatToDoSteps: [
          '10-15 నిమిషాలు చల్లని నీటి ప్రవాహం కింద ఉంచండి.',
          'ఉంగరాలు లేదా గట్టి బట్టలను వెంటనే తొలగించండి.',
          'అలోవెరా జెల్ రాయండి.',
          'శుభ్రమైన పట్టీతో వదులుగా కప్పండి.'
        ],
        warningSigns: [
          'పెద్ద బొబ్బలు రావడం.',
          'ముఖం లేదా కీళ్లపై కాలిన గాయాలు.',
          'చర్మం తెల్లగా లేదా నల్లగా మారడం.'
        ],
        whenToCallHelp: 'రసాయన లేదా విద్యుత్ ప్రమాదాలైతే అత్యవసర విభాగాన్ని సంప్రదించండి.'
      },
      mr: {
        title: 'किरकोळ भाजणे (Burn)',
        quickSummary: 'त्वचा लाल होणे आणि आग होणे.',
        whatToDoSteps: [
          '१०-१५ मिनिटे वाहत्या थंड पाण्याखाली धरा (बर्फ लावू नका).',
          'सूज येण्यापूर्वी अंगठी किंवा घट्ट दागिने काढा.',
          'कोरफड जेल (Aloe Vera) लावा.',
          'स्वच्छ सुती कापडाने सैल झाका.'
        ],
        warningSigns: [
          'मोठे फोड आल्यास.',
          'चेहरा किंवा हातावर भाजले असल्यास.',
          'त्वचा पांढरी किंवा काळी पडल्यास.'
        ],
        whenToCallHelp: 'रासायनिक किंवा विजेच्या झटक्याने भाजल्यास ताबडतोब वैद्यकीय मदत घ्या.'
      },
      gu: {
        title: 'સામાન્ય દાઝવું',
        quickSummary: 'ત્વચા લાલ થવી અને બળતરા થવી.',
        whatToDoSteps: [
          '૧૦-૧૫ મિનિટ સુધી ઠંડા વહેતા પાણી નીચે રાખો.',
          'સોજો ચડે તે પહેલાં દાગીના ઉતારી લો.',
          'એલોવેરા જેલ લગાવો.',
          'સાફ પાટો ઢીલો બાંધો.'
        ],
        warningSigns: [
          'મોટા ફોલ્લા પડે.',
          'ચહેરા કે હાથ પર દાઝ્યા હોય.',
          'ચામડી સફેદ કે કાળી પડી જાય.'
        ],
        whenToCallHelp: 'કેમિકલ અથવા કરંટથી દાઝ્યા હોવ તો તાત્કાલિક ઈમરજન્સી મદદ લો.'
      },
      kn: {
        title: 'ಸುಟ್ಟ ಗಾಯ (Burn)',
        quickSummary: 'ಚರ್ಮ ಕೆಂಪಾಗಿ ಉರಿ ಉಂಟಾಗುವ ಗಾಯ.',
        whatToDoSteps: [
          '10-15 ನಿಮಿಷ ತಣ್ಣೀರಿನಲ್ಲಿ ಹಿಡಿಯಿರಿ (ಐಸ್ ಬಳಸಬೇಡಿ).',
          'ಊತ ಬರುವ ಮುನ್ನ ಉಂಗುರಗಳನ್ನು ತೆಗೆಯಿರಿ.',
          'ಅಲೋವೆರಾ ಜೆಲ್ ಹಚ್ಚಿ.',
          'ಸ್ವಚ್ಛ ಬಟ್ಟೆಯಿಂದ ಸಡಿಲವಾಗಿ ಮುಚ್ಚಿ.'
        ],
        warningSigns: [
          'ದೊಡ್ಡ ಗುಳ್ಳೆಗಳು ಬಂದರೆ.',
          'ಮುಖ ಅಥವಾ ಕೈಗಳಿಗೆ ಗಾಯವಾದರೆ.',
          'ಚರ್ಮ ಬಿಳಿ ಅಥವಾ ಸುಟ್ಟ ಕಪ್ಪು ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದರೆ.'
        ],
        whenToCallHelp: 'ರಾಸಾಯನಿಕ ಅಥವಾ ವಿದ್ಯುತ್ ಸುಟ್ಟ ಗಾಯಗಳಿಗೆ ತಕ್ಷಣ ತುರ್ತು ಸಹಾಯ ಪಡೆಯಿರಿ.'
      },
      ml: {
        title: 'ചെറിയ പൊള്ളലുകൾ',
        quickSummary: 'ത്വക്ക് ചുവന്നു തുടുക്കുന്ന പൊള്ളൽ.',
        whatToDoSteps: [
          '10-15 മിനിറ്റ് തണുത്ത വെള്ളത്തിനടിയിൽ പിടിക്കുക (ഐസ് ഉപയോഗിക്കരുത്).',
          'വീക്കം വരുന്നതിന് മുൻപ് ആഭരണങ്ങൾ മാറ്റുക.',
          'കറ്റാർവാഴ ജെൽ പുരട്ടുക.',
          'വൃത്തിയുള്ള തുണി കൊണ്ട് അയച്ചു മൂടുക.'
        ],
        warningSigns: [
          'വലിയ കുമിളകൾ ഉണ്ടായാൽ.',
          'മുഖത്തോ കൈകളിലോ പൊള്ളലേറ്റാൽ.',
          'ത്വക്ക് വെളുത്തതോ കരിഞ്ഞതോ ആയാൽ.'
        ],
        whenToCallHelp: 'വൈദ്യുത അല്ലെങ്കിൽ രാസവസ്തുക്കൾ കൊണ്ടുള്ള പൊള്ളലിന് ഉടൻ ചികിത്സ തേടുക.'
      }
    }
  },
  {
    id: 'nosebleed',
    category: 'bleeding',
    categoryLabel: 'Bleeding',
    categoryIcon: 'Droplets',
    title: 'Epistaxis (Nosebleed)',
    quickSummary: 'Spontaneous or trauma-induced bleeding from delicate nasal blood vessels.',
    severity: 'low',
    recommendedTimerSeconds: 600,
    timerLabel: 'Nasal Pinch Timer (10 min)',
    whatToDoSteps: [
      'Sit upright and lean slightly forward (do NOT tilt your head back).',
      'Pinch the soft, fleshy part of your nose just below the bony bridge firmly between thumb and index finger.',
      'Breathe gently through your mouth and maintain firm continuous pinching for a full 10 minutes without releasing to check.',
      'Apply an ice pack or cold damp cloth across the bridge of your nose and back of neck.',
      'Rest quietly after bleeding stops; avoid blowing your nose, bending over, or strenuous activity for several hours.'
    ],
    thingsToAvoid: [
      'DO NOT tilt your head back (this causes blood to flow down the throat, leading to choking or vomiting).',
      'Do not pack your nostrils with dry tissues, paper towels, or tampons.',
      'Do not blow your nose immediately after bleeding stops.'
    ],
    warningSigns: [
      'Nosebleed continues after 20 minutes of continuous direct pinching.',
      'Bleeding is heavy or gushing down the back of your throat.',
      'Bleeding follows a direct blow to the head, face, or suspected facial bone fracture.',
      'Accompanied by dizziness, lightheadedness, or feeling faint.'
    ],
    whenToCallHelp: 'Visit Campus Medical Center or Emergency Room if bleeding exceeds 20 minutes or causes severe dizziness.',
    translations: {
      en: {
        title: 'Epistaxis (Nosebleed)',
        quickSummary: 'Bleeding from delicate vessels inside the nose.',
        whatToDoSteps: [
          'Sit upright and lean slightly forward.',
          'Pinch the soft part of the nose firmly for 10 minutes.',
          'Breathe through your mouth and apply a cold pack to the bridge.',
          'Rest quietly; avoid blowing nose for a few hours.'
        ],
        warningSigns: [
          'Bleeding longer than 20 minutes.',
          'Bleeding caused by severe head injury.',
          'Feeling faint or dizzy.'
        ],
        whenToCallHelp: 'Seek medical care if bleeding persists over 20 minutes.'
      },
      hi: {
        title: 'नाक से खून बहना (Nosebleed / नकसीर)',
        quickSummary: 'नाक की नाजुक रक्त वाहिकाओं से खून बहना।',
        whatToDoSteps: [
          'सीधे बैठें और थोड़ा आगे की ओर झुकें (सिर पीछे न करें)।',
          'नाक के निचले मुलायम हिस्से को अंगूठे और उंगली से 10 मिनट तक दबाकर रखें।',
          'मुंह से सांस लें और नाक पर ठंडी पट्टी लगाएं।',
          'खून रुकने के बाद कुछ घंटों तक नाक न छिड़कें।'
        ],
        warningSigns: [
          '20 मिनट के दबाव के बाद भी खून न रुके।',
          'सिर में गंभीर चोट लगने के बाद नकसीर फूटे।',
          'चक्कर आना या बेहोशी महसूस होना।'
        ],
        whenToCallHelp: '20 मिनट से अधिक समय तक लगातार खून बहने पर डॉक्टर से मिलें।'
      },
      bn: {
        title: 'নাক দিয়ে রক্ত পড়া (Nosebleed)',
        quickSummary: 'নাকের রক্তনালী থেকে রক্তপাত।',
        whatToDoSteps: [
          'সোজা হয়ে বসুন এবং সামান্য সামনের দিকে ঝুঁকুন।',
          'নাকের নরম অংশ ১০ মিনিট শক্ত করে চেপে ধরুন।',
          'মুখ দিয়ে শ্বাস নিন এবং নাকে বরফ বা ঠান্ডা জল দিন।',
          'রক্ত বন্ধ হলে নাক ঝাড়বেন না।'
        ],
        warningSigns: [
          '২০ মিনিটের বেশি রক্ত পড়লে।',
          'মাথায় আঘাতের কারণে রক্ত পড়লে।',
          'মাথা ঘোরা বা দুর্বল লাগলে।'
        ],
        whenToCallHelp: '২০ মিনিটের বেশি রক্তপাত চলতে থাকলে চিকিৎসকের শরণাপন্ন হন।'
      },
      ta: {
        title: 'மூக்கில் ரத்தம் வடிதல்',
        quickSummary: 'மூக்கிலிருந்து ஏற்படும் ரத்தப்போக்கு.',
        whatToDoSteps: [
          'நேராக அமர்ந்து சற்று முன்னோக்கி சாயவும் (தலையை பின்னால் சாய்க்க வேண்டாம்).',
          'மூக்கின் மென்மையான பகுதியை 10 நிமிடங்கள் அழுத்திப் பிடிக்கவும்.',
          'வாய் வழியாக சுவாசிக்கவும்.',
          'ரத்தம் நின்றதும் மூக்கை சிந்த வேண்டாம்.'
        ],
        warningSigns: [
          '20 நிமிடங்களுக்கு மேல் ரத்தம் நின்றபாடில்லை என்றால்.',
          'தலையில் பலத்த அடிபட்ட பிறகு ஏற்பட்டால்.',
          'மயக்கம் அல்லது தலைச்சுற்றல்.'
        ],
        whenToCallHelp: '20 நிமிடங்களுக்கு மேல் நீடித்தால் அவசர சிகிச்சை பெறவும்.'
      },
      te: {
        title: 'ముక్కు నుండి రక్తం కారడం',
        quickSummary: 'ముక్కు రక్తనాళాలు చిట్లి రక్తం రావడం.',
        whatToDoSteps: [
          'నిటారుగా కూర్చుని కొద్దిగా ముందుకు వంగండి.',
          'ముక్కు మెత్తటి భాగాన్ని 10 నిమిషాలు గట్టిగా పట్టుకోండి.',
          'నోటి ద్వారా శ్వాస తీసుకోండి.',
          'రక్తం ఆగిన తర్వాత ముక్కును చీదకండి.'
        ],
        warningSigns: [
          '20 నిమిషాలైనా రక్తం ఆగకపోతే.',
          'తలకి దెబ్బ తగిలిన తర్వాత రక్తం వస్తే.',
          'కళ్ళు తిరగడం లేదా నీరసం.'
        ],
        whenToCallHelp: '20 నిమిషాలకు మించి రక్తం వస్తే ఆసుపత్రికి వెళ్లండి.'
      },
      mr: {
        title: 'नाकातून रक्त येणे (Nosebleed)',
        quickSummary: 'नाकातील रक्तवाहिन्या फुटल्याने होणारा रक्तस्राव.',
        whatToDoSteps: [
          'ताठ बसा आणि थोडे पुढे वाका (मान मागे करू नका).',
          'नाकाचा मऊ भाग १० मिनिटे घट्ट दाबून धरा.',
          'तोंडाने श्वास घ्या आणि नाकावर थंड पट्टी ठेवा.',
          'काही तास नाक शिंकरणे टाळा.'
        ],
        warningSigns: [
          '२० मिनिटांनंतरही रक्तस्राव सुरू राहिल्यास.',
          'डोक्याला मार लागल्यामुळे रक्त आल्यास.',
          'भोवळ किंवा चक्कर आल्यास.'
        ],
        whenToCallHelp: 'रक्तस्राव २० मिनिटांपेक्षा जास्त वेळ सुरू राहिल्यास तातडीने डॉक्टरकडे जा.'
      },
      gu: {
        title: 'નસકોરી ફૂટવી (Nosebleed)',
        quickSummary: 'નાકમાંથી લોહી વહેવું.',
        whatToDoSteps: [
          'સીધા બેસો અને આગળ નમો (માથું પાછળ ન કરો).',
          'નાકનો પોચો ભાગ ૧૦ મિનિટ સુધી દબાવી રાખો.',
          'મોંથી શ્વાસ લો અને નાક પર બરફનો શેક કરો.',
          'લોહી બંધ થાય પછી નાક સાફ ન કરવું.'
        ],
        warningSigns: [
          '૨૦ મિનિટ પછી પણ લોહી વહેવાનું ચાલુ રહે.',
          'માથામાં વાગવાને કારણે લોહી નીકળે.',
          'ચક્કર આવે કે બેભાન જેવું લાગે.'
        ],
        whenToCallHelp: '૨૦ મિનિટથી વધુ સમય લોહી વહે તો તાત્કાલિક હોસ્પિટલ પહોંચો.'
      },
      kn: {
        title: 'ಮೂಗಿನಲ್ಲಿ ರಕ್ತಸ್ರಾವ',
        quickSummary: 'ಮೂಗಿನ ರಕ್ತನಾಳಗಳಿಂದ ರಕ್ತ ಬರುವುದು.',
        whatToDoSteps: [
          'ನೇರವಾಗಿ ಕುಳಿತುಕೊಂಡು ಸ್ವಲ್ಪ ಮುಂದಕ್ಕೆ ಬಾಗಿ.',
          'ಮೂಗಿನ ಮೃದುವಾದ ಭಾಗವನ್ನು 10 ನಿಮಿಷ ಬಿಗಿಯಾಗಿ ಒತ್ತಿ ಹಿಡಿಯಿರಿ.',
          'ಬಾಯಿಯಿಂದ ಉಸಿರಾಡಿ.',
          'ರಕ್ತ ನಿಂತ ನಂತರ ಮೂಗು ಸೀನಬೇಡಿ.'
        ],
        warningSigns: [
          '20 ನಿಮಿಷಗಳ ನಂತರವೂ ರಕ್ತ ನಿಲ್ಲದಿದ್ದರೆ.',
          'ತಲೆಗೆ ಪೆಟ್ಟು ಬಿದ್ದ ಕಾರಣ ರಕ್ತ ಬರುತ್ತಿದ್ದರೆ.',
          'ತಲೆತಿರುಗುವಿಕೆ ಅಥವಾ ಮೂರ್ಛೆ.'
        ],
        whenToCallHelp: '20 ನಿಮಿಷ ಮೀರಿದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.'
      },
      ml: {
        title: 'മൂക്കിൽ നിന്നുള്ള രക്തസ്രാവം',
        quickSummary: 'മൂക്കിലെ രക്തക്കുഴലുകളിൽ നിന്നുള്ള രക്തസ്രാവം.',
        whatToDoSteps: [
          'നേരെ ഇരുന്നു അല്പം മുന്നോട്ട് കുനിയുക (തല പിന്നോട്ട് വെക്കരുത്).',
          'മൂക്കിന്റെ മൃദുവായ ഭാഗം 10 മിനിറ്റ് അമർത്തിപ്പിടിക്കുക.',
          'വായയിലൂടെ ശ്വാസമെടുക്കുക.',
          'രക്തം നിന്നതിനുശേഷം മൂക്ക് ചീറ്റരുത്.'
        ],
        warningSigns: [
          '20 മിനിറ്റിനു ശേഷവും രക്തം നിൽക്കുന്നില്ലെങ്കിൽ.',
          'തലയ്ക്ക് ശക്തമായ പരുക്കേറ്റതിനെ തുടർന്നുണ്ടായാൽ.',
          'തലകറക്കം അനുഭവപ്പെട്ടാൽ.'
        ],
        whenToCallHelp: '20 മിനിറ്റിലധികം രക്തസ്രാവം തുടർന്നാൽ അടിയന്തര ചികിത്സ തേടുക.'
      }
    }
  },
  {
    id: 'ankle-sprain',
    category: 'injuries',
    categoryLabel: 'Injuries',
    categoryIcon: 'Activity',
    title: 'Ankle Sprain (R.I.C.E. Protocol)',
    quickSummary: 'Stretched or torn ligaments from twisting or rolling the ankle.',
    severity: 'moderate',
    recommendedTimerSeconds: 900,
    timerLabel: 'Cold Compress Timer (15 min)',
    whatToDoSteps: [
      'REST: Stop physical activity immediately and avoid bearing weight on the injured foot.',
      'ICE: Apply an ice pack wrapped in a damp cloth for 15–20 minutes every 2–3 hours.',
      'COMPRESSION: Wrap the ankle snugly with an elastic compression bandage (start at toes and wrap upward; ensure toes remain warm and pink).',
      'ELEVATION: Prop the injured ankle up on pillows above the level of your heart whenever seated or lying down.',
      'Support with a walking boot or crutches if provided by campus clinic.'
    ],
    thingsToAvoid: [
      'Do not apply heat or take hot showers in the first 48 hours (increases swelling).',
      'Do not wrap elastic bandage too tightly (check for numbness or tingling).',
      'Do not "walk it off" through acute sharp pain.'
    ],
    warningSigns: [
      'Inability to take 4 steps immediately after injury or at present.',
      'Point tenderness directly over the bony malleoli (ankle bone knobs).',
      'Severe deformity, clicking/popping sensation with total joint instability.',
      'Loss of sensation, pins-and-needles, or cold pale toes.'
    ],
    whenToCallHelp: 'Obtain an X-ray evaluation at Campus Health or Urgent Care if unable to bear weight or if joint appears deformed.',
    translations: {
      en: {
        title: 'Ankle Sprain (R.I.C.E. Protocol)',
        quickSummary: 'Ligament sprain causing swelling and pain.',
        whatToDoSteps: [
          'REST: Stop activity and do not put weight on the foot.',
          'ICE: Apply cold pack for 15-20 minutes.',
          'COMPRESS: Wrap with elastic bandage support.',
          'ELEVATE: Keep foot propped above heart level.'
        ],
        warningSigns: [
          'Inability to walk 4 steps.',
          'Severe pain directly over ankle bones.',
          'Visible bone deformity or numbness in toes.'
        ],
        whenToCallHelp: 'Get evaluated at clinic for possible bone fracture.'
      },
      hi: {
        title: 'टखने में मोच (Ankle Sprain)',
        quickSummary: 'पैर मुड़ने से टखने में सूजन और दर्द।',
        whatToDoSteps: [
          'आराम (Rest): पैर पर वजन न डालें और आराम करें।',
          'बर्फ (Ice): कपड़े में लपेटकर 15-20 मिनट बर्फ लगाएं।',
          'पट्टी (Compress): इलास्टिक क्रेप पट्टी से सहारा दें।',
          'ऊंचा रखें (Elevate): पैर को तकिए पर दिल के स्तर से ऊपर रखें।'
        ],
        warningSigns: [
          '4 कदम भी चलने में असमर्थता।',
          'हड्डी में तेज दर्द या टेढ़ापन दिखना।',
          'पैरों की उंगलियों का सुन्न होना।'
        ],
        whenToCallHelp: 'यदि फ्रैक्चर का संदेह हो तो एक्स-रे के लिए स्वास्थ्य केंद्र जाएं।'
      },
      bn: {
        title: 'গোড়ালির মচকে যাওয়া (Ankle Sprain)',
        quickSummary: 'পা মচকে গিয়ে ফোলা ও তীব্র ব্যথা।',
        whatToDoSteps: [
          'বিশ্রাম: পায়ে ভর দেবেন না।',
          'বরফ: ১৫-২০ মিনিট বরফের সেঁক দিন।',
          'ব্যান্ডেজ: ক্রেপ ব্যান্ডেজ দিয়ে হালকা পেঁচিয়ে রাখুন।',
          'উঁচুতে রাখা: বালিশের ওপর পা উঁচু করে রাখুন।'
        ],
        warningSigns: [
          'হাঁটতে একেবারেই না পারলে।',
          'হাড়ে তীব্র ব্যথা বা গোড়ালি বেঁকে গেলে।',
          'পায়ের পাতা অবশ লাগলে।'
        ],
        whenToCallHelp: 'ফ্র্যাকচার আছে কিনা জানতে ক্লিনিকে গিয়ে এক্স-রে করান।'
      },
      ta: {
        title: 'கணுக்கால் சுளுக்கு',
        quickSummary: 'கணுக்கால் தசைநார் கிழிந்து வீக்கம் மற்றும் வலி.',
        whatToDoSteps: [
          'ஓய்வு: காலில் எடையை வைக்காமல் ஓய்வெடுக்கவும்.',
          'ஐஸ்: 15-20 நிமிடங்கள் ஐஸ் ஒத்தடம் கொடுக்கவும்.',
          'கட்டு: கிரேப் பேண்டேஜ் கொண்டு பாதுகாப்பாக கட்டவும்.',
          'உயர்த்துதல்: காலை தலையணை மீது உயர்த்தி வைக்கவும்.'
        ],
        warningSigns: [
          'நடக்கவே முடியாத நிலை.',
          'எலும்பு பகுதியில் அதீத வலி அல்லது வளைவு.',
          'கால் விரல்கள் மரத்துப்போதல்.'
        ],
        whenToCallHelp: 'எலும்பு முறிவு இருக்கலாம் என சந்தேகித்தால் எக்ஸ்-ரே எடுக்கவும்.'
      },
      te: {
        title: 'చీలమండ బెణుకు',
        quickSummary: 'కాలు మడతపడి చీలమండ వద్ద వాపు మరియు నొప్పి.',
        whatToDoSteps: [
          'విశ్రాంతి: కాలుపై బరువు వేయకండి.',
          'ఐస్: 15-20 నిమిషాలు ఐస్ ప్యాక్ పెట్టండి.',
          'బ్యాండేజ్: క్రేప్ బ్యాండేజ్ కట్టండి.',
          'ఎత్తుగా ఉంచడం: కాలును దిండుపై ఎత్తుగా ఉంచండి.'
        ],
        warningSigns: [
          'అస్సలు నడవలేకపోవడం.',
          'ఎముక భాగంలో తీవ్రమైన నొప్పి.',
          'పాదాల వేళ్లు తిమ్మిరి పట్టడం.'
        ],
        whenToCallHelp: 'ఫ్రాక్చర్ అనుమానం ఉంటే వెంటనే ఎక్స్-రే తీయించుకోండి.'
      },
      mr: {
        title: 'घोटा मुरगळणे (Ankle Sprain)',
        quickSummary: 'पाय मुरगळल्यामुळे येणारी सूज आणि वेदना.',
        whatToDoSteps: [
          'विश्रांती (Rest): पायावर भार देणे टाळा.',
          'बर्फ (Ice): १५-२० मिनिटे बर्फाचा शेक द्या.',
          'पट्टी (Compress): क्रेप बँडेजने आधार द्या.',
          'उंचावर ठेवा (Elevate): पाय उशीवर हृदयाच्या पातळीपेक्षा वर ठेवा.'
        ],
        warningSigns: [
          'अजिबात चालता न येणे.',
          'हाडाला गंभीर दुखापत किंवा वाकडेपणा जाणवणे.',
          'पायाची बोटे सुन्न पडणे.'
        ],
        whenToCallHelp: 'फ्रॅक्चरची शक्यता वाटल्यास दवाखान्यात जाऊन एक्स-रे करा.'
      },
      gu: {
        title: 'પગની ઘૂંટી મચકોડાવી',
        quickSummary: 'પગ વળી જવાથી થતો સોજો અને દુખાવો.',
        whatToDoSteps: [
          'આરામ: પગ પર વજન ન આપો.',
          'બરફ: ૧૫-૨૦ મિનિટ બરફનો શેક કરો.',
          'પાટો: ક્રેપ બેન્ડેજ બાંધો.',
          'ઊંચો રાખો: પગને ઓશીકા પર ઊંચો રાખો.'
        ],
        warningSigns: [
          'જરાય ચાલી ન શકાય.',
          'હાડકામાં અસહ્ય દુખાવો.',
          'પગના આંગળા સુન્ન થઈ જાય.'
        ],
        whenToCallHelp: 'હાડકું તૂટ્યું હોવાની શંકા હોય તો એક્સ-રે કરાવો.'
      },
      kn: {
        title: 'ಹಿಮ್ಮಡಿಯ ಉಳುಕು (Ankle Sprain)',
        quickSummary: 'ಪಾದ ತಿರುಚಿ ಉಂಟಾಗುವ ಊತ ಮತ್ತು ನೋವು.',
        whatToDoSteps: [
          'ವಿಶ್ರಾಂತಿ: ಪಾದದ ಮೇಲೆ ತೂಕ ಹಾಕಬೇಡಿ.',
          'ಐಸ್: 15-20 ನಿಮಿಷ ಐಸ್ ಪ್ಯಾಕ್ ಇಡಿ.',
          'ಬ್ಯಾಂಡೇಜ್: ಕ್ರೇಪ್ ಬ್ಯಾಂಡೇಜ್ ಕಟ್ಟಿ.',
          'ಎತ್ತರದಲ್ಲಿಡಿ: ಪಾದವನ್ನು ದಿಂಬಿನ ಮೇಲೆ ಎತ್ತರದಲ್ಲಿಡಿ.'
        ],
        warningSigns: [
          'ಸ್ವಲ್ಪವೂ ನಡೆಯಲು ಸಾಧ್ಯವಾಗದಿದ್ದರೆ.',
          'ಮೂಳೆಯಲ್ಲಿ ತೀವ್ರ ನೋವು ಅಥವಾ ವಿಕಾರತೆ.',
          'ಬೆರಳುಗಳು ಮರಗಟ್ಟುವುದು.'
        ],
        whenToCallHelp: 'ಮೂಳೆ ಮುರಿತದ ಶಂಕೆ ಇದ್ದರೆ ಎಕ್ಸ್-ರೇ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ.'
      },
      ml: {
        title: 'ഉളുക്ക് (Ankle Sprain)',
        quickSummary: 'കണങ്കാൽ തിരിഞ്ഞുണ്ടാകുന്ന വീക്കവും വേദനയും.',
        whatToDoSteps: [
          'വിശ്രമം: കാലിൽ ഭാരം കൊടുക്കരുത്.',
          'ഐസ്: 15-20 മിനിറ്റ് ഐസ് വെക്കുക.',
          'ബാൻഡേജ്: ക്രേപ്പ് ബാൻഡേജ് ഉപയോഗിക്കുക.',
          'ഉയർത്തി വെക്കുക: കാൽ തലയിണക്ക് മുകളിൽ ഉയർത്തി വെക്കുക.'
        ],
        warningSigns: [
          'നടക്കാൻ സാധിക്കാതെ വരിക.',
          'എല്ലിന് സ്ഥാനചലനമോ കഠിനമായ വേദനയോ ഉണ്ടായാൽ.',
          'വിരലുകൾ മരവിച്ചു പോകുക.'
        ],
        whenToCallHelp: 'എല്ലിന് പൊട്ടലുണ്ടോ എന്നറിയാൻ എക്സ്-റേ പരിശോധന നടത്തുക.'
      }
    }
  },
  {
    id: 'fainting-syncope',
    category: 'fainting',
    categoryLabel: 'Fainting',
    categoryIcon: 'HeartPulse',
    title: 'Fainting (Syncope) & Dizziness',
    quickSummary: 'Brief loss of consciousness or intense presyncopal lightheadedness from reduced cerebral blood flow.',
    severity: 'moderate',
    recommendedTimerSeconds: 600,
    timerLabel: 'Recovery Rest Timer (10 min)',
    whatToDoSteps: [
      'Lay the individual flat on their back in a cool, shaded, well-ventilated area.',
      'Elevate their legs 12 inches (30 cm) above heart level to facilitate blood circulation to the brain.',
      'Loosen any tight clothing, ties, belts, or restrictive campus gear.',
      'Check breathing and responsiveness; reassure them as they wake up.',
      'Keep them lying down for at least 10–15 minutes after regaining consciousness.'
    ],
    thingsToAvoid: [
      'Do NOT allow the person to get up or walk immediately upon opening their eyes.',
      'Do NOT give drinks, food, or pills while they are drowsy or semi-conscious.',
      'Do NOT slap their face or pour cold water on them.'
    ],
    warningSigns: [
      'Person remains unresponsive for more than 60 seconds.',
      'Fainting was accompanied by chest pain, palpitation, or shortness of breath.',
      'Person struck head violently during fall or shows confusion.',
      'Seizure activity or bladder incontinence observed.'
    ],
    whenToCallHelp: 'Call 911 / 112 or Campus Emergency Dispatch immediately if unresponsive > 1 min or head injury occurred.',
    translations: {
      en: {
        title: 'Fainting (Syncope) & Dizziness',
        quickSummary: 'Temporary loss of consciousness or severe lightheadedness.',
        whatToDoSteps: [
          'Lay person flat on their back in a cool area.',
          'Elevate legs 12 inches above heart level.',
          'Loosen tight clothing around neck and waist.',
          'Keep them resting flat for 10-15 minutes after waking.'
        ],
        warningSigns: [
          'Unresponsive for longer than 60 seconds.',
          'Chest pain or irregular pulse before fainting.',
          'Head impact injury during the fall.'
        ],
        whenToCallHelp: 'Call emergency services if consciousness is not regained within 1 minute.'
      },
      hi: {
        title: 'बेहोशी और चक्कर आना (Fainting / Syncope)',
        quickSummary: 'दिमाग में रक्त प्रवाह कम होने से अस्थायी बेहोशी।',
        whatToDoSteps: [
          'व्यक्ति को तुरंत हवादार जगह पर पीठ के बल लिटाएं।',
          'पैरों को 12 इंच (तकिए के सहारे) ऊपर उठाएं।',
          'गले और कमर के तंग कपड़े ढीले करें।',
          'होश आने के बाद कम से कम 10-15 मिनट लेटे रहने दें।'
        ],
        warningSigns: [
          '1 मिनट से अधिक समय तक बेहोश रहना।',
          'बेहोशी से पहले सीने में दर्द या सांस फूलना।',
          'गिरने से सिर में गंभीर चोट लगना।'
        ],
        whenToCallHelp: 'यदि 1 मिनट में होश न आए तो तुरंत 112 / एम्बुलेंस को कॉल करें।'
      },
      bn: {
        title: 'অজ্ঞান হওয়া ও মাথা ঘোরা (Fainting)',
        quickSummary: 'মস্তিষ্কে রক্ত চলাচল কমে সাময়িক জ্ঞান হারানো।',
        whatToDoSteps: [
          'ব্যক্তিকে সোজা করে শুইয়ে দিন।',
          'পা দুটো ১২ ইঞ্চি উঁচুতে রাখুন।',
          'গলার ও কোমরের টাইট জামা ঢিলে করুন।',
          'জ্ঞান ফিরলেও ১০-১৫ মিনিট শুয়ে থাকতে দিন।'
        ],
        warningSigns: [
          '১ মিনিটের বেশি সময় অজ্ঞান থাকলে।',
          'বুকে ব্যথা বা শ্বাসকষ্ট থাকলে।',
          'মাথায় গুরুতর আঘাত লাগলে।'
        ],
        whenToCallHelp: '১ মিনিটের মধ্যে জ্ঞান না ফিরলে অবিলম্বে অ্যাম্বুলেন্স ডাকুন।'
      },
      ta: {
        title: 'மயக்கம் மற்றும் தலைச்சுற்றல்',
        quickSummary: 'மூளைக்கு ரத்த ஓட்டம் குறைவதால் ஏற்படும் தற்காலிக மயக்கம்.',
        whatToDoSteps: [
          'நபரை சமதளத்தில் மல்லாக்க படுக்க வைக்கவும்.',
          'கால்களை 12 அங்குலம் உயர்த்தி வைக்கவும்.',
          'இறுக்கமான ஆடைகளை தளர்த்தவும்.',
          'விழித்த பிறகும் 10-15 நிமிடங்கள் படுத்திருக்கச் செய்யவும்.'
        ],
        warningSigns: [
          '1 நிமிடத்திற்கு மேல் சுயநினைவு திரும்பவில்லை என்றால்.',
          'நெஞ்சு வலி அல்லது மூச்சுத்திணறல்.',
          'தலையில் பலத்த அடிபட்டிருந்தால்.'
        ],
        whenToCallHelp: '1 நிமிடத்திற்குள் கண் விழிக்காவிட்டால் உடனே அவசர சிகிச்சையை அழைக்கவும்.'
      },
      te: {
        title: 'సృహ తప్పడం మరియు కళ్ళు తిరగడం',
        quickSummary: 'మెదడుకు రక్త ప్రసరణ తగ్గి తాత్కాలికంగా స్పృహ కోల్పోవడం.',
        whatToDoSteps: [
          'వ్యక్తిని చల్లని ప్రదేశంలో వెల్లకిలా పడుకోబెట్టండి.',
          'కాళ్లను 12 అంగుళాలు ఎత్తుగా ఉంచండి.',
          'బిగుతుగా ఉన్న దుస్తులను వదులు చేయండి.',
          'స్పృహ వచ్చాక 10-15 నిమిషాలు విశ్రాంతి తీసుకోనివ్వండి.'
        ],
        warningSigns: [
          '1 నిమిషం దాటినా స్పృహ రాకపోతే.',
          'గుండె నొప్పి లేదా శ్వాసలో ఇబ్బంది.',
          'పడిపోయినప్పుడు తలకు దెబ్బ తగిలితే.'
        ],
        whenToCallHelp: '1 నిమిషంలోపు స్పృహ రాకపోతే వెంటనే అంబులెన్స్‌కు కాల్ చేయండి.'
      },
      mr: {
        title: 'चक्कर येणे आणि बेशुद्ध पडणे (Fainting)',
        quickSummary: 'मेंदूला रक्तपुरवठा कमी झाल्यामुळे तात्पुरती बेशुद्धी.',
        whatToDoSteps: [
          'व्यक्तीला सुरक्षित हवेशीर जागी पाठीवर झोपवा.',
          'पाय १२ इंच वर उंचावून ठेवा.',
          'घट्ट कपडे सैल करा.',
          'शुद्धीवर आल्यानंतरही १०-१५ मिनिटे झोपवून ठेवा.'
        ],
        warningSigns: [
          '१ मिनिटापेक्षा जास्त वेळ बेशुद्ध राहिल्यास.',
          'छातीत दुखणे किंवा श्वास घेण्यास त्रास होणे.',
          'पडल्यामुळे डोक्याला मार लागल्यास.'
        ],
        whenToCallHelp: '१ मिनिटात शुद्धीवर न आल्यास त्वरित आपत्कालीन मदत बोलवा.'
      },
      gu: {
        title: 'ચક્કર આવવા અને બેભાન થવું',
        quickSummary: 'મગજમાં લોહીનું પરિભ્રમણ ઘટવાથી બેભાન થવું.',
        whatToDoSteps: [
          'વ્યક્તિને હવા ઉજાસવાળી જગ્યાએ સુવડાવો.',
          'પગને ૧૨ ઇંચ ઊંચા કરો.',
          'તંગ કપડાં ઢીલા કરો.',
          'ભાન આવે પછી પણ ૧૦-૧૫ મિનિટ આરામ કરવા દો.'
        ],
        warningSigns: [
          '૧ મિનિટથી વધુ સમય સુધી ભાન ન આવે.',
          'છાતીમાં દુખાવો કે શ્વાસ લેવામાં તકલીફ.',
          'માથામાં ગંભીર ઈજા થઈ હોય.'
        ],
        whenToCallHelp: '૧ મિનિટમાં ભાન ન આવે તો તાત્કાલિક એમ્બ્યુલન્સ બોલાવો.'
      },
      kn: {
        title: 'ಮೂರ್ಛೆ ಮತ್ತು ತಲೆತಿರುಗುವಿಕೆ',
        quickSummary: 'ಮೆದುಳಿಗೆ ರಕ್ತ ಪರಿಚಲನೆ ಕಡಿಮೆಯಾಗಿ ಪ್ರಜ್ಞೆ ತಪ್ಪುವುದು.',
        whatToDoSteps: [
          'ವ್ಯಕ್ತಿಯನ್ನು ಸಮತಟ್ಟಾದ ಜಾಗದಲ್ಲಿ ಮಲಗಿಸಿ.',
          'ಕಾಲುಗಳನ್ನು 12 ಇಂಚು ಎತ್ತರಿಸಿ.',
          'ಬಿಗಿಯಾದ ಬಟ್ಟೆಗಳನ್ನು ಸಡಿಲಗೊಳಿಸಿ.',
          'ಪ್ರಜ್ಞೆ ಬಂದ ಮೇಲೂ 10-15 ನಿಮಿಷ ಮಲಗಿರಲು ಬಿಡಿ.'
        ],
        warningSigns: [
          '1 ನಿಮಿಷಕ್ಕಿಂತ ಹೆಚ್ಚು ಕಾಲ ಪ್ರಜ್ಞೆ ಬಾರದಿದ್ದರೆ.',
          'ಎದೆ ನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ.',
          'ಬಿದ್ದಾಗ ತಲೆಗೆ ಪೆಟ್ಟು ಬಿದ್ದಿದ್ದರೆ.'
        ],
        whenToCallHelp: '1 ನಿಮಿಷದೊಳಗೆ ಪ್ರಜ್ಞೆ ಬಾರದಿದ್ದರೆ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸೇವೆಗೆ ಕರೆ ಮಾಡಿ.'
      },
      ml: {
        title: 'തലകറക്കവും ബോധക്ഷയവും',
        quickSummary: 'തലച്ചോറിലേക്കുള്ള രക്തയോട്ടം കുറഞ്ഞ് താൽക്കാലികമായി ബോധം മറയുന്നത്.',
        whatToDoSteps: [
          'ആളെ തണുപ്പുള്ള സ്ഥലത്ത് മലർത്തി കിടത്തുക.',
          'കാലുകൾ 12 ഇഞ്ച് ഉയരത്തിൽ വെക്കുക.',
          'ഇറുക്കമുള്ള വസ്ത്രങ്ങൾ അയക്കുക.',
          'ബോധം വന്ന ശേഷവും 10-15 മിനിറ്റ് വിശ്രമിക്കാൻ അനുവദിക്കുക.'
        ],
        warningSigns: [
          '1 മിനിറ്റിലധികം ബോധരഹിതനായി തുടർന്നാൽ.',
          'നെഞ്ചുവേദനയോ ശ്വാസതടസ്സമോ ഉണ്ടായാൽ.',
          'തലയ്ക്ക് പരുക്കേറ്റിട്ടുണ്ടെങ്കിൽ.'
        ],
        whenToCallHelp: '1 മിനിറ്റിനകം ബോധം തെളിഞ്ഞില്ലെങ്കിൽ ഉടൻ ആംബുലൻസ് വിളിക്കുക.'
      }
    }
  },
  {
    id: 'choking-adult',
    category: 'breathing',
    categoryLabel: 'Breathing',
    categoryIcon: 'Wind',
    title: 'Adult Choking (Heimlich Maneuver)',
    quickSummary: 'Upper airway obstruction by foreign object causing sudden inability to breathe or speak.',
    severity: 'critical',
    whatToDoSteps: [
      'Quickly ask: "Are you choking? Can you speak or cough?"',
      'If the person is coughing forcefully, encourage them to continue coughing without slapping their back.',
      'If SILENT choking (cannot breathe, cough, or talk): Stand behind them and lean them slightly forward.',
      'Deliver 5 sharp BACK BLOWS between the shoulder blades with the heel of your hand.',
      'Deliver 5 ABDOMINAL THRUSTS: Make a fist just above the navel, grasp with other hand, pull sharply inward and upward.',
      'Repeat 5 back blows and 5 abdominal thrusts until object is expelled or person loses consciousness.'
    ],
    thingsToAvoid: [
      'DO NOT perform blind finger sweeps in the mouth (it can push the obstruction further down).',
      'DO NOT offer water or beverages to a choking person.',
      'DO NOT slap their back if they are coughing strongly on their own.'
    ],
    warningSigns: [
      'Hands clutching throat (universal choking sign).',
      'Silent struggle to inhale with no audible sound.',
      'Lips, fingernails, or skin turning blue or purple (cyanosis).',
      'Person collapses and becomes unresponsive (START CPR IMMEDIATELY).'
    ],
    whenToCallHelp: 'CALL 911 / 112 IMMEDIATELY. If unresponsive, lower to floor, start CPR (30 compressions, check airway, 2 rescue breaths).',
    translations: {
      en: {
        title: 'Adult Choking (Heimlich Maneuver)',
        quickSummary: 'Airway blockage preventing breathing or speaking.',
        whatToDoSteps: [
          'Ask if they are choking. Encourage coughing if possible.',
          'If unable to cough/speak: give 5 back blows between shoulder blades.',
          'Give 5 quick abdominal thrusts just above the navel.',
          'Alternate 5 back blows and 5 thrusts until cleared.'
        ],
        warningSigns: [
          'Clutching the throat with hands.',
          'Inability to speak, breath, or cough.',
          'Skin turning blue or person losing consciousness.'
        ],
        whenToCallHelp: 'CALL 911/112 IMMEDIATELY. Begin CPR if person collapses.'
      },
      hi: {
        title: 'गले में कुछ अटकना / दम घुटना (Choking)',
        quickSummary: 'सांस की नली में खाना या वस्तु अटकने से दम घुटना।',
        whatToDoSteps: [
          'पूछें: "क्या आपका दम घुट रहा है?" यदि वे खांस सकते हैं, तो खांसने दें।',
          'यदि आवाज न निकले: पीठ पर दोनों कंधों के बीच 5 बार जोरदार थपकी दें।',
          'नाभि के ठीक ऊपर मुट्ठी रखकर 5 बार अंदर और ऊपर की ओर झटका दें (Heimlich Maneuver)।',
          'जब तक वस्तु बाहर न निकले यह दोहराएं।'
        ],
        warningSigns: [
          'गले को दोनों हाथों से पकड़ना (Choking Sign)।',
          'सांस या आवाज बिल्कुल न निकल पाना।',
          'होंठ या चेहरे का नीला पड़ना या बेहोश होना।'
        ],
        whenToCallHelp: 'तुरंत आपातकालीन 112 / एम्बुलेंस को कॉल करें। बेहोश होने पर सीपीआर शुरू करें।'
      },
      bn: {
        title: 'গলায় খাবার আটকে দম বন্ধ হওয়া (Choking)',
        quickSummary: 'শ্বাসনালীতে খাবার আটকে কথা বলা বা শ্বাস বন্ধ হওয়া।',
        whatToDoSteps: [
          'জিজ্ঞেস করুন দম বন্ধ হচ্ছে কিনা। কাশতে পারলে কাশতে বলুন।',
          'কথা বলতে না পারলে: পিঠের মাঝখানে ৫ বার চাপড় দিন।',
          'নাভির ওপরে হাত রেখে ৫ বার পেটে ভেতরের দিকে ও ওপরের দিকে চাপ দিন (হেইমলিচ)।',
          'বস্তুটি বের না হওয়া পর্যন্ত চালিয়ে যান।'
        ],
        warningSigns: [
          'হাত দিয়ে গলা চেপে ধরা।',
          'শব্দহীন হাঁসফাঁস করা।',
          'মুখ ও ঠোঁট নীল হয়ে যাওয়া।'
        ],
        whenToCallHelp: 'অবিলম্বে জরুরি নম্বরে কল করুন। অজ্ঞান হয়ে গেলে সিপিআর শুরু করুন।'
      },
      ta: {
        title: 'தொண்டையில் அடைப்பு / மூச்சுத்திணறல் (Choking)',
        quickSummary: 'மூச்சுக்குழாயில் உணவு சிக்கி பேசுவதோ சுவாசிப்பதோ தடைபடுதல்.',
        whatToDoSteps: [
          'இருமல் வந்தால் இருமச் சொல்லுங்கள்.',
          'பேச முடியவில்லை என்றால்: முதுகில் 5 முறை தட்டவும்.',
          'தொப்புளுக்கு மேலே 5 முறை உள்நோக்கி மேல்நோக்கி அழுத்தவும் (ஹெய்ம்லிச் முறை).',
          'அடைப்பு நீங்கும் வரை தொடர்ந்து செய்யவும்.'
        ],
        warningSigns: [
          'கைகளால் தொண்டையைப் பிடித்தல்.',
          'மூச்சுவிட முடியாத நிலை.',
          'உதடுகள் நீல நிறமாக மாறுதல்.'
        ],
        whenToCallHelp: 'உடனடியாக 112/108 ஆம்புலன்ஸை அழைக்கவும்.'
      },
      te: {
        title: 'గొంతులో ఏదైనా అడ్డుపడటం (Choking)',
        quickSummary: 'శ్వాసనాళంలో ఆహారం ఇరుక్కుని శ్వాస ఆడకపోవడం.',
        whatToDoSteps: [
          'దగ్గగలిగితే బలంగా దగ్గమనండి.',
          'మాట్లాడలేకపోతే: వెనుక వీపుపై 5 సార్లు గట్టిగా చరచండి.',
          'పొత్తికడుపుపై 5 సార్లు పైకి ఒత్తిడి కలిగించండి (హీమ్లిచ్ పద్ధతి).',
          'అడ్డంకి తొలగిపోయే వరకు కొనసాగించండి.'
        ],
        warningSigns: [
          'చేతులతో గొంతు పట్టుకోవడం.',
          'మాట రాకపోవడం, ఊపిరి ఆడకపోవడం.',
          'పెదవులు నీలంగా మారడం.'
        ],
        whenToCallHelp: 'వెంటనే అంబులెన్స్ పిలవండి. అపస్మారక స్థితిలోకి వెళ్తే CPR చేయండి.'
      },
      mr: {
        title: 'घशात घास अडकणे / श्वास कोंडणे (Choking)',
        quickSummary: 'श्वासनलिकेत अन्न अडकल्यामुळे श्वास थांबणे.',
        whatToDoSteps: [
          'खोकता येत असल्यास जोरात खोकण्यास सांगा.',
          'आवाज येत नसल्यास: पाठीवर दोन खांद्यांच्या मध्ये ५ वेळा थाप मारा.',
          'पोटावर बेंबीच्या वर ५ वेळा वरच्या दिशेने झटका द्या (Heimlich Maneuver).',
          'अडकलेली वस्तू बाहेर पडेपर्यंत करा.'
        ],
        warningSigns: [
          'घशाला हाताने पकडणे.',
          'श्वास किंवा आवाज बंद होणे.',
          'ओठ किंवा त्वचा निळी पडणे.'
        ],
        whenToCallHelp: 'तातडीने १०८ / आपत्कालीन क्रमांकावर संपर्क साधा.'
      },
      gu: {
        title: 'ગળામાં કંઈક અટકવું (Choking)',
        quickSummary: 'શ્વાસનળીમાં ખોરાક ફસાઈ જવાથી શ્વાસ રુંધાવો.',
        whatToDoSteps: [
          'ખાંસી આવતી હોય તો જોરથી ખાંસવા દો.',
          'અવાજ ન નીકળે તો: પીઠ પર વચ્ચે ૫ વાર જોરથી થાપટો મારો.',
          'પેટ પર નાભિથી ઉપર ૫ વાર અંદર-ઉપર તરફ દબાવો.',
          'વસ્તુ બહાર ન નીકળે ત્યાં સુધી ચાલુ રાખો.'
        ],
        warningSigns: [
          'ગળાને બંને હાથે પકડવું.',
          'શ્વાસ કે અવાજ ન આવવો.',
          'હોઠ નીલા પડી જવા.'
        ],
        whenToCallHelp: 'તરત જ ૧૦૮/ઇમરજન્સી કોલ કરો.'
      },
      kn: {
        title: 'ಗಂಟಲಿನಲ್ಲಿ ಆಹಾರ ಸಿಲುಕುವುದು (Choking)',
        quickSummary: 'ಉಸಿರುನಾಳದಲ್ಲಿ ಆಹಾರ ಸಿಲುಕಿ ಉಸಿರುಗಟ್ಟುವುದು.',
        whatToDoSteps: [
          'ಕೆಮ್ಮಲು ಸಾಧ್ಯವಾದರೆ ಬಲವಾಗಿ ಕೆಮ್ಮಲು ಹೇಳಿ.',
          'ಮಾತನಾಡಲು ಸಾಧ್ಯವಾಗದಿದ್ದರೆ: ಬೆನ್ನಿನ ಮೇಲೆ 5 ಬಾರಿ ಬಡಿಯಿರಿ.',
          'ಹೊಟ್ಟೆಯ ಮೇಲೆ 5 ಬಾರಿ ಒಳಮುಖವಾಗಿ ಒತ್ತಡ ಹಾಕಿ (ಹೀಮ್ಲಿಚ್ ವಿಧಾನ).',
          'ಅಡಚಣೆ ನಿವಾರಣೆಯಾಗುವವರೆಗೆ ಮುಂದುವರಿಸಿ.'
        ],
        warningSigns: [
          'ಗಂಟಲನ್ನು ಕೈಗಳಿಂದ ಹಿಡಿದುಕೊಳ್ಳುವುದು.',
          'ಮಾತನಾಡಲು ಅಥವಾ ಉಸಿರಾಡಲು ಅಸಾಧ್ಯವಾಗುವುದು.',
          'ತುಟಿಗಳು ನೀಲಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗುವುದು.'
        ],
        whenToCallHelp: 'ತಕ್ಷಣ ತುರ್ತು ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ. ಪ್ರಜ್ಞೆ ತಪ್ಪಿದರೆ CPR ನೀಡಿ.'
      },
      ml: {
        title: 'തൊണ്ടയിൽ ഭക്ഷണം കുടുങ്ങുക (Choking)',
        quickSummary: 'ശ്വാസനാളത്തിൽ തടസ്സം വന്ന് ശ്വാസം മുട്ടുന്നത്.',
        whatToDoSteps: [
          'ചുമയ്ക്കാൻ കഴിയുമെങ്കിൽ ശക്തമായി ചുമയ്ക്കാൻ പറയുക.',
          'സംസാരിക്കാൻ കഴിയുന്നില്ലെങ്കിൽ: മുതുകിൽ 5 തവണ തട്ടുക.',
          'വയറ്റിൽ പൊക്കിളിന് മുകളിലായി 5 തവണ അമർത്തുക (ഹെയ്ംലിച്ച് രീതി).',
          'തടസ്സം മാറുന്നത് വരെ തുടരുക.'
        ],
        warningSigns: [
          'കൈകൾ കൊണ്ട് തൊണ്ടയിൽ പിടിക്കുന്നത്.',
          'സംസാരിക്കാനോ ശ്വാസമെടുക്കാനോ കഴിയാതെ വരുന്നത്.',
          'ചുണ്ടുകൾ നീല നിറമാവുന്നത്.'
        ],
        whenToCallHelp: 'ഉടൻ തന്നെ ആംബുലൻസ് വിളിക്കുക.'
      }
    }
  },
  {
    id: 'heat-exhaustion',
    category: 'heat_cold',
    categoryLabel: 'Heat & Cold',
    categoryIcon: 'Thermometer',
    title: 'Heat Exhaustion',
    quickSummary: 'Body overheating from hot environments or strenuous campus sports, marked by heavy sweating and rapid pulse.',
    severity: 'moderate',
    recommendedTimerSeconds: 600,
    timerLabel: 'Cooling & Rehydration Timer (10 min)',
    whatToDoSteps: [
      'Move to an air-conditioned building or deep shaded area immediately.',
      'Lie down and loosen or remove excess heavy clothing (jackets, backpacks, caps).',
      'Sip cool water or electrolyte sports beverages slowly (avoid ice-cold chugging).',
      'Apply cool, damp cloths to the forehead, back of neck, armpits, and groin.',
      'Fan the person continuously to accelerate evaporative cooling.'
    ],
    thingsToAvoid: [
      'Do NOT give caffeinated energy drinks, coffee, or alcohol.',
      'Do NOT allow person to return to sports or hot campus labs until fully rested for 24h.',
      'Do NOT ignore progression to confusion, hot dry skin, or vomiting (HEAT STROKE).'
    ],
    warningSigns: [
      'Body temperature rises above 103°F (39.4°C).',
      'Confusion, slurred speech, agitation, or loss of consciousness (HEAT STROKE).',
      'Hot, dry, flushed red skin without sweating.',
      'Persistent vomiting or inability to keep fluids down.'
    ],
    whenToCallHelp: 'CRITICAL: If confusion, delirium, or hot dry skin occurs, this is HEAT STROKE. Call 911/112 immediately and immerse in cold water.'
  },
  {
    id: 'chemical-splash',
    category: 'other',
    categoryLabel: 'Other Emergencies',
    categoryIcon: 'AlertTriangle',
    title: 'Campus Lab Chemical Splash',
    quickSummary: 'Hazardous acidic, alkaline, or organic chemical contact with eyes or skin.',
    severity: 'high',
    recommendedTimerSeconds: 900,
    timerLabel: 'Emergency Eye/Skin Wash Timer (15 min)',
    whatToDoSteps: [
      'Immediately proceed to the nearest Emergency Eye Wash Station or Safety Shower in the lab.',
      'Hold eyelids wide open and flush eyes with steady flowing water for a MINIMUM of 15 continuous minutes.',
      'For skin splashes: immediately strip off contaminated lab coats or clothing under the safety shower.',
      'Alert the lab instructor, safety officer, or nearby peers immediately.',
      'Locate and note the exact Chemical Name or Safety Data Sheet (SDS) for medical responders.'
    ],
    thingsToAvoid: [
      'DO NOT rub eyes with hands or paper towels.',
      'DO NOT attempt to neutralize acids with bases or vice versa on skin.',
      'DO NOT wear contact lenses—remove them under the water stream if possible.'
    ],
    warningSigns: [
      'Chemical involved is strong acid (e.g., HCl, H2SO4) or strong base (e.g., NaOH, bleach).',
      'Severe eye pain, blurred vision, or inability to open eyelid.',
      'Skin blistering, chemical burns, or deep discoloration.',
      'Inhalation of toxic chemical vapors accompanied by coughing or wheezing.'
    ],
    whenToCallHelp: 'CALL 911 / 112 AND Campus Safety immediately. Provide the exact chemical name from the SDS.'
  }
];

export const EMERGENCY_CONTACTS: {
  id: string;
  name: string;
  role: string;
  phone: string;
  availableHours: string;
  type: 'emergency' | 'security' | 'medical' | 'trusted';
  avatarIcon: string;
  isDefault?: boolean;
}[] = [
  {
    id: 'c-1',
    name: 'Universal Emergency Services',
    role: 'Police / Fire / Paramedics (National Dispatch)',
    phone: '911',
    availableHours: '24/7/365 Nationwide',
    type: 'emergency',
    avatarIcon: 'ShieldAlert',
    isDefault: true
  },
  {
    id: 'c-2',
    name: 'Campus Safety & Security Dispatch',
    role: 'Campus Police & Rapid Emergency Response Team',
    phone: '(555) 019-2424',
    availableHours: 'Available 24/7 (Average Response: 3 min)',
    type: 'security',
    avatarIcon: 'ShieldCheck',
    isDefault: true
  },
  {
    id: 'c-3',
    name: 'Campus Student Health & Urgent Care',
    role: 'On-Campus Clinic, Triage & First Aid Services',
    phone: '(555) 019-3800',
    availableHours: 'Mon-Sun: 7:00 AM – 10:00 PM',
    type: 'medical',
    avatarIcon: 'Stethoscope',
    isDefault: true
  },
  {
    id: 'c-4',
    name: 'Campus Mental Health & Crisis Hotline',
    role: 'Confidential Support & Urgent Psychological First Aid',
    phone: '988',
    availableHours: '24/7 Toll-Free & Confidential',
    type: 'medical',
    avatarIcon: 'HeartHandshake',
    isDefault: true
  },
  {
    id: 'c-5',
    name: 'Mom / Primary Emergency Contact',
    role: 'Family Trusted Contact (Configured in Profile)',
    phone: '(555) 987-6543',
    availableHours: 'Personal Contact',
    type: 'trusted',
    avatarIcon: 'UserCheck',
    isDefault: false
  },
  {
    id: 'c-6',
    name: 'Campus Dorm Resident Advisor (RA)',
    role: 'Hall Resident Advisor & Building Ward',
    phone: '(555) 019-8821',
    availableHours: 'Dorm On-Duty Hours',
    type: 'trusted',
    avatarIcon: 'Home',
    isDefault: false
  }
];

export const DEFAULT_EMERGENCY_CONTACTS = EMERGENCY_CONTACTS;

export const QUICK_HELP_TOPICS = [
  { id: 'minor-cut', label: 'Minor Cut', icon: 'Bandage', category: 'wounds', prompt: 'I have a minor cut and need step by step first-aid' },
  { id: 'minor-burn', label: 'Minor Burn', icon: 'Flame', category: 'burns', prompt: 'I accidentally burned my hand on hot surface' },
  { id: 'nosebleed', label: 'Nosebleed', icon: 'Droplets', category: 'bleeding', prompt: 'My nose started bleeding, what should I do?' },
  { id: 'ankle-sprain', label: 'Sprain', icon: 'Activity', category: 'injuries', prompt: 'I twisted my ankle playing basketball and it is swelling' },
  { id: 'fainting-syncope', label: 'Fainting', icon: 'HeartPulse', category: 'fainting', prompt: 'Someone just felt dizzy and fainted in the classroom' },
  { id: 'choking-adult', label: 'Choking', icon: 'Wind', category: 'breathing', prompt: 'Someone is choking in the dining hall' },
  { id: 'heat-exhaustion', label: 'Heat Illness', icon: 'Thermometer', category: 'heat_cold', prompt: 'Feeling dizzy, hot, and nauseous after campus workout' },
  { id: 'hazard-report', label: 'Campus Hazard', icon: 'AlertTriangle', category: 'other', prompt: 'I noticed a physical safety hazard on campus' }
];
