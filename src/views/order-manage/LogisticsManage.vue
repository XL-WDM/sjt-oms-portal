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
      <div class="mgt20" style="margin-bottom: 100px">
        <div class="border-bottom">物流信息</div>
        <div class="item-content">
          <Row class="mgb5"><Col span="11">物流单号</Col><Col span="13" class="text-right">{{orderDetail.shippingCode}}</Col></Row>
        </div>
        <div>
          <Collapse simple>
            <Panel name="1">
              物流查询
              <div slot="content">
                <div>未完成</div>
                <div>未完成</div>
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
  </div>
</template>

<script>
import v from '@/assets/js/iViewValidate'
import { getOrders, logisticsImport, orderDetail } from '@/api/order-manage'

export default {
  name: 'LogisticsManage',
  created () {
    this.getOrders()
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
    modalChange (openFlag) {
      if (!openFlag) {
        this.orderItem.shippingCode = undefined
        this.orderItem.orderId = undefined
      }
    },
    drawerChange (openFlag) {
      if (!openFlag) {
        this.orderDetail = {}
      }
    },
    openDrawer (orderId) {
      this.drawerFlag = true
      orderDetail(orderId).then(response => {
        response.success(data => {
          this.orderDetail = data.data
        })
      })
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
