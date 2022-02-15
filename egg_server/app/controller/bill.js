"use strict";

const Controller = require("egg").Controller;
const moment = require("moment");

const { tokenVerify } = require("../utils");

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    const {
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark = "",
    } = ctx.request.body;

    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: "参数错误",
        data: null,
      };
    }

    try {
      const decode = app.jwt.verify(
        ctx.request.header.authorization,
        app.config.jwt.secret
      );
      if (!decode) return;
      await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id: decode.id,
      });

      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      };
    }
  }

  async list() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 5, type_id = "all" } = ctx.query;

    try {
      const decode = app.jwt.verify(
        ctx.request.header.authorization,
        app.config.jwt.secret
      );
      if (!decode) return;
      const list = await ctx.service.bill.list(decode.id);
      const _list = list.filter((item) => {
        if (type_id !== "all") {
          return (
            moment(Number(item.date)).format("YYYY-MM") === date &&
            type_id == item.type_id
          );
        } else {
          return moment(Number(item.date)).format("YYYY-MM") === date;
        }
      });

      console.log(moment(Number(16449248810)).format("YYYY-MM"));

      console.log(_list);
      const listMap = _list
        .reduce((curr, item) => {
          const date = moment(Number(item.date)).format("YYYY-MM-DD");
          if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date == date) > -1
          ) {
            const index = curr.findIndex((item) => item.date == date);
            curr[index].bills.push(item);
          }
          if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date == date) == -1
          ) {
            curr.push({
              date,
              bills: [item],
            });
          }
          if (!curr.length) {
            curr.push({
              date,
              bills: [item],
            });
          }
          return curr;
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date));

      const filterListMap = listMap.slice(
        (page - 1) * page_size,
        page * page_size
      );

      const __list = list.filter(
        (item) => moment(Number(item.date)).format("YYYY-MM") == date
      );
      // 累加计算支出
      let totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      // 累加计算收入
      let totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      // 返回数据
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: {
          totalExpense, // 当月支出
          totalIncome, // 当月收入
          totalPage: Math.ceil(listMap.length / page_size), // 总分页
          list: filterListMap || [], // 格式化后，并且经过分页处理的数据
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      };
    }
  }

  async detail() {
    const { ctx, app } = this;
    const { id = "" } = ctx.query;

    const decode = app.jwt.verify(
      ctx.request.header.authorization,
      app.config.jwt.secret
    );

    if (!decode) return;
    if (!decode.id) {
      ctx.body = {
        code: 500,
        msg: "订单id不能为空",
        data: null,
      };
      return;
    }

    try {
      const detail = await ctx.service.bill.detail(id, decode.id);
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: detail,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      };
    }
  }

  async update() {
    const { ctx, app } = this;
    const {
      id,
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark = "",
    } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: "参数错误",
        data: null,
      };
    }

    try {
      const decode = tokenVerify(ctx, app);
      await ctx.service.bill.update({
        id, // 账单 id
        amount, // 金额
        type_id, // 消费类型 id
        type_name, // 消费类型名称
        date, // 日期
        pay_type, // 消费类型
        remark, // 备注
        user_id: decode.id, // 用户 id
      });
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      };
    }
  }

  async delete() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.body = {
        code: 400,
        msg: "参数错误",
        data: null,
      };
    }

    try {
      const decode = tokenVerify(ctx, app);
      if (!decode) return;
      await ctx.service.bill.delete(id, decode.id);
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      };
    }
  }

  async overview() {
    const { ctx, app } = this;
    const { date = "" } = ctx.query;

    try {
      const decode = tokenVerify(ctx, app);
      const result = await ctx.service.bill.list(decode.id);
      const start = moment(date).startOf("month").unix() * 1000; // 选择月份，月初时间
      const end = moment(date).endOf("month").unix() * 1000; // 选择月份，月末时间
      const _data = result.filter(
        (item) => Number(item.date) > start && Number(item.date) < end
      );

      // 总支出
      const total_expense = _data.reduce((arr, cur) => {
        if (cur.pay_type == 1) {
          arr += Number(cur.amount);
        }
        return arr;
      }, 0);

      // 总收入
      const total_income = _data.reduce((arr, cur) => {
        if (cur.pay_type == 2) {
          arr += Number(cur.amount);
        }
        return arr;
      }, 0);

      // 获取收支构成
      let total_data = _data.reduce((arr, cur) => {
        const index = arr.findIndex((item) => item.type_id == cur.type_id);
        if (index == -1) {
          arr.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            number: Number(cur.amount),
          });
        }
        if (index > -1) {
          arr[index].number += Number(cur.amount);
        }
        return arr;
      }, []);

      total_data = total_data.map((item) => {
        item.number = Number(Number(item.number).toFixed(2));
        return item;
      });

      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: {
          total_expense: Number(total_expense).toFixed(2),
          total_income: Number(total_income).toFixed(2),
          total_data: total_data || [],
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      };
    }
  }
}

module.exports = BillController;
