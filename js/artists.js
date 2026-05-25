// ============================================
// OMMFA 合作艺术家数据库
// 顺序就是页面显示顺序
//
// 字段:
// - id:       英文标识,对应图片文件夹 assets/images/artist/<id>/
// - name:     姓名
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
    city: "London",
    website: "http://aidapouryeganeh.com",
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
    city: "London",
    website: "https://yihuawang97.cargo.site/",
    bio: "Born and raised in Shenzhen, China, Yihua Wang is a documentary photographer and filmmaker currently based in London. Her works move between still and moving images. Working primarily with analogue film, medium-format for portraits and landscapes, and 35mm, often in black-and-white, for everyday scenes. She also frequently photographs with Polaroid. Across her documentary works, she follows women, friends, and others as they move through change. Whether it iss migration, shifting family relationships, personal healing, or the steady work of caring for others. Her work reflects her ongoing interest in how people are seen, how they remember, and how they find their place in the world.",
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
    city: "London",
    website: "https://ra.co/dj/chadzingkung/biography",
    bio: "Immersed in the undercurrents of the underground music scene, he captures marginalized emotions and the shimmering edges of morality. Crossing experimental electronics and club rhythms, he dedicates himself to crafting pervist music. London-based producer, musician, sound designer, and DJ. Immersed in the undercurrents of the underground music scene, he captures marginalized emotions and the shimmering edges of morality. Crossing experimental electronics and club rhythms, he dedicates himself to crafting pervist music.",
    items: [
  
  { src: "photo-02.webp", w: 25, rotate: 4,  desc: " " },
  { src: "photo-04.webp", w: 20, rotate: -5, desc: " " },
  { src: "photo-05.webp", w: 26, rotate: 2, desc: " " },
  { src: "photo-03.webp", w: 30, rotate: 2, desc: " " },
  { src: "photo-01.avif", w: 32, rotate: 5, desc: " " },
]
  },


  
  {
    id: "Sarah-Lou Sasha Marrek",
    name: "Sarah-Lou Sasha Marrek",
    city: "Paris",
    website: "https://sarah-lou.fr/home",
    bio: "Sarah-Lou maarek is a french multi disciplinary artist based in London, She firstly graduated her master in Architecture in 2019, paris, followed by FineArt master in 2022, London, pursuing both architecture visualisation and artistic practice. dedicated to story telling thought SHARED memory, myth and symbols. balancing between digital worlds, architecture, and tangible manifestations, she reach to several medium like a collection of clues to answer fascinations, ontological mirrors and universal sacred.",
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
    city: "Shanghai",
    website: "https://www.instagram.com/w2991534925?igsh=aGJ3YnAyamtyeWky",
    bio: " Wang Kehan, a young artist from the Central Academy of Fine Arts (CAFA). Anchored in the digital age, his practice utilizes 3D scanning, digital reconstruction, and the recombination of assets as core methodologies. He focus on deconstructing and reconstructing everyday symbols, transforming them into a metaphorical visual language to critique and reflect upon contemporary social phenomena. Kehan's work attempts to sketch out a post-human scenario, exploring new possibilities for individual cognition and collective destiny amidst the interplay of technology, power, and culture. Ultimately, his art practice is a thought experiment on the real world, conducted through the medium of virtual space.",
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
    city: "Thailand",
    website: "https://www.instagram.com/n.thipkul/",
    bio: "A spatial/communication designer specialising in creating immersive experiences and compelling narratives for brands, corporations, and hospitality ventures. With refined expertise and a multidisciplinary approach, she crafts designs that deeply resonate with audiences. At the RCA, Nicha delves into the realms of Material Cultures, Anthropology, and the transformative power of narratives within existing spaces. Her work reflects the intricate relationship between built environments and societal politics, investigating how architecture moulds and impacts human behaviour. Nicha pushes the boundaries of architectural possibilities, embracing exploration to create transformative narratives and visionary possibilities. By blending historical elements with speculative visions, she crafts experiences that challenge conventional norms and opens up the potential for transformative possibilities. Her work is a testament to the dynamic relationship between society, architecture and individuals.",
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
    city: "London",
    website: "https://plsdotexe.com/",
    bio: "Dear attention reading this, there seems to be a lot of empowering energy out there. Humanity seems to be in the revolutionary midst of life as we know it - see how the world has transformed in the last 100 years. This universe is old. Very old. And you are here now.If everything is energy and all energy is magnetic what are you attracting? I hope that you are well. Kind regards best wishes yours sincerely with love. i .I set myself a challenge, if I am alive, of producing 100 videos a year until 2030. This would enable a total of 1000 videos.",
    items: [
  { src: "photo-01.webp", w: 32, rotate: 4, desc: "2026" },
  { src: "photo-02.webp", w: 26, rotate: -8,  desc: "2026" },
  { src: "photo-03.webp", w: 32, rotate: -2, desc: "2016" },
  { src: "photo-04.webp", w: 26, rotate: 5, desc: "2016" },
  { src: "photo-05.webp", w: 30, rotate: 2, desc: "2009" },
]
  },

  
  {
    id: "Xinrui Qiu",
    name: "Xinrui Qiu",
    city: "London",
    website: "https://xinruiqiu.com/about",
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
    city: "London",
    website: "https://www.instagram.com/rynn_f_?igsh=NThqZXA4ZzZseXlu",
    bio: "Her practice addresses the situation of women, diaspora experience, and the confusion of contemporary youth within the context of Chinese culture. Stemming from a background in printmaking, Fu embraces process, intimately engaging with media and materials such as human hair, 3D printing, wood, and latex. Through installation, virtual experience, live performance, and wearable works, she explores embodiment, memory, and emotional connection. Recently, Fu has been developing an ongoing archival project, Dad and His Hundred Lives, which constructs a fictional archive around the imagined lives of her deceased father through the lens of childhood memory and fantasy. Combining fabricated documents, personal narratives, collected materials, and reconstructed memories, the project blurs the boundaries between reality and imagination, exploring grief, absence, identity, and the emotional ways memory is continuously rewritten over time. Her work is driven by a profound empathy that transcends individual narratives, forging connections between artist and viewer, and among viewers themselves. This shared humanity becomes a connective force, transforming personal exploration into a universal dialogue.",
    items: [

  { src: "photo-01.webp", w: 20, rotate: 4,  desc: "Mama I, 2025" },
  { src: "photo-02.webp", w: 20, rotate: -3,  desc: "Mama I, 2025" },
  { src: "photo-03.webp", w: 20, rotate: 5,  desc: "𝐆𝐫𝐚𝐟𝐭𝐢𝐧𝐠, Mixed Media, 2023" },
  { src: "photo-04.webp", w: 30, rotate: 9,  desc: "𝐆𝐫𝐚𝐟𝐭𝐢𝐧𝐠, Mixed Media, 2023" },
  { src: "photo-05.webp", w: 30, rotate: -2,  desc: "𝐆𝐫𝐚𝐟𝐭𝐢𝐧𝐠, Mixed Media, 2023" },
  { src: "photo-06.webp", w: 30, rotate: -2,  desc: "Mama I, 2025" },
]
  },

 {
    id: "Avatar Lilith",
    name: "Avatar Lilith",
    city: "London",
    website: "https://avatarlilith.com/",
    bio: "Avatar Lilith is a multi-disciplinary digital artist, virtual performer, and cyber-philosopher. Her work, archived on avatarlilith.com, explicitly rejects commercial influencer culture, operating instead as an artistic medium to dissect the friction between human flesh, artificial intelligence, and algorithmic control.Her diverse portfolio spans performance art, digital interventions, sound design, and experimental media. Notable projects include Open Source, a performance utilizing a specialized 'egg instrument' to challenge secretive tech frameworks, and Exit Protocol, which examines modern emotional dissociation. These physical and digital milestones include lecture showcases at Parsons, the IMPAKT Digital Festival, and curated galleries.Her latest projects challenge automated beauty standards and the automation of personal aesthetics. By subverting digital optimization tools, the artist exposes how hyper-optimization paradoxically erases individual authenticity. Ultimately, this avatar functions as a living critique of contemporary digital culture, questioning what it means to preserve identity within an automated society.",
    items: [

  { src: "photo-01.webp", w: 40, rotate: 4,  desc: "Exist Protocol, 2025" },
  { src: "photo-02.webp", w: 25, rotate: -3,  desc: "Exist Protocol, 2025" },
  { src: "photo-03.webp", w: 30, rotate: 5,  desc: "Performance, 2025" }, 
  { src: "photo-05.webp", w: 30, rotate: -2,  desc: "Vanish: Absence of Presence, The Wrong Biennale, 2025/26" },
  { src: "photo-04.webp", w: 40, rotate: 9,  desc: "Collected Topographies, 2024 - ongoing" },
]
  },

 {
    id: "Alexandra Ellerkamp",
    name: "Alexandra Ellerkamp",
    city: "Brooklyn",
    website: "https://www.instagram.com/alx_kamp/",
    bio: "Alexandra is a spatial artist from Brooklyn, whose work gravitates to the intersection of story-telling and story-making, the interstitial space between what has been and what can be. She believes that immersive space has the ability to make narratives and histories tangible. Her previous research and work can be placed in the intersection of craft and science. In her first year at the Royal College of Art, she researched how memories are both captured and expressed in space through various media. The projects produced include a written text about her grandparent pepto bismol pink bathroom, which was never actually pink, a sonic fiction of very real events created through manual manipulation of cassette tapes, and design for a staircase constructed from plastiglomerates and geological layers containing fossils of technological devices, a warning against the direct impact consumerism is having on the earth.",
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
    city: "London",
    website: "https://www.instagram.com/lucynurnberg/",
    bio: "Lucy Nurnberg is an artist from London working across interiors, graphic design, art direction, exhibitions and storytelling. She sees art as a way to imagine the world differently, combining the political with the playful, and plans to build the queer spaces of the future. After completing her BA in Illustration at the University of Brighton, Lucy had a career in writing and journalism. She was the co-founding editor of Accent magazine, an independent publication that was dedicated to “lives lived outside the ordinary” and celebrated non-conformists of all strokes. The magazine was stocked everywhere from MoMA PS1 to the Tate Modern Bookshop, and hosted events, workshops and residencies in venues including Somerset House, Tate Britain, the Hoxton Holborn and Shoreditch House.",
    items: [

  { src: "photo-01.webp", w: 30, rotate: 4,  desc: " " },
  { src: "photo-02.webp", w: 25, rotate: -3,  desc: " " },
  { src: "photo-03.webp", w: 30, rotate: 5,  desc: " " }, 
  { src: "photo-04.webp", w: 30, rotate: 5,  desc: " " }, 

]
  },

















];