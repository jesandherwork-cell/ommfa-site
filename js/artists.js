// ============================================
// OMMFA 合作艺术家数据库
// 顺序就是页面显示顺序
//
// 字段:
// - id:       英文标识,对应图片文件夹 assets/images/artist/<id>/
// - name:     姓名
// - roles:    身份数组，决定页面顶部 View 筛选把这个人归到哪一栏。
//             写法 roles: ["Artist"] 或 roles: ["Artist", "Writer"]（一人可多重身份）。
//             筛选按钮是从这个字段自动生成的，不用改 HTML：
//             以后想加 Curator / Translator / Photographer，直接在某个人身上写上去，
//             按钮就会自己出现。没写 roles 的人默认算 Artist。
//             大小写敏感，"Writer" 和 "writer" 会被当成两栏，务必统一。
// - city:     所在地
// - website:  个人网站完整链接(必须 https:// 开头)
// - bio:      一句话简介
// - items:    档案袋里散落的物件(可省略,省略只显示 A4 信息卡)
//
// items 里每个对象的字段:
// - src:      文件名(放在 assets/images/artist/<id>/ 里)
// - w:        宽度,% 相对档案袋(20-50 比较合适)
// - x, y:     位置,% 从左/上角算起(0-100)
// - rotate:   倾斜角度,数字,正数顺时针,负数逆时针(可省略,省略则微随机)
//
// 提示:档案袋内部坐标系是 0-100 × 0-132(纵向稍长),
// A4 信息卡默认占据 x:7-51, y:14-76 那一块,
// 你可以把散落物件放在右半边或下半边避开它.
// ============================================

const ARTISTS = [
 
  {
    id: "Aida Pouryeganeh",
    name: "Aida Pouryeganeh",
    roles: ["Artist"],
    city: "London",
    website: "http://aidapouryeganeh.com",
    available: true,
    bio: "Aida Pouryeganeh, a London-based interdisciplinary artist working mainly through painting and installation. Her practice explores themes of surveillance, migration, repetition, control, and the psychological relationship between humans and systems. Most of my works emerge through an intuitive and process-based approach, often combining abstraction with spatial and emotional tension.",
    items: [
  { src: "photo-01.webp", w: 32, rotate: 4, desc: "Untitled Drawing" },
  { src: "photo-02.webp", w: 36, rotate: 3,  desc: "Untitled, Monotype on Paper, 18 x 25 cm, 2024" },
  { src: "photo-03.webp", w: 26, rotate: -7, desc: " Crucified, The Wrong Biennale, 2025" },
  { src: "photo-04.webp", w: 26, rotate: -3, desc: " Grief (Detail) Clay and glue on mount board 40x59cm" },
  { src: "photo-05.webp", w: 36, rotate: -3, desc: " " },
  { src: "photo-06.webp", w: 26, rotate: 5, desc: " " },
]
  },

  {
    id: "Tom Honter",
    name: "Tom Honter",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/cursed_tum/",
    bio: "Artist, Curator, Bio to be submited by Tom",
    items: [
  { src: "photo-01.webp", w: 26, rotate: 4, desc: " " },
  { src: "photo-02.webp", w: 26, rotate: -7,  desc: " " },
  { src: "photo-03.webp", w: 26, rotate: -2, desc: "Tip Photo Album" },
  { src: "photo-04.webp", w: 26, rotate: 4, desc: "Secrete Images" },
]
  },

{
    id: "Yihua Wang",
    name: "Yihua Wang",
    roles: ["Artist"],
    city: "London",
    website: "https://yihuawang97.cargo.site/",
    bio: "Born and raised in Shenzhen, China, Yihua Wang is a documentary photographer and filmmaker currently based in London. Her works move between still and moving images. Working primarily with analogue film, medium-format for portraits and landscapes, and 35mm, often in black-and-white, for everyday scenes. She also frequently photographs with Polaroid. <br><br>Across her documentary works, she follows women, friends, and others as they move through change. Whether it iss migration, shifting family relationships, personal healing, or the steady work of caring for others. Her work reflects her ongoing interest in how people are seen, how they remember, and how they find their place in the world.",
    items: [
  { src: "photo-01.webp", w: 32, rotate: 4, desc: "Unrooted" },
  { src: "photo-02.webp", w: 36, rotate: -7,  desc: "Painted Words" },
  { src: "photo-03.webp", w: 40, rotate: -4, desc: "Demolition Site of Baishizhou" },
  { src: "photo-04.webp", w: 26, rotate: -7, desc: "Demolition Site of Baishizhou" },
  { src: "photo-05.webp", w: 26, rotate: 3, desc: "Demolition Site of Baishizhou" },
]
  },



  {
    id: "Chadzing Kung",
    name: "Chadzing Kung",
    roles: ["Artist"],
    city: "London",
    website: "https://ra.co/dj/chadzingkung/biography",
    bio: "Immersed in the undercurrents of the underground music scene, he captures marginalized emotions and the shimmering edges of morality. Crossing experimental electronics and club rhythms, he dedicates himself to crafting pervist music. London-based producer, musician, sound designer, and DJ. Immersed in the undercurrents of the underground music scene, he captures marginalized emotions and the shimmering edges of morality. Crossing experimental electronics and club rhythms, he dedicates himself to crafting pervist music.",
    items: [
  { type: "video", vimeo: "1205299242", sound: true, w: 25, rotate: -3, desc: "快乐崇拜 Adoration to Happiness (Remix by Chadzing Kung), 2026" },
  { src: "photo-02.webp", w: 25, rotate: 4,  desc: " " },
  { src: "photo-04.webp", w: 20, rotate: -5, desc: " " },
  { src: "photo-05.webp", w: 26, rotate: 2, desc: " " },
  { src: "photo-03.webp", w: 30, rotate: 2, desc: " " },
  { src: "photo-01.avif", w: 20, rotate: 5, desc: " " },
]
  },


  
  {
    id: "Sarah-Lou Sasha Marrek",
    name: "Sarah-Lou Sasha Marrek",
    roles: ["Artist"],
    city: "Paris",
    website: "https://sarah-lou.fr/home",
    available: true,
    bio: "Sarah-Lou Maarek is a french multi disciplinary artist based in London, She firstly graduated her master in Architecture in 2019, paris, followed by FineArt master in 2022, London, pursuing both architecture visualisation and artistic practice. dedicated to story telling thought SHARED memory, myth and symbols. balancing between digital worlds, architecture, and tangible manifestations, she reach to several medium like a collection of clues to answer fascinations, ontological mirrors and universal sacred.",
    items: [

  { src: "photo-01.webp", w: 25, rotate: 4,  desc: "MadLab3, 2022" },
  { src: "photo-03.webp", w: 30, rotate: 2,  desc: "MadLab, 2022" },
  { src: "photo-04.webp", w: 20, rotate: 2,  desc: "MadLab, 2022" },
  { src: "photo-06.webp", w: 30, rotate: 3,  desc: "Kiss My Doll, 2020-2021" },
  { src: "photo-07.avif", w: 40, rotate: -2,  desc: "MadLab, 2022" },
  { src: "photo-08.avif", w: 30, rotate: -7,  desc: "MadLab, 2022" },

]
  },

   {
    id: "zhiying Chen",
    name: "Zhiying Chen",
    roles: ["Artist"],
    city: "London",
    website: "https://resonantground.com/",
    bio: "Zhiying Chen is a London-based curator and visual artist whose practice explores the relationship between sound and space, memory and atmosphere, and the shifting perception of time within spatial environments. Through exhibitions, visual systems, and immersive experiences, she creates narratives that move between the physical and the emotional.",
    items: [
  // 注意最后的 desc 字段，支持写长句子
  { src: "photo-01.webp", w: 32, rotate: 4, desc: "From Resonant Ground. Curator" },
  { src: "photo-02.webp", w: 26, rotate: -3,  desc: "There are many surveillance cameras in your neighbourhood. How does it feel to live under that kind of monitoring?" },
  { src: "photo-03.webp", w: 40, rotate: -7, desc: " I think the cameras are absolutely necessary. Security in our compound wasn't great before — there had been several break-ins. After the cameras were installed, things improved noticeably. As someone who's lived here for years, I genuinely feel much safer." },
  { src: "note.webp", w: 40, rotate: 2, desc: " It doesn't really affect my day-to-day life — I'm not doing anything illegal, haha. Mostly it just gives me a stronger sense of psychological security." },
  
]
  },

  {
    id: "Wang Kehan",
    name: "Wang Kehan (He/His)",
    roles: ["Artist"],
    city: "Shanghai",
    website: "https://www.instagram.com/w2991534925?igsh=aGJ3YnAyamtyeWky",
    bio: " Wang Kehan, a young artist from the Central Academy of Fine Arts (CAFA). Anchored in the digital age, his practice utilizes 3D scanning, digital reconstruction, and the recombination of assets as core methodologies. He focus on deconstructing and reconstructing everyday symbols, transforming them into a metaphorical visual language to critique and reflect upon contemporary social phenomena. <br><br>Kehan's work attempts to sketch out a post-human scenario, exploring new possibilities for individual cognition and collective destiny amidst the interplay of technology, power, and culture. Ultimately, his art practice is a thought experiment on the real world, conducted through the medium of virtual space.",
    items: [

  { src: "photo-01.webp", w: 30, rotate: -9,  desc: "Particapated in The Wrong Biennale" },
  { src: "photo-02.webp", w: 30, rotate: -3,  desc: "Particapated in The Wrong Biennale" },
  { src: "photo-03.webp", w: 40, rotate: 5,  desc: "Particapated in The Wrong Biennale" },
  { src: "photo-04.webp", w: 30, rotate: 3,  desc: "Particapated in The Wrong Biennale" },

]
  },


  {
    id: "Nicharee (Nicha) Leelathipkul",
    name: "Nicharee (Nicha) Leelathipkul",
    roles: ["Artist"],
    city: "Thailand",
    website: "https://www.instagram.com/n.thipkul/",
    bio: "A spatial/communication designer specialising in creating immersive experiences and compelling narratives for brands, corporations, and hospitality ventures. With refined expertise and a multidisciplinary approach, she crafts designs that deeply resonate with audiences. At the RCA, Nicha delves into the realms of Material Cultures, Anthropology, and the transformative power of narratives within existing spaces. <br><br>Her work reflects the intricate relationship between built environments and societal politics, investigating how architecture moulds and impacts human behaviour. Nicha pushes the boundaries of architectural possibilities, embracing exploration to create transformative narratives and visionary possibilities. By blending historical elements with speculative visions, she crafts experiences that challenge conventional norms and opens up the potential for transformative possibilities. Her work is a testament to the dynamic relationship between society, architecture and individuals.",
    items: [

  { src: "photo-01.webp", w: 35, rotate: 4,  desc: "Sogetsu Sunday, 2026" },
  { src: "photo-02.webp", w: 30, rotate: 2,  desc: "2022" },
  { src: "photo-03.webp", w: 20, rotate: 2,  desc: "Studio leftovers play around, RCA WIP Show, 2023" },
  { src: "photo-04.webp", w: 30, rotate: 3,  desc: "Practice of Care, 2024" },
  { src: "photo-05.webp", w: 30, rotate: -2,  desc: "Practice of Care, Super Satellite Residency, 2025" },
]
  },



  {
    id: "Paavo Lyle Smythe",
    name: "Paavo Lyle Smythe",
    roles: ["Artist"],
    city: "London",
    website: "https://plsdotexe.com/",
    bio: "Dear attention reading this, there seems to be a lot of empowering energy out there. Humanity seems to be in the revolutionary midst of life as we know it - see how the world has transformed in the last 100 years. This universe is old. Very old. And you are here now. If everything is energy, and energy is neither created or destroyed - it only transforms - then what are you changing into? I hope that you are well. Kind regards best wishes yours sincerely with love. i .",
    items: [
  { src: "photo-01.webp", w: 32, rotate: 4, desc: "2026" },
  { src: "photo-02.webp", w: 26, rotate: -8,  desc: "2026" },
  { src: "photo-03.webp", w: 32, rotate: -2, desc: "2016" },
  { src: "photo-04.webp", w: 26, rotate: 5, desc: "2016" },
  { src: "photo-05.webp", w: 30, rotate: 2, desc: "2009" },
  { src: "photo-06.webp", w: 30, rotate: 2, desc: "2026" },
]
  },

  
  {
    id: "Xinrui Qiu",
    name: "Xinrui Qiu",
    roles: ["Artist"],
    city: "London",
    website: "https://xinruiqiu.com/about",
    available: true,
    bio: "Xinrui is a photographer and visual artist, trained in photography at Goldsmiths, working with analogue photography and moving image. Her practice investigates memory, identity, and urban environments, combining archival work with research on diaspora and displacement. Her work has been exhibited internationally, including in London, Los Angeles, and Beijing, and through collaborative projects and research initiatives that explore social and spatial narratives.",
    items: [
  { src: "photo-01.webp", w: 32, rotate: 4, desc: "I thought you would like it, 2022" },
  { src: "photo-02.webp", w: 40, rotate: 2,  desc: "I thought you would like it, 2022" },
  { src: "photo-03.webp", w: 26, rotate: -3, desc: "Fleeting Echoes, 2023-Ongoing" },
  { src: "photo-04.webp", w: 40, rotate: 2, desc: "Yang Fang, 2025-Ongoing" },
  { src: "photo-05.webp", w: 30, rotate: -5, desc: "Yang Fang, 2025-Ongoing" },
]
  },

  {
    id: "Ruilin Fu",
    name: "Ruilin Fu",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/rynn_f_?igsh=NThqZXA4ZzZseXlu",
    available: true,
    bio: "Her practice addresses the situation of women, diaspora experience, and the confusion of contemporary youth within the context of Chinese culture. Stemming from a background in printmaking, Fu embraces process, intimately engaging with media and materials such as human hair, 3D printing, wood, and latex. Through installation, virtual experience, live performance, and wearable works, she explores embodiment, memory, and emotional connection. <br><br>Recently, Fu has been developing an ongoing archival project, Dad and His Hundred Lives, which constructs a fictional archive around the imagined lives of her deceased father through the lens of childhood memory and fantasy. Combining fabricated documents, personal narratives, collected materials, and reconstructed memories, the project blurs the boundaries between reality and imagination, exploring grief, absence, identity, and the emotional ways memory is continuously rewritten over time. Her work is driven by a profound empathy that transcends individual narratives, forging connections between artist and viewer, and among viewers themselves. This shared humanity becomes a connective force, transforming personal exploration into a universal dialogue.",
    items: [

  { src: "photo-01.webp", w: 20, rotate: 4,  desc: "Mama I, 2025" },
  { src: "photo-02.webp", w: 20, rotate: -3,  desc: "Mama I, 2025" },
  { src: "photo-03.webp", w: 20, rotate: 5,  desc: "Grafting, Mixed Media, 2023" },
  { src: "photo-04.webp", w: 30, rotate: 9,  desc: "Grafting, Mixed Media, 2023" },
  { src: "photo-05.webp", w: 30, rotate: -2,  desc: "Grafting, Mixed Media, 2023" },
  { src: "photo-06.webp", w: 30, rotate: -2,  desc: "Mama I, 2025" },
]
  },

 {
    id: "Avatar Lilith",
    name: "Avatar Lilith",
    roles: ["Artist"],
    city: "London",
    website: "https://avatarlilith.com/",
    available: true,
    bio: "Avatar Lilith is a multi-disciplinary digital artist, virtual performer, and cyber-philosopher. Her work, archived on avatarlilith.com, explicitly rejects commercial influencer culture, operating instead as an artistic medium to dissect the friction between human flesh, artificial intelligence, and algorithmic control.Her diverse portfolio spans performance art, digital interventions, sound design, and experimental media. <br><br>Notable projects include Open Source, a performance utilizing a specialized 'egg instrument' to challenge secretive tech frameworks, and Exit Protocol, which examines modern emotional dissociation. These physical and digital milestones include lecture showcases at Parsons, the IMPAKT Digital Festival, and curated galleries.Her latest projects challenge automated beauty standards and the automation of personal aesthetics. By subverting digital optimization tools, the artist exposes how hyper-optimization paradoxically erases individual authenticity. Ultimately, this avatar functions as a living critique of contemporary digital culture, questioning what it means to preserve identity within an automated society.",
    items: [

  { src: "photo-01.webp", w: 40, rotate: 4,  desc: "Exist Protocol, 2025" },
  { src: "photo-02.webp", w: 25, rotate: -3,  desc: "Exist Protocol, 2025" },
  { src: "photo-03.webp", w: 30, rotate: 5,  desc: "Performance, 2025" }, 
  { src: "photo-05.webp", w: 25, rotate: -2,  desc: "Vanish: Absence of Presence, The Wrong Biennale, 2025/26" },
  { type: "model", src: "lilith-glb.glb", poster: "photo-04.webp", w: 40, rotate: 2, desc: "Collected Topographies, 2024  - ongoing" },
]
  },

 {
    id: "Alexandra Ellerkamp",
    name: "Alexandra Ellerkamp",
    roles: ["Artist"],
    city: "Brooklyn (United State)",
    website: "https://www.instagram.com/alx_kamp/",
    bio: "Alexandra is a spatial artist from Brooklyn, whose work gravitates to the intersection of story-telling and story-making, the interstitial space between what has been and what can be. She believes that immersive space has the ability to make narratives and histories tangible. <br><br>Her previous research and work can be placed in the intersection of craft and science. In her first year at the Royal College of Art, she researched how memories are both captured and expressed in space through various media. The projects produced include a written text about her grandparent pepto bismol pink bathroom, which was never actually pink, a sonic fiction of very real events created through manual manipulation of cassette tapes, and design for a staircase constructed from plastiglomerates and geological layers containing fossils of technological devices, a warning against the direct impact consumerism is having on the earth.",
    items: [

  { src: "photo-01.webp", w: 40, rotate: 4,  desc: " " },
  { src: "photo-02.webp", w: 25, rotate: -3,  desc: " " },
  { src: "photo-03.webp", w: 30, rotate: 5,  desc: " " }, 
  { src: "photo-04.webp", w: 50, rotate: 5,  desc: " " }, 

]
  },

 {
    id: "Lucy Nurnberg",
    name: "Lucy Nurnberg",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/lucynurnberg/",
    bio: "Lucy Nurnberg is an artist from London working across interiors, graphic design, art direction, exhibitions and storytelling. She sees art as a way to imagine the world differently, combining the political with the playful, and plans to build the queer spaces of the future. <br><br>After completing her BA in Illustration at the University of Brighton, Lucy had a career in writing and journalism. She was the co-founding editor of Accent magazine, an independent publication that was dedicated to “lives lived outside the ordinary” and celebrated non-conformists of all strokes. The magazine was stocked everywhere from MoMA PS1 to the Tate Modern Bookshop, and hosted events, workshops and residencies in venues including Somerset House, Tate Britain, the Hoxton Holborn and Shoreditch House.",
    items: [

  { src: "photo-01.webp", w: 30, rotate: 4,  desc: " " },
  { src: "photo-02.webp", w: 25, rotate: -3,  desc: " " },
  { src: "photo-03.webp", w: 30, rotate: 5,  desc: " " }, 
  { src: "photo-04.webp", w: 30, rotate: 5,  desc: " " }, 

]
  },


   {
    id: "Ben Adamson",
    name: "Ben Adamson",
    roles: ["Artist"],
    city: "London",
    website: "https://www.benadamson.art/",
    available: true,
    bio: "Ben is a multimedia and sound artist working with multisensory installation across performance, installation and soundscape design. The work invites audiences to become active performers and listeners rather than observers, finding beauty in contrasting and harsh sound in order to open up questions about space, objects and themes. <br><br>Provocation is central to the practice, which uses installation to put questions directly to the listener. A second strand addresses playfulness and communication, probing the boundaries between performance, interaction and listening. More recent work extends into sculpture and into co-creative processes developed through workshops and drop-in sessions. Ben holds an M.Mus in Critical and Experimental Composition and a BA (Hons) in Liberal Arts with a major in Music from the University of Leeds. He is also a practising experimental percussionist and performance artist, and both inform the installation work directly. The practice takes reference from Bill Fontana, Zimoun and David Monacchi, in scale, method and in the combining of sensory registers.",
    items: [

  { src: "Toil and Beauty (2026).webp", w: 40, rotate: 3,  desc: "Toil and Beauty, 2026" },
  { src: "Drowning Music (2022).webp", w: 20, rotate: 6,  desc: "Drowning Music, 2022" },
  { src: "The Journey (2022).webp", w: 30, rotate: -3,  desc: "The Journey, 2022" },
  { src: "Many hands (2022).webp", w: 25, rotate: 4,  desc: "Many hands, 2022" },
  { type: "video", youtube: "-CF39_UFRyM", w: 30, rotate: -3, desc: "Composer Collective - Winter Series 2021" },
]
  },


 {
    id: "Sarunas Berinas",
    name: "Sarunas Berinas",
    roles: ["Artist"],
    city: "London",
    website: "https://www.sarunasberinas.com/",
    available: true,
    bio: "Sarunas Berinas is an interdisciplinary artist working across sculpture and photography. His sculptural practice explores bodily limitation as both an internal decision and an external force. Through wearable objects and mechanical apparatuses, he investigates how constraint shapes the body relationship to autonomy, vulnerability, and control. <br><br>Many of his works place the body in direct negotiation with constructed systems that mediate or interrupt ordinary actions. Familiar movements such as eating, walking, or touching are altered through restrictive devices, exposing how easily the body’s agency can be redirected by external structures. These interventions transform everyday gestures into deliberate and often uncomfortable acts, making visible the fragile balance between control and restriction. Alongside sculpture, his photographic work examines the psychological atmosphere of urban environments. By focusing on overlooked or transitional spaces within the city, these images reflect parallel conditions of pressure, neglect, and quiet persistence. Across both practices, Berinas approaches the body and the built environment as sites where forces of control, vulnerability, and adaptation become visible. His work considers how individuals navigate systems that shape their movement, perception, and sense of autonomy.",
    items: [
  
  { src: "London=Gloom.webp", w: 30, rotate: 3,  desc: "London=Gloom" },
  { src: "Geworfenheit.webp", w: 20, rotate: 6,  desc: "Geworfenheit" },
  { src: "Apparatus 2.webp", w: 30, rotate: -3,  desc: "Apparatus 2" },
  { type: "video", youtube: "NNmIOVcBkhU", w: 30, rotate: -2, desc: "Reconstruct / Deconstruct" },
  { src: "Apparatus 1.webp", w: 25, rotate: 4,  desc: "Apparatus 2" },
  { type: "video", youtube: "FXUswKJonEo&t=2s", w: 40, rotate: 3, desc: "Apparatus 3" },
]
  },


 {
    id: "Elina Browerman",
    name: "Elina Browerman",
    roles: ["Artist"],
    city: "Alberta (CANADA)",
    website: "browerman.com",
    available: true,
    bio: "Elina Browerman is a photographer based in Alberta, working between classical aesthetics and conceptual narrative. Reading cultural displacement and personal memory through what she terms an ironical neo-Baroque lens, her practice maps the intersections of shifted geographies and inherited histories. She trained in Jerusalem in the early 2000s and has since worked in Israel, Russia and Canada. <br><br>Her 2026 schedule includes a solo presentation at Alcove Centre for the Arts, Calgary, and a feature in Lenscratch.",
    items: [
  
  { src: "photo-01.webp", w: 30, rotate: 3,  desc: " " },
  { src: "photo-03.webp", w: 40, rotate: 6,  desc: " " },
  { src: "photo-02.webp", w: 30, rotate: -3,  desc: " " },
]
  },


  {
    id: "Margaret Bruton",
    name: "Margaret Bruton",
    roles: ["Artist"],
    city: "London",
    website: "https://www.effuzionart.co.uk/",
    bio: "Margaret Bruton is a self-taught artist, born in South Africa and based in the United Kingdom. She works from a compact studio in the former HMS Belfast ticket office, on a floating pontoon on the Thames in London. Surrounded daily by reflections, tides and the industrial poetry of the river, her paintings work towards an emotional energy that is at once intimate and expansive. <br><br>The practice explores transition, resilience and connection through a visual language that is vibrant, instinctive and deeply personal, and is built as much around adaptability and immersion in the elements as around the studio itself.",
    items: [
  { src: "Icebound.webp", w: 30, rotate: 3,  desc: "Icebound" },
  { src: "fractured Arrow.webp", w: 40, rotate: 6,  desc: "Fractured Arrow" },
  { src: "Reflection.webp", w: 30, rotate: -3,  desc: "Reflection" },
]
  },



  {
    id: "Jie Dong",
    name: "Jie Dong",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/dodo.artwork/?hl=en-gb",
    bio: "London-based artist Jie Dong explores the relationship between emotional states, psychological tension, and self-healing through mixed media. Holding an MA in Fine Art from Chelsea College of Arts, her practice is informed by her former career as a jewellery designer and visual director. <br><br>This background shaped her sensitivity to materiality and detail, leading her to approach physical objects as tactile carriers of emotion and memory. Her work translates subtle psychological experiences into quiet, introspective spatial compositions, examining how materials can hold and mediate affect.",
    items: [
  { src: "photo (1).webp", w: 30, rotate: 3,  desc: "Ripple, 120 x 70cm, Fabric, Oil Painting" },
  { src: "photo (2).webp", w: 20, rotate: 6,  desc: "Tides, 2023, Oil on canves, quartz sand, 40 x 50cm" },
  { src: "photo (3).webp", w: 30, rotate: -3,  desc: "Tides, 2023, Oil on canves, quartz sand, 40 x 50cm" },
  { src: "photo (4).webp", w: 25, rotate: -1,  desc: "Tides, 2023, Oil on canves, quartz sand, 40 x 50cm" },
  { src: "photo (5).webp", w: 20, rotate: -3,  desc: "Ripple, 120 x 70cm, Fabric, Oil Painting" },
  { src: "photo (6).webp", w: 26, rotate: 3,  desc: "Flow, 50 x 60cm, Oil on canvas, 2026" },

]
  },


 {
    id: "Chiemi Haraguchi",
    name: "Chiemi Haraguchi",
    roles: ["Artist"],
    city: "Berlin",
    website: "https://chemzdoodlez.xyz/",
    available: true,
    bio: "Berlin-based Japanese-Indonesian artist Chiemi Haraguchi works across illustration, design, and handpoke tattooing. Using lines, dots, and shapes as her visual language, she creates on whatever surface finds her, from paper and fabric to found objects.",
    items: [
  { src: "image.webp", w: 30, rotate: 3,  desc: "Tagines, Acrylic on Tagines, 30 x 80 cm" },
  { src: "image (1).webp", w: 60, rotate: 6,  desc: "Doodle Scroll, Ink on tracing Paper, 30 x 5000 cm" },
  { src: "image (2).webp", w: 30, rotate: -3,  desc: "Renault, Acrylic on a Car, 2000 x 1000 x 1000 cm" },

]
  },


 {
    id: "R James Healy",
    name: "R James Healy",
    roles: ["Artist"],
    city: "London",
    website: "https://www.rjameshealy.com/m16-23",
    bio: "R James Healy was born in the North of England and grew up immersed in art, television and electronic music during the heyday of home computing. Early experiments with the Commodore Amiga led to animation and to the National Centre for Computer Animation, where he took a BA (Hons) in Computer Animation and Visualisation. <br><br>He went on to work with visual effects studios in the UK, Canada and the USA, contributing to commercials, music videos and feature films. As a CG and VFX supervisor his work has been recognised with a D&AD Pencil and a British Animation Award. His short films have been featured in Creative Review and Stash and screened at SIGGRAPH, OneDotZero and Prix Ars Electronica, and his music video for Clark (Warp Records) won the inaugural Radar Festival. Since 2022 his work has centred on physical artworks. The practice examines perception, taking in both the act of seeing and the construction of meaning, and combines technology with traditional craftsmanship. Drawing on his background in visual effects, the works often incorporate kinetic, sequential and algorithmic elements.",
    items: [
  { src: "photo (1).webp", w: 32, rotate: 3,  desc: "20 GOTO 10 REM 8-BIT. 2025" },
  { src: "photo (2).webp", w: 40, rotate: 6,  desc: "20 GOTO 10 REM 8-BIT. 2025" },
  { src: "photo (3).webp", w: 25, rotate: 2,  desc: "20 GOTO 10 REM 8-BIT. 2025" },
  { src: "photo (4).webp", w: 30, rotate: -2,  desc: "M16-23. 2023" },
  { src: "photo (5).webp", w: 30, rotate: -3,  desc: "M16-23. 2023" },


]
  },


   {
    id: "Millieon Hu",
    name: "Millieon Hu",
    roles: ["Artist"],
    city: "Shanghai",
    website: "https://www.instagram.com/millieon_datart/",
    bio: "London-based computational artist Millieon Hu (b. 1999, Beijing) investigates the intersections of Asian diaspora, linguistics, and emotional fragility through technological frameworks. With a background in data science, her multidisciplinary practice utilizes big data, AI, and sensors to create screen-based works and interactive installations.",
    items: [
  { src: "photo (1).webp", w: 32, rotate: 3,  desc: "Are you leaving? 2023" },
  { src: "photo (2).webp", w: 40, rotate: 6,  desc: "Are you leaving? 2023" },
  { src: "photo (3).webp", w: 25, rotate: 2,  desc: "A Fluid Dream, Driving back to grandma's house, Mixed Media, 2024" },
  { src: "photo (4).webp", w: 30, rotate: -2,  desc: "Are you leaving? 2023" },
  { src: "photo (5).webp", w: 30, rotate: -3,  desc: "A Fluid Dream, Driving back to grandma's house, Mixed Media, 2024" },
   { type: "video", vimeo: "1216698928", sound: false, w: 35, rotate: -3, desc: "Under the gaze, 2023" },
]
  },




  {
    id: "Gianluca Iadema",
    name: "Gianluca Iadema",
    roles: ["Artist"],
    city: "Italy",
    website: "https://iademastudio.com/",
    available: true,
    bio: "Gianluca Iadema is a composer, visual artist, and performer working with a transdisciplinary approach to music, video, and installation. His research-driven practice is informed by technology, architecture, and philosophy. He holistically explores sound, image, sculpture and light resulting in works straddling the categories of music, film, and installation art.",
    items: [
  { src: "photo (1).webp", w: 40, rotate: -9,  desc: "in and out, however oneself" },
  { src: "image.webp", w: 30, rotate: 6,  desc: "ID[entità]" },
  { src: "image (2).webp", w: 35, rotate: 2,  desc: "Aphàiresis" },
  { src: "image (4).webp", w: 50, rotate: 5,  desc: "ever.rave" },
  { src: "image (5).webp", w: 50, rotate: 5,  desc: "Festa dell'Opera & Teatro Grande di Brescia" },
  { type: "video", vimeo: "1097342954", sound: true, w: 45, rotate: -3, desc: "in and out, however oneself /// audiovisual work" },
]
  },





{
    id: "Huilin Li",
    name: "Huilin Li",
    roles: ["Artist"],
    city: "London",
    website: "https://jellostoragedevice-copy.cargo.site/",
    bio: "Huilin Li is a textile artist and designer whose work examines creativity as a healing process, made through mixed media and experimental materials. Translating emotion into pattern, texture and colour, her practice is informed by the supportive subcultures of her youth. <br><br>Using garments and textiles as figures for connection, she builds tactile environments that hold open the possibility of mutual support and communal belonging, often carrying subtle detail and a hidden humour.",
    items: [
  { src: "image.webp", w: 10, rotate: 6,  desc: "Random" },
  { src: "image (1).webp", w: 25, rotate: 2,  desc: "Random" },
  { src: "image (2).webp", w: 30, rotate: -3,  desc: "JELLO STORAGE DEVICE, Materials: Gel wax, Paper, Mini Figurine Model" },
  { type: "video", youtube: "WOhSxCvbU60", w: 30, rotate: -3, desc: "Window" },
  { type: "video", vimeo: "1216763704", sound: true, w: 45, rotate: -3, desc: "Jell-o Castle" },
  { type: "model", src: "huilin-li.glb", poster: "image (3).webp", w: 40, rotate: 2, desc: "JELLO STORAGE DEVICE, Materials: Gel wax, Paper, Mini Figurine Model" },
]
  },


  {
    id: "Maxim Lester",
    name: "Maxim Lester",
    roles: ["Artist"],
    city: "London",
    website: "https://maximlester.com/shop/",
    available: true,
    bio: "Maxim Lester is a product and furniture designer from London. His practice uses metal and textiles in a handmade utilitarian style, and aims to explore how values are embedded in objects. Maxim studied at the Royal College of Art.",
    items: [
  { src: "image.webp", w: 20, rotate: 6,  desc: " " },
  { src: "image (1).webp", w: 25, rotate: 2,  desc: "audraxim-rect-1" },
  { src: "image (2).webp", w: 20, rotate: -3,  desc: "skinny-stool-black-1024x1024" },
  { src: "image (3).webp", w: 20, rotate: 3,  desc: "OEM Throw Blanket for Couch" },
  { src: "image (4).webp", w: 30, rotate: -7,  desc: "very special lady's shoe rack" },
  { type: "model", src: "maxim-lester.glb", poster: "image (5).webp", w: 20, rotate: 2, desc: "OEM Throw Blanket for Couch" },
]
  },



   {
    id: "Tyrone Moreno",
    name: "Tyrone Moreno",
    roles: ["Artist"],
    city: "London",
    website: "https://tyronemoreno.com/store/",
    available: true,
    bio: "Painter Tyrone Moreno makes work without pre-planning it, letting the act of making do the thinking. Half-Spanish, half-English and based in Brighton, he moves between pixels and paint pushed straight onto canvas, treating the medium as secondary to the state it produces. For Moreno, creating is catharsis: a way of handling a fast, overactive mind, and the closest waking equivalent to dreaming.",
    items: [
  { src: "image (1).webp", w: 25, rotate: 2,  desc: "No time 4 overthinking, 25x18.5cm, Mixed Media on Cotton Paper, 2026" },
  { src: "image (2).webp", w: 20, rotate: -3,  desc: "Splinter, 83x55cm, Mixed Media on Wood, 2026, Dropping anchor starboard 20 fathoms." },
  { src: "image (4).webp", w: 30, rotate: -7,  desc: "very special lady's shoe rack" },
  { src: "image (5).webp", w: 30, rotate: -7,  desc: "An Unsolved Constant, 9x9x9cm, Mixed media on Rubiks cube, 2026 (Do not try to solve it.)" },
]
  },


 {
    id: "Fatima Ezzahra Rezqi",
    name: "Fatima Ezzahra Rezqi",
    roles: ["Artist"],
    city: "Cambridge",
    available: true,
    website: "https://www.instagram.com/fatima_rezqi/",
    available: true,
    bio: "Self-taught abstract painter Fatima Ezzahra Rezqi works in colour because it holds what words cannot. Born in Morocco and now based in Cambridge, she paints intuitively, letting the paint move before she fully understands it and building up layers of texture and feeling. <br><br>Her work carries two rhythms at once: the warmth and density of Morocco, and the quieter, more spread-out pace of life in the UK. That in-between feeling runs through the paintings, where shifting colour stands in for shifting identity and belonging. Gardens, wild landscapes and the way seasons change without asking permission are a constant source. She hopes her paintings give people somewhere to slow down and recognise something of themselves in the colour.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "She didn't overthink this one. Acrylic on canvas, 32 x 40" },
  { src: "image (1).webp", w: 25, rotate: 2,  desc: "What Survived, Acrylic on canvas, 32 x 40" },
  { src: "image (2).webp", w: 20, rotate: -3,  desc: "Orange Blast, Acrylic on canvas, 18 x 24" },
  { src: "image (3).webp", w: 30, rotate: -7,  desc: "Peace, Interrupted, Acrylic on canvas, 16 x 20" },

]
  },


{
    id: "Xinde Ren",
    name: "Xinde Ren",
    roles: ["Artist"],
    city: "London",
    website: "https://xinderen.art/",
    bio: "Xinde Ren is a London-based artist from China. Her practice includes sculptural painting, installation, and digital media, investigating the human longing for emotional connection within the technology-mediated isolation. <br><br>Working with airbrush and oil on machine-cut aluminium, she creates large-scale abstract works that translate intangible energies into resonant visual frequencies. Ren draws from a syncretic spiritual landscape of Buddhism, Taoism, and Sufism, alongside manga, speculative fiction, and immersive game worlds. The mythology of Ursula K. Le Guin and the concept visualization of Hirohiko Araki's JoJo's Bizarre Adventure permeate her practice. Growing up under the one-child policy during China's economic boom, with parents consumed by work, Ren was among a generation of children whose childhoods were shaped by solitude. She found in stories and images a form of companionship that continues to animate her work. Her practice responds to a primal human desire to escape regulation. Within the cyber condition of contemporary life, this longing intensifies: connection and isolation collapse into one another, and the individual is left navigating a threshold between the real and the imagined. Ren remains preoccupied with the question of how individuals might navigate a crisis of belief intensified by artificial intelligence and the dissolution of truth.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "A Better Container, 2026, Aluminium Composite Material, acrylic, markers, pencils and foam clay, 200 x 120cm" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Talisman" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Dear Mother" },
  { src: "image (3).webp", w: 30, rotate: -7,  desc: "Dear Mother" },
  { src: "image (4).webp", w: 30, rotate: -7,  desc: "Dewdrops Fall Like Jade Liquid, 露零玉液涓涓, 2025 skybond, oil paint, acrylic 200 cm x 170 cm" },

]
  },

{
    id: "Rachel Romanowsky",
    name: "Rachel Romanowsky",
    roles: ["Artist"],
    city: "London",
    available: true,
    website: "https://rachelromanowsky.com/",
    bio: "A British-American painter working between Boston and London, Rachel trained in classical oil painting. <br><br> Her signature process is grinding marble into powder and blending it into her paint, giving each work a distinctive mineral density and physical presence. Her paintings are held in private collections across the United States, the United Kingdom, and Europe.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "Tennis at Tremezzo, Size Various" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Tennis at Tremezzo, Size Various" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Weight of Light" },
  { src: "image (3).webp", w: 30, rotate: -7,  desc: "Wake of Light" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "On The Run, 51x41cm 20x16, Oil, ground marble dust and glass shards on linen" },

]
  },



{
    id: "Laia Sarukhan",
    name: "Laia Sarukhan",
    roles: ["Artist"],
    city: "Maryland",
    website: "laiasarukhanphotography.com",
    bio: "Photographer Laia Sarukhan works across landscape and portraiture, photographing moments large and small at home and on her travels. <br><br> Her practice began with four years of photography classes at school and competition work including the Scholastic Art and Writing Awards.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "Skirt" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "By the Window" },
  { src: "image (2).webp", w: 30, rotate: -5,  desc: "Asahi Flame, Tokyo Japan" },
  { src: "image (3).webp", w: 25, rotate: 3,  desc: "Light and Shadow, Italy" },
  { src: "image (4).webp", w: 30, rotate: -7,  desc: "Shapes, Alcazar Real, Seville, Spain" },

]
  },



{
    id: "Joy Wang",
    name: "Joy Wang",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/73.1kg/",
    bio: "Joy Wang is a London-based artist and designer whose practice spans moving image, publication, and research-led visual expression. <br><br> Her work explores the shifting relationships between bodily perception, social spectatorship, material processes, and non-human presence. Working across video, books, and participatory forms, she transforms ambiguous and difficult-to-name experiences into visual structures that can be sensed rather than explained. Her projects investigate visibility, power, perception, and the systems that shape everyday life.",
    items: [
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "surrounding - 2" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "surrounding areas" },
]
  },



{
    id: "Jianqiang (Vincent) Xia",
    name: "Jianqiang (Vincent) Xia",
    roles: ["Artist"],
    city: "London",
    available: true,
    website: "https://jianqiangxia.com/",
    bio: "Vincent Xia is a ceramicist, architect and interdisciplinary artist. He graduated in Architecture from the Royal College of Art, London, where his interest settled on the intersections of spatial practice, materiality and artistic experimentation. <br><br>Working from an architectural grounding, he uses clay less as a material of making than as a spatial language, translating architectural concepts into sculptural and sensory form. The works investigate the dialogue between form and void, structure and fragility, discipline and chance, and position ceramics beyond function as a medium that engages both body and space. He has practised as an architect alongside this trajectory, working through installation, exhibition and collaborative projects. His work has been shown in the UK, Japan and China.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "Beneath the Ashes. 2025" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Sprouts of Ruins, 2024" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Fragments of Infinity. 2025" },
  { src: "image (3).webp", w: 30, rotate: 3,  desc: "Echo Fossil, 2025" },
  { src: "image (4).webp", w: 30, rotate: 2,  desc: "Fissures, 2024" },
  { src: "image (5).webp", w: 30, rotate: -1,  desc: "Boundary, 2025, Exhibited with OMMFA at The Way in London Design Festival 2026" },

]
  },


{
    id: "Suwei Xia",
    name: "Suwei Xia",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/suvi.lab/",
    bio: "Suwei is an artist working with glass, whose practice explores perception, distance, and how understanding is formed through partial encounters. She previously worked within immigration law, an experience that informs her sensitivity to how narratives are constructed across different positions.",
    items: [
  { src: "image (1).webp", w: 40, rotate: 6,  desc: " " },
  { src: "image (2).webp", w: 20, rotate: -5,  desc: " " },
  { src: "image (3).webp", w: 30, rotate: 4,  desc: " " },
  { src: "image (4).webp", w: 20, rotate: -2,  desc: " " },
  { src: "image (5).webp", w: 35, rotate: 1,  desc: " " },
  { src: "image (6).webp", w: 23, rotate: -3,  desc: " " },

]
  },


  {
    id: "Qi Shi",
    name: "Qi Shi",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/qishi_shiqi",
    bio: "Qi Shi is an interdisciplinary artist and material designer working at the intersection of bio-materials, tactile engineering, and site-specific interactive systems. By manipulating unconventional media—such as latex membranes and botanical/bio-composites—Shi creates immersive installations that explore the boundaries between humans, non-human animals, and shifting ecosystems, uncovering how invisible forces shape our interconnected relationships. <br><br>Her practice actively redefines the viewer's role, transforming them from passive observers into co-creators who co-interpret the narrative of the work.",
    items: [
  { src: "image (1).webp", w: 35, rotate: 6,  desc: "Where Our Orbits Meet" },
  { src: "image (2).webp", w: 30, rotate: -5,  desc: "Where Our Orbits Meet" },
  { src: "image (3).webp", w: 30, rotate: -2,  desc: "Where Our Orbits Meet" },
  { src: "image (4).webp", w: 30, rotate: 3,  desc: "Where Our Orbits Meet" },
  { src: "image (5).webp", w: 30, rotate: -4,  desc: "Where Our Orbits Meet" },

]
  },


   {
    id: "Yujia Yang",
    name: "Yujia Yang",
    roles: ["Artist"],
    city: "Shanghai",
    website: "https://www.instagram.com/yvetteyyyang/",
    bio: "Illustrator and picture book artist Yang Yujia builds narratives from the textures of childhood memory. Working across watercolour, soluble crayon, pastel, coloured pencil and ink, she layers mixed media into scenes that hold both the warmth and the strangeness of remembered nights. Her practice begins with lived experience: small, ordinary moments observed closely, and transforms them into whimsical worlds where imagination and reality play side by side.",
    items: [
  { src: "image (1).webp", w: 40, rotate: 6,  desc: "The Blackout Night" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "The Blackout Night" },
  { src: "image (3).webp", w: 40, rotate: 1,  desc: "The Blackout Night" },
  { src: "image (4).webp", w: 40, rotate: -2,  desc: "The Blackout Night" },

]
  },


  {
    id: "Yixuan You",
    name: "Yixuan You",
    roles: ["Artist"],
    city: "London",
    website: "https://yixuanyou.cargo.site/",
    bio: "London-based graphic designer and visual artist Yixuan You explores the intersection of internal experience, bodily perception, and social conditioning. Her practice translates invisible psychological states into spatial forms, examining how collective psychology and cultural memory shape the relationship between the body and its environment. By navigating the tension between intimacy and distance, she creates works that challenge established modes of perception.",
    items: [
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Ouch" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Ouch" },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "Ouch" },
  { src: "image (4).webp", w: 30, rotate: 1,  desc: "Woodland Butterfly Conservation in UK" },
  { src: "image (5).webp", w: 30, rotate: 1,  desc: "Woodland Butterfly Conservation in UK" },

]
  },

  {
    id: "Feng Zhao",
    name: "Feng Zhao",
    roles: ["Artist"],
    city: "London",
    available: true,
    website: "https://www.instagram.com/feng_artwork/",
    bio: "London-based illustrator and visual artist Feng Zhao navigates the intersections of graphic design and poetic narrative. Her practice observes the world through photography and lived experience, translating personal emotions and everyday observations into metaphorical visual symbols. Drawing inspiration from poetry and music, she searches for meaningful signs within language and sound, transforming them into atmospheric illustrations that invite viewers to read between the layers.",
    items: [
  { src: "image (1).webp", w: 35, rotate: 6,  desc: "Fear keeps us in the light.This CD version explores the anxiety of modern life" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "CD edition reinterpretation for OK Computer frames a compressed digital tension" },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "Lost in the way of home" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "Tetris(An Unknown Life Turnaround)" },

]
  },


  {
    id: "Sue Kite",
    name: "Sue Kite",
    roles: ["Artist"],
    city: "London",
    website: "https://www.suekite-creates.co.uk/",
    bio: "Sue Kite is an artist and a child psychologist. She paints moments, memories and atmosphere, working between abstract and impressionist registers. Her recent series follows the River Wey through four canvases, moving from a tangible horizon into deconstructed, dreamlike memory. The river holds a doubleness she keeps returning to: a surface stillness that covers an unpredictable and unending force. As the series goes on, ordinary perspective gives way to sweeping brushwork and fractured blocks of light.",
    items: [
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Lemons, 30 x 25, Oil on canvas " },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: " " },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "Fading Light - Mini abstract seascape series, 25 x 25 oils on deep frame canvas" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "Mist on fire - Mini abstract seascape series, 25 x 25 oils on deep frame canvas" },

]
  },


  {
    id: "Polina Filippova",
    name: "Polina Filippova",
    roles: ["Artist"],
    city: "London",
    website: "https://www.polinafilippova.com/",
    bio: "Polina Filippova is a London-based artist working with video objects, interactive installations, digital prints and image-based sculpture, turning private life into strange, charged objects through video, screens, sensors and physical materials. <br><br>Projects usually begin with people, rooms and everyday situations close to hand. These are recorded through video, sound, 3D scanning, drawing and found domestic detail, then reworked by compression, distortion, printing, re-filming and physical making. The image tends towards instability: it flickers, hides, dissolves, or comes apart as the viewer approaches. <br><br>Technology is not the meaning of the work but a medium and a source of metaphor, used to speak about memory, grief, shame, intimacy, the body, and the wish to feel closer to other people. The practice is concerned with how digital images and responsive objects can carry vulnerability and emotional charge.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "Small Things, Single-channel videos, 1.69” screens, microprocessors, velvet 21x32x2 cm" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "June" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Looking Back" },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "In The Corner, Archival inkjet print, wax varnish, mounted on dibond and aliminium frame, 70x112 cm" },
  { type: "video", vimeo: "1216795045", sound: true, w: 30, rotate: 2, desc: "Home, Multi-channel video installation, holographic fans, Dimensions variable" },
  { type: "video", vimeo: "1216795661", sound: true, w: 35, rotate: -3, desc: "Small Things II, Single-channel videos, 1.69” screens, microprocessors, velvet 21x32x2 cm" },
  
]
  },


  
  {
    id: "Agak-Agak Unit",
    name: "Agak-Agak Unit",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/agak.agak.unit/",
    bio: "Agak-Agak is a design collective formed by Jiayi Yu, Tian Qiu, and Man Xian Ng while studying MA Design at Goldsmiths, University of London. Working across installation, objects, and participatory experiences, the collective explores how everyday rituals reveal alternative ways of knowing. Their practice combines design research with playful interaction, inviting audiences to question systems that are often accepted as fixed and universal.",
    items: [
  { src: "image (1).webp", w: 35, rotate: 2,  desc: "Eyeballing Rulers" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Agak-Agak" },
  { src: "image (3).webp", w: 40, rotate: 3,  desc: "Agak-Agak" },

]
  },


    {
    id: "Nadiia Rom",
    name: "Nadiia Rom",
    roles: ["Artist"],
    city: "London",
    available: true,
    website: "https://www.saatchiart.com/account/profile/1403851?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAacj2xEt-J_XI6PCpHYPnHteVh_eLDbNPCwaLemSzfGZ1Ub9Dh1-azIGZDYxXA_aem_3nQt8taNNEF16bFZQ1MXoQ",
    bio: "In Somewhere near the Romanian border, Ukrainian-born, London-based artist Nadiia Rom examines themes of transit, displacement, and uncertainty. Drawing from her background in architecture, Rom constructs compositions that navigate the physical and psychological roads she has traveled. The artwork reflects the inherent unpredictability of journeys—whether by car, train, or plane—and the ambiguity of what lies ahead. Having relocated to the UK in 2023, Rom utilises her practice to process continuous movement. Rather than depicting a fixed destination, the piece captures the transient state of being in motion, mapping the unknown paths that unfold around each corner.",
    items: [
  { src: "image.webp", w: 28, rotate: 5,  desc: "Litha/ Painting, Oil on Canvas, 15.7 x 19.7 in" },
  { src: "image (1).webp", w: 35, rotate: 3,  desc: "Quiet evening/ Painting, Oil on Canvas, 27.6 x 31.5 in" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Breakfast/ various size" },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "Palyanytsia/ various size" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "Reflections.No.1 / Drawing, Pastel on Paper, 24.8 x 20.1 in" },
  
]
  },


{
    id: "Kengo Horikoshi",
    name: "Kengo Horikoshi",
    roles: ["Artist"],
    city: "London",
    website: "https://www.kengohorikoshi.com/",
    bio: "Kengo Horikoshi examines the parallels between the way flowers are commonly presented and the way individuals are perceived within society. He observes that, just as the distinct qualities of individual flowers can be overlooked when they are seen in clusters or arranged in bouquets, people are often understood through broad social categories such as nationality, age, workplace or school, rather than through their personal values, dreams, feelings and ways of thinking. Horikoshi reflects on how such group-based perceptions can make it difficult for individuality to be fully recognised and expressed. In response to this tendency, he created a distinctive single-flower vase. By allowing one bloom to stand alone and be fully seen, the artwork encourages viewers to closely observe and appreciate its unique beauty and character, serving as a metaphor for recognising and celebrating human individuality.",
    items: [
  { src: "image (1).webp", w: 35, rotate: 4,  desc: "S-one, 2021" },
  { src: "image (2).webp", w: 26, rotate: -2,  desc: "Altar Coaster 2023" },
  { src: "image (3).webp", w: 32, rotate: 1,  desc: "Transformable Pole, 2023" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "Thames Iampshade, 2023" },
  { src: "image (5).webp", w: 40, rotate: -2,  desc: "Grow, 2024" },
]
  },



{
    id: "Zishi Tu (Yuxi Chen)",
    name: "Zishi Tu (Yuxi Chen)",
    roles: ["Artist"],
    city: "London",
    website: "https://zishi.cargo.site/",
    bio: "Zishi Tu(Yuxi Chen) is a London-based Creative Technologist and 3D Artist whose practice explores the construction of imaginary worlds through cuteness, mythology, play, and dark fantasy. Working across interactive installation, pen plotter painting, visual games, animation, and 3D digital media, she creates characters and environments that exist between tenderness and unease.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "Codename: F, Wood, Resin, Metal, Servos, Arduino, Fusion 360, Blender" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Codename: F, Wood, Resin, Metal, Servos, Arduino, Fusion 360, Blender" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Zed:Automata/ This work have been showed in V&A Museum Digital Design weekend in 2023." },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "Psyche Wonderland 拾遗游乐园" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "Codename: O" },
  { type: "video", vimeo: "1030482248", sound: true, w: 35, rotate: -3, desc: "Codename: F, Wood, Resin, Metal, Servos, Arduino, Fusion 360, Blender" },
  { type: "video", vimeo: "862537107", sound: true, w: 40, rotate: 3, desc: "Zed:Automata/ This work have been showed in V&A Museum Digital Design weekend in 2023." },
  { type: "video", vimeo: "1214948467", sound: true, w: 30, rotate: 5, desc: "Psyche Wonderland 拾遗游乐园" },
]
  },

{
    id: "Yiming Sun",
    name: "Yiming Sun",
    roles: ["Artist"],
    city: "Shanghai",
    website: "https://yiming0207.com/",
    bio: "Yiming Sun is an interdisciplinary artist based in Shanghai and Hangzhou. After completing her Master's degree in Environmental Architecture at the Royal College of Art, she began focusing on the creation of site-responsive works. Her practice bridges digital technologies with ecological thinking, integrating artistic sensibilities with spatial and environmental analysis.",
    items: [
  { src: "image.webp", w: 35, rotate: 2,  desc: "Speed = Distance/Time Ⅰ 2024-2025 Installation and Artist book Material: mirror acrylic, metal, thermal paper, candles, wood" },
  { src: "image (1).webp", w: 45, rotate: 6,  desc: "Speed = Distance/Time Ⅰ 2024-2025 Installation and Artist book Material: mirror acrylic, metal, thermal paper, candles, wood" },
  { src: "image (2).webp", w: 30, rotate: -5,  desc: "The Transformation of Water A Journey Through Myth, Philosophy, Technology and Civilization 2024-2025" },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "The Transformation of Water A Journey Through Myth, Philosophy, Technology and Civilization 2024-2025" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "Speed = Distance/Time Ⅱ 2025-2026 Artist book Material: thermal paper, stainless steel and copper wire" },
  { src: "image (5).webp", w: 20, rotate: -2,  desc: "Speed = Distance/Time Ⅱ 2025-2026 Artist book Material: thermal paper, stainless steel and copper wire" },
  
]
  },


{
    id: "Ai Deng",
    name: "Ai Deng",
    roles: ["Artist"],
    city: "London",
    website: "https://ivydeng.com/",
    bio: "Ai Deng (b. 2002) is a Beijing-born multidisciplinary visual artist based in London. She graduated from the MA Visual Communication programme at the Royal College of Art. Her practice explores the relationships between humans and nature, body and spirit, and embodied perception within social, ecological, and psychological contexts. <br><br>Influenced by Taoist philosophy, her work engages with symbiosis, spiritual dwelling, and emotional states through poetic and symbolic visual language. Her process combines field research, walking, observation, bodily documentation, and material experimentation, often using clay, paper, natural materials, and moving image to create immersive and emotionally resonant spaces.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "We will ask, What does all of this mean?" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "We will ask, What does all of this mean?" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "How to cook your lover, 2023" },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "How to cook your lover, 2023" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "Tree Tree Tree" },
  { type: "video", youtube: "hUAB_0ZjyoQ", w: 30, rotate: -3, desc: "We will ask, What does all of this mean?" },
]
  },


{
    id: "Muchuan",
    name: "Muchuan",
    roles: ["Artist"],
    city: "London",
    website: "Muchuan is an artist working between found object, arrangement and landscape image. The practice centres on cheap household commodities coloured in bright fluorescent neon, and on the people who handle them, who first-hand research finds to be close to invisible. Busy pattern and strong colour that ought to be conspicuous instead hold a liminal position, and it is this trick of disappearance that the work follows, connecting the invisible figures in the landscape to the Zomia highlands of Southeast Asia and their history of retreat into mountain and forest. Working from contour surveys made around the Ban Gioc-Detian Falls, Muchuan recategorises small objects into the elements of a hill landscape and arranges them into new terrain.",
    bio: "https://cc0x033.net/",
    items: [

  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Outsider Inside: Perceive ∞ Imitate ∞ Disguise ∞ Incarnate" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Just a Streak of Fluorescence Passing" },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "Shore of the Labyrinth, the Sky at Dawn" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "Walking a Tightrope on a Glass Cliff" },
]
  },



{
    id: "Sijie Lyu",
    name: "Sijie Lyu",
    roles: ["Artist"],
    city: "London",
    website: "https://www.instagram.com/ziyi_yii/",
    bio: "Sijie Lyu is a London-based architect, designer and educator whose practice explores how material experimentation can reshape perception and recover a sense of wonder in contemporary architecture. Working across installations, objects and speculative architecture, she draws on mythology, traditional craft and cultural memory to create immersive spatial narratives that blur the boundaries between reality and imagination. Her work investigates materials not simply as construction elements, but as active agents capable of shaping rituals, transforming experience and revealing new relationships between people, landscape and time. Alongside her architectural practice, she teaches architecture at Central Saint Martins and continues to develop her independent research through competitions, exhibitions and experimental installations",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "Getting Lost in the Wood" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Getting Lost in the Wood" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Getting Lost in the Wood" },
]
  },


{
    id: "Yuyang Zhou",
    name: "Yuyang Zhou",
    roles: ["Artist"],
    city: "London",
    available: true,
    website: "https://www.instagram.com/zhouyuyangjoey/",
    bio: "Joey (Yuyang Zhou) is a live coder and performance artist working with algorithm as medium, alongside hardware instruments of their own making. Performances have taken place at the V&A, London, Corsica Studios, and TANK Shanghai, among others. <br><br>Each performance begins from nothing. Sound is grown slowly in the room and then allowed to die away, with improvisation and process held as constitutive rather than incidental. Joey treats the set as a transparent form of digital labour, one in which the mental effort remains visible, and as a way of reclaiming within the cold logic of the algorithm the uncertainty, error and unrepeatable liveness that belong to a human maker.",
    items: [
    { src: "image (5).webp", w: 20, rotate: 4, desc: "the degraded", link: "https://joeyjoeyjoe.bandcamp.com/track/the-degraded" },
    { src: "image.webp", w: 30, rotate: 2, desc: "i hate AI", link: "https://joeyjoeyjoe.bandcamp.com/track/i-hate-ai" },
    { src: "image (1).webp", w: 40, rotate: 5, desc: "Poor Party Demo", link: "https://joeyjoeyjoe.bandcamp.com/track/poor-party-demo" },
    { src: "image (2).webp", w: 30, rotate: -6, desc: "Waterways Licence", link: "https://joeyjoeyjoe.bandcamp.com/track/waterways-licence" },
]
  },


  {
    id: "Zhiqiang Li",
    name: "Zhiqiang Li",
    roles: ["Artist"],
    city: "London",
    available: true,
    website: "https://www.zhiqiangli.co.uk/",
    bio: "Zhiqiang Li (b. 1993) is an artist and researcher working between London, UK, and Harbin, China. He graduated from the Royal College of Art. His practice is informed by post-phenomenology, queer phenomenology, and media ecology, and is grounded in an understanding of art as a medium that shapes human perception. <br><br>Through practice-led research, he develops artistic interventions that respond to technological anaesthesia and rethink perception and embodiment within cultural institutions. His multimedia works have been exhibited at institutions including the Royal Academy of Arts and Tate Britain.",
    items: [
  { src: "image.webp", w: 25, rotate: 2,  desc: "Queer Touch" },
  { src: "image (1).webp", w: 25, rotate: 6,  desc: "Let Armenian  Shapes Speaking" },
  { src: "image (2).webp", w: 40, rotate: -5,  desc: "Home" },
  { src: "image (3).webp", w: 30, rotate: 1,  desc: "Soft Pressure of Love" },
  { src: "image (4).webp", w: 30, rotate: -2,  desc: "'Mistake' at Tate Britain" },
  { type: "video", vimeo: "1158275101", sound: true, w: 45, rotate: -3, desc: "Queer Touch" },
]
  },

  // ============================================
  // 【占位条目】FlexPrin 浮动原则
  // 还缺：city、website、封面图
  //   assets/images/artist/FlexPrin/cover.webp
  // 封面图没放之前，卡片会是一块空白。
  //
  // bio 沿用对方提供的英文原文，未作改动。两处待议：
  //   1. "environments—with attention" 里有一个 em dash，
  //      OMMFA 体例不用 em dash，改动需对方同意
  //   2. "organized" 是美式拼写，全站其余为英式
  // ============================================
  {
    id: "FlexPrin",
    name: "FlexPrin \u6d6e\u52a8\u539f\u5219",
    roles: ["Writer"],
    city: "Shanghai",
    website: "",
    bio: "FlexPrin \u6d6e\u52a8\u539f\u5219 (est. 2021) is a transdisciplinary research apparatus for art criticism, curatorial inquiry, and pedagogical practice. It integrates critical writing, curatorial production, and educational practice as interdependent modes of knowledge production. Its trajectory, shaped by spatial inquiry and infrastructural critique, extends toward the epistemic and cognitive regimes of contemporary cultural systems.<br><br>It investigates how knowledge is organized and made legible across artistic, educational, and media environments\u2014with attention to attention economies and the interpretive frameworks that govern cultural intelligibility. Its curatorial practice operates as an articulatory practice, establishing new connections across fields, communities, and discourses to reconfigure the terrain of meaning production, refusing to separate knowledge production from curatorial practice. The apparatus operates through writing, workshops, and curatorial experiments."
  }

];
