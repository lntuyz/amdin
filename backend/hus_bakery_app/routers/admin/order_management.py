from flask import Blueprint, jsonify, request
import json
from flask_jwt_extended import jwt_required, get_jwt_identity
from hus_bakery_app.services.admin.order_management_services import (
    order_detail, delete_order,
    get_all_orders_service
)

order_admin_bp = Blueprint('order_management', __name__)

@order_admin_bp.route("/order_detail", methods=['GET'])
@jwt_required()
def order_management():
    identity = json.loads(get_jwt_identity())
    if identity.get("role") != 'employee':
        return jsonify({"error": "Bạn không có quyền xem chi tiết đơn hàng"}), 403

    order_id = request.args.get('order_id')

    if not order_id:
        return jsonify({"error": "Vui lòng cung cấp order_id"}), 400

    order_items = order_detail(order_id)

    if not order_items:
        return jsonify({"message": "Đơn hàng trống hoặc không tồn tại"}), 404

    return jsonify(order_items), 200

@order_admin_bp.route("/delete_order/<int:order_id>", methods=['DELETE'])
@jwt_required()
def delete_order_api(order_id):
    try:
        identity = json.loads(get_jwt_identity())
        
        # Kiểm tra quyền
        if identity.get("role") != 'employee':
            return jsonify({
                "success": False,
                "error": "Bạn không có quyền xóa đơn hàng"
            }), 403

        # Gọi hàm delete
        success = delete_order(order_id)
        
        # ✅ LOGIC ĐÚNG
        if success:  # Nếu THÀNH CÔNG
            return jsonify({
                "success": True,
                "message": "Xóa đơn hàng thành công"
            }), 200
        else:  # Nếu THẤT BẠI
            return jsonify({
                "success": False,
                "error": "Không tìm thấy đơn hàng"
            }), 404
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@order_admin_bp.route("/orders", methods=['GET'])
@jwt_required()
def get_orders():
    identity = json.loads(get_jwt_identity())
    if identity.get("role") != 'employee':
        return jsonify({"error": "Bạn không có quyền truy cập danh sách đơn hàng"}), 403

    branch_id = request.args.get('branch_id')

    if not branch_id:
        return jsonify({"success": False, "message": "Thiếu branch_id"}), 400

    try:
        raw_orders = get_all_orders_service(branch_id)
        return jsonify({
            "success": True,
            "branch_id": branch_id,
            "count": len(raw_orders),
            "data": raw_orders
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500