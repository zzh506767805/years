const timelineData = [
  {
    id: 1,
    name: "比尔·盖茨",
    birthYear: 1955,
    experiences: [
      {
        year: 1955,
        title: "出生",
        description: "出生于西雅图的一个富裕家庭。父亲是一名成功的律师，母亲是一名教师。"
      },
      {
        year: 1967,
        title: "接触编程",
        description: "在湖滨中学首次接触电脑编程，开始对计算机产生浓厚兴趣。"
      },
      {
        year: 1968,
        title: "首次商业编程",
        description: "与保罗·艾伦一起为学校编写课程表编排程序，这是他的第一个商业项目，获得了$4,200的收入。"
      },
      {
        year: 1973,
        title: "进入哈佛",
        description: "考入哈佛大学。在校期间开发了BASIC语言的一个版本，这让他尝到了商业成功的甜头。"
      },
      {
        year: 1975,
        title: "创立微软",
        description: "与保罗·艾伦一起创立微软公司。当时他们的愿景是'让每个家庭和办公桌上都有一台电脑'。"
      },
      {
        year: 1980,
        title: "与IBM合作",
        description: "与IBM签订合作协议，为其开发操作系统，这成为了微软发展的重要转折点。"
      },
      {
        year: 1985,
        title: "发布Windows",
        description: "推出Windows 1.0操作系统，开启了图形用户界面的新时代。"
      },
      {
        year: 1986,
        title: "微软上市",
        description: "微软在纳斯达克上市，盖茨28岁时成为亿万富翁。"
      },
      {
        year: 1995,
        title: "互联网转型",
        description: "发布Windows 95和Internet Explorer，带领微软进入互联网时代。"
      },
      {
        year: 2000,
        title: "交接CEO",
        description: "卸任微软CEO，专注于产品战略和技术愿景，由史蒂夫·鲍尔默接任。"
      },
      {
        year: 2006,
        title: "转型慈善",
        description: "宣布逐步退出微软日常管理，将重心转向比尔及梅琳达·盖茨基金会的慈善事业。"
      },
      {
        year: 2008,
        title: "离开微软",
        description: "正式离开微软日常工作，全职投入慈善事业，致力于全球健康和教育问题。"
      }
    ]
  },
  {
    id: 2,
    name: "马云",
    birthYear: 1964,
    experiences: [
      {
        year: 1964,
        title: "出生",
        description: "出生于浙江省杭州市，童年时代经常带着表弟骑车带着外国游客游览西湖，这让他有机会练习英语。"
      },
      {
        year: 1980,
        title: "高考失利",
        description: "第一次参加高考失利，数学只考了1分。但他并没有放弃，继续准备第二年的高考。"
      },
      {
        year: 1984,
        title: "考入杭州师范",
        description: "第三次参加高考终于被杭州师范学院英语专业录取。在校期间，他创办了'海博英语角'。"
      },
      {
        year: 1988,
        title: "开始教书",
        description: "大学毕业后在杭州电子工业学院教英语，月薪只有100-120元。"
      },
      {
        year: 1992,
        title: "创业尝试",
        description: "成立'海博翻译社'，这是他的第一次创业尝试。"
      },
      {
        year: 1995,
        title: "接触互联网",
        description: "首次访问美国，接触到互联网。回国后创办中国第一家互联网商业信息发布网站'中国黄页'。"
      },
      {
        year: 1999,
        title: "创立阿里巴巴",
        description: "在杭州湖畔花园的一个小屋里，和17位创始人一起创立阿里巴巴，启动资金50万元。"
      },
      {
        year: 2003,
        title: "创立淘宝",
        description: "推出淘宝网，开创中国电子商务新纪元。同年创立支付宝，解决网上支付问题。"
      },
      {
        year: 2007,
        title: "香港上市",
        description: "阿里巴巴在香港成功上市，市值超过200亿港元。"
      },
      {
        year: 2009,
        title: "创立阿里云",
        description: "成立阿里云计算公司，开始布局云计算领域。"
      },
      {
        year: 2014,
        title: "纽交所上市",
        description: "阿里巴巴在纽约证券交易所上市，创下全球最大IPO记录。"
      },
      {
        year: 2019,
        title: "正式退休",
        description: "在阿里巴巴20周年之际正式退休，将重心转向教育和公益事业。"
      }
    ]
  },
  {
    id: 3,
    name: "乔布斯",
    birthYear: 1955,
    experiences: [
      {
        year: 1955,
        title: "出生与被收养",
        description: "出生于旧金山，被保罗和克拉拉·乔布斯收养。养父是一名技工，经常在车库里修理汽车。"
      },
      {
        year: 1969,
        title: "遇见沃兹尼亚克",
        description: "在惠普实习时认识了比他大五岁的斯蒂夫·沃兹尼亚克，两人因共同对电子产品的兴趣而成为好友。"
      },
      {
        year: 1972,
        title: "上大学",
        description: "进入里德学院就读，但一学期后因学费太贵而退学，开始旁听书法课程。"
      },
      {
        year: 1974,
        title: "加入雅达利",
        description: "进入雅达利公司担任技术员，参与经典游戏《Breakout》的开发。"
      },
      {
        year: 1976,
        title: "创立苹果",
        description: "与沃兹尼亚克在父亲的车库里创立苹果电脑公司，推出Apple I电脑。"
      },
      {
        year: 1977,
        title: "推出Apple II",
        description: "推出Apple II电脑，这是第一台成功的大规模生产的个人电脑。"
      },
      {
        year: 1984,
        title: "推出Macintosh",
        description: "推出具有革命性的Macintosh电脑，首次将图形用户界面引入个人电脑。"
      },
      {
        year: 1985,
        title: "离开苹果",
        description: "在董事会的争议中离开苹果，创立NeXT电脑公司。同年投资皮克斯动画工作室。"
      },
      {
        year: 1995,
        title: "皮克斯上市",
        description: "皮克斯推出《玩具总动员》，成为首部全电脑动画电影，随后成功上市。"
      },
      {
        year: 1997,
        title: "重返苹果",
        description: "苹果收购NeXT，乔布斯重返苹果担任临时CEO。"
      },
      {
        year: 2001,
        title: "数字革命",
        description: "推出iPod和iTunes，开创数字音乐新时代。"
      },
      {
        year: 2007,
        title: "改变世界",
        description: "发布iPhone，彻底改变了手机行业。"
      },
      {
        year: 2010,
        title: "平板革命",
        description: "推出iPad，开创了平板电脑市场。"
      },
      {
        year: 2011,
        title: "离世",
        description: "因胰腺癌去世，享年56岁。他的远见卓识和创新精神永远改变了科技世界。"
      }
    ]
  },
  {
    id: 4,
    name: "任正非",
    birthYear: 1944,
    experiences: [
      {
        year: 1944,
        title: "出生",
        description: "出生于贵州省安顺市，父母都是乡村教师。"
      },
      {
        year: 1963,
        title: "大学时代",
        description: "考入重庆建筑工程学院，学习建筑工程。"
      },
      {
        year: 1974,
        title: "参军",
        description: "加入中国人民解放军基建工程兵，从事技术研究工作。"
      },
      {
        year: 1978,
        title: "转业",
        description: "随基建工程兵转业到深圳，先后在电子工业部第七研究所等单位工作。"
      },
      {
        year: 1987,
        title: "创立华为",
        description: "创立华为技术有限公司，起初只是一家销售程控交换机的代理商，注册资本仅2.1万元人民币。"
      },
      {
        year: 1990,
        title: "自主研发",
        description: "开始自主研发程控交换机，投入大量资金进行技术研发。"
      },
      {
        year: 1995,
        title: "销售破亿",
        description: "华为年销售额首次突破1亿元，开始在国内通信设备市场崭露头角。"
      },
      {
        year: 1997,
        title: "进军海外",
        description: "华为开始进军海外市场，首先从俄罗斯开始，逐步发展成为全球领先的通信设备制造商。"
      },
      {
        year: 2003,
        title: "进军手机",
        description: "华为开始进入手机终端市场，开启了新的业务增长点。"
      },
      {
        year: 2010,
        title: "智能手机",
        description: "华为推出首款Android智能手机，正式进军智能手机市场。"
      },
      {
        year: 2012,
        title: "超越爱立信",
        description: "华为营收首次超越爱立信，成为全球最大的电信设备制造商。"
      },
      {
        year: 2019,
        title: "5G领先",
        description: "despite外部压力，华为在5G技术领域保持全球领先地位，拥有最多5G专利。"
      }
    ]
  },
  {
    id: 5,
    name: "柳传志",
    birthYear: 1944,
    experiences: [
      {
        year: 1944,
        title: "出生",
        description: "出生于江苏省镇江市，父亲是著名经济学家柳诒徵。"
      },
      {
        year: 1962,
        title: "考入大学",
        description: "考入西安军事电讯工程学院（现西安电子科技大学）雷达导航专业。"
      },
      {
        year: 1966,
        title: "工作调动",
        description: "被分配到中科院计算所工作，但很快遇到文革，工作中断。"
      },
      {
        year: 1978,
        title: "恢复工作",
        description: "文革结束后，重返中科院计算所工作，参与多个重要科研项目。"
      },
      {
        year: 1984,
        title: "创立联想",
        description: "带领10名科技人员创立联想公司，初期主要从事计算机贸易和代理业务。"
      },
      {
        year: 1988,
        title: "汉卡研发",
        description: "推出联想汉卡，解决了中文信息处理的难题，奠定了联想在PC市场的地位。"
      },
      {
        year: 1990,
        title: "进军PC",
        description: "联想开始生产自主品牌PC，并很快成为中国市场领导者。"
      },
      {
        year: 1994,
        title: "香港上市",
        description: "联想在香港证券交易所上市，开启了国际化征程。"
      },
      {
        year: 2004,
        title: "收购IBM PC",
        description: "领导联想以12.5亿美元收购IBM PC业务，实现了中国企业在国际市场上的重大突破。"
      },
      {
        year: 2009,
        title: "组建控股",
        description: "成立联想控股，开始向多元化投资控股公司转型。"
      },
      {
        year: 2011,
        title: "交班",
        description: "卸任联想控股董事长，完成企业接班人的培养和交接。"
      },
      {
        year: 2019,
        title: "最终退休",
        description: "正式从联想控股退休，结束了长达30多年的职业生涯。"
      }
    ]
  },
  {
    id: 6,
    name: "雷军",
    birthYear: 1969,
    experiences: [
      {
        year: 1969,
        title: "出生",
        description: "出生于湖北省仙桃市，从小就对计算机和编程充满热情。"
      },
      {
        year: 1987,
        title: "考入武大",
        description: "考入武汉大学计算机系，成为当年全校理科最高分录取者。"
      },
      {
        year: 1991,
        title: "加入金山",
        description: "大学毕业后加入金山软件，开始程序员生涯。"
      },
      {
        year: 1998,
        title: "任金山CEO",
        description: "28岁成为金山软件总经理，是当时中国最年轻的上市公司掌门人。"
      },
      {
        year: 2007,
        title: "离开金山",
        description: "暂时离开金山软件，开始投资互联网企业，先后投资了YY、UC等多家公司。"
      },
      {
        year: 2010,
        title: "创立小米",
        description: "创立小米科技，提出'为发烧而生'的理念，开创了互联网手机的新模式。"
      },
      {
        year: 2011,
        title: "小米手机",
        description: "发布第一款小米手机，采用互联网预售模式，开创了新的营销方式。"
      },
      {
        year: 2013,
        title: "超越苹果",
        description: "小米手机在中国市场销量超越iPhone，成为中国第二大智能手机品牌。"
      },
      {
        year: 2014,
        title: "估值腾飞",
        description: "小米完成新一轮融资，估值达450亿美元，成为全球最有价值的创业公司之一。"
      },
      {
        year: 2018,
        title: "港股上市",
        description: "小米在香港联交所上市，成为首个采用同股不同权架构的上市公司。"
      },
      {
        year: 2020,
        title: "造车宣言",
        description: "宣布小米造车计划，计划10年投资100亿美元进军电动汽车领域。"
      },
      {
        year: 2021,
        title: "超越三星",
        description: "小米手机全球出货量首次超越三星，成为全球第一大智能手机品牌。"
      }
    ]
  },
  {
    id: 7,
    name: "李嘉诚",
    birthYear: 1928,
    experiences: [
      {
        year: 1928,
        title: "出生",
        description: "出生于潮州市，家境原本殷实，后因战乱家道中落。"
      },
      {
        year: 1940,
        title: "逃难香港",
        description: "12岁时随家人逃难到香港，因家境贫困被迫辍学打工。"
      },
      {
        year: 1950,
        title: "创业",
        description: "创办长江塑胶厂，生产塑料花，这是他事业的起点。"
      },
      {
        year: 1958,
        title: "转型地产",
        description: "开始涉足房地产业务，购入第一块地皮，开始房地产开发。"
      },
      {
        year: 1971,
        title: "公司上市",
        description: "长江实业在香港上市，开始了企业的快速扩张期。"
      },
      {
        year: 1979,
        title: "并购和黄",
        description: "收购和记黄埔，开始进军地产、零售、电信等多个领域。"
      },
      {
        year: 1985,
        title: "进军内地",
        description: "在中国内地开始投资，成为最早进入内地市场的港商之一。"
      },
      {
        year: 1993,
        title: "收购东区海底隧道",
        description: "收购香港东区海底隧道，扩大在基建领域的布局。"
      },
      {
        year: 1999,
        title: "重组业务",
        description: "将企业重组为长江实业集团，成为亚洲最具影响力的企业之一。"
      },
      {
        year: 2000,
        title: "进军欧洲",
        description: "开始在欧洲大规模投资，收购多个电信和能源企业。"
      },
      {
        year: 2015,
        title: "业务重组",
        description: "宣布长和系业务重组，将业务重心转向欧洲。"
      },
      {
        year: 2018,
        title: "正式退休",
        description: "在90岁高龄正式退休，将企业交给长子李泽钜打理。"
      }
    ]
  },
  {
    id: 8,
    name: "张朝阳",
    birthYear: 1964,
    experiences: [
      {
        year: 1964,
        title: "出生",
        description: "出生于陕西省西安市，从小就表现出极强的学习能力。"
      },
      {
        year: 1982,
        title: "考入清华",
        description: "考入清华大学物理系，开始接触计算机科学。"
      },
      {
        year: 1986,
        title: "赴美深造",
        description: "获得全额奖学金赴美国麻省理工学院深造。"
      },
      {
        year: 1993,
        title: "获得博士",
        description: "在麻省理工学院获得物理学博士学位。"
      },
      {
        year: 1995,
        title: "回国创业",
        description: "放弃美国优厚待遇，回国创业。"
      },
      {
        year: 1996,
        title: "创立搜狐",
        description: "创立爱特信公司（搜狐前身），成为中国最早的互联网先驱之一。"
      },
      {
        year: 1998,
        title: "获得投资",
        description: "获得英特尔和道琼斯投资，开始快速发展。"
      },
      {
        year: 2000,
        title: "纳斯达克上市",
        description: "带领搜狐在纳斯达克上市，成为中国第一批在美上市的互联网公司。"
      },
      {
        year: 2003,
        title: "收购畅游",
        description: "收购畅游公司，进军网络游戏领域。"
      },
      {
        year: 2009,
        title: "转型视频",
        description: "大力发展搜狐视频业务，进军在线视频市场。"
      },
      {
        year: 2014,
        title: "畅游分拆上市",
        description: "将游戏业务畅游公司分拆上市，优化公司结构。"
      },
      {
        year: 2020,
        title: "重返直播",
        description: "开始个人直播科普物理知识，重新获得公众关注。"
      }
    ]
  },
  {
    id: 9,
    name: "马化腾",
    birthYear: 1971,
    experiences: [
      {
        year: 1971,
        title: "出生",
        description: "出生于广东省汕头市潮南区，自小对计算机编程充满兴趣。"
      },
      {
        year: 1989,
        title: "考入深大",
        description: "考入深圳大学计算机系，在校期间自学编程，开发了图书管理系统。"
      },
      {
        year: 1993,
        title: "毕业工作",
        description: "大学毕业后在深圳润迅通讯发展有限公司工作，负责寻呼机软件的研发。"
      },
      {
        year: 1998,
        title: "创立腾讯",
        description: "与友人共同创立腾讯公司，开发即时通讯软件OICQ（后改名为QQ）。"
      },
      {
        year: 1999,
        title: "QQ诞生",
        description: "推出即时通讯软件OICQ，后更名为QQ，用户数快速增长。"
      },
      {
        year: 2001,
        title: "商业模式",
        description: "推出QQ会员服务，开创了互联网增值服务的商业模式。"
      },
      {
        year: 2004,
        title: "香港上市",
        description: "腾讯在香港联交所主板上市，市值超过20亿港元。"
      },
      {
        year: 2005,
        title: "开发QQ游戏",
        description: "推出QQ游戏平台，开启了中国网络游戏的新时代。"
      },
      {
        year: 2011,
        title: "微信诞生",
        description: "推出微信，开创了移动互联网社交新时代，改变了人们的生活方式。"
      },
      {
        year: 2013,
        title: "微信支付",
        description: "推出微信支付功能，进军移动支付领域。"
      },
      {
        year: 2015,
        title: "全球扩张",
        description: "腾讯市值超过2000亿美元，成为亚洲市值最高的公司。"
      },
      {
        year: 2020,
        title: "产业互联网",
        description: "提出'产业互联网'战略，助力各行各业数字化转型。"
      }
    ]
  },
  {
    id: 10,
    name: "王兴",
    birthYear: 1979,
    experiences: [
      {
        year: 1979,
        title: "出生",
        description: "出生于福建省龙岩市，从小学习成绩优异。"
      },
      {
        year: 1997,
        title: "考入清华",
        description: "考入清华大学电子工程系，开始接触互联网技术。"
      },
      {
        year: 2001,
        title: "赴美留学",
        description: "本科毕业后赴美国特拉华大学电子工程专业深造。"
      },
      {
        year: 2003,
        title: "首次创业",
        description: "回国创办校内网的前身'清华人'网站。"
      },
      {
        year: 2005,
        title: "创立校内网",
        description: "创办校内网，这是中国第一个真正意义上的社交网络。"
      },
      {
        year: 2006,
        title: "出售校内网",
        description: "将校内网以多亿元价格出售给千橡互动集团。"
      },
      {
        year: 2007,
        title: "创立饭否",
        description: "创立饭否网，这是中国第一个微博客服务。"
      },
      {
        year: 2009,
        title: "饭否被关停",
        description: "饭否因政策原因被关停，开始筹划新的创业项目。"
      },
      {
        year: 2010,
        title: "创立美团",
        description: "创立美团，将O2O理念带入中国生活服务领域。"
      },
      {
        year: 2013,
        title: "并购大众点评",
        description: "与大众点评合并，成立美团点评，整合本地生活服务市场。"
      },
      {
        year: 2015,
        title: "进军外卖",
        description: "大力发展外卖业务，很快成为行业领导者。"
      },
      {
        year: 2018,
        title: "港股上市",
        description: "美团在香港联交所上市，市值超过3000亿港元。"
      }
    ]
  }
];

// 只使用CommonJS模块系统导出
module.exports = { timelineData }; 