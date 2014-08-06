// JavaScript Document
var playerwidth; var playerheight;
if (typeof window.innerWidth != 'undefined') { playerwidth = window.innerWidth, playerheight = window.innerHeight }
else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0)
{ playerwidth = document.documentElement.clientWidth, playerheight = document.documentElement.clientHeight }
else { playerwidth = document.getElementsByTagName('body')[0].clientWidth, playerheight = document.getElementsByTagName('body')[0].clientHeight }
