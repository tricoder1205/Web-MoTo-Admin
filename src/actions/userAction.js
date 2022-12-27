import Axios from "axios";
import { USER_DETAIL_FAIL, USER_DETAIL_REQUEST, USER_DETAIL_SUCCESS, USER_IMAGE_FAIL, USER_IMAGE_REQUEST, USER_IMAGE_SUCCESS, USER_LIST_FAIL, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNOUT, USER_UPDATE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS } from "constants/userConstants"

export const signin = (data) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
};

export const register = (name, email, password, image) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST, payload: { email, password } });
    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    fd.append('password', password);
    fd.append('image', image, image.name);
    try {
        const { data } = await Axios.post('/api/users/register', fd);
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        // dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
        // localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const detailsUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: USER_DETAIL_REQUEST, payload: userId });
    const { userSignin: { userInfo } } = getState();

    try {
        const { data } = await Axios.get(`/api/users/${userId}`, {
            headers: { Authorization: userInfo.token }
        })
        dispatch({ type: USER_DETAIL_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_DETAIL_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const updateUser = (user) => async (dispatch) => {
    dispatch({ type: USER_UPDATE_REQUEST, payload: user });
    try {
        const { data } = await Axios.put('/api/users/AdminUser', user);
        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }

}


export const updateUserImage = (user) => async (dispatch) => {
    dispatch({ type: USER_IMAGE_REQUEST, payload: user });

    const fd = new FormData();
    fd.append('userId', user.userId);
    fd.append('name', user.name);
    fd.append('email', user.email);
    fd.append('phone', user.phone);
    fd.append('image', user.image, user.image.name);



    try {
        const { data } = await Axios.put('/api/users/AdminUserImage', fd);
        dispatch({ type: USER_IMAGE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_IMAGE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}


export const signout = () => (dispatch) => {
    dispatch({ type: USER_SIGNOUT })
};



export const listUsers = () => async (dispatch) => {
    dispatch({
        type: USER_LIST_REQUEST
    });
    try {
        const { data } = await Axios.get('/api/users');
        dispatch({ type: USER_LIST_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: USER_LIST_FAIL, payload: error.message })
    }
}



export const deleteUser = (id) => async (dispatch) => {

    try {
        Axios.delete(`/api/users/deleteUser/${id}`);
    } catch (error) {
        console.log('Lỗi');
    }
}