require('dotenv').config();
const dbManager = require('./db-manager');

// 要添加的经历事件
const newExperiences = [
  // 为比尔·盖茨添加新经历
  {
    personId: 1,
    experience: {
      year: 2020,
      title: "应对新冠疫情",
      description: "在新冠疫情期间，通过盖茨基金会投入大量资金支持疫苗研发和全球抗疫工作。"
    }
  },
  {
    personId: 1,
    experience: {
      year: 2021,
      title: "离婚与新阶段",
      description: "与梅琳达·盖茨结束27年婚姻，但表示将继续共同管理盖茨基金会。"
    }
  },
  
  // 为马云添加新经历
  {
    personId: 2,
    experience: {
      year: 2020,
      title: "蚂蚁金服上市受阻",
      description: "蚂蚁集团上市前夕被监管叫停，此后较少出现在公众视野。"
    }
  },
  {
    personId: 2,
    experience: {
      year: 2023,
      title: "重返公众视野",
      description: "在海外多次公开露面，并在国内杭州现身阿里巴巴总部。"
    }
  },
  
  // 为马化腾添加新经历
  {
    personId: 9,
    experience: {
      year: 2011,
      title: "推出微信",
      description: "领导团队推出微信，开创移动互联网社交新时代，之后微信逐渐发展成为中国最大的社交和生活服务平台。"
    }
  },
  {
    personId: 9,
    experience: {
      year: 2019,
      title: "提出产业互联网",
      description: "提出腾讯从消费互联网向产业互联网转型的战略，开始深入布局B端业务。"
    }
  },
  
  // 为马斯克添加新经历
  {
    personId: 16,
    experience: {
      year: 2023,
      title: "Twitter改名X",
      description: "将Twitter更名为X，宣布打造'全功能应用'，将支付、社交媒体和其他功能整合到一个平台。"
    }
  },
  {
    personId: 16,
    experience: {
      year: 2023,
      title: "发布Cybertruck",
      description: "特斯拉正式发布并交付备受期待的Cybertruck电动皮卡车，标志着特斯拉进入新的汽车市场领域。"
    }
  }
];

// 执行添加经历操作
async function addNewExperiences() {
  try {
    await dbManager.connectDB();
    
    console.log('开始添加新的经历事件...');
    
    // 逐个添加经历
    for (const item of newExperiences) {
      const result = await dbManager.addExperience(
        item.personId, 
        item.experience
      );
      
      if (result) {
        console.log(`已为 ${result.name} 添加 ${item.experience.year}年的经历: ${item.experience.title}`);
      }
    }
    
    console.log('\n添加经历完成！');
    
  } catch (error) {
    console.error('添加经历失败:', error);
  } finally {
    await dbManager.closeDB();
  }
}

// 运行添加经历操作
addNewExperiences(); 