export const ITEMS_PER_PAGE = 30;
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
export function discountedPrice(item){
    return Math.round(item.price*(1-item.discountPercentage/100),2)
}
