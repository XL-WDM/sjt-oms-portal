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
      <template slot-scope="{row}" slot="createDate">
        {{u.formatDate(row.createDate)}}
      </template>
      <template slot-scope="{row}" slot="paymentDate">
        {{u.formatDate(row.paymentDate)}}
      </template>
      <template slot-scope="{row}" slot="handle">
        <Button v-show="row.status === '2'" type="info" @click="editLogistics(row.id)">编辑物流</Button>
        <Button class="mgl5">详情</Button>
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
  </div>
</template>

<script>
import { getOrders } from '@/api/order-manage'

export default {
  name: 'LogisticsManage',
  created () {
    this.getOrders()
  },
  data () {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      query: {
        status: '2'
      },
      tabColumns: [
        { title: '序号', type: 'index', align: 'center', width: 70 },
        { title: '订单号', key: 'orderNo', align: 'center' },
        { title: '物流单号', slot: 'shippingCode', align: 'center' },
        { title: '支付金额', slot: 'payment', align: 'center' },
        { title: '订单创建时间', slot: 'createDate', align: 'center', width: 180 },
        { title: '支付时间', slot: 'paymentDate', align: 'center', width: 180 },
        { title: '操作', slot: 'handle', align: 'center', width: 180 }
      ],
      orders: []
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
    // 编辑物流信息
    editLogistics (orderId) {
      console.log(orderId)
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

</style>
