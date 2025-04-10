import { defineStore } from 'pinia';
import axios from 'axios';
import { isSameDay } from 'date-fns';
import { isSameMonth } from 'date-fns';

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
        .filter(
          (t) =>
            t.type === 'income' &&
            isSameMonth(new Date(t.date), state.selectedDate)
        )
        .reduce((sum, t) => sum + t.amount, 0);
    },
    getTotalExpense(state) {
      return state.transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            isSameMonth(new Date(t.date), state.selectedDate)
        )
        .reduce((sum, t) => sum + t.amount, 0);
    },
    getTotalAmount(state) {
      return this.getTotalIncome(state) - this.getTotalExpense(state);
    },
  },
  actions: {
    async addTransaction(transaction) {
      await this.addTransactions([transaction]);
    },
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
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('로그인된 사용자 없음');

        // ✅ 올바른 요청 방식 (query로 요청해야 함)
        const res = await fetch(`/api/users?id=${userId}`);
        const users = await res.json(); // ✅ fetch는 .json()으로 파싱

        if (!Array.isArray(users) || users.length === 0) {
          throw new Error('사용자를 찾을 수 없습니다');
        }

        const user = users[0];
        this.transactions = user.transactions || [];
      } catch (err) {
        console.log('거래 불러오기 실패:', err);
        this.transactions = [];
      }
    },

    async addTransactions(transactions) {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('userId 없음');

      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('사용자 요청 실패');
      const user = await res.json();

      let lastId =
        user.transactions.length > 0
          ? Math.max(...user.transactions.map((t) => t.transactionId))
          : 100;

      const newTransactionsWithId = transactions.map((t) => ({
        ...t,
        transactionId: ++lastId,
      }));

      const updatedTransactions = [
        ...user.transactions,
        ...newTransactionsWithId,
      ];

      const updateRes = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: updatedTransactions }),
      });

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        throw new Error(`저장 실패: ${errorText}`);
      }

      this.transactions.push(...newTransactionsWithId);
    },
    async updateTransaction(updatedTransaction) {
      try {
        const userId = localStorage.getItem('userId');
        const userRes = await fetch(`/api/users/${userId}`);
        const user = await userRes.json(); // ✅ 여기선 객체 하나

        const updatedTransactions = (user.transactions || []).map((t) =>
          t.transactionId === updatedTransaction.transactionId
            ? { ...t, ...updatedTransaction }
            : t
        );

        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...user,
            transactions: updatedTransactions,
          }),
        });

        this.transactions = updatedTransactions;
      } catch (err) {
        console.error('거래 수정 실패:', err);
        throw err;
      }
    },

    async deleteTransaction(transactionId) {
      try {
        const userId = localStorage.getItem('userId');

        // 🔥 user 하나만 가져오는 요청
        const userRes = await fetch(`/api/users/${userId}`);
        const user = await userRes.json(); // ✅ 배열 아님!

        const updatedTransactions = user.transactions.filter(
          (t) => t.transactionId !== transactionId
        );

        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...user,
            transactions: updatedTransactions,
          }),
        });

        this.transactions = updatedTransactions;
      } catch (err) {
        console.error('거래 삭제 실패:', err);
        throw err;
      }
    },
  },
});
