<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height:100%;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: white;
  }
  .layout-header{
    height: 50px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  .layout-ceiling-main a{
    color: #9ba7b5;
  }
  .layout-hide-text .layout-text{
    display: none;
  }
  .ivu-col{
    transition: width .2s ease-in-out;
  }
  .ivu-row-flex{
    height:100%;
    overflow:auto
  }
</style>
<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row type="flex">
      <i-col :span="spanLeft" class="layout-menu-left">
        <Menu active-key="1" theme="light" width="auto">
          <div class="layout-logo-left"></div>
          <Submenu  v-for="(item,x) in menuData"  :key="x">
            <template slot="title" >
              <Icon :type="item.meneIcon" :size="iconSize"></Icon>
              <span class="layout-text"> {{item.menuName}}</span>
            </template>
            <template v-for="(item2, y) in item.children">
              <Menu-item :name="item2.menuUrl" :key="item2.menuId" @click.native="getMenu(item.menuName,item2)">{{item2.menuName}}</Menu-item>
            </template>
          </Submenu>
        </Menu>
      </i-col>
      <i-col :span="spanRight">
        <div class="layout-header">
          <i-col span="2">
            <i-button type="text" @click="toggleClick">
              <Icon type="navicon" size="30"></Icon>
            </i-button>
          </i-col>
          <i-col span="22" style="height: 50px;line-height: 50px;">
            <div class="layout-nav" style="float:right;margin-right: 2rem;">
              <Icon type="android-contact" size="20"></Icon>
              <span style="color: #464c5b;font-size: 14px;font-weight: 500;">{{username}}</span>&nbsp;&nbsp;
              <a @click="showDigLogout = true">
                <Icon type="log-out" size="20"></Icon>
              </a>
            </div>
          </i-col>
        </div>
        <div class="layout-breadcrumb">
          <Breadcrumb style="cursor: pointer;">
            <Breadcrumb-item href="#">{{firsttitle}}</Breadcrumb-item>
            <Breadcrumb-item>{{secondtitle}}</Breadcrumb-item>
          </Breadcrumb>
        </div>
        <div class="layout-content">
          <div class="layout-content-main">
            <router-view></router-view>
          </div>
        </div>
        <div class="layout-copy">
          2011-2016 &copy; xiamen
        </div>
      </i-col>
    </Row>
    <Modal
      v-model="showDigLogout"
      title="操作提示"
      @on-ok="logout" @on-cancel="cancel">
      <p>确认退出当前登陆？</p>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        spanLeft: 5,
        spanRight: 19,
        menuData: [],
        firsttitle: '首页',
        secondtitle: '',
        activename: '',
        showDigLogout: false
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft === 5 ? 14 : 24
      },
      username () {
        let username = localStorage.getItem('ms_username')
        return username || this.name
      }
    },
    methods: {
      toggleClick () {
        if (this.spanLeft === 5) {
          this.spanLeft = 2
          this.spanRight = 22
        } else {
          this.spanLeft = 5
          this.spanRight = 19
        }
      },
      getMenu (parentName, item) {
        this.activename = item.menuName
        this.firsttitle = parentName
        this.secondtitle = item.menuName
        this.$router.push(item.menuUrl)
      },
      logout () {
        localStorage.setItem('ms_username', '')
        this.$router.push('/logout')
        // this.$http('/login/logout').then((req) => {
        //   console.log(req)
        //   if (req.data.success === 0) {
        //     localStorage.setItem('ms_username', '')
        //     this.$router.push('/logout')
        //   }
        // })
      }
    },
    created () {
      // 查询菜单
      this.$http({
        url: '/login/getMenuList'
      }).then((req) => {
        if (req.data.success) {
          if (req.data.result && req.data.result.length > 0) {
            let data = req.data.result
            // 没有父节点的数据
            this.menuData = data.filter(value => value.menuPid === -1)
            // 有父节点的数据
            let children = data.filter(value => value.menuPid !== 'undefined' && value.menuPid != null && value.menuPid !== -1)
            // 遍历父节点数据
            this.menuData.forEach((parent) => {
              // 遍历子节点数据
              children.forEach((current, index) => {
                // 此时找到父节点对应的一个子节点
                if (current.menuPid === parent.menuId) {
                  typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
                }
              })
            })
            debugger
            this.menuData;
          }
        } else {
          this.$Message.error(req.data.data)
          self.modal_loading = false
        }
      }).catch((req) => {
        this.$Message.error(req.status)
      })
    }
  }
</script>
