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
        {{orderStatusMap(row.status)}}
      </template>
      <template slot-scope="{row}" slot="consignDate">
        {{u.formatDate(row.consignDate)}}
      </template>
      <template slot-scope="{row}" slot="paymentDate">
        {{u.formatDate(row.paymentDate)}}
      </template>
      <template slot-scope="{row}" slot="handle">
        <Button v-show="row.status === '2'" type="info" @click="openEditLogisticsModal(row)">编辑物流</Button>
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
import { getOrders, logisticsImport } from '@/api/order-manage'

export default {
  name: 'LogisticsManage',
  created () {
    this.getOrders()
  },
  data () {
    return {
      modalFlag: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      query: {
        status: '2'
      },
      orderItem: {
        orderId: undefined,
        shippingCode: undefined
      },
      orders: [],
      tabColumns: [
        { title: '序号', type: 'index', align: 'center', width: 60 },
        { title: '订单号', key: 'orderNo', align: 'center' },
        { title: '物流单号', slot: 'shippingCode', align: 'center', width: 140},
        { title: '支付金额', slot: 'payment', align: 'center', width: 90},
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
    orderStatusMap (status) {
      switch (status) {
        case '1' :
          return '待支付'
          break
        case '2' :
          return '待发货'
          break
        case '3' :
          return '待收货'
          break
        case '4' :
          return '已完成'
          break
        case '5' :
          return '已取消/失效'
          break
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

</style>
