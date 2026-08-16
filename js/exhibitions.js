// ============================================
// OMMFA 展览数据库
// 一个文件装全部展览，key 用 projects.js 里的 id
//
// 这个文件回答两个问题：
//   1. 某个展览有哪些艺术家（项目页底部的格子间）
//   2. 某个艺术家参加过哪些展（信封右侧标签，自动算出，不用手写）
//
// ---- 排序 ----
// 默认按姓名 A–Z 自动排，不用写 order。
// 想手动指定顺序才加 order 数组，加了就以 order 为准。
//
// ---- 顶层字段 ----
// label         信封标签上的短文字，越短越好（"LDF"）
// title         展签卡最上面那行，CSS 会强制转大写，建议不超过 20 字符
// performances  演出时间表。没有这个字段整块就不显示
// artists       key 必须和 artists.js 的 id 完全一致（含空格和大小写）
//
// ---- 单个艺术家条目的完整写法 ----
//   "某某某": {
//     work:       "参展作品标题",
//     medium:     "Oil on canvas",
//     dimensions: "100 × 80 cm",
//     year:       "2026",
//     note:       "展签文字，一到三句",
//     items: [
//       { src: "ldf2026-theway/work-01.webp", w: 34, rotate: -4, desc: "作品名, 2026" },
//     ]
//   },
//
// ---- items 里每个物件 ----
// src      文件名，相对 assets/images/artist/<艺术家id>/
// w        宽度 %（20-50 合适）
// x, y     位置 %（可省略，省略则自动打散）
// rotate   倾斜角度（可省略，省略则微随机）
// desc     放大后显示的说明文字
// gallery  可选。一张图背后挂一串图，点开可左右翻。散落区仍只占一张
// link     可选。放大后底部说明变成可点的外链，新标签页打开
//
// 视频和 3D：
//   { type: "video", vimeo: "123456789", sound: true, w: 30, desc: "…" }
//   { type: "video", youtube: "-CF39_UFRyM", w: 30, desc: "…" }
//   { type: "model", src: "ldf2026-theway/work.glb", poster: "m-cover.webp", w: 40 }
//
// ---- 重要 ----
// 散落物最多放 4 到 5 件，超过就糊成一坨。
// 一件作品有很多张记录照的用 gallery，不要往散落区堆。
// ============================================

const EXHIBITIONS = {

  "london-design-festival-2026": {
    label: "LDF",
    title: "THE WAY, LDF 2026",

    // ---- 演出时间表 ----
    // 日期见下方注释，改 date 一处即可
    performances: [
      { artist: "Yuyang Zhou", work: "Kayak_Joey", date: "18 September", time: "18:40 - 19:10", duration: "30 min", note: "" },
      { artist: "Chadzing Kung", work: "Nullorce", date: "18 September", time: "19:30 - 19:35", duration: "5 min", note: "" },
      { artist: "Zhiqiang Li", work: "Queer Touch", date: "18 September", time: "20:00 - 20:30", duration: "30 min", note: " " },
    ],


    artists: {

      "Agak-Agak Unit": {
        work: "Agak-Agak",
        medium: "Wood, metal, images. Handcrafted rulers, chairs, weights and interactive objects",
        dimensions: "Chairs 50–60 × 70–80 × 50–60 cm each; other objects variable",
        year: "2026",
        note: "Agak-Agak, a Malay term meaning “roughly” or “approximately,” explores the shift from bodily intuition to standardised measurement. Through handcrafted rulers, weights, hourglasses, and interactive objects, the project proposes an alternative system based on touch and instinct. Rather than rejecting accuracy, it asks whether intuitive, embodied knowledge can be equally meaningful, challenging our reliance on numbers and external standards.",
        posters: [
          { src: "ldf2026-theway/Agak-Agak Unit_IG_1.webp", desc: " " },
          { src: "ldf2026-theway/Agak-Agak Unit_IG_2.webp", desc: " " },
        ],
        items: []
      },

      "Ai Deng": {
        work: "Tree! Tree! Tree!",
        medium: "Twigs, plaster bandage, paper, with artist's book",
        dimensions: "Approx. 160 × 200 × 200 cm, variable and site-responsive",
        year: "2025",
        note: "In Tree! Tree! Tree!, Ai Deng explores stability through balancing fallen branches, paralleling the uncertainty faced by young adults entering society. Combining twigs with plaster, Deng creates temporary structures sustained by leaning, pressure, and mutual dependence. Rather than overcoming instability, the work embraces it, redefining balance not as standing independently, but as a way of continuing while leaning.",
        items: []
      },

      "Aida Pouryeganeh": {
        work: "Panopticon series (four works)",
        medium: "Acrylic and charcoal on canvas",
        dimensions: "22 × 30 cm each",
        year: "2024",
        note: "This series explores the Panopticon as a global condition of observation, control, and internalised surveillance. Through repetition, fragmentation, obscured forms, and shifting visibility, Aida Pouryeganeh examines how the possibility of being watched can alter behaviour and self-perception. Her paintings hold the tension between watching and being watched, where the observer remains unseen but continuously present.",
        items: []
      },

      "Ben Adamson": {
        work: "Toil and Beauty",
        medium: "Plaster, clay, expanding foam, chalk, wood",
        dimensions: "200 × 300 cm (floor footprint)",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/ben poster-2-ins.webp", desc: " " },
          { src: "ldf2026-theway/ben poster-1-ins.webp", desc: " " },
        ],
        note: "Toil and Beauty explores shifting ideas of work and labour in the UK amid AI and rising unemployment. Through three generations of men, it examines how labour shapes identity, purpose, creativity, and masculinity. Chain-like forms reference a great-grandfather’s work as a chainmaker, breads a grandfather’s bakery, while chalk and footprints evoke a father’s work as choreographer and lecturer.",
        items: []
      },

      "Chadzing Kung": {
        work: "Nullorce",
        medium: "Performance. Laptop, SSL 2+, sensors, stainless-steel flute installation",
        dimensions: "20–30 min",
        year: "2026",
        note: "Chadzing Kung is a London-based sound artist, producer, musician, DJ, and curator working across experimental sound, live performance, and installation.<br><br>Drawing from underground music scenes and contemporary sound practices, his work explores embodiment, instability, cultural memory, and the tensions between intimacy, desire, and social norms. Through electronic composition, sensor-based systems, performance structures, and spatial listening, he investigates how sound can reveal forms of vulnerability, resistance, and marginalised experience.<br><br>Moving between experimental electronics, club music, and interdisciplinary performance, Chadzing creates immersive sonic environments that blur the boundaries between physical action, emotional states, and technological systems.",
        items: []
      },

      "Chiemi Haraguchi": {
        work: "Doodle Scroll",
        medium: "Tracing paper, ink",
        dimensions: "50 m × 30 cm",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/chiemi poster-2-ins.webp", desc: " " },
          { src: "ldf2026-theway/chiemi poster-1-ins.webp", desc: " " },
        ],
        note: "Berlin-based Japanese-Indonesian artist Chiemi Haraguchi’s Doodle Scroll transforms the digital habit of doom-scrolling into intuitive mark-making. Using a fifty-metre roll of tracing paper, she creates an unfolding, wordless visual journal that records daily emotions through lines and shapes. Deliberately unfinished, the work translates fleeting internal noise into a tangible, lasting physical record.",
        items: []
      },

      "Elina Browerman": {
        work: "Pinned to Bloom",
        medium: "Photographic print",
        dimensions: "50 × 75 cm",
        year: "2025",
        posters: [
          { src: "ldf2026-theway/Elina-ins-2.webp", desc: " " },
          { src: "ldf2026-theway/Elina-ins-1.webp", desc: " " },
        ],
        note: "Pinned to Bloom (from the series Recalibration of Memory) is a contemporary, ironical reactivation of the seventeenth-century Baroque still-life tradition, exploring how home and identity are reconstructed after a permanent geographic shift. The work rests on a profound, unnoticed turn in the artist's career path: the moment when her own eyesight began to change. Instead of fighting for frictionless digital perfection, she took an ordinary fork in the road. She leaned into the blur.<br><br>Rather than correcting the warped light and optical aberrations of her grandfather's 1950s Soviet Helios lens, which once witnessed her childhood in Leningrad, she mounted it onto a modern digital sensor to capture her current environment in Western Canada. This pairing allows the sharp precision of the present to meet the soft, swirly memory fog of the past.<br><br>In this specific piece, a solitary, vivid orange-red tulip is rooted in an exposed bulb and pierced cleanly with dressmaker pins. Resting atop a stack of aged books beside a delicate strand of pearls under a dramatic, moody beam of blue light, the composition maps a quiet internal redirection. It captures the precise, non-linear moment where an immigrant stops searching for nostalgia and begins using local flora and discarded histories as a map for navigation.",
        items: []
      },

      "Fatima Ezzahra Rezqi": {
        work: "Edinburgh, When The Sun Finds Her",
        medium: "Acrylic on canvas",
        dimensions: "32 × 40 in",
        year: "2025",
        posters: [
          { src: "ldf2026-theway/Fatima Ezzahra Rezqi_ig.webp", desc: " " },
          { src: "ldf2026-theway/Fatima Ezzahra Rezqi_ig_2.webp", desc: " " },
        ],
        note: "Moroccan-born, Cambridge-based artist Fatima Ezzahra Rezqi uses colour and texture as a non-verbal language to process memory, landscapes, and lived experience. Edinburgh, When The Sun Finds Her reflects on the artist’s former home, exploring the emotional and environmental resonance of a place once inhabited.",
        items: []
      },

      "Feng Zhao": {
        work: "When we talk about the home",
        medium: "Digital print",
        dimensions: "Size Various",
        year: "2025",
        posters: [
          { src: "ldf2026-theway/ZhaoFeng_ig_1.webp", desc: " " },
          { src: "ldf2026-theway/ZhaoFeng_ig_2.webp", desc: " " },
        ],
        note: "[Name] is a London-based artist working through what she calls 'poetic illustration', turning emotions that resist description into objects and single-image narratives. Her work traces the small moments that shape a person: fragments left by family, school and society that resurface mid-conversation or while walking through the city, arriving like scenes from a film she did not know she had stored. Her past self appears as a worn-out toy, watching a household change while holding memories of substitution and neglect. Her present self is a hot-air balloon, its head swelling with the city's noise until it drifts apart from the crowd. Moving to London marked a quiet turning point. In looking for identity and self-recognition, she has begun to find a way towards home, understood less as a place than as a direction.",
        items: []
      },

      "Gianluca Iadema": {
        work: "From, maybe to: Prelude",
        medium: "Audiovisual, 3D animation with sound",
        dimensions: "Variable (screen-based)",
        year: "2024",
        posters: [
          { src: "ldf2026-theway/gianluca-ins-2.webp", desc: " " },
          { src: "ldf2026-theway/gianluca-ins-1.webp", desc: " " },
        ],
        note: "From, maybe To: Prelude is a 3D audiovisual short film exploring memory as a transformative force through the fictional reimagining of a piano. The instrument fragments and reforms as a speculative entity and metaphorical memory machine. Blending visual and sonic transformations, the work explores perception, reality, fracture, and infinite possibility, where memory becomes both presence and resistance.",
        items: []
      },

      "Huilin Li": {
        work: "Silent Time",
        medium: "Metal wire, recycled yarn and fabric",
        dimensions: "135 × 115 × 1 cm; 42 × 32 × 1 cm",
        year: "2025–2026",
        posters: [
          { src: "ldf2026-theway/Huilin Li_IG_1.webp", desc: " " },
          { src: "ldf2026-theway/Huilin Li_IG_2.webp", desc: " " },
        ],
        note: "Huilin Li turned to crochet to navigate anxiety and uncertainty as life seemed to lose its clear direction. Created row by row during periods of stillness, Silent Time reflects the quiet relationship between repetitive handwork and inner calm. Though the future remains uncertain, the work embraces moments of stillness as necessary spaces for rest and reflection.",
        items: []
      },

      "Jianqiang (Vincent) Xia": {
        work: "Boundary",
        medium: "Ceramic",
        dimensions: "30 × 28 x 10 cm",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/xia -1-ins.webp", desc: " " },
          { src: "ldf2026-theway/xia -2-ins.webp", desc: " " },
        ],
        note: "Ceramic boundary structures suspended between solidity and void, where folds and fractures let emptiness itself be perceived - form asked whether it can still make space once function is removed.",
        items: []
      },

      "Jie Dong": {
        work: "Ripple",
        medium: "Oil on semi-transparent fabric, sewn pearls",
        dimensions: "145 × 95 cm",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/Jie Dong_IG_1.webp", desc: " " },
          { src: "ldf2026-theway/Jie Dong_IG_2.webp", desc: " " },
        ],
        note: "Jie Dong’s work maps the dispersing traces of emotion through semi-transparent fabric and water-like ripples. Sewn plastic and hand-painted pearls create tension between physical objects and illusion, with each bead suggesting a pause or repair. Through stitching, repetition, and shifting light, the work explores how the body retains memories the mind cannot yet process.",
        items: []
      },

      "Joy Wang": {
        work: "Moisture",
        medium: "Single-channel moving image with sound",
        dimensions: "Variable (screen-based)",
        year: "2024",
        posters: [
          { src: "ldf2026-theway/Joy wang_IG_1.webp", desc: " " },
          { src: "ldf2026-theway/Joy wang_IG_2.webp", desc: " " },
        ],
        note: "Moisture documents the slow spread of mold through humid built environments using close-up moving image and sound. Focusing on seepage, accumulation, and subtle material change, the work explores how mold gradually redraws spatial boundaries. It reflects on how environments are shaped not only by human order, but also by non-human growth, movement, and persistent traces.",
        items: []
      },

      "Kengo Horikoshi": {
        work: "Celebration of Individuality",
        medium: "Mild steel and glass, displayed with a fresh flower",
        dimensions: "50 × 50 × 50 cm",
        year: "2024",
        note: "Kengo Horikoshi explores how individuals, like flowers, can be overlooked when perceived through groups and social categories. His single-flower vase allows one bloom to stand alone, encouraging close observation of its unique character. The work serves as a metaphor for individuality, questioning how nationality, age, education, and social roles can obscure personal values, feelings, dreams, and identity.",
        items: []
      },

      "Laia Sarukhan": {
        work: "Paths",
        medium: "Photographic print",
        dimensions: "91 × 61 cm",
        year: "2025",
        posters: [
          { src: "ldf2026-theway/Laia Sarukhan_IG_1.webp", desc: " " },
          { src: "ldf2026-theway/Laia Sarukhan_IG_2.webp", desc: " " },
        ],
        note: "Taken on the hiking trails of Sedona, Arizona, this photograph explores the geometry of lines and the sensation of movement toward the curving mountain horizon. Framed by the camera lens hood like an opening eyelid, the image invites viewers to follow the path or depart from it, encouraging wandering, exploration, and alternative ways of seeing.",
        items: []
      },

      "Margaret Bruton": {
        work: "Fractured Arrow",
        medium: "Digital print, framed",
        dimensions: "62 × 52 × 1.2 cm",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/Margaret Bruton_IG.webp", desc: " " },
          { src: "ldf2026-theway/Margaret Bruton_IG_2.webp", desc: " " },
        ],
        note: "South African-born, UK-based artist Margaret Bruton works from a floating studio on London’s River Thames. Her practice explores transition, resilience, and connection, shaped by the studio’s spatial constraints and surrounding tides. Fractured Arrow explores direction and disruption through a broken arrow, symbolising interrupted movement and lost guidance, and the tension between progress, instability, and disorientation.",
        items: []
      },

      "Maxim Lester": {
        work: "OEM throw blanket for couch",
        medium: "Mass-produced printed blanket, mixed media",
        dimensions: "160 × 75 × 120 cm",
        year: "2025",
        posters: [
          { src: "ldf2026-theway/maxim poster-1-ins.webp", desc: " " },
          { src: "ldf2026-theway/maxim poster-2-ins.webp", desc: " " },
        ],
        note: "An oversized furniture piece built from a mass-produced Alibaba blanket printed with England's white cliffs, tracing how cultural meaning thins as goods move through global supply chains.",
        items: []
      },

      "Millieon Hu": {
        work: "My Way",
        medium: "Single-channel video with sound",
        dimensions: "16:9, 1280 × 720, 1'28\" loop",
        year: "2026",
        note: "An AI-reconstructed drive through Chongqing paired with a grandmother's cloned voice shifting across dialect, Mandarin and English, sitting where memory and machine reconstruction blur.",
        items: []
      },

      "Muchuan": {
        work: "Shore of the Labyrinth, the Sky at Dawn",
        medium: "Found objects and moving image",
        dimensions: "Dimensions variable",
        year: "2025-2026",
        note: "Muchuan is an artist working between found object, arrangement and landscape image. The practice centres on cheap household commodities coloured in bright fluorescent neon, and on the people who handle them, who first-hand research finds to be close to invisible. Busy pattern and strong colour that ought to be conspicuous instead hold a liminal position, and it is this trick of disappearance that the work follows, connecting the invisible figures in the landscape to the Zomia highlands of Southeast Asia and their history of retreat into mountain and forest. Working from contour surveys made around the Ban Gioc-Detian Falls, Muchuan recategorises small objects into the elements of a hill landscape and arranges them into new terrain.",
        items: []
      },

      "Nadiia Rom": {
        work: "Somewhere near the Romanian border",
        medium: "Oil on canvas",
        dimensions: "60 × 50 cm",
        year: "2024",
        posters: [
          { src: "ldf2026-theway/poster_ins_Cover.webp", desc: " " },
          { src: "ldf2026-theway/poster_ins.webp", desc: " " },
        ],
        note: "In Somewhere near the Romanian border, Ukrainian-born, London-based artist Nadiia Rom examines themes of transit, displacement, and uncertainty. Drawing from her background in architecture, Rom constructs compositions that navigate the physical and psychological roads she has travelled. The artwork reflects the inherent unpredictability of journeys, whether by car, train, or plane, and the ambiguity of what lies ahead. Having relocated to the UK in 2023, Rom utilises her practice to process continuous movement. Rather than depicting a fixed destination, the piece captures the transient state of being in motion, mapping the unknown paths that unfold around each corner.",
        items: []
      },

      "Polina Filippova": {
        work: "Ashley I–II",
        medium: "LED screens, sensors, moving image on silicone",
        dimensions: "73 × 43 × 2.5 cm each, in loop",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/polinafilippova-1.webp", desc: " " },
          { src: "ldf2026-theway/polinafilippova-2.webp", desc: " " },
        ],
        note: "Moving image projected onto silicone, tracing the reorientation from enduring pain in silence to questioning why it was ever endured.",
        items: []
      },

      "Qi Shi": {
        work: "Where Our Orbits Meet",
        medium: "Latex membrane, embedded magnetic rubber, magnetic gloves",
        dimensions: "70 × 150 cm",
        year: "2026",
        note: "Where Our Orbits Meet explores how invisible forces shape human relationships. Using magnetic rubber embedded within latex structures, the work materialises subtle interactions between bodies across a shared surface.<br><br>Inspired by cosmologies where relationships are guided by unseen alignments rather than direct contact, the installation invites two participants to activate the work simultaneously. As magnetic forces interact, the surface shifts and vibrates, visualising a field that is normally imperceptible.",
        items: []
      },

      "R James Healy": {
        work: "Made in Strathcona: CRAB Park",
        medium: "Plastic, metal, electronics",
        dimensions: "53 × 46 × 46 cm (zoetrope); 10 × 36 × 36 cm (lamp)",
        year: "2022",
        posters: [
          { src: "ldf2026-theway/R James Healy_IG_1.webp", desc: " " },
          { src: "ldf2026-theway/R James Healy_IG_2.webp", desc: " " },
        ],
        note: "Conceived in 2014 following R James Healy's relocation to Vancouver to work on a VFX feature film, this body of work examines themes of transience and site-specific observation. Initiated as the film production wrapped and his visa approached expiration, the project emerged from a desire to document his immediate environment during a period of geographic flux.<br><br>Based in Strathcona on Vancouver's east side, Healy's engagement with the coastal landscape was defined by the industrial presence of the nearby container port, visible and audible from his residence. CRAB Park, situated directly north of the neighbourhood, provided a panoramic vantage point overlooking the port's daily operations, where multi-coloured shipping containers were continuously shifted and stacked in a manner reminiscent of a geometric puzzle.<br><br>Realised over a seven-year period, during which Healy resided across four countries and more than seven towns and cities, the shipping container evolved into both the primary visual subject and central thematic metaphor of the work, bridging global freight logistics with personal mobility and displacement.",
        items: []
      },

      "Rachel Romanowsky": {
        work: "Where the Lupins Grow",
        medium: "Oil on canvas with embedded materials",
        dimensions: "132 × 142 cm",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/rachel poster-1.webp", desc: " " },
          { src: "ldf2026-theway/rachel poster-2.webp", desc: " " },
        ],
        note: "A large oil painting of a boy crossing a threshold into a garden, holding the moment just before meaning settles, when a quiet passage is only later recognised as significant.",
        items: []
      },

      "Sarunas Berinas": {
        work: "Compulsion",
        medium: "Leather, steel, electrics",
        dimensions: "30 × 20 × 60 cm",
        year: "2025",
        note: "A wearable sculpture that redirects gestures of care through a mechanical apparatus, staging the unstable moment when protection tips into control.",
        items: []
      },

      "Sijie Lyu": {
        work: "Getting Lost in the Wood",
        medium: "Archival pigment print, hand-crafted glass, audio",
        dimensions: "Variable; glass 18 × 13 × 1.2 cm and 20 × 19 × 1 cm; print 40 × 30 cm",
        year: "2022",
        note: "Getting Lost in the Wood is a spatial narrative inspired by Wilhelm Hauff's nineteenth-century fairy tale The Cold Heart and the disappearing glassmaking traditions of Germany's Black Forest.<br><br>The work begins with an ordinary decision: a charcoal burner chooses to leave his inherited trade and become a glassmaker. At the time, the choice appears insignificant, yet it quietly redirects his life. From that moment, a different relationship with the forest unfolds, one shaped by craft, light, ritual and imagination.<br><br>Through architectural fragments, handmade glass objects, drawings and material experiments, the project reimagines this unnoticed turning point as an immersive spatial experience. Glass is no longer treated as a transparent building material, but as a medium capable of reflection, distortion, concealment and transformation. Traditional craft becomes a way of remembering, while architecture becomes a space where forgotten stories continue to evolve.<br><br>Rather than portraying a dramatic moment of change, Getting Lost in the Wood reflects on how our lives are often transformed by quiet decisions whose significance only becomes visible in retrospect. Sometimes, getting lost is not losing the way, it is discovering another one.",
        items: []
      },

      "Sue Kite": {
        work: "The Bridge; The Riverbank",
        medium: "Oil on canvas board, framed",
        dimensions: "53 × 53 cm and 54 × 54 cm framed",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/Sue Kite_IG_1.webp", desc: " " },
          { src: "ldf2026-theway/Sue Kite_IG_2.webp", desc: " " },
        ],
        note: "Sue Kite's series of atmospheric riverscapes transitions from tangible horizons into deconstructed memory, exploring both natural and creative processes. The work reflects the river's dual nature, where apparent stillness conceals an unpredictable force. As the sequence progresses, traditional perspective dissolves into fractured light and sweeping brushstrokes.<br><br>The Bridge utilises heavy impasto to present a semi-realist starting point, suggesting an uncertain journey ahead. In The Riverbank, physical boundaries collapse into abstract blocks of light and unresolved memory, submerging the viewer in reflection. Ultimately, the series culminates in a complete surrender to fluid uncertainty.",
        items: []
      },

      "Suwei Xia": {
        work: "Not Inside",
        medium: "Pâte de verre, glass, sixpence coins",
        dimensions: "Variable, approx. 3–6 cm each",
        year: "2025–present",
        posters: [
          { src: "ldf2026-theway/suwei-ins-1.webp", desc: " " },
          { src: "ldf2026-theway/suwei-ins-2.webp", desc: " " },
        ],
        note: "Small pâte de verre houses with sixpence coins fired into the glass, structures that are neither home nor Other but forms of distance and looking.",
        items: []
      },

      "Tyrone Moreno": {
        work: "BFEC",
        medium: "Paint on plywood",
        dimensions: "90 × 122 × 1.2 cm",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/Tyrone Moreno_IG.webp", desc: " " },
          { src: "ldf2026-theway/Tyrone Moreno_IG_2.webp", desc: " " },
        ],
        note: "A large painting built through many layers, mistakes and changes of mind, to show the human experience of embracing those mistakes, sometimes painting over them, sometimes not, and exploring how disorder can become its own form of resolution.",
        items: []
      },

      "Xinde Ren": {
        work: "All That Was Pursued Was Assumed To Be A Source Of Happiness",
        medium: "Aluminium composite material, oil paint, acrylic, markers and pencils",
        dimensions: "120 × 80 × 0.3 cm",
        year: "2026",
        posters: [
          { src: "ldf2026-theway/xinde poster-1-ins.webp", desc: " " },
          { src: "ldf2026-theway/xinde poster-2-ins.webp", desc: " " },
        ],
        note: "In All That Was Pursued Was Assumed To Be A Source Of Happiness, Xinde Ren uses airbrush on a machine-cut aluminium composite panel to create a complex, saturated composition. The layered surface visually echoes the Vajra Sutra's description of life as dreams, illusions, and bubbles. Rendered on an industrial substrate, these cosmic forms underscore Ren's exploration of the tension between contemporary cyber isolation and the human search for elemental connection.<br><br>The work documents a cognitive pivot in the artist's conceptual trajectory. Moving away from nihilistic paralysis induced by viewing existence as a fleeting illusion, Ren signals a deliberate acceptance of transience. Rather than retreating from the dreamlike nature of reality, the composition confronts it, proposing active participation within the illusion. It maps an ideological realignment where the artist embraces fate, utilising the act of painting to process and navigate existential friction.",
        items: []
      },

      "Yiming Sun": {
        work: "Speed = Distance/Time",
        medium: "Installation and artist book",
        dimensions: "Burning apparatus 28 × 32 × 50 cm; book A5; framed pages 26 × 35 cm",
        year: "2025",
        note: "A book that appears only as it is destroyed. Sun collected thermal-paper receipts across London supermarkets, restaurants and stations, then bound them with silver-plated copper wire so the pages could be heated without the binding burning away. A candle beneath the frame inscribes the paper slowly, in the reverse of the instant printing the material was made for. The book opens face down above a mirror and is read as its own reflection, and every touch of a finger begins to erase what has just appeared.",
        items: []
},

      "Yixuan You": {
        work: "OUCH",
        medium: "Moving image projected onto silicone embedded with wool",
        dimensions: "Silicone 73 × 50 × 0.2 cm; video 3 min",
        year: "2024",
        posters: [
          { src: "ldf2026-theway/poster_ins_cover.webp", desc: " " },
          { src: "ldf2026-theway/poster_ins.webp", desc: " " },
        ],
        note: "Prompted by a severe episode of menstrual pain, Yixuan You began questioning the cultural moralisation of endurance, particularly within a Chinese context where pain is often internalised rather than treated. Her project translates collected descriptions of physical suffering into four moving images corresponding to established pain scales. These visuals are projected onto hand-crafted silicone surfaces embedded with wool, mimicking human skin and vascular systems. Accompanied by pain classification cards, this material configuration renders internal sensations outwardly visible. By transforming subjective pain into a shared visual condition, You's installation challenges the dismissal of pain and its reduction into measurable categories.",
        items: []
      },

      "Yujia Yang": {
       work: "The Blackout Night",
       medium: "Mixed media: watercolour, water-soluble crayon and pastel, coloured pencil, ink",
       dimensions: "30 x 30 cm",
       year: "2025",
       posters: [
          { src: "ldf2026-theway/poster-ins-1.webp", desc: " " },
          { src: "ldf2026-theway/poster-ins-2.webp", desc: " " },
        ],
       note: "A picture book built from the power cuts of a 2000s Chinese childhood. When the electricity failed, homework stopped and the children went out: hopscotch, hide-and-seek, ghost stories, shadow puppets. Yang draws that dark as the opposite of frightening, filling it with small ghosts who come out to play, candle wax that turns to magma, and shadow horses summoned to carry the children across it. The book ends on a wish for the next blackout.",
       items: []
     },


      "Yuyang Zhou": {
        work: "Kayak_Joey",
        medium: "Performance. Laptop, live coding",
        dimensions: "30 min",
        year: "2026",
        note: "Joey (Yuyang Zhou) is a live coder and performance artist working with algorithm as medium, alongside hardware instruments of their own making. Performances have taken place at the V&amp;A, London, Corsica Studios, and TANK Shanghai, among others.<br><br>Each performance begins from nothing. Sound is grown slowly in the room and then allowed to die away, with improvisation and process held as constitutive rather than incidental. Joey treats the set as a transparent form of digital labour, one in which the mental effort remains visible, and as a way of reclaiming within the cold logic of the algorithm the uncertainty, error and unrepeatable liveness that belong to a human maker.",
        items: []
      },

      "Zhiqiang Li": {
        work: "Queer Touch",
        medium: "Performance. Wearable interactive glove",
        dimensions: "5 min",
        year: "2026",
        note: "Queer Touch is an interactive glove that turns distance into sound. When the wearer moves their hand closer to or further away from an object, the glove responds through changing tones, allowing touch to happen before physical contact.<br><br>The work began from a small but important shift in the artist's own practice: the realisation of not only wanting to look at cultural objects from a distance, but to understand whether the body could become another way of seeing. This quiet turn changed the direction of the research, moving it from visual observation towards touch, proximity, sound and embodied encounter.<br><br>In Queer Touch, the hand becomes a listening instrument. Distance is no longer empty space, but a sensitive field between body and object. The work asks how history might be approached not only through sight, but through hesitation, closeness, movement and vibration. It is a way into the object, a way out of passive looking, and a way toward another form of connection.",
        items: []
      },

      "zhiying Chen": {
        work: "In Passing",
        medium: "Screen, book, camera",
        dimensions: "1 × 1 m (variable)",
        year: "2024",
        note: "Watching and being watched have become embedded within the routines of everyday life. As we move through cities, walking, waiting and passing by, our presence is continuously identified, recorded and translated into data. Gradually, we shift from active participants in public space to information that can be read, analysed and defined.<br><br>Set within a disused railway waiting room, In Passing considers the threshold between moving through a space and becoming part of a system of observation. As visitors cross the doorway, they unknowingly transition from passer-by to observed subject. The work is less concerned with surveillance itself than with the moment we realise that being seen has already become a condition of everyday life.",
        items: []
      },

      "Zishi Tu (Yuxi Chen)": {
        work: "Codename: O",
        medium: "Wood, resin, servos",
        dimensions: "50 × 50 × 15 cm",
        year: "2026",
        note: "In Codename: O, Zishi Tu presents a mechanical installation engaged in a continuous cycle of separation and reconstruction. Driven by a servo-controlled structure, the work shifts repeatedly between scattered fragments and a recognisable figure. Tu focuses on the quiet threshold where disconnected forms momentarily coalesce into an image, often recognised by the audience just as it begins to dissolve. Upon reassembly, the character shifts states, utilising two masks to mark the subtle differences of each return. Imagined as a creature from a machine-generated alternative reality, the piece engages in a fragmented, unstable exchange of observation with the viewer.",
        items: []
      },

    }
  },

  // ---- 以后加新展览，复制下面这块 ----
  //
  // "the-wrong-biennale": {
  //   label: "WRONG",
  //   title: "Channels, The Wrong 8th",
  //   artists: {}
  // },

};
