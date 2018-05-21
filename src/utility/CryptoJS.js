import CryptoJS from 'crypto-js';

export function CryptoMd5(value){
    return CryptoJS.MD5(value).toString();
}