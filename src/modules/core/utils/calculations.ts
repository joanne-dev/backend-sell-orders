import moment from 'moment';

export const addDays = (daysMore: number, currentDate: any): Date => {
    const momentDate = moment(currentDate,'YYYY-MM-DD').add(daysMore, 'day');
    return momentDate.toDate();
}

export const addHours = (hoursMore: number, currentDate: any): Date => {
    let momentDate = moment(currentDate);
    if(hoursMore > 0) {
        momentDate.add(hoursMore, 'hours');
    }
    return momentDate.toDate();
}

export const getHour = () =>{
    return new Date().getHours();
}
