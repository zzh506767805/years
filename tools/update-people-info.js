require('dotenv').config();
const dbManager = require('./db-manager');

// 要更新的人物信息
const peopleUpdates = [
  {
    id: 1,
    title: "微软创始人",
    brief: "美国企业家、软件工程师、慈善家，微软公司的联合创始人，曾长期担任微软的CEO、董事长和首席软件架构师。"
  },
  {
    id: 2,
    title: "阿里巴巴创始人",
    brief: "中国企业家，阿里巴巴集团创始人，曾担任阿里巴巴集团董事局主席和CEO。"
  },
  {
    id: 3,
    title: "苹果公司联合创始人",
    brief: "美国企业家、发明家、工业设计师，苹果公司联合创始人，改变了个人电脑、动画电影、音乐、手机、平板电脑和数字出版等多个行业。"
  },
  {
    id: 4,
    title: "华为创始人",
    brief: "中国企业家，华为技术有限公司创始人兼总裁，带领华为从一个小型代理商发展成为全球领先的通信设备制造商。"
  },
  {
    id: 5,
    title: "联想集团创始人",
    brief: "中国企业家，联想集团创始人和前任董事长，曾任中国科学院计算技术研究所研究员。"
  },
  {
    id: 7,
    title: "长江实业创始人",
    brief: "香港企业家，长江实业、和记黄埔的创办人，曾经是亚洲首富和全球华人首富。"
  },
  {
    id: 8,
    title: "搜狐创始人",
    brief: "中国企业家，搜狐公司创始人、董事局主席兼首席执行官，中国互联网行业的先行者之一。"
  },
  {
    id: 9,
    title: "腾讯创始人",
    brief: "中国企业家，腾讯公司主要创始人之一、董事会主席兼首席执行官，中国互联网与科技行业的领军人物。"
  },
  {
    id: 10,
    title: "美团创始人",
    brief: "中国企业家，美团创始人、董事长兼首席执行官，曾创办校内网（后被收购改名为人人网）。"
  }
];

// 执行批量更新操作
async function updatePeopleInfo() {
  try {
    await dbManager.connectDB();
    
    console.log('开始更新人物资料...');
    
    // 批量更新每个人物
    for (const updateData of peopleUpdates) {
      const result = await dbManager.updatePerson(updateData.id, {
        title: updateData.title,
        brief: updateData.brief
      });
      
      if (result) {
        console.log(`成功更新: ${result.name}`);
      }
    }
    
    console.log('\n更新完成！');
    
    // 列出所有人物
    await dbManager.listAllPeople();
    
  } catch (error) {
    console.error('更新人物信息失败:', error);
  } finally {
    await dbManager.closeDB();
  }
}

// 运行更新操作
updatePeopleInfo(); 