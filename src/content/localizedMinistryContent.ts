import type { Locale } from '../lib/routing';
import type { MinistryPageId } from './churchContent';

export type MinistryActionDestination = 'visit' | 'contact' | 'staff' | 'sermons' | 'give';

export type LocalizedMinistryAction = {
  id: string;
  destination: MinistryActionDestination;
  label: string;
};

export type LocalizedMinistryFeature = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageAlt?: string;
};

export type LocalizedMinistryPage = {
  eyebrow: string;
  title: string;
  description: string;
  heroAlt: string;
  heroLabel: string;
  introEyebrow: string;
  introTitle: string;
  introduction: string[];
  highlightsTitle: string;
  highlights: Array<{ id: string; title: string; description: string }>;
  featureEyebrow: string;
  featureTitle: string;
  featureCopy: string;
  features: LocalizedMinistryFeature[];
  ctaTitle: string;
  ctaCopy: string;
  actions: LocalizedMinistryAction[];
};

export type LocalizedMinistryContent = {
  relatedEyebrow: string;
  relatedTitle: string;
  relatedCopy: string;
  pages: Record<MinistryPageId, LocalizedMinistryPage>;
};

export const localizedMinistryContent: Record<Locale, LocalizedMinistryContent> = {
  en: {
    relatedEyebrow: 'Explore church life',
    relatedTitle: 'There is more to discover',
    relatedCopy:
      'See how worship, care, creativity, service, and belonging connect across the life of the church.',
    pages: {
      worshipAndMusic: {
        eyebrow: 'Gathered around word and table',
        title: 'Worship and music',
        description:
          'Prayer, scripture, preaching, communion, and music bring the congregation together each Sunday at 11:30 AM.',
        heroAlt:
          'The sanctuary of First Christian Church Anniston prepared for worship beneath the cross and stained glass',
        heroLabel: 'Sunday worship at 11:30 AM',
        introEyebrow: 'A shared rhythm of faith',
        introTitle: 'Worship makes room for celebration, reflection, and connection',
        introduction: [
          'Our Sunday service follows a Christian rhythm of gathering, listening, responding, sharing communion, and being sent to serve.',
          'Music helps the congregation pray, celebrate, remember, and participate together. Organ, piano, choir, and congregational song support worship without requiring visitors to know every word or custom in advance.',
          'Communion is central to our weekly worship and reflects Christ’s welcome at the table.',
        ],
        highlightsTitle: 'What shapes Sunday worship',
        highlights: [
          {
            id: 'prayer',
            title: 'Prayer and scripture',
            description:
              'Spoken prayer and scripture readings create space to listen for God and bring the concerns of the community into worship.',
          },
          {
            id: 'preaching',
            title: 'Thoughtful preaching',
            description:
              'Sermons connect scripture, faith, questions, and daily life with compassion and room for reflection.',
          },
          {
            id: 'communion',
            title: 'Weekly communion',
            description:
              'The congregation gathers at the table each week as a sign of grace, remembrance, and belonging.',
          },
          {
            id: 'music',
            title: 'Music for participation',
            description:
              'Organ, piano, choir, and worship leadership invite the whole congregation into prayer and praise.',
          },
        ],
        featureEyebrow: 'At the table and in song',
        featureTitle: 'People and practices that support worship',
        featureCopy:
          'Worship is shaped by faithful preparation, collaborative leadership, and the gifts of people who have served this congregation for many years.',
        features: [
          {
            id: 'communion',
            eyebrow: 'An open table',
            title: 'Communion at the center',
            description:
              'Bread and cup ground the service in the life and welcome of Christ. Visitors do not need to arrive with every question answered in order to share in the worshiping community.',
            imageAlt: 'A communion table prepared with bread, cups, candles, and serving vessels',
          },
          {
            id: 'gerald',
            eyebrow: 'Organ, piano, and choir',
            title: 'Gerald Roberts',
            description:
              'Gerald has served the church through organ, piano, choir, and musical coordination since 1987, understanding music as a sacred expression of faith and community.',
            imageAlt: 'Portrait of Gerald Roberts',
          },
          {
            id: 'jason',
            eyebrow: 'Worship leadership',
            title: 'Jason Wright',
            description:
              'Jason guides the congregation in joyful song and brings musical, theatrical, and visual creativity to an inviting and participatory worship experience.',
            imageAlt: 'Portrait of Jason Wright',
          },
        ],
        ctaTitle: 'Join the congregation on Sunday',
        ctaCopy:
          'Plan your first visit or listen to recent sermons before you arrive. Worship begins Sundays at 11:30 AM.',
        actions: [
          { id: 'plan-worship-visit', destination: 'visit', label: 'Plan your visit' },
          { id: 'listen-to-sermons', destination: 'sermons', label: 'Listen to sermons' },
        ],
      },
      wonderAndWorship: {
        eyebrow: 'Children are part of church life',
        title: 'Wonder and Worship',
        description:
          'Children are welcomed into worship through stories, questions, participation, and age-appropriate activities during the service.',
        heroAlt: 'A church leader sharing a children’s moment with two children in the sanctuary',
        heroLabel: 'Children and families are welcome',
        introEyebrow: 'Faith with imagination',
        introTitle: 'Children can listen, wonder, ask, and participate',
        introduction: [
          'Wonder and Worship gives children a meaningful way to engage scripture and faith during the Worship Service.',
          'Stories and activities are designed to invite curiosity rather than require children to sit silently or already understand church language.',
          'Children also belong in the wider worshiping community through shared moments, questions, music, prayer, and the welcome of the congregation.',
        ],
        highlightsTitle: 'A welcoming approach for children',
        highlights: [
          {
            id: 'stories',
            title: 'Stories that invite wonder',
            description:
              'Biblical stories are shared in ways that encourage imagination, conversation, and growing understanding.',
          },
          {
            id: 'activities',
            title: 'Active participation',
            description:
              'Age-appropriate activities give children another way to explore the themes of worship.',
          },
          {
            id: 'belonging',
            title: 'Part of the congregation',
            description:
              'Children are welcomed as participants in church life, not treated as an interruption to it.',
          },
          {
            id: 'families',
            title: 'Support for families',
            description:
              'Parents and caregivers can contact the church before Sunday with questions or accommodation needs.',
          },
        ],
        featureEyebrow: 'A place to grow',
        featureTitle: 'Welcoming children within the whole worshiping community',
        featureCopy:
          'The goal is not a perfect first Sunday. The goal is to help children and their caregivers experience welcome, curiosity, and room to participate.',
        features: [
          {
            id: 'participation',
            eyebrow: 'During worship',
            title: 'Children’s moments and shared participation',
            description:
              'Children encounter stories, questions, and invitations to participate as part of the congregation’s Sunday worship.',
            imageAlt:
              'A church leader talking with children during a children’s moment in the sanctuary',
          },
          {
            id: 'welcome',
            eyebrow: 'Before you arrive',
            title: 'Ask what would help your family',
            description:
              'If mobility, sensory, seating, communication, or another accommodation would make Sunday easier, contact the church so leaders can plan with you.',
            imageAlt: 'The church welcome area with visitor materials, artwork, and rainbow flags',
          },
        ],
        ctaTitle: 'Make your family’s first Sunday simpler',
        ctaCopy:
          'Review the visit guide or send a question before you arrive. The church can help with practical details and accommodation needs.',
        actions: [
          { id: 'plan-family-visit', destination: 'visit', label: 'Plan your visit' },
          {
            id: 'ask-about-children',
            destination: 'contact',
            label: 'Ask about children’s ministry',
          },
        ],
      },
      hispanicMinistry: {
        eyebrow: 'Cuidado espiritual en español',
        title: 'Hispanic ministry',
        description:
          'Rev. Maria Zamarripa serves Spanish-speaking individuals and families through spiritual guidance, pastoral care, and community chaplaincy.',
        heroAlt: 'Portrait of Rev. Maria Zamarripa',
        heroLabel: 'Ministry with Spanish-speaking people and families',
        introEyebrow: 'Faithful presence',
        introTitle: 'Care rooted in language, relationship, and community',
        introduction: [
          'Hispanic ministry helps Spanish-speaking people connect with spiritual care and the life of the congregation in the language that serves them best.',
          'Rev. Maria Zamarripa brings deep roots in First Christian Church, ordained ministry, compassion, and long-standing relationships across Calhoun County.',
          'Her ministry includes personal spiritual support as well as chaplaincy at RMC Hospital and the County Jail.',
        ],
        highlightsTitle: 'Ways this ministry offers care',
        highlights: [
          {
            id: 'language',
            title: 'Ministry in Spanish',
            description:
              'People can ask questions, seek prayer, and discuss spiritual concerns in Spanish.',
          },
          {
            id: 'pastoral-care',
            title: 'Pastoral care',
            description:
              'Compassionate conversation and spiritual guidance meet people in seasons of change, grief, hope, or uncertainty.',
          },
          {
            id: 'chaplaincy',
            title: 'Community chaplaincy',
            description:
              'Care extends beyond the church building through ministry at RMC Hospital and the County Jail.',
          },
          {
            id: 'connection',
            title: 'Congregational connection',
            description:
              'Spanish-speaking individuals and families are welcomed into the broader worship and community life of the church.',
          },
        ],
        featureEyebrow: 'Meet the minister',
        featureTitle: 'A ministry shaped by long-term relationships',
        featureCopy:
          'Maria’s history with the congregation and her work across Calhoun County connect pastoral ministry with practical, compassionate presence.',
        features: [
          {
            id: 'maria',
            eyebrow: 'Associate Minister for Hispanic Ministries',
            title: 'Rev. Maria Zamarripa',
            description:
              'Maria has been part of First Christian Church since the early 1980s, entered Lexington Theological Seminary in 2016, and was ordained in 2020.',
            imageAlt: 'Portrait of Rev. Maria Zamarripa',
          },
          {
            id: 'welcome',
            eyebrow: 'A place to belong',
            title: 'Connected to the whole church',
            description:
              'Hispanic ministry is part of a congregation committed to open hospitality, shared worship, spiritual growth, and dignity for every person.',
            imageAlt: 'The church welcome area with visitor materials, artwork, and rainbow flags',
          },
        ],
        ctaTitle: 'Start a conversation',
        ctaCopy:
          'Contact the church for spiritual care in Spanish or learn more about Rev. Maria Zamarripa and the staff who serve the congregation.',
        actions: [
          { id: 'contact-hispanic-ministry', destination: 'contact', label: 'Contact the church' },
          { id: 'meet-the-staff', destination: 'staff', label: 'Meet the staff' },
        ],
      },
      serviceAndOutreach: {
        eyebrow: 'Faith expressed through care',
        title: 'Service and outreach',
        description:
          'The church serves neighbors through public community presence, practical support, pastoral care, and shared space.',
        heroAlt:
          'Stone exterior of First Christian Church Anniston framed by a large tree at sunset',
        heroLabel: 'Serving Anniston and nearby communities',
        introEyebrow: 'The hands and feet of God',
        introTitle: 'Service begins with relationships and practical hospitality',
        introduction: [
          'First Christian Church understands faith as compassionate care, community involvement, reconciliation, and service.',
          'Outreach includes showing up at public events, responding to practical needs, caring for older adults, and making the church building useful to community groups.',
          'These efforts grow through volunteers, financial support, pastoral leadership, and partnerships with people beyond the congregation.',
        ],
        highlightsTitle: 'Current service and outreach',
        highlights: [
          {
            id: 'oxfordfest',
            title: 'A welcoming booth at Oxfordfest',
            description:
              'Church members attend Oxfordfest with a booth that offers a visible, welcoming presence and opportunities for conversation.',
          },
          {
            id: 'jsu',
            title: 'Support for JSU’s LGBT student group',
            description:
              'The church provides food and snacks to Jacksonville State University’s LGBT student group as a practical expression of affirmation and care.',
          },
          {
            id: 'older-adults',
            title: 'Pastoral care for older adults',
            description:
              'The pastors offer spiritual support and compassionate presence to older adults in the wider community.',
          },
          {
            id: 'space',
            title: 'Church space for community groups',
            description:
              'Throughout the week, the church lends space to groups that need a place to meet, organize, learn, or support one another.',
          },
        ],
        featureEyebrow: 'Hospitality beyond Sunday',
        featureTitle: 'Four ways the church is serving now',
        featureCopy:
          'Each effort is different, but all four are grounded in showing up, sharing resources, and treating neighbors with dignity.',
        features: [
          {
            id: 'oxfordfest',
            eyebrow: 'Community presence',
            title: 'Oxfordfest',
            description:
              'A church booth at Oxfordfest gives members a way to meet neighbors, represent the congregation in public, and extend an open invitation to connect.',
          },
          {
            id: 'jsu',
            eyebrow: 'Practical affirmation',
            title: 'Food and snacks for JSU’s LGBT group',
            description:
              'Supporting students with food and snacks turns welcome into a tangible act of care for Jacksonville State University’s LGBT community.',
          },
          {
            id: 'older-adults',
            eyebrow: 'Pastoral presence',
            title: 'Care for older adults',
            description:
              'Pastoral care offers listening, prayer, encouragement, and spiritual companionship to older adults across the community.',
          },
          {
            id: 'space',
            eyebrow: 'Shared resources',
            title: 'Room for groups that need it',
            description:
              'The church building serves the community throughout the week by providing space for groups with a practical need for a place to gather.',
            imageAlt: 'The church welcome area with visitor materials, artwork, and rainbow flags',
          },
        ],
        ctaTitle: 'Take part in practical care',
        ctaCopy:
          'Ask about volunteering, support the church’s service financially, or contact the office about using church space.',
        actions: [
          { id: 'volunteer', destination: 'contact', label: 'Ask about volunteering' },
          { id: 'give-to-outreach', destination: 'give', label: 'Give online' },
          { id: 'space-request', destination: 'contact', label: 'Request church space' },
        ],
      },
    },
  },
  es: {
    relatedEyebrow: 'Explore la vida de la iglesia',
    relatedTitle: 'Hay más por descubrir',
    relatedCopy:
      'Vea cómo la adoración, el cuidado, la creatividad, el servicio y la pertenencia se conectan en la vida de la iglesia.',
    pages: {
      worshipAndMusic: {
        eyebrow: 'Reunidos alrededor de la Palabra y la mesa',
        title: 'Adoración y música',
        description:
          'La oración, la Escritura, la predicación, la comunión y la música reúnen a la congregación cada domingo a las 11:30 AM.',
        heroAlt:
          'El santuario de la Primera Iglesia Cristiana de Anniston preparado para la adoración bajo la cruz y los vitrales',
        heroLabel: 'Adoración dominical a las 11:30 AM',
        introEyebrow: 'Un ritmo compartido de fe',
        introTitle: 'La adoración crea espacio para celebrar, reflexionar y conectar',
        introduction: [
          'Nuestro servicio dominical sigue un ritmo cristiano de reunión, escucha, respuesta, comunión y envío al servicio.',
          'La música ayuda a la congregación a orar, celebrar, recordar y participar. El órgano, el piano, el coro y el canto congregacional apoyan la adoración sin exigir que los visitantes conozcan de antemano cada palabra o costumbre.',
          'La comunión es central en nuestra adoración semanal y refleja la bienvenida de Cristo a la mesa.',
        ],
        highlightsTitle: 'Lo que forma la adoración dominical',
        highlights: [
          {
            id: 'prayer',
            title: 'Oración y Escritura',
            description:
              'La oración y las lecturas bíblicas crean espacio para escuchar a Dios y presentar las preocupaciones de la comunidad.',
          },
          {
            id: 'preaching',
            title: 'Predicación reflexiva',
            description:
              'Los sermones conectan la Escritura, la fe, las preguntas y la vida diaria con compasión y espacio para reflexionar.',
          },
          {
            id: 'communion',
            title: 'Comunión semanal',
            description:
              'La congregación se reúne cada semana a la mesa como señal de gracia, memoria y pertenencia.',
          },
          {
            id: 'music',
            title: 'Música para participar',
            description:
              'El órgano, el piano, el coro y el liderazgo musical invitan a toda la congregación a la oración y la alabanza.',
          },
        ],
        featureEyebrow: 'En la mesa y en el canto',
        featureTitle: 'Personas y prácticas que apoyan la adoración',
        featureCopy:
          'La adoración se forma mediante preparación fiel, liderazgo colaborativo y los dones de personas que han servido a esta congregación durante muchos años.',
        features: [
          {
            id: 'communion',
            eyebrow: 'Una mesa abierta',
            title: 'La comunión en el centro',
            description:
              'El pan y la copa centran el servicio en la vida y la bienvenida de Cristo. Los visitantes no necesitan llegar con todas sus preguntas resueltas para participar en la comunidad de adoración.',
            imageAlt: 'Mesa de comunión preparada con pan, copas, velas y utensilios',
          },
          {
            id: 'gerald',
            eyebrow: 'Órgano, piano y coro',
            title: 'Gerald Roberts',
            description:
              'Gerald sirve a la iglesia con órgano, piano, coro y coordinación musical desde 1987 y entiende la música como una expresión sagrada de fe y comunidad.',
            imageAlt: 'Retrato de Gerald Roberts',
          },
          {
            id: 'jason',
            eyebrow: 'Liderazgo de adoración',
            title: 'Jason Wright',
            description:
              'Jason guía a la congregación en el canto y aporta creatividad musical, teatral y visual a una experiencia de adoración acogedora y participativa.',
            imageAlt: 'Retrato de Jason Wright',
          },
        ],
        ctaTitle: 'Acompañe a la congregación el domingo',
        ctaCopy:
          'Planifique su primera visita o escuche sermones recientes antes de llegar. La adoración comienza los domingos a las 11:30 AM.',
        actions: [
          { id: 'plan-worship-visit', destination: 'visit', label: 'Planifique su visita' },
          { id: 'listen-to-sermons', destination: 'sermons', label: 'Escuchar sermones' },
        ],
      },
      wonderAndWorship: {
        eyebrow: 'Los niños son parte de la vida de la iglesia',
        title: 'Wonder and Worship',
        description:
          'Los niños participan en la adoración mediante historias, preguntas, participación y actividades apropiadas para su edad durante el servicio.',
        heroAlt: 'Una líder de la iglesia compartiendo un momento infantil con dos niños',
        heroLabel: 'Los niños y las familias son bienvenidos',
        introEyebrow: 'La fe con imaginación',
        introTitle: 'Los niños pueden escuchar, imaginar, preguntar y participar',
        introduction: [
          'Wonder and Worship ofrece a los niños una manera significativa de relacionarse con la Escritura y la fe durante el servicio de adoración.',
          'Las historias y actividades invitan a la curiosidad sin exigir que los niños permanezcan en silencio ni que ya comprendan el lenguaje de la iglesia.',
          'Los niños también pertenecen a la comunidad de adoración mediante momentos compartidos, preguntas, música, oración y la bienvenida de la congregación.',
        ],
        highlightsTitle: 'Una manera acogedora de acompañar a los niños',
        highlights: [
          {
            id: 'stories',
            title: 'Historias que despiertan curiosidad',
            description:
              'Las historias bíblicas se comparten de maneras que fomentan la imaginación, la conversación y una comprensión creciente.',
          },
          {
            id: 'activities',
            title: 'Participación activa',
            description:
              'Las actividades apropiadas para la edad ofrecen otra manera de explorar los temas de la adoración.',
          },
          {
            id: 'belonging',
            title: 'Parte de la congregación',
            description:
              'Los niños son recibidos como participantes en la vida de la iglesia, no como una interrupción.',
          },
          {
            id: 'families',
            title: 'Apoyo para las familias',
            description:
              'Los padres y cuidadores pueden comunicarse con la iglesia antes del domingo si tienen preguntas o necesidades de adaptación.',
          },
        ],
        featureEyebrow: 'Un lugar para crecer',
        featureTitle: 'Recibir a los niños dentro de toda la comunidad de adoración',
        featureCopy:
          'La meta no es un primer domingo perfecto. La meta es que los niños y sus cuidadores encuentren bienvenida, curiosidad y espacio para participar.',
        features: [
          {
            id: 'participation',
            eyebrow: 'Durante la adoración',
            title: 'Momentos infantiles y participación compartida',
            description:
              'Los niños encuentran historias, preguntas e invitaciones a participar como parte de la adoración dominical.',
            imageAlt: 'Una líder de la iglesia conversando con niños durante un momento infantil',
          },
          {
            id: 'welcome',
            eyebrow: 'Antes de llegar',
            title: 'Pregunte qué ayudaría a su familia',
            description:
              'Si una adaptación de movilidad, sensibilidad, asientos, comunicación u otro tipo facilitaría el domingo, comuníquese con la iglesia para planificar juntos.',
            imageAlt: 'Área de bienvenida con materiales para visitantes, arte y banderas arcoíris',
          },
        ],
        ctaTitle: 'Facilite el primer domingo de su familia',
        ctaCopy:
          'Consulte la guía de visita o envíe una pregunta antes de llegar. La iglesia puede ayudar con detalles prácticos y necesidades de adaptación.',
        actions: [
          { id: 'plan-family-visit', destination: 'visit', label: 'Planifique su visita' },
          {
            id: 'ask-about-children',
            destination: 'contact',
            label: 'Preguntar sobre el ministerio infantil',
          },
        ],
      },
      hispanicMinistry: {
        eyebrow: 'Cuidado espiritual en español',
        title: 'Ministerio hispano',
        description:
          'La Rev. Maria Zamarripa sirve a personas y familias de habla hispana mediante guía espiritual, cuidado pastoral y capellanía comunitaria.',
        heroAlt: 'Retrato de la Rev. Maria Zamarripa',
        heroLabel: 'Ministerio con personas y familias de habla hispana',
        introEyebrow: 'Presencia fiel',
        introTitle: 'Cuidado arraigado en el idioma, las relaciones y la comunidad',
        introduction: [
          'El ministerio hispano ayuda a las personas de habla hispana a conectarse con el cuidado espiritual y la vida de la congregación en el idioma que mejor les sirve.',
          'La Rev. Maria Zamarripa aporta profundas raíces en la Primera Iglesia Cristiana, ministerio ordenado, compasión y relaciones de muchos años en el condado de Calhoun.',
          'Su ministerio incluye apoyo espiritual personal y capellanía en RMC Hospital y la cárcel del condado.',
        ],
        highlightsTitle: 'Maneras en que este ministerio ofrece cuidado',
        highlights: [
          {
            id: 'language',
            title: 'Ministerio en español',
            description:
              'Las personas pueden hacer preguntas, pedir oración y conversar sobre asuntos espirituales en español.',
          },
          {
            id: 'pastoral-care',
            title: 'Cuidado pastoral',
            description:
              'La conversación compasiva y la guía espiritual acompañan temporadas de cambio, duelo, esperanza o incertidumbre.',
          },
          {
            id: 'chaplaincy',
            title: 'Capellanía comunitaria',
            description:
              'El cuidado se extiende más allá del edificio mediante el ministerio en RMC Hospital y la cárcel del condado.',
          },
          {
            id: 'connection',
            title: 'Conexión congregacional',
            description:
              'Las personas y familias de habla hispana son bienvenidas en la adoración y la vida comunitaria de toda la iglesia.',
          },
        ],
        featureEyebrow: 'Conozca a la ministra',
        featureTitle: 'Un ministerio formado por relaciones duraderas',
        featureCopy:
          'La historia de Maria con la congregación y su labor en el condado de Calhoun conectan el ministerio pastoral con una presencia práctica y compasiva.',
        features: [
          {
            id: 'maria',
            eyebrow: 'Ministra asociada de Ministerios Hispanos',
            title: 'Rev. Maria Zamarripa',
            description:
              'Maria forma parte de la Primera Iglesia Cristiana desde principios de la década de 1980, ingresó al Seminario Teológico de Lexington en 2016 y fue ordenada en 2020.',
            imageAlt: 'Retrato de la Rev. Maria Zamarripa',
          },
          {
            id: 'welcome',
            eyebrow: 'Un lugar para pertenecer',
            title: 'Conectado con toda la iglesia',
            description:
              'El ministerio hispano forma parte de una congregación comprometida con la hospitalidad abierta, la adoración compartida, el crecimiento espiritual y la dignidad de cada persona.',
            imageAlt: 'Área de bienvenida con materiales para visitantes, arte y banderas arcoíris',
          },
        ],
        ctaTitle: 'Inicie una conversación',
        ctaCopy:
          'Comuníquese con la iglesia para recibir cuidado espiritual en español o conozca más sobre la Rev. Maria Zamarripa y el personal de la congregación.',
        actions: [
          {
            id: 'contact-hispanic-ministry',
            destination: 'contact',
            label: 'Contactar a la iglesia',
          },
          { id: 'meet-the-staff', destination: 'staff', label: 'Conozca al personal' },
        ],
      },
      serviceAndOutreach: {
        eyebrow: 'La fe expresada mediante el cuidado',
        title: 'Servicio comunitario',
        description:
          'La iglesia sirve a sus vecinos mediante presencia pública, apoyo práctico, cuidado pastoral y espacios compartidos.',
        heroAlt:
          'Exterior de piedra de la Primera Iglesia Cristiana de Anniston junto a un árbol al atardecer',
        heroLabel: 'Sirviendo a Anniston y las comunidades cercanas',
        introEyebrow: 'Las manos y los pies de Dios',
        introTitle: 'El servicio comienza con relaciones y hospitalidad práctica',
        introduction: [
          'La Primera Iglesia Cristiana entiende la fe como cuidado compasivo, participación comunitaria, reconciliación y servicio.',
          'El servicio incluye participar en eventos públicos, responder a necesidades prácticas, cuidar a adultos mayores y hacer que el edificio sea útil para grupos comunitarios.',
          'Estos esfuerzos crecen mediante voluntarios, apoyo financiero, liderazgo pastoral y alianzas con personas fuera de la congregación.',
        ],
        highlightsTitle: 'Servicio comunitario actual',
        highlights: [
          {
            id: 'oxfordfest',
            title: 'Un puesto acogedor en Oxfordfest',
            description:
              'Miembros de la iglesia participan en Oxfordfest con un puesto que ofrece una presencia visible y oportunidades para conversar.',
          },
          {
            id: 'jsu',
            title: 'Apoyo para el grupo estudiantil LGBT de JSU',
            description:
              'La iglesia proporciona alimentos y meriendas al grupo LGBT de Jacksonville State University como expresión práctica de afirmación y cuidado.',
          },
          {
            id: 'older-adults',
            title: 'Cuidado pastoral para adultos mayores',
            description:
              'Los pastores ofrecen apoyo espiritual y presencia compasiva a adultos mayores de la comunidad.',
          },
          {
            id: 'space',
            title: 'Espacio para grupos comunitarios',
            description:
              'Durante la semana, la iglesia presta espacio a grupos que necesitan reunirse, organizarse, aprender o apoyarse.',
          },
        ],
        featureEyebrow: 'Hospitalidad más allá del domingo',
        featureTitle: 'Cuatro maneras en que la iglesia sirve actualmente',
        featureCopy:
          'Cada esfuerzo es diferente, pero los cuatro se basan en estar presentes, compartir recursos y tratar a los vecinos con dignidad.',
        features: [
          {
            id: 'oxfordfest',
            eyebrow: 'Presencia comunitaria',
            title: 'Oxfordfest',
            description:
              'Un puesto en Oxfordfest permite conocer a los vecinos, representar a la congregación en público y extender una invitación abierta a conectarse.',
          },
          {
            id: 'jsu',
            eyebrow: 'Afirmación práctica',
            title: 'Alimentos y meriendas para el grupo LGBT de JSU',
            description:
              'Apoyar a los estudiantes con alimentos y meriendas convierte la bienvenida en un acto tangible de cuidado para la comunidad LGBT de Jacksonville State University.',
          },
          {
            id: 'older-adults',
            eyebrow: 'Presencia pastoral',
            title: 'Cuidado para adultos mayores',
            description:
              'El cuidado pastoral ofrece escucha, oración, ánimo y compañía espiritual a adultos mayores de la comunidad.',
          },
          {
            id: 'space',
            eyebrow: 'Recursos compartidos',
            title: 'Espacio para grupos que lo necesitan',
            description:
              'El edificio sirve a la comunidad durante la semana al ofrecer espacio a grupos que necesitan un lugar práctico para reunirse.',
            imageAlt: 'Área de bienvenida con materiales para visitantes, arte y banderas arcoíris',
          },
        ],
        ctaTitle: 'Participe en el cuidado práctico',
        ctaCopy:
          'Pregunte sobre el voluntariado, apoye económicamente el servicio de la iglesia o comuníquese con la oficina para solicitar espacio.',
        actions: [
          { id: 'volunteer', destination: 'contact', label: 'Preguntar sobre voluntariado' },
          { id: 'give-to-outreach', destination: 'give', label: 'Donar en línea' },
          { id: 'space-request', destination: 'contact', label: 'Solicitar espacio' },
        ],
      },
    },
  },
};
