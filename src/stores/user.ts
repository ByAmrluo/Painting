import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import { reqUserInfo } from "@/api/user/index";
export const useCounterStore = defineStore('User', () => {
  const token = ref('')
  const username = ref('')
  const avatar = ref('')
  const role = ref('')
  const isTarbar = ref(true)
  const isLogin = ref(true)
  const personalInfo = ref({})
  let userId = ref<number>(0)
  const getLogin = async (userData: any) => {
    let res: any = await reqLogin(userData)
    console.log(res);
    if (res.code == 200) {
      console.log(res)
      userId.value = res.data.id
      token.value = res.data.token
      avatar.value = res.data.avatarUrl
      username.value = res.data.username
      role.value = res.data.role
      return 'ok'
    } else {
      console.log(123);
      return Promise.reject(new Error(res.msg))
    }
  }
  //获取用户主页的信息
  const getUserInfoById = async (userId: number) => {
    let res = await reqUserInfo(userId);
    if (res.code == 200) {
      personalInfo.value = res.data;
    } else {
      return Promise.reject("返回用户信息失败！");
    }
  }
  const resetUserInfo = () => {
    token.value = ''
    // 清空用户信息
    username.value = ''
    avatar.value = ''
  }
  // 退出登录

  return {
    token, getLogin, resetUserInfo, avatar,
    userId,
    username,
    isTarbar,
    getUserInfoById,
    personalInfo,
    role,
    isLogin
  }
},
  {
    persist: {
      key: 'userInfo',
      storage: localStorage,
      paths: ['username', 'avatar', 'token', 'userId']
    }
  })
