import axiosInstance from "./axiosInstance";

// đăng kí

export const registerAPI = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error in registerAPI:", error);
    throw error;
  }
};


//đăng nhập

export const loginAPI = async (credentials) => {
  try {
    const response = await axiosInstance.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error in loginAPI:", error);
    throw error;
  }
};

// export const handleLogoutAPI = async () => {
//     // Xóa thông tin người dùng khỏi localStorage
//     localStorage.removeItem("userInfo");
  
//     // Gửi yêu cầu xóa cookie đăng nhập nếu sử dụng HTTP Only Cookie
//     return await axiosInstance.delete("/users/logout");
//   };
  
  /**
   * Gọi API để làm mới token
   * @param {string | null} refreshToken - Token để làm mới (nếu dùng localStorage)
   */
//   export const refreshTokenAPI = async (refreshToken) => {
//     return await axiosInstance.put("/users/refresh_token", { refreshToken });
//   };

/**
 * Lấy danh sách tất cả danh mục
 */
export const getAllCategoriesAPI = async () => {
    try {
      const response = await axiosInstance.get("/get-all");
      return response.data;
    } catch (error) {
      console.error("Error in getAllCategoriesAPI:", error);
      throw error;
    }
  };
  
  /**
   * Tạo danh mục mới
   * @param {Object} categoryData - Dữ liệu danh mục mới (VD: { name: "Đồ ăn" })
   */
  export const createCategoryAPI = async (categoryData) => {
    try {
      const response = await axiosInstance.post("/create", categoryData);
      return response.data;
    } catch (error) {
      console.error("Error in createCategoryAPI:", error);
      throw error;
    }
  };


  /**
 * Lấy danh sách tất cả todo
 */
export const getAllTodosAPI = async () => {
    try {
      const response = await axiosInstance.get("/get-all");
      return response.data;
    } catch (error) {
      console.error("Error in getAllTodosAPI:", error);
      throw error;
    }
  };
  
  /**
   * Lấy chi tiết một todo theo ID
   * @param {string} todoId - ID của todo
   */
  export const getTodoByIdAPI = async (todoId) => {
    try {
      const response = await axiosInstance.get(`/${todoId}`);
      return response.data;
    } catch (error) {
      console.error("Error in getTodoByIdAPI:", error);
      throw error;
    }
  };
  
  /**
   * Tạo mới một todo
   * @param {Object} todoData - Dữ liệu todo (VD: { title: "Làm bài tập", completed: false })
   */
  export const createTodoAPI = async (todoData) => {
    try {
      const response = await axiosInstance.post("/", todoData);
      return response.data;
    } catch (error) {
      console.error("Error in createTodoAPI:", error);
      throw error;
    }
  };
  
  /**
   * Cập nhật todo theo ID
   * @param {string} todoId - ID của todo cần cập nhật
   * @param {Object} todoData - Dữ liệu mới của todo
   */
  export const updateTodoAPI = async (todoId, todoData) => {
    try {
      const response = await axiosInstance.patch(`/update/${todoId}`, todoData);
      return response.data;
    } catch (error) {
      console.error("Error in updateTodoAPI:", error);
      throw error;
    }
  };
  
  /**
   * Xóa todo theo ID
   * @param {string} todoId - ID của todo cần xóa
   */
  export const deleteTodoAPI = async (todoId) => {
    try {
      const response = await axiosInstance.patch(`/delete/${todoId}`);
      return response.data;
    } catch (error) {
      console.error("Error in deleteTodoAPI:", error);
      throw error;
    }
  };