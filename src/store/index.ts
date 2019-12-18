import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { ApiUrl } from "@/api/api-url";
import { TransactionView, Client, Transaction } from "@/models/transaction";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    clients: <Array<Client>>[],
    filterValue: <Number>new Date().getMonth()
  },

  getters: {
    transactionViews: function(state): TransactionView[] {
      const clients = state.clients;

      let transactionViews: TransactionView[] = [];

      clients.forEach(client => {
        // Convert Transaction[] to TransactionView[]
        const transactionViewsOfThisClient: TransactionView[] = client.transactions.map(
          transaction => {
            return { client: client.name, ...transaction };
          }
        );

        transactionViews = [
          ...transactionViews,
          ...transactionViewsOfThisClient
        ];
      });

      return transactionViews;
    },

    transactionViewsThisMonth: function(state, getters): TransactionView[] {
      return getters.transactionViews.filter(
        (transactionView: TransactionView) => {
          const date = new Date(transactionView.date);
          return date.getMonth() === state.filterValue;
        }
      );
    },

    transactionViewsThisYear: function(state, getters): TransactionView[] {
      return getters.transactionViews.filter(
        (transactionView: TransactionView) => {
          const date = new Date(transactionView.date);
          return date.getFullYear() === state.filterValue;
        }
      );
    }
  },

  mutations: {
    setClients(state, payload: Array<Client>) {
      state.clients = payload;
    },
    setFilterValue(state, payload: number) {
      state.filterValue = payload;
    }
  },

  actions: {
    async getClients({ commit }) {
      // const response = await axios.get(ApiUrl.GET_CLIENT);
      // commit("setClient", response.data());

      const client = [
        {
          name: "Nguyen Van A",
          created_at: "2019-09-13",
          transactions: [
            {
              id: 1,
              date: "2018-09-15",
              name: "Anh A mua 5kg cam",
              type: "VCB 0331003811273",
              amount: 100000
            },

            {
              id: 2,
              date: "2019-09-16",
              name: "Anh B mua 6kg cam",
              type: "VCB 0331003811273",
              amount: 100000
            },

            {
              id: 3,
              date: "2019-12-13",
              name: "Anh C mua 7kg cam",
              type: "Tien Mat",
              amount: 100000
            },

            {
              id: 4,
              date: "2019-09-17",
              name: "Anh D mua 8kg cam",
              type: "Tien Mat",
              amount: 100000
            }
          ]
        },

        {
          name: "Mike Miller",
          created_at: "2019-09-13",
          transactions: [
            {
              id: 1,
              date: "2019-09-25",
              name: "Vai lon Mike",
              type: "Tien Mat",
              amount: 100000
            },

            {
              id: 2,
              date: "2019-08-11",
              name: "I'm Mike",
              type: "Tien Mat",
              amount: 100000
            },

            {
              id: 3,
              date: "2019-12-13",
              name: "Mike Casillas",
              type: "VCB 0331003811273",
              amount: 100000
            },

            {
              id: 4,
              date: "2019-09-17",
              name: "Still Mike",
              type: "VCB 0331003811273",
              amount: 100000
            }
          ]
        }
      ];

      commit("setClients", client);
    }
  }
});
