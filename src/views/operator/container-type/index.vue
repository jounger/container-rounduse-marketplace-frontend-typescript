<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách loại Container
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-btn
        color="primary"
        style="margin-left: 35px;"
        dark
        @click.stop="addContainerType"
        v-if="$auth.check(['ROLE_ADMIN'])"
      >
        Thêm mới
      </v-btn>
      <v-btn
        color="red"
        style="margin-left: 20px;"
        dark
        @click.stop="dialogDel = true"
        v-if="selected.length > 0 && $auth.check(['ROLE_ADMIN'])"
      >
        Xóa loại Container
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDelSingle" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;"
                  >Xóa loại Container</span
                >
                <v-btn
                  icon
                  dark
                  @click="dialogDelSingle = false"
                  style="margin-left:324px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa loại Container này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>{{ name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-container>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-left: 205px;">
              <v-btn @click="cancelDelSingle()">Hủy</v-btn>
              <v-btn @click="delSingle(name)" color="red">Xóa</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <DeleteContainerType
          :selected.sync="selected"
          :dialogDel.sync="dialogDel"
        />
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogAdd" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">{{ title }}</span>
                <v-btn icon dark @click="cancel()" style="margin-left:258px;">
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Tên loại Container"
                        name="name"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="name"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Chi tiết"
                        name="description"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="description"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Khối lượng vỏ"
                        name="tareWeight"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="tareWeight"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Trọng tải"
                        name="payloadCapacity"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="payloadCapacity"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Công suất khối"
                        name="cubicCapacity"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="cubicCapacity"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Chiều dài trong"
                        name="internalLength"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="internalLength"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Chiều rộng trong"
                        name="internalWidth"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="internalWidth"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Chiều cao trong"
                        name="internalHeight"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="internalHeight"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Chiều rộng cửa mở"
                        name="doorOpeningWidth"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="doorOpeningWidth"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Chiều cao cửa mở"
                        name="doorOpeningHeight"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="doorOpeningHeight"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="cancel()">Trở về</v-btn>
              <v-btn @click="submit()" color="primary" v-if="checkAdd"
                >Thêm mới</v-btn
              >
              <v-btn
                @click="updateContainerType()"
                color="primary"
                v-if="checkUpdate"
                >Cập nhập</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-alert
        v-model="checkSuccess"
        dismissible
        close-icon="mdi-delete"
        type="success"
      >
        {{ success }}
      </v-alert>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="containerTypes"
        :search="search"
        item-key="name"
        show-select
        :options.sync="options"
        :server-items-length="totalContainerTypes"
        :loading="loading"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.action="{ item }">
          <v-menu :loading="item.createloading" :disabled="item.createloading">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetail(item)">
                <v-list-item-title>Xem chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item @click="update(item)">
                <v-list-item-title>Cập nhập</v-list-item-title>
              </v-list-item>
              <v-list-item @click="delContainerType(item)">
                <v-list-item-title>Xóa</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import DeleteContainerType from "../container-type/components/DeleteContainerType.vue";
import { ContainerType } from "../container-type/container-type";

@Component({
  name: "ContainerTypeManagement",
  components: {
    DeleteContainerType
  }
})
export default class ContainerTypeManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<ContainerType>;
  name = "";
  description = "";
  tareWeight = null;
  payloadCapacity = null;
  cubicCapacity = null;
  internalLength = null;
  internalWidth = null;
  internalHeight = null;
  doorOpeningWidth = null;
  doorOpeningHeight = null;
  success = "";
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  dialogDelSingle = false;
  checkAdd = false;
  checkUpdate = false;
  title = "";
  // name = "";
  search = "";
  readonly = false;
  totalContainerTypes = 0;
  containerTypes = [] as Array<ContainerType>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên loại Container",
      align: "start",
      sortable: true,
      value: "name"
    },
    { text: "Chi tiết", value: "description" },
    { text: "Khối lượng vỏ", value: "tareWeight" },
    { text: "Trọng tải", value: "payloadCapacity" },
    { text: "Công suất khối", value: "cubicCapacity" },
    { text: "Chiều dài trong", value: "internalLength" },
    { text: "Chiều rộng trong", value: "internalWidth" },
    { text: "Chiều cao trong", value: "internalHeight" },
    { text: "Chiều rộng cửa mở", value: "doorOpeningWidth" },
    { text: "Chiều cao cửa mở", value: "doorOpeningHeight" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  async created() {
    console.log(1);
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  @Watch("options", { deep: true })
  getOptions() {
    this.getDataFromApi().then((data: any) => {
      this.containerTypes = data.items;
      this.totalContainerTypes = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.containerTypes = data.items;
      this.totalContainerTypes = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getContainerTypes();
      const total = items.length;

      if (sortBy.length === 1 && sortDesc.length === 1) {
        items = items.sort((a: ContainerType, b: ContainerType) => {
          const sortA = a;
          const sortB = b;

          if (sortDesc[0]) {
            if (sortA < sortB) return 1;
            if (sortA > sortB) return -1;
            return 0;
          } else {
            if (sortA < sortB) return -1;
            if (sortA > sortB) return 1;
            return 0;
          }
        });
      }

      if (itemsPerPage > 0) {
        items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
      }

      setTimeout(() => {
        this.loading = false;
        resolve({
          items,
          total
        });
      }, 1000);
    });
  }
  public getContainerTypes(): Array<ContainerType> {
    return [
      {
        name: "Container to 01",
        description: "Nó to",
        tareWeight: 100,
        payloadCapacity: 500,
        cubicCapacity: 100,
        internalLength: 200,
        internalWidth: 100,
        internalHeight: 100,
        doorOpeningWidth: 200,
        doorOpeningHeight: 150
      },
      {
        name: "Container to 02",
        description: "Nó to",
        tareWeight: 100,
        payloadCapacity: 500,
        cubicCapacity: 100,
        internalLength: 200,
        internalWidth: 100,
        internalHeight: 100,
        doorOpeningWidth: 200,
        doorOpeningHeight: 150
      },
      {
        name: "Container to 03",
        description: "Nó to",
        tareWeight: 100,
        payloadCapacity: 500,
        cubicCapacity: 100,
        internalLength: 200,
        internalWidth: 100,
        internalHeight: 100,
        doorOpeningWidth: 200,
        doorOpeningHeight: 150
      },
      {
        name: "Container to 04",
        description: "Nó to",
        tareWeight: 100,
        payloadCapacity: 500,
        cubicCapacity: 100,
        internalLength: 200,
        internalWidth: 100,
        internalHeight: 100,
        doorOpeningWidth: 200,
        doorOpeningHeight: 150
      },
      {
        name: "Container to 05",
        description: "Nó to",
        tareWeight: 100,
        payloadCapacity: 500,
        cubicCapacity: 100,
        internalLength: 200,
        internalWidth: 100,
        internalHeight: 100,
        doorOpeningWidth: 200,
        doorOpeningHeight: 150
      },
      {
        name: "Container to 06",
        description: "Nó to",
        tareWeight: 100,
        payloadCapacity: 500,
        cubicCapacity: 100,
        internalLength: 200,
        internalWidth: 100,
        internalHeight: 100,
        doorOpeningWidth: 200,
        doorOpeningHeight: 150
      }
    ];
  }
  public submit() {
    this.success = "Thêm mới thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public cancel() {
    this.checkAdd = false;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = false;
  }
  public viewDetail(item: any) {
    this.name = item.name;
    this.description = item.description;
    this.tareWeight = item.tareWeight;
    this.payloadCapacity = item.payloadCapacity;
    this.cubicCapacity = item.cubicCapacity;
    this.internalLength = item.internalLength;
    this.internalWidth = item.internalWidth;
    this.internalHeight = item.internalHeight;
    this.doorOpeningWidth = item.doorOpeningWidth;
    this.doorOpeningHeight = item.doorOpeningHeight;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin containerType";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: any) {
    this.name = item.name;
    this.description = item.description;
    this.tareWeight = item.tareWeight;
    this.payloadCapacity = item.payloadCapacity;
    this.cubicCapacity = item.cubicCapacity;
    this.internalLength = item.internalLength;
    this.internalWidth = item.internalWidth;
    this.internalHeight = item.internalHeight;
    this.doorOpeningWidth = item.doorOpeningWidth;
    this.doorOpeningHeight = item.doorOpeningHeight;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập containerType";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delContainerType(item: any) {
    this.name = item.name;
    this.dialogDelSingle = true;
  }
  public delSingle(name: string) {
    this.containerTypes = this.containerTypes.filter(
      (containerType: any) => containerType.name != name
    );
    this.success = "Xóa thành công";
    this.checkSuccess = true;
    this.dialogDelSingle = false;
  }
  public cancelDelSingle() {
    this.name = "";
    this.dialogDelSingle = false;
  }
  public addContainerType() {
    this.name = "";
    this.description = "";
    this.tareWeight = null;
    this.payloadCapacity = null;
    this.cubicCapacity = null;
    this.internalLength = null;
    this.internalWidth = null;
    this.internalHeight = null;
    this.doorOpeningWidth = null;
    this.doorOpeningHeight = null;
    this.title = "Thêm mới loại Container";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public updateContainerType() {
    this.success = "Cập nhập thành công";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public del() {
    this.success = "Xóa thành công!";
    this.checkSuccess = true;
    console.log(this.selected);
    this.dialogDel = false;
  }
  public cancelDel() {
    this.dialogDel = false;
  }
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 520px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>
