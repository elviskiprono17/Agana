export interface QuestionnaireField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'photo' | 'date';
  placeholder?: string;
  helperText?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: any;
  validationRegex?: string;
}

export interface PresetConfig {
  id: string;
  name: string;
  category: string;
  icon: string;
  badge: string;
  description: string;
  defaultClauses: Array<{ id: string; title: string; content: string }>;
  fields: QuestionnaireField[];
}

export const MAX_AMOUNT_KES = 1000000; // 1,000,000 KES (Kenya Small Claims Court Ceiling)

export const PRESET_OPTIONS: PresetConfig[] = [
  {
    id: 'livestock_sale',
    name: 'Livestock / Cow Purchase',
    category: 'Agribusiness',
    icon: '🐄',
    badge: 'Popular in Rift & Western',
    description: 'Sale of dairy cows, steers, goats, or sheep with breed specs, ear tags, health clearance & county movement compliance.',
    defaultClauses: [
      {
        id: 'vet_health_warranty',
        title: 'Veterinary & Health Warranty',
        content: 'The Seller warrants that the animal is free from latent endemic diseases (including Foot & Mouth Disease, Anthrax, and East Coast Fever) and grants the Buyer a 48-hour veterinary inspection window upon physical handover.'
      },
      {
        id: 'legal_ownership_title',
        title: 'Title & Clean Ownership Guarantee',
        content: 'The Seller guarantees sole ownership and legal right to transfer the animal, certifying it is not subject to any family dispute, dowry pledge, or third-party claim.'
      },
      {
        id: 'delivery_movement_permit',
        title: 'Movement Permit & Delivery Handover',
        content: 'The animal shall be handed over at the agreed location. The Seller shall assist the Buyer in securing the requisite County Veterinary Livestock Movement Permit where inter-county transport is required.'
      },
      {
        id: 'small_claims_dispute',
        title: 'Small Claims Court Jurisdiction',
        content: 'Any dispute arising from mortality, pregnancy dispute, or misrepresentation shall be submitted to the nearest Small Claims Court within Kenya in accordance with the Small Claims Act, 2016.'
      }
    ],
    fields: [
      {
        id: 'livestock_type',
        label: 'Livestock Category',
        type: 'select',
        options: ['Dairy Cow', 'Beef Steer / Bull', 'Dairy Heifer (In-Calf)', 'Dairy Goat', 'Meat Goat', 'Sheep / Ram'],
        required: true,
      },
      {
        id: 'breed',
        label: 'Breed & Genetic Line',
        type: 'select',
        options: ['Friesian / Holstein', 'Ayrshire', 'Jersey', 'Guernsey', 'Boran', 'Sahiwal', 'East African Zebu', 'Galla Goat', 'Boer Goat', 'Dorper Sheep'],
        required: true,
      },
      {
        id: 'color_markings',
        label: 'Color, Coat & Distinguishing Markings',
        type: 'text',
        placeholder: 'e.g. Black and white patches, star marking on forehead, curved horns',
        required: true,
      },
      {
        id: 'ear_tag_number',
        label: 'Ear Tag / Brand ID',
        type: 'text',
        placeholder: 'e.g. KE-NK-8921 or Brand Mark "K6"',
        helperText: 'Official ear tag or unique physical brand identifier',
        required: true,
      },
      {
        id: 'age_dentition',
        label: 'Approximate Age / Dentition (Teeth)',
        type: 'text',
        placeholder: 'e.g. 3.5 years (4 permanent incisor teeth)',
        required: true,
      },
      {
        id: 'lactation_pregnancy_status',
        label: 'Lactation / Pregnancy Status',
        type: 'text',
        placeholder: 'e.g. Producing 18 Litres/day, 6 months in-calf confirmed by vet AI record',
        required: false,
      },
      {
        id: 'county_origin',
        label: 'County & Sub-County of Origin',
        type: 'text',
        placeholder: 'e.g. Uasin Gishu, Eldoret West (Turbo)',
        required: true,
      },
      {
        id: 'handover_location',
        label: 'Physical Handover Location',
        type: 'text',
        placeholder: 'e.g. Seller Farm Gate, Karatina Livestock Market, or Buyer Homestead',
        required: true,
      },
      {
        id: 'item_photos',
        label: 'Animal Inspection Photos',
        type: 'photo',
        helperText: 'Upload clear photo showing side profile, face/horns, and ear tag',
        required: false,
      }
    ]
  },
  {
    id: 'phone_electronics',
    name: 'Phone / Electronics Sale',
    category: 'Retail & Tech',
    icon: '📱',
    badge: 'IMEI Verified',
    description: 'Sale of smartphones, laptops, or gadgets with verified IMEI/Serial numbers, iCloud/Google unlock warranty & proof of legal ownership.',
    defaultClauses: [
      {
        id: 'imei_authenticity',
        title: 'IMEI & Non-Blacklist Warranty',
        content: 'The Seller warrants that the primary IMEI and serial numbers match the physical device hardware, that the device is authentic (not counterfeit), and is not reported stolen or blocked by any Kenyan mobile network operator (Safaricom, Airtel, Telkom).'
      },
      {
        id: 'cloud_account_unlocked',
        title: 'iCloud / Google FRP / Knox Account Removal',
        content: 'The Seller certifies that all personal biometric credentials, Apple ID / iCloud Activation Lock, Google Factory Reset Protection (FRP), Samsung Knox, and Mobile Device Management (MDM) profiles have been completely removed prior to handover.'
      },
      {
        id: 'hardware_return_warranty',
        title: '7-Day Functional Guarantee',
        content: 'The Seller provides a 7-day warranty covering hidden hardware defects (motherboard failure, touch IC, network baseband issues). Physical liquid damage or drop cracks inflicted post-sale void this guarantee.'
      },
      {
        id: 'small_claims_dispute',
        title: 'Kenya Small Claims Court Enforcement',
        content: 'In the event of discovered encumbrance, fraud, or fake IMEI, the Buyer shall be entitled to an immediate full refund plus recovery costs enforceable under Kenya Small Claims Act, 2016.'
      }
    ],
    fields: [
      {
        id: 'device_brand',
        label: 'Brand',
        type: 'select',
        options: ['Apple (iPhone)', 'Samsung', 'Google Pixel', 'Xiaomi / Redmi', 'Tecno / Infinix', 'HP Laptop', 'Dell Laptop', 'Lenovo ThinkPad', 'Apple MacBook', 'Other'],
        required: true,
      },
      {
        id: 'device_model',
        label: 'Exact Model & Color',
        type: 'text',
        placeholder: 'e.g. iPhone 15 Pro 256GB - Natural Titanium',
        required: true,
      },
      {
        id: 'primary_imei',
        label: 'Primary IMEI (15 Digits)',
        type: 'text',
        placeholder: 'Dial *#06# to obtain 15-digit IMEI (e.g. 359123456789012)',
        helperText: 'Crucial for police verification & Kenyan Small Claims validity',
        required: true,
      },
      {
        id: 'secondary_imei_or_serial',
        label: 'Secondary IMEI or Serial Number',
        type: 'text',
        placeholder: 'e.g. eSIM IMEI or Apple Serial F2LXYZ98...',
        required: false,
      },
      {
        id: 'device_condition',
        label: 'Cosmetic & Physical Condition',
        type: 'select',
        options: ['Brand New Sealed Box', 'Refurbished Grade A (Flawless)', 'Used - Like New (No Scratches)', 'Used - Minor Cosmetic Wear', 'Used - Screen Replaced with OEM parts'],
        required: true,
      },
      {
        id: 'battery_health',
        label: 'Battery Health % / Cycle Count',
        type: 'text',
        placeholder: 'e.g. 91% Maximum Capacity',
        required: false,
      },
      {
        id: 'included_accessories',
        label: 'Included Accessories & Box',
        type: 'text',
        placeholder: 'e.g. Original 20W USB-C Charger, Braided cable, Original box with matching IMEI barcode',
        required: true,
      },
      {
        id: 'item_photos',
        label: 'Device Photos',
        type: 'photo',
        helperText: 'Upload photo of screen showing *#06# IMEI, back of phone, and accessories',
        required: false,
      }
    ]
  },
  {
    id: 'freelance_gig',
    name: 'Freelance & Skilled Labor',
    category: 'Services',
    icon: '💻',
    badge: 'Milestone Protected',
    description: 'Contract for software developers, designers, videographers, artisans or contractors with deliverables, IP assignment & payment milestones.',
    defaultClauses: [
      {
        id: 'ip_assignment',
        title: 'Intellectual Property Assignment',
        content: 'All copyright, source code, design assets, and work product developed under this agreement shall be automatically assigned to the Client upon receipt of 100% full cleared payment.'
      },
      {
        id: 'revision_acceptance',
        title: 'Deliverable Review & Revision Limit',
        content: 'The Client shall have 5 business days to review submitted milestone deliverables. The Contractor includes up to two (2) rounds of reasonable revisions aligned with the agreed project scope.'
      },
      {
        id: 'confidentiality_nda',
        title: 'Mutual Non-Disclosure & Confidentiality',
        content: 'Both parties agree to treat all business data, technical architecture, client lists, and pricing disclosures as strictly proprietary and confidential.'
      },
      {
        id: 'kill_fee_early_termination',
        title: 'Early Termination & Kill Fee',
        content: 'If the Client terminates the project prior to final completion without contractor breach, the initial deposit shall be retained as a non-refundable kill fee for work rendered.'
      }
    ],
    fields: [
      {
        id: 'service_discipline',
        label: 'Service Discipline',
        type: 'select',
        options: ['Fullstack Web / Mobile App Development', 'UI/UX & Product Design', 'Photography & Commercial Video Production', 'Content Writing & SEO Marketing', 'Carpentry & Interior Fitout', 'Electrical & Solar Installation', 'Accounting & Tax Advisory'],
        required: true,
      },
      {
        id: 'project_title',
        label: 'Project Title',
        type: 'text',
        placeholder: 'e.g. E-Commerce Mobile App MVP with M-Pesa Integration',
        required: true,
      },
      {
        id: 'key_deliverables',
        label: 'Key Deliverables & Acceptance Criteria',
        type: 'textarea',
        placeholder: '1. Next.js responsive frontend\n2. Supabase backend & auth\n3. M-Pesa Daraja API integration\n4. Deployment to production domain',
        required: true,
      },
      {
        id: 'delivery_deadline',
        label: 'Target Completion Date',
        type: 'date',
        required: true,
      },
      {
        id: 'deposit_split',
        label: 'Deposit & Milestone Structure',
        type: 'select',
        options: ['50% Upfront Deposit, 50% on Final Delivery', '30% Deposit, 40% Mid-point Beta, 30% Final', '100% Escrow on Completion', 'Weekly Milestone Drawdowns'],
        required: true,
      },
      {
        id: 'revisions_included',
        label: 'Included Review Rounds',
        type: 'select',
        options: ['2 Rounds of Revision', '3 Rounds of Revision', '1 Comprehensive Overhaul', 'Hourly billed additional revisions (KES 2,500/hr)'],
        required: true,
      }
    ]
  },
  {
    id: 'boda_boda_sale',
    name: 'Boda Boda / Motorcycle Sale',
    category: 'Transport & Fleet',
    icon: '🏍️',
    badge: 'NTSA Logbook Protocol',
    description: 'Sale or lease-to-own for TVS, Boxer, or Honda motorcycles with chassis number, engine specs & NTSA TIMS logbook transfer obligations.',
    defaultClauses: [
      {
        id: 'ntsa_logbook_transfer',
        title: 'NTSA TIMS Logbook Transfer Undertaking',
        content: 'The Seller covenants to initiate and approve the digital motor vehicle transfer on the NTSA TIMS / eCitizen portal within 14 calendar days of receipt of the final installment.'
      },
      {
        id: 'chassis_engine_police_clearance',
        title: 'Clean Police & DCI Clearance Guarantee',
        content: 'The Seller affirms that the motorcycle registration, engine number, and chassis plate are authentic and has never been flagged as stolen or subjected to police investigations.'
      },
      {
        id: 'traffic_fines_indemnity',
        title: 'Pre-Handover Traffic Offenses Indemnity',
        content: 'The Seller indemnifies the Buyer against all historical traffic fines, impound fees, or pending county parking notices incurred prior to the date and hour of physical handover.'
      }
    ],
    fields: [
      {
        id: 'bike_make_model',
        label: 'Motorcycle Make & Model',
        type: 'select',
        options: ['TVS HLX 125 Plus', 'TVS HLX 150', 'Bajaj Boxer BM 150', 'Honda Ace CB125', 'Skygo 125', 'Haojin 150', 'Electric Boda (Ampersand / Roam)'],
        required: true,
      },
      {
        id: 'registration_number',
        label: 'Registration Plate Number',
        type: 'text',
        placeholder: 'e.g. KMD 789X',
        required: true,
      },
      {
        id: 'engine_number',
        label: 'Engine Number',
        type: 'text',
        placeholder: 'Stamped on crankcase (e.g. AF14E-29381)',
        required: true,
      },
      {
        id: 'chassis_number',
        label: 'Chassis / VIN Number',
        type: 'text',
        placeholder: 'Stamped on steering stem (e.g. MD625...17 chars)',
        required: true,
      },
      {
        id: 'current_mileage',
        label: 'Odometer Mileage (KM)',
        type: 'text',
        placeholder: 'e.g. 24,500 KM',
        required: false,
      },
      {
        id: 'included_gear',
        label: 'Included Gear & Logbook',
        type: 'text',
        placeholder: 'e.g. Original Logbook in hand, 2 Helmets, GPS tracker login handed over',
        required: true,
      }
    ]
  },
  {
    id: 'chama_peer_loan',
    name: 'Chama / Informal Loan & Promissory Note',
    category: 'Finance & Chama',
    icon: '🤝',
    badge: 'Cap 23 Law of Contract',
    description: 'Promissory note & friendly loan for business capital, emergency aid, or chama advances with collateral terms and Small Claims jurisdiction.',
    defaultClauses: [
      {
        id: 'repayment_promise',
        title: 'Irrevocable Promise to Repay',
        content: 'The Borrower acknowledges receipt of the principal sum and unconditionally promises to repay the total agreed sum via M-Pesa or designated bank account on or before the due date.'
      },
      {
        id: 'default_notice_acceleration',
        title: 'Default Notice & Debt Acceleration',
        content: 'Upon default exceeding 7 calendar days after the repayment date, the entire remaining balance shall become immediately due and payable without further demand.'
      },
      {
        id: 'collateral_pledge',
        title: 'Collateral Pledged & Custody Undertaking',
        content: 'Where collateral is specified in this agreement, the Borrower grants the Lender a possessory security interest until the debt is discharged in full.'
      },
      {
        id: 'kenya_small_claims_recovery',
        title: 'Expedited Small Claims Court Recovery',
        content: 'The parties consent to summary recovery under the Kenya Small Claims Court Rules, with the debtor bearing all reasonable advocate and auctioneer fees.'
      }
    ],
    fields: [
      {
        id: 'loan_purpose',
        label: 'Purpose of Advance / Facility',
        type: 'select',
        options: ['Business Stock / Working Capital', 'Farm Inputs & Fertilizer', 'School Fees / Tuition', 'Medical Emergency', 'Chama Merry-Go-Round Payout Advance', 'Personal Emergency'],
        required: true,
      },
      {
        id: 'principal_amount',
        label: 'Principal Amount Borrowed (KES)',
        type: 'number',
        placeholder: 'e.g. 85000',
        required: true,
      },
      {
        id: 'interest_facilitation_fee',
        label: 'Agreed Interest / Facilitation Fee (KES)',
        type: 'number',
        placeholder: 'e.g. 5000 (Enter 0 if 0% interest)',
        required: true,
      },
      {
        id: 'repayment_due_date',
        label: 'Repayment Due Date',
        type: 'date',
        required: true,
      },
      {
        id: 'collateral_description',
        label: 'Security / Collateral Pledged',
        type: 'textarea',
        placeholder: 'e.g. Samsung 55" Smart TV + Original Receipt, or TVS Motorcycle Logbook KMD 123X held in custody',
        required: false,
      }
    ]
  },
  {
    id: 'farm_produce_offtake',
    name: 'Farm Produce Harvest Offtake',
    category: 'Agribusiness',
    icon: '🥑',
    badge: 'Harvest Delivery Guard',
    description: 'Contract between farmer and buyer for fresh avocados, french beans, macadamia, maize, or coffee with moisture/grade quality criteria.',
    defaultClauses: [
      {
        id: 'quality_grading_standard',
        title: 'Produce Quality Grading & Rejection Threshold',
        content: 'Produce shall be inspected at the collection center according to agreed KEPHIS export or local grade standards. Maximum permissible defect rate is 5%.'
      },
      {
        id: 'weighing_and_mpesa_clearance',
        title: 'Certified Weighing & Instant M-Pesa Settlement',
        content: 'Weighing scales shall be certified by the Kenya Weights and Measures Department. Settlement shall be completed via M-Pesa immediately upon tallying weight slips.'
      },
      {
        id: 'force_majeure_weather',
        title: 'Agricultural Force Majeure',
        content: 'Neither party shall be held liable for crop yield failures directly resulting from catastrophic drought, unseasonal hail storms, or declared government crop quarantines.'
      }
    ],
    fields: [
      {
        id: 'crop_commodity',
        label: 'Commodity Type',
        type: 'select',
        options: ['Hass Avocados (Export Grade)', 'French Beans / Snow Peas', 'Macadamia Nuts (In-Shell)', 'Dry Maize (90kg Bags)', 'Potatoes (Nyandarua Shangi)', 'Tomatoes (Wooden Crates)'],
        required: true,
      },
      {
        id: 'quantity_units',
        label: 'Estimated Harvest Quantity & Units',
        type: 'text',
        placeholder: 'e.g. 5,000 Kilograms or 150 Bags of 90kg',
        required: true,
      },
      {
        id: 'price_per_unit',
        label: 'Agreed Price per Unit (KES)',
        type: 'text',
        placeholder: 'e.g. KES 85 per Kg or KES 3,800 per 90kg Bag',
        required: true,
      },
      {
        id: 'collection_depot',
        label: 'Collection / Weighing Center',
        type: 'text',
        placeholder: 'e.g. Murang\'a Farmers Cooperative Depot, Kangari',
        required: true,
      }
    ]
  },
  {
    id: 'custom_agreement',
    name: 'Custom Informal Transaction',
    category: 'General',
    icon: '📝',
    badge: 'Small Claims Cap 23',
    description: 'Create an agreement for rent deposit handover, vehicle rental, salon chair lease, tool hire, or any transaction under KES 1,000,000.',
    defaultClauses: [
      {
        id: 'general_good_faith',
        title: 'Good Faith & Fair Dealing',
        content: 'Both parties agree to perform all obligations with integrity and mutual respect under the Kenya Law of Contract Act (Cap 23).'
      },
      {
        id: 'breach_notice_period',
        title: 'Remedy Notice Period',
        content: 'In the event of alleged breach, the aggrieved party shall give written notice via WhatsApp or SMS granting 5 business days to cure before legal proceedings.'
      },
      {
        id: 'small_claims_jurisdiction',
        title: 'Dispute Resolution via Small Claims Court',
        content: 'Any dispute not settled amicably within 14 days shall be determined by the Kenya Small Claims Court in the county where the agreement was concluded.'
      }
    ],
    fields: [
      {
        id: 'deal_summary',
        label: 'Deal Summary & Subject Matter',
        type: 'textarea',
        placeholder: 'Describe clearly what is being bought, rented, borrowed, or delivered...',
        required: true,
      },
      {
        id: 'key_conditions',
        label: 'Key Conditions / Responsibilities',
        type: 'textarea',
        placeholder: 'Specific duties of Party A (Creator) and Party B (Other Party)...',
        required: true,
      },
      {
        id: 'handover_date',
        label: 'Execution / Handover Date',
        type: 'date',
        required: true,
      }
    ]
  }
];

export const KENYA_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Machakos', 'Uasin Gishu (Eldoret)',
  'Kisumu', 'Meru', 'Nyeri', 'Kilifi', 'Kajiado', 'Narok', 'Kakamega',
  'Bungoma', 'Kisii', 'Murang\'a', 'Embu', 'Kericho', 'Trans Nzoia (Kitale)',
  'Laikipia', 'Baringo', 'Nandi', 'Homa Bay', 'Migori', 'Kitui'
];
