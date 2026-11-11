// 演示模式：构建时注入 VITE_DEMO_MODE=true（Pages 展示站用），
// 前端使用本地 mock 数据渲染控制台，无需后端、无需登录。

export const isDemo =
  (import.meta.env as { VITE_DEMO_MODE?: string }).VITE_DEMO_MODE === 'true';

export const demoUser = {
  id: 1,
  username: 'demo_user',
  display_name: '演示用户',
  role: 1,
  created_time: 1762890000,
};

export const demoTokens = [
  {
    id: 1,
    key: 'sk-demo4f8a2b7c9d1e5f6a3b8c0d4e7f1a2b5',
    name: '我的脚本',
    status: 1,
    created_time: 1762890000,
    accessed_time: 1762980000,
    expired_time: -1,
    remain_quota: 50000,
    used_quota: 12340,
    unlimited_quota: false,
  },
  {
    id: 2,
    key: 'sk-demo9c1d3e5f7a2b4c6d8e0f1a3b5c7d9e2f4',
    name: '测试令牌',
    status: 1,
    created_time: 1762890000,
    accessed_time: 1762980000,
    expired_time: 1763200000,
    remain_quota: 0,
    used_quota: 0,
    unlimited_quota: true,
  },
];

export const demoOrders = [
  { id: 101, game_account: '吾王 alt 号', quest: '无限池 300 池', status: '进行中', progress: '167/300', created_time: 1762950000 },
  { id: 102, game_account: '练度小号', quest: '每日任务 + 周常', status: '进行中', progress: '每日自动', created_time: 1762880000 },
  { id: 103, game_account: '素材号', quest: 'QP 本 50 把', status: '已完成', progress: '50/50', created_time: 1762700000 },
];
