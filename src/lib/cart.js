import axios from "./axios";

const CART_SESSION_STORAGE_KEY = "printera_cart_session";

export function getCartSessionId() {
    if (typeof window === "undefined") {
        return "";
    }

    let sessionId = localStorage.getItem(CART_SESSION_STORAGE_KEY);
    if (!sessionId) {
        sessionId = window.crypto?.randomUUID?.() || `cart_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(CART_SESSION_STORAGE_KEY, sessionId);
    }

    return sessionId;
}

export function getCartHeaders() {
    const sessionId = getCartSessionId();
    return sessionId ? { "X-Cart-Session": sessionId } : {};
}

export function dispatchCartUpdated(cart) {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(new CustomEvent("cart-updated", { detail: cart }));
}

export async function fetchCart(deliveryMethod = "shipping") {
    const response = await axios.get(`/cart/?delivery_method=${deliveryMethod}`, {
        headers: getCartHeaders(),
    });
    return response.data;
}

export async function addCartItem(payload) {
    const response = await axios.post("/cart/items/", payload, {
        headers: getCartHeaders(),
    });
    dispatchCartUpdated(response.data);
    return response.data;
}

export async function updateCartItem(itemId, payload, deliveryMethod = "shipping") {
    const response = await axios.patch(`/cart/items/${itemId}/?delivery_method=${deliveryMethod}`, payload, {
        headers: getCartHeaders(),
    });
    dispatchCartUpdated(response.data);
    return response.data;
}

export async function removeCartItem(itemId, deliveryMethod = "shipping") {
    const response = await axios.delete(`/cart/items/${itemId}/?delivery_method=${deliveryMethod}`, {
        headers: getCartHeaders(),
    });
    dispatchCartUpdated(response.data);
    return response.data;
}

export async function clearCart(deliveryMethod = "shipping") {
    const response = await axios.delete(`/cart/clear/?delivery_method=${deliveryMethod}`, {
        headers: getCartHeaders(),
    });
    dispatchCartUpdated(response.data);
    return response.data;
}