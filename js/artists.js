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
    id: "Aida Pouryeganeh",
    name: "Aida Pouryeganeh",
    city: "London",
    website: "https://aidapouryeganeh.wordpress.com/",
    bio: "Aida is an artist working across painting and installation. She recently completed her MFA with distinction, after more than ten years of working in the arts. Her practice circles around diaspora, migration, and belonging — themes she keeps returning to because she has lived them. Painting isn't separate from the rest of her life; it's how she thinks, and how she translates what she feels into something that can be looked at.",
    items: [
  { src: "photo-01.webp", w: 32, rotate: 4, desc: "Untitled Drawing" },
  { src: "photo-02.webp", w: 36, rotate: 3,  desc: "Untitled, Monotype on Paper, 18 x 25 cm, 2024" },
  { src: "photo-03.webp", w: 26, rotate: -7, desc: " Crucified, The Wrong Biennale, 2025" },
  { src: "photo-04.webp", w: 26, rotate: -3, desc: " Grief (Detail) Clay and glue on mount board 40x59cm" },
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
    city: "London",
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






























];