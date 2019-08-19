<template>
  <div>
    <div class="mgb5">
      <Input v-model="query.orderNo"
             style="width: 200px"
             clearable
             placeholder="请输入订单号"/>
      <Select v-model="query.status"
              class="mgl10"
              @on-change="getOrders"
              style="width:200px">
        <Option value="">全部</Option>
        <Option value="1">待付款</Option>
        <Option value="2">待发货</Option>
        <Option value="3">待收货</Option>
        <Option value="4">已完成</Option>
        <Option value="5">已取消</Option>
      </Select>
      <DatePicker type="daterange"
                  @on-change="changeDate"
                  class="mgl10"
                  placeholder="请选择日期"
                  confirm
                  split-panels
                  style="width: 200px">
      </DatePicker>
      <Button class="mgl10" type="primary" @click="getOrders">查询</Button>
    </div>
    <Table stripe
           :columns="tabColumns"
           :data="orders">
      <template slot-scope="{row}" slot="shippingCode">
        {{row.shippingCode || '-'}}
      </template>
      <template slot-scope="{row}" slot="payment">
        {{row.payment}}元
      </template>
      <template slot-scope="{row}" slot="status">
        <Tag :color="orderStatusMap(row.status).code">{{orderStatusMap(row.status).name}}</Tag>
      </template>
      <template slot-scope="{row}" slot="consignDate">
        {{u.formatDate(row.consignDate)}}
      </template>
      <template slot-scope="{row}" slot="paymentDate">
        {{u.formatDate(row.paymentDate)}}
      </template>
      <template slot-scope="{row}" slot="handle">
        <Button v-show="row.status === '2' || row.status === '3'" type="info" @click="openEditLogisticsModal(row)">编辑物流</Button>
        <Button class="mgl5" @click="openDrawer(row.id)">详情</Button>
      </template>
    </Table>
    <div class="text-center page ">
      <Page :total="page.total"
            show-sizer
            show-total
            :current="page.pageNo"
            @on-change="pageNoChange"
            @on-page-size-change="pageSizeChange"
            :page-size="page.pageSize"/>
    </div>
    <Drawer title="订单详情"
            width="500"
            @on-visible-change="drawerChange"
            v-model="drawerFlag">
      <div>
        <div class="border-bottom mgt20">收货地址</div>
        <div class="item-content">
          <Row class="mgb5"><Col span="11">联系人</Col><Col span="13" class="text-right">{{orderDetail.contactName || '无'}}</Col></Row>
          <Row class="mgb5"><Col span="11">联系电话</Col><Col span="13" class="text-right">{{orderDetail.contactPhone || '无'}}</Col></Row>
          <Row><Col span="11">联系地址</Col><Col span="13" class="text-right">{{orderDetail.address || '无'}}</Col></Row>
        </div>
      </div>
      <div class="mgt20">
        <div class="border-bottom mgt5">订单信息</div>
        <div class="item-content">
          <div class="border-bottom mgb5">订单详情</div>
          <div v-for="(item, index) in orderDetail.orderItems"
               :key="index">
            <div style="background-color: #ffffff;">
              <Row>
                <Col span="3">
                  <Card class="order-item"
                        :padding="0"
                        dis-hover
                        :bordered="false">
                    <img class="order-item-img" :src="item.productImg">
                  </Card>
                </Col>
                <Col span="18" style="padding-left: 10px">
                  <div style="margin-top: 15px"><H4>{{item.productName}}</H4></div>
                  <div><span style="font-size: 12px; color: #ccc;">{{item.productDescript}}</span></div>
                </Col>
                <Col span="3" class="text-right" style="padding-right:10px">
                  <div style="margin-top: 15px">{{item.price}}元</div>
                  <div>×{{item.num}}</div>
                </Col>
              </Row>
            </div>
            <div class="border-bottom"></div>
          </div>
          <div class="border-bottom mgb5 mgt20">订单基本信息</div>
          <Row class="mgb5"><Col span="11">订单号</Col><Col span="13" class="text-right">{{orderDetail.orderNo}}</Col></Row>
          <Row class="mgb5"><Col span="11">订单总价</Col><Col span="13" class="text-right">{{orderDetail.orgAmount}}元</Col></Row>
        </div>
      </div>
      <div class="mgt20" style="margin-bottom: 100px" v-show="orderDetail.status === '3' || orderDetail.status === '4'">
        <div class="border-bottom">物流信息</div>
        <div class="item-content">
          <Row class="mgb5"><Col span="11">物流单号</Col><Col span="13" class="text-right">{{orderDetail.shippingCode}}</Col></Row>
        </div>
        <div>
          <Collapse simple @on-change="queryLogistics" v-model="orderDetail.collapse">
            <Panel :name="orderDetail.orderNo">
              物流查询
              <div slot="content">
                <div v-show="getLogisticsCache(orderDetail.orderNo) && getLogisticsCache(orderDetail.orderNo).length === 0">暂无物流信息</div>
                <Timeline v-show="getLogisticsCache(orderDetail.orderNo) && getLogisticsCache(orderDetail.orderNo).length !== 0">
                  <TimelineItem v-for="(item, index) in getLogisticsCache(orderDetail.orderNo)"
                                :key="index"
                                :color="index === 0 ? 'green' : 'blue'">
                    <p class="time">{{item.acceptTime}}</p>
                    <p class="content">{{item.remark}}</p>
                  </TimelineItem>
                </Timeline>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </Drawer>
    <Modal v-model="modalFlag"
           @on-visible-change="modalChange"
           title="编辑物流单号">
      <Form :model="orderItem" :label-width="80" :rules="formRules" ref="formValidate">
        <FormItem label="物流单号" prop="shippingCode">
          <Input name="shippingCode"
                 type="number"
                 :maxlength="15"
                 v-model="orderItem.shippingCode"
                 placeholder="请输入物流单号"
                 size="large"/>
        </FormItem>
      </Form>
      <template slot="footer">
        <Button @click="modalFlag = false">取消</Button>
        <Button type="primary" @click="eidtOrder">确认</Button>
      </template>
    </Modal>
    <audio ref="notice" preload="auto">
      <source :src="apiUrl + '/mp3/order_pay_notify.mp3'" type="audio/ogg" />
    </audio>
  </div>
</template>

<script>
import v from '@/assets/js/iViewValidate'
import { getOrders, logisticsImport, orderDetail, queryLogistics } from '@/api/order-manage'

export default {
  name: 'LogisticsManage',
  created () {
    this.getOrders()
    this.startWebSocket()
  },
  data () {
    return {
      modalFlag: false,
      drawerFlag: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      query: {
        status: ''
      },
      orderItem: {
        orderId: undefined,
        shippingCode: undefined
      },
      orders: [],
      orderDetail: {},
      logisticsCache: {},
      tabColumns: [
        { title: '序号', type: 'index', align: 'center', width: 60 },
        { title: '订单号', key: 'orderNo', align: 'center' },
        { title: '物流单号', slot: 'shippingCode', align: 'center', width: 140 },
        { title: '支付金额', slot: 'payment', align: 'center', width: 90 },
        { title: '订单状态', slot: 'status', align: 'center', width: 100 },
        { title: '发货时间', slot: 'consignDate', align: 'center', width: 150 },
        { title: '支付时间', slot: 'paymentDate', align: 'center', width: 150 },
        { title: '操作', slot: 'handle', align: 'center', width: 180 }
      ],
      formRules: {
        shippingCode: [
          { validator: v.empty('物流单号不能为空'), trigger: 'blur' },
          { validator: v.lengthCheck(12, 15), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 事件搜索框改变通知
    changeDate (date) {
      this.query.startDate = date[0]
      this.query.endDate = date[1]
    },
    // 查询订单
    getOrders () {
      getOrders({ ...this.query, ...this.page }).then(response => {
        response.success(data => {
          this.orders = data.page.rows
          this.page.total = data.page.total
        })
      })
    },
    // 打开编辑物流Modal
    openEditLogisticsModal (row) {
      this.modalFlag = true
      this.orderItem.orderId = row.id
      this.orderItem.shippingCode = row.shippingCode
    },
    //  编辑订单
    eidtOrder () {
      const _this = this
      this.$refs['formValidate'].validate(valid => {
        if (!valid) {
          return
        }

        logisticsImport({ ..._this.orderItem }).then(response => {
          response.success(data => {
            _this.$Message.success(data.message)
            _this.modalFlag = false
            _this.getOrders()
          })
        })
      })
    },
    // 物流单编辑框闭合事件通知
    modalChange (openFlag) {
      if (!openFlag) {
        this.orderItem.shippingCode = undefined
        this.orderItem.orderId = undefined
      }
    },
    // 抽屉闭合事件通知
    drawerChange (openFlag) {
      if (!openFlag) {
        this.orderDetail = {}
      }
    },
    // 打开抽屉并查询订单详情
    openDrawer (orderId) {
      this.drawerFlag = true
      orderDetail(orderId).then(response => {
        response.success(data => {
          this.orderDetail = data.data
        })
      })
    },
    // 物流查询
    queryLogistics (names) {
      console.log(names)
      if (!names || names.length === 0) {
        return
      }
      for (var idx in names) {
        const orderNo = names[idx]
        if (this.orderDetail.orderNo === orderNo) {
          if (!this.logisticsCache[orderNo]) {
            queryLogistics(this.orderDetail.orderNo).then(response => {
              response.success(data => {
                this.logisticsCache[orderNo] = data.data
                this.orderDetail.collapse = undefined
                this.orderDetail.collapse = orderNo
              }).error(() => {
                this.orderDetail.collapse = undefined
              })
            })
            return
          }
        }
      }
    },
    // 获取物流缓存
    getLogisticsCache (orderNo) {
      return this.logisticsCache[orderNo]
    },
    orderStatusMap (status) {
      switch (status) {
        case '1' :
          return {
            code: 'default',
            name: '待支付'
          }
        case '2' :
          return {
            code: 'primary',
            name: '待发货'
          }
        case '3' :
          return {
            code: 'green',
            name: '待收货'
          }
        case '4' :
          return {
            code: 'success',
            name: '已完成'
          }
        case '5' :
          return {
            code: 'error',
            name: '已失效'
          }
      }
    },
    startWebSocket () {
      var websocket = null
      if ('WebSocket' in window) {
        websocket = new WebSocket(this.webSocketUrl + '/order-pay/notify/websocket')

        // 创建连接
        websocket.onopen = (event) => {
          console.log('建立连接')
        }

        // 断开连接
        websocket.onclose = (event) => {
          console.log('连接关闭')
        }

        // 接受消息
        websocket.onmessage = (event) => {
          this.$refs.notice.play()
          this.$Modal.confirm({
            title: '提醒',
            content: '您有新的订单, 请及时处理!',
            okText: '查看订单',
            cancelText: '取消',
            onOk: () => {
              const orderNo = event.data
              getOrders({ orderNo, ...this.page }).then(response => {
                response.success(data => {
                  this.orders = data.page.rows
                  this.page.total = data.page.total
                })
              })
            }
          })
        }

        // 连接出错事件
        websocket.onerror = (event) => {
          this.$Message.error('websocket通讯发生错误! 无法接收新订单通知')
        }

        // 定时心跳检测
        const wsTime = window.setInterval(() => {
          websocket.send(JSON.stringify({
            pingText: '心跳检测'
          }))
        }, 30000)

        // 页面关闭时断开连接
        window.onbeforeunload = () => {
          window.setInvalid(wsTime)
          websocket.close()
        }
      } else {
        this.$Message.warning({
          content: '您的浏览器不支持新订单通知',
          duration: 10
        })
      }
    },
    pageNoChange (pageNo) {
      this.page.pageNo = pageNo
      this.getOrders()
    },
    pageSizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.getOrders()
    }
  }
}
</script>

<style scoped>
.item-content {
  background-color: #f0f0f0;
  padding: 10px;
}
.order-item {
  height: 60px;
  padding: 5px;
}
.order-item-img {
  height: 50px;
}
</style>
