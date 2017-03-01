//gifuct
global.window = global;
!function e(r,t,a){function n(i,o){if(!t[i]){if(!r[i]){var p="function"==typeof require&&require;if(!o&&p)return p(i,!0);if(s)return s(i,!0);var l=new Error("Cannot find module '"+i+"'");throw l.code="MODULE_NOT_FOUND",l}var u=t[i]={exports:{}};r[i][0].call(u.exports,function(e){var t=r[i][1][e];return n(t?t:e)},u,u.exports,e,r,t,a)}return t[i].exports}for(var s="function"==typeof require&&require,i=0;i<a.length;i++)n(a[i]);return n}({1:[function(e,r,t){function a(e){this.data=e,this.pos=0}a.prototype.readByte=function(){return this.data[this.pos++]},a.prototype.peekByte=function(){return this.data[this.pos]},a.prototype.readBytes=function(e){for(var r=new Array(e),t=0;e>t;t++)r[t]=this.readByte();return r},a.prototype.peekBytes=function(e){for(var r=new Array(e),t=0;e>t;t++)r[t]=this.data[this.pos+t];return r},a.prototype.readString=function(e){for(var r="",t=0;e>t;t++)r+=String.fromCharCode(this.readByte());return r},a.prototype.readBitArray=function(){for(var e=[],r=this.readByte(),t=7;t>=0;t--)e.push(!!(r&1<<t));return e},a.prototype.readUnsigned=function(e){var r=this.readBytes(2);return e?(r[1]<<8)+r[0]:(r[0]<<8)+r[1]},r.exports=a},{}],2:[function(e,r,t){function a(e){this.stream=new s(e),this.output={}}function n(e){return e.reduce(function(e,r){return 2*e+r},0)}var s=e("./bytestream");a.prototype.parse=function(e){return this.parseParts(this.output,e),this.output},a.prototype.parseParts=function(e,r){for(var t=0;t<r.length;t++){var a=r[t];this.parsePart(e,a)}},a.prototype.parsePart=function(e,r){var t,a=r.label;if(!r.requires||r.requires(this.stream,this.output,e))if(r.loop){for(var n=[];r.loop(this.stream);){var s={};this.parseParts(s,r.parts),n.push(s)}e[a]=n}else r.parts?(t={},this.parseParts(t,r.parts),e[a]=t):r.parser?(t=r.parser(this.stream,this.output,e),r.skip||(e[a]=t)):r.bits&&(e[a]=this.parseBits(r.bits))},a.prototype.parseBits=function(e){var r={},t=this.stream.readBitArray();for(var a in e){var s=e[a];r[a]=s.length?n(t.slice(s.index,s.index+s.length)):t[s.index]}return r},r.exports=a},{"./bytestream":1}],3:[function(e,r,t){var a={readByte:function(){return function(e){return e.readByte()}},readBytes:function(e){return function(r){return r.readBytes(e)}},readString:function(e){return function(r){return r.readString(e)}},readUnsigned:function(e){return function(r){return r.readUnsigned(e)}},readArray:function(e,r){return function(t,a,n){for(var s=r(t,a,n),i=new Array(s),o=0;s>o;o++)i[o]=t.readBytes(e);return i}}};r.exports=a},{}],4:[function(e,r,t){var a=window.GIF||{};a=e("./gif"),window.GIF=a},{"./gif":5}],5:[function(e,r,t){function a(e){var r=new Uint8Array(e),t=new n(r);this.raw=t.parse(s),this.raw.hasImages=!1;for(var a=0;a<this.raw.frames.length;a++)if(this.raw.frames[a].image){this.raw.hasImages=!0;break}}var n=e("../bower_components/js-binary-schema-parser/src/dataparser"),s=e("./schema");a.prototype.decompressFrame=function(e,r){function t(e,r,t){var a,n,s,i,o,p,l,u,d,c,f,h,y,g,b,m,v=4096,x=-1,w=t,B=new Array(t),k=new Array(v),A=new Array(v),S=new Array(v+1);for(h=e,n=1<<h,o=n+1,a=n+2,l=x,i=h+1,s=(1<<i)-1,d=0;n>d;d++)k[d]=0,A[d]=d;for(f=u=count=y=g=m=b=0,c=0;w>c;){if(0===g){if(i>u){f+=r[b]<<u,u+=8,b++;continue}if(d=f&s,f>>=i,u-=i,d>a||d==o)break;if(d==n){i=h+1,s=(1<<i)-1,a=n+2,l=x;continue}if(l==x){S[g++]=A[d],l=d,y=d;continue}for(p=d,d==a&&(S[g++]=y,d=l);d>n;)S[g++]=A[d],d=k[d];y=255&A[d],S[g++]=y,v>a&&(k[a]=l,A[a]=y,a++,0===(a&s)&&v>a&&(i++,s+=a)),l=p}g--,B[m++]=S[g],c++}for(c=m;w>c;c++)B[c]=0;return B}function a(e,r){for(var t=new Array(e.length),a=e.length/r,n=function(a,n){var s=e.slice(n*r,(n+1)*r);t.splice.apply(t,[a*r,r].concat(s))},s=[0,4,2,1],i=[8,8,4,2],o=0,p=0;4>p;p++)for(var l=s[p];a>l;l+=i[p])n(l,o),o++;return t}function n(e){for(var r=e.pixels.length,t=new Uint8ClampedArray(4*r),a=0;r>a;a++){var n=4*a,s=e.pixels[a],i=e.colorTable[s];t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=s!==e.transparentIndex?255:0}return t}if(e>=this.raw.frames.length)return null;var s=this.raw.frames[e];if(s.image){var i=s.image.descriptor.width*s.image.descriptor.height,o=t(s.image.data.minCodeSize,s.image.data.blocks,i);s.image.descriptor.lct.interlaced&&(o=a(o,s.image.descriptor.width));var p={pixels:o,dims:{top:s.image.descriptor.top,left:s.image.descriptor.left,width:s.image.descriptor.width,height:s.image.descriptor.height}};return p.colorTable=s.image.descriptor.lct&&s.image.descriptor.lct.exists?s.image.lct:this.raw.gct,s.gce&&(p.delay=10*(s.gce.delay||10),p.disposalType=s.gce.extras.disposal,s.gce.extras.transparentColorGiven&&(p.transparentIndex=s.gce.transparentColorIndex)),r&&(p.patch=n(p)),p}return null},a.prototype.decompressFrames=function(e){for(var r=[],t=0;t<this.raw.frames.length;t++){var a=this.raw.frames[t];a.image&&r.push(this.decompressFrame(t,e))}return r},r.exports=a},{"../bower_components/js-binary-schema-parser/src/dataparser":2,"./schema":6}],6:[function(e,r,t){var a=e("../bower_components/js-binary-schema-parser/src/parsers"),n={label:"blocks",parser:function(e){for(var r=[],t=0,a=e.readByte();a!==t;a=e.readByte())r=r.concat(e.readBytes(a));return r}},s={label:"gce",requires:function(e){var r=e.peekBytes(2);return 33===r[0]&&249===r[1]},parts:[{label:"codes",parser:a.readBytes(2),skip:!0},{label:"byteSize",parser:a.readByte()},{label:"extras",bits:{future:{index:0,length:3},disposal:{index:3,length:3},userInput:{index:6},transparentColorGiven:{index:7}}},{label:"delay",parser:a.readUnsigned(!0)},{label:"transparentColorIndex",parser:a.readByte()},{label:"terminator",parser:a.readByte(),skip:!0}]},i={label:"image",requires:function(e){var r=e.peekByte();return 44===r},parts:[{label:"code",parser:a.readByte(),skip:!0},{label:"descriptor",parts:[{label:"left",parser:a.readUnsigned(!0)},{label:"top",parser:a.readUnsigned(!0)},{label:"width",parser:a.readUnsigned(!0)},{label:"height",parser:a.readUnsigned(!0)},{label:"lct",bits:{exists:{index:0},interlaced:{index:1},sort:{index:2},future:{index:3,length:2},size:{index:5,length:3}}}]},{label:"lct",requires:function(e,r,t){return t.descriptor.lct.exists},parser:a.readArray(3,function(e,r,t){return Math.pow(2,t.descriptor.lct.size+1)})},{label:"data",parts:[{label:"minCodeSize",parser:a.readByte()},n]}]},o={label:"text",requires:function(e){var r=e.peekBytes(2);return 33===r[0]&&1===r[1]},parts:[{label:"codes",parser:a.readBytes(2),skip:!0},{label:"blockSize",parser:a.readByte()},{label:"preData",parser:function(e,r,t){return e.readBytes(t.text.blockSize)}},n]},p={label:"application",requires:function(e,r,t){var a=e.peekBytes(2);return 33===a[0]&&255===a[1]},parts:[{label:"codes",parser:a.readBytes(2),skip:!0},{label:"blockSize",parser:a.readByte()},{label:"id",parser:function(e,r,t){return e.readString(t.blockSize)}},n]},l={label:"comment",requires:function(e,r,t){var a=e.peekBytes(2);return 33===a[0]&&254===a[1]},parts:[{label:"codes",parser:a.readBytes(2),skip:!0},n]},u={label:"frames",parts:[s,p,l,i,o],loop:function(e){var r=e.peekByte();return 33===r||44===r}},d=[{label:"header",parts:[{label:"signature",parser:a.readString(3)},{label:"version",parser:a.readString(3)}]},{label:"lsd",parts:[{label:"width",parser:a.readUnsigned(!0)},{label:"height",parser:a.readUnsigned(!0)},{label:"gct",bits:{exists:{index:0},resolution:{index:1,length:3},sort:{index:4},size:{index:5,length:3}}},{label:"backgroundColorIndex",parser:a.readByte()},{label:"pixelAspectRatio",parser:a.readByte()}]},{label:"gct",requires:function(e,r){return r.lsd.gct.exists},parser:a.readArray(3,function(e,r){return Math.pow(2,r.lsd.gct.size+1)})},u];r.exports=d},{"../bower_components/js-binary-schema-parser/src/parsers":3}]},{},[4]);

const _ = require('lodash');
const sendImageData = require('../send-data');
const config = require('../config');
const request = require('request').defaults({ encoding: null });
const uuid = require('node-uuid');
const Canvas = require('canvas'),
      ImageData = Canvas.ImageData;

var frames = [];
var resizeCanvas = new Canvas(config.matrix.width, config.matrix.height);
var canvas;
var ctx;

const resizeFrame = function (arr, index) {
    if (index === undefined) {
        index = 0;
    }

    // Put frame into full size canvas, draw to LED wall sized canvas and then get image data
    ctx.putImageData(new ImageData(frames[index].patch, frames[index].dims.width, frames[index].dims.height), frames[index].dims.left, frames[index].dims.top);
    resizeCanvas.getContext('2d').drawImage(canvas, 0, 0, config.matrix.width, config.matrix.height);
    var imageData = resizeCanvas.getContext('2d').getImageData(0, 0, config.matrix.width, config.matrix.height).data;

    // Only want RGB
    var temp = [];
    for (var i = 0; i < imageData.length; i += 4) {
      temp.push(imageData[i], imageData[i+1], imageData[i+2]);
    }
    arr.push(temp);

    if (index !== frames.length - 1) {
      // Resize next frame
      resizeFrame(arr, index + 1);
    }
}

var stop = '';

const sendData = function(guid, resizedFrames, delay, index = 0) {
  if (index >= resizedFrames.length) {
    index = 0;
  }
  sendImageData(guid, resizedFrames[index], delay, () => {
    if (stop == guid) {
      stop = '';
      return;
    }
    sendData(guid, resizedFrames, delay, index + 1);
  }, () => {
    stop = guid;
    return true;
  });
}

module.exports = function (url) {
    // Download a GIF
    request.get(url, function(error, response, body) {
      if (response.statusCode == 200) {
        // Decompress GIF into individual patch frames
        var gif = new GIF(new Buffer(body));
        frames = gif.decompressFrames(true);
        var delay = frames[0].delay;

        // Create canvas to render GIF into at full size
        canvas = new Canvas(frames[0].dims.width, frames[0].dims.height);
        ctx = canvas.getContext('2d');

        // Resize frames using canvas
        var resizedGIF = [];
        resizeFrame(resizedGIF);

        // Send resized frames recursively
        sendData(uuid.v1(), resizedGIF, delay);
      }
    });
};
