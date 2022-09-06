import router from '@/app/router';
import { moment } from '@/main';

export const calendar = (date: Date) => {
    const nowDate = new Date()
    const Year = nowDate.getFullYear() === date.getFullYear()
    const Month = nowDate.getMonth() === date.getMonth()
    const Today = nowDate.getDate() === date.getDate()
    const Hour = nowDate.getHours() === date.getHours()
    const Minute = nowDate.getMinutes() === date.getMinutes()
    if ( Year && Month && Today && Hour && Minute) {
        return moment().fromNow()
    } else if(Year && Month && Today && Hour) {
        return moment().subtract(nowDate.getMinutes() - date.getMinutes(), 'minutes').calendar()
    } else if(Year && Month && Today) {
        return moment().subtract(nowDate.getHours() - date.getHours(), 'hours').subtract(nowDate.getMinutes() - date.getMinutes(), 'minutes').calendar()
    }else if(Year && Month){
        const days = nowDate.getDate() - date.getDate()
        const time =  moment().subtract(days, 'day').subtract(nowDate.getHours() - date.getHours(), 'hours').subtract(nowDate.getMinutes() - date.getMinutes(), 'minutes')
        return days > 6 ? time.format('YYYY-MM-DD HH:mm') : time.calendar()
    } else {
        
        return moment(date).format('YYYY-MM-DD HH:mm')
    }
}

export const momentFormat = (date: any, ft: string = 'YYYY-MM-DD HH:mm') => {
    return moment(date).format(ft)
}

export const routerCancel = () => {
    router.go(-1)
}