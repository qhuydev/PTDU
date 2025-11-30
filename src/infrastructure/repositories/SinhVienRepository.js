import axios from "axios";

const API = "http://localhost:3000/sinhvien";

export default class SinhVienRepository {
  async getAll(search = "") {
    const res = await axios.get(API, { params: { search } });
    return res.data;
  }

  async create(data) {
    const res = await axios.post(API, data);
    return res.data;
  }

  async update(id, data) {
    const res = await axios.put(`${API}/${id}`, data);
    return res.data;
  }

  async delete(id) {
    const res = await axios.delete(`${API}/${id}`);
    return res.data;
  }
}
