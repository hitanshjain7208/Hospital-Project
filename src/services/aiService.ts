import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface MedicalImageAnalysisResult {
  possibleConditions: string[];
  severity: 'Mild' | 'Moderate' | 'Severe / Emergency';
  homeRemedies: string[];
  basicPrecautions: string[];
  recommendedSpecialization: string;
  emergencyWarningSigns: string[];
  disclaimer: string;
}

/**
 * Analyzes medical images (skin rashes, burns, cuts, swelling) using Gemini Vision or fallback intelligence.
 */
export async function analyzeMedicalImage(
  base64Image: string,
  userNotes?: string
): Promise<MedicalImageAnalysisResult> {
  const mandatoryDisclaimer =
    '⚠️ DISCLAIMER: This is AI-generated health information provided for educational triage only. It does NOT constitute a formal medical diagnosis, prescription, or clinical evaluation. In case of acute pain, bleeding, or emergency, seek immediate medical attention or visit the nearest ER.';

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Clean base64 header if present
      const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '');

      const prompt = `You are a clinical AI triage assistant for MedConnect AI platform.
Analyze this medical image provided by the user. User notes: "${userNotes || 'None'}".
Provide a JSON response with the following keys strictly formatted:
{
  "possibleConditions": ["Condition 1", "Condition 2"],
  "severity": "Mild" | "Moderate" | "Severe / Emergency",
  "homeRemedies": ["Remedy 1", "Remedy 2"],
  "basicPrecautions": ["Precaution 1", "Precaution 2"],
  "recommendedSpecialization": "Dermatology" | "Trauma" | "Orthopedics" | "General Medicine",
  "emergencyWarningSigns": ["Warning sign 1", "Warning sign 2"]
}
Ensure medical accuracy, clinical empathy, and high specificity. Output ONLY raw valid JSON.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: cleanBase64,
            mimeType: 'image/jpeg',
          },
        },
      ]);

      const responseText = result.response.text().trim();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          disclaimer: mandatoryDisclaimer,
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart heuristic triage engine:', err);
    }
  }

  // Fallback Triage Intelligence Engine (when API Key is not set or network fails)
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate AI processing pulse

  const lowerNotes = (userNotes || '').toLowerCase();
  if (lowerNotes.includes('burn') || lowerNotes.includes('fire') || lowerNotes.includes('scalding')) {
    return {
      possibleConditions: ['2nd Degree Thermal Burn', 'Superficial Epidermal Scald', 'Acute Contact Dermatitis'],
      severity: lowerNotes.includes('severe') ? 'Severe / Emergency' : 'Moderate',
      homeRemedies: ['Cool under running cold water for 15-20 minutes', 'Apply pure Aloe Vera gel or Silver Sulfadiazine cream', 'Cover loosely with sterile non-stick bandage'],
      basicPrecautions: ['Do NOT pop any fluid-filled blisters', 'Do NOT apply ice directly on open burns', 'Do NOT use butter, oil, or toothpaste'],
      recommendedSpecialization: 'Burns & Plastic Surgery',
      emergencyWarningSigns: ['Burn covers > 10% of body area', 'Burn involves face, hands, feet, or groin', 'White, charred, or numb skin texture'],
      disclaimer: mandatoryDisclaimer,
    };
  } else if (lowerNotes.includes('cut') || lowerNotes.includes('wound') || lowerNotes.includes('blood')) {
    return {
      possibleConditions: ['Superficial Laceration', 'Subcutaneous Tissue Cut', 'Localized Soft Tissue Trauma'],
      severity: 'Moderate',
      homeRemedies: ['Apply direct continuous pressure with a clean cloth for 5 minutes', 'Rinse wound under clean lukewarm water', 'Apply topical antiseptic ointment'],
      basicPrecautions: ['Elevate the injured limb above heart level', 'Keep wound clean and dry', 'Ensure tetanus booster is up to date (within 5 years)'],
      recommendedSpecialization: 'Trauma & Emergency Care',
      emergencyWarningSigns: ['Bleeding does not stop after 10 mins of firm pressure', 'Gaping wound edges needing stitches', 'Numbness or loss of sensation below the cut'],
      disclaimer: mandatoryDisclaimer,
    };
  } else if (lowerNotes.includes('swelling') || lowerNotes.includes('bone') || lowerNotes.includes('ankle') || lowerNotes.includes('pain')) {
    return {
      possibleConditions: ['Acute Joint Sprain / Ligament Strain', 'Hairline Bone Fracture', 'Localized Inflammatory Edema'],
      severity: 'Moderate',
      homeRemedies: ['R.I.C.E protocol (Rest, Ice pack for 15 mins, Compression bandage, Elevation)', 'Over-the-counter pain relief (Paracetamol) if recommended by doctor'],
      basicPrecautions: ['Avoid bearing heavy weight on affected joint', 'Do NOT massage aggressively'],
      recommendedSpecialization: 'Orthopedics',
      emergencyWarningSigns: ['Inability to bear any weight', 'Visible bone deformity or unnatural angle', 'Cold or blue discoloration in toes/fingers'],
      disclaimer: mandatoryDisclaimer,
    };
  }

  // Default General Skin / Infection Triage
  return {
    possibleConditions: ['Acute Allergic Dermatitis', 'Localized Erythema / Rash', 'Superficial Skin Infection'],
    severity: 'Mild',
    homeRemedies: ['Apply cold compress to relieve itching', 'Use mild non-scented moisturizer or Calamine lotion', 'Stay hydrated'],
    basicPrecautions: ['Avoid scratching or rubbing the lesion', 'Wear loose cotton clothing', 'Discontinue any new cosmetic or chemical products'],
    recommendedSpecialization: 'Dermatology',
    emergencyWarningSigns: ['Rapidly spreading redness with high fever', 'Facial swelling or difficulty breathing', 'Pus drainage with red streaks extending up the skin'],
    disclaimer: mandatoryDisclaimer,
  };
}

/**
 * Text Health Assistant powered by Gemini or heuristic medical triage.
 */
export async function askAIHealthAssistant(
  userQuery: string,
  history: { role: 'user' | 'model'; parts: string }[] = []
): Promise<{ text: string; department?: string; action?: string }> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are MedConnect AI's Virtual Medical & Hospital Assistant.
User question: "${userQuery}".
Provide a clear, helpful, empathetic response. 
Structure your answer with:
1. Direct response / medical information
2. Recommended doctor department if applicable
3. Key warning signs when to seek immediate emergency care
Always include a brief standard medical disclaimer at the end.`;

      const result = await model.generateContent(prompt);
      return { text: result.response.text() };
    } catch (err) {
      console.warn('Gemini chat failed, using offline medical response router:', err);
    }
  }

  // Offline Medical Knowledge Base Engine
  await new Promise((r) => setTimeout(r, 600));

  const q = userQuery.toLowerCase();

  if (q.includes('headache') || q.includes('migraine')) {
    return {
      text: `### 🤕 Managing Headaches & Migraines\n\n**Common Causes:** Tension, dehydration, eyestrain, lack of sleep, or migraine triggers.\n\n**Home Care Steps:**\n- Drink 2-3 glasses of water immediately.\n- Rest in a quiet, dark room.\n- Apply a warm compress (for tension headache) or ice pack (for migraine).\n\n**Recommended Specialist:** **Neurology** or **General Physician**.\n\n*⚠️ Warning Signs:* Sudden onset "thunderclap" headache, high fever, neck stiffness, or weakness on one side of the face requires **Emergency Neurology Care**.`,
      department: 'Neurology',
    };
  } else if (q.includes('fever') || q.includes('temperature') || q.includes('child')) {
    return {
      text: `### 🌡️ Managing Fever & High Temperature\n\n**General Guidelines:**\n- Stay well hydrated with water, electrolytes (ORS), or clear soups.\n- Keep room temperature comfortable and wear light clothing.\n- Tepid sponging with lukewarm water helps bring down body temperature.\n\n**Recommended Specialist:** **Pediatrics** (for children < 18) or **General Medicine**.\n\n*⚠️ Emergency Signs:* Fever > 103°F (39.4°C) lasting > 3 days, difficulty breathing, lethargy, or infant fever (< 3 months old).`,
      department: 'Pediatrics',
    };
  } else if (q.includes('chest pain') || q.includes('heart') || q.includes('blood pressure')) {
    return {
      text: `### 🫀 Chest Pain & Cardiac Evaluation\n\n**CRITICAL NOTICE:** Chest discomfort should NEVER be ignored.\n\n**Immediate Action Required:**\nIf you experience chest tightness, pressure radiating to the left jaw/arm, sweating, or shortness of breath, please click **EMERGENCY** at the top right immediately to locate the nearest Cardiology ER unit!\n\n**Recommended Specialist:** **Cardiology** / **Emergency Triage**.`,
      department: 'Cardiology',
      action: 'EMERGENCY',
    };
  } else if (q.includes('dengue') || q.includes('symptom')) {
    return {
      text: `### 🦟 Dengue Fever Symptoms & Information\n\n**Key Symptoms of Dengue:**\n1. Sudden high fever (104°F/40°C)\n2. Severe headache & pain behind the eyes\n3. Joint and muscle pain ("breakbone fever")\n4. Skin rash appearing 2-5 days after fever onset\n5. Nausea and vomiting\n\n**Key Precautions:** Keep hydrated with coconut water & ORS. Avoid NSAIDs like Ibuprofen/Aspirin (can worsen bleeding risks). Take Paracetamol only under medical advice.\n\n**Recommended Department:** **General Medicine** / **Pathology (Platelet Count Test)**.`,
      department: 'General Medicine',
    };
  } else if (q.includes('appointment') || q.includes('book') || q.includes('doctor')) {
    return {
      text: `### 🗓️ How to Book an Appointment on MedConnect AI\n\n1. Click **Hospitals** or **Doctors** in the top navigation bar.\n2. Filter by your preferred location, fees, distance, or specialization.\n3. Select your desired Doctor & time slot.\n4. Click **Confirm Appointment** (Logged-in patients get instant SMS/Email confirmation!).\n\nNeed help picking a doctor? Let me know your current symptoms!`,
    };
  }

  return {
    text: `### 🩺 MedConnect AI Health Assistant\n\nThank you for reaching out! Based on your query: **"${userQuery}"**, I recommend consulting a **General Physician** for a comprehensive health evaluation.\n\n- **Hydration & Rest:** Essential first steps for most non-acute symptoms.\n- **Search Hospitals:** You can use our global search bar above to filter doctors by location, rating, and fee.\n\n*This is automated health advice. For severe symptoms, please visit a hospital emergency department.*`,
    department: 'General Medicine',
  };
}
