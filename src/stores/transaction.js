import { defineStore } from 'pinia';
import axios from 'axios';
import { isSameDay } from 'date-fns';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    selectedDate: new Date(),
  }),

  getters: {
    getTransactionsBySelectedDate(state) {
      return state.transactions.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.toDateString() === new Date(state.selectedDate).toDateString()
        );
      });
    },
    getTotalIncome(state) {
      return state.transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    },
    getTotalExpense(state) {
      return state.transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    },
  },
  actions: {
    loadTransactionsFromLocal() {
      const saved = localStorage.getItem('transactions');
      if (saved) {
        this.transactions = JSON.parse(saved);
      }
    },

    setSelectedDate(date) {
      this.selectedDate = date;
      localStorage.setItem('selectedDate', date.toString());
    },
    loadSelectedDate() {
      const savedDate = localStorage.getItem('selectedDate');
      if (savedDate) {
        this.selectedDate = new Date(savedDate);
      }
    },
    saveTransactionsToLocal() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions));
    },
    getTransactionsByDate(date) {
      return this.transactions.filter((t) =>
        isSameDay(new Date(t.date), new Date(date))
      );
    },
    async fetchTransactions() {
      try {
        // const userId = localStorage.getItem('userId');
        // if (!userId) throw new Error('로그인된 사용자 없음');

        // userId를 기반으로 해당 유저 조회
        // const res = await axios.get(`/api/users?userId=${userId}`);
        const res = await axios.get('/api/users/1');
        const user = res.data;

        this.transactions = user.transactions || [];

        // else {
        //   console.warn('해당 유저 없음');
        //   this.transactions = [];
        // }
      } catch (err) {
        console.error('거래 불러오기 실패:', err);
        this.transactions = [];
      }
    },
    async addTransaction(newTransaction) {
      //   const userId = localStorage.getItem('userId');
      //   const userRes = await fetch(`/api/users?userId=${userId}`);
      //   const users = await userRes.json();
      //   const user = users[0]; // 배열이라서

      const userRes = await axios.get('/api/users/1');
      const user = userRes.data;

      const lastId =
        user.transactions.length > 0
          ? Math.max(...user.transactions.map((t) => t.transactionId))
          : 100;
      newTransaction.transactionId = lastId + 1;

      const updatedTransactions = [...user.transactions, newTransaction];

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: updatedTransactions }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`저장 실패: ${errorText}`);
      }

      this.transactions.push(newTransaction);
    },
    async updateTransaction(updatedTransaction) {
      try {
        //   const userId = localStorage.getItem('userId');
        //   const userRes = await fetch(`/api/users?userId=${userId}`);
        //   const users = await userRes.json();
        //   const user = users[0]; // 배열이라서
        const userRes = await axios.get('/api/users/1');
        const user = userRes.data;

        // 기존 거래목록에서 해당 transactionId를 수정
        const updatedTransactions = user.transactions.map((t) =>
          t.transactionId === updatedTransaction.transactionId
            ? { ...t, ...updatedTransaction }
            : t
        );

        // PATCH 요청으로 수정된 거래목록을 서버에 반영
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactions: updatedTransactions }),
        });

        // 로컬 상태도 반영
        this.transactions = updatedTransactions;
      } catch (err) {
        console.error('거래 수정 실패:', err);
        throw err;
      }
    },
    async deleteTransaction(transactionId) {
      try {
        const userRes = await axios.get('/api/users/1');
        const user = userRes.data;

        const updatedTransactions = user.transactions.filter(
          (t) => t.transactionId !== transactionId
        );

        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactions: updatedTransactions }),
        });

        this.transactions = updatedTransactions;
      } catch (err) {
        console.error('거래 삭제 실패:', err);
        throw err;
      }
    },
  },
});
