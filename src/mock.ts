import type { User, Dept } from './types.js'

export const mockDepts: Dept[] = [
  { id: 'd1', name: '研发部' },
  { id: 'd2', name: '产品部' },
  { id: 'd3', name: '运营部' }
]

export const mockUsers: User[] = [
  { id: 'u1', name: '张三', deptId: 'd1' },
  { id: 'u2', name: '李四', deptId: 'd1' },
  { id: 'u3', name: '王五', deptId: 'd2' }
]

// 当前登录人mock
export const currentUser = mockUsers[0]