<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      AppId: 'wx73d2dbd39ff54f88',
      code: ''
    }
  },
  computed: {
    ...mapGetters([
      'account_id',
      'roles'
    ])
  },
  created() {
    this.getUrlCode()
  },
  methods: {
    getUrlCode() {
      const code = this.$route.query.code
      if (code == null || code === '') {
        this.getWxCode()
        return false
      }
      this.code = code
      this.GetToken()
    },
    getWxCode() {
      const AppId = this.AppId
      const redirectURL = encodeURIComponent(location.origin + '/index')
      const base = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=`
      window.location.href = base + AppId +
          `&redirect_uri=` + redirectURL +
          `&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
    },
    GetToken() {
      this.$store.dispatch('user/getInfoByCode', { 'code': this.code }).then((response) => {
        const needBind = response.need_bind
        if (needBind) {
          const uri = '/bindwx?name=' + response.open_id
          this.$router.push({ path: uri, replace: true })
        } else {
          this.$router.push({ path: '/home', replace: true })
        }
      }).catch(() => {
        this.$router.push({ path: '/login' })
      })
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
