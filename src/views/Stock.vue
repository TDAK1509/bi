<template>
  <div class="stock">
    <page-title>QUẢN LÝ KHO</page-title>

    <div class="stock__product-container">
      <div class="stock__save-button-container">
        <button class="stock__save-button" @click="updateStock">LƯU</button>
      </div>

      <b-table
        paginated
        per-page="10"
        default-sort="date"
        sort-icon="chevron-up"
        :data="sortedProductList"
      >
        >
        <template slot-scope="props">
          <b-table-column field="name" label="Tên Sản Phẩm" searchable sortable>
            {{ props.row.name }}
          </b-table-column>

          <b-table-column
            field="stock"
            label="Số Lượng Còn Lại"
            sortable
            numeric
          >
            <div class="stock__product-stock">
              <b-numberinput
                :value="props.row.stock"
                @input="onStockChange($event, props.row.name)"
                controls-position="compact"
                type="is-dark"
              />
            </div>
          </b-table-column>
        </template>
      </b-table>
    </div>

    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import PageTitle from "@/components/PageTitle.vue";
import ErrorHandling from "@/mixins/errorHandling";
import { Product } from "../models/helpers";
import * as _ from "lodash";

@Component({
  components: {
    PageTitle
  }
})
export default class Stock extends Mixins(ErrorHandling) {
  get isLoading(): boolean {
    return (
      this.$store.state.options.isFetchingOptions ||
      this.$store.state.options.isUpdatingOptions
    );
  }

  get sortedProductList(): Product[] {
    const productList = [...this.productList];
    return _.sortBy(productList, ["name"]);
  }

  get productList(): Product[] {
    return this.$store.state.options.editingProducts;
  }

  set productList(products: Product[]) {
    this.$store.commit("options/setEditingProducts", products);
  }

  onStockChange(stock: number, productName: string) {
    const products: Product[] = [...this.productList];

    for (let i = 0; i < products.length; i++) {
      if (products[i].name === productName) {
        products[i].stock = stock;
        break;
      }
    }

    this.productList = products;
  }

  async updateStock() {
    await this.$store.dispatch("options/updateStock", this.productList);
  }

  mounted() {
    if (!this.$store.state.options.isFetchedOptions) {
      this.$store.dispatch("options/fetchOptions");
    }
  }
}
</script>

<style lang="scss" scoped>
.stock__product-container {
  width: 550px;
  margin: auto;
}

.stock__product-stock {
  display: flex;
  justify-content: flex-end;
}

.stock__save-button-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.stock__save-button {
  border: 1px solid #000;
  background: #000;
  color: #fff;
  padding: 10px 30px;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #fff;
    color: #000;
  }
}
</style>
