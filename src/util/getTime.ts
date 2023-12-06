// 计算时间差
export const getTime = (oldTime) => {
    if (!oldTime) {
        return '没多久'
    }
    let newTime = new Date().getTime()


    // 时间戳差
    let timeGap = +newTime - +oldTime
    timeGap = parseInt((timeGap / 1000))
    console.log(timeGap);

    if (timeGap < 300) {
        return '刚刚'
    } else if (timeGap > 300 && timeGap < 3600) {
        let min = Math.floor(timeGap / 60)
        return `${min}分钟前`
    } else if (timeGap > 3600 && timeGap < 86400) {
        let hours = Math.floor(timeGap / 3600)
        return `${hours}小时前`
    } else {
        let day = Math.floor(timeGap / 86400)
        return `${day}天前`
    }
}
