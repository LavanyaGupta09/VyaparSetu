import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple translation resources for demo
const resources = {
  en: {
    translation: {
      "Overview": "Overview",
      "My Applications": "My Applications",
      "Approval Roadmap": "Approval Roadmap",
      "Documents": "Documents",
      "Compliance Calendar": "Compliance Calendar",
      "Schemes & Incentives": "Schemes & Incentives",
      "Mitra AI": "Mitra AI",
      "Ask Mitra AI...": "Ask Mitra AI...",
      "Good morning": "Good morning",
      "What should we help you accomplish today?": "What should we help you accomplish today?"
    }
  },
  hi: {
    translation: {
      "Overview": "अवलोकन",
      "My Applications": "मेरे आवेदन",
      "Approval Roadmap": "अनुमोदन रोडमैप",
      "Documents": "दस्तावेज़",
      "Compliance Calendar": "अनुपालन कैलेंडर",
      "Schemes & Incentives": "योजनाएं और प्रोत्साहन",
      "Mitra AI": "मित्र AI",
      "Ask Mitra AI...": "मित्र AI से पूछें...",
      "Good morning": "सुप्रभात",
      "What should we help you accomplish today?": "आज हम आपकी क्या मदद कर सकते हैं?"
    }
  },
  mr: {
    translation: {
      "Overview": "आढावा",
      "My Applications": "माझे अर्ज",
      "Approval Roadmap": "मंजुरी रोडमॅप",
      "Documents": "कागदपत्रे",
      "Compliance Calendar": "अनुपालन दिनदर्शिका",
      "Schemes & Incentives": "योजना आणि प्रोत्साहन",
      "Mitra AI": "मित्र AI",
      "Ask Mitra AI...": "मित्र AI ला विचारा...",
      "Good morning": "शुभ प्रभात",
      "What should we help you accomplish today?": "आज आम्ही तुम्हाला काय साध्य करण्यात मदत करावी?"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
