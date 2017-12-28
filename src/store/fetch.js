// 引入 axios
const DOMAIN = "http://www.chuangshouji.com/";
const BASE = 'http://www.chuangshouji.com/cphone/';

function fetch(opt) {
  opt = Object.assign({
    method: 'get',
    type: 'json'
  }, opt)
  return new Promise((resolve, reject) => {
    var obj = new XMLHttpRequest(); // XMLHttpRequest对象用于在后台与服务器交换数据
    if (opt.url.indexOf('?') < 0) {
      opt.url += '?'
    }
    if (opt.data && opt.method.toLowerCase() == 'get') {
      for (var key in opt.data) {
        opt.url += '&' + key + '=' + opt.data[key]
      }
    }
    obj.open(opt.method, opt.url, true);
    if (opt.method.toLowerCase() == 'post') {
      obj.setRequestHeader('Content-Type', 'application/json');
    }

    obj.onreadystatechange = function() {
      if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState == 4说明请求已完成
        var resData = obj.responseText; //从服务器获得数据
        if (opt.type == 'json') {
          try {
            resolve(JSON.parse(resData));
          } catch (error) {
            reject(resData)
          }
        }
      }
    };

    if (opt.data && opt.method.toLowerCase() == 'post') {
      obj.send(JSON.stringify(opt.data))
    } else {
      obj.send();
    }
  })
}

export function login(number, password){
    return fetch({ url: BASE + `user/producer/login` ,data:{number, password}})
}

export function upload(number, lat, lng, serviceStatus){ //上门服务状态：0停止服务，1正常服务
    return fetch({ url: BASE + `user/producer/upload` ,data:{number, lat, lng, serviceStatus}})
}
export function getCustomer(customerId){
    return fetch({ url: BASE + `user/customerInfo/${customerId}`})
}
export function getStoreByProducerId(producerId){
    return fetch({ url: BASE + `storeinfo/getByProducerId/${producerId}`})
}
export function addStoreByProducerId(data){
    return fetch({ url: BASE + `storeinfo/addStore`, data});
}
export function updateByProducerId(data){
    return fetch({ url: BASE + `/storeinfo/updateByProducerId`, data, method:"post"});
}

export function getStoreInfo(storeId){
    return fetch({ url: BASE + `storeinfo/storeInfo/${storeId}`})
}
export function uploadFrequency(){
    return fetch({ url: BASE + `user/uploadFrequency`})
}

export function dispatchRaffle(data){
    return fetch({ url: DOMAIN + `CPhoneRaffle/raffle/dispatchRaffle`, data})
}
export function producerInfoByNumber(number){
    return fetch({ url: BASE + `user/producerInfoByNumber/${number}`})
}



//回收
export function getWaitingOrder(number){
  return fetch({ url: BASE + `recycle/order/orderListByProducer`,data:{number}})
}

export function recycleOrderById(serialNumber){
  return fetch({ url: BASE + `recycle/order/orderInfo/${serialNumber}`})
}

export function recyclePhoneInfo(recyclePhoneId){
  return fetch({ url: BASE + `recycle/recyclePhoneInfo/${recyclePhoneId}`})
}

export function updateOrder(data){
  return fetch({ url: BASE + `recycle/order/updateOrder`, data, method:'post'})
}

export function finishOrder(serialNumber){
  return fetch({ url: BASE + `recycle/order/finishOrder/${serialNumber}`})
}

export function turnOrder(data){
  return fetch({ url: BASE + `recycle/order/turnOrder`, data})
}


//维修
export function getRepairOrder(number){
  return fetch({ url: BASE + `maintain/order/orderListByProducer`,data:{number}})
}
export function repairOrderById(serialNumber){
  return fetch({ url: BASE + `maintain/order/orderInfo/${serialNumber}`})
}
export function repairPhoneInfo(maintainPhoneId){
  return fetch({ url: BASE + `maintain/maintainPhoneInfo/${maintainPhoneId}`})
}

export function updateRepairOrder(data){
  return fetch({ url: BASE + `maintain/order/updateOrder`, data, method:'post'})
}

export function finishRepairOrder(serialNumber){
  return fetch({ url: BASE + `maintain/order/finishOrder/${serialNumber}`})
}

export function turnRepairOrder(data){
  return fetch({ url: BASE + `maintain/order/turnOrder`, data})
}