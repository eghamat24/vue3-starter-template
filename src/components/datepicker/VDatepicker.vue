<template>
<div class="datepicker" tabindex="0" @blur="initShowPopup(false)">
    <!--<input type="text" tabindex="0" class="form-control" @click="initShowPopup"/>-->
    <div class="datepicker__input" @click="initShowPopup">{{ selectedDate }}</div>
    <div v-if="!showPopup"
         class="datepicker__popup">
        <div class="datepicker__nationality" @click="handleNationality">
            تقویم
            {{ direction === 'rtl' ? 'میلادی ' : 'شمسی' }}
        </div>
        <div class="header">
            <div class="header__arrow" @click="handleArrowMonth(e,'next')"> &lt;</div>
            <div class="header__month">{{ currentDateHeader }}</div>
            <div class="header__arrow" @click="handleArrowMonth(e,'pre')">></div>
        </div>
        <div class="content" :style="{direction:direction}">
            <div class="content__header">
                <div class="box" v-for="(weekday,index) in weekdays" :key="index">{{ weekday }}</div>
            </div>
            <div class="days">
                <div v-for="(row,index) in dayArr" :key="index" class="days__row">
                    <div v-for="(cel, id) in row"
                         @click="handleSelectDay(cel)"
                         :key="id"
                         class="box"
                         :class="{ ' box--active': cel.active, ' box--disable': cel.disable,' box--same': cel.sameDay }">
                        {{ cel.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>

import {ref} from "vue";
import moment from "moment-jalaali";
import WeekDays from "@/enums/WeekDays";
import Pasoonate from "pasoonate/dist/Pasoonate";
import pasoonate from "pasoonate/dist/Pasoonate";

export default {
    name: 'VDatepicker',

    props: {
        min: {
            type: Date,
            default: new Date(2023, 11, 10)
        },
        max: {
            type: Date,
            default: new Date(2023, 11, 20)
        },
        year: {
            type: Number,
            default: new Date().getFullYear(),
            required: true
        },
        month: {
            type: Number,
            default: new Date().getMonth() + 1,
            required: true
        }
    },

    emits: [],

    mounted() {
        this.initDatepicker();
    },
    setup(props, {emit}) {
        let dayArr = ref([]);
        let currentDateHeader = ref('0');
        let month = ref(props.month);
        let year = ref(props.year);
        let showPopup = ref(false);
        let selectedDate = ref(new Date().toLocaleString('en-us', {year: "numeric", month: "numeric", day: "numeric"}));
        let min = ref(props.min);
        let max = ref(props.max);
        let direction = ref('rtl');
        let weekdays = ref(WeekDays.gregorian);


        // خروجی لازم برای سطرها و ستون های تقویم رو آماده میکنه(در قالب یک آرایه دو بعدی)
        const initDatepicker = function () {
            const _date = new Date(year.value, month.value, 0);
            const _dayArr = [];
            const timeStampOfDate = +new Date(_date) / 1000;
            const _pasoonate = Pasoonate.make(timeStampOfDate);
            let WEEK_DAYS = weekdays.value;
            let currentMonth = pasoonate.make().gregorian().format('M');
            let monthNumber = month.value;
            let yearNumber = _date.getFullYear();
            let monthDays = _date.getDate();
            let _tempMonth = month.value - 1;
            let firstDay = new Date(year.value, _tempMonth, 1);
            let firstDayName = firstDay.toString().split(' ')[0];
            let firstDayIndex = WEEK_DAYS.indexOf(firstDayName);
            let totalDays = monthDays + firstDayIndex;
            let maxRows = Math.ceil(totalDays / WEEK_DAYS.length);
            let date = new Date();
            let currentDay = date.getDate();
            let day = 1;
            currentDateHeader.value = `${new Date(year.value, month.value, 0).toLocaleString('default', {month: 'short'})}
            ${new Date(year.value, month.value, 0).toLocaleString('default', {year: 'numeric'})}`


            if (direction.value === 'ltr') {
                WEEK_DAYS = WeekDays.gregorian;
                weekdays.value = WeekDays.gregorian;
            } else if (direction.value === 'rtl') {
                WEEK_DAYS = WeekDays.jalali;
                currentMonth = pasoonate.make().jalali().format('M');
                weekdays.value = WeekDays.jalali;
                let _firstDayJalali = +moment(firstDay).format('jD');
                let _firstDayofMonth = new Date(year.value, _tempMonth, 1 - _firstDayJalali + 1);
                let _firstDayWeekdayJalali = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {weekday: 'short'}).format(_firstDayofMonth);
                firstDayIndex = WEEK_DAYS.indexOf(_firstDayWeekdayJalali);
                totalDays = +_pasoonate.jalali().subMonth(1).endOfMonth().format('d') + firstDayIndex;
                maxRows = Math.ceil(totalDays / WEEK_DAYS.length);
                currentDateHeader.value = `${new Intl.DateTimeFormat('fa-IR-u-nu-latn', {month: 'short'}).format(_firstDayofMonth)}
             ${_pasoonate.jalali().format('yyyy')}`;
                currentDay = +pasoonate.make().jalali().format('d');
                monthNumber = +_pasoonate.jalali().format('M');
                yearNumber = +_pasoonate.jalali().format('yyyy')
            }


            for (let i = 1; i <= maxRows; i++) {
                _dayArr.push([]);
                for (let j = 1; j <= WEEK_DAYS.length; j++) {
                    let _day = day - firstDayIndex;
                    if (day <= totalDays && day > firstDayIndex) {
                        _dayArr[i - 1].push({
                            id: _day,
                            text: _day.toString(),
                            active: (_day == currentDay && currentMonth == monthNumber),
                            sameDay: (_day == currentDay),
                            // disable: !(new Date(yearNumber, monthNumber, _day) >= min.value && new Date(yearNumber, monthNumber, _day) <= max.value),
                            disable: false,
                            month: monthNumber,
                            year: yearNumber,
                        });
                    }
                    if (day > totalDays || day <= firstDayIndex) {
                        _dayArr[i - 1].push({
                            id: null,
                            text: '',
                            disable: false
                        });
                    }
                    day++;
                }
            }
            dayArr.value = _dayArr;
        };

        // ایونت های ماه قبل و ماه بعد رو هندل میکنه
        const handleArrowMonth = function (e, type) {
            switch (type) {
                case 'next':
                    month.value++;
                    break;
                case 'pre':
                    month.value--;
                    break
            }
            initDatepicker()
        }

        // ایونت نمایش پاپ آپ تقویم رو هندل میکنه
        const initShowPopup = function (state = true) {
            showPopup.value = state;
        }

        // ایونت انتخاب تاریخ رو هندل میکنه
        const handleSelectDay = function (cel = null) {
            if (!cel.disable && cel.id) {
                showPopup.value = false;
                selectedDate.value = `${cel?.month}/${cel?.text}/${cel?.year}`;
                emit('selectDate', selectedDate.value);
            }
        }

        // ایونت تبدیل تاریخ رو هندل میکنه
        const handleNationality = function () {
            direction.value = (direction.value === 'rtl') ? 'ltr' : 'rtl';
            initDatepicker();
        }

        return {
            currentDateHeader,
            selectedDate,
            showPopup,
            dayArr,
            weekdays,
            direction,
            // month,
            // year,
            // min,
            // max,
            handleNationality,
            handleArrowMonth,
            handleSelectDay,
            initDatepicker,
            initShowPopup
        };
    }
}
</script>
