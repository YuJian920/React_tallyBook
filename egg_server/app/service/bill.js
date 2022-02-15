"use strtic";

const Service = require("egg").Service;

class BillService extends Service {
  async add(params) {
    const { app } = this;
    try {
      return await app.mysql.insert("bill", params);
    } catch (error) {
      return null;
    }
  }

  async list(id) {
    const { app } = this;
    const QUERY_STR = "id, pay_type, amount, date, type_id, type_name, remark";
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;

    try {
      return await app.mysql.query(sql);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async detail(id, user_id) {
    const { app } = this;
    try {
      const result = app.mysql.get("bill", { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(params) {
    const { app } = this;
    try {
      return await app.mysql.update("bill", params, {
        id: params.id,
        user_id: params.user_id,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(id, user_id) {
    const { app } = this;
    try {
      let result = await app.mysql.delete("bill", {
        id: id,
        user_id: user_id,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;
