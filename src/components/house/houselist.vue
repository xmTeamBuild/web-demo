<template>
  <div class="house">
    <Form :model="searchList" :label-width="85" style="padding: 15px 0 0px;border: 1px solid #ccc;margin-bottom: 5px;">
      <Row :gutter="8">
        <Col span="5">
        <Form-item label="菜单类型">
          <Select v-model="searchList.housedistrict">
            <Option v-for="item in arealist" :value="item.value" :key="item">{{ item.label }}</Option>
          </Select>
        </Form-item>
        </Col>
        <Col span="5">
          <Form-item label="菜单名称">
            <Input v-model="searchList.currentstatus" placeholder="请输入菜单名称"/>
          </Form-item>
        </Col>
        </Row>
    </Form>
    <Table border :columns="columns1" :data="data1"></Table>
    <div style="padding: 10px 0;">
      <Page :total="totalcount" show-total @on-change="changePage"></Page>
    </div>
    <Modal v-model="modaledit" :mask-closable="false" class-name="vertical-center-modal" style="width: 620px;">
      <p slot="header" style="color:#f60;text-align:center;font-size: 16px;">
        <Icon type="ios-compose"></Icon>
        <span>房源信息</span>
      </p>
      <div>
        <Form :model="updateinfo" ref="updateinfo" :rules="ruleValidate" :label-width="90" width="620">
          <Row style="width: 620px;">
            <Col span="12">
            <Form-item label="菜单名称" prop="manageuser">
              <Input v-model="updateinfo.manageuser" placeholder=""/>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="单位名称" prop="company">
              <Input v-model="updateinfo.company" placeholder=""/>
            </Form-item>
            </Col>
          </Row>
        </Form>
      </div>
      <div  align="center">
        <Button type="primary" @click="updateInfo('updateinfo')">更新</Button>
        <Button type="warning" @click="modaledit = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        totalcount: 0,
        page: 1,
        columns1: [
          {title: '菜单类型', key: 'manageuser'},
          { title: '菜单名称', key: 'housedistrict',align:'center' },
          { title: '操作人', key: 'optusername'},
          { title: '添加时间', key: 'createtime',align:'center',width:180},
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.row)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id, params.row.manageuser)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        data1: [],
        searchList: {
          housedistrict: '',
          housearea1: '',
          housearea2: '',
          leasefloor: '',
          company: '',
          companyaddr: '',
          telephone: '',
          manageuser: '',
          id: '',
          isShow: false,
          isdriving: '全部',
          driviecontent1: '',
          driviecontent2: '',
          distribution1: '',
          distribution2: '',
          currentstatus: ''

        },
        modaledit: false,
        updateinfo: {
          manageuser: '',
          company: '',
          companyaddr: '',
          housearea: '',
          leasetype: '出租',
          rent: '',
          housedistrict: '',
          leasefloor: '',
          distribution: '',
          isDriving: false,
          drivieton: '',
          telephone: '',
          currentstatus: '',
          detailcontent: ''
        },
        ruleValidate: {
          manageuser: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ],
          company: [
            { required: true, message: '单位名称不能为空', trigger: 'blur' }
          ],
          companyaddr: [
            { required: true, message: '公司地址不能为空', trigger: 'blur' }
            // { type: 'password', message: '密码格式不正确', trigger: 'blur' }
          ],
          housearea: [
            { required: true, message: '房源面积不能为空', trigger: 'blur' },
            { pattern: /^[1-9]\d*$/, message: '房源面积输入不正确', trigger: 'blur' }
          ],
          rent: [
            { required: true, message: '租金不能为空', trigger: 'blur' },
//            { pattern: /^[1-9]\d*$/, message: '租金输入不正确', trigger: 'blur' }
          ]
        },
        arealist: [
          { value: '', label: '全部类型' },
          { value: '功能菜单', label: '功能菜单' },
          { value: '菜单', label: '菜单' },
        ],
        isDr: false
      }
    },
    methods: {
      queryHouselist () {
        this.$http({
          url: '/house/list',
          params: {
            houseinfo: JSON.stringify(this.searchList),
            page: this.page,
            prepage: 10
          },
          method: 'GET'
        }).then((req) => {
          var list = []
          var msg = req.data
          this.data1 = msg.data.list
          this.totalcount = msg.data.totalcount
        })
      },
      changePage (e) {
        this.page = e
        this.queryHouselist()
      },
      show (param) {
        this.$http({
          url: '/house/info',
          params:{ id: param.id }
        }).then((req) => {
          if (req.data.success === 0) {
            this.modaledit = true
            if (req.data.data.isDriving === 'true') {
              this.isDr = true
            } else {
              this.isDr = false
            }
            this.updateinfo = req.data.data
          } else {
          this.$Message.success('房源信息查询失败！')
          }
        })
      },
      remove (id, name) {
        this.$Modal.confirm({
          title: '操作提示',
          content: '<p>确认删除该条房源信息？</p>',
          onOk: () => {
            this.$http({
              url: '/house/delete',
              params: {
                houseid: id,
                manageuser: name
              }
            }).then((req) => {
              if (req.data.success===0) {
                this.$Message.success('客户房源删除成功！')
                this.queryHouselist()
              }else{
                this.$Message.success(req.data.data)
              }
            })
          },
          onCancel: () => {
//            this.$Message.info('点击了取消');
          }
        })
      },
      isDriving1 (e) {
        this.isDr = e
        this.updateinfo.isDriving = e
      },
      getIsDrive (e) {
        var v = this.searchList.isdriving
        var bool = false
        if (v === 'true') {
          bool = true
        }
        this.searchList.isShow = bool
      },
      updateInfo (name) {
        var _this = this
        this.$refs[name].validate((valid) => {
          if (valid) {
            _this.$http({
              url: '/house/update',
              params: {
                houseStr:JSON.stringify(_this.updateinfo)
              }
            }).then((req) => {
              this.modaledit = false
              this.$Message.success(req.data.data)
              this.queryHouselist()
            })
          }
        })
      }
    },
    created () {
      this.queryHouselist()
    }
  }
</script>

<style>
  .ivu-modal{
    width:660px;
  }
  .ivu-modal-content{
    width: 660px;
  }
</style>
