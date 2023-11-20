<template>
<div class="datepicker" tabindex="0" @blur="initShowPopup(false)">
    <!--<input type="text" tabindex="0" class="form-control" @click="initShowPopup"/>-->
    <div class="datepicker__input" @click="initShowPopup">{{ selectedDate }}</div>
    <div v-if="!showPopup"
         class="datepicker__popup">
        <div class="datepicker__nationality" @click="handleNationality">
            {{ $t('Calendar') }}
            {{ direction === 'rtl' ? $t('Jalali') : $t('Gregorian') }}
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

export default {
    name: 'VDatepicker',

    props: {
        min: {
            type: Date,
            default: ''
        },
        max: {
            type: Date,
            default: ''
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
        let direction = ref('ltr');
        let weekdays = ref(WeekDays.gregorian);
        let min = ref(props.min);
        let max = ref(props.max);


        // دیتای لازم برای حلقه های ایجاد کننده سطر و ستون های تقویم رو آماده میکنه
        const calculateDate = function (direction, data = {}) {
            const type = direction;
            const gregorianSelectedDate = new Date(data.year, data.month, 0);
            const gregorianSelectedDateTimeStamp = +new Date(gregorianSelectedDate) / 1000; // per second
            const pasoonatedSelectedDate = Pasoonate.make(gregorianSelectedDateTimeStamp);
            const liveGregorian = Pasoonate.make().gregorian();
            const liveJalali = Pasoonate.make().jalali();

            // current(selected) date
            let monthNumber = month.value;
            let yearNumber = pasoonatedSelectedDate.gregorian().format('yyyy');
            let monthDays = +pasoonatedSelectedDate.gregorian().endOfMonth().format('d');

            // live date
            let liveMonth = liveGregorian.format('M');

            let firstDay = new Date(year.value, month.value - 1, 1);
            let firstDayName = firstDay.toString().split(' ')[0];
            let firstDayIndex = weekdays.value.indexOf(firstDayName);
            let totalDays = monthDays + firstDayIndex;
            let maxRows = Math.ceil(totalDays / weekdays.value.length);
            let date = new Date();
            let currentDay = date.getDate();
            currentDateHeader.value = `${new Date(year.value, month.value, 0).toLocaleString('default', {month: 'short'})}
            ${new Date(year.value, month.value, 0).toLocaleString('default', {year: 'numeric'})}`

            switch (type) {
                case 'rtl':
                    liveMonth = +liveJalali.format('M');
                    weekdays.value = WeekDays.jalali;
                    let _firstDayJalali = +moment(firstDay).format('jD');
                    let _firstDayofMonth = new Date(year.value, month.value - 1, 1 - _firstDayJalali + 1);
                    let _firstDayWeekdayJalali = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {weekday: 'short'}).format(_firstDayofMonth);
                    firstDayIndex = weekdays.value.indexOf(_firstDayWeekdayJalali);
                    totalDays = +pasoonatedSelectedDate.jalali().subMonth(1).endOfMonth().format('d') + firstDayIndex;
                    maxRows = Math.ceil(totalDays / weekdays.value.length);
                    currentDateHeader.value = `${new Intl.DateTimeFormat('fa-IR-u-nu-latn', {month: 'short'}).format(_firstDayofMonth)}
             ${pasoonatedSelectedDate.jalali().format('yyyy')}`;
                    currentDay = +Pasoonate.make().jalali().format('d');
                    monthNumber = +pasoonatedSelectedDate.jalali().format('M');
                    yearNumber = +pasoonatedSelectedDate.jalali().format('yyyy');
                    selectedDate.value = `${yearNumber}/${monthNumber}/${currentDay}`;
                    break;
                case 'ltr':
                    weekdays.value = WeekDays.gregorian;
                    firstDayIndex = weekdays.value.indexOf(firstDayName);
                    totalDays = monthDays + firstDayIndex;
                    selectedDate.value = `${yearNumber}/${monthNumber}/${currentDay}`;
                    break;
            }
            return {
                direction: type,
                maxRows: maxRows,
                weekdays: weekdays,
                firstDayIndex: firstDayIndex,
                totalDays: totalDays,
                currentDay: currentDay,
                liveMonth: liveMonth,
                monthNumber: monthNumber,
                yearNumber: yearNumber,
            };
        };

        // خروجی لازم برای سطرها و ستون های تقویم رو آماده میکنه(در قالب یک آرایه دو بعدی)
        const initDatepicker = function () {
            const data = calculateDate(direction.value, {year: year.value, month: month.value, day: 0});
            const _dayArr = [];
            let day = 1;
            for (let i = 1; i <= data.maxRows; i++) {
                _dayArr.push([]);
                for (let j = 1; j <= weekdays.value.length; j++) {
                    let _day = day - data.firstDayIndex;
                    if (day <= data.totalDays && day > data.firstDayIndex) {
                        _dayArr[i - 1].push({
                            id: _day,
                            text: _day.toString(),
                            active: (_day === data.currentDay && data.liveMonth === data.monthNumber),
                            sameDay: (_day === data.currentDay),
                            disable: handleDisableDay(data, _day),
                            month: data.monthNumber,
                            year: data.yearNumber,
                        });
                    }
                    if (day > data.totalDays || day <= data.firstDayIndex) {
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

        // برای هندل کردن روزای خارج از محدوده(فعلا برای جلالی کار نمیکنه)
        const handleDisableDay = function (data, _day) {
            let date = new Date(data.yearNumber, data.monthNumber - 1, _day);
            if (direction.value === 'rtl')
                date = Pasoonate.make(date);
            if (typeof min.value == "object" && (date <= min.value))
                return true;
            if (typeof max.value == "object" && date >= max.value)
                return true;
            return false;
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
            handleNationality,
            handleArrowMonth,
            handleSelectDay,
            initDatepicker,
            initShowPopup
        };
    }
}
</script>
