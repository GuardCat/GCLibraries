/*jshint esversion: 9, browser: true*/
"use strict";


/**
 * encodeText — функция, кодирующая текст по алгоритму GC2-TXT-1.0
 *              удобна для использования совместно с git.
 * @param  {string} text Текст для шифрования
 * @param  {type} source_key  ключ для шифрования
 * @requires function rnd
 * @return {string} зашифрованный текст
 */
function encodeText(text, source_key) {
    const
        symbols =   "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя" +
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy" +
                    ` -–—?!.,:;'"«»{}[]#$%^&*-+=-_№~\\|/<>` +
                    "`",
        key = source_key.split("").map( k => k.charCodeAt( ) ).join("")
    ;

}


function rnd(min, max) {
    return +( Math.random() * (max - min) + min ).toFixed(0);
}
