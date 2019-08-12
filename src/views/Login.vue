<template>
  <div class="loginMain">
    <div class="login-from">
      <h3 style="font-size: 32px; margin-bottom: 20px;">后台管理品台</h3>
      <Form :model="sign" :rules="signRules" ref="signFormValidate">
        <FormItem prop="username">
          <Input prefix="ios-contact-outline"
                 name="username"
                 v-model="sign.username"
                 placeholder="用户名"
                 size="large"
                 class="l_input"
                 @keyup.enter.native="login"/>
        </FormItem>
        <FormItem prop="password">
          <Input prefix="ios-lock-outline"
                 name="password"
                 v-model="sign.password"
                 placeholder="密码"
                 size="large"
                 class="l_input"
                 :type="iosEye ? 'text' : 'password'"
                 :icon="iosEye ? 'ios-eye' : 'ios-eye-off'"
                 @on-click="eye"
                 @keyup.enter.native="login"/>
        </FormItem>
        <FormItem>
          <Button :loading="signLoading" type="info" class="loginBtn" @click="login">登陆</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import v from '@/assets/js/iViewValidate'
import { sign } from '@/api/sign'

export default {
  name: 'Login',
  data () {
    return {
      iosEye: false,
      sign: {
        username: undefined,
        password: undefined
      },
      signLoading: false,
      signRules: {
        username: [{ validator: v.empty, trigger: 'blur' }],
        password: [{ validator: v.empty, trigger: 'blur' }]
      }
    }
  },
  methods: {
    login () {
      this.$refs['signFormValidate'].validate(valid => {
        if (!valid) {
          return
        }
        this.signLoading = true
        sign({
          username: 'test',
          password: '123456'
        }).then(response => {
          console.log(response)
          response.success(data => {
            if (data) {
              this.$router.push({ path: this.$route.query.to || '/order/logistics-manage' })
              this.$Notice.success({ title: '登陆成功' })
            }
          })
          this.signLoading = false
        }).catch(() => {
          this.signLoading = false
        })
      })
    },
    eye () {
      this.iosEye = !this.iosEye
    }
  }
}
</script>

<style scoped>
  .loginMain{
    width: 100%;
    height: 100%;
    background: #2d3a4b;
  }
  .login-from {
    text-align: center;
    width: 400px;
    color: #eee;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
  }
  .loginBtn {
    width: 100%;
  }
</style>
