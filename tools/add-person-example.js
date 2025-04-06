require('dotenv').config();
const dbManager = require('./db-manager');

// 定义新人物数据
const newPerson = {
  name: "雷军",
  birthYear: 1969,
  title: "小米创始人",
  brief: "中国著名企业家，小米科技创始人、董事长兼CEO，同时也是金山软件董事长。",
  experiences: [
    {
      year: 1969,
      title: "出生",
      description: "出生于湖北省仙桃市一个普通家庭。"
    },
    {
      year: 1987,
      title: "进入大学",
      description: "考入武汉大学计算机系，开始接触并热爱计算机技术。"
    },
    {
      year: 1992,
      title: "加入金山",
      description: "大学毕业后加入金山软件，成为一名程序员。"
    },
    {
      year: 1998,
      title: "担任金山CEO",
      description: "被任命为金山公司CEO，成为当时中国最年轻的上市公司CEO之一。"
    },
    {
      year: 2007,
      title: "离开金山",
      description: "辞去金山CEO职务，开始天使投资生涯。"
    },
    {
      year: 2010,
      title: "创立小米",
      description: '创办小米科技，专注于智能手机和IoT设备研发，提出"为发烧而生"的理念。'
    },
    {
      year: 2018,
      title: "小米上市",
      description: "带领小米在香港证券交易所上市，成为港交所首个同股不同权上市公司。"
    },
    {
      year: 2021,
      title: "进军汽车",
      description: "宣布小米正式进军智能电动汽车行业，计划投资100亿美元。"
    }
  ]
};

// 执行添加操作
async function addExamplePerson() {
  try {
    await dbManager.connectDB();
    
    // 添加人物
    const result = await dbManager.addNewPerson(newPerson);
    
    if (result) {
      console.log('示例人物添加成功！');
      // 查看添加的人物详情
      await dbManager.getPersonDetail(result.id);
    }
  } catch (error) {
    console.error('添加示例人物失败:', error);
  } finally {
    await dbManager.closeDB();
  }
}

// 运行添加操作
addExamplePerson(); 