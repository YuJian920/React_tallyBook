const MODE = import.meta.env.MODE;

const baseURL = MODE == "development" ? "/api" : "http://api.chennick.wang";
const Token = localStorage.getItem("token");

export default { baseURL, Token };
