import SinhVienRepository from "../infrastructure/repositories/SinhVienRepository";
import SinhVien from "../domain/models/SinhVien";

export default class SinhVienService {
  constructor() {
    this.repo = new SinhVienRepository();
  }

  async getSinhVien(search = "") {
    const data = await this.repo.getAll(search);
    return data.map((item) => new SinhVien(item));
  }

  async addSinhVien(payload) {
    return await this.repo.create(payload);
  }

  async updateSinhVien(id, payload) {
    return await this.repo.update(id, payload);
  }

  async deleteSinhVien(id) {
    return await this.repo.delete(id);
  }
}
