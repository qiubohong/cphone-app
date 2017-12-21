export function notisfy(array){
	if(typeof cordova == 'undefined'){
		return;
	}
	cordova.plugins.notification.local.schedule(array);
}

export function getUUID(){
	let id = 0;
	return function(){
		return ++id;
	}
}