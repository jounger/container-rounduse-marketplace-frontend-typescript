<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <p>
          Tài khoản của bạn đang được xem xét bởi các Quản trị viên. Vui lòng
          chờ phản hồi qua email!
        </p>
        <p>
          Xem chi tiết đơn đăng ký tại
          <a @click="dialogDetail = true">đây</a>
        </p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <SupplierDetail
        v-if="dialogDetail"
        :dialogDetail.sync="dialogDetail"
        :supplier="supplier"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { getSupplier } from "@/api/supplier";
import SupplierDetail from "../../operator/supplier/components/SupplierDetail.vue";

@Component({
  components: {
    SupplierDetail
  }
})
export default class Application extends Vue {
  supplier = null as ISupplier | null;
  dialogDetail = false;
  async created() {
    const _res = await getSupplier(this.$auth.user().username);
    if (_res.data) {
      const _supplier = _res.data;
      this.supplier = _supplier;
    }
  }
}
</script>
