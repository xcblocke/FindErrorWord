// 秒数转换
export function formatSeconds(seconds: number|string, dateFormat = 'h:i:s'): string {
    seconds = Number(seconds)
    let obj: any = {}
    obj.h = Number.parseInt(String(seconds / 3600));
    obj.i = Number.parseInt(String((seconds - obj.h * 3600) / 60));
    obj.s = Number.parseInt(String(seconds - obj.h * 3600 - obj.i * 60));
    if (obj.h < 10) obj.h = '0' + obj.h;
    if (obj.i < 10) obj.i = '0' + obj.i;
    if (obj.s < 10) obj.s = '0' + obj.s;
    // 3.解析
    var rs = dateFormat.replace('h', obj.h).replace('i', obj.i).replace('s', obj.s);
    return rs;
}


// 把节点1转节点2坐标
export function toXY(node1: cc.Node, node2: cc.Node){
    const wpos = node1.convertToWorldSpaceAR(cc.v2(0, 0))
    const pos = node2.convertToNodeSpaceAR(wpos)
    return pos
}

// 判断是否存在中文
export function isChinese(str: string) {
	const filter = /[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/;
	return filter.test(str)
}

// 数组打乱
export function shuffle(arr: any[]){
    let length: number = arr.length,
        randomIndex: number,
        temp: any;
    while (length) {
        randomIndex = Math.floor(Math.random() * (length--));
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp
    }
    return arr
}