// Planet interpretations and planet-in-sign data
import type { PlanetInterpretation, PlanetInSignInterpretations } from './types';

// Planet interpretations
export const PLANET_INTERPRETATIONS: Record<string, PlanetInterpretation> = {
    "Sun": {
        "description": "Core identity, ego, life purpose, father, authority figures, creative expression. The Sun represents your core identity, ego, and life purpose. It shows how you express your fundamental self and what drives you at the deepest level. The Sun is associated with the father figure and represents your conscious mind and willpower.",
        "keywords": ["Identity", "Ego", "Purpose", "Father", "Authority", "Creativity", "Leadership", "Vitality", "Self-expression", "Life direction", "Personal power"]
    },
    "Moon": {
        "description": "Emotions, intuition, mother, home, family, subconscious, nurturing, emotional needs. The Moon represents your emotional nature, intuition, and subconscious mind. It shows how you process feelings, your need for security, and your relationship with the mother figure. The Moon governs your inner world and emotional responses.",
        "keywords": ["Emotions", "Intuition", "Mother", "Home", "Family", "Subconscious", "Nurturing", "Security", "Emotional security", "Maternal instincts", "Emotional patterns"]
    },
    "Mercury": {
        "description": "Communication, thinking, learning, siblings, short trips, technology, nervous system. Mercury represents your communication style, thinking patterns, and how you process information. It governs learning, short trips, and your relationship with siblings. Mercury shows how you express ideas and connect with others mentally.",
        "keywords": ["Communication", "Thinking", "Learning", "Siblings", "Travel", "Technology", "Intellect", "Curiosity", "Intellectual pursuits", "Adaptability", "Mental agility"]
    },
    "Venus": {
        "description": "Love, beauty, relationships, art, values, harmony, pleasure, social grace. Venus represents your approach to love, beauty, and what you value. It governs relationships, artistic expression, and your sense of aesthetics. Venus shows how you attract and relate to others, and what brings you pleasure and satisfaction.",
        "keywords": ["Love", "Beauty", "Relationships", "Art", "Values", "Harmony", "Pleasure", "Grace", "Romance", "Artistic expression", "Aesthetics"]
    },
    "Mars": {
        "description": "Action, energy, aggression, courage, sexuality, competition, drive, physical energy. Mars represents your energy, drive, and how you take action. It governs your courage, sexuality, and competitive nature. Mars shows how you assert yourself, pursue goals, and handle conflict or challenges.",
        "keywords": ["Action", "Energy", "Aggression", "Courage", "Sexuality", "Competition", "Drive", "Strength", "Physical energy", "Protection", "Leadership"]
    },
    "Jupiter": {
        "description": "Expansion, wisdom, philosophy, higher education, travel, optimism, generosity, faith. Jupiter represents your quest for meaning, wisdom, and expansion. It governs higher education, long-distance travel, and your philosophical outlook. Jupiter shows how you grow, learn, and find meaning in life.",
        "keywords": ["Expansion", "Wisdom", "Philosophy", "Education", "Travel", "Optimism", "Generosity", "Faith", "Growth", "Abundance", "Higher learning"]
    },
    "Saturn": {
        "description": "Discipline, responsibility, limitations, structure, authority, time, karma, lessons. Saturn represents your sense of responsibility, discipline, and the lessons you must learn. It governs structure, limitations, and your relationship with authority. Saturn shows how you build lasting foundations and face challenges.",
        "keywords": ["Discipline", "Responsibility", "Limitations", "Structure", "Authority", "Time", "Karma", "Lessons", "Patience", "Endurance", "Wisdom through experience"]
    },
    "Uranus": {
        "description": "Innovation, rebellion, independence, sudden change, technology, originality, freedom. Uranus represents your need for freedom, innovation, and breaking from tradition. It governs sudden changes, technological advancement, and revolutionary thinking. Uranus shows how you express your unique individuality.",
        "keywords": ["Innovation", "Rebellion", "Independence", "Change", "Technology", "Originality", "Freedom", "Revolution", "Unconventional", "Awakening", "Progressive thinking"]
    },
    "Neptune": {
        "description": "Spirituality, dreams, illusions, compassion, intuition, transcendence, sacrifice. Neptune represents your spiritual nature, dreams, and connection to the divine. It governs intuition, compassion, and the dissolution of boundaries. Neptune shows how you connect with higher consciousness and universal love.",
        "keywords": ["Spirituality", "Dreams", "Illusions", "Compassion", "Intuition", "Transcendence", "Sacrifice", "Mysticism", "Artistic inspiration", "Universal love", "Dissolution"]
    },
    "Pluto": {
        "description": "Transformation, power, death, rebirth, psychology, control, intensity, regeneration. Pluto represents deep transformation, power dynamics, and psychological evolution. It governs death and rebirth, control issues, and profound change. Pluto shows how you handle power and undergo deep personal transformation.",
        "keywords": ["Transformation", "Power", "Death", "Rebirth", "Psychology", "Control", "Intensity", "Regeneration", "Deep change", "Hidden truths", "Evolution"]
    },
    "Node": {
        "description": "Life purpose, destiny, soul evolution, karmic lessons, spiritual growth, future direction. The Nodes represent your soul's journey and karmic path. The North Node shows where you're heading, while the South Node shows what you're leaving behind. They indicate your life purpose and spiritual evolution.",
        "keywords": ["Life purpose", "Destiny", "Soul evolution", "Karma", "Spiritual growth", "Future", "Past", "Direction", "Evolution", "Soul lessons", "Path"]
    },
    "Lilith": {
        "description": "Wild nature, primal instincts, sexuality, independence, rebellion, feminine power. Lilith represents your wild, untamed nature and primal instincts. It governs sexuality, independence, and the shadow side of femininity. Lilith shows how you express your authentic, unfiltered self.",
        "keywords": ["Wild nature", "Primal instincts", "Sexuality", "Independence", "Rebellion", "Feminine power", "Authenticity", "Shadow", "Untamed", "Freedom", "Raw energy"]
    },
    "Chiron": {
        "description": "Wounding, healing, wisdom, mentorship, vulnerability, transformation, service. Chiron represents your deepest wounds and your capacity to heal others through those wounds. It governs mentorship, vulnerability, and the integration of pain into wisdom. Chiron shows how you transform suffering into healing.",
        "keywords": ["Wounding", "Healing", "Wisdom", "Mentorship", "Vulnerability", "Transformation", "Service", "Integration", "Pain", "Compassion", "Teaching"]
    },
    "Fortune": {
        "description": "Luck, fortune, success, opportunities, material well-being, life path. The Part of Fortune represents your path to happiness and material success. It shows where you find joy and how you can achieve prosperity. Fortune indicates your natural talents and the areas where you can find fulfillment.",
        "keywords": ["Luck", "Fortune", "Success", "Opportunities", "Material well-being", "Life path", "Happiness", "Prosperity", "Talents", "Fulfillment", "Joy"]
    },
    "Vertex": {
        "description": "Fate, destiny, significant encounters, karmic relationships, life-changing events. The Vertex represents fated encounters and significant relationships that change your life. It shows where destiny intervenes and where you meet people who profoundly impact your journey. Vertex indicates karmic connections.",
        "keywords": ["Fate", "Destiny", "Encounters", "Karmic relationships", "Life-changing events", "Significant meetings", "Fated connections", "Transformation", "Soul contracts", "Divine timing", "Karma"]
    }
};

// Planet in sign interpretations
export const PLANET_IN_SIGN_INTERPRETATIONS: PlanetInSignInterpretations = {
    "Sun": {
        "Aries": "With the Sun in Aries, your core identity is assertive, pioneering, and courageous. You are driven by a need to initiate and lead, and you approach life with enthusiasm and directness. You are independent and competitive, but can sometimes be impulsive or impatient.",
        "Taurus": "With the Sun in Taurus, your core identity is grounded, stable, and sensual. You seek security and comfort, and you are known for your patience, determination, and loyalty. You have a deep appreciation for beauty and the material world, but can be stubborn and resistant to change.",
        "Gemini": "With the Sun in Gemini, your core identity is curious, communicative, and adaptable. You are a natural-born learner and social connector, driven by a desire for variety and mental stimulation. You are witty and versatile, but can sometimes be scattered or inconsistent.",
        "Cancer": "With the Sun in Cancer, your core identity is nurturing, sensitive, and protective. You are deeply connected to your emotions, family, and home. You are compassionate and intuitive, but can be moody or defensive when you feel insecure.",
        "Leo": "With the Sun in Leo, your core identity is confident, creative, and generous. You are a natural leader with a flair for the dramatic, and you thrive in the spotlight. You are warm-hearted and loyal, but can be proud or attention-seeking.",
        "Virgo": "With the Sun in Virgo, your core identity is practical, analytical, and service-oriented. You have a keen eye for detail and a desire to be helpful and efficient. You are diligent and methodical, but can be overly critical of yourself and others.",
        "Libra": "With the Sun in Libra, your core identity is focused on harmony, justice, and relationships. You are a natural diplomat, driven by a need for balance and fairness. You are charming and sociable, but can be indecisive or people-pleasing.",
        "Scorpio": "With the Sun in Scorpio, your core identity is intense, passionate, and perceptive. You are drawn to the deeper mysteries of life and have a powerful, transformative presence. You are loyal and resourceful, but can be secretive or controlling.",
        "Sagittarius": "With the Sun in Sagittarius, your core identity is optimistic, adventurous, and philosophical. You are a truth-seeker, driven by a desire for freedom and expansion. You are open-minded and enthusiastic, but can be blunt or restless.",
        "Capricorn": "With the Sun in Capricorn, your core identity is disciplined, ambitious, and responsible. You are a natural strategist, driven by a need for achievement and long-term security. You are patient and determined, but can be pessimistic or overly conventional.",
        "Aquarius": "With the Sun in Aquarius, your core identity is innovative, independent, and humanitarian. You are a forward-thinker, driven by a desire for social progress and intellectual freedom. You are original and idealistic, but can be emotionally detached or rebellious.",
        "Pisces": "With the Sun in Pisces, your core identity is compassionate, intuitive, and artistic. You are deeply connected to the spiritual and emotional realms, and you are a natural dreamer. You are empathetic and imaginative, but can be escapist or easily overwhelmed."
    },
    "Moon": {
        "Aries": "With the Moon in Aries, your emotional responses are quick, direct, and passionate. You need excitement and independence to feel secure, and you are not afraid to take emotional risks. You can be impulsive and have a quick temper.",
        "Taurus": "With the Moon in Taurus, your emotional nature is calm, stable, and seeks security. You find comfort in the familiar, and you need physical and material stability to feel emotionally content. You are loyal but can be possessive.",
        "Gemini": "With the Moon in Gemini, your emotions are processed intellectually and expressed verbally. You need variety and mental stimulation to feel emotionally satisfied, and you enjoy talking about your feelings. You can seem emotionally detached at times.",
        "Cancer": "With the Moon in Cancer, its natural home, your emotions are deep, powerful, and intuitive. You are highly sensitive and need a strong sense of emotional security, often found through home and family. You are nurturing and protective.",
        "Leo": "With the Moon in Leo, your emotional expression is dramatic, warm, and generous. You need to feel appreciated and admired to be emotionally happy, and you are loyal and affectionate with loved ones. You can be proud and have a need for attention.",
        "Virgo": "With the Moon in Virgo, your emotional nature is practical, analytical, and reserved. You show care through acts of service and by being helpful. You need order and routine to feel emotionally secure, and can be self-critical.",
        "Libra": "With the Moon in Libra, you have a strong need for harmony and balance in your emotional life and relationships. You are a natural peacemaker and feel most secure when in a partnership. You may avoid conflict to maintain peace.",
        "Scorpio": "With the Moon in Scorpio, your emotions are intense, passionate, and secretive. You form deep emotional bonds and have a powerful need for emotional honesty. You can be prone to jealousy and have a fear of betrayal.",
        "Sagittarius": "With the Moon in Sagittarius, your emotional nature is optimistic, freedom-loving, and adventurous. You need space and new experiences to feel emotionally fulfilled. You are good-humored but can be uncomfortable with deep emotional displays.",
        "Capricorn": "With the Moon in Capricorn, your emotional responses are disciplined, controlled, and serious. You seek security through achievement and responsibility. You may have difficulty expressing your feelings openly and can appear emotionally reserved.",
        "Aquarius": "With the Moon in Aquarius, your emotional nature is detached, independent, and humanitarian. You are more comfortable with group feelings than with personal ones. You need intellectual freedom and may seem aloof or emotionally unavailable.",
        "Pisces": "With the Moon in Pisces, you are highly sensitive, compassionate, and intuitive. Your emotional boundaries can be blurry, making you empathetic but also easily influenced by the moods of others. You have a rich inner world."
    },
    "Mercury": {
        "Aries": "With Mercury in Aries, your communication style is direct, quick, and sometimes impulsive. You are a fast thinker and a decisive speaker, often eager to share new ideas. You can be assertive in your opinions, but may also be prone to interrupting or being blunt.",
        "Taurus": "With Mercury in Taurus, your communication is thoughtful, steady, and practical. You take your time to process information and form opinions, and once you do, you are quite fixed in your views. You express yourself clearly and prefer concrete facts.",
        "Gemini": "With Mercury in Gemini, your communication is highly versatile, curious, and quick-witted. You love to learn, gather information, and engage in diverse conversations. You are adaptable in your thinking but can sometimes be scattered or superficial.",
        "Cancer": "With Mercury in Cancer, your communication is emotionally driven, intuitive, and sensitive. You process information through your feelings and tend to communicate with warmth and empathy. You may be hesitant to express yourself directly if you feel insecure.",
        "Leo": "With Mercury in Leo, your communication is expressive, confident, and dramatic. You enjoy being heard and can be quite persuasive and entertaining in your speech. You are proud of your ideas and love to inspire others.",
        "Virgo": "With Mercury in Virgo, your communication is analytical, precise, and practical. You have a sharp eye for detail and a logical approach to problem-solving. You are an effective communicator who values clarity and accuracy, but can be overly critical.",
        "Libra": "With Mercury in Libra, your communication is diplomatic, fair, and charming. You strive for balance and harmony in your interactions, often weighing all sides of an issue. You are a good listener and seek consensus, but can be indecisive.",
        "Scorpio": "With Mercury in Scorpio, your communication is intense, penetrating, and perceptive. You are drawn to hidden meanings and can uncover truths others miss. You are a powerful speaker and can be secretive or strategic in your words.",
        "Sagittarius": "With Mercury in Sagittarius, your communication is broad-minded, optimistic, and philosophical. You love to explore big ideas and share your beliefs with enthusiasm. You can be blunt or tactless in your honesty, but your intentions are usually good.",
        "Capricorn": "With Mercury in Capricorn, your communication is disciplined, logical, and practical. You have a serious and methodical approach to thinking and speaking, valuing structure and efficiency. You are a clear and authoritative communicator.",
        "Aquarius": "With Mercury in Aquarius, your communication is innovative, intellectual, and independent. You enjoy discussing abstract concepts and challenging conventional thinking. You are original in your ideas but can sometimes be detached or dogmatic.",
        "Pisces": "With Mercury in Pisces, your communication is intuitive, imaginative, and empathetic. You process information through your feelings and impressions, often expressing yourself through creative means. You can be vague or elusive, but deeply compassionate."
    },
    "Venus": {
        "Aries": "With Venus in Aries, you express love and affection in a direct, passionate, and spontaneous way. You are attracted to excitement and often initiate romantic pursuits. You can be impulsive in relationships and value independence.",
        "Taurus": "With Venus in Taurus, you express love and affection in a sensual, loyal, and stable manner. You seek comfort, security, and beauty in your relationships. You are deeply affectionate and value material pleasures and fidelity.",
        "Gemini": "With Venus in Gemini, you express love and affection through communication, intellect, and variety. You are attracted to witty and mentally stimulating partners. You enjoy playful banter and need mental connection in relationships.",
        "Cancer": "With Venus in Cancer, you express love and affection in a nurturing, sensitive, and protective way. You seek emotional security and deep connection in your relationships, often forming strong bonds with family and home. You are highly empathetic.",
        "Leo": "With Venus in Leo, you express love and affection in a dramatic, generous, and warm-hearted manner. You love to be admired and show your affection grandly. You seek passion and loyalty, and enjoy being the center of attention in relationships.",
        "Virgo": "With Venus in Virgo, you express love and affection through acts of service, practicality, and attention to detail. You show care by being helpful and reliable. You are attracted to intelligence and efficiency, but can be critical of yourself and others in love.",
        "Libra": "With Venus in Libra, its natural home, you express love and affection in a harmonious, diplomatic, and aesthetically pleasing way. You thrive in partnerships and seek balance and fairness in all relationships. You are charming and seek equality.",
        "Scorpio": "With Venus in Scorpio, you express love and affection with intensity, passion, and deep emotional connection. You seek transformative relationships and are drawn to mystery and depth. You are loyal and possessive, with a need for emotional honesty.",
        "Sagittarius": "With Venus in Sagittarius, you express love and affection with optimism, adventure, and freedom. You are attracted to partners who share your love of exploration and growth. You value honesty and need space in relationships.",
        "Capricorn": "With Venus in Capricorn, you express love and affection in a serious, loyal, and practical manner. You seek stability and long-term commitment in relationships. You show love through reliability and building a secure future together.",
        "Aquarius": "With Venus in Aquarius, you express love and affection with independence, originality, and intellectual connection. You are attracted to unique individuals and value friendship in romance. You need freedom and may seem emotionally detached.",
        "Pisces": "With Venus in Pisces, you express love and affection with compassion, idealism, and spiritual connection. You are deeply romantic and seek soul-level relationships. You are empathetic and may idealize your partners."
    },
    "Mars": {
        "Aries": "With Mars in Aries, its natural home, your energy is direct, impulsive, and courageous. You are a natural leader who takes immediate action and thrives on competition. You can be impatient and sometimes aggressive, but you're always ready for a challenge.",
        "Taurus": "With Mars in Taurus, your energy is steady, determined, and patient. You work methodically toward your goals and have great endurance. You can be stubborn and possessive, but you're reliable and persistent in pursuing what you want.",
        "Gemini": "With Mars in Gemini, your energy is versatile, quick, and mentally focused. You express your drive through communication and intellectual pursuits. You can be scattered or easily distracted, but you're adaptable and quick to respond to new ideas.",
        "Cancer": "With Mars in Cancer, your energy is emotionally driven, protective, and intuitive. You fight for what you care about and are motivated by emotional security. You can be moody or defensive, but you're fiercely loyal to loved ones.",
        "Leo": "With Mars in Leo, your energy is dramatic, confident, and generous. You express your drive with flair and love to be admired for your efforts. You can be proud or attention-seeking, but you're inspiring and passionate about your goals.",
        "Virgo": "With Mars in Virgo, your energy is precise, efficient, and service-oriented. You work systematically and pay attention to details. You can be overly critical or perfectionist, but you're highly effective and reliable.",
        "Libra": "With Mars in Libra, your energy is diplomatic, cooperative, and relationship-focused. You prefer to work with others and seek harmony in your actions. You can be indecisive or conflict-avoidant, but you're fair and considerate.",
        "Scorpio": "With Mars in Scorpio, your energy is intense, focused, and transformative. You pursue your goals with deep determination and can be very strategic. You can be secretive or controlling, but you're powerful and resourceful.",
        "Sagittarius": "With Mars in Sagittarius, your energy is adventurous, optimistic, and freedom-loving. You're motivated by exploration and big ideas. You can be impulsive or tactless, but you're enthusiastic and inspiring.",
        "Capricorn": "With Mars in Capricorn, your energy is disciplined, ambitious, and practical. You work hard toward long-term goals and value achievement. You can be overly serious or rigid, but you're reliable and persistent.",
        "Aquarius": "With Mars in Aquarius, your energy is innovative, independent, and humanitarian. You're motivated by social causes and original ideas. You can be rebellious or detached, but you're progressive and visionary.",
        "Pisces": "With Mars in Pisces, your energy is intuitive, compassionate, and spiritually focused. You're motivated by ideals and may fight for causes you believe in. You can be escapist or easily influenced, but you're deeply empathetic."
    },
    "Jupiter": {
        "Aries": "With Jupiter in Aries, your wisdom and growth come through bold action and leadership. You learn through taking initiative and exploring new territories. You're optimistic and enthusiastic, but can be impulsive in your beliefs.",
        "Taurus": "With Jupiter in Taurus, your wisdom and growth come through practical experience and material security. You learn through building and creating tangible results. You're generous with resources, but can be stubborn in your beliefs.",
        "Gemini": "With Jupiter in Gemini, your wisdom and growth come through communication and intellectual exploration. You learn through gathering information and sharing knowledge. You're curious and adaptable, but can be scattered in your pursuits.",
        "Cancer": "With Jupiter in Cancer, your wisdom and growth come through emotional understanding and nurturing. You learn through caring for others and building emotional security. You're compassionate and protective, but can be overly emotional.",
        "Leo": "With Jupiter in Leo, your wisdom and growth come through creative expression and leadership. You learn through inspiring others and following your heart. You're generous and optimistic, but can be overly dramatic.",
        "Virgo": "With Jupiter in Virgo, your wisdom and growth come through service and attention to detail. You learn through helping others and perfecting your skills. You're practical and helpful, but can be overly critical.",
        "Libra": "With Jupiter in Libra, your wisdom and growth come through relationships and diplomacy. You learn through partnerships and seeking balance. You're fair and cooperative, but can be indecisive.",
        "Scorpio": "With Jupiter in Scorpio, your wisdom and growth come through deep transformation and psychological insight. You learn through uncovering hidden truths and intense experiences. You're perceptive and powerful, but can be secretive.",
        "Sagittarius": "With Jupiter in Sagittarius, its natural home, your wisdom and growth come through exploration and philosophy. You learn through travel and seeking higher knowledge. You're optimistic and adventurous, but can be overly idealistic.",
        "Capricorn": "With Jupiter in Capricorn, your wisdom and growth come through discipline and achievement. You learn through hard work and building lasting structures. You're responsible and ambitious, but can be overly serious.",
        "Aquarius": "With Jupiter in Aquarius, your wisdom and growth come through innovation and humanitarian causes. You learn through challenging conventions and helping humanity. You're progressive and original, but can be detached.",
        "Pisces": "With Jupiter in Pisces, your wisdom and growth come through spiritual understanding and compassion. You learn through intuition and universal love. You're empathetic and idealistic, but can be escapist."
    },
    "Saturn": {
        "Aries": "With Saturn in Aries, your lessons come through learning patience and discipline in action. You must learn to control your impulses and develop lasting leadership skills. You may struggle with anger or impatience, but you're learning to be more strategic.",
        "Taurus": "With Saturn in Taurus, your lessons come through building material security and developing patience. You must learn to work steadily toward long-term goals. You may struggle with stubbornness, but you're learning to be more flexible.",
        "Gemini": "With Saturn in Gemini, your lessons come through developing clear communication and focused thinking. You must learn to be more disciplined in your intellectual pursuits. You may struggle with scattered thinking, but you're learning to be more organized.",
        "Cancer": "With Saturn in Cancer, your lessons come through developing emotional maturity and security. You must learn to balance emotional needs with responsibilities. You may struggle with moodiness, but you're learning to be more stable.",
        "Leo": "With Saturn in Leo, your lessons come through developing authentic self-expression and leadership. You must learn to lead with humility and genuine creativity. You may struggle with pride, but you're learning to be more generous.",
        "Virgo": "With Saturn in Virgo, your lessons come through developing practical skills and attention to detail. You must learn to be helpful without being critical. You may struggle with perfectionism, but you're learning to be more accepting.",
        "Libra": "With Saturn in Libra, your lessons come through developing balanced relationships and fairness. You must learn to make decisions and stand up for yourself. You may struggle with indecision, but you're learning to be more decisive.",
        "Scorpio": "With Saturn in Scorpio, your lessons come through developing emotional control and psychological insight. You must learn to trust and let go of control. You may struggle with jealousy, but you're learning to be more trusting.",
        "Sagittarius": "With Saturn in Sagittarius, your lessons come through developing wisdom and philosophical understanding. You must learn to be more practical in your beliefs. You may struggle with idealism, but you're learning to be more grounded.",
        "Capricorn": "With Saturn in Capricorn, its natural home, your lessons come through developing discipline and achievement. You must learn to build lasting structures and take responsibility. You may struggle with pessimism, but you're learning to be more optimistic.",
        "Aquarius": "With Saturn in Aquarius, your lessons come through developing independence and humanitarian values. You must learn to balance individuality with social responsibility. You may struggle with detachment, but you're learning to be more connected.",
        "Pisces": "With Saturn in Pisces, your lessons come through developing spiritual discipline and boundaries. You must learn to be more practical while maintaining compassion. You may struggle with escapism, but you're learning to be more grounded."
    },
    "Uranus": {
        "Aries": "With Uranus in Aries, your innovation comes through revolutionary action and independence. You break new ground and challenge traditional approaches. You're pioneering and original, but can be impulsive or rebellious.",
        "Taurus": "With Uranus in Taurus, your innovation comes through revolutionizing values and material structures. You challenge traditional approaches to money and resources. You're practical and original, but can be stubborn in your changes.",
        "Gemini": "With Uranus in Gemini, your innovation comes through revolutionary communication and thinking. You challenge traditional ideas and spread new concepts. You're adaptable and original, but can be scattered in your innovations.",
        "Cancer": "With Uranus in Cancer, your innovation comes through revolutionizing emotional patterns and family structures. You challenge traditional approaches to home and family. You're intuitive and original, but can be emotionally unpredictable.",
        "Leo": "With Uranus in Leo, your innovation comes through revolutionary self-expression and leadership. You challenge traditional approaches to creativity and authority. You're dramatic and original, but can be overly individualistic.",
        "Virgo": "With Uranus in Virgo, your innovation comes through revolutionizing work and service. You challenge traditional approaches to health and efficiency. You're practical and original, but can be overly critical in your changes.",
        "Libra": "With Uranus in Libra, your innovation comes through revolutionizing relationships and justice. You challenge traditional approaches to partnerships and fairness. You're diplomatic and original, but can be indecisive in your changes.",
        "Scorpio": "With Uranus in Scorpio, your innovation comes through revolutionizing power structures and transformation. You challenge traditional approaches to psychology and control. You're intense and original, but can be secretive in your changes.",
        "Sagittarius": "With Uranus in Sagittarius, your innovation comes through revolutionizing beliefs and expansion. You challenge traditional approaches to philosophy and travel. You're adventurous and original, but can be overly idealistic.",
        "Capricorn": "With Uranus in Capricorn, your innovation comes through revolutionizing authority and structures. You challenge traditional approaches to business and government. You're disciplined and original, but can be rigid in your changes.",
        "Aquarius": "With Uranus in Aquarius, its natural home, your innovation comes through revolutionary thinking and humanitarian ideals. You challenge traditional approaches to society and technology. You're progressive and original, but can be detached.",
        "Pisces": "With Uranus in Pisces, your innovation comes through revolutionizing spirituality and compassion. You challenge traditional approaches to mysticism and universal love. You're intuitive and original, but can be escapist in your changes."
    },
    "Neptune": {
        "Aries": "With Neptune in Aries, your spirituality comes through idealistic action and pioneering dreams. You may idealize leadership and action, but can be confused about your identity. You're inspired and compassionate, but can be escapist.",
        "Taurus": "With Neptune in Taurus, your spirituality comes through idealizing material security and beauty. You may idealize possessions and comfort, but can be confused about values. You're practical and compassionate, but can be escapist.",
        "Gemini": "With Neptune in Gemini, your spirituality comes through idealistic communication and intellectual dreams. You may idealize learning and ideas, but can be confused about thinking. You're curious and compassionate, but can be escapist.",
        "Cancer": "With Neptune in Cancer, your spirituality comes through idealizing emotional security and family. You may idealize home and nurturing, but can be confused about emotions. You're intuitive and compassionate, but can be escapist.",
        "Leo": "With Neptune in Leo, your spirituality comes through idealizing creativity and leadership. You may idealize self-expression and attention, but can be confused about identity. You're dramatic and compassionate, but can be escapist.",
        "Virgo": "With Neptune in Virgo, your spirituality comes through idealizing service and perfection. You may idealize work and health, but can be confused about practicality. You're helpful and compassionate, but can be escapist.",
        "Libra": "With Neptune in Libra, your spirituality comes through idealizing relationships and harmony. You may idealize partnerships and beauty, but can be confused about balance. You're diplomatic and compassionate, but can be escapist.",
        "Scorpio": "With Neptune in Scorpio, your spirituality comes through idealizing transformation and power. You may idealize psychology and control, but can be confused about intensity. You're perceptive and compassionate, but can be escapist.",
        "Sagittarius": "With Neptune in Sagittarius, your spirituality comes through idealizing expansion and philosophy. You may idealize travel and beliefs, but can be confused about truth. You're adventurous and compassionate, but can be escapist.",
        "Capricorn": "With Neptune in Capricorn, your spirituality comes through idealizing achievement and structure. You may idealize authority and discipline, but can be confused about responsibility. You're practical and compassionate, but can be escapist.",
        "Aquarius": "With Neptune in Aquarius, your spirituality comes through idealizing independence and humanitarianism. You may idealize freedom and progress, but can be confused about individuality. You're original and compassionate, but can be escapist.",
        "Pisces": "With Neptune in Pisces, its natural home, your spirituality comes through universal compassion and mystical dreams. You may idealize spirituality and transcendence, but can be confused about reality. You're intuitive and compassionate, but can be escapist."
    },
    "Pluto": {
        "Aries": "With Pluto in Aries, your transformation comes through revolutionary action and identity. You may experience intense power struggles and deep changes in how you assert yourself. You're powerful and transformative, but can be controlling.",
        "Taurus": "With Pluto in Taurus, your transformation comes through revolutionizing values and material security. You may experience intense changes in your relationship with money and possessions. You're practical and transformative, but can be possessive.",
        "Gemini": "With Pluto in Gemini, your transformation comes through revolutionizing communication and thinking. You may experience intense changes in how you process and share information. You're curious and transformative, but can be obsessive.",
        "Cancer": "With Pluto in Cancer, your transformation comes through revolutionizing emotions and family. You may experience intense changes in your emotional patterns and family dynamics. You're intuitive and transformative, but can be controlling.",
        "Leo": "With Pluto in Leo, your transformation comes through revolutionizing creativity and leadership. You may experience intense changes in how you express yourself and lead others. You're dramatic and transformative, but can be power-hungry.",
        "Virgo": "With Pluto in Virgo, your transformation comes through revolutionizing work and service. You may experience intense changes in your approach to health and efficiency. You're practical and transformative, but can be obsessive.",
        "Libra": "With Pluto in Libra, your transformation comes through revolutionizing relationships and justice. You may experience intense changes in your approach to partnerships and fairness. You're diplomatic and transformative, but can be manipulative.",
        "Scorpio": "With Pluto in Scorpio, its natural home, your transformation comes through deep psychological evolution and power dynamics. You may experience intense changes in your understanding of control and transformation. You're perceptive and transformative, but can be secretive.",
        "Sagittarius": "With Pluto in Sagittarius, your transformation comes through revolutionizing beliefs and expansion. You may experience intense changes in your philosophical outlook and approach to growth. You're adventurous and transformative, but can be dogmatic.",
        "Capricorn": "With Pluto in Capricorn, your transformation comes through revolutionizing authority and structures. You may experience intense changes in your approach to achievement and responsibility. You're disciplined and transformative, but can be authoritarian.",
        "Aquarius": "With Pluto in Aquarius, your transformation comes through revolutionizing independence and humanitarianism. You may experience intense changes in your approach to individuality and social progress. You're original and transformative, but can be rebellious.",
        "Pisces": "With Pluto in Pisces, your transformation comes through revolutionizing spirituality and compassion. You may experience intense changes in your spiritual understanding and approach to universal love. You're intuitive and transformative, but can be escapist."
    },
    "Node": {
        "Aries": "With the North Node in Aries, your soul's growth comes through developing independence, courage, and leadership. You're learning to be more assertive and take initiative in your life path.",
        "Taurus": "With the North Node in Taurus, your soul's growth comes through developing stability, patience, and material security. You're learning to be more grounded and build lasting foundations.",
        "Gemini": "With the North Node in Gemini, your soul's growth comes through developing communication, curiosity, and intellectual exploration. You're learning to be more versatile and gather diverse knowledge.",
        "Cancer": "With the North Node in Cancer, your soul's growth comes through developing emotional security, nurturing, and family connections. You're learning to be more intuitive and protective.",
        "Leo": "With the North Node in Leo, your soul's growth comes through developing creativity, self-expression, and leadership. You're learning to be more confident and inspire others.",
        "Virgo": "With the North Node in Virgo, your soul's growth comes through developing service, attention to detail, and practical skills. You're learning to be more helpful and organized.",
        "Libra": "With the North Node in Libra, your soul's growth comes through developing partnerships, diplomacy, and balance. You're learning to be more cooperative and fair.",
        "Scorpio": "With the North Node in Scorpio, your soul's growth comes through developing emotional depth, transformation, and psychological insight. You're learning to be more intense and perceptive.",
        "Sagittarius": "With the North Node in Sagittarius, your soul's growth comes through developing optimism, adventure, and philosophical understanding. You're learning to be more expansive and truth-seeking.",
        "Capricorn": "With the North Node in Capricorn, your soul's growth comes through developing discipline, achievement, and responsibility. You're learning to be more ambitious and structured.",
        "Aquarius": "With the North Node in Aquarius, your soul's growth comes through developing independence, innovation, and humanitarian values. You're learning to be more original and socially conscious.",
        "Pisces": "With the North Node in Pisces, your soul's growth comes through developing spirituality, compassion, and universal love. You're learning to be more intuitive and empathetic."
    },
    "Lilith": {
        "Aries": "With Lilith in Aries, your primal energy expresses through bold independence and fierce determination. You challenge traditional expectations and assert your authentic self.",
        "Taurus": "With Lilith in Taurus, your primal energy expresses through sensual independence and material self-sufficiency. You challenge traditional values and build your own security.",
        "Gemini": "With Lilith in Gemini, your primal energy expresses through intellectual independence and versatile communication. You challenge traditional thinking and gather diverse knowledge.",
        "Cancer": "With Lilith in Cancer, your primal energy expresses through emotional independence and intuitive nurturing. You challenge traditional family roles and protect your emotional space.",
        "Leo": "With Lilith in Leo, your primal energy expresses through creative independence and dramatic self-expression. You challenge traditional leadership and shine authentically.",
        "Virgo": "With Lilith in Virgo, your primal energy expresses through practical independence and service to self. You challenge traditional work roles and perfect your own skills.",
        "Libra": "With Lilith in Libra, your primal energy expresses through relational independence and personal justice. You challenge traditional partnership roles and seek authentic balance.",
        "Scorpio": "With Lilith in Scorpio, your primal energy expresses through intense independence and deep transformation. You challenge traditional power dynamics and embrace your intensity.",
        "Sagittarius": "With Lilith in Sagittarius, your primal energy expresses through adventurous independence and philosophical freedom. You challenge traditional beliefs and seek your own truth.",
        "Capricorn": "With Lilith in Capricorn, your primal energy expresses through ambitious independence and personal achievement. You challenge traditional authority and build your own success.",
        "Aquarius": "With Lilith in Aquarius, your primal energy expresses through innovative independence and humanitarian ideals. You challenge traditional social structures and embrace your uniqueness.",
        "Pisces": "With Lilith in Pisces, your primal energy expresses through spiritual independence and universal compassion. You challenge traditional spiritual roles and connect with divine love."
    },
    "Chiron": {
        "Aries": "With Chiron in Aries, your wounding and healing come through issues of identity, courage, and independence. You may struggle with self-assertion but can help others find their strength.",
        "Taurus": "With Chiron in Taurus, your wounding and healing come through issues of values, security, and self-worth. You may struggle with material confidence but can help others build stability.",
        "Gemini": "With Chiron in Gemini, your wounding and healing come through issues of communication, learning, and mental confidence. You may struggle with self-expression but can help others find their voice.",
        "Cancer": "With Chiron in Cancer, your wounding and healing come through issues of emotional security, nurturing, and family. You may struggle with emotional confidence but can help others heal emotionally.",
        "Leo": "With Chiron in Leo, your wounding and healing come through issues of creativity, self-expression, and confidence. You may struggle with self-love but can help others shine authentically.",
        "Virgo": "With Chiron in Virgo, your wounding and healing come through issues of perfection, service, and health. You may struggle with self-acceptance but can help others heal practically.",
        "Libra": "With Chiron in Libra, your wounding and healing come through issues of relationships, balance, and fairness. You may struggle with partnership confidence but can help others find harmony.",
        "Scorpio": "With Chiron in Scorpio, your wounding and healing come through issues of power, transformation, and deep emotions. You may struggle with trust but can help others heal deeply.",
        "Sagittarius": "With Chiron in Sagittarius, your wounding and healing come through issues of beliefs, expansion, and truth. You may struggle with faith but can help others find meaning.",
        "Capricorn": "With Chiron in Capricorn, your wounding and healing come through issues of achievement, authority, and responsibility. You may struggle with success confidence but can help others build structure.",
        "Aquarius": "With Chiron in Aquarius, your wounding and healing come through issues of independence, innovation, and social connection. You may struggle with belonging but can help others find their uniqueness.",
        "Pisces": "With Chiron in Pisces, your wounding and healing come through issues of spirituality, compassion, and universal love. You may struggle with boundaries but can help others heal spiritually."
    },
    "Fortune": {
        "Aries": "With Fortune in Aries, your luck and opportunities come through bold action, leadership, and independence. You find success by taking initiative and being courageous.",
        "Taurus": "With Fortune in Taurus, your luck and opportunities come through stability, patience, and material building. You find success through steady work and practical approaches.",
        "Gemini": "With Fortune in Gemini, your luck and opportunities come through communication, learning, and versatility. You find success through gathering knowledge and making connections.",
        "Cancer": "With Fortune in Cancer, your luck and opportunities come through emotional intelligence, nurturing, and intuition. You find success through caring for others and following your feelings.",
        "Leo": "With Fortune in Leo, your luck and opportunities come through creativity, self-expression, and leadership. You find success through inspiring others and being authentic.",
        "Virgo": "With Fortune in Virgo, your luck and opportunities come through service, attention to detail, and practical skills. You find success through helping others and being organized.",
        "Libra": "With Fortune in Libra, your luck and opportunities come through partnerships, diplomacy, and balance. You find success through cooperation and creating harmony.",
        "Scorpio": "With Fortune in Scorpio, your luck and opportunities come through transformation, intensity, and psychological insight. You find success through deep understanding and powerful change.",
        "Sagittarius": "With Fortune in Sagittarius, your luck and opportunities come through adventure, optimism, and philosophical growth. You find success through exploration and truth-seeking.",
        "Capricorn": "With Fortune in Capricorn, your luck and opportunities come through discipline, achievement, and responsibility. You find success through hard work and building lasting structures.",
        "Aquarius": "With Fortune in Aquarius, your luck and opportunities come through innovation, independence, and humanitarian causes. You find success through originality and social progress.",
        "Pisces": "With Fortune in Pisces, your luck and opportunities come through spirituality, compassion, and universal love. You find success through intuition and helping others heal."
    },
    "Vertex": {
        "Aries": "With Vertex in Aries, your fated encounters come through bold, independent individuals who challenge you to be more assertive and courageous in your life path.",
        "Taurus": "With Vertex in Taurus, your fated encounters come through stable, practical individuals who help you build security and find value in the material world.",
        "Gemini": "With Vertex in Gemini, your fated encounters come through communicative, curious individuals who expand your knowledge and help you make important connections.",
        "Cancer": "With Vertex in Cancer, your fated encounters come through nurturing, intuitive individuals who help you develop emotional security and family connections.",
        "Leo": "With Vertex in Leo, your fated encounters come through creative, confident individuals who inspire you to express yourself authentically and lead with courage.",
        "Virgo": "With Vertex in Virgo, your fated encounters come through practical, service-oriented individuals who help you develop skills and organize your life effectively.",
        "Libra": "With Vertex in Libra, your fated encounters come through diplomatic, balanced individuals who help you create harmony and find fairness in relationships.",
        "Scorpio": "With Vertex in Scorpio, your fated encounters come through intense, transformative individuals who help you heal deeply and understand power dynamics.",
        "Sagittarius": "With Vertex in Sagittarius, your fated encounters come through adventurous, philosophical individuals who expand your horizons and help you find meaning.",
        "Capricorn": "With Vertex in Capricorn, your fated encounters come through ambitious, disciplined individuals who help you achieve your goals and build lasting success.",
        "Aquarius": "With Vertex in Aquarius, your fated encounters come through innovative, independent individuals who help you embrace your uniqueness and contribute to social progress.",
        "Pisces": "With Vertex in Pisces, your fated encounters come through spiritual, compassionate individuals who help you develop intuition and connect with universal love."
    }
}; 