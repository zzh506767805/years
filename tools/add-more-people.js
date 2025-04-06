require('dotenv').config();
const dbManager = require('./db-manager');

// 定义多个名人数据
const newPeople = [
  {
    name: "扎克伯格",
    birthYear: 1984,
    title: "Facebook创始人",
    brief: "美国计算机程序员、企业家，Facebook（现Meta）的联合创始人兼首席执行官。",
    experiences: [
      {
        year: 1984,
        title: "出生",
        description: "出生于纽约州白原市，父亲是一名牙医，母亲是一名精神科医生。"
      },
      {
        year: 2000,
        title: "开始编程",
        description: "在高中时期开始学习编程，开发了一款名为'Synapse Media Player'的音乐播放器，微软曾想收购并聘请他，但被他拒绝。"
      },
      {
        year: 2002,
        title: "进入哈佛",
        description: "被哈佛大学录取，攻读计算机科学和心理学专业。"
      },
      {
        year: 2004,
        title: "创立Facebook",
        description: "在哈佛大学宿舍里与几个室友一起创建了最初的Facebook网站，最初只向哈佛学生开放。"
      },
      {
        year: 2004,
        title: "扩张到其他学校",
        description: "将Facebook扩展到其他常春藤盟校，随后扩展到美国所有大学，再到全球高中和企业网络。"
      },
      {
        year: 2006,
        title: "拒绝收购",
        description: "拒绝了雅虎和其他公司对Facebook的10亿美元收购要约，决定继续独立发展。"
      },
      {
        year: 2012,
        title: "公司上市",
        description: "带领Facebook在纳斯达克成功上市，IPO当时创下科技公司融资记录。"
      },
      {
        year: 2014,
        title: "收购WhatsApp",
        description: "斥资190亿美元收购即时通讯应用WhatsApp，这是Facebook历史上最大的一笔收购。"
      },
      {
        year: 2021,
        title: "更名Meta",
        description: "宣布公司更名为Meta，致力于打造元宇宙（Metaverse）的数字世界。"
      }
    ]
  },
  {
    name: "李彦宏",
    birthYear: 1968,
    title: "百度创始人",
    brief: "中国计算机科学家、企业家，百度公司创始人、董事长兼首席执行官。",
    experiences: [
      {
        year: 1968,
        title: "出生",
        description: "出生于山西省阳泉市，从小对数学表现出特殊天赋。"
      },
      {
        year: 1987,
        title: "进入北大",
        description: "考入北京大学信息管理系，开始接触计算机科学。"
      },
      {
        year: 1991,
        title: "赴美留学",
        description: "获得美国布法罗纽约州立大学计算机科学硕士学位。"
      },
      {
        year: 1994,
        title: "加入道·琼斯",
        description: "在美国华尔街道·琼斯公司担任高级工程师，开发了实时金融信息在线系统。"
      },
      {
        year: 1996,
        title: "加入硅谷公司",
        description: "加入硅谷互联网企业Infoseek，担任搜索引擎技术研发部高级工程师。"
      },
      {
        year: 1999,
        title: "回国创业",
        description: "放弃硅谷优厚待遇回国，创立百度公司。"
      },
      {
        year: 2000,
        title: "获得融资",
        description: "获得美国风险投资公司DFJ和IDG的共计1200万美元投资。"
      },
      {
        year: 2005,
        title: "百度上市",
        description: "带领百度在美国纳斯达克成功上市，成为首个进入纳斯达克的中国互联网企业。"
      },
      {
        year: 2013,
        title: "进军人工智能",
        description: "百度正式宣布进军人工智能领域，成立深度学习研究院。"
      },
      {
        year: 2017,
        title: "提出Apollo计划",
        description: "推出Apollo自动驾驶开放平台，进军自动驾驶领域。"
      }
    ]
  },
  {
    name: "柳青",
    birthYear: 1981,
    title: "滴滴出行总裁",
    brief: "中国女企业家，滴滴出行总裁，被称为'互联网女皇'。",
    experiences: [
      {
        year: 1981,
        title: "出生",
        description: "出生于中国湖南省长沙市。"
      },
      {
        year: 1999,
        title: "赴美留学",
        description: "被美国哈佛大学录取，开始本科学习。"
      },
      {
        year: 2003,
        title: "哈佛毕业",
        description: "获得哈佛大学计算机科学学士学位，毕业后进入高盛工作。"
      },
      {
        year: 2006,
        title: "加入高盛",
        description: "在高盛亚洲投资银行部任职，参与了多个重要的中国企业上市项目。"
      },
      {
        year: 2008,
        title: "晋升副总裁",
        description: "在高盛被提拔为副总裁，成为当时高盛最年轻的副总裁之一。"
      },
      {
        year: 2014,
        title: "加入滴滴",
        description: "离开高盛，加入滴滴出行担任首席运营官。"
      },
      {
        year: 2015,
        title: "晋升总裁",
        description: "被任命为滴滴出行总裁，负责公司日常运营和战略规划。"
      },
      {
        year: 2016,
        title: "收购优步中国",
        description: "主导收购优步中国业务，巩固滴滴在中国网约车市场的领先地位。"
      },
      {
        year: 2018,
        title: "全球扩张",
        description: "领导滴滴开展国际化战略，进入墨西哥、澳大利亚等海外市场。"
      }
    ]
  },
  {
    name: "杨元庆",
    birthYear: 1964,
    title: "联想集团CEO",
    brief: "中国企业家，联想集团董事长兼CEO，被誉为'联想接班人'。",
    experiences: [
      {
        year: 1964,
        title: "出生",
        description: "出生于上海市，自小展现出对科学的浓厚兴趣。"
      },
      {
        year: 1982,
        title: "考入上海交大",
        description: "考入上海交通大学计算机系，接受系统的计算机科学教育。"
      },
      {
        year: 1989,
        title: "加入联想",
        description: "大学毕业后加入联想，最初担任联想的销售代表。"
      },
      {
        year: 1993,
        title: "成立电脑事业部",
        description: "创立联想电脑事业部，担任总经理，推动联想从代理商向自主品牌转型。"
      },
      {
        year: 2001,
        title: "接任联想总裁",
        description: "正式接替联想创始人柳传志，担任联想集团总裁兼CEO。"
      },
      {
        year: 2005,
        title: "收购IBM PC",
        description: "主导收购IBM全球PC业务，使联想一跃成为全球PC市场的领导者之一。"
      },
      {
        year: 2009,
        title: "重返CEO职位",
        description: "在短暂离开后重新回到联想CEO岗位，开始推动联想的全球化战略。"
      },
      {
        year: 2014,
        title: "收购摩托罗拉",
        description: "主导收购摩托罗拉移动，扩展联想在智能手机市场的份额。"
      },
      {
        year: 2020,
        title: "数字化转型",
        description: "推动联想向智能化转型，提出'智能化变革'战略。"
      }
    ]
  },
  {
    name: "马斯克",
    birthYear: 1971,
    title: "特斯拉和SpaceX创始人",
    brief: "南非裔美国企业家、工程师，特斯拉、SpaceX、Twitter等多家公司的CEO或创始人。",
    experiences: [
      {
        year: 1971,
        title: "出生",
        description: "出生于南非比勒陀利亚，12岁时自学编程并售出了自己的第一个程序——一款名为'Blastar'的游戏。"
      },
      {
        year: 1989,
        title: "移民加拿大",
        description: "17岁时移民加拿大，入读皇后大学。"
      },
      {
        year: 1995,
        title: "创办Zip2",
        description: "与弟弟一起创办了Zip2公司，这是一家为报纸提供城市指南软件的公司。"
      },
      {
        year: 1999,
        title: "创办X.com",
        description: "卖掉Zip2后，创办了在线金融服务和电子邮件支付公司X.com，这家公司后来与Confinity合并，重命名为PayPal。"
      },
      {
        year: 2002,
        title: "创立SpaceX",
        description: "创立太空探索技术公司(SpaceX)，致力于降低太空运输成本和火星殖民。"
      },
      {
        year: 2004,
        title: "投资特斯拉",
        description: "成为电动汽车初创公司特斯拉的投资者，随后成为董事长和主要股东。"
      },
      {
        year: 2008,
        title: "特斯拉CEO",
        description: "在金融危机期间接任特斯拉CEO，挽救公司于破产边缘。"
      },
      {
        year: 2012,
        title: "SpaceX历史性成就",
        description: "SpaceX的龙飞船成为首个由私人公司研发的飞船，对接国际空间站。"
      },
      {
        year: 2016,
        title: "创办Neuralink和The Boring Company",
        description: "创立了Neuralink（研发脑机接口）和The Boring Company（隧道挖掘公司）。"
      },
      {
        year: 2022,
        title: "收购Twitter",
        description: "以440亿美元收购Twitter，更名为X，担任CEO。"
      }
    ]
  }
];

// 执行批量添加操作
async function addMorePeople() {
  try {
    await dbManager.connectDB();
    
    console.log('开始批量添加名人数据...');
    
    // 批量添加每个人物
    for (const personData of newPeople) {
      const result = await dbManager.addNewPerson(personData);
      if (result) {
        console.log(`成功添加: ${result.name}`);
      }
    }
    
    console.log('\n批量添加完成！');
    
    // 列出所有人物
    await dbManager.listAllPeople();
    
  } catch (error) {
    console.error('批量添加名人失败:', error);
  } finally {
    await dbManager.closeDB();
  }
}

// 运行批量添加操作
addMorePeople(); 