<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <template v-slot:left>
        <van-icon name="arrow-left" color="#fff" @click="$router.push('/my')" />
      </template>
    </van-nav-bar>
    <!-- 导航栏/ -->

    <!-- 表单验证使用
      1.给 van-field 组件配置 rules 验证规则
      2.当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
           也就是说在登录的时候，就不需要再进行额外的验证检验了
     -->
    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref='loginForm'>
      <van-field name="mobile" placeholder="请输入手机号" v-model='user.mobile' :rules='userFormRules.mobile' type="number" maxlength="11">
        <template v-slot:left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>
      <van-field name="code" placeholder="请输入验证码" v-model='user.code' :rules='userFormRules.code' type="number" maxlength="6">
        <template v-slot:left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>
        <template #button>
          <van-count-down v-if="isCountDownShow" :time="time" format="ss 秒" @finish='isCountDownShow = false'> </van-count-down>
          <van-button v-else native-type="button" class="smsBtn" round size="small" type="denger" @click="onSetSms"> 获取验证码 </van-button>
        </template>
      </van-field>
      <div style="margin: 16px;" class="submitBtn">
        <van-button class="loginBtn" block type="info" native-type="submit">登录 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 按需加载请求封装函数
import { login, getSms } from "@/api/user.js";
export default {
  name: "Login",
  data() {
    return {
      // 表单的初始值
      user: {
        mobile: "",
        code: "",
      },
      // 表单验证规则，验证时会按照代码书写顺序进行验证，验证通过才会进行下一个验证
      userFormRules: {
        mobile: [
          { required: true, message: "手机号码不能为空" },
          { pattern: /^1[35789]\d{9}$/, message: "手机号码格式不正确" },
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          { pattern: /^\d{6}$/, message: "验证码格式不正确" },
        ],
      },
      // 是否为获取验证码
      isCountDownShow: false,
      // 倒计时时间
      time: 1000 * 6,
    };
  },
  methods: {
    // login登录模块的实现分析：
    // 1.获取表单数据   data中的数据user，与输入框双向绑定，所以可以直接获取到表单的信息
    // 2.验证表单
    // 3.根据提交的表单信息请求登录
    // 4.根据请求返回的数据做后续处理

    async onSubmit() {
      // try{}catch(err){}  表示先尝试这个往try中执行，成功结束，不成功则就抛出错误，catch接收抛出的错误，可以在里面处理错误信息
      //  1.获取表单数据  this.user

      // 2.验证表单
      this.$toast.loading({
        // Toast 默认采用单例模式，即同一时间只会存在一个 Toast，
        message: "登录中...",
        forbidClick: true, // 是否禁止背景点击
        duration: 0, // 持续展示 toast
      });
      // 3.根据提交的表单信息请求登录
      try {
        const { data } = await login(this.user);
        // console.log(data);
        this.$store.commit("setToken", data.data); // 操作mutation修改store中的数据
        this.$toast.success("登录成功");

        // 登录成功，跳转到登录状态下的个人中心页面
        this.$router.push("/my");
      } catch (err) {
        // 提示 success 或 fail 的时候，会先把其他的 toast 先清除，超好用
        this.$toast.fail("登录失败，手机或验证码错误");
      }
      // 4.根据请求返回的数据做后续处理
    },

    // 点击获取验证码
    async onSetSms() {
      try {
        // validate方法表示验证表单，支持传入name来验证单个表单项，如果不写就表示验证整个表单
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return console.log("获取失败");
      }
      // console.log(3);
      this.isCountDownShow = true; // 验证通过之后，开启倒计时

      // 发起获取验证码的请求
      // console.log(this.user.mobile);

      try {
        const res = await getSms(this.user.mobile);
        this.$toast("发送成功");
      } catch (err) {
        // 发送验证码错误，则关闭倒计时
        this.isCountDownShow = false;
        // 根据响应码返回提示错误信息
        if (err.response.status === 429) {
          return this.$toast("发送过于频繁，请稍后重试");
        } else {
          this.$toast("发送验证码失败");
        }
      }

      // console.log(res);
      // this.$toast.fail("发送验证码失败");
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  box-sizing: border-box;
  .toutiao {
    font-size: 37px;
    margin-right: 20px;
  }
  .smsBtn {
    width: 152px;
    height: 46px;
    font-size: 22px;
    vertical-align: middle;
    border: 0;
    color: #888;
  }
  .submitBtn {
    padding: 53px 33px;
    .loginBtn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style> 