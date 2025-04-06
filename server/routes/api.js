const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');
const { protect, admin } = require('../middleware/auth');

// 获取所有人物简略信息
router.get('/people', personController.getAllPeople);

// 搜索人物
router.get('/people/search', personController.searchPeople);

// 导入单个人物数据 - 需要登录权限
router.post('/people/import', protect, personController.importPerson);

// 批量导入人物数据 - 需要管理员权限
router.post('/people/batch-import', protect, admin, personController.batchImportPeople);

// 获取单个人物详细信息
router.get('/people/:id', personController.getPersonById);

// 按年份查询事件
router.get('/events/year/:year', personController.getEventsByYear);

// 按年龄查询事件
router.get('/events/age/:age', personController.getEventsByAge);

module.exports = router; 