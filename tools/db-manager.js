require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('../server/models/Person');

// 连接数据库
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB连接成功');
    return true;
  } catch (error) {
    console.error('连接MongoDB失败:', error);
    return false;
  }
}

// 关闭数据库连接
async function closeDB() {
  await mongoose.connection.close();
  console.log('数据库连接已关闭');
}

// 查看数据库结构
async function showSchema() {
  console.log('\n======= 数据库结构 =======');
  console.log('集合名称: people');
  console.log('字段结构:');
  console.log('  id: Number (唯一标识符)');
  console.log('  name: String (人物姓名)');
  console.log('  birthYear: Number (出生年份)');
  console.log('  title: String (头衔/职业)');
  console.log('  brief: String (简介)');
  console.log('  experiences: Array (经历)');
  console.log('    - year: Number (年份)');
  console.log('    - title: String (事件标题)');
  console.log('    - description: String (事件描述)');
  console.log('  createdAt: Date (创建时间)');
  console.log('  updatedAt: Date (更新时间)');
}

// 列出所有人物
async function listAllPeople() {
  const people = await Person.find({}).select('id name birthYear title');
  console.log('\n======= 所有人物列表 =======');
  people.forEach(person => {
    console.log(`ID: ${person.id}, 姓名: ${person.name}, 出生年份: ${person.birthYear}, 职业: ${person.title}`);
  });
  return people;
}

// 查看特定人物详情
async function getPersonDetail(personId) {
  const person = await Person.findOne({ id: personId });
  if (!person) {
    console.log(`\n未找到ID为${personId}的人物`);
    return null;
  }
  
  console.log('\n======= 人物详情 =======');
  console.log(`ID: ${person.id}`);
  console.log(`姓名: ${person.name}`);
  console.log(`出生年份: ${person.birthYear}`);
  console.log(`职业: ${person.title}`);
  console.log(`简介: ${person.brief}`);
  
  console.log('\n======= 生涯经历 =======');
  person.experiences.forEach(exp => {
    console.log(`${exp.year}年 - ${exp.title}:`);
    console.log(`  ${exp.description}`);
  });
  
  return person;
}

// 添加新人物
async function addNewPerson(personData) {
  try {
    // 查找最大ID
    const maxIdPerson = await Person.findOne().sort('-id');
    const newId = maxIdPerson ? maxIdPerson.id + 1 : 1;
    
    // 创建新人物
    const newPerson = new Person({
      id: newId,
      ...personData
    });
    
    await newPerson.save();
    console.log(`\n成功添加人物: ${newPerson.name}, ID: ${newPerson.id}`);
    return newPerson;
  } catch (error) {
    console.error('添加人物失败:', error);
    return null;
  }
}

// 更新人物信息
async function updatePerson(personId, updateData) {
  try {
    const person = await Person.findOneAndUpdate(
      { id: personId },
      updateData,
      { new: true }
    );
    
    if (!person) {
      console.log(`\n未找到ID为${personId}的人物`);
      return null;
    }
    
    console.log(`\n成功更新人物: ${person.name}`);
    return person;
  } catch (error) {
    console.error('更新人物失败:', error);
    return null;
  }
}

// 添加新经历
async function addExperience(personId, experience) {
  try {
    const person = await Person.findOne({ id: personId });
    if (!person) {
      console.log(`\n未找到ID为${personId}的人物`);
      return null;
    }
    
    person.experiences.push(experience);
    // 按年份排序
    person.experiences.sort((a, b) => a.year - b.year);
    await person.save();
    
    console.log(`\n已为${person.name}添加${experience.year}年的经历`);
    return person;
  } catch (error) {
    console.error('添加经历失败:', error);
    return null;
  }
}

// 删除人物
async function deletePerson(personId) {
  try {
    const result = await Person.findOneAndDelete({ id: personId });
    if (!result) {
      console.log(`\n未找到ID为${personId}的人物`);
      return false;
    }
    
    console.log(`\n已删除人物: ${result.name}`);
    return true;
  } catch (error) {
    console.error('删除人物失败:', error);
    return false;
  }
}

// 交互式操作方法
async function runOperation() {
  const connected = await connectDB();
  if (!connected) return;
  
  // 使用命令行参数确定操作
  const args = process.argv.slice(2);
  const operation = args[0];
  
  try {
    if (operation === 'schema') {
      await showSchema();
    } else if (operation === 'list') {
      await listAllPeople();
    } else if (operation === 'view' && args[1]) {
      await getPersonDetail(parseInt(args[1]));
    } else if (operation === 'add') {
      console.log('请使用代码方法添加新人物');
    } else if (operation === 'update' && args[1]) {
      console.log('请使用代码方法更新人物');
    } else if (operation === 'delete' && args[1]) {
      await deletePerson(parseInt(args[1]));
    } else {
      console.log('使用方法:');
      console.log('node tools/db-manager.js schema - 查看数据库结构');
      console.log('node tools/db-manager.js list - 列出所有人物');
      console.log('node tools/db-manager.js view [id] - 查看指定人物详情');
      console.log('node tools/db-manager.js delete [id] - 删除指定人物');
    }
  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    await closeDB();
  }
}

// 导出方法供其他脚本使用
module.exports = {
  connectDB,
  closeDB,
  showSchema,
  listAllPeople,
  getPersonDetail,
  addNewPerson,
  updatePerson,
  addExperience,
  deletePerson
};

// 如果直接运行此脚本，执行交互式操作
if (require.main === module) {
  runOperation();
} 