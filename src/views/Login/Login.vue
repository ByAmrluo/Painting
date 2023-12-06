<template>
  <div class="login-container">
    <!-- <el-form class="login-form" :model="userData" :rules="rules">
            <h1>Hello</h1>
            <h2>请登录</h2>
            <el-form-item prop="username">
              <el-label for="username">用户名</el-label>
              <el-input
                type="username"
                id="username"
                name="username"
                :prefix-icon="Unlock"
                v-model="userData.username"
                class="inputDeep"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-label for="password">密码</el-label>
              <el-input
                type="password"
                id="password"
                name="password"
                icon="Lock"
                v-model="userData.password"
                show-password
                :prefix-icon="Lock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleLogin" class="login-btn">登录</el-button>
            </el-form-item>
          </el-form> -->
    <div :class="getLoginClassName" ref="mydiv">
      <!-- Sign Up -->
      <div class="container__form container--signup">
        <form
          action="#"
          class="form"
          id="form1"
          :rules="rules"
          :model="userData"
        >
          <h2 class="form__title">注 册</h2>

          <input
            placeholder="User"
            class="input"
            v-model="userData.username"
            @input="checkUsername"
          />
          <div id="emailHelp" class="form-text" v-show="loginConfirm">
            <i class="el-icon-warning-outline"></i
            ><el-icon size="16px"><WarningFilled /></el-icon
            >用户名长度2-20之间！
          </div>
          <input
            type="password"
            placeholder="Password"
            class="input"
            v-model="userData.password"
            @input="checkPassword"
          />
          <div id="emailHelp" class="form-text" v-show="RegConfirm">
            <i class="el-icon-warning-outline"></i
            ><el-icon size="16px"><WarningFilled /></el-icon>密码长度6-20之间！
          </div>

          <button class="btn" @click.prevent="handleResgister">注 册</button>
        </form>
      </div>

      <!-- Sign In -->
      <div class="container__form container--signin">
        <form
          action="#"
          class="form"
          id="form2"
          :rules="rules"
          @submit.prevent="handleLogin($event)"
        >
          <h2 class="form__title">登录</h2>

          <input
            type="text"
            placeholder="User"
            class="input"
            v-model="userData.username"
            input-style="input"
            prop="username"
            @input="checkUsername"
          />
          <div id="emailHelp" class="form-text" v-show="loginConfirm">
            <i class="el-icon-warning-outline"></i
            ><el-icon size="16px"><WarningFilled /></el-icon
            >用户名长度2-20之间！
          </div>
          <input
            type="password"
            placeholder="Password"
            class="input"
            v-model="userData.password"
            @input="checkPassword"
          />
          <div id="emailHelp" class="form-text" v-show="RegConfirm">
            <i class="el-icon-warning-outline"></i
            ><el-icon size="16px"><WarningFilled /></el-icon>密码长度6-20之间！
          </div>
          <div id="emailHelp" class="form-text" v-show="loginCondition">
            <i class="el-icon-warning-outline"></i
            ><el-icon size="16px"><WarningFilled /></el-icon>用户名或密码不匹配
          </div>
          <a href="#" class="link">忘记密码?</a>
          <button class="btn">登 录</button>
        </form>
      </div>

      <!-- Overlay -->
      <div class="container__overlay">
        <div class="overlay">
          <div class="overlay__panel overlay--left">
            <button class="btn" id="signIn" @click.prevent="handleSignIn">
              登 录
            </button>
          </div>
          <div class="overlay__panel overlay--right">
            <button class="btn" id="signUp" @click.prevent="handleTranslate">
              注 册
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { WarningFilled, Lock, Unlock } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { useCounterStore } from "@/stores/user";
import { reqRegister } from "@/api/user";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useCounterStore();
// 用户名与密码校验规则
const RegConfirm = ref<boolean>(false);
const loginConfirm = ref<boolean>(false);
const loginCondition = ref<boolean>(false);
let LoginCondition = ref(1);
const mydiv = ref();
let userData = ref<any>({
  username: "",
  password: "",
});
// 组件挂载隐藏导航栏
onMounted(() => {
  userStore.isTarbar = false;
  userStore.isLogin = false;
});
// 校验用户名合法性
const checkUsername = () => {
  if (
    userData.value.username.trim().length >= 2 &&
    userData.value.username.trim().length <= 20
  ) {
    loginConfirm.value = false;
  } else {
    loginConfirm.value = true;
  }
};
// 重置表单
const resetForm = () => {
  userData.value.username = "";
  userData.value.password = "";
  RegConfirm.value = false;
  loginConfirm.value = false;
  loginCondition.value = false;
};
// 校验表单
const checkForm = () => {
  if (
    RegConfirm.value == false &&
    loginConfirm.value == false &&
    loginCondition.value == false
  ) {
    console.log(RegConfirm.value, loginConfirm.value, loginConfirm.value);
    if (userData.value.username !== "" && userData.value.password !== "") {
      loginCondition.value = false;
      console.log(userData.value.password, userData.value.username);
      return Promise.resolve();
    } else {
      RegConfirm.value = false;
      loginCondition.value = true;
      Promise.reject(new Error("用户名与密码不能为空"));
    }
  } else {
    RegConfirm.value = false;
    loginCondition.value = true;
    console.log(321);

    return Promise.reject(new Error("请确保输入正确!"));
  }
};
// 校验密码合法性
const checkPassword = () => {
  if (
    userData.value.password.trim().length >= 6 &&
    userData.value.password.trim().length <= 20
  ) {
    RegConfirm.value = false;
  } else {
    RegConfirm.value = true;
  }
};
const handleLogin = async () => {
  await checkForm()
    .then((result) => {
      userStore
        .getLogin(userData.value)
        .then((result) => {
          router.push("/home");

          ElNotification({
            type: "success",
            message: "登录成功",
          });
          userStore.isTarbar = true;
        })
        .catch((err) => {
          ElNotification({
            type: "error",
            message: "登录失败！请检查用户名与密码！",
          });
          resetForm();
        });
      return "ok";
    })
    .catch((err) => {
      ElNotification({
        type: "error",
        message: "登录失败！请检查用户名与密码！",
      });
      resetForm();
      return "ok";
    });
};
const handleResgister = async () => {
  await checkForm()
    .then(async (result) => {
      let res = await reqRegister(userData.value);
      if (res.code == 200) {
        ElNotification({
          type: "success",
          message: "注册成功",
        });
      } else {
        ElNotification({
          type: "error",
          message: res.msg,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      ElNotification({
        type: "error",
        message: "注册失败！",
      });
    });
};
// 用户名校验规则
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2 && value.trim().length <= 20) {
    callback();
  } else {
    callback(new Error("用户名长度2-20之间！"));
  }
};
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2 && value.trim().length <= 20) {
    callback();
  } else {
    callback(new Error("密码长度2-20之间！"));
  }
};
//动态添加类名
const getLoginClassName = computed(() => {
  if (LoginCondition.value == 0) {
    return "container right-panel-active";
  } else {
    return "container ";
  }
});
//注册
const handleTranslate = () => {
  userData.value.username = "";
  userData.value.password = "";
  RegConfirm.value = false;
  loginConfirm.value = false;
  loginCondition.value = false;
  mydiv.value.classList.add("right-panel-active");
  LoginCondition.value = 1;
};
const handleSignIn = () => {
  // 重置用户信息与校验
  userData.value.username = "";
  userData.value.password = "";
  RegConfirm.value = false;
  loginConfirm.value = false;
  loginCondition.value = false;
  console.log(mydiv.value.classList);
  mydiv.value.classList.remove("right-panel-active");
};
// 定义表单校验规则
const rules = {
  username: [
    {
      //required配置表单是否必填 message错误的提示信息 trigger 触发校验的时机
      // required: true, message: '用户名不能为空！', trigger: 'blur'
      trigger: "change",
      validator: validatorUsername,
      required: true,
    },
  ],
  password: [
    {
      trigger: "change",
      validator: validatorPassword,
      required: true,
    },
    // {
    //     min: 6, max: 20, message: '密码长度必须大于6位', trigger: 'change'
    // }
  ],
};
</script>
<style lang="scss" scoped>
.login-container {
  align-items: center;
  background-color: var(--white);
  background: url("../../../public/images/login-lzy.jpg");
  padding: 0;
  margin: 0;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  height: 100vh;
  overflow: hidden;
  place-items: center;
}
.form__title {
  font-weight: 300;
  margin: 0;
  margin-bottom: 1.25rem;
}

.link {
  color: var(--gray);
  font-size: 0.9rem;
  margin: 1.5rem 0;
  text-decoration: none;
}

.container {
  background-color: var(--white);
  border-radius: var(--button-radius);
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
    0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: var(--max-height);
  max-width: var(--max-width);
  overflow: hidden;
  position: relative;
  width: 100%;
}

.container__form {
  height: 100%;
  position: absolute;
  top: 0;
  transition: all 0.6s ease-in-out;
}

.container--signin {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .container--signin {
  transform: translateX(100%);
}

.container--signup {
  left: 0;
  opacity: 0;
  width: 50%;
  z-index: 1;
}

.container.right-panel-active .container--signup {
  animation: show 0.6s;
  opacity: 1;
  transform: translateX(100%);
  z-index: 5;
}

.container__overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
  z-index: 100;
}

.container.right-panel-active .container__overlay {
  transform: translateX(-100%);
}

.overlay {
  background-color: var(--lightblue);
  background: url("../../../public/images/login-formBG.jpg");
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay__panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay--left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay--left {
  transform: translateX(0);
}

.overlay--right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay--right {
  transform: translateX(20%);
}

.btn {
  background-color: var(--blue);
  background-image: linear-gradient(90deg, yellow 0%, orange 74%);
  border-radius: 20px;
  border: 1px solid #fff;
  color: var(--white);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.9rem 4rem;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

.form > .btn {
  margin-top: 1.5rem;
}

.btn:active {
  transform: scale(0.95);
}

.btn:focus {
  outline: none;
}

.form {
  background-color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  text-align: center;
}

.input {
  background-color: #fff;
  border: none;
  padding: 0.9rem 0.9rem;
  margin: 0.5rem 0;
  width: 100%;
}
.el-input__inner {
  background-color: #fff;
  border: none;
  padding: 0.9rem 0.9rem;
  margin: 0.5rem 0;
  width: 100%;
}
@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

#emailHelp {
  text-align: center;
  color: red;
  letter-spacing: 1px;
}

#emailHelp i {
  margin-right: 5px;
  vertical-align: middle;
}
</style>
