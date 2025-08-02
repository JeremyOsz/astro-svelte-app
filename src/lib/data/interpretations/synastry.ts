// Synastry aspect interpretations
import type { SynastryAspectInterpretation } from './types';

// Core synastry aspect interpretations (most commonly used)
export const SYNASTRY_ASPECT_INTERPRETATIONS: Record<string, SynastryAspectInterpretation> = {
    // SUN ASPECTS
    "Sun_Sun_Conjunction": {
        aspect: "Conjunction",
        person1Planet: "Sun",
        person2Planet: "Sun",
        interpretation: "A powerful soul connection! Your core identities resonate deeply, creating instant recognition and understanding. You share similar life purposes and approaches to self-expression. This aspect often indicates a strong karmic bond and mutual admiration.",
        compatibility: "harmonious",
        intensity: "strong",
        romance: "Soulmate potential! You have instant recognition and deep understanding of each other's core identity. This creates a powerful romantic connection with shared life purposes.",
        friendship: "Soul friendship! You have instant recognition and deep understanding of each other's core identity. This creates a powerful friendship with shared life purposes.",
        family: "Strong family bond! You have instant recognition and deep understanding of each other's core identity. This creates a powerful family connection with shared values.",
        business: "Perfect business partnership! You have instant recognition and deep understanding of each other's core identity. This creates a powerful business connection with shared goals."
    },
    "Sun_Sun_Opposition": {
        aspect: "Opposition",
        person1Planet: "Sun",
        person2Planet: "Sun",
        interpretation: "A dynamic relationship of opposites! Your core identities are in tension, creating both attraction and challenge. You complement each other perfectly but may struggle with ego conflicts. This aspect teaches balance and compromise.",
        compatibility: "challenging",
        intensity: "strong",
        romance: "Passionate opposites attract! You have strong chemistry but may struggle with ego conflicts. This creates intense attraction with learning opportunities about compromise.",
        friendship: "Complementary friendship! You balance each other perfectly but may have different perspectives. This creates dynamic friendships with growth opportunities.",
        family: "Balancing family dynamics! You complement each other but may have different approaches. This creates family relationships that teach compromise and understanding.",
        business: "Complementary business partnership! You balance each other's strengths and weaknesses. This creates dynamic partnerships with learning opportunities."
    },
    "Sun_Sun_Trine": {
        aspect: "Trine",
        person1Planet: "Sun",
        person2Planet: "Sun",
        interpretation: "Natural harmony between your core identities! You understand each other's essence effortlessly and support each other's personal growth. This creates a comfortable, supportive relationship with mutual respect.",
        compatibility: "harmonious",
        intensity: "moderate",
        romance: "Natural romantic harmony! You understand each other's essence effortlessly and support each other's growth. This creates comfortable, supportive romantic relationships.",
        friendship: "Natural friendship harmony! You understand each other's essence effortlessly and support each other's growth. This creates comfortable, supportive friendships.",
        family: "Natural family harmony! You understand each other's essence effortlessly and support each other's growth. This creates comfortable, supportive family relationships.",
        business: "Natural business harmony! You understand each other's essence effortlessly and support each other's growth. This creates comfortable, supportive business partnerships."
    },
    "Sun_Sun_Square": {
        aspect: "Square",
        person1Planet: "Sun",
        person2Planet: "Sun",
        interpretation: "Tension between your core identities creates growth opportunities. You may challenge each other's sense of self, leading to important personal development. This aspect requires conscious effort to understand different perspectives.",
        compatibility: "challenging",
        intensity: "moderate",
        romance: "Growth-oriented romance! You challenge each other's sense of self, leading to important personal development. This creates relationships that push you to grow.",
        friendship: "Growth-oriented friendship! You challenge each other's sense of self, leading to important personal development. This creates friendships that push you to grow.",
        family: "Growth-oriented family dynamics! You challenge each other's sense of self, leading to important personal development. This creates family relationships that push you to grow.",
        business: "Growth-oriented business partnership! You challenge each other's sense of self, leading to important personal development. This creates business partnerships that push you to grow."
    },
    "Sun_Sun_Sextile": {
        aspect: "Sextile",
        person1Planet: "Sun",
        person2Planet: "Sun",
        interpretation: "Easy rapport between your core identities! You naturally support each other's self-expression and personal goals. This creates a harmonious relationship with mutual encouragement and understanding.",
        compatibility: "harmonious",
        intensity: "weak",
        romance: "Easy romantic rapport! You naturally support each other's self-expression and personal goals. This creates harmonious romantic relationships with mutual encouragement.",
        friendship: "Easy friendship rapport! You naturally support each other's self-expression and personal goals. This creates harmonious friendships with mutual encouragement.",
        family: "Easy family rapport! You naturally support each other's self-expression and personal goals. This creates harmonious family relationships with mutual encouragement.",
        business: "Easy business rapport! You naturally support each other's self-expression and personal goals. This creates harmonious business partnerships with mutual encouragement."
    },

    // SUN-MOON ASPECTS (Most Important for Relationships)
    "Sun_Moon_Conjunction": {
        aspect: "Conjunction",
        person1Planet: "Sun",
        person2Planet: "Moon",
        interpretation: "The classic romantic aspect! Your ego and emotional needs are perfectly aligned. You naturally nurture each other's core identity and emotional well-being. This creates a deep sense of being 'at home' with each other.",
        compatibility: "harmonious",
        intensity: "strong",
        romance: "Exceptional romantic compatibility! This aspect creates deep emotional and spiritual connection, perfect for long-term romantic partnerships. You understand each other's core needs instinctively.",
        friendship: "Deep soul friendship! You have an intuitive understanding of each other's emotional and personal needs. This creates a friendship that feels like family.",
        family: "Natural family bond! This aspect indicates strong family compatibility and deep emotional understanding. You naturally support each other's growth and well-being.",
        business: "Excellent business partnership! Your personal and emotional approaches align perfectly, creating a harmonious working relationship with mutual understanding."
    },
    "Sun_Moon_Opposition": {
        aspect: "Opposition",
        person1Planet: "Sun",
        person2Planet: "Moon",
        interpretation: "Powerful attraction with complementary needs! Your ego and emotional styles balance each other perfectly. This creates a yin-yang dynamic where you complete each other, though it may require conscious effort to maintain harmony.",
        compatibility: "harmonious",
        intensity: "strong",
        romance: "Perfect romantic balance! Your ego and emotional styles complement each other perfectly. This creates a yin-yang dynamic where you complete each other romantically.",
        friendship: "Perfect friendship balance! Your ego and emotional styles complement each other perfectly. This creates a yin-yang dynamic where you complete each other as friends.",
        family: "Perfect family balance! Your ego and emotional styles complement each other perfectly. This creates a yin-yang dynamic where you complete each other as family.",
        business: "Perfect business balance! Your ego and emotional styles complement each other perfectly. This creates a yin-yang dynamic where you complete each other professionally."
    },
    "Sun_Moon_Trine": {
        aspect: "Trine",
        person1Planet: "Sun",
        person2Planet: "Moon",
        interpretation: "Natural emotional harmony! Your core identity and emotional nature work together beautifully. You understand each other's needs instinctively and create a supportive, nurturing environment.",
        compatibility: "harmonious",
        intensity: "moderate",
        romance: "Natural romantic harmony! Your core identity and emotional nature work together beautifully. You understand each other's needs instinctively in romance.",
        friendship: "Natural friendship harmony! Your core identity and emotional nature work together beautifully. You understand each other's needs instinctively in friendship.",
        family: "Natural family harmony! Your core identity and emotional nature work together beautifully. You understand each other's needs instinctively in family relationships.",
        business: "Natural business harmony! Your core identity and emotional nature work together beautifully. You understand each other's needs instinctively in business partnerships."
    },
    "Sun_Moon_Square": {
        aspect: "Square",
        person1Planet: "Sun",
        person2Planet: "Moon",
        interpretation: "Tension between ego and emotional needs creates growth potential. You may struggle to understand each other's core motivations, but this challenge leads to important personal development and deeper understanding.",
        compatibility: "challenging",
        intensity: "moderate",
        romance: "Growth-oriented romantic tension! You may struggle to understand each other's core motivations, but this challenge leads to important personal development in romance.",
        friendship: "Growth-oriented friendship tension! You may struggle to understand each other's core motivations, but this challenge leads to important personal development in friendship.",
        family: "Growth-oriented family tension! You may struggle to understand each other's core motivations, but this challenge leads to important personal development in family relationships.",
        business: "Growth-oriented business tension! You may struggle to understand each other's core motivations, but this challenge leads to important personal development in business partnerships."
    },
    "Sun_Moon_Sextile": {
        aspect: "Sextile",
        person1Planet: "Sun",
        person2Planet: "Moon",
        interpretation: "Easy emotional rapport! Your core identity and emotional nature complement each other well. You naturally support each other's self-expression and emotional needs.",
        compatibility: "harmonious",
        intensity: "weak",
        romance: "Easy romantic rapport! Your core identity and emotional nature complement each other well. You naturally support each other's self-expression in romance.",
        friendship: "Easy friendship rapport! Your core identity and emotional nature complement each other well. You naturally support each other's self-expression in friendship.",
        family: "Easy family rapport! Your core identity and emotional nature complement each other well. You naturally support each other's self-expression in family relationships.",
        business: "Easy business rapport! Your core identity and emotional nature complement each other well. You naturally support each other's self-expression in business partnerships."
    },

    // VENUS-MARS ASPECTS (Romantic Chemistry)
    "Venus_Mars_Conjunction": {
        aspect: "Conjunction",
        person1Planet: "Venus",
        person2Planet: "Mars",
        interpretation: "Intense romantic and sexual chemistry! Your love nature and action style are perfectly matched. This creates powerful attraction and a natural flow between romance and passion. Physical and emotional desires align beautifully.",
        compatibility: "harmonious",
        intensity: "strong",
        romance: "Explosive romantic chemistry! This aspect creates intense physical and emotional attraction, perfect for passionate romantic relationships. Your love and action styles are perfectly synchronized.",
        friendship: "Dynamic friendship energy! You have natural chemistry and enjoy doing things together. This creates an active, engaging friendship with lots of shared activities.",
        family: "Harmonious family dynamics! Your values and actions align well, creating supportive family relationships with mutual understanding of each other's needs.",
        business: "Productive business collaboration! Your values and action styles work together effectively, creating successful partnerships with aligned goals and approaches."
    },
    "Venus_Mars_Opposition": {
        aspect: "Opposition",
        person1Planet: "Venus",
        person2Planet: "Mars",
        interpretation: "Intense attraction with underlying tension! Your love and action styles are in opposition, creating magnetic pull but also potential conflicts. This aspect often indicates a passionate but volatile relationship that requires conscious effort.",
        compatibility: "challenging",
        intensity: "strong",
        romance: "Passionate romantic tension! Your love and action styles create magnetic pull but also potential conflicts. This creates passionate but volatile romantic relationships.",
        friendship: "Dynamic friendship tension! Your values and action styles create magnetic pull but also potential conflicts. This creates dynamic but challenging friendships.",
        family: "Intense family dynamics! Your values and action styles create magnetic pull but also potential conflicts. This creates intense but challenging family relationships.",
        business: "Dynamic business tension! Your values and action styles create magnetic pull but also potential conflicts. This creates dynamic but challenging business partnerships."
    },
    "Venus_Mars_Trine": {
        aspect: "Trine",
        person1Planet: "Venus",
        person2Planet: "Mars",
        interpretation: "Natural romantic harmony! Your love and action styles work together beautifully. This creates a balanced relationship with healthy passion and mutual understanding of romantic needs.",
        compatibility: "harmonious",
        intensity: "moderate",
        romance: "Natural romantic harmony! Your love and action styles work together beautifully. This creates balanced romantic relationships with healthy passion.",
        friendship: "Natural friendship harmony! Your values and action styles work together beautifully. This creates balanced friendships with healthy energy.",
        family: "Natural family harmony! Your values and action styles work together beautifully. This creates balanced family relationships with healthy dynamics.",
        business: "Natural business harmony! Your values and action styles work together beautifully. This creates balanced business partnerships with healthy collaboration."
    },
    "Venus_Mars_Square": {
        aspect: "Square",
        person1Planet: "Venus",
        person2Planet: "Mars",
        interpretation: "Passionate but challenging romantic dynamics! Your love and action styles may clash, creating intense attraction mixed with conflicts. This aspect requires conscious effort to balance romance and passion.",
        compatibility: "challenging",
        intensity: "moderate",
        romance: "Passionate but challenging romance! Your love and action styles may clash, creating intense attraction mixed with conflicts. This requires conscious effort to balance romance and passion.",
        friendship: "Dynamic but challenging friendship! Your values and action styles may clash, creating intense energy mixed with conflicts. This requires conscious effort to balance values and action.",
        family: "Intense but challenging family dynamics! Your values and action styles may clash, creating intense energy mixed with conflicts. This requires conscious effort to balance values and action.",
        business: "Dynamic but challenging business partnership! Your values and action styles may clash, creating intense energy mixed with conflicts. This requires conscious effort to balance values and action."
    },
    "Venus_Mars_Sextile": {
        aspect: "Sextile",
        person1Planet: "Venus",
        person2Planet: "Mars",
        interpretation: "Easy romantic rapport! Your love and action styles complement each other well. This creates a harmonious relationship with natural chemistry and mutual understanding of romantic needs.",
        compatibility: "harmonious",
        intensity: "weak",
        romance: "Easy romantic rapport! Your love and action styles complement each other well. This creates harmonious romantic relationships with natural chemistry.",
        friendship: "Easy friendship rapport! Your values and action styles complement each other well. This creates harmonious friendships with natural energy.",
        family: "Easy family rapport! Your values and action styles complement each other well. This creates harmonious family relationships with natural dynamics.",
        business: "Easy business rapport! Your values and action styles complement each other well. This creates harmonious business partnerships with natural collaboration."
    },

    // MERCURY ASPECTS (Communication)
    "Mercury_Mercury_Conjunction": {
        aspect: "Conjunction",
        person1Planet: "Mercury",
        person2Planet: "Mercury",
        interpretation: "Mental connection at its strongest! You think alike and communicate with perfect understanding. This creates intellectual harmony and shared mental interests. Your conversations flow naturally and you understand each other's thoughts instantly.",
        compatibility: "harmonious",
        intensity: "strong",
        romance: "Intellectual romance! You have perfect mental compatibility and can communicate about anything. This creates a relationship with excellent communication and shared intellectual interests.",
        friendship: "Best friend material! You think alike and have natural intellectual rapport. This creates friendships with excellent communication and shared mental interests.",
        family: "Strong family communication! You have natural understanding and can communicate effectively about family matters. This creates harmonious family relationships.",
        business: "Perfect business communication! You think alike and can work together seamlessly. This creates highly effective business partnerships with excellent communication."
    },
    "Mercury_Mercury_Opposition": {
        aspect: "Opposition",
        person1Planet: "Mercury",
        person2Planet: "Mercury",
        interpretation: "Complementary thinking styles! Your mental approaches balance each other perfectly. You may have different perspectives but can learn greatly from each other's viewpoints. This creates intellectual growth through dialogue.",
        compatibility: "harmonious",
        intensity: "moderate",
        romance: "Complementary romantic thinking! Your mental approaches balance each other perfectly. You may have different perspectives but can learn greatly from each other's viewpoints in romance.",
        friendship: "Complementary friendship thinking! Your mental approaches balance each other perfectly. You may have different perspectives but can learn greatly from each other's viewpoints in friendship.",
        family: "Complementary family thinking! Your mental approaches balance each other perfectly. You may have different perspectives but can learn greatly from each other's viewpoints in family relationships.",
        business: "Complementary business thinking! Your mental approaches balance each other perfectly. You may have different perspectives but can learn greatly from each other's viewpoints in business partnerships."
    },
    "Mercury_Mercury_Trine": {
        aspect: "Trine",
        person1Planet: "Mercury",
        person2Planet: "Mercury",
        interpretation: "Natural intellectual harmony! Your thinking styles work together beautifully. You communicate easily and share similar mental interests. This creates a relationship with excellent mental rapport and mutual understanding.",
        compatibility: "harmonious",
        intensity: "moderate",
        romance: "Natural romantic intellectual harmony! Your thinking styles work together beautifully. You communicate easily and share similar mental interests in romance.",
        friendship: "Natural friendship intellectual harmony! Your thinking styles work together beautifully. You communicate easily and share similar mental interests in friendship.",
        family: "Natural family intellectual harmony! Your thinking styles work together beautifully. You communicate easily and share similar mental interests in family relationships.",
        business: "Natural business intellectual harmony! Your thinking styles work together beautifully. You communicate easily and share similar mental interests in business partnerships."
    },
    "Mercury_Mercury_Square": {
        aspect: "Square",
        person1Planet: "Mercury",
        person2Planet: "Mercury",
        interpretation: "Mental tension creates growth opportunities! Your thinking styles may clash, leading to misunderstandings but also important intellectual growth. This aspect requires conscious effort to understand different communication styles.",
        compatibility: "challenging",
        intensity: "moderate",
        romance: "Growth-oriented mental tension! Your thinking styles may clash, leading to misunderstandings but also important intellectual growth in romance.",
        friendship: "Growth-oriented friendship mental tension! Your thinking styles may clash, leading to misunderstandings but also important intellectual growth in friendship.",
        family: "Growth-oriented family mental tension! Your thinking styles may clash, leading to misunderstandings but also important intellectual growth in family relationships.",
        business: "Growth-oriented business mental tension! Your thinking styles may clash, leading to misunderstandings but also important intellectual growth in business partnerships."
    },
    "Mercury_Mercury_Sextile": {
        aspect: "Sextile",
        person1Planet: "Mercury",
        person2Planet: "Mercury",
        interpretation: "Easy mental rapport! Your thinking styles complement each other well. You communicate naturally and can easily understand each other's perspectives. This creates harmonious intellectual relationships.",
        compatibility: "harmonious",
        intensity: "weak",
        romance: "Easy romantic mental rapport! Your thinking styles complement each other well. You communicate naturally and can easily understand each other's perspectives in romance.",
        friendship: "Easy friendship mental rapport! Your thinking styles complement each other well. You communicate naturally and can easily understand each other's perspectives in friendship.",
        family: "Easy family mental rapport! Your thinking styles complement each other well. You communicate naturally and can easily understand each other's perspectives in family relationships.",
        business: "Easy business mental rapport! Your thinking styles complement each other well. You communicate naturally and can easily understand each other's perspectives in business partnerships."
    }
}; 