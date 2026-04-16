// Built-in English vocabulary database
const BUILT_IN_WORDS = [
  // === EASY (A2–B1) ===
  {
    id: 'b001', word: 'curious', phonetic: '/ˈkjʊər.i.əs/', pos: 'adj.',
    definition: '好奇的', example: 'Children are naturally curious about the world around them.',
    difficulty: 'easy', tags: ['personality']
  },
  {
    id: 'b002', word: 'generous', phonetic: '/ˈdʒen.ər.əs/', pos: 'adj.',
    definition: '慷慨的；大方的', example: 'She was generous enough to share her lunch with everyone.',
    difficulty: 'easy', tags: ['personality']
  },
  {
    id: 'b003', word: 'anxious', phonetic: '/ˈæŋk.ʃəs/', pos: 'adj.',
    definition: '焦慮的；擔心的', example: 'He felt anxious before the big presentation.',
    difficulty: 'easy', tags: ['emotion']
  },
  {
    id: 'b004', word: 'exhausted', phonetic: '/ɪɡˈzɔːs.tɪd/', pos: 'adj.',
    definition: '精疲力竭的；筋疲力盡的', example: 'After the marathon, she was completely exhausted.',
    difficulty: 'easy', tags: ['emotion', 'body']
  },
  {
    id: 'b005', word: 'accomplish', phonetic: '/əˈkɒm.plɪʃ/', pos: 'v.',
    definition: '完成；實現（目標）', example: 'She accomplished everything she set out to do.',
    difficulty: 'easy', tags: ['achievement']
  },
  {
    id: 'b006', word: 'grateful', phonetic: '/ˈɡreɪt.fəl/', pos: 'adj.',
    definition: '感激的；感恩的', example: 'I am grateful for all the support you have given me.',
    difficulty: 'easy', tags: ['emotion', 'personality']
  },
  {
    id: 'b007', word: 'flexible', phonetic: '/ˈflek.sɪ.bəl/', pos: 'adj.',
    definition: '靈活的；有彈性的', example: 'A flexible schedule makes it easier to maintain work-life balance.',
    difficulty: 'easy', tags: ['work', 'personality']
  },
  {
    id: 'b008', word: 'significant', phonetic: '/sɪɡˈnɪf.ɪ.kənt/', pos: 'adj.',
    definition: '重要的；顯著的', example: 'There has been a significant improvement in his grades.',
    difficulty: 'easy', tags: ['academic']
  },
  {
    id: 'b009', word: 'perspective', phonetic: '/pəˈspek.tɪv/', pos: 'n.',
    definition: '觀點；視角；看法', example: 'Traveling broadens your perspective on life.',
    difficulty: 'easy', tags: ['thinking', 'academic']
  },
  {
    id: 'b010', word: 'consequence', phonetic: '/ˈkɒn.sɪ.kwəns/', pos: 'n.',
    definition: '後果；結果', example: 'Every action has consequences, both good and bad.',
    difficulty: 'easy', tags: ['academic', 'thinking']
  },
  {
    id: 'b011', word: 'opportunity', phonetic: '/ˌɒp.əˈtjuː.nɪ.ti/', pos: 'n.',
    definition: '機會；時機', example: 'This job offer is a great opportunity for career growth.',
    difficulty: 'easy', tags: ['work', 'achievement']
  },
  {
    id: 'b012', word: 'communicate', phonetic: '/kəˈmjuː.nɪ.keɪt/', pos: 'v.',
    definition: '溝通；傳達（想法或感受）', example: 'It\'s important to communicate clearly in a team.',
    difficulty: 'easy', tags: ['work', 'social']
  },
  {
    id: 'b013', word: 'recommend', phonetic: '/ˌrek.əˈmend/', pos: 'v.',
    definition: '推薦；建議', example: 'Can you recommend a good restaurant near here?',
    difficulty: 'easy', tags: ['social']
  },
  {
    id: 'b014', word: 'appreciate', phonetic: '/əˈpriː.ʃi.eɪt/', pos: 'v.',
    definition: '感激；欣賞；理解', example: 'I really appreciate your help with this project.',
    difficulty: 'easy', tags: ['social', 'emotion']
  },
  {
    id: 'b015', word: 'determine', phonetic: '/dɪˈtɜː.mɪn/', pos: 'v.',
    definition: '決定；查明；確定', example: 'Scientists are trying to determine the cause of the outbreak.',
    difficulty: 'easy', tags: ['academic', 'thinking']
  },
  {
    id: 'b016', word: 'frustrate', phonetic: '/frʌˈstreɪt/', pos: 'v.',
    definition: '使沮喪；阻撓；妨礙', example: 'Slow internet always frustrates me when I\'m working.',
    difficulty: 'easy', tags: ['emotion']
  },
  {
    id: 'b017', word: 'achieve', phonetic: '/əˈtʃiːv/', pos: 'v.',
    definition: '達到；完成；取得', example: 'With hard work, you can achieve anything you set your mind to.',
    difficulty: 'easy', tags: ['achievement']
  },
  {
    id: 'b018', word: 'environment', phonetic: '/ɪnˈvaɪ.rən.mənt/', pos: 'n.',
    definition: '環境（自然/工作/社會）', example: 'We need to protect the environment for future generations.',
    difficulty: 'easy', tags: ['nature', 'society']
  },
  {
    id: 'b019', word: 'recognize', phonetic: '/ˈrek.əɡ.naɪz/', pos: 'v.',
    definition: '認出；承認；認可', example: 'I recognized his voice immediately on the phone.',
    difficulty: 'easy', tags: ['academic']
  },
  {
    id: 'b020', word: 'assume', phonetic: '/əˈsjuːm/', pos: 'v.',
    definition: '假設；以為；承擔', example: 'Don\'t assume you know what someone is thinking.',
    difficulty: 'easy', tags: ['thinking']
  },

  // === MEDIUM (B2) ===
  {
    id: 'b021', word: 'eloquent', phonetic: '/ˈel.ə.kwənt/', pos: 'adj.',
    definition: '口才好的；能言善道的；有說服力的',
    example: 'Her eloquent speech moved everyone in the audience to tears.',
    difficulty: 'medium', tags: ['communication', 'personality']
  },
  {
    id: 'b022', word: 'resilient', phonetic: '/rɪˈzɪl.i.ənt/', pos: 'adj.',
    definition: '有韌性的；適應力強的；能快速恢復的',
    example: 'Children are often more resilient than adults give them credit for.',
    difficulty: 'medium', tags: ['personality', 'mental']
  },
  {
    id: 'b023', word: 'ambiguous', phonetic: '/æmˈbɪɡ.ju.əs/', pos: 'adj.',
    definition: '模糊的；有歧義的；不明確的',
    example: 'The contract had several ambiguous clauses that led to confusion.',
    difficulty: 'medium', tags: ['language', 'academic']
  },
  {
    id: 'b024', word: 'inevitable', phonetic: '/ɪnˈev.ɪ.tə.bəl/', pos: 'adj.',
    definition: '不可避免的；必然發生的',
    example: 'Change is inevitable; how you respond to it makes all the difference.',
    difficulty: 'medium', tags: ['thinking', 'philosophy']
  },
  {
    id: 'b025', word: 'diligent', phonetic: '/ˈdɪl.ɪ.dʒənt/', pos: 'adj.',
    definition: '勤勉的；努力工作的',
    example: 'She was a diligent student who never missed a deadline.',
    difficulty: 'medium', tags: ['personality', 'work']
  },
  {
    id: 'b026', word: 'persevere', phonetic: '/ˌpɜː.sɪˈvɪər/', pos: 'v.',
    definition: '堅持；不屈不撓地繼續',
    example: 'Even when it got tough, he persevered and finished the project.',
    difficulty: 'medium', tags: ['personality', 'achievement']
  },
  {
    id: 'b027', word: 'meticulous', phonetic: '/mɪˈtɪk.jʊ.ləs/', pos: 'adj.',
    definition: '一絲不苟的；非常細心的',
    example: 'The surgeon was meticulous in following every procedure.',
    difficulty: 'medium', tags: ['personality', 'work']
  },
  {
    id: 'b028', word: 'profound', phonetic: '/prəˈfaʊnd/', pos: 'adj.',
    definition: '深刻的；意義深遠的；profound',
    example: 'Reading that book had a profound effect on how I see the world.',
    difficulty: 'medium', tags: ['thinking', 'academic']
  },
  {
    id: 'b029', word: 'pragmatic', phonetic: '/præɡˈmæt.ɪk/', pos: 'adj.',
    definition: '務實的；注重實際的',
    example: 'We need a pragmatic solution, not a perfect but impossible one.',
    difficulty: 'medium', tags: ['thinking', 'work']
  },
  {
    id: 'b030', word: 'spontaneous', phonetic: '/spɒnˈteɪ.ni.əs/', pos: 'adj.',
    definition: '自發的；自然發生的；不刻意的',
    example: 'Their spontaneous road trip turned out to be the best vacation.',
    difficulty: 'medium', tags: ['personality', 'lifestyle']
  },
  {
    id: 'b031', word: 'versatile', phonetic: '/ˈvɜː.sə.taɪl/', pos: 'adj.',
    definition: '多才多藝的；多功能的；適應性強的',
    example: 'She is versatile enough to work in both design and engineering.',
    difficulty: 'medium', tags: ['personality', 'work']
  },
  {
    id: 'b032', word: 'integrity', phonetic: '/ɪnˈteɡ.rɪ.ti/', pos: 'n.',
    definition: '誠信；正直；品行端正',
    example: 'A leader with integrity earns the trust of their team.',
    difficulty: 'medium', tags: ['personality', 'ethics']
  },
  {
    id: 'b033', word: 'empathy', phonetic: '/ˈem.pə.θi/', pos: 'n.',
    definition: '同理心；設身處地理解他人感受的能力',
    example: 'Good nurses show empathy toward their patients every day.',
    difficulty: 'medium', tags: ['emotion', 'social', 'mental']
  },
  {
    id: 'b034', word: 'momentum', phonetic: '/məˈmen.təm/', pos: 'n.',
    definition: '動力；勢頭；（物理）動量',
    example: 'Once the project gained momentum, it was hard to stop.',
    difficulty: 'medium', tags: ['work', 'achievement']
  },
  {
    id: 'b035', word: 'nuance', phonetic: '/ˈnjuː.ɑːns/', pos: 'n.',
    definition: '細微差別；微妙之處；精妙細節',
    example: 'Learning a language means understanding the nuances of expression.',
    difficulty: 'medium', tags: ['language', 'thinking']
  },
  {
    id: 'b036', word: 'skeptical', phonetic: '/ˈskep.tɪ.kəl/', pos: 'adj.',
    definition: '懷疑的；持懷疑態度的',
    example: 'I\'m skeptical about claims that promise overnight success.',
    difficulty: 'medium', tags: ['thinking', 'personality']
  },
  {
    id: 'b037', word: 'collaborate', phonetic: '/kəˈlæb.ər.eɪt/', pos: 'v.',
    definition: '合作；協作共同完成',
    example: 'The two companies collaborated to develop the new product.',
    difficulty: 'medium', tags: ['work', 'social']
  },
  {
    id: 'b038', word: 'procrastinate', phonetic: '/prəˈkræs.tɪ.neɪt/', pos: 'v.',
    definition: '拖延；把事情推到之後再做',
    example: 'I tend to procrastinate when faced with tasks I don\'t enjoy.',
    difficulty: 'medium', tags: ['behavior', 'work']
  },
  {
    id: 'b039', word: 'articulate', phonetic: '/ɑːˈtɪk.jʊ.lət/', pos: 'adj.',
    definition: '能清楚表達的；口齒清晰的',
    example: 'She was articulate and confident during the interview.',
    difficulty: 'medium', tags: ['communication', 'personality']
  },
  {
    id: 'b040', word: 'contemplate', phonetic: '/ˈkɒn.tem.pleɪt/', pos: 'v.',
    definition: '沉思；仔細考慮；凝視',
    example: 'He sat by the window, contemplating his next move.',
    difficulty: 'medium', tags: ['thinking']
  },
  {
    id: 'b041', word: 'compelling', phonetic: '/kəmˈpel.ɪŋ/', pos: 'adj.',
    definition: '引人注目的；令人信服的；非常有趣的',
    example: 'The documentary presented a compelling case for action.',
    difficulty: 'medium', tags: ['academic', 'communication']
  },
  {
    id: 'b042', word: 'sustainable', phonetic: '/səˈsteɪ.nə.bəl/', pos: 'adj.',
    definition: '可持續的；環保的；可長期維持的',
    example: 'We need to find sustainable sources of energy for the future.',
    difficulty: 'medium', tags: ['nature', 'society', 'work']
  },
  {
    id: 'b043', word: 'validate', phonetic: '/ˈvæl.ɪ.deɪt/', pos: 'v.',
    definition: '確認；使有效；認可',
    example: 'The experiment results validated the original hypothesis.',
    difficulty: 'medium', tags: ['academic', 'thinking']
  },
  {
    id: 'b044', word: 'elaborate', phonetic: '/ɪˈlæb.ər.ɪt/', pos: 'adj. / v.',
    definition: '（adj.）精心設計的；複雜的 / （v.）詳細說明',
    example: 'Could you elaborate on your idea? I\'d like to understand it better.',
    difficulty: 'medium', tags: ['communication', 'academic']
  },
  {
    id: 'b045', word: 'innovative', phonetic: '/ˈɪn.ə.veɪ.tɪv/', pos: 'adj.',
    definition: '創新的；引入新方法或技術的',
    example: 'The startup introduced an innovative approach to remote work.',
    difficulty: 'medium', tags: ['work', 'achievement']
  },

  // === HARD (C1–C2) ===
  {
    id: 'b046', word: 'ephemeral', phonetic: '/ɪˈfem.ər.əl/', pos: 'adj.',
    definition: '短暫的；轉瞬即逝的',
    example: 'Fame can be ephemeral — here today, forgotten tomorrow.',
    difficulty: 'hard', tags: ['philosophy', 'time']
  },
  {
    id: 'b047', word: 'ubiquitous', phonetic: '/juːˈbɪk.wɪ.təs/', pos: 'adj.',
    definition: '無所不在的；到處存在的',
    example: 'Smartphones have become ubiquitous in modern society.',
    difficulty: 'hard', tags: ['society', 'technology']
  },
  {
    id: 'b048', word: 'paradigm', phonetic: '/ˈpær.ə.daɪm/', pos: 'n.',
    definition: '典範；範例；思維框架',
    example: 'The internet represented a paradigm shift in communication.',
    difficulty: 'hard', tags: ['academic', 'thinking']
  },
  {
    id: 'b049', word: 'serendipity', phonetic: '/ˌser.ənˈdɪp.ɪ.ti/', pos: 'n.',
    definition: '意外的美好發現；美好的巧合',
    example: 'Finding my best friend on that train was pure serendipity.',
    difficulty: 'hard', tags: ['life', 'philosophy']
  },
  {
    id: 'b050', word: 'tenacious', phonetic: '/tɪˈneɪ.ʃəs/', pos: 'adj.',
    definition: '頑強的；堅韌不拔的；執著的',
    example: 'Despite many failures, she remained tenacious in her pursuit.',
    difficulty: 'hard', tags: ['personality', 'achievement']
  },
  {
    id: 'b051', word: 'perspicacious', phonetic: '/ˌpɜː.spɪˈkeɪ.ʃəs/', pos: 'adj.',
    definition: '有洞察力的；眼光敏銳的',
    example: 'A perspicacious investor spotted the trend long before others.',
    difficulty: 'hard', tags: ['personality', 'thinking']
  },
  {
    id: 'b052', word: 'loquacious', phonetic: '/ləˈkweɪ.ʃəs/', pos: 'adj.',
    definition: '話多的；非常健談的',
    example: 'My loquacious neighbor can talk for hours without stopping.',
    difficulty: 'hard', tags: ['personality', 'communication']
  },
  {
    id: 'b053', word: 'ameliorate', phonetic: '/əˈmiː.li.ə.reɪt/', pos: 'v.',
    definition: '改善；使（壞的情況）好轉',
    example: 'The new policy aims to ameliorate conditions for low-income families.',
    difficulty: 'hard', tags: ['society', 'academic']
  },
  {
    id: 'b054', word: 'equivocal', phonetic: '/ɪˈkwɪv.ə.kəl/', pos: 'adj.',
    definition: '模稜兩可的；含糊其辭的',
    example: 'The politician gave an equivocal answer to avoid controversy.',
    difficulty: 'hard', tags: ['language', 'communication']
  },
  {
    id: 'b055', word: 'ostensible', phonetic: '/ɒˈsten.sɪ.bəl/', pos: 'adj.',
    definition: '表面上的；看似如此的（但實際可能不然）',
    example: 'His ostensible reason for leaving was health, but everyone knew otherwise.',
    difficulty: 'hard', tags: ['thinking', 'academic']
  },
  {
    id: 'b056', word: 'taciturn', phonetic: '/ˈtæs.ɪ.tɜːn/', pos: 'adj.',
    definition: '沉默寡言的；不愛說話的',
    example: 'He was taciturn by nature, preferring to listen rather than speak.',
    difficulty: 'hard', tags: ['personality', 'communication']
  },
  {
    id: 'b057', word: 'fervent', phonetic: '/ˈfɜː.vənt/', pos: 'adj.',
    definition: '熱情的；強烈的；熱誠的',
    example: 'She is a fervent believer in the power of education.',
    difficulty: 'hard', tags: ['emotion', 'personality']
  },
  {
    id: 'b058', word: 'cogent', phonetic: '/ˈkəʊ.dʒənt/', pos: 'adj.',
    definition: '有說服力的；切中要害的；邏輯清楚的',
    example: 'The lawyer made a cogent argument that swayed the jury.',
    difficulty: 'hard', tags: ['communication', 'thinking', 'academic']
  },
  {
    id: 'b059', word: 'propensity', phonetic: '/prəˈpen.sɪ.ti/', pos: 'n.',
    definition: '傾向；癖好；自然而然的習慣',
    example: 'He has a propensity for arriving late to every meeting.',
    difficulty: 'hard', tags: ['behavior', 'personality']
  },
  {
    id: 'b060', word: 'juxtapose', phonetic: '/ˈdʒʌk.stə.pəʊz/', pos: 'v.',
    definition: '並列；把（對比事物）放在一起對比',
    example: 'The exhibit juxtaposes traditional paintings with modern digital art.',
    difficulty: 'hard', tags: ['art', 'academic', 'thinking']
  },

  // === ADVANCED — Politics & Government ===
  {
    id: 'c001', word: 'constituency', phonetic: '/kənˈstɪtʃ.u.ən.si/', pos: 'n.',
    definition: '選區；（政治人物的）選民群體',
    example: 'The senator returned to her constituency to meet voters directly.',
    difficulty: 'hard', tags: ['politics', 'government']
  },
  {
    id: 'c002', word: 'referendum', phonetic: '/ˌref.ərˈen.dəm/', pos: 'n.',
    definition: '公民投票；全民公決',
    example: 'The government called a referendum on whether to join the trade bloc.',
    difficulty: 'hard', tags: ['politics', 'government', 'democracy']
  },
  {
    id: 'c003', word: 'incumbent', phonetic: '/ɪnˈkʌm.bənt/', pos: 'adj. / n.',
    definition: '現任的；在職者',
    example: 'The incumbent president faced a strong challenge from the opposition.',
    difficulty: 'hard', tags: ['politics', 'government']
  },
  {
    id: 'c004', word: 'ratify', phonetic: '/ˈræt.ɪ.faɪ/', pos: 'v.',
    definition: '正式批准（條約、協議或法律）',
    example: 'The Senate must ratify any international treaty before it takes effect.',
    difficulty: 'hard', tags: ['politics', 'law']
  },
  {
    id: 'c005', word: 'sovereignty', phonetic: '/ˈsɒv.rɪn.ti/', pos: 'n.',
    definition: '主權；最高統治權',
    example: 'Brexit was framed by its supporters as a matter of national sovereignty.',
    difficulty: 'hard', tags: ['politics', 'law', 'philosophy']
  },
  {
    id: 'c006', word: 'mandate', phonetic: '/ˈmæn.deɪt/', pos: 'n. / v.',
    definition: '（n.）授權；政治任務 / （v.）授權；強制規定',
    example: 'The party claimed a mandate for reform after winning the election.',
    difficulty: 'hard', tags: ['politics', 'government']
  },
  {
    id: 'c007', word: 'partisan', phonetic: '/ˈpɑː.tɪ.zæn/', pos: 'adj.',
    definition: '黨派性的；強烈偏袒某一方的',
    example: 'The vote on the bill was entirely partisan, with no cross-party support.',
    difficulty: 'hard', tags: ['politics', 'society']
  },
  {
    id: 'c008', word: 'bicameral', phonetic: '/baɪˈkæm.ər.əl/', pos: 'adj.',
    definition: '兩院制的（指立法機構有上下兩院）',
    example: 'The US Congress is a bicameral legislature, consisting of the Senate and the House.',
    difficulty: 'hard', tags: ['politics', 'government']
  },
  {
    id: 'c009', word: 'filibuster', phonetic: '/ˈfɪl.ɪ.bʌs.tər/', pos: 'n. / v.',
    definition: '（議會）冗長演說阻撓議事；阻撓戰術',
    example: 'The senator staged a 12-hour filibuster to block the legislation.',
    difficulty: 'hard', tags: ['politics', 'government']
  },
  {
    id: 'c010', word: 'gerrymander', phonetic: '/ˈdʒer.i.mæn.dər/', pos: 'v. / n.',
    definition: '不公平劃分選區（以利特定黨派）',
    example: 'Critics accused the ruling party of gerrymandering districts to entrench its majority.',
    difficulty: 'hard', tags: ['politics', 'government', 'democracy']
  },
  {
    id: 'c011', word: 'lobbying', phonetic: '/ˈlɒb.i.ɪŋ/', pos: 'n.',
    definition: '遊說（試圖影響政府官員或議員）',
    example: 'The pharmaceutical industry spent billions on lobbying against the drug price bill.',
    difficulty: 'hard', tags: ['politics', 'business']
  },
  {
    id: 'c012', word: 'coalition', phonetic: '/ˌkəʊ.əˈlɪʃ.ən/', pos: 'n.',
    definition: '聯盟；聯合政府（多黨合作執政）',
    example: 'No party won a majority, so they had to form a coalition government.',
    difficulty: 'hard', tags: ['politics', 'government']
  },
  {
    id: 'c013', word: 'austerity', phonetic: '/ɒˈster.ɪ.ti/', pos: 'n.',
    definition: '（財政）緊縮政策；儉約',
    example: 'Years of austerity led to deep cuts in public services and social welfare.',
    difficulty: 'hard', tags: ['politics', 'economics']
  },
  {
    id: 'c014', word: 'bureaucracy', phonetic: '/bjʊəˈrɒk.rə.si/', pos: 'n.',
    definition: '官僚體制；繁文縟節；行政機構',
    example: 'Small businesses complained that excessive bureaucracy stifled innovation.',
    difficulty: 'hard', tags: ['politics', 'government', 'society']
  },
  {
    id: 'c015', word: 'disenfranchise', phonetic: '/ˌdɪs.ɪnˈfræn.tʃaɪz/', pos: 'v.',
    definition: '剝奪（某人）選舉權或公民權利',
    example: 'Strict voter ID laws were accused of disenfranchising minority communities.',
    difficulty: 'hard', tags: ['politics', 'democracy', 'society']
  },

  // === ADVANCED — Social Science & Sociology ===
  {
    id: 'c016', word: 'demographic', phonetic: '/ˌdem.əˈɡræf.ɪk/', pos: 'adj. / n.',
    definition: '人口統計的；（n.）人口特徵；特定族群',
    example: 'The demographic shift toward an older population will strain pension systems.',
    difficulty: 'hard', tags: ['sociology', 'society']
  },
  {
    id: 'c017', word: 'empirical', phonetic: '/ɪmˈpɪr.ɪ.kəl/', pos: 'adj.',
    definition: '以實驗或實際觀察為基礎的；實證的',
    example: 'The policy must be based on empirical evidence, not ideology.',
    difficulty: 'hard', tags: ['academic', 'science']
  },
  {
    id: 'c018', word: 'hegemony', phonetic: '/hɪˈdʒem.ə.ni/', pos: 'n.',
    definition: '霸權；（政治、文化上的）主導地位',
    example: 'Critics question whether American cultural hegemony benefits the rest of the world.',
    difficulty: 'hard', tags: ['politics', 'sociology', 'philosophy']
  },
  {
    id: 'c019', word: 'ideology', phonetic: '/ˌaɪ.diˈɒl.ə.dʒi/', pos: 'n.',
    definition: '意識形態；思想體系',
    example: 'The party\'s ideology shifted significantly over the past two decades.',
    difficulty: 'hard', tags: ['politics', 'philosophy', 'society']
  },
  {
    id: 'c020', word: 'discourse', phonetic: '/ˈdɪs.kɔːs/', pos: 'n.',
    definition: '論述；（正式的）討論；話語體系',
    example: 'The media plays a central role in shaping public discourse on immigration.',
    difficulty: 'hard', tags: ['language', 'politics', 'academic']
  },
  {
    id: 'c021', word: 'polarization', phonetic: '/ˌpəʊ.lər.aɪˈzeɪ.ʃən/', pos: 'n.',
    definition: '兩極化；對立加劇（尤指政治或社會）',
    example: 'Political polarization has made bipartisan cooperation nearly impossible.',
    difficulty: 'hard', tags: ['politics', 'society', 'sociology']
  },
  {
    id: 'c022', word: 'marginalize', phonetic: '/ˈmɑː.dʒɪ.nə.laɪz/', pos: 'v.',
    definition: '邊緣化；使被忽視或被排除在主流之外',
    example: 'Automation risks marginalizing workers without digital skills.',
    difficulty: 'hard', tags: ['society', 'sociology']
  },
  {
    id: 'c023', word: 'stigmatize', phonetic: '/ˈstɪɡ.mə.taɪz/', pos: 'v.',
    definition: '污名化；使蒙受社會恥辱或偏見',
    example: 'Mental illness is still stigmatized in many cultures.',
    difficulty: 'hard', tags: ['society', 'sociology', 'mental']
  },
  {
    id: 'c024', word: 'systemic', phonetic: '/sɪˈstem.ɪk/', pos: 'adj.',
    definition: '系統性的；根植於整體制度中的',
    example: 'Activists argue that racial inequality is systemic, not merely individual.',
    difficulty: 'hard', tags: ['society', 'politics', 'sociology']
  },
  {
    id: 'c025', word: 'assimilate', phonetic: '/əˈsɪm.ɪ.leɪt/', pos: 'v.',
    definition: '（使）同化；吸收融入（新文化或群體）',
    example: 'Immigrants often face pressure to assimilate into the dominant culture.',
    difficulty: 'hard', tags: ['sociology', 'society']
  },

  // === ADVANCED — Economics ===
  {
    id: 'c026', word: 'fiscal', phonetic: '/ˈfɪs.kəl/', pos: 'adj.',
    definition: '財政的；國庫的（與政府收支相關）',
    example: 'The government adopted a strict fiscal policy to reduce the national deficit.',
    difficulty: 'hard', tags: ['economics', 'government']
  },
  {
    id: 'c027', word: 'monetary', phonetic: '/ˈmʌn.ɪ.tər.i/', pos: 'adj.',
    definition: '貨幣的；金融的',
    example: 'The central bank used monetary policy to combat inflation.',
    difficulty: 'hard', tags: ['economics', 'finance']
  },
  {
    id: 'c028', word: 'deficit', phonetic: '/ˈdef.ɪ.sɪt/', pos: 'n.',
    definition: '（財政）赤字；不足額；差額',
    example: 'The government ran a large deficit during the economic downturn.',
    difficulty: 'hard', tags: ['economics', 'government']
  },
  {
    id: 'c029', word: 'subsidy', phonetic: '/ˈsʌb.sɪ.di/', pos: 'n.',
    definition: '（政府）補貼；補助金',
    example: 'Agricultural subsidies distort global food markets, critics argue.',
    difficulty: 'hard', tags: ['economics', 'government']
  },
  {
    id: 'c030', word: 'tariff', phonetic: '/ˈtær.ɪf/', pos: 'n.',
    definition: '關稅；進口稅',
    example: 'The new tariffs on steel imports triggered a trade dispute with Europe.',
    difficulty: 'hard', tags: ['economics', 'politics']
  },
  {
    id: 'c031', word: 'recession', phonetic: '/rɪˈseʃ.ən/', pos: 'n.',
    definition: '（經濟）衰退；蕭條時期',
    example: 'The pandemic triggered the deepest global recession in decades.',
    difficulty: 'hard', tags: ['economics']
  },
  {
    id: 'c032', word: 'deregulation', phonetic: '/ˌdiː.reɡ.jʊˈleɪ.ʃən/', pos: 'n.',
    definition: '解除（政府）管制；市場自由化',
    example: 'Financial deregulation in the 1990s contributed to the 2008 crisis.',
    difficulty: 'hard', tags: ['economics', 'politics']
  },
  {
    id: 'c033', word: 'inequality', phonetic: '/ˌɪn.ɪˈkwɒl.ɪ.ti/', pos: 'n.',
    definition: '不平等；（財富、機會等的）差距',
    example: 'Rising income inequality has become one of the defining issues of our era.',
    difficulty: 'hard', tags: ['economics', 'society']
  },

  // === ADVANCED — Philosophy & Humanities ===
  {
    id: 'c034', word: 'rhetoric', phonetic: '/ˈret.ər.ɪk/', pos: 'n.',
    definition: '修辭（術）；說服性語言；（貶義）空洞的言辭',
    example: 'The speech was full of inspiring rhetoric but short on concrete policy.',
    difficulty: 'hard', tags: ['language', 'politics', 'philosophy']
  },
  {
    id: 'c035', word: 'dialectic', phonetic: '/ˌdaɪ.əˈlek.tɪk/', pos: 'n.',
    definition: '辯證法；透過對立觀點的對話尋求真理',
    example: 'Hegel\'s dialectic sees history as a series of thesis, antithesis, and synthesis.',
    difficulty: 'hard', tags: ['philosophy', 'academic']
  },
  {
    id: 'c036', word: 'epistemology', phonetic: '/ɪˌpɪs.tɪˈmɒl.ə.dʒi/', pos: 'n.',
    definition: '認識論（哲學分支，研究知識的本質與範圍）',
    example: 'Epistemology asks: how do we know what we know?',
    difficulty: 'hard', tags: ['philosophy', 'academic']
  },
  {
    id: 'c037', word: 'utilitarianism', phonetic: '/juːˌtɪl.ɪˈteər.i.ə.nɪz.əm/', pos: 'n.',
    definition: '功利主義（道德哲學：以最大多數人的最大幸福為標準）',
    example: 'From a utilitarian perspective, a policy is good if it maximizes overall happiness.',
    difficulty: 'hard', tags: ['philosophy', 'ethics']
  },
  {
    id: 'c038', word: 'egalitarian', phonetic: '/ɪˌɡæl.ɪˈteər.i.ən/', pos: 'adj.',
    definition: '平等主義的；主張人人平等的',
    example: 'The party advocates an egalitarian society where opportunity is equally distributed.',
    difficulty: 'hard', tags: ['philosophy', 'politics', 'society']
  },
  {
    id: 'c039', word: 'autonomy', phonetic: '/ɔːˈtɒn.ə.mi/', pos: 'n.',
    definition: '自主；自治；獨立決策的權利或能力',
    example: 'Respecting individual autonomy is a cornerstone of liberal political philosophy.',
    difficulty: 'hard', tags: ['philosophy', 'politics', 'psychology']
  },
  {
    id: 'c040', word: 'altruism', phonetic: '/ˈæl.tru.ɪ.z(ə)m/', pos: 'n.',
    definition: '利他主義；無私地關心他人利益',
    example: 'Whether true altruism exists — or whether all giving is ultimately self-serving — is a philosophical debate.',
    difficulty: 'hard', tags: ['philosophy', 'ethics', 'psychology']
  },
  {
    id: 'c041', word: 'dogma', phonetic: '/ˈdɒɡ.mə/', pos: 'n.',
    definition: '教條；不容置疑的信條；武斷的主張',
    example: 'He questioned the party\'s economic dogma and proposed a more pragmatic approach.',
    difficulty: 'hard', tags: ['philosophy', 'politics', 'religion']
  },
  {
    id: 'c042', word: 'axiom', phonetic: '/ˈæk.si.əm/', pos: 'n.',
    definition: '公理；不證自明的基本原則',
    example: 'It was treated as an axiom that free markets produce the best outcomes.',
    difficulty: 'hard', tags: ['philosophy', 'academic', 'logic']
  },

  // === ADVANCED — Academic & Journalistic ===
  {
    id: 'c043', word: 'extrapolate', phonetic: '/ɪkˈstræp.ə.leɪt/', pos: 'v.',
    definition: '（從已知事實）推斷；推算（未知情況）',
    example: 'We cannot simply extrapolate current trends and assume the future will look the same.',
    difficulty: 'hard', tags: ['academic', 'thinking']
  },
  {
    id: 'c044', word: 'corroborate', phonetic: '/kəˈrɒb.ər.eɪt/', pos: 'v.',
    definition: '（以新證據）確認；進一步證實',
    example: 'The witness\'s account was corroborated by CCTV footage.',
    difficulty: 'hard', tags: ['academic', 'law']
  },
  {
    id: 'c045', word: 'exacerbate', phonetic: '/ɪɡˈzæs.ər.beɪt/', pos: 'v.',
    definition: '使惡化；加劇（問題或痛苦）',
    example: 'The drought exacerbated food insecurity across the region.',
    difficulty: 'hard', tags: ['academic', 'society']
  },
  {
    id: 'c046', word: 'alleviate', phonetic: '/əˈliː.vi.eɪt/', pos: 'v.',
    definition: '減輕；緩和（痛苦、問題或困難）',
    example: 'The aid package was designed to alleviate poverty in the most affected areas.',
    difficulty: 'hard', tags: ['academic', 'society']
  },
  {
    id: 'c047', word: 'perpetuate', phonetic: '/pəˈpetʃ.u.eɪt/', pos: 'v.',
    definition: '使永久存在；延續（某種狀況，通常是負面的）',
    example: 'Stereotypes in the media perpetuate harmful misconceptions about minority groups.',
    difficulty: 'hard', tags: ['society', 'academic']
  },
  {
    id: 'c048', word: 'circumvent', phonetic: '/ˌsɜː.kəmˈvent/', pos: 'v.',
    definition: '繞過；規避（規則、困難或障礙）',
    example: 'Companies use complex structures to circumvent tax regulations.',
    difficulty: 'hard', tags: ['law', 'business', 'academic']
  },
  {
    id: 'c049', word: 'mitigate', phonetic: '/ˈmɪt.ɪ.ɡeɪt/', pos: 'v.',
    definition: '減輕；緩和（不良影響或嚴重性）',
    example: 'Renewable energy is essential to mitigate the effects of climate change.',
    difficulty: 'hard', tags: ['academic', 'environment']
  },
  {
    id: 'c050', word: 'disseminate', phonetic: '/dɪˈsem.ɪ.neɪt/', pos: 'v.',
    definition: '散布；廣泛傳播（信息、知識）',
    example: 'Social media platforms disseminate information — and misinformation — at unprecedented speed.',
    difficulty: 'hard', tags: ['media', 'academic']
  },
  {
    id: 'c051', word: 'scrutinize', phonetic: '/ˈskruː.tɪ.naɪz/', pos: 'v.',
    definition: '仔細審查；詳細檢查',
    example: 'Journalists must scrutinize government claims rather than accept them at face value.',
    difficulty: 'hard', tags: ['academic', 'media']
  },
  {
    id: 'c052', word: 'precedent', phonetic: '/ˈpres.ɪ.dənt/', pos: 'n.',
    definition: '先例；判例；可供參考的前例',
    example: 'The court\'s decision set a precedent that would affect all future rulings.',
    difficulty: 'hard', tags: ['law', 'academic']
  },
  {
    id: 'c053', word: 'demagogue', phonetic: '/ˈdem.ə.ɡɒɡ/', pos: 'n.',
    definition: '煽動者；利用民眾情緒和偏見操弄政治的領袖',
    example: 'The historian warned that demagogues thrive when institutions are weak.',
    difficulty: 'hard', tags: ['politics', 'history']
  },
  {
    id: 'c054', word: 'pluralism', phonetic: '/ˈplʊər.ə.lɪ.z(ə)m/', pos: 'n.',
    definition: '多元主義；承認並尊重多種不同觀點、文化或信仰並存',
    example: 'A healthy democracy depends on pluralism — the tolerance of diverse perspectives.',
    difficulty: 'hard', tags: ['politics', 'philosophy', 'society']
  },
  {
    id: 'c055', word: 'populism', phonetic: '/ˈpɒp.jʊ.lɪ.z(ə)m/', pos: 'n.',
    definition: '民粹主義（以「人民 vs. 菁英」為核心的政治風格）',
    example: 'Populism has reshaped party politics across Europe and the Americas.',
    difficulty: 'hard', tags: ['politics', 'society']
  }
];
