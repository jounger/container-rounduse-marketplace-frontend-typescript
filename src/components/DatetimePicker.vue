<template>
  <v-row>
    <v-col cols="12" sm="8">
      <v-menu
        ref="dateTimePicker"
        v-model="dateTimePicker"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="unset"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            :label="datelabel"
            :prepend-icon="dateicon"
            :readonly="disable"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title scrollable v-if="!disable">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dateTimePicker = false"
            >Cancel</v-btn
          >
          <v-btn text color="primary" @click="$refs.dateTimePicker.save(date)"
            >OK</v-btn
          >
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12" sm="4">
      <v-text-field
        :label="timelabel"
        name="time"
        :readonly="disable"
        type="time"
        v-model="time"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch, Prop } from "vue-property-decorator";
@Component
export default class DatetimePicker extends Vue {
  @Prop() readonly datetime!: string;
  @PropSync("return-value", { type: String }) returnValueSync!: string; // Return datime value
  @Prop({ default: "event" }) readonly dateicon!: string;
  @Prop({ default: "Ngày" }) readonly datelabel!: string;
  @Prop({ default: "Giờ" }) readonly timelabel!: string;
  @Prop(Boolean) readonly?: boolean;

  dateTimePicker = false;
  time = "";
  t = "T";
  date = "";
  disable = false;

  created() {
    console.log(this.readonly);
    if (this.readonly && typeof this.readonly != "undefined") {
      this.disable = this.readonly;
    }
  }

  get datetimeLocal() {
    return this.date + this.t + this.time;
  }

  @Watch("date")
  onDateChange(val: string, oldVal: string) {
    if (val !== oldVal) {
      this.returnValueSync = this.datetimeLocal;
    }
  }

  @Watch("time")
  onTimeChange(val: string, oldVal: string) {
    if (val !== oldVal) {
      this.returnValueSync = this.datetimeLocal;
    }
  }

  @Watch("datetime", { immediate: true })
  onDatetimeChange(val: string, oldVal: string) {
    if (val !== oldVal) {
      console.log(val);
      this.time = this.datetime.slice(11, 16);
      this.t = this.datetime.slice(10, 11);
      this.date = this.datetime.slice(0, 10);
    }
  }
}
</script>
