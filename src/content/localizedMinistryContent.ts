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
        title: 'Sunday Worship',
        description:
          'Worship begins at 11:30 a.m. with liturgy, prayer, scripture, music, preaching, and communion.',
        heroAlt:
          'The sanctuary of First Christian Church Anniston prepared for worship beneath the cross and stained glass',
        heroLabel: 'Sunday worship at 11:30 a.m.',
        introEyebrow: 'A shared rhythm of faith',
        introTitle: 'Worship makes room for welcome, reflection, and the Spirit’s guidance',
        introduction: [
          'At First Christian Church, Anniston, our worship service is primarily in English, with Spanish included regularly as part of our commitment to a more welcoming and inclusive worshiping community. For example, our Words of Institution are spoken in Spanish and translated into English in the order of worship.',
          'We believe the Kingdom of God is multicultural, multiracial, multilingual, multigenerational, and fully inclusive. We are always open to suggestions that help our worship better reflect that calling.',
          'Our service includes liturgy, prayer, scripture, music, and preaching. The music may include traditional hymns, contemporary songs, gospel music, and other styles. We also use visual elements such as videos when they support the theme of the day. At times, we worship outside in our Prayer Garden.',
          'Each service is shaped by the scripture for the day and by our desire to leave room for the Holy Spirit’s guidance. Above all, we want our worship to honor God and create space for each person to worship with sincerity.',
          'We celebrate communion every Sunday. As part of the Christian Church (Disciples of Christ), we understand the Lord’s Supper as one of the most unifying moments in worship.',
        ],
        highlightsTitle: 'What shapes Sunday worship',
        highlights: [
          {
            id: 'prayer',
            title: 'Prayer, scripture, and liturgy',
            description:
              'The service includes liturgy, prayer, scripture, preaching, and space to listen for God together.',
          },
          {
            id: 'language',
            title: 'A multilingual welcome',
            description:
              'Spanish is included regularly as part of the church’s commitment to a multicultural and multilingual worshiping community.',
          },
          {
            id: 'communion',
            title: 'Weekly communion',
            description:
              'All are welcome at Christ’s table as we remember and celebrate what God has done for all people through Jesus Christ.',
          },
          {
            id: 'music',
            title: 'Music and visual elements',
            description:
              'Traditional hymns, contemporary songs, gospel music, other styles, and occasional videos support the theme of the day.',
          },
        ],
        featureEyebrow: 'At the table and in song',
        featureTitle: 'People and practices that support worship',
        featureCopy:
          'Every service is shaped by scripture, careful preparation, collaborative leadership, and openness to the Holy Spirit’s guidance.',
        features: [
          {
            id: 'communion',
            eyebrow: 'An open table',
            title: 'Communion at the center',
            description:
              'The Lord’s Supper is one of the most unifying moments in worship. Everyone is welcome at Christ’s table as we remember and celebrate God’s love for all people through Jesus Christ.',
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
          'Plan your first visit or listen to recent sermons before you arrive. Worship begins Sundays at 11:30 a.m.',
        actions: [
          { id: 'plan-worship-visit', destination: 'visit', label: 'Plan your visit' },
          { id: 'listen-to-sermons', destination: 'sermons', label: 'Listen to sermons' },
        ],
      },
      wonderAndWorship: {
        eyebrow: 'Children are part of church life',
        title: 'Children’s Ministry',
        description:
          'Children are welcomed as full members of the worshiping community at First Christian Church, Anniston.',
        heroAlt: 'A church leader sharing a children’s moment with two children in the sanctuary',
        heroLabel: 'Children and families are welcome',
        introEyebrow: 'A child-friendly congregation',
        introTitle: 'Children do not have to be perfectly still to belong',
        introduction: [
          'First Christian Church, Anniston is a child-friendly congregation where children are welcomed as full members of the worshiping community.',
          'We are grateful for the babies, toddlers, children, and youth who are part of our church family. Whether your child is quiet, energetic, curious, shy, disabled, neurodivergent, or simply having a very normal hard morning, they are welcome here.',
          'Families with infants and young children are welcome to use the nursery when available, and children are also welcome to remain in worship. Parents and caregivers may step to the back of the sanctuary, walk with a child, or take a break as needed without feeling like they are disrupting the service.',
        ],
        highlightsTitle: 'A welcoming approach for children',
        highlights: [
          {
            id: 'belonging',
            title: 'Full members of worship',
            description:
              'Children are welcomed as participants in church life, not treated as an interruption to it.',
          },
          {
            id: 'activities',
            title: 'Room for normal mornings',
            description:
              'Children do not have to be perfectly still, perfectly quiet, or perfectly predictable to belong.',
          },
          {
            id: 'families',
            title: 'Support for families',
            description:
              'Parents and caregivers may use the nursery when available, remain in worship, step to the back, walk with a child, or take a break as needed.',
          },
          {
            id: 'welcome',
            title: 'Individual accommodations',
            description:
              'When possible, the church works with families around sensory needs, accessibility needs, dietary restrictions, and other accommodations.',
          },
        ],
        featureEyebrow: 'A place to grow',
        featureTitle: 'We adapt to the needs of our children',
        featureCopy:
          'Every child and every family is different. We do our best to make room for those differences with patience, flexibility, and care.',
        features: [
          {
            id: 'participation',
            eyebrow: 'During worship',
            title: 'Children belong in the sanctuary',
            description:
              'Please do not stay away because you are worried your child’s needs may not match what people sometimes expect in church. Children, like all people, are beloved creations of God.',
            imageAlt:
              'A church leader talking with children during a children’s moment in the sanctuary',
          },
          {
            id: 'welcome',
            eyebrow: 'Children and youth',
            title: 'Growing with our families',
            description:
              'Our children’s and youth ministry continues to grow and adapt as the needs of our families change. Through each season, our goal remains the same: to help young people know they are loved by God, welcomed by the church, and invited to participate in the life of the congregation.',
            imageAlt: 'The church welcome area with visitor materials, artwork, and rainbow flags',
          },
        ],
        ctaTitle: 'Make your family’s first Sunday simpler',
        ctaCopy:
          'Contact the church with questions about current nursery care, children’s programming, youth opportunities, or accommodations.',
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
        title: 'Adoración dominical',
        description:
          'El servicio de adoración comienza a las 11:30 a.m. con liturgia, oración, lectura bíblica, música, predicación y comunión.',
        heroAlt:
          'El santuario de la Primera Iglesia Cristiana de Anniston preparado para la adoración bajo la cruz y los vitrales',
        heroLabel: 'Adoración dominical a las 11:30 a.m.',
        introEyebrow: 'Un ritmo compartido de fe',
        introTitle:
          'La adoración crea espacio para la bienvenida, la reflexión y la guía del Espíritu',
        introduction: [
          'En First Christian Church, Anniston, nuestro servicio de adoración es principalmente en inglés, pero incluimos español con regularidad como parte de nuestro compromiso de ser una comunidad de fe más acogedora e inclusiva. Por ejemplo, nuestras Palabras de Institución se pronuncian en español y se traducen al inglés en el orden de adoración.',
          'Creemos que el Reino de Dios es multicultural, multirracial, multilingüe, multigeneracional y plenamente inclusivo. Siempre recibimos sugerencias que nos ayuden a reflejar mejor ese llamado en nuestra adoración.',
          'Nuestro servicio incluye liturgia, oración, lectura bíblica, música y predicación. La música puede incluir himnos tradicionales, canciones contemporáneas, música góspel y otros estilos. También usamos elementos visuales, como videos, cuando apoyan el tema del día. En algunas ocasiones, adoramos al aire libre en nuestro Jardín de Oración.',
          'Cada servicio se forma a partir de la escritura del día y de nuestro deseo de dejar espacio para la guía del Espíritu Santo. Sobre todo, queremos que nuestra adoración honre a Dios y cree un espacio donde cada persona pueda adorar con sinceridad.',
          'Celebramos la comunión todos los domingos. Como parte de la Iglesia Cristiana (Discípulos de Cristo), entendemos la Cena del Señor como uno de los momentos más unificadores de la adoración.',
        ],
        highlightsTitle: 'Lo que forma la adoración dominical',
        highlights: [
          {
            id: 'prayer',
            title: 'Oración, Escritura y liturgia',
            description:
              'El servicio incluye liturgia, oración, lectura bíblica, predicación y espacio para escuchar a Dios en comunidad.',
          },
          {
            id: 'language',
            title: 'Una bienvenida multilingüe',
            description:
              'Incluimos español con regularidad como parte del compromiso de ser una comunidad de adoración multicultural y multilingüe.',
          },
          {
            id: 'communion',
            title: 'Comunión semanal',
            description:
              'Todas las personas son bienvenidas a la mesa de Cristo mientras recordamos y celebramos lo que Dios ha hecho por todos a través de Jesucristo.',
          },
          {
            id: 'music',
            title: 'Música y elementos visuales',
            description:
              'Himnos tradicionales, canciones contemporáneas, música góspel, otros estilos y videos ocasionales apoyan el tema del día.',
          },
        ],
        featureEyebrow: 'En la mesa y en el canto',
        featureTitle: 'Personas y prácticas que apoyan la adoración',
        featureCopy:
          'Cada servicio se forma a partir de la Escritura, una preparación cuidadosa, liderazgo colaborativo y apertura a la guía del Espíritu Santo.',
        features: [
          {
            id: 'communion',
            eyebrow: 'Una mesa abierta',
            title: 'La comunión en el centro',
            description:
              'La Cena del Señor es uno de los momentos más unificadores de la adoración. Todas las personas son bienvenidas a la mesa de Cristo mientras recordamos y celebramos el amor de Dios por todos a través de Jesucristo.',
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
          'Planifique su primera visita o escuche sermones recientes antes de llegar. La adoración comienza los domingos a las 11:30 a.m.',
        actions: [
          { id: 'plan-worship-visit', destination: 'visit', label: 'Planifique su visita' },
          { id: 'listen-to-sermons', destination: 'sermons', label: 'Escuchar sermones' },
        ],
      },
      wonderAndWorship: {
        eyebrow: 'Los niños son parte de la vida de la iglesia',
        title: 'Ministerio infantil',
        description:
          'Los niños son recibidos como miembros plenos de la comunidad de adoración en First Christian Church, Anniston.',
        heroAlt: 'Una líder de la iglesia compartiendo un momento infantil con dos niños',
        heroLabel: 'Los niños y las familias son bienvenidos',
        introEyebrow: 'Una congregación acogedora para los niños',
        introTitle: 'Los niños no tienen que quedarse perfectamente quietos para pertenecer',
        introduction: [
          'First Christian Church, Anniston es una congregación acogedora para los niños, donde son recibidos como miembros plenos de la comunidad de adoración.',
          'Damos gracias por los bebés, niños pequeños, niños y jóvenes que forman parte de nuestra familia de iglesia. Ya sea que su hijo sea tranquilo, enérgico, curioso, tímido, discapacitado, neurodivergente o simplemente esté teniendo una mañana difícil muy normal, aquí es bienvenido.',
          'Las familias con bebés y niños pequeños pueden usar la guardería cuando esté disponible, y los niños también son bienvenidos a permanecer en la adoración. Los padres y cuidadores pueden pasar a la parte de atrás del santuario, caminar con un niño o tomar un descanso según sea necesario sin sentir que interrumpen el servicio.',
        ],
        highlightsTitle: 'Una manera acogedora de acompañar a los niños',
        highlights: [
          {
            id: 'belonging',
            title: 'Miembros plenos de la adoración',
            description:
              'Los niños son recibidos como participantes en la vida de la iglesia, no como una interrupción.',
          },
          {
            id: 'activities',
            title: 'Espacio para mañanas normales',
            description:
              'Los niños no tienen que estar perfectamente quietos, perfectamente callados o perfectamente predecibles para pertenecer.',
          },
          {
            id: 'families',
            title: 'Apoyo para las familias',
            description:
              'Los padres y cuidadores pueden usar la guardería cuando esté disponible, permanecer en la adoración, pasar atrás, caminar con un niño o tomar un descanso cuando sea necesario.',
          },
          {
            id: 'welcome',
            title: 'Adaptaciones individuales',
            description:
              'Cuando sea posible, la iglesia trabaja con las familias para apoyar necesidades sensoriales, accesibilidad, restricciones alimentarias y otras adaptaciones.',
          },
        ],
        featureEyebrow: 'Un lugar para crecer',
        featureTitle: 'Nos adaptamos a las necesidades de nuestros niños',
        featureCopy:
          'Cada niño y cada familia son diferentes. Hacemos lo posible para dar espacio a esas diferencias con paciencia, flexibilidad y cuidado.',
        features: [
          {
            id: 'participation',
            eyebrow: 'Durante la adoración',
            title: 'Los niños pertenecen en el santuario',
            description:
              'Por favor, no deje de venir porque le preocupe que las necesidades de su hijo no coincidan con lo que a veces se espera en la iglesia. Los niños, como todas las personas, son creaciones amadas de Dios.',
            imageAlt: 'Una líder de la iglesia conversando con niños durante un momento infantil',
          },
          {
            id: 'welcome',
            eyebrow: 'Niños y jóvenes',
            title: 'Crecemos con nuestras familias',
            description:
              'Nuestro ministerio infantil y juvenil sigue creciendo y adaptándose conforme cambian las necesidades de nuestras familias. En cada temporada, nuestra meta es la misma: ayudar a los jóvenes a saber que Dios los ama, que la iglesia los recibe y que están invitados a participar en la vida de la congregación.',
            imageAlt: 'Área de bienvenida con materiales para visitantes, arte y banderas arcoíris',
          },
        ],
        ctaTitle: 'Facilite el primer domingo de su familia',
        ctaCopy:
          'Comuníquese con la iglesia si tiene preguntas sobre guardería, programación infantil, oportunidades para jóvenes o adaptaciones disponibles actualmente.',
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
