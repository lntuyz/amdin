// ===============================================
// src/api/shipperApi.js - THÊM PASSWORD
// ===============================================
import api from "./axiosConfig";

const BASE_PATH = "http://localhost:5001/api/admin/shipper_management";

// ✅ Mapping đúng với backend response
const mapShipperFromBackend = (shipper) => {
  return {
    shipper_id: shipper.shipper_id,
    name: shipper.shipper_name,
    email: shipper.email,
    phone: shipper.phone,
    status: shipper.status,
    branch_id: shipper.branch_id,
    rating: shipper.rating || 0,
    total_success: shipper.total_success || 0,
    salary: shipper.salary || 8000000,
  };
};

export const shipperApi = {
  /**
   * Lấy danh sách shipper theo branch
   */
  getAllShippers: async (branchId) => {
    try {
      const url = branchId
        ? `${BASE_PATH}/infomation?branch_id=${branchId}`
        : `${BASE_PATH}/infomation`;

      console.log("📡 Fetching shippers from:", url);

      const response = await api.get(url);

      console.log("📦 Backend response:", response.data);

      const mappedData = Array.isArray(response.data)
        ? response.data.map(mapShipperFromBackend)
        : [];

      console.log("✅ Mapped shippers:", mappedData);

      return {
        success: true,
        data: mappedData,
      };
    } catch (error) {
      console.error("❌ Error fetching shippers:", error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: [],
      };
    }
  },

  /**
   * ✅ Thêm shipper - CÓ PASSWORD
   */
  addShipper: async (shipperData) => {
    try {
      console.group("📤 ADD SHIPPER API CALL");
      console.log("1. shipperData nhận được:", shipperData);

      // ✅ VALIDATE branch_id
      let branchId;

      if (!shipperData.branch_id || shipperData.branch_id === "") {
        throw new Error("Branch ID bị thiếu trong shipperData");
      }

      branchId = parseInt(String(shipperData.branch_id).trim());

      if (isNaN(branchId) || branchId <= 0) {
        throw new Error(`Branch ID không hợp lệ: "${shipperData.branch_id}"`);
      }

      // ✅ VALIDATE password (BẮT BUỘC)
      if (!shipperData.password || shipperData.password.trim() === "") {
        throw new Error("Mật khẩu không được để trống");
      }

      const payload = {
        shipper_id: null,
        shipper_name: shipperData.shipper_name,
        email: shipperData.email,
        phone: shipperData.phone,
        password: shipperData.password, // ✅ THÊM PASSWORD
        status: shipperData.status || "Đang hoạt động",
        branch_id: branchId,
        salary: parseFloat(shipperData.salary) || 8000000,
      };

      // ✅ DOUBLE CHECK tất cả field
      if (!payload.shipper_name || payload.shipper_name.trim() === "") {
        throw new Error("Tên shipper không được để trống");
      }
      if (!payload.email || payload.email.trim() === "") {
        throw new Error("Email không được để trống");
      }
      if (!payload.phone || payload.phone.trim() === "") {
        throw new Error("Số điện thoại không được để trống");
      }
      if (!payload.password || payload.password.trim() === "") {
        throw new Error("Mật khẩu không được để trống");
      }
      if (!payload.branch_id || isNaN(payload.branch_id)) {
        throw new Error("Branch ID không hợp lệ");
      }

      console.log("📋 Final payload:", JSON.stringify(payload, null, 2));

      const response = await api.post(`${BASE_PATH}/add_shipper`, payload);

      console.log("✅ Add response:", response.data);
      console.groupEnd();

      return {
        success: true,
        message: response.data.message || "Thêm shipper thành công",
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Error adding shipper:", error);
      console.error("❌ Response:", error.response?.data);
      console.groupEnd();
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * ✅ Cập nhật shipper - KHÔNG CẦN PASSWORD
   */
  updateShipper: async (shipperId, shipperData) => {
    try {
      console.group("📤 UPDATE SHIPPER API CALL");
      console.log("1. shipperId:", shipperId);
      console.log("2. shipperData:", shipperData);

      // ✅ VALIDATE branch_id
      if (!shipperData.branch_id) {
        throw new Error("Branch ID bị thiếu trong shipperData");
      }

      const branchId = parseInt(shipperData.branch_id);

      if (isNaN(branchId)) {
        throw new Error(`Branch ID không hợp lệ: ${shipperData.branch_id}`);
      }

      // ✅ UPDATE KHÔNG CẦN PASSWORD
      const payload = {
        shipper_name: shipperData.shipper_name,
        email: shipperData.email,
        phone: shipperData.phone,
        status: shipperData.status,
        branch_id: branchId,
        salary: parseFloat(shipperData.salary) || 8000000,
      };

      console.log("✅ Payload chuẩn bị gửi:", payload);

      const response = await api.put(
        `${BASE_PATH}/update_shipper/${shipperId}`,
        payload
      );

      console.log("✅ Update response:", response.data);
      console.groupEnd();

      return {
        success: true,
        message: response.data.message || "Cập nhật shipper thành công",
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Error updating shipper:", error);
      console.error("❌ Response:", error.response?.data);
      console.groupEnd();
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    }
  },

  deleteShipper: async (shipperId) => {
    try {
      console.log("🗑️ Deleting shipper:", shipperId);

      const response = await api.delete(
        `${BASE_PATH}/delete_shipper/${shipperId}`
      );

      return {
        success: true,
        message: response.data.message || "Xóa shipper thành công",
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Error deleting shipper:", error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    }
  },
};

export default shipperApi;
